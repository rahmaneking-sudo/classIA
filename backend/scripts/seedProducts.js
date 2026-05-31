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
    title: 'Site de Booking Hôtels (Dakar)',
    description: 'Une plateforme complète pour réserver des hôtels ou des hébergements. Interface client élégante et panel administrateur pour gérer les réservations, les chambres et les prix.',
    price: 250000,
    previewUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000',
    demoUrl: 'https://booking-demo.vercel.app',
    features: ['Panel Admin Hébergeur', 'Paiement Intégré', 'Système de Disponibilités', 'Design Ultra Moderne', 'Code Source Fourni'],
    category: 'Réservation'
  },
  {
    title: 'Site Vitrine Restaurant',
    description: 'Parfait pour un restaurant ou fast-food. Présentez votre menu, recevez des réservations de tables et permettez les commandes à emporter directement depuis le site.',
    price: 150000,
    previewUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000',
    demoUrl: 'https://restaurant-demo.vercel.app',
    features: ['Menu Numérique Interactif', 'Réservation de Table', 'Interface Gérant', 'Optimisé Mobile'],
    category: 'Restaurant'
  },
  {
    title: 'Application type Uber (VTC)',
    description: 'Un système complet comprenant une application web progressive pour les passagers et une interface de gestion pour les chauffeurs.',
    price: 450000,
    previewUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000',
    demoUrl: 'https://vtc-demo.vercel.app',
    features: ['Panel Chauffeur', 'Panel Client', 'Géolocalisation', 'Gestion des Courses', 'Paiement Mobile Money'],
    category: 'Application Mobile'
  },
  {
    title: 'Site Booking Pharmacies de Garde',
    description: 'Annuaire dynamique et système de réservation en ligne pour les pharmacies. Permet aux patients de trouver facilement la pharmacie ouverte la plus proche.',
    price: 200000,
    previewUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1000',
    demoUrl: 'https://pharmacy-demo.vercel.app',
    features: ['Géolocalisation des Pharmacies', 'Panel Pharmacien', 'Mise à jour des gardes', 'Design Épuré'],
    category: 'Annuaire'
  },
  {
    title: 'Site Vitrine Agence de Voyage',
    description: 'Proposez vos circuits touristiques, billets d\'avion et séjours. Un design qui fait rêver avec un espace pour gérer vos différentes offres et réservations.',
    price: 180000,
    previewUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000',
    demoUrl: 'https://travel-demo.vercel.app',
    features: ['Gestion des Packages', 'Formulaires de Devis', 'Galerie Photos Avancée', 'Panel Admin Agence'],
    category: 'Vitrine'
  }
];

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // On efface les anciens pour éviter les doublons si on relance
    await Product.deleteMany({});
    console.log('Produits précédents effacés');

    await Product.insertMany(initialProducts);
    console.log('Produits injectés avec succès !');

    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seeding:', error);
    process.exit(1);
  }
};

seedDB();
