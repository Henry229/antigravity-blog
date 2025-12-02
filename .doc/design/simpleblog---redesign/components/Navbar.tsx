import React, { useState, useEffect } from 'react';
import { PenTool } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#FAF9F6]/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-burnt text-white p-1.5 rounded-full transition-transform group-hover:rotate-12">
            <PenTool size={18} />
          </div>
          <span className="font-serif text-xl font-bold text-charcoal tracking-tight">SimpleBlog</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <a href="#features" className="hover:text-burnt transition-colors">Features</a>
          <a href="#methodology" className="hover:text-burnt transition-colors">Methodology</a>
          <a href="#pricing" className="hover:text-burnt transition-colors">Pricing</a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <button className="hidden md:block text-sm font-medium text-stone-600 hover:text-charcoal transition-colors">
            Log In
          </button>
          <button className="bg-charcoal text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-stone-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Get Access
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;