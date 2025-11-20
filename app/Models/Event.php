<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $guarded = ['id', 'created_at', 'updated_at'];

      protected $casts = [
        'event_date' => 'date',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_recurring' => 'boolean',
        'end_date' => 'date', // Add this
    ];

    public function medicalRepresentative()
    {
        return $this->belongsTo(MedicalRepresentative::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
