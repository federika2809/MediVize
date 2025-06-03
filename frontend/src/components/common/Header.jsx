import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
                    <img src="/icon/medicine-192x192.png" alt="MediVize Logo" className="h-8 w-8" />
                    <span>MediVize</span>
                </Link>
                <nav>
                    <ul className="flex space-x-6">
                        <li>
                            <Link to="/" className="hover:text-blue-200 transition-colors duration-200">
                                Beranda
                            </Link>
                        </li>
                        <li>
                            <Link to="/classify" className="hover:text-blue-200 transition-colors duration-200">
                                Klasifikasi
                            </Link>
                        </li>
                        <li>
                            <Link to="/guide" className="hover:text-blue-200 transition-colors duration-200">
                                Panduan
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-blue-200 transition-colors duration-200">
                                Tentang
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;