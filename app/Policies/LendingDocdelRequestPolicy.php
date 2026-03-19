<?php

namespace App\Policies;

use App\Policies\BasePolicy;
use App\Models\Users\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Database\Eloquent\Model;

class LendingDocdelRequestPolicy extends BasePolicy
{
    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct([]); //nessuno bypassa questa policy,
    }
    
    //non essendoci il model, la filtro dal controller e qui ritorno true
    public function index(User $user, Model $model)
    {   
        return true; 
    }

    public function create(User $user, Model $model)
    {
        return $this->canManage($user,$model);
    }

    public function show(User $user, Model $model)
    {        
        if($model->library)              
            return $this->canManage($user,$model);
        else if($model->all_lender==1) //was orphan
            return true;   
        return false;
    }


    public function update(User $user, Model $model)
    {
        return $this->canManage($user,$model);
    }

    public function changeStatus(User $user, Model $model)
    {       
        return $this->canManage($user,$model);
    }


    public function canManage(User $user, Model $model)
    {   
        if($model->library)        
            return $user->can('manage', $model->library)||
                   $user->can('lend', $model->library);                       
        return false;            
    }
}
