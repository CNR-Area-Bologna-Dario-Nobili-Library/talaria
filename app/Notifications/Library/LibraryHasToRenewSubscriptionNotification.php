<?php

namespace App\Notifications\Library;

use App\Notifications\MandatoryNotification;
use Illuminate\Bus\Queueable;


class LibraryHasToRenewSubscriptionNotification extends MandatoryNotification
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

        $this->extraDataArr=['name'=>$this->object->name];        
    }    
}
