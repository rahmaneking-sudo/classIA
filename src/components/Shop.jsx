import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { ShoppingCart, Globe, CheckSquare, Sparkles, MessageCircle } from 'lucide-react';
import Navbar from './Navbar';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Remplace ce numéro par ton numéro WhatsApp réel
  const WHATSAPP_NUMBER = '221711696897';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/shop`);
        setProducts(response.data);
      } catch (err) {
        console.error('Impossible de charger la boutique');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleBuy = (product) => {
    const message = `Bonjour Abdou, je souhaite commander la création du modèle "${product.title}" à partir de ${product.price.toLocaleString()} FCFA.\n\nPouvons-nous discuter de mon projet ?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen text-white font-['Rajdhani']">
      <Navbar />

      <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        
        {/* Header Boutique */}
        <div className="text-center mb-16 animate-fade-in bg-black/20 backdrop-blur-lg p-6 md:p-8 rounded-2xl border border-white/20 max-w-4xl mx-auto shadow-2xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-widest uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] drop-shadow-md">
            La Boutique ClassIA
          </h1>
          <p className="text-xl text-white font-medium max-w-3xl mx-auto drop-shadow-md">
            Découvrez nos concepts de sites web premium. Vous flashez sur un modèle ? Nous développons <strong className="text-[var(--color-neon-blue)]">sur-mesure</strong> votre site basé sur ce concept avec un panel d'administration complet.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-[var(--color-neon-blue)] animate-pulse flex items-center text-xl tracking-widest uppercase">
              <Sparkles className="w-6 h-6 mr-3" /> Initialisation de la vitrine...
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20 bg-[#0a0a10]/50 border border-white/10 rounded-2xl backdrop-blur-md">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400 text-lg uppercase tracking-widest">Aucun site disponible pour le moment.</p>
          </div>
        )}

        {/* Grille de Produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div 
              key={product._id} 
              className="bg-[#0a0a10]/80 border border-white/10 rounded-2xl overflow-hidden group hover:border-[var(--color-neon-blue)]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,212,255,0.1)] backdrop-blur-md flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Preview - Animated Mockup Effect */}
              <div className="relative h-64 w-full overflow-hidden bg-black">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a10] via-transparent to-transparent z-10" />
                <img 
                  src={product.previewUrl} 
                  alt={product.title}
                  className="w-full h-auto min-h-full object-cover transform transition-transform duration-[4s] ease-in-out group-hover:-translate-y-1/4"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000'; }}
                />
                <div className="absolute top-4 left-4 z-20 bg-[var(--color-neon-purple)]/90 backdrop-blur text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider shadow-lg">
                  {product.category}
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6 flex-grow flex flex-col relative z-20">
                <h3 className="text-2xl font-bold text-white mb-2">{product.title}</h3>
                <p className="text-gray-200 text-sm leading-relaxed mb-6 flex-grow font-medium drop-shadow-md">{product.description}</p>
                
                {/* Features */}
                <div className="space-y-3 mb-8 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="text-xs font-bold text-[var(--color-neon-blue)] uppercase tracking-widest mb-2">Inclus :</div>
                  {product.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-start text-sm text-gray-300">
                      <CheckSquare className="w-4 h-4 text-[var(--color-neon-purple)] mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4 mt-auto">
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-gray-400 text-sm uppercase tracking-widest">À partir de</span>
                    <span className="text-3xl font-bold text-white">{product.price.toLocaleString()} <span className="text-lg text-[var(--color-neon-blue)]">FCFA</span></span>
                  </div>

                  <button
                    onClick={() => handleBuy(product)}
                    className="w-full py-4 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] text-white font-bold tracking-widest uppercase rounded-xl hover:shadow-[0_0_20px_rgba(186,85,211,0.5)] transition-all flex items-center justify-center group-hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" /> Commander ce modèle
                  </button>

                  {product.demoUrl && (
                    <a 
                      href={product.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-white/5 text-white font-bold tracking-widest uppercase rounded-xl border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center text-sm mt-2"
                    >
                      <Globe className="w-4 h-4 mr-2" /> Voir la démo en direct
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background elements */}
      <div className="fixed top-20 left-[-10%] w-[50%] h-[50%] bg-[var(--color-neon-blue)]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-neon-purple)]/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
};

export default Shop;
