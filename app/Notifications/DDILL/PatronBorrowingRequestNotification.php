<?php

namespace App\Notifications\DDILL;

use App\Notifications\BaseMailMessage;
use App\Notifications\BaseNotification;
use Illuminate\Bus\Queueable;


//Patron Borrowing Notification to the library
class PatronBorrowingRequestNotification extends BaseNotification
{
    use Queueable;
    
    /**
     * Create a new request notification instance.
     *
     * @return void
     */        
    public function __construct($model)
    {                
        parent::__construct();

        $this->object=$model;      //model is a PatronDocdelRequest  
        
        $request=$this->object;
        //$blib=$this->object->library;
        
        $patron=$this->object->patron;

        //NOTE: We used last DD request ID as #Borrowing Req. ID because of one-to-many relationships Patron Docdel Request-> BorrowingDocdelRequest 
        $this->url=config('app.frontend_url').'/library/'.$request->Library->id.'/borrowing/';   
        
        $this->addTitleIdentifier($request->lastDocdelRequest()->id); //prepend title with # #Borrowing Req. ID  -         

        //Adding all fields from PatronDDRequest + Patron + Reference
        /*if(isset($blib))
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

        if (isset($request->delivery_id))
        {
            $delivery=$request->delivery;

            $deliveryArray=$delivery->toArray();
            foreach($deliveryArray as $k=>$v) {
                if( isset($v) && !empty($v) )
                    $this->extraDataArr["delivery_".$k]=$v;
            } 

            $dcountry=$delivery->country;
            if(isset($dcountry))
                $this->extraDataArr["delivery_country"]=$dcountry->name;   

        }*/
                    
        if(isset($patron))
        {
            $pArray=$patron->toArray();
            foreach($pArray as $k=>$v) {
                if( isset($v) && !empty($v) )
                    $this->extraDataArr["user_".$k]=$v;
            }        
        }

        if (isset($request->delivery_id))
        {
            $delivery=$request->delivery;

            $deliveryArray=$delivery->toArray();
            foreach($deliveryArray as $k=>$v) {
                if( isset($v) && !empty($v) )
                    $this->extraDataArr["delivery_".$k]=$v;
            } 

            $dcountry=$delivery->country;
            if(isset($dcountry))
                $this->extraDataArr["delivery_country"]=$dcountry->name;   

        }

        $requestArray=$request->toArray();
        foreach($requestArray as $k=>$v) {
            if( isset($v) && !empty($v) )
                $this->extraDataArr["request_".$k]=$v;
        }     

        if(isset($request->reference_id))
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
    
    //overrides toMail in order to set the same blade template for all PatronRequestNotifications
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

        return (new BaseMailMessage($this->title,$this->extraDataArr,"mail.notification.PatronBorrowingRequestNotification",false));      //will look for "resources/view/mail/notificatiom/<lang>/PatronRequestNotification.blade.php    
    }
}
