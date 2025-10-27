<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Sendings\Sender;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WebPageController extends Controller
{
    public function index()
    {
        $sender = Sender::get();

        return Inertia::render('welcome', compact('sender'));
    }
}
