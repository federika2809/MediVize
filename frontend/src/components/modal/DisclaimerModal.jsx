import React from 'react';
import Button from '../common/Button';

function DisclaimerModal({ onClose, title = "Penting: Disclaimer", message, showActionButton = false, actionButtonText = "", onActionButtonClick = () => {} }) {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
                <p className="text-gray-700 mb-6">
                    {message || "Aplikasi ini adalah alat bantu dan tidak menggantikan konsultasi medis profesional. Selalu konsultasikan dengan dokter atau apoteker Anda sebelum mengambil keputusan terkait kesehatan atau penggunaan obat."}
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <Button onClick={onClose} variant="secondary" className="w-full sm:w-auto">
                        Saya Mengerti
                    </Button>
                    {showActionButton && (
                        <Button onClick={onActionButtonClick} variant="primary" className="w-full sm:w-auto">
                            {actionButtonText}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DisclaimerModal;