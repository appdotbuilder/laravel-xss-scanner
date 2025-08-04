<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ScanController;
use App\Http\Controllers\WebsiteController;
use App\Http\Controllers\WebsiteScanController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Website management routes
    Route::resource('websites', WebsiteController::class);
    Route::post('websites/{website}/scan', [WebsiteScanController::class, 'store'])->name('websites.scan');
    
    // Scan routes
    Route::get('scans/{scan}', [ScanController::class, 'show'])->name('scans.show');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
