<?php

namespace App\Http\Controllers\Apis\Dashs\Sending;

use App\Http\Controllers\Controller;
use App\Models\Sendings\SendingJob;
use Exception;
use Illuminate\Http\Request;

class SMSApiController extends Controller
{
    public function create(Request $request)
    {
        try{
            $receivers = $request->receivers;
            $sender = $request->sender;
            $sever = $request->sd_server;
            $cost = $request->cost;
            $msg = $request->msg;
            $msg_length = $request->msg_length;
            $phone_counts = $request->phone_counts;

            $user = $request->user();
            if($user->credit >= $cost){
                $user->credit = $user->credit - $cost;
                $user->save();

                $success = [];
                $fail = [];
                foreach($receivers as $receiver){
                    $job = SendingJob::create([
                        'receiver' => $receiver,
                        'msg' => $msg,
                        'cost' => $cost,
                        'user_id' => $user->id,
                        'sender_id' => $sender,
                        'server_id' => $sever,
                        'status' => SendingJob::STATUS_PENDING,
                    ]);
                    if($job){
                        $success[] = $job->id;
                    }else{
                        $fail[] = $receiver;
                    }
                }

                if(!empty($success)){
                    return  response()->json([
                        'message' => 'สำเร็จ',
                        'data' => [
                            'success' => $success,
                            'fail' => $fail,
                        ],
                        'code' => 201
                    ], 201);
                }else{
                    return  response()->json([
                        'message' => 'ไม่สำเร็จ',
                        'data' => [
                            'success' => $success,
                            'fail' => $fail,
                        ],
                        'code' => 400
                    ], 400);
                }
            }else{
                return response()->json([
                    'message' => 'เครดิตไม่พอ',
                    'description' => 'กรุณาเติมเครดิตก่อนส่ง',
                    'code' => 422,
                ], 422); // validate ความต้องการ
            }

        }catch (Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'description' => $e->getMessage(),
                'code' => 500,
            ];
            if(config('app.debug')) $response['debug'] = [
                'message' => $e->getMessage(),
                'request' => $request->all(),
            ];
            return response()->json($response, 500);
        }
    }

    public function syncJob(Request $request)
    {
        try{
            $jobs = SendingJob::where('user_id', $request->user()->id)->get();
            return response()->json([
                'message' => 'สำเร็จ',
                'code' => 200,
                'data' => $jobs,
                'description' => '',
            ], 200);
        }catch (Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'description' => $e->getMessage(),
                'code' => 500,
            ];
            if(config('app.debug')) $response['debug'] = [
                'message' => $e->getMessage(),
                'request' => $request->all(),
            ];
            return response()->json($response, 500);
        }
    }
}
