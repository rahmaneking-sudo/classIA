import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import Swal from 'sweetalert2';
import { Plus, Trash2, Image as ImageIcon, MessageSquare, Edit } from 'lucide-react';
import { uploadFile } from '../utils/cloudinaryUpload';

const AdminPrompts = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
    title: '',
    category: '',
    content: '',
    explanation: '',
    imageUrl: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchPrompts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/prompts`);
      setPrompts(response.data);
    } catch (err) {
      Toast.fire('Erreur', 'Impossible de charger les prompts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  useEffect(() => {
    if (!loading && prompts.length === 0) {
      setShowForm(true);
    }
  }, [loading, prompts.length]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const response = await uploadFile(file, {
        onProgress: (progress) => setUploadProgress(progress)
      });
      
      setFormData({
        ...formData,
        imageUrl: response.secure_url
      });
      Toast.fire('Succès', 'Image uploadée avec succès !', 'success');
    } catch (err) {
      Toast.fire('Erreur', err.message || 'Erreur lors de l\'upload', 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      if (editId) {
        await axios.put(`${API_BASE_URL}/prompts?id=${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Toast.fire('Succès', 'Prompt modifié avec succès !', 'success');
      } else {
        await axios.post(`${API_BASE_URL}/prompts`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Toast.fire('Succès', 'Prompt ajouté avec succès !', 'success');
      }
      setFormData(initialFormState);
      setShowForm(false);
      setEditId(null);
      fetchPrompts();
    } catch (err) {
      Toast.fire('Erreur', 'Impossible de sauvegarder le prompt', 'error');
    }
  };

  const handleEdit = (prompt) => {
    setEditId(prompt._id);
    setFormData({
      title: prompt.title,
      category: prompt.category || '',
      content: prompt.content,
      explanation: prompt.explanation || '',
      imageUrl: prompt.imageUrl || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce prompt ?")) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`${API_BASE_URL}/prompts?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Toast.fire('Succès', 'Prompt supprimé', 'success');
        fetchPrompts();
      } catch (err) {
        Toast.fire('Erreur', 'Impossible de supprimer', 'error');
      }
    }
  };

  if (loading) return <div className="text-center p-12 text-[var(--color-neon-blue)] animate-pulse">Chargement de vos prompts...</div>;

  return (
    <div className="bg-[#0a0a10]/80 rounded-2xl border border-white/10 backdrop-blur-md overflow-hidden">
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-widest uppercase text-white">Gestion des Prompts</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={`${showForm ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-[var(--color-neon-blue)] text-black hover:shadow-[0_0_15px_rgba(0,212,255,0.4)]'} px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all uppercase tracking-widest text-sm`}
        >
          {showForm ? 'Annuler' : <><Plus className="w-5 h-5" /> Ajouter un Prompt</>}
        </button>
      </div>

      {showForm && (
        <div className="p-6 border-b border-white/10 bg-white/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2 font-bold">Titre du Prompt</label>
                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-black/50 border border-[var(--color-neon-blue)]/30 rounded-lg p-3 text-white focus:border-[var(--color-neon-blue)] focus:outline-none transition-colors" placeholder="ex: Prompt pour générer un logo pro..." />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2 font-bold">Forme / Catégorie</label>
                <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--color-neon-blue)] focus:outline-none transition-colors" placeholder="ex: Design, Rédaction, Coding..." />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1 font-bold">Texte du Prompt (Le contenu à copier)</label>
              <textarea required name="content" value={formData.content} onChange={handleInputChange} className="w-full bg-black/50 border border-[var(--color-neon-purple)]/50 rounded-lg p-3 text-white text-sm focus:border-[var(--color-neon-purple)] focus:outline-none" rows="5" placeholder="Écris le prompt complet ici..." />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1 font-bold">Explication / Astuce (Optionnel)</label>
              <textarea name="explanation" value={formData.explanation} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-white/30 focus:outline-none" rows="3" placeholder="Explique comment l'utiliser..." />
            </div>

            <div className="flex flex-col gap-4 p-4 bg-white/5 rounded-xl border border-[var(--color-neon-blue)]/20">
              <div className="flex-1">
                <label className="block text-xs text-[var(--color-neon-blue)] font-bold mb-1">Image d'Illustration</label>
                <input required type="text" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} className="w-full bg-black/50 border border-[var(--color-neon-blue)]/50 rounded-lg p-3 text-white text-sm focus:border-[var(--color-neon-blue)] focus:outline-none" placeholder="Lien de l'image ou utilisez l'upload ci-dessous..." />
              </div>
              
              <div className="border-t border-white/10 pt-4">
                <label className="block text-xs text-gray-400 mb-2 font-bold">Ou uploader une image depuis votre PC (Max 5 Mo)</label>
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload} 
                  disabled={uploading}
                  className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-neon-blue)]/20 file:text-[var(--color-neon-blue)] hover:file:bg-[var(--color-neon-blue)]/30 transition-all cursor-pointer disabled:opacity-50"
                />
                {uploading && (
                  <div className="mt-3 text-xs font-bold text-[var(--color-neon-purple)] uppercase tracking-wider">
                    Upload en cours... {uploadProgress}%
                    <div className="w-full bg-black/50 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div className="bg-[var(--color-neon-purple)] h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] text-white px-10 py-4 rounded-xl font-black tracking-widest uppercase hover:shadow-[0_0_30px_rgba(186,85,211,0.6)] transition-all transform hover:scale-105">
                {editId ? 'MODIFIER CE PROMPT' : 'ENREGISTRER CE PROMPT'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest">
              <th className="p-4 border-b border-white/10 font-bold">Aperçu</th>
              <th className="p-4 border-b border-white/10 font-bold">Titre & Catégorie</th>
              <th className="p-4 border-b border-white/10 font-bold">Prompt</th>
              <th className="p-4 border-b border-white/10 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prompts.map((prompt) => (
              <tr key={prompt._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 w-24">
                  {prompt.imageUrl ? (
                    <img src={prompt.imageUrl} alt={prompt.title} className="w-16 h-12 object-cover rounded-lg border border-white/10" />
                  ) : (
                    <div className="w-16 h-12 bg-white/5 flex items-center justify-center rounded-lg">
                      <ImageIcon className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="font-bold text-white">{prompt.title}</div>
                  <div className="text-[var(--color-neon-purple)] text-xs font-bold uppercase mt-1">{prompt.category}</div>
                </td>
                <td className="p-4">
                  <p className="text-gray-400 text-xs line-clamp-2 italic font-mono bg-black/40 p-2 rounded border border-white/5 max-w-md">
                    {prompt.content}
                  </p>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button onClick={() => handleEdit(prompt)} className="text-blue-500 hover:text-blue-400 bg-blue-500/10 p-2 rounded-lg transition-all">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(prompt._id)} className="text-red-500 hover:text-red-400 bg-red-500/10 p-2 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {prompts.length === 0 && !showForm && (
              <tr>
                <td colSpan="4" className="p-16 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <MessageSquare className="w-16 h-16 text-gray-600 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-400 mb-2">Aucun prompt pour le moment</h3>
                    <p className="mb-6">C'est vide ! Ajoute ton premier prompt avec image.</p>
                    <button 
                      onClick={() => setShowForm(true)}
                      className="bg-[var(--color-neon-blue)] text-black px-6 py-3 rounded-lg font-bold uppercase tracking-widest hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all"
                    >
                      Créer un prompt
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

export default AdminPrompts;
