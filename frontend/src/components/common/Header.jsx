import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { href: '/', label: 'Beranda' },
    { href: '/classify', label: 'Klasifikasi' },
    { href: '/search', label: 'Cari Obat' },
    { href: '/guide', label: 'Panduan' },
    { href: '/about', label: 'Tentang' },
  ];

  return (
    <header className="bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-600 text-white shadow-lg relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <a
            href="/"
            className="text-xl sm:text-2xl font-bold flex items-center space-x-2 hover:scale-105 transition-transform duration-200"
            onClick={closeMenu}
          >
            
            <img
              src="/icon/medicine-192x192.png"
              alt="MediVize Logo"
              className="h-5 w-5 sm:h-6 sm:w-6"
            />
            {/* </div> */}
            <span className="bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
              MediVize
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {navItems.map((item, index) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="relative px-3 py-2 hover:text-cyan-200 transition-all duration-300 group font-medium"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-200 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="pb-4">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="block px-4 py-3 rounded-lg hover:bg-white/20 transition-all duration-200 transform hover:translate-x-2"
                    onClick={closeMenu}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <span className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-cyan-200 rounded-full opacity-60"></span>
                      <span>{item.label}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1] md:hidden"
          onClick={closeMenu}
        ></div>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-md"></div>
      </div>
    </header>
  );
}

export default Header;
