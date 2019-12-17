<?php

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
    Route::get('permissions', ['as' => 'auth.permissions', 'uses' => 'Auth\AuthController@permissions']);

});

Route::group([
    'namespace' => 'Users',
    'prefix' => 'users',
    'middleware' => ['api','auth:api',],
    'as' => 'api.v1.users.',
], function () {
    Route::get('users', 'UserController@index')->name('index');
    Route::get('users/{user}', 'UserController@show')->name('show');
    Route::put('users/{user}', 'UserController@update')->name('update');
    Route::post('users', 'UserController@create')->name('create');
});
