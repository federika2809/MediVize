import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraInput from '../components/ui/CameraInput';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ClassificationResult from '../components/drug/ClassificationResult';
import { classifyDrugImage, searchDrugs } from '../services/drugService';
import { motion } from 'framer-motion';

function ClassificationPage() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [classificationResult, setClassificationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const navigate = useNavigate();

    const handleImageSelected = (file) => {
        setSelectedImage(file);
        setClassificationResult(null);
        setSearchResult(null);
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
                // Ambil nama obat dari hasil klasifikasi
                const predictedDrug =
                    result.data.drugName ||
                    result.data.name ||
                    result.data.predicted_class;

                if (predictedDrug) {
                    // ⬇️ Navigasi ke halaman detail obat jika tersedia
                    navigate(`/drug/${encodeURIComponent(predictedDrug)}`);
                } else {
                    // Jika nama obat tidak tersedia, tetap tampilkan hasil
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

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setError('Silakan masukkan nama obat untuk mencari.');
            setSearchResult(null);
            return;
        }

        setLoading(true);
        setError('');
        setClassificationResult(null);

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
                setError(`Obat dengan nama "${searchQuery}" tidak ditemukan dalam database.`);
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="classification-page container py-8"
        >
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
                Temukan Informasi Obat dengan Mudah
            </h1>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
                Ambil foto kemasan obat Anda, atau ketik nama obat untuk mendapatkan informasi penting seperti dosis, efek samping, dan petunjuk penggunaan.
            </p>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-white p-6 rounded-lg shadow-lg mb-8"
            >
                <h2 className="text-xl font-bold text-gray-800 mb-4">Deteksi Obat dari Gambar</h2>
                <CameraInput onImageSelected={handleImageSelected} />
                {selectedImage && (
                    <p className="text-center text-sm text-gray-500 mt-4">
                        Gambar terpilih: {selectedImage.name} ({Math.round(selectedImage.size / 1024)} KB)
                    </p>
                )}
                {error && <p className="text-red-600 text-center mt-4">{error}</p>}
                <div className="flex justify-center mt-6">
                    <Button onClick={handleClassify} disabled={loading} variant="primary">
                        {loading ? <LoadingSpinner /> : 'Mulai Deteksi'}
                    </Button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Atau Cari Obat Secara Manual</h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Contoh: Paracetamol, Ibuprofen..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button onClick={handleSearch} disabled={loading} variant="secondary">
                            {loading ? <LoadingSpinner /> : 'Cari'}
                        </Button>
                    </div>
                </div>
            </motion.div>

            {loading && (
                <div className="text-center mt-8">
                    <LoadingSpinner />
                    <p className="text-gray-600 mt-2">Sedang memproses...</p>
                </div>
            )}

            {(classificationResult || searchResult) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Hasil Informasi Obat</h2>
                    <ClassificationResult
                        result={classificationResult || searchResult}
                        onViewDetail={handleViewDetail}
                    />
                </motion.div>
            )}
        </motion.div>
    );
}

export default ClassificationPage;
