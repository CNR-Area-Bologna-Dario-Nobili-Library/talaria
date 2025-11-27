<?php

namespace App\Notifications\Operators;

use App\Notifications\MandatoryNotification;
use Illuminate\Bus\Queueable;

class OperatorDeleteNotification extends MandatoryNotification
{
    use Queueable;
    
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    //NOTE: model is $obj=["user"=>$user,"entity"=>(library/institution/project/consortium...)]; 
    public function __construct($model)
    {                
        parent::__construct();
        $this->object=$model;
        $this->url=config('app.frontend_url').'/user/dashboard';       
        
   
        $user=$this->object->user;
        $entity=$this->object->entity;

        $this->extraDataArr=[
            'name'=>$user->name,'surname'=>$user->surname,'email'=>$user->email,             
            'entity_name'=>$entity->name,                       
        ];
    }
}
