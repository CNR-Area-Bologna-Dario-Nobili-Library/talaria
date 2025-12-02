<?php

namespace App\Notifications\Library;

use App\Notifications\BaseNotification;
use Illuminate\Bus\Queueable;



class PatronAskJoinLibraryNotification extends BaseNotification
{
    use Queueable;
    
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    //model is a LibraryUser  
    public function __construct($model)
    {                
        parent::__construct();

        $this->url=config('app.frontend_url').'/library/'.$model->library_id."/patrons";
        
        //$lib=$model->library();
        $user=$model->user;
                                     
        if(isset($user))
        {
            $userArray=$user->toArray();
            foreach($userArray as $k=>$v) {
                if( isset($v) && !empty($v) )
                    $this->extraDataArr["user_".$k]=$v;
            }            
        }
        
        //Patron Join Request data
        $this->extraDataArr+=['department'=>$model->department?$model->department->name:'',
                                'title'=>$model->title?$model->title->name:'', 
                                'user_referent'=>$model->user_referent,
                                'user_mat'=>$model->user_mat
        ];
                                    
    }           
}
