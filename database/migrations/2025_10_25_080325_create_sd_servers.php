<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::create('sd_servers', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->string('name');
            $table->string('static_name');
            $table->string('host')->nullable();
            $table->string('url');
            $table->string('method')->default('GET');
            $table->json('settings')->nullable();
            $table->json('headers')->nullable();
            $table->json('body')->nullable();
            $table->json('callbacks')->nullable();
            $table->bigInteger('credits')->default(0);

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sd_servers');
    }
};
