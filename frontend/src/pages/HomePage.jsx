import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Pill,
  Camera,
  Shield,
  Zap,
  ChevronRight,
  Sparkles,
  Heart,
  Users,
  Search,
  Clock,
  Award,
  AlertTriangle,
} from 'lucide-react';


const Button = ({ children, variant = 'primary', className = '' }) => {
  const baseClasses =
    'font-semibold py-4 px-8 rounded-xl transition-all duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-4 transform hover:scale-105 active:scale-95 relative overflow-hidden group text-base';

  const variants = {
    primary:
      'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-teal-300/30 focus:ring-teal-400/50',
    secondary:
      'bg-gradient-to-r from-gray-50 to-white hover:from-white hover:to-gray-50 text-gray-700 shadow-gray-300/30 focus:ring-gray-400/50 border border-gray-200 hover:border-gray-300',
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`}>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  );
};


const FloatingParticle = ({ delay = 0, duration = 6 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.3, 0],
      scale: [0, 1, 0],
      x: [0, Math.random() * 100 - 50],
      y: [0, Math.random() * -150],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 4,
    }}
    className="absolute w-1 h-1 bg-gradient-to-r from-teal-300 to-cyan-300 rounded-full"
  />
);


const SimpleWrapper = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);


const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <div className="group relative h-full">
    <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:bg-white/95 h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
      <div className="relative z-10 text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto transition-transform duration-300 hover:scale-110">
          <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="font-bold text-lg text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
      </div>
    </div>
  </div>
);


const StatCard = ({ icon: Icon, number, label, delay }) => (
  <ScrollReveal delay={delay} direction="scale">
    <motion.div
      whileHover={{
        scale: 1.08,
        y: -8,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      whileTap={{ scale: 0.95 }}
      className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-2xl transition-all duration-400 group"
    >
      <div className="text-center">
        <motion.div
          className="inline-flex p-3 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl mb-3 transition-transform duration-300"
          whileHover={{ scale: 1.2, rotate: 10 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        <div className="text-2xl font-bold text-gray-800 mb-1">{number}</div>
        <div className="text-gray-600 text-sm font-medium">{label}</div>
      </div>
    </motion.div>
  </ScrollReveal>
);

function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-white/0 relative overflow-hidden">
      {' '}
      
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
       
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-teal-200/20 to-cyan-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-200/20 to-teal-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-teal-200/15 to-cyan-200/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>

        
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute ${i % 2 === 0 ? 'top-1/4' : 'bottom-1/4'} ${i % 3 === 0 ? 'left-1/4' : 'right-1/4'}`}
          >
            <FloatingParticle delay={i * 0.4} />
          </div>
        ))}
      </div>
      <div className="relative z-10 container mx-auto px-6 py-12">

     
        <section className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-5xl mx-auto"
          >
            
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              <span className="block text-gray-800 mb-2">Foto Kemasan,</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
                Temukan Jawaban.
              </span>
            </motion.h1>

           
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              Aplikasi berbasis AI yang mampu mengenali dan memahami obat hanya
              melalui foto kemasan, guna mendukung penggunaan obat yang lebih
              aman dan mandiri.
            </motion.p>

            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <a href="/classify">
                <Button variant="primary">
                  <Camera className="w-5 h-5" />
                  Mulai Deteksi Obat Anda
                </Button>
              </a>
              <a href="/guide">
                <Button variant="secondary">
                  <Shield className="w-5 h-5" />
                  Panduan Penggunaan
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </section>

       
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Teknologi canggih yang memberikan solusi terbaik untuk kebutuhan
              informasi obat Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <FeatureCard
              icon={Camera}
              title="Deteksi Instan"
              description="Menggunakan computer vision untuk mengenali berbagai obat melalui foto kemasan, dengan tingkat akurasi yang terus ditingkatkan."
              delay={0.1}
            />
            <FeatureCard
              icon={Shield}
              title="Informasi Terpercaya"
              description="Dapatkan informasi detail mulai dari dosis, efek samping, hingga petunjuk penggunaan yang aman"
              delay={0.2}
            />
            <FeatureCard
              icon={Search}
              title="Database 143 Obat"
              description="Memiliki database sederhana dengan 143 obat, yang akan terus diperbarui dan diperluas."
              delay={0.3}
            />
          </div>
        </section>

      
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Cara Kerja
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Proses sederhana dalam 3 langkah mudah
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                title: 'Foto Kemasan',
                desc: 'Ambil foto kemasan obat dengan jelas dan pastikan tulisan terlihat',
                icon: Camera,
              },
              {
                step: '2',
                title: 'AI Processing',
                desc: 'Sistem AI memproses dan mengenali obat dalam hitungan detik',
                icon: Zap,
              },
              {
                step: '3',
                title: 'Dapatkan Info',
                desc: 'Terima informasi lengkap, akurat, dan mudah dipahami',
                icon: Shield,
              },
            ].map((item, index) => (
              <div key={index} className="group relative h-full">
                <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:bg-white/95 h-full text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                  <div className="relative z-10">
                    <div className="relative mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto transition-transform duration-300 hover:scale-110">
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {item.step}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-red-800 mb-4">
                  Disclaimer Penting
                </h3>
                <div className="space-y-3">
                  <p className="text-red-700 leading-relaxed font-medium text-lg">
                    <span className="font-bold text-red-800">
                      MediVize adalah alat bantu edukasi, bukan pengganti
                      konsultasi dengan dokter atau apoteker.
                    </span>
                  </p>
                  <p className="text-red-700 leading-relaxed">
                    Aplikasi ini menggunakan teknologi AI canggih untuk
                    memberikan informasi tentang obat-obatan. Meskipun akurat,
                    informasi yang diberikan tidak dapat menggantikan saran
                    medis profesional.
                  </p>
                  <p className="text-red-700 leading-relaxed">
                    <span className="font-semibold">
                      Selalu konsultasikan dengan tenaga medis profesional
                    </span>{' '}
                    untuk keputusan pengobatan yang tepat, terutama jika Anda
                    memiliki kondisi kesehatan khusus atau sedang mengonsumsi
                    obat lain.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
