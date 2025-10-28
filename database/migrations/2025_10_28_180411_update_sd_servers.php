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
        Schema::table('sd_servers', function (Blueprint $table) {
            $table->uuid('user_id')->nullable()->after('id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sd_servers', function (Blueprint $table) {
            try {
                $table->dropForeign(['user_id']);
            } catch (\Exception $e) {
                // เงียบ ๆ ถ้าไม่มี foreign key นี้
            }
            if (Schema::hasColumn('sd_servers', 'user_id')) {
                $table->dropColumn('user_id');
            }
        });
    }
};
