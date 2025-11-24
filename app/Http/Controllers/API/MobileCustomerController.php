<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\Customer as ResourcesCustomer;
use App\Models\Customer;
use App\Models\Dcr;
use App\Services\MobileCustomerAnalyticsService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;

class MobileCustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ResourcesCustomer::collection(Customer::latest()->withTrashed()->get());
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
     * Display the specified resource. Analytics
     */
    public function show(string $id, Request $request): JsonResponse
    {
        try {
            // Validate customer exists
            $customer = Customer::find($id);
            if (!$customer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Customer not found'
                ], 404);
            }

            // Get parameters with defaults
            $year = $request->get('year', Carbon::now()->year);
            $period = $request->get('period', 30);

            $analyticsService = new MobileCustomerAnalyticsService($customer);
            $analytics = $analyticsService->getCustomerAnalytics($period, $year);

            return response()->json([
                'success' => true,
                'data' => $analytics
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load customer analytics',
                'error' => $e->getMessage()
            ], 500);
        }
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


    public function addDcr(Request $request) {
        $validated = $request->validate([
            'name'=> ['required'],
            'customerOnlineId' => ['required'],
            'customerId' => ['required'],
            'dcrDate' => ['required'],
            'practice' => ['sometimes'],
            'signature' => ['sometimes'],
            'remarks'=> ['sometimes'],
            'syncDate'=> ['sometimes'],
        ]);

        $dcr = null;

        try {
            $dcr = Dcr::create([
                'name' => $validated['name'],
                'medical_representative_id' => $request->user()->id,
                'customer_id' => $validated['customerOnlineId'],
                'dcr_date' => $validated['dcrDate'],
                'practice' => $validated['practice'],
                'signature' => $request->get('signature'),
                'remarks' => $request->get('remarks'),
                'sync_date' => now()->format('m/d/Y'),
            ]);

        } catch (\Throwable $th) {
             return response()->json([
                'message' => 'Unable to create dcr!',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json([
            'message' => 'DCR Successfully created!',
            'id' => $dcr ? $dcr->id : null,
        ], Response::HTTP_OK);
    }

    public function getDcr(Request $request) {
        $medRepId = $request->user()->id;

        return ResourcesCustomer::collection(Dcr::where('medical_representative_id', $medRepId)->latest()->get());
    }
}
