<?php

use App\Http\Controllers\Pages\Auth\LoginController;
use App\Http\Controllers\Pages\Dashs\WebDashPageController;
use App\Http\Controllers\Pages\WebPageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::controller(LoginController::class)->prefix('login')->name('login.')->group(function () {
    Route::post('', 'store')->name('store');
});

Route::middleware(['auth'])->group(function () {
    Route::controller(WebDashPageController::class)->group(function () {
        Route::get('/', 'index')->name('home');
    });

    Route::controller(WebDashPageController::class)->prefix('dashboard')->name('dash.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::prefix('create')->name('create.')->group(function () {
            Route::get('/sms', 'createSMS')->name('sms');
            Route::get('/otp', 'createOTP')->name('otp');
        });
        Route::prefix('sending')->name('sending.')->group(function () {
            Route::get('/sms', 'sendingSMS')->name('sms');
            Route::get('/otp', 'sendingOTP')->name('otp');
        });
        Route::prefix('jobs')->name('jobs.')->group(function () {
            Route::get('/sms', 'jobSMS')->name('sms');
            Route::get('/otp', 'jobOTP')->name('otp');
        });
        Route::prefix('reports')->name('report.')->group(function () {
            Route::get('/sms', 'reportSMS')->name('sms');
            Route::get('/otp', 'reportOTP')->name('otp');
        });
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/apis/auth.php';
