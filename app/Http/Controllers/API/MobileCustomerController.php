<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\Customer as ResourcesCustomer;
use App\Models\Customer;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MobileCustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ResourcesCustomer::collection(Customer::latest()->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'=> ['required'],
            'full_address'=> ['required'],
            'short_address'=> ['required'],
            'region'=> ['required'],
            'class'=> ['required'],
            'practice'=> ['sometimes'],
            's3_license'=> ['sometimes'],
            's3_validity'=> ['sometimes'],
            'pharmacist_name'=> ['sometimes'],
            'prc_id'=> ['sometimes'],
            'prc_validity'=> ['sometimes'],
            'remarks'=> ['required'],
            'sync_date'=> ['sometimes'],
        ]);


        try {
            Customer::create([
                'name'=> $validated['name'],
                'full_address'=> $validated['full_address'],
                'short_address'=> $validated['short_address'],
                'region'=> $validated['region'],
                'class'=> $validated['class'],
                'practice'=> $request->get('practice'),
                's3_license'=> $request->get('s3_license'),
                's3_validity'=> $request->get('s3_validity'),
                'pharmacist_name'=> $request->get('pharmacist_name'),
                'prc_id'=> $request->get('prc_id'),
                'prc_validity'=> $request->get('prc_validity'),
                'remarks'=> $validated['required'],
                'sync_date'=> now(),
            ]);
        }catch(Exception $ex) {
            return response()->json([
                'message' => 'Unable to create customer!',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        
        return response()->json([
            'message' => 'Customer Successfully created!',
        ], Response::HTTP_OK);
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
