<?php

namespace App\Console\Commands;

use App\Helpers\ServerHelper;
use App\Http\Controllers\Sendings\SMSSendingController;
use App\Models\Sendings\Report;
use App\Models\Sendings\SendingJob;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Crypt;

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
        $jobs = SendingJob::limit(500)->orderBy('scheduled_at', 'ASC')->orderBy('created_at', 'ASC')->get();

        foreach ($jobs as $job) {
            try {
                if ($job->is_scheduled) {
                    if (isset($job->scheduled_at)) {
                        $do = Carbon::parse($job->scheduled_at);

                        // ถ้าเวลาที่ตั้งไว้ยังไม่ถึงตอนนี้ ให้ข้ามไปก่อน
                        if ($do->greaterThan(Carbon::now())) {
                            continue;
                        }
                    } else {
                        // ไม่มีเวลา scheduled_at ก็ข้ามไปเลย
                        continue;
                    }
                }
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
                        if($mapping == '{success}'){
                            $processed['success'] = $value;
                        }else if($mapping == '{msg}'){
                            $processed['message'] = $value;
                        }else if($mapping == '{data}'){
                            $processed['data'] = $value;
                        }else if($mapping == '{status}'){
                            $processed['status'] = $value;
                        }else if($mapping == '{code}'){
                            $processed['code'] = $value;
                        }else{
                            $processed[$key] = $value;
                        }
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
                    'status' => Report::STATUS_SUCCESS,
                    'is_scheduled' => $job->is_scheduled ?? false,
                    'scheduled_at' => $job->scheduled_at ? Carbon::parse($job->scheduled_at) : Carbon::now(),
                ]);

            } catch (Exception $e) {
                $user = $job->user;
                $report = Report::create([
                    'receiver' => $job->receiver,
                    'msg' => $job->msg,
                    'response' => [
                        'message' => $e->getMessage(),
                    ],
                    'send_status' => Report::STATUS_FAILED,
                    'cost' => $job->cost,
                    'user_id' => $user->id,
                    'sender_id' => $job->server->id,
                    'server_id' => $job->sender->id,
                    'status' => Report::STATUS_ERROR,
                    'is_scheduled' => $job->is_scheduled ?? false,
                    'scheduled_at' => $job->scheduled_at ? Carbon::parse($job->scheduled_at) : Carbon::now(),
                ]);
                $user->credit = $job->user->credit + $job->cost;
                $user->save();
            }

            $job->delete();
        }
        $this->info('SMS jobs processed successfully.');
    }
}
