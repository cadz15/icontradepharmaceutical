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
        Schema::create('dcrs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->bigInteger('customer_id');
            $table->string('dcr_date');
            $table->text('signature')->nullable();
            $table->string('remarks')->nullable();
            $table->string('sync_date')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dcrs');
    }
};
