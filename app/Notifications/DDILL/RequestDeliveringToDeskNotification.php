<?php

namespace App\Notifications\DDILL;

use Illuminate\Bus\Queueable;


class RequestDeliveringToDeskNotification extends RequestNotification
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

        $this->url=config('app.frontend_url').'/library/'.$this->object->borrowingLibrary->id.'/delivery/'.$this->object->id;  
            
    }    
}
