<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class InstitutionNotification extends BaseNotification
{
    use Queueable;

    protected $object;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($model)
    {        
        parent::__construct($model);        
    }
  

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $ist=$this->object->id;        
       return [      
               'title'=>"Institution #$ist status changed",   
               'message'=>'Status:'.$this->object->status,
               'url'=>"/institution/$ist",
               'object_type'=>get_class($this->object),
               'object_id'=>$this->object->id              
       ];
    }    
}
