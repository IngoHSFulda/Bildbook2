<?php
require_once __DIR__ . '/../config/Database.php';

// Verbindung herstellen
$database = new Database();
$db = $database->getConnection();

// Beispiel-Query
$stmt = $db->query("SELECT * FROM users");
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($users);
