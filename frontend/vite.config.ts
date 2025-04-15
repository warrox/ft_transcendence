import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // Définir les répertoires d'entrée
  root: path.resolve(__dirname, 'src'),

  // Configuration pour le serveur de développement
  server: {
	port: 3000, // Le port du serveur de développement
	open: true, // Ouvrir automatiquement le navigateur
  },

  // Configuration de la sortie de build
  build: {
	outDir: path.resolve(__dirname, 'dist'), // Le dossier où la build sera générée
	sourcemap: true, // Générer les sourcemaps
  },

  // Résolution des modules
  resolve: {
	alias: {
	  '@': path.resolve(__dirname, 'src'),
	},
  },

  // Options supplémentaires si nécessaire
  optimizeDeps: {
	include: [], // Modules à optimiser
  },
});
