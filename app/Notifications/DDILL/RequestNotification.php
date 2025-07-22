<?php

namespace App\Notifications\DDILL;

use App\Notifications\BaseMailMessage;
use App\Notifications\BaseNotification;
use Illuminate\Bus\Queueable;



class RequestNotification extends BaseNotification
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

        $this->object=$model;      //model is a Borrowing/LendingDocdelRequest  
        
        $request=$this->object;
        $blib=$this->object->borrowingLibrary;
        
        $llib=$this->object->lendingLibrary;
        
        $this->addTitleIdentifier($request->id); //prepend title with # ID -         

        //Adding all fields from DDRequest + Borr Lib + Lend Lib + Request + Reference
        if(isset($blib))
        {
            $blibArray=$blib->toArray();
            foreach($blibArray as $k=>$v) {
                if( isset($v) && !empty($v) )
                    $this->extraDataArr["borrowing_library_".$k]=$v;
            }

            $binst=$blib->institution;
            $bcountry=$blib->country;

            if(isset($binst))
                $this->extraDataArr["borrowing_library_institution"]=$binst->name;
            if(isset($bcountry))
                $this->extraDataArr["borrowing_library_country"]=$bcountry->name;

        }
        if(isset($llib))
        {
            $llibArray=$llib->toArray();
            foreach($llibArray as $k=>$v) {
                if( isset($v) && !empty($v) )
                    $this->extraDataArr["lending_library_".$k]=$v;
            }
        
            $linst=$llib->institution;        
            $lcountry=$llib->country;

            if(isset($linst))
                $this->extraDataArr["lending_library_institution"]=$linst->name;

            if(isset($lcountry))
                $this->extraDataArr["lending_library_country"]=$lcountry->name;
        }

        $requestArray=$request->toArray();
        foreach($requestArray as $k=>$v) {
            if( isset($v) && !empty($v) )
                $this->extraDataArr["request_".$k]=$v;
        }     

        if(isset($request))
        {
            $reference=$request->reference;
        
            if(isset($reference)) {
                $referenceArray=$reference->toArray();
                foreach($referenceArray as $k=>$v) {
                    if( isset($v) && !empty($v) )
                        $this->extraDataArr["reference_".$k]=$v;
                }
            }            
        }     
        
        
    }   
    
    //overrides toMail in order to set the same blade template for all RequestNotifications
    public function toMail($notifiable)
    {
        $lang=$notifiable->preferredLocale(); 

        //title is taken from <classname>_title variable in translations file ("resources/lang/<lang>/notification.php").
        //We set it here becase here we've notifiable object and we can use user's language        
        $this->title=$this->title.trans("notification.".class_basename(get_class($this))."_title",[],$lang);    

        if(!isset($this->title) || $this->title==""|| $this->title==null) 
            $this->title="notification.".class_basename(get_class($this))."_title";

        //pass url to extraDataArr so in the email we can use notification url
        $this->extraDataArr+=['notification_url'=>$this->url];

        return (new BaseMailMessage($this->title,$this->extraDataArr,"mail.notification.RequestNotification",false));      //will look for "resources/view/mail/notificatiom/<lang>/RequestNotification.blade.php    
    }
}
