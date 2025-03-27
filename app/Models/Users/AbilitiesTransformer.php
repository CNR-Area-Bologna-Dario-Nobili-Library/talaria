<?php namespace App\Models\Users;

use App\Models\BaseLightTransformer;
use Carbon\Carbon;
use App\Models\BaseTransformer;
use Illuminate\Database\Eloquent\Model;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use League\Fractal\ParamBag;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;

class AbilitiesTransformer extends BaseLightTransformer
{

    public function transform($model)
    {
        $resources = $model->permissions()
            ->select('abilities.entity_id','abilities.entity_type','abilities.name')
            ->whereNotNull('abilities.entity_id')
            ->distinct()
            ->get()
            ->map(function ($item) {
                $entity = $item->entity_type::select(['name','status'])->find($item->entity_id);
                if($entity) {
                    $item->resource = $entity->getTable();
                    $item->entity_name = $entity ? $entity->name : '';
                    $item->entity_status = $entity ? $entity->status : '';
                }
                return $item;
            })
            ->filter(function ($item) {
                return $item->entity_name." XXXXX";
            })
            ->groupBy(['resource','entity_id']);
//            return $this->response->collection($resources, new PermissionTransformer);
        $resources_array = [];
        foreach ($resources as $class=>$items) {
            $resources_array[$class] = [];
            foreach ($items as $id=>$perms) {
                $resources_array[$class][] = [
                    'resource' => [
                        'id' => $id,
                        'name' => $perms[0]['entity_name'],
                        'status'=>$perms[0]['entity_status'],
                    ],
                    'permissions' => \Arr::pluck($perms, 'name')
                ];
            }
        }       
        return $resources_array;
    }
}
