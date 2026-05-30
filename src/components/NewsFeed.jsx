import React, { useState, useEffect } from 'react';
import { ExternalLink, Clock, Sparkles, RefreshCw } from 'lucide-react';

const NewsFeed = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      // Using a free RSS-to-JSON service to fetch actual real-time AI news without needing an API key
      const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.artificialintelligence-news.com/feed/');
      const data = await response.json();
      
      if (data.status === 'ok') {
        setNews(data.items);
      } else {
        throw new Error('Impossible de charger le flux');
      }
    } catch (err) {
      console.error(err);
      setError("Les serveurs d'actualités sont temporairement inaccessibles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Format date to French
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Extract a clean image from HTML content if thumbnail is missing
  const extractImage = (item) => {
    if (item.thumbnail && item.thumbnail !== "") return item.thumbnail;
    if (item.enclosure && item.enclosure.link) return item.enclosure.link;
    
    // Regex to find the first image in description
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const match = imgRegex.exec(item.content || item.description);
    return match ? match[1] : 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop'; // Default AI image
  };

  // Strip HTML from description
  const stripHtml = (html) => {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    let text = tmp.textContent || tmp.innerText || "";
    return text.substring(0, 150) + "...";
  };

  return (
    <div className="py-24 bg-[#0a0a10] min-h-screen relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-[var(--color-neon-blue)]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[50%] h-[50%] bg-[#bd00ff]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="text-[var(--color-neon-blue)] w-6 h-6 animate-pulse" />
              <h2 className="text-[var(--color-neon-blue)] tracking-widest font-bold uppercase text-sm">Temps Réel</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-widest uppercase text-glow-blue">
              ACTU-<span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] to-[#bd00ff]">IA</span>
            </h1>
            <p className="text-gray-400 mt-4 max-w-2xl text-lg">
              Le monde de l'Intelligence Artificielle évolue chaque seconde. Suivez ici les dernières découvertes mondiales (ChatGPT, Robots, Apple, Android).
            </p>
          </div>
          
          <button 
            onClick={fetchNews}
            disabled={loading}
            className="mt-6 md:mt-0 flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-[var(--color-neon-blue)]/50 transition-all text-sm font-bold tracking-wider uppercase text-gray-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass-panel border border-white/5 rounded-2xl h-[400px] animate-pulse bg-white/5"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 glass-panel border border-red-500/20 rounded-2xl">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button onClick={fetchNews} className="px-6 py-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/50">Réessayer</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, index) => (
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                key={index} 
                className="group glass-panel border border-white/10 rounded-2xl overflow-hidden hover:border-[var(--color-neon-blue)]/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all z-10" />
                  <img 
                    src={extractImage(item)} 
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop';
                    }}
                  />
                  {/* Tags */}
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    {item.categories && item.categories.slice(0, 2).map((cat, i) => (
                      <span key={i} className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-1 relative">
                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-neon-blue)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-3 font-mono">
                    <Clock className="w-3 h-3" />
                    {formatDate(item.pubDate)}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[var(--color-neon-blue)] transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-1">
                    {stripHtml(item.description)}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between text-sm font-bold text-[var(--color-neon-blue)] uppercase tracking-wider">
                    <span className="flex items-center gap-2 group-hover:gap-4 transition-all">
                      Lire l'article <span className="text-lg">→</span>
                    </span>
                    <ExternalLink className="w-4 h-4 opacity-50" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;
