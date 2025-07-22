<?php

namespace App\Notifications\DDILL;

use Illuminate\Bus\Queueable;


class RequestReceivedNotification extends RequestNotification
{
    use Queueable;
    
    /**
     * Create a new request notification instance.
     *
     * @return void
     */
    public function __construct($model)
    {                
        parent::__construct($model);

        $this->url=config('app.frontend_url').'/library/'.$this->object->lendingLibrary->id.'/lending/'.$this->object->id;  
            
    }    
}
