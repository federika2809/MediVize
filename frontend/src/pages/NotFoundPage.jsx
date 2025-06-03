import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';

function NotFoundPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20 text-center px-4"
        >
            <h1 className="text-6xl md:text-8xl font-bold text-blue-600 mb-4">404</h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6">Halaman Tidak Ditemukan</h2>
            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-md">
                Maaf, halaman yang Anda cari tidak ada. Mungkin telah dihapus atau Anda salah mengetik alamat.
            </p>
            <Link to="/">
                <Button variant="primary">
                    Kembali ke Beranda
                </Button>
            </Link>
        </motion.div>
    );
}

export default NotFoundPage;