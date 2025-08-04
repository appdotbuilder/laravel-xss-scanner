<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Scan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScanController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show(Scan $scan)
    {
        if ($scan->website->user_id !== auth()->id()) {
            abort(403);
        }

        $scan->load([
            'website',
            'vulnerabilities' => function ($query) {
                $query->orderBy('severity', 'desc')->orderBy('created_at', 'desc');
            }
        ]);

        $stats = [
            'total_vulnerabilities' => $scan->vulnerabilities()->count(),
            'critical_vulnerabilities' => $scan->vulnerabilities()->where('severity', 'critical')->count(),
            'high_vulnerabilities' => $scan->vulnerabilities()->where('severity', 'high')->count(),
            'medium_vulnerabilities' => $scan->vulnerabilities()->where('severity', 'medium')->count(),
            'low_vulnerabilities' => $scan->vulnerabilities()->where('severity', 'low')->count(),
            'verified_vulnerabilities' => $scan->vulnerabilities()->where('verified', true)->count(),
        ];

        return Inertia::render('scans/show', [
            'scan' => $scan,
            'stats' => $stats
        ]);
    }
}