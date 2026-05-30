import React, { useState, useEffect } from 'react';
import { Bot, User, Play, Sparkles, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

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
        explanation: "Un mauvais prompt donne un résultat basique. Un bon prompt précise le style (Cinematic), la météo (rain), la résolution (8k), et le moteur de rendu (Unreal Engine 5)."
      },
      {
        id: 2,
        title: "Portrait Photoréaliste",
        badPrompt: "photo d'un homme en costume de face",
        badResultImage: "https://images.unsplash.com/photo-1542156822-6924d1a71ace?q=80&w=1000&auto=format&fit=crop", 
        goodPrompt: "Professional headshot photography of a handsome 35-year-old man, tailored navy blue suit, standing in a bright modern glass office, shallow depth of field, natural window lighting, 85mm portrait lens, 8k, ultra-realistic",
        goodResultImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop", 
        explanation: "La focale (85mm portrait lens), la lumière (natural window lighting) et la profondeur de champ (shallow depth of field) font toute la différence."
      },
      {
        id: 3,
        title: "Logo Minimaliste",
        badPrompt: "logo pour mon entreprise de tech",
        badResultImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000&auto=format&fit=crop", 
        goodPrompt: "A modern minimalist logo for a tech startup, negative space design, flat vector design, clean white background, high contrast, corporate identity, dribbble style, masterpiece --no text --v 6.0",
        goodResultImage: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=1000&auto=format&fit=crop", 
        explanation: "Il faut interdire le texte (--no text) car l'IA ne sait pas bien écrire. Préciser 'flat vector' garantit un logo utilisable."
      },
      {
        id: 4,
        title: "Design d'Intérieur",
        badPrompt: "une belle chambre moderne",
        badResultImage: "https://images.unsplash.com/photo-1522771731478-44bf104a524c?q=80&w=1000&auto=format&fit=crop", 
        goodPrompt: "Interior design of a luxurious modern bedroom, panoramic floor-to-ceiling windows overlooking a snowy mountain, warm ambient lighting, minimalist furniture, architectural digest style, 8k --ar 16:9",
        goodResultImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop", 
        explanation: "Le secret est d'invoquer une référence connue de design (architectural digest style) et de décrire la vue (overlooking a snowy mountain)."
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
        badResultVideo: "https://www.w3schools.com/html/mov_bbb.mp4", 
        goodPrompt: "FPV Drone tracking shot, extremely fast motion. A majestic golden eagle swooping down through a misty mountain canyon, slow motion at the end, cinematic lighting, 4k, 60fps.",
        goodResultVideo: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4", 
        explanation: "Pour la vidéo IA, le secret est de définir LE MOUVEMENT DE LA CAMÉRA (FPV Drone, tracking shot) et LA VITESSE (slow motion)."
      },
      {
        id: 2,
        title: "Morphing Cinématographique",
        badPrompt: "une voiture qui se transforme en robot",
        badResultVideo: "https://media.w3.org/2010/05/video/movie_300.mp4", 
        goodPrompt: "Continuous single take. A red sports car driving fast on a highway smoothly transforming into a metallic robotic cheetah running on the street. Seamless morphing, cinematic lighting.",
        goodResultVideo: "https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4", 
        explanation: "Les IA vidéos comme Runway ou Haiper ont besoin des mots 'Continuous single take' et 'Seamless morphing' pour éviter les coupures."
      },
      {
        id: 3,
        title: "Action Rapide (Slow Motion)",
        badPrompt: "quelqu'un verse du café",
        badResultVideo: "https://www.w3schools.com/html/mov_bbb.mp4", 
        goodPrompt: "Slow motion, high-speed camera. A cup of coffee splashing in reverse, liquid reforming into a perfect sphere. Hyper-realistic lighting, macro photography lens, stable physics.",
        goodResultVideo: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4", 
        explanation: "Sur des vidéos physiques, préciser 'stable physics' et 'high-speed camera' force l'IA à analyser la gravité correctement."
      },
      {
        id: 4,
        title: "Animation 3D Pixar",
        badPrompt: "un petit garcon qui sourit 3d",
        badResultVideo: "https://media.w3.org/2010/05/video/movie_300.mp4", 
        goodPrompt: "A cute 3D character, young boy with curly brown hair, wearing a yellow hoodie, big expressive eyes, looking surprised with mouth open, Pixar animation style, octane render, soft studio lighting.",
        goodResultVideo: "https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4", 
        explanation: "Demander le 'Pixar animation style' couplé à 'octane render' donne ce look de film d'animation à plusieurs millions de dollars."
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
        badResultImage: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1000&auto=format&fit=crop", 
        goodPrompt: "Agis comme un développeur senior. Crée un jeu HTML5 Canvas complet (Flappy Bird clone). Ajoute de la gravité fluide, une détection de collision pixel-perfect, un écran de score, et un design Neon Cyberpunk. Utilise un seul fichier.",
        goodResultImage: "/courses_assets/retro.png", 
        explanation: "Avec Claude Artifacts, il faut préciser 'HTML5 Canvas', 'physique fluide' et le style visuel voulu pour obtenir un vrai jeu jouable."
      },
      {
        id: 2,
        title: "Dashboard Data B2B",
        badPrompt: "fais moi un tableau de bord",
        badResultImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop", 
        goodPrompt: "Crée un composant React complet pour un Dashboard SaaS B2B. Utilise TailwindCSS, Recharts pour les graphiques, et Lucide-React pour les icônes. Ajoute un mode sombre, des cartes statistiques avec KPI en hausse, et un design Glassmorphism.",
        goodResultImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop", 
        explanation: "Il faut imposer les bibliothèques exactes (Tailwind, Recharts, Lucide) pour que Claude génère un rendu magnifique."
      },
      {
        id: 3,
        title: "Expérience Web 3D",
        badPrompt: "un site web en 3d",
        badResultImage: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1000&auto=format&fit=crop", 
        goodPrompt: "Génère une scène Three.js intégrée dans une page HTML. Affiche un globe terrestre interactif avec des points lumineux pour chaque ville majeure. Ajoute des contrôles OrbitControls et un fond étoilé dynamique.",
        goodResultImage: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1000&auto=format&fit=crop", 
        explanation: "Claude connaît Three.js par cœur, mais il faut lui préciser quels objets 3D (globe) et contrôles (OrbitControls) inclure."
      },
      {
        id: 4,
        title: "Landing Page Hypnotique",
        badPrompt: "une page de vente pour mon ebook",
        badResultImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop", 
        goodPrompt: "Code une Landing Page HTML/Tailwind pour un Ebook sur l'IA. Structure : 1. Hero Section avec un gros titre. 2. Preuve Sociale (3 logos). 3. Section Bénéfices. 4. Appel à l'action. Utilise un design épuré inspiré de Stripe avec des dégradés subtils.",
        goodResultImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop", 
        explanation: "Toujours donner la structure exacte des sections (Hero, Preuve sociale, etc.) et une inspiration design (Stripe)."
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
                    {currentSim.badResultVideo ? (
                      <video src={currentSim.badResultVideo} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60" />
                    ) : (
                      <img src={currentSim.badResultImage} alt="Bad Result" className="w-full h-full object-cover opacity-60" />
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
                    className="w-full h-full flex items-center justify-center bg-white text-black font-black uppercase tracking-widest hover:bg-[var(--color-neon-blue)] rounded-lg transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.4)] animate-pulse text-lg"
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
                    {currentSim.goodResultVideo ? (
                      <video src={currentSim.goodResultVideo} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                    ) : (
                      <img src={currentSim.goodResultImage} alt="Good Result" className="w-full h-full object-cover" />
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
