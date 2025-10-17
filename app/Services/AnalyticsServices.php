<?php

namespace App\Services;

use App\Models\SalesOrder;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsServices {

    public function medRepDashboard()
    {
        // Get start and end of current month
        $startOfMonth = Carbon::now()->startOfMonth()->format('Y-m-d');
        $endOfMonth = Carbon::now()->endOfMonth()->format('Y-m-d');
        $currentYear = Carbon::now()->year;

        // 1. Total Sales (current month)
        $totalSales = DB::table('sales_orders')
            ->whereRaw("STR_TO_DATE(date_sold, '%m/%d/%Y') BETWEEN ? AND ?", [$startOfMonth, $endOfMonth])
            ->sum('total');

        // 2. Unique Customers (current month)
        $uniqueCustomers = DB::table('sales_orders')
            ->whereRaw("STR_TO_DATE(date_sold, '%m/%d/%Y') BETWEEN ? AND ?", [$startOfMonth, $endOfMonth])
            ->distinct('customer_id')
            ->count('customer_id');

        // 3. Most Popular Product Type (current month)
        $mostPopularProductType = DB::table('sales_order_items')
            ->join('sales_orders', 'sales_order_items.sales_order_id', '=', 'sales_orders.id')
            ->join('items', 'sales_order_items.item_id', '=', 'items.id')
            ->whereRaw("STR_TO_DATE(sales_orders.date_sold, '%m/%d/%Y') BETWEEN ? AND ?", [$startOfMonth, $endOfMonth])
            ->select('items.product_type', DB::raw('SUM(sales_order_items.quantity) as total_quantity'))
            ->groupBy('items.product_type')
            ->orderByDesc('total_quantity')
            ->limit(1)
            ->pluck('product_type')
            ->first();

        // 4. Monthly Total Sales (for current year)
        $monthlySales = DB::table('sales_orders')
            ->selectRaw("MONTH(STR_TO_DATE(date_sold, '%m/%d/%Y')) as month, SUM(total) as total_sales")
            ->whereRaw("YEAR(STR_TO_DATE(date_sold, '%m/%d/%Y')) = ?", [$currentYear])
            ->groupBy(DB::raw("MONTH(STR_TO_DATE(date_sold, '%m/%d/%Y'))"))
            ->orderBy('month')
            ->pluck('total_sales', 'month');
        $monthlySalesData = [];

        // Loop through months 1 to 12
        for ($m = 1; $m <= 12; $m++) {
            // Use value from $monthlySales if exists, else 0
            $monthlySalesData[] = $monthlySales->get($m, 0);
        }

        // 5. Monthly Sales by Product Type (current year)
        $monthlySalesByProductType = DB::table('sales_order_items')
            ->join('sales_orders', 'sales_order_items.sales_order_id', '=', 'sales_orders.id')
            ->join('items', 'sales_order_items.item_id', '=', 'items.id')
            ->whereRaw("YEAR(STR_TO_DATE(sales_orders.date_sold, '%m/%d/%Y')) = ?", [$currentYear])
            ->selectRaw("MONTH(STR_TO_DATE(sales_orders.date_sold, '%m/%d/%Y')) as month, items.product_type, SUM(sales_order_items.total) as total_sales")
            ->groupBy(DB::raw("MONTH(STR_TO_DATE(sales_orders.date_sold, '%m/%d/%Y'))"), 'items.product_type')
            ->orderBy('month')
            ->get();

        // Format into [product_type => [month => total_sales]]
        $formatted = [];
        foreach ($monthlySalesByProductType as $entry) {
            $formatted[$entry->product_type][$entry->month] = $entry->total_sales;
        }

        // Fill missing months with 0 for each product_type
        foreach ($formatted as $productType => $months) {
            $fullYear = [];
            for ($m = 1; $m <= 12; $m++) {
                // Use zero-based index ($m - 1)
                $fullYear[] = $months[$m] ?? 0;
            }
            $formatted[$productType] = $fullYear;
        }   


        // 6. Pie distribution of product_type for current month
        $productTypeSales = DB::table('sales_order_items')
            ->join('sales_orders', 'sales_order_items.sales_order_id', '=', 'sales_orders.id')
            ->join('items', 'sales_order_items.item_id', '=', 'items.id')
            ->whereRaw("MONTH(STR_TO_DATE(sales_orders.date_sold, '%m/%d/%Y')) = ?", [now()->month])
            ->whereRaw("YEAR(STR_TO_DATE(sales_orders.date_sold, '%m/%d/%Y')) = ?", [now()->year])
            ->select('items.product_type', DB::raw('SUM(sales_order_items.total) as total_sales'))
            ->groupBy('items.product_type')
            ->get();


        // Calculate total for percentage
        $grandTotal = $productTypeSales->sum('total_sales');

        // Compute percentage per type
        $pieData = $productTypeSales->map(function ($item) use ($grandTotal) {
            return [
                'product_type' => $item->product_type,
                'total_sales' => (float) $item->total_sales,
                'percentage' => $grandTotal > 0 
                    ? round(($item->total_sales / $grandTotal) * 100, 2)
                    : 0,
            ];
        });

        return [
            "monthlySales" => $totalSales,
            "totalCustomersSold" => $uniqueCustomers,
            "popularProductType" => $mostPopularProductType,
            "monthlyRevenue" => $monthlySalesData,
            "productTypeSales" => [
                "exclusive" => $formatted["exclusive"] ?? [],
                "generic" => $formatted["non-exclusive"] ?? [],
                "regulated" => $formatted["regulated"] ?? [],
            ],
            "productDistribution" => [
                [ "name" => "Exclusive", "population" => $pieData->firstWhere('product_type', 'exclusive')['percentage'] ?? 0, "color" => "#4ade80" ],
                [ "name" => "Generic", "population" => $pieData->firstWhere('product_type', 'non-exclusive')['percentage'] ?? 0, "color" => "#3b82f6" ],
                [ "name" => "Regulated", "population" => $pieData->firstWhere('product_type', 'regulated')['percentage'] ?? 0, "color" => "#f59e0b" ],
            ],
            "notifications" => [
                [
                "id" => 1,
                "title" => "Sample Notification",
                "message" => "Order #ORD-0012 has been placed by Customer A",
                "time" => "2 mins ago",
                "type" => "order", //order, alert, success, info
                "read" => false,
                ],
            ],
            "schedules" => [
                "2025-12-15" => [
                    [
                        "id" => 1,
                        "title" => "Meeting with Pharma Corp",
                        "time" => "10:00 AM",
                        "type" => "meeting", // meeting, training, review, event, planning
                    ],
                ]
            ],
        ];
    }
}