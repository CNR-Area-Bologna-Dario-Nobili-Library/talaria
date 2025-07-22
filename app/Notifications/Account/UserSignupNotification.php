<?php

namespace App\Notifications\Account;

use App\Notifications\MandatoryNotification;
use Illuminate\Bus\Queueable;


class UserSignupNotification extends MandatoryNotification
{
    use Queueable;
    
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($model)
    {                
        parent::__construct();
        $this->object=$model;
        $this->url=config('app.frontend_url').'/login';       
        
        //Define mail data
        $this->extraDataArr=['name'=>$this->object->name,'surname'=>$this->object->surname,'email'=>$this->object->email];        
        
    }

    /**
     * Override via method to send only by email, not store on DB
     */
    public function via($notifiable)
    {
        return ['mail'];
    }
}
