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
        Schema::create('websites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name')->comment('User-friendly name for the website');
            $table->string('url')->comment('Base URL of the website to scan');
            $table->text('description')->nullable()->comment('Optional description of the website');
            $table->enum('status', ['active', 'inactive', 'scanning'])->default('active')->comment('Current status of the website');
            $table->json('scan_settings')->nullable()->comment('JSON configuration for scanning parameters');
            $table->timestamp('last_scanned_at')->nullable()->comment('When the website was last scanned');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('user_id');
            $table->index('status');
            $table->index(['user_id', 'status']);
            $table->index('last_scanned_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('websites');
    }
};