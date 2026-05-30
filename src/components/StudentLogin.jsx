import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5001/api/auth/student-login', {
        email,
        password
      });

      localStorage.setItem('studentToken', response.data.token);
      localStorage.setItem('studentName', response.data.name);
      
      navigate('/student/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message;
      if (errorMsg === 'Compte étudiant introuvable') {
        Swal.fire({
          title: 'Compte inexistant',
          text: 'Soumettez d\'abord votre candidature pour pouvoir accéder à la formation.',
          icon: 'warning',
          background: '#0a0a10',
          color: '#fff',
          confirmButtonColor: '#bd00ff',
          confirmButtonText: 'Compris'
        });
      } else if (errorMsg === 'Votre compte n\'est pas encore activé') {
        Swal.fire({
          title: 'En attente',
          text: 'Votre candidature est en cours de validation par l\'administration.',
          icon: 'info',
          background: '#0a0a10',
          color: '#fff',
          confirmButtonColor: '#00d4ff',
          confirmButtonText: 'Fermer'
        });
      } else {
        Swal.fire({
          title: 'Erreur',
          text: 'Identifiants incorrects. Veuillez réessayer.',
          icon: 'error',
          background: '#0a0a10',
          color: '#fff',
          confirmButtonColor: '#ff0033'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] flex items-center justify-center p-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-neon-blue)]/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative bg-[#0a0a10]/80 backdrop-blur-xl border border-[var(--color-neon-blue)]/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,212,255,0.1)] w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-2 text-center tracking-wider uppercase">
          ESPACE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)]">ÉTUDIANT</span>
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Connecte-toi pour accéder à ta formation CLASSE IA</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)] focus:ring-1 focus:ring-[var(--color-neon-blue)] transition-all"
              placeholder="ton@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)] focus:ring-1 focus:ring-[var(--color-neon-blue)] transition-all pr-10"
                placeholder="Votre mot de passe"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-sci-fi bg-[var(--color-neon-blue)]/20 border-2 border-[var(--color-neon-blue)] text-white font-bold py-4 rounded-lg uppercase tracking-widest hover:bg-[var(--color-neon-blue)]/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion en cours...' : 'Accéder à ma formation'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-gray-400 hover:text-[var(--color-neon-blue)] transition-colors">
            &larr; Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
