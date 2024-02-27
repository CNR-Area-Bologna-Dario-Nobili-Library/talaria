<?php namespace App\Traits\Http\Auth;

use App\Models\Users\AbilitiesTransformer;
use App\Models\Users\AllPermissionsAndRolesTransformer;
use App\Models\Users\TemporaryAbility;
use Illuminate\Http\Request;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Auth;
//use Dingo\Api\Http\Request;
use App\Models\Users\UserTransformer;
use App\Models\Users\User;
//use Event;
use Gate;
use League\OAuth2\Server\AuthorizationServer;
use App\Traits\Http\Auth\OauthCustomProviderTrait;

//use Authorizer;

trait AuthControllerTrait
{
    use OauthCustomProviderTrait;

	/**
	 * Handle a registration request for the application.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function postRegister(Request $request, AuthorizationServer $authorizationServer)
	{
		$this->validate($request, [
		    'email' => 'required|email',
		    'password' => 'required',
		    'password_confirmation' => 'required',
		    'name' => 'required',
		    'surname' => 'required',
		    'username' => 'required',
//			'g-recaptcha-response' => 'required|recaptcha'
		]);

		$controller = \App::make('App\Http\Controllers\Users\UserController');
		$controller->talaria->disableAuthorize();
		$response = $controller->store($request);
		$controller->talaria->enableAuthorize();
		$content = $response->getOriginalContent();
		event('auth.registered', $content);
//		/*
//		 * return an access_token
//		 */
//        $proxy = \Request::create(
//            'oauth/token',
//            'POST'
//        );
//        return \Route::dispatch($proxy);
        /*
         * return an access_token
         */
        $oauth = $this->getOauthToken($authorizationServer, $content->id);
        return $oauth;
	}

    /*
     * Logout User / Revoke token with Laravel Passport
     */
	public function logout(Request $request)
	{
        $user = Auth::user();
        event('auth.logout', $user);
	    if($user && $user->token())
        {
            $user->token()->revoke();
            event('auth.logout', $user);
            Auth::logout();
        }
        return $this->response->array([]);
	}

	/**
	 * Handle a permission request.
	 *
	 * @param  \Illuminate\Http\Request  $request 
	 * @return \Illuminate\Http\Response
	 */	     
     //OLD
     /*public function permissions(Request $request) 
	{
		if (Auth::check()) {
			$user = Auth::user();
            $resources = $user->permissions()
                ->select('abilities.entity_id','abilities.entity_type','abilities.name')
                ->whereNotNull('abilities.entity_id')
                ->distinct()
                ->get()
                ->map(function ($item) {
                    $entity = $item->entity_type::select('name')->find($item->entity_id);
                    if($entity) {
                        $item->resource = $entity->getTable();
                        $item->entity_name = $entity ? $entity->name : '';
                    }
                    return $item;
                })
                ->filter(function ($item) {
                    return $item->entity_name;
                })
                ->groupBy(['resource','entity_id']);
                              
//            return $this->response->collection($resources, new PermissionTransformer);
            $resources_array = [];
            foreach ($resources as $class=>$items) {
                $resources_array[$class] = [];
                foreach ($items as $id=>$perms) {
                    $resources_array[$class][] = [
                        'resource' => [
                            'id' => $id,
                            'name' => $perms[0]['entity_name']
                        ],
                        'permissions' => \Arr::pluck($perms, 'name')
                    ];
                }
            }
            $token_perms = [
                "roles" => $user->roles->pluck('name'),
//                "permissions" => $user->abilities,
                "resources" => $resources_array,                
            ];
//			$token_perms = base64_encode((string)json_encode($token_perms));
			return $this->response->array($token_perms);            
		}
		return $this->response->errorUnauthorized(trans('apitalaria::auth.unauthorized'));
	}*/

    //Get all user's permissions
    public function permissions(Request $request) {
        if (Auth::check()) {
            $user = Auth::user();		
		    return $this->response->item($user, new AllPermissionsAndRolesTransformer())->morph();        
        }
    }

	public function resources(Request $request)
    {
        if (Auth::check()) {
            $user = Auth::user();
            /*$resources = $user->abilities()
                ->select('abilities.entity_id','abilities.entity_type','abilities.name')
                ->distinct()
                ->get()
                ->map(function ($item) {
                    $entity = $item->entity_type::select('name')->where('id', $item->entity_id)->first();
                    $item->entity_name = $entity ? $entity->name : '';
                    unset($item->pivot);
                    return $item;
                })
                ->groupBy(['entity_type', 'entity_id']);
            return $this->response->array($resources);*/

            return $this->response->item($user, new AbilitiesTransformer())->morph();
        }
    }
    
    //used by user to Accept/Reject temporary permissions
    public function updateMyResourcesStatus(Request $request, $resourceId){
        
        if (Auth::check()) {
            $user = Auth::user();
            
            $tempPerm=TemporaryAbility::findOrFail($resourceId); 

            

            $newstatus = intval($request->input(['status'])); //accept only status                
            $userToApply=null;
            
            //apply new status (accept/reject to the pending permission)
            //if new status==1 (accept) => apply ability to user
            //if new status==2 (reject) => simply change new status and return                
            if( isset($newstatus) && isset($tempPerm->entity_id) && isset($tempPerm->entity_type) && isset($tempPerm->abilities))  
            {
                    $className=$tempPerm->entity_type;
                    $entity=$className::findOrFail($tempPerm->entity_id);  //NOTE: entity_type is like  'App\\Models\\Libraries\\Library' .....

                    //Extract user from temporary perm mathing email/user_id stored in the TempAbility (in order to apply perm to it)
                    if(isset($tempPerm->user_id))
                        $userToApply=User::findOrFail($tempPerm->user_id);
                    else if(isset($tempPerm->user_email))
                        $userToApply=User::firstOrFail()->where('email','=',$tempPerm->user_email)->first();

                    $this->authorize($tempPerm);    //will call TemporaryAbilityPolicy->updateMyResourcesStatus() in order to check if authorized user can apply temppermission
                   
                    //enable
                    if($newstatus==config("constants.temporary_ability_status.accepted") &&  $userToApply && $user && $entity && isset($tempPerm->abilities))
                    {
                        $abils=explode(',',$tempPerm->abilities);                        
                        
                        foreach($abils as $abil)
                            $userToApply->allow($abil,$entity);
                        
                        //remove from DB (we've to use forceDeleting cause by default softdelete is enabled to all models)
                        $tempPerm->forceDelete();

                    }
                    else if ($newstatus==config("constants.temporary_ability_status.waiting")|| $newstatus==config("constants.temporary_ability_status.rejected"))
                    {
                        //status update (in case of rejected/waiting)
                        $tempPerm->fill(["status"=>$newstatus]);
                        $tempPerm->save();
                    }
                    
                    return $tempPerm;               

            }                            
                                                             
        }
        return false;
    }

//	private function permissionResources(User $user) {
//        $reso
//    }

	/**
	 * Show user info retrived by token.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function me(Request $request)
	{
		$user = Auth::user();
		event('auth.me', $request);
		return $this->response->item($user, new UserTransformer())->morph();
	}

	/**
	 * Show user info retrived by token.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function updateMe(Request $request)
	{
		$user = Auth::user();
		$controller = \App::make('App\Http\Controllers\Users\UserController');
		$controller->talaria->disableAuthorize();
		$update = $controller->update($request, $user->id);
		$controller->talaria->enableAuthorize();
		event('auth.update', $update->getOriginalContent());
		return $update;
	}

	/**
	 * Log the user out of the application.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function getLogout()
	{
	    return $this->logout();
	}

	/*
	 * Destroy Logged in User
	 */
	public function deleteMe(Request $request)
	{
		$user = Auth::user();
        $controller = \App::make('App\Http\Controllers\UserController');
        $controller->talaria->disableAuthorize();
        $delete = $controller->delete($request, $user->id);
        $controller->talaria->enableAuthorize();
		event('auth.delete', $delete->getOriginalContent());
		return $delete;
	}


    /**
     * Permit to SuperAdmin to issue a Password Grant for a user.
     * needs client_id & client_secret
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
	public function loginAs( Request $request, AuthorizationServer $authorizationServer, $id)
    {

        $user = Auth::user();
        if(\Gate::allows('loginAs', $user->getModel()))
        {
            $request = (new \Zend\Diactoros\ServerRequest)->withParsedBody([
                'grant_type' => 'talaria-password',
                'client_id' => $request->input("client_id"),
                'client_secret' => $request->input("client_secret"),
                'user_id' => $id,
                'scope' => '*',
            ]);

            $grant = new \App\Traits\Http\Auth\TalariaPasswordGrant(
                app(\Laravel\Passport\Bridge\UserRepository::class),
                app(\Laravel\Passport\Bridge\RefreshTokenRepository::class)
            );

            $grant->setRefreshTokenTTL(\Laravel\Passport\Passport::refreshTokensExpireIn());

            $authorizationServer->enableGrantType($grant, \Laravel\Passport\Passport::tokensExpireIn());
//
            $response = json_decode($authorizationServer->respondToAccessTokenRequest(
                $request, new \Zend\Diactoros\Response
            )->getBody()->__toString(), true);

            return $response;
        }

    }

}
