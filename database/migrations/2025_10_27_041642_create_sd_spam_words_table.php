<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('sd_spam_words')) {
            Schema::create('sd_spam_words', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('word');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('sd_spam_words');
    }
};
