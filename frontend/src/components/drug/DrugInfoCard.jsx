import React from 'react';

function DrugInfoCard({ drug }) {
  if (!drug) return <p className="text-center text-gray-600">Data obat tidak ditemukan.</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{drug.name}</h2>
      <p className="text-gray-600 text-sm mb-4">Nama Generik: <span className="font-medium">{drug.genericName}</span></p>

      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Kegunaan:</h3>
        <p className="text-gray-700">{drug.purpose}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Dosis:</h3>
        <p className="text-gray-700">{drug.dosage}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Efek Samping:</h3>
        <ul className="list-disc list-inside text-gray-700">
          {drug.sideEffects && drug.sideEffects.map((effect, index) => (
            <li key={index}>{effect}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Peringatan Penting:</h3>
        <p className="text-red-600 font-medium">{drug.warnings || 'Tidak ada peringatan khusus.'}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Cara Penggunaan:</h3>
        <p className="text-gray-700">{drug.howToUse}</p>
      </div>
    </div>
  );
}

export default DrugInfoCard;