<?php namespace App\Models\Requests;

use App\Models\BaseLightTransformer;
use Carbon\Carbon;
use App\Models\BaseTransformer;
use App\Models\Libraries\DeliveryTransformer;
use App\Models\Libraries\LibraryTransformer;
use App\Models\Libraries\LibraryUser;
use App\Models\References\ReferenceTransformer;
use Illuminate\Database\Eloquent\Model;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use League\Fractal\ParamBag;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use App\Models\Users\UserLightTransformer;


class LendingDocdelRequestTransformer extends BaseTransformer
{
    protected $availableIncludes = [                                                
    ];

    protected $defaultIncludes = [
        'reference',
        'library',  
        'borrowinglibrary',
        'tags',        
        'operator'
    ];

    public function includeReference(Model $model)
    {
        if($model->reference)
            return $this->item($model->reference, new BaseTransformer());
    }

    public function includeLibrary(Model $model)
    {
        if($model->library)
            return $this->item($model->library, new BaseLightTransformer());  //new BaseLightTransformer());
    }

    public function includeBorrowingLibrary(Model $model)
    {
        if($model->borrowinglibrary)
            return $this->item($model->borrowinglibrary, new LibraryTransformer()); 
             //new BaseLightTransformer());
    }

    public function includeTags(Model $model)
    {
        if($model->tags)
            return $this->collection($model->tags, new BaseLightTransformer());
    }

    public function includeOperator(Model $model)
    {
        if($model->operator)
            return $this->item($model->operator, new UserLightTransformer());
    }    

    public function transform(Model $model)
    {
        $to_merge = [
        ];
        return $this->applyTransform($model, $to_merge);
    }
}
