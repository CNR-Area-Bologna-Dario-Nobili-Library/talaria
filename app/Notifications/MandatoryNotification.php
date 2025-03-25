<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/* this class can be used for all Mandatory notifications, so it means that user will receive this notifications both by APP AND by EMAIL because are mandatory! */
class MandatoryNotification extends BaseNotification
{
    use Queueable;

    protected $object;

    public function __construct($model)
    {        
        parent::__construct($model);        
    }
    /**
     * we override VIA method in order to send notification by APP AND by EMAIL
     */
    public function via($notifiable)
    {
        return ['mail', 'database'];
        
    }
}
