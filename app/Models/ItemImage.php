<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemImage extends Model
{
    protected $guarded = ['id', 'created_at', 'updated_at'];

    public function item()
    {
        return $this->hasOne(Item::class, 'item_id', 'id');
    }
}
