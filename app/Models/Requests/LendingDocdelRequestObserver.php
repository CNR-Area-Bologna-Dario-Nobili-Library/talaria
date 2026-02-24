<?php

namespace App\Models\Requests;

use App\Helper\StatsHelper;
use App\Models\BaseObserver;
use \Auth;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

/* Note: laravel validation rules can be used are described here: https://laravel.com/docs/6.x/validation#rule-boolean */

class LendingDocdelRequestObserver extends BaseObserver
{

 public function __construct()
    {
        $this->rules = $this->initRules();
        parent::__construct();
    }

    //Nota: in questo caso non ho potuto preparare l'array $rules perchè config() viene risolta a run-time mentre l'array $rules viene creato a compile-time, quindi ho dovuto creare un metodo initRules() che viene chiamato a run-time per inizializzare l'array $rules
    protected function initRules() {
        return  [
            'lending_library_id' => 'nullable|integer|exists:libraries,id',
            'borrowing_library_id' => 'nullable|integer|exists:libraries,id',
            'reference_id' => 'required|integer|exists:references,id',
            'lending_status'=>['nullable','string',Rule::in([
                "requestReceived",
                "willSupply",
                "cancelRequested",
                "canceledAccepted",
                "unFilled",
                "copyCompleted"
            ])],
            'all_lender'=>'nullable|boolean',
            'lending_archived'=>'nullable|boolean',
            'lending_operator_id' => 'nullable|integer|exists:users,id',
            'file_status'=>'nullable|integer|max:2',
            'fulfill_type'=>'nullable|integer|max:7',
            'notfulfill_type'=>'nullable|integer|max:7',     
        ];
    }

    public function creating($model)
    {
        if (auth() && auth()->user()) {
            $userid = auth()->user()->id;
            $model->lending_operator_id = $userid;
        }

        return parent::creating($model);
    }


    public function saving($model)
    {
        if (auth() && auth()->user()) {
            $userid = auth()->user()->id;
            $model->lending_operator_id = $userid;
        }

        if ($model->isDirty('lending_archived'))
            $model->lending_archived_date = Carbon::now();

        return parent::saving($model);
    }

    public function saved($model)
    {

        /** @var Elasticsearch\Client $client */
        $client = app('Elasticsearch\Client');

        // Instantiate the trasformer
        $transformer = new LendingDocdelRequestTransformer();

        $aggregated_statuses = StatsHelper::aggregateStatus($model);
        // Log::info("I am lender", $aggregated_statuses);

        // Elasticsearch request body params + lending library in case of accepted orphaned request
        $params = [
            'index' => 'docdel_requests',
            'id' => $model->id,
            'body' => [
                'id' => $model->id,
                // 'request_date' => \Carbon\Carbon::parse($model->request_date)->format('Y-m-d H:i:s'),
                'fulfill_date' => $model->fulfill_date ? \Carbon\Carbon::parse($model->fulfill_date)->format('Y-m-d H:i:s') : null,
                'borrowing_status' => $model->borrowing_status,
                'lending_status' => $model->lending_status,
                'aggregated_borrowing_status' => $aggregated_statuses['aggregated_borrowing_status'],
                'aggregated_lending_status' => $aggregated_statuses['aggregated_lending_status'],
                'fulfill_type' => $model->fulfill_type,
                'notfulfill_type' => $model->notfulfill_type,
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
                'lending_library' => $model->lendinglibrary ? $transformer->createLibraryObject($model->lendinglibrary) : null
            ]
        ];

        try {
            $client->update([
                'index' => 'docdel_requests',
                'id' => $model->id,
                'body' => [
                    'doc' => $params['body']
                ]
            ]);
        } catch (Exception $e) {
            Log::error("Error indexing in elasticsearch: " . $e->getMessage());
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
