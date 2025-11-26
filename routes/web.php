<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\MedicalRepresentativeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SalesOrderController;
use App\Http\Controllers\UserController;
use App\Models\Customer;
use App\Models\MedicalRepresentative;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
    ]);
});


Route::middleware(['auth', 'auth.isAdmin'])->group(function() {
    Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard');

    Route::get('/medical-representative', [MedicalRepresentativeController::class, 'index'])->name('medical-rep.index');
    Route::post('/medical-representative', [MedicalRepresentativeController::class, 'store'])->name('medical-rep.store');
    Route::get('/medical-representatives/{medicalRepresentative}', [MedicalRepresentativeController::class, 'show'])->name('medical-representatives.show');
    Route::put('/medical-representatives/{medicalRepresentative}', [MedicalRepresentativeController::class, 'update'])->name('medical-representatives.update');

    Route::get('/customer', [CustomerController::class, 'index'])->name('customer.index');
    Route::post('/customer', [CustomerController::class, 'store'])->name('customer.store');
    Route::get('/customer/{customer}', [CustomerController::class, 'show'])->name('customer.show');
    Route::put('/customer/{id}', [CustomerController::class, 'update'])->name('customer.update');
    Route::delete('/customer/{id}', [CustomerController::class, 'destroy'])->name('customer.delete');


     Route::post('/events', [EventController::class, 'store'])->name('events.store');
    Route::put('/events/{event}', [EventController::class, 'update'])->name('events.update');
    Route::delete('/events/{event}', [EventController::class, 'destroy'])->name('events.destroy');


    // Admin Event Routes
    Route::post('/admin/events', [AdminController::class, 'store'])->name('admin.events.store');
    Route::put('/admin/events/{event}', [AdminController::class, 'update'])->name('admin.events.update');
    Route::delete('/admin/events/{event}', [AdminController::class, 'destroy'])->name('admin.events.destroy');
    Route::delete('/admin/events', [AdminController::class, 'destroyMultiple'])->name('admin.events.destroy.multiple');


    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
});

Route::middleware('auth')->group(function () {
    

    Route::get('/items', [ItemController::class, 'index'])->name('item.index');
    Route::get('/items/create', [ItemController::class, 'create'])->name('item.create');
    Route::post('/items/create', [ItemController::class, 'store'])->name('item.store');
    Route::get('/item/{id}', [ItemController::class, 'show'])->name('item.show');
    Route::post('/item/{id}', [ItemController::class, 'update'])->name('item.update');
    Route::delete('/item/{id}', [ItemController::class, 'destroy'])->name('item.delete');
    Route::get('/item/edit/{id}', [ItemController::class, 'edit'])->name('item.edit');
    Route::delete('/item/image/{id}', [ItemController::class, 'deleteImage'])->name('item.image.delete');

    Route::get('/items/report', [ItemController::class, 'report'])->name('items.report');

    Route::get('/sales-orders', [SalesOrderController::class, 'index'])->name('sales.order.index');
    Route::get('/sales-order/{id}', [SalesOrderController::class, 'show'])->name('sales.order.show');
    Route::put('/sales-order/{id}', [SalesOrderController::class, 'update'])->name('sales.order.update');
    Route::delete('/sales-order/{id}', [SalesOrderController::class, 'destroy'])->name('sales.order.delete');
    Route::get('/sales-order/edit/{id}', [SalesOrderController::class, 'show'])->name('sales.order.edit');


    Route::get('/profile/change-password', [ProfileController::class, 'editPassword'])->name('profile.password.edit');
    Route::put('/profile/update-password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
});
Route::get('/storage/uploads/{id}', [ItemController::class, 'getFile'])->name('image.link');

Route::middleware(['auth'])->prefix('admin-api')->name('admin.api.')->group(function() {
    Route::get('/medical-list', [MedicalRepresentativeController::class, 'list'])->name('med.rep.list');
});

require __DIR__.'/auth.php';
