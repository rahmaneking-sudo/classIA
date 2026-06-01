import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import { Lock, MessageCircle, LayoutDashboard } from 'lucide-react';
import ThemeRenderer from './ThemeRenderer';

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
    
    // Auto-refresh polling if site is inactive
    let interval;
    if (siteData && !siteData.isActive) {
      interval = setInterval(() => {
        fetchSite();
      }, 10000); // Check every 10 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [slug, siteData?.isActive]);

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
        <div className="bg-[#0a0a10]/80 border border-[var(--color-neon-purple)]/50 rounded-2xl p-8 max-w-lg w-full text-center backdrop-blur-md relative overflow-hidden shadow-[0_0_30px_rgba(186,85,211,0.2)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)]"></div>
          
          <div className="bg-[var(--color-neon-purple)]/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-[var(--color-neon-purple)]" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)]">Site en attente d'activation</h1>
          <p className="text-gray-400 mb-8">
            Votre site <strong className="text-white">{siteData.businessName}</strong> a été généré avec succès ! <br/><br/>
            Il a exactement le même design que ce que vous avez vu dans la prévisualisation en direct. Pour le rendre visible au public, veuillez procéder au règlement des frais de création.
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
          
          <p className="text-xs text-gray-500 mt-6">Une fois le paiement effectué, votre site sera activé instantanément par notre équipe et le lien <span className="text-[var(--color-neon-blue)]">classia.com/site/{siteData.slug}</span> sera en ligne.</p>
        </div>
      </div>
    );
  }

  // --- RENDU DU SITE ACTIF VIA LE THEME RENDERER ---
  return (
    <div className="relative">
      <ThemeRenderer data={siteData} />
      
      {/* Badge "Créé avec ClassIA" (Optionnel) */}
      <a href="/creation-site" target="_blank" rel="noopener noreferrer" className="fixed bottom-4 right-4 bg-black/80 backdrop-blur border border-white/10 text-white text-xs px-3 py-2 rounded-full flex items-center z-50 hover:bg-black transition-colors font-['Rajdhani']">
        <LayoutDashboard className="w-3 h-3 mr-2 text-[var(--color-neon-purple)]" />
        Créé avec ClassIA
      </a>
    </div>
  );
};

export default SiteViewer;
