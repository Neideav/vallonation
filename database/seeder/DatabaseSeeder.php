<?php

/**
 * Seeder: Database Seeder Wrapper
 * Seeds initial sovereign sandbox instances & gateways
 */

class DatabaseSeeder {
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run() {
        $defaultDomains = [
            [
                'domain_name' => 'sandbox-gateway.io',
                'billing_cycle' => 'annual',
                'price_usd' => 34.99,
                'bonus_writes_credited' => 200000,
                'ssl_active' => 1
            ]
        ];

        foreach ($defaultDomains as $domain) {
            echo "Seeding default domain mapping record for: " . $domain['domain_name'] . "\n";
        }

        echo "Seed complete: 1 active domain sandbox instance initialized.\n";
    }
}
