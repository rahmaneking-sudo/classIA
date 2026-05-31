import React from 'react';
import { Send, ChevronRight, MapPin, Phone, Star, Coffee, Wifi, Car, Calendar, Hammer, Shield, Utensils, Scissors, ShoppingBag, Home, Key } from 'lucide-react';

const ThemeRenderer = ({ data }) => {
  const { themeId, businessName, content, whatsapp, slug } = data;

  const handleContact = () => {
    if (whatsapp) {
      window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
    }
  };

  // ----- THEME 1: RESTAURANT -----
  if (themeId === 'restaurant') {
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900 font-sans w-full">
        <header className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="/restaurant.png" alt="Restaurant" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg">{businessName || 'Le Teranga'}</h1>
            <p className="text-xl text-stone-200 mb-8 max-w-2xl mx-auto font-medium">{content?.description || 'Des saveurs authentiques, un cadre chaleureux.'}</p>
            <button onClick={handleContact} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-transform hover:scale-105 flex items-center mx-auto">
              <Utensils className="w-5 h-5 mr-2" /> Réserver une table
            </button>
          </div>
        </header>
        <section className="py-20 px-4 md:px-8 max-w-5xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-800 mb-4">Notre Menu</h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(content?.menus?.length > 0 ? content.menus : [
              { title: 'Thiéboudienne', price: '2500 FCFA', desc: 'Riz au poisson classique, légumes frais.' },
              { title: 'Yassa Poulet', price: '3000 FCFA', desc: 'Poulet mariné au citron et oignons.' }
            ]).map((item, idx) => (
              <div key={idx} className="flex justify-between items-start border-b border-stone-200 pb-6">
                <div>
                  <h3 className="text-xl font-bold text-stone-800">{item.title || 'Plat'}</h3>
                  <p className="text-stone-500 mt-1">{item.desc || 'Description...'}</p>
                </div>
                <div className="text-orange-600 font-bold text-lg whitespace-nowrap ml-4">{item.price || 'Prix'}</div>
              </div>
            ))}
          </div>
        </section>
        <footer className="bg-stone-900 text-stone-400 py-12 text-center w-full">
          <p className="mb-2 font-bold text-white">© {new Date().getFullYear()} {businessName || 'Mon Restaurant'}</p>
        </footer>
      </div>
    );
  }

  // ----- THEME 2: SALON DE COIFFURE -----
  if (themeId === 'salon') {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-[#2c2c2c] font-serif w-full">
        <header className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="/salon.png" alt="Salon" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#3a2e2a]/60"></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
            <h1 className="text-5xl md:text-7xl font-bold text-[#f2e6d9] mb-4 tracking-wider">{businessName || 'Espace Beauté'}</h1>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto italic">{content?.description || 'Révélez votre beauté naturelle.'}</p>
            <button onClick={handleContact} className="bg-transparent border border-[#f2e6d9] text-[#f2e6d9] hover:bg-[#f2e6d9] hover:text-[#3a2e2a] px-10 py-3 uppercase tracking-widest text-sm transition-colors flex items-center mx-auto">
              <Scissors className="w-4 h-4 mr-2" /> Prendre Rendez-vous
            </button>
          </div>
        </header>
        <section className="py-20 px-4 md:px-8 max-w-4xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl uppercase tracking-widest text-[#3a2e2a] mb-4">Nos Prestations</h2>
            <div className="w-12 h-px bg-[#d4af37] mx-auto"></div>
          </div>
          <div className="space-y-6">
            {(content?.services?.length > 0 ? content.services : [
              { title: 'Tresses Africaines', price: '15.000 FCFA' },
              { title: 'Soin du Visage', price: '10.000 FCFA' },
              { title: 'Manucure & Pédicure', price: '8.000 FCFA' }
            ]).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center group">
                <h3 className="text-lg font-bold group-hover:text-[#d4af37] transition-colors">{item.title || 'Prestation'}</h3>
                <div className="flex-1 border-b border-dotted border-gray-300 mx-4"></div>
                <div className="text-gray-600 font-medium">{item.price || 'Prix'}</div>
              </div>
            ))}
          </div>
        </section>
        <footer className="bg-[#3a2e2a] text-[#f2e6d9] py-10 text-center text-sm tracking-widest uppercase w-full">
          {businessName || 'Mon Salon'}
        </footer>
      </div>
    );
  }

  // ----- THEME 3: LOCATION VOITURES -----
  if (themeId === 'car') {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-sans w-full">
        <header className="relative h-[65vh] min-h-[450px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="/car.png" alt="Cars" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-transparent"></div>
          </div>
          <div className="relative z-10 px-6 md:px-16 w-full max-w-7xl mx-auto flex flex-col items-start">
            <div className="bg-blue-600 text-white font-bold px-3 py-1 text-xs uppercase tracking-widest mb-4 rounded">Location Premium</div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 uppercase italic tracking-tighter">{businessName || 'Auto Loc'}</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-lg">{content?.description || 'Louez les meilleurs véhicules au meilleur prix.'}</p>
            <button onClick={handleContact} className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-4 font-black uppercase tracking-wider transition-colors flex items-center shadow-2xl">
              <Key className="w-5 h-5 mr-3" /> Réserver maintenant
            </button>
          </div>
        </header>
        <section className="py-20 px-6 max-w-7xl mx-auto w-full bg-gray-50">
          <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter mb-12 text-center">Notre Flotte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(content?.vehicles?.length > 0 ? content.vehicles : [
              { title: 'Range Rover Velar', price: '60.000 FCFA/jour', desc: 'Auto, Clim, 5 places, Cuir' },
              { title: 'Hyundai Tucson', price: '35.000 FCFA/jour', desc: 'Auto, Clim, 5 places' }
            ]).map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 group">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                   <img src="/car.png" alt="Voiture" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   <div className="absolute bottom-0 right-0 bg-blue-600 text-white font-bold px-4 py-2">{item.price || 'Prix'}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-gray-900 mb-2 uppercase">{item.title || 'Véhicule'}</h3>
                  <p className="text-gray-500 text-sm mb-4">{item.desc || 'Options...'}</p>
                  <button onClick={handleContact} className="text-blue-600 font-bold uppercase text-sm flex items-center hover:text-blue-800">
                    Louer ce véhicule <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ----- THEME 4: IMMOBILIER -----
  if (themeId === 'realestate') {
    return (
      <div className="min-h-screen bg-gray-100 text-gray-800 font-sans w-full">
        <header className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="/realestate.png" alt="Villa" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="relative z-10 text-center px-4 w-full">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Home className="w-10 h-10 text-teal-700" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">{businessName || 'Immo Prestige'}</h1>
            <p className="text-2xl text-white/90 font-light mb-8 max-w-2xl mx-auto drop-shadow">{content?.description || 'Trouvez la maison de vos rêves.'}</p>
            <button onClick={handleContact} className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-4 font-bold text-lg rounded shadow-xl transition-all">
              Contactez-nous
            </button>
          </div>
        </header>
        <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
           <h2 className="text-3xl font-bold text-gray-900 mb-12 border-l-4 border-teal-700 pl-4">Derniers Biens</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(content?.properties?.length > 0 ? content.properties : [
              { title: 'Villa R+1 Almadies', price: 'A vendre: 250 Millions', desc: '4 chambres, piscine, jardin.' },
              { title: 'Appartement F4 Ngor', price: 'Location: 600.000/mois', desc: 'Vue mer, parking souterrain.' }
            ]).map((item, idx) => (
              <div key={idx} className="bg-white flex flex-col md:flex-row shadow-md hover:shadow-xl transition-shadow rounded-lg overflow-hidden">
                <div className="w-full md:w-2/5 h-48 md:h-auto">
                  <img src="/realestate.png" alt="Bien" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-center">
                  <div className="text-teal-700 font-bold mb-2">{item.price || 'Prix'}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title || 'Titre du bien'}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{item.desc || 'Description...'}</p>
                  <button onClick={handleContact} className="text-sm font-bold text-gray-900 flex items-center hover:text-teal-700 w-fit mt-auto">
                    Plus de détails <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ----- THEME 5: BOUTIQUE -----
  if (themeId === 'shop') {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-sans w-full">
        <header className="relative h-[50vh] min-h-[400px] flex items-center bg-pink-50 overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
            <img src="/shop.png" alt="Shop" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10 px-6 md:px-16 w-full md:w-1/2">
            <h1 className="text-5xl font-black text-gray-900 mb-4">{businessName || 'Ma Boutique'}</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md">{content?.description || 'La mode au meilleur prix. Découvrez notre nouvelle collection.'}</p>
            <button onClick={handleContact} className="bg-black text-white hover:bg-gray-800 px-8 py-3 font-bold flex items-center">
              <ShoppingBag className="w-5 h-5 mr-3" /> Commander
            </button>
          </div>
        </header>
        <section className="py-20 px-6 max-w-7xl mx-auto w-full">
          <h2 className="text-3xl font-bold text-center mb-16">Produits Phares</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(content?.products?.length > 0 ? content.products : [
              { title: 'Robe d\'été', price: '12.000 FCFA' },
              { title: 'Ensemble Tailleur', price: '25.000 FCFA' },
              { title: 'Sac en Cuir', price: '15.000 FCFA' },
              { title: 'Chaussures à talons', price: '18.000 FCFA' }
            ]).map((item, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="bg-gray-100 aspect-[3/4] mb-4 overflow-hidden relative">
                  <img src="/shop.png" alt="Produit" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={handleContact} className="bg-white text-black px-4 py-2 text-sm font-bold">Acheter</button>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors">{item.title || 'Produit'}</h3>
                <p className="text-gray-500">{item.price || 'Prix'}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ----- THEME DENTISTE -----
  if (themeId === 'dentist') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans w-full">
        <header className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="/dentist.png" alt="Cabinet Dentaire" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply"></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-md">{businessName || 'Cabinet Dentaire'}</h1>
            <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">{content?.description || 'Prenez soin de votre sourire.'}</p>
            <button onClick={handleContact} className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-transform hover:scale-105 flex items-center mx-auto">
              <Calendar className="w-5 h-5 mr-2" /> Prendre Rendez-vous
            </button>
          </div>
        </header>

        <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Nos Soins</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(content?.services?.length > 0 ? content.services : [
              { title: 'Consultation Générale', desc: 'Bilan complet et conseils.' }
            ]).map((service, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title || 'Service'}</h3>
                <p className="text-slate-600 leading-relaxed">{service.desc || 'Description...'}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ----- THEME HOTEL -----
  if (themeId === 'hotel') {
    return (
      <div className="min-h-screen bg-[#f9f7f2] text-[#333] font-serif w-full">
        <header className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="/hotel.png" alt="Hôtel Luxe" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">{businessName || 'Hôtel Teranga'}</h1>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-sans tracking-wide">{content?.description || 'L\'élégance au cœur de Dakar.'}</p>
            <button onClick={handleContact} className="bg-[#c2a679] hover:bg-[#b09568] text-white px-10 py-4 font-sans tracking-widest uppercase text-sm font-bold shadow-2xl transition-all mx-auto">
              Réserver
            </button>
          </div>
        </header>

        <section className="py-24 px-4 max-w-6xl mx-auto font-sans w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#222] mb-4">Nos Chambres & Suites</h2>
            <div className="w-16 h-0.5 bg-[#c2a679] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {(content?.rooms?.length > 0 ? content.rooms : [
              { title: 'Chambre Supérieure', price: '45.000 FCFA', desc: 'Une chambre spacieuse avec vue.' }
            ]).map((room, idx) => (
              <div key={idx} className="bg-white shadow-xl flex flex-col md:flex-row h-full">
                <div className="w-full md:w-2/5 h-48 md:h-auto bg-gray-200">
                   <img src="/hotel.png" className="w-full h-full object-cover" alt="Chambre" />
                </div>
                <div className="p-8 flex-1 flex flex-col justify-center">
                  <h3 className="text-2xl font-serif font-bold mb-2">{room.title || 'Chambre'}</h3>
                  <p className="text-[#c2a679] font-bold mb-4">{room.price || 'Tarif'}</p>
                  <p className="text-gray-600 mb-6">{room.desc || 'Description...'}</p>
                  <button onClick={handleContact} className="flex items-center text-sm font-bold tracking-widest uppercase hover:text-[#c2a679] transition-colors w-fit mt-auto">
                    Réserver <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ----- THEME CARPENTRY -----
  if (themeId === 'carpentry') {
    return (
      <div className="min-h-screen bg-neutral-900 text-neutral-200 font-sans w-full">
        <header className="relative h-[60vh] min-h-[400px] flex items-center border-b-8 border-amber-600">
          <div className="absolute inset-0 z-0">
            <img src="/carpentry.png" alt="Menuiserie" className="w-full h-full object-cover grayscale opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-transparent"></div>
          </div>
          <div className="relative z-10 px-6 md:px-16 max-w-5xl w-full">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase leading-tight">{businessName || 'Menuiserie Pro'}</h1>
            <p className="text-xl text-neutral-400 mb-10 max-w-2xl">{content?.description || 'Experts en menuiserie bois et métallique.'}</p>
            <button onClick={handleContact} className="bg-white text-neutral-900 hover:bg-amber-500 hover:text-white px-8 py-4 font-black uppercase tracking-wider transition-colors flex items-center w-fit">
              <Hammer className="w-5 h-5 mr-3" /> Obtenir un devis
            </button>
          </div>
        </header>

        <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto w-full">
          <h2 className="text-4xl font-black text-white uppercase mb-12">Nos Réalisations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(content?.projects?.length > 0 ? content.projects : [
              { title: 'Portes & Fenêtres', desc: 'Fabrication et pose de menuiseries extérieures isolantes.' }
            ]).map((proj, idx) => (
              <div key={idx} className="group cursor-pointer relative overflow-hidden bg-neutral-800 border border-neutral-700 h-64 flex items-end p-6 hover:border-amber-500 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
                <div className="relative z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">{proj.title || 'Projet'}</h3>
                  <p className="text-neutral-400">{proj.desc || 'Description...'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
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
