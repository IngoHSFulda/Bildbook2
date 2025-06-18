<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, OPTIONS');

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

$userId = $_SESSION['user_id'];

try {
    $pdo = new PDO('mysql:host=localhost;dbname=bildbook;charset=utf8mb4', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare('SELECT id, filename, name, description, uploaded_at FROM images WHERE user_id = :user_id ORDER BY uploaded_at DESC');
    $stmt->execute([':user_id' => $userId]);

    $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'images' => $images
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Fehler beim Abrufen der Bilder: ' . $e->getMessage()]);
}
