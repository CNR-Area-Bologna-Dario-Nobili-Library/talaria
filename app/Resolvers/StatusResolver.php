<?php

namespace App\Resolvers;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Auth;
use App\Models\Users\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use App\Notifications\BaseNotification;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Auth\User as AuthUser;
use Illuminate\Support\Facades\Log;

use App\Events\AppNotificationEvent;
use App\Support\RealtimeBroadcaster;
/**
 * Created by PhpStorm.
 * User: halphass
 * Date: 15/03/16
 * Time: 10:13
 */
class StatusResolver
{
    protected $model;
    protected $status;
    protected $user;
    protected $flow;


    protected $statusController;
    protected $statusForeignKey;
    protected $flow_tree;

    protected $next_statuses=[];

    /*
    TODO: [MAYBE] trovare modo furbo x aggiungere la possibilità di fare delle azioni prima e dopo il cambio status: es: notifica e/o email ?
            'before'    =>  [],
            'after'    =>  [],
    TODO: trovare il modo di definire un campo "custom" x lo stato in base al modello             
    */

    public function __construct(Model $model, $user=false)
    {
        if(!$model->exists)
            throw (new ModelNotFoundException())->setModel(get_class($model));

        $this->model = $model;

        $this->status = $this->model->getStatus();

        if(!is_bool($user) && $user instanceof User)
            $this->user = $user;
        else
            $this->user = \Auth::user();

        /*
         * Status Change Flow Tree
         */
        $this->flow_tree = config('status_flow.status_resolver.'.get_class($this->model).'.flow_tree');

        /*
         * check status change possibilities
         */
        $this->verifyNextStatuses();

        return $this;
    }

    /**
     * Define the status's possibility to change.
     *
     * @param  void
     * @return $this
     */
    public function verifyNextStatuses(){
        $this->flow = collect($this->flow_tree[$this->status]);
        if($this->flow->has('next_statuses'))
        {
            foreach ($this->flow->get('next_statuses') as $next) {
                $this->next_statuses[$next] = [
                    'name'  => $next,
                    'user_could_proceed' => $this->checkRole($next),
                    'errors'    =>  $this->checkConstraint($next)
                ];
            }
        }    
        $this->next_statuses = collect($this->next_statuses);
        return $this;
    }


    /**
     * Verify all Constraints for the status change.
     *
     * @param  string status
     * @return array errors
     */
    public function checkConstraint($status)
    {
        $errors = [];
        if($this->user && Arr::has($this->flow_tree,"$status.constraints"))
        foreach ($this->flow_tree[$status]['constraints'] as $constraint)
        {
            $verify = $this->model->$constraint();
            if( is_bool($verify) && !$verify )
                $errors[] = trans(get_class($this->model).'.status.not_'.$constraint);
            elseif( (is_array($verify) && count($verify)>0) )
                $errors = array_merge($errors,$verify);
        }        
//        if(count($errors))
//            exit(print_r($errors));
        return $errors;
    }



    /**
     * Verify users permissions to change status.
     *
     * @param  string status
     * @return boolean
     */
    public function checkRole($status)
    {
        if($this->flow_tree[$status]['role'] && is_array($this->flow_tree[$status]['role']))
        {
            if(count($this->flow_tree[$status]['role'])>0)
                return $this->user->hasRole($this->flow_tree[$status]['role']);                
        }    
        //if no role specified
        return true;    
    }


    /**
     * Change Status Process.
     *
     * @param  string $newStatus
     * @return request's response
     */
    public function changeStatus($newStatus,$others=null,$userCheck=true)
    {
        //Log::info("StatusRes: CLASS:".class_basename($this->model)." Status:".$newStatus);
        
        if($newStatus === $this->status)
            return $this->model->getStatus();
        /*
         * check if status could be changed
         */
        if(!$this->next_statuses->has($newStatus))
            throw new \Illuminate\Auth\Access\AuthorizationException('Unacceptable Status Change.');

        $possibility = $this->next_statuses->get($newStatus);

        /*
         * check if user can change status
         */
        if($userCheck && !$possibility['user_could_proceed'])
            throw new \Illuminate\Auth\Access\AuthorizationException('This User has no right to Change Status.');

        /*
         * validate change
         */
        if(count($possibility['errors']) > 0)
            throw new \Dingo\Api\Exception\ValidationHttpException([$possibility['errors']]);

        $statusfield=$this->model->getStatusField();
        $status = [
                $statusfield=>  $newStatus,
        ];
        if(is_array($others))
            $status = array_merge($others,$status);

        foreach ($status as $k=>$v)
        {
            $this->model->setAttribute($k,$v);
        }    

        $this->model->save();

        //handle jobs
        $this->jobs();

        //handle notifications
        $this->notify();
        
        return $this->model;
    }

    public function jobs() {
        //executing jobs   
        //Log::info("StatusRes JOBS");
        $this->flow = collect($this->flow_tree[$this->model->getStatus()]); 
        if($this->flow->has('jobs'))
        {                      
            foreach ($this->flow->get('jobs') as $jobclass) {                
                $jobclass::dispatchNow($this->model);                
            }
        }
        //Log::info("Status resolver jobs exit");  
    }

    public function notify()
    {                     
        $this->flow = collect($this->flow_tree[$this->model->getStatus()]); /*[$this->model->status()->first()->status]*/
        $collection = new Collection(); //collection of array object [user, notificationClass] that has to receive the notification (of the class specified) and it expects users of the form [user_id,email] because they come from "userwithpermissions.. " (i.e. from "operators") 
        if($this->flow->has('notify'))
        {
             //Log::info("Status resolver NOTIFY:");  
            foreach ($this->flow->get('notify') as $entity=>$methodarr) {
                
                    switch ($entity){
                        case 'Model':

                            $methodslist=[];

                            if(!is_array($methodarr))
                            {
                                $notificationClass=(new \ReflectionClass($this->model))->getShortName()."Notification"; 
                                $methodslist=[ [$methodarr,$notificationClass] ];  //converto in array di array
                            }
                            else                             
                                $methodslist=$methodarr;                                                            


                            foreach($methodslist as $entry) {   //entry = [method,NotifyClass]
                                                
                                $method=$entry[0];
                                $users=$this->model->$method();  //returns a Collection of User object
                                //Log::info("method: ".$method);

                                if (is_object($users) && $users instanceof User) //is just a single User
                                {
                                    $u=$users; //get the user
                                    $users=new Collection();  //rewrite $users as new empty Collection
                                    
                                    $myu=array("user_id"=>$u->id,"email"=>$u->email);

                                    $users->add($myu);

                                    //Log::info("user singolo");
                                }   

                                $classname="App\\Notifications\\".$entry[1];       
                                                                
                                if(class_exists($classname) && $users && $users->count()>0)
                                {
                                        foreach ($users as $u) {
                                            $collection->push([$u,$classname]);                                            
                                        }
                                }
                            }
                            break;
                        case 'User': //in this case we have only a string that's the User's class method to call
                            $items = User::$methodarr();
                            $notificationClass="App\\Notifications\\".(new \ReflectionClass($this->model))->getShortName()."Notification"; 
                            if(class_exists($notificationClass) && $items && $items->count())
                            {
                                    foreach ($items as $item) {                                        
                                        $collection->push([$item,$notificationClass]);
                                    }
                            }
                            break;
                    }              
            }    

            //Notify to users (get distinct users by filtering email address ad notification class!)
            if($collection && $collection->count()>0)
            {      

                $unique = $collection->unique(function ($item,$coll) {

                    return $item[0]["email"].$item[1];
                
                });
                
                                 
                $users=$unique->values()->all();
                
                //$collection->unique('user_id')->each(function ($arr,$coll) {                       
                $currentUserId = $this->user ? $this->user->id : null;

                foreach($users as $arr)
                {
                    $item=$arr[0];
                    $noti=$arr[1];

                    // Skip notifying the user who performed the action
                    /*if($currentUserId && $item["user_id"] == $currentUserId) {
                        //Log::info("Skip notify to action user: ".$item["email"]);
                        continue;
                    }*/

                    $bn=new $noti($this->model);

                    $u=User::findOrFail($item["user_id"]);
                    //Log::info("notify to User: ".$u->user_service_email);
                    $u->notify($bn);
                    RealtimeBroadcaster::fromNotification($this->model, $u, $bn);                
                }   
                                                                                      
                //});


            }
        }
         //Log::info("Status resolver notify exit");  
        //return false;
    }

}
