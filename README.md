# Ocean's Water React Application

## Description
Application web React pour Ocean's Water, une entreprise spécialisée dans la distribution d'eau et de boissons. Cette application permet aux clients de parcourir les produits par catégories, de les ajouter au panier et de passer commande.

## Fonctionnalités
- Navigation intuitive avec menu responsive
- Affichage des produits par catégories (Eau, Bières, Jus)
- Recherche et filtrage des produits
- Gestion du panier d'achat
- Section "À propos de nous"
- Formulaire de contact
- Interface responsive pour mobile et desktop

## Technologies utilisées
- React 19
- React Router 7
- CSS personnalisé
- API REST Django (backend)

## Installation

```bash
# Cloner le dépôt
git clone [URL_DU_REPO]

# Installer les dépendances
cd oceans_water_react
npm install

# Démarrer l'application en mode développement
npm start
```

## Structure du projet
- `/src/components` : Composants réutilisables (Header, Footer, ProductCard, etc.)
- `/src/pages` : Pages principales de l'application
- `/src/styles` : Fichiers CSS pour chaque composant et page
- `/src/services` : Services pour les appels API
- `/src/context` : Contextes React (panier, authentification)
- `/src/assets` : Images et ressources statiques

## Backend
Cette application frontend se connecte à une API Django. Assurez-vous que le serveur backend est en cours d'exécution sur http://localhost:8000/
