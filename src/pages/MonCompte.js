import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MonCompte.css';

const MonCompte = () => {
  // Mock user data - in a real app, this would come from an API or context
  const user = {
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    phone: '+243 123 456 789',
    address: '123 Avenue Principale, Kinshasa',
    joinDate: '15/01/2025'
  };

  return (
    <div className="mon-compte-container">
      <h1>Mon Compte</h1>
      
      <div className="account-overview">
        <div className="user-info">
          <div className="avatar">
            {user.name.charAt(0)}
          </div>
          <div className="user-details">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p>Client depuis {user.joinDate}</p>
          </div>
        </div>
      </div>
      
      <div className="account-sections">
        <div className="account-section">
          <h3>Informations personnelles</h3>
          <div className="section-content">
            <p><strong>Nom:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Téléphone:</strong> {user.phone}</p>
            <Link to="/modifier-profil.html" className="edit-btn">
              Modifier
            </Link>
          </div>
        </div>
        
        <div className="account-section">
          <h3>Adresse de livraison</h3>
          <div className="section-content">
            <p>{user.address}</p>
            <Link to="/adresses.html" className="edit-btn">
              Gérer mes adresses
            </Link>
          </div>
        </div>
        
        <div className="account-section">
          <h3>Mes commandes</h3>
          <div className="section-content">
            <p>Consultez l'historique de vos commandes et leur statut</p>
            <Link to="/mes-commandes.html" className="view-btn">
              Voir mes commandes
            </Link>
          </div>
        </div>
        
        <div className="account-section">
          <h3>Notifications</h3>
          <div className="section-content">
            <p>Gérez vos préférences de notifications</p>
            <Link to="/notifications.html" className="view-btn">
              Paramètres de notifications
            </Link>
          </div>
        </div>
        
        <div className="account-section">
          <h3>Méthodes de paiement</h3>
          <div className="section-content">
            <p>Gérez vos méthodes de paiement</p>
            <Link to="/paiement.html" className="view-btn">
              Gérer mes paiements
            </Link>
          </div>
        </div>
      </div>
      
      <div className="account-actions">
        <Link to="/deconnexion.html" className="logout-btn">
          Se déconnecter
        </Link>
      </div>
    </div>
  );
};

export default MonCompte;
