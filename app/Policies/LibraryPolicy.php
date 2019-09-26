<?php

namespace App\Policies;

use App\Policies\BasePolicy;
use App\Models\Users\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Database\Eloquent\Model;

class LibraryPolicy extends BasePolicy
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

    public function show(User $user, Model $model)
    {
        return $this->canManage($user, $model) || $this->canManage($user, $model->institution);
    }


    public function update(User $user, Model $model)
    {
        return $this->canManage($user, $model);// || parent::update($user, $model); // TODO: Change the autogenerated stub
    }

    public function create(User $user, Model $model)
    {
        return $this->canManage($user, $model); // || parent::create($user, $model); // TODO: Change the autogenerated stub
    }

    public function canManage(User $user, Model $model)
    {
        return $user->can('manage', $model);
    }
}
