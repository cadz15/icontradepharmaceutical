<?php

namespace App\Http\Controllers;

use App\Models\MedicalRepresentative;
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
    public function show(MedicalRepresentative $medicalRepresentative)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MedicalRepresentative $medicalRepresentative)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MedicalRepresentative $medicalRepresentative)
    {
        //
    }
}
