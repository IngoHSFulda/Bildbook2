<?php

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
if (!isset($data['username'], $data['password'], $data['name'], $data['age'])) {
    http_response_code(400);
// Bad Request
    echo json_encode(['error' => 'Alle Felder müssen ausgefüllt werden']);
    exit;
}

// Felder auslesen
$username = trim($data['username']);
$password = trim($data['password']);
$name = trim($data['name']);
$age = intval($data['age']);
// Password hashen
$password_hash = password_hash($password, PASSWORD_DEFAULT);
// DB-Verbindung
require_once __DIR__ . '/../config/Database.php';
$database = new Database();
$db = $database->getConnection();
// Benutzer speichern
try {
    $sql = "INSERT INTO users (username, password_hash, name, age)
            VALUES (:username, :password_hash, :name, :age)";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':password_hash', $password_hash);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':age', $age);
    $stmt->execute();
    http_response_code(201);
// Created
    echo json_encode(['message' => 'Benutzer erfolgreich registriert']);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
    // Duplicate username
        http_response_code(409);
    // Conflict
        echo json_encode(['error' => 'Benutzername existiert bereits']);
    } else {
        http_response_code(500);
    // Internal Server Error
        echo json_encode(['error' => 'Datenbankfehler: ' . $e->getMessage()]);
    }
}
