import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import Swal from 'sweetalert2';
import { Plus, Trash2, Edit2, ExternalLink } from 'lucide-react';

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    plan: 'Standard',
    projectStatus: 'En conception',
    demoUrl: '',
    invoiceUrl: ''
  });

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/clients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(response.data);
    } catch (err) {
      setError('Impossible de charger les clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      
      if (editingClient) {
        // Edit mode (status and links)
        await axios.put(`${API_BASE_URL}/clients`, { 
          id: editingClient._id,
          projectStatus: formData.projectStatus,
          demoUrl: formData.demoUrl,
          invoiceUrl: formData.invoiceUrl
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create mode
        await axios.post(`${API_BASE_URL}/clients`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      Swal.fire({
        title: 'Succès',
        text: editingClient ? 'Client mis à jour !' : 'Client créé avec succès !',
        icon: 'success',
        background: '#0a0a10',
        color: '#fff'
      });
      
      setShowModal(false);
      setEditingClient(null);
      setFormData({
        name: '', email: '', phone: '', password: '', plan: 'Standard', projectStatus: 'En conception', demoUrl: '', invoiceUrl: ''
      });
      fetchClients();
    } catch (err) {
      Swal.fire({
        title: 'Erreur',
        text: err.response?.data?.message || 'Une erreur est survenue',
        icon: 'error',
        background: '#0a0a10',
        color: '#fff'
      });
    }
  };

  const openEditModal = (client) => {
    setEditingClient(client);
    setFormData({
      ...client,
      password: '' // Don't show password
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce client ?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`${API_BASE_URL}/clients`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { id }
        });
        fetchClients();
      } catch (err) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  return (
    <div className="bg-[#0a0a10]/80 rounded-2xl border border-white/10 backdrop-blur-md overflow-hidden p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-widest text-[var(--color-neon-blue)]">CLIENTS AGENCE (DEVIS)</h2>
        <button 
          onClick={() => {
            setEditingClient(null);
            setFormData({ name: '', email: '', phone: '', password: '', plan: 'Standard', projectStatus: 'En conception', demoUrl: '', invoiceUrl: '' });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-blue)] border border-[var(--color-neon-blue)] px-4 py-2 rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-[var(--color-neon-blue)]/40 transition-all"
        >
          <Plus className="w-4 h-4" /> Ajouter un client
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-[var(--color-neon-blue)] animate-pulse">Chargement des clients...</div>
      ) : clients.length === 0 ? (
        <div className="text-center py-10 text-gray-500">Aucun client enregistré.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest">
                <th className="p-4 border-b border-white/10 font-bold">Client</th>
                <th className="p-4 border-b border-white/10 font-bold">Contact</th>
                <th className="p-4 border-b border-white/10 font-bold">Forfait</th>
                <th className="p-4 border-b border-white/10 font-bold">Statut</th>
                <th className="p-4 border-b border-white/10 font-bold">Liens</th>
                <th className="p-4 border-b border-white/10 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white">{client.name}</div>
                    <div className="text-xs text-gray-500">Inscrit le {new Date(client.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-300">{client.email}</div>
                    <div className="text-[var(--color-neon-blue)] text-sm">{client.phone}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-[var(--color-neon-purple)]/20 text-[var(--color-neon-purple)] px-3 py-1 rounded-full text-xs font-bold uppercase border border-[var(--color-neon-purple)]/30">
                      {client.plan}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-300 font-medium">
                      {client.projectStatus}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    {client.demoUrl && (
                      <a href={client.demoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300" title="Lien de démo/maquette">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEditModal(client)} className="text-yellow-500 hover:text-yellow-400 mr-3">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(client._id)} className="text-red-500 hover:text-red-400">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#11111a] border border-[#2a2a35] rounded-2xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest border-b border-white/10 pb-3">
              {editingClient ? 'Modifier le projet client' : 'Ajouter un nouveau client'}
            </h3>
            
            <form onSubmit={handleCreate} className="space-y-4">
              {!editingClient && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Nom complet</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Forfait</label>
                      <select name="plan" value={formData.plan} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white">
                        <option value="Standard">Standard</option>
                        <option value="Premium">Premium</option>
                        <option value="Sur-mesure">Sur-mesure</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Email (Identifiant)</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Téléphone</label>
                      <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Mot de passe provisoire (pour le portail client)</label>
                    <input type="text" name="password" value={formData.password} onChange={handleInputChange} required className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white" placeholder="Ex: classia2026" />
                  </div>
                </>
              )}

              {/* Status & Links (Editable) */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Statut du projet</label>
                <select name="projectStatus" value={formData.projectStatus} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-[var(--color-neon-blue)] font-bold">
                  <option value="En attente">En attente</option>
                  <option value="En conception">En conception</option>
                  <option value="En révision">En révision</option>
                  <option value="Terminé">Terminé</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1">Lien de la maquette / site final (optionnel)</label>
                <input type="url" name="demoUrl" value={formData.demoUrl} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white" placeholder="https://" />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Lien de facturation / Devis (optionnel)</label>
                <input type="url" name="invoiceUrl" value={formData.invoiceUrl} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white" placeholder="https://" />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-600 text-gray-400 rounded-lg hover:bg-gray-800 transition-colors uppercase font-bold text-sm tracking-wider">
                  Annuler
                </button>
                <button type="submit" className="flex-1 py-3 bg-[var(--color-neon-blue)] text-black rounded-lg hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all uppercase font-bold text-sm tracking-wider">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClients;
