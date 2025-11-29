<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SalesOrder extends JsonResource
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
            'customer' => new Customer($this->customer),
            'medical_representative' => new MedicalRepresentative($this->medicalRepresentative),
            'sales_order_items' => SalesOrderItem::collection($this->saleItems),
            'sales_order_number' => $this->sales_order_number,
            'date_sold' => Carbon::parse($this->date_sold)->format('M d, Y'),
            'total' => $this->total,
            'remarks' => $this->remarks,
            'sync_date' => $this->sync_date ?? now()->format('m/d/Y'),
            'status' => $this->status
        ];
    }
}
