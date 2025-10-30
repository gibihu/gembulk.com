<?php

namespace App\Console\Commands;

use App\Helpers\ServerHelper;
use App\Http\Controllers\Sendings\SMSSendingController;
use App\Models\Sendings\Report;
use App\Models\Sendings\SendingJob;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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
        Log::info('');
        Log::info('=== Start Sending Job ===');

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
                        if ($mapping == '{success}') {
                            $processed['success'] = $value;
                        } elseif ($mapping == '{msg}') {
                            $processed['message'] = $value;
                        } elseif ($mapping == '{data}') {
                            $processed['data'] = $value;
                        } elseif ($mapping == '{status}') {
                            $processed['status'] = $value;
                        } elseif ($mapping == '{code}') {
                            $processed['code'] = $value;
                        } else {
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

                Log::info("Send to $job->receiver Successfuly.");
                $this->GetNSetCredit($header, $server);

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
        Log::info('=== End Sending Job ===');
        Log::info('');
    }

    private function GetNSetCredit($header, $server)
    {
        try {
            Log::info('');
            Log::info('=== Start Update Cradit Job ===');
            $setting = $server->settings;
            $cradits = $setting['cradits'];
            $callback = $cradits['callback']; // ['bananc', {cradit}]
            
            $parsed = parse_url($server->url);
            $base_url = $parsed['scheme'].'://'.$parsed['host'];

            // ตรวจสอบก่อนว่า sync_url มี {base_url} หรือไม่
            if (strpos($cradits['sync_url'], '{base_url}') !== false) {
                $sync_url = str_replace('{base_url}', $base_url, $cradits['sync_url']);
            } else {
                // ถ้าไม่มี {base_url} ให้ใช้ URL เต็มตามที่มีอยู่
                $sync_url = $cradits['sync_url'];
            }
            $method = $cradits['sync_method'];

            if ($method == 'POST') {
                Log::info('Sending POST --> '.$sync_url);
                $response = Http::withHeaders($header)->post($item->url, $item->body);
            } else {
                Log::info('Sending GET --> '.$sync_url);
                $response = Http::withHeaders($header)->get($sync_url);
            }

            if ($response->successful()) {
                $data = $response->json();

                // ตรวจสอบ callback[0] ว่ามี key ใน $data หรือไม่
                $amount = null;
                if (isset($callback[0]) && array_key_exists($callback[0], $data)) {
                    $amountValue = $data[$callback[0]];

                    // อัปเดต $server->settings['cradits']['amount'] ด้วย value ที่ได้
                    $settings = $server->settings;          // copy ค่าออกมา
                    $settings['cradits']['amount'] = $amountValue;  // แก้ไข
                    $server->settings = $settings;          // เซ็ตกลับ
                    $server->save();                        // บันทึกใน DB
                    Log::info('--- Success To Update Cradit ---');
                    Log::info('');

                    return true;
                } else {
                    Log::info(['data' => $data, 'check_1' => isset($callback[0]), 'check_2' => array_key_exists($callback[0], $data)]);
                    Log::info('');
                }
            }

            Log::info(['response' => $response->json(), 'status' => $response->status()]);
            Log::info('--- Fail To Update Cradit ---');
            Log::info('');

            return false;
        } catch (Exception $e) {
            Log::info('Exception: '.['e' => $e->getMessage()]);
            Log::info('');
        }
        Log::info('=== End Update Cradit Job ===');
        Log::info('');
    }
}
