import React, { useState, useEffect } from 'react';
import { Bot, User, Play, Sparkles, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, Video } from 'lucide-react';

const courseData = {
  gemini: {
    title: "Gemini / Midjourney (Images)",
    simulations: [
      {
        id: 1,
        title: "Ville Cyberpunk",
        badPrompt: "dessine moi une ville futuriste avec des voitures volantes",
        badResultImage: "/courses_assets/bad_cyberpunk.png", 
        goodPrompt: "Cinematic wide angle shot of a cyberpunk metropolis at night, rain pouring down, flying cars leaving neon light trails, photorealistic, 8k resolution, Unreal Engine 5 render, highly detailed, dramatic lighting --ar 16:9",
        goodResultImage: "/courses_assets/cyberpunk.png", 
        explanation: "Un mauvais prompt donne un résultat basique. Un bon prompt précise le style (Cinematic), la météo (rain), la résolution (8k), et le moteur de rendu (Unreal Engine 5).",
        isVideo: false
      },
      {
        id: 2,
        title: "Portrait Photoréaliste",
        badPrompt: "photo d'un homme en costume de face",
        badResultImage: "/courses_assets/bad_portrait.png", 
        goodPrompt: "Professional headshot photography of a handsome 35-year-old man, tailored navy blue suit, standing in a bright modern glass office, shallow depth of field, natural window lighting, 85mm portrait lens, 8k, ultra-realistic",
        goodResultImage: "/courses_assets/good_portrait.png", 
        explanation: "La focale (85mm portrait lens), la lumière (natural window lighting) et la profondeur de champ (shallow depth of field) font toute la différence.",
        isVideo: false
      }
    ]
  },
  kling: {
    title: "Kling AI / Haiper (Vidéos)",
    simulations: [
      {
        id: 1,
        title: "Plan de Drone (Animalier)",
        badPrompt: "un aigle qui vole dans le ciel",
        badResultImage: "/courses_assets/bad_eagle.png", 
        goodPrompt: "FPV Drone tracking shot, extremely fast motion. A majestic golden eagle swooping down through a misty mountain canyon, cinematic lighting, 4k, 60fps.",
        goodResultImage: "/courses_assets/eagle.png", 
        explanation: "Pour la vidéo IA, le secret est de définir LE MOUVEMENT DE LA CAMÉRA (FPV Drone, tracking shot) et LA VITESSE.",
        isVideo: true
      },
      {
        id: 2,
        title: "Timelapse Macro",
        badPrompt: "une fleur qui s'ouvre",
        badResultImage: "/courses_assets/bad_flower.png", 
        goodPrompt: "Macro photography timelapse. A beautiful red amaryllis flower slowly blooming and opening its petals. 4k resolution, national geographic style, continuous shot.",
        goodResultImage: "/courses_assets/good_flower.png", 
        explanation: "Les IA vidéos ont besoin des mots 'Timelapse' et 'Macro photography' pour bien détailler l'éclosion d'une plante de manière continue.",
        isVideo: true
      }
    ]
  },
  claude: {
    title: "Claude 3.5 (Jeux Vidéo)",
    simulations: [
      {
        id: 1,
        title: "Jeu Rétro (Clone Flappy Bird)",
        badPrompt: "code moi le jeu flappy bird en html stp",
        badResultImage: "/courses_assets/bad_code.png", 
        goodPrompt: "Agis comme un développeur senior. Crée un jeu HTML5 Canvas complet (Flappy Bird clone). Ajoute de la gravité fluide, une détection de collision pixel-perfect, un écran de score, et un design Neon Cyberpunk. Utilise un seul fichier.",
        goodResultImage: "/courses_assets/retro.png", 
        explanation: "Avec Claude Artifacts, il faut préciser 'HTML5 Canvas', 'physique fluide' et le style visuel voulu pour obtenir un vrai jeu jouable.",
        isVideo: false
      },
      {
        id: 2,
        title: "Dashboard Data B2B",
        badPrompt: "fais moi un tableau de bord",
        badResultImage: "/courses_assets/bad_dashboard.png", 
        goodPrompt: "Crée un composant React complet pour un Dashboard SaaS B2B. Utilise TailwindCSS, Recharts pour les graphiques, et Lucide-React pour les icônes. Ajoute un mode sombre, des cartes statistiques avec KPI en hausse, et un design Glassmorphism.",
        goodResultImage: "/courses_assets/good_dashboard.png", 
        explanation: "Il faut imposer les bibliothèques exactes (Tailwind, Recharts, Lucide) pour que Claude génère un rendu magnifique.",
        isVideo: false
      }
    ]
  }
};

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

const Courses = () => {
  const [activeTab, setActiveTab] = useState('gemini');
  const [simIndex, setSimIndex] = useState(0);
  const [step, setStep] = useState(0); // 0: init, 1: typing bad, 2: show bad, 3: typing good, 4: show good

  const categoryData = courseData[activeTab];
  const currentSim = categoryData.simulations[simIndex];

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
    setSimIndex((prev) => (prev + 1) % categoryData.simulations.length);
  };

  const prevSim = () => {
    setSimIndex((prev) => (prev - 1 + categoryData.simulations.length) % categoryData.simulations.length);
  };

  return (
    <div className="py-24 bg-[#0a0a10] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-widest uppercase mb-4 text-glow-blue">
            LABORATOIRE <span className="text-[var(--color-neon-purple)]">INTERACTIF</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8">
            Testez plusieurs modèles de simulation sur différentes IA (Images, Vidéos, Code).
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {Object.keys(courseData).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 border
                ${activeTab === key 
                  ? 'bg-[var(--color-neon-blue)]/20 border-[var(--color-neon-blue)] text-white shadow-[0_0_15px_rgba(0,212,255,0.4)]' 
                  : 'bg-black/50 border-white/10 text-gray-400 hover:border-[var(--color-neon-blue)]/50 hover:text-white'}`}
            >
              {courseData[key].title}
            </button>
          ))}
        </div>

        {/* Multiple Simulations Navigation */}
        {categoryData.simulations.length > 1 && (
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
                    <img 
                      src={currentSim.badResultImage} 
                      alt="Bad Result" 
                      className={`w-full h-full object-cover opacity-60 ${currentSim.isVideo ? 'scale-105' : ''}`} 
                    />
                    {currentSim.isVideo && (
                       <div className="absolute top-2 right-2 bg-black/50 text-white/50 px-2 py-1 rounded text-xs flex items-center gap-1 backdrop-blur-sm">
                         <Video className="w-3 h-3"/> Rendu Vidéo
                       </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
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
                    <img 
                      src={currentSim.goodResultImage} 
                      alt="Good Result" 
                      className={`w-full h-full object-cover origin-center ${currentSim.isVideo ? 'scale-[1.15] transition-transform duration-[15000ms] ease-out hover:scale-125' : 'transition-transform duration-700 hover:scale-105'}`} 
                    />
                    {currentSim.isVideo && (
                       <div className="absolute top-2 right-2 bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-blue)] px-2 py-1 rounded text-xs flex items-center gap-1 backdrop-blur-md border border-[var(--color-neon-blue)]/30">
                         <Video className="w-3 h-3"/> HQ Video Render
                       </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="bg-green-500/80 text-white px-4 py-1 rounded-full text-sm font-bold uppercase backdrop-blur-md mb-2 inline-block">Résultat Pro</span>
                      <p className="text-xs text-white/80 leading-relaxed bg-black/50 p-2 rounded-lg backdrop-blur-md border border-white/10">
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
              {categoryData.simulations.length > 1 && (
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
      </div>
    </div>
  );
};

export default Courses;
