import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Rocket, Star, Diamond, Zap, Settings, X, ArrowRight, Paintbrush } from 'lucide-react';
import Navbar from '../Navbar';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import Swal from 'sweetalert2';

const Landing = () => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSlug, setEditSlug] = useState('');
  const [editPin, setEditPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [siteName, setSiteName] = useState('');

  const handleForgotPin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/microsites/forgot-pin`, { ownerEmail: forgotEmail });
      Swal.fire({
        icon: 'success',
        title: 'Envoyé !',
        text: res.data.message,
        background: '#0a0a10',
        color: '#fff',
        confirmButtonColor: '#7b2ff7'
      });
      setIsForgotMode(false);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.response?.data?.message || 'Impossible d\'envoyer l\'email.',
        background: '#0a0a10',
        color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = (plan) => {
    const message = `Bonjour Abdou, je suis intéressé par la création d'un site web (Forfait ${plan}). Pouvons-nous en discuter ?`;
    window.open(`https://wa.me/221711696897?text=${encodeURIComponent(message)}`, '_blank');
  };

  const closeModals = () => {
    setShowEditModal(false);
    setIsForgotMode(false);
  };

  const handleEditLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/microsites/auth`, { slug: editSlug, pinCode: editPin });
      // If success, save data to sessionStorage and navigate to builder in edit mode
      sessionStorage.setItem('editSiteData', JSON.stringify(res.data));
      navigate('/builder?edit=true');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.response?.data?.message || 'Identifiants invalides.',
        background: '#0a0a10',
        color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white font-['Rajdhani']">
      <Navbar />

      <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in bg-black/20 backdrop-blur-lg p-6 md:p-8 rounded-2xl border border-white/20 max-w-4xl mx-auto shadow-2xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-widest uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] drop-shadow-md">
            Créez votre Site Web Pro
          </h1>
          <p className="text-xl text-white font-medium max-w-3xl mx-auto drop-shadow-md">
            Démarque-vous sur internet avec un site web moderne, rapide et adapté à votre budget. Choisissez votre forfait ci-dessous.
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
            <p className="text-gray-200 text-sm mb-6 flex-grow font-medium drop-shadow-md">Idéal pour démarrer. Un site vitrine d'une page élégant et rapide, généré instantanément.</p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Site 1 page (Landing Page)</li>
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Thème Modulable au choix</li>
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> 100% Responsive Mobile</li>
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Lien classia.com/site/...</li>
            </ul>

            <div className="w-full mt-8 p-5 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl relative overflow-hidden group/cta">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-neon-blue)]/10 to-[var(--color-neon-purple)]/10 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex flex-col sm:flex-row gap-3 relative z-10 mt-6">
                <button 
                  onClick={() => navigate('/builder')}
                  className="w-full sm:w-1/2 px-4 py-3 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] text-white rounded-xl font-bold uppercase tracking-wider transition-all hover:shadow-[0_0_20px_rgba(186,85,211,0.6)] hover:-translate-y-1 flex items-center justify-center text-sm"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Créer un site
                </button>
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="w-full sm:w-1/2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold uppercase tracking-wider transition-all hover:border-[var(--color-neon-blue)]/50 flex items-center justify-center text-sm"
                >
                  <Settings className="w-4 h-4 mr-2 text-[var(--color-neon-blue)]" />
                  Modifier
                </button>
              </div>


            </div>
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
            <p className="text-gray-200 text-sm mb-6 flex-grow font-medium drop-shadow-md">Un site multi-pages complet avec un design personnalisé par notre agence digitale.</p>
            
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
            <p className="text-gray-200 text-sm mb-6 flex-grow font-medium drop-shadow-md">Le summum de la présence en ligne avec animations et fonctionnalités poussées.</p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Site 5 à 10 pages</li>
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Animations & Design Immersif</li>
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Formulaires complexes & Réservations</li>
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Intégration Réseaux Sociaux & Pixel</li>
            </ul>

            <button 
              onClick={() => handleWhatsApp('Premium')}
              className="w-full py-3 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] text-white rounded-xl font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(186,85,211,0.5)] transition-all"
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
            <p className="text-gray-200 text-sm mb-6 flex-grow font-medium drop-shadow-md">Vous avez un projet de grande envergure (E-commerce géant, SaaS, Portail web) ?</p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Pages illimitées</li>
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Développement d'applications web</li>
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> Bases de données sur mesure</li>
              <li className="flex items-start text-sm"><CheckCircle2 className="w-4 h-4 text-green-400 mr-2 mt-0.5" /> E-commerce avancé & Paiements</li>
            </ul>

            <button 
              onClick={() => handleWhatsApp('Sur-Mesure')}
              className="w-full py-3 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] text-white rounded-xl font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(186,85,211,0.5)] transition-all"
            >
              Demander un devis
            </button>
          </div>

        </div>
      </div>



      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0a0a10] border border-[var(--color-neon-purple)]/30 rounded-2xl p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(186,85,211,0.1)]">
            <button 
              onClick={closeModals}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold mb-2 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)]">
              {isForgotMode ? 'Code PIN Oublié' : 'Modifier mon site'}
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              {isForgotMode 
                ? "Entrez le lien de votre site et votre adresse email. Nous vous enverrons votre Code PIN par email." 
                : "Entrez vos accès pour mettre à jour le contenu de votre site."}
            </p>

            {isForgotMode ? (
              <form onSubmit={handleForgotPin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email du propriétaire</label>
                  <input 
                    type="email" 
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-purple)]" 
                    placeholder="contact@email.com"
                  />
                </div>

                <div className="flex flex-col gap-3 mt-6">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[var(--color-neon-purple)]/20 text-[var(--color-neon-purple)] border border-[var(--color-neon-purple)] rounded-xl font-bold uppercase tracking-widest hover:bg-[var(--color-neon-purple)] hover:text-white transition-all disabled:opacity-50"
                  >
                    {loading ? 'Envoi...' : 'Recevoir mon PIN par Email'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsForgotMode(false)}
                    className="w-full py-3 bg-transparent text-gray-400 font-bold uppercase tracking-widest hover:text-white text-sm"
                  >
                    Retour à la connexion
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleEditLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Lien du site (Slug)</label>
                  <div className="flex">
                    <span className="bg-[#1a1a24] border border-white/10 border-r-0 rounded-l-lg px-3 py-3 text-gray-500 text-sm">classia.com/site/</span>
                    <input 
                      type="text" 
                      value={editSlug}
                      onChange={(e) => setEditSlug(e.target.value)}
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-r-lg px-3 py-3 text-white focus:outline-none focus:border-[var(--color-neon-purple)]" 
                      placeholder="le-teranga"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Code PIN Secret</label>
                    <button 
                      type="button"
                      onClick={() => setIsForgotMode(true)}
                      className="text-xs text-[var(--color-neon-blue)] hover:underline"
                    >
                      Oublié ?
                    </button>
                  </div>
                  <input 
                    type="password" 
                    value={editPin}
                    onChange={(e) => setEditPin(e.target.value)}
                    required
                    maxLength={4}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-center tracking-[1em] text-white focus:outline-none focus:border-[var(--color-neon-purple)]" 
                    placeholder="••••"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 py-3 bg-[var(--color-neon-purple)]/20 text-[var(--color-neon-purple)] border border-[var(--color-neon-purple)] rounded-xl font-bold uppercase tracking-widest hover:bg-[var(--color-neon-purple)] hover:text-white transition-all disabled:opacity-50"
                >
                  {loading ? 'Connexion...' : 'Accéder au Builder'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Background Decor */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-neon-blue)]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-neon-purple)]/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};

export default Landing;
