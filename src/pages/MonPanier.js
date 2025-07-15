import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import '../styles/MonPanier.css';

const MonPanier = () => {
  const { 
    cart, 
    total, 
    deliveryFee, 
    removeFromCart, 
    updateQuantity, 
    formatNumber, 
    CartErrors, 
    loading 
  } = useContext(CartContext);
  
  const subtotal = cart.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
  const shipping = subtotal >= 58000 ? 0 : deliveryFee;

  return (
    <div className="panier-container page-container">
      <h1>Mon Panier</h1>
      
      {/* Afficher les erreurs du panier s'il y en a */}
      <CartErrors />
      
      {loading ? (
        <div className="loading-container">
          <p>Chargement de votre panier...</p>
        </div>
      ) : cart.length === 0 ? (
        <div className="panier-vide">
          <p>Votre panier est vide.</p>
          <Link to="/achat.html" className="continuer-achats">Continuer vos achats</Link>
        </div>
      ) : (
        <>
          <div className="panier-items">
            {cart.map((item, index) => {
              // Normaliser les données du produit pour éviter les valeurs undefined
              const productId = (item.id ?? item.produit?.id ?? index) + '-' + index;
              const productName = item.titre ?? item.nom ?? item.produit?.nom ?? 'Produit';
              let productImage = item.image ?? item.produit?.image;
              if (!productImage || productImage.includes('undefined')) {
                productImage = `https://via.placeholder.com/80x80?text=${encodeURIComponent(productName)}`;
              }
              // Prix utilisé directement via item.prix dans l'affichage
              console.log('Article dans MonPanier:', item);
              return (
              <div className="panier-item" key={productId}>
                <div className="item-info">
                  <div className="item-thumbnail">
                    <img 
                      src={productImage}
                      alt={productName}
                      onError={(e) => { e.target.src = `https://via.placeholder.com/80x80?text=${encodeURIComponent(productName)}`; }}
                    />
                  </div>
                  <div className="item-details">
                    <h3>{productName}</h3>
                    <p>{typeof item.marque === 'object' ? (item.marque?.nom || '') : (item.marque || '')}</p>
                  </div>
                </div>
                <div className="item-controls">
                  <p className="item-price">{formatNumber(item.prix)} FC</p>
                  <div className="item-quantity">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantite - 1))}
                      className="quantity-btn"
                      disabled={item.quantite <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantite}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantite + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            );
          })}
          </div>
          
          <div className="panier-summary">
            <div className="summary-line">
              <span>Sous-total:</span>
              <span>{formatNumber(subtotal)} FC</span>
            </div>
            <div className="summary-line">
              <span>Frais de livraison:</span>
              <span>{shipping === 0 ? 'Gratuit' : `${formatNumber(shipping)} FC`}</span>
            </div>
            <div className="summary-line total">
              <span>Total:</span>
              <span>{formatNumber(total)} FC</span>
            </div>
            
            <div className="panier-actions">
              <Link to="/achat.html" className="continuer-achats">Continuer vos achats</Link>
              <Link to="/paiement.html" className="checkout-btn">Passer à la Caisse</Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MonPanier;
