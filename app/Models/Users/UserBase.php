<?php
/**
 * Created by INKODE soc. coop.
 * User: Giorgio Resci
 * Email: giorgio@inkode.it
 */

namespace App\Models\Users;


use App\Traits\Auth\RolesAbilitiesPermissionsTrait;
use App\Traits\Model\ModelTrait;
use Illuminate\Contracts\Translation\HasLocalePreference;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class UserBase extends Authenticatable implements HasLocalePreference
{
    use Notifiable,
        HasApiTokens,
        RolesAbilitiesPermissionsTrait,
        ModelTrait;

    public function updatePassword($password) {
        return self::where('id', $this->id)->update(['password'=> \Hash::make($password)]);
    }

    //used by Notification to know language to translate notification text
    public function preferredLocale(): string
    {
        return $this->preflang?$this->preflang:app()->getLocale();        

    }
}
