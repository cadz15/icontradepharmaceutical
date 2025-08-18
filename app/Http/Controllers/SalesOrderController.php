<?php

namespace App\Http\Controllers;

use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;

class SalesOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sales = SalesOrder::with(['customer', 'medical_representative'])->latest()->paginate(15);

        return Inertia::render('Admin/SalesOrder', [
            'sales' => $sales
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer' => ['required', 'string'],
            'sales_order_number' => ['required', 'string'],
            'date_sold' => ['required', 'string'],   
            'total' => ['required', 'string'],    
            'remarks' => ['sometimes', 'string'],
            'sync_date' => ['sometimes', 'string'],

            'items' => ['required', 'array'],
            'items.*.item_id' => ['required', 'string'],
            'items.*.quantity' => ['required', 'string'],
            'items.*.promo' => ['required', 'string'],
            'items.*.remarks' => ['sometimes', 'string'],
            'items.*.total' => ['required', 'string'],

            // Conditional fields
            'items.*.free_item_quantity' => ['required_if:items.*.promo,free', 'string'],
            'items.*.free_item_remarks' => ['required_if:items.*.promo,free', 'string'],
            'items.*.discount' => ['required_if:items.*.promo,discount', 'string'],
        ]);


        $sales = SalesOrder::create([
            'customer' => $validated['customer'],
            'medical_representative_id' => $request->user()->id,
            'sales_order_number' => $validated['sales_order_number'],
            'date_sold' => $validated['date_sold'],
            'total' => $validated['total'],
            'remarks' => $request->get('remarks'),
            'sync_date' => $request->get('sync_date'),
        ]);


        foreach($request->get('items') as $item) {
            SalesOrderItem::create([
                'sales_order_id' => $sales->id,
                'item_id' => $item->id,
                'quantity' => $item->quantity,
                'promo' => $item->promo,
                'discount' => $item?->discount,
                'free_item_quantity' => $item?->free_item_quantity,
                'free_item_remarks' => $item?->free_item_remarks,
                'remarks' => $item?->remarks,
                'total' => $item->total
            ]);
        }


        return response()->json([
            'message' => 'Sales Order created!',
        ], Response::HTTP_ACCEPTED);
    }

    /**
     * Display the specified resource.
     */
    public function show(SalesOrder $salesOrder)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SalesOrder $salesOrder)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SalesOrder $salesOrder)
    {
        //
    }
}
