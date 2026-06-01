import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import Swal from 'sweetalert2';
import { ExternalLink, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const AdminMicroSites = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/microsites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSites(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des micro-sites');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id, currentState) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(`${API_BASE_URL}/microsites`, { id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSites(sites.map(site => site._id === id ? { ...site, isActive: response.data.isActive } : site));
      
      Swal.fire({
        title: 'Succès',
        text: response.data.message,
        icon: 'success',
        background: '#0a0a10',
        color: '#fff',
        confirmButtonColor: '#bd00ff'
      });
    } catch (err) {
      Swal.fire({
        title: 'Erreur',
        text: 'Impossible de modifier le statut',
        icon: 'error',
        background: '#0a0a10',
        color: '#fff'
      });
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce site ?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_BASE_URL}/microsites/${slug}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSites(sites.filter(site => site.slug !== slug));
      Swal.fire({ title: 'Supprimé', icon: 'success', background: '#0a0a10', color: '#fff' });
    } catch (err) {
      Swal.fire({ title: 'Erreur', text: 'Impossible de supprimer', icon: 'error', background: '#0a0a10', color: '#fff' });
    }
  };

  return (
    <div className="bg-[#0a0a10]/80 rounded-2xl border border-white/10 backdrop-blur-md overflow-hidden">
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-widest uppercase">Gestion des Micro-Sites (SaaS)</h2>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[var(--color-neon-blue)] animate-pulse">Chargement des sites...</div>
      ) : error ? (
        <div className="p-12 text-center text-red-500">{error}</div>
      ) : sites.length === 0 ? (
        <div className="p-12 text-center text-gray-400">Aucun micro-site créé pour le moment.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest">
                <th className="p-4 border-b border-white/10 font-bold">Entreprise</th>
                <th className="p-4 border-b border-white/10 font-bold">Lien / URL</th>
                <th className="p-4 border-b border-white/10 font-bold">Forfait</th>
                <th className="p-4 border-b border-white/10 font-bold">Créateur</th>
                <th className="p-4 border-b border-white/10 font-bold">Statut Paiement</th>
                <th className="p-4 border-b border-white/10 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site) => (
                <tr key={site._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white">{site.businessName}</td>
                  <td className="p-4">
                    <a href={`/site/${site.slug}`} target="_blank" rel="noopener noreferrer" className="text-[var(--color-neon-blue)] flex items-center hover:underline">
                      /site/{site.slug} <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold uppercase text-white">
                      {site.tier}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-300">{site.ownerEmail}</div>
                    <div className="text-xs text-gray-500 mb-1">{site.whatsapp}</div>
                    <div className="text-xs font-mono bg-white/10 px-2 py-1 rounded inline-block text-[var(--color-neon-blue)]">
                      PIN: {site.pinCode || 'N/A'}
                    </div>
                  </td>
                  <td className="p-4">
                    {site.isActive ? (
                      <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-xs font-bold uppercase text-green-400 flex items-center w-max">
                        <CheckCircle className="w-3 h-3 mr-1" /> Payé / Actif
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-xs font-bold uppercase text-yellow-400 flex items-center w-max">
                        <XCircle className="w-3 h-3 mr-1" /> En attente
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => handleToggleActive(site._id, site.isActive)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                        site.isActive 
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50 hover:bg-orange-500/30'
                          : 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30 hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                      }`}
                    >
                      {site.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                    <button
                      onClick={() => handleDelete(site.slug)}
                      className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
                      title="Supprimer le site"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminMicroSites;
