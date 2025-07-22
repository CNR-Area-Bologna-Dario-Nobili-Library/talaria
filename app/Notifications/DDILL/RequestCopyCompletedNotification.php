<?php

namespace App\Notifications\DDILL;

use Illuminate\Bus\Queueable;


class RequestCopyCompletedNotification extends RequestNotification
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

        $this->url=config('app.frontend_url').'/library/'.$this->object->borrowingLibrary->id.'/borrowing/'.$this->object->id;  
            
    }    
}
