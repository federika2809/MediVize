import React from 'react';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-600 text-white py-8 mt-10 relative overflow-hidden">
      
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-300 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-teal-400 rounded-full translate-x-20 translate-y-20"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-700 rounded-full opacity-50"></div>
        <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-cyan-500 rounded-full opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
       
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
           
           
            <span className="text-xl font-semibold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
              MediVize
            </span>
          </div>

          <p className="text-white text-sm font-medium drop-shadow-sm">
            &copy; {new Date().getFullYear()} MediVize. Powered by
            <span className="text-cyan-100 font-semibold"> FKEMHK</span>
          </p>

          <div className="border-t border-white/30 pt-4 mt-4">
            <p className="text-white/90 text-xs leading-relaxed max-w-md mx-auto drop-shadow-sm">
              Aplikasi ini hanya sebagai alat bantu dan tidak menggantikan
              konsultasi dengan dokter.
            </p>
          </div>
        </div>

       
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-cyan-200 to-transparent rounded-full"></div>
      </div>

      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-2 right-10 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-4 left-8 w-1 h-1 bg-cyan-200/60 rounded-full animate-pulse"
          style={{ animationDelay: '0.5s' }}
        ></div>
        <div
          className="absolute top-1/2 right-16 w-1 h-1 bg-teal-200/50 rounded-full animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>
    </footer>
  );
}

export default Footer;
