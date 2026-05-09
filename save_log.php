<?php
header('Content-Type: application/json');

// Cap raw payload (state can be large — image overlays, custom backgrounds, etc.)
$MAX_PAYLOAD = 5 * 1024 * 1024;
$MAX_LOGS    = 5000;

$rawData = file_get_contents('php://input', false, null, 0, $MAX_PAYLOAD + 1);
if ($rawData === false || strlen($rawData) > $MAX_PAYLOAD) {
    echo json_encode(['status' => 'error', 'message' => 'Payload troppo grande']);
    exit;
}

$data = json_decode($rawData, true);
if (!is_array($data)) {
    echo json_encode(['status' => 'error', 'message' => 'Dati non validi']);
    exit;
}

// Sanitize: cap each string field length and strip control chars
$clip = function ($v, $max) {
    if (!is_string($v)) return '';
    return mb_substr(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v), 0, $max);
};

$entry = [
    'id'        => $clip($data['id']        ?? '', 64) ?: (time() . '-' . random_int(1000, 9999)),
    'timestamp' => $clip($data['timestamp'] ?? '', 32) ?: date('Y-m-d H:i:s'),
    'format'    => $clip($data['format']    ?? '', 64),
    'title'     => $clip($data['title']     ?? '', 255) ?: 'Senza Titolo',
    'sizeId'    => $clip($data['sizeId']    ?? '', 64),
];

// Optional poster state — passed through verbatim if it's an array. Lets the
// dashboard re-import any past export. Skipped if missing or wrong shape.
if (isset($data['state']) && is_array($data['state'])) {
    $entry['state'] = $data['state'];
}

$logDir = __DIR__ . '/logs';
$logFile = $logDir . '/logs.json';
if (!is_dir($logDir)) mkdir($logDir, 0755, true);

$logs = [];
if (file_exists($logFile)) {
    $content = file_get_contents($logFile);
    $logs = json_decode($content, true);
    if (!is_array($logs)) $logs = [];
}
array_unshift($logs, $entry);
// Cap stored logs to prevent unbounded growth
if (count($logs) > $MAX_LOGS) {
    $logs = array_slice($logs, 0, $MAX_LOGS);
}

if (file_put_contents($logFile, json_encode($logs, JSON_PRETTY_PRINT), LOCK_EX) !== false) {
    echo json_encode(['status' => 'success', 'entry' => $entry]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Impossibile scrivere il file di log']);
}
?>
