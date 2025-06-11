import React from 'react';
import { Pill, AlertTriangle, Info, Clock, User, Shield } from 'lucide-react';

const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.6s ease-out forwards;
  }
`;

function DrugInfoCard({ drug }) {
  // Sample data for demonstration
  const sampleDrug = {
    name: "Paracetamol",
    genericName: "Acetaminophen",
    purpose: "Obat ini digunakan untuk meredakan nyeri ringan hingga sedang seperti sakit kepala, sakit gigi, nyeri otot, dan menurunkan demam.",
    dosage: "Dewasa: 500-1000mg setiap 4-6 jam, maksimal 4000mg per hari. Anak-anak: sesuai berat badan, konsultasikan dengan dokter.",
    sideEffects: [
      "Mual dan muntah ringan",
      "Sakit perut",
      "Reaksi alergi (jarang terjadi)",
      "Gangguan fungsi hati jika overdosis"
    ],
    warnings: "Jangan melebihi dosis yang dianjurkan. Hindari penggunaan bersamaan dengan alkohol. Konsultasikan dengan dokter jika memiliki penyakit hati.",
    howToUse: "Diminum setelah makan dengan segelas air putih. Jangan dikunyah, telan utuh. Ikuti petunjuk dokter atau yang tertera pada kemasan."
  };

  const displayDrug = drug || sampleDrug;

  return (
    <>
      <style>{styles}</style>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {!displayDrug ? (
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-gradient-to-br from-slate-50 to-cyan-50 rounded-3xl shadow-lg border border-slate-200 transition-all duration-500 hover:shadow-xl">
            <div className="animate-pulse">
              <Pill className="w-16 h-16 text-slate-300 mb-4" />
            </div>
            <p className="text-center text-slate-500 text-lg font-medium">Data obat tidak ditemukan.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-200 transition-all duration-500 hover:shadow-2xl animate-fade-in">
           
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm border border-white/20 transition-all duration-300 hover:bg-white/30 hover:scale-105">
                    <Pill className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-2 transition-all duration-300">{displayDrug.name}</h2>
                    <div className="flex items-center gap-2 text-white/90">
                      
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full blur-lg"></div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 transition-all duration-300 hover:shadow-md hover:border-slate-200 group">
                <div className="flex items-start gap-4">
                  <div className="bg-cyan-100 p-3 rounded-xl transition-all duration-300 group-hover:bg-cyan-200 group-hover:scale-105">
                    <Info className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-700 mb-3 transition-colors duration-300">
                      Kegunaan
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-base sm:text-lg transition-all duration-300">{displayDrug.purpose}</p>
                  </div>
                </div>
              </div>

            
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 transition-all duration-300 hover:shadow-md hover:border-slate-200 group">
                <div className="flex items-start gap-4">
                  <div className="bg-cyan-100 p-3 rounded-xl transition-all duration-300 group-hover:bg-cyan-200 group-hover:scale-105">
                    <Clock className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-700 mb-3 transition-colors duration-300">Dosis</h3>
                    <p className="text-slate-600 leading-relaxed text-base sm:text-lg transition-all duration-300">{displayDrug.dosage}</p>
                  </div>
                </div>
              </div>

             
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 transition-all duration-300 hover:shadow-md hover:border-slate-200 group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-cyan-100 p-3 rounded-xl transition-all duration-300 group-hover:bg-cyan-200 group-hover:scale-105">
                    <User className="w-6 h-6 text-cyan-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-700 transition-colors duration-300">Efek Samping</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 backdrop-blur-sm">
                  <ul className="space-y-3">
                    {displayDrug.sideEffects && displayDrug.sideEffects.map((effect, index) => (
                      <li key={index} className="flex items-start gap-3 text-slate-600 animate-fade-in" style={{animationDelay: `${index * 100}ms`}}>
                        <div className="w-2 h-2 bg-cyan-500 rounded-full mt-3 flex-shrink-0 transition-all duration-300 hover:bg-cyan-600"></div>
                        <span className="text-base sm:text-lg leading-relaxed">{effect}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100 transition-all duration-300 hover:shadow-md hover:border-red-200 group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-red-100 p-3 rounded-xl transition-all duration-300 group-hover:bg-red-200 group-hover:scale-105">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-700 transition-colors duration-300">Peringatan Penting</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border-l-4 border-red-300 backdrop-blur-sm">
                  <p className="text-red-700 font-medium text-base sm:text-lg leading-relaxed animate-fade-in">
                    {displayDrug.warnings || 'Tidak ada peringatan khusus.'}
                  </p>
                </div>
              </div>

             
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 transition-all duration-300 hover:shadow-md hover:border-slate-200 group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-cyan-100 p-3 rounded-xl transition-all duration-300 group-hover:bg-cyan-200 group-hover:scale-105">
                    <Shield className="w-6 h-6 text-cyan-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-700 transition-colors duration-300">Cara Penggunaan</h3>
                </div>
                <div className="bg-white p-4 rounded-xl backdrop-blur-sm border border-slate-100">
                  <p className="text-slate-600 leading-relaxed text-base sm:text-lg animate-fade-in">{displayDrug.howToUse}</p>
                </div>
              </div>
            </div>

           
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 sm:px-8 py-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              <div className="relative z-10 flex items-center justify-center gap-2 text-white">
                <span className="text-lg">⚠️</span>
                <p className="font-medium text-sm sm:text-base">Selalu konsultasikan dengan dokter atau apoteker sebelum menggunakan obat ini</p>
              </div>
            
              <div className="absolute -top-2 -right-4 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
              <div className="absolute -bottom-2 -left-4 w-12 h-12 bg-white/5 rounded-full blur-md"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default DrugInfoCard;