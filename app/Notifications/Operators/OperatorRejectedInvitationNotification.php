<?php

namespace App\Notifications\Operators;

use App\Notifications\MandatoryNotification;
use Illuminate\Bus\Queueable;

class OperatorRejectedInvitationNotification extends MandatoryNotification
{
    use Queueable;
    
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    //NOTE: model is a TemporaryAbility object
    public function __construct($model)
    {                
        parent::__construct();
        $this->object=$model;

        $entity_dashboard_url="";

        switch($this->object->entity_type) {
            case 'App\\Models\\Libraries\\Library': $entity_dashboard_url='/library/'.$this->object->entity_id; break;
            case 'App\\Models\\Institutions\\Institution':  $entity_dashboard_url='/institution/'.$this->object->entity_id; break;
            case 'App\\Models\\Projects\\Project': $entity_dashboard_url='/project/'.$this->object->entity_id; break;
            case 'App\\Models\\Institutions\\Consortium': $entity_dashboard_url='/consortium/'.$this->object->entity_id; break;
        }
    

        $this->url=config('app.frontend_url').$entity_dashboard_url.'/manage/operators/pending';     
        
   
        if($model->user_id!=null) { //user exists
            $user=$this->object->user;        

            $this->extraDataArr=[
                'name'=>$user->name,
                'surname'=>$user->surname,
                'email'=>$user->email,                         
            ];
        }
        else { //new user
            $this->extraDataArr=[
                'name'=>$this->object->user_name,
                'surname'=>$this->object->user_surname,
                'email'=>$this->object->user_email,                         
            ];
        }
    }
}
