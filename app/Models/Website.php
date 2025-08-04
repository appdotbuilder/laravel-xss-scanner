<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Website
 *
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string $url
 * @property string|null $description
 * @property string $status
 * @property array|null $scan_settings
 * @property \Illuminate\Support\Carbon|null $last_scanned_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Scan> $scans
 * @property-read int|null $scans_count
 * @property-read \App\Models\Scan|null $latest_scan
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Website newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Website newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Website query()
 * @method static \Illuminate\Database\Eloquent\Builder|Website whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Website whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Website whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Website whereLastScannedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Website whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Website whereScanSettings($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Website whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Website whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Website whereUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Website whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Website active()
 * @method static \Database\Factories\WebsiteFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Website extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'url',
        'description',
        'status',
        'scan_settings',
        'last_scanned_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'scan_settings' => 'array',
        'last_scanned_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'websites';

    /**
     * Get the user that owns the website.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all scans for this website.
     */
    public function scans(): HasMany
    {
        return $this->hasMany(Scan::class);
    }

    /**
     * Get the latest scan for this website.
     */
    public function latestScan(): HasMany
    {
        return $this->scans()->latest();
    }

    /**
     * Scope a query to only include active websites.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}