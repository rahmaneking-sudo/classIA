import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import { Lock, MessageCircle, ChevronRight, LayoutDashboard, Send } from 'lucide-react';

const SiteViewer = () => {
  const { slug } = useParams();
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Remplace ce numéro par ton numéro WhatsApp (Admin) pour recevoir les paiements
  const ADMIN_WHATSAPP = '221711696897';

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/microsites/${slug}`);
        setSiteData(response.data);
      } catch (err) {
        setError('Ce site n\'existe pas ou a été supprimé.');
      } finally {
        setLoading(false);
      }
    };
    fetchSite();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020205] flex items-center justify-center">
        <div className="text-[var(--color-neon-blue)] animate-pulse tracking-widest uppercase">Chargement du site...</div>
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div className="min-h-screen bg-[#020205] flex items-center justify-center text-white text-center px-4">
        <div>
          <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  // --- ECRAN DE PAIEMENT (Si le site n'est pas actif) ---
  if (!siteData.isActive) {
    const paymentMessage = `Bonjour, je viens de créer mon site "${siteData.businessName}" (Lien: classia.com/site/${siteData.slug}). Je souhaite procéder au paiement (50 000 FCFA) pour l'activer.`;
    
    return (
      <div className="min-h-screen bg-[#020205] text-white flex items-center justify-center p-6 font-['Rajdhani']">
        <div className="bg-[#0a0a10]/80 border border-[var(--color-neon-purple)]/50 rounded-2xl p-8 max-w-lg w-full text-center backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)]"></div>
          
          <div className="bg-[var(--color-neon-purple)]/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-[var(--color-neon-purple)]" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4 uppercase tracking-widest">Site en attente d'activation</h1>
          <p className="text-gray-400 mb-8">
            Votre site <strong className="text-white">{siteData.businessName}</strong> a été généré avec succès ! 
            Pour le rendre visible au public, veuillez procéder au règlement des frais de création.
          </p>
          
          <div className="bg-white/5 rounded-xl p-4 mb-8 text-left border border-white/10">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Forfait choisi :</span>
              <span className="font-bold text-[var(--color-neon-blue)]">{siteData.tier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Montant à régler :</span>
              <span className="font-bold text-white">50 000 FCFA</span>
            </div>
          </div>

          <a 
            href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(paymentMessage)}`}
            target="_blank" rel="noopener noreferrer"
            className="w-full py-4 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] text-white font-bold tracking-widest uppercase rounded-xl hover:shadow-[0_0_20px_rgba(186,85,211,0.5)] transition-all flex items-center justify-center"
          >
            <MessageCircle className="w-5 h-5 mr-2" /> Payer & Activer
          </a>
          
          <p className="text-xs text-gray-500 mt-6">Une fois le paiement effectué, votre site sera activé instantanément par notre équipe.</p>
        </div>
      </div>
    );
  }

  // --- RENDU DU SITE ACTIF (THÈMES) ---
  const { themeId, businessName, content, whatsapp } = siteData;

  // Thème Dark Tech (Par défaut)
  let themeStyles = {
    bg: 'bg-[#020205]',
    cardBg: 'bg-[#0a0a10]',
    text: 'text-white',
    accent: 'text-[var(--color-neon-blue)]',
    border: 'border-[var(--color-neon-blue)]/20',
    button: 'bg-[var(--color-neon-blue)] hover:bg-[var(--color-neon-purple)]',
  };

  // Thème Light Minimalist
  if (themeId === 'light') {
    themeStyles = {
      bg: 'bg-gray-50',
      cardBg: 'bg-white',
      text: 'text-gray-900',
      accent: 'text-blue-600',
      border: 'border-gray-200',
      button: 'bg-blue-600 hover:bg-blue-700',
    };
  }

  // Thème Luxury Gold
  if (themeId === 'luxury') {
    themeStyles = {
      bg: 'bg-[#111]',
      cardBg: 'bg-[#1a1a1a]',
      text: 'text-[#f4f4f4]',
      accent: 'text-[#d4af37]',
      border: 'border-[#d4af37]/30',
      button: 'bg-[#d4af37] text-black hover:bg-[#b5952f]',
    };
  }

  const handleContact = () => {
    window.open(`https://wa.me/${whatsapp}`, '_blank');
  };

  return (
    <div className={`min-h-screen ${themeStyles.bg} ${themeStyles.text} font-['Rajdhani']`}>
      {/* Badge "Créé avec ClassIA" */}
      <a href="/creation-site" target="_blank" rel="noopener noreferrer" className="fixed bottom-4 right-4 bg-black/80 backdrop-blur border border-white/10 text-white text-xs px-3 py-2 rounded-full flex items-center z-50 hover:bg-black transition-colors">
        <LayoutDashboard className="w-3 h-3 mr-2 text-[var(--color-neon-purple)]" />
        Créé avec ClassIA
      </a>

      {/* Hero Section */}
      <header className={`pt-32 pb-20 px-6 text-center border-b ${themeStyles.border}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-5xl md:text-7xl font-bold tracking-widest uppercase mb-6 ${themeId === 'dark' ? 'text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)]' : themeStyles.accent}`}>
            {businessName}
          </h1>
          <p className={`text-xl md:text-2xl opacity-80 max-w-2xl mx-auto leading-relaxed mb-10`}>
            {content.description}
          </p>
          <button 
            onClick={handleContact}
            className={`px-8 py-4 ${themeStyles.button} text-white font-bold tracking-widest uppercase rounded-xl shadow-lg transition-all flex items-center mx-auto`}
          >
            <Send className="w-5 h-5 mr-2" /> Nous contacter
          </button>
        </div>
      </header>

      {/* Services Section */}
      {content.services && content.services.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-3xl font-bold uppercase tracking-widest mb-12 text-center ${themeStyles.accent}`}>
              Nos Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {content.services.map((service, idx) => (
                <div key={idx} className={`${themeStyles.cardBg} border ${themeStyles.border} p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300`}>
                  <h3 className="text-2xl font-bold mb-4 flex items-center">
                    <ChevronRight className={`w-6 h-6 mr-2 ${themeStyles.accent}`} />
                    {service.title}
                  </h3>
                  <p className="opacity-80 leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={`${themeStyles.cardBg} py-8 border-t ${themeStyles.border} text-center`}>
        <p className="opacity-60 text-sm">© {new Date().getFullYear()} {businessName}. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default SiteViewer;
