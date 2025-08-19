<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SalesOrderItem extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sales_order_id' => $this->sales_order_id,
            'item_id' => $this->item_id,
            'quantity' => $this->quantity,
            'promo' => $this->promo,
            'discount' => $this->discount,
            'free_item_quantity' => $this->free_item_quantity,
            'free_item_remarks' => $this->free_item_remarks,
            'remarks' => $this->remarks,
            'total' => $this->total,
            'created_at' => $this->created_at->format('M d, Y')
        ];
    }
}
