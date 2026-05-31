import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Sparkles, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, Video, Image as ImageIcon, MonitorPlay, ArrowLeft, BookOpen } from 'lucide-react';
import API_BASE_URL from '../config/api';

const Typewriter = ({ text, onComplete, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
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

const MediaRender = ({ url, type, isPremium }) => {
  if (type === 'youtube') {
    let videoId = '';
    try {
      if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
      else if (url.includes('youtube.com/watch')) videoId = new URL(url).searchParams.get('v');
      else if (url.includes('youtube.com/embed/')) videoId = url.split('embed/')[1].split('?')[0];
    } catch(e) {}

    if (videoId) {
      return (
        <iframe 
          className={`w-full h-full object-cover pointer-events-none scale-[1.3] select-none ${isPremium ? 'opacity-100' : 'opacity-80'}`}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${videoId}&modestbranding=1&playsinline=1`}
          allow="autoplay; encrypted-media"
          frameBorder="0"
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
      );
    }
  }

  if (type === 'video') {
    return (
      <video 
        autoPlay loop muted playsInline
        className="w-full h-full object-cover select-none pointer-events-none"
        src={url}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />
    );
  }

  return (
    <img 
      src={url} 
      alt="Render" 
      className={`w-full h-full object-cover origin-center select-none pointer-events-none ${isPremium ? 'transition-transform duration-[15000ms] ease-out scale-[1.15] hover:scale-125' : 'opacity-60'}`} 
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    />
  );
};

const Courses = () => {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Dashboard routing state
  const [selectedSim, setSelectedSim] = useState(null);
  const [step, setStep] = useState(0); // 0: init, 1: bad typing, 2: bad show, 3: good typing, 4: good show

  const categories = {
    all: "Tous les Cours",
    gemini: "Gemini / Midjourney",
    kling: "Kling AI / Vidéos",
    claude: "Claude 3.5 / Code"
  };

  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/simulations`);
        setSimulations(response.data);
      } catch (err) {
        console.error("Erreur de chargement des simulations");
      } finally {
        setLoading(false);
      }
    };
    fetchSimulations();
  }, []);

  // Filter logic
  const filteredSimulations = activeFilter === 'all' 
    ? simulations 
    : simulations.filter(sim => sim.category === activeFilter);

  // Reset simulator state when entering a course
  const openSimulator = (sim) => {
    setSelectedSim(sim);
    setStep(0);
  };

  // Close simulator
  const closeSimulator = () => {
    setSelectedSim(null);
    setStep(0);
  };

  if (loading) {
    return <div className="py-24 bg-[#0a0a10] min-h-screen text-[var(--color-neon-blue)] flex justify-center items-center text-2xl font-bold animate-pulse">Chargement de la Classe...</div>;
  }

  return (
    <div className="relative min-h-screen text-white font-['Rajdhani']">
      {/* High-Tech Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[60000ms] ease-linear scale-110"
        style={{ backgroundImage: 'url("/courses_assets/bright_classroom.png")' }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#020205]/50 via-[#0a0a10]/30 to-[#020205]/60" />

      {/* Main Content */}
      <div className="relative z-10 py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
        
        {!selectedSim ? (
          /* --- DASHBOARD GRID VIEW --- */
          <div className="animate-fade-in-up">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center p-3 bg-[var(--color-neon-blue)]/10 rounded-2xl border border-[var(--color-neon-blue)]/30 mb-6 shadow-[0_0_30px_rgba(0,212,255,0.2)]">
                <BookOpen className="w-8 h-8 text-[var(--color-neon-blue)] mr-3" />
                <h1 className="text-4xl md:text-5xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--color-neon-blue)]">
                  TABLEAU DE BORD
                </h1>
              </div>
              <p className="text-gray-300 max-w-2xl mx-auto text-lg font-medium">
                Accédez à tous vos cours, vidéos et simulations interactives en un seul endroit.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {Object.entries(categories).map(([key, title]) => {
                const count = key === 'all' ? simulations.length : simulations.filter(s => s.category === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveFilter(key)}
                    className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 border backdrop-blur-md flex items-center gap-2
                      ${activeFilter === key 
                        ? 'bg-[var(--color-neon-blue)]/30 border-[var(--color-neon-blue)] text-white shadow-[0_0_20px_rgba(0,212,255,0.4)]' 
                        : 'bg-black/40 border-white/10 text-gray-400 hover:border-[var(--color-neon-blue)]/50 hover:text-white'}`}
                  >
                    {title} 
                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeFilter === key ? 'bg-white/20' : 'bg-white/10'}`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Grid */}
            {filteredSimulations.length === 0 ? (
              <div className="text-center py-20 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-md">
                <Sparkles className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-400">Aucun cours disponible pour le moment.</h2>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSimulations.map((sim, index) => (
                  <div 
                    key={sim._id}
                    onClick={() => openSimulator(sim)}
                    className="group cursor-pointer bg-black/40 border border-white/10 hover:border-[var(--color-neon-blue)]/50 rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] hover:-translate-y-2 flex flex-col h-full animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="h-48 relative overflow-hidden bg-black/60">
                      <MediaRender url={sim.goodMediaUrl} type={sim.goodMediaType} isPremium={true} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a10] via-transparent to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                        <div className="w-16 h-16 rounded-full bg-[var(--color-neon-blue)]/20 border-2 border-[var(--color-neon-blue)] flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.6)]">
                          <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                        </div>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-[var(--color-neon-purple)]/80 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                          {categories[sim.category]}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--color-neon-blue)] transition-colors">{sim.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1">
                        Découvrez comment passer d'un prompt basique à un résultat premium sur ce cas pratique.
                      </p>
                      <div className="flex items-center justify-between text-xs font-bold tracking-widest text-[var(--color-neon-blue)] uppercase">
                        <span>Lancer le module</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* --- COURSE DETAIL VIEW (SIMULATOR) --- */
          <div className="animate-fade-in flex-1 flex flex-col">
            <button 
              onClick={closeSimulator}
              className="group self-start mb-8 flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-white/30 rounded-xl text-gray-300 hover:text-white transition-all backdrop-blur-md"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold tracking-widest uppercase text-sm">Retour au Tableau de Bord</span>
            </button>

            <div className="text-center mb-10">
              <span className="text-[var(--color-neon-purple)] font-bold uppercase tracking-widest text-sm mb-2 block">{categories[selectedSim.category]}</span>
              <h2 className="text-3xl md:text-4xl font-black tracking-widest uppercase text-white shadow-black drop-shadow-lg">
                {selectedSim.title}
              </h2>
            </div>

            {/* Simulator Area */}
            <div className="bg-black/60 border border-[var(--color-neon-blue)]/20 rounded-3xl p-6 md:p-10 relative overflow-hidden backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex-1 flex flex-col">
              
              {step === 0 && (
                <div className="absolute inset-0 z-20 bg-[#0a0a10]/90 backdrop-blur-md flex flex-col items-center justify-center rounded-3xl">
                  <Sparkles className="w-16 h-16 text-[var(--color-neon-blue)] mb-8 animate-pulse" />
                  <button 
                    onClick={() => setStep(1)}
                    className="relative group bg-[var(--color-neon-blue)]/10 border-2 border-[var(--color-neon-blue)] px-8 py-5 rounded-2xl text-xl font-bold tracking-widest uppercase hover:bg-[var(--color-neon-blue)]/30 hover:shadow-[0_0_40px_rgba(0,212,255,0.6)] flex items-center gap-4 transition-all overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    <Play className="w-6 h-6 text-white" fill="currentColor" /> 
                    <span className="text-white">Démarrer la Simulation</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                
                {/* Bad Prompt Side */}
                <div className={`transition-all duration-700 flex flex-col ${step >= 1 ? 'opacity-100' : 'opacity-20'}`}>
                  <div className="flex items-center justify-center gap-2 mb-4 text-red-400 font-bold uppercase tracking-widest border-b border-red-500/20 pb-3 bg-red-500/5 rounded-t-xl">
                    <AlertCircle className="w-5 h-5" /> Mauvais Prompt
                  </div>
                  
                  <div className="bg-black/80 p-5 rounded-xl border border-white/5 h-36 mb-6 font-mono text-sm text-gray-300 shadow-inner">
                    {step >= 1 && (
                      <Typewriter 
                        text={selectedSim.badPrompt} 
                        speed={20}
                        onComplete={() => setTimeout(() => setStep(2), 500)}
                      />
                    )}
                  </div>

                  <div className="relative flex-1 min-h-[300px] rounded-xl overflow-hidden border border-white/10 bg-black/80 flex items-center justify-center">
                    {step < 2 ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-6 h-6 border-2 border-red-500/50 border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-500 animate-pulse font-mono text-sm">Génération en cours...</span>
                      </div>
                    ) : (
                      <>
                        <MediaRender url={selectedSim.badMediaUrl} type={selectedSim.badMediaType} isPremium={false} />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
                          <span className="bg-red-500/90 text-white px-6 py-2 rounded-full text-sm font-bold uppercase backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.4)] tracking-widest">Résultat Basique</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Good Prompt Side */}
                <div className={`transition-all duration-700 flex flex-col ${step >= 3 ? 'opacity-100' : 'opacity-20'}`}>
                  <div className="flex items-center justify-center gap-2 mb-4 text-[var(--color-neon-blue)] font-bold uppercase tracking-widest border-b border-[var(--color-neon-blue)]/30 pb-3 bg-[var(--color-neon-blue)]/5 rounded-t-xl">
                    <CheckCircle2 className="w-5 h-5" /> Prompt ClassIA Premium
                  </div>
                  
                  <div className="bg-[var(--color-neon-blue)]/5 p-5 rounded-xl border border-[var(--color-neon-blue)]/30 h-36 mb-6 font-mono text-sm text-[var(--color-neon-blue)] relative overflow-hidden">
                    {step >= 2 && step < 3 && (
                      <button 
                        onClick={() => setStep(3)} 
                        className="absolute inset-2 flex items-center justify-center bg-white text-black font-black uppercase tracking-widest hover:bg-[var(--color-neon-blue)] rounded-lg transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.4)] text-lg"
                      >
                        <Play className="w-6 h-6 mr-3" fill="currentColor" /> INJECTER LE PROMPT
                      </button>
                    )}
                    {step >= 3 && (
                      <Typewriter 
                        text={selectedSim.goodPrompt} 
                        speed={15}
                        onComplete={() => setTimeout(() => setStep(4), 800)}
                      />
                    )}
                  </div>

                  <div className="relative flex-1 min-h-[300px] rounded-xl overflow-hidden border border-[var(--color-neon-blue)]/40 bg-black/80 flex items-center justify-center shadow-[0_0_30px_rgba(0,212,255,0.15)]">
                    {step < 4 ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-[var(--color-neon-blue)] border-t-transparent rounded-full animate-spin" />
                        <span className="text-[var(--color-neon-blue)]/70 animate-pulse font-mono text-sm">Génération Premium...</span>
                      </div>
                    ) : (
                      <>
                        <MediaRender url={selectedSim.goodMediaUrl} type={selectedSim.goodMediaType} isPremium={true} />
                        {(selectedSim.goodMediaType === 'youtube' || selectedSim.goodMediaType === 'video') && (
                          <div className="absolute top-4 right-4 bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-blue)] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 backdrop-blur-md border border-[var(--color-neon-blue)]/30 pointer-events-none">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            HQ VIDEO
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                        <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                          <span className="bg-green-500/90 text-white px-5 py-1.5 rounded-full text-xs font-bold uppercase backdrop-blur-md mb-3 inline-block shadow-[0_0_20px_rgba(34,197,94,0.4)] tracking-widest border border-green-400/50">Résultat Pro</span>
                          <p className="text-sm text-gray-200 leading-relaxed bg-[#0a0a10]/80 p-4 rounded-xl backdrop-blur-xl border border-[var(--color-neon-blue)]/30 pointer-events-auto">
                            <strong className="text-[var(--color-neon-blue)] block mb-1 uppercase tracking-widest text-xs">Explication du Formateur : </strong>
                            {selectedSim.explanation}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>
              
              {/* Replay Button */}
              {step === 4 && (
                <div className="mt-8 flex justify-center animate-fade-in">
                  <button 
                    onClick={() => setStep(1)}
                    className="px-8 py-3 bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-white/40 rounded-full transition-all font-bold tracking-widest uppercase flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Rejouer la scène
                  </button>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
