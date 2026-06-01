<?php

/**
 * Vallonation Gateway Configuration
 * Database config connections setup of clusters and replicas
 */

return [
    'default' => 'sqlite',

    'connections' => [
        'sqlite' => [
            'driver' => 'sqlite',
            'database' => __DIR__ . '/../database/sandbox.sqlite',
            'prefix' => '',
            'foreign_key_constraints' => true,
        ],

        'mysql_sovereign' => [
            'driver' => 'mysql',
            'host' => '127.0.0.1',
            'port' => '3306',
            'database' => 'vallonation_sandbox',
            'username' => 'vallo_sandbox_user',
            'password' => 'VALLO_SECRET_SANDBOX_KEY_2026',
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'strict' => true,
            'engine' => null,
            'options' => [
                PDO::MYSQL_ATTR_SSL_CA => '/etc/ssl/certs/vallonation-ca.pem',
                PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => true,
            ],
        ],
    ],

    'redis' => [
        'client' => 'phpredis',
        'default' => [
            'host' => '127.0.0.1',
            'password' => null,
            'port' => '6379',
            'database' => 0,
        ],
    ]
];
