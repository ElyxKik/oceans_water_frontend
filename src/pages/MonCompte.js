import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import orderService from '../services/orderService';
import '../styles/MonCompte.css';

const MonCompte = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadUserOrders();
    }
  }, [isAuthenticated]);

  const loadUserOrders = async () => {
    try {
      setLoading(true);
      setError(''); // Réinitialiser l'erreur
      const result = await orderService.getUserOrders();
      if (result.success) {
        // Prendre seulement les 3 dernières commandes pour l'affichage
        const ordersList = Array.isArray(result.orders) ? result.orders : [];
        setOrders(ordersList.slice(0, 3));
      } else {
        // Si l'erreur indique qu'il n'y a pas de commandes, ne pas afficher d'erreur
        if (result.error.includes('404') || result.error.includes('non trouvé')) {
          setOrders([]);
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      console.error('Erreur lors du chargement des commandes:', err);
      setError('Impossible de charger les commandes pour le moment');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated) {
    return (
      <div className="account-page">
        <div className="error">
          Vous devez être connecté pour accéder à cette page.
          <Link to="/connexion.html"> Se connecter</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      {/* Section Profil Utilisateur */}
      <div className="user-profile">
        <h2>Mon Compte</h2>
        <img 
          src={require('../assets/img/Avatar/avatar.png')} 
          alt="Photo de profil" 
          className="avatar"
          onError={(e) => {
            // Fallback si l'image n'existe pas
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div 
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#007bff',
            color: 'white',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: '0 auto 15px'
          }}
        >
          {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
        </div>
        <p><strong>Nom :</strong> {user?.first_name} {user?.last_name}</p>
        <p><strong>Email :</strong> {user?.email}</p>
        {user?.phone && <p><strong>Téléphone :</strong> {user.phone}</p>}
        <Link to="/modifier-profil.html" className="btn">Modifier le Profil</Link>
      </div>

      {/* Menu Utilisateur */}
      <div className="account-menu">
        <ul>
          <li><Link to="/mes-commandes.html">Mes Commandes</Link></li>
          <li><Link to="/adresses.html">Mes Adresses</Link></li>
          <li><Link to="/notifications.html">Notifications</Link></li>
          <li><button onClick={handleLogout} className="logout-btn">Déconnexion</button></li>
        </ul>
      </div>

      {/* Résumé des Commandes */}
      <div className="order-summary">
        <h3>Dernières Commandes</h3>
        {loading ? (
          <div className="loading">Chargement des commandes...</div>
        ) : error ? (
          <div className="error">
            {error}
            <br />
            <button 
              onClick={loadUserOrders} 
              style={{
                marginTop: '10px',
                padding: '5px 10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Réessayer
            </button>
          </div>
        ) : orders.length > 0 ? (
          <ul>
            {orders.map((order, index) => (
              <li key={order.id || index}>
                Commande #{order.numero_commande || order.id || `CMD${index + 1}`} - {orderService.formatOrderStatus(order.statut || 'en_attente')}
                {order.date_commande && (
                  <span style={{ float: 'right', fontSize: '14px', color: '#666' }}>
                    {orderService.formatDate(order.date_commande)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-orders">
            Vous n'avez pas encore passé de commande.
            <br />
            <Link to="/boutique" style={{ color: '#007bff', textDecoration: 'underline' }}>
              Découvrir nos produits
            </Link>
          </div>
        )}
        <Link to="/Mon-panier.html" className="btn">Voir Mon Panier</Link>
      </div>

      {/* Support Client */}
      <div className="support">
        <h3>Besoin d'aide ?</h3>
        <p>Accédez à notre centre de support client pour toute question ou problème.</p>
        <Link to="/support.html" className="btn">Support Client</Link>
      </div>
    </div>
  );
};

export default MonCompte;
