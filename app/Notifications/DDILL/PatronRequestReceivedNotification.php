<?php

namespace App\Notifications\DDILL;

use Illuminate\Bus\Queueable;


class PatronRequestReceivedNotification extends PatronRequestNotification
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
    }    
}
