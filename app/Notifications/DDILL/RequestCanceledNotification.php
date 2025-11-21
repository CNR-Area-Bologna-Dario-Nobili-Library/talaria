<?php

namespace App\Notifications\DDILL;

use App\Models\Requests\DocdelRequest;
use App\Models\Requests\LendingDocdelRequest;
use App\Notifications\BaseNotification;
use Illuminate\Bus\Queueable;


class RequestCanceledNotification extends BaseNotification
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

        $this->addTitleIdentifier($model->id); //prepend title with # Req. ID -   

        $this->url=config('app.frontend_url').'/library/'.$model->lending_library_id.'/lending';

        $this->extraDataArr=['id'=>$model->id];      
    }    
  
}
