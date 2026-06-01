<?php

/**
 * Vallonation Cloud Gateway Router
 * Public index router pointing dynamic API queries to PHP backend environments
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Parse requests
$request_uri = $_SERVER['REQUEST_URI'] ?? '/';
$request_method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Micro-Routing response
$response = [
    "status" => "online",
    "gateway" => "Vallonation Core DNS Edge Gateway",
    "timestamp" => time(),
    "ssl_mode" => "active_tls_1.3",
    "path" => $request_uri
];

if (preg_match('/^\/api\/schema-status/', $request_uri)) {
    $response["data"] = [
        "replicas_active" => 12,
        "replication_lag_ms" => 12.4,
        "active_sandbox_credits_limit" => "unlimited_writes"
    ];
} else if (preg_match('/^\/api\/validate-domain/', $request_uri)) {
    $domain_query = $_GET['domain'] ?? 'none';
    $response["data"] = [
        "queried_domain" => $domain_query,
        "is_resolvable" => true,
        "ssl_handshake_certificate_issuer" => "Vallonation Let's Encrypt Wildcard"
    ];
} else {
    $response["message"] = "Welcome to Vallonation Cloud PHP Gateway Proxy Index Router.";
}

echo json_encode($response, JSON_PRETTY_PRINT);
