<?php

namespace App\Notifications\Library;

use App\Notifications\BaseNotification;
use Illuminate\Bus\Queueable;



class PatronAskJoinLibraryAwaitsApprovalNotification extends BaseNotification
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

        $this->url=config('app.frontend_url').'/patron/my-libraries';
        
        $lib=$model->library;        
                                     
        if(isset($lib))
        {
            $libArray=$lib->toArray();
            foreach($libArray as $k=>$v) {
                if( isset($v) && !empty($v) )
                    $this->extraDataArr["library_".$k]=$v;
            }   
            
            $linst=$lib->institution;        
            $lcountry=$lib->country;

            if(isset($linst))
                $this->extraDataArr["library_institution"]=$linst->name;

            if(isset($lcountry))
                $this->extraDataArr["library_country"]=$lcountry->name;
        }
                          


        
        //Patron Join Request data
        $this->extraDataArr+=['department'=>$model->department?$model->department->name:'',
                                'title'=>$model->title?$model->title->name:'', 
                                'user_referent'=>$model->user_referent,
                                'user_mat'=>$model->user_mat
        ];
                                    
    }           
}
