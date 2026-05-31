import React from 'react';
import { Send, ChevronRight, MapPin, Phone, Star, Coffee, Wifi, Car, Calendar, Hammer, Shield } from 'lucide-react';

const ThemeRenderer = ({ data }) => {
  const { themeId, businessName, content, whatsapp, slug } = data;

  const handleContact = () => {
    if (whatsapp) {
      window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
    }
  };

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
            <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">{content?.description || 'Prenez soin de votre sourire avec notre équipe d\'experts.'}</p>
            <button onClick={handleContact} className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-transform hover:scale-105 flex items-center mx-auto">
              <Calendar className="w-5 h-5 mr-2" /> Prendre Rendez-vous
            </button>
          </div>
        </header>

        <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Nos Soins Dentaires</h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(content?.services?.length > 0 ? content.services : [
              { title: 'Consultation Générale', description: 'Bilan complet et conseils personnalisés pour votre hygiène bucco-dentaire.' },
              { title: 'Orthodontie', description: 'Alignement dentaire pour adultes et enfants avec des techniques modernes.' },
              { title: 'Blanchiment', description: 'Retrouvez un sourire éclatant en toute sécurité avec nos traitements professionnels.' }
            ]).map((service, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title || 'Service'}</h3>
                <p className="text-slate-600 leading-relaxed">{service.description || 'Description du service...'}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="bg-slate-900 text-slate-400 py-12 text-center border-t-4 border-blue-500 w-full">
          <p className="mb-2">© {new Date().getFullYear()} {businessName || 'Mon Cabinet'}. Tous droits réservés.</p>
          <p className="text-sm">Créé avec ClassIA</p>
        </footer>
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
            <div className="flex justify-center mb-6">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400 mx-1" />)}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-wide drop-shadow-lg">{businessName || 'Hôtel Teranga'}</h1>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-sans tracking-wide">{content?.description || 'L\'élégance et le confort au cœur de Dakar.'}</p>
            <button onClick={handleContact} className="bg-[#c2a679] hover:bg-[#b09568] text-white px-10 py-4 font-sans tracking-widest uppercase text-sm font-bold shadow-2xl transition-all hover:tracking-[0.2em] flex items-center mx-auto">
              Réserver votre séjour
            </button>
          </div>
        </header>

        <section className="py-24 px-4 md:px-8 max-w-6xl mx-auto font-sans w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#222] mb-4">Nos Chambres & Suites</h2>
            <div className="w-16 h-0.5 bg-[#c2a679] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {(content?.rooms?.length > 0 ? content.rooms : [
              { title: 'Chambre Supérieure', price: '45.000 FCFA', desc: 'Une chambre spacieuse avec vue.' },
              { title: 'Suite Présidentielle', price: '120.000 FCFA', desc: 'Le summum du luxe avec salon séparé.' }
            ]).map((room, idx) => (
              <div key={idx} className="bg-white shadow-xl flex flex-col md:flex-row group overflow-hidden h-full">
                <div className="w-full md:w-2/5 h-48 md:h-auto bg-gray-200 relative overflow-hidden shrink-0">
                   <img src="/hotel.png" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Chambre" />
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

        <section className="py-16 bg-[#222] text-white font-sans w-full">
          <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-around text-center gap-8">
            <div className="flex flex-col items-center">
              <Wifi className="w-8 h-8 text-[#c2a679] mb-3" />
              <span className="tracking-widest uppercase text-xs">Wifi Haut Débit</span>
            </div>
            <div className="flex flex-col items-center">
              <Coffee className="w-8 h-8 text-[#c2a679] mb-3" />
              <span className="tracking-widest uppercase text-xs">Petit Déjeuner</span>
            </div>
            <div className="flex flex-col items-center">
              <Car className="w-8 h-8 text-[#c2a679] mb-3" />
              <span className="tracking-widest uppercase text-xs">Parking Privé</span>
            </div>
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
            <div className="inline-block bg-amber-600 text-white px-4 py-1 text-sm font-bold tracking-widest uppercase mb-6">Savoir-Faire & Précision</div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase leading-tight">{businessName || 'Menuiserie Pro'}</h1>
            <p className="text-xl text-neutral-400 mb-10 max-w-2xl">{content?.description || 'Experts en menuiserie bois et métallique. Créations sur mesure pour vos projets résidentiels et commerciaux.'}</p>
            <button onClick={handleContact} className="bg-white text-neutral-900 hover:bg-amber-500 hover:text-white px-8 py-4 font-black uppercase tracking-wider transition-colors flex items-center w-fit">
              <Hammer className="w-5 h-5 mr-3" /> Obtenir un devis
            </button>
          </div>
        </header>

        <section className="py-20 px-6 md:px-16 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black text-white uppercase mb-2">Nos Réalisations</h2>
              <p className="text-neutral-500">Un travail artisanal, conçu pour durer.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(content?.projects?.length > 0 ? content.projects : [
              { title: 'Portes & Fenêtres', desc: 'Fabrication et pose de menuiseries extérieures isolantes.' },
              { title: 'Charpente Métallique', desc: 'Structures solides pour hangars et bâtiments industriels.' },
              { title: 'Meubles sur mesure', desc: 'Dressing, cuisines et mobilier de salon design.' }
            ]).map((proj, idx) => (
              <div key={idx} className="group cursor-pointer relative overflow-hidden bg-neutral-800 border border-neutral-700 h-64 flex items-end p-6 hover:border-amber-500 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
                <div className="relative z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-2xl font-bold text-white mb-2">{proj.title || 'Projet'}</h3>
                  <p className="text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">{proj.desc || 'Description...'}</p>
                </div>
                <div className="absolute top-4 right-4 z-20 w-10 h-10 bg-amber-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-6 h-6 text-white" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="bg-black py-8 text-center text-neutral-600 border-t border-neutral-800 w-full">
          <p className="font-bold uppercase tracking-widest text-sm mb-2">{businessName || 'Menuiserie Pro'}</p>
          <p className="text-xs">Propulsé par ClassIA</p>
        </footer>
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
