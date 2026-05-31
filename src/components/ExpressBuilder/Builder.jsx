import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CheckCircle2, ArrowRight, Plus, Trash2, ArrowLeft } from 'lucide-react';
import Navbar from '../Navbar';
import API_BASE_URL from '../../config/api';
import ThemeRenderer from './ThemeRenderer';

const THEMES = [
  { id: 'restaurant', name: 'Restaurant & Fast Food', image: '/restaurant.png' },
  { id: 'salon', name: 'Beauté & Coiffure', image: '/salon.png' },
  { id: 'car', name: 'Location Voiture / VTC', image: '/car.png' },
  { id: 'realestate', name: 'Agence Immobilière', image: '/realestate.png' },
  { id: 'shop', name: 'Boutique & Vente', image: '/shop.png' },
  { id: 'dentist', name: 'Santé & Dentaire', image: '/dentist.png' },
  { id: 'hotel', name: 'Hôtel & Résidence', image: '/hotel.png' },
  { id: 'carpentry', name: 'Artisanat & Menuiserie', image: '/carpentry.png' }
];

const Builder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: Theme Selection (Full screen), 1: Info (Split), 2: Content (Split)

  const [formData, setFormData] = useState({
    businessName: '',
    slug: '',
    ownerEmail: '',
    whatsapp: '',
    themeId: null,
    content: {
      description: '',
      services: [{ title: '', description: '' }],
      rooms: [{ title: '', price: '', desc: '' }],
      projects: [{ title: '', desc: '' }],
      menus: [{ title: '', price: '', desc: '' }],
      vehicles: [{ title: '', price: '', desc: '' }],
      properties: [{ title: '', price: '', desc: '' }],
      products: [{ title: '', price: '' }]
    }
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

  const handleBasicChange = (e) => {
    let { name, value } = e.target;
    if (name === 'businessName' && !formData.slug) {
      const generatedSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, businessName: value, slug: generatedSlug }));
    } else if (name === 'slug') {
      value = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleContentChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, [name]: value }
    }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setFormData(prev => {
      const newArray = [...(prev.content[arrayName] || [])];
      if (!newArray[index]) newArray[index] = {};
      newArray[index] = { ...newArray[index], [field]: value };
      return {
        ...prev,
        content: { ...prev.content, [arrayName]: newArray }
      };
    });
  };

  const handleAddArrayItem = (arrayName, defaultItem) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [arrayName]: [...(prev.content[arrayName] || []), defaultItem]
      }
    }));
  };

  const handleRemoveArrayItem = (arrayName, index) => {
    setFormData(prev => {
      const newArray = [...(prev.content[arrayName] || [])];
      newArray.splice(index, 1);
      return {
        ...prev,
        content: { ...prev.content, [arrayName]: newArray }
      };
    });
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
        content: formData.content
      };

      const res = await axios.post(`${API_BASE_URL}/microsites`, payload);
      
      Toast.fire({
        title: 'Félicitations !',
        text: 'Votre site a été généré avec succès. Redirection vers votre page de paiement/activation...',
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

  const renderDynamicList = (arrayName, title, color, fields) => {
    const list = formData.content[arrayName] || [];
    const defaultItem = fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});

    return (
      <div className="space-y-4">
        <h4 className={`text-[${color}] font-bold uppercase text-sm tracking-widest mt-4`}>{title}</h4>
        {list.map((item, i) => (
          <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/5 relative group">
            <button type="button" onClick={() => handleRemoveArrayItem(arrayName, i)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-4 h-4" />
            </button>
            {fields.map((field, idx) => (
              field.type === 'textarea' ? (
                <textarea key={idx} placeholder={field.placeholder} rows={field.rows || 2} value={item[field.name] || ''} onChange={(e) => handleArrayChange(arrayName, i, field.name, e.target.value)} className="w-full bg-transparent text-sm text-gray-300 px-2 py-1 focus:outline-none focus:border-b focus:border-white/20 mb-2"></textarea>
              ) : (
                <input key={idx} type="text" placeholder={field.placeholder} value={item[field.name] || ''} onChange={(e) => handleArrayChange(arrayName, i, field.name, e.target.value)} className={`w-full bg-transparent border-b border-white/10 px-2 py-1 text-white mb-2 focus:outline-none focus:border-[${color}] ${field.bold ? 'font-bold' : ''}`} />
              )
            ))}
          </div>
        ))}
        <button type="button" onClick={() => handleAddArrayItem(arrayName, defaultItem)} className={`w-full py-2 bg-[${color}]/10 hover:bg-[${color}]/20 text-[${color}] rounded-lg flex justify-center items-center text-sm font-bold transition-colors`}>
          <Plus className="w-4 h-4 mr-2" /> Ajouter un élément
        </button>
      </div>
    );
  };

  // STEP 0: THEME SELECTION (FULL SCREEN)
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-[#020205] text-white font-['Rajdhani'] flex flex-col">
        <Navbar />
        <div className="flex-1 pt-24 px-6 md:px-16 max-w-7xl mx-auto w-full pb-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] uppercase tracking-widest">
              Choisissez votre modèle
            </h1>
            <p className="text-gray-400 text-lg">Sélectionnez le secteur d'activité qui correspond à votre entreprise pour commencer la personnalisation.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {THEMES.map(theme => (
              <div 
                key={theme.id}
                onClick={() => setFormData(prev => ({ ...prev, themeId: theme.id }))}
                className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 group ${formData.themeId === theme.id ? 'border-[var(--color-neon-blue)] shadow-[0_0_20px_rgba(0,212,255,0.4)] scale-105 z-10' : 'border-white/10 hover:border-white/30 hover:scale-105'}`}
              >
                <div className="h-48 relative">
                  <img src={theme.image} alt={theme.name} className={`w-full h-full object-cover transition-transform duration-700 ${formData.themeId === theme.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <div className={`absolute inset-0 transition-opacity ${formData.themeId === theme.id ? 'bg-black/20' : 'bg-black/50 group-hover:bg-black/30'}`}></div>
                </div>
                
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex items-end justify-between">
                  <span className="text-white font-bold tracking-wider text-lg">{theme.name}</span>
                  {formData.themeId === theme.id && (
                    <div className="bg-[var(--color-neon-blue)] rounded-full text-black p-1 shadow-lg">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center flex justify-center">
             <button 
                disabled={!formData.themeId}
                onClick={() => setCurrentStep(1)} 
                className="px-12 py-4 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] text-white font-bold text-lg tracking-widest uppercase rounded-full hover:shadow-[0_0_30px_rgba(186,85,211,0.6)] transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer avec ce modèle <ArrowRight className="w-5 h-5 ml-2" />
              </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 1 & 2: SPLIT SCREEN (FORM + PREVIEW)
  return (
    <div className="min-h-screen bg-[#020205] text-white font-['Rajdhani'] flex flex-col overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex flex-col lg:flex-row pt-20 h-screen">
        
        {/* LEFT PANE: Form */}
        <div className="w-full lg:w-[450px] xl:w-[500px] flex-shrink-0 bg-[#0a0a10] border-r border-white/10 flex flex-col h-full overflow-y-auto custom-scrollbar">
          <div className="p-6 pb-32">
            
            <button onClick={() => setCurrentStep(0)} className="flex items-center text-gray-400 hover:text-white mb-6 text-sm uppercase tracking-wider transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Changer de modèle
            </button>

            <h1 className="text-3xl font-bold tracking-widest uppercase mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)]">
              Personnalisation
            </h1>
            <p className="text-gray-400 text-sm mb-8">Remplissez les informations, prévisualisez en direct à droite.</p>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* STEP 1: Basic Info */}
              <div className={`space-y-4 ${currentStep !== 1 && 'hidden'}`}>
                <h3 className="text-xl font-bold text-[var(--color-neon-blue)] border-b border-white/10 pb-2 uppercase tracking-widest">1. Informations Générales</h3>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nom de l'entreprise</label>
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleBasicChange} required className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)]" placeholder="Ex: Restaurant Le Teranga" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Lien du site (Slug)</label>
                  <div className="flex">
                    <span className="bg-[#1a1a24] border border-[#2a2a35] border-r-0 rounded-l-lg px-3 py-3 text-gray-500 text-sm">classia.com/site/</span>
                    <input type="text" name="slug" value={formData.slug} onChange={handleBasicChange} required className="w-full bg-[#11111a] border border-[#2a2a35] rounded-r-lg px-3 py-3 text-[var(--color-neon-purple)] font-bold focus:outline-none focus:border-[var(--color-neon-blue)]" placeholder="le-teranga" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Votre Email Administratif</label>
                  <input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleBasicChange} required className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)]" placeholder="contact@email.com" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Numéro WhatsApp (Visible par les clients)</label>
                  <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleBasicChange} required className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)]" placeholder="Ex: 22177..." />
                </div>

                <button type="button" onClick={() => setCurrentStep(2)} className="w-full py-4 mt-6 bg-white/10 hover:bg-white/20 text-white font-bold tracking-widest uppercase rounded-lg transition-colors flex justify-center items-center">
                  Étape Suivante : Le Contenu <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>

              {/* STEP 2: Content Customization */}
              <div className={`space-y-6 ${currentStep !== 2 && 'hidden'}`}>
                <h3 className="text-xl font-bold text-[var(--color-neon-blue)] border-b border-white/10 pb-2 uppercase tracking-widest flex justify-between items-center">
                  <span>2. Votre Contenu</span>
                </h3>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phrase d'accroche (Slogan)</label>
                  <textarea name="description" value={formData.content.description} onChange={handleContentChange} rows="2" className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-neon-blue)]" placeholder="Ex: Les meilleures saveurs de Dakar..."></textarea>
                </div>

                {/* DYNAMIC FIELDS BASED ON THEME */}
                {formData.themeId === 'restaurant' && renderDynamicList('menus', 'Notre Menu', 'var(--color-neon-purple)', [
                  { name: 'title', placeholder: 'Nom du plat (ex: Thiéboudienne)', bold: true },
                  { name: 'price', placeholder: 'Prix (ex: 2000 FCFA)' },
                  { name: 'desc', type: 'textarea', placeholder: 'Description des ingrédients...' }
                ])}

                {formData.themeId === 'salon' && renderDynamicList('services', 'Nos Prestations', 'var(--color-neon-purple)', [
                  { name: 'title', placeholder: 'Prestation (ex: Tresses Africaines)', bold: true },
                  { name: 'price', placeholder: 'Prix (ex: 15000 FCFA)' }
                ])}

                {formData.themeId === 'car' && renderDynamicList('vehicles', 'Notre Flotte', 'var(--color-neon-blue)', [
                  { name: 'title', placeholder: 'Véhicule (ex: Range Rover Velar)', bold: true },
                  { name: 'price', placeholder: 'Tarif (ex: 45000 FCFA / jour)' },
                  { name: 'desc', type: 'textarea', placeholder: 'Détails (Clim, Auto, Places...)' }
                ])}

                {formData.themeId === 'realestate' && renderDynamicList('properties', 'Nos Biens Immobiliers', 'var(--color-neon-purple)', [
                  { name: 'title', placeholder: 'Bien (ex: Appartement F4 Almadies)', bold: true },
                  { name: 'price', placeholder: 'Loyer / Prix (ex: 400.000 FCFA/mois)' },
                  { name: 'desc', type: 'textarea', placeholder: 'Description du bien...' }
                ])}

                {formData.themeId === 'shop' && renderDynamicList('products', 'Nos Produits Phares', 'var(--color-neon-blue)', [
                  { name: 'title', placeholder: 'Produit (ex: Robe de soirée)', bold: true },
                  { name: 'price', placeholder: 'Prix (ex: 10.000 FCFA)' }
                ])}

                {formData.themeId === 'dentist' && renderDynamicList('services', 'Nos Soins', 'var(--color-neon-blue)', [
                  { name: 'title', placeholder: 'Soin (ex: Blanchiment Dentaire)', bold: true },
                  { name: 'desc', type: 'textarea', placeholder: 'Description du soin...' }
                ])}

                {formData.themeId === 'hotel' && renderDynamicList('rooms', 'Nos Chambres', '#c2a679', [
                  { name: 'title', placeholder: 'Chambre (ex: Suite Présidentielle)', bold: true },
                  { name: 'price', placeholder: 'Tarif (ex: 120.000 FCFA / nuit)' },
                  { name: 'desc', type: 'textarea', placeholder: 'Description de la chambre...' }
                ])}

                {formData.themeId === 'carpentry' && renderDynamicList('projects', 'Nos Réalisations', '#d97706', [
                  { name: 'title', placeholder: 'Projet (ex: Porte en Bois Massif)', bold: true },
                  { name: 'desc', type: 'textarea', placeholder: 'Description du travail réalisé...' }
                ])}

                <div className="flex space-x-2 pt-6 border-t border-white/10">
                  <button type="button" onClick={() => setCurrentStep(1)} className="w-1/3 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors font-bold uppercase text-sm tracking-wider">Retour</button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-2/3 py-3 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] text-white font-bold tracking-widest uppercase rounded-lg hover:shadow-[0_0_20px_rgba(186,85,211,0.5)] transition-all flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? 'Génération...' : 'Créer mon site'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>

        {/* RIGHT PANE: Live Preview */}
        <div className="flex-1 bg-white h-full overflow-y-auto relative hidden lg:block custom-scrollbar shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-10">
          <div className="sticky top-0 w-full bg-[#1a1a24] text-white text-xs text-center py-2 z-50 shadow-md font-bold tracking-widest uppercase flex justify-center items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Prévisualisation en direct
          </div>
          <div className="w-full pointer-events-none">
             <ThemeRenderer data={formData} />
          </div>
        </div>

      </div>
      
      {/* Custom Scrollbar CSS for the panes */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0a0a10;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2a2a35;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--color-neon-purple);
        }
      `}</style>
    </div>
  );
};

export default Builder;
