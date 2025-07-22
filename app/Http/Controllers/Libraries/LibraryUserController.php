<?php

namespace App\Http\Controllers\Libraries;

use App\Models\Libraries\Library;
use App\Models\Libraries\LibraryTransformer;
use App\Models\Libraries;
use App\Models\LibrariesTransformer;
use Illuminate\Http\Request;
use App\Http\Controllers\ApiController;
use App\Models\Libraries\LibraryUserTransformer;
use App\Models\Libraries\LibraryUser;
use App\Models\Users\User;
use App\Notifications\Library\PatronAskJoinLibraryAwaitsApprovalNotification;
use App\Notifications\Library\PatronAskJoinLibraryNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class LibraryUserController extends ApiController
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(LibraryUser $model, LibraryUserTransformer $transformer)
    {
        $this->model = $model;

        $this->transformer = $transformer;

        $this->broadcast = false;
    }

    public function my(Request $request)
    {
        $count = $request->input('pageSize', config('api.page_size'));
//        $my_applications = $this->model->owned()->with('library')->orderBy('updated_at','desc')->paginate($count);
        $my_applications = $this->model->owned()->orderBy('preferred','desc')->orderBy('updated_at','desc')->paginate($count);

        return $this->response->paginator($my_applications, new $this->transformer())->morph();
    }

    //Elenco biblio attive e ordinate per preferito
    public function myactive(Request $request)
    {   
        // $collection = $this->talaria->optionList($this->model, $request,function ($model,$request){           
        //   return $model->owned()->InStatus(config('constants.libraryuser_status.enabled'))->orderBy('preferred','desc');
        //});
        //return $this->response->array($collection->toArray());
        $collection=$this->model->owned()->InStatus(config('constants.libraryuser_status.enabled'))->orderBy('preferred','desc')->get();
        return $this->response->collection($collection, new $this->transformer())->morph();
    }

    public function store(Request $request)
    {
        Log::info("User joins ....");
        if( !empty($this->validate) )
            $this->validate($request, $this->validate);

        $model = $this->talaria->store($this->model, $request);

        //if($this->broadcast && config('apitalaria.broadcast'))
        //    broadcast(new ApiStoreBroadcast($model, $model->getTable(), $request->input('include')));
        
        $user=$this->model->user;
        $pn=new PatronAskJoinLibraryNotification($this->model);
        

        //Notify to library manager+users manager        
        $lib=$this->model->library;
        $operators=array();
        $operators+=$lib->manageOperators()->toArray();
        $operators+=$lib->usersOperators()->toArray();
        
        //unique operators
        $operatorsID=array_unique(array_map(function($op) { return $op['user_id']; }, $operators)); 


        foreach ($operatorsID as $item) {
            $u=User::findOrFail($item);                 
            $u->notify($pn);            
        }    
                
        $pnwr=new PatronAskJoinLibraryAwaitsApprovalNotification($this->model);
        $user->notify($pnwr);

        return $this->response->item($model, new $this->transformer())->setMeta($model->getInternalMessages())->morph();;
    }

    public function update(Request $request, $id)
    {
        if(!empty($this->validate) )
            $this->validate($request, $this->validate);

        $id = $request->route()->parameters['library_user'];
        $model = $this->talaria->update($this->model, $request, $id);

        if($this->broadcast && config('apitalaria.broadcast'))
            broadcast(new ApiUpdateBroadcast($model, $model->getTable(), $request->input('include')));

        return $this->response->item($model, new $this->transformer())->setMeta($model->getInternalMessages())->morph();;
    }

    /*public function index(Request $request)
    {
        $this->model = $this->filterRelations($request);
        $collection = $this->talaria->index($this->model, $request);

        return $this->response->paginator($collection, new $this->transformer())->morph();
    }*/

    //Solo il manager della biblio (o degli utenti) puo' vedere i suoi utenti
    public function index(Request $request)
    {
        $l=Library::find($request->route()->parameters['library']);
        $u=Auth::user();
        if($u->can('manage-users',$l))
        {
            $this->model = $this->filterRelations($request);
            $collection = $this->talaria->index($this->model, $request);

            return $this->response->paginator($collection, new $this->transformer())->morph();
        }
        else
            $this->response->errorUnauthorized(trans('apitalaria::auth.unauthorized'));

    }

    public function filterRelations($request) {
        $library = $request->route()->parameters();
        return $this->model->inLibrary($library);
    }

    public function show(Request $request, $id)
    {
        $id = $request->route()->parameters['library_user'];
        $model = $this->talaria->show($this->model, $request, $id);

        return $this->response->item($model, new $this->transformer())->setMeta($model->getInternalMessages())->morph();
    }

    // ApiControllerTrait@delete override
    // because we use only library_user id to delete it instead of library_id
    public function delete(Request $request, $id)
    {
        $id = $request->route()->parameters['library_user'];
        $model = $this->talaria->delete($this->model, $request, $id);

        if($this->broadcast && config('apitalaria.broadcast'))
            broadcast(new ApiDeleteBroadcast($model->id, $model->getTable()));

        return $this->response->item($model, new $this->transformer())->setMeta($model->getInternalMessages())->morph();
    }

}
