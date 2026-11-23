<?php
// Titik masuk API Liana Salon. Alamat: http://localhost/liana-salon/api/index.php?r=<rute>
ini_set('display_errors', '0');
error_reporting(E_ALL);
date_default_timezone_set('UTC');

// CORS: izinkan halaman yang dibuka langsung dari berkas (file://) memanggil API ini.
// Sesi memakai token pada header (bukan cookie), sehingga "*" aman untuk penggunaan lokal.
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Auth-Token');
header('Access-Control-Max-Age: 86400');
header('Cache-Control: no-store');

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/lib/util.php';
require __DIR__ . '/lib/db.php';
require __DIR__ . '/lib/auth.php';
require __DIR__ . '/lib/query.php';

set_exception_handler(function ($e) {
    $pesan = $e->getMessage();
    $mati = strpos($pesan, 'Connection refused') !== false
        || strpos($pesan, 'No connection could be made') !== false
        || strpos($pesan, 'getaddrinfo') !== false
        || (int)$e->getCode() === 2002;
    if ($mati) {
        jawab(['error' => ['message' => 'Tidak dapat terhubung ke MySQL. Buka XAMPP Control Panel lalu klik Start pada Apache dan MySQL.']], 503);
    }
    if ($e instanceof PDOException && (strpos($pesan, 'Access denied') !== false)) {
        jawab(['error' => ['message' => 'MySQL menolak akses. Periksa db_user dan db_pass di api/config.php.']], 503);
    }
    jawab(['error' => ['message' => 'Kesalahan server: ' . $pesan]], 500);
});

$rute = trim(isset($_GET['r']) ? (string)$_GET['r'] : '', '/');
$bagian = $rute === '' ? [] : explode('/', $rute);
$metode = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';

if (!count($bagian)) {
    $pdo = db();
    seedAkunAwal($pdo);
    jawab([
        'ok' => true,
        'aplikasi' => 'Liana Salon API',
        'database' => konfig()['db_name'],
        'pesan' => 'Server dan database siap dipakai.',
    ]);
}

switch ($bagian[0]) {
    case 'auth':
        require __DIR__ . '/routes/auth.php';
        break;
    case 'users':
        require __DIR__ . '/routes/users.php';
        break;
    case 'e':
        // alamat: e/<entitas>[/<id|count|aggregate|bulk|bulk-update>]
        array_shift($bagian);
        array_unshift($bagian, 'e');
        require __DIR__ . '/routes/entities.php';
        break;
    default:
        galat('Rute tidak ditemukan.', 404);
}
