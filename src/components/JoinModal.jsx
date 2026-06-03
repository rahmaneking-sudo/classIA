import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const JoinModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [createdLeadId, setCreatedLeadId] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

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
    setStatus('loading');
    try {
      await axios.post(`${API_BASE_URL}/notify-payment`, {
        type: 'course',
        id: createdLeadId,
        name: formData.name,
        identifier: formData.email,
        amount: 10000
      });
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setFormData({ name: '', email: '', phone: '' });
        onClose();
      }, 5000);
    } catch (err) {
      // Même si la notification échoue, on affiche le succès pour ne pas bloquer l'utilisateur
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setFormData({ name: '', email: '', phone: '' });
        onClose();
      }, 5000);
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
            <p className="text-gray-300 mb-8 text-sm">
              Votre inscription a été pré-enregistrée. Pour finaliser l'accès à la formation, veuillez procéder au paiement de <strong className="text-[var(--color-neon-blue)]">10 000 FCFA</strong> via Wave.
            </p>
            
            <a 
              href="https://pay.wave.com/m/M_sn_gsBAcsJlO1IE/c/sn/?amount=10000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full btn-sci-fi bg-[#00a2ff]/20 border-2 border-[#00a2ff] text-white font-bold py-4 rounded-lg uppercase tracking-widest hover:bg-[#00a2ff]/40 hover:shadow-[0_0_20px_rgba(0,162,255,0.4)] transition-all mb-4"
            >
              Payer avec Wave (10 000 FCFA)
            </a>

            <button 
              onClick={handlePaymentComplete}
              className="w-full text-sm py-3 border border-gray-600 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-colors uppercase font-bold tracking-wider"
            >
              J'ai effectué le paiement
            </button>
          </div>
        ) : status === 'success' ? (
          <div className="text-center py-12 relative z-10 animate-[fade-in_0.3s_ease-out]">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] mb-4">
              INSCRIPTION RÉUSSIE
            </h2>
            <p className="text-gray-300">
              Bienvenue dans le futur. Nous validons actuellement votre paiement. Vous recevrez un message de confirmation pour accéder à votre espace étudiant.
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
