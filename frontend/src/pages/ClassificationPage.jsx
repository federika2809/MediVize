import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraInput from '../components/ui/CameraInput';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ClassificationResult from '../components/drug/ClassificationResult';
import { classifyDrugImage } from '../services/drugService';
import { motion } from 'framer-motion';
import { Camera, Upload, AlertCircle, CheckCircle, Lightbulb, Search, Image, Zap, Shield, Clock } from 'lucide-react';

function ClassificationPage() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [classificationResult, setClassificationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleImageSelected = (file) => {
        setSelectedImage(file);
        setClassificationResult(null);
        setError('');
    };

    const handleClassify = async () => {
        if (!selectedImage) {
            setError('Silakan pilih atau ambil gambar kemasan obat terlebih dahulu.');
            return;
        }

        setLoading(true);
        setError('');
        setClassificationResult(null);

        try {
            const result = await classifyDrugImage(selectedImage);

            if (result.success && result.data) {
                // Format hasil untuk konsistensi
                const resultData = {
                    ...result.data,
                    drugName: result.data.drugName || result.data.name || result.data.predicted_class,
                    confidence: result.data.confidence || result.data.probability,
                    imagePreview: URL.createObjectURL(selectedImage)
                };
                
                setClassificationResult(resultData);
            } else {
                setError(result.message || 'Terjadi kesalahan saat klasifikasi gambar.');
            }
        } catch (err) {
            setError(
                'Terjadi kesalahan saat klasifikasi. Pastikan gambar jelas dan kemasan obat terlihat lengkap.'
            );
            console.error('Classification error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (drugName) => {
        if (drugName) {
            navigate(`/drug/${encodeURIComponent(drugName)}`);
        } else {
            console.warn('Nama obat tidak tersedia untuk detail.');
        }
    };

    const tips = [
        {
            icon: Camera,
            title: "Posisi Optimal",
            desc: "Letakkan kemasan obat di tengah frame dengan jarak yang tepat untuk hasil terbaik"
        },
        {
            icon: Lightbulb,
            title: "Pencahayaan",
            desc: "Gunakan cahaya natural atau lampu terang, hindari bayangan dan silau berlebihan"
        },
        {
            icon: Search,
            title: "Fokus",
            desc: "Pastikan gambar tajam dan teks pada kemasan dapat dibaca dengan jelas"
        },
        {
            icon: Shield,
            title: "Kualitas Bagus",
            desc: "Gunakan gambar dengan resolusi yang jelas dan pastikan kemasannya tidak rusak"
        }
    ];

   
const AccuracyIndicator = ({ confidence }) => {
  
  const safeConfidence = isNaN(confidence) || confidence == null ? 0 : confidence;
  const percentage = Math.round(safeConfidence * 100);

  // Tentukan warna dan level berdasarkan tingkat akurasi
  let colorClass = '';
  let levelText = '';

  if (percentage >= 70) {
    colorClass = 'text-neutral-950 bg-green-400'; 
    
  } else if (percentage >=60) {
    colorClass = 'text-neutral-950 bg-yellow-400';
    
  } else {
    colorClass = 'text-neutral-950 bg-red-500';
    
  }

  return (
    <div className="mt-4">
      <h5 className="text-gray-700 font-semibold mb-2">Tingkat Akurasi</h5>
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${colorClass.replace('text', 'bg')}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${colorClass} whitespace-nowrap`}>
          {percentage}%
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-1">{levelText}</p>
    </div>
  );
};
 return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-10 w-32 h-32 bg-cyan-100/30 rounded-full blur-2xl"></div>
                <div className="absolute bottom-20 left-10 w-32 h-32 bg-cyan-200/30 rounded-full blur-2xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="classification-page container relative z-10 py-6 sm:py-12 px-4 sm:px-6"
            >
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-12">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                            duration: 0.6, 
                            delay: 0.2,
                            type: "spring",
                            stiffness: 200,
                            damping: 20
                        }}
                        className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-cyan-500 rounded-2xl mb-4 sm:mb-6 shadow-lg"
                    >
                        <Camera className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight"
                    >
                        Deteksi Obat dari Kemasan
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                    >
                        Unggah foto kemasan obat untuk mengidentifikasi dengan teknologi AI kami
                    </motion.p>
                </div>

                
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="mb-8 sm:mb-12"
                >
                    <div className="text-center mb-6 sm:mb-8">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
                            Tips Foto Kemasan Obat
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                            Ikuti panduan ini untuk hasil deteksi yang lebih akurat
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                        {tips.map((tip, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ 
                                    duration: 0.5, 
                                    delay: 0.8 + index * 0.1
                                }}
                                className="bg-white rounded-2xl p-4 sm:p-6 text-center border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-sm">
                                    <tip.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>
                                
                                <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-2 sm:mb-3">
                                    {tip.title}
                                </h3>
                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                    {tip.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden mb-8 sm:mb-12 max-w-4xl mx-auto"
                >
                    <div className="bg-cyan-500 p-4 sm:p-6">
                        <motion.h2 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="text-lg sm:text-2xl font-bold text-white text-center flex items-center justify-center space-x-2 sm:space-x-3"
                        >
                            <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
                                <Upload className="h-4 w-4 sm:h-6 sm:w-6" />
                            </div>
                            <span>Unggah Foto Kemasan Obat</span>
                        </motion.h2>
                    </div>
                    
                    <div className="p-4 sm:p-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                        >
                            <CameraInput onImageSelected={handleImageSelected} />
                        </motion.div>
                        
                        {selectedImage && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="mt-4 sm:mt-6 p-3 sm:p-4 bg-cyan-50 border border-cyan-200 rounded-xl"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-cyan-800 mb-1 text-sm sm:text-base">Gambar Siap Diproses!</p>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                            <p className="text-cyan-700 text-xs sm:text-sm truncate">
                                                {selectedImage.name}
                                            </p>
                                            <span className="self-start sm:self-auto px-2 py-1 bg-cyan-200 text-cyan-800 rounded-full text-xs whitespace-nowrap">
                                                {Math.round(selectedImage.size / 1024)} KB
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-100 border border-red-200 rounded-xl"
                            >
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-red-800 mb-1 text-sm sm:text-base">Terjadi Kesalahan</p>
                                        <p className="text-red-700 text-xs sm:text-sm">{error}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="flex justify-center mt-6 sm:mt-8">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full sm:w-auto"
                            >
                                <Button 
                                    onClick={handleClassify} 
                                    disabled={loading || !selectedImage}
                                    variant="primary"
                                    className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold !bg-cyan-500 hover:!bg-cyan-600 !text-white transition-all duration-300 shadow-md hover:shadow-lg rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="flex items-center justify-center space-x-2">
                                        <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                                        <span>{loading ? 'Memproses...' : 'Deteksi Sekarang'}</span>
                                    </div>
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8 sm:mb-12"
                    >
                        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-lg max-w-md mx-auto border border-gray-200">
                            <div className="relative mb-4 sm:mb-6">
                                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-gray-200 border-t-cyan-500 mx-auto"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Image className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-500" />
                                </div>
                            </div>
                            
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Menganalisis Kemasan Obat</h3>
                           
                            
                            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    className="bg-cyan-500 h-2 rounded-full"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 3, ease: "easeInOut" }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Results Section */}
                {classificationResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-8 sm:mt-12"
                    >
                        <div className="text-center mb-6 sm:mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ 
                                    duration: 0.5, 
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20
                                }}
                                className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 !bg-cyan-500 rounded-full mb-3 sm:mb-4 shadow-lg"
                            >
                                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                            </motion.div>
                            
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
                                Hasil Deteksi Obat
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600">Berikut hasil identifikasi kemasan obat Anda</p>
                        </div>
                        
                        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
                            <div className="flex flex-col lg:flex-row">
                                {/* Image Preview */}
                                <div className="lg:w-1/2 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
                                    <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-3 sm:mb-4 flex items-center">
                                        <Image className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-cyan-500" />
                                        Foto Kemasan Anda
                                    </h3>
                                    <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                                        {classificationResult.imagePreview && (
                                            <img 
                                                src={classificationResult.imagePreview} 
                                                alt="Kemasan obat yang diupload"
                                                className="object-contain w-full h-full p-2 sm:p-4"
                                            />
                                        )}
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center">
                                        Pastikan hasil cocok dengan kemasan asli
                                    </p>
                                </div>
                                
                                
                                <div className="lg:w-1/2 p-4 sm:p-6">
                                    <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-3 sm:mb-4 flex items-center">
                                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500" />
                                        Hasil Identifikasi
                                    </h3>
                                    
                                   <div className="space-y-4">
    <div>
        <h4 className="text-xs sm:text-sm font-semibold text-gray-500">Nama Obat</h4>
        <p className="text-sm sm:text-base font-bold text-gray-800">
            {classificationResult.drugName || 'Tidak diketahui'}
        </p>
    </div>
    
    <div>

                                            
                                            <AccuracyIndicator confidence={classificationResult.confidence} />
                                            <p className="text-xs sm:text-sm text-gray-500 mt-2">
                                                {classificationResult.confidence >= 0.7 
                                                    ? "Tingkat Akurasi tinggi - kemasan teridentifikasi dengan baik"
                                                    : classificationResult.confidence >= 0.6
                                                    ? "Tingkat Akurasi  sedang - kemasan mungkin teridentifikasi"
                                                    : "Tingkat Akurasi  rendah - kemasan tidak jelas"}
                                            </p>
                                        </div>
                                        
                                       
                                    </div>
                                    
                                    <div className="mt-6 sm:mt-8 flex flex-col space-y-3">
                                        <Button 
                                            onClick={() => handleViewDetail(classificationResult.drugName)}
                                            variant="primary"
                                            className="w-full py-2.5 sm:py-3 !bg-cyan-600 hover:!bg-cyan-700 text-sm sm:text-base"
                                        >
                                            Lihat Detail Obat
                                        </Button>
                                        <Button 
                                            onClick={() => {
                                                setSelectedImage(null);
                                                setClassificationResult(null);
                                            }}
                                            variant="outline"
                                            className="w-full py-2.5 sm:py-3 border-cyan-500 text-cyan-500 hover:bg-cyan-50 text-sm sm:text-base"
                                        >
                                            Deteksi Obat Lain
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

               
                {classificationResult === null && !loading && error.includes('tidak ditemukan') && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 sm:mt-12 max-w-3xl mx-auto"
                    >
                        <div className="bg-white rounded-2xl p-6 sm:p-10 text-center shadow-lg border border-gray-200">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-sm">
                                <Search className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                            </div>
                            
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Kemasan Obat Tidak Dikenali</h3>
                            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                                Sistem kami belum dapat mengenali kemasan obat dari gambar yang diberikan. 
                                Pastikan foto memenuhi kriteria berikut:
                            </p>
                            
                            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 text-left">
                                <h4 className="font-bold text-cyan-800 mb-3 flex items-center text-sm sm:text-base">
                                    <Lightbulb className="h-4 w-4 mr-2" />
                                    Kriteria Foto Kemasan yang Baik
                                </h4>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-cyan-500 mr-2">•</span>
                                        <span className="text-cyan-700 text-xs sm:text-sm">Nama obat terlihat jelas</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-cyan-500 mr-2">•</span>
                                        <span className="text-cyan-700 text-xs sm:text-sm">Seluruh kemasan masuk dalam frame</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-cyan-500 mr-2">•</span>
                                        <span className="text-cyan-700 text-xs sm:text-sm">Tidak ada bayangan atau silau</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-cyan-500 mr-2">•</span>
                                        <span className="text-cyan-700 text-xs sm:text-sm">Resolusi gambar cukup tinggi</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                className="inline-block"
                            >
                                <Button 
                                    onClick={() => {
                                        setSelectedImage(null);
                                        setError('');
                                    }}
                                    variant="primary"
                                    className="!bg-cyan-500 hover:!bg-cyan-600 text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3"
                                >
                                    <Camera className="h-4 w-4 mr-2" />
                                    Ambil Foto Baru
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

export default ClassificationPage;