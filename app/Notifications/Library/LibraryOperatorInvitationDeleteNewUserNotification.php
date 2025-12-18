<?php

namespace App\Notifications\Library;

use App\Notifications\MandatoryNotification;
use App\Notifications\OnDemandMailNotification;
use Illuminate\Bus\Queueable;

class LibraryOperatorInvitationDeleteNewUserNotification extends OnDemandMailNotification
{
    use Queueable;
    
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    //NOTE: model is $obj=["user"=>$user,"library"=>$lib]; 
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
