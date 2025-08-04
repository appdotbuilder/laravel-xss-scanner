<?php

namespace Database\Seeders;

use App\Models\Scan;
use App\Models\User;
use App\Models\Vulnerability;
use App\Models\Website;
use Illuminate\Database\Seeder;

class XssScannerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test users
        $users = User::factory(3)->create();

        foreach ($users as $user) {
            // Create websites for each user
            $websites = Website::factory(random_int(2, 5))
                ->for($user)
                ->create();

            foreach ($websites as $website) {
                // Create scans for each website
                $scans = Scan::factory(random_int(1, 4))
                    ->for($website)
                    ->completed()
                    ->create();

                foreach ($scans as $scan) {
                    // Create vulnerabilities for each scan
                    if ($scan->status === 'completed' && random_int(1, 100) <= 70) {
                        $vulnCount = random_int(0, 8);
                        
                        if ($vulnCount > 0) {
                            Vulnerability::factory($vulnCount)
                                ->for($scan)
                                ->create();

                            // Update scan vulnerability count
                            $scan->update([
                                'vulnerabilities_found' => $vulnCount
                            ]);
                        }
                    }
                }
            }
        }

        // Create some running scans
        $runningScan = Scan::factory()
            ->for(Website::factory()->for($users->first()))
            ->running()
            ->create();

        // Create a failed scan
        $failedScan = Scan::factory()
            ->for(Website::factory()->for($users->first()))
            ->state([
                'status' => 'failed',
                'started_at' => now()->subHours(2),
                'completed_at' => now()->subHours(1),
                'error_message' => 'Connection timeout while scanning target website',
                'pages_scanned' => 5,
                'vulnerabilities_found' => 0,
            ])
            ->create();
    }
}