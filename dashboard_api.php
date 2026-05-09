<?php
// dashboard_api.php — read-only-ish backend for the dashboard.
// Endpoints:
//   GET ?action=list_logs              → { status, logs: [...] }
//   GET ?action=delete_log&id=...      → { status }
//   GET ?action=clear_logs             → { status }
//
// The dashboard works entirely from localStorage if this file is absent
// (e.g. on GitHub Pages). It's only loaded when present.

header('Content-Type: application/json');

$logFile = __DIR__ . '/logs/logs.json';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list_logs': {
        $logs = [];
        if (file_exists($logFile)) {
            $decoded = json_decode(file_get_contents($logFile), true);
            if (is_array($decoded)) $logs = $decoded;
        }
        echo json_encode(['status' => 'success', 'logs' => $logs]);
        break;
    }

    case 'delete_log': {
        $id = $_GET['id'] ?? '';
        if ($id === '') {
            echo json_encode(['status' => 'error', 'message' => 'ID mancante']);
            exit;
        }
        if (!file_exists($logFile)) {
            echo json_encode(['status' => 'success']);
            exit;
        }
        $logs = json_decode(file_get_contents($logFile), true);
        if (!is_array($logs)) $logs = [];
        $next = array_values(array_filter($logs, function ($l) use ($id) {
            return isset($l['id']) && (string)$l['id'] !== (string)$id;
        }));
        if (file_put_contents($logFile, json_encode($next, JSON_PRETTY_PRINT), LOCK_EX) === false) {
            echo json_encode(['status' => 'error', 'message' => 'Errore di scrittura']);
            exit;
        }
        echo json_encode(['status' => 'success']);
        break;
    }

    case 'clear_logs': {
        if (file_put_contents($logFile, json_encode([]), LOCK_EX) === false) {
            echo json_encode(['status' => 'error', 'message' => 'Errore di scrittura']);
            exit;
        }
        echo json_encode(['status' => 'success']);
        break;
    }

    default:
        echo json_encode(['status' => 'error', 'message' => 'Azione non riconosciuta']);
        break;
}
?>
