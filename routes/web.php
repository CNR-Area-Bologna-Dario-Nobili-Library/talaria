<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Route::get('/', function () {
//    return view('welcome');
//});


Route::get('/', 'HomeController@index')->name('home');

//Route::get('/home', 'HomeController@index')->name('home');


Auth::routes();

Route::group(['middleware' => ['api']], function () {
    Route::get('auth/social/{provider}/callback', 'Auth\SocialAuthController@handleProviderCallback');
    Route::get('auth/social/{provider}', 'Auth\SocialAuthController@redirectToProvider');
});
