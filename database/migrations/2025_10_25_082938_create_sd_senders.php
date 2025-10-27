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
        Schema::create('sd_senders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->char('server_id', 36); // เพิ้อระบุเซิฟได้ชัดเจร

            $table->tinyInteger('status')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sd_senders');
    }
};
