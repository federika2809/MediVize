import React from 'react';
import { motion } from 'framer-motion'; 

function GuidePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8 max-w-3xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Panduan Penggunaan MediVize</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">1. Klasifikasi Obat dari Foto</h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700">
          <li>Buka halaman "Klasifikasi" dari navigasi utama.</li>
          <li>Pilih opsi "Ambil Foto" untuk menggunakan kamera perangkat Anda, atau "Unggah Gambar" untuk memilih gambar dari galeri.</li>
          <li>Pastikan kemasan obat terlihat jelas dan tidak buram dalam foto.</li>
          <li>Klik tombol "Klasifikasikan Obat".</li>
          <li>Sistem akan memproses gambar dan menampilkan nama obat yang dikenali beserta tingkat keyakinan (confidence score).</li>
          <li>Jika tersedia, Anda bisa melihat detail lengkap obat dengan mengklik tombol "Lihat Detail Obat".</li>
        </ol>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">2. Pencarian Obat Berbasis Teks</h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700">
          <li>Pada halaman "Klasifikasi", temukan bagian "Pencarian Obat Berbasis Teks".</li>
          <li>Masukkan nama obat atau kategori obat (misalnya, "Paracetamol", "antibiotik") di kolom pencarian.</li>
          <li>Tekan Enter atau klik tombol "Cari".</li>
          <li>Hasil pencarian akan ditampilkan dalam daftar, dan Anda bisa melihat detail masing-masing obat.</li>
        </ol>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">3. Memahami Informasi Obat</h2>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li><span className="font-semibold">Nama Generik:</span> Nama zat aktif yang terkandung dalam obat.</li>
          <li><span className="font-semibold">Kegunaan:</span> Untuk apa obat tersebut diresepkan atau digunakan.</li>
          <li><span className="font-semibold">Dosis:</span> Informasi tentang berapa banyak dan seberapa sering obat harus dikonsumsi.</li>
          <li><span className="font-semibold">Efek Samping:</span> Potensi reaksi yang tidak diinginkan dari obat.</li>
          <li><span className="font-semibold">Peringatan Penting:</span> Kondisi atau situasi di mana obat harus digunakan dengan hati-hati atau dihindari.</li>
          <li><span className="font-semibold">Cara Penggunaan:</span> Instruksi langkah demi langkah tentang cara mengonsumsi atau menggunakan obat.</li>
        </ul>
        <p className="text-sm text-red-600 mt-4">
          **Penting:** Informasi yang disediakan MediVize adalah sebagai alat bantu edukasi. Selalu konsultasikan dengan dokter atau apoteker untuk nasihat medis profesional.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">4. Riwayat Pencarian</h2>
        <p className="text-gray-700 mb-4">
          Untuk pengguna yang terdaftar dan masuk, MediVize menyimpan riwayat semua obat yang pernah Anda identifikasi. Anda bisa mengaksesnya di halaman "Riwayat" untuk melihat kembali informasi obat yang telah dicari.
        </p>
        <p className="text-gray-700">
          Fitur ini membantu Anda mengingat obat-obatan yang pernah Anda periksa dan memudahkan akses ke informasinya di kemudian hari.
        </p>
      </div>
    </motion.div>
  );
}

export default GuidePage;