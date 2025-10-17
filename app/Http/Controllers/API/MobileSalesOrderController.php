<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\SalesOrder as ResourcesSalesOrder;
use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use App\Services\AnalyticsServices;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MobileSalesOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
       return ResourcesSalesOrder::collection(SalesOrder::where('medical_representative_id' , $request->user()->id)->withTrashed()->with(['customer', 'medicalRepresentative', 'saleItems'])->latest()->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {        
        $validated = $request->validate([

            'customerId'=>  ['required'],
            'salesOrderNumber'=>  ['required'],
            'dateSold'=>  ['required'],
            'total'=>  ['required'],
            'remarks'=>  ['sometimes'],
            'syncDate'=>  ['sometimes'],
            'status'=>  ['required'],
            'items' => ['required', 'array'],
            
            'items.*.id'=>  ['required'],
            'items.*.salesOrderId'=>  ['required'],
            'items.*.itemId'=>  ['required'],
            'items.*.quantity'=>  ['required'],
            'items.*.promo'=>  ['required'],
            'items.*.discount'=>  ['sometimes'],
            'items.*.freeItemQuantity'=>  ['sometimes'],
            'items.*.freeItemRemarks'=>  ['sometimes'],
            'items.*.remarks'=>  ['sometimes'],
            'items.*.total'=>  ['required'],
        ]);

        $salesItemsIds = [];

        try{
            $salesOrder = SalesOrder::create([
                'customer_id' => $request->get('customerOnlineId'),
                'medical_representative_id' => $request->user()->id,
                'sales_order_number' => $validated['salesOrderNumber'],
                'date_sold' => $validated['dateSold'],
                'total' => $validated['total'],
                'remarks' => $validated['remarks'],
                'sync_date' => now()->format('m/d/Y'),
                'status' => 'pending',
            ]);

            foreach ($validated['items'] as $item) {
                $salesItem = SalesOrderItem::create([
                    'sales_order_id' => $salesOrder->id,
                    'item_id' => $item['itemId'],
                    'quantity' => $item['quantity'],
                    'promo' => $item['promo'],
                    'discount' => $item['discount'],
                    'free_item_quantity' => $item['freeItemQuantity'],
                    'free_item_remarks' => $item['freeItemRemarks'],
                    'remarks' => $item['remarks'],
                    'total' => $item['total']
                ]);

                array_push($salesItemsIds, [$item['id'] => $salesItem->id]);
            }
        }catch(Exception $ex) {
            return response()->json([
                'message' => 'Sale order corrupted!',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        


        return response()->json([
            'message' => 'Sale Order successfully created!',
            'salesOrderId' => $salesOrder->id,
            'salesItemIds' => $salesItemsIds
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


    public function analytics(AnalyticsServices $analytics)
    {
        return response()->json([
            'analytics' => json_encode($analytics->medRepDashboard())
        ]);
    }
}
