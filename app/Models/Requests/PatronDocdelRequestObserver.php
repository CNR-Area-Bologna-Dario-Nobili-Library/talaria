<?php namespace App\Models\Requests;

use App\Models\BaseObserver;
use App\Models\Users\User;
use App\Notifications\DDILL\PatronBorrowingRequestNewNotification;
use App\Notifications\DDILL\PatronRequestNewNotification;
use App\Notifications\DDILL\PatronRequestRequestedNotification;
use \Auth;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use App\Support\RealtimeBroadcaster;
use Illuminate\Validation\Rule;

class PatronDocdelRequestObserver extends BaseObserver
{

    public function __construct()
    {
        $this->rules = $this->initRules();
        parent::__construct();
    }

    //Nota: in questo caso non ho potuto preparare l'array $rules perchè config() viene risolta a run-time mentre l'array $rules viene creato a compile-time, quindi ho dovuto creare un metodo initRules() che viene chiamato a run-time per inizializzare l'array $rules
    protected function initRules() {
        return [
            'borrowing_library_id' => 'required|integer|exists:libraries,id',
            'reference_id' => 'required|integer|exists:references,id',
            'delivery_id' => 'required|integer|exists:deliveries,id',
            'archived'=>'nullable|boolean',
            'cost_policy'=>['nullable','integer',Rule::in([
                config("constants.patrondocdelrequest_cost_policy.deny"),
                config("constants.patrondocdelrequest_cost_policy.accept"),
                config("constants.patrondocdelrequest_cost_policy.inform")
            ])],
            'cost_policy_status'=>['nullable','integer',Rule::in([
                config("constants.patrondocdelrequest_cost_policy_status.rejected"),
                config("constants.patrondocdelrequest_cost_policy_status.accepted"),
                config("constants.patrondocdelrequest_cost_policy_status.notanswer")
            ])],
            'notfulfill_type'=>['nullable','integer',Rule::in([
                config("constants.patrondocdelrequest_notfulfill_type.notavailable"),
                config("constants.patrondocdelrequest_notfulfill_type.usernotenabled"),
                config("constants.patrondocdelrequest_notfulfill_type.usernottaken"),
                config("constants.patrondocdelrequest_notfulfill_type.userrejectcost"),
                config("constants.patrondocdelrequest_notfulfill_type.usernotanswercost"),
                config("constants.patrondocdelrequest_notfulfill_type.notfreerlyavail"),
                config("constants.patrondocdelrequest_notfulfill_type.wrongmetadata"),
                config("constants.patrondocdelrequest_notfulfill_type.lostdocument")
            ])],
            'delivery_format'=>['nullable','integer',Rule::in([
                config("constants.patrondocdelrequest_delivery_format.PaperCopy"),
                config("constants.patrondocdelrequest_delivery_format.File"),
                config("constants.patrondocdelrequest_delivery_format.URL"),
                config("constants.patrondocdelrequest_delivery_format.Other")
            ])],
            'status'=>'nullable|in:requested,canceled,waitingForCost,costAccepted,costNotAccepted,costNotAnswered,readyToDelivery,received,notReceived',         
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
         /* we cannot use fill() because these fields are guarded and will be ignored!! 
         $br->fill([                     
            'patron_docdel_request_id'=>$model->id,
            'reference_id'=>$model->reference_id,
            'borrowing_library_id'=>$model->borrowing_library_id,            
         ]);*/

         //so set them manually
         $br->patron_docdel_request_id=$model->id;
         $br->reference_id=$model->reference_id;
         $br->borrowing_library_id=$model->borrowing_library_id;


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
                    RealtimeBroadcaster::fromNotification($pdr, $u, $bn);
                }    
                
                        
                //Notify to patron
                $user=User::findOrFail($pdr->patron->id);            
                $pnwr=new PatronRequestRequestedNotification($pdr); 
                $user->notify($pnwr);
                RealtimeBroadcaster::fromNotification($pdr, $user, $pnwr);
            }
         }

                     
    }

    public function saving($model)
    {        
        if ($model->isDirty('archived'))
            $model->archived_date = Carbon::now();
        
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
