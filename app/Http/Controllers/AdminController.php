<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Dcr;
use App\Models\Event;
use App\Models\MedicalRepresentative;
use App\Services\AdminAnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
     public function index(Request $request)
    {
        $analyticsService = new AdminAnalyticsService();
        $year = $request->get('year', date('Y'));
        $month = $request->get('month', date('m'));

        $analytics = $analyticsService->getAdminAnalytics($year, $month);

        return Inertia::render('Dashboard', [
            'analytics' => $analytics,
            'medicalRepresentatives' => $analytics['medicalRepresentatives'],
            'filters' => [
                'year' => $year,
                'month' => $month,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:event_date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'event_type' => 'required|in:meeting,call,visit,task,training,other',
            'medical_representative_ids' => 'required|array|min:1',
            'medical_representative_ids.*' => 'exists:medical_representatives,id',
            'customer_id' => 'nullable|exists:customers,id',
            'location' => 'nullable|string',
            'notes' => 'nullable|string',
            'is_recurring' => 'boolean',
            'recurring_pattern' => 'nullable|in:daily,weekly,monthly',
        ]);

        $createdEvents = [];

        foreach ($validated['medical_representative_ids'] as $medicalRepresentativeId) {
            $eventData = [
                'title' => $validated['title'],
                'description' => $validated['description'],
                'event_date' => $validated['event_date'],
                'end_date' => $validated['end_date'],
                'start_time' => $validated['start_time'],
                'end_time' => $validated['end_time'],
                'event_type' => $validated['event_type'],
                'medical_representative_id' => $medicalRepresentativeId,
                'customer_id' => $validated['customer_id'],
                'location' => $validated['location'],
                'notes' => $validated['notes'],
                'is_recurring' => $validated['is_recurring'] ?? false,
                'recurring_pattern' => $validated['recurring_pattern'],
                'status' => 'scheduled',
            ];

            $event = Event::create($eventData);
            $createdEvents[] = $event;
        }

        return redirect()->back()->with('success', count($createdEvents) . ' event(s) created successfully.');
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:event_date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'event_type' => 'required|in:meeting,call,visit,task,training,other',
            'customer_id' => 'nullable|exists:customers,id',
            'location' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'required|in:scheduled,completed,cancelled',
        ]);

        $event->update($validated);

        return redirect()->back()->with('success', 'Event updated successfully.');
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return redirect()->back()->with('success', 'Event deleted successfully.');
    }

    public function destroyMultiple(Request $request)
    {
        $request->validate([
            'event_ids' => 'required|array',
            'event_ids.*' => 'exists:events,id',
        ]);

        $deletedCount = Event::whereIn('id', $request->event_ids)->delete();

        return redirect()->back()->with('success', $deletedCount . ' event(s) deleted successfully.');
    }

     public function showDcr(Request $request)
    {
        $query = Dcr::with(['customer', 'medicalRepresentative']);

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('remarks', 'like', "%{$searchTerm}%")
                  ->orWhereHas('customer', function($customerQuery) use ($searchTerm) {
                      $customerQuery->where('name', 'like', "%{$searchTerm}%")
                                   ->orWhere('full_address', 'like', "%{$searchTerm}%");
                  })
                  ->orWhereHas('medicalRepresentative', function($mrQuery) use ($searchTerm) {
                      $mrQuery->where('name', 'like', "%{$searchTerm}%");
                  });
            });
        }

        // Customer filter
        if ($request->has('customer_id') && !empty($request->customer_id) && $request->customer_id !== 'all') {
            $query->where('customer_id', $request->customer_id);
        }

        // Medical Representative filter
        if ($request->has('medical_representative_id') && !empty($request->medical_representative_id) && $request->medical_representative_id !== 'all') {
            $query->where('medical_representative_id', $request->medical_representative_id);
        }

        // Date range filter
        if ($request->has('start_date') && !empty($request->start_date)) {
            $query->where('dcr_date', '>=', $request->start_date);
        }

        if ($request->has('end_date') && !empty($request->end_date)) {
            $query->where('dcr_date', '<=', $request->end_date);
        }

        // Signature filter
        if ($request->has('has_signature') && $request->has_signature !== 'all') {
            if ($request->has_signature === 'yes') {
                $query->whereNotNull('signature');
            } else {
                $query->whereNull('signature');
            }
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'dcr_date');
        $sortOrder = $request->get('sort_order', 'desc');

        $allowedSortFields = ['dcr_date', 'name', 'created_at'];
        $sortBy = in_array($sortBy, $allowedSortFields) ? $sortBy : 'dcr_date';
        $sortOrder = in_array($sortOrder, ['asc', 'desc']) ? $sortOrder : 'desc';

        $query->orderBy($sortBy, $sortOrder);

        $dcrs = $query->paginate(20)->withQueryString();

        // Get filter data
        $customers = Customer::orderBy('name')->get(['id', 'name']);
        $medicalRepresentatives = MedicalRepresentative::orderBy('name')->get(['id', 'name']);


        return Inertia::render('DCRs/Index', [
            'dcrs' => $dcrs,
            'customers' => $customers,
            'medicalRepresentatives' => $medicalRepresentatives,
            'filters' => $request->only([
                'search', 
                'customer_id', 
                'medical_representative_id', 
                'start_date', 
                'end_date', 
                'has_signature',
                'sort_by',
                'sort_order'
            ])
        ]);
    }
}
