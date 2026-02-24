<?php namespace App\Models\Libraries;

use App\Models\BaseObserver;
use \Auth;
use Carbon\Carbon;
use Illuminate\Validation\Rule;



class LibraryObserver extends BaseObserver
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
            'profile_type'=>['required','integer',Rule::in([config('constants.library_profile_type.basic'),config('constants.library_profile_type.full')])],
            'institution_id'=> 'required|integer|exists:institutions,id',
            'subject_id'=> 'required|integer|exists:subjects,id',
            'country_id'=> 'required|integer|exists:countries,id',            
            'status'=>['nullable','integer',Rule::in([
                config("constants.library_status.new"),
                config("constants.library_status.enabled"),
                config("constants.library_status.disabled"),
                config("constants.library_status.renewing"),
                config("constants.library_status.disabled_bad"),
                config("constants.library_status.disabled_subscription_expired"),
                config("constants.library_status.disabled_didntpaid")
            ])],
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
         //ogni nuova biblio va messa in stato=new
         $model->status=config("constants.library_status.new");
         $model->registration_date=Carbon::now();
         return parent::creating($model);
    }


    public function saving($model)
    {
        //sto aggiornando lo stato e voglio abilitare la biblio
        if($model->id && $model->isDirty('status')&&$model->status==config("constants.library_status.enabled"))
        {
            if(!$model->canBeEnabled()) return false;
        } 

        return parent::saving($model);
    }

    public function saved($model)
    {        
        return parent::saved($model);

    }

    public function deleting($model)
    {
        //posso eliminare SOLO una biblio nuova
        if($model->status==config("constants.library_status.new"))            
            return parent::deleting($model);
        return false;    
    }

    public function restoring($model)
    {
        return parent::restoring($model);
    }
    
    
}
