import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Globe, FileText, CheckCircle2, Clock, PlayCircle } from 'lucide-react';
import Navbar from './Navbar';

const ClientDashboard = () => {
  const [client, setClient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('clientToken');
    const clientData = localStorage.getItem('clientData');
    
    if (!token || !clientData) {
      navigate('/client/login');
      return;
    }
    
    setClient(JSON.parse(clientData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientData');
    navigate('/client/login');
  };

  if (!client) return null;

  return (
    <div className="min-h-screen text-white font-['Rajdhani']">
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto relative z-10 animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 bg-black/20 backdrop-blur-lg p-6 md:p-8 rounded-2xl border border-white/20 shadow-2xl">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-widest uppercase mb-2 drop-shadow-md">
              Espace <span className="text-[var(--color-neon-blue)]">Client</span>
            </h1>
            <p className="text-gray-200 font-medium drop-shadow-md">Bienvenue, {client.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-6 md:mt-0 flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 border border-red-500/30 transition-all font-bold uppercase tracking-wider text-sm"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>

        {/* Project Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#0a0a10]/80 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="text-[var(--color-neon-purple)] text-xs font-bold uppercase tracking-widest mb-2">Votre Forfait</div>
            <div className="text-3xl font-bold text-white">{client.plan}</div>
          </div>
          
          <div className="md:col-span-2 bg-[#0a0a10]/80 p-8 rounded-2xl border border-[var(--color-neon-blue)]/30 backdrop-blur-md shadow-[0_0_20px_rgba(0,212,255,0.1)]">
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">État d'avancement du projet</div>
            <div className="flex items-center gap-4">
              {client.projectStatus === 'Terminé' ? (
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              ) : client.projectStatus === 'En révision' ? (
                <PlayCircle className="w-12 h-12 text-yellow-500" />
              ) : (
                <Clock className="w-12 h-12 text-[var(--color-neon-blue)] animate-pulse" />
              )}
              <div>
                <div className="text-2xl font-bold text-white mb-1 uppercase tracking-wider">{client.projectStatus}</div>
                <p className="text-sm text-gray-400">
                  {client.projectStatus === 'En attente' && "Votre projet va bientôt démarrer."}
                  {client.projectStatus === 'En conception' && "Notre équipe travaille sur le design et le développement de votre site."}
                  {client.projectStatus === 'En révision' && "Veuillez consulter la maquette pour validation."}
                  {client.projectStatus === 'Terminé' && "Votre site est en ligne et fonctionnel !"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-8 rounded-2xl border backdrop-blur-md transition-all ${client.demoUrl ? 'bg-gradient-to-br from-[var(--color-neon-blue)]/10 to-transparent border-[var(--color-neon-blue)]/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.2)]' : 'bg-[#0a0a10]/50 border-white/5 opacity-50'}`}>
            <Globe className={`w-8 h-8 mb-4 ${client.demoUrl ? 'text-[var(--color-neon-blue)]' : 'text-gray-600'}`} />
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Maquette / Site</h3>
            <p className="text-gray-400 text-sm mb-6">
              {client.demoUrl ? 'Consultez la version actuelle de votre site web.' : 'Le lien sera disponible prochainement.'}
            </p>
            {client.demoUrl && (
              <a href={client.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-2 bg-[var(--color-neon-blue)] text-black font-bold uppercase tracking-widest text-sm rounded-lg hover:shadow-[0_0_15px_rgba(0,212,255,0.5)] transition-all">
                Voir le site
              </a>
            )}
          </div>

          <div className={`p-8 rounded-2xl border backdrop-blur-md transition-all ${client.invoiceUrl ? 'bg-gradient-to-br from-[var(--color-neon-purple)]/10 to-transparent border-[var(--color-neon-purple)]/50 hover:shadow-[0_0_20px_rgba(186,85,211,0.2)]' : 'bg-[#0a0a10]/50 border-white/5 opacity-50'}`}>
            <FileText className={`w-8 h-8 mb-4 ${client.invoiceUrl ? 'text-[var(--color-neon-purple)]' : 'text-gray-600'}`} />
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Devis / Facture</h3>
            <p className="text-gray-400 text-sm mb-6">
              {client.invoiceUrl ? 'Consultez ou réglez vos documents de facturation.' : 'Aucun document disponible.'}
            </p>
            {client.invoiceUrl && (
              <a href={client.invoiceUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-2 bg-[var(--color-neon-purple)] text-white font-bold uppercase tracking-widest text-sm rounded-lg hover:shadow-[0_0_15px_rgba(186,85,211,0.5)] transition-all">
                Voir le document
              </a>
            )}
          </div>
        </div>

      </div>

      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-neon-blue)]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-neon-purple)]/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};

export default ClientDashboard;
