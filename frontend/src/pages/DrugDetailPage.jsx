import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDrugByName, debugDrugSearch } from '../services/drugService';
import DrugInfoCard from '../components/drug/DrugInfoCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { AlertTriangle, Search, ArrowLeft, RefreshCw, Home, Camera, Info } from 'lucide-react';

function DrugDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [drug, setDrug] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [debugInfo, setDebugInfo] = useState(null);

    useEffect(() => {
        const fetchDrugDetails = async () => {
            if (!id) {
                console.error('URL parameter "id" (nama obat) is undefined or empty.');
                setError('Nama obat tidak valid atau tidak ditemukan di URL. Kembali ke halaman utama.');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');

            try {
                const decodedDrugName = decodeURIComponent(id);

                console.log('=== DRUG DETAIL PAGE DEBUG ===');
                console.log('Raw param (id from URL):', id);
                console.log('Decoded Drug Name for Search:', decodedDrugName);

                const searchName = decodedDrugName;
                const debugResult = await debugDrugSearch(searchName);
                setDebugInfo(debugResult);

                const result = await getDrugByName(searchName);

                if (result.success && result.data) {
                    setDrug(result.data);
                } else {
                    setError(result.message || `Obat "${searchName}" tidak ditemukan dalam database.`);
                }
            } catch (err) {
                console.error('Error fetching drug details:', err);
                setError('Terjadi kesalahan saat mengambil data obat: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDrugDetails();
    }, [id]);

    const handleGoBack = () => navigate(-1);
    const handleGoHome = () => navigate('/');
    const handleGoToClassify = () => navigate('/classify');
    const handleTryAgain = async () => {
        setLoading(true);
        setError('');

        try {
            if (!id) {
                setError('Tidak ada nama obat yang valid untuk dicoba lagi.');
                setLoading(false);
                return;
            }
            const decodedDrugName = decodeURIComponent(id);
            const result = await getDrugByName(decodedDrugName);

            if (result.success && result.data) {
                setDrug(result.data);
            } else {
                setError(result.message || 'Obat tidak ditemukan dalam database.');
            }
        } catch (err) {
            setError('Terjadi kesalahan saat mengambil data obat.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-md w-full text-center">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-gray-200 border-t-cyan-500 mx-auto mb-4"></div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Mencari Informasi Obat</h3>
                    <p className="text-sm sm:text-base text-gray-600">Mohon tunggu sebentar...</p>
                </div>
            </div>
        );
    }

    if (error) {
        const drugName = id ? decodeURIComponent(id) : 'Obat yang dicari';

        return (
            <div className="min-h-screen bg-gray-50 px-3 sm:px-4 py-4 sm:py-6 md:py-8">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={handleGoBack}
                        className="mb-4 sm:mb-6 flex items-center gap-2 text-cyan-600 hover:text-cyan-700 transition-colors font-medium group"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm sm:text-base">Kembali</span>
                    </button>

                    <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden">
                        <div className="bg-cyan-600 p-4 sm:p-6 lg:p-8 text-center">
                            <div className="mb-2 sm:mb-3 lg:mb-4">
                                <AlertTriangle className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-red-500 mx-auto" />
                            </div>
                            <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-2">
                                Obat Tidak Ditemukan
                            </h1>
                            <p className="text-cyan-100 text-xs sm:text-sm lg:text-base opacity-90">
                                Informasi obat yang Anda cari belum tersedia
                            </p>
                        </div>

                        <div className="p-4 sm:p-6 lg:p-8 xl:p-10">
                            <div className="text-center mb-6 sm:mb-8">
                                <div className="bg-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 mb-4">
                                    <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-1">Obat yang dicari:</p>
                                    <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-800 break-words px-2">
                                        "{drugName}"
                                    </h2>
                                </div>
                                <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl mx-auto px-2">
                                    Maaf, obat ini belum terdaftar dalam database kami yang saat ini berisi
                                    <span className="font-semibold text-cyan-600"> 150 jenis obat. </span>
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
                                <div className="bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6">
                                    <h3 className="font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                                        <Info className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                        Kemungkinan Penyebab
                                    </h3>
                                    <div className="space-y-2 sm:space-y-3">
                                        <p className="text-gray-700 text-sm">- Nama obat tidak terdeteksi dengan tepat dari foto</p>
                                        <p className="text-gray-700 text-sm">- Obat belum tersedia dalam database kami</p>
                                        <p className="text-gray-700 text-sm">- Kualitas foto kemasan kurang jelas</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6">
                                    <h3 className="font-bold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">
                                        Saran untuk Anda
                                    </h3>
                                    <div className="space-y-2 sm:space-y-3">
                                        <p className="text-gray-700 text-sm">- Foto ulang dengan pencahayaan lebih baik</p>
                                        <p className="text-gray-700 text-sm">- Pastikan nama obat terlihat jelas</p>
                                        <p className="text-gray-700 text-sm">- Periksa kembali ejaan nama obat</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                                <button
                                    onClick={handleTryAgain}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Coba Lagi
                                </button>
                                <button
                                    onClick={handleGoToClassify}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-cyan-700 border border-cyan-600 hover:bg-cyan-50 transition-colors"
                                >
                                    <Camera className="w-4 h-4" />
                                    Kembali ke Klasifikasi
                                </button>
                                <button
                                    onClick={handleGoHome}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-400 hover:bg-gray-100 transition-colors"
                                >
                                    <Home className="w-4 h-4" />
                                    Beranda
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={handleGoBack}
                    className="mb-4 sm:mb-6 flex items-center gap-2 text-cyan-600 hover:text-cyan-700 transition-colors font-medium group"
                >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm sm:text-base">Kembali</span>
                </button>

                <DrugInfoCard drug={drug} debugInfo={debugInfo} />
            </div>
        </div>
    );
}

export default DrugDetailPage;
