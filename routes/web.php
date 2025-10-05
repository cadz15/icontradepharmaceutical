<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\MedicalRepresentativeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SalesOrderController;
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
    Route::put('/customer/{id}', [CustomerController::class, 'update'])->name('customer.update');
    Route::delete('/customer/{id}', [CustomerController::class, 'destroy'])->name('customer.delete');


    Route::get('/items', [ItemController::class, 'index'])->name('item.index');
    Route::get('/items/create', [ItemController::class, 'create'])->name('item.create');
    Route::post('/items/create', [ItemController::class, 'store'])->name('item.store');
    Route::get('/item/{id}', [ItemController::class, 'show'])->name('item.show');
    Route::post('/item/{id}', [ItemController::class, 'update'])->name('item.update');
    Route::delete('/item/{id}', [ItemController::class, 'destroy'])->name('item.delete');
    Route::get('/item/edit/{id}', [ItemController::class, 'edit'])->name('item.edit');
    Route::delete('/item/image/{id}', [ItemController::class, 'deleteImage'])->name('item.image.delete');

    Route::get('/sales-orders', [SalesOrderController::class, 'index'])->name('sales.order.index');
    Route::get('/sales-order/{id}', [SalesOrderController::class, 'show'])->name('sales.order.show');
    Route::put('/sales-order/{id}', [SalesOrderController::class, 'update'])->name('sales.order.update');
    Route::delete('/sales-order/{id}', [SalesOrderController::class, 'destroy'])->name('sales.order.delete');
    Route::get('/sales-order/edit/{id}', [SalesOrderController::class, 'show'])->name('sales.order.edit');

    Route::get('/storage/uploads/{id}', [ItemController::class, 'getFile'])->name('image.link');
});

Route::middleware(['auth'])->prefix('admin-api')->name('admin.api.')->group(function() {
    Route::get('/medical-list', [MedicalRepresentativeController::class, 'list'])->name('med.rep.list');
});

require __DIR__.'/auth.php';
