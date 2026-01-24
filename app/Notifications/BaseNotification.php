<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

/* this class can be used as base model for all SERVICE notifications. Service notification will be received as APP notification or by email depending on user's choice in preferNotifiedBy method    
NOTE: we take default tltle (maybe overridden by parent classes) and we add notification translated text
*/
class BaseNotification extends Notification
{
    use Queueable;

    protected $object;
    protected $title;
    protected $url;   
    protected $extraDataArr;


    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->extraDataArr=[];                   
    }

    protected function addTitleIdentifier($id) {
        //Set title prepending passed ID
        if($id && $id!="")
            $this->title="#".$id." - ";
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {        
        return $notifiable->preferNotifiedBy();
    }

     /**
     * we override toMail method in order to send notification by EMAIL with our template with text translated into user's preferred language
     */
    public function toMail($notifiable)
    {
        $lang=$notifiable->preferredLocale(); 

        //title is taken from <classname>_title variable in translations file ("resources/lang/<lang>/notification.php").
        //We set it here becase here we've notifiable object and we can use user's language        
        $this->title=$this->title.trans("notification.".class_basename(get_class($this))."_title",[],$lang);    

        //pass url to extraDataArr so in the email we can use notification url
        $this->extraDataArr+=['notification_url'=>$this->url];

        return (new BaseMailMessage($this->title,$this->extraDataArr,"mail.notification.lang.$lang.".class_basename(get_class($this)),false));      //will look for "resources/view/mail/notificatiom/<lang>/<ClassName>.blade.php    
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {     
        
        //title is taken from <classname>_title variable in translations file ("resources/lang/<lang>/notification.php").
        //We set it here becase here we've notifiable object and we can use user's language
        $lang=$notifiable->preferredLocale();
        $this->title=$this->title.trans("notification.".class_basename(get_class($this))."_title",[],$lang);    

       $myobj= [      
               'title'=>$this->title?$this->title:'',              
               'url'=>$this->url?$this->url:'',
        ];

        //save object extra data on DB
        if($this->object)           
            $myobj[]=['object_type'=>get_class($this->object),'object_id'=>$this->object->id];              


       return $myobj;  
    }    
    // helper for realtime/events
    public function toRealtimePayload(?\App\Models\Users\User $viewer = null): array
    {
        
        $viewer    = $viewer ?: \Illuminate\Support\Facades\Auth::user();
        $lang      = $viewer ? $viewer->preferredLocale() : app()->getLocale();

        // Actor (who triggered it)
        $actorUser = \Illuminate\Support\Facades\Auth::user();

        $prefix = is_string($this->title) ? $this->title : '';
        $key    = 'notification.' . class_basename(static::class) . '_title';
        $label  = trans($key, [], $lang);
        if ($label === $key) $label = 'Notification';

        $fullTitle = trim($prefix . $label);

        $payload = [
            'title'       => $fullTitle,
            'url'         => $this->url ?? null,
            // IMPORTANT: actor here, not viewer
            'notifier_id' => optional($actorUser)->id,
            // Include class name for frontend to identify notification type
            'type'        => class_basename(static::class),
        ];

        if ($this->object) {
            $payload['object'] = [
                'object_type' => get_class($this->object),
                'object_id'   => (int) $this->object->id,
            ];
        }

        if (!empty($this->extraDataArr)) {
            $payload['extra'] = $this->extraDataArr;
        }

        return $payload;
    }
}
