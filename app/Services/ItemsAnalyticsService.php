<?php

namespace App\Services;

use App\Models\Item;
use App\Models\SalesOrderItem;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ItemsAnalyticsService
{
    public function getItemsAnalytics($year = null, $month = null)
    {
        $year = $year ?: Carbon::now()->year;
        $month = $month ?: Carbon::now()->month;

        return [
            'statistics' => $this->getStatistics($year),
            'itemTrendsByYear' => $this->getItemTrendsByYear($year),
            'itemTrendsByMonth' => $this->getItemTrendsByMonth($year, $month),
            'popularItemTypes' => $this->getPopularItemTypes($year),
            'popularItems' => $this->getPopularItems($year),
            'lowInventoryItems' => $this->getLowInventoryItems(),
            'currentYear' => $year,
            'currentMonth' => $month,
        ];
    }

    public function getStatistics($year = null)
    {
        $yearFilter = $year ?: Carbon::now()->year;
        $totalItems = Item::count();
        $totalInventoryValue = Item::sum(DB::raw('inventory * catalog_price'));
        $lowInventoryCount = Item::where('inventory', '<', 10)->count();
        $outOfStockCount = Item::where('inventory', '<=', 0)->count();

        // Most sold item this month
        $mostSoldItem = SalesOrderItem::join('sales_orders', 'sales_order_items.sales_order_id', '=', 'sales_orders.id')
            ->join('items', 'sales_order_items.item_id', '=', 'items.id')
            ->whereRaw('YEAR(STR_TO_DATE(sales_orders.date_sold, "%m/%d/%Y")) = ?', [$yearFilter])
            ->select('items.brand_name', DB::raw('SUM(sales_order_items.quantity) as total_quantity'))
            ->groupBy('items.id', 'items.brand_name')
            ->orderBy('total_quantity', 'desc')
            ->first();

        return [
            'total_items' => $totalItems,
            'total_inventory_value' => $totalInventoryValue,
            'low_inventory_count' => $lowInventoryCount,
            'out_of_stock_count' => $outOfStockCount,
            'most_sold_item' => $mostSoldItem?->brand_name ?? 'No sales',
            'most_sold_quantity' => $mostSoldItem?->total_quantity ?? 0,
        ];
    }

    public function getItemTrendsByYear($year)
    {
        return SalesOrderItem::join('sales_orders', 'sales_order_items.sales_order_id', '=', 'sales_orders.id')
            ->join('items', 'sales_order_items.item_id', '=', 'items.id')
            ->where('sales_orders.date_sold', 'like', "%$year%")
            ->select(
                DB::raw('MONTH(STR_TO_DATE(sales_orders.date_sold, "%m/%d/%Y")) as month'),
                DB::raw('SUM(sales_order_items.quantity) as total_quantity'),
                DB::raw('COUNT(DISTINCT items.id) as unique_items'),
                DB::raw('SUM(sales_order_items.total) as total_sales')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'month_name' => Carbon::create()->month($item->month)->format('M'),
                    'total_quantity' => (int) $item->total_quantity,
                    'unique_items' => (int) $item->unique_items,
                    'total_sales' => (float) $item->total_sales,
                ];
            });
    }

    public function getItemTrendsByMonth($year, $month)
    {
        $startDate = Carbon::create($year, $month, 1);
        $endDate = $startDate->copy()->endOfMonth();

        return SalesOrderItem::join('sales_orders', 'sales_order_items.sales_order_id', '=', 'sales_orders.id')
            ->join('items', 'sales_order_items.item_id', '=', 'items.id')
            ->whereRaw('STR_TO_DATE(sales_orders.date_sold, "%m/%d/%Y") BETWEEN ? AND ?', [$startDate, $endDate])
            ->select(
                'items.id',
                'items.brand_name',
                'items.generic_name',
                'items.product_type',
                DB::raw('SUM(sales_order_items.quantity) as total_quantity'),
                DB::raw('SUM(sales_order_items.total) as total_sales'),
                DB::raw('COUNT(DISTINCT sales_orders.customer_id) as unique_customers')
            )
            ->groupBy('items.id', 'items.brand_name', 'items.generic_name', 'items.product_type')
            ->orderBy('total_quantity', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'brand_name' => $item->brand_name,
                    'generic_name' => $item->generic_name,
                    'product_type' => $item->product_type,
                    'total_quantity' => (int) $item->total_quantity,
                    'total_sales' => (float) $item->total_sales,
                    'unique_customers' => (int) $item->unique_customers,
                ];
            });
    }

    public function getPopularItemTypes($year = null)
    {
        $yearFilter = $year ?: Carbon::now()->year;
        return SalesOrderItem::join('sales_orders', 'sales_order_items.sales_order_id', '=', 'sales_orders.id')
            ->join('items', 'sales_order_items.item_id', '=', 'items.id')
            ->whereRaw('YEAR(STR_TO_DATE(sales_orders.date_sold, "%m/%d/%Y")) = ?', [$yearFilter])
            ->select(
                'items.product_type',
                DB::raw('SUM(sales_order_items.quantity) as total_quantity'),
                DB::raw('SUM(sales_order_items.total) as total_sales'),
                DB::raw('COUNT(DISTINCT items.id) as unique_items')
            )
            ->groupBy('items.product_type')
            ->orderBy('total_quantity', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'product_type' => $item->product_type,
                    'total_quantity' => (int) $item->total_quantity,
                    'total_sales' => (float) $item->total_sales,
                    'unique_items' => (int) $item->unique_items,
                ];
            });
    }

    public function getPopularItems($year = null)
    {
        $yearFilter = $year ?: Carbon::now()->year;
        return SalesOrderItem::join('sales_orders', 'sales_order_items.sales_order_id', '=', 'sales_orders.id')
            ->join('items', 'sales_order_items.item_id', '=', 'items.id')
            ->whereRaw('YEAR(STR_TO_DATE(sales_orders.date_sold, "%m/%d/%Y")) = ?', [$yearFilter])
            ->select(
                'items.id',
                'items.brand_name',
                'items.generic_name',
                'items.product_type',
                'items.catalog_price',
                DB::raw('SUM(sales_order_items.quantity) as total_quantity'),
                DB::raw('SUM(sales_order_items.total) as total_sales'),
                DB::raw('COUNT(DISTINCT sales_orders.customer_id) as unique_customers')
            )
            ->groupBy('items.id', 'items.brand_name', 'items.generic_name', 'items.product_type', 'items.catalog_price')
            ->orderBy('total_quantity', 'desc')
            ->limit(15)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'brand_name' => $item->brand_name,
                    'generic_name' => $item->generic_name,
                    'product_type' => $item->product_type,
                    'catalog_price' => (float) $item->catalog_price,
                    'total_quantity' => (int) $item->total_quantity,
                    'total_sales' => (float) $item->total_sales,
                    'unique_customers' => (int) $item->unique_customers,
                ];
            });
    }

    public function getLowInventoryItems()
    {
        return Item::where('inventory', '<', 10)
            ->orderBy('inventory')
            ->orderBy('brand_name')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'brand_name' => $item->brand_name,
                    'generic_name' => $item->generic_name,
                    'product_type' => $item->product_type,
                    'milligrams' => $item->milligrams,
                    'supply' => $item->supply,
                    'catalog_price' => (float) $item->catalog_price,
                    'inventory' => (int) $item->inventory,
                    'inventory_value' => (float) ($item->inventory * (int) $item->catalog_price),
                ];
            });
    }
}