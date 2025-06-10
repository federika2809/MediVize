import React from 'react';
import { Pill, Users, Shield, AlertCircle } from 'lucide-react';

function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white/0 py-12 px-4">
      <div className="max-w-4xl mx-auto">

       
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="bg-cyan-500 p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Pill className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 leading-tight">
            Tentang MediVize
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Revolusi dalam pengenalan obat melalui kecerdasan buatan
          </p>
        </div>

        <div className="relative mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-cyan-500 p-3 rounded-lg mr-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-black">
                Ringkasan Eksekutif
              </h2>
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                MediVize adalah aplikasi berbasis kecerdasan buatan (AI) yang dirancang untuk membantu masyarakat dalam mengenali dan memahami obat melalui foto kemasan. Proyek ini mengatasi masalah kesalahan penggunaan obat akibat kemasan yang mirip dan kurangnya akses cepat ke informasi obat yang akurat.
              </p>
              <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-cyan-400 hover:border-cyan-500 transition-colors duration-300">
                <p className="text-gray-700 leading-relaxed text-lg font-medium">
                  <strong>Tujuan utama MediVize adalah mencegah kesalahan medikasi dengan menyediakan identifikasi obat yang akurat dan instan, memberikan akses mudah ke informasi obat terpercaya, serta memberdayakan masyarakat untuk menggunakan obat dengan tepat dan aman.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

       
        <div className="relative mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-cyan-500 p-3 rounded-lg mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-black">
                Bagaimana Proyek Ini Ditemukan?
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              Proyek ini terinspirasi dari kebutuhan nyata di masyarakat, di mana banyak orang mengalami kesulitan dalam mengidentifikasi obat, terutama karena kemasan yang serupa. Melalui pendekatan design thinking, tim menemukan bahwa tidak hanya lansia, tetapi juga masyarakat umum termasuk anak muda dan orang dewasa aktif memerlukan solusi cepat dan akurat untuk mengenali obat dan memahami penggunaannya. MediVize dikembangkan sebagai solusi inklusif yang dapat digunakan oleh siapa saja.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="bg-cyan-500 p-3 rounded-lg mr-4">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-black">
                Batasan Proyek
              </h2>
            </div>
            <div className="space-y-4">
              {[
                "Pengenalan obat hanya melalui foto kemasan, tidak mencakup bentuk fisik pil/tablet.",
                "Jumlah obat yang dapat dikenali terbatas pada sekitar 150 jenis dari obat yang tersedia.",
                "Sistem ini tidak menggantikan konsultasi dengan dokter atau apoteker, melainkan hanya sebagai alat bantu.",
                "Tidak mencakup validasi keaslian obat secara kimiawi.",
                "Tidak terintegrasi dengan rekam medis elektronik atau sistem farmasi nasional.",
                "Informasi obat yang disajikan terbatas pada nama, kegunaan, dosis, efek samping, peringatan, dan cara pakai."
              ].map((limitation, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-300"
                >
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 text-lg leading-relaxed">{limitation}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-cyan-700 font-medium text-lg text-center">
              <strong>✨ Kami berkomitmen penuh untuk terus berinovasi dan mengembangkan MediVize dengan teknologi terdepan agar dapat mengenali lebih banyak jenis obat dengan akurasi yang semakin tinggi di masa mendatang.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;