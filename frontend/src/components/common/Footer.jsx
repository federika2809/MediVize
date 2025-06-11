import React from 'react';

function Footer() {
  return (
    <footer className="bg-cyan-600 text-white py-4 mt-10">

      <div className="container mx-auto px-4 text-center">
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <span className="text-lg font-semibold text-white">
              MediVize
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-white text-xs font-medium drop-shadow-sm">
              &copy; {new Date().getFullYear()} MediVize. Powered by
              <span className="text-cyan-100 font-semibold"> FKEMHK</span>
            </p>
            
            <p className="text-white/90 text-xs leading-relaxed max-w-md mx-auto drop-shadow-sm">
              Aplikasi ini hanya sebagai alat bantu dan tidak menggantikan konsultasi dengan dokter.
              <br />
              <br />
           <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-200 to-transparent rounded-full"></div>
            </p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-2 right-10 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-4 left-8 w-1 h-1 bg-cyan-200/60 rounded-full animate-pulse"
          style={{ animationDelay: '0.5s' }}
        ></div>
        <div
          className="absolute top-1/2 right-16 w-1 h-1 bg-cyan-200/50 rounded-full animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>
    </footer>
  );
}

export default Footer;