<?php
namespace App\Helpers;

class ServerHelper
{
    public static function ConvertToVariant($input, $item){
        switch($input){
            case '{sender}':
                return $item->sender->name;
                break;
            case '{msg}':
                return $item->msg;
            case '{receiver}':
                return $item->receiver;
            default:
                return '';
        }
    }
}
