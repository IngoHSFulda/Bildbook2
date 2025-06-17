<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_name('PHPSESSID');
session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Nicht autorisiert']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Nur POST erlaubt']);
    exit;
}

if (!isset($_FILES['image'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Keine Datei hochgeladen']);
    exit;
}

$tmpFile = $_FILES['image']['tmp_name'];
$originalName = basename($_FILES['image']['name']);
$uploadDir = realpath(__DIR__) . '/uploads';
$uniqueName = uniqid() . '_' . $originalName;
$targetFile = $uploadDir . '/' . $uniqueName;
// Verzeichnis erstellen, wenn es nicht existiert
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        http_response_code(500);
        echo json_encode(['error' => 'Upload-Verzeichnis konnte nicht erstellt werden']);
        exit;
    }
}

if (!is_readable($tmpFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Temporäre Datei nicht lesbar']);
    exit;
}

if (!move_uploaded_file($tmpFile, $targetFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Fehler beim Verschieben der Datei']);
    exit;
}

// Erfolgsmeldung mit Dateiname zur Nutzung im Frontend
echo json_encode([
    'message' => 'Bild erfolgreich hochgeladen',
    'path' => $uniqueName
]);
