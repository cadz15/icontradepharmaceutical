<?php

namespace App\Http\Controllers;

use App\Models\MedicalRepresentative;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicalRepresentativeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/MedicalRep');
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
