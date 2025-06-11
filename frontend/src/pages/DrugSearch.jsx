import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ClassificationResult from '../components/drug/ClassificationResult';
import { searchDrugs } from '../services/drugService';
import { motion } from 'framer-motion';

function DrugSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setError('Silakan masukkan nama obat untuk mencari.');
            setSearchResult(null);
            return;
        }

        setLoading(true);
        setError('');
        setSearchResult(null);

        try {
            const result = await searchDrugs(searchQuery);

            if (result.success && result.data.length > 0) {
                const foundDrug = result.data[0];
                setSearchResult({
                    drugName: foundDrug.name,
                    drugDetails: foundDrug,
                    description: foundDrug.purpose,
                    dosage: foundDrug.dosage,
                    sideEffects: foundDrug.sideEffects,
                    usage_instructions: foundDrug.howToUse,
                    warnings: foundDrug.warnings,
                });
            } else {
                setError(`Obat dengan nama "${searchQuery}" tidak ditemukan dalam daftar obat.`);
                setSearchResult(null);
            }
        } catch (err) {
            setError('Terjadi kesalahan saat mencari obat. Silakan coba lagi.');
            console.error('Search error:', err);
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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.3,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="drug-search-page container py-8 max-w-4xl mx-auto px-4"
            >
               
                <motion.div
                    variants={itemVariants}
                    className="text-center mb-8"
                >
                    <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-lg mb-6 shadow-lg"
                    >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-3xl md:text-4xl font-bold mb-4 text-gray-800"
                    >
                        Pencarian Informasi Obat
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                    >
                        Cari informasi lengkap tentang obat-obatan termasuk dosis, efek samping, dan petunjuk penggunaan
                    </motion.p>
                </motion.div>

               
                <motion.div
                    variants={itemVariants}
                    className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200 mb-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
                            </svg>
                        </div>
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Pencarian Obat</h2>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Masukkan nama obat (contoh: Acretin, Antopral, Anuva)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                            />
                        </div>
                        
                        <Button 
                            onClick={handleSearch} 
                            disabled={loading} 
                            variant="secondary"
                            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-base min-w-[120px] justify-center"
                        >
                            {loading ? (
                                <>
                                   
                                    
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <span>Cari</span>
                                </>
                            )}
                        </Button>
                    </div>
                    
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

               
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center mt-8"
                    >
                        <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200 inline-block">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-gray-200 border-t-cyan-500 rounded-full animate-spin" />
                                <div className="text-center">
                                    <p className="text-gray-800 font-semibold text-lg mb-1">
                                        Sedang mencari obat...
                                    </p>
                                    <p className="text-gray-600">Memproses pencarian dalam database</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

               
                {searchResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-8"
                    >
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-lg mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                Hasil Pencarian
                            </h2>
                            <p className="text-gray-600">
                                Informasi obat yang Anda cari telah ditemukan
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-md border border-gray-200">
                            <ClassificationResult
                                result={searchResult}
                                onViewDetail={handleViewDetail}
                            />
                        </div>
                    </motion.div>
                )}

               
                <motion.div
                    variants={itemVariants}
                    className="mt-12 grid md:grid-cols-3 gap-6"
                >
                    {[
                        {
                            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
                            title: "Database 150 Obat",
                            description: "Memiliki database sederhana dengan 150 obat, yang akan terus diperbarui dan diperluas."
                        },
                        {
                            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
                            title: "Informasi Aman",
                            description: "Data yang telah diverifikasi untuk memastikan keamanan dalam penggunaan obat"
                        },
                        {
                            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
                            title: "Akses Cepat",
                            description: "Pencarian yang responsif dan hasil yang ditampilkan dengan cepat dan mudah dipahami"
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {feature.icon}
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2 text-lg">{feature.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}

export default DrugSearch;