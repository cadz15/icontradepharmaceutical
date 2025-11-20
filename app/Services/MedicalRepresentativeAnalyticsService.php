<?php

namespace App\Services;

use App\Models\Dcr;
use App\Models\Event;
use App\Models\MedicalRepresentative;
use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MedicalRepresentativeAnalyticsService
{
    protected $medicalRepresentative;

    public function __construct(MedicalRepresentative $medicalRepresentative)
    {
        $this->medicalRepresentative = $medicalRepresentative;
    }

    public function getMedicalRepresentativeAnalytics($year = null, $month = null)
    {
        $year = $year ?: Carbon::now()->year;
        
        $month = $month ?:Carbon::now()->month;

        return [
            'statistics' => $this->getStatistics($year),
            'salesPerYearData' => $this->getSalesPerYearAnalytics($year),
            'productDistributionData' => $this->getProductDistributionAnalytics($year),
            'salesOrders' => $this->getSalesOrders(),
            'productSoldTrend' => $this->getProductSoldTrendByYear($year),
            'salesWithFreeItemsDiscounts' => $this->getSalesWithFreeItemsDiscounts(),
            'dcrs' => $this->getDCRs(), // Add this line
            'eventsCalendar' => $this->getEventsForCalendar($year, $month), // Add this
            'currentMonth' => $month,
            'currentYear' => $year,
        ];
    }

    public function getStatistics($year)
    {
        $startOfYear = Carbon::create($year, 1, 1);
        $endOfYear = Carbon::create($year, 12, 31);

        // Total Sales (all time)
        $totalSales = SalesOrder::where('medical_representative_id', $this->medicalRepresentative->id)
            ->sum('total');

        // Monthly Sales (current year)
        $monthlySales = SalesOrder::where('medical_representative_id', $this->medicalRepresentative->id)
            ->where('date_sold', 'like', "%$year%")
            ->sum('total');

        // Total Customers Sold (all time - distinct customers)
        $totalCustomersSold = SalesOrder::where('medical_representative_id', $this->medicalRepresentative->id)
            ->distinct('customer_id')
            ->count('customer_id');

        // Monthly Customers Sold (current year - distinct customers)
        $monthlyCustomersSold = SalesOrder::where('medical_representative_id', $this->medicalRepresentative->id)
            ->where('date_sold', 'like', "%$year%")
            ->distinct('customer_id')
            ->count('customer_id');

        // Top Product Type
        $topProductType = SalesOrderItem::join('sales_orders', 'sales_order_items.sales_order_id', '=', 'sales_orders.id')
            ->join('items', 'sales_order_items.item_id', '=', 'items.id')
            ->where('sales_orders.medical_representative_id', $this->medicalRepresentative->id)
            ->select('items.product_type', DB::raw('SUM(sales_order_items.quantity) as total_quantity'))
            ->groupBy('items.product_type')
            ->orderBy('total_quantity', 'desc')
            ->first();

        return [
            'total_sales' => $totalSales,
            'monthly_sales' => $monthlySales,
            'total_customers_sold' => $totalCustomersSold,
            'monthly_customers_sold' => $monthlyCustomersSold,
            'top_product_type' => $topProductType?->product_type ?? 'No data',
        ];
    }

    public function getSalesPerYearAnalytics($year)
    {
        return SalesOrder::where('medical_representative_id', $this->medicalRepresentative->id)
            ->where('date_sold', 'like', "%$year%")
            ->select(
                DB::raw('MONTH(date_sold) as month'),
                DB::raw('SUM(total) as total_sales'),
                DB::raw('COUNT(*) as order_count')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'month_name' => Carbon::create()->month($item->month)->format('M'),
                    'total_sales' => (float) $item->total_sales,
                    'order_count' => (int) $item->order_count,
                ];
            });
    }

    public function getProductDistributionAnalytics($year)
    {
        return SalesOrderItem::join('sales_orders', 'sales_order_items.sales_order_id', '=', 'sales_orders.id')
            ->join('items', 'sales_order_items.item_id', '=', 'items.id')
            ->where('sales_orders.medical_representative_id', $this->medicalRepresentative->id)
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

    public function getSalesOrders()
    {
        return SalesOrder::with(['customer', 'salesOrderItems.item'])
            ->where('medical_representative_id', $this->medicalRepresentative->id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);
    }

    public function getProductSoldTrendByYear($year)
    {
        $productTrends = SalesOrderItem::join('sales_orders', 'sales_order_items.sales_order_id', '=', 'sales_orders.id')
            ->join('items', 'sales_order_items.item_id', '=', 'items.id')
            ->where('sales_orders.medical_representative_id', $this->medicalRepresentative->id)
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

        // Structure the data by product (same as customer version)
        $productsData = [];
        
        foreach ($productTrends as $trend) {
            $productKey = $trend->id;
            
            if (!isset($productsData[$productKey])) {
                $productsData[$productKey] = [
                    'id' => $trend->id,
                    'brand_name' => $trend->brand_name,
                    'generic_name' => $trend->generic_name,
                    'monthly_data' => array_fill(1, 12, 0),
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

        // Convert to simple arrays
        foreach ($productsData as &$product) {
            $product['monthly_data'] = array_values($product['monthly_data']);
            $product['trends'] = array_values($product['trends']);
        }

        $productsData = collect($productsData)->sortBy('total_quantity')->values()->toArray();

        return [
            'products' => $productsData,
            'year' => $year,
        ];
    }

    public function getSalesWithFreeItemsDiscounts()
    {
        return SalesOrder::with(['customer', 'salesOrderItems' => function($query) {
            $query->where(function($q) {
                $q->whereNotNull('discount')
                  ->orWhere('free_item_quantity', '>', 0)
                  ->orWhereNotNull('free_item_remarks');
            });
        }])
            ->whereHas('salesOrderItems', function($query) {
                $query->where(function($q) {
                    $q->whereNotNull('discount')
                      ->orWhere('free_item_quantity', '>', 0)
                      ->orWhereNotNull('free_item_remarks');
                });
            })
            ->where('medical_representative_id', $this->medicalRepresentative->id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);
    }

    public function getDCRs()
    {
        return Dcr::with(['customer'])
            ->whereHas('customer.salesOrders', function($query) {
                $query->where('medical_representative_id', $this->medicalRepresentative->id);
            })
            ->orderBy('dcr_date', 'desc')
            ->paginate(15);
    }

    public function getEventsByMonth($year = null, $month = null)
    {
        $year = $year ?: Carbon::now()->year;
        $month = $month ?: Carbon::now()->month;

        $startDate = Carbon::create($year, $month, 1);
        $endDate = $startDate->copy()->endOfMonth();

        return Event::with(['customer'])
            ->where('medical_representative_id', $this->medicalRepresentative->id)
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('event_date', [$startDate, $endDate])
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->where('end_date', '>=', $startDate)
                            ->where('event_date', '<=', $endDate);
                    });
            })
            ->orderBy('event_date')
            ->orderBy('start_time')
            ->get();
    }

    public function getEventsForCalendar($year = null, $month = null)
    {
        $events = $this->getEventsByMonth($year, $month);
        
        $calendarData = [];
        $currentDate = Carbon::create($year, $month, 1);
        $daysInMonth = $currentDate->daysInMonth;

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
                        'start_time' => $event->start_time ? $event->start_time->format('H:i') : null,
                        'end_time' => $event->end_time ? $event->end_time->format('H:i') : null,
                        'status' => $event->status,
                        'customer' => $event->customer?->name,
                        'description' => $event->description,
                        'location' => $event->location,
                        'notes' => $event->notes,
                        'is_multi_day' => $isMultiDay,
                        'is_first_day' => $isFirstDay,
                        'is_last_day' => $isLastDay,
                        'event_date' => $event->event_date->format('Y-m-d'),
                        'end_date' => $event->end_date ? $event->end_date->format('Y-m-d') : null,
                    ];
                })->toArray(),
            ];
        }

        return $calendarData;
    }
}