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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('event_date');            
            $table->date('end_date')->nullable(); // For multi-day events
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('event_type'); // meeting, call, visit, task, etc.
            $table->string('status')->default('scheduled'); // scheduled, completed, cancelled
            $table->bigInteger('medical_representative_id');
            $table->bigInteger('customer_id')->nullable();
            $table->text('location')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->string('recurring_pattern')->nullable(); // daily, weekly, monthly
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['medical_representative_id', 'event_date']);
            $table->index(['event_date', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};