<?php

namespace Database\Factories;

use App\Models\Scan;
use App\Models\Website;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Scan>
 */
class ScanFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Scan>
     */
    protected $model = Scan::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = fake()->randomElement(['pending', 'running', 'completed', 'failed']);
        $startedAt = fake()->dateTimeBetween('-1 month', 'now');
        
        return [
            'website_id' => Website::factory(),
            'status' => $status,
            'started_at' => $status !== 'pending' ? $startedAt : null,
            'completed_at' => in_array($status, ['completed', 'failed']) ? fake()->dateTimeBetween($startedAt, 'now') : null,
            'pages_scanned' => $status === 'completed' ? fake()->numberBetween(1, 50) : 0,
            'vulnerabilities_found' => $status === 'completed' ? fake()->numberBetween(0, 20) : 0,
            'error_message' => $status === 'failed' ? fake()->sentence() : null,
            'scan_config' => [
                'max_pages' => fake()->numberBetween(10, 100),
                'max_depth' => fake()->numberBetween(1, 5),
                'delay_between_requests' => fake()->numberBetween(500, 2000),
            ],
        ];
    }

    /**
     * Indicate that the scan is completed.
     */
    public function completed(): static
    {
        return $this->state(function (array $attributes) {
            $startedAt = fake()->dateTimeBetween('-1 week', '-1 hour');
            
            return [
                'status' => 'completed',
                'started_at' => $startedAt,
                'completed_at' => fake()->dateTimeBetween($startedAt, 'now'),
                'pages_scanned' => fake()->numberBetween(5, 50),
                'vulnerabilities_found' => fake()->numberBetween(0, 15),
            ];
        });
    }

    /**
     * Indicate that the scan is running.
     */
    public function running(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'running',
            'started_at' => fake()->dateTimeBetween('-1 hour', 'now'),
            'completed_at' => null,
            'pages_scanned' => fake()->numberBetween(0, 10),
            'vulnerabilities_found' => fake()->numberBetween(0, 5),
        ]);
    }
}