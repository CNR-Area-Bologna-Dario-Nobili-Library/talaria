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
//PUBLIC API
Route::group([
    'namespace' => 'Libraries',
    'prefix' => 'libraries',
    'middleware' => ['api','auth:api',],
    'as' => 'api.v1.libraries.',
], function () {

    /*
     * SUBJECTS
     */
    Route::group([
        'as' => 'subjects.',
    ], function () {
        Route::get('subjects/option-items', 'SubjectController@optionList')->name('subjects.option-items');
        //Route::get('subjects', 'SubjectController@index')->name('index');
    });

    /*
     * LIBRARY USERS
     */
    Route::group([
        'as' => 'library-users.',
    ], function () {
        Route::get('my', 'LibraryUserController@my')->name('my'); //le biblio dell'utente
        Route::get('myactive', 'LibraryUserController@myactive')->name('myactivelist'); //le biblio ATTIVE dell'utente da usare in una tendina
        Route::post('{library}/library-users', 'LibraryUserController@store')->name('store');

        Route::get('{library}/library-users', 'LibraryUserController@index')->name('index');
        Route::put('{library}/library-users/{library_user}', 'LibraryUserController@update')->name('update');
        Route::get('{library}/library-users/{library_user}', 'LibraryUserController@show')->name('show');
        Route::delete('{library}/library-users/{library_user}', 'LibraryUserController@delete')->name('delete'); //hard delete
    });

    /* LIBRARY CATALOGS - actually not used*/
    Route::group([
        'as' => 'library-catalogs.',
    ], function () {
        Route::get('catalogs', 'CatalogController@optionList')->name('catalogs.option-items');
        Route::post('{library}/catalogs', 'CatalogLibraryController@store')->name('store');

        Route::get('{library}/catalogs', 'CatalogLibraryController@index')->name('index');
        Route::put('{library}/catalogs/{library_catalog}', 'CatalogLibraryController@update')->name('update');
        Route::get('{library}/catalogs/{library_catalog}', 'CatalogLibraryController@show')->name('show');
        Route::delete('{library}/catalogs/{library_catalog}', 'CatalogLibraryController@delete')->name('delete'); //hard delete
    });

    /* LIBRARY TAGS*/
    Route::group([
        'as' => 'library-tags.',
    ], function () {
        Route::get('{library}/tags', 'TagController@index')->name('index');
        Route::get('{library}/tags/option-items', 'TagController@optionList')->name('option-items');
        Route::get('{library}/tags/{tag_id}', 'TagController@show')->name('show');
        Route::put('{library}/tags/{tag_id}', 'TagController@update')->name('update');
        Route::delete('{library}/tags/{tag_id}', 'TagController@delete')->name('delete');
        Route::post('{library}/tags', 'TagController@store')->name('create');
    });

    /* LIBRARY DELIVERY (pickup)*/
    Route::group([
        'as' => 'library-deliveries.',
    ], function () {
        Route::get('{library}/deliveries', 'DeliveryController@index')->name('index');
        Route::get('{library}/deliveries/option-items', 'DeliveryController@optionList')->name('option-items');
                        
        Route::get('{library}/deliveries/{delivery_id}', 'DeliveryController@show')->name('show');        
        Route::put('{library}/deliveries/{delivery_id}', 'DeliveryController@update')->name('update');
        Route::post('{library}/deliveries', 'DeliveryController@store')->name('create');
        Route::delete('{library}/deliveries/{delivery_id}', 'DeliveryController@delete')->name('delete'); //hard delete
    });
    
    /* LIBRARY IDENTIFIERS */
    Route::group([
        'as' => 'library-identifiers.',
    ], function () {
        Route::get('identifiers/option-items', 'IdentifierController@optionList')->name('option-items');                       
    });
   
    Route::post('public', 'LibraryController@publicCreate')->name('public-create');
    Route::get('', 'LibraryController@index')->name('index');
    Route::get('nearto', 'LibraryController@nearTo')->name('nearto');
    Route::get('option-items', 'LibraryController@optionList')->name('option-items');
    Route::get('{id}', 'LibraryController@show')->where('id', '[0-9]+')->name('show');
    Route::get('{id}/departments', 'LibraryController@departments')->where('id', '[0-9]+')->name('departments');
    Route::put('{id}', 'LibraryController@update')->where('id', '[0-9]+')->name('update');     
       
    Route::get('{id}/operators', 'LibraryController@operators')->where('id', '[0-9]+')->name('operators');
    Route::put('{id}/operators/{user}', 'LibraryController@operatorsUpdate')->where('id', '[0-9]+')->where('user', '[0-9]+')->name('operatorsUpdate');
    Route::delete('{id}/operators/{user}', 'LibraryController@operatorsDelete')->where('id', '[0-9]+')->where('user', '[0-9]+')->name('operatorsDelete');
    Route::post('{id}/pending_operators', 'LibraryController@operatorsStore')->where('id', '[0-9]+')->name('pending_operatorsStore');
    Route::get('{id}/pending_operators', 'LibraryController@pending_operators')->where('id', '[0-9]+')->name('pending_operators');
    Route::put('{id}/pending_operators/{user}', 'LibraryController@pending_operatorsUpdate')->where('id', '[0-9]+')->where('user', '[0-9]+')->name('pending_operatorsUpdate');
    Route::delete('{id}/pending_operators/{user}', 'LibraryController@pending_operatorsDelete')->where('id', '[0-9]+')->where('user', '[0-9]+')->name('pending_operatorsDelete');

    //Route::put('{id}', 'LibraryController@renewSubscription')->where('id', '[0-9]+')->name('renewSubscription');    



});

