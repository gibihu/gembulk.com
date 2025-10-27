<?php

namespace App\Console\Commands;

use App\Http\Controllers\Sendings\SMSSendingController;
use App\Models\Sendings\SendingJob;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Crypt;
use App\Helpers\ServerHelper;
use App\Models\Sendings\Report;

class SendSms extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-sms';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $jobs = SendingJob::limit(500)->get();

        foreach ($jobs as $job) {
            try {
                $job->status = SendingJob::STATUS_PROCESSING;
                $job->save();
                $server = $job->server;
                $header = json_decode(Crypt::decryptString($server->headers), true);
                $sender = $job->sender;
                $body = collect($server->body)->mapWithKeys(function ($bd) use ($job) {
                    return [$bd[0] => ServerHelper::ConvertToVariant($bd[1], $job)];
                })->toArray();
                $user = $job->user;
                $item = (object) [
                    'header' => $header,
                    'body' => $body,
                    'method' => $server->method,
                    'url' => $server->url,
                ];
                $response = SMSSendingController::send($item);

                $callback = $server->callbacks; // [['success', [true,false], true], ['message', '{msg}'], ['data', '{json}']]
                $processed = [
                    'message' => null,
                    'code' => $response['status'] ?? 200, // default ถ้าไม่ระบุ
                    'status' => null,
                    'data' => null,
                    'raw' => $response,
                ];

                foreach ($callback as $cb) {
                    $key = $cb[0];        // key ใน response เช่น 'success', 'message', 'data'
                    $mapping = $cb[1];    // mapping value เช่น true/false หรือ placeholder '{msg}'
                    $useFirst = $cb[2] ?? false; // flag ถ้ามี

                    if (array_key_exists($key, $response)) {
                        $value = $response[$key];
                        $processed[$key] = $value;
                    }
                }

                // ถ้า status ยังว่าง ให้ใช้ success หรือ status ใน response
                if (is_null($processed['status'])) {
                    $processed['status'] = $response['success'] ?? $response['status'] ?? null;
                }

                // สร้าง report
                $report = Report::create([
                    'receiver' => $job->receiver,
                    'msg' => $job->msg,
                    'response' => $processed, // เก็บ array ตรง ๆ
                    'send_status' => Report::STATUS_SUCCESS,
                    'cost' => $job->cost,
                    'user_id' => $user->id,
                    'sender_id' => $sender->id,
                    'server_id' => $server->id,
                    'status' => Report::STATUS_ACTIVE,
                ]);

            } catch (Exception $e) {
                $user = $job->user;
                $report = Report::create([
                    'receiver' => $job->receiver,
                    'msg' => $job->msg,
                    'response' => [
                        'message' => $e->getMessage(),
                    ],
                    'send_status' => Report::STATUS_ERROR,
                    'cost' => $job->cost,
                    'user_id' => $user->id,
                    'sender_id' => $job->server->id,
                    'server_id' => $job->sender->id,
                    'status' => Report::STATUS_FAILED,
                ]);
                $user->credit = $job->user->credit + $job->cost;
                $user->save();
            }

            $job->delete();
        }
        $this->info('SMS jobs processed successfully.');
    }
}
