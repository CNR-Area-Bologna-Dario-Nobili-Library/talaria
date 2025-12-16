<?php

namespace App\Models\Users;

use App\Models\BaseModel;
use App\Models\Institutions\Consortium;
use App\Models\Institutions\Institution;
use App\Models\Libraries\Library;
use App\Models\Projects\Project;
use App\Models\Users\User;
use App\Notifications\BaseMailMessage;
use App\Notifications\Library\LibraryOperatorInvitationDeleteNotification;
use App\Notifications\Library\LibraryOperatorInvitationNotification;
use App\Notifications\Library\LibraryOperatorInvitationNewUserNotification;
use App\Notifications\Operators\OperatorAcceptedInvitationNotification;
use App\Notifications\Operators\OperatorRejectedInvitationNotification;
use Illuminate\Support\Facades\Notification as FacadesNotification;
use App\Support\RealtimeBroadcaster;
use stdClass;

class TemporaryAbility extends BaseModel
{
    protected $table = 'temporary_abilities';
    protected static $observerClass = TemporaryAbilityObserver::class;

    protected $forceDeleting=true; //overrides softdelete => force delete!  
    public static function bootSoftDeletes() {}  //override softdelete trait!
    
    protected $userstamping = false;

    protected $fillable=[
        'entity_id',
        'entity_type',
        'user_id',
        'user_name',
        'user_surname',
        'user_email',
        'abilities',
        'status',        
    ];

    public function user()
    {                
            return $this->belongsTo(User::class,'user_id');
    }

    public function library() {
        return $this->belongsTo(Library::class,'entity_id');
    }

    public function institution() {
        return $this->belongsTo(Institution::class,'entity_id');
    }

    public function project () {
        return $this->belongsTo(Project::class,'entity_id');   
    }

    public function consortium () {
        return $this->belongsTo(Consortium::class,'entity_id');   
    }

    
    public function scopeByStatus($query,$status) {
        return $query->where('status',$status);        
    }

    private function scopeByEntity($query,$entityType,$entityID) {
        return $query->where('entity_id',$entityID)->where('entity_type',$entityType);        
    }

    public function scopeByLibrary($query,$entityID) {
        return $this->scopeByEntity($query,'App\\Models\\Libraries\\Library',$entityID);        
    }

    public function scopeByInstitution($query,$entityID) {
        return $this->scopeByEntity($query,'App\\Models\\Institutions\\Institution',$entityID);        
    }

    public function scopeByConsortium($query,$entityID) {
        return $this->scopeByEntity($query,'App\\Models\\Institutions\\Consortium',$entityID);        
    }

    public function scopeByProject($query,$entityID) {
        return $this->scopeByEntity($query,'App\\Models\\Projects\\Project',$entityID);                
    }   
   
    public function scopeByUserID($query,$user_id) {
        return $query->where('user_id',$user_id);        
    }

    public function scopeByUserEmail($query,$user_email) {
        return $query->where('user_email',$user_email);        
    }


    public function scopeWaiting($query) {
        return $this->scopeByStatus($query,config("constants.temporary_abilities_status.waiting")); 
    }       
    
    public function setEntity($type, $entityID) {
        $etype=null;
        switch($type) {
            case "library": $etype='App\\Models\\Libraries\\Library'; break;
            case "institution": $etype='App\\Models\\Institutions\\Institution'; break;
            case "project": $etype='App\\Models\\Projects\\Project'; break;
            case "consortium": $etype='App\\Models\\Institutions\\Consortium'; break;
        }

        if($etype!=null) {
            $this->entity_id=$entityID;
            $this->entity_type=$etype;
        }
    }

    public function getEntity() {
        switch($this->entity_type) {
            case 'App\\Models\\Libraries\\Library': return $this->library; break;
            case 'App\\Models\\Institutions\\Institution': return $this->institution; break;
            case 'App\\Models\\Projects\\Project': return $this->project; break;
            case 'App\\Models\\Institutions\\Consortium': return $this->consortium; break;
        }
        return null;
    }

    public function notifyInvitationToUser() {        
        $u=$this->user;
        
        //Create notification email template for invitation ... 
        if(isset($u) && $u->id>0)
        { 
            // create the notification instance first
            $notification = new LibraryOperatorInvitationNotification($this);
            $u->notify($notification);
            RealtimeBroadcaster::fromNotification($this, $u, $notification);

            
        }
        else //if no existing user 
        if (isset($this->user_email))
        {          
            $notification = new LibraryOperatorInvitationNewUserNotification($this);
            //send just email using on-demand notifications because user doesn't exists...
            FacadesNotification::route('mail', $this->user_email)->notify($notification);
        }
    }

     public function notifyInvitationDeleteToUser() {        
        $u=$this->user;

        //Notify user if invitation was pending
        if($this->status==config("constants.temporary_ability_status.waiting"))
        {                  
            if(isset($u) && $u->id>0)
            {         
                //notify to user
                $notification = new LibraryOperatorInvitationDeleteNotification($this);
                $u->notify($notification);
                RealtimeBroadcaster::fromNotification($this, $u, $notification);            
            
            }
            else //if no existing user 
            if (isset($this->user_email))
            {                      
                //create a temp object with user and library                    
                $obj=new stdClass();
                $user=array("name"=>$this->user_name,"surname"=>$this->user_surname,"email"=>$this->user_email);                                            
                $obj->id=null;          
                $obj->library=$this->library(); 
                $obj->abilities=$this->abilities; 
                $obj->user=$user;


                $notification = new LibraryOperatorInvitationDeleteNotification($obj);
                //send just email using on-demand notifications because user doesn't exists...
                FacadesNotification::route('mail', $this->user_email)->notify($notification);
            }            

        }
        
    }

    public function notifyToEntityUserAccepted() {
        $entity=$this->getEntity();
        if($entity!=null) {

            $notification = new OperatorAcceptedInvitationNotification($this);

            foreach ($entity->manageOperators() as $item) {
                // Skip notifying the user who accepted the invitation
                if ($item["user_id"] == $this->user_id) {
                    continue;
                }

                $u=User::findOrFail($item["user_id"]);
                $u->notify($notification);
                RealtimeBroadcaster::fromNotification($this, $u, $notification);
            }

        }
    }

    public function notifyToEntityUserRejected() {
        $entity=$this->getEntity();
        if($entity!=null) {

            $notification = new OperatorRejectedInvitationNotification($this);

            foreach ($entity->manageOperators() as $item) {
                // Skip notifying the user who rejected the invitation
                if ($item["user_id"] == $this->user_id) {
                    continue;
                }

                $u=User::findOrFail($item["user_id"]);
                $u->notify($notification);
                RealtimeBroadcaster::fromNotification($this, $u, $notification);
            }

        }
    }
}
