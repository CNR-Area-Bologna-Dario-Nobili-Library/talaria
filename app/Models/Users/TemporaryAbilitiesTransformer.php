<?php namespace App\Models\Users;

use App\Models\BaseLightTransformer;
use App\Models\BaseTransformer;
use App\Models\Users\UserLightTransformer;
use Illuminate\Database\Eloquent\Model;

//NOTE: $model is always a User model!!! 
class TemporaryAbilitiesTransformer extends BaseTransformer
{

    public function transform($model) {
       
        //user's pending resources (get from user's trait)                            
        $pending_perm=$model->pending_resources();                      
                    
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
                'id'=>$element->id,               
                'permissions'=>explode(',',$element->abilities),
                'status'=>$element->status,
                'created_at'=>$element->created_at,
                'updated_at'=>$element->updated_at,
            ];
        }                

        return $pending_perm_array;
    }
}
