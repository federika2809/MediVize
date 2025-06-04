import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router
import { motion } from 'framer-motion';
import { Camera, Upload, AlertCircle, CheckCircle, Lightbulb, Search, Image as ImageIcon, Zap, Shield, Clock } from 'lucide-react';

// --- Mock Components (as provided by you, ensure they are styled or replace with actual UI library components) ---
const CameraInput = ({ onImageSelected }) => {
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const handleFileSelect = (event) => {
        if (event.target.files && event.target.files[0]) {
            onImageSelected(event.target.files[0]);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const triggerCamera = () => {
        cameraInputRef.current?.click();
    };

    return (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-teal-500 transition-colors">
            <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="mb-4 text-gray-600">Seret & lepas gambar, atau pilih dari galeri/kamera:</p>
            
            <input 
                type="file" 
                className="hidden" 
                id="file-upload-gallery" 
                accept="image/*" 
                ref={fileInputRef}
                onChange={handleFileSelect} 
            />
            <input 
                type="file" 
                className="hidden" 
                id="file-upload-camera" 
                accept="image/*" 
                capture="environment"
                ref={cameraInputRef}
                onChange={handleFileSelect}
            />

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button 
                    onClick={triggerFileSelect}
                    variant="secondary"
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center"
                >
                    <Upload className="h-5 w-5 mr-2" />
                    Pilih dari Galeri
                </Button>
                <Button 
                    onClick={triggerCamera}
                    variant="secondary"
                    className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center justify-center"
                >
                    <Camera className="h-5 w-5 mr-2" />
                    Ambil dengan Kamera
                </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3">PNG, JPG, WEBP hingga 5MB</p>
        </div>
    );
};

const Button = ({ onClick, disabled, children, variant, className }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`font-medium py-2 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2
            ${disabled ? 'bg-gray-400 cursor-not-allowed' : ''}
            ${variant === 'primary' && !disabled ? 'bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500' : ''}
            ${(variant === 'secondary' || variant !== 'primary') && !disabled ? 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500' : ''}
            ${className}`} // Allows overriding/extending styles
    >
        {children}
    </button>
);

const ClassificationResult = ({ result, onViewDetail }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Hasil Deteksi:</h3>
        {result.imageUrl && (
            <div className="mb-4">
                <img 
                    src={`http://localhost:8080${result.imageUrl}`} // Assumes Express backend is on localhost:8080
                    alt="Obat yang dideteksi" 
                    className="max-w-xs mx-auto rounded-lg shadow-md max-h-60 object-contain"
                    onError={(e) => { 
                        e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                        e.target.src = 'https://placehold.co/300x200/cccccc/ffffff?text=Gagal+Muat+Gambar';
                        e.target.alt = 'Gagal memuat gambar obat';
                     }}
                />
            </div>
        )}
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-2xl font-bold text-green-700">{result.drugName || 'Nama obat tidak tersedia'}</p>
            {result.confidence !== undefined && (
                 <p className="text-sm text-green-600">
                     Keyakinan: {(result.confidence * 100).toFixed(2)}%
                 </p>
            )}
        </div>

        {result.drugDetails && (
            <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Detail Obat:</h4>
                <p className="text-sm text-gray-600"><strong>Nama:</strong> {result.drugDetails.name || '-'}</p>
                <p className="text-sm text-gray-600"><strong>Tipe:</strong> {result.drugDetails.type || '-'}</p>
                <p className="text-sm text-gray-600"><strong>Ukuran:</strong> {result.drugDetails.size || '-'}</p>
                <p className="text-sm text-gray-600"><strong>Kegunaan:</strong> {result.drugDetails.purpose || '-'}</p>
                {/* Add more details if available and needed */}
            </div>
        )}
        
        {result.drugName && result.drugName !== "Tidak Dikenali" && (
            <Button onClick={() => onViewDetail(result.drugName)} variant="primary" className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white">
                Lihat Detail Lengkap Obat
            </Button>
        )}
         {result.processedAt && (
            <p className="text-xs text-gray-400 mt-3 text-center">Diproses pada: {new Date(result.processedAt).toLocaleString()}</p>
        )}
    </div>
);
// --- End Mock Components ---


// --- API Configuration and Function ---
// This URL should point to your Express backend's classification endpoint
const API_URL = 'http://localhost:8080/api/drugs/classify'; 

/**
 * Sends image to the Express backend for classification.
 * @param {File} imageFile - The image file to classify.
 * @returns {Promise<object>} - Promise resolving with classification result or error.
 */
async function classifyDrugImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile); // Field name 'image' must match Express 'upload.single('image')'

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
            // Headers like 'Content-Type: multipart/form-data' are set automatically by fetch for FormData
        });

        const responseData = await response.json().catch(err => {
            console.error("Failed to parse API response as JSON:", err);
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status} and non-JSON response.`);
            }
            return { success: false, message: "API response was not valid JSON." }; 
        });

        if (!response.ok) {
            const errorMessage = responseData.message || `API request failed with status ${response.status}`;
            console.error('API Error Response:', { status: response.status, data: responseData, message: errorMessage });
            return { success: false, message: errorMessage, errorData: responseData }; // Include errorData for more context
        }
        
        // Expecting { success: true, data: { drugName, confidence, imageUrl, processedAt, drugDetails } }
        return { success: true, data: responseData.data };

    } catch (error) {
        console.error('Network or other error in classifyDrugImage:', error);
        let errorMessage = 'Terjadi kesalahan jaringan atau koneksi ke server gagal.';
        if (error instanceof TypeError && error.message.toLowerCase().includes('failed to fetch')) {
             errorMessage = 'Gagal menghubungi server API. Pastikan server backend (Express) berjalan dan konfigurasi CORS sudah benar. Periksa juga koneksi internet Anda.';
        } else if (error.message) {
             errorMessage = `Kesalahan: ${error.message}.`;
        }
        return { success: false, message: errorMessage, error: error };
    }
}

// --- Main Classification Page Component ---
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
                setClassificationResult(result.data); 

                if (result.data.drugName && result.data.drugName !== "Tidak Dikenali") {
                    console.log("Obat terdeteksi:", result.data.drugName, "Menampilkan hasil di halaman ini.");
                } else {
                    console.warn("API sukses, tapi obat tidak dikenali. Data:", result.data);
                    // setError("Obat tidak dapat dikenali dari gambar yang diberikan. Hasil dari AI: " + (result.data.drugName || "Tidak ada nama"));
                    // The ClassificationResult component will handle the "Tidak Dikenali" message based on drugName
                }
            } else {
                setError(result.message || 'Terjadi kesalahan saat klasifikasi gambar.');
                console.error("Classification failed or API returned error:", result);
                setClassificationResult(null);
            }
        } catch (err) {
            setError('Terjadi kesalahan tak terduga saat memproses permintaan. Silakan coba lagi.');
            console.error('Unexpected error in handleClassify:', err);
            setClassificationResult(null);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (drugName) => {
        if (drugName && drugName !== "Tidak Dikenali") {
            navigate(`/drug/${encodeURIComponent(drugName)}`); // Ensure you have a route like /drug/:drugName
        } else {
            console.warn('Invalid drug name for detail view:', drugName);
            setError('Tidak dapat menampilkan detail, nama obat tidak valid atau tidak dikenali.');
        }
    };

    const tips = [
        { icon: Camera, title: "Posisi Optimal", desc: "Letakkan kemasan obat di tengah frame dengan jarak yang tepat untuk hasil terbaik" },
        { icon: Lightbulb, title: "Pencahayaan Ideal", desc: "Gunakan cahaya natural atau lampu terang, hindari bayangan dan silau berlebihan" },
        { icon: Search, title: "Fokus Sempurna", desc: "Pastikan gambar tajam dan teks pada kemasan dapat dibaca dengan jelas" },
        { icon: Shield, title: "Kualitas Tinggi", desc: "Gunakan resolusi tinggi dan pastikan kemasan tidak rusak atau sobek" }
    ];

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-10 w-32 h-32 bg-teal-100/30 rounded-full blur-2xl"></div>
                <div className="absolute bottom-20 left-10 w-32 h-32 bg-cyan-100/30 rounded-full blur-2xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="classification-page container relative z-10 py-12 mx-auto px-4 sm:px-6 lg:px-8"
            >
                {/* Header Section */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
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
                        Unggah gambar kemasan obat untuk identifikasi cepat menggunakan AI dan dapatkan informasi detailnya.
                    </motion.p>
                </div>
                
                {/* Tips Section */}
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
                                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
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

                {/* Main Interaction Area: Upload and Classify Button */}
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
                                    disabled={loading || !selectedImage}
                                    variant="primary"
                                    className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white transition-all duration-300 shadow-md hover:shadow-lg rounded-xl disabled:opacity-50"
                                >
                                    <div className="flex items-center space-x-2">
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                                <span>Mendeteksi...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Search className="h-5 w-5" />
                                                <span>Mulai Deteksi Sekarang</span>
                                            </>
                                        )}
                                    </div>
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
                
                {/* Loading Indicator Section */}
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
                                    transition={{ duration: 1.5, ease: "linear", repeat: Infinity, repeatType: "loop" }} // Faster loop for loading
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
                
                {/* Classification Result Section */}
                {classificationResult && !loading && ( /* Show if result exists and not loading, error is handled above or implicitly by result content */
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-12"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-3">
                                {classificationResult.drugName && classificationResult.drugName !== "Tidak Dikenali" ? "Hasil Deteksi Berhasil" : "Obat Tidak Dikenali"}
                            </h2>
                            <p className="text-gray-600">
                                {classificationResult.drugName && classificationResult.drugName !== "Tidak Dikenali" 
                                    ? "Berikut adalah informasi obat yang terdeteksi:" 
                                    : "Sistem tidak dapat mengenali obat dari gambar ini. Silakan coba lagi dengan gambar yang lebih jelas atau periksa tips foto."}
                            </p>
                        </div>
                        <div className="max-w-3xl mx-auto">
                            <ClassificationResult
                                result={classificationResult}
                                onViewDetail={handleViewDetail}
                            />
                        </div>
                    </motion.div>
                )}

                {/* "Not Found" specific state if error message indicates it */}
                 {error && error.toLowerCase().includes('tidak ditemukan') && !loading && !classificationResult && (
                     <motion.div
                         initial={{ opacity: 0, y: 30 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="mt-12 max-w-3xl mx-auto"
                     >
                         <div className="bg-white rounded-2xl p-10 text-center shadow-lg border border-gray-200">
                             <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                 <Search className="h-8 w-8 text-white" />
                             </div>
                             <h3 className="text-2xl font-bold text-gray-800 mb-4">Obat Tidak Ditemukan</h3>
                             <p className="text-gray-600 mb-6 leading-relaxed">
                                 Sistem tidak dapat menemukan atau mengenali obat dari gambar yang diberikan. 
                                 Pesan dari sistem: "{error}" <br/>
                                 Mari coba lagi dengan foto yang lebih optimal.
                             </p>
                             <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6 text-left">
                                 <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                                     <Lightbulb className="h-4 w-4 mr-2" />
                                     Tips untuk Foto yang Lebih Baik
                                 </h4>
                                 <div className="grid md:grid-cols-2 gap-3">
                                     {[
                                         "Pastikan pencahayaan cukup terang dan merata",
                                         "Kemasan obat harus terlihat penuh dalam frame",
                                         "Hindari bayangan atau pantulan cahaya",
                                         "Pastikan fokus kamera tajam dan tidak buram"
                                     ].map(tipText => (
                                         <div className="flex items-start space-x-2" key={tipText}>
                                             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                             <span className="text-blue-700 text-sm">{tipText}</span>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                             <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                 <Button 
                                     onClick={() => {
                                         setSelectedImage(null);
                                         setError('');
                                         setClassificationResult(null);
                                     }}
                                     variant="primary" // Ensure this variant is styled for primary actions
                                     className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 px-8 py-3 font-semibold rounded-xl shadow-md text-white"
                                 >
                                     <div className="flex items-center space-x-2">
                                         <Camera className="h-4 w-4" />
                                         <span>Ambil Foto Ulang</span>
                                     </div>
                                 </Button>
                             </motion.div>
                         </div>
                     </motion.div>
                 )}
            </motion.div>
        </div>
    );
}

// If this component is the main export of a file, e.g., App.js or ClassificationPage.js
// For a typical setup, you might have an App.js that includes Routes
// For this example, let's assume ClassificationPage is the main component to render.
// You would typically wrap this in a Router in your main App.js
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// const App = () => (
//   <Router>
//     <Routes>
//       <Route path="/classify" element={<ClassificationPage />} />
//       {/* Define other routes, e.g., for drug details: */}
//       {/* <Route path="/drug/:drugName" element={<DrugDetailPage />} /> */}
//       <Route path="/" element={<ClassificationPage />} /> {/* Default route */}
//     </Routes>
//   </Router>
// );
// export default App;

export default ClassificationPage; // Exporting the page component directly
