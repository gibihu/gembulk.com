<?php

use App\Http\Controllers\Apis\Dashs\Sending\SMSApiController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->prefix('api')->name('api.')->group(function () {
    Route::prefix('dashboards')->name('dash.')->group(function () {
        Route::controller(SMSApiController::class)->group(function () {
            Route::prefix('create')->name('create.')->group(function () {
                Route::post('sms', 'create')->name('sms');
            });
            Route::prefix('jobs')->name('job.')->group(function(){
                Route::get('/sms', 'syncJob')->name('sms');
            });
        });

    });
});
