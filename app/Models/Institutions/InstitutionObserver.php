<?php namespace App\Models\Institutions;

use App\Models\BaseObserver;
use \Auth;
use Carbon\Carbon;
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

}
