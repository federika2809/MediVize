import React, { useRef, useState, useEffect } from 'react';
import Button from '../common/Button';

function CameraInput({ onImageSelected }) {
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null); 

    const [imagePreview, setImagePreview] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []); 

    useEffect(() => {
        if (isCameraActive) {
            startCamera();
        } else {
            stopCamera();
        }
    }, [isCameraActive]);

    const startCamera = async () => {
        stopCamera();
        
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment' } 
                });
                
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.play();
                }
                
                streamRef.current = mediaStream;
                
            } catch (err) {
                console.error("Error accessing camera:", err);
                alert("Tidak dapat mengakses kamera. Pastikan Anda telah memberikan izin dan tidak ada aplikasi lain yang menggunakan kamera.");
                setIsCameraActive(false);
            }
        } else {
            alert("Peramban Anda tidak mendukung akses kamera secara langsung.");
            setIsCameraActive(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
                console.log('Camera track stopped:', track.kind); 
            });
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.pause();
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            onImageSelected(file);
            setImagePreview(URL.createObjectURL(file));
            setIsCameraActive(false);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                const capturedFile = new File([blob], "captured_image.jpg", { type: "image/jpeg" });
                onImageSelected(capturedFile);
                setImagePreview(URL.createObjectURL(capturedFile));
                setIsCameraActive(false);
            }, 'image/jpeg');
        }
    };

    const handleOpenCamera = () => {
        setImagePreview(null);
        setIsCameraActive(true);
    };

    const handleUploadImage = () => {
        setImagePreview(null);
        setIsCameraActive(false);
        fileInputRef.current?.click();
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isCameraActive) {
                setIsCameraActive(false);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isCameraActive]);

    return (
        <div className="flex flex-col items-center p-4 border border-dashed border-gray-300 rounded-lg bg-white shadow-sm">
            {isCameraActive ? (
                <div className="mb-4 w-full flex flex-col items-center">
                    <video 
                        ref={videoRef} 
                        className="w-full max-w-sm rounded-md shadow-md mb-2"
                        playsInline 
                        muted 
                    ></video>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    <div className="flex space-x-2">
                        <Button onClick={capturePhoto} variant="primary" className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A.5.5 0 0011.379 3H8.621a.5.5 0 00-.354.146L7.293 4.707A1 1 0 016.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                            <span>Ambil Foto</span>
                        </Button>
                        <Button onClick={() => setIsCameraActive(false)} variant="outline" className="flex items-center space-x-2">
                            <span>Tutup Kamera</span>
                        </Button>
                    </div>
                </div>
            ) : imagePreview ? (
                <div className="mb-4">
                    <img src={imagePreview} alt="Pratinjau Gambar" className="max-w-xs max-h-64 rounded-md shadow-md border border-gray-200" />
                </div>
            ) : (
                <div className="mb-4 text-gray-500 text-center">
                    <p>Unggah gambar kemasan obat atau gunakan kamera.</p>
                    <p className="text-sm">(Pastikan gambar jelas dan fokus)</p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full justify-center">
                <Button onClick={handleOpenCamera} variant="outline" className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A.5.5 0 0011.379 3H8.621a.5.5 0 00-.354.146L7.293 4.707A1 1 0 016.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    <span>Ambil Foto Langsung</span>
                </Button>

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <Button onClick={handleUploadImage} variant="secondary" className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5.5 13a3.5 3.5 0 01-.369-6.984c.652-1.715 2.452-3.006 4.346-3.006 1.725 0 3.18.995 3.844 2.305 1.748.062 3.178 1.478 3.178 3.295a3.5 3.5 0 01-3.5 3.5H5.5zm.992-7.013A1.5 1.5 0 006 5.5V9h-1.5a.5.5 0 01-.354-.854L5.5 6.293l.854-.854z" />
                        <path fillRule="evenodd" d="M10 13a.75.75 0 00.75-.75V8.56l1.22 1.22a.75.75 0 101.06-1.06l-2.5-2.5a.75.75 0 00-1.06 0l-2.5 2.5a.75.75 0 101.06 1.06l1.22-1.22V12.25c0 .414.336.75.75.75z" clipRule="evenodd" />
                    </svg>
                    <span>Unggah Gambar</span>
                </Button>
            </div>
        </div>
    );
}

export default CameraInput;