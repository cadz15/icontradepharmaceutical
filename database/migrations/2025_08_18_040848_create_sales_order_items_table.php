<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sales_order_items', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('sales_order_id');
            $table->bigInteger('item_id');
            $table->string('quantity');
            $table->string('promo');
            $table->string('discount')->nullable();
            $table->string('free_item_quantity')->nullable();
            $table->string('free_item_remarks')->nullable();
            $table->string('remarks')->nullable();
            $table->double('total');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_order_items');
    }
};
