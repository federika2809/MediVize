import React, { useState, useEffect } from 'react';
import {
  Camera,
  Shield,
  Zap,
  ChevronRight,
  Search,
  AlertTriangle,
} from 'lucide-react';

const Button = ({ children, variant = 'primary', className = '' }) => {
  const baseClasses =
    'font-semibold py-4 px-8 rounded-xl transition-all duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-4 transform hover:scale-105 active:scale-95 relative overflow-hidden group text-base';

  const variants = {
    primary:
      'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-cyan-300/30 focus:ring-cyan-400/50',
    secondary:
      'bg-gradient-to-r from-gray-50 to-white hover:from-white hover:to-gray-50 text-gray-700 shadow-gray-300/30 focus:ring-gray-400/50 border border-gray-200 hover:border-gray-300',
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`}>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </span>
      <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  );
};

const FloatingParticle = ({ delay = 0, index }) => {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    opacity: 0,
    scale: 0,
  });

  useEffect(() => {
    const animate = () => {
      const startTime = Date.now() + delay * 1000;
      const duration = 6000;

      const update = () => {
        const elapsed = Date.now() - startTime;
        const progress = (elapsed % (duration + 4000)) / duration;

        if (progress >= 0 && progress <= 1) {
          const opacity =
            progress < 0.5 ? progress * 0.6 : (1 - progress) * 0.6;
          const scale = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
          const x =
            Math.sin(progress * Math.PI) * 50 + (Math.random() - 0.5) * 20;
          const y = -progress * 150;

          setPosition({ x, y, opacity, scale });
        } else {
          setPosition({ x: 0, y: 0, opacity: 0, scale: 0 });
        }

        requestAnimationFrame(update);
      };

      update();
    };

    animate();
  }, [delay]);

  return (
    <div
      className="absolute w-1 h-1 bg-gradient-to-r from-cyan-300 to-cyan-400 rounded-full transition-all duration-100"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) scale(${position.scale})`,
        opacity: position.opacity,
      }}
    />
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <div className="group relative h-full">
    <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:bg-white/95 h-full hover:border-gray-200/60">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/60 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
      <div className="relative z-10 text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto transition-transform duration-300 hover:scale-110 shadow-lg shadow-cyan-200/50">
          <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="font-bold text-lg text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
      </div>
    </div>
  </div>
);

function HomePage() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const particleArray = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: i * 0.4,
      position: {
        top: i % 2 === 0 ? '25%' : '75%',
        left: i % 3 === 0 ? '25%' : '75%',
      },
    }));
    setParticles(particleArray);
  }, []);

  return (
    <div className="">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
       
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute"
            style={{ top: particle.position.top, left: particle.position.left }}
          >
            <FloatingParticle delay={particle.delay} index={particle.id} />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="max-w-5xl mx-auto">
           <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight mt-[-20px]">
              <span className="block text-gray-800 mb-2">Foto Kemasan,</span>
              <span className="block text-gray-800 mb-2">Temukan Jawaban.</span>
              <span className="block bg-gradient-to-r from-cyan-600 to-cyan-500 bg-clip-text text-transparent mb-2"></span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Aplikasi berbasis AI yang mampu mengenali dan memahami obat hanya
              melalui foto kemasan, guna mendukung penggunaan obat yang lebih
              aman dan mandiri.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
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
            </div>
          </div>
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
              description="Menggunakan computer vision untuk mengenali berbagai obat melalui foto kemasan, dengan tingkat akurasi yang terus ditingkatkan"
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
              title="Database 150 Obat"
              description="Memiliki database sederhana dengan 150 obat, yang akan terus diperbarui dan diperluas"
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
                <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:bg-white/95 h-full text-center hover:border-gray-200/60">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/60 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                  <div className="relative z-10">
                    <div className="relative mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto transition-transform duration-300 hover:scale-110 shadow-lg shadow-cyan-200/50">
                        <item.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
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

        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-red-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-red-800 mb-4">
                  Peringatan Penting
                </h3>
                <div className="space-y-3">
                  <p className="text-red-700 leading-relaxed font-medium text-lg">
                    <span className="font-bold text-red-800">
                      MediVize adalah alat edukasi berbasis AI yang memberikan
                      informasi obat, namun bukan pengganti konsultasi dokter
                      atau apoteker.
                    </span>
                  </p>
                  <p className="text-red-700 leading-relaxed">
                    Selalu konsultasikan dengan tenaga medis untuk keputusan
                    pengobatan, terutama jika memiliki kondisi khusus atau
                    mengonsumsi obat lain.
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