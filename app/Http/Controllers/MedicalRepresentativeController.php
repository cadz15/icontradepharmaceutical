<?php

namespace App\Http\Controllers;

use App\Models\MedicalRepresentative;
use App\Services\MedicalRepresentativeAnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class MedicalRepresentativeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $medreps = MedicalRepresentative::latest()->paginate(15);

        return Inertia::render('Admin/MedicalRep', ['medicalReps' => $medreps]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string']
        ]);

        MedicalRepresentative::create([
            'name' => $validated['name'],
            'api_key' => Str::random(64)
        ]);

        return Inertia::render('Admin/MedicalRep', [
            'message' => 'Medical Representative created successfully!',
            'medicalReps' => MedicalRepresentative::all()  // Or any other data you want to pass to the page
        ]);
    }

    public function list()
    {
        $medreps = MedicalRepresentative::latest()->paginate(15);

        return Inertia::render('Admin/MedicalRep', [
            'message' => 'Medical Representative fetched!',
            'medicalReps' => $medreps  // Or any other data you want to pass to the page
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(MedicalRepresentative $medicalRepresentative, Request $request)
    {
        $analyticsService = new MedicalRepresentativeAnalyticsService($medicalRepresentative);
        $year = $request->get('year', date('Y'));
        $month = $request->get('month', date('m'));

        $analytics = $analyticsService->getMedicalRepresentativeAnalytics($year, $month);

        return Inertia::render('Admin/MedRepView', [
            'medicalRepresentative' => $medicalRepresentative,
            'analytics' => $analytics,
            'filters' => [
                'year' => $year,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MedicalRepresentative $medicalRepresentative)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'clear_product_app' => 'sometimes|boolean',
            'clear_sales_order_app' => 'sometimes|boolean',
        ]);

        $medicalRepresentative->name = $validated['name'];

        // Clear apps if requested
        if ($request->has('clear_product_app') && $request->clear_product_app) {
            $medicalRepresentative->product_app_id = null;
        }

        if ($request->has('clear_sales_order_app') && $request->clear_sales_order_app) {
            $medicalRepresentative->sales_order_app_id = null;
        }

        $medicalRepresentative->save();

        return redirect()->back()->with('success', 'Medical Representative updated successfully.');
    
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MedicalRepresentative $medicalRepresentative)
    {
        //
    }
}
