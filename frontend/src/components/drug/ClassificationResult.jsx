// MEDIVIZE/frontend/src/components/drug/ClassificationResult.jsx
import React from 'react';
import Button from '../common/Button';
import { motion } from 'framer-motion';

function ClassificationResult({ result, onViewDetail }) {
  if (!result) return null;

  const { drugName, confidence, drugDetails, imageUrl } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6 p-4 bg-blue-50 rounded-lg shadow-inner border border-blue-200"
    >
      <h3 className="text-xl font-bold text-blue-800 mb-3">Hasil Klasifikasi:</h3>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`Gambar kemasan obat ${drugName}`} 
          className="max-w-full h-auto max-h-64 object-contain mx-auto rounded-md mb-4"
        />
      )}
      <p className="text-lg text-gray-800 mb-2">
        Obat yang dikenali: <span className="font-semibold">{drugName || 'Tidak Dikenali'}</span>
      </p>
      {confidence && confidence > 0 && (
        <p className="text-md text-gray-700 mb-4">
          Keyakinan model: <span className="font-semibold">{(confidence * 100).toFixed(2)}%</span>
        </p>
      )}
      {drugDetails && drugName && drugName !== 'Tidak Dikenali' ? (
        <Button onClick={() => onViewDetail(drugName)} variant="primary" className="w-full">
          Lihat Detail Obat
        </Button>
      ) : (
        <p className="text-red-500 text-sm text-center">Informasi detail obat tidak tersedia untuk hasil ini.</p>
      )}
    </motion.div>
  );
}

export default ClassificationResult;