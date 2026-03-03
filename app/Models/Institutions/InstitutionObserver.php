<?php namespace App\Models\Institutions;

use App\Models\BaseObserver;
use \Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class InstitutionObserver extends BaseObserver
{

    public function __construct()
    {
        $this->rules = $this->initRules();
        parent::__construct();
    }

    //Nota: in questo caso non ho potuto preparare l'array $rules perchè config() viene risolta a run-time mentre l'array $rules viene creato a compile-time, quindi ho dovuto creare un metodo initRules() che viene chiamato a run-time per inizializzare l'array $rules
    protected function initRules() {
        return [           
            'name' => 'required|string',
            'institution_type_id'=>'required|integer|exists:institution_types,id',
            'status'=>['required','integer',Rule::in([
                config("constants.institution_status.pending"),
                config("constants.institution_status.enabled"),
                config("constants.institution_status.disabled")
            ])],
            'country_id'=> 'required|integer|exists:countries,id',
    //        'user_id' => 'required|integer|exists:users,id',
        ];
    }

    protected function setConditionalRules($model)
    {
//        $this->validator->sometimes('member_id', "required", function ($input) use ($model) {
//            return $model->type === 'physical';
//        });
    }

    public function creating($model)
    {         
         $model->status=config("constants.institution_status.pending");     
         return parent::creating($model);
    }


    public function saving($model)
    {
        //sto aggiornando lo stato e lo voglio disattivare
        if($model->id && $model->isDirty('status')&&$model->status==config("constants.institution_status.disabled"))
        {
            if(!$model->canBeDisabled()) return false;
        } 

        return parent::saving($model);

    }

    public function saved($model)
    {
        // Sync to elasticsearch only if name, country_id or institution_type_id changes
        $relevantFields = ['name', 'country_id', 'institution_type_id'];

        if ($model->wasChanged($relevantFields)) {
            $this->syncWithElasticsearch($model);
        }
        return parent::saved($model);
    }

    public function deleting($model)
    {        
        if($model->status==config("constants.institution_status.pending")||$model->status==config("constants.institution_status.disabled"))            
            return parent::deleting($model);
        return false;    
    }

    public function restoring($model)
    {
        return parent::restoring($model);
    }

    protected function syncWithElasticsearch($model)
    {
        /** @var Client $client */
        $client = app('Elasticsearch\Client');
        
        // Need to update every request that involves any library beloging to this institution
        $libraryIds = $model->libraries()->pluck('id')->toArray();

        if (empty($libraryIds)) {
            return;
        }

        // Libraries can be borrowing or lending, so update both sides
        $fieldsToUpdate = ['borrowing_library', 'lending_library'];

        foreach ($fieldsToUpdate as $field) {
            try {
                $client->updateByQuery([
                    'index' => 'docdel_requests',
                    'conflicts' => 'proceed',
                    'body' => [
                        'query' => [
                            // Find requests where the library belongs to this institution
                            'terms' => ["$field.id" => $libraryIds]
                        ],
                        'script' => [
                            'source' => "
                                ctx._source.$field.institution.name = params.instName;
                                ctx._source.$field.institution.institution_type.id = params.instTypeId;
                                ctx._source.$field.institution.institution_type.name = params.instTypeName;
                                ctx._source.$field.institution.country.id = params.countryId;
                                ctx._source.$field.institution.country.name = params.countryName;
                                ctx._source.$field.institution.country.code = params.countryCode;
                            ",
                            'params' => [
                                'instName' => $model->name ?? null,
                                'instTypeId' => $model->institution_type->id ?? null,
                                'instTypeName' => $model->institution_type->name ?? null,
                                'countryId' => $model->country->id ?? null,
                                'countryName' => $model->country->name ?? null,
                                'countryCode' => $model->country->code ?? null
                            ],
                            'lang' => 'painless'
                        ]
                    ]
                ]);
            } catch (\Exception $e) {
                Log::error("Error updating $field in elasticsearch: " . $e->getMessage());
            }
        }
    }

}
