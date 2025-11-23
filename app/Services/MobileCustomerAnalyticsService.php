<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class MobileCustomerAnalyticsService
{
    protected $customer;

    public function __construct(Customer $customer)
    {
        $this->customer = $customer;
    }

    public function getCustomerAnalytics($period = 30, $year = null)
    {
        $year = $year ?: Carbon::now()->year;

        return [
            'statistics' => $this->getStatistics($period, $year),
            'productTypeData' => $this->getProductTypeAnalytics($period, $year),
            'salesTrendData' => $this->getSalesTrendAnalytics($period, $year),
            'currentSalesOrders' => $this->getCurrentSalesOrders($year),
            'historySalesOrders' => $this->getHistorySalesOrders($period, $year),
            'productPurchaseTrend' => $this->getProductPurchaseTrendByYear($year),
        ];
    }

    public function getStatistics($period = 30, $year = null)
    {
        // Total Purchase (all time)
        $totalPurchase = SalesOrder::where('customer_id', $this->customer->id)
            ->sum('total');

        // Most purchased product type (all time)
        $mostPurchasedType = SalesOrderItem::join('sales_orders', 'sales_order_items.sales_order_id', '=', 'sales_orders.id')
            ->join('items', 'sales_order_items.item_id', '=', 'items.id')
            ->where('sales_orders.customer_id', $this->customer->id)
            ->where('sales_orders.date_sold', 'like', "%$year%")
            ->select('items.product_type', DB::raw('SUM(sales_order_items.quantity) as total_quantity'))
            ->groupBy('items.product_type')
            ->orderBy('total_quantity', 'desc')
            ->first();

        // Sales order counts (all time)
        $salesOrderCounts = SalesOrder::where('customer_id', $this->customer->id)
            ->select(
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as current_orders')
            )
            ->first();

        return [
            'total_purchase' => (float) $totalPurchase,
            'most_purchased_type' => $mostPurchasedType?->product_type ?? 'No data',
            'total_orders' => (int) ($salesOrderCounts->total_orders ?? 0),
            'current_orders' => (int) ($salesOrderCounts->current_orders ?? 0),
        ];
    }

    public function getProductTypeAnalytics($period = 30, $year = null)
    {
        return SalesOrderItem::join('sales_orders', 'sales_order_items.sales_order_id', '=', 'sales_orders.id')
            ->join('items', 'sales_order_items.item_id', '=', 'items.id')
            ->where('sales_orders.customer_id', $this->customer->id)
            ->where('sales_orders.date_sold', 'like', "%$year%")
            ->select('items.product_type', DB::raw('SUM(sales_order_items.quantity) as total_quantity'))
            ->groupBy('items.product_type')
            ->orderBy('total_quantity', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'product_type' => $item->product_type,
                    'quantity' => (int) $item->total_quantity,
                ];
            });
    }

    public function getProductPurchaseTrendByYear($year = null)
    {
        $year = $year ?: Carbon::now()->year;

        // Get all products purchased by this customer in the specified year
        $productTrends = SalesOrderItem::join('sales_orders', 'sales_order_items.sales_order_id', '=', 'sales_orders.id')
            ->join('items', 'sales_order_items.item_id', '=', 'items.id')
            ->where('sales_orders.customer_id', $this->customer->id)
            ->where('sales_orders.date_sold', 'like', "%$year%")
            ->select(
                'items.id',
                'items.brand_name',
                'items.generic_name',
                DB::raw('MONTH(STR_TO_DATE(sales_orders.date_sold, "%m/%d/%Y")) as month'),
                DB::raw('SUM(sales_order_items.quantity) as monthly_quantity')
            )
            ->groupBy('items.id', 'items.brand_name', 'items.generic_name', 'month')
            ->orderBy('items.brand_name')
            ->orderBy('month')
            ->get();

        // Structure the data by product
        $productsData = [];
        
        foreach ($productTrends as $trend) {
            $productKey = $trend->id;
            
            if (!isset($productsData[$productKey])) {
                $productsData[$productKey] = [
                    'id' => $trend->id,
                    'brand_name' => $trend->brand_name,
                    'generic_name' => $trend->generic_name,
                    'monthly_data' => array_fill(1, 12, 0), // Initialize all months with 0
                    'total_quantity' => 0,
                ];
            }
            
            $productsData[$productKey]['monthly_data'][$trend->month] = (int)$trend->monthly_quantity;
            $productsData[$productKey]['total_quantity'] += (int)$trend->monthly_quantity;
        }

        // Calculate trends vs previous month
        foreach ($productsData as &$product) {
            $product['trends'] = [];
            for ($month = 1; $month <= 12; $month++) {
                $current = $product['monthly_data'][$month];
                $previous = $month > 1 ? $product['monthly_data'][$month - 1] : 0;
                
                if ($previous == 0) {
                    $trend = $current > 0 ? '+100%' : '0%';
                } else {
                    $change = (($current - $previous) / $previous) * 100;
                    $trend = $change > 0 ? '+' . round($change, 1) . '%' : round($change, 1) . '%';
                }
                
                $product['trends'][$month] = $trend;
            }
        }

        // Convert monthly_data and trends to simple arrays (remove month keys)
        foreach ($productsData as &$product) {
            $product['monthly_data'] = array_values($product['monthly_data']);
            $product['trends'] = array_values($product['trends']);
        }

        // Sort by total quantity in descending order and take top products
        $productsData = collect($productsData)->sortByDesc('total_quantity')->take(10)->values()->toArray();

        return [
            'products' => $productsData,
            'year' => (int) $year,
        ];
    }

    public function getSalesTrendAnalytics($period = 30, $year= null)
    {
        $startDate = Carbon::now()->subDays($period);

        return SalesOrder::where('customer_id', $this->customer->id)
            ->where('created_at', '>=', $startDate)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as order_count'),
                DB::raw('SUM(total) as total_sales')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'order_count' => (int) $item->order_count,
                    'total_sales' => (float) $item->total_sales,
                ];
            });
    }

    public function getCurrentSalesOrders()
    {
        return SalesOrder::with(['saleItems.item'])
            ->where('customer_id', $this->customer->id)
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return $this->formatSalesOrder($order);
            });
    }

    public function getHistorySalesOrders($period = 30)
    {
        $startDate = Carbon::now()->subDays($period);

        return SalesOrder::with(['saleItems.item'])
            ->where('customer_id', $this->customer->id)
            ->where('status', '!=', 'pending')
            ->where('created_at', '>=', $startDate)
            ->orderBy('created_at', 'desc')
            ->take(15) // Limit to 15 most recent for mobile performance
            ->get()
            ->map(function ($order) {
                return $this->formatSalesOrder($order);
            });
    }

    private function formatSalesOrder($order)
    {
        return [
            'id' => $order->id,
            'sales_order_number' => $order->sales_order_number,
            'date_sold' => $order->date_sold,
            'total' => $order->total,
            'status' => $order->status,
            'saleItems' => $order->saleItems->map(function ($item) {
                return [
                    'id' => $item->id,
                    'quantity' => $item->quantity,
                    'total' => (float) $item->total,
                    'item' => [
                        'id' => $item->item->id,
                        'brand_name' => $item->item->brand_name,
                        'generic_name' => $item->item->generic_name,
                    ]
                ];
            })
        ];
    }
}