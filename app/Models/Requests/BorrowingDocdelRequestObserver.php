<?php

namespace App\Models\Requests;

use App\Helper\StatsHelper;
use App\Models\BaseObserver;
use \Auth;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

use App\Models\Requests\DocdelRequest;
use Exception;

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


    public function creating($model)
    {
        //quando salvo viene messa in richiesta in quanto di default è status=requested         
        $model->request_type = 0; //DD
        $model->forward = 0;
        $model->request_date = null;
        $model->borrowing_status = "newrequest";

        if ($model->patrondocdelrequest)
            $model->operator_id = null;
        else {
            if (auth() && auth()->user()) {
                $userid = auth()->user()->id;
                $model->operator_id = $userid;
            }
        }

        return parent::creating($model);
    }


    public function saving($model)
    {
        if ($model->id) { //il modello esiste già => sono in update!
            if (auth() && auth()->user()) {
                $userid = auth()->user()->id;
                $model->operator_id = $userid;
            }
        }

        if ($model->isDirty('download'))
            $model->download_date = Carbon::now();

        if ($model->isDirty('forward'))
            $model->forward_date = Carbon::now();

        if ($model->isDirty('archived'))
            $model->archived_date = Carbon::now();

        if ($model->isDirty('trash_type'))
            $model->trash_date = Carbon::now();

        //when borrowing cancel request     
        if ($model->isDirty('lending_archived'))
            $model->lending_archived_date = Carbon::now();

        if ($model->isDirty('all_lender'))
        {
            // If request has all_lender set to 1 AND orphaned is 0, set orphaned to 1
            if ($model->all_lender == 1 && $model->orphaned == 0) {
                $model->orphaned = 1;
            }

            // Special case: if request was previously sent to all lenders and then canceled --> the request returns to status new and we must set orphaned back to 0
            if ($model->all_lender == 0 && $model->orphaned == 1 && $model->borrowing_status == "newrequest") {
                $model->orphaned = 0;
            }
        }

        return parent::saving($model);
    }

    public function saved($model)
    {
        // After model is saved, index it to Elasticsearch

        /** @var Elasticsearch\Client $client */
        $client = app('Elasticsearch\Client');

        // Instantiate the trasformer
        $transformer = new BorrowingDocdelRequestTransformer();

        $aggregated_statuses = StatsHelper::aggregateStatus($model);

        // Elasticsearch request body params 
        $params = [
            'index' => 'docdel_requests',
            'id' => $model->id,
            'body' => [
                'id' => $model->id,
                'request_date' => $model->request_date ? \Carbon\Carbon::parse($model->request_date)->format('Y-m-d H:i:s') : null,
                // 'fulfill_date' => \Carbon\Carbon::parse($model->fulfill_date)->format('Y-m-d H:i:s'),
                'borrowing_status' => $model->borrowing_status,
                'lending_status' => $model->lending_status,
                'aggregated_borrowing_status' => $aggregated_statuses['aggregated_borrowing_status'],
                'aggregated_lending_status' => $aggregated_statuses['aggregated_lending_status'],
                'trash_type' => $model->trash_type,
                'archived' => $model->archived,
                'orphaned' => 0,
                'request_special_delivery' => $model->request_special_delivery ?? 0,
                'request_pdf_editorial' => $model->request_pdf_editorial ?? 0,
                // 'fulfill_type' => $model->fulfill_type,
                // 'notfulfill_type' => $model->notfulfill_type,
                'forward' => $model->forward,
                'reference' => $model->reference->only([
                    'id',
                    'material_type',
                    'pubyear',
                    'oa_link',
                    'doi',
                    'pmid',
                    'issn',
                    'issn_l',
                    'isbn',
                    'sid',
                    'sbn_docid',
                    'acnp_cod',
                    'pub_title'
                ]),
                'borrowing_library' => $transformer->createLibraryObject($model->borrowinglibrary),
                'lending_library' => $model->lendinglibrary ? $transformer->createLibraryObject($model->lendinglibrary) : null
            ]
        ];

        // Log::info("borrowing observer invoked: ", $model->toarray());

        // Check if the request was newly created
        if ($model->wasRecentlyCreated) {
            try {
                // This is a new insertion, index it to elasticsearch
                $client->index($params);
            } catch (Exception $e) {
                Log::error("Error indexing to elasticsearch: " . $e->getMessage());
            }
        } else {
            // This is an update, update it in elasticsearch

            // If it is an update and all_lender is 1, copy it to Elasticsearch index
            if ($model->all_lender) {
                $params['body']['orphaned'] = $model->all_lender;
            } elseif ($model->borrowing_status == "newrequest") {
                // This case is when a orphaned request is canceled so the flag will go back to 0
                $params['body']['orphaned'] = 0;
            }

            try {
                $client->update([
                    'index' => 'docdel_requests',
                    'id' => $model->id,
                    'body' => [
                        'doc' => $params['body']
                    ]
                ]);
            } catch (Exception $e) {
                Log::error("Error indexing to elasticsearch: " . $e->getMessage());
            }
        }

        return parent::saved($model);
    }

    public function deleting($model)
    {
        Log::info("I should delete this model:", $model->toArray());

        /** @var Elasticsearch\Client $client */
        $client = app('Elasticsearch\Client');

        try {
            $client->delete([
                'index' => 'docdel_requests',
                'id' => $model->id,
            ]);
        } catch (Exception $e) {
            Log::error("Error deleting from elasticsearch: " . $e->getMessage());
        }
        return parent::deleting($model);
    }

    public function restoring($model)
    {
        return parent::restoring($model);
    }
}
