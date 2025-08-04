<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Website;
use App\Services\XssScanner;
use Illuminate\Http\Request;

class WebsiteScanController extends Controller
{
    /**
     * Start a scan for the specified website.
     */
    public function store(Request $request, Website $website)
    {
        if ($website->user_id !== auth()->id()) {
            abort(403);
        }

        // Check if there's already a running scan
        $runningScan = $website->scans()->where('status', 'running')->first();
        if ($runningScan) {
            return redirect()->back()
                ->with('error', 'A scan is already running for this website.');
        }

        // Start the scan (in a real application, this would be queued)
        $scanner = app(XssScanner::class);
        $scan = $scanner->scanWebsite($website);

        return redirect()->route('websites.show', $website)
            ->with('success', 'XSS scan started successfully. Results will appear here as the scan progresses.');
    }
}