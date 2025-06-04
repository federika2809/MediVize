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
                const predictedDrug =
                    result.data.drugName ||
                    result.data.name ||
                    result.data.predicted_class;

                if (predictedDrug) {
                    navigate(`/drug/${encodeURIComponent(predictedDrug)}`);
                } else {
                    setClassificationResult(result.data);
                }
            } else {
                setError(result.message || 'Terjadi kesalahan saat klasifikasi gambar.');
            }
        } catch (err) {
            setError(
                'Terjadi kesalahan saat klasifikasi. Silakan coba lagi. Pastikan gambar jelas dan kemasan obat terlihat penuh.'
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
            title: "Pencahayaan Ideal",
            desc: "Gunakan cahaya natural atau lampu terang, hindari bayangan dan silau berlebihan"
        },
        {
            icon: Search,
            title: "Fokus Sempurna",
            desc: "Pastikan gambar tajam dan teks pada kemasan dapat dibaca dengan jelas"
        },
        {
            icon: Shield,
            title: "Kualitas Tinggi",
            desc: "Gunakan resolusi tinggi dan pastikan kemasan tidak rusak atau sobek"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
            
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-10 w-32 h-32 bg-teal-100/30 rounded-full blur-2xl"></div>
                <div className="absolute bottom-20 left-10 w-32 h-32 bg-cyan-100/30 rounded-full blur-2xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="classification-page container relative z-10 py-12"
            >
                
                <div className="text-center mb-12">
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
                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl mb-6 shadow-lg"
                    >
                        <Camera className="h-10 w-10 text-white" />
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight"
                    >
                        Deteksi Obat dari Gambar
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                    >
                        Teknologi AI untuk mengidentifikasi obat dengan akurat dan dapatkan informasi lengkap tentang dosis, efek samping, dan petunjuk penggunaan.
                    </motion.p>
                </div>

                
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="mb-12"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                            Tips Foto yang Tepat
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Ikuti panduan ini untuk mendapatkan hasil deteksi yang optimal
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {tips.map((tip, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ 
                                    duration: 0.5, 
                                    delay: 0.8 + index * 0.1
                                }}
                                className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <tip.icon className="h-6 w-6 text-white" />
                                </div>
                                
                                <h3 className="font-bold text-lg text-gray-800 mb-3">
                                    {tip.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
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
                    className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden mb-12 max-w-4xl mx-auto"
                >
                    
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6">
                        <motion.h2 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="text-2xl font-bold text-white text-center flex items-center justify-center space-x-3"
                        >
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Upload className="h-6 w-6" />
                            </div>
                            <span>Mulai Deteksi Obat Anda</span>
                        </motion.h2>
                    </div>
                    
                    <div className="p-8">
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
                                className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-green-800 mb-1">Gambar Siap Diproses!</p>
                                        <p className="text-green-700 text-sm">
                                            {selectedImage.name} 
                                            <span className="ml-2 px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs">
                                                {Math.round(selectedImage.size / 1024)} KB
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl"
                            >
                                <div className="flex items-start space-x-3">
                                    <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-red-800 mb-1">Terjadi Kesalahan</p>
                                        <p className="text-red-700 text-sm">{error}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        
                        <div className="flex justify-center mt-8">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button 
                                    onClick={handleClassify} 
                                    disabled={loading}
                                    variant="primary"
                                    className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white transition-all duration-300 shadow-md hover:shadow-lg rounded-xl"
                                >
                                    <div className="flex items-center space-x-2">
                                        <Search className="h-5 w-5" />
                                        <span>Mulai Deteksi Sekarang</span>
                                    </div>
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                
                {loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="bg-white rounded-2xl p-10 shadow-lg max-w-md mx-auto border border-gray-200">
                            <div className="relative mb-6">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-teal-500 mx-auto"></div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Menganalisis Gambar</h3>
                            <p className="text-gray-600 mb-4">AI sedang memproses gambar Anda...</p>
                            
                            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    className="bg-gradient-to-r from-teal-500 to-cyan-600 h-2 rounded-full"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 3, ease: "easeInOut" }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

               
                {classificationResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-12"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-3">
                                Hasil Deteksi Berhasil
                            </h2>
                            <p className="text-gray-600">Berikut adalah informasi obat yang terdeteksi</p>
                        </div>
                        
                        <div className="max-w-3xl mx-auto">
                            <ClassificationResult
                                result={classificationResult}
                                onViewDetail={handleViewDetail}
                            />
                        </div>
                    </motion.div>
                )}

                {/* Simplified Not Found State */}
                {classificationResult === null && !loading && error.includes('tidak ditemukan') && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-12 max-w-3xl mx-auto"
                    >
                        <div className="bg-white rounded-2xl p-10 text-center shadow-lg border border-gray-200">
                            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Search className="h-8 w-8 text-white" />
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Obat Belum Terdeteksi</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Sistem belum dapat mengenali obat dari gambar yang diberikan. 
                                Mari coba lagi dengan foto yang lebih optimal.
                            </p>
                            
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 text-left">
                                <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                                    <Lightbulb className="h-4 w-4 mr-2" />
                                    Tips untuk Foto yang Lebih Baik
                               