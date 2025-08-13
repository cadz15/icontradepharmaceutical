<?php

use App\Http\Controllers\MedicalRepresentativeController;
use App\Http\Controllers\ProfileController;
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
});

require __DIR__.'/auth.php';
