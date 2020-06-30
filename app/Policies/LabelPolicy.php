<?php

namespace App\Policies;

use App\Policies\BasePolicy;
use App\Models\Users\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Database\Eloquent\Model;

class LabelPolicy extends BasePolicy
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

    public function create(User $user, Model $model)
    {
        return true;
    }

    //ritorno true perchè tanto nella index filtro sempre x owner
    public function index(User $user, Model $model)
    {
        return true;
    }

    public function optionList(User $user, Model $model)
    {
        return true;
    }

    public function show(User $user, Model $model)
    {
        return $this->canManage($user,$model);
    }


    public function update(User $user, Model $model)
    {
        return $this->canManage($user,$model);
    }

    public function canManage(User $user, Model $model)
    {
        return $model->isOwner($user->id);
    }

    /*public function viewAny(User $user, Model $model)
    {
        return $this->index($user,$model);
    }*/
}
