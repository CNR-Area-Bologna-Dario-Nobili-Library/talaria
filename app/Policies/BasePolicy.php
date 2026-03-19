<?php

namespace App\Policies;

use App\Models\Users\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Access\HandlesAuthorization;
use Bouncer;
//use Illuminate\Support\Facades\Log;

class BasePolicy
{
    use HandlesAuthorization;

    private $bypassRoles=['super-admin','manager']; //ruoli che bypassano i controlli di policy (quindi non esegue nemmeno il codice dentro alla Policy show/index .....! )

    public function __construct($bypass=null)
    {      
        if(!is_null($bypass))
            $this->bypassRoles=$bypass;
        
    }

    public function before($user, $ability)
    {
        //Log::info("USER:".$user->id);
        //Log::info("BasePolicy-beforeeee");
        //if(!is_null($this->bypassRoles))
        //    Log::info("filter:".implode(',',$this->bypassRoles));
        
        if(!is_null($this->bypassRoles) && !empty($this->bypassRoles)) {
                     
            if($user->hasRole($this->bypassRoles)) {
                    //Log::info("I'm GOD !");
                    return true; //ritorno true per bypassare tutte le policy (quindi di default super-admin e manager bypassano tutto)                    
            }                
                        
        }
        //Log::info("No policy bypass");
        
        return null; //ritorno null per far continuare l'esecuzione normale della policy (quindi se super-admin/manager ritorna true e bypassa tutto, altrimenti continua con i normali controlli)                
    }


    public function canManage(User $user, Model $model)
    {
        return $user->can('manage', $model);
    }

    protected function check(User $user, Model $model, $function=NULL)
    {
        if(is_null($function))
            throw new \Symfony\Component\HttpKernel\Exception\HttpException('Function Permission Must Be Defined in App\Policies::check for '.$function);

        return $this->canManage($user, $model);
//        return false;
    }

    public function viewAny(User $user, Model $model)
    {
        return $this->index($user,$model);
    }

    public function optionList(User $user, Model $model)
    {
        return $this->check($user, $model,__FUNCTION__);
    }

    public function index(User $user, Model $model)
    {
        return $this->check($user,$model,__FUNCTION__);
    }

    public function show(User $user, Model $model)
    {
        return $this->check($user,$model,__FUNCTION__);
    }

    public function store(User $user, Model $model)
    {
        return $this->check($user,$model,__FUNCTION__);
    }

    public function update(User $user, Model $model)
    {
        return $this->check($user,$model,__FUNCTION__);
    }

    public function delete(User $user, Model $model)
    {
        return $this->check($user,$model,__FUNCTION__);
    }

    public function restore(User $user, Model $model)
    {
        return $this->check($user,$model,__FUNCTION__);
    }

    public function destroy(User $user, Model $model)
    {
        return false;
    }

    public function bulkDelete(User $user, Model $model)
    {
        return $this->check($user,$model,__FUNCTION__);
    }

    public function bulkSave(User $user, Model $model)
    {
        return $this->check($user,$model,__FUNCTION__);
    }

    public function bulkRestore(User $user, Model $model)
    {
        return $this->check($user,$model,__FUNCTION__);
    }

    public function bulkDestroy(User $user, Model $model)
    {
        return false;
    }

    public function info(User $user, Model $model)
    {
        return false;
    }

    public function attach(User $user, Model $model)
    {
        return $this->check($user,$model,__FUNCTION__);
    }

    public function detach(User $user, Model $model)
    {
        return $this->check($user,$model,__FUNCTION__);
    }

    public function sync(User $user, Model $model)
    {
        return $this->check($user,$model,__FUNCTION__);
    }

    /*
     * ALIASES
     */
    public function view(User $user, Model $model)
    {
        return $this->show($user,$model,__FUNCTION__);
    }

    public function create(User $user, Model $model)
    {
        return $this->store($user,$model,__FUNCTION__);
    }
}
