<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Website;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Website>
 */
class WebsiteFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Website>
     */
    protected $model = Website::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->company() . ' Website',
            'url' => fake()->url(),
            'description' => fake()->optional()->paragraph(),
            'status' => fake()->randomElement(['active', 'inactive']),
            'scan_settings' => [
                'max_pages' => fake()->numberBetween(10, 100),
                'max_depth' => fake()->numberBetween(1, 5),
                'delay_between_requests' => fake()->numberBetween(500, 2000),
            ],
            'last_scanned_at' => fake()->optional()->dateTimeBetween('-1 month', 'now'),
        ];
    }

    /**
     * Indicate that the website is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the website has been recently scanned.
     */
    public function recentlyScanned(): static
    {
        return $this->state(fn (array $attributes) => [
            'last_scanned_at' => fake()->dateTimeBetween('-1 week', 'now'),
        ]);
    }
}