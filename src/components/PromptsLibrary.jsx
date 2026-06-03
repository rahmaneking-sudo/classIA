import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import { Copy, Check, Terminal, Sparkles, Image as ImageIcon, Video, FileText, Lock } from 'lucide-react';

const PromptsLibrary = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('studentToken');
    setIsLoggedIn(!!token);

    if (token) {
      const fetchPrompts = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/prompts`);
          setPrompts(response.data);
        } catch (err) {
          console.error('Erreur lors de la récupération des prompts:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchPrompts();
    } else {
      setLoading(false);
    }
  }, []);

  const uniqueCategories = [...new Set(prompts.map(p => p.category).filter(Boolean))];
  const categories = ['Tous', ...uniqueCategories];

  const filteredPrompts = activeCategory === 'Tous' 
    ? prompts 
    : prompts.filter(p => p.category === activeCategory);

  const getCategoryIcon = (category) => {
    const catLower = (category || '').toLowerCase();
    if (catLower.includes('chatgpt') || catLower.includes('claude')) return <Terminal className="w-5 h-5" />;
    if (catLower.includes('gemini') || catLower.includes('analyse')) return <FileText className="w-5 h-5" />;
    if (catLower.includes('midjourney') || catLower.includes('image')) return <ImageIcon className="w-5 h-5" />;
    if (catLower.includes('video') || catLower.includes('animation')) return <Video className="w-5 h-5" />;
    return <Sparkles className="w-5 h-5" />;
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isLoggedIn) {
    return (
      <div className="relative min-h-screen text-white font-['Rajdhani'] flex flex-col items-center justify-center pt-20 px-4">
        <div className="bg-black/60 border border-white/10 p-12 rounded-3xl backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] text-center max-w-2xl w-full animate-fade-in-up">
          <div className="w-24 h-24 bg-[var(--color-neon-blue)]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--color-neon-blue)]/30 shadow-[0_0_30px_rgba(0,212,255,0.2)]">
            <Lock className="w-12 h-12 text-[var(--color-neon-blue)]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest mb-4">Accès Restreint</h2>
          <p className="text-gray-300 text-lg mb-8 font-medium">
            La Bibliothèque de Prompts est exclusive. Vous devez vous connecter à votre espace étudiant pour accéder aux instructions Premium.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] text-white rounded-xl font-bold tracking-widest uppercase hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-all transform hover:-translate-y-1"
          >
            Me Connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 relative z-10 bg-black/20 backdrop-blur-lg p-6 md:p-8 rounded-2xl border border-white/20 max-w-4xl mx-auto shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-widest uppercase mb-4 text-glow-blue">
            BIBLIOTHÈQUE DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)]">PROMPTS</span>
          </h1>
          <p className="text-white font-medium drop-shadow-md max-w-2xl mx-auto text-lg">
            Copiez-collez ces instructions de qualité Premium pour obtenir des résultats professionnels avec les meilleures Intelligences Artificielles.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 relative z-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 border
                ${activeCategory === cat 
                  ? 'bg-[var(--color-neon-blue)]/20 border-[var(--color-neon-blue)] text-white shadow-[0_0_15px_rgba(0,212,255,0.4)]' 
                  : 'bg-black/50 border-white/10 text-gray-400 hover:border-[var(--color-neon-blue)]/50 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center p-12 text-[var(--color-neon-blue)] animate-pulse font-bold tracking-widest uppercase">
            Chargement de la bibliothèque...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {filteredPrompts.map((prompt) => (
              <div key={prompt._id} className="glass-panel border border-[var(--color-neon-blue)]/20 rounded-2xl relative overflow-hidden group hover:border-[var(--color-neon-blue)]/60 transition-all duration-300 flex flex-col">
                
                {prompt.imageUrl && (
                  <div className="w-full h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a10] to-transparent z-10"></div>
                    <img src={prompt.imageUrl} alt={prompt.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                )}
                
                <div className="p-6 flex-1 flex flex-col">
                  {/* Background Glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-neon-blue)]/10 blur-[50px] rounded-full group-hover:bg-[var(--color-neon-blue)]/20 transition-all"></div>
                  
                  <div className="flex items-center gap-3 mb-4 relative z-20">
                    <div className="p-2 bg-[var(--color-neon-blue)]/10 rounded-lg text-[var(--color-neon-blue)] border border-[var(--color-neon-blue)]/20">
                      {getCategoryIcon(prompt.category)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white uppercase tracking-wider">{prompt.title}</h3>
                      {prompt.category && <span className="text-xs text-[var(--color-neon-blue)] uppercase font-bold tracking-widest">{prompt.category}</span>}
                    </div>
                  </div>

                  <div className="relative mb-4 flex-1">
                    <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/80 to-transparent z-10 rounded-t-xl pointer-events-none"></div>
                    <pre className="bg-black/60 border border-white/5 rounded-xl p-4 text-sm text-gray-300 whitespace-pre-wrap font-mono h-40 overflow-y-auto custom-scrollbar relative">
                      {prompt.content}
                    </pre>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-6 pt-6 border-t border-white/5 relative z-20">
                    <div className="flex-1">
                      {prompt.explanation && (
                        <>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">💡 Astuce de l'expert :</p>
                          <p className="text-sm text-gray-300 italic">{prompt.explanation}</p>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => handleCopy(prompt._id, prompt.content)}
                      className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300
                        ${copiedId === prompt._id 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                          : 'bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)] border border-[var(--color-neon-blue)]/30 hover:bg-[var(--color-neon-blue)]/20 hover:shadow-[0_0_15px_rgba(0,212,255,0.4)]'}`}
                    >
                      {copiedId === prompt._id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      {copiedId === prompt._id ? 'Copié !' : 'Copier'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptsLibrary;
