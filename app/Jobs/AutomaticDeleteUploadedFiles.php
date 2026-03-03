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

class AutomaticDeleteUploadedFiles implements ShouldQueue
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

     private function deleteFileFromArchivedRequests() {        
        //<1 days ago archived request with file and not patron request
        $requests=BorrowingDocdelRequest::where('patron_docdel_request_id','=',null)->where('archived','1')->whereNotNull('filehash')->whereRaw('DATEDIFF(now(),archived_date) <= 1')->get();        
        foreach($requests as $req)
            $req->deleteFile();        
    }

     private function deleteFileFromArchivedPatronRequests() {        
        //<1 days ago archived patron request with file
        $requests=PatronDocdelRequest::where('archived','1')->whereNotNull('filehash')->whereRaw('DATEDIFF(now(),archived_date) <= 1')->get();        
        foreach($requests as $req)
            $req->deleteFile();        
    }

     //TODO: delete files of "not archived request that were in a final status from 30days"

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {        
        Log::info("Start job ".get_class($this)." at ".Carbon::now());
        $this->deleteFileFromArchivedRequests();
        $this->deleteFileFromArchivedPatronRequests();    
        Log::info("End job ".get_class($this)." at ".Carbon::now());
    }
}
