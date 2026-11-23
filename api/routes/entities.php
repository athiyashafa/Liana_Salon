<?php
$nama = isset($bagian[1]) ? $bagian[1] : '';
$ket = isset($bagian[2]) ? $bagian[2] : '';
$m = metaEntitas($nama);
$pdo = db();
$pengguna = wajibMasuk();
$tabel = '`' . $m['tabel'] . '`';

if (!empty($m['khususPemilik']) && !adalahPemilik($pengguna)) {
    galat('Hanya Pemilik yang dapat mengakses data akun.', 403);
}

function bacaQueryGet() {
    if (empty($_GET['query'])) return [];
    $d = json_decode((string)$_GET['query'], true);
    return is_array($d) ? $d : [];
}

function batasLimit($n) {
    $n = (int)$n;
    if ($n < 1) $n = 50;
    return min($n, 500);
}

function izinHapus($nama, $pengguna) {
    if ($nama === 'transaksi' && $pengguna['jabatan'] !== 'pemilik') {
        galat('Hanya Pemilik yang dapat menghapus riwayat transaksi.', 403);
    }
}

function bungkus($k) {
    return '`' . $k . '`';
}

function sisipBaris($pdo, $m, $data) {
    $kol = array_keys($data);
    $sql = 'INSERT INTO `' . $m['tabel'] . '` (' . implode(', ', array_map('bungkus', $kol)) . ') VALUES ('
        . implode(', ', array_fill(0, count($kol), '?')) . ')';
    $pdo->prepare($sql)->execute(array_values($data));
}

function ambilSatu($pdo, $m, $id) {
    $st = $pdo->prepare('SELECT * FROM `' . $m['tabel'] . '` WHERE id = ? LIMIT 1');
    $st->execute([$id]);
    return $st->fetch();
}

function siapkanBaru($nama, $m, $isi, $pengguna) {
    $data = ambilKolom($m, $isi);
    $data['id'] = uuid();
    $data['created_by_id'] = $pengguna['id'];
    if ($nama === 'transaksi' && empty($data['tanggal'])) $data['tanggal'] = gmdate('Y-m-d H:i:s');
    return $data;
}

function daftarBody($body) {
    if (is_array($body) && isset($body['items']) && is_array($body['items'])) return $body['items'];
    if (is_array($body) && array_keys($body) === range(0, count($body) - 1)) return $body;
    return [];
}

// ---------- GET ----------
if ($metode === 'GET') {
    if ($ket === '') { // list / filter
        $s = bangunSyarat($m, bacaQueryGet());
        $where = $s[0] === '' ? '' : 'WHERE ' . $s[0];
        $limit = batasLimit(isset($_GET['limit']) ? $_GET['limit'] : 50);
        $offset = max(0, (int)(isset($_GET['cursor']) ? $_GET['cursor'] : 0));

        if (!empty($_GET['distinct'])) {
            $kol = kolomSah($m, (string)$_GET['distinct']);
            $st = $pdo->prepare('SELECT DISTINCT ' . $kol . ' AS nilai FROM ' . $tabel . ' ' . $where . ' ORDER BY nilai');
            $st->execute($s[1]);
            $nilai = [];
            foreach ($st->fetchAll() as $r) {
                if ($r['nilai'] !== null && $r['nilai'] !== '') $nilai[] = $r['nilai'];
            }
            jawab(['items' => $nilai, 'next_cursor' => null, 'has_more' => false]);
        }

        $sql = 'SELECT * FROM ' . $tabel . ' ' . $where . ' ' . bangunUrutan($m, isset($_GET['sort']) ? $_GET['sort'] : '')
            . ' LIMIT ' . ($limit + 1) . ' OFFSET ' . $offset;
        $st = $pdo->prepare($sql);
        $st->execute($s[1]);
        $baris = $st->fetchAll();
        $adaLagi = count($baris) > $limit;
        $baris = array_slice($baris, 0, $limit);
        $items = [];
        foreach ($baris as $r) $items[] = barisKeluar($nama, $r);
        jawab(['items' => $items, 'next_cursor' => (string)($offset + count($items)), 'has_more' => $adaLagi]);
    }

    if ($ket === 'count') {
        $s = bangunSyarat($m, bacaQueryGet());
        $st = $pdo->prepare('SELECT COUNT(*) FROM ' . $tabel . ' ' . ($s[0] === '' ? '' : 'WHERE ' . $s[0]));
        $st->execute($s[1]);
        jawab((int)$st->fetchColumn());
    }

    if ($ket === 'aggregate') {
        $s = bangunSyarat($m, bacaQueryGet());
        $where = $s[0] === '' ? '' : 'WHERE ' . $s[0];
        $daftar = function ($v) {
            $hasil = [];
            foreach (explode(',', (string)$v) as $x) {
                $x = trim($x);
                if ($x !== '') $hasil[] = $x;
            }
            return $hasil;
        };
        $sums = $daftar(isset($_GET['sum']) ? $_GET['sum'] : '');
        $avgs = $daftar(isset($_GET['avg']) ? $_GET['avg'] : '');
        $mins = $daftar(isset($_GET['min']) ? $_GET['min'] : '');
        $maxs = $daftar(isset($_GET['max']) ? $_GET['max'] : '');
        $groupBy = isset($_GET['groupBy']) ? (string)$_GET['groupBy'] : '';
        $bucketField = isset($_GET['bucketField']) ? (string)$_GET['bucketField'] : '';
        $bucketUnit = isset($_GET['bucketUnit']) ? (string)$_GET['bucketUnit'] : 'day';
        $tz = (int)(isset($_GET['tz']) ? $_GET['tz'] : 0);

        $pilih = ['COUNT(*) AS `count`'];
        $grup = [];
        if ($groupBy !== '') {
            $kol = kolomSah($m, $groupBy);
            $pilih[] = $kol . ' AS ' . bungkus($groupBy);
            $grup[] = $kol;
        }
        if ($bucketField !== '') {
            $kol = kolomSah($m, $bucketField);
            $geser = 'DATE_ADD(' . $kol . ', INTERVAL ' . $tz . ' MINUTE)';
            if ($bucketUnit === 'month') $ekspr = "DATE_FORMAT($geser, '%Y-%m')";
            elseif ($bucketUnit === 'week') $ekspr = "DATE_FORMAT($geser, '%x-%v')";
            else $ekspr = "DATE($geser)";
            $pilih[] = $ekspr . ' AS ' . bungkus($bucketField);
            $grup[] = $ekspr;
        }
        foreach ($sums as $f) $pilih[] = 'COALESCE(SUM(' . kolomSah($m, $f) . '), 0) AS ' . bungkus('sum_' . $f);
        foreach ($avgs as $f) $pilih[] = 'COALESCE(AVG(' . kolomSah($m, $f) . '), 0) AS ' . bungkus('avg_' . $f);
        foreach ($mins as $f) $pilih[] = 'MIN(' . kolomSah($m, $f) . ') AS ' . bungkus('min_' . $f);
        foreach ($maxs as $f) $pilih[] = 'MAX(' . kolomSah($m, $f) . ') AS ' . bungkus('max_' . $f);

        $sql = 'SELECT ' . implode(', ', $pilih) . ' FROM ' . $tabel . ' ' . $where;
        if (count($grup)) $sql .= ' GROUP BY ' . implode(', ', $grup) . ' ORDER BY ' . $grup[0];
        $st = $pdo->prepare($sql);
        $st->execute($s[1]);

        $rows = [];
        foreach ($st->fetchAll() as $r) {
            foreach ($r as $k => $v) {
                if ($k === 'count') $r[$k] = (int)$v;
                elseif (strpos($k, 'sum_') === 0 || strpos($k, 'avg_') === 0 || strpos($k, 'min_') === 0 || strpos($k, 'max_') === 0) {
                    $r[$k] = angka($v);
                }
            }
            $rows[] = $r;
        }
        jawab(['rows' => $rows]);
    }

    $baris = ambilSatu($pdo, $m, $ket);
    if (!$baris) galat('Data tidak ditemukan.', 404);
    jawab(barisKeluar($nama, $baris));
}

// ---------- POST ----------
if ($metode === 'POST') {
    if ($nama === 'pengguna') galat('Gunakan menu Pengguna untuk mengundang akun baru.', 400);

    if ($ket === '') {
        $data = siapkanBaru($nama, $m, bodyJson(), $pengguna);
        sisipBaris($pdo, $m, $data);
        jawab(barisKeluar($nama, ambilSatu($pdo, $m, $data['id'])));
    }
    if ($ket === 'bulk') {
        $dibuat = [];
        foreach (daftarBody(bodyJson()) as $isi) {
            $data = siapkanBaru($nama, $m, $isi, $pengguna);
            sisipBaris($pdo, $m, $data);
            $dibuat[] = barisKeluar($nama, ambilSatu($pdo, $m, $data['id']));
        }
        jawab($dibuat);
    }
    if ($ket === 'bulk-update') {
        foreach (daftarBody(bodyJson()) as $item) {
            if (!is_array($item) || empty($item['id'])) continue;
            $id = $item['id'];
            unset($item['id']);
            $data = ambilKolom($m, $item);
            if (!count($data)) continue;
            $set = implode(', ', array_map(function ($k) { return '`' . $k . '` = ?'; }, array_keys($data)));
            $nilai = array_values($data);
            $nilai[] = $id;
            $pdo->prepare('UPDATE ' . $tabel . ' SET ' . $set . ' WHERE id = ?')->execute($nilai);
        }
        jawab(['ok' => true]);
    }
}

// ---------- PATCH (ubah satu) ----------
if ($metode === 'PATCH' && $ket !== '') {
    $data = ambilKolom($m, bodyJson());
    if (!count($data)) galat('Tidak ada perubahan yang dikirim.', 400);

    if ($nama === 'pengguna' && $ket === $pengguna['id'] && isset($data['jabatan'])) {
        $tetapPemilik = $data['jabatan'] === 'pemilik' || $pengguna['role'] === 'admin';
        if (!$tetapPemilik) galat('Pemilik tidak dapat menurunkan perannya sendiri.', 400);
    }

    $set = implode(', ', array_map(function ($k) { return '`' . $k . '` = ?'; }, array_keys($data)));
    $nilai = array_values($data);
    $nilai[] = $ket;
    $pdo->prepare('UPDATE ' . $tabel . ' SET ' . $set . ' WHERE id = ?')->execute($nilai);

    $baris = ambilSatu($pdo, $m, $ket);
    if (!$baris) galat('Data tidak ditemukan.', 404);
    jawab(barisKeluar($nama, $baris));
}

// ---------- PUT (ubah banyak) ----------
if ($metode === 'PUT' && $ket === '') {
    $body = bodyJson();
    $s = bangunSyarat($m, isset($body['query']) ? $body['query'] : []);
    $isi = isset($body['update']) ? $body['update'] : [];
    if (isset($isi['$set']) && is_array($isi['$set'])) $isi = $isi['$set'];
    $data = ambilKolom($m, $isi);
    if (!count($data)) galat('Tidak ada perubahan yang dikirim.', 400);
    $set = implode(', ', array_map(function ($k) { return '`' . $k . '` = ?'; }, array_keys($data)));
    $st = $pdo->prepare('UPDATE ' . $tabel . ' SET ' . $set . ' ' . ($s[0] === '' ? '' : 'WHERE ' . $s[0]));
    $st->execute(array_merge(array_values($data), $s[1]));
    jawab(['updated' => $st->rowCount(), 'has_more' => false]);
}

// ---------- DELETE ----------
if ($metode === 'DELETE') {
    izinHapus($nama, $pengguna);
    if ($ket === '') {
        $body = bodyJson();
        $s = bangunSyarat($m, isset($body['query']) ? $body['query'] : bacaQueryGet());
        $st = $pdo->prepare('DELETE FROM ' . $tabel . ' ' . ($s[0] === '' ? '' : 'WHERE ' . $s[0]));
        $st->execute($s[1]);
        jawab(['deleted' => $st->rowCount()]);
    }
    $pdo->prepare('DELETE FROM ' . $tabel . ' WHERE id = ?')->execute([$ket]);
    jawab(['ok' => true]);
}

galat('Rute tidak ditemukan.', 404);
