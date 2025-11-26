<?php

namespace App\Notifications\Operators;

use App\Notifications\MandatoryNotification;
use Illuminate\Bus\Queueable;

class OperatorAcceptedInvitationNotification extends MandatoryNotification
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
        $this->url=config('app.frontend_url').'/user/dashboard';       
        
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
