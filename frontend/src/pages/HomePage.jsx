import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 animate-fade-in-down">
                MediVize: Pahami Obat Anda dengan Cerdas
            </h1>
            <p className="text-base md:text-lg text-gray-700 max-w-2xl mb-10 animate-fade-in-up">
                Aplikasi berbasis kecerdasan buatan untuk mengenali dan memahami obat hanya dari foto kemasan,
                meningkatkan keamanan dan kemandirian penggunaan obat.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up delay-200">
                <Link to="/classify"> 
                    <Button variant="primary">Mulai Deteksi & Cari Obat</Button> 
                </Link>
                <Link to="/guide">
                    <Button variant="secondary">Panduan Penggunaan</Button>
                </Link>
            </div>
            <p className="mt-12 text-sm text-gray-500 animate-fade-in-up delay-300">
                MediVize adalah alat bantu edukasi, bukan pengganti konsultasi dengan dokter atau apoteker.
            </p>
        </div>
    );
}

export default HomePage;