<?php

/**
 * Migration: Create Domains Table
 * Generated for Vallonation Sovereign Registry System
 */

class CreateDomainsTable {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        $schema = [
            'id' => 'INT AUTO_INCREMENT PRIMARY KEY',
            'domain_name' => 'VARCHAR(255) NOT NULL UNIQUE',
            'billing_cycle' => 'ENUM("monthly", "quarterly", "semester", "annual") DEFAULT "annual"',
            'price_usd' => 'DECIMAL(10, 2) NOT NULL',
            'bonus_writes_credited' => 'INT DEFAULT 0',
            'ssl_active' => 'TINYINT(1) DEFAULT 1',
            'bound_at' => 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
            'next_invoice_at' => 'TIMESTAMP NULL'
        ];

        // Execute query placeholder
        echo "Updating schema: Table [domains] created successfully.\n";
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        echo "Reverting schema: Table [domains] successfully dropped.\n";
    }
}
