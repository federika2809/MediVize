import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Camera, Search, FileText, Clock, AlertTriangle, BookOpen, Pill, Info } from 'lucide-react';

function GuidePage() {
  const [expandedSection, setExpandedSection] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const sections = [
    {
      title: "Klasifikasi Obat dari Foto",
      icon: <Camera className="w-6 h-6" />,
      color: "bg-gradient-to-r from-teal-500 to-teal-600",
      steps: [
        "Buka halaman \"Klasifikasi\" dari navigasi utama.",
        "Pilih opsi \"Ambil Foto\" untuk menggunakan kamera perangkat Anda, atau \"Unggah Gambar\" untuk memilih gambar dari galeri.",
        "Pastikan kemasan obat terlihat jelas dan tidak buram dalam foto.",
        "Klik tombol \"Klasifikasikan Obat\".",
        "Sistem akan memproses gambar dan menampilkan nama obat yang dikenali.",
        "Jika tersedia, Anda bisa melihat detail lengkap obat dengan mengklik tombol \"Lihat Detail Obat\"."
      ]
    },
    {
      title: "Pencarian Obat Berbasis Teks",
      icon: <Search className="w-6 h-6" />,
      color: "bg-gradient-to-r from-teal-600 to-cyan-600",
      steps: [
        "Pada halaman \"Cari Obat\", temukan bagian \"Pencarian Informasi Obat\".",
        "Masukkan nama obat atau kategori obat (misalnya, \"Acretin\", \"Adol\") di kolom pencarian.",
        "Tekan Enter atau klik tombol \"Cari\".",
        "Selanjutnya, tekan atau klik \"Lihat Detai Obat\".",
        "Hasil pencarian akan ditampilkan dalam daftar, dan Anda bisa melihat detail masing-masing obat."
      ]
    },
    {
      title: "Memahami Informasi Obat",
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-gradient-to-r from-cyan-500 to-teal-500",
      info: [
        { label: "Kegunaan", desc: "Untuk apa obat tersebut diresepkan atau digunakan.", icon: <Info className="w-4 h-4" /> },
        { label: "Dosis", desc: "Informasi tentang berapa banyak dan seberapa sering obat harus dikonsumsi.", icon: <FileText className="w-4 h-4" /> },
        { label: "Efek Samping", desc: "Potensi reaksi yang tidak diinginkan dari obat.", icon: <AlertTriangle className="w-4 h-4" /> },
        { label: "Peringatan Penting", desc: "Kondisi atau situasi di mana obat harus digunakan dengan hati-hati atau dihindari.", icon: <AlertTriangle className="w-4 h-4" /> },
        { label: "Cara Penggunaan", desc: "Instruksi langkah demi langkah tentang cara mengonsumsi atau menggunakan obat.", icon: <BookOpen className="w-4 h-4" /> }
      ]
    },
   
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:py-12">
      <div className={`max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
       
        <div className="text-center mb-12 sm:mb-16">
          <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mb-4 sm:mb-6 shadow-lg transition-all duration-700 delay-200 ${isVisible ? 'scale-100' : 'scale-0'}`}>
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-3 sm:mb-4 px-4 leading-tight transition-all duration-800 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            Panduan Lengkap MediVize<br className="sm:hidden" />
            
          </h1>
          
          <p className={`text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed transition-all duration-800 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            Pelajari cara menggunakan semua fitur MediVize untuk mengidentifikasi dan mendapatkan informasi obat dengan mudah dan akurat
          </p>
        </div>

        
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${800 + index * 200}ms` }}
            >
              <div
                className="cursor-pointer"
                onClick={() => toggleSection(index)}
              >
                <div className={`${section.color} p-4 sm:p-6 text-white relative overflow-hidden`}>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm flex-shrink-0">
                        {section.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight break-words">
                          <span className="block sm:inline">{index + 1}. </span>
                          <span className="block sm:inline">{section.title}</span>
                        </h2>
                      </div>
                    </div>
                    <div className={`transform transition-transform duration-300 flex-shrink-0 ml-2 ${expandedSection === index ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>
                </div>
              </div>

              
              <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  expandedSection === index 
                    ? 'max-h-screen opacity-100 py-6 sm:py-8' 
                    : 'max-h-0 opacity-0 py-0'
                }`}
              >
                <div className="px-4 sm:px-8">
                  {section.steps && (
                    <div className="space-y-4">
                      {section.steps.map((step, stepIndex) => (
                        <div
                          key={stepIndex}
                          className={`flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-teal-50 transition-all duration-200 ${
                            expandedSection === index 
                              ? 'opacity-100 translate-x-0' 
                              : 'opacity-0 -translate-x-5'
                          }`}
                          style={{ transitionDelay: `${stepIndex * 100}ms` }}
                        >
                          <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                            {stepIndex + 1}
                          </div>
                          <p className="text-gray-700 leading-relaxed text-sm sm:text-base font-medium">{step}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.info && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {section.info.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className={`p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-teal-50 transition-all duration-300 ${
                            expandedSection === index 
                              ? 'opacity-100 translate-y-0' 
                              : 'opacity-0 translate-y-5'
                          }`}
                          style={{ transitionDelay: `${itemIndex * 100}ms` }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 p-2 bg-teal-100 text-teal-600 rounded-lg">
                              {item.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">{item.label}</h4>
                              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-medium">{item.desc}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.description && (
                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed text-base sm:text-lg font-medium">{section.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        
        <div className={`mt-8 sm:mt-12 p-4 sm:p-6 md:p-8 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl shadow-lg transition-all duration-800 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="flex-shrink-0 p-2 sm:p-3 bg-red-100 text-red-600 rounded-full">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-red-800 mb-2">Peringatan Penting</h3>
              <p className="text-red-700 leading-relaxed text-sm sm:text-base font-medium">
                Informasi yang disediakan MediVize adalah sebagai alat bantu edukasi dan referensi. 
                Selalu konsultasikan dengan dokter, apoteker, atau tenaga kesehatan profesional 
                untuk nasihat medis yang akurat dan sesuai dengan kondisi Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuidePage;