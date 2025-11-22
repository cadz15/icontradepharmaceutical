<?php

namespace App\Services;

use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use App\Models\Item;
use App\Models\MedicalRepresentative;
use App\Models\Customer;
use App\Models\Event;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminAnalyticsService
{
    public function getAdminAnalytics($year = null, $month = null)
    {
        $year = $year ?: Carbon::now()->year;
        $month = $month ?: Carbon::now()->month;

        return [
            'statistics' => $this->getStatistics($year, $month),
            'productTypeDistribution' => $this->getProductTypeDistribution($year),
            'regionPerformance' => $this->getRegionPerformance($year),
            'topMedicalRepresentatives' => $this->getTopMedicalRepresentatives($year),
            'pendingSalesOrders' => $this->getPendingSalesOrders(),
            'outOfStockItems' => $this->getOutOfStockItems(),
            'topPopularItems' => $this->getTopPopularItems($year),
            'eventsCalendar' => $this->getEventsCalendar($year, $month),
            'medicalRepresentatives' => MedicalRepresentative::orderBy('name')->get(), // Add this
            'customers' => Customer::orderBy('name')->get(), // Add this
            'currentYear' => $year,
            'currentMonth' => $month,
        ];
    }

    public function getStatistics($year, $month)
    {
        $currentMonthStart = Carbon::create($year, $month, 1);
        $currentMonthEnd = $currentMonthStart->copy()->endOfMonth();
        
        $yearStart = Carbon::create($year, 1, 1);
        $yearEnd = Carbon::create($year, 12, 31);

        // Monthly Sales
        $monthlySales = SalesOrder::whereRaw('STR_TO_DATE(sales_orders.date_sold, "%m/%d/%Y") BETWEEN ? AND ?', [$currentMonthStart, $currentMonthEnd])
            ->sum('total');

        // Yearly Sales
        $yearlySales = SalesOrder::whereRaw('STR_TO_DATE(sales_orders.date_sold, "%m/%d/%Y") BETWEEN ? AND ?', [$yearStart, $yearEnd])
            ->sum('total');

        // Total Customers
        $totalCustomers = Customer::count();

        // Total Medical Representatives
        $totalMedicalReps = MedicalRepresentative::count();

        // Pending Orders Count
        $pendingOrdersCount = SalesOrder::where('status', 'pending')->count();

        // Out of Stock Items Count
        $outOfStockCount = Item::where('inventory', '<=', 10)->count();

        // Monthly Growth
        $lastMonthStart = $currentMonthStart->copy()->subMonth();
        $lastMonthEnd = $lastMonthStart->copy()->endOfMonth();
        
        $lastMonthSales = SalesOrder::whereRaw('STR_TO_DATE(sales_orders.date_sold, "%m/%d/%Y") BETWEEN ? AND ?', [$lastMonthStart, $lastMonthEnd])
            ->sum('total');

        $monthlyGrowth = $lastMonthSales > 0 
            ? (($monthlySales - $lastMonthSales) / $lastMonthSales) * 100 
            : 0;

        return [
            'monthly_sales' => $monthlySales,
            'yearly_sales' => $yearlySales,
            'total_customers' => $totalCustomers,
            'total_medical_reps' => $totalMedicalReps,
            'pending_orders_count' => $pendingOrdersCount,
            'out_of_stock_count' => $outOfStockCount,
            'monthly_growth' => $monthlyGrowth,
        ];
    }

    public function getProductTypeDistribution($year)
    {
        return SalesOrderItem::join('sales_orders', 'sales_order_items.sales_order_id', '=', 'sales_orders.id')
            ->join('items', 'sales_order_items.item_id', '=', 'items.id')
            ->whereRaw('YEAR(STR_TO_DATE(sales_orders.date_sold, "%m/%d/%Y")) = ?', [$year])
            ->select(
                'items.product_type',
                DB::raw('SUM(sales_order_items.quantity) as total_quantity'),
                DB::raw('SUM(sales_order_items.total) as total_sales'),
                DB::raw('COUNT(DISTINCT items.id) as unique_items')
            )
            ->groupBy('items.product_type')
            ->orderBy('total_sales', 'desc')
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

    public function getRegionPerformance($year)
    {
        return SalesOrder::join('customers', 'sales_orders.customer_id', '=', 'customers.id')
            ->whereRaw('YEAR(STR_TO_DATE(sales_orders.date_sold, "%m/%d/%Y")) = ?', [$year])
            ->select(
                'customers.region',
                DB::raw('SUM(sales_orders.total) as total_sales'),
                DB::raw('COUNT(DISTINCT sales_orders.customer_id) as total_customers'),
                DB::raw('COUNT(sales_orders.id) as total_orders')
            )
            ->groupBy('customers.region')
            ->orderBy('total_sales', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'region' => $item->region,
                    'total_sales' => (float) $item->total_sales,
                    'total_customers' => (int) $item->total_customers,
                    'total_orders' => (int) $item->total_orders,
                ];
            });
    }

    public function getTopMedicalRepresentatives($year)
    {
        return SalesOrder::join('medical_representatives', 'sales_orders.medical_representative_id', '=', 'medical_representatives.id')
            ->whereRaw('YEAR(STR_TO_DATE(sales_orders.date_sold, "%m/%d/%Y")) = ?', [$year])
            ->select(
                'medical_representatives.id',
                'medical_representatives.name',
                DB::raw('SUM(sales_orders.total) as total_sales'),
                DB::raw('COUNT(DISTINCT sales_orders.customer_id) as total_customers'),
                DB::raw('COUNT(sales_orders.id) as total_orders')
            )
            ->groupBy('medical_representatives.id', 'medical_representatives.name')
            ->orderBy('total_sales', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'total_sales' => (float) $item->total_sales,
                    'total_customers' => (int) $item->total_customers,
                    'total_orders' => (int) $item->total_orders,
                ];
            });
    }

    public function getPendingSalesOrders()
    {
        return SalesOrder::with(['customer', 'medicalRepresentative'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'sales_order_number' => $order->sales_order_number,
                    'customer_name' => $order->customer->name,
                    'medical_representative_name' => $order->medicalRepresentative->name,
                    'date_sold' => $order->date_sold,
                    'total' => (float) $order->total,
                    'status' => $order->status,
                ];
            });
    }

    public function getOutOfStockItems()
    {
        return Item::where('inventory', '<=', 10)
            ->orderBy('brand_name')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'brand_name' => $item->brand_name,
                    'generic_name' => $item->generic_name,
                    'product_type' => $item->product_type,
                    'catalog_price' => (float) $item->catalog_price,
                    'inventory' => (int) $item->inventory,
                ];
            });
    }

    public function getTopPopularItems($year)
    {
        return SalesOrderItem::join('sales_orders', 'sales_order_items.sales_order_id', '=', 'sales_orders.id')
            ->join('items', 'sales_order_items.item_id', '=', 'items.id')
            ->whereRaw('YEAR(STR_TO_DATE(sales_orders.date_sold, "%m/%d/%Y")) = ?', [$year])
            ->select(
                'items.id',
                'items.brand_name',
                'items.generic_name',
                'items.product_type',
                DB::raw('SUM(sales_order_items.quantity) as total_quantity'),
                DB::raw('SUM(sales_order_items.total) as total_sales')
            )
            ->groupBy('items.id', 'items.brand_name', 'items.generic_name', 'items.product_type')
            ->orderBy('total_quantity', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'brand_name' => $item->brand_name,
                    'generic_name' => $item->generic_name,
                    'product_type' => $item->product_type,
                    'total_quantity' => (int) $item->total_quantity,
                    'total_sales' => (float) $item->total_sales,
                ];
            });
    }

    public function getEventsCalendar($year, $month)
    {
        $startDate = Carbon::create($year, $month, 1);
        $endDate = $startDate->copy()->endOfMonth();

        $events = Event::with(['medicalRepresentative', 'customer'])
            ->whereBetween('event_date', [$startDate, $endDate])
            ->orderBy('event_date')
            ->orderBy('start_time')
            ->get();

        $calendarData = [];
        $daysInMonth = $startDate->daysInMonth;

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $date = Carbon::create($year, $month, $day);
            $dateString = $date->format('Y-m-d');
            
            $dayEvents = $events->filter(function ($event) use ($dateString) {
                $eventStart = Carbon::parse($event->event_date);
                $eventEnd = $event->end_date ? Carbon::parse($event->end_date) : $eventStart;
                
                return $dateString >= $eventStart->format('Y-m-d') && 
                    $dateString <= $eventEnd->format('Y-m-d');
            });

            $calendarData[] = [
                'date' => $dateString,
                'day' => $day,
                'is_current_month' => true,
                'is_today' => $date->isToday(),
                'events' => $dayEvents->map(function ($event) use ($dateString) {
                    $eventStart = Carbon::parse($event->event_date);
                    $eventEnd = $event->end_date ? Carbon::parse($event->end_date) : $eventStart;
                    $currentDate = Carbon::parse($dateString);
                    
                    $isFirstDay = $currentDate->isSameDay($eventStart);
                    $isLastDay = $eventEnd && $currentDate->isSameDay($eventEnd);
                    $isMultiDay = $eventEnd && !$eventStart->isSameDay($eventEnd);
                    
                    return [
                        'id' => $event->id,
                        'title' => $event->title,
                        'event_type' => $event->event_type,
                        'start_time' => $event->start_time ? Carbon::parse($event->start_time)->format('H:i') : null,
                        'end_time' => $event->end_time ? Carbon::parse($event->end_time)->format('H:i') : null,
                        'status' => $event->status,
                        'medical_representative' => $event->medicalRepresentative->name,
                        'customer' => $event->customer?->name,
                        'description' => $event->description,
                        'location' => $event->location,
                        'notes' => $event->notes,
                        'is_multi_day' => $isMultiDay,
                        'is_first_day' => $isFirstDay,
                        'is_last_day' => $isLastDay,
                        'event_date' => Carbon::parse($event->event_date)->format('Y-m-d'),
                        'end_date' => $event->end_date ? Carbon::parse($event->end_date)->format('Y-m-d') : null,
                    ];
                })->toArray(),
            ];
        }

        return $calendarData;
    }
}