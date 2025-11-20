<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CustomerAnalyticsService
{
    protected $customer;

    public function __construct(Customer $customer)
    {
        $this->customer = $customer;
    }

    public function getCustomerAnalytics($period = 30, $year = null)
    {
        return [
            'statistics' => $this->getStatistics($period),
            'productTypeData' => $this->getProductTypeAnalytics($period),
            'salesTrendData' => $this->getSalesTrendAnalytics($period),
            'currentSalesOrders' => $this->getCurrentSalesOrders(),
            'historySalesOrders' => $this->getHistorySalesOrders($period),
            'productPurchaseTrend' => $this->getProductPurchaseTrendByYear($year), // Add this line
        ];
    }

    public function getStatistics($period = 30)
    {
        $startDate = Carbon::now()->subDays($period);

        // Total Purchase
        $totalPurchase = SalesOrder::where('customer_id', $this->customer->id)
            // ->where('created_at', '>=', $startDate) // total from the start
            ->sum('total');

        // Most purchased product type
        $mostPurchasedType = SalesOrderItem::join('sales_orders', 'sales_order_items.sales_order_id', '=', 'sales_orders.id')
            ->join('items', 'sales_order_items.item_id', '=', 'items.id')
            ->where('sales_orders.customer_id', $this->customer->id)
            // ->where('sales_orders.created_at', '>=', $startDate) // all time sales
            ->select('items.product_type', DB::raw('SUM(sales_order_items.quantity) as total_quantity'))
            ->groupBy('items.product_type')
            ->orderBy('total_quantity', 'desc')
            ->first();

        // Sales order counts
        $salesOrderCounts = SalesOrder::where('customer_id', $this->customer->id)
            // ->where('created_at', '>=', $startDate)
            ->select(
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as current_orders')
            )
            ->first();

        return [
            'total_purchase' => $totalPurchase,
            'most_purchased_type' => $mostPurchasedType?->product_type ?? 'No data',
            'total_orders' => $salesOrderCounts->total_orders ?? 0,
            'current_orders' => $salesOrderCounts->current_orders ?? 0,
        ];
    }

    public function getProductTypeAnalytics($period = 30)
    {
        $startDate = Carbon::now()->subDays($period);

        return SalesOrderItem::join('sales_orders', 'sales_order_items.sales_order_id', '=', 'sales_orders.id')
            ->join('items', 'sales_order_items.item_id', '=', 'items.id')
            ->where('sales_orders.customer_id', $this->customer->id)
            // ->where('sales_orders.created_at', '>=', $startDate)
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

        // Convert to array and sort alphabetically by brand name
        $productsData = collect($productsData)->sortBy('total_quantity')->values()->toArray();

        return [
            'products' => $productsData,
            'year' => $year,
        ];
    }

    public function getSalesTrendAnalytics($period = 30)
    {
        $startDate = Carbon::now()->subDays($period);

        return SalesOrder::where('customer_id', $this->customer->id)
            // ->where('created_at', '>=', $startDate)
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
            ->get();
    }

    public function getHistorySalesOrders($period = 30)
    {
        $startDate = Carbon::now()->subDays($period);

        return SalesOrder::with(['saleItems.item'])
            ->where('customer_id', $this->customer->id)
            ->where('status', '!=', 'pending')
            // ->where('created_at', '>=', $startDate) // all time sales
            ->orderBy('created_at', 'desc')
            ->paginate(15);
    }
}