<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalesOrderItem extends Model
{
    use SoftDeletes;

    
    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    public function item() {
        return $this->hasOne(Item::class, 'id', 'item_id');
    }
}
