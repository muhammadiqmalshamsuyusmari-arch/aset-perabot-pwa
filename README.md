# Sistem Pengurusan Inventori Aset Perabot Kelas SK Sungai Tiram

## Fail dalam ZIP
- `index.html` — aplikasi inventori responsif, 42 kelas awal, carian/tapis, pengiraan automatik, tambah/edit/padam, susun semula dan eksport PDF A4 landskap.
- `manifest.json` dan `service-worker.js` — konfigurasi PWA. Cache telah dinaik taraf kepada v3.
- `Code.gs` — backend Google Apps Script. Fail ini mesti dipasang dalam projek Apps Script dan **bukan** dimuat naik sebagai halaman GitHub.

## Pembetulan isu simpanan Google Sheets
Versi ini tidak lagi bergantung pada `fetch()` biasa untuk membaca/menulis Google Apps Script kerana respons redirect/CORS boleh menyebabkan browser menyekat respons. Bacaan menggunakan JSONP, manakala simpanan menggunakan borang POST tersembunyi dan semakan status simpanan. Ia memberi mesej berjaya hanya selepas Apps Script melaporkan status berjaya.

## 1. Pasang backend Google Apps Script
Spreadsheet ID yang ditetapkan:
`19Rrh88OigPhzpgU_Smohj_xqq1dMvzm7Y73IQYTChLI`

1. Buka [Google Apps Script](https://script.google.com/) menggunakan akaun yang mempunyai akses edit kepada spreadsheet tersebut.
2. Buka projek Apps Script yang menghasilkan URL Web App semasa, atau cipta projek baharu.
3. Gantikan **semua kandungan `Code.gs`** dengan fail `Code.gs` daripada ZIP ini.
4. Tekan **Save**.
5. Pilih **Deploy → Manage deployments → Edit** (ikon pensel), pilih **New version**, kemudian tekan **Deploy**. Jika anda mencipta projek baharu, pilih **New deployment → Web app**.
6. Tetapkan **Execute as: Me**. Untuk akses, pilih pilihan yang dibenarkan oleh polisi Google Workspace/sekolah. Pengguna yang menggunakan laman GitHub perlu dibenarkan mencapai Web App; jangan dedahkan data sensitif melalui akses awam jika tidak dibenarkan.
7. Salin URL Web App yang berakhir dengan `/exec`. Jika URL deployment berubah, masukkan URL baharu melalui butang **Sambungan** dalam aplikasi.

URL yang sebelum ini diberikan:
`https://script.google.com/macros/s/AKfycbx7LmD0rEop5xH3-kFaCUd52DzZyktbcF5W58Qi-e0ulscvxZ4tp4gNGHt1z8e3hfM/exec`

## 2. Uji backend sebelum guna
Buka URL Web App dalam pelayar dan tambah `?action=ping` di hujungnya. Contohnya:
`URL_WEB_APP/exec?action=ping`

Sepatutnya terpapar JSON dengan `"ok":true`. Jika keluar halaman kebenaran, ralat akses, atau `Script function not found: doGet`, betulkan deployment dahulu. Pastikan deployment menggunakan versi kod terbaharu.

## 3. Muat naik ke GitHub Pages
1. Muat naik `index.html`, `manifest.json`, dan `service-worker.js` ke **root** repositori GitHub Pages.
2. `Code.gs` tidak perlu dimuat naik ke GitHub Pages; ia dipasang dalam Apps Script sahaja.
3. Commit perubahan dan tunggu GitHub Pages selesai diterbitkan.
4. Buka laman dengan HTTPS, kemudian tekan `Ctrl+F5` (Windows) untuk memaksa muat semula. Jika masih versi lama, tutup tab aplikasi atau kosongkan data/cache laman kerana PWA menyimpan fail lama.
5. Tekan **Sambungan**, masukkan URL Web App `/exec`, dan tekan OK.
6. Tekan **Muat Semula Google** untuk membaca data. Selepas mengubah inventori, tekan **Simpan ke Google Drive**. Tunggu mesej pengesahan berjaya.
7. Semak helaian pertama (`gid=0`, sepadan dengan URL CSV yang diberikan) dalam spreadsheet. Kod menulis pada helaian pertama (`gid=0`) yang sepadan dengan URL CSV anda. Kandungan helaian pertama akan diganti dengan rekod inventori; helaian lain tidak disentuh. Pastikan helaian pertama memang dikhaskan untuk inventori sebelum menekan simpan.

## Penting
- Aplikasi menyimpan salinan setempat dalam pelayar juga. Itu **bukan** bukti data sudah disimpan ke awan; gunakan butang simpan dan tunggu pengesahan berjaya.
- Jika butang simpan gagal, semak Apps Script → **Executions** untuk ralat, pastikan akaun yang menjalankan skrip mempunyai akses edit kepada spreadsheet, dan deploy semula sebagai **New version**.
- URL CSV yang diterbitkan (`output=csv`) hanya untuk bacaan dan tidak boleh menyimpan perubahan.
- Setiap simpanan menggantikan semua rekod pada helaian pertama (`gid=0`) dengan data yang sedang dipaparkan pada peranti. Jangan simpan data kosong jika mahu mengekalkan rekod sedia ada.
- Masukkan data sebenar sebelum laporan rasmi dikeluarkan. Lencana header ialah grafik sementara; gantikan dengan logo rasmi sekolah.
