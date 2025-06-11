import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDrugByName, debugDrugSearch } from '../services/drugService';
import DrugInfoCard from '../components/drug/DrugInfoCard';
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
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-cyan-500 mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Mencari Informasi Obat</h3>
                    <p className="text-gray-600">Mohon tunggu sebentar...</p>
                </div>
            </div>
        );
    }

    if (error) {
        const drugName = id ? decodeURIComponent(id) : 'Obat yang dicari';
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-6 md:py-8">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={handleGoBack}
                        className="mb-4 md:mb-6 flex items-center gap-2 text-cyan-600 hover:text-cyan-700 transition-colors font-medium group"
                    >
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm md:text-base">Kembali</span>
                    </button>

                    <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden">
                        <div className="bg-cyan-600 p-6 md:p-8 text-center">
                            <div className="mb-3 md:mb-4">
                                <AlertTriangle className="w-14 h-14 md:w-16 md:h-16 text-red-500 mx-auto" />
                            </div>
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">
                                Obat Tidak Ditemukan
                            </h1>
                            <p className="text-cyan-100 text-sm md:text-base opacity-90">
                                Informasi obat yang Anda cari belum tersedia
                            </p>
                        </div>

                        <div className="p-6 md:p-8 lg:p-10">
                            <div className="text-center mb-6 md:mb-8">
                                <div className="bg-gray-100 rounded-xl p-4 md:p-5 mb-4">
                                    <p className="text-sm md:text-base text-gray-600 mb-1">Obat yang dicari:</p>
                                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 break-words">
                                        "{drugName}"
                                    </h2>
                                </div>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                                    Maaf, obat ini belum terdaftar dalam database kami yang saat ini berisi
                                    <span className="font-semibold text-cyan-600"> 150 jenis obat. </span>
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
                                <div className="bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl p-5 md:p-6">
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm md:text-base">
                                        <Info className="w-4 h-4 md:w-5 md:h-5" />
                                        Kemungkinan Penyebab
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                            <p className="text-gray-700 text-sm md:text-base">
                                                Nama obat tidak terdeteksi dengan tepat dari foto
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                            <p className="text-gray-700 text-sm md:text-base">
                                                Obat belum tersedia dalam database kami
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                            <p className="text-gray-700 text-sm md:text-base">
                                                Kualitas foto kemasan kurang jelas
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl p-5 md:p-6">
                                    <h3 className="font-bold text-gray-800 mb-4 text-sm md:text-base">
                                        Saran untuk Anda
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                            <p className="text-gray-700 text-sm md:text-base">
                                                Foto ulang dengan pencahayaan lebih baik
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                            <p className="text-gray-700 text-sm md:text-base">
                                                Pastikan nama obat terlihat jelas
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                            <p className="text-gray-700 text-sm md:text-base">
                                                Konsultasi dengan apoteker atau dokter
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 md:space-y-0 md:flex md:gap-4 md:justify-center">
                                <button
                                    onClick={handleGoToClassify}
                                    className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 md:py-3.5 px-6 md:px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                >
                                    <Camera className="w-4 h-4 md:w-5 md:h-5" />
                                    <span className="text-sm md:text-base">Foto Ulang</span>
                                </button>
                                <button
                                    onClick={handleTryAgain}
                                    className="w-full md:w-auto bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 md:py-3.5 px-6 md:px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                >
                                    <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
                                    <span className="text-sm md:text-base">Coba Lagi</span>
                                </button>
                                <button
                                    onClick={handleGoHome}
                                    className="w-full md:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 md:py-3.5 px-6 md:px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                >
                                    <Home className="w-4 h-4 md:w-5 md:h-5" />
                                    <span className="text-sm md:text-base">Beranda</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 md:py-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={handleGoBack}
                    className="mb-4 md:mb-6 flex items-center gap-2 text-cyan-600 hover:text-cyan-700 transition-colors font-medium group"
                >
                    <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm md:text-base">Kembali</span>
                </button>
                {drug && <DrugInfoCard data={drug} debug={debugInfo} />}
            </div>
        </div>
    );
}

export default DrugDetailPage;
