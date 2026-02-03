<?php namespace App\Models\Libraries;

use App\Models\BaseObserver;
use App\Models\Users\User;
use App\Notifications\Library\PatronAskJoinLibraryAwaitsApprovalNotification;
use App\Notifications\Library\PatronAskJoinLibraryNotification;
use App\Notifications\Library\PatronDisabledByLibraryNotification;
use App\Notifications\Library\PatronEnabledByLibraryNotification;
use App\Notifications\Library\PatronDeletedByLibraryNotification;
use App\Notifications\Library\PatronCancelledJoinRequestNotification;
use App\Support\RealtimeBroadcaster;
use \Auth;


class LibraryUserObserver extends BaseObserver
{

    protected $rules = [
//        'library_id' => 'sometimes|required|integer|exists:libraries,id',
        'library_id' => 'required|integer|exists:libraries,id',
        'user_id' => 'required|integer|exists:users,id',
    ];


    protected function setConditionalRules($model)
    {
//        $this->validator->sometimes('library_id',
//            'required|unique:library_user,library_id,'.$model->library_id.'|unique:library_user,user_id,'.$model->user_id,
//            function ($input) use ($model) {
//            return !$model->id;
//        });
    }

    public function creating($model)
    {         
        //ogni nuova rich va messa in attesa
        $model->status=config("constants.libraryuser_status.pending");

        $user=User::findOrFail($model->user->id);
        $pn=new PatronAskJoinLibraryNotification($model); 
        

        //Notify to library manager+users manager        
        $lib=$model->library;
        $operators=array();
        $operators+=$lib->manageOperators()->toArray();
        $operators+=$lib->usersOperators()->toArray();
        
        //unique operators
        $operatorsID=array_unique(array_map(function($op) { return $op['user_id']; }, $operators)); 

        //Notify ...
        foreach ($operatorsID as $item) {
            $u=User::findOrFail($item);                 
            $u->notify($pn);            
            RealtimeBroadcaster::fromNotification($model, $u, $pn);             
        }    
                
        //Notify to patron
        $pnwr=new PatronAskJoinLibraryAwaitsApprovalNotification($model);
        $user->notify($pnwr);
        RealtimeBroadcaster::fromNotification($model, $user, $pnwr);

                         
        return parent::creating($model);
         
    }

    /*public function created($model)
    {
        //send mail+notif to library         
    }*/

    public function saving($model)
    {
        if(auth() && auth()->user()) {
            $user = auth()->user();
            $library = Library::find($model->library_id);
            if(!$user->can('manage-users', $library)) {
                if($model->isDirty("status")) {
                    unset($model->status);
                }
                if(!$model->user_id) {
                    $model->user_id = auth()->user()->id;
                }
            }
        }

        if(parent::saving($model)) //sto salvando e la validazione non ha dato problemi
        {
            //Jun 2021: we decide to add patron role to every user associating to library despite library decision
            $u=$model->user;
            if($u)
                $u->assign('patron');

            if($model->preferred && $model->preferred==1)
            {
                //vado a togliere il preferred dalle altre sue biblioteche perchè solo una puo' essere preferred
                $mylibs=LibraryUser::owned($model->user->id)->where("id","<>",$model->id);
                $mylibs->each(function ($item){
                    $item->update(["preferred"=>0]);
                });                
            }
            //Sto aggiornando lo stato dell'utente x la biblioteca
            if($model->isDirty() && $model->isDirty("status"))
            {
                //lo sto disabilitando
                if($model->status==config("constants.libraryuser_status.disabled"))
                {
                    
                    /*NOTE: Jun 2021: we decide not remove patron role so he can access is bibliografy forever
                    so i commented code below
                    
                    //1. remove role "patron" if he has no other active libraries
                    $u=$model->user;
                    if($u->active_libraries->count()==1)
                        $u->retract('patron');
                    */
                    /* 2. send mail+notify to user to let him know it was disabled */

                    
                    $u=$model->user;
                    
                    //Notify to patron                                                
                    $ln=new PatronDisabledByLibraryNotification($model);                    
                    $u->notify($ln);
                    RealtimeBroadcaster::fromNotification($model, $u, $ln);
                }
                //lo sto abilitando
                else if($model->status==config("constants.libraryuser_status.enabled"))
                {
                    /* 
                    NOTE: Jun 2021: we decide to give patron role when he asked for association despite library accept him
                    so i commented code below
                    
                    //1. add role "patron" if he has not 
                    $u=$model->user;
                    if($u->active_libraries->count()==0)
                        $u->assign('patron');
                    */
                    /*2. send mail+notify to user to let him know it was enabled */

                    $u=$model->user;
                    
                    //Notify to patron                                                
                    $ln=new PatronEnabledByLibraryNotification($model);                    
                    $u->notify($ln);
                    RealtimeBroadcaster::fromNotification($model, $u, $ln);
                }

            }
        }
        return true;

    }

    public function saved($model)
    {
        return parent::saved($model);

    }

    public function deleting($model)
    {
        parent::deleting($model);

        $u = $model->user;
        $currentUser = auth()->user();
        $isPatronInitiated = $currentUser && $currentUser->id == $u->id;

        // Notify the patron (only if library initiated the deletion)
        if (!$isPatronInitiated) {
            $ln = new PatronDeletedByLibraryNotification($model);
            $u->notify($ln);
            RealtimeBroadcaster::fromNotification($model, $u, $ln);
        }

        // Always notify library operators so their patron panel refreshes
        $lib = $model->library;
        $operators = array();
        $operators += $lib->manageOperators()->toArray();
        $operators += $lib->usersOperators()->toArray();

        // unique operators
        $operatorsID = array_unique(array_map(function($op) { return $op['user_id']; }, $operators));

        $pn = new PatronCancelledJoinRequestNotification($model);
        foreach ($operatorsID as $item) {
            $op = User::findOrFail($item);
            // Only store notification if patron cancelled their pending request
            // Otherwise just broadcast for real-time panel refresh
            if ($isPatronInitiated && ( $model->status == config("constants.libraryuser_status.pending")|| $model->status == config("constants.libraryuser_status.enabled") )) {
                $op->notify($pn);
            }
            RealtimeBroadcaster::fromNotification($model, $op, $pn);
        }
    }

    public function restoring($model)
    {
        return parent::restoring($model);
    }

}
