<?php

namespace App\Notifications\Account;

use App\Notifications\MandatoryNotification;


class ResetPasswordNotification extends MandatoryNotification
{
    public function __construct($token)
    {       
        parent::__construct();       
  
        $this->url=config('app.frontend_url').'/forgot-password/'.$token;
        
        //Define mail data
        $this->extraDataArr=['count' => config('auth.passwords.'.config('auth.defaults.passwords').'.expire')];                
    }

    /**
     * Override via method to send only by email, not store on DB
     */
    public function via($notifiable)
    {
        return ['mail'];
    }


}
