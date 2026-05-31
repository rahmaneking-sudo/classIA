import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '../Navbar';
import API_BASE_URL from '../../config/api';
import ThemeRenderer from './ThemeRenderer';

const THEMES = [
  { id: 'dentist', name: 'Cabinet Dentaire', image: '/dentist.png' },
  { id: 'hotel', name: 'Hôtel / Résidence', image: '/hotel.png' },
  { id: 'carpentry', name: 'Menuiserie', image: '/carpentry.png' }
];

const Builder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Info, 2: Theme, 3: Contenu

  const [formData, setFormData] = useState({
    businessName: '',
    slug: '',
    ownerEmail: '',
    whatsapp: '',
    themeId: 'dentist',
    content: {
      description: '',
      services: [
        { title: '', description: '' },
        { title: '', description: '' }
      ],
      rooms: [
        { title: '', price: '', desc: '' },
        { title: '', price: '', desc: '' }
      ],
      projects: [
        { title: '', desc: '' },
        { title: '', desc: '' }
      ]
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
      const newArray = [...prev.content[arrayName]];
      newArray[index] = { ...newArray[index], [field]: value };
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
        content: formData.content // The entire content object
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

  return (
    <div className="min-h-screen bg-[#020205] text-white font-['Rajdhani'] flex flex-col overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex flex-col lg:flex-row pt-20 h-screen">
        
        {/* LEFT PANE: Form */}
        <div className="w-full lg:w-[450px] xl:w-[500px] flex-shrink-0 bg-[#0a0a10] border-r border-white/10 flex flex-col h-full overflow-y-auto custom-scrollbar">
          <div className="p-6">
            <h1 className="text-3xl font-bold tracking-widest uppercase mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)]">
              Créer mon site
            </h1>
            <p className="text-gray-400 text-sm mb-8">Remplissez les informations, prévisualisez en direct à droite.</p>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* STEP 1: Basic Info */}
              <div className={`space-y-4 ${currentStep !== 1 && 'hidden'}`}>
                <h3 className="text-xl font-bold text-[var(--color-neon-blue)] border-b border-white/10 pb-2 uppercase tracking-widest">Étape 1 : Informations</h3>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nom de l'entreprise</label>
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleBasicChange} required className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)]" placeholder="Ex: Cabinet Sourire" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Lien du site (Slug)</label>
                  <div className="flex">
                    <span className="bg-[#1a1a24] border border-[#2a2a35] border-r-0 rounded-l-lg px-3 py-3 text-gray-500 text-sm">classia.com/site/</span>
                    <input type="text" name="slug" value={formData.slug} onChange={handleBasicChange} required className="w-full bg-[#11111a] border border-[#2a2a35] rounded-r-lg px-3 py-3 text-[var(--color-neon-purple)] font-bold focus:outline-none focus:border-[var(--color-neon-blue)]" placeholder="mon-site" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Votre Email (Admin)</label>
                  <input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleBasicChange} required className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)]" placeholder="contact@email.com" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Numéro WhatsApp (Public)</label>
                  <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleBasicChange} required className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)]" placeholder="77..." />
                </div>

                <button type="button" onClick={() => setCurrentStep(2)} className="w-full py-3 mt-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-colors flex justify-center items-center">
                  Suivant <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>

              {/* STEP 2: Theme Selection */}
              <div className={`space-y-4 ${currentStep !== 2 && 'hidden'}`}>
                <h3 className="text-xl font-bold text-[var(--color-neon-blue)] border-b border-white/10 pb-2 uppercase tracking-widest">Étape 2 : Thème</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {THEMES.map(theme => (
                    <div 
                      key={theme.id}
                      onClick={() => setFormData(prev => ({ ...prev, themeId: theme.id }))}
                      className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 group ${formData.themeId === theme.id ? 'border-[var(--color-neon-blue)] shadow-[0_0_15px_rgba(0,212,255,0.3)]' : 'border-transparent hover:border-white/20'}`}
                    >
                      <img src={theme.image} alt={theme.name} className="w-full h-24 object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-3">
                        <span className="text-white font-bold tracking-wider">{theme.name}</span>
                      </div>
                      {formData.themeId === theme.id && (
                        <div className="absolute top-2 right-2 bg-[var(--color-neon-blue)] rounded-full text-black p-0.5">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2 pt-4">
                  <button type="button" onClick={() => setCurrentStep(1)} className="w-1/3 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors">Retour</button>
                  <button type="button" onClick={() => setCurrentStep(3)} className="w-2/3 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-colors flex justify-center items-center">
                    Personnaliser <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>

              {/* STEP 3: Content Customization */}
              <div className={`space-y-6 ${currentStep !== 3 && 'hidden'}`}>
                <h3 className="text-xl font-bold text-[var(--color-neon-blue)] border-b border-white/10 pb-2 uppercase tracking-widest flex justify-between items-center">
                  <span>Étape 3 : Contenu</span>
                </h3>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phrase d'accroche (Slogan)</label>
                  <textarea name="description" value={formData.content.description} onChange={handleContentChange} rows="2" className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-neon-blue)]" placeholder="Entrez votre slogan..."></textarea>
                </div>

                {/* DYNAMIC FIELDS BASED ON THEME */}
                {formData.themeId === 'dentist' && (
                  <div className="space-y-4">
                    <h4 className="text-[var(--color-neon-purple)] font-bold uppercase text-sm tracking-widest mt-4">Vos Services (Soins)</h4>
                    {[0, 1].map(i => (
                      <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/5">
                        <input type="text" placeholder={`Soin ${i+1}`} value={formData.content.services[i].title} onChange={(e) => handleArrayChange('services', i, 'title', e.target.value)} className="w-full bg-transparent border-b border-white/10 px-2 py-1 text-white mb-2 focus:outline-none focus:border-[var(--color-neon-blue)]" />
                        <textarea placeholder="Description" rows="2" value={formData.content.services[i].description} onChange={(e) => handleArrayChange('services', i, 'description', e.target.value)} className="w-full bg-transparent text-sm text-gray-300 px-2 py-1 focus:outline-none"></textarea>
                      </div>
                    ))}
                  </div>
                )}

                {formData.themeId === 'hotel' && (
                  <div className="space-y-4">
                    <h4 className="text-[var(--color-neon-purple)] font-bold uppercase text-sm tracking-widest mt-4">Vos Chambres</h4>
                    {[0, 1].map(i => (
                      <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/5">
                        <input type="text" placeholder={`Chambre ${i+1}`} value={formData.content.rooms[i].title} onChange={(e) => handleArrayChange('rooms', i, 'title', e.target.value)} className="w-full bg-transparent border-b border-white/10 px-2 py-1 text-white mb-2 focus:outline-none focus:border-[var(--color-neon-blue)] font-bold" />
                        <input type="text" placeholder="Tarif (ex: 50.000 FCFA)" value={formData.content.rooms[i].price} onChange={(e) => handleArrayChange('rooms', i, 'price', e.target.value)} className="w-full bg-transparent border-b border-white/10 px-2 py-1 text-[var(--color-neon-blue)] mb-2 focus:outline-none" />
                        <textarea placeholder="Description..." rows="2" value={formData.content.rooms[i].desc} onChange={(e) => handleArrayChange('rooms', i, 'desc', e.target.value)} className="w-full bg-transparent text-sm text-gray-300 px-2 py-1 focus:outline-none"></textarea>
                      </div>
                    ))}
                  </div>
                )}

                {formData.themeId === 'carpentry' && (
                  <div className="space-y-4">
                    <h4 className="text-amber-500 font-bold uppercase text-sm tracking-widest mt-4">Vos Réalisations</h4>
                    {[0, 1].map(i => (
                      <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/5">
                        <input type="text" placeholder={`Projet ${i+1}`} value={formData.content.projects[i].title} onChange={(e) => handleArrayChange('projects', i, 'title', e.target.value)} className="w-full bg-transparent border-b border-white/10 px-2 py-1 text-white mb-2 focus:outline-none focus:border-amber-500 font-bold" />
                        <textarea placeholder="Description du travail réalisé..." rows="2" value={formData.content.projects[i].desc} onChange={(e) => handleArrayChange('projects', i, 'desc', e.target.value)} className="w-full bg-transparent text-sm text-gray-300 px-2 py-1 focus:outline-none"></textarea>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex space-x-2 pt-4">
                  <button type="button" onClick={() => setCurrentStep(2)} className="w-1/3 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors">Retour</button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-2/3 py-3 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] text-white font-bold tracking-widest uppercase rounded-lg hover:shadow-[0_0_20px_rgba(186,85,211,0.5)] transition-all flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? 'Génération...' : 'Terminer'}
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
             {/* We pass the formData to ThemeRenderer to see changes in real time. 
                 pointer-events-none disables buttons in preview. */}
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
