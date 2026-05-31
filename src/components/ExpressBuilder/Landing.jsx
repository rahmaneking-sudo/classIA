import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Rocket, Star, Diamond, Zap } from 'lucide-react';
import Navbar from '../Navbar';

const Landing = () => {
  const navigate = useNavigate();

  const handleWhatsApp = (plan) => {
    const message = `Bonjour Abdou, je suis intéressé par la création d'un site web (Forfait ${plan}). Pouvons-nous en discuter ?`;
    window.open(`https://wa.me/221711696897?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen text-white font-['Rajdhani']">
      <Navbar />

      <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold tracking-widest uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)]">
            Créez votre Site Web Pro
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
            Démarquez-vous sur internet avec un site web moderne, rapide et adapté à votre budget. Choisissez votre forfait ci-dessous.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* BASIQUE */}
          <div className="bg-[#0a0a10]/80 border border-white/10 rounded-2xl p-8 hover:border-[var(--color-neon-blue)]/50 transition-all flex flex-col backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <Zap className="text-[var(--color-neon-blue)] w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Basique</h3>
            <div className="text-3xl font-bold text-[var(--color-neon-blue)] mb-6">50 000 <span className="text-lg text-gray-500">FCFA</span></div>
            <p className="text-gray-400 text-sm mb-6 flex-grow">Idéal pour démarrer. Un site vitrine d'une page élégant et rapide, généré instantanément.</p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Site 1 page (Landing Page)</li>
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Thème Modulable au choix</li>
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> 100% Responsive Mobile</li>
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Lien classia.com/site/...</li>
            </ul>

            <button 
              onClick={() => navigate('/builder')}
              className="w-full py-3 bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-blue)] border border-[var(--color-neon-blue)] rounded-xl font-bold uppercase tracking-widest hover:bg-[var(--color-neon-blue)] hover:text-white transition-all"
            >
              Créer mon site
            </button>
          </div>

          {/* STANDARD */}
          <div className="bg-gradient-to-b from-[#111122] to-[#0a0a10] border border-[var(--color-neon-purple)]/50 rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(186,85,211,0.2)] transition-all flex flex-col backdrop-blur-md relative transform md:-translate-y-4">
            <div className="absolute top-0 right-0 p-4">
              <Star className="text-[var(--color-neon-purple)] w-8 h-8" />
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[var(--color-neon-purple)] text-white text-xs font-bold px-3 py-1 rounded-b-lg uppercase tracking-wider">
              Le plus populaire
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 mt-4">Standard</h3>
            <div className="text-3xl font-bold text-[var(--color-neon-purple)] mb-6">100 000 <span className="text-lg text-gray-500">FCFA</span></div>
            <p className="text-gray-400 text-sm mb-6 flex-grow">Un site multi-pages complet avec un design personnalisé par notre agence digitale.</p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Site 3 à 5 pages</li>
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Design 100% Personnalisé</li>
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Optimisation SEO de base</li>
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Nom de domaine (.com) offert 1 an</li>
            </ul>

            <button 
              onClick={() => handleWhatsApp('Standard')}
              className="w-full py-3 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] text-white rounded-xl font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(186,85,211,0.5)] transition-all"
            >
              Demander un devis
            </button>
          </div>

          {/* PREMIUM */}
          <div className="bg-[#0a0a10]/80 border border-white/10 rounded-2xl p-8 hover:border-[var(--color-neon-blue)]/50 transition-all flex flex-col backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <Rocket className="text-white w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
            <div className="text-3xl font-bold text-white mb-6">200 000 <span className="text-lg text-gray-500">FCFA</span></div>
            <p className="text-gray-400 text-sm mb-6 flex-grow">Le summum de la présence en ligne avec animations et fonctionnalités poussées.</p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Site 5 à 10 pages</li>
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Animations & Design Immersif</li>
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Formulaires complexes & Réservations</li>
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Intégration Réseaux Sociaux & Pixel</li>
            </ul>

            <button 
              onClick={() => handleWhatsApp('Premium')}
              className="w-full py-3 bg-white/10 text-white border border-white/20 rounded-xl font-bold uppercase tracking-widest hover:bg-white/20 transition-all"
            >
              Demander un devis
            </button>
          </div>

          {/* SUR-MESURE */}
          <div className="bg-[#0a0a10]/80 border border-white/10 rounded-2xl p-8 hover:border-gray-500/50 transition-all flex flex-col backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <Diamond className="text-gray-400 w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Sur-mesure</h3>
            <div className="text-3xl font-bold text-gray-400 mb-6">400 000+ <span className="text-lg text-gray-600">FCFA</span></div>
            <p className="text-gray-400 text-sm mb-6 flex-grow">Vous avez un projet de grande envergure (E-commerce géant, SaaS, Portail web) ?</p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Pages illimitées</li>
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Développement d'applications web</li>
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Bases de données sur mesure</li>
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> E-commerce avancé & Paiements</li>
            </ul>

            <button 
              onClick={() => handleWhatsApp('Sur-Mesure')}
              className="w-full py-3 bg-transparent text-gray-400 border border-gray-600 rounded-xl font-bold uppercase tracking-widest hover:text-white hover:border-white transition-all"
            >
              Contactez-nous
            </button>
          </div>

        </div>
      </div>

      {/* Background Decor */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-neon-blue)]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-neon-purple)]/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};

export default Landing;
