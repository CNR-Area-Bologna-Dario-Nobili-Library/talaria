<?php

namespace App\Notifications\Library;

use App\Notifications\MandatoryNotification;
use Illuminate\Bus\Queueable;


class LibraryHasBeenEnabledNotification extends MandatoryNotification
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
        $this->url=config('app.frontend_url').'/library/'.$this->object->id;       //go to library dashboard
        
        //Define mail data
        $this->extraDataArr=['name'=>$this->object->name,'address'=>$this->object->address,'ill_email'=>$this->object->ill_email];         
    }    
}
