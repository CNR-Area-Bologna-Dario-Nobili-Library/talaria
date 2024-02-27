<?php

namespace App\Models\Users;

use App\Models\BaseModel;
use App\Models\Institutions\Consortium;
use App\Models\Institutions\Institution;
use App\Models\Libraries\Library;
use App\Models\Projects\Project;
use App\Models\Users\User;

class TemporaryAbility extends BaseModel
{
    protected $table = 'temporary_abilities';
    protected static $observerClass = TemporaryAbilityObserver::class;

    protected $forceDeleting=true; //overrides softdelete => force delete!  
    public static function bootSoftDeletes() {}  //override softdelete trait!
    
    protected $userstamping = false;

    protected $fillable=[
        'entity_id',
        'entity_type',
        'user_id',
        'user_name',
        'user_surname',
        'user_email',
        'abilities',
        'status',        
    ];

    public function user()
    {        
            return $this->belongsTo(User::class,'user_id');
    }

    public function library() {
        return $this->belongsTo(Library::class,'entity_id');
    }

    public function institution() {
        return $this->belongsTo(Institution::class,'entity_id');
    }

    public function project () {
        return $this->belongsTo(Project::class,'entity_id');   
    }

    public function consortium () {
        return $this->belongsTo(Consortium::class,'entity_id');   
    }

    
    public function scopeByStatus($query,$status) {
        return $query->where('status',$status);        
    }

    private function scopeByEntity($query,$entityType,$entityID) {
        return $query->where('entity_id',$entityID)->where('entity_type',$entityType);        
    }

    public function scopeByLibrary($query,$entityID) {
        return $this->scopeByEntity($query,'App\\Models\\Libraries\\Library',$entityID);        
    }

    public function scopeByInstitution($query,$entityID) {
        return $this->scopeByEntity($query,'App\\Models\\Institutions\\Institution',$entityID);        
    }

    public function scopeByConsortium($query,$entityID) {
        return $this->scopeByEntity($query,'App\\Models\\Institutions\\Consortium',$entityID);        
    }

    public function scopeByProject($query,$entityID) {
        return $this->scopeByEntity($query,'App\\Models\\Projects\\Project',$entityID);                
    }   
   
    public function scopeByUserID($query,$user_id) {
        return $query->where('user_id',$user_id);        
    }

    public function scopeByUserEmail($query,$user_email) {
        return $query->where('user_email',$user_email);        
    }


    public function scopeWaiting($query) {
        return $this->scopeByStatus($query,config("constants.temporary_abilities_status.waiting")); 
    }    
    
    
}
