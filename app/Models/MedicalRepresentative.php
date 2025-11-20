<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class MedicalRepresentative extends Model
{
    use SoftDeletes, HasApiTokens;

    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    public function events()
    {
        return $this->hasMany(Event::class);
    }
}
