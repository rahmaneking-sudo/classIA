import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Simulation from '../models/Simulation.js';

dotenv.config();

const initialSimulations = [
  {
    category: "gemini",
    title: "Ville Cyberpunk",
    badPrompt: "dessine moi une ville futuriste avec des voitures volantes",
    badMediaUrl: "/courses_assets/bad_cyberpunk.png",
    badMediaType: "image",
    goodPrompt: "Cinematic wide angle shot of a cyberpunk metropolis at night, rain pouring down, flying cars leaving neon light trails, photorealistic, 8k resolution, Unreal Engine 5 render, highly detailed, dramatic lighting --ar 16:9",
    goodMediaUrl: "/courses_assets/cyberpunk.png",
    goodMediaType: "image",
    explanation: "Un mauvais prompt donne un résultat basique. Un bon prompt précise le style (Cinematic), la météo (rain), la résolution (8k), et le moteur de rendu."
  },
  {
    category: "gemini",
    title: "Portrait Photoréaliste",
    badPrompt: "photo d'un homme en costume de face",
    badMediaUrl: "/courses_assets/bad_portrait.png",
    badMediaType: "image",
    goodPrompt: "Professional headshot photography of a handsome 35-year-old man, tailored navy blue suit, standing in a bright modern glass office, shallow depth of field, natural window lighting, 85mm portrait lens, 8k, ultra-realistic",
    goodMediaUrl: "/courses_assets/good_portrait.png",
    goodMediaType: "image",
    explanation: "La focale (85mm portrait lens), la lumière (natural window lighting) et la profondeur de champ (shallow depth of field) font toute la différence."
  },
  {
    category: "kling",
    title: "Plan de Drone (Animalier)",
    badPrompt: "un aigle qui vole dans le ciel",
    badMediaUrl: "/courses_assets/bad_eagle.png",
    badMediaType: "image",
    goodPrompt: "FPV Drone tracking shot, extremely fast motion. A majestic golden eagle swooping down through a misty mountain canyon, cinematic lighting, 4k, 60fps.",
    goodMediaUrl: "https://www.youtube.com/watch?v=1xNObbA_WTo",
    goodMediaType: "youtube",
    explanation: "Pour la vidéo IA, le secret est de définir LE MOUVEMENT DE LA CAMÉRA (FPV Drone, tracking shot) et LA VITESSE."
  },
  {
    category: "kling",
    title: "Sintel Trailer 3D",
    badPrompt: "un petit garçon qui court",
    badMediaUrl: "/courses_assets/bad_code.png",
    badMediaType: "image",
    goodPrompt: "Cinematic 3D animation, young girl fighting an epic battle, Pixar style, highly detailed.",
    goodMediaUrl: "https://www.youtube.com/watch?v=eRsGyueVLvQ",
    goodMediaType: "youtube",
    explanation: "Exemple parfait d'intégration YouTube pour émerveiller vos étudiants avec des vidéos fluides et professionnelles !"
  },
  {
    category: "claude",
    title: "Jeu Rétro (Clone Flappy Bird)",
    badPrompt: "code moi le jeu flappy bird en html stp",
    badMediaUrl: "/courses_assets/bad_code.png",
    badMediaType: "image",
    goodPrompt: "Agis comme un développeur senior. Crée un jeu HTML5 Canvas complet (Flappy Bird clone). Ajoute de la gravité fluide, une détection de collision pixel-perfect, un écran de score, et un design Neon Cyberpunk. Utilise un seul fichier.",
    goodMediaUrl: "/courses_assets/retro.png",
    goodMediaType: "image",
    explanation: "Avec Claude Artifacts, il faut préciser 'HTML5 Canvas', 'physique fluide' et le style visuel voulu pour obtenir un vrai jeu jouable."
  },
  {
    category: "claude",
    title: "Dashboard Data B2B",
    badPrompt: "fais moi un tableau de bord",
    badMediaUrl: "/courses_assets/bad_dashboard.png",
    badMediaType: "image",
    goodPrompt: "Crée un composant React complet pour un Dashboard SaaS B2B. Utilise TailwindCSS, Recharts pour les graphiques, et Lucide-React pour les icônes. Ajoute un mode sombre, des cartes statistiques avec KPI en hausse, et un design Glassmorphism.",
    goodMediaUrl: "/courses_assets/good_dashboard.png",
    goodMediaType: "image",
    explanation: "Il faut imposer les bibliothèques exactes (Tailwind, Recharts, Lucide) pour que Claude génère un rendu magnifique."
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas');
    console.log('Suppression des anciennes simulations...');
    await Simulation.deleteMany({});
    console.log('Insertion des nouvelles simulations par défaut...');
    await Simulation.insertMany(initialSimulations);
    console.log('✅ Base de données initialisée avec succès !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  });
