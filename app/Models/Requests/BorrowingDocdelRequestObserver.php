<?php namespace App\Models\Requests;

use App\Models\BaseObserver;
use \Auth;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

use App\Models\Requests\DocdelRequest;

class BorrowingDocdelRequestObserver extends BaseObserver
{

    protected $rules = [
        'borrowing_library_id' => 'required|integer|exists:libraries,id',
        'reference_id' => 'required|integer|exists:references,id',       
        'patron_docdel_request_id' => 'nullable|integer|exists:patron_docdel_requests,id', 
    ];


    protected function setConditionalRules($model)
    {
//        $this->validator->sometimes('member_id', "required", function ($input) use ($model) {
//            return $model->type === 'physical';
//        });
    }

    protected function createLibraryObject($library)
    {
        return [
            'id' => $library->id,
            'name' => $library->name,
            'country' => $library->country->only([
                'id', 'name', 'code'
            ]),
            'subject' => $library->subject->only([
                'id', 'name'
            ]),
            'institution' => [
                'id' => $library->institution->id,
                'name' => $library->institution->name,
                'institution_type' => $library->institution->institution_type->only([
                    'id', 'name'
                ]),
                'country' => $library->institution->country->only([
                    'id', 'name', 'code'
                ])
            ]
        ];
    }

    public function creating($model)
    {
         //quando salvo viene messa in richiesta in quanto di default è status=requested         
         $model->request_type=0; //DD
         $model->forward=0;         
         $model->request_date=null;
         $model->borrowing_status="newrequest";

         if($model->patrondocdelrequest)
            $model->operator_id=null;
         else {
            if(auth() && auth()->user()) {
                $userid = auth()->user()->id;
                $model->operator_id=$userid;
            }
         }    

         return parent::creating($model);
    }

    
    public function saving($model)
    {        
        if($model->id) { //il modello esiste già => sono in update!
            if(auth() && auth()->user()) {
                $userid = auth()->user()->id;
                $model->operator_id=$userid;
            }
        }    
            
        if($model->isDirty('download'))
            $model->download_date=Carbon::now();

        if($model->isDirty('forward'))
            $model->forward_date=Carbon::now();        
        
        if($model->isDirty('archived'))
            $model->archived_date=Carbon::now();    

        if($model->isDirty('trash_type'))
            $model->trash_date=Carbon::now();        

        //when borrowing cancel request     
        if($model->isDirty('lending_archived'))
            $model->lending_archived_date=Carbon::now();        


        return parent::saving($model);

    }

    public function saved($model)
    {
        // After model is saved, let's index it to Elasticsearch

        /** @var Elasticsearch\Client $client */
        $client = app('Elasticsearch\Client');

        // Elasticsearch request body params 
        $params = [
            'index' => 'docdelrequests',
            'id' => $model->id,
            'body' => [
                'id' => $model->id,
                'request_date' => \Carbon\Carbon::parse($model->request_date)->format('Y-m-d H:i:s'),
                // 'fulfill_date' => \Carbon\Carbon::parse($model->fulfill_date)->format('Y-m-d H:i:s'),
                'borrowing_status' => $model->borrowing_status,
                'lending_status' => $model->lending_status,
                // 'fulfill_type' => $model->fulfill_type,
                // 'notfulfill_type' => $model->notfulfill_type,
                'forward' => $model->forward,
                'reference' => $model->reference->only([
                    'id', 'material_type', 'pub_type', 'pub_title', 'pubyear', 'issn', 'isbn', 'oa_link'
                ]),
                'borrowing_library' => $this->createLibraryObject($model->borrowinglibrary),
                'lending_library' => $model->lendinglibrary ? $this->createLibraryObject($model->lendinglibrary) : null
            ]
        ];

        // Check if the request was newly created
        if ($model->wasRecentlyCreated) {
            // This is a new insertion, let's index it to elasticsearch
            $client->index($params);
        } else {
            // This is an update, let's update it in elasticsearch
            $client->update([
                'index' => 'docdelrequests',
                'id' => $model->id,
                'body' => [
                    'doc' => $params['body']
                ]
            ]);
        }
        
        return parent::saved($model);
    }

    public function deleting($model)
    {
        return parent::deleting($model);
    }

    public function restoring($model)
    {
        return parent::restoring($model);
    }
}
