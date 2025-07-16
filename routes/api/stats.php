<?php

use Illuminate\Support\Facades\Route;

Route::group([
  'middleware' => ['api', 'auth:api', 'stats'],
  'prefix' => 'stats',
  'namespace' => 'Stats',
  'as' => 'api.v1.stats.',
], function () {
  Route::get('/fillrate', 'FillrateStats@__invoke')->name('fillrate');
  Route::get('/requests-distribution', 'RequestsDistributionStats@__invoke')->name('requests-distribution');
  Route::get('/countries', 'CountriesStats@__invoke')->name('countries');
  Route::get('/working-time', 'WorkingTimeStats@__invoke')->name('working-time');
  Route::get('/avg-working-time', 'AvgWorkingTimeStats@__invoke')->name('avg-working-time');
  Route::get('/reference-turnaround', 'ReferenceTurnaroundStats@__invoke')->name('reference-turnaround');
  Route::get('/pubyear-distribution', 'ReferencePubYearStats@__invoke')->name('pubyear-distribution');
  Route::get('/borrowing-libraries', 'BorrowingLibrariesStats@__invoke')->name('borrowing-libraries');
  Route::get('/oareferences', 'OAReferencesStats@__invoke')->name('oareferences');
  
  // -- Export API --
  Route::get('/export', 'ExportController@__invoke')->name('export');
});
