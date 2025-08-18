<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

class RouteServiceProvider extends ServiceProvider
{

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        RateLimiter::for('api-key', function (Request $request) {
            $apiKey = $request->header('X-API-KEY'); // Or from Authorization header

            return Limit::perMinute(60)->by($apiKey ?: $request->ip()); // 60 requests per minute
        });
    }
}
