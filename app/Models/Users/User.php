<?php

namespace App\Models\Users;

use App\Models\Libraries\LibraryUser;
use App\Models\Users\UserObserver;
use App\Notifications\Account\ResetPassword;
use App\Traits\Auth\RolesAbilitiesPermissionsTrait;
use App\Traits\Model\ModelTrait;
use App\Models\Users\DatabaseNotificationObserver;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;
use App\Models\Country;
use App\Models\Libraries\Delivery;
use App\Models\Libraries\Library;
use App\Models\References\Group;
use App\Models\References\Label;
use App\Models\References\Reference;
use App\Models\Requests\PatronDocdelRequest;

class User extends UserBase
{
    protected static $observerClass = UserObserver::class;
    public $simpleSearchFields = ['name', 'surname','full_name','email'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'surname',
        'email',
        'password',
        'password_confirmation',
        'full_name',

        'address',
        'country_id',
        'town', //citta
        'district', //provincia
        'postcode', //cap
        'state', //Regione o Stato (EmiliaRomagna, Illinois
        'phone',
        'mobile',
        'preflang',
        'registration_date',
        'privacy_policy_accepted',
        'status',
    ];

    /**
     * The attributes that are protected. When the below line is missing, it get that all fields are gaurded which return an error in query *=[] as below  
     *  [0] => 'Mina' //if you update city
     *  [1] => '+9372589631' //if you update mobile
     *  etc..
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
        'password_confirmation',

        "deleted_at",
        "created_by",
        "updated_by",
        "deleted_by",
        "created_at",
        "updated_at",
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }


//    public function getFullNameAttribute()
//    {
//        return $this->name . ' '. $this->surname;
//    }

    public function labels()
    {
        return $this->hasMany(Label::class,'created_by');
    }

    public function groups()
    {
        return $this->hasMany(Group::class,'created_by');
    }

    public function references()
    {
        return $this->hasMany(Reference::class,'created_by');
    }

    public function patronddrequests()
    {
        return $this->hasMany(PatronDocdelRequest::class,'created_by');
    }

    public function oauth_social_providers()
    {
        return $this->hasMany(OauthSocialProvider::class);
    }

    //nota: chiamando questo metodo sull'utente, mi trovo i dati della sua bibliolteca + dipartimento + title
    public function libraries()
    {
        //return $this->belongsToMany(Library::class)->withPivot('department_id','title_id')->withTimestamps(); //assieme alla biblioteca prendo anche dipartimento e title (solo gli id) e timestamps

        //in questo modo ottengo anche i model di depatment/title!
        //ci accedo come $myuser2->libraries->first()->pivot->department
        /*return $this->belongsToMany(Library::class)
            ->using(LibraryUser::class)
            ->withPivot('department_id','title_id')
            ->withTimestamps(); //assieme alla biblioteca prendo anche dipartimento e title e timestamps
        */
        return $this->belongsToMany('App\Models\Libraries\Library','library_user')->withPivot('department_id','title_id','label','status')
        ->withTimestamps(); //assieme alla biblioteca prendo anche dipartimento e title e timestamps;
    }

    /* elenco sue biblio attive con dip e titles*/
    public function active_libraries()
    {
        return $this->belongsToMany('App\Models\Libraries\Library','library_user')->withPivot('department_id','title_id','label','status')
        ->wherePivot('status',config('constants.libraryuser_status.enabled'))
        ->withTimestamps(); //assieme alla biblioteca prendo anche dipartimento e title e timestamps;
    }

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPassword($token, $this->email));
    }
    /**
     * Get the entity's notifications.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     * 
     */
    public function notifications()
    {
        return $this->morphMany(DatabaseNotification::class, 'notifiable')->orderBy('created_at', 'desc');
    }

    /*TODO: save on DB the user preference about notification
    * NOTE: When sending notifications via the mail channel, the notification system will automatically look for an email property on your notifiable entity
     * otherwise you've to override the routeNotificationForMail($notification)     
    */
    public function preferNotifiedBy() {
        //if(...) return ['mail','xxx','xxx'...]
        //else
        return ['database']; 
    }

    public function isPatronOf($libraryId) {
        return $this->hasRole('patron') && $this->active_libraries()->where('library_id', $libraryId)->exists();
    }

     //I PdC gestiti dall'utente (non filtrati per biblioteca)
     public function deliveries()
     {
         return $this->belongsToMany('App\Models\Libraries\Delivery','delivery_user')->withTimestamps(); 
     }
}
