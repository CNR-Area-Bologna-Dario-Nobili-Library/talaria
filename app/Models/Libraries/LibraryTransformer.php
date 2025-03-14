<?php namespace App\Models\Libraries;

use App\Models\BaseLightTransformer;
use App\Models\Institutions\InstitutionTransformer;
// use App\Models\Users\TitleTransformer;
use Carbon\Carbon;
use App\Models\BaseTransformer;
use Illuminate\Database\Eloquent\Model;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use League\Fractal\ParamBag;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;

class LibraryTransformer extends BaseTransformer
{
    protected $policy = [
        'manage' => ['granted_permissions']
    ];

    protected $availableIncludes = [
        'granted_permissions',
        'departments',
        'institution',        
        'country',
        'subject',
        'catalogs',
        'identifiers',
        'projects',
        'deliveries'
    ];

    protected $defaultIncludes = [
        'granted_permissions',
        'institution',        
        'country',
        'subject',
        'projects',
        'catalogs',
        'identifiers',
    ];

    public function includeGrantedPermissions(Model $model)
    {        
        $transf = new BaseLightTransformer();
        $transf->setCallback(function ($model) {
            return $model->user_with_permissions();
        });
        return $this->item($model, $transf);
    }
    public function includeDepartments(Model $model)
    {
        if($model->departments)
            return $this->collection($model->departments, new DepartmentTransformer());
    }
    public function includeInstitution(Model $model)
    {
        if($model->institution)
            return $this->item($model->institution, new InstitutionTransformer());
    }
    public function includeCountry(Model $model)
    {
        if($model->country)
            return $this->item($model->country, new BaseLightTransformer());
    }
    public function includeSubject(Model $model)
    {
        if($model->subject)
            return $this->item($model->subject, new BaseLightTransformer());
    }

    public function includeCatalogs(Model $model)
    {
        if($model->catalogs)
            return $this->collection($model->catalogs, new BaseLightTransformer());
    }

    public function includeProjects(Model $model)
    {
        if($model->projects)
            return $this->collection($model->projects, new BaseLightTransformer());
    }

    public function includeDeliveries(Model $model)
    {
        if($model->deliveries)
            return $this->collection($model->deliveries, new DeliveryTransformer());
    }

    public function includeIdentifiers(Model $model)
    {
        //$ident = $model->identifiers()->withPivot('cod')->get();
        
        if($model->identifiers)
            return $this->collection($model->identifiers, new IdentifierLibraryTransformer());
    }




    public function transform(Model $model)
    {
        //$faker=\Faker\Factory::create('it_IT');

        $to_merge = [];
        
       /*
        $to_merge = [
            //just to test localization (because now we haven't such data stored)
            //'lat'=> !$model->lat?$faker->latitude(35,45):$model->lat, 
            //'lon'=> !$model->lon?$faker->longitude(10,15):$model->lon,                                  
        ];
        */
        return $this->applyTransform($model, $to_merge);
    }


//    public function includeAbilities(Model $model)
//    {
//        $transf = new BaseLightTransformer();
//        $transf->setOnly([
//            'id',
//            'name',
//            'entity_id',
//            'entity_type',
//        ]);
//        return $this->collection(collect($model->abilities), $transf);
//    }

//    public function includePermissions(Model $model)
//    {
//        $transf = new BaseLightTransformer();
//        $transf->setOnly([
//            'id',
//            'name',
//            'entity_id',
//            'entity_type',
//            'ability_id',
//        ]);
//        return $this->collection(collect($model->permissions), $transf);
//    }
}
