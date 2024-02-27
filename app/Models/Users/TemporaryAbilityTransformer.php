<?php namespace App\Models\Users;

use App\Models\BaseLightTransformer;
use App\Models\BaseTransformer;
use App\Models\Users\UserLightTransformer;
use Illuminate\Database\Eloquent\Model;

class TemporaryAbilityTransformer extends BaseTransformer
{   
    protected $availableIncludes = [          
    ];

    protected $defaultIncludes = [
        'library',
        'institution',
        'project',
        'consortium',
        'user',        
    ];

    public function includeLibrary(Model $model) {
        if(isset($model->entity_type) && $model->entity_type == 'App\\Models\\Libraries\\Library')
            return $this->item($model->library, new BaseLightTransformer());
    }

    public function includeInstitution(Model $model) {
        if(isset($model->entity_type) && $model->entity_type == 'App\\Models\\Institutions\\Institution')
            return $this->item($model->institution, new BaseLightTransformer());
    }


    public function includeConsortium(Model $model) {
        if(isset($model->entity_type) && $model->entity_type == 'App\\Models\\Institutions\\Consortium')
            return $this->item($model->consortium, new BaseLightTransformer());
    }

    public function includeProject(Model $model) {
        if(isset($model->entity_type) && $model->entity_type == 'App\\Models\\Projects\\Project')
            return $this->item($model->project, new BaseLightTransformer());
    }


    public function includeUser(Model $model)
    {
        if(isset($model->user) && $model->user)
            return $this->item($model->user, new UserLightTransformer());
    }

    public function transform(Model $model)
    {        
        $to_merge = [

        ];
        return $this->applyTransform($model, $to_merge);
    }

}
