import React, { useState } from 'react';
import { Send, ChevronRight, MapPin, Phone, Star, Coffee, Wifi, Car, Calendar, Hammer, Shield, Utensils, Scissors, ShoppingBag, Home, Key, MessageCircle, Mail, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ThemeRenderer = ({ data }) => {
  const { themeId, businessName, content, whatsapp, address, ownerEmail, slug } = data;
  const [activePage, setActivePage] = useState('accueil');
  
  // Réservation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItemName, setModalItemName] = useState('');
  const [reserveForm, setReserveForm] = useState({ clientName: '', clientEmail: '', clientPhone: '', details: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigateTo = (e, pageId) => {
    e.preventDefault();
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = (url) => {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getWhatsAppNumber = () => {
    // Si le champ whatsapp n'est pas rempli, on met un numéro par défaut pour éviter que le bouton ne fasse rien
    return String(whatsapp || '221711696897').replace(/[^0-9]/g, '');
  };

  const handleContact = () => {
    openWhatsApp(`https://wa.me/${getWhatsAppNumber()}`);
  };

  const handleOrder = (itemName) => {
    const message = encodeURIComponent(`Bonjour, je souhaite commander : ${itemName}`);
    openWhatsApp(`https://wa.me/${getWhatsAppNumber()}?text=${message}`);
  };

  const handleReservation = (itemName) => {
    setModalItemName(itemName || 'Demande de Réservation');
    setIsModalOpen(true);
  };

  const handleTableReservation = () => {
    setModalItemName('Réservation de table');
    setIsModalOpen(true);
  };

  const handleReserveSubmit = async (e) => {
    e.preventDefault();
    if (!reserveForm.clientName || !reserveForm.clientPhone || !reserveForm.clientEmail) {
      Swal.fire({ icon: 'warning', title: 'Attention', text: 'Veuillez remplir votre nom, email et téléphone.', background: '#fff', color: '#000' });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await axios.post('/api/microsites/reserve', {
        slug,
        clientName: reserveForm.clientName,
        clientEmail: reserveForm.clientEmail,
        clientPhone: reserveForm.clientPhone,
        details: reserveForm.details,
        itemName: modalItemName
      });
      Swal.fire({ icon: 'success', title: 'Demande envoyée !', text: res.data.message || 'Le propriétaire a bien reçu votre demande.', background: '#fff', color: '#000' });
      setIsModalOpen(false);
      setReserveForm({ clientName: '', clientEmail: '', clientPhone: '', details: '' });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: error.response?.data?.message || 'Erreur lors de l\'envoi de la demande.', background: '#fff', color: '#000' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderReservationModal = () => {
    if (!isModalOpen) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 font-sans text-left">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex justify-between items-center">
            <h3 className="text-xl font-bold">{modalItemName}</h3>
            <button type="button" onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white transition-colors bg-white/20 p-2 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleReserveSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Votre Nom complet *</label>
              <input type="text" value={reserveForm.clientName} onChange={(e) => setReserveForm({...reserveForm, clientName: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-gray-900" placeholder="Ex: Jean Dupont" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Adresse E-mail *</label>
              <input type="email" value={reserveForm.clientEmail} onChange={(e) => setReserveForm({...reserveForm, clientEmail: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-gray-900" placeholder="Ex: contact@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Numéro de téléphone *</label>
              <input type="tel" value={reserveForm.clientPhone} onChange={(e) => setReserveForm({...reserveForm, clientPhone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-gray-900" placeholder="Ex: 77 123 45 67" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Détails ou Demande spéciale (Optionnel)</label>
              <textarea value={reserveForm.details} onChange={(e) => setReserveForm({...reserveForm, details: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-gray-900 resize-none" rows="3" placeholder="Heure souhaitée, quantité, message particulier..."></textarea>
            </div>
            <div className="pt-4">
              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center disabled:opacity-70">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderNavbar = (links, bgColor, textColor, logoColor) => (
    <nav className={`sticky top-0 z-50 ${bgColor} ${textColor} shadow-md backdrop-blur-md bg-opacity-90`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <a href="#accueil" onClick={(e) => navigateTo(e, 'accueil')} className={`font-black text-xl tracking-tighter hover:opacity-80 transition-opacity cursor-pointer ${logoColor}`}>
          {businessName || 'Mon Site'}
        </a>
        <div className="flex space-x-6 text-sm font-bold tracking-wider uppercase items-center">
          {links.map((link, idx) => (
            <a key={idx} href={`#${link.id}`} onClick={(e) => navigateTo(e, link.id)} className={`hover:opacity-70 transition-opacity hidden md:block cursor-pointer ${activePage === link.id ? 'border-b-2' : ''}`}>
              {link.label}
            </a>
          ))}
          <a href="#contact" onClick={(e) => navigateTo(e, 'contact')} className={`hover:opacity-70 transition-opacity flex items-center cursor-pointer ${activePage === 'contact' ? 'border-b-2' : ''}`}>
             <Phone className="w-4 h-4 mr-1 hidden md:block" /> Contact
          </a>
        </div>
      </div>
    </nav>
  );

  const renderContactSection = (bgColor, textColor, accentColor) => (
    <section id="contact" className={`py-20 px-4 md:px-8 w-full ${bgColor} ${textColor}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 uppercase tracking-wider">Contact & Accès</h2>
          <div className={`w-16 h-1 mx-auto ${accentColor}`}></div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 bg-white/5 p-8 rounded-2xl border border-white/10 shadow-lg">
          <div className="w-full lg:w-1/3 space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-6">Nos Coordonnées</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0 opacity-80" />
                  <p>{address || 'Dakar, Sénégal'}</p>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 opacity-80" />
                  <a href={whatsapp ? `tel:+${String(whatsapp).replace(/[^0-9]/g, '')}` : 'tel:+221770000000'} className="hover:underline">
                    {whatsapp || '+221 77 000 00 00'}
                  </a>
                </div>
                {ownerEmail && (
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-3 opacity-80" />
                    <p>{ownerEmail}</p>
                  </div>
                )}
              </div>
            </div>
            <button onClick={handleContact} className={`w-full py-4 rounded-lg font-bold uppercase tracking-widest transition-transform hover:scale-105 flex justify-center items-center ${accentColor.replace('bg-', 'bg-').replace('text-', 'bg-')} text-white`}>
              <MessageCircle className="w-5 h-5 mr-2" /> Discuter sur WhatsApp
            </button>
          </div>
          
          <div className="w-full lg:w-2/3 h-80 rounded-xl overflow-hidden shadow-inner bg-gray-200">
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              src={`https://maps.google.com/maps?width=100%25&height=400&hl=en&q=${encodeURIComponent(address || 'Dakar, Senegal')}&t=&z=14&ie=UTF8&iwloc=B&output=embed`}
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );

  const renderSectionBackground = (children) => {
    if (!content?.sectionImage) return children;
    
    return (
      <div className="relative">
        <div 
          className="absolute inset-0 bg-fixed bg-center bg-cover z-0" 
          style={{ backgroundImage: `url(${content.sectionImage})` }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  };

  const renderFooter = (defaultBgClass, defaultTextClass) => {
    const customFooter = content?.footer || {};
    const footerStyle = {};
    let footerClass = `py-8 text-center w-full ${defaultTextClass}`;
    
    if (customFooter.type === 'color' && customFooter.color) {
      footerStyle.backgroundColor = customFooter.color;
    } else if (customFooter.type === 'gradient' && customFooter.gradient) {
      footerStyle.backgroundImage = customFooter.gradient;
    } else if (customFooter.type === 'image' && customFooter.image) {
      footerStyle.backgroundImage = `url(${customFooter.image})`;
      footerStyle.backgroundSize = 'cover';
      footerStyle.backgroundPosition = 'center';
      footerClass += ' relative'; // For overlay
    } else {
      footerClass += ` ${defaultBgClass}`;
    }

    return (
      <footer className={footerClass} style={footerStyle}>
        {customFooter.type === 'image' && <div className="absolute inset-0 bg-black/80 z-0"></div>}
        <div className="relative z-10">
          <p className="font-bold mb-2">© {new Date().getFullYear()} {businessName || 'Mon Site'}</p>
          <p className="text-xs opacity-70">Créé avec CLASSIA</p>
        </div>
      </footer>
    );
  };

  // ----- THEME 1: RESTAURANT -----
  if (themeId === 'restaurant') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans w-full scroll-smooth flex flex-col">
        {renderNavbar([
          { id: 'accueil', label: 'Accueil' },
          { id: 'menu', label: 'La Carte' }
        ], 'bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10', 'text-white', 'text-[#d4af37]')}
        
        <div className="flex-1">
          {activePage === 'accueil' && (
            <>
              <header className="relative h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <img src={content?.heroImage || "/restaurant.png"} alt="Restaurant" className="w-full h-full object-cover scale-105 animate-[slowZoom_20s_ease-in-out_infinite_alternate]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full mt-20">
                  <span className="text-[#d4af37] tracking-[0.3em] uppercase text-sm font-bold mb-4 block">Haute Gastronomie</span>
                  <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]">{businessName || 'L\'Étoile'}</h1>
                  <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">{content?.description || 'Une expérience culinaire inoubliable, où chaque plat raconte une histoire.'}</p>
                  <button onClick={handleTableReservation} className="bg-transparent border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] px-10 py-4 rounded-none font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center mx-auto">
                    <Utensils className="w-5 h-5 mr-3" /> Réserver une table
                  </button>
                </div>
              </header>
              {content?.welcomeMessage && (
                <section className="py-24 px-4 md:px-8 max-w-4xl mx-auto text-center relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#d4af37]/5 blur-[100px] rounded-full pointer-events-none"></div>
                  <h2 className="text-4xl font-serif mb-8 text-[#d4af37] italic">L'Art de la Table</h2>
                  <p className="text-xl text-gray-300 leading-relaxed whitespace-pre-wrap font-light">{content.welcomeMessage}</p>
                </section>
              )}
            </>
          )}

          {activePage === 'menu' && renderSectionBackground(
            <section className="py-24 px-4 md:px-8 max-w-6xl mx-auto w-full relative">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-serif text-white mb-6">Notre Carte</h2>
              <div className="w-16 h-px bg-[#d4af37] mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {(content?.menus?.length > 0 ? content.menus : [
                { title: 'Menu Dégustation', price: '45 000 FCFA', desc: 'Voyage en 7 temps à travers les saveurs de saison.' },
                { title: 'Filet de Bœuf Rossini', price: '25 000 FCFA', desc: 'Foie gras poêlé, truffe noire, jus corsé.' }
              ]).map((item, idx) => (
                <div key={idx} className="flex gap-6 items-center p-6 bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#d4af37]/50 transition-colors group">
                  {item.image && (
                    <div className="w-28 h-28 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-end mb-2">
                      <h3 className="text-2xl font-serif text-white">{item.title || 'Plat'}</h3>
                      <div className="text-[#d4af37] font-bold text-xl whitespace-nowrap ml-4">{item.price || 'Prix'}</div>
                    </div>
                    <div className="w-full border-b border-dotted border-white/20 mb-3"></div>
                    <p className="text-gray-400 font-light text-sm mb-4 leading-relaxed">{item.desc || 'Description...'}</p>
                    <button onClick={() => handleOrder(item.title)} className="text-xs font-bold text-white/70 uppercase tracking-widest hover:text-[#d4af37] flex items-center transition-colors">
                      <MessageCircle className="w-4 h-4 mr-2" /> Commander
                    </button>
                  </div>
                </div>
              ))}
            </div>
            </section>
          )}

          {activePage === 'contact' && renderContactSection('bg-[#050505]', 'text-white', 'bg-[#d4af37]')}
        </div>
        
        {renderFooter('bg-black border-t border-white/10', 'text-gray-500')}
        {renderReservationModal()}
      </div>
    );
  }

  // ----- THEME 2: BEAUTE / COIFFURE / MASSAGE / SPA -----
  if (['beauty', 'hair', 'massage', 'spa'].includes(themeId)) {
    return (
      <div className="min-h-screen bg-[#0f1715] text-[#e8e4db] font-serif w-full scroll-smooth flex flex-col">
        {renderNavbar([
          { id: 'accueil', label: 'Accueil' },
          { id: 'services', label: 'Soins & Bien-être' }
        ], 'bg-[#0f1715]/90 backdrop-blur-xl border-b border-white/5', 'text-[#e8e4db]', 'text-[#e0a96d]')}

        <div className="flex-1">
          {activePage === 'accueil' && (
            <>
              <header className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <img src={content?.heroImage || "/salon.png"} alt="Spa" className="w-full h-full object-cover scale-110 animate-[slowPan_25s_ease-in-out_infinite_alternate]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1715] via-[#0f1715]/40 to-transparent"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
                  <h1 className="text-6xl md:text-8xl font-light text-white mb-6 tracking-widest drop-shadow-2xl">{businessName || 'Oasis Spa'}</h1>
                  <p className="text-xl md:text-2xl text-[#e8e4db]/80 mb-12 max-w-2xl mx-auto italic font-light">"{content?.description || 'Un sanctuaire de paix pour votre corps et votre esprit.'}"</p>
                  <button onClick={() => handleReservation('Demande de Rendez-vous')} className="bg-transparent border border-[#e0a96d] text-[#e0a96d] hover:bg-[#e0a96d] hover:text-[#0f1715] hover:shadow-[0_0_40px_rgba(224,169,109,0.3)] px-12 py-4 uppercase tracking-[0.2em] text-sm transition-all duration-500 flex items-center mx-auto">
                    Prendre Rendez-vous
                  </button>
                </div>
              </header>
              {content?.welcomeMessage && (
                <section className="py-24 px-4 md:px-8 max-w-4xl mx-auto text-center">
                  <h2 className="text-4xl font-light mb-8 text-[#e0a96d] tracking-widest uppercase">Notre Philosophie</h2>
                  <p className="text-xl text-[#e8e4db]/70 leading-loose whitespace-pre-wrap font-light">{content.welcomeMessage}</p>
                </section>
              )}
            </>
          )}

          {activePage === 'services' && renderSectionBackground(
            <section className="py-24 px-4 md:px-8 max-w-6xl mx-auto w-full">
            <div className="text-center mb-20">
              <h2 className="text-4xl uppercase tracking-[0.2em] mb-6 text-white">Nos Soins</h2>
              <div className="w-12 h-px bg-[#e0a96d] mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {(content?.services?.length > 0 ? content.services : [
                { title: 'Massage Californien', price: '25.000 FCFA', desc: 'Détente absolue aux huiles essentielles bio.' },
                { title: 'Soin du Visage Éclat', price: '15.000 FCFA', desc: 'Purification et hydratation profonde.' },
                { title: 'Rituel Hammam & Gommage', price: '30.000 FCFA', desc: 'Évasion orientale complète.' }
              ]).map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-6 p-6 bg-white/5 backdrop-blur-lg border border-white/5 hover:border-[#e0a96d]/40 hover:bg-white/10 transition-all duration-500 group">
                  {item.image && (
                    <img src={item.image} alt={item.title} className="w-full sm:w-32 h-48 sm:h-32 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  )}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-light tracking-wide text-white group-hover:text-[#e0a96d] transition-colors">{item.title || 'Soin'}</h3>
                        <span className="text-[#e0a96d] font-serif text-lg">{item.price || 'Prix'}</span>
                      </div>
                      <p className="text-sm text-[#e8e4db]/50 font-light mb-4">{item.desc}</p>
                    </div>
                    <button onClick={() => handleReservation(item.title)} className="text-xs uppercase tracking-widest text-white/60 hover:text-[#e0a96d] flex items-center transition-colors w-fit">
                      <MessageCircle className="w-3 h-3 mr-2" /> Réserver
                    </button>
                  </div>
                </div>
              ))}
            </div>
            </section>
          )}

          {activePage === 'contact' && renderContactSection('bg-[#080c0b]', 'text-[#e8e4db]', 'bg-[#e0a96d]')}
        </div>
        
        {renderFooter('bg-[#040605] border-t border-white/5', 'text-[#e8e4db]/30')}
        {renderReservationModal()}
      </div>
    );
  }

  // ----- THEME 3: LOCATION VOITURES -----
  if (themeId === 'car') {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-sans w-full scroll-smooth flex flex-col">
        {renderNavbar([
          { id: 'accueil', label: 'Accueil' },
          { id: 'flotte', label: 'Notre Flotte' }
        ], 'bg-white/95', 'text-gray-900', 'text-blue-700')}

        <div className="flex-1">
          {activePage === 'accueil' && (
            <>
              <header className="relative h-[65vh] min-h-[450px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <img src={content?.heroImage || "/car.png"} alt="Cars" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-transparent"></div>
                </div>
                <div className="relative z-10 px-6 md:px-16 w-full max-w-7xl mx-auto flex flex-col items-start">
                  <div className="bg-blue-600 text-white font-bold px-3 py-1 text-xs uppercase tracking-widest mb-4 rounded shadow-md">Location Premium</div>
                  <h1 className="text-5xl md:text-7xl font-black text-white mb-4 uppercase italic tracking-tighter">{businessName || 'Auto Loc'}</h1>
                  <p className="text-xl text-blue-100 mb-8 max-w-lg">{content?.description || 'Louez les meilleurs véhicules au meilleur prix.'}</p>
                  <a href="#contact" onClick={(e) => navigateTo(e, 'contact')} className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-4 font-black uppercase tracking-wider transition-colors flex items-center shadow-2xl rounded">
                    <Key className="w-5 h-5 mr-3" /> Contacter l'agence
                  </a>
                </div>
              </header>
              {content?.welcomeMessage && (
                <section className="py-16 px-6 md:px-16 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold mb-6 text-gray-900 border-l-4 border-blue-600 pl-4">À Propos</h2>
                  <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">{content.welcomeMessage}</p>
                </section>
              )}
            </>
          )}

          {activePage === 'flotte' && renderSectionBackground(
            <section className={`py-20 px-6 max-w-7xl mx-auto w-full ${content?.sectionImage ? '' : 'bg-gray-50'}`}>
            <h2 className={`text-4xl font-black uppercase italic tracking-tighter mb-12 text-center ${content?.sectionImage ? 'text-white drop-shadow-md' : 'text-gray-900'}`}>Notre Flotte</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(content?.vehicles?.length > 0 ? content.vehicles : [
                { title: 'Range Rover Velar', price: '60.000 FCFA/jour', desc: 'Auto, Clim, 5 places, Cuir' },
                { title: 'Hyundai Tucson', price: '35.000 FCFA/jour', desc: 'Auto, Clim, 5 places' }
              ]).map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 group flex flex-col transform transition-transform hover:-translate-y-2">
                  <div className="h-56 bg-gray-200 relative overflow-hidden">
                     <img src={item.image || "/car.png"} alt="Voiture" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute bottom-0 right-0 bg-blue-600 text-white font-black px-6 py-2 shadow-lg">{item.price || 'Prix'}</div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-gray-900 mb-2 uppercase">{item.title || 'Véhicule'}</h3>
                    <p className="text-gray-500 text-sm mb-6 flex-1">{item.desc || 'Options...'}</p>
                    <button onClick={() => handleReservation(item.title)} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold uppercase text-sm py-4 rounded-lg flex items-center justify-center transition-colors shadow-md">
                      <MessageCircle className="w-5 h-5 mr-2" /> Réserver le véhicule
                    </button>
                  </div>
                </div>
              ))}
            </div>
            </section>
          )}

          {activePage === 'contact' && renderContactSection('bg-blue-900', 'text-white', 'bg-blue-500')}
        </div>
        
        {renderFooter('bg-gray-900', 'text-gray-400')}
        {renderReservationModal()}
      </div>
    );
  }

  // ----- THEME 4: IMMOBILIER -----
  if (themeId === 'realestate') {
    return (
      <div className="min-h-screen bg-gray-100 text-gray-800 font-sans w-full scroll-smooth flex flex-col">
        {renderNavbar([
          { id: 'accueil', label: 'Accueil' },
          { id: 'biens', label: 'Nos Propriétés' }
        ], 'bg-teal-900/95', 'text-white', 'text-white')}

        <div className="flex-1">
          {activePage === 'accueil' && (
            <>
              <header className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <img src={content?.heroImage || "/realestate.png"} alt="Villa" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50"></div>
                </div>
                <div className="relative z-10 text-center px-4 w-full">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <Home className="w-10 h-10 text-teal-700" />
                  </div>
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">{businessName || 'Immo Prestige'}</h1>
                  <p className="text-2xl text-white/90 font-light mb-8 max-w-2xl mx-auto drop-shadow">{content?.description || 'Trouvez la maison de vos rêves.'}</p>
                  <button onClick={() => handleReservation('Demande de Rendez-vous')} className="inline-flex bg-teal-700 hover:bg-teal-800 text-white px-8 py-4 font-bold text-lg rounded shadow-xl transition-all items-center mx-auto">
                    <Phone className="w-5 h-5 mr-2" /> Prendre Rendez-vous
                  </button>
                </div>
              </header>
              {content?.welcomeMessage && (
                <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl font-bold mb-6 text-gray-900">Bienvenue</h2>
                  <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">{content.welcomeMessage}</p>
                </section>
              )}
            </>
          )}

          {activePage === 'biens' && renderSectionBackground(
            <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
             <h2 className={`text-3xl font-bold mb-12 border-l-4 pl-4 ${content?.sectionImage ? 'text-white border-white' : 'text-gray-900 border-teal-700'}`}>Propriétés Exclusives</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(content?.properties?.length > 0 ? content.properties : [
                { title: 'Villa R+1 Almadies', price: 'A vendre: 250 Millions', desc: '4 chambres, piscine, jardin.' },
                { title: 'Appartement F4 Ngor', price: 'Location: 600.000/mois', desc: 'Vue mer, parking souterrain.' }
              ]).map((item, idx) => (
                <div key={idx} className="bg-white flex flex-col md:flex-row shadow-xl hover:shadow-2xl transition-shadow rounded-lg overflow-hidden group">
                  <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
                    <img src={item.image || "/realestate.png"} alt="Bien" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-center">
                    <div className="inline-block bg-teal-100 text-teal-800 px-3 py-1 rounded text-sm font-bold mb-4 w-fit">{item.price || 'Prix'}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title || 'Titre du bien'}</h3>
                    <p className="text-gray-600 mb-8 line-clamp-3">{item.desc || 'Description...'}</p>
                    <button onClick={() => handleReservation(item.title)} className="text-sm font-bold text-white bg-green-600 px-6 py-3 rounded flex items-center justify-center hover:bg-green-700 w-full mt-auto transition-colors shadow-md">
                      <MessageCircle className="w-5 h-5 mr-2" /> Être recontacté pour ce bien
                    </button>
                  </div>
                </div>
              ))}
            </div>
            </section>
          )}

          {activePage === 'contact' && renderContactSection('bg-gray-900', 'text-white', 'bg-teal-500')}
        </div>
        
        {renderFooter('bg-black', 'text-gray-400')}
        {renderReservationModal()}
      </div>
    );
  }

  // ----- THEME 5: BOUTIQUE -----
  if (themeId === 'shop') {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-sans w-full scroll-smooth flex flex-col">
        {renderNavbar([
          { id: 'accueil', label: 'Accueil' },
          { id: 'produits', label: 'Collection' }
        ], 'bg-[#050505]/80 backdrop-blur-md border-b border-white/10', 'text-white', 'text-white')}

        <div className="flex-1">
          {activePage === 'accueil' && (
            <>
              <header className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <img src={content?.heroImage || "/shop.png"} alt="Collection" className="w-full h-full object-cover scale-105 animate-[slowZoom_30s_ease-in-out_infinite_alternate] grayscale opacity-70" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/40"></div>
                </div>
                <div className="relative z-10 px-4 w-full flex flex-col items-center justify-center text-center mt-20">
                  <span className="text-white/60 uppercase tracking-[0.4em] text-xs font-bold mb-6 block border border-white/20 px-6 py-2 backdrop-blur-sm">Nouvelle Collection</span>
                  <h1 className="text-7xl md:text-9xl font-black text-white mb-6 uppercase tracking-tighter" style={{ textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
                    {businessName || 'MAISON'}
                  </h1>
                  <p className="text-xl text-white/80 mb-12 max-w-2xl font-light italic">"{content?.description || 'L\'élégance intemporelle pour une allure inoubliable.'}"</p>
                  <a href="#produits" onClick={(e) => navigateTo(e, 'produits')} className="inline-flex bg-white text-black hover:bg-gray-200 px-12 py-5 text-sm uppercase tracking-[0.2em] font-bold items-center transition-all duration-300 hover:scale-105">
                    Découvrir
                  </a>
                </div>
              </header>
              {content?.welcomeMessage && (
                <section className="py-24 px-6 md:px-16 max-w-5xl mx-auto text-center">
                  <h2 className="text-3xl font-light mb-10 text-white uppercase tracking-[0.3em]">Notre Vision</h2>
                  <p className="text-xl text-white/60 leading-loose whitespace-pre-wrap font-light">{content.welcomeMessage}</p>
                </section>
              )}
            </>
          )}

          {activePage === 'produits' && renderSectionBackground(
            <section className="py-32 px-4 md:px-8 max-w-7xl mx-auto w-full">
            <div className="flex flex-col items-center mb-24 text-center">
              <span className="text-white/40 uppercase tracking-[0.5em] text-xs mb-4">Édition Limitée</span>
              <h2 className="text-5xl font-black text-white uppercase tracking-widest">Le Vestiaire</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {(content?.products?.length > 0 ? content.products : [
                { title: 'Robe Haute Couture', price: '120.000 FCFA' },
                { title: 'Ensemble Tailleur', price: '85.000 FCFA' },
                { title: 'Sac en Cuir Iconique', price: '150.000 FCFA' },
                { title: 'Escarpins Signature', price: '75.000 FCFA' }
              ]).map((item, idx) => (
                <div key={idx} className="group cursor-pointer flex flex-col">
                  <div className="bg-[#111] aspect-[2/3] mb-6 overflow-hidden relative border border-white/5">
                    <img src={item.image || "/shop.png"} alt="Produit" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 backdrop-blur-[2px]">
                      <button onClick={() => handleOrder(item.title)} className="bg-white text-black hover:bg-gray-200 w-full py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 transform translate-y-8 group-hover:translate-y-0 flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 mr-3" /> Acquérir
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-light text-lg text-white group-hover:text-gray-300 transition-colors uppercase tracking-widest leading-tight pr-4">{item.title || 'Pièce'}</h3>
                    <p className="text-white/50 font-bold whitespace-nowrap">{item.price || 'Prix'}</p>
                  </div>
                </div>
              ))}
            </div>
            </section>
          )}

          {activePage === 'contact' && renderContactSection('bg-[#0a0a0a]', 'text-white', 'bg-white')}
        </div>
        
        {renderFooter('bg-[#020202] border-t border-white/10', 'text-white/40')}
        {renderReservationModal()}
      </div>
    );
  }

  // ----- THEME DENTISTE -----
  if (themeId === 'dentist') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans w-full scroll-smooth flex flex-col">
        {renderNavbar([
          { id: 'accueil', label: 'Accueil' },
          { id: 'soins', label: 'Soins' }
        ], 'bg-white/95', 'text-slate-800', 'text-blue-600')}

        <div className="flex-1">
          {activePage === 'accueil' && (
            <>
              <header className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <img src={content?.heroImage || "/dentist.png"} alt="Cabinet Dentaire" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-md">{businessName || 'Cabinet Dentaire'}</h1>
                  <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">{content?.description || 'Prenez soin de votre sourire.'}</p>
                  <button onClick={() => handleReservation('Demande de Rendez-vous')} className="inline-flex bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-transform hover:scale-105 items-center mx-auto">
                    <Calendar className="w-5 h-5 mr-2" /> Prendre Rendez-vous
                  </button>
                </div>
              </header>
              {content?.welcomeMessage && (
                <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl font-bold mb-6 text-slate-800">Bienvenue au Cabinet</h2>
                  <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">{content.welcomeMessage}</p>
                </section>
              )}
            </>
          )}

          {activePage === 'soins' && renderSectionBackground(
            <section className="py-24 px-4 md:px-8 max-w-6xl mx-auto w-full">
            <div className="text-center mb-16">
              <h2 className={`text-3xl font-bold mb-4 ${content?.sectionImage ? 'text-white' : 'text-slate-800'}`}>Nos Soins</h2>
              <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(content?.services?.length > 0 ? content.services : [
                { title: 'Consultation Générale', desc: 'Bilan complet et conseils.' }
              ]).map((service, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col transform hover:-translate-y-1 transition-transform">
                  {service.image ? (
                    <img src={service.image} alt={service.title} className="w-full h-40 object-cover rounded-xl mb-6 shadow-sm" />
                  ) : (
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                      <Shield className="w-8 h-8 text-blue-500" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-4 text-slate-800">{service.title || 'Service'}</h3>
                  <p className="text-slate-600 leading-relaxed mb-8 flex-1">{service.desc || 'Description...'}</p>
                  <button onClick={() => handleReservation(service.title)} className="w-full bg-green-50 text-green-700 hover:bg-green-100 py-3 rounded-xl font-bold flex justify-center items-center transition-colors">
                    <MessageCircle className="w-5 h-5 mr-2" /> Prendre Rendez-vous
                  </button>
                </div>
              ))}
            </div>
            </section>
          )}

          {activePage === 'contact' && renderContactSection('bg-slate-900', 'text-white', 'bg-blue-500')}
        </div>
        
        {renderFooter('bg-slate-800', 'text-slate-400')}
        {renderReservationModal()}
      </div>
    );
  }

  // ----- THEME HOTEL -----
  if (themeId === 'hotel') {
    return (
      <div className="min-h-screen bg-[#141210] text-[#f4efe6] font-serif w-full scroll-smooth flex flex-col">
        {renderNavbar([
          { id: 'accueil', label: 'Accueil' },
          { id: 'chambres', label: 'Chambres & Suites' }
        ], 'bg-[#141210]/80 backdrop-blur-lg border-b border-white/10', 'text-[#f4efe6]', 'text-[#d4af37]')}

        <div className="flex-1">
          {activePage === 'accueil' && (
            <>
              <header className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <img src={content?.heroImage || "/hotel.png"} alt="Hôtel Luxe" className="w-full h-full object-cover animate-[slowPan_30s_ease-in-out_infinite_alternate] scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-black/40 to-[#141210]/20"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full mt-20">
                  <div className="flex justify-center mb-6 space-x-2">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />)}
                  </div>
                  <h1 className="text-6xl md:text-8xl font-light text-white mb-6 drop-shadow-2xl tracking-tight">{businessName || 'Le Palace'}</h1>
                  <p className="text-xl md:text-2xl text-[#f4efe6]/80 mb-12 max-w-3xl mx-auto font-light leading-relaxed">"{content?.description || 'L\'élégance absolue, où chaque détail est pensé pour votre confort.'}"</p>
                  <a href="#contact" onClick={(e) => navigateTo(e, 'contact')} className="inline-flex bg-[#d4af37] hover:bg-[#c2a032] text-black px-12 py-4 tracking-[0.2em] uppercase text-sm font-bold transition-all mx-auto items-center hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                    Réserver votre séjour
                  </a>
                </div>
              </header>
              {content?.welcomeMessage && (
                <section className="py-24 px-4 md:px-8 max-w-4xl mx-auto text-center">
                  <h2 className="text-4xl font-light mb-8 text-[#d4af37] tracking-widest uppercase">Bienvenue</h2>
                  <p className="text-xl text-[#f4efe6]/70 leading-loose whitespace-pre-wrap font-light">{content.welcomeMessage}</p>
                </section>
              )}
            </>
          )}

          {activePage === 'chambres' && renderSectionBackground(
            <section className="py-24 px-4 max-w-7xl mx-auto w-full relative">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-light mb-6 text-white tracking-widest uppercase">Chambres & Suites</h2>
              <div className="w-16 h-px bg-[#d4af37] mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {(content?.rooms?.length > 0 ? content.rooms : [
                { title: 'Suite Royale', price: '250.000 FCFA', desc: 'Vue panoramique, salon privé et service majordome 24/7.' }
              ]).map((room, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 flex flex-col md:flex-row h-full overflow-hidden group hover:border-[#d4af37]/50 transition-colors">
                  <div className="w-full md:w-1/2 h-72 md:h-auto overflow-hidden relative">
                     <img src={room.image || "/hotel.png"} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Chambre" />
                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                  </div>
                  <div className="p-8 md:p-10 flex-1 flex flex-col justify-center relative">
                    <h3 className="text-3xl font-light mb-2 text-white">{room.title || 'Chambre'}</h3>
                    <p className="text-[#d4af37] font-serif mb-6 text-xl tracking-wider">{room.price || 'Tarif'}</p>
                    <div className="w-full border-b border-white/10 mb-6"></div>
                    <p className="text-[#f4efe6]/60 mb-8 leading-relaxed font-light">{room.desc || 'Description...'}</p>
                    <button onClick={() => handleReservation(room.title)} className="flex items-center text-xs uppercase tracking-widest text-white/50 hover:text-[#d4af37] transition-colors mt-auto w-fit">
                      <MessageCircle className="w-4 h-4 mr-3" /> Demander une réservation
                    </button>
                  </div>
                </div>
              ))}
            </div>
            </section>
          )}

          {activePage === 'contact' && renderContactSection('bg-[#0a0908]', 'text-[#f4efe6]', 'bg-[#d4af37]')}
        </div>
        
        {renderFooter('bg-black border-t border-white/10', 'text-[#f4efe6]/40')}
        {renderReservationModal()}
      </div>
    );
  }

  // ----- THEME CARPENTRY -----
  if (themeId === 'carpentry') {
    return (
      <div className="min-h-screen bg-neutral-900 text-neutral-200 font-sans w-full scroll-smooth flex flex-col">
        {renderNavbar([
          { id: 'accueil', label: 'Accueil' },
          { id: 'projets', label: 'Réalisations' }
        ], 'bg-black/95', 'text-neutral-400', 'text-white')}

        <div className="flex-1">
          {activePage === 'accueil' && (
            <>
              <header className="relative h-[60vh] min-h-[400px] flex items-center border-b-8 border-amber-600">
                <div className="absolute inset-0 z-0">
                  <img src={content?.heroImage || "/carpentry.png"} alt="Menuiserie" className="w-full h-full object-cover grayscale opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-transparent"></div>
                </div>
                <div className="relative z-10 px-6 md:px-16 max-w-5xl w-full">
                  <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase leading-tight drop-shadow-lg">{businessName || 'Menuiserie Pro'}</h1>
                  <p className="text-xl text-neutral-400 mb-10 max-w-2xl">{content?.description || 'Experts en menuiserie bois et métallique.'}</p>
                  <a href="#contact" onClick={(e) => navigateTo(e, 'contact')} className="inline-flex bg-amber-600 text-white hover:bg-amber-500 px-8 py-4 font-black uppercase tracking-wider transition-colors items-center w-fit shadow-xl">
                    <MapPin className="w-5 h-5 mr-3" /> Notre Atelier
                  </a>
                </div>
              </header>
              {content?.welcomeMessage && (
                <section className="py-16 px-6 md:px-16 max-w-4xl mx-auto">
                  <h2 className="text-3xl font-black text-white uppercase mb-6 border-l-4 border-amber-600 pl-4">Qui Sommes-Nous ?</h2>
                  <p className="text-lg text-neutral-400 leading-relaxed whitespace-pre-wrap">{content.welcomeMessage}</p>
                </section>
              )}
            </>
          )}

          {activePage === 'projets' && renderSectionBackground(
            <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto w-full">
            <h2 className="text-4xl font-black text-white uppercase mb-12 border-l-4 border-amber-600 pl-4">Nos Réalisations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(content?.projects?.length > 0 ? content.projects : [
                { title: 'Portes & Fenêtres', desc: 'Fabrication et pose de menuiseries extérieures isolantes.' }
              ]).map((proj, idx) => (
                <div key={idx} className="group relative overflow-hidden bg-neutral-800 border border-neutral-700 flex flex-col shadow-2xl hover:border-amber-500 transition-colors">
                  <div className="h-64 overflow-hidden relative">
                     <img src={proj.image || "/carpentry.png"} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" alt="Projet" />
                  </div>
                  <div className="p-8 bg-neutral-900 border-t border-neutral-800 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-white mb-4">{proj.title || 'Projet'}</h3>
                    <p className="text-neutral-400 text-sm mb-8 flex-1">{proj.desc || 'Description...'}</p>
                    <button onClick={() => handleReservation(proj.title)} className="w-full bg-green-700 hover:bg-green-600 text-white py-3 font-bold flex items-center justify-center transition-colors shadow-md">
                       <MessageCircle className="w-5 h-5 mr-2" /> Demander un devis
                    </button>
                  </div>
                </div>
              ))}
            </div>
            </section>
          )}

          {activePage === 'contact' && renderContactSection('bg-black', 'text-white', 'bg-amber-600')}
        </div>
        
        {renderFooter('bg-[#111]', 'text-neutral-500')}
        {renderReservationModal()}
      </div>
    );
  }


  // ----- THEME 5: ELECTRONICS (Apple-like, sleek, premium) -----
  if (themeId === 'electronics') {
    return (
      <div className="min-h-screen bg-[#000000] text-gray-100 font-sans w-full scroll-smooth flex flex-col">
        {renderNavbar([
          { id: 'accueil', label: 'Accueil' },
          { id: 'produits', label: 'Store' }
        ], 'bg-black/70 backdrop-blur-2xl border-b border-white/10', 'text-gray-100', 'text-white')}

        <div className="flex-1">
          {activePage === 'accueil' && (
            <>
              <header className="relative h-[100vh] min-h-[700px] flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <img src={content?.heroImage || "/electronics.png"} alt="Tech" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full flex flex-col items-center">
                  <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-6 tracking-tight leading-tight">{businessName || 'Tech Store'}</h1>
                  <p className="text-xl md:text-3xl text-gray-400 mb-12 max-w-3xl mx-auto font-medium tracking-wide">{content?.description || 'L\'innovation à l\'état pur. Puissance. Design.'}</p>
                  <a href="#produits" onClick={(e) => navigateTo(e, 'produits')} className="inline-flex bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-bold items-center transition-transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                    Explorer la gamme
                  </a>
                </div>
              </header>
              {content?.welcomeMessage && (
                <section className="py-32 px-4 md:px-8 max-w-5xl mx-auto text-center">
                  <h2 className="text-4xl md:text-5xl font-bold mb-10 text-white tracking-tight">Redéfinir le futur.</h2>
                  <p className="text-2xl text-gray-400 leading-relaxed whitespace-pre-wrap font-light">{content.welcomeMessage}</p>
                </section>
              )}
            </>
          )}

          {activePage === 'produits' && renderSectionBackground(
            <section className="py-32 px-4 max-w-7xl mx-auto w-full">
            <div className="text-center mb-24">
              <h2 className="text-5xl font-bold mb-4 text-white tracking-tight">Nouveautés</h2>
              <p className="text-xl text-gray-500">Lequel sera le vôtre ?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(content?.products?.length > 0 ? content.products : [
                { title: 'Ordinateur Portable Pro', price: '950.000 FCFA', image: '' },
                { title: 'Smartphone Ultra', price: '650.000 FCFA', image: '' },
                { title: 'Casque Audio Sans Fil', price: '150.000 FCFA', image: '' }
              ]).map((item, idx) => (
                <div key={idx} className="bg-[#111111] rounded-3xl p-8 flex flex-col items-center text-center group hover:bg-[#1a1a1a] transition-colors border border-white/5 hover:border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-2">{item.title || 'Produit'}</h3>
                  <p className="text-gray-400 mb-8">{item.price || 'Prix'}</p>
                  <div className="w-full h-64 mb-8 flex items-center justify-center relative">
                    <img src={item.image || "/electronics.png"} alt={item.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <button onClick={() => handleOrder(item.title)} className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 py-3 text-sm font-bold w-full transition-colors flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 mr-2" /> Acheter
                  </button>
                </div>
              ))}
            </div>
            </section>
          )}

          {activePage === 'contact' && renderContactSection('bg-[#050505]', 'text-gray-200', 'bg-blue-600')}
        </div>
        
        {renderFooter('bg-black border-t border-white/10', 'text-gray-600')}
        {renderReservationModal()}
      </div>
    );
  }

  // ----- THEME 6: AGRICULTURE -----
  if (themeId === 'agriculture') {
    return (
      <div className="min-h-screen bg-[#131f18] text-[#eaf2eb] font-sans w-full scroll-smooth flex flex-col">
        {renderNavbar([
          { id: 'accueil', label: 'Accueil' },
          { id: 'produits', label: 'Nos Produits' }
        ], 'bg-[#131f18]/90 backdrop-blur-md border-b border-[#2a4030]', 'text-[#eaf2eb]', 'text-[#d4a055]')}

        <div className="flex-1">
          {activePage === 'accueil' && (
            <>
              <header className="relative h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <img src={content?.heroImage || "/agriculture.png"} alt="Ferme" className="w-full h-full object-cover animate-[slowPan_25s_ease-in-out_infinite_alternate] scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131f18] via-[#131f18]/60 to-transparent"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full mt-10">
                  <span className="text-[#d4a055] uppercase tracking-widest text-sm font-bold mb-4 block">100% Bio & Local</span>
                  <h1 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-lg">{businessName || 'Ferme Nature'}</h1>
                  <p className="text-xl md:text-2xl text-[#eaf2eb]/90 mb-10 max-w-2xl mx-auto font-medium">{content?.description || 'Le meilleur de la terre, directement dans votre assiette.'}</p>
                  <a href="#produits" onClick={(e) => navigateTo(e, 'produits')} className="inline-flex bg-[#32523e] hover:bg-[#40664e] text-white px-10 py-4 rounded-xl font-bold tracking-widest uppercase transition-all mx-auto items-center shadow-2xl border border-[#4a7a5c]">
                    Découvrir nos récoltes
                  </a>
                </div>
              </header>
              {content?.welcomeMessage && (
                <section className="py-20 px-4 md:px-8 max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl font-bold mb-6 text-[#d4a055]">Notre Engagement</h2>
                  <p className="text-xl text-[#eaf2eb]/80 leading-relaxed whitespace-pre-wrap">{content.welcomeMessage}</p>
                </section>
              )}
            </>
          )}

          {activePage === 'produits' && renderSectionBackground(
            <section className="py-24 px-4 max-w-6xl mx-auto w-full relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-white">Nos Produits Fermiers</h2>
              <div className="w-16 h-1 bg-[#d4a055] mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {(content?.products?.length > 0 ? content.products : [
                { title: 'Panier Légumes de Saison', price: '10.000 FCFA' },
                { title: 'Oeufs Fermiers (Plateau)', price: '3.500 FCFA' },
                { title: 'Miel Pur Naturel', price: '5.000 FCFA' }
              ]).map((item, idx) => (
                <div key={idx} className="bg-[#1b2b21] rounded-2xl overflow-hidden shadow-2xl border border-[#2a4030] group">
                  <div className="h-56 overflow-hidden relative">
                     <img src={item.image || "/agriculture.png"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" alt="Produit" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 text-white">{item.title || 'Produit'}</h3>
                    <p className="text-[#d4a055] font-bold text-xl mb-6">{item.price || 'Tarif'}</p>
                    <button onClick={() => handleOrder(item.title)} className="flex items-center justify-center w-full bg-[#32523e] hover:bg-[#40664e] text-white py-3 rounded-lg font-bold transition-colors">
                      <ShoppingBag className="w-5 h-5 mr-2" /> Commander
                    </button>
                  </div>
                </div>
              ))}
            </div>
            </section>
          )}

          {activePage === 'contact' && renderContactSection('bg-[#0e1712]', 'text-[#eaf2eb]', 'bg-[#d4a055]')}
        </div>
        
        {renderFooter('bg-[#080d0a] border-t border-[#131f18]', 'text-[#eaf2eb]/50')}
        {renderReservationModal()}
      </div>
    );
  }

  // ----- FALLBACK (Generic) -----
  return (
    <div className="min-h-screen bg-[#0a0a10] flex items-center justify-center w-full">
      <div className="text-center p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-white mb-4 tracking-widest uppercase">Aperçu en direct</h1>
        <p className="text-gray-400">Veuillez sélectionner un thème pour voir l'aperçu du site.</p>
      </div>
    </div>
  );
};

export default ThemeRenderer;
