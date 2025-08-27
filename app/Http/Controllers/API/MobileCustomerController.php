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
        return ResourcesCustomer::collection(Customer::whereNull('sync_date')->latest()->withTrashed()->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'=> ['required'],
            'fullAddress'=> ['required'],
            'shortAddress'=> ['required'],
            'region'=> ['required'],
            'class'=> ['required'],
            'practice'=> ['sometimes'],
            's3License'=> ['sometimes'],
            's3Validity'=> ['sometimes'],
            'pharmacistName'=> ['sometimes'],
            'prcId'=> ['sometimes'],
            'prcValidity'=> ['sometimes'],
            'remarks'=> ['sometimes'],
            'sync_date'=> ['sometimes'],
        ]);

        
        $customer = null;

        try {
            $customer = Customer::create([
                'name'=> $validated['name'],
                'full_address'=> $validated['fullAddress'],
                'short_address'=> $validated['shortAddress'],
                'region'=> $validated['region'],
                'class'=> $validated['class'],
                'practice'=> $request->get('practice'),
                's3_license'=> $request->get('s3License'),
                's3_validity'=> $request->get('s3Validity'),
                'pharmacist_name'=> $request->get('pharmacistName'),
                'prc_id'=> $request->get('prcId'),
                'prc_validity'=> $request->get('prcValidity'),
                'remarks'=> $validated['remarks'],
                'sync_date'=> now()->format('m/d/Y'),
            ]);
        }catch(Exception $ex) {
            return response()->json([
                'message' => 'Unable to create customer!',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        
        return response()->json([
            'message' => 'Customer Successfully created!',
            'id' => $customer ? $customer->id : null,
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
