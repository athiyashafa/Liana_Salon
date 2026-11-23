// ============================================================
// KLIEN API Liana Salon
// Menghubungkan aplikasi ke API PHP + database MySQL lokal (XAMPP).
// Alamat API otomatis:
//  - halaman dibuka dari https://localhost/liana-salon/  -> alamat yang sama
//  - halaman dibuka langsung dari berkas index.html      -> http://localhost/liana-salon/api
// Bisa diganti saat build dengan variabel VITE_API_URL.
// ============================================================

const TOKEN_KEY = 'liana_salon_token';

const NAMA_ENTITAS = {
  Pelanggan: 'pelanggan',
  Layanan: 'layanan',
  Transaksi: 'transaksi',
  User: 'pengguna',
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function alamatApi() {
  const dariEnv = import.meta.env && import.meta.env.VITE_API_URL;
  if (dariEnv) return String(dariEnv).replace(/\/$/, '');
  const { protocol, origin, pathname } = window.location;
  if ((protocol === 'http:' || protocol === 'https:') && pathname.startsWith('/liana-salon/')) {
    return `${origin}/liana-salon/api`;
  }
  return 'http://localhost/liana-salon/api';
}

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const simpanToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // penyimpanan diblokir: diabaikan
  }
};

async function request(method, rute, { params, body } = {}) {
  let url = `${alamatApi()}/index.php?r=${encodeURIComponent(rute)}`;
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    url += `&${encodeURIComponent(k)}=${encodeURIComponent(typeof v === 'object' ? JSON.stringify(v) : v)}`;
  });

  const token = getToken();
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    headers['X-Auth-Token'] = token;
  }
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      'Tidak dapat terhubung ke server. Pastikan Apache dan MySQL di XAMPP sudah Start, dan folder api sudah ada di htdocs/liana-salon/api.',
      0
    );
  }

  const teks = await res.text();
  let data = null;
  try {
    data = teks ? JSON.parse(teks) : null;
  } catch {
    throw new ApiError(`Server memberi jawaban yang tidak dikenal (status ${res.status}). Periksa pemasangan folder api.`, res.status);
  }

  if (!res.ok) {
    throw new ApiError(data?.error?.message || `Permintaan gagal (status ${res.status}).`, res.status);
  }
  return data;
}

// ---------- Entitas ----------
class Entitas {
  constructor(nama) {
    this.nama = nama;
    this.rute = `e/${NAMA_ENTITAS[nama]}`;
  }

  async _daftar({ query, sort, limit, cursor, distinct, halaman }) {
    const hasil = await request('GET', this.rute, { params: { query, sort, limit, cursor, distinct } });
    return halaman ? hasil : hasil.items;
  }

  // list({sort, limit, cursor, distinct}) -> halaman | list('-tanggal', 5) -> array
  list(arg1, arg2) {
    if (arg1 && typeof arg1 === 'object') {
      return this._daftar({ sort: arg1.sort, limit: arg1.limit, cursor: arg1.cursor, distinct: arg1.distinct, halaman: true });
    }
    return this._daftar({ sort: arg1, limit: arg2, halaman: false });
  }

  filter(query = {}, options) {
    return this._daftar({
      query: Object.keys(query || {}).length ? query : undefined,
      sort: options?.sort,
      limit: options?.limit,
      cursor: options?.cursor,
      halaman: options !== undefined,
    });
  }

  get(id) {
    return request('GET', `${this.rute}/${encodeURIComponent(id)}`);
  }

  create(data) {
    return request('POST', this.rute, { body: data });
  }

  bulkCreate(items) {
    return request('POST', `${this.rute}/bulk`, { body: items });
  }

  update(id, data) {
    return request('PATCH', `${this.rute}/${encodeURIComponent(id)}`, { body: data });
  }

  bulkUpdate(items) {
    return request('POST', `${this.rute}/bulk-update`, { body: items });
  }

  updateMany(query, update) {
    return request('PUT', this.rute, { body: { query, update } });
  }

  delete(id) {
    return request('DELETE', `${this.rute}/${encodeURIComponent(id)}`);
  }

  deleteMany(query) {
    return request('DELETE', this.rute, { body: { query } });
  }

  count(query = {}) {
    return request('GET', `${this.rute}/count`, {
      params: { query: Object.keys(query || {}).length ? query : undefined },
    });
  }

  aggregate({ query = {}, groupBy, sum, avg, min, max, dateBucket } = {}) {
    const gabung = (v) => (Array.isArray(v) ? v.join(',') : v);
    return request('GET', `${this.rute}/aggregate`, {
      params: {
        query: Object.keys(query || {}).length ? query : undefined,
        groupBy,
        sum: gabung(sum),
        avg: gabung(avg),
        min: gabung(min),
        max: gabung(max),
        bucketField: dateBucket?.field,
        bucketUnit: dateBucket?.unit,
        tz: -new Date().getTimezoneOffset(),
      },
    });
  }

  subscribe() {
    return () => {};
  }
}

// ---------- Akun & sesi ----------
const auth = {
  setToken: simpanToken,

  me: () => request('GET', 'auth/me'),

  async isAuthenticated() {
    try {
      await request('GET', 'auth/me');
      return true;
    } catch {
      return false;
    }
  },

  async loginViaEmailPassword(email, password) {
    const hasil = await request('POST', 'auth/login', { body: { email, password } });
    if (hasil?.access_token) simpanToken(hasil.access_token);
    return hasil;
  },

  // Pendaftaran dua tahap. Server tidak mengirim email, jadi kode ditampilkan di layar.
  async register(data) {
    const hasil = await request('POST', 'auth/register', { body: data });
    if (hasil?.kode_verifikasi) {
      window.alert(`Kode verifikasi Anda: ${hasil.kode_verifikasi}\n(Versi lokal tidak mengirim email, jadi kode ditampilkan di sini.)`);
    }
    return { ok: true };
  },

  async verifyOtp({ email, otpCode }) {
    const hasil = await request('POST', 'auth/verify-otp', { body: { email, otpCode } });
    if (hasil?.access_token) simpanToken(hasil.access_token);
    return hasil;
  },

  async resendOtp(email) {
    const hasil = await request('POST', 'auth/resend-otp', { body: { email } });
    if (hasil?.kode_verifikasi) window.alert(`Kode verifikasi baru: ${hasil.kode_verifikasi}`);
    return { ok: true };
  },

  async resetPasswordRequest(email) {
    const hasil = await request('POST', 'auth/forgot-password', { body: { email } });
    if (hasil?.reset_token) {
      const tautan = `${window.location.href.split('#')[0]}#/reset-password?token=${hasil.reset_token}`;
      window.prompt('Versi lokal tidak mengirim email. Salin tautan atur ulang ini (berlaku 60 menit):', tautan);
    }
    return { ok: true };
  },

  resetPassword({ resetToken, newPassword }) {
    return request('POST', 'auth/reset-password', { body: { resetToken, newPassword } });
  },

  async logout() {
    simpanToken(null);
    return { ok: true };
  },

  redirectToLogin() {
    if (!window.location.hash.startsWith('#/login')) window.location.hash = '#/login';
  },

  loginWithProvider() {
    return Promise.reject(
      new ApiError('Masuk dengan Google butuh koneksi internet dan tidak tersedia di versi lokal. Gunakan email dan kata sandi.', 400)
    );
  },
};

export const api = {
  auth,
  users: {
    inviteUser: (email, role = 'user', password) => request('POST', 'users/invite', { body: { email, role, password } }),
    list: () => request('GET', 'users'),
  },
  app: {
    getPublicSettings: () => Promise.resolve({ id: 'lokal', public_settings: {} }),
  },
  entities: Object.fromEntries(Object.keys(NAMA_ENTITAS).map((n) => [n, new Entitas(n)])),
};

export default api;
