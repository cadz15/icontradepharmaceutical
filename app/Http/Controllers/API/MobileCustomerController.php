<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\Customer as ResourcesCustomer;
use App\Models\Customer;
use Illuminate\Http\Request;

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
