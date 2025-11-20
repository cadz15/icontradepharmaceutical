<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Services\CustomerAnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $address = $request->get('address');
        $practice = $request->get('practice');
        $hasPharmacist = $request->get('hasPharmacist');
        $s3 = $request->get('s3');

        $customers = Customer::when($search != "", function($query) use($search) {
            $query->where('name', 'like', "%$search%");
        })
        ->when($address != "", function($query) use($address) {
            $query->where('full_address', 'like', "%$address%");
        })
        ->when($practice != "", function($query) use($practice) {
            $query->where('practice', 'like', "%$practice%");
        })
        ->when($hasPharmacist != "all", function($query) use($hasPharmacist) {
            if($hasPharmacist == "yes") {
                $query->whereNotNull('pharmacist_name');
            }else {
                $query->whereNull('pharmacist_name')->orWhere('pharmacist_name', "");
            }
        })
        ->when($s3 != "", function($query) use($s3) {
            if($s3 == "yes") {
                $query->whereNotNull('s3_license');
            }else {
                $query->whereNull('s3_license')->orWhere('s3_license', "");
            }
        })
        ->latest()->paginate(15);


        $total = Customer::query()
        // Count the non-null s3_license without affecting other counts
        ->selectRaw('COUNT(DISTINCT CASE WHEN s3_license IS NOT NULL THEN id END) as total_s3_license')
        
        // Count the non-null pharmacist_name without affecting other counts
        ->addSelect(DB::raw('COUNT(DISTINCT CASE WHEN pharmacist_name IS NOT NULL THEN id END) as total_pharmacists'))

        // Get unique regions count
        ->addSelect(DB::raw('COUNT(DISTINCT region) as unique_regions_count'))
        
        // Execute the query
        ->first();

        return Inertia::render('Admin/Customers', [
            'customers' => $customers,
            'analytics' => $total,
            'filters' => $request->all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string'],
            'full_address' => ['required', 'string'],
            'short_address' => ['required', 'string'],
            'region' => ['required', 'string'],
            'class' => ['required', 'string'],
            'practice' => ['required', 'string'],
            's3_license' => ['sometimes'],
            's3_validity' => ['required_with:s3_license'],
            'pharmacist_name' => ['sometimes'],
            'prc_id' => ['required_with:pharmacist_name'],
            'prc_validity' => ['required_with:pharmacist_name'],
            'remarks' => ['sometimes']
        ]);


        Customer::create([
            'name' => $validated['name'],
            'full_address' => $validated['full_address'],
            'short_address' => $validated['short_address'],
            'region' => $validated['region'],
            'class' => $validated['class'],
            'practice' => $validated['practice'],
            's3_license' => $request->get('s3_license'),
            's3_validity' => $request->get('s3_validity'),
            'pharmacist_name' => $request->get('pharmacist_name'),
            'prc_id' => $request->get('prc_id'),
            'prc_validity' => $request->get('prc_validity'),
            'remarks' => $request->get('remarks'),
        ]);

        return Inertia::render('Admin/Customers', [
            'message' => 'Customer Successfully created!'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer, Request $request)
    {
        $analyticsService = new CustomerAnalyticsService($customer);
        $period = $request->get('period', 30); // Default to 30 days        
        $year = $request->get('year', date('Y'));

        $analytics = $analyticsService->getCustomerAnalytics($period, $year);
        
        return Inertia::render('Admin/CustomerView', [
            'customer' => $customer,
            'analytics' => $analytics,
            'filters' => [
                'period' => $period,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,  $id)
    {
        $validated = $request->validate([
            'name' => ['required', 'string'],
            'full_address' => ['required', 'string'],
            'short_address' => ['required', 'string'],
            'region' => ['required', 'string'],
            'class' => ['required', 'string'],
            'practice' => ['required', 'string'],
            's3_license' => ['sometimes'],
            's3_validity' => ['required_with:s3_license'],
            'pharmacist_name' => ['sometimes'],
            'prc_id' => ['required_with:pharmacist_name'],
            'prc_validity' => ['required_with:pharmacist_name'],
            'remarks' => ['sometimes']
        ]);

        $customer = Customer::where('id', $id)->first();

        if($customer) {
            $customer->update([
                'name' => $validated['name'],
                'full_address' => $validated['full_address'],
                'short_address' => $validated['short_address'],
                'region' => $validated['region'],
                'class' => $validated['class'],
                'practice' => $validated['practice'],
                's3_license' => $request->get('s3_license'),
                's3_validity' => $request->get('s3_validity'),
                'pharmacist_name' => $request->get('pharmacist_name'),
                'prc_id' => $request->get('prc_id'),
                'prc_validity' => $request->get('prc_validity'),
                'remarks' => $request->get('remarks'),
                'sync_date' => null,
            ]);

            if($request->has('fromView')) {
                $analyticsService = new CustomerAnalyticsService($customer);
                $period = $request->get('period', 30); // Default to 30 days        
                $year = $request->get('year', date('Y'));

                $analytics = $analyticsService->getCustomerAnalytics($period, $year);
                
                return Inertia::render('Admin/CustomerView', [
                    'message' => 'Customer Successfully updated!',
                    'customer' => $customer,
                    'analytics' => $analytics,
                    'filters' => [
                        'period' => $period,
                    ],
                ]);
            }

            return Inertia::render('Admin/Customers', [
                'message' => 'Customer Successfully updated!'
            ]);
        }else {
            return abort(404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $customer = Customer::where('id', $id)->first();
        
        if($customer){
            $customer->update([     
                'sync_date' => null,
            ]);

            $customer->delete();
            return redirect()->route('customer.index')->with('success', 'Post deleted successfully.');
        }

        return abort(404);
    }
}
