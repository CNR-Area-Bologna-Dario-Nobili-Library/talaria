<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

//OnDemandMailNotification is a mandatory notification that can be sent to any user that is not already in the system and we've just his email address, so no notification will be saved on DB
class OnDemandMailNotification extends MandatoryNotification
{
    use Queueable;

    public function __construct()
    {        
        parent::__construct();   
    }


    //only via mail cause we don't have the user!
    public function via($notifiable)
    {        
        return ["mail"];
    }

     /**
     * we override toMail method in order to send notification using on-demand notification 
     */
    public function toMail($notifiable)
    {
        $lang=app()->getLocale();
       
        //title is taken from <classname>_title variable in translations file ("resources/lang/<lang>/notification.php").
        //We set it here becase here we've notifiable object and we can use user's language        
        $this->title=$this->title.trans("notification.".class_basename(get_class($this))."_title",[],$lang);    

        //pass url to extraDataArr so in the email we can use notification url
        $this->extraDataArr+=['notification_url'=>$this->url];

        return (new BaseMailMessage($this->title,$this->extraDataArr,"mail.notification.".class_basename(get_class($this)),false));      //will look for "resources/view/mail/notification/<ClassName>.blade.php    
    }
}