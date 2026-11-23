<?php
function jawab($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR);
    exit;
}

function galat($pesan, $status = 400) {
    jawab(['error' => ['message' => $pesan]], $status);
}

function bodyJson() {
    $mentah = file_get_contents('php://input');
    if ($mentah === false || trim($mentah) === '') return [];
    $data = json_decode($mentah, true);
    return is_array($data) ? $data : [];
}

function uuid() {
    $d = random_bytes(16);
    $d[6] = chr((ord($d[6]) & 0x0f) | 0x40);
    $d[8] = chr((ord($d[8]) & 0x3f) | 0x80);
    $h = bin2hex($d);
    return substr($h, 0, 8) . '-' . substr($h, 8, 4) . '-' . substr($h, 12, 4) . '-' . substr($h, 16, 4) . '-' . substr($h, 20, 12);
}

// Teks ISO / tanggal apa pun -> "Y-m-d H:i:s" dalam UTC
function keDatetimeUtc($v) {
    if ($v === null || $v === '') return null;
    try {
        $d = new DateTime((string)$v);
        $d->setTimezone(new DateTimeZone('UTC'));
        return $d->format('Y-m-d H:i:s');
    } catch (Exception $e) {
        return null;
    }
}

// "Y-m-d H:i:s" (UTC) -> "Y-m-dTH:i:sZ"
function keIsoUtc($v) {
    if ($v === null || $v === '') return null;
    return str_replace(' ', 'T', (string)$v) . 'Z';
}

function angka($v) {
    if ($v === null) return null;
    $f = (float)$v;
    if ($f == floor($f) && abs($f) < 1e15) return (int)$f;
    return $f;
}

function adaKunci($arr, $kunci) {
    return is_array($arr) && array_key_exists($kunci, $arr);
}

function adalahObjek($v) {
    // Objek JSON didekode sebagai array asosiatif; daftar berindeks 0..n
    if (!is_array($v)) return false;
    if ($v === []) return false;
    return array_keys($v) !== range(0, count($v) - 1);
}
