<?php

use App\Http\Controllers\Users\UserController;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([
    'middleware' => ['api','auth:api'],
    'prefix' => 'auth',
    ], function () {
    Route::get('me', ['as' => 'auth.me.show', 'uses' => 'Auth\AuthController@me']); //user profile (can specify '?include=roles,resources,tempresources')
    Route::put('me', ['as' => 'auth.me.update', 'uses' => 'Auth\AuthController@updateMe']);
//    Route::put('change-password', ['as' => 'auth.password.change-password', 'uses' => 'Auth\PasswordController@changePassword']);        
    Route::get('permissions', ['as' => 'auth.permissions', 'uses' => 'Auth\AuthController@permissions']); //roles + abilities/resources + pending!        
    Route::get('resources', ['as' => 'auth.resources', 'uses' => 'Auth\AuthController@resources']);       //only abilities (no pending)          
    Route::put('resources/{resourceId}',['as' => 'auth.updateMyResourcesStatus', 'uses' =>  'Auth\AuthController@updateMyResourcesStatus'])->where('resourceId', '[0-9]+');  //update(accept/reject) abilities
});

Route::group([
    'namespace' => 'Users',
    'prefix' => 'users',
    'middleware' => ['api','auth:api',],
    'as' => 'api.v1.users.', 
], function () {
    Route::get('option-items', 'UserController@optionList')->name('option-items'); //can specify ?label=name,email to get name/email fields
    Route::get('', 'UserController@index')->name('index');
    Route::get('{user}', 'UserController@show')->name('show');  // (can specify '?include=roles,resources,tempresources')
    Route::put('{user}', 'UserController@update')->name('update');
    Route::post('', 'UserController@store')->name('create');
    
    //Roles and permissions
    Route::get('roles', 'RolePermissionController@index')->name('roles-index'); //all available roles
    Route::get('{user}/roles', 'UserController@roles')->where('user', '[0-9]+'); //user's roles    
    Route::get('{user}/permissions', 'UserController@permissions')->where('user', '[0-9]+');       //user's roles,abilities/resources + pending! 
    Route::get('{user}/resources', 'UserController@resources')->where('user', '[0-9]+');       //user's roles,abilities/resources 

    //TO DO: implement these API (for admin)
    //Route::put('{user}/roles', 'UserController@updateRoles')->where('user', '[0-9]+')->name('user-roles-update');   
    //Route::delete('{user}/roles', 'UserController@deleteRoles')->where('user', '[0-9]+')->name('user-roles-delete');   
    //Route::post('{user}/roles', 'UserController@storeRoles')->where('user', '[0-9]+')->name('user-roles-store');           
});

Route::group([
    'namespace' => 'Users',
    'prefix' => 'notifications',
    'middleware' => ['api','auth:api',],
    'as' => 'api.v1.notifications.',
], function () {
    Route::get('', 'NotificationController@index')->name('index');
    Route::put('mark_all_as_read', 'NotificationController@markAllAsRead')->name('mark_all_as_read');
    Route::get('{id}', 'NotificationController@show')->name('show');
});
