<?php

use App\Http\Controllers\API\MobileCustomerController;
use App\Http\Controllers\API\MobileItemController;
use App\Http\Controllers\API\MobileSalesOrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth.apikey', 'throttle:api-key'])->group(function() {

    Route::get('/sales-orders', [MobileSalesOrderController::class, 'index'])->name('api.sales.order.list');
    Route::post('/sales-order', [MobileSalesOrderController::class, 'store']);

    Route::get('/customers', [MobileCustomerController::class, 'index'])->name('api.customer.list');
    Route::post('/customer', [MobileCustomerController::class, 'store']);
    
    Route::get('/items', [MobileItemController::class, 'index']);
});
