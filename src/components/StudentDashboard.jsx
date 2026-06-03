import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import Swal from 'sweetalert2';
import { LogOut, PlayCircle, Sparkles, ChevronRight, BookOpen, Crown } from 'lucide-react';

const StudentDashboard = () => {
  const [studentName, setStudentName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('studentToken');
    const name = localStorage.getItem('studentName');
    
    if (!token) {
      navigate('/login');
    } else {
      setStudentName(name);
      
      // Show security toast once per session
      if (!sessionStorage.getItem('securityToastShown')) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
          background: '#0a0a10',
          color: '#fff',
          iconColor: '#00d4ff',
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });

        Toast.fire({
          icon: 'info',
          title: 'Sécurité',
          text: 'Pensez à modifier votre mot de passe par défaut.'
        });
        
        sessionStorage.setItem('securityToastShown', 'true');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentName');
    navigate('/login');
  };

  const handleChangePassword = () => {
    Swal.fire({
      title: 'Changer mon mot de passe',
      html: `
        <input type="password" id="old-pass" class="swal2-input" placeholder="Mot de passe actuel">
        <input type="password" id="new-pass" class="swal2-input" placeholder="Nouveau mot de passe">
      `,
      confirmButtonText: 'Valider',
      showCancelButton: true,
      cancelButtonText: 'Annuler',
      background: '#0a0a10',
      color: '#fff',
      confirmButtonColor: '#bd00ff',
      focusConfirm: false,
      preConfirm: () => {
        const oldPass = document.getElementById('old-pass').value;
        const newPass = document.getElementById('new-pass').value;
        if (!oldPass || !newPass) {
          Swal.showValidationMessage('Veuillez remplir tous les champs');
        }
        return { currentPassword: oldPass, newPassword: newPass };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('studentToken');
          await axios.put(`${API_BASE_URL}/auth/student/change-password`, result.value, {
            headers: { Authorization: `Bearer ${token}` }
          });
          Swal.fire({
            title: 'Succès',
            text: 'Ton mot de passe a été modifié avec succès !',
            icon: 'success',
            background: '#0a0a10',
            color: '#fff',
            confirmButtonColor: '#bd00ff'
          });
        } catch (error) {
          Swal.fire({
            title: 'Erreur',
            text: error.response?.data?.message || 'Impossible de modifier le mot de passe.',
            icon: 'error',
            background: '#0a0a10',
            color: '#fff'
          });
        }
      }
    });
  };

  return (
    <div className="min-h-screen text-white p-6 md:p-12 font-['Rajdhani'] relative">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 bg-black/20 backdrop-blur-lg p-6 md:p-8 rounded-2xl border border-white/20 shadow-2xl">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-widest uppercase mb-2 drop-shadow-md">
              Mon Espace <span className="text-[var(--color-neon-blue)]">Étudiant</span>
            </h1>
            <p className="text-gray-200 font-medium drop-shadow-md">Gérez vos formations, votre abonnement et suivez votre progression.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleChangePassword}
              className="mt-6 md:mt-0 px-6 py-3 border border-[var(--color-neon-blue)]/50 text-[var(--color-neon-blue)] rounded-xl hover:bg-[var(--color-neon-blue)]/10 transition-all font-bold tracking-widest uppercase text-sm"
            >
              Mot de passe
            </button>
            <button
              onClick={handleLogout}
              className="mt-6 md:mt-0 flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 border border-red-500/30 transition-all font-bold uppercase tracking-wider text-sm"
            >
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: La Classe (Cours) */}
          <div 
            onClick={() => navigate('/cours')}
            className="group cursor-pointer relative bg-[#0a0a10]/80 p-8 rounded-3xl border border-white/10 hover:border-[var(--color-neon-blue)]/50 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(0,212,255,0.2)] flex flex-col h-full"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-neon-blue)]/10 blur-[50px] rounded-full group-hover:bg-[var(--color-neon-blue)]/20 transition-all pointer-events-none" />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="w-16 h-16 bg-[var(--color-neon-blue)]/10 rounded-2xl flex items-center justify-center border border-[var(--color-neon-blue)]/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <PlayCircle className="w-8 h-8 text-[var(--color-neon-blue)]" />
              </div>
              <span className="px-4 py-1.5 bg-[var(--color-neon-blue)] text-black text-xs font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(0,212,255,0.4)]">
                Formation
              </span>
            </div>
            
            <div className="relative z-10 flex-1 flex flex-col">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider mb-4 group-hover:text-[var(--color-neon-blue)] transition-colors">
                La Classe Vidéo
              </h2>
              <p className="text-gray-300 font-medium mb-8 flex-1 leading-relaxed">
                Accédez à tous nos modules de formation, tutoriels vidéos HQ, et astuces inédites pour maîtriser l'Intelligence Artificielle.
              </p>
              
              <div className="flex items-center text-[var(--color-neon-blue)] font-bold uppercase tracking-widest text-sm group-hover:gap-4 transition-all gap-2 mt-auto">
                Accéder aux cours <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Card 2: Bibliothèque de Prompts */}
          <div 
            onClick={() => navigate('/prompts')}
            className="group cursor-pointer relative bg-[#0a0a10]/80 p-8 rounded-3xl border border-white/10 hover:border-[var(--color-neon-purple)]/50 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(186,85,211,0.2)] flex flex-col h-full"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-neon-purple)]/10 blur-[50px] rounded-full group-hover:bg-[var(--color-neon-purple)]/20 transition-all pointer-events-none" />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="w-16 h-16 bg-[var(--color-neon-purple)]/10 rounded-2xl flex items-center justify-center border border-[var(--color-neon-purple)]/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="w-8 h-8 text-[var(--color-neon-purple)]" />
              </div>
              <span className="px-4 py-1.5 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] text-white text-xs font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(186,85,211,0.4)] flex items-center gap-1">
                <Crown className="w-3 h-3" /> Premium
              </span>
            </div>
            
            <div className="relative z-10 flex-1 flex flex-col">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider mb-4 group-hover:text-[var(--color-neon-purple)] transition-colors">
                Bibliothèque de Prompts
              </h2>
              <p className="text-gray-300 font-medium mb-8 flex-1 leading-relaxed">
                Copiez et collez nos instructions secrètes pour générer des résultats professionnels avec ChatGPT, Midjourney, Claude, etc.
              </p>
              
              <div className="flex items-center text-[var(--color-neon-purple)] font-bold uppercase tracking-widest text-sm group-hover:gap-4 transition-all gap-2 mt-auto">
                Ouvrir la bibliothèque <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

      </div>
      
      {/* Background elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-neon-blue)]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-neon-purple)]/10 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};

export default StudentDashboard;
