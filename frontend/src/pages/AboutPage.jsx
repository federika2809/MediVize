import React from 'react';
import { motion } from 'framer-motion';

function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8 max-w-3xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Tentang MediVize</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Ringkasan Eksekutif</h2>
        <p className="text-gray-700 mb-4">
          MediVize adalah aplikasi berbasis kecerdasan buatan (AI) yang dirancang untuk membantu masyarakat dalam mengenali dan memahami obat melalui foto kemasan. Proyek ini mengatasi masalah kesalahan penggunaan obat akibat kemasan yang mirip dan kurangnya akses cepat ke informasi obat yang akurat. Aplikasi ini mengintegrasikan model CNN ringan untuk mengenali kemasan obat dari gambar dan menyajikan informasi komprehensif seperti nama generik, kegunaan, dosis, efek samping, dan cara penggunaan.
        </p>
        <p className="text-gray-700">
          Tujuan utama MediVize adalah meningkatkan keselamatan penggunaan obat, menyediakan akses cepat dan aman ke informasi obat, dan mendorong kemandirian masyarakat dalam memahami konsumsi obat yang tepat.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Bagaimana Proyek Ini Ditemukan?</h2>
        <p className="text-gray-700 mb-4">
          Proyek ini terinspirasi dari kebutuhan nyata di masyarakat, di mana banyak orang mengalami kesulitan dalam mengidentifikasi obat, terutama karena kemasan yang serupa. Melalui pendekatan design thinking, tim menemukan bahwa tidak hanya lansia, tetapi juga masyarakat umum termasuk anak muda dan orang dewasa aktif memerlukan solusi cepat dan akurat untuk mengenali obat dan memahami penggunaannya. MediVize dikembangkan sebagai solusi inklusif yang dapat digunakan oleh siapa saja.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Batasan Proyek</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Pengenalan obat hanya melalui foto kemasan, tidak mencakup bentuk fisik pil/tablet.</li>
          <li>Jumlah obat yang dapat dikenali terbatas pada sekitar 100 jenis dari dataset yang tersedia.</li>
          <li>Sistem ini tidak menggantikan konsultasi dengan dokter atau apoteker, melainkan hanya sebagai alat bantu.</li>
          <li>Tidak mencakup validasi keaslian obat secara kimiawi.</li>
          <li>Tidak terintegrasi dengan rekam medis elektronik atau sistem farmasi nasional.</li>
          <li>Informasi obat yang disajikan terbatas pada nama, kegunaan, dosis, efek samping, peringatan, dan cara pakai.</li>
        </ul>
        <p className="text-sm text-gray-500 mt-4">
          Kami berkomitmen untuk terus mengembangkan MediVize agar lebih akurat dan komprehensif di masa mendatang.
        </p>
      </div>
    </motion.div>
  );
}

export default AboutPage;