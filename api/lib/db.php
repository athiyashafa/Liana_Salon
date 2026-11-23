<?php
function konfig() {
    static $c = null;
    if ($c === null) {
        $berkas = file_exists(__DIR__ . '/../config.php') ? __DIR__ . '/../config.php' : __DIR__ . '/../config.example.php';
        $c = require $berkas;
    }
    return $c;
}

function db() {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $c = konfig();
    $opsi = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    $dsnServer = 'mysql:host=' . $c['db_host'] . ';port=' . $c['db_port'] . ';charset=utf8mb4';

    try {
        $pdo = new PDO($dsnServer . ';dbname=' . $c['db_name'], $c['db_user'], $c['db_pass'], $opsi);
    } catch (PDOException $e) {
        $sebabDbBelumAda = ((int)$e->getCode() === 1049) || (strpos($e->getMessage(), 'Unknown database') !== false);
        if (!$sebabDbBelumAda) throw $e;
        $tmp = new PDO($dsnServer, $c['db_user'], $c['db_pass'], $opsi);
        $tmp->exec('CREATE DATABASE IF NOT EXISTS `' . $c['db_name'] . '` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
        $pdo = new PDO($dsnServer . ';dbname=' . $c['db_name'], $c['db_user'], $c['db_pass'], $opsi);
    }

    $pdo->exec("SET time_zone = '+00:00'");
    pastikanSkema($pdo);
    return $pdo;
}

function pastikanSkema($pdo) {
    $c = konfig();
    $st = $pdo->prepare(
        "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = ? AND table_name IN ('pengguna','pelanggan','layanan','transaksi','pendaftaran_tertunda')"
    );
    $st->execute([$c['db_name']]);
    if ((int)$st->fetchColumn() >= 5) return;

    $sql = file_get_contents(__DIR__ . '/schema.sql');
    $sql = preg_replace('/^\s*--.*$/m', '', $sql);
    $daftar = preg_split('/;\s*[\r\n]+/', $sql);
    foreach ($daftar as $perintah) {
        $perintah = trim($perintah);
        if ($perintah === '') continue;
        $pdo->exec($perintah);
    }
}

// Jika tabel pengguna kosong (mis. skema dibuat tanpa data akun), buat tiga akun awal.
function seedAkunAwal($pdo) {
    $jumlah = (int)$pdo->query('SELECT COUNT(*) FROM pengguna')->fetchColumn();
    if ($jumlah > 0) return;
    $c = konfig();
    $hash = password_hash($c['sandi_awal'], PASSWORD_BCRYPT);
    $akun = [
        ['Pemilik Liana Salon', 'pemilik@gmail.com', 'admin', 'pemilik'],
        ['Kasir Liana Salon', 'kasir@gmail.com', 'user', 'admin_kasir'],
        ['Pegawai Liana Salon', 'pegawai@gmail.com', 'user', 'pegawai'],
    ];
    $st = $pdo->prepare('INSERT INTO pengguna (id, full_name, email, kata_sandi, role, jabatan, aktif) VALUES (?, ?, ?, ?, ?, ?, 1)');
    foreach ($akun as $a) {
        $st->execute([uuid(), $a[0], $a[1], $hash, $a[2], $a[3]]);
    }
}
