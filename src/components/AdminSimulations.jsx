import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import Swal from 'sweetalert2';
import { Plus, Trash2, Edit2, Play, Image as ImageIcon, MonitorPlay, Video } from 'lucide-react';

const AdminSimulations = () => {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const Toast = Swal.mixin({
    background: '#0a0a10',
    color: '#ffffff',
    confirmButtonColor: '#7b2ff7',
    customClass: {
      popup: 'border border-[var(--color-neon-blue)]/30 rounded-2xl backdrop-blur-xl',
      title: 'text-[var(--color-neon-blue)] font-bold tracking-widest uppercase',
      confirmButton: 'bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] text-white px-8 py-3 rounded-lg font-bold tracking-widest uppercase hover:shadow-[0_0_20px_rgba(186,85,211,0.4)] transition-all'
    }
  });

  const initialFormState = {
    category: 'gemini',
    title: '',
    badPrompt: '',
    badMediaUrl: '',
    badMediaType: 'image',
    goodPrompt: '',
    goodMediaUrl: '',
    goodMediaType: 'youtube',
    explanation: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchSimulations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/simulations`);
      setSimulations(response.data);
    } catch (err) {
      Toast.fire('Erreur', 'Impossible de charger les simulations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchSimulations();
    };
    init();
  }, []);

  // Ouvre le formulaire automatiquement s'il n'y a pas de vidéos
  useEffect(() => {
    if (!loading && simulations.length === 0) {
      setShowForm(true);
    }
  }, [loading, simulations.length]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(`${API_BASE_URL}/simulations`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Toast.fire('Succès', 'Cours ajouté avec succès !', 'success');
      setFormData(initialFormState);
      setShowForm(false);
      fetchSimulations();
    } catch (err) {
      Toast.fire('Erreur', 'Impossible de créer le cours', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`${API_BASE_URL}/simulations/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Toast.fire('Succès', 'Cours supprimé', 'success');
        fetchSimulations();
      } catch (err) {
        Toast.fire('Erreur', 'Impossible de supprimer', 'error');
      }
    }
  };

  const getMediaIcon = (type) => {
    switch(type) {
      case 'image': return <ImageIcon className="w-4 h-4 inline mr-1" />;
      case 'youtube': return <MonitorPlay className="w-4 h-4 inline mr-1 text-red-500" />;
      case 'video': return <Video className="w-4 h-4 inline mr-1 text-[var(--color-neon-blue)]" />;
      default: return null;
    }
  };

  if (loading) return <div className="text-center p-12 text-[var(--color-neon-blue)] animate-pulse">Chargement de vos vidéos...</div>;

  return (
    <div className="bg-[#0a0a10]/80 rounded-2xl border border-white/10 backdrop-blur-md overflow-hidden">
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-widest uppercase text-white">Gestion des Cours / Vidéos</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={`${showForm ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-[var(--color-neon-blue)] text-black hover:shadow-[0_0_15px_rgba(0,212,255,0.4)]'} px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all uppercase tracking-widest text-sm`}
        >
          {showForm ? 'Annuler' : <><Plus className="w-5 h-5" /> Ajouter une Vidéo / Cours</>}
        </button>
      </div>

      {showForm && (
        <div className="p-6 border-b border-white/10 bg-white/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Catégorie</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white">
                  <option value="gemini">Gemini / Midjourney (Images)</option>
                  <option value="kling">Kling AI / Haiper (Vidéos)</option>
                  <option value="claude">Claude 3.5 (Jeux/Code)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2 font-bold">Titre du Cours / Vidéo</label>
                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-black/50 border border-[var(--color-neon-blue)]/30 rounded-lg p-3 text-white focus:border-[var(--color-neon-blue)] focus:outline-none transition-colors" placeholder="ex: Comment faire voler un Dragon" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/10 pt-6">
              <div className="space-y-4">
                <h3 className="text-[var(--color-neon-purple)] font-bold uppercase tracking-widest border-b border-[var(--color-neon-purple)]/30 pb-2">Mauvais Résultat</h3>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Mauvais Prompt</label>
                  <textarea required name="badPrompt" value={formData.badPrompt} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white text-sm" rows="3" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-[var(--color-neon-blue)] font-bold mb-1">Lien de la Vidéo / Image</label>
                    <input required type="text" name="badMediaUrl" value={formData.badMediaUrl} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white text-sm" placeholder="https://youtube.com/watch?v=..." />
                  </div>
                  <div className="w-1/3">
                    <label className="block text-xs text-gray-400 mb-1">Type de Média</label>
                    <select name="badMediaType" value={formData.badMediaType} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white text-sm">
                      <option value="image">Image (JPG/PNG)</option>
                      <option value="video">Vidéo MP4 directe</option>
                      <option value="youtube">Lien YouTube</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[var(--color-neon-blue)] font-bold uppercase tracking-widest border-b border-[var(--color-neon-blue)]/30 pb-2">Bon Résultat (Premium)</h3>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Prompt Premium</label>
                  <textarea required name="goodPrompt" value={formData.goodPrompt} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white text-sm" rows="3" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-[var(--color-neon-blue)] font-bold mb-1">Lien de la Vidéo / Image (Ton Rendu HQ)</label>
                    <input required type="text" name="goodMediaUrl" value={formData.goodMediaUrl} onChange={handleInputChange} className="w-full bg-black/50 border border-[var(--color-neon-blue)]/50 rounded-lg p-3 text-white text-sm focus:border-[var(--color-neon-blue)] focus:outline-none" placeholder="https://youtube.com/watch?v=..." />
                  </div>
                  <div className="w-1/3">
                    <label className="block text-xs text-gray-400 mb-1">Type de Média</label>
                    <select name="goodMediaType" value={formData.goodMediaType} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white text-sm">
                      <option value="image">Image (JPG/PNG)</option>
                      <option value="video">Vidéo MP4 directe</option>
                      <option value="youtube">Lien YouTube</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Explication du formateur</label>
              <textarea required name="explanation" value={formData.explanation} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" rows="2" placeholder="Pourquoi le prompt premium est-il meilleur ?" />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] text-white px-10 py-4 rounded-xl font-black tracking-widest uppercase hover:shadow-[0_0_30px_rgba(186,85,211,0.6)] transition-all transform hover:scale-105">
                ENREGISTRER CE COURS
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest">
              <th className="p-4 border-b border-white/10 font-bold">Catégorie</th>
              <th className="p-4 border-b border-white/10 font-bold">Titre</th>
              <th className="p-4 border-b border-white/10 font-bold">Médias</th>
              <th className="p-4 border-b border-white/10 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {simulations.map((sim) => (
              <tr key={sim._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 font-bold text-white uppercase text-xs">{sim.category}</td>
                <td className="p-4 text-gray-300 font-bold">{sim.title}</td>
                <td className="p-4 text-gray-400 text-xs">
                  <div>Bad: {getMediaIcon(sim.badMediaType)} {sim.badMediaType}</div>
                  <div>Good: {getMediaIcon(sim.goodMediaType)} {sim.goodMediaType}</div>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(sim._id)} className="text-red-500 hover:text-red-400 bg-red-500/10 p-2 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {simulations.length === 0 && !showForm && (
              <tr>
                <td colSpan="4" className="p-16 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Video className="w-16 h-16 text-gray-600 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-400 mb-2">Aucun cours pour le moment</h3>
                    <p className="mb-6">C'est vide ! Clique sur le bouton en haut à droite pour ajouter ta première vidéo YouTube.</p>
                    <button 
                      onClick={() => setShowForm(true)}
                      className="bg-[var(--color-neon-blue)] text-black px-6 py-3 rounded-lg font-bold uppercase tracking-widest hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all"
                    >
                      Ajouter une vidéo maintenant
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSimulations;
