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
                                     
         //Library data
        $blibArray=$lib->toArray();
        foreach($blibArray as $k=>$v) {
            if( isset($v) && !empty($v) )
                $this->extraDataArr["borrowing_library_".$k]=$v;
        }

        $binst=$lib->institution;
        $bcountry=$lib->country;

        if(isset($binst))
            $this->extraDataArr["borrowing_library_institution"]=$binst->name;
        if(isset($bcountry))
            $this->extraDataArr["borrowing_library_country"]=$bcountry->name;      
                                  
        //Patron Join Request data
        $this->extraDataArr+=['department'=>$model->department?$model->department->name:'',
                                'title'=>$model->title?$model->title->name:'', 
                                'user_referent'=>$model->user_referent,
                                'user_mat'=>$model->user_mat
        ];
                                    
    }           
}
