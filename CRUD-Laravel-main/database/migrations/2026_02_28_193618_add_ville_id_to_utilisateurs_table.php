<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('utilisateurs', function (Blueprint $table) {
            
            $table->foreignId('ville_id')
                  ->nullable()
                  ->constrained('villes')
                  ->onDelete('set null')
                  ->change();
        });
    }

    public function down(): void
    {
        Schema::table('utilisateurs', function (Blueprint $table) {
            $table->foreignId('ville_id')
                  ->nullable(false)
                  ->constrained('villes')
                  ->onDelete('restrict')
                  ->change();
        });
    }
};
