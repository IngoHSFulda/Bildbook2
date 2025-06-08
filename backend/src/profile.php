<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

// OPTIONS-Request nur bestätigen
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Session starten
session_name('PHPSESSID'); // Einheitlich verwenden
session_start();

// Prüfen ob eingeloggt
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Nicht autorisiert']);
    exit;
}

// DB-Verbindung
require_once __DIR__ . '/../config/Database.php';
$db = (new Database())->getConnection();
if (!$db) {
    http_response_code(500);
    echo json_encode(['error' => 'Datenbankverbindung fehlgeschlagen']);
    exit;
}

$user_id = $_SESSION['user_id'];

// GET: Benutzerprofil abrufen
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $db->prepare("SELECT username, name, age FROM users WHERE id = :id");
        $stmt->execute([':id' => $user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            echo json_encode(['user' => $user]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Benutzer nicht gefunden']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Serverfehler: ' . $e->getMessage()]);
    }
    exit;
}

// POST: Benutzerprofil aktualisieren
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Ungültige Eingabedaten']);
        exit;
    }

    $username = isset($data['username']) ? trim($data['username']) : null;
    $name = isset($data['name']) ? trim($data['name']) : null;
    $age = isset($data['age']) ? intval($data['age']) : null;
    $password = isset($data['password']) ? trim($data['password']) : null;

    try {
        // Prüfen, ob der Benutzername bereits vergeben ist (außer vom eigenen Benutzer)
        if ($username) {
            $checkStmt = $db->prepare("SELECT id FROM users WHERE username = :username AND id != :id");
            $checkStmt->execute([':username' => $username, ':id' => $user_id]);
            if ($checkStmt->fetch()) {
                http_response_code(409);
                echo json_encode(['error' => 'Benutzername bereits vergeben']);
                exit;
            }
        }

        // Update-Query zusammenbauen
        $fields = [];
        $params = [':id' => $user_id];
        if ($username) {
            $fields[] = 'username = :username';
            $params[':username'] = $username;
        }
        if ($name) {
            $fields[] = 'name = :name';
            $params[':name'] = $name;
        }
        if ($age !== null) {
            $fields[] = 'age = :age';
            $params[':age'] = $age;
        }
        if ($password) {
            $fields[] = 'password_hash = :password_hash';
            $params[':password_hash'] = password_hash($password, PASSWORD_DEFAULT);
        }

        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['error' => 'Keine Felder zum Aktualisieren']);
            exit;
        }

        $sql = 'UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        echo json_encode(['message' => 'Benutzerprofil aktualisiert']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Serverfehler: ' . $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Methode nicht erlaubt']);
