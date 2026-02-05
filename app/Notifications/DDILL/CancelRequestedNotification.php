<?php

namespace App\Notifications\DDILL;

use App\Models\Requests\DocdelRequest;
use App\Models\Requests\LendingDocdelRequest;
use Illuminate\Bus\Queueable;


class CancelRequestedNotification extends RequestNotification
{
    use Queueable;
    
    /**
     * Create a new request notification instance.
     *
     * @return void
     */
    public function __construct($model)    
    {                       
        //note: we have to convert BorrowingDocdelRequest to LendingDocdelRequest in order to send only "lending request fields"  
        $lr=LendingDocdelRequest::findOrFail($model->id);
        parent::__construct($lr);

        $this->url=config('app.frontend_url').'/library/'.$this->object->library->id.'/lending/';  
            
    }    
}
