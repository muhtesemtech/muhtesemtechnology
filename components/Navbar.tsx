import React, { useState, useEffect } from 'react';
import { NAV_LINKS } from '../constants';
import { ChevronDown, Menu, X, BrainCircuit } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-vivid-darker/95 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="relative">
            <BrainCircuit className="w-10 h-10 text-vivid-red fill-current" />
            <BrainCircuit className="w-10 h-10 text-white absolute top-0 left-1 opacity-20 group-hover:left-0.5 transition-all" />
          </div>
          <div className="flex flex-col leading-none ml-1">
            <span className="font-bold text-lg tracking-wide text-white">Muhteşem</span>
            <span className="text-xs text-gray-300 font-light tracking-wider">Technology</span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-gray-200 hover:text-white transition-colors flex items-center gap-1 group"
            >
              {link.label}
              {link.hasDropdown && (
                <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
              )}
            </a>
          ))}
          <button className="bg-vivid-red text-white px-5 py-2 rounded-sm font-bold text-sm hover:bg-red-700 transition-colors uppercase tracking-wide">
            Contact us
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-vivid-darker border-t border-gray-800 p-4 lg:hidden flex flex-col gap-4 shadow-xl">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-200 hover:text-vivid-red py-2 border-b border-gray-800"
            >
              {link.label}
            </a>
          ))}
          <button className="bg-vivid-red text-white w-full py-3 rounded-sm font-bold uppercase mt-2">
            Contact us
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;