<?php namespace App\Models\References;

use App\Models\BaseObserver;
use \Auth;
use Illuminate\Validation\Rule;

class ReferenceObserver extends BaseObserver
{
    public function __construct()
    {
        $this->rules = $this->initRules();
        parent::__construct();
    }

    //Nota: in questo caso non ho potuto preparare l'array $rules perchè config() viene risolta a run-time mentre l'array $rules viene creato a compile-time, quindi ho dovuto creare un metodo initRules() che viene chiamato a run-time per inizializzare l'array $rules
    protected function initRules() {
        return [
//        'email' => 'required|email',
//        'name' => 'required',
//        'user_id' => 'required|integer|exists:users,id',
          'material_type'=>['required','integer',Rule::in([
              config("constants.reference_material_type.book"),
              config("constants.reference_material_type.article"),
              config("constants.reference_material_type.thesis"),
              config("constants.reference_material_type.manuscript"),
              config("constants.reference_material_type.cartography")
          ])],
        ];
    }


    protected function setConditionalRules($model)
    {
//        $this->validator->sometimes('member_id', "required", function ($input) use ($model) {
//            return $model->type === 'physical';
//        });
    }

    public function saving($model)
    {
         //non posso modificare un rif che è attualmente in richiesta o che è stato richiesto
         if($model->patronddrequests()->count()>0)
            return false; 
    
        return parent::saving($model);

    }

    public function saved($model)
    {
        return parent::saved($model);

    }

    public function deleting($model)
    {
        //non posso eliminare un rif che è attualmente in richiesta
        if($model->activepatronddrequests()->count()>0)
            return false; 

        return parent::deleting($model);
    }

    public function restoring($model)
    {
        return parent::restoring($model);
    }

}
