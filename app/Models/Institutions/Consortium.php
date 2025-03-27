<?php

namespace App\Models\Institutions;

use App\Models\BaseModel;
use App\Models\Users\Permission;
use App\Models\Users\User;
use App\Traits\Model\ModelPermissionsTrait;
use Silber\Bouncer\Database\Ability;

class Consortium extends BaseModel
{
    use ModelPermissionsTrait;
    /*
     * Fillable attributes
     */
    protected $fillable = [
        'name',
    ];

    protected $attributes= [
        'status', 
    ];

    public function institutions()
    {
        return $this->belongsToMany(Institution::class);
    }

    public function operators($ability=null){               

        /*$users = User::all();      //WARNING: may be slow!!   
        $lib=self::find($this->id);
        $filtered=new Collection();

        if($ability)
        {
            $filtered = $users->filter(function ($user) use ($ability,$lib) 
            {                
                return ($user->can($ability, $lib)||$user->can("manage", $lib))&& ($user->isNotA('super-admin') );
            });        
        }
        return $filtered;*/
        
        $perms=$this->hasManyThrough(Permission::class, Ability::class, 'entity_id')
            ->where('abilities.entity_type', self::class);    
        $perm_ability=$ability?$perms->where('abilities.name',$ability):$perms;
        $operators=User::whereIn('id',$perm_ability->get()->unique('entity_id')->pluck('entity_id'));
        return $operators;
    }

    public function manageOperators() {
        return $this->operators("manage");
    }
}
