<?php

namespace App\Notifications\Account;

use App\Notifications\MandatoryNotification;

class PasswordChangedNotification extends MandatoryNotification
{
    public function __construct()
    {       
        parent::__construct();                   
    } 
}
