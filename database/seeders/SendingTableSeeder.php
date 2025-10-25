<?php

namespace Database\Seeders;

use App\Models\Sendings\Plan;
use App\Models\Sendings\Sender;
use App\Models\Sendings\Server;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SendingTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $server = Server::create([
            'name' => 'Me SMS',
            'static_name' => 'me-sms',
            'host' => 'api.me-sms.com',
            'url' => 'https://api.me-sms.com/v1/sms',
            'method' => 'POST',
            'settings' => [],
            'headers' => [],
            'body' => [],
            'callbacks' => [],
        ]);

        Sender::create([
            'name' => 'GTSF',
            'server_id' =>  $server->id,
        ]);

        Plan::create([
            'name' => 'Starter Set',
            'price' => 100,
            'credits' => 1500,
        ]);
    }
}
