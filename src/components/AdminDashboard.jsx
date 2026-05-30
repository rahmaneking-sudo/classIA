import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeads = async () => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        navigate('/admin/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5001/api/leads', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setLeads(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        } else {
          setError('Erreur lors du chargement des données');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleActivate = async (leadId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:5001/api/leads/${leadId}/activate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state to reflect activation
      setLeads(leads.map(lead => 
        lead._id === leadId 
          ? { ...lead, isActive: true, status: 'inscrit' } 
          : lead
      ));
      
      Swal.fire({
        title: 'Profil Étudiant',
        text: 'L\'étudiant a été validé avec succès ! Un message de bienvenue lui a été envoyé.',
        icon: 'success',
        confirmButtonText: 'Super !',
        background: '#0a0a10',
        color: '#fff',
        confirmButtonColor: '#bd00ff'
      });
    } catch (err) {
      Swal.fire({
        title: 'Erreur',
        text: 'Impossible d\'activer cet étudiant.',
        icon: 'error',
        background: '#0a0a10',
        color: '#fff'
      });
    }
  };

  const handleDeactivate = async (leadId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:5001/api/leads/${leadId}/deactivate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state to reflect deactivation
      setLeads(leads.map(lead => 
        lead._id === leadId 
          ? { ...lead, isActive: false, status: 'nouveau' } 
          : lead
      ));
      
      Swal.fire({
        title: 'Désactivation',
        text: 'Le compte de l\'étudiant a été désactivé.',
        icon: 'info',
        confirmButtonText: 'Compris',
        background: '#0a0a10',
        color: '#fff',
        confirmButtonColor: '#bd00ff'
      });
    } catch (err) {
      Swal.fire({
        title: 'Erreur',
        text: 'Impossible de désactiver cet étudiant.',
        icon: 'error',
        background: '#0a0a10',
        color: '#fff'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white p-6 md:p-12 font-['Rajdhani']">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 bg-[#0a0a10]/80 p-6 rounded-2xl border border-[var(--color-neon-blue)]/20 shadow-[0_0_30px_rgba(0,212,255,0.05)] backdrop-blur-md">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] tracking-wider">
              DASHBOARD CLASSE IA
            </h1>
            <p className="text-gray-400 mt-2">Gestion des étudiants et prospects</p>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-6 md:mt-0 px-6 py-2 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all font-bold tracking-widest uppercase text-sm"
          >
            Déconnexion
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#0a0a10]/80 p-6 rounded-2xl border border-[var(--color-neon-blue)]/30 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon-blue)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-2">Total Inscrits</h3>
            <p className="text-5xl font-bold text-white">{leads.length}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#0a0a10]/80 rounded-2xl border border-white/10 backdrop-blur-md overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold tracking-widest">LISTE DES CONTACTS</h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center text-[var(--color-neon-blue)] animate-pulse">
              Chargement des données stellaires...
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-500">{error}</div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center text-gray-400">Aucun inscrit pour le moment.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest">
                    <th className="p-4 border-b border-white/10 font-bold">Nom</th>
                    <th className="p-4 border-b border-white/10 font-bold">Email</th>
                    <th className="p-4 border-b border-white/10 font-bold">Téléphone</th>
                    <th className="p-4 border-b border-white/10 font-bold">Statut</th>
                    <th className="p-4 border-b border-white/10 font-bold">Date d'inscription</th>
                    <th className="p-4 border-b border-white/10 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white">{lead.name}</td>
                      <td className="p-4 text-gray-300">{lead.email}</td>
                      <td className="p-4 text-[var(--color-neon-blue)]">{lead.phone}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${lead.isActive ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'}`}>
                          {lead.isActive ? 'Actif' : lead.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {new Date(lead.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="p-4 text-right">
                        {!lead.isActive ? (
                          <button
                            onClick={() => handleActivate(lead._id)}
                            className="bg-[var(--color-neon-purple)]/20 text-[var(--color-neon-purple)] border border-[var(--color-neon-purple)] px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-[var(--color-neon-purple)]/40 hover:shadow-[0_0_15px_rgba(186,85,211,0.4)] transition-all"
                          >
                            Activer
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDeactivate(lead._id)}
                            className="bg-red-500/10 text-red-500 border border-red-500/30 px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all"
                          >
                            Désactiver
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
      
      {/* Background elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-neon-blue)]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-neon-purple)]/10 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};

export default AdminDashboard;
