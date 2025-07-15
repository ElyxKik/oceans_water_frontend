import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import '../styles/Boutique.css';

const Boutique = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(null);

  // Récupérer toutes les catégories disponibles depuis l'API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await productService.getAllCategories();
        
        // Extraire les catégories du format paginé de l'API Django
        const categoriesData = response.results || [];
        
        // Transformer les catégories au format attendu par le frontend
        const transformedCategories = categoriesData.map(category => {
          // Utiliser l'image de l'API si disponible, sinon utiliser une image par défaut
          let image, link;
          
          // Utiliser l'image de la catégorie depuis l'API
          if (category.image) {
            // Si l'image est une URL complète, l'utiliser directement
            if (category.image.startsWith('http')) {
              image = category.image;
            } else {
              // Si c'est un chemin relatif, construire l'URL complète
              image = `http://localhost:8000${category.image}`;
            }
          } else {
            // Fallback sur les images locales selon le nom de la catégorie
            if (category.nom.toLowerCase().includes('bière') || category.nom.toLowerCase().includes('biere')) {
              image = require('../assets/img/Avatar/icone_boutique/icon_boutique_biere.PNG');
            } else if (category.nom.toLowerCase().includes('jus')) {
              image = require('../assets/img/Avatar/icone_boutique/icon_boutique_jus.PNG');
            } else if (category.nom.toLowerCase().includes('eau')) {
              image = require('../assets/img/Avatar/icone_boutique/icon_boutique_eau.PNG');
            } else if (category.nom.toLowerCase().includes('liqueur')) {
              image = require('../assets/img/Avatar/icone_boutique/icon_boutique_biere.PNG'); // Utiliser l'icône bière pour liqueur
            } else {
              // Image placeholder pour les catégories inconnues
              image = `https://via.placeholder.com/150x150/0056b3/ffffff?text=${encodeURIComponent(category.nom)}`;
            }
          }
          
          // Déterminer le lien selon le nom de la catégorie
          // Utiliser le nom de la catégorie pour créer l'URL de la route React
          const categorySlug = category.nom.toLowerCase()
            .replace(/[àáâãäå]/g, 'a')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/[òóôõö]/g, 'o')
            .replace(/[ùúûü]/g, 'u')
            .replace(/[ç]/g, 'c')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
          
          link = `/categorie/${categorySlug}`;
          
          return {
            id: category.id,
            nom: category.nom,
            description: category.description,
            image: image,
            link: link
          };
        });
        
        console.log('Catégories chargées depuis l\'API:', transformedCategories);
        setCategories(transformedCategories);
        setLoadingCategories(false);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        // En cas d'erreur, utiliser des catégories par défaut
        const defaultCategories = [
          {
            id: 1,
            nom: "Bière",
            description: "Boisson alcoolisée",
            image: require('../assets/img/Avatar/icone_boutique/icon_boutique_biere.PNG'),
            link: '/categorie/biere'
          },
          {
            id: 2,
            nom: "Eau",
            description: "Eau minérale",
            image: require('../assets/img/Avatar/icone_boutique/icon_boutique_eau.PNG'),
            link: '/categorie/eau'
          },
          {
            id: 3,
            nom: "Jus",
            description: "Jus de fruits",
            image: require('../assets/img/Avatar/icone_boutique/icon_boutique_jus.PNG'),
            link: '/categorie/jus'
          },
          {
            id: 4,
            nom: "Liqueur",
            description: "Boissons spiritueuses",
            image: require('../assets/img/Avatar/icone_boutique/icon_boutique_biere.PNG'),
            link: '/categorie/liqueur'
          }
        ];
        setCategories(defaultCategories);
        setCategoryError('Impossible de charger les catégories. Affichage des catégories par défaut.');
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Fonction pour gérer les erreurs de chargement d'images
  const handleImageError = (e, categoryName) => {
    console.log(`Erreur de chargement d'image pour la catégorie: ${categoryName}`);
    // Remplacer par une image placeholder en cas d'erreur
    e.target.src = `https://via.placeholder.com/150x150/0056b3/ffffff?text=${encodeURIComponent(categoryName)}`;
  };

  return (
    <div className="boutique-container">
      {/* Section titre */}
      <section className="welcome">
        <h2>Nos Catégories de Produits</h2>
        <p>Choisissez parmi notre sélection de boissons de qualité</p>

        <div className="categories-grid">
          {loadingCategories ? (
            <p className="loading-message">Chargement des catégories...</p>
          ) : categoryError ? (
            <p className="error-message">{categoryError}</p>
          ) : (
            categories.map(category => (
              <Link 
                to={category.link} 
                className="category-item" 
                key={category.id}
              >
                <div className="category-image">
                  <img 
                    src={category.image} 
                    alt={`${category.nom}`}
                    onError={(e) => handleImageError(e, category.nom)}
                    loading="lazy"
                  />
                </div>
                <div className="category-info">
                  <h3>{category.nom}</h3>
                  {category.description && <p>{category.description}</p>}
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Boutique;
