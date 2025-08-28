<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
    use SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at'];


    public function images()
    {
        return $this->hasMany(ItemImage::class, 'item_id', 'id');
    }
}
