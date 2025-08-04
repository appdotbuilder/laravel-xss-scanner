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
        Schema::create('scans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('website_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['pending', 'running', 'completed', 'failed'])->default('pending')->comment('Current status of the scan');
            $table->timestamp('started_at')->nullable()->comment('When the scan was started');
            $table->timestamp('completed_at')->nullable()->comment('When the scan was completed');
            $table->integer('pages_scanned')->default(0)->comment('Number of pages that were scanned');
            $table->integer('vulnerabilities_found')->default(0)->comment('Number of XSS vulnerabilities found');
            $table->text('error_message')->nullable()->comment('Error message if scan failed');
            $table->json('scan_config')->nullable()->comment('Configuration used for this scan');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('website_id');
            $table->index('status');
            $table->index(['website_id', 'status']);
            $table->index('started_at');
            $table->index('completed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scans');
    }
};