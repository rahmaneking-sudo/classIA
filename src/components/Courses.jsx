import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Sparkles, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, Video, Image as ImageIcon, Youtube } from 'lucide-react';
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
    // Parse YouTube URL to get video ID
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

  // Default to image (with Ken Burns effect if premium to simulate video)
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
  const [activeTab, setActiveTab] = useState('gemini');
  const [simIndex, setSimIndex] = useState(0);
  const [step, setStep] = useState(0); // 0: init, 1: typing bad, 2: show bad, 3: typing good, 4: show good

  const categories = {
    gemini: "Gemini / Midjourney (Images)",
    kling: "Kling AI / Haiper (Vidéos)",
    claude: "Claude 3.5 (Jeux Vidéo)"
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

  const activeSimulations = simulations.filter(sim => sim.category === activeTab);
  const currentSim = activeSimulations[simIndex];

  // Reset when changing tabs
  useEffect(() => {
    setSimIndex(0);
    setStep(0);
  }, [activeTab]);

  // Reset when changing simulation
  useEffect(() => {
    setStep(0);
  }, [simIndex]);

  const nextSim = () => {
    setSimIndex((prev) => (prev + 1) % activeSimulations.length);
  };

  const prevSim = () => {
    setSimIndex((prev) => (prev - 1 + activeSimulations.length) % activeSimulations.length);
  };

  if (loading) {
    return <div className="py-24 bg-[#0a0a10] min-h-screen text-[var(--color-neon-blue)] flex justify-center items-center text-2xl font-bold animate-pulse">Chargement du Laboratoire...</div>;
  }

  return (
    <div className="py-24 bg-[#0a0a10] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-widest uppercase mb-4 text-glow-blue">
            LABORATOIRE <span className="text-[var(--color-neon-purple)]">INTERACTIF</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8">
            Testez plusieurs modèles de simulation sur différentes IA. Les vidéos et images sont gérées depuis le Dashboard Admin.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {Object.entries(categories).map(([key, title]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 border
                ${activeTab === key 
                  ? 'bg-[var(--color-neon-blue)]/20 border-[var(--color-neon-blue)] text-white shadow-[0_0_15px_rgba(0,212,255,0.4)]' 
                  : 'bg-black/50 border-white/10 text-gray-400 hover:border-[var(--color-neon-blue)]/50 hover:text-white'}`}
            >
              {title} ({simulations.filter(s => s.category === key).length})
            </button>
          ))}
        </div>

        {activeSimulations.length === 0 ? (
          <div className="text-center py-20 text-gray-500 glass-panel border border-white/10 rounded-3xl">
            <h2 className="text-2xl font-bold mb-4">Aucune simulation pour le moment</h2>
            <p>Ajoutez des simulations dans cette catégorie depuis le Dashboard Administrateur.</p>
          </div>
        ) : (
          <>
            {/* Multiple Simulations Navigation */}
            {activeSimulations.length > 1 && (
              <div className="flex items-center justify-center gap-6 mb-8">
                <button onClick={prevSim} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-bold tracking-widest text-[var(--color-neon-blue)]">
                  Simulation {simIndex + 1} : {currentSim.title}
                </h3>
                <button onClick={nextSim} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* Simulator Area */}
            <div className="glass-panel border border-white/10 rounded-3xl p-6 md:p-10 relative overflow-hidden bg-black/40">
              
              {step === 0 && (
                <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center">
                  <Sparkles className="w-16 h-16 text-[var(--color-neon-blue)] mb-6 animate-pulse" />
                  <button 
                    onClick={() => setStep(1)}
                    className="btn-sci-fi bg-[var(--color-neon-blue)]/20 border-2 border-[var(--color-neon-blue)] px-8 py-4 rounded-xl text-xl font-bold tracking-widest uppercase hover:bg-[var(--color-neon-blue)]/40 hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] flex items-center gap-3 transition-all"
                  >
                    <Play className="w-6 h-6" /> Lancer la simulation "{currentSim.title}"
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Bad Prompt Side */}
                <div className={`transition-all duration-700 ${step >= 1 ? 'opacity-100' : 'opacity-20'}`}>
                  <div className="flex items-center gap-2 mb-4 text-red-400 font-bold uppercase tracking-widest border-b border-red-500/20 pb-2">
                    <AlertCircle className="w-5 h-5" /> Mauvais Prompt
                  </div>
                  
                  <div className="bg-black/80 p-4 rounded-xl border border-white/5 h-32 mb-6 font-mono text-sm text-gray-300">
                    {step >= 1 && (
                      <Typewriter 
                        text={currentSim.badPrompt} 
                        speed={20}
                        onComplete={() => setTimeout(() => setStep(2), 500)}
                      />
                    )}
                  </div>

                  <div className="relative h-64 rounded-xl overflow-hidden border border-white/10 bg-black/80 flex items-center justify-center">
                    {step < 2 ? (
                      <span className="text-gray-600 animate-pulse font-mono">En attente du prompt...</span>
                    ) : (
                      <>
                        <MediaRender url={currentSim.badMediaUrl} type={currentSim.badMediaType} isPremium={false} />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="bg-red-500/80 text-white px-4 py-1 rounded-full text-sm font-bold uppercase backdrop-blur-md">Résultat Médiocre</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Good Prompt Side */}
                <div className={`transition-all duration-700 ${step >= 3 ? 'opacity-100' : 'opacity-20'}`}>
                  <div className="flex items-center gap-2 mb-4 text-green-400 font-bold uppercase tracking-widest border-b border-green-500/20 pb-2">
                    <CheckCircle2 className="w-5 h-5" /> Prompt ClassIA Premium
                  </div>
                  
                  <div className="bg-[var(--color-neon-blue)]/5 p-4 rounded-xl border border-[var(--color-neon-blue)]/30 h-32 mb-6 font-mono text-sm text-[var(--color-neon-blue)]">
                    {step >= 2 && step < 3 && (
                      <button 
                        onClick={() => setStep(3)} 
                        className="w-full h-full flex items-center justify-center bg-white text-black font-black uppercase tracking-widest hover:bg-[var(--color-neon-blue)] rounded-lg transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.4)] text-xl"
                      >
                        <Play className="w-8 h-8 mr-3" fill="currentColor" /> INJECTER LE PROMPT PREMIUM
                      </button>
                    )}
                    {step >= 3 && (
                      <Typewriter 
                        text={currentSim.goodPrompt} 
                        speed={15}
                        onComplete={() => setTimeout(() => setStep(4), 800)}
                      />
                    )}
                  </div>

                  <div className="relative h-64 rounded-xl overflow-hidden border border-[var(--color-neon-blue)]/50 bg-black/80 flex items-center justify-center shadow-[0_0_30px_rgba(0,212,255,0.1)]">
                    {step < 4 ? (
                      <span className="text-[var(--color-neon-blue)]/50 animate-pulse font-mono">Génération en cours...</span>
                    ) : (
                      <>
                        <MediaRender url={currentSim.goodMediaUrl} type={currentSim.goodMediaType} isPremium={true} />
                        {(currentSim.goodMediaType === 'youtube' || currentSim.goodMediaType === 'video') && (
                          <div className="absolute top-2 right-2 bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-blue)] px-2 py-1 rounded text-xs flex items-center gap-1 backdrop-blur-md border border-[var(--color-neon-blue)]/30 pointer-events-none">
                            <Video className="w-3 h-3"/> HQ Video Render
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                          <span className="bg-green-500/80 text-white px-4 py-1 rounded-full text-sm font-bold uppercase backdrop-blur-md mb-2 inline-block">Résultat Pro</span>
                          <p className="text-xs text-white/80 leading-relaxed bg-black/50 p-2 rounded-lg backdrop-blur-md border border-white/10 pointer-events-auto">
                            <strong className="text-[var(--color-neon-blue)]">L'Analyse du formateur : </strong>
                            {currentSim.explanation}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>
              
              {/* Replay Button */}
              {step === 4 && (
                <div className="mt-8 flex justify-center gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="px-6 py-2 border border-white/20 text-white hover:bg-white/10 rounded-full transition-all text-sm font-bold tracking-widest uppercase"
                  >
                    Rejouer
                  </button>
                  {activeSimulations.length > 1 && (
                    <button 
                      onClick={() => {
                        nextSim();
                      }}
                      className="px-6 py-2 bg-[var(--color-neon-blue)] text-black rounded-full transition-all text-sm font-bold tracking-widest uppercase hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]"
                    >
                      Simulation Suivante →
                    </button>
                  )}
                </div>
              )}

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;
