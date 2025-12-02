<?php

namespace App\Notifications\Library;

use App\Notifications\MandatoryNotification;
use Illuminate\Bus\Queueable;


class LibraryOperatorInvitationNotification extends MandatoryNotification
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
        
   
        $user=$this->object->user;
        $library=$this->object->library;

        $this->extraDataArr=[
            'name'=>$user->name,'surname'=>$user->surname,'email'=>$user->email,             
            'lib_name'=>$library->name,'address'=>$library->address,'ill_email'=>$library->ill_email,              
            'abilities'=>$this->object->abilities
        ];
    }
}
