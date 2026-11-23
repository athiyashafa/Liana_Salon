<?php
function daftarEntitas() {
    return [
        'pelanggan' => [
            'tabel' => 'pelanggan',
            'kolom' => ['nama', 'telepon', 'email', 'alamat', 'tanggal_lahir', 'catatan'],
            'tanggal' => ['tanggal_lahir'],
            'kosongJadiNull' => ['tanggal_lahir'],
        ],
        'layanan' => [
            'tabel' => 'layanan',
            'kolom' => ['nama', 'kategori', 'harga', 'durasi_menit', 'deskripsi', 'aktif'],
            'bool' => ['aktif'],
            'angka' => ['harga', 'durasi_menit'],
        ],
        'transaksi' => [
            'tabel' => 'transaksi',
            'kolom' => [
                'nomor_nota', 'tanggal', 'pelanggan_id', 'pelanggan_nama', 'items',
                'subtotal', 'diskon', 'total', 'status', 'metode_pembayaran', 'bank',
                'jumlah_bayar', 'kembalian', 'kasir_nama', 'pegawai_nama', 'catatan',
            ],
            'waktu' => ['tanggal'],
            'angka' => ['subtotal', 'diskon', 'total', 'jumlah_bayar', 'kembalian'],
            'json' => ['items'],
            'kosongJadiNull' => ['pelanggan_id', 'metode_pembayaran'],
        ],
        'pengguna' => [
            'tabel' => 'pengguna',
            'kolom' => ['full_name', 'email', 'role', 'jabatan', 'aktif'],
            'bool' => ['aktif'],
            'khususPemilik' => true,
        ],
    ];
}

function metaEntitas($nama) {
    $semua = daftarEntitas();
    if (!isset($semua[$nama])) galat('Entitas tidak dikenal: ' . $nama, 404);
    return $semua[$nama];
}

function kolomUmum() {
    return ['id', 'created_date', 'updated_date', 'created_by_id'];
}

function kolomSah($m, $f) {
    if (!in_array($f, $m['kolom'], true) && !in_array($f, kolomUmum(), true)) {
        galat('Kolom tidak dikenal: ' . $f, 400);
    }
    return '`' . $f . '`';
}

function nilaiSql($m, $f, $v) {
    $kosongNull = isset($m['kosongJadiNull']) && in_array($f, $m['kosongJadiNull'], true);
    if ($kosongNull && ($v === '' || $v === null)) return null;

    $adaWaktu = (isset($m['waktu']) && in_array($f, $m['waktu'], true)) || $f === 'created_date' || $f === 'updated_date';
    if ($adaWaktu) return keDatetimeUtc($v);
    if (isset($m['tanggal']) && in_array($f, $m['tanggal'], true)) return substr((string)$v, 0, 10);
    if (isset($m['bool']) && in_array($f, $m['bool'], true)) return $v ? 1 : 0;
    if (isset($m['json']) && in_array($f, $m['json'], true)) {
        return is_string($v) ? $v : json_encode($v === null ? [] : $v, JSON_UNESCAPED_UNICODE);
    }
    if (isset($m['angka']) && in_array($f, $m['angka'], true)) return ($v === null || $v === '') ? 0 : $v;
    if (is_bool($v)) return $v ? 1 : 0;
    if (is_array($v)) return json_encode($v, JSON_UNESCAPED_UNICODE);
    return $v;
}

function kondisi($m, $f, $v, &$params) {
    $kol = kolomSah($m, $f);

    if (!adalahObjek($v)) {
        if ($v === null) return $kol . ' IS NULL';
        $params[] = nilaiSql($m, $f, $v);
        return $kol . ' = ?';
    }

    $bagian = [];
    if (array_key_exists('$regex', $v)) {
        $pola = str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], (string)$v['$regex']);
        $bagian[] = $kol . ' LIKE ?';
        $params[] = '%' . $pola . '%';
    }
    if (array_key_exists('$in', $v)) {
        $arr = is_array($v['$in']) ? $v['$in'] : [];
        if (!count($arr)) {
            $bagian[] = '1 = 0';
        } else {
            $bagian[] = $kol . ' IN (' . implode(', ', array_fill(0, count($arr), '?')) . ')';
            foreach ($arr as $x) $params[] = nilaiSql($m, $f, $x);
        }
    }
    if (array_key_exists('$nin', $v)) {
        $arr = is_array($v['$nin']) ? $v['$nin'] : [];
        if (count($arr)) {
            $bagian[] = $kol . ' NOT IN (' . implode(', ', array_fill(0, count($arr), '?')) . ')';
            foreach ($arr as $x) $params[] = nilaiSql($m, $f, $x);
        }
    }
    $perbandingan = ['$ne' => '<>', '$gt' => '>', '$gte' => '>=', '$lt' => '<', '$lte' => '<='];
    foreach ($perbandingan as $op => $simbol) {
        if (array_key_exists($op, $v)) {
            $bagian[] = $kol . ' ' . $simbol . ' ?';
            $params[] = nilaiSql($m, $f, $v[$op]);
        }
    }
    if (array_key_exists('$exists', $v)) {
        $bagian[] = $v['$exists'] ? $kol . ' IS NOT NULL' : $kol . ' IS NULL';
    }

    if (!count($bagian)) return '1 = 1';
    return '(' . implode(' AND ', $bagian) . ')';
}

// Mengembalikan [teksSql, params]; teksSql kosong bila tidak ada syarat
function bangunSyarat($m, $query) {
    $bagian = [];
    $params = [];
    if (!is_array($query)) return ['', []];

    foreach ($query as $f => $v) {
        if ($f === '$or') {
            $sub = [];
            foreach ((is_array($v) ? $v : []) as $q) {
                $hasil = bangunSyarat($m, $q);
                $sub[] = $hasil[0] === '' ? '1 = 1' : $hasil[0];
                foreach ($hasil[1] as $p) $params[] = $p;
            }
            if (count($sub)) $bagian[] = '(' . implode(' OR ', $sub) . ')';
            continue;
        }
        $bagian[] = kondisi($m, $f, $v, $params);
    }
    return [implode(' AND ', $bagian), $params];
}

function bangunUrutan($m, $sort) {
    if (!$sort) return 'ORDER BY `created_date` DESC';
    $hasil = [];
    foreach (explode(',', (string)$sort) as $s) {
        $t = trim($s);
        if ($t === '') continue;
        $desc = $t[0] === '-';
        $kol = kolomSah($m, $desc ? substr($t, 1) : $t);
        $hasil[] = $kol . ($desc ? ' DESC' : ' ASC');
    }
    return count($hasil) ? 'ORDER BY ' . implode(', ', $hasil) : 'ORDER BY `created_date` DESC';
}

function barisKeluar($nama, $baris) {
    if (!$baris) return $baris;
    $m = metaEntitas($nama);
    $kJson = isset($m['json']) ? $m['json'] : [];
    $kAngka = isset($m['angka']) ? $m['angka'] : [];
    $kBool = isset($m['bool']) ? $m['bool'] : [];
    $kWaktu = isset($m['waktu']) ? $m['waktu'] : [];

    foreach ($kJson as $f) {
        if (isset($baris[$f]) && is_string($baris[$f])) {
            $d = json_decode($baris[$f], true);
            $baris[$f] = is_array($d) ? $d : [];
        } elseif (!isset($baris[$f])) {
            $baris[$f] = [];
        }
    }
    foreach ($kAngka as $f) {
        if (isset($baris[$f])) $baris[$f] = angka($baris[$f]);
    }
    foreach ($kBool as $f) {
        if (isset($baris[$f])) $baris[$f] = (bool)(int)$baris[$f];
    }
    foreach (['created_date', 'updated_date'] as $f) {
        if (isset($baris[$f])) $baris[$f] = keIsoUtc($baris[$f]);
    }
    foreach ($kWaktu as $f) {
        if (isset($baris[$f])) $baris[$f] = keIsoUtc($baris[$f]);
    }
    if ($nama === 'pengguna') {
        unset($baris['kata_sandi'], $baris['reset_token'], $baris['reset_expired']);
    }
    return $baris;
}

function ambilKolom($m, $data) {
    $hasil = [];
    if (!is_array($data)) return $hasil;
    foreach ($data as $k => $v) {
        if (!in_array($k, $m['kolom'], true)) continue;
        $hasil[$k] = nilaiSql($m, $k, $v);
    }
    return $hasil;
}
