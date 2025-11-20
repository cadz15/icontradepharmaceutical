<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\MedicalRepresentative;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'event_type' => 'required|in:meeting,call,visit,task,other',
            'medical_representative_id' => 'required|exists:medical_representatives,id',
            'customer_id' => 'nullable|exists:customers,id',
            'location' => 'nullable|string',
            'notes' => 'nullable|string',
            'is_recurring' => 'boolean',
            'recurring_pattern' => 'nullable|in:daily,weekly,monthly',
        ]);

        $event = Event::create($validated);

        return redirect()->back()->with('success', 'Event created successfully.');
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'event_type' => 'required|in:meeting,call,visit,task,other',
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
}