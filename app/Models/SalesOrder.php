<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalesOrder extends Model
{
    use SoftDeletes;


    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    public function customer()
    {
        return $this->hasOne(Customer::class, 'id', 'customer_id');
    }

    public function medicalRepresentative()
    {
        return $this->hasOne(MedicalRepresentative::class, 'id', 'medical_representative_id');
    }

    public function saleItems()
    {
        return $this->hasMany(SalesOrderItem::class, 'sales_order_id', 'id');
    }
}
