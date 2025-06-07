<?php

session_start();
header('Content-Type: application/json');
// Prüfen, ob die Request-Methode POST ist
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
// Method Not Allowed
    echo json_encode(['error' => 'Nur POST-Requests erlaubt']);
    exit;
}

// Input validieren (Basic)
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['username'], $data['password'])) {
    http_response_code(400);
// Bad Request
    echo json_encode(['error' => 'Benutzername und Passwort müssen ausgefüllt werden']);
    exit;
}

$username = trim($data['username']);
$password = trim($data['password']);
// DB-Verbindung
require_once __DIR__ . '/../config/Database.php';
$database = new Database();
$db = $database->getConnection();
// Benutzer abrufen
try {
    $sql = "SELECT id, username, password_hash FROM users WHERE username = :username";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user && password_verify($password, $user['password_hash'])) {
    // Passwort korrekt → Session starten
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
    // Cookie setzen (optional, falls du es clientseitig brauchst)
        setcookie('session_id', session_id(), [
            'expires' => time() + 3600, // 1 Stunde
            'path' => '/',
            'httponly' => true,  // für Sicherheit
            'samesite' => 'Strict'
        ]);
        echo json_encode(['message' => 'Login erfolgreich']);
    } else {
        http_response_code(401);
    // Unauthorized
        echo json_encode(['error' => 'Ungültiger Benutzername oder Passwort']);
    }
} catch (PDOException $e) {
    http_response_code(500);
// Internal Server Error
    echo json_encode(['error' => 'Datenbankfehler: ' . $e->getMessage()]);
}
