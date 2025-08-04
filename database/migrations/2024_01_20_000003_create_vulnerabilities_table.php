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
        Schema::create('vulnerabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scan_id')->constrained()->onDelete('cascade');
            $table->string('url')->comment('The URL where the vulnerability was found');
            $table->enum('type', ['reflected_xss', 'stored_xss', 'dom_xss'])->default('reflected_xss')->comment('Type of XSS vulnerability');
            $table->enum('severity', ['low', 'medium', 'high', 'critical'])->default('medium')->comment('Severity level of the vulnerability');
            $table->string('parameter')->nullable()->comment('The parameter that is vulnerable');
            $table->text('payload')->comment('The XSS payload that triggered the vulnerability');
            $table->text('evidence')->nullable()->comment('Evidence of the vulnerability execution');
            $table->string('method')->default('GET')->comment('HTTP method used (GET, POST, etc.)');
            $table->json('request_data')->nullable()->comment('Full request data that triggered the vulnerability');
            $table->text('description')->nullable()->comment('Detailed description of the vulnerability');
            $table->boolean('verified')->default(false)->comment('Whether the vulnerability has been manually verified');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('scan_id');
            $table->index('type');
            $table->index('severity');
            $table->index(['scan_id', 'severity']);
            $table->index('verified');
            $table->index('url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vulnerabilities');
    }
};