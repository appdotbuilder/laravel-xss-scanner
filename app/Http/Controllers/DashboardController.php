<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Scan;
use App\Models\Vulnerability;
use App\Models\Website;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the XSS scanner dashboard.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Get user's websites with latest scan info
        $websites = Website::where('user_id', $user->id)
            ->with(['scans' => function ($query) {
                $query->latest()->limit(1);
            }])
            ->withCount('scans')
            ->latest()
            ->limit(5)
            ->get();

        // Get recent scans
        $recentScans = Scan::whereIn('website_id', function ($query) use ($user) {
                $query->select('id')
                    ->from('websites')
                    ->where('user_id', $user->id);
            })
            ->with('website')
            ->latest()
            ->limit(10)
            ->get();

        // Get recent vulnerabilities
        $recentVulnerabilities = Vulnerability::whereIn('scan_id', function ($query) use ($user) {
                $query->select('scans.id')
                    ->from('scans')
                    ->join('websites', 'scans.website_id', '=', 'websites.id')
                    ->where('websites.user_id', $user->id);
            })
            ->with(['scan.website'])
            ->orderBy('severity', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Calculate statistics
        $stats = [
            'total_websites' => Website::where('user_id', $user->id)->count(),
            'total_scans' => Scan::whereIn('website_id', function ($query) use ($user) {
                $query->select('id')->from('websites')->where('user_id', $user->id);
            })->count(),
            'total_vulnerabilities' => Vulnerability::whereIn('scan_id', function ($query) use ($user) {
                $query->select('scans.id')
                    ->from('scans')
                    ->join('websites', 'scans.website_id', '=', 'websites.id')
                    ->where('websites.user_id', $user->id);
            })->count(),
            'critical_vulnerabilities' => Vulnerability::whereIn('scan_id', function ($query) use ($user) {
                $query->select('scans.id')
                    ->from('scans')
                    ->join('websites', 'scans.website_id', '=', 'websites.id')
                    ->where('websites.user_id', $user->id);
            })->where('severity', 'critical')->count(),
            'running_scans' => Scan::whereIn('website_id', function ($query) use ($user) {
                $query->select('id')->from('websites')->where('user_id', $user->id);
            })->where('status', 'running')->count(),
        ];

        return Inertia::render('dashboard', [
            'websites' => $websites,
            'recentScans' => $recentScans,
            'recentVulnerabilities' => $recentVulnerabilities,
            'stats' => $stats
        ]);
    }
}