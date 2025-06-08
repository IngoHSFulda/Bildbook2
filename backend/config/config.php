<?php
require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$pexelsApiKey = $_ENV['PEXELS_API_KEY'] ?? '';
if (!$pexelsApiKey) {
    throw new Exception('PEXELS_API_KEY nicht gesetzt!');
}
