import React from 'react';
import { Send, ChevronRight, MapPin, Phone, Star, Coffee, Wifi, Car, Calendar, Hammer, Shield, Utensils, Scissors, ShoppingBag, Home, Key, MessageCircle, Mail } from 'lucide-react';

const ThemeRenderer = ({ data }) => {
  const { themeId, businessName, content, whatsapp, address, ownerEmail, slug } = data;

  const handleContact = () => {
    if (whatsapp) {
      window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
    }
  };

  const handleOrder = (itemName) => {
    if (whatsapp) {
      const message = encodeURIComponent(`Bonjour, je souhaite commander / réserver : ${itemName}`);
      window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
    }
  };

  const handleTableReservation = () => {
    if (whatsapp) {
      const guests = window.prompt("Pour combien de personnes souhaitez-vous réserver une table ? (ex: 2)");
      if (guests) {
        const message = encodeURIComponent(`Bonjour, je souhaite réserver une table pour ${guests} personne(s). Avez-vous de la disponibilité ?`);
        window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
      }
    }
  };

  const renderNavbar = (links, bgColor, textColor, logoColor) => (
    <nav className={`sticky top-0 z-50 ${bgColor} ${textColor} shadow-md backdrop-blur-md bg-opacity-90`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <a href="#accueil" className={`font-black text-xl tracking-tighter hover:opacity-80 transition-opacity ${logoColor}`}>
          {businessName || 'Mon Site'}
        </a>
        <div className="flex space-x-6 text-sm font-bold tracking-wider uppercase items-center">
          {links.map((link, idx) => (
            <a key={idx} href={link.href} className="hover:opacity-70 transition-opacity hidden md:block">
              {link.label}
            </a>
          ))}
          <a href="#contact" className="hover:opacity-70 transition-opacity flex items-center">
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
                  <p>{whatsapp || '+221 77 000 00 00'}</p>
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

  // ----- THEME 1: RESTAURANT -----
  if (themeId === 'restaurant') {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 font-sans w-full scroll-smooth">
        {renderNavbar([
          { label: 'Accueil', href: '#accueil' },
          { label: 'Menu', href: '#menu' }
        ], 'bg-white/95', 'text-stone-900', 'text-orange-600')}
        
        <header id="accueil" className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={content?.heroImage || "/restaurant.png"} alt="Restaurant" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg">{businessName || 'Le Teranga'}</h1>
            <p className="text-xl text-stone-200 mb-8 max-w-2xl mx-auto font-medium">{content?.description || 'Des saveurs authentiques, un cadre chaleureux.'}</p>
            <button onClick={handleTableReservation} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-transform hover:scale-105 flex items-center mx-auto">
              <Utensils className="w-5 h-5 mr-2" /> Réserver une table
            </button>
          </div>
        </header>
        
        {renderSectionBackground(
          <section id="menu" className={`py-20 px-4 md:px-8 max-w-5xl mx-auto w-full ${content?.sectionImage ? 'text-white' : ''}`}>
            <div className="text-center mb-16">
              <h2 className={`text-4xl font-bold mb-4 ${content?.sectionImage ? 'text-white' : 'text-stone-800'}`}>Notre Menu</h2>
              <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(content?.menus?.length > 0 ? content.menus : [
                { title: 'Thiéboudienne', price: '2500 FCFA', desc: 'Riz au poisson classique, légumes frais.' },
                { title: 'Yassa Poulet', price: '3000 FCFA', desc: 'Poulet mariné au citron et oignons.' }
              ]).map((item, idx) => (
                <div key={idx} className={`flex gap-4 items-start border-b ${content?.sectionImage ? 'border-white/20' : 'border-stone-200'} pb-6 group`}>
                  {item.image && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-xl font-bold ${content?.sectionImage ? 'text-white' : 'text-stone-800'}`}>{item.title || 'Plat'}</h3>
                      <div className="text-orange-500 font-bold text-lg whitespace-nowrap ml-4">{item.price || 'Prix'}</div>
                    </div>
                    <p className={`${content?.sectionImage ? 'text-gray-300' : 'text-stone-500'} mt-1 mb-3`}>{item.desc || 'Description...'}</p>
                    <button onClick={() => handleOrder(item.title)} className="text-sm font-bold text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded flex items-center w-fit shadow-md">
                      <MessageCircle className="w-4 h-4 mr-2" /> Commander
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {renderContactSection('bg-stone-900', 'text-white', 'bg-orange-500')}
        
        <footer className="bg-black text-stone-500 py-6 text-center w-full">
          <p className="font-bold">© {new Date().getFullYear()} {businessName || 'Mon Restaurant'}</p>
        </footer>
      </div>
    );
  }

  // ----- THEME 2: SALON DE COIFFURE -----
  if (themeId === 'salon') {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-[#2c2c2c] font-serif w-full scroll-smooth">
        {renderNavbar([
          { label: 'Accueil', href: '#accueil' },
          { label: 'Prestations', href: '#services' }
        ], 'bg-[#3a2e2a]/95', 'text-[#f2e6d9]', 'text-[#d4af37]')}

        <header id="accueil" className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={content?.heroImage || "/salon.png"} alt="Salon" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#3a2e2a]/60"></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
            <h1 className="text-5xl md:text-7xl font-bold text-[#f2e6d9] mb-4 tracking-wider">{businessName || 'Espace Beauté'}</h1>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto italic">{content?.description || 'Révélez votre beauté naturelle.'}</p>
            <button onClick={handleContact} className="bg-transparent border border-[#f2e6d9] text-[#f2e6d9] hover:bg-[#f2e6d9] hover:text-[#3a2e2a] px-10 py-3 uppercase tracking-widest text-sm transition-colors flex items-center mx-auto font-bold backdrop-blur-sm">
              <Scissors className="w-4 h-4 mr-2" /> Prendre Rendez-vous
            </button>
          </div>
        </header>

        {renderSectionBackground(
          <section id="services" className="py-20 px-4 md:px-8 max-w-5xl mx-auto w-full">
            <div className="text-center mb-16">
              <h2 className={`text-3xl uppercase tracking-widest mb-4 ${content?.sectionImage ? 'text-[#f2e6d9]' : 'text-[#3a2e2a]'}`}>Nos Prestations</h2>
              <div className="w-12 h-px bg-[#d4af37] mx-auto"></div>
            </div>
            <div className="space-y-6">
              {(content?.services?.length > 0 ? content.services : [
                { title: 'Tresses Africaines', price: '15.000 FCFA' },
                { title: 'Soin du Visage', price: '10.000 FCFA' },
                { title: 'Manucure & Pédicure', price: '8.000 FCFA' }
              ]).map((item, idx) => (
                <div key={idx} className={`flex flex-col md:flex-row justify-between items-center group p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow ${content?.sectionImage ? 'bg-[#3a2e2a]/80 text-white border border-[#d4af37]/30' : 'bg-white text-[#2c2c2c]'}`}>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-16 h-16 rounded object-cover shadow-md" />
                    )}
                    <h3 className="text-lg font-bold group-hover:text-[#d4af37] transition-colors">{item.title || 'Prestation'}</h3>
                  </div>
                  
                  <div className={`hidden md:block flex-1 border-b border-dotted mx-6 ${content?.sectionImage ? 'border-white/30' : 'border-gray-300'}`}></div>
                  
                  <div className="flex items-center gap-6 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                    <div className="font-bold text-lg text-[#d4af37]">{item.price || 'Prix'}</div>
                    <button onClick={() => handleOrder(item.title)} className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition-colors flex items-center text-sm font-bold shadow-md">
                      <MessageCircle className="w-4 h-4 mr-2" /> Réserver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {renderContactSection('bg-[#3a2e2a]', 'text-[#f2e6d9]', 'bg-[#d4af37]')}
        
        <footer className="bg-[#2c2320] text-[#f2e6d9]/50 py-6 text-center text-xs tracking-widest uppercase w-full">
          <p>{businessName || 'Mon Salon'}</p>
        </footer>
      </div>
    );
  }

  // ----- THEME 3: LOCATION VOITURES -----
  if (themeId === 'car') {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-sans w-full scroll-smooth">
        {renderNavbar([
          { label: 'Accueil', href: '#accueil' },
          { label: 'Notre Flotte', href: '#flotte' }
        ], 'bg-white/95', 'text-gray-900', 'text-blue-700')}

        <header id="accueil" className="relative h-[65vh] min-h-[450px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={content?.heroImage || "/car.png"} alt="Cars" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-transparent"></div>
          </div>
          <div className="relative z-10 px-6 md:px-16 w-full max-w-7xl mx-auto flex flex-col items-start">
            <div className="bg-blue-600 text-white font-bold px-3 py-1 text-xs uppercase tracking-widest mb-4 rounded shadow-md">Location Premium</div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 uppercase italic tracking-tighter">{businessName || 'Auto Loc'}</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-lg">{content?.description || 'Louez les meilleurs véhicules au meilleur prix.'}</p>
            <a href="#contact" className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-4 font-black uppercase tracking-wider transition-colors flex items-center shadow-2xl rounded">
              <Key className="w-5 h-5 mr-3" /> Contacter l'agence
            </a>
          </div>
        </header>

        {renderSectionBackground(
          <section id="flotte" className={`py-20 px-6 max-w-7xl mx-auto w-full ${content?.sectionImage ? '' : 'bg-gray-50'}`}>
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
                    <button onClick={() => handleOrder(item.title)} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold uppercase text-sm py-4 rounded-lg flex items-center justify-center transition-colors shadow-md">
                      <MessageCircle className="w-5 h-5 mr-2" /> Réserver sur WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {renderContactSection('bg-blue-900', 'text-white', 'bg-blue-500')}
        
      </div>
    );
  }

  // ----- THEME 4: IMMOBILIER -----
  if (themeId === 'realestate') {
    return (
      <div className="min-h-screen bg-gray-100 text-gray-800 font-sans w-full scroll-smooth">
        {renderNavbar([
          { label: 'Accueil', href: '#accueil' },
          { label: 'Nos Biens', href: '#biens' }
        ], 'bg-teal-900/95', 'text-white', 'text-white')}

        <header id="accueil" className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
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
            <a href="#contact" className="inline-flex bg-teal-700 hover:bg-teal-800 text-white px-8 py-4 font-bold text-lg rounded shadow-xl transition-all items-center mx-auto">
              <Phone className="w-5 h-5 mr-2" /> Prendre Rendez-vous
            </a>
          </div>
        </header>

        {renderSectionBackground(
          <section id="biens" className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
             <h2 className={`text-3xl font-bold mb-12 border-l-4 pl-4 ${content?.sectionImage ? 'text-white border-white' : 'text-gray-900 border-teal-700'}`}>Derniers Biens</h2>
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
                    <button onClick={() => handleOrder(item.title)} className="text-sm font-bold text-white bg-green-600 px-6 py-3 rounded flex items-center justify-center hover:bg-green-700 w-full mt-auto transition-colors shadow-md">
                      <MessageCircle className="w-5 h-5 mr-2" /> Être recontacté pour ce bien
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {renderContactSection('bg-gray-900', 'text-white', 'bg-teal-500')}
      </div>
    );
  }

  // ----- THEME 5: BOUTIQUE -----
  if (themeId === 'shop') {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-sans w-full scroll-smooth">
        {renderNavbar([
          { label: 'Accueil', href: '#accueil' },
          { label: 'Produits', href: '#produits' }
        ], 'bg-pink-50/95', 'text-gray-900', 'text-pink-600')}

        <header id="accueil" className="relative h-[50vh] min-h-[400px] flex items-center bg-pink-50 overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
            <img src={content?.heroImage || "/shop.png"} alt="Shop" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10 px-6 md:px-16 w-full md:w-1/2">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">{businessName || 'Ma Boutique'}</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md">{content?.description || 'La mode au meilleur prix. Découvrez notre nouvelle collection.'}</p>
            <a href="#contact" className="inline-flex bg-black text-white hover:bg-gray-800 px-8 py-4 font-bold items-center rounded-none shadow-xl transition-transform hover:-translate-y-1">
               <MapPin className="w-4 h-4 mr-2" /> Nous trouver
            </a>
          </div>
        </header>

        {renderSectionBackground(
          <section id="produits" className={`py-24 px-6 max-w-7xl mx-auto w-full ${content?.sectionImage ? 'text-white' : 'bg-white'}`}>
            <h2 className="text-3xl font-bold text-center mb-16 uppercase tracking-widest">Produits Phares</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {(content?.products?.length > 0 ? content.products : [
                { title: 'Robe d\'été', price: '12.000 FCFA' },
                { title: 'Ensemble Tailleur', price: '25.000 FCFA' },
                { title: 'Sac en Cuir', price: '15.000 FCFA' },
                { title: 'Chaussures à talons', price: '18.000 FCFA' }
              ]).map((item, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="bg-gray-100 aspect-[3/4] mb-4 overflow-hidden relative shadow-lg">
                    <img src={item.image || "/shop.png"} alt="Produit" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                      <button onClick={() => handleOrder(item.title)} className="bg-green-500 hover:bg-green-600 text-white w-full py-3 text-sm font-bold flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all">
                        <ShoppingBag className="w-4 h-4 mr-2" /> Acheter
                      </button>
                    </div>
                  </div>
                  <h3 className={`font-bold text-lg transition-colors ${content?.sectionImage ? 'text-white group-hover:text-pink-400' : 'text-gray-900 group-hover:text-pink-600'}`}>{item.title || 'Produit'}</h3>
                  <p className={content?.sectionImage ? 'text-pink-300 font-medium' : 'text-gray-500 font-medium'}>{item.price || 'Prix'}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {renderContactSection('bg-pink-100', 'text-gray-900', 'bg-pink-500')}
      </div>
    );
  }

  // ----- THEME DENTISTE -----
  if (themeId === 'dentist') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans w-full scroll-smooth">
        {renderNavbar([
          { label: 'Accueil', href: '#accueil' },
          { label: 'Soins', href: '#soins' }
        ], 'bg-white/95', 'text-slate-800', 'text-blue-600')}

        <header id="accueil" className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={content?.heroImage || "/dentist.png"} alt="Cabinet Dentaire" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply"></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-md">{businessName || 'Cabinet Dentaire'}</h1>
            <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">{content?.description || 'Prenez soin de votre sourire.'}</p>
            <a href="#contact" className="inline-flex bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-transform hover:scale-105 items-center mx-auto">
              <Calendar className="w-5 h-5 mr-2" /> Prendre Rendez-vous
            </a>
          </div>
        </header>

        {renderSectionBackground(
          <section id="soins" className="py-24 px-4 md:px-8 max-w-6xl mx-auto w-full">
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
                  <button onClick={() => handleOrder(service.title)} className="w-full bg-green-50 text-green-700 hover:bg-green-100 py-3 rounded-xl font-bold flex justify-center items-center transition-colors">
                    <MessageCircle className="w-5 h-5 mr-2" /> Prendre RDV via WhatsApp
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {renderContactSection('bg-slate-900', 'text-white', 'bg-blue-500')}
      </div>
    );
  }

  // ----- THEME HOTEL -----
  if (themeId === 'hotel') {
    return (
      <div className="min-h-screen bg-[#f9f7f2] text-[#333] font-serif w-full scroll-smooth">
        {renderNavbar([
          { label: 'Accueil', href: '#accueil' },
          { label: 'Chambres', href: '#chambres' }
        ], 'bg-[#222]/95', 'text-[#c2a679]', 'text-white')}

        <header id="accueil" className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={content?.heroImage || "/hotel.png"} alt="Hôtel Luxe" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">{businessName || 'Hôtel Teranga'}</h1>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-sans tracking-wide">{content?.description || 'L\'élégance au cœur de Dakar.'}</p>
            <a href="#contact" className="inline-flex bg-[#c2a679] hover:bg-[#b09568] text-white px-10 py-4 font-sans tracking-widest uppercase text-sm font-bold shadow-2xl transition-all mx-auto items-center">
              <Phone className="w-4 h-4 mr-2" /> Réception & Accès
            </a>
          </div>
        </header>

        {renderSectionBackground(
          <section id="chambres" className="py-24 px-4 max-w-6xl mx-auto font-sans w-full">
            <div className="text-center mb-16">
              <h2 className={`text-3xl md:text-4xl font-serif font-bold mb-4 ${content?.sectionImage ? 'text-white' : 'text-[#222]'}`}>Nos Chambres & Suites</h2>
              <div className="w-16 h-0.5 bg-[#c2a679] mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {(content?.rooms?.length > 0 ? content.rooms : [
                { title: 'Chambre Supérieure', price: '45.000 FCFA', desc: 'Une chambre spacieuse avec vue.' }
              ]).map((room, idx) => (
                <div key={idx} className="bg-white shadow-2xl flex flex-col md:flex-row h-full overflow-hidden group">
                  <div className="w-full md:w-2/5 h-64 md:h-auto bg-gray-200 overflow-hidden">
                     <img src={room.image || "/hotel.png"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Chambre" />
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-center">
                    <h3 className="text-2xl font-serif font-bold mb-2">{room.title || 'Chambre'}</h3>
                    <p className="text-[#c2a679] font-bold mb-6 text-lg tracking-wider">{room.price || 'Tarif'}</p>
                    <p className="text-gray-600 mb-8 leading-relaxed">{room.desc || 'Description...'}</p>
                    <button onClick={() => handleOrder(room.title)} className="flex items-center justify-center w-full bg-green-700 text-white py-4 font-bold tracking-widest uppercase hover:bg-green-800 transition-colors mt-auto shadow-md">
                      <MessageCircle className="w-5 h-5 mr-2" /> Réserver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {renderContactSection('bg-[#1a1a1a]', 'text-white', 'bg-[#c2a679]')}
      </div>
    );
  }

  // ----- THEME CARPENTRY -----
  if (themeId === 'carpentry') {
    return (
      <div className="min-h-screen bg-neutral-900 text-neutral-200 font-sans w-full scroll-smooth">
        {renderNavbar([
          { label: 'Accueil', href: '#accueil' },
          { label: 'Réalisations', href: '#projets' }
        ], 'bg-black/95', 'text-neutral-400', 'text-white')}

        <header id="accueil" className="relative h-[60vh] min-h-[400px] flex items-center border-b-8 border-amber-600">
          <div className="absolute inset-0 z-0">
            <img src={content?.heroImage || "/carpentry.png"} alt="Menuiserie" className="w-full h-full object-cover grayscale opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-transparent"></div>
          </div>
          <div className="relative z-10 px-6 md:px-16 max-w-5xl w-full">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase leading-tight drop-shadow-lg">{businessName || 'Menuiserie Pro'}</h1>
            <p className="text-xl text-neutral-400 mb-10 max-w-2xl">{content?.description || 'Experts en menuiserie bois et métallique.'}</p>
            <a href="#contact" className="inline-flex bg-amber-600 text-white hover:bg-amber-500 px-8 py-4 font-black uppercase tracking-wider transition-colors items-center w-fit shadow-xl">
              <MapPin className="w-5 h-5 mr-3" /> Notre Atelier
            </a>
          </div>
        </header>

        {renderSectionBackground(
          <section id="projets" className="py-24 px-6 md:px-16 max-w-7xl mx-auto w-full">
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
                    <button onClick={() => handleOrder(proj.title)} className="w-full bg-green-700 hover:bg-green-600 text-white py-3 font-bold flex items-center justify-center transition-colors shadow-md">
                       <MessageCircle className="w-5 h-5 mr-2" /> Demander un devis
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {renderContactSection('bg-black', 'text-white', 'bg-amber-600')}
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
