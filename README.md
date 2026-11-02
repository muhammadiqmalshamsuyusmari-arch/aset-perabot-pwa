# Sistem Pengurusan Inventori Aset Perabot Kelas — SK Sungai Tiram

## Ciri baharu: lampu dan kipas

Bagi setiap kelas, rekodkan:
- Bilangan lampu dan bilangan lampu rosak
- Bilangan kipas dan bilangan kipas rosak
- Catatan/lokasi kerosakan (contoh: `Lampu 2 baris belakang tidak menyala; kipas 1 berbunyi kuat`)

Bilangan rosak tidak boleh melebihi jumlah unit. Data lama akan dibaca dengan nilai lampu/kipas 0 sehingga guru mengisi rekodnya. Laporan PDF menggunakan A4 Landscape dan turut memaparkan lajur lampu/kipas serta catatan.

## Pasang di GitHub Pages

1. Ekstrak ZIP.
2. Muat naik `index.html`, `manifest.json`, `service-worker.js` ke root repositori GitHub Pages.
3. Commit perubahan dan buka laman semula dengan `Ctrl+F5`.

## Google Sheets / Apps Script

`Code.gs` menggunakan Spreadsheet ID yang telah disediakan dan menulis pada helaian pertama (gid=0). Gantikan kod Apps Script sedia ada dengan fail `Code.gs` daripada pakej ini, Save, kemudian **Deploy → Manage deployments → Edit → New version → Deploy**. Pastikan Web App mempunyai akses yang sesuai untuk pengguna laman.

Pakej mengembangkan lajur inventori dengan `lamp`, `lampBad`, `fan`, `fanBad`. Simpanan baharu menulis kepala lajur baharu bersama data. Sebelum menguji simpanan kali pertama, buat salinan sandaran helaian Google Sheets anda. Laman masih menyimpan data secara setempat pada pelayar, dan butang simpan menghantar rekod ke Google Sheets apabila URL Web App disambungkan.

## Fail

- `index.html` — aplikasi
- `Code.gs` — backend Google Apps Script
- `manifest.json`, `service-worker.js` — sokongan PWA


### Kemas kini logo dan ringkasan lampu/kipas
Versi ini menggunakan logo rasmi SK Sungai Tiram daripada fail `logo.png`. Ringkasan di bahagian atas mengira jumlah lampu dan kipas seluruh kelas secara automatik daripada data setiap kelas. Pastikan `logo.png` turut dimuat naik ke repositori GitHub Pages.
