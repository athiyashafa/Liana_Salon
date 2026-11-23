<?php
function b64u($s) {
    return rtrim(strtr(base64_encode($s), '+/', '-_'), '=');
}

function b64uBalik($s) {
    return base64_decode(strtr($s, '-_', '+/'));
}

function buatToken($idPengguna) {
    $c = konfig();
    $isi = b64u(json_encode(['sub' => $idPengguna, 'exp' => time() + (int)$c['umur_token']]));
    $tanda = b64u(hash_hmac('sha256', $isi, $c['rahasia'], true));
    return $isi . '.' . $tanda;
}

function bacaToken($token) {
    $c = konfig();
    $bagian = explode('.', (string)$token);
    if (count($bagian) !== 2) return null;
    $harap = b64u(hash_hmac('sha256', $bagian[0], $c['rahasia'], true));
    if (!hash_equals($harap, $bagian[1])) return null;
    $data = json_decode(b64uBalik($bagian[0]), true);
    if (!is_array($data) || empty($data['sub']) || empty($data['exp']) || $data['exp'] < time()) return null;
    return $data['sub'];
}

function ambilTokenDariRequest() {
    $h = '';
    if (!empty($_SERVER['HTTP_AUTHORIZATION'])) $h = $_SERVER['HTTP_AUTHORIZATION'];
    elseif (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) $h = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    elseif (function_exists('apache_request_headers')) {
        foreach (apache_request_headers() as $k => $v) {
            if (strtolower($k) === 'authorization') $h = $v;
        }
    }
    if (strncmp($h, 'Bearer ', 7) === 0) return substr($h, 7);
    if (!empty($_SERVER['HTTP_X_AUTH_TOKEN'])) return $_SERVER['HTTP_X_AUTH_TOKEN'];
    return null;
}

function wajibMasuk() {
    $token = ambilTokenDariRequest();
    if (!$token) galat('Silakan masuk terlebih dahulu.', 401);
    $id = bacaToken($token);
    if (!$id) galat('Sesi berakhir. Silakan masuk kembali.', 401);
    $st = db()->prepare('SELECT * FROM pengguna WHERE id = ? LIMIT 1');
    $st->execute([$id]);
    $u = $st->fetch();
    if (!$u || !(int)$u['aktif']) galat('Sesi tidak valid. Silakan masuk kembali.', 401);
    return $u;
}

function adalahPemilik($u) {
    return $u && ($u['jabatan'] === 'pemilik' || $u['role'] === 'admin');
}

function wajibPemilik($u) {
    if (!adalahPemilik($u)) galat('Hanya Pemilik yang dapat melakukan ini.', 403);
}

function penggunaPublik($u) {
    if (!$u) return null;
    unset($u['kata_sandi'], $u['reset_token'], $u['reset_expired']);
    $u['aktif'] = (bool)(int)$u['aktif'];
    foreach (['created_date', 'updated_date'] as $f) {
        if (isset($u[$f])) $u[$f] = keIsoUtc($u[$f]);
    }
    return $u;
}
