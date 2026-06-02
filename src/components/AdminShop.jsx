import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import Swal from 'sweetalert2';
import { Plus, Trash2, Globe, MonitorPlay, CheckSquare } from 'lucide-react';

const AdminShop = () => {
  const [products, setProducts] = useState([]);
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
    title: '',
    description: '',
    price: '',
    previewUrl: '',
    demoUrl: '',
    features: '',
    category: 'E-commerce'
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/shop`);
      setProducts(response.data);
    } catch (err) {
      Toast.fire('Erreur', 'Impossible de charger la boutique', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      
      // Transform features string into array (separated by newlines or commas)
      const featuresArray = formData.features
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0);

      const payload = {
        ...formData,
        price: Number(formData.price),
        features: featuresArray
      };

      await axios.post(`${API_BASE_URL}/shop`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Toast.fire('Succès', 'Site ajouté à la boutique !', 'success');
      setFormData(initialFormState);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      Toast.fire('Erreur', 'Impossible de publier le site', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`${API_BASE_URL}/shop?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Toast.fire('Succès', 'Produit supprimé', 'success');
        fetchProducts();
      } catch (err) {
        Toast.fire('Erreur', 'Erreur lors de la suppression', 'error');
      }
    }
  };

  const categories = [
    'E-commerce', 
    'Vitrine', 
    'Réservation', 
    'Annuaire', 
    'Application Mobile', 
    'Restaurant', 
    'Blog / Média'
  ];

  if (loading) return <div className="text-center p-12 text-[var(--color-neon-blue)] animate-pulse">Chargement de la boutique...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Gestion Boutique
          </h2>
          <p className="text-gray-400 mt-2">Ajoutez les sites préconçus que vous souhaitez vendre.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-blue)] rounded-lg hover:bg-[var(--color-neon-blue)]/30 transition-colors border border-[var(--color-neon-blue)]/50"
        >
          {showForm ? 'Fermer' : <><Plus className="w-5 h-5 mr-2" /> Vendre un nouveau site</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-[#11111a] border border-[#2a2a35] rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-neon-blue)]/5 to-[var(--color-neon-purple)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Catégorie du site</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-[#1a1a24] border border-[#2a2a35] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nom du Site (Titre)</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-[#1a1a24] border border-[#2a2a35] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors"
                  placeholder="Ex: Site de Booking Pharmacies"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">Description (Pitch commercial)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full bg-[#1a1a24] border border-[#2a2a35] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors"
                  placeholder="Ex: Un site de réservation de pharmacies avec panel administrateur inclus..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Prix (en FCFA)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full bg-[#1a1a24] border border-[#2a2a35] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors"
                  placeholder="Ex: 150000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Lien de l'image (Aperçu)</label>
                <input
                  type="url"
                  name="previewUrl"
                  value={formData.previewUrl}
                  onChange={handleInputChange}
                  className="w-full bg-[#1a1a24] border border-[#2a2a35] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors"
                  placeholder="https://.../image.jpg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Lien vers la Démo (Optionnel)</label>
                <input
                  type="url"
                  name="demoUrl"
                  value={formData.demoUrl}
                  onChange={handleInputChange}
                  className="w-full bg-[#1a1a24] border border-[#2a2a35] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors"
                  placeholder="https://mon-super-site.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Fonctionnalités (1 par ligne)</label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full bg-[#1a1a24] border border-[#2a2a35] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors"
                  placeholder="Panel Admin Inclus&#10;Paiement Mobile&#10;Design Responsive"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] text-white font-bold rounded-lg hover:shadow-[0_0_15px_rgba(186,85,211,0.5)] transition-all"
              >
                Mettre en vente
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des Produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 && !showForm && (
          <div className="col-span-full text-center py-12 text-gray-400 bg-[#11111a] border border-[#2a2a35] rounded-xl">
            Aucun site en vente pour le moment. Cliquez sur "Vendre un nouveau site" pour commencer.
          </div>
        )}
        
        {products.map(product => (
          <div key={product._id} className="bg-[#11111a] border border-[#2a2a35] rounded-xl overflow-hidden group hover:border-[var(--color-neon-blue)]/50 transition-colors">
            {/* Image Preview */}
            <div className="relative h-48 w-full bg-[#0a0a10]">
              <img 
                src={product.previewUrl} 
                alt={product.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000'; }}
              />
              <div className="absolute top-3 right-3 bg-black/80 backdrop-blur text-[var(--color-neon-blue)] px-3 py-1 rounded-full text-sm font-bold border border-[var(--color-neon-blue)]/30">
                {product.price.toLocaleString()} FCFA
              </div>
              <div className="absolute top-3 left-3 bg-[var(--color-neon-purple)]/80 backdrop-blur text-white px-2 py-1 rounded text-xs font-bold">
                {product.category}
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold text-white mb-2">{product.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-2 mb-4">{product.description}</p>
              
              <div className="space-y-2 mb-6">
                {product.features?.slice(0, 3).map((feature, idx) => (
                  <div key={idx} className="flex items-center text-xs text-gray-300">
                    <CheckSquare className="w-3 h-3 text-[var(--color-neon-purple)] mr-2" />
                    {feature}
                  </div>
                ))}
                {product.features?.length > 3 && (
                  <div className="text-xs text-gray-500 italic">+ {product.features.length - 3} autres</div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#2a2a35]">
                {product.demoUrl ? (
                  <a href={product.demoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-neon-blue)] hover:underline flex items-center">
                    <Globe className="w-4 h-4 mr-1" /> Voir Démo
                  </a>
                ) : (
                  <span className="text-sm text-gray-600">Pas de démo</span>
                )}
                
                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-red-400 hover:text-red-300 p-2 rounded hover:bg-red-400/10 transition-colors"
                  title="Retirer de la vente"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminShop;
