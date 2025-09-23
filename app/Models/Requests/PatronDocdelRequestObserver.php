<?php namespace App\Models\Requests;

use App\Models\BaseObserver;
use App\Models\Users\User;
use App\Notifications\DDILL\PatronBorrowingRequestNewNotification;
use App\Notifications\DDILL\PatronRequestNewNotification;
use App\Notifications\DDILL\PatronRequestRequestedNotification;
use \Auth;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;


class PatronDocdelRequestObserver extends BaseObserver
{

    protected $rules = [
        'borrowing_library_id' => 'required|integer|exists:libraries,id',
        'reference_id' => 'required|integer|exists:references,id',
        'delivery_id' => 'required|integer|exists:deliveries,id',
    ];


    protected function setConditionalRules($model)
    {
//        $this->validator->sometimes('member_id', "required", function ($input) use ($model) {
//            return $model->type === 'physical';
//        });
    }

    public function creating($model)
    {
         //quando salvo viene messa in richiesta in quanto di default è status=requested
         $model->request_date=Carbon::now();
         return parent::creating($model);
    }

    public function created($model)
    {            
        //Note: instead of calling ::create method, i've used filled
        //because otherwise it will not run constructor, so i cannot fill all
        //fields (inherited by DocDelRequest), but just BorrowingDocdelRequest's own fields
         $br=new BorrowingDocdelRequest();
         $br->fill([                     
            'patron_docdel_request_id'=>$model->id,
            'reference_id'=>$model->reference_id,
            'borrowing_library_id'=>$model->borrowing_library_id,            
         ]);
         if($br->save())
         {  
            // Notify...          
            $pdr=PatronDocdelRequest::find($model->id);           
            
            //only for just "requested" 
            if($pdr->status=="requested")
            {
                $bn=new PatronBorrowingRequestNewNotification($pdr);
                                                        
                //Notify to library manager+users manager        
                $lib=$pdr->library;
                $operators=array();
                $operators+=$lib->manageOperators()->toArray();
                $operators+=$lib->usersOperators()->toArray();
                
                //unique operators
                $operatorsID=array_unique(array_map(function($op) { return $op['user_id']; }, $operators)); 

                //Notify ...
                foreach ($operatorsID as $item) {
                    $u=User::findOrFail($item);                 
                    $u->notify($bn);            
                }    
                
                        
                //Notify to patron
                $user= $u=User::findOrFail($pdr->patron->id);            
                $pnwr=new PatronRequestRequestedNotification($pdr); 
                $user->notify($pnwr);
            }
         }

                     
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
        return parent::deleting($model);
    }

    public function restoring($model)
    {
        return parent::restoring($model);
    }

}
