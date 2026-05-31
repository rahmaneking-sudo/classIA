import React, { useState } from 'react';
import { Copy, Check, Terminal, Sparkles, Image as ImageIcon, Video, FileText } from 'lucide-react';
import promptsData from '../data/prompts.json';

const PromptsLibrary = () => {
  const [copiedId, setCopiedId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Tous');

  const categories = ['Tous', 'ChatGPT / Claude', 'Gemini / Analyse', 'Midjourney / Image', 'Dessin Animé / Animation'];

  const filteredPrompts = activeCategory === 'Tous' 
    ? promptsData 
    : promptsData.filter(p => p.category === activeCategory);

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'ChatGPT / Claude': return <Terminal className="w-5 h-5" />;
      case 'Gemini / Analyse': return <FileText className="w-5 h-5" />;
      case 'Midjourney / Image': return <ImageIcon className="w-5 h-5" />;
      case 'Dessin Animé / Animation': return <Video className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 relative z-10 glass-panel p-8 rounded-2xl border border-white/10 max-w-4xl mx-auto shadow-[0_0_30px_rgba(0,0,0,0.5)]">
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

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {filteredPrompts.map((prompt) => (
            <div key={prompt.id} className="glass-panel border border-[var(--color-neon-blue)]/20 p-6 rounded-2xl relative overflow-hidden group hover:border-[var(--color-neon-blue)]/60 transition-all duration-300">
              
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-neon-blue)]/10 blur-[50px] rounded-full group-hover:bg-[var(--color-neon-blue)]/20 transition-all"></div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[var(--color-neon-blue)]/10 rounded-lg text-[var(--color-neon-blue)] border border-[var(--color-neon-blue)]/20">
                  {getCategoryIcon(prompt.category)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">{prompt.title}</h3>
                  <span className="text-xs text-[var(--color-neon-blue)] uppercase font-bold tracking-widest">{prompt.category}</span>
                </div>
              </div>

              <p className="text-gray-400 mb-6 text-sm">
                {prompt.description}
              </p>

              <div className="relative mb-4">
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/80 to-transparent z-10 rounded-t-xl pointer-events-none"></div>
                <pre className="bg-black/60 border border-white/5 rounded-xl p-4 text-sm text-gray-300 whitespace-pre-wrap font-mono h-40 overflow-y-auto custom-scrollbar relative">
                  {prompt.prompt}
                </pre>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-6 pt-6 border-t border-white/5">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">💡 Astuce de l'expert :</p>
                  <p className="text-sm text-gray-300 italic">{prompt.tips}</p>
                </div>
                <button
                  onClick={() => handleCopy(prompt.id, prompt.prompt)}
                  className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300
                    ${copiedId === prompt.id 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                      : 'bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)] border border-[var(--color-neon-blue)]/30 hover:bg-[var(--color-neon-blue)]/20 hover:shadow-[0_0_15px_rgba(0,212,255,0.4)]'}`}
                >
                  {copiedId === prompt.id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copiedId === prompt.id ? 'Copié !' : 'Copier'}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PromptsLibrary;
