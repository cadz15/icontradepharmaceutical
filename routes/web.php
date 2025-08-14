<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\MedicalRepresentativeController;
use App\Http\Controllers\ProfileController;
use App\Models\MedicalRepresentative;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/medical-representative', [MedicalRepresentativeController::class, 'index'])->name('medical-rep.index');
    Route::post('/medical-representative', [MedicalRepresentativeController::class, 'store'])->name('medical-rep.store');
    

    Route::get('/customer', [CustomerController::class, 'index'])->name('customer.index');
    Route::post('/customer', [CustomerController::class, 'store'])->name('customer.store');


    Route::get('/items', [ItemController::class, 'index'])->name('item.index');
    Route::get('/items/create', [ItemController::class, 'create'])->name('item.create');
    Route::post('/items/create', [ItemController::class, 'store'])->name('item.store');
});

Route::middleware(['auth'])->prefix('admin-api')->name('admin.api.')->group(function() {
    Route::get('/medical-list', [MedicalRepresentativeController::class, 'list'])->name('med.rep.list');
});

require __DIR__.'/auth.php';
