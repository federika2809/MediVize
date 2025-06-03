// MEDIVIZE/frontend/src/pages/DrugDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDrugByName, debugDrugSearch } from '../services/drugService';
import DrugInfoCard from '../components/drug/DrugInfoCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

function DrugDetailPage() {
    // --- PERBAIKAN UTAMA DI SINI ---
    // Gunakan 'id' karena itulah nama parameter di rute App.jsx
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [drug, setDrug] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [debugInfo, setDebugInfo] = useState(null);

    useEffect(() => {
        const fetchDrugDetails = async () => {
            // Validasi awal untuk memastikan 'id' (yang sebenarnya adalah nama obat) ada
            if (!id) { 
                console.error('URL parameter "id" (nama obat) is undefined or empty.');
                setError('Nama obat tidak valid atau tidak ditemukan di URL. Kembali ke halaman utama.');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');

            try {
                // Dekode 'id' yang sebenarnya adalah nama obat dari URL.
                // Ini akan menangani spasi atau karakter khusus yang di-encodeURIComponent.
                const decodedDrugName = decodeURIComponent(id); 

                console.log('=== DRUG DETAIL PAGE DEBUG ===');
                console.log('Raw param (id from URL):', id); 
                console.log('Decoded Drug Name for Search:', decodedDrugName);
                console.log('Fetching drug details for:', decodedDrugName);

                // Normalisasi nama obat untuk pencarian (opsional, tergantung backend)
                // Jika backend Anda case-sensitive dan butuh huruf kapital di awal, bisa gunakan:
                // const searchName = decodedDrugName.charAt(0).toUpperCase() + decodedDrugName.slice(1).toLowerCase();
                // Saat ini, kita akan menggunakan decodedDrugName langsung
                const searchName = decodedDrugName;

                // Jalankan debug untuk mendapatkan info komprehensif
                const debugResult = await debugDrugSearch(searchName); 
                setDebugInfo(debugResult);
                console.log('Debug result:', debugResult);

                // Coba dapatkan obat berdasarkan nama
                const result = await getDrugByName(searchName); 
                console.log('getDrugByName result:', result);

                if (result.success && result.data) {
                    console.log('✓ Drug found:', result.data);
                    setDrug(result.data);
                } else {
                    console.log('✗ Drug not found');
                    // Perbarui pesan error berdasarkan respons dari service
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
        // --- PERBAIKAN DEPENDENCY ARRAY ---
        // Jalankan ulang useEffect jika 'id' di URL berubah
    }, [id]); 

    const handleGoBack = () => {
        navigate(-1); // Kembali ke halaman sebelumnya
    };

    const handleTryAgain = async () => {
        setLoading(true);
        setError('');
        
        try {
            // Pastikan 'id' tidak undefined sebelum mencoba lagi
            if (!id) { // Gunakan 'id'
                setError('Tidak ada nama obat yang valid untuk dicoba lagi.');
                setLoading(false);
                return;
            }
            const decodedDrugName = decodeURIComponent(id); // Gunakan 'id'
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
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center min-h-64">
                    <LoadingSpinner />
                    <span className="ml-2 text-gray-600">Memuat detail obat...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <button
                        onClick={handleGoBack}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </button>
                </div>
                
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
                        <div className="text-red-600 text-lg font-semibold mb-2">
                            Obat Tidak Ditemukan
                        </div>
                        <p className="text-red-700 mb-4">{error}</p>
                        
                        {/* Show debug info in development */}
                        {process.env.NODE_ENV === 'development' && debugInfo && (
                            <div className="mt-4 p-4 bg-gray-100 rounded text-left text-sm">
                                <p><strong>Connection Status:</strong> {debugInfo.connection?.success ? '✓ OK' : '✗ Failed'}</p>
                                {/* Menampilkan message jika ada */}
                                {debugInfo.connection?.data?.message && <p><strong>Server Message:</strong> {debugInfo.connection.data.message}</p>}
                                <p><strong>Search Result:</strong> {debugInfo.search?.success ? `✓ Found ${debugInfo.search?.data?.length || 0} items` : `✗ Failed (${debugInfo.search?.message || 'No message'})`}</p>
                                <p><strong>Direct Fetch:</strong> {debugInfo.direct?.success ? '✓ Success' : `✗ Failed (${debugInfo.direct?.message || 'No message'})`}</p>
                            </div>
                        )}
                        
                        <div className="flex justify-center gap-3 mt-4">
                            <button
                                onClick={handleTryAgain}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Coba Lagi
                            </button>
                            <button
                                onClick={handleGoBack}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Kembali
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!drug) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <button
                        onClick={handleGoBack}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </button>
                </div>
                
                <div className="text-center text-gray-600">
                    <p>Data obat tidak tersedia.</p>
                    <button
                        onClick={handleGoBack}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <button
                    onClick={handleGoBack}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Kembali
                </button>
            </div>
            
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                Detail Informasi Obat: {drug.name}
            </h1>
            
            <div className="max-w-4xl mx-auto">
                <DrugInfoCard drug={drug} />
            </div>
        </div>
    );
}

export default DrugDetailPage;