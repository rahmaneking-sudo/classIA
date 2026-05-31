import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const initialProducts = [
  {
    title: 'Concept VTC "ClassIA Drive"',
    description: 'Une application mobile de transport (type Uber). Le design sera adapté à vos couleurs avec un panel pour les chauffeurs et un autre pour les clients.',
    price: 450000,
    previewUrl: 'https://images.unsplash.com/photo-1612458031023-eb3e9bd51a13?q=80&w=800&h=1600&fit=crop', // Mobile app UI tall
    demoUrl: '',
    features: ['Design UI Mobile Inclus', 'Géolocalisation', 'Panel Chauffeur & Client', 'Développement sur mesure'],
    category: 'Application Mobile'
  },
  {
    title: 'Booking Hôtels Dakar',
    description: 'Une plateforme de réservation d\'hôtels ou d\'hébergements. Interface client élégante et panel administrateur complet.',
    price: 300000,
    previewUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&h=1600&fit=crop', // Dashboard / Web UI tall
    demoUrl: '',
    features: ['Design Epuré', 'Système de Réservation', 'Paiement en ligne', 'Panel Hébergeur'],
    category: 'Réservation'
  },
  {
    title: 'Agence de Voyage Africaine',
    description: 'Présentez vos circuits touristiques au Sénégal et en Afrique. Un design qui fait rêver avec espace de devis et réservation.',
    price: 250000,
    previewUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&h=1600&fit=crop', // Web layout
    demoUrl: '',
    features: ['Galerie Photos Immersive', 'Formulaires de Devis', 'Panel Agence', 'Design Responsive'],
    category: 'Vitrine'
  },
  {
    title: 'Annuaire Pharmacies de Garde',
    description: 'Plateforme dynamique pour trouver la pharmacie ouverte la plus proche. Intégration de cartes et panel pour les pharmaciens.',
    price: 200000,
    previewUrl: 'https://images.unsplash.com/photo-1507238692062-7101eea35ceb?q=80&w=800&h=1600&fit=crop', // Web map layout
    demoUrl: '',
    features: ['Carte Interactive', 'Recherche Avancée', 'Espace Pharmacien', 'Haute Performance'],
    category: 'Annuaire'
  },
  {
    title: 'Restaurant Gastronomique',
    description: 'Le site parfait pour votre restaurant. Menu numérique, réservation de table et module de commandes en ligne.',
    price: 150000,
    previewUrl: 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?q=80&w=800&h=1600&fit=crop', // Food web layout
    demoUrl: '',
    features: ['Menu Interactif', 'Réservation de Table', 'Interface Gérant', 'Design Appétissant'],
    category: 'Restaurant'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Product.deleteMany({});
    await Product.insertMany(initialProducts);
    console.log('Concepts injectés !');
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
};

seedDB();
