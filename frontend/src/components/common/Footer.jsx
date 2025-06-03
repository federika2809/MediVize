import React from 'react';

function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-6 mt-10">
            <div className="container text-center text-sm">
                <p>&copy; {new Date().getFullYear()} MediVize. Powered by DES Foundation. All rights reserved.</p>
                <p className="mt-2 text-gray-400">
                    Aplikasi ini adalah alat bantu dan tidak menggantikan konsultasi medis profesional.
                </p>
            </div>
        </footer>
    );
}

export default Footer;