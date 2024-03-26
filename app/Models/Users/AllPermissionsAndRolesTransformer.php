<?php namespace App\Models\Users;

use Carbon\Carbon;
use App\Models\BaseTransformer;
use Illuminate\Database\Eloquent\Model;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use League\Fractal\ParamBag;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;
 
class AllPermissionsAndRolesTransformer extends BaseTransformer
{

    //OLD
    public function transform($model)
    {  
        $restr=new AbilitiesTransformer();
        $temprestr=new TemporaryAbilitiesTransformer();
        $rolestr=new RolesTransformer();        
        return [
            'roles'=>$rolestr->transform($model),
            'resources'=>$restr->transform($model),
            'tempresources'=>$temprestr->transform($model),
        ];

    }
/* //NEW
    protected $defaultIncludes = [
        'tempresources',    
        'roles'    ,
        'resources'
    ];



    public function includeTempResources(Model $model)
    {        
         return $this->collection($model->pending_resources(), new TemporaryAbilityTransformer());
    }

    
    public function includeRoles(Model $model)
    {
        return $this->item($model, new RolesTransformer());

    }

    public function includeResources(Model $model)
    {
        return $this->item($model, new AbilitiesTransformer());
    }
    */

    
    /****  TEMP CODE  *****
    

            //pending resources            
            //$pending_perm_array=$user->pending_resources()->toArray();
            
            $pending_perm=$user->pending_resources();                      
                        
            $pending_perm_array=[];
            foreach ($pending_perm as $element) {
                $className=$element->entity_type;
                $entity = $className::findOrFail($element->entity_id);
                $tablename=$entity->getTable();
                $pending_perm_array[$tablename][] = [
                    'resource'=>[
                        'id'=>$element->entity_id,
                        'name'=>$entity->name
                    ],
                    'permissions'=>explode(',',$element->abilities),
                    'status'=>$element->status,
                    'created_at'=>$element->created_at,
                    'updated_at'=>$element->updated_at,
                ];
            }
            
            //Merge Abilities+Temporary Abilities           
            
    
    
    */

    /*protected $defaultIncludes = [
        'roles',
        'resources',
        'tempresources',
    ];


    protected $availableIncludes = [

    ];

    public function includeRoles(Model $model)
    {
        return $this->item($model, new RolesTransformer());

    }

    public function includeResources(Model $model)
    {
        return $this->item($model, new AbilitiesTransformer());
    }

    public function includeTempResources(Model $model)
    {
        return $this->item($model->pending_resources, new TemporaryAbilityTransformer());
    }

    public function toArray(Model $model)
    {
        $to_merge = [                    
        ];
        return $this->applyTransform($model, $to_merge);
    }

    public function transform(Model $model)
    {
        $to_merge = [

        ];
        return $this->applyTransform($model, $to_merge);
    }*/

}
