<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\Item as ResourcesItem;
use App\Models\Item;
use Illuminate\Http\Request;

class MobileItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ResourcesItem::collection(Item::with('images')->oldest('brand_name')->get());
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
