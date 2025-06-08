<?php

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Session starten
session_name('PHPSESSID');
session_start();
$_SESSION['user_id'] = $user['id']; // nach erfolgreichem Login

setcookie('PHPSESSID', session_id(), [
    'expires' => time() + 3600,
    'path' => '/',
    'secure' => false, // true bei HTTPS
    'httponly' => true,
    'samesite' => 'Lax'
]);


echo json_encode(['message' => 'Login erfolgreich']);

header('Content-Type: application/json');
// Prüfen, ob POST-Request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Nur POST-Requests erlaubt']);
    exit;
}

// Input validieren
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['username'], $data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Benutzername und Passwort müssen ausgefüllt werden']);
    exit;
}

$username = trim($data['username']);
$password = trim($data['password']);
// DB-Verbindung
require_once __DIR__ . '/../config/Database.php';
$database = new Database();
$db = $database->getConnection();
try {
    $sql = "SELECT id, username, password_hash FROM users WHERE username = :username";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user && password_verify($password, $user['password_hash'])) {
    // Session speichern
        session_regenerate_id(true);
    // Session-Fixation vorbeugen
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        echo json_encode(['message' => 'Login erfolgreich']);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Ungültiger Benutzername oder Passwort']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Datenbankfehler: ' . $e->getMessage()]);
}
