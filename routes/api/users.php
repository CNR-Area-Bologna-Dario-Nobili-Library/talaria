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
    Route::get('me', ['as' => 'auth.me.show', 'uses' => 'Auth\AuthController@me']);
    Route::put('me', ['as' => 'auth.me.update', 'uses' => 'Auth\AuthController@updateMe']);
//    Route::put('change-password', ['as' => 'auth.password.change-password', 'uses' => 'Auth\PasswordController@changePassword']);
    Route::get('permissions', ['as' => 'auth.permissions', 'uses' => 'Auth\AuthController@permissions']); //i.e. roles
    Route::get('resources', ['as' => 'auth.resources', 'uses' => 'Auth\AuthController@resources']);       //i.e. abilities
    Route::get('pending_resources', ['as' => 'auth.pending_resources', 'uses' => 'Auth\AuthController@pendingresources']);
    Route::put('pending_resources/{res}', ['as' => 'auth.pending_resources.update', 'uses' => 'Auth\AuthController@pendingresourcesUpdate'])->where('res', '[0-9]+');
    Route::delete('pending_resources/{res}', ['as' => 'auth.pending_resources.update', 'uses' => 'Auth\AuthController@pendingresourcesUpdate'])->where('res', '[0-9]+');

});

Route::group([
    'namespace' => 'Users',
    'prefix' => 'users',
    'middleware' => ['api','auth:api',],
    'as' => 'api.v1.users.',
], function () {
    Route::get('option-items', 'UserController@optionList')->name('option-items');
    Route::get('', 'UserController@index')->name('index');
    Route::get('{user}', 'UserController@show')->name('show');
    Route::put('{user}', 'UserController@update')->name('update');
    Route::post('', 'UserController@store')->name('create');
    
    //Roles
    Route::get('roles', 'RolePermissionController@index')->name('roles-index');
    Route::get('{user}/roles', 'UserController@roles')->where('user', '[0-9]+');
    Route::put('{user}/roles/{role}', 'UserController@roles')->where('user', '[0-9]+')->name('user-roles-update');   
    Route::delete('{user}/roles/{role}', 'UserController@roles')->where('user', '[0-9]+')->name('user-roles-delete');   
    Route::post('{user}/roles', 'UserController@roles')->where('user', '[0-9]+')->name('user-roles-store');   

    //Abilities
    Route::get('{user}/resources', 'UserController@resources')->where('user', '[0-9]+');      
    Route::put('{user}/resources/{res}', 'UserController@resources')->where('user', '[0-9]+')->name('user-resources-update');  
    Route::delete('{user}/resources/{res}', 'UserController@resources')->where('user', '[0-9]+')->name('user-resources-delete');  
    Route::post('{user}/resources', 'UserController@resources')->where('user', '[0-9]+')->name('user-resources-store');  
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
