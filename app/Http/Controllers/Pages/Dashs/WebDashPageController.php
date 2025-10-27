<?php

namespace App\Http\Controllers\Pages\Dashs;

use App\Helpers\ServerHelper;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Sendings\SMSSendingController;
use App\Models\Sendings\Report;
use App\Models\Sendings\SendingJob;
use App\Models\Sendings\SpamWord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Inertia\Inertia;

class WebDashPageController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboards/index');
    }

    public function createSMS()
    {
        $spam_world = SpamWord::pluck('word');

        return Inertia::render('dashboards/sendings/sms/add', compact('spam_world'));
    }

    public function jobSMS(Request $request)
    {
        $user = $request->user();
        $jobs = SendingJob::where('user_id', $user->id)->get();

        return Inertia::render('dashboards/jobs/sms/run', compact('jobs'));
    }

    public function sendingSMS(Request $request)
    {
        $jobs = SendingJob::where('user_id', $request->user()->id)->get();

        return Inertia::render('dashboards/sendings/sms/list', compact('jobs'));
    }

    public function reportSMS(Request $request)
    {
        $reports = Report::where('user_id', $request->user()->id)->get();
        return Inertia::render('dashboards/reports/sms/list', compact('reports'));
    }
}
