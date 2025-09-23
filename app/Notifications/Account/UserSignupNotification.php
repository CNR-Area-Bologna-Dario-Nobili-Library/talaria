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
        
        //User data
        $userArray=$this->object->toArray();
        foreach($userArray as $k=>$v) {
            if( isset($v) && !empty($v) )
                $this->extraDataArr["user_".$k]=$v;
        }                                        
    }

    /**
     * Override via method to send only by email, not store on DB
     */
    public function via($notifiable)
    {
        return ['mail'];
    }
}
