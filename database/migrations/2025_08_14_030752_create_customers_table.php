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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('full_address');
            $table->string('short_address');
            $table->string('region');
            $table->string('class');
            $table->string('practice')->nullable();
            $table->string('s3_license')->nullable();
            $table->string('s3_validity')->nullable();
            $table->string('pharmacist_name')->nullable();
            $table->string('prc_id')->nullable();
            $table->string('prc_validity')->nullable();
            $table->string('remarks')->nullable();
            $table->string('sync_date')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
