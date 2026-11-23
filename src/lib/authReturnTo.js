// Dipakai halaman Login dan Register. Aplikasi memakai alamat berbasis "#"
// supaya bisa dibuka langsung dari file index.html, jadi parameter seperti
// ?returnTo= dan ?peran= berada di dalam bagian hash: #/login?returnTo=/kasir

export function parameterHalaman() {
  const hash = window.location.hash || "";
  const i = hash.indexOf("?");
  return new URLSearchParams(i >= 0 ? hash.slice(i + 1) : "");
}

// Ambil ?returnTo= sebagai jalur internal yang aman, selain itu "/".
// Hanya satu garis miring di depan yang diizinkan (tanpa "//" atau "\\").
export function safeReturnTo() {
  const raw = parameterHalaman().get("returnTo");
  if (!raw) return "/";
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return "/";
  return raw;
}

// Pindah halaman lalu muat ulang supaya status login terbaca ulang.
export function bukaHalaman(jalur) {
  window.location.hash = "#" + jalur;
  window.location.reload();
}
