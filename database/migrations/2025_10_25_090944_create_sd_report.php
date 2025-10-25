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
        Schema::create('sd_report', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->string('phone', 20)->nullable();
            $table->text('msg')->nullable();
            $table->string('response')->nullable();
            $table->integer('send_status')->default(0);
            $table->integer('cost')->default(0);

            $table->char('user_id', 36);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->char('sender_id', 36)->nullable();
            $table->foreign('sender_id')->references('id')->on('sd_senders')->onDelete('cascade');

            $table->char('server_id', 36)->nullable();
            $table->foreign('server_id')->references('id')->on('sd_servers')->onDelete('set null');

            $table->tinyInteger('status')->default(0);

            $table->boolean('is_scheduled')->default(false);
            $table->timestamp('scheduled_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sd_report');
    }
};
