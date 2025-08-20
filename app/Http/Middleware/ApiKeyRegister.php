<?php

namespace App\Http\Middleware;

use App\Models\MedicalRepresentative;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiKeyRegister
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $apiKey = $request->header('X-API-KEY'); // Or use Authorization or other header

        if (!$apiKey) {
            return response()->json(['error' => 'API key is missing'], 401);
        }

        $medrep = MedicalRepresentative::where('api_key', $apiKey)->first();

        if (!$medrep) {
            return response()->json(['error' => 'Invalid API key', 'user' => $medrep], Response::HTTP_UNAUTHORIZED);
        }

        // Set the user on the request
        $request->setUserResolver(function () use ($medrep) {
            return $medrep;
        });


        return $next($request);
    }
}
