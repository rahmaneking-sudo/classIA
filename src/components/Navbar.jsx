import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Accueil', href: '/' },
    { name: 'Cours', href: '/cours' },
    { name: 'Prompts', href: '/prompts' },
    { name: 'Boutique', href: '/boutique' },
    { name: 'Actu-IA', href: '/actu-ia' },
  ];

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 glass-panel border-b border-[var(--color-neon-blue)]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-black text-white tracking-widest text-glow-blue" style={{ fontFamily: 'var(--font-heading)' }}>
              CLASSE <span className="text-[var(--color-neon-blue)]">IA</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-300 hover:text-[var(--color-neon-blue)] hover:text-glow-blue transition-all px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)] border border-[var(--color-neon-blue)]/30 rounded-lg hover:bg-[var(--color-neon-blue)]/20 hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all font-bold tracking-widest uppercase text-sm"
              >
                <User size={16} />
                Connexion
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={28} className="text-[var(--color-neon-blue)]" /> : <Menu size={28} className="text-[var(--color-neon-blue)]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-t border-[var(--color-neon-blue)]/20 absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-[var(--color-neon-blue)] hover:bg-[var(--color-neon-blue)]/10 block px-3 py-3 rounded-md text-base font-medium tracking-widest uppercase"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 mt-4 px-3 py-3 bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)] border border-[var(--color-neon-blue)]/30 rounded-md hover:bg-[var(--color-neon-blue)]/20 transition-all font-bold tracking-widest uppercase"
            >
              <User size={18} />
              Connexion
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
