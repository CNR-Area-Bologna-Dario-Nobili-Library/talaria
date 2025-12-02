<?php

namespace App\Notifications\DDILL;

use App\Models\Requests\PatronDocdelRequest;
use Illuminate\Bus\Queueable;


class PatronRequestDeskReceivedNotification extends PatronRequestNotification
{
    use Queueable;
    
    /**
     * Create a new request notification instance.
     *
     * @return void
     */
    public function __construct($model)
    {                
        //note: we have to convert BorrowingDocdelRequest to PatronDocdelRequest in order to send only "pdr request fields"  
        $pdr=PatronDocdelRequest::findOrFail($model->patron_docdel_request_id);

        parent::__construct($pdr);                  
    }    
}
