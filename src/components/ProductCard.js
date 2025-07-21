import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import '../styles/ProductCard.css';

/**
 * Composant ProductCard unifié et réutilisable
 * Utilisé dans toutes les pages qui affichent des produits
 * Respecte exactement le CSS original de Ocean's Water
 */
const ProductCard = ({ product, onAddToCart }) => {
  const { addToCart } = useContext(CartContext);
  
  // Gestion des différentes structures de données possibles pour les produits
  const productId = product.id;
  const productTitle = product.titre || product.nom || '';
  const productDescription = product.description || product.unite || '';
  
  // Gestion des différentes structures possibles pour la marque (objet ou chaîne)
  const productBrand = typeof product.marque === 'object' ? 
    product.marque?.nom || 'Marque' : 
    product.marque || 'Marque';
  
  // Format price with thousands separator
  const formattedPrice = typeof product.prix === 'number' ? 
    product.prix.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") :
    parseFloat(product.prix).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  // Vérifier si le produit a du stock disponible
  // Le stock peut être dans product.stock ou dans product.produit.stock
  const stockDisponible = product.stock !== undefined ? product.stock : 
                        (product.produit && product.produit.stock !== undefined ? product.produit.stock : 0);
  
  // Déterminer la classe CSS pour l'indicateur de stock
  const getStockClass = () => {
    if (stockDisponible <= 0) return 'stock-none';
    if (stockDisponible < 3) return 'stock-low';
    return 'stock-available';
  };
  
  // Message à afficher pour le stock
  const getStockMessage = () => {
    if (stockDisponible <= 0) return 'Rupture de stock';
    if (stockDisponible < 3) return `Plus que ${stockDisponible} en stock`;
    return `${stockDisponible} en stock`;
  };

  // Gestion de l'ajout au panier
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Empêcher la propagation vers le lien parent
    // Use the provided onAddToCart function if available, otherwise use the context function
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product);
    }
  };

  // Gestion des images avec fallback
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return `https://via.placeholder.com/200x250/${getColorForBrand(productBrand)}/ffffff?text=${encodeURIComponent(productTitle)}`;
    }
    
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    try {
      return require(`../assets/${imageUrl}`);
    } catch (e) {
      return `https://via.placeholder.com/200x250/${getColorForBrand(productBrand)}/ffffff?text=${encodeURIComponent(productTitle)}`;
    }
  };
  
  // Fonction pour obtenir une couleur cohérente selon la marque
  const getColorForBrand = (brand) => {
    const brandColors = {
      'Evian': '91CDF2',
      'Spa': '4CAF50',
      'Swissta': '0056b3',
      'Eden': '9C27B0',
      'Canadian Pure': 'FF5722',
      'Abeer Cooling': 'FFC107',
      'Eau Vive': '009688'
    };
    
    return brandColors[brand] || '87CEEB';
  };

  return (
    <Link to={`/produit/${productId}`} className="product-link">
      <div className="water-item">
        <img 
          src={getImageUrl(product.image)} 
          alt={`${productBrand}-${productTitle}`} 
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/200x250/${getColorForBrand(productBrand)}/ffffff?text=${encodeURIComponent(productTitle)}`;
          }}
        />
        <div className="product-overlay">
          <div>
            <h3 className="inisible-text">{productTitle}</h3>
            <p className="inisible-text">{productDescription}</p>
          </div>
          <div className={`stock-indicator ${getStockClass()}`}>
            {getStockMessage()}
          </div>
          <div className="action-row">
            {stockDisponible > 0 ? (
              <a 
                href="#" 
                className="buy-now-btn" 
                data-id={`${productBrand}-${productId}`}
                data-marque={productBrand}
                data-title={`${productTitle} ${productDescription}`}
                data-price={product.prix}
                onClick={handleAddToCart}
              >
                Acheter
              </a>
            ) : (
              <span className="out-of-stock-btn">Stock épuisé</span>
            )}
            <span className="prix-plus">{formattedPrice} FC</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
