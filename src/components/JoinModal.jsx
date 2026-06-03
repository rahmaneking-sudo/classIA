import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import API_BASE_URL from '../config/api';

const JoinModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [createdLeadId, setCreatedLeadId] = useState(null);
  const [wavePhone, setWavePhone] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, payment, polling, error
  const [errorMessage, setErrorMessage] = useState('');

  // Polling effect
  useEffect(() => {
    let interval;
    if (status === 'polling') {
      interval = setInterval(async () => {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/student-login`, {
            email: formData.email,
            password: formData.phone
          });
          
          if (response.data.token) {
            clearInterval(interval);
            localStorage.setItem('studentToken', response.data.token);
            localStorage.setItem('studentInfo', JSON.stringify(response.data));
            window.location.href = '/student/dashboard'; // Redirige vers le dashboard étudiant
          }
        } catch (err) {
          // Normal, compte pas encore activé
        }
      }, 5000); // Check every 5 seconds
    }
    return () => clearInterval(interval);
  }, [status, formData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/leads`, formData);
      setCreatedLeadId(response.data._id);
      setStatus('payment');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  };

  const handlePaymentComplete = async () => {
    if (!wavePhone.trim()) {
      Swal.fire({
        background: '#0a0a10',
        color: '#ffffff',
        icon: 'warning',
        title: 'Information manquante',
        text: "Veuillez saisir le numéro de téléphone que vous avez utilisé pour le paiement Wave.",
        confirmButtonColor: '#7b2ff7',
        confirmButtonText: 'Compris',
        customClass: {
          popup: 'border border-[var(--color-neon-blue)]/30 rounded-2xl backdrop-blur-xl',
        }
      });
      return;
    }

    setStatus('loading');
    try {
      await axios.post(`${API_BASE_URL}/notify-payment`, {
        type: 'course',
        id: createdLeadId,
        name: formData.name,
        identifier: `${formData.email} (Wave: ${wavePhone})`,
        amount: 10000
      });
      setStatus('polling');
    } catch (err) {
      setStatus('polling');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#020205]/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#0a0a10] border-2 border-[var(--color-neon-blue)] rounded-2xl shadow-[0_0_50px_rgba(0,212,255,0.2)] p-8 overflow-hidden animate-[fade-in_0.3s_ease-out]">
        
        {/* Glow effect */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[var(--color-neon-purple)]/30 blur-[80px] rounded-full pointer-events-none" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl z-10"
        >
          ✕
        </button>

        {status === 'payment' ? (
          <div className="text-center py-8 relative z-10 animate-[fade-in_0.3s_ease-out]">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] mb-4 uppercase tracking-widest">
              PAIEMENT REQUIS
            </h2>
            <p className="text-gray-300 mb-6 text-sm">
              <span className="block mb-2 font-bold text-white">Étape 1 :</span>
              Cliquez sur le bouton ci-dessous pour payer <strong className="text-[var(--color-neon-blue)]">10 000 FCFA</strong> via Wave.
            </p>
            
            <a 
              href="https://pay.wave.com/m/M_sn_gsBAcsJlO1IE/c/sn/?amount=10000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full btn-sci-fi bg-[#00a2ff]/20 border-2 border-[#00a2ff] text-white font-bold py-4 rounded-lg uppercase tracking-widest hover:bg-[#00a2ff]/40 hover:shadow-[0_0_20px_rgba(0,162,255,0.4)] transition-all mb-8"
            >
              Payer avec Wave (10 000 FCFA)
            </a>

            <div className="bg-black/40 border border-gray-700 p-4 rounded-lg mb-4 text-left">
              <span className="block mb-3 font-bold text-white text-sm">Étape 2 : Confirmez votre paiement</span>
              <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">Numéro Wave utilisé</label>
              <input
                type="tel"
                required
                value={wavePhone}
                onChange={(e) => setWavePhone(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)] focus:ring-1 focus:ring-[var(--color-neon-blue)] transition-all mb-4"
                placeholder="Ex: 77 000 00 00"
              />
              <button 
                onClick={handlePaymentComplete}
                className="w-full btn-sci-fi bg-[var(--color-neon-purple)]/20 border border-[var(--color-neon-purple)] text-white font-bold py-3 rounded-lg hover:bg-[var(--color-neon-purple)]/40 transition-colors uppercase tracking-wider"
              >
                Valider mon paiement
              </button>
            </div>
          </div>
        ) : status === 'polling' ? (
          <div className="text-center py-12 relative z-10 animate-[fade-in_0.3s_ease-out]">
            <div className="inline-block w-16 h-16 border-4 border-[var(--color-neon-blue)] border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-4">
              VÉRIFICATION EN COURS...
            </h2>
            <p className="text-gray-300 text-sm">
              Ne fermez pas cette page. Nous attendons la validation de votre paiement par notre équipe. 
            </p>
            <p className="text-[var(--color-neon-blue)] text-xs mt-4 animate-pulse">
              Vous serez automatiquement redirigé vers l'espace étudiant une fois validé.
            </p>
          </div>
        ) : (
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-widest">
              REJOINDRE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)]">CLASSE IA</span>
            </h2>
            <p className="text-gray-400 mb-8 text-sm">
              Inscris-toi maintenant pour maîtriser les outils IA de demain.
            </p>

            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">Nom Complet</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)] focus:ring-1 focus:ring-[var(--color-neon-blue)] transition-all"
                  placeholder="Ex: Abdou Ndiaye"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)] focus:ring-1 focus:ring-[var(--color-neon-blue)] transition-all"
                  placeholder="Ex: abdou@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">Téléphone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)] focus:ring-1 focus:ring-[var(--color-neon-blue)] transition-all"
                  placeholder="Ex: +221 77 000 00 00"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full btn-sci-fi bg-[var(--color-neon-blue)]/20 border-2 border-[var(--color-neon-blue)] text-white font-bold py-4 rounded-lg uppercase tracking-widest hover:bg-[var(--color-neon-blue)]/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all mt-6 disabled:opacity-50"
              >
                {status === 'loading' ? 'Envoi en cours...' : 'Soumettre ma candidature'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinModal;
