import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import '../styles/MonPanier.css';

const MonPanier = () => {
  const { cart, total, deliveryFee, removeFromCart, updateQuantity, formatNumber } = useContext(CartContext);
  
  const subtotal = cart.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
  const shipping = subtotal >= 58000 ? 0 : deliveryFee;

  return (
    <div className="panier-container page-container">
      <h1>Mon Panier</h1>
      
      {cart.length === 0 ? (
        <div className="panier-vide">
          <p>Votre panier est vide.</p>
          <Link to="/achat.html" className="continuer-achats">Continuer vos achats</Link>
        </div>
      ) : (
        <>
          <div className="panier-items">
            {cart.map(item => (
              <div className="panier-item" key={item.id}>
                <div className="item-details">
                  <h3>{item.titre}</h3>
                  <p>{item.marque}</p>
                  <p className="item-price">{formatNumber(item.prix)} FC</p>
                </div>
                <div className="item-quantity">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantite - 1)}
                    className="quantity-btn"
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
                <div className="item-total">
                  <p>{formatNumber(item.prix * item.quantite)} FC</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
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
              <Link to="/paiement.html" className="checkout-btn">Procéder au paiement</Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MonPanier;
