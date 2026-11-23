// Menyatukan hasil build (JS + CSS) ke dalam dist/index.html
// sehingga file itu bisa dibuka langsung dari folder (file://) tanpa server.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const berkasHtml = path.join(dist, 'index.html');

if (!fs.existsSync(berkasHtml)) {
  console.error('dist/index.html tidak ditemukan. Jalankan "npm run build" dari folder proyek.');
  process.exit(1);
}

let html = fs.readFileSync(berkasHtml, 'utf8');
const baca = (rel) => fs.readFileSync(path.join(dist, rel.replace(/^\.?\//, '')), 'utf8');

// CSS
html = html.replace(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi, (tag) => {
  const m = tag.match(/href=["']([^"']+)["']/i);
  if (!m || /^https?:/i.test(m[1])) return tag;
  return `<style>\n${baca(m[1])}\n</style>`;
});

// Hapus modulepreload (sudah tidak perlu setelah JS disatukan)
html = html.replace(/<link\b[^>]*rel=["']modulepreload["'][^>]*>\s*/gi, '');

// JS: dipindah ke akhir <body> agar #root sudah ada saat dijalankan
let kodeJs = '';
html = html.replace(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>\s*/gi, (tag, src) => {
  if (/^https?:/i.test(src)) return tag;
  kodeJs += baca(src) + '\n';
  return '';
});
if (!kodeJs) {
  console.error('Skrip utama tidak ditemukan di dist/index.html.');
  process.exit(1);
}
kodeJs = kodeJs.replace(/<\/script/gi, '<\\/script');
html = html.replace('</body>', () => `<script type="module">\n${kodeJs}\n</script>\n</body>`);

fs.writeFileSync(berkasHtml, html);

// Hapus folder assets karena isinya sudah masuk ke index.html
const assets = path.join(dist, 'assets');
if (fs.existsSync(assets)) fs.rmSync(assets, { recursive: true, force: true });

const ukuran = (fs.statSync(berkasHtml).size / 1024 / 1024).toFixed(2);
console.log(`\nSelesai: dist/index.html (${ukuran} MB) bisa dibuka langsung dengan klik dua kali.`);
