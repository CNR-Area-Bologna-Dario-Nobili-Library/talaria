<?php

namespace App\Notifications\Library;

use App\Notifications\MandatoryNotification;
use App\Notifications\OnDemandMailNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class LibraryOperatorInvitationNewUserNotification extends OnDemandMailNotification
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
        $this->url=config('app.frontend_url').'/signup';     
        
   
        $library=$this->object->library;

        $this->extraDataArr+=['name'=>$this->object->user_name,'surname'=>$this->object->user_surname,'email'=>$this->object->user_email];
                               
        $this->extraDataArr+=[
            'lib_name'=>$library->name,'address'=>$library->address,'ill_email'=>$library->ill_email,              
            'abilities'=>$this->object->abilities
        ];
    }
}
