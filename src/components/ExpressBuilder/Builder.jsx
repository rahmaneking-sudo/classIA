import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CheckCircle2 } from 'lucide-react';
import Navbar from '../Navbar';
import API_BASE_URL from '../../config/api';

const THEMES = [
  { id: 'restaurant', name: 'Restauration', image: '/mockups/restaurant.png' },
  { id: 'vtc', name: 'Transport & VTC', image: '/mockups/vtc.png' },
  { id: 'pharmacy', name: 'Santé & Pharmacie', image: '/mockups/pharmacy.png' },
  { id: 'travel', name: 'Voyage & Tourisme', image: '/mockups/travel.png' },
  { id: 'hotel', name: 'Hôtellerie', image: '/mockups/hotel.png' }
];

const Builder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    businessName: '',
    slug: '',
    ownerEmail: '',
    whatsapp: '',
    themeId: 'restaurant',
    description: '',
    service1_title: '',
    service1_desc: '',
    service2_title: '',
    service2_desc: '',
  });

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

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Auto-generate slug from business name if slug is empty
    if (name === 'businessName' && !formData.slug) {
      const generatedSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, businessName: value, slug: generatedSlug }));
    } else if (name === 'slug') {
      // Force slug format
      value = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        slug: formData.slug,
        businessName: formData.businessName,
        ownerEmail: formData.ownerEmail,
        whatsapp: formData.whatsapp,
        themeId: formData.themeId,
        tier: 'Basique',
        content: {
          description: formData.description,
          services: [
            { title: formData.service1_title, description: formData.service1_desc },
            { title: formData.service2_title, description: formData.service2_desc }
          ].filter(s => s.title)
        }
      };

      const res = await axios.post(`${API_BASE_URL}/microsites`, payload);
      
      Toast.fire({
        title: 'Félicitations !',
        text: 'Votre site a été généré avec succès. Redirection vers votre page...',
        icon: 'success'
      }).then(() => {
        navigate(`/site/${res.data.slug}`);
      });

    } catch (err) {
      Toast.fire({
        title: 'Erreur',
        text: err.response?.data?.message || 'Erreur lors de la création du site',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white font-['Rajdhani']">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-widest uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)]">
            Constructeur Express
          </h1>
          <p className="text-gray-400">Configurez votre site vitrine "Basique" en quelques minutes.</p>
        </div>

        <div className="bg-[#0a0a10]/80 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Informations Principales */}
            <div>
              <h3 className="text-xl font-bold text-[var(--color-neon-blue)] mb-4 border-b border-white/10 pb-2 uppercase tracking-widest">Informations Principales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nom de l'entreprise</label>
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} required className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors" placeholder="Ex: Dakar Tech Solutions" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Lien de votre site (Slug)</label>
                  <div className="flex">
                    <span className="bg-[#1a1a24] border border-[#2a2a35] border-r-0 rounded-l-lg px-4 py-3 text-gray-500">classia.com/site/</span>
                    <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full bg-[#11111a] border border-[#2a2a35] rounded-r-lg px-4 py-3 text-[var(--color-neon-purple)] font-bold focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors" placeholder="dakar-tech" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Votre Email</label>
                  <input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleChange} required className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors" placeholder="contact@email.com" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Numéro WhatsApp (pour être contacté)</label>
                  <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} required className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors" placeholder="+221..." />
                </div>
              </div>
            </div>

            {/* Design & Contenu */}
            <div>
              <h3 className="text-xl font-bold text-[var(--color-neon-blue)] mb-4 border-b border-white/10 pb-2 uppercase tracking-widest mt-8">Design & Contenu</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-[var(--color-neon-purple)] mb-4 uppercase tracking-widest font-bold">Sélectionnez votre Modèle (Thème)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {THEMES.map(theme => (
                      <div 
                        key={theme.id}
                        onClick={() => setFormData(prev => ({ ...prev, themeId: theme.id }))}
                        className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 group ${formData.themeId === theme.id ? 'border-[var(--color-neon-blue)] shadow-[0_0_15px_rgba(0,212,255,0.5)] scale-[1.02]' : 'border-transparent hover:border-white/20'}`}
                      >
                        <img src={theme.image} alt={theme.name} className="w-full h-32 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                          <span className="text-white text-sm font-bold tracking-wider">{theme.name}</span>
                        </div>
                        {formData.themeId === theme.id && (
                          <div className="absolute top-2 right-2 bg-[var(--color-neon-blue)] rounded-full text-black">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Description courte de votre activité</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)] transition-colors" placeholder="Nous sommes experts en..."></textarea>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-xl font-bold text-[var(--color-neon-blue)] mb-4 border-b border-white/10 pb-2 uppercase tracking-widest mt-8">Vos Services (Optionnel)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <label className="block text-sm text-[var(--color-neon-purple)] mb-2">Service 1 : Titre</label>
                  <input type="text" name="service1_title" value={formData.service1_title} onChange={handleChange} className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-2 text-white mb-4 focus:outline-none focus:border-[var(--color-neon-blue)]" placeholder="Ex: Consulting" />
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <textarea name="service1_desc" value={formData.service1_desc} onChange={handleChange} rows="2" className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-neon-blue)]"></textarea>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <label className="block text-sm text-[var(--color-neon-purple)] mb-2">Service 2 : Titre</label>
                  <input type="text" name="service2_title" value={formData.service2_title} onChange={handleChange} className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-2 text-white mb-4 focus:outline-none focus:border-[var(--color-neon-blue)]" placeholder="Ex: Développement" />
                  <label className="block text-sm text-gray-400 mb-2">Description</label>
                  <textarea name="service2_desc" value={formData.service2_desc} onChange={handleChange} rows="2" className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-neon-blue)]"></textarea>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] text-white font-bold tracking-widest uppercase rounded-xl hover:shadow-[0_0_20px_rgba(186,85,211,0.5)] transition-all flex items-center justify-center disabled:opacity-50"
              >
                {loading ? 'Génération en cours...' : 'Générer mon site maintenant'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Builder;
