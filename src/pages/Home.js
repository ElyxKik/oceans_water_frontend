import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import '../styles/Home.css';

const Home = () => {
  const { addToCart } = useContext(CartContext);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);
  const [categoryError, setCategoryError] = useState(null);

  // Récupérer les produits en vedette depuis l'API
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoadingProducts(true);
        // Récupérer les produits en vedette (on pourrait avoir un endpoint spécifique pour cela)
        // Pour l'instant, on récupère tous les produits et on en prend 6 au hasard
        const response = await productService.getAll();
        
        // Extraire les produits du format paginé de l'API Django
        const products = response.results || [];
        
        // Transformer les produits au format attendu par le frontend
        const transformedProducts = products.map(product => ({
          id: product.id,
          marque: product.marque,
          titre: product.nom,
          description: `${product.unite || 'unité'}`,
          prix: parseFloat(product.prix),
          stock: parseInt(product.stock, 10), // Stock converti en entier
          image: product.image || `https://via.placeholder.com/300x200/0056b3/ffffff?text=${product.nom}`
        }));
        
        console.log('Produits avec stock:', transformedProducts);
        
        // Prendre les 6 premiers produits ou moins si pas assez
        const featured = transformedProducts.slice(0, 6);
        
        // Si aucun produit n'est disponible, utiliser des placeholders
        if (featured.length === 0) {
          setFeaturedProducts([
            {
              id: "Evian-4x1,5L",
              marque: "Evian",
              titre: "Evian 1,5L",
              description: "paquet de 4 bouteilles",
              prix: 15000,
              image: "https://via.placeholder.com/300x200/0056b3/ffffff?text=Evian+1.5L"
            },
            {
              id: "Swissta-19L-echangbidon",
              marque: "Swissta",
              titre: "Swissta 19L",
              description: "Grand bidon pour fontaine",
              prix: 10000,
              image: "https://via.placeholder.com/300x200/0056b3/ffffff?text=Swissta+19L"
            }
          ]);
        } else {
          setFeaturedProducts(featured);
        }
        
        setLoadingProducts(false);
      } catch (err) {
        console.error('Erreur lors du chargement des produits en vedette:', err);
        // En cas d'erreur, utiliser des produits par défaut
        setFeaturedProducts([
          {
            id: "Evian-4x1,5L",
            marque: "Evian",
            titre: "Evian 1,5L",
            description: "paquet de 4 bouteilles",
            prix: 15000,
            image: "https://via.placeholder.com/300x200/0056b3/ffffff?text=Evian+1.5L"
          },
          {
            id: "Swissta-19L-echangbidon",
            marque: "Swissta",
            titre: "Swissta 19L",
            description: "Grand bidon pour fontaine",
            prix: 10000,
            image: "https://via.placeholder.com/300x200/0056b3/ffffff?text=Swissta+19L"
          }
        ]);
        setError('Impossible de charger les produits en vedette. Affichage des produits par défaut.');
        setLoadingProducts(false);
      }
    };
    
    fetchFeaturedProducts();
  }, []);
  
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
        
        // Limiter à 12 catégories maximum (6x2 sur PC, 3x3 sur mobile)
        const limitedCategories = transformedCategories.slice(0, 12);
        
        console.log('Catégories chargées depuis l\'API:', limitedCategories);
        setCategories(limitedCategories);
        setLoadingCategories(false);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        // En cas d'erreur, utiliser des catégories par défaut
        const defaultCategories = [
          {
            id: 1,
            nom: "Jus",
            description: "Jus de fruits",
            image: require('../assets/img/Avatar/icone_boutique/icon_boutique_jus.PNG'),
            link: '/boutique-jus.html'
          },
          {
            id: 2,
            nom: "Bière",
            description: "Boisson alcoolisée",
            image: require('../assets/img/Avatar/icone_boutique/icon_boutique_biere.PNG'),
            link: '/boutique-biere.html'
          },
          {
            id: 3,
            nom: "Eau",
            description: "Eau minérale",
            image: require('../assets/img/Avatar/icone_boutique/icon_boutique_eau.PNG'),
            link: '/achat.html'
          }
        ];
        setCategories(defaultCategories);
        setCategoryError('Impossible de charger les catégories. Affichage des catégories par défaut.');
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  // Fonction pour gérer les erreurs de chargement d'images
  const handleImageError = (e, categoryName) => {
    console.log(`Erreur de chargement d'image pour la catégorie: ${categoryName}`);
    // Remplacer par une image placeholder en cas d'erreur
    e.target.src = `https://via.placeholder.com/150x150/0056b3/ffffff?text=${encodeURIComponent(categoryName)}`;
  };

  return (
    <div className="home-container">
      {/* Bienvenue */}
      <section className="welcome">
        <h2>Bienvenue à Ocean's waters</h2>
        
        <p>Plus besoins de vous deplacer pour acheter votre eau. Commander en quelques clics et on vous livre directement chez vous.</p>

        <a href="#apropos" className="en-savoirplus">En savoir plus</a>

        <Link to="/boutique" className="commander-ici">Commander ici</Link>

        <p className="bieres-jus"> Vos pouvez aussi acheter vos jus et vos bieres preferés </p>

        <div className="bieres-jus-grid">
          {loadingCategories ? (
            <p>Chargement des catégories...</p>
          ) : categoryError ? (
            <p className="error-message">{categoryError}</p>
          ) : (
            categories.map(category => (
              <Link 
                to={category.link || '/shop'} 
                className="bieres-jus-item" 
                key={category.id}
              >
                <img 
                  src={category.image} 
                  alt={`boutique_${category.nom.toLowerCase()}`}
                  onError={(e) => handleImageError(e, category.nom)}
                  loading="lazy"
                />
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Featured Products */}
      <div className="custom-water-grid">
        {loadingProducts ? (
          <div className="loading">
            <p>Chargement des produits en vedette...</p>
          </div>
        ) : error ? (
          <div className="error-message" style={{ textAlign: 'center', width: '100%' }}>
            <p>{error}</p>
          </div>
        ) : (
          featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))
        )}

        <Link to="/achat.html" className="see-allproducts"><strong>Voir tous les produits</strong></Link>
      </div>

      {/* Information Frames */}
      <div className="cadre">
        <div className="image-cadre">
          <img src={require('../assets/img/Home/commande.WEBP')} alt="Commander de l'eau en ligne" />
        </div>
        <div className="text-cadre">
          <p>Avec Ocean's Water, il suffit de sortir votre téléphone et de commander depuis notre site web ou de simplement nous appeler. Profitez de la simplicité et de la rapidité de notre service, depuis le confort de votre maison.</p>
          <p>Tel: <span className="phone-number">+243 975 215 488 </span></p>
          <Link to="/achat.html" className="order-btn">Commander Maintenant</Link>
        </div>
      </div>

      <div className="cadre">
        <div className="image-cadre">
          <img src={require('../assets/img/Home/car delivery.WEBP')} alt="Camion de livraison Ocean's Water" />
        </div>
        <div className="text-cadre">
          <p>Nos camions de livraison, identifiés par notre logo, vous assurent une livraison rapide et fiable directement chez vous. Profitez d'une eau saine, livrée à votre porte.</p>
        </div>
      </div>

      <div className="cadre">
        <div className="image-cadre">
          <img src={require('../assets/img/Delivery/livreurpro1.WEBP')} alt="Livreur professionnel Ocean's Water" />
        </div>
        <div className="text-cadre">
          <p>Nos livreurs souriants vous garantissent une expérience de livraison agréable et chaleureuse. Parce que chez Ocean's Water, votre satisfaction est notre priorité.</p>
        </div>
      </div>

      {/* À propos de nous */}
      <section id="À propos de nous">
        <h2>À propos de nous</h2>
        <section className="about-us">
          <div className="container">
            {/* Premier box à gauche : Présentation de l'entreprise */}
            <div className="box">
              <h2>Qui sommes-nous ?</h2>
              <p>Notre entreprise se spécialise dans la distribution d'eau de qualité, avec une attention particulière pour la satisfaction des clients et le respect de l'environnement. Nous offrons un large éventail de services pour répondre aux besoins de tous nos clients.</p>
            </div>

            {/* Deuxième box à gauche : Pourquoi nous faire confiance */}
            <div className="box">
              <h2>Pourquoi nous faire confiance ?</h2>
              <p>Nous collaborons avec des marques de renom pour garantir l'authenticité de chaque produit. Grâce à notre expérience et notre engagement envers la qualité, nos clients bénéficient de produits fiables livrés rapidement.</p>
            </div>

            {/* Premier box à droite : Présentation de l'équipe avec images */}
            <div className="box">
              <h2>Notre Équipe</h2>
              <p>Notre équipe est composée de professionnels dévoués, travaillant jour après jour pour fournir un service exceptionnel. Nous avons une équipe de livraison rapide et efficace, ainsi que des experts en gestion de produits.</p>
              <div className="team-images">
                <img src={require('../assets/img/Delivery/livraison_avecfond 1.WEBP')} alt="Équipe de livraison Ocean's Water en action" className="team-img" />
                <img src={require('../assets/img/Delivery/livreurpro1.WEBP')} alt="Livreur professionnel souriant" className="team-img" />
                <img src={require('../assets/img/Delivery/livreurpro2.WEBP')} alt="Livreur Ocean's Water en service" className="team-img" />
              </div>
            </div>

            {/* Deuxième box à droite : Nos marques partenaires avec logos */}
            <div className="box">
              <h2>Les Marques disponible</h2>
              <div className="brand-logos">
                <img src={require('../assets/img/Logo-sansfond/Logo swissta.WEBP')} alt="Swissta" />
                <img src={require('../assets/img/Logo-sansfond/Logo evian.PNG')} alt="Evian" />
                <img src={require('../assets/img/Logo-sansfond/Logo spa.PNG')} alt="Spa" />
                <img src={require('../assets/img/Logo-sansfond/Abeer cooling.jpg')} alt="Abeer Cooling" />
              </div>
              {/* Nouvelle section pour plus de logos */}
              <div className="more-logos">
                <img src={require('../assets/img/Logo-sansfond/Canadian pure.PNG')} alt="Canadian pure" />
                <img src={require('../assets/img/Logo-sansfond/Logo eau vive.PNG')} alt="Eau vive" />
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* La section Contact a été supprimée */}
    </div>
  );
};

export default Home;
