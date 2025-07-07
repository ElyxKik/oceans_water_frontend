import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import '../styles/ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const { addToCart, formatNumber } = useContext(CartContext);
  
  const handleAddToCart = () => {
    // Use the provided onAddToCart function if available, otherwise use the context function
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product);
    }
  };

  // Format price with thousands separator if formatNumber is available
  const formattedPrice = formatNumber ? formatNumber(product.prix) : 
    product.prix.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return (
    <div className="water-item">
      <img 
        src={product.image.startsWith('http') ? product.image : 
          (() => {
            try {
              return require(`../assets/${product.image}`);
            } catch (e) {
              // Fallback to placeholder if image not found
              return `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.titre || product.id)}`;
            }
          })()
        } 
        alt={product.titre || product.id} 
      />
      <div className="water-info">
        <h3 className="inisible-text">{product.titre}</h3>
        <p className="inisible-text">{product.description}</p>
        <p className="prix">{formattedPrice} FC</p>
        <a 
          href="#" 
          className="buy-now-btn" 
          onClick={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
          data-id={product.id}
          data-marque={product.marque}
          data-title={product.titre}
          data-price={product.prix}
        >
          Acheter
        </a>
        <span className="prix-plus">{formattedPrice} FC</span>
      </div>
    </div>
  );
};

export default ProductCard;
