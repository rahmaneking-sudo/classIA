import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Sparkles, ChevronRight, Video, Image as ImageIcon, MonitorPlay, ArrowLeft, BookOpen, Quote, Copy, Check } from 'lucide-react';
import API_BASE_URL from '../config/api';

const Typewriter = ({ text, onComplete, speed = 15 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      if (text && i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span>{displayedText}<span className="animate-pulse">_</span></span>;
};

const MediaRender = ({ url, type, isThumbnail = true }) => {
  // Optimize Cloudinary URLs
  let optimizedUrl = url;
  if (url && url.includes('cloudinary.com') && url.includes('/upload/')) {
    optimizedUrl = url.replace('/upload/', '/upload/f_auto,q_auto/');
  }

  if (type === 'youtube') {
    let videoId = '';
    try {
      if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
      else if (url.includes('youtube.com/watch')) videoId = new URL(url).searchParams.get('v');
      else if (url.includes('youtube.com/embed/')) videoId = url.split('embed/')[1].split('?')[0];
    } catch(e) {}

    if (videoId) {
      return (
        <div className="relative w-full h-full">
          <iframe 
            className={`w-full h-full select-none ${isThumbnail ? 'object-cover pointer-events-none scale-[1.3]' : 'object-contain'}`}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${isThumbnail ? 1 : 0}&mute=${isThumbnail ? 1 : 0}&controls=${isThumbnail ? 0 : 1}&showinfo=0&rel=0&loop=${isThumbnail ? 1 : 0}${isThumbnail ? `&playlist=${videoId}` : ''}&modestbranding=1&playsinline=1`}
            allow={isThumbnail ? "autoplay; encrypted-media" : "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"}
            allowFullScreen={!isThumbnail}
            frameBorder="0"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
          {!isThumbnail && (
            <div 
              className="absolute top-0 left-0 w-full h-16 bg-transparent z-10" 
              onContextMenu={e => e.preventDefault()}
              title="Vidéo sécurisée"
            />
          )}
        </div>
      );
    }
  }

  if (type === 'video') {
    return (
      <video 
        autoPlay={isThumbnail}
        loop={isThumbnail}
        muted={isThumbnail}
        controls={!isThumbnail}
        controlsList="nodownload"
        playsInline
        className={`w-full h-full select-none ${isThumbnail ? 'object-cover pointer-events-none' : 'object-contain focus:outline-none bg-black'}`}
        src={optimizedUrl}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />
    );
  }

  return (
    <img 
      src={optimizedUrl} 
      alt="Render" 
      className={`w-full h-full origin-center select-none ${isThumbnail ? 'object-cover pointer-events-none transition-transform duration-[15000ms] ease-out hover:scale-110' : 'object-contain'}`} 
      onContextMenu={(e) => isThumbnail && e.preventDefault()}
      onDragStart={(e) => isThumbnail && e.preventDefault()}
    />
  );
};

const Courses = () => {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSim, setSelectedSim] = useState(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleCopyPrompt = () => {
    if (selectedSim?.prompt) {
      navigator.clipboard.writeText(selectedSim.prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/simulations`);
        setSimulations(response.data);
      } catch (err) {
        console.error("Erreur de chargement des cours");
      } finally {
        setLoading(false);
      }
    };
    fetchSimulations();
  }, []);

  const uniqueCategories = [...new Set(simulations.map(sim => sim.category))];
  
  const filteredSimulations = activeFilter === 'all' 
    ? simulations 
    : simulations.filter(sim => sim.category === activeFilter);

  const openCourse = (sim) => {
    setSelectedSim(sim);
  };

  if (loading) {
    return <div className="py-24 min-h-screen text-[var(--color-neon-blue)] flex justify-center items-center text-2xl font-bold animate-pulse">Chargement de la Classe...</div>;
  }

  return (
    <div className="relative min-h-screen text-white font-['Rajdhani']">
      {/* Main Content */}
      <div className="relative z-10 py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
        
        {!selectedSim ? (
          /* --- DASHBOARD GRID VIEW --- */
          <div className="animate-fade-in-up">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center p-3 bg-[var(--color-neon-blue)]/10 rounded-2xl border border-[var(--color-neon-blue)]/30 mb-6 shadow-[0_0_30px_rgba(0,212,255,0.2)] backdrop-blur-md">
                <BookOpen className="w-8 h-8 text-[var(--color-neon-blue)] mr-3" />
                <h1 className="text-4xl md:text-5xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--color-neon-blue)]">
                  TABLEAU DE BORD
                </h1>
              </div>
              <p className="text-gray-100 max-w-2xl mx-auto text-lg font-bold drop-shadow-md">
                Accédez à tous vos cours, vidéos et astuces de génération en un seul endroit.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 border backdrop-blur-md flex items-center gap-2
                  ${activeFilter === 'all' 
                    ? 'bg-[var(--color-neon-blue)]/30 border-[var(--color-neon-blue)] text-white shadow-[0_0_20px_rgba(0,212,255,0.4)]' 
                    : 'bg-black/60 border-white/10 text-gray-300 hover:border-[var(--color-neon-blue)]/50 hover:text-white'}`}
              >
                Tous les Cours
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeFilter === 'all' ? 'bg-white/20' : 'bg-white/10'}`}>
                  {simulations.length}
                </span>
              </button>
              {uniqueCategories.map(cat => {
                const count = simulations.filter(s => s.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 border backdrop-blur-md flex items-center gap-2
                      ${activeFilter === cat 
                        ? 'bg-[var(--color-neon-purple)]/30 border-[var(--color-neon-purple)] text-white shadow-[0_0_20px_rgba(186,85,211,0.4)]' 
                        : 'bg-black/60 border-white/10 text-gray-300 hover:border-[var(--color-neon-purple)]/50 hover:text-white'}`}
                  >
                    {cat}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeFilter === cat ? 'bg-white/20' : 'bg-white/10'}`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Grid */}
            {filteredSimulations.length === 0 ? (
              <div className="text-center py-20 bg-black/60 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl">
                <Sparkles className="w-12 h-12 text-[var(--color-neon-blue)] mx-auto mb-4 animate-pulse" />
                <h2 className="text-2xl font-bold text-white">Aucun cours disponible dans cette catégorie.</h2>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSimulations.map((sim, index) => (
                  <div 
                    key={sim._id}
                    onClick={() => openCourse(sim)}
                    className="group cursor-pointer bg-black/70 border border-white/10 hover:border-[var(--color-neon-blue)]/50 rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,212,255,0.2)] hover:-translate-y-2 flex flex-col h-full animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="h-56 relative overflow-hidden bg-black">
                      <MediaRender url={sim.mediaUrl} type={sim.mediaType} isThumbnail={true} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a10] via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                        <div className="w-16 h-16 rounded-full bg-[var(--color-neon-blue)]/30 border-2 border-[var(--color-neon-blue)] flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.6)] backdrop-blur-md">
                          <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                        </div>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-[var(--color-neon-purple)]/90 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-lg">
                          {sim.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col relative z-10">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--color-neon-blue)] transition-colors">{sim.title}</h3>
                      <p className="text-gray-300 text-sm line-clamp-2 mb-6 flex-1 font-medium">
                        {sim.explanation}
                      </p>
                      <div className="flex items-center justify-between text-xs font-bold tracking-widest text-[var(--color-neon-blue)] uppercase">
                        <span>Voir le cours</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* --- COURSE DETAIL VIEW --- */
          <div className="animate-fade-in flex-1 flex flex-col h-full">
            <button 
              onClick={() => setSelectedSim(null)}
              className="group self-start mb-6 flex items-center gap-2 px-4 py-2 bg-black/50 border border-white/20 hover:bg-white/10 hover:border-white/50 rounded-xl text-white transition-all backdrop-blur-xl shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold tracking-widest uppercase text-sm">Retour aux Cours</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 items-start">
              {/* Left Side: Video Player (Takes 2 columns on large screens) */}
              <div className="lg:col-span-2 flex flex-col sticky top-24">
                <div className="bg-black/80 border border-white/10 rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-xl flex-1 min-h-[400px] lg:min-h-[600px] group">
                  <MediaRender url={selectedSim.mediaUrl} type={selectedSim.mediaType} isThumbnail={false} />
                  <div className="absolute top-6 left-6 pointer-events-none">
                    <span className="bg-[var(--color-neon-blue)] text-black px-4 py-1.5 rounded-full text-xs font-black uppercase shadow-[0_0_20px_rgba(0,212,255,0.5)] tracking-widest">
                      Rendu Final HQ
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Course Info */}
              <div className="flex flex-col gap-6">
                <div className="bg-black/70 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl flex-1 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)]" />
                  
                  <div className="mb-8">
                    <span className="text-[var(--color-neon-purple)] font-bold uppercase tracking-widest text-xs mb-3 block bg-[var(--color-neon-purple)]/10 inline-block px-3 py-1 rounded-full border border-[var(--color-neon-purple)]/20">
                      {selectedSim.category}
                    </span>
                    <h2 className="text-3xl font-black tracking-wide text-white leading-tight">
                      {selectedSim.title}
                    </h2>
                  </div>

                  {selectedSim.prompt && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-black tracking-widest uppercase text-[var(--color-neon-blue)] flex items-center gap-2">
                          <Sparkles className="w-4 h-4" /> Le Prompt Utilisé
                        </h3>
                        <button
                          onClick={handleCopyPrompt}
                          className="flex items-center gap-2 px-3 py-1 bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)] hover:bg-[var(--color-neon-blue)]/20 border border-[var(--color-neon-blue)]/30 rounded-lg transition-all text-xs font-bold uppercase tracking-widest"
                        >
                          {copiedPrompt ? <><Check className="w-3 h-3" /> Copié</> : <><Copy className="w-3 h-3" /> Copier</>}
                        </button>
                      </div>
                      <div className="bg-[var(--color-neon-blue)]/5 p-5 rounded-2xl border border-[var(--color-neon-blue)]/20 shadow-inner relative group max-h-96 overflow-y-auto custom-scrollbar">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-[var(--color-neon-blue)]/90 break-words">
                          {selectedSim.prompt}
                        </pre>
                      </div>
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="text-xs font-black tracking-widest uppercase text-gray-400 flex items-center gap-2 mb-3">
                      <Quote className="w-4 h-4" /> Explication / Astuce
                    </h3>
                    <div className="text-gray-300 leading-relaxed text-sm bg-white/5 p-5 rounded-2xl border border-white/5 italic">
                      {selectedSim.explanation}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
