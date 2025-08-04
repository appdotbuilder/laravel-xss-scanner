<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWebsiteRequest;
use App\Http\Requests\UpdateWebsiteRequest;
use App\Models\Website;
use App\Services\XssScanner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WebsiteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $websites = Website::where('user_id', $request->user()->id)
            ->with(['scans' => function ($query) {
                $query->latest()->limit(1);
            }])
            ->withCount(['scans', 'scans as vulnerabilities_count' => function ($query) {
                $query->join('vulnerabilities', 'scans.id', '=', 'vulnerabilities.scan_id');
            }])
            ->latest()
            ->paginate(10);

        return Inertia::render('websites/index', [
            'websites' => $websites
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('websites/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWebsiteRequest $request)
    {
        $website = Website::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('websites.show', $website)
            ->with('success', 'Website added successfully. You can now start scanning for XSS vulnerabilities.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Website $website)
    {
        if ($website->user_id !== auth()->id()) {
            abort(403);
        }

        $website->load([
            'scans' => function ($query) {
                $query->with('vulnerabilities')->latest();
            }
        ]);

        $stats = [
            'total_scans' => $website->scans()->count(),
            'total_vulnerabilities' => $website->scans()->withCount('vulnerabilities')->get()->sum('vulnerabilities_count'),
            'critical_vulnerabilities' => $website->scans()
                ->join('vulnerabilities', 'scans.id', '=', 'vulnerabilities.scan_id')
                ->where('vulnerabilities.severity', 'critical')
                ->count(),
            'last_scan' => $website->scans()->latest()->first(),
        ];

        return Inertia::render('websites/show', [
            'website' => $website,
            'stats' => $stats
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Website $website)
    {
        if ($website->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('websites/edit', [
            'website' => $website
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWebsiteRequest $request, Website $website)
    {
        if ($website->user_id !== auth()->id()) {
            abort(403);
        }

        $website->update($request->validated());

        return redirect()->route('websites.show', $website)
            ->with('success', 'Website updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Website $website)
    {
        if ($website->user_id !== auth()->id()) {
            abort(403);
        }

        $website->delete();

        return redirect()->route('websites.index')
            ->with('success', 'Website deleted successfully.');
    }


}