<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    //  protected $casts = [
    //     's3_validity' => 'date',
    //     'prc_validity' => 'date',
    // ];

    public function dcrs()
    {
        return $this->hasMany(DCR::class);
    }

    public function salesOrders()
    {
        return $this->hasMany(SalesOrder::class);
    }
}
