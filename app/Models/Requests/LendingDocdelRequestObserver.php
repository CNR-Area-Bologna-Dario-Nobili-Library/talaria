<?php namespace App\Models\Requests;

use App\Models\BaseObserver;
use \Auth;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Support\Facades\Log;

class LendingDocdelRequestObserver extends BaseObserver
{

    protected $rules = [
        'lending_library_id' => 'nullable|integer|exists:libraries,id',
        'reference_id' => 'required|integer|exists:references,id',              
    ];

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
        if(auth() && auth()->user()) {
            $userid = auth()->user()->id;
            $model->lending_operator_id=$userid;
        }

        return parent::creating($model);
    }

    
    public function saving($model)
    {                
        if(auth() && auth()->user()) {
            $userid = auth()->user()->id;
            $model->lending_operator_id=$userid;
        }             
        
        if($model->isDirty('lending_archived'))
            $model->lending_archived_date=Carbon::now();        

        return parent::saving($model);

    }

    public function saved($model)
    {
        /** @var Elasticsearch\Client $client */
        $client = app('Elasticsearch\Client');

        // Elasticsearch request body params + lending library in case of accepted orphaned request
        $params = [
            'index' => 'docdelrequests',
            'id' => $model->id,
            'body' => [
                'id' => $model->id,
                // 'request_date' => \Carbon\Carbon::parse($model->request_date)->format('Y-m-d H:i:s'),
                'fulfill_date' => \Carbon\Carbon::parse($model->fulfill_date)->format('Y-m-d H:i:s'),
                'borrowing_status' => $model->borrowing_status,
                'lending_status' => $model->lending_status,
                'fulfill_type' => $model->fulfill_type,
                'notfulfill_type' => $model->notfulfill_type,
                'forward' => $model->forward,
                'reference' => $model->reference->only([
                    'id', 'material_type', 'pub_type', 'pub_title', 'pubyear', 'issn', 'isbn', 'oa_link'
                ]),
                'lending_library' => $model->lendinglibrary ? $this->createLibraryObject($model->lendinglibrary) : null
            ]
        ];

        $client->update([
            'index' => 'docdelrequests',
            'id' => $model->id,
            'body' => [
                'doc' => $params['body']
            ]
        ]);

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
