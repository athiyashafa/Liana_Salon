<?php
$aksi = isset($bagian[1]) ? $bagian[1] : '';
$pdo = db();
$pengguna = wajibMasuk();
wajibPemilik($pengguna);

if ($aksi === '' && $metode === 'GET') {
    $baris = $pdo->query('SELECT * FROM pengguna ORDER BY created_date ASC')->fetchAll();
    jawab(array_map('penggunaPublik', $baris));
}

if ($aksi === 'invite' && $metode === 'POST') {
    $body = bodyJson();
    $email = strtolower(trim((string)(isset($body['email']) ? $body['email'] : '')));
    $role = (isset($body['role']) && $body['role'] === 'admin') ? 'admin' : 'user';
    $sandi = (string)(isset($body['password']) && $body['password'] !== '' ? $body['password'] : konfig()['sandi_awal']);
    if ($email === '') galat('Email wajib diisi.', 400);

    $st = $pdo->prepare('SELECT id FROM pengguna WHERE email = ? LIMIT 1');
    $st->execute([$email]);
    if ($st->fetch()) galat('Email tersebut sudah terdaftar.', 409);

    $id = uuid();
    $pdo->prepare("INSERT INTO pengguna (id, full_name, email, kata_sandi, role, jabatan, aktif, created_by_id) VALUES (?, ?, ?, ?, ?, 'pegawai', 1, ?)")
        ->execute([$id, explode('@', $email)[0], $email, password_hash($sandi, PASSWORD_BCRYPT), $role, $pengguna['id']]);
    $st = $pdo->prepare('SELECT * FROM pengguna WHERE id = ?');
    $st->execute([$id]);
    jawab(['user' => penggunaPublik($st->fetch()), 'kata_sandi_awal' => $sandi]);
}

galat('Rute tidak ditemukan.', 404);
