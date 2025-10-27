<?php

namespace App\Http\Controllers\Sendings;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class SMSSendingController extends Controller
{
    public static function send($item)
    {
        try{
            if($item->method == 'POST') {
                $response = Http::withHeaders($item->header)->post($item->url, $item->body);
                return $response->json();
            }else{
                return 'Support Post Only';
            }
        }catch (Exception $e){
            return $e->getMessage();
        }
    }
}
