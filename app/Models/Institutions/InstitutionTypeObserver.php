<?php namespace App\Models\Institutions;

use App\Models\BaseObserver;
use \Auth;

class InstitutionTypeObserver extends BaseObserver
{

    protected $rules = [
        'name' => 'required',
    ];


    protected function setConditionalRules($model)
    {
//        $this->validator->sometimes('member_id', "required", function ($input) use ($model) {
//            return $model->type === 'physical';
//        });
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
        //non posso eliminare un tipo associato a istituzioni
        if($model->institutions->count()>0) return false;

        return parent::deleting($model);
    }

    public function restoring($model)
    {
        return parent::restoring($model);
    }

}
