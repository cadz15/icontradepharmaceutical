<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MobileNotification extends Model
{
    //
    protected $guarded = ['id', 'created_at', 'updated_at'];

    protected $casts = [
        'read' => 'boolean'
    ];

    protected $appends = ['time'];

    public function getTimeAttribute()
    {
        return $this->created_at->diffForHumans();
    }
}
