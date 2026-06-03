import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CheckCircle2, ArrowRight, Plus, Trash2, ArrowLeft } from 'lucide-react';
import Navbar from '../Navbar';
import API_BASE_URL from '../../config/api';
import ThemeRenderer from './ThemeRenderer';
import ImageUpload from './ImageUpload';

const THEMES = [
  { id: 'restaurant', name: 'Restaurant Gastronomique', image: '/restaurant.png' },
  { id: 'hotel', name: 'Hôtel 5 Étoiles', image: '/hotel.png' },
  { id: 'shop', name: 'Boutique Prêt-à-porter', image: '/shop.png' },
  { id: 'beauty', name: 'Salon de Beauté', image: '/salon.png' },
  { id: 'hair', name: 'Salon de Coiffure', image: '/salon.png' },
  { id: 'massage', name: 'Institut de Massage', image: '/salon.png' },
  { id: 'spa', name: 'Centre de Spa', image: '/salon.png' },
  { id: 'electronics', name: 'Boutique Matériels Électroniques', image: '/electronics.png' },
  { id: 'agriculture', name: 'Vente Produits Agricoles', image: '/agriculture.png' }
];

const Builder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); 
  const [isEditMode, setIsEditMode] = useState(false);
  const [pinCode, setPinCode] = useState('');

  const [formData, setFormData] = useState({
    businessName: '',
    slug: '',
    ownerEmail: '',
    whatsapp: '',
    address: '',
    themeId: null,
    content: {
      heroImage: '',
      sectionImage: '',
      description: '',
      welcomeMessage: '',
      footer: { type: 'color', color: '#000000', gradient: '', image: '' },
      services: [{ title: '', description: '', image: '' }],
      rooms: [{ title: '', price: '', desc: '', image: '' }],
      projects: [{ title: '', desc: '', image: '' }],
      menus: [{ title: '', price: '', desc: '', image: '' }],
      vehicles: [{ title: '', price: '', desc: '', image: '' }],
      properties: [{ title: '', price: '', desc: '', image: '' }],
      products: [{ title: '', price: '', image: '' }]
    }
  });

  React.useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('edit') === 'true') {
      const savedData = sessionStorage.getItem('editSiteData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setFormData({
          businessName: parsed.businessName || '',
          slug: parsed.slug || '',
          ownerEmail: parsed.ownerEmail || '',
          whatsapp: parsed.whatsapp || '',
          address: parsed.address || '',
          themeId: parsed.themeId || null,
          content: parsed.content || {}
        });
        setPinCode(parsed.pinCode);
        setIsEditMode(true);
        setCurrentStep(1); // Skip theme selection
      } else {
        navigate('/');
      }
    } else {
      const initName = query.get('name');
      if (initName) {
        setFormData(prev => ({
          ...prev,
          businessName: initName,
          slug: initName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        }));
      }
    }
  }, [location, navigate]);


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

  const handleHeroImageUpload = (url) => {
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, heroImage: url }
    }));
  };

  const handleFooterChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        footer: { ...(prev.content.footer || { type: 'color', color: '#000000', gradient: '', image: '' }), [field]: value }
      }
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

  const handleSubmit = async () => {
    // Manual Validation
    if (!formData.businessName || !formData.slug || !formData.ownerEmail || !formData.whatsapp || !formData.address) {
      Toast.fire({
        title: 'Champs manquants',
        text: 'Veuillez retourner à l\'Étape 1 et remplir toutes les informations générales.',
        icon: 'warning'
      });
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        const payload = {
          ...formData,
          pinCode
        };
        const res = await axios.put(`${API_BASE_URL}/microsites/${formData.slug}`, payload);
        Toast.fire({
          title: 'Mise à jour réussie',
          text: 'Vos modifications ont été enregistrées.',
          icon: 'success'
        }).then(() => {
          navigate(`/site/${res.data.slug}`);
        });
      } else {
        const payload = {
          slug: formData.slug,
          businessName: formData.businessName,
          ownerEmail: formData.ownerEmail,
          whatsapp: formData.whatsapp,
          address: formData.address,
          themeId: formData.themeId,
          tier: 'Basique',
          content: formData.content
        };

        const res = await axios.post(`${API_BASE_URL}/microsites`, payload);
        const newPin = res.data.pinCode;
        
        // PAIEMENT REQUIS (50 000 FCFA)
        Swal.fire({
          background: '#0a0a10',
          color: '#ffffff',
          title: 'PAIEMENT REQUIS',
          html: `
            <p style="color: #bbb; font-size: 14px; margin-bottom: 20px;">
              Votre site a été généré avec succès ! Pour finaliser sa création et recevoir votre code PIN d'administration, veuillez procéder au paiement de <strong style="color: var(--color-neon-blue);">50 000 FCFA</strong>.
            </p>
            <a href="https://pay.wave.com/m/M_sn_gsBAcsJlO1IE/c/sn/?amount=50000" target="_blank" style="display: block; background: rgba(0,162,255,0.2); border: 2px solid #00a2ff; color: white; padding: 15px; text-decoration: none; border-radius: 10px; font-weight: bold; text-transform: uppercase; margin-bottom: 15px; transition: all 0.3s;">
              Payer avec Wave (50 000 FCFA)
            </a>
          `,
          showCancelButton: true,
          confirmButtonText: "J'ai effectué le paiement",
          cancelButtonText: "Annuler",
          confirmButtonColor: '#7b2ff7',
          cancelButtonColor: '#333333',
          customClass: {
            popup: 'border border-[var(--color-neon-blue)]/30 rounded-2xl backdrop-blur-xl',
          }
        }).then(async (result) => {
          if (result.isConfirmed) {
            // Notifier le paiement
            try {
              await axios.post(`${API_BASE_URL}/notify-payment`, {
                type: 'site',
                id: res.data._id,
                name: formData.businessName,
                identifier: formData.slug,
                amount: 50000
              });
            } catch (e) {
              console.error("Erreur notification paiement:", e);
            }

            // Afficher le PIN après avoir cliqué sur j'ai payé
            Swal.fire({
              background: '#0a0a10',
              color: '#ffffff',
              icon: 'success',
              title: 'Paiement en vérification',
              html: `Nous vérifions votre paiement. En attendant, voici votre Code PIN de modification :<br/><br/>
                     <div style="background: rgba(186,85,211,0.1); padding: 15px; border-radius: 10px; border: 1px solid rgba(186,85,211,0.3);">
                       <h2 style="color: var(--color-neon-blue); font-size: 32px; letter-spacing: 5px; margin: 0;">${newPin}</h2>
                       <p style="color: #bbb; font-size: 12px; margin-top: 5px;">⚠️ Gardez ce code précieusement !</p>
                     </div>`,
              confirmButtonText: 'Voir mon site',
              confirmButtonColor: '#7b2ff7',
              customClass: {
                popup: 'border border-[var(--color-neon-blue)]/30 rounded-2xl backdrop-blur-xl',
              }
            }).then(() => {
              navigate(`/site/${res.data.slug}`);
            });
          } else {
            // Annulé, on redirige vers l'accueil ou le builder
            navigate('/');
          }
        });
      }

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
    const defaultItem = fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), { image: '' });

    return (
      <div className="space-y-4">
        <h4 className={`text-[${color}] font-bold uppercase text-sm tracking-widest mt-4`}>{title}</h4>
        {list.map((item, i) => (
          <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/5 relative group flex flex-col md:flex-row gap-4">
            <button type="button" onClick={() => handleRemoveArrayItem(arrayName, i)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-[#0a0a10] rounded-full p-1">
              <Trash2 className="w-4 h-4" />
            </button>
            
            <div className="w-full md:w-1/3">
              <ImageUpload 
                currentImage={item.image} 
                onUpload={(url) => handleArrayChange(arrayName, i, 'image', url)} 
                label="Photo (Optionnel)"
              />
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              {fields.map((field, idx) => (
                field.type === 'textarea' ? (
                  <textarea key={idx} placeholder={field.placeholder} rows={field.rows || 2} value={item[field.name] || ''} onChange={(e) => handleArrayChange(arrayName, i, field.name, e.target.value)} className="w-full bg-transparent text-sm text-gray-300 px-2 py-1 focus:outline-none focus:border-b focus:border-white/20 mb-2"></textarea>
                ) : (
                  <input key={idx} type="text" placeholder={field.placeholder} value={item[field.name] || ''} onChange={(e) => handleArrayChange(arrayName, i, field.name, e.target.value)} className={`w-full bg-transparent border-b border-white/10 px-2 py-1 text-white mb-2 focus:outline-none focus:border-[${color}] ${field.bold ? 'font-bold' : ''}`} />
                )
              ))}
            </div>
          </div>
        ))}
        <button type="button" onClick={() => handleAddArrayItem(arrayName, defaultItem)} className={`w-full py-2 bg-[${color}]/10 hover:bg-[${color}]/20 text-[${color}] rounded-lg flex justify-center items-center text-sm font-bold transition-colors`}>
          <Plus className="w-4 h-4 mr-2" /> Ajouter un élément
        </button>
      </div>
    );
  };

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
              {isEditMode ? 'Modifier votre site' : 'Personnalisation'}
            </h1>
            <p className="text-gray-400 text-sm mb-8">Remplissez les informations, prévisualisez en direct à droite.</p>

            <div className="space-y-8">
              
              {/* STEP 1: Basic Info */}
              <div className={`space-y-4 ${currentStep !== 1 && 'hidden'}`}>
                <h3 className="text-xl font-bold text-[var(--color-neon-blue)] border-b border-white/10 pb-2 uppercase tracking-widest">1. Informations Générales</h3>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nom de l'entreprise <span className="text-red-500">*</span></label>
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleBasicChange} required className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)]" placeholder="Ex: Restaurant Le Teranga" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Lien du site (Slug) <span className="text-red-500">*</span></label>
                  <div className="flex">
                    <span className="bg-[#1a1a24] border border-[#2a2a35] border-r-0 rounded-l-lg px-3 py-3 text-gray-500 text-sm">classia.com/site/</span>
                    <input type="text" name="slug" value={formData.slug} onChange={handleBasicChange} required disabled={isEditMode} className={`w-full bg-[#11111a] border border-[#2a2a35] rounded-r-lg px-3 py-3 text-[var(--color-neon-purple)] font-bold focus:outline-none ${isEditMode ? 'opacity-50 cursor-not-allowed' : 'focus:border-[var(--color-neon-blue)]'}`} placeholder="le-teranga" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Votre Email Administratif <span className="text-red-500">*</span></label>
                  <input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleBasicChange} required className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)]" placeholder="contact@email.com" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Numéro WhatsApp (Visible par les clients) <span className="text-red-500">*</span></label>
                  <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleBasicChange} required className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)]" placeholder="Ex: 22177..." />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Adresse Complète <span className="text-red-500">*</span></label>
                  <input type="text" name="address" value={formData.address} onChange={handleBasicChange} required className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-blue)]" placeholder="Ex: Almadies, Dakar, Sénégal" />
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
                  <label className="block text-sm text-gray-400 mb-2">Image Principale (Bannière)</label>
                  <ImageUpload currentImage={formData.content.heroImage} onUpload={handleHeroImageUpload} label="Image de fond" />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Image de fond du Menu / Services (Effet Parallaxe)</label>
                  <ImageUpload currentImage={formData.content.sectionImage} onUpload={(url) => handleContentChange({target: {name: 'sectionImage', value: url}})} label="Fond Parallaxe (Optionnel)" />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phrase d'accroche (Slogan)</label>
                  <textarea name="description" value={formData.content.description} onChange={handleContentChange} rows="2" className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-neon-blue)]" placeholder="Ex: Les meilleures saveurs de Dakar..."></textarea>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Mot de bienvenue (Affiché sur la page d'accueil)</label>
                  <textarea name="welcomeMessage" value={formData.content.welcomeMessage || ''} onChange={handleContentChange} rows="3" className="w-full bg-[#11111a] border border-[#2a2a35] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-neon-blue)]" placeholder="Ex: Bienvenue sur notre site officiel. Découvrez nos services et notre expertise..."></textarea>
                </div>

                {/* DYNAMIC FIELDS BASED ON THEME */}
                {formData.themeId === 'restaurant' && renderDynamicList('menus', 'Notre Menu', 'var(--color-neon-purple)', [
                  { name: 'title', placeholder: 'Nom du plat (ex: Thiéboudienne)', bold: true },
                  { name: 'price', placeholder: 'Prix (ex: 2000 FCFA)' },
                  { name: 'desc', type: 'textarea', placeholder: 'Description des ingrédients...' }
                ])}

                {['beauty', 'hair', 'massage', 'spa'].includes(formData.themeId) && renderDynamicList('services', 'Nos Prestations', 'var(--color-neon-purple)', [
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

                {['shop', 'electronics', 'agriculture'].includes(formData.themeId) && renderDynamicList('products', 'Nos Produits Phares', 'var(--color-neon-blue)', [
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

                <div className="pt-8 border-t border-white/10">
                  <h3 className="text-xl font-bold text-[var(--color-neon-blue)] mb-4 uppercase tracking-widest">3. Personnalisation du Pied de Page</h3>
                  
                  <div className="flex gap-4 mb-4">
                    <button type="button" onClick={() => handleFooterChange('type', 'color')} className={`px-4 py-2 rounded text-sm uppercase tracking-wider ${(!formData.content.footer?.type || formData.content.footer?.type === 'color') ? 'bg-[var(--color-neon-blue)] text-black font-bold' : 'bg-white/10 text-white hover:bg-white/20'}`}>Couleur Unie</button>
                    <button type="button" onClick={() => handleFooterChange('type', 'gradient')} className={`px-4 py-2 rounded text-sm uppercase tracking-wider ${formData.content.footer?.type === 'gradient' ? 'bg-[var(--color-neon-blue)] text-black font-bold' : 'bg-white/10 text-white hover:bg-white/20'}`}>Dégradé</button>
                    <button type="button" onClick={() => handleFooterChange('type', 'image')} className={`px-4 py-2 rounded text-sm uppercase tracking-wider ${formData.content.footer?.type === 'image' ? 'bg-[var(--color-neon-blue)] text-black font-bold' : 'bg-white/10 text-white hover:bg-white/20'}`}>Image</button>
                  </div>

                  {(!formData.content.footer?.type || formData.content.footer?.type === 'color') && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Couleur de fond</label>
                      <input type="color" value={formData.content.footer?.color || '#000000'} onChange={(e) => handleFooterChange('color', e.target.value)} className="w-16 h-10 bg-transparent border-none cursor-pointer" />
                    </div>
                  )}

                  {formData.content.footer?.type === 'gradient' && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Choisissez un dégradé</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          'linear-gradient(to right, #141E30, #243B55)',
                          'linear-gradient(to right, #000000, #434343)',
                          'linear-gradient(to right, #ff416c, #ff4b2b)',
                          'linear-gradient(to right, #0f2027, #203a43, #2c5364)'
                        ].map((grad, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => handleFooterChange('gradient', grad)}
                            className={`h-12 rounded cursor-pointer border-2 ${formData.content.footer?.gradient === grad ? 'border-[var(--color-neon-blue)]' : 'border-transparent'}`}
                            style={{ backgroundImage: grad }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.content.footer?.type === 'image' && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Image de fond du footer</label>
                      <ImageUpload currentImage={formData.content.footer?.image} onUpload={(url) => handleFooterChange('image', url)} label="Fond du footer" />
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 pt-6 border-t border-white/10">
                  <button type="button" onClick={() => setCurrentStep(1)} className="w-1/3 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors font-bold uppercase text-sm tracking-wider">Retour</button>
                  <button 
                    type="button" 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-2/3 py-3 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] text-white font-bold tracking-widest uppercase rounded-lg hover:shadow-[0_0_20px_rgba(186,85,211,0.5)] transition-all flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? 'Traitement...' : (isEditMode ? 'Mettre à jour' : 'Créer mon site')}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT PANE: Live Preview */}
        <div className="flex-1 bg-white h-full overflow-y-auto relative hidden lg:block custom-scrollbar shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-10" id="preview-container">
          <div className="sticky top-0 w-full bg-[#1a1a24] text-white text-xs text-center py-2 z-50 shadow-md font-bold tracking-widest uppercase flex justify-center items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Prévisualisation en direct
          </div>
          <div className="w-full">
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
