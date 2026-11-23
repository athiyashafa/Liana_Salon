<?php
// Dipanggil dari index.php dengan $bagian (potongan alamat) dan $metode (HTTP method)
$aksi = isset($bagian[1]) ? $bagian[1] : '';
$body = bodyJson();
$pdo = db();

function surel($v) {
    return strtolower(trim((string)$v));
}

if ($aksi === 'login' && $metode === 'POST') {
    seedAkunAwal($pdo);
    $email = surel(isset($body['email']) ? $body['email'] : '');
    $sandi = (string)(isset($body['password']) ? $body['password'] : '');
    $st = $pdo->prepare('SELECT * FROM pengguna WHERE email = ? LIMIT 1');
    $st->execute([$email]);
    $u = $st->fetch();
    if (!$u || !password_verify($sandi, $u['kata_sandi'])) galat('Email atau kata sandi salah.', 401);
    if (!(int)$u['aktif']) galat('Akun ini sedang dinonaktifkan.', 403);
    jawab(['access_token' => buatToken($u['id']), 'user' => penggunaPublik($u)]);
}

if ($aksi === 'me' && $metode === 'GET') {
    jawab(penggunaPublik(wajibMasuk()));
}

if ($aksi === 'logout' && $metode === 'POST') {
    jawab(['ok' => true]);
}

// Pendaftaran dua tahap. Tanpa server email, kode ditampilkan di layar oleh aplikasi.
if ($aksi === 'register' && $metode === 'POST') {
    $email = surel(isset($body['email']) ? $body['email'] : '');
    $sandi = (string)(isset($body['password']) ? $body['password'] : '');
    $nama = trim((string)(isset($body['full_name']) ? $body['full_name'] : (isset($body['nama']) ? $body['nama'] : '')));
    if ($email === '' || $sandi === '') galat('Email dan kata sandi wajib diisi.', 400);
    if (strlen($sandi) < 5) galat('Kata sandi minimal 5 karakter.', 400);

    $st = $pdo->prepare('SELECT id FROM pengguna WHERE email = ? LIMIT 1');
    $st->execute([$email]);
    if ($st->fetch()) galat('Email sudah terdaftar.', 409);

    $kode = (string)random_int(100000, 999999);
    $st = $pdo->prepare(
        'REPLACE INTO pendaftaran_tertunda (email, kode, full_name, kata_sandi, dibuat) VALUES (?, ?, ?, ?, UTC_TIMESTAMP())'
    );
    $st->execute([$email, $kode, $nama !== '' ? $nama : explode('@', $email)[0], password_hash($sandi, PASSWORD_BCRYPT)]);
    jawab(['ok' => true, 'kode_verifikasi' => $kode]);
}

if ($aksi === 'resend-otp' && $metode === 'POST') {
    $email = surel(isset($body['email']) ? $body['email'] : '');
    $kode = (string)random_int(100000, 999999);
    $st = $pdo->prepare('UPDATE pendaftaran_tertunda SET kode = ?, dibuat = UTC_TIMESTAMP() WHERE email = ?');
    $st->execute([$kode, $email]);
    if ($st->rowCount() < 1) galat('Tidak ada pendaftaran yang menunggu verifikasi.', 400);
    jawab(['ok' => true, 'kode_verifikasi' => $kode]);
}

if ($aksi === 'verify-otp' && $metode === 'POST') {
    $email = surel(isset($body['email']) ? $body['email'] : '');
    $kode = trim((string)(isset($body['otpCode']) ? $body['otpCode'] : ''));
    $st = $pdo->prepare('SELECT * FROM pendaftaran_tertunda WHERE email = ? LIMIT 1');
    $st->execute([$email]);
    $p = $st->fetch();
    if (!$p || $p['kode'] !== $kode) galat('Kode verifikasi tidak valid.', 400);
    if (strtotime($p['dibuat'] . ' UTC') < time() - 1800) galat('Kode verifikasi sudah kedaluwarsa. Kirim ulang kode.', 400);

    $id = uuid();
    $st = $pdo->prepare(
        "INSERT INTO pengguna (id, full_name, email, kata_sandi, role, jabatan, aktif) VALUES (?, ?, ?, ?, 'user', 'pegawai', 1)"
    );
    $st->execute([$id, $p['full_name'], $email, $p['kata_sandi']]);
    $pdo->prepare('DELETE FROM pendaftaran_tertunda WHERE email = ?')->execute([$email]);

    $st = $pdo->prepare('SELECT * FROM pengguna WHERE id = ?');
    $st->execute([$id]);
    $u = $st->fetch();
    jawab(['access_token' => buatToken($id), 'user' => penggunaPublik($u)]);
}

if ($aksi === 'forgot-password' && $metode === 'POST') {
    $email = surel(isset($body['email']) ? $body['email'] : '');
    $st = $pdo->prepare('SELECT id FROM pengguna WHERE email = ? LIMIT 1');
    $st->execute([$email]);
    $u = $st->fetch();
    $hasil = ['ok' => true];
    if ($u) {
        $token = bin2hex(random_bytes(24));
        $pdo->prepare('UPDATE pengguna SET reset_token = ?, reset_expired = DATE_ADD(UTC_TIMESTAMP(), INTERVAL 60 MINUTE) WHERE id = ?')
            ->execute([$token, $u['id']]);
        $hasil['reset_token'] = $token; // tanpa server email: ditampilkan aplikasi sebagai tautan
    }
    jawab($hasil);
}

if ($aksi === 'reset-password' && $metode === 'POST') {
    $token = (string)(isset($body['resetToken']) ? $body['resetToken'] : '');
    $sandi = (string)(isset($body['newPassword']) ? $body['newPassword'] : '');
    if (strlen($sandi) < 5) galat('Kata sandi minimal 5 karakter.', 400);
    $st = $pdo->prepare('SELECT id FROM pengguna WHERE reset_token = ? AND reset_expired > UTC_TIMESTAMP() LIMIT 1');
    $st->execute([$token]);
    $u = $token !== '' ? $st->fetch() : false;
    if (!$u) galat('Tautan atur ulang tidak valid atau kedaluwarsa.', 400);
    $pdo->prepare('UPDATE pengguna SET kata_sandi = ?, reset_token = NULL, reset_expired = NULL WHERE id = ?')
        ->execute([password_hash($sandi, PASSWORD_BCRYPT), $u['id']]);
    jawab(['ok' => true]);
}

galat('Rute tidak ditemukan.', 404);
