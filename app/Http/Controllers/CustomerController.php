<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customers = Customer::latest()->paginate(15);
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
            'analytics' => $total
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
    public function show(Customer $customer)
    {
        //
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
