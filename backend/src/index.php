<?php

require_once __DIR__ . '/../config/Database.php';
// src/index.php
echo "Hello, World! CI/CD Test!";

// Verbindung herstellen
$database = new Database();
$db = $database->getConnection();

// Beispiel-Query
$stmt = $db->query("SELECT * FROM users");
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($users);
