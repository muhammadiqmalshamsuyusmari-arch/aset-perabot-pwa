# Sistem Pengurusan Aset Perabot Kelas SK Sungai Tiram

## Fail dalam pakej
- `index.html` — aplikasi web responsif, carian/tapis, 42 kelas awal, pengiraan automatik, tambah/edit/padam, susun semula dan eksport PDF A4 landskap.
- `manifest.json` dan `service-worker.js` — konfigurasi asas PWA.
- `Code.gs` — Google Apps Script backend yang telah diisi dengan Spreadsheet ID yang diberikan.

## Sambungan Google Sheets
URL Web App lalai telah dimasukkan dalam aplikasi:
`https://script.google.com/macros/s/AKfycbx7LmD0rEop5xH3-kFaCUd52DzZyktbcF5W58Qi-e0ulscvxZ4tp4gNGHt1z8e3hfM/exec`

1. Buka projek Apps Script yang menghasilkan URL `/exec` di atas.
2. Gantikan kod lama dengan kandungan fail `Code.gs` ini. Spreadsheet ID telah ditetapkan kepada `19Rrh88OigPhzpgU_Smohj_xqq1dMvzm7Y73IQYTChLI`.
3. Simpan, kemudian pilih **Deploy > Manage deployments > Edit** (ikon pensel), pilih **New version**, kemudian **Deploy**. Jika ini projek baharu, pilih **New deployment > Web app**; jalankan sebagai akaun anda dan pilih akses yang dibenarkan oleh polisi sekolah.
4. Uji URL deployment dengan menambah `?action=ping`. Sepatutnya dipulangkan JSON yang mengandungi `"ok":true`.
5. Buka aplikasi melalui HTTPS, tekan **Segerak Google**. Untuk memuat data sedia ada, aplikasi akan cuba membaca endpoint `?action=load` semasa dibuka.

Apps Script menyimpan data dalam tab khusus bernama `Inventori` dalam spreadsheet ID tersebut. Tab ini dicipta secara automatik jika belum wujud. Kandungan tab `Inventori` akan diganti apabila menekan simpan/segerak; tab lain tidak disentuh.

## Tentang URL CSV yang diberikan
URL `.../pub?...output=csv` ialah suapan bacaan sahaja dan tidak boleh digunakan untuk menyimpan perubahan. Aplikasi menggunakan URL Apps Script untuk baca/tulis. Jika CSV yang diterbitkan itu datang daripada tab lain atau spreadsheet lain, ia tidak akan diselaraskan secara automatik dengan tab `Inventori` melainkan anda menyesuaikan sumbernya.

## Penting: semak deployment dan akses
Saya tidak boleh mengesahkan keadaan deployment atau kebenaran Google Sheet hanya berdasarkan URL. Jika URL sedia ada tidak menggunakan kod yang baharu, kod perlu dikemas kini dan dideploy sebagai versi baharu. Jika polisi Google Workspace mengehadkan akses luar, rujuk pentadbir ICT sekolah. Jangan benarkan akses awam jika tidak sesuai untuk dasar sekolah.

## Hosting/PWA
PWA memerlukan hosting HTTPS. Muat naik `index.html`, `manifest.json` dan `service-worker.js` bersama-sama ke hosting statik seperti GitHub Pages atau Firebase Hosting. Buka URL pada Chrome Android untuk memasang aplikasi; pada iPhone/iPad, buka dalam Safari dan pilih **Share > Add to Home Screen**. Fon dan pustaka PDF menggunakan CDN, jadi fungsi tersebut memerlukan internet.

## Nota
- 42 kelas awal dibina sebagai 6 tahun × 7 nama kelas: UMP, UMS, UMT, UTP, UTM, UKM, UPM.
- Bilangan murid dan aset bermula dengan sifar. Masukkan data sebenar sebelum laporan rasmi dikeluarkan.
- Lencana dalam header ialah grafik ringkas sementara; gantikan dengan logo rasmi sekolah sebelum penerbitan rasmi.
