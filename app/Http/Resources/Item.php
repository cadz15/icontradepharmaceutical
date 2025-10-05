<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class Item extends JsonResource
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
            'brand_name' => $this->brand_name,
            'generic_name' => $this->generic_name,
            'milligrams' => $this->milligrams,
            'supply' => $this->supply,
            'catalog_price' => $this->catalog_price,
            'product_type' => $this->product_type,
            'inventory' => $this->inventory,
            'images' => ItemImages::collection($this->images),
            'created_at' => $this->created_at->format('M d, Y'),
            'updated_at' => $this->updated_at->format('M d, Y'),
            'deleted_at' => $this->deleted_at?->format('M d, Y')
        ];
    }
}
