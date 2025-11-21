<?php

namespace App\Http\Controllers;

use App\Models\Event;
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
}
