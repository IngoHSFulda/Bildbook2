<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, OPTIONS');
ini_set('display_errors', 1);
error_reporting(E_ALL);
try {
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



    if (empty($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Nicht autorisiert']);
        exit;
    }

    require_once __DIR__ . '/../config/config.php';
    $pexelsApiKey = $_ENV['PEXELS_API_KEY'] ?? '';
    if (!$pexelsApiKey) {
        throw new Exception('PEXELS_API_KEY nicht gesetzt');
    }

    $apiUrl = 'https://api.pexels.com/v1/curated?per_page=10';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: ' . $pexelsApiKey
    ]);
    $response = curl_exec($ch);
    if (curl_errno($ch)) {
        throw new Exception('Fehler beim Abrufen der Bilder: ' . curl_error($ch));
    }
    curl_close($ch);
    $data = json_decode($response, true);
    if (!$data || !isset($data['photos'])) {
        throw new Exception('Ungültige Antwort von Pexels');
    }

    $images = array_map(function ($photo) {

        return [
            'id' => $photo['id'],
            'url' => $photo['url'],
            'photographer' => $photo['photographer'],
            'src' => $photo['src']['medium']
        ];
    }, $data['photos']);
    echo json_encode(['images' => $images]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
