<?php

namespace App\Policies;

use App\Policies\BasePolicy;
use App\Models\Users\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Database\Eloquent\Model;

class TemporaryAbilityPolicy extends BasePolicy
{
    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }
    
    public function updateMyResourcesStatus(User $user, Model $model) {          
        return ($model->user_id==$user->id || $model->user_email==$user->email); //can update status only on my own temporary perms 
    }
}
