import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal text-stone-300">
      {/* Main Footer CTA */}
      <div className="py-24 px-6 text-center border-b border-white/10">
        <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">
          Ready to read smarter?
        </h2>
        <p className="max-w-xl mx-auto text-stone-400 mb-10 font-light">
          Join the waitlist and get early access to the future of minimal blogging.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 bg-white/5 border border-white/10 rounded-md px-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-burnt transition-colors"
          />
          <button className="bg-burnt text-white font-medium px-6 py-3 rounded-md hover:bg-burnt-hover transition-colors">
            Join Waitlist
          </button>
        </div>
      </div>

      {/* Links & Copyright */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between text-xs tracking-wide uppercase text-stone-500">
        <div className="mb-4 md:mb-0">
          <span className="text-white font-serif font-bold mr-2">SimpleBlog</span> © 2025
        </div>
        
        <div className="flex items-center gap-8">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;