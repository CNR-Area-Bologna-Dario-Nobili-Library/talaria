<?php namespace App\Models\Libraries;

use App\Models\BaseObserver;
use \Auth;
use Illuminate\Validation\Rule;

class DeliveryObserver extends BaseObserver
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
            'library_id' => 'required|integer|exists:libraries,id',
            'status'=>['required','integer',Rule::in([
                config("constants.status.enabled"),
                config("constants.status.disabled")
            ])],
            /*'country_id' => 'required|integer|exists:countries,id',*/
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
         $model->status=config("constants.status.enabled");
         return parent::creating($model);
    }


    public function saving($model)
    {
        return parent::saving($model);
    }

    public function saved($model)
    {
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
