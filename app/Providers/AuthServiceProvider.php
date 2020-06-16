<?php

namespace App\Providers;

use App\Models\Country;
use App\Models\Institutions\DeskInstitution;
use App\Models\Institutions\Institution;
use App\Models\Institutions\InstitutionType;
use App\Models\Libraries\CatalogLibrary;
use App\Models\Libraries\Library;
use App\Models\Projects\Project;
use App\Models\Libraries\LibraryUser;
use App\Models\Libraries\Subject;
use App\Models\Institutions\Desk;
use App\Models\Libraries\Delivery;
use App\Models\Libraries\DeliveryUser;
use App\Models\Libraries\Tag;
use App\Models\References\Reference;
use App\Models\Users\User;
use App\Models\References\Label;
use App\Models\References\Group;
use App\Models\References\GroupReference;
use App\Models\Libraries\Catalog;
use App\Models\References\LabelReference;
use App\Models\References\LabelReferenceTransformer;
use App\Models\Requests\PatronDocdelRequest;
use App\Policies\BasePolicy;
use App\Policies\LibraryPolicy;
use App\Policies\DeliveryPolicy;
use App\Policies\LibraryUserPolicy;
use App\Policies\DeskInstitutionPolicy;
use App\Policies\CatalogLibraryPolicy;
use App\Policies\ListBasePolicy;
use App\Policies\ReferencesPolicy;
use App\Policies\GroupPolicy;
use App\Policies\GroupReferencePolicy;
use App\Policies\LabelPolicy;
use App\Policies\LabelReferencePolicy;
use App\Policies\PatronDocdelRequestPolicy;
use App\Policies\UserPolicy;
use App\Policies\TagPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Laravel\Passport\Passport;
use Carbon\Carbon;
use Illuminate\Support\Facades\Route;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
        User::class => UserPolicy::class,
        Desk::class => ListBasePolicy::class,
        Group::class => GroupPolicy::class,
        GroupReference::class => GroupReferencePolicy::class,
        Label::class => LabelPolicy::class,
        LabelReference::class => LabelReferencePolicy::class,
        PatronDocdelRequest::class=>PatronDocdelRequestPolicy::class,
        DeskInstitution::class=>DeskInstitutionPolicy::class,
        Delivery::class => DeliveryPolicy::class,
        Library::class => LibraryPolicy::class,
        LibraryUser::class => LibraryUserPolicy::class,
        CatalogLibrary::class => CatalogLibraryPolicy::class,
        Reference::class => ReferencesPolicy::class,
        Institution::class => ListBasePolicy::class,
        InstitutionType::class => ListBasePolicy::class,
        Project::class => ListBasePolicy::class,
        Institution::class => ListBasePolicy::class,
        Country::class => ListBasePolicy::class,
        Subject::class => ListBasePolicy::class,
        Catalog::class => ListBasePolicy::class,
        Tag::class => TagPolicy::class,
      
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Route::group([
            'middleware' => 'recaptcha',
        ], function () {
            Passport::routes();
        });
        Passport::tokensExpireIn(Carbon::now()->addDays(1));
    }
}
