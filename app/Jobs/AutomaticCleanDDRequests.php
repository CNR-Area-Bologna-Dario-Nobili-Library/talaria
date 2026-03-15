<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Requests\BorrowingDocdelRequest;
use App\Models\Requests\PatronDocdelRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AutomaticCleanDDRequests implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    private function updateCanceledRequests() {
        //automatic "accept cancel" for borrowing request in cancelRequested state
        $borrowings=BorrowingDocdelRequest::where(
         [
            ['borrowing_status','=','cancelRequested'],
            ['lending_status','=','cancelRequested']
         ]
        )
        ->whereNotNull('cancel_request_date')
        ->whereRaw("DATEDIFF(now(),cancel_request_date) >= 2")->get();        
        foreach($borrowings as $borr)             
            $borr->changeStatus("canceled",["lending_status"=>"canceledAccepted","lending_archived"=>1]);

    }

    private function resetNotAcceptedRequests() {
        //automatic "restart as new" for orphaned borrowing request in requested state in 20 days
        $reqborrowings=BorrowingDocdelRequest::where('borrowing_status','=','requested')
        ->where('lending_status','=','requestReceived')
        ->where('all_lender','=','1')
        ->whereNotNull('request_date')
        ->whereRaw("DATEDIFF(now(),request_date) >= 20")->get();        
        foreach($reqborrowings as $borr)
        {            
            $borr->changeStatus("newrequest",['request_date'=>null,'lending_status'=>null,'all_lender'=>0,'lending_library_id'=>null]);                
        }
    }

    //NOTA: quando è in "received" potrebbe dover scaricare il file ... in questo caso non posso archiviare, devo aspettare che sia scaricato, 
    //ma attualmente non gestiamo questo "flag" :( 
    //=> al max posso archiviare quelle "notReceived" o "canceled" 
    //PER IL MOMENTO E' DISATTIVATA - VA REIMPLEMENTATA QUANDO RIVEDREMO LA GESTIONE DEI PATRON
    private function archiveFinalStatePatronRequests() {
        $req=PatronDocdelRequest::whereRaw("status='received' or status='notReceived' or status='canceled'")
        ->whereRaw("DATEDIFF(now(),fulfill_date) >= 30")->get();        
        foreach($req as $prequest)
        {            
            $prequest->archived=1; //archives this request
            $prequest->archived_date=Carbon::now();  
            $prequest->save();         
        }

    }

    //archive DD request (not patronreq) which are in final status from 30days from creation date
    private function archiveFinalStateDocdelRequests() {
        $reqborrowings=BorrowingDocdelRequest::whereRaw("borrowing_status='documentReady'  or borrowing_status='documentNotReady'  or borrowing_status='notReceived'")        
        ->where('patron_docdel_request_id','=','null')
        ->where('archived','=','0')
        ->whereRaw("DATEDIFF(now(),created_at) >= 30")->get();        
        foreach($reqborrowings as $borr)
        {   
            //archive this request    
            $borr->archived=1;
            $borr->archived_date=Carbon::now();            
            $borr->save();

            // DELETE FILE
            if($borr->filehash)
                $borr->deleteFile();
        }

    }

    
    /* 20/11/25 NON piu usate 
    private function archiveAsNotReceivedNewForwardedRequests() {        
        $reqborrowings=BorrowingDocdelRequest::where('borrowing_status','=','newrequest')
        ->where('docdel_request_parent_id','<>','null')
        ->where('patron_docdel_request_id','=','null')
        ->where('archived','<>','1')
        ->whereRaw("DATEDIFF(now(),created_at) >= 15")->get();        
        foreach($reqborrowings as $borr)
        {   
            //change to notReceived & archived with reason "NotAvailableForILL"         
            $borr->changeStatus("notReceived",['archived'=>1,'fulfill_date'=>Carbon::now(),'notfulfill_type'=>config("constants.borrowingdocdelrequest_notfulfill_type.NotAvailableForILL"),'lending_status'=>null,'all_lender'=>0,'lending_library_id'=>null]);                
        }
    }

    private function archiveAsReceivedRequests() {        
        $reqborrowings=BorrowingDocdelRequest::where('borrowing_status','=','documentReady')
        ->where('docdel_request_parent_id','<>','null')
        ->where('patron_docdel_request_id','=','null')
        ->where('archived','<>','1')
        ->whereRaw("DATEDIFF(now(),created_at) >= 15")->get();        
        foreach($reqborrowings as $borr)
        {   
            //change to notReceived & archived with reason "NotAvailableForILL"         
            $borr->changeStatus("documentReady",['archived'=>1,'fulfill_date'=>Carbon::now(),'notfulfill_type'=>config("constants.borrowingdocdelrequest_notfulfill_type.NotAvailableForILL"),'lending_status'=>null,'all_lender'=>0,'lending_library_id'=>null]);                
        }
    }*/
    

    /**
     * Execute the job.
     *
     * @return void
     * 
     * NOTE: this job is called from app\Console\Kernel.php, through the artisan queue command runned by crontab
     */
    public function handle()
    {
        Log::info("Start job ".get_class($this)." at ".Carbon::now());
        
        $this->updateCanceledRequests();
        $this->resetNotAcceptedRequests();        
        $this->archiveFinalStateDocdelRequests();
        //$this->archiveFinalStatePatronRequests();
        //$this->archiveAsNotReceivedNewForwardedRequests();
        //$this->archiveAsReceivedRequests();
        
        Log::info("End job ".get_class($this)." at ".Carbon::now());
    }
}
