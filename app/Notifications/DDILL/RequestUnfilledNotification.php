<?php

namespace App\Notifications\DDILL;

use App\Models\Requests\BorrowingDocdelRequest;
use Illuminate\Bus\Queueable;


class RequestUnfilledNotification extends RequestNotification
{
    use Queueable;
    
    /**
     * Create a new request notification instance.
     *
     * @return void
     */
    public function __construct($model)
    {                
        //note: we have to convert LendingDocdelRequest to BorrowingDocdelRequest in order to send only "borrowing request fields"  
        $br=BorrowingDocdelRequest::findOrFail($model->id);

        parent::__construct($br);        

        $this->url=config('app.frontend_url').'/library/'.$this->object->library->id.'/borrowing/'.$this->object->id;  
            
    }    
}
