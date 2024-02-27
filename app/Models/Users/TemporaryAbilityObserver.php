<?php namespace App\Models\Users;

use App\Models\BaseObserver;
use \Auth;
use Str;

class TemporaryAbilityObserver extends BaseObserver
{
    protected $rules = [
        'entity_id' => 'required|max:255',
        'entity_type' => 'required|max:255',
        'abilities' => 'required|max:255',
        'user_id' => 'nullable|exists:users,id',
        'user_name' => 'nullable|max:255',
        'user_surname' => 'nullable|max:255',
        'user_email' => 'nullable|email|max:255',
    ];
    
    //this will be called at every saving()
    protected function setConditionalRules($model){
        //TODO: do some checks on existing entity_id passed based on type
    }


    public function updating($model)
    {       
    }
   
    public function creating($model)
    {       
        $model->status=config("constants.temporary_ability_status.waiting");        
        return parent::creating($model); 
    }   
}
