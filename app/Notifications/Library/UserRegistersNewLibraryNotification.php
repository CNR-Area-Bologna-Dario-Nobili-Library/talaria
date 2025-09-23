<?php

namespace App\Notifications\Library;

use App\Notifications\MandatoryNotification;
use Illuminate\Bus\Queueable;


class UserRegistersNewLibraryNotification extends MandatoryNotification
{
    use Queueable;
    
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($model)
    {                
        parent::__construct();
        $this->object=$model;
        $this->url=config('app.frontend_url').'/library/'.$this->object->id;       //go to library dashboard
        
        //Library data
        $blibArray=$this->object->toArray();
        foreach($blibArray as $k=>$v) {
            if( isset($v) && !empty($v) )
                $this->extraDataArr["borrowing_library_".$k]=$v;
        }

        $binst=$this->object->institution;
        $bcountry=$this->object->country;

        if(isset($binst))
            $this->extraDataArr["borrowing_library_institution"]=$binst->name;
        if(isset($bcountry))
            $this->extraDataArr["borrowing_library_country"]=$bcountry->name;           
        
    }
}
