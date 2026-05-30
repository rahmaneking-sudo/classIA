import React, { useState, useEffect } from 'react';
import { Bot, User, Play, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

const courseData = {
  gemini: {
    title: "Gemini / Midjourney (Images)",
    badPrompt: "dessine moi une ville futuriste avec des voitures volantes",
    badResultImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop", 
    goodPrompt: "Cinematic wide angle shot of a cyberpunk metropolis at night, rain pouring down, flying cars leaving neon light trails, photorealistic, 8k resolution, Unreal Engine 5 render, highly detailed, dramatic lighting --ar 16:9",
    goodResultImage: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1000&auto=format&fit=crop", 
    goodResultVideo: null,
    explanation: "Un mauvais prompt donne un résultat basique. Un bon prompt précise le style (Cinematic), la météo (rain), la résolution (8k), et le moteur de rendu (Unreal Engine 5)."
  },
  kling: {
    title: "Kling AI / Haiper (Vidéos)",
    badPrompt: "un aigle qui vole dans le ciel",
    badResultImage: null, 
    badResultVideo: "https://cdn.pixabay.com/video/2015/11/02/1172-143977507_tiny.mp4", // Oiseau basique
    goodPrompt: "FPV Drone tracking shot, extremely fast motion. A majestic golden eagle swooping down through a misty mountain canyon, slow motion at the end, cinematic lighting, 4k, 60fps.",
    goodResultImage: null,
    goodResultVideo: "https://cdn.pixabay.com/video/2021/08/04/83864-584742610_tiny.mp4", // Drone spectaculaire
    explanation: "Pour la vidéo IA (Kling, Haiper, Luma), le secret absolu est de définir LE MOUVEMENT DE LA CAMÉRA (FPV Drone, tracking shot) et LA VITESSE (slow motion)."
  },
  claude: {
    title: "Claude 3.5 (Jeux Vidéo)",
    badPrompt: "code moi le jeu flappy bird en html stp",
    badResultImage: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1000&auto=format&fit=crop", 
    goodPrompt: "Agis comme un développeur senior. Crée un jeu HTML5 Canvas complet (Flappy Bird clone). Ajoute de la gravité fluide, une détection de collision pixel-perfect, un écran de score, et un design Neon Cyberpunk. Utilise un seul fichier avec le CSS et JS intégrés.",
    goodResultImage: null, 
    goodResultVideo: "https://cdn.pixabay.com/video/2022/10/24/136202-764506307_tiny.mp4", // Vidéo de code/jeu animé
    explanation: "Avec Claude Artifacts, il faut préciser 'HTML5 Canvas', 'physique fluide' et le style visuel voulu pour obtenir un vrai jeu jouable généré en 5 secondes."
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
  const [step, setStep] = useState(0); // 0: init, 1: typing bad, 2: show bad, 3: typing good, 4: show good

  const currentCourse = courseData[activeTab];

  // Reset animation when changing tabs
  useEffect(() => {
    setStep(0);
  }, [activeTab]);

  const handleStartSimulation = () => {
    setStep(1);
  };

  return (
    <div className="py-24 bg-[#0a0a10] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-widest uppercase mb-4 text-glow-blue">
            LABORATOIRE <span className="text-[var(--color-neon-purple)]">INTERACTIF</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Voyez la différence en temps réel entre un prompt amateur et un prompt Ultra-Premium.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
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

        {/* Simulator Area */}
        <div className="glass-panel border border-white/10 rounded-3xl p-6 md:p-10 relative overflow-hidden">
          
          {step === 0 && (
            <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
              <Sparkles className="w-16 h-16 text-[var(--color-neon-blue)] mb-6 animate-pulse" />
              <button 
                onClick={handleStartSimulation}
                className="btn-sci-fi bg-[var(--color-neon-blue)]/20 border-2 border-[var(--color-neon-blue)] px-8 py-4 rounded-xl text-xl font-bold tracking-widest uppercase hover:bg-[var(--color-neon-blue)]/40 hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] flex items-center gap-3"
              >
                <Play className="w-6 h-6" /> Démarrer la simulation
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Bad Prompt Side */}
            <div className={`transition-all duration-700 ${step >= 1 ? 'opacity-100' : 'opacity-20'}`}>
              <div className="flex items-center gap-2 mb-4 text-red-400 font-bold uppercase tracking-widest border-b border-red-500/20 pb-2">
                <AlertCircle className="w-5 h-5" /> Mauvais Prompt
              </div>
              
              <div className="bg-black/50 p-4 rounded-xl border border-white/5 h-32 mb-6 font-mono text-sm text-gray-300">
                {step >= 1 && (
                  <Typewriter 
                    text={currentCourse.badPrompt} 
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
                    {currentCourse.badResultVideo ? (
                      <video src={currentCourse.badResultVideo} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60" />
                    ) : (
                      <img src={currentCourse.badResultImage} alt="Bad Result" className="w-full h-full object-cover opacity-60" />
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
                  <button onClick={() => setStep(3)} className="w-full h-full flex items-center justify-center bg-[var(--color-neon-blue)] text-black font-black uppercase tracking-widest hover:bg-white rounded-lg transition-all duration-300 shadow-[0_0_30px_rgba(0,212,255,0.6)] animate-pulse text-lg md:text-xl">
                    <Play className="w-8 h-8 mr-3" fill="currentColor" /> INJECTER LE PROMPT PREMIUM
                  </button>
                )}
                {step >= 3 && (
                  <Typewriter 
                    text={currentCourse.goodPrompt} 
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
                    {currentCourse.goodResultVideo ? (
                      <video src={currentCourse.goodResultVideo} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                    ) : (
                      <img src={currentCourse.goodResultImage} alt="Good Result" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="bg-green-500/80 text-white px-4 py-1 rounded-full text-sm font-bold uppercase backdrop-blur-md mb-2 inline-block">Résultat Pro</span>
                      <p className="text-xs text-white/80 leading-relaxed bg-black/50 p-2 rounded-lg backdrop-blur-md border border-white/10">
                        <strong className="text-[var(--color-neon-blue)]">L'Analyse du formateur : </strong>
                        {currentCourse.explanation}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
          
          {/* Replay Button */}
          {step === 4 && (
            <div className="mt-8 text-center">
              <button 
                onClick={() => setStep(1)}
                className="text-gray-400 hover:text-white uppercase tracking-widest text-sm font-bold underline underline-offset-8 transition-colors"
              >
                Rejouer la simulation
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Courses;
