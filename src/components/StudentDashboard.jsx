import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import Swal from 'sweetalert2';

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
    <div className="min-h-screen bg-[#020205] text-white p-6 md:p-12 font-['Rajdhani']">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 bg-[#0a0a10]/80 p-6 rounded-2xl border border-[var(--color-neon-blue)]/20 shadow-[0_0_30px_rgba(0,212,255,0.05)] backdrop-blur-md">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] tracking-wider">
              PORTAIL ÉTUDIANT
            </h1>
            <p className="text-gray-400 mt-2">Bienvenue, {studentName}</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mt-6 md:mt-0">
            <button 
              onClick={handleChangePassword}
              className="px-6 py-2 border border-[var(--color-neon-blue)]/50 text-[var(--color-neon-blue)] rounded-lg hover:bg-[var(--color-neon-blue)]/10 hover:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all font-bold tracking-widest uppercase text-sm"
            >
              Changer Mot de passe
            </button>
            <button 
              onClick={handleLogout}
              className="px-6 py-2 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all font-bold tracking-widest uppercase text-sm"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Coming Soon Area */}
        <div className="relative bg-[#0a0a10]/80 p-12 rounded-3xl border border-[var(--color-neon-blue)]/30 backdrop-blur-md overflow-hidden flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-blue)]/10 to-[var(--color-neon-purple)]/10 opacity-50" />
          
          <div className="text-8xl mb-6 relative z-10 animate-bounce">🎓</div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-widest uppercase relative z-10">
            Félicitations !
          </h2>
          
          <p className="text-gray-300 max-w-lg text-lg mb-8 relative z-10">
            Tu es officiellement inscrit(e) à CLASSE IA. La plateforme de cours est actuellement en cours de finalisation par nos experts. 
          </p>
          
          <div className="inline-block border border-[var(--color-neon-blue)]/50 bg-[var(--color-neon-blue)]/10 px-8 py-4 rounded-xl relative z-10">
            <span className="text-[var(--color-neon-blue)] font-bold tracking-widest uppercase animate-pulse">
              Les modules seront disponibles très bientôt
            </span>
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
