import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/ConfirmationCommande.css';

const ConfirmationCommande = () => {
  const { currentUser, isAuthenticated } = useAuth();
  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <h1>Commande Confirmée!</h1>
        <p className="confirmation-message">
          Votre commande a été traitée avec succès. Merci pour votre achat!
        </p>
        <div className="order-info">
          <p>Un email de confirmation a été envoyé à votre adresse email.</p>
          <p>Vous pouvez suivre l'état de votre commande dans votre espace client.</p>
        </div>
        <div className="confirmation-actions">
          <Link to="/boutique" className="action-button primary">
            Continuer mes achats
          </Link>
          {isAuthenticated ? (
            <Link to="/mes-commandes.html" className="action-button secondary">
              Voir mes commandes
            </Link>
          ) : (
            <Link to="/connexion" className="action-button secondary">
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationCommande;
