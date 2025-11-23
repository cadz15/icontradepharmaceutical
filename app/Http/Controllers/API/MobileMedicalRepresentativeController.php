<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\MedicalRepresentative as ResourcesMedicalRepresentative;
use App\Models\MedicalRepresentative;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MobileMedicalRepresentativeController extends Controller
{

    public function register(Request $request)
    {
        $validated = $request->validate([
            'app_key' => ['required', 'string'],
        ]);

        $medrep = MedicalRepresentative::where('id', $request->user()->id)->first();

        if(!$medrep) {
           return response()->json([], Response::HTTP_BAD_REQUEST);
        }

         $medrep->update([
            'sales_order_app_id' => $validated['app_key']
        ]);

        return response()->json([
            'message' => 'App successfully registered!',
            'data' => new ResourcesMedicalRepresentative($medrep)
        ], Response::HTTP_OK);
    }


    public function ping(Request $request) {
        return response()->json([]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //analtyics; statistics, product distribution, product sold trent, sales per year
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
