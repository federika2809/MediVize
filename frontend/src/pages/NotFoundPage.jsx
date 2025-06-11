import React from 'react';
import { motion } from 'framer-motion';

function Button({ children, onClick, variant = "primary", className = "" }) {
  const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2";
  
  const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-700 text-white focus:ring-cyan-300",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function Link({ to, children }) {
  return (
    <a href={to} className="inline-block">
      {children}
    </a>
  );
}

function NotFoundPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20 text-center px-4 bg-white min-h-screen"
        >
            <h1 className="text-6xl md:text-8xl font-bold text-cyan-600 mb-4">404</h1>
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