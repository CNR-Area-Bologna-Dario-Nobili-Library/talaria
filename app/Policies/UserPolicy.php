<?php

namespace App\Policies;

use App\Policies\BasePolicy;
use App\Models\Users\User;
use App\Models\Libraries\Library;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Database\Eloquent\Model;

class UserPolicy extends BasePolicy
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

    public function optionList(User $user, Model $model)
    {
      //Any admin/comm manager or library manager can search for users (i.e. to invite them as operator)
     foreach($user->getAbilities() as $abil)
     {
         if($abil->name=="manage" && $abil->entity_type=='App\Models\Libraries\Library')
         return true;
     }
     return false;
    }

//    public function viewName(User $user, Model $model) {
//        return true;
//    }

    //only owner (or admin) can see his roles/permissions....    
    public function viewRoles(User $user, Model $model) {               
        return $user->id === $model->id;
    }

    //only owner (or admin) can see his roles/permissions....    
    public function permissions(User $user, Model $model) {               
        return $this->viewRoles($user,$model);
    }

    //only owner (or admin) can see his roles/permissions....    
    public function roles(User $user, Model $model) {               
        return $this->viewRoles($user,$model);
    }

    //only owner (or admin) can see his roles/permissions....    
    public function resources(User $user, Model $model) {               
        return $this->viewRoles($user,$model);
    }
   
    //anyone can get user's data (mainly public fields) but only admins/library man can see roles/permissions ...
    public function show(User $user, Model $model)
    {
        return true;
    }
}
