<?php
/**
 * Vallonation Rate Limiter API Handler (PHP)
 * Controls sliding window IP rate limiting rules and queries telemetry.
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db_config = require_once __DIR__ . '/../../config/database.php';

// Simulate reading active threshold configs
$config_file = __DIR__ . '/rate_limit_config.json';
if (file_exists($config_file)) {
    $active_config = json_decode(file_get_contents($config_file), true);
} else {
    $active_config = [
        "threshold_rpm" => 6000,
        "tls_enforced" => true,
        "gzip_level" => 6,
        "sync_port" => 3306
    ];
}

$request_method = $_SERVER['REQUEST_METHOD'];

if ($request_method === 'POST') {
    // Save updated telemetry configurations
    $input_json = file_get_contents('php://input');
    $input_data = json_decode($input_json, true);

    if (isset($input_data['threshold'])) {
        $active_config['threshold_rpm'] = intval($input_data['threshold']);
    }
    if (isset($input_data['tls_version'])) {
        $active_config['tls_enforced'] = strpos($input_data['tls_version'], 'Only') !== false;
    }
    if (isset($input_data['gzip_level'])) {
        $active_config['gzip_level'] = intval($input_data['gzip_level']);
    }
    if (isset($input_data['port'])) {
        $active_config['sync_port'] = intval($input_data['port']);
    }

    file_put_contents($config_file, json_encode($active_config, JSON_PRETTY_PRINT));

    echo json_encode([
        "success" => true,
        "message" => "Rate limit boundaries and system gateway ports deployed successfully onto database cluster.",
        "config" => $active_config,
        "timestamp" => time()
    ]);
} else {
    // Return mock real-time rate limiter telemetry statistics
    $telemetry = [];
    $start_time = time() - 35;
    
    for ($i = 0; $i < 8; $i++) {
        $step_time = $start_time + ($i * 5);
        $rps = rand(15, 75);
        $blocked = rand(0, 10) > 7 ? rand(1, 4) : 0;
        
        $telemetry[] = [
            "time" => date("H:i:s", $step_time),
            "rps" => $rps,
            "blocked" => $blocked
        ];
    }

    echo json_encode([
        "success" => true,
        "active_rules" => $active_config,
        "network_status" => "HEALTHY",
        "region_balancing" => "ANY_CAST_ZONE_STRICT",
        "telemetry_history" => $telemetry,
        "timestamp" => time()
    ], JSON_PRETTY_PRINT);
}
