<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

/* this class can be used for all Mandatory notifications, so it means that user will receive this notifications both by APP AND by EMAIL because are mandatory! */
class MandatoryNotification extends BaseNotification
{
    use Queueable;

    public function __construct()
    {        
        parent::__construct();   
    }


    /**
     * we override VIA method in order to send notification by APP AND by EMAIL
     */
    public function via($notifiable)
    {       
        return ['mail', 'database'];        
    }
}
