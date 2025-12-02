<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;

/*NOTEs:  
- all text can be translated using "trans()" into the preferred user's language
- translations variables are in /resources/lang/xx/email.php
- mail configuration is in /config/mail.php
- view template are located in /resources/views/mail/xxxx.blade.php and must be referred as mail.xxxx (so "mail folder will be part of the name followed by .") 
- By default all templates are defined in /views/vendor/mail/ (/text subfolder contains MD templates, /html subfolder contains the HTML template used for generating html from MD ! ) 
- in the resource view we can access $data passed from the notification object
NOTES: 
- if in the template we use @component(mail::xxxx) it will look at /views/vendor/mail/(html|text)/xxx depending if looking for html or md template
- If we use ->markdown it will render MD email + it generate an HTML version based on default HTML template (stored in /view/vendor/mail/html) 

https://www.vincentschmalbach.com/customizing-laravels-default-notification-emails/
*/
class BaseMailMessage extends MailMessage
{
  
    private $myData;
    private $template;

    public function __construct($customSubject,$customData,$customView,$md=false) 
    {          
        $appName="[".config('app.name')."] - ";

        $this->myData=$customData;
        $this->subject=$appName.$customSubject;

        if($customView)
            $this->template=$customView;

        //mail subject is passed to mail data as notification title   
        $this->myData+=['notification_title'=>$customSubject];

        
        if($this->template!=null && !$md) //html
            $this->view($this->template,$this->myData);
        else if ($md) //markdown
            $this->markdown($this->template,$this->myData);
    }


}