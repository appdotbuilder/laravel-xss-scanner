<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Scan
 *
 * @property int $id
 * @property int $website_id
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $started_at
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property int $pages_scanned
 * @property int $vulnerabilities_found
 * @property string|null $error_message
 * @property array|null $scan_config
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Website $website
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Vulnerability> $vulnerabilities
 * @property-read int|null $vulnerabilities_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Scan newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Scan newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Scan query()
 * @method static \Illuminate\Database\Eloquent\Builder|Scan whereCompletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Scan whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Scan whereErrorMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Scan whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Scan wherePagesScanned($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Scan whereScanConfig($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Scan whereStartedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Scan whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Scan whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Scan whereVulnerabilitiesFound($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Scan whereWebsiteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Scan completed()
 * @method static \Illuminate\Database\Eloquent\Builder|Scan running()
 * @method static \Database\Factories\ScanFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Scan extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'website_id',
        'status',
        'started_at',
        'completed_at',
        'pages_scanned',
        'vulnerabilities_found',
        'error_message',
        'scan_config',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'scan_config' => 'array',
        'pages_scanned' => 'integer',
        'vulnerabilities_found' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'scans';

    /**
     * Get the website that owns this scan.
     */
    public function website(): BelongsTo
    {
        return $this->belongsTo(Website::class);
    }

    /**
     * Get all vulnerabilities found in this scan.
     */
    public function vulnerabilities(): HasMany
    {
        return $this->hasMany(Vulnerability::class);
    }

    /**
     * Scope a query to only include completed scans.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope a query to only include running scans.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeRunning($query)
    {
        return $query->where('status', 'running');
    }
}