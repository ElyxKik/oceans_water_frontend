import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import orderService from '../services/orderService';
import '../styles/MesCommandes.css';
import { FaSearch, FaFileInvoice, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';

const MesCommandes = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // La redirection est maintenant gérée par le composant ProtectedRoute
  // Nous n'avons plus besoin de rediriger manuellement ici
  useEffect(() => {
    console.log('MesCommandes: État d\'authentification =', isAuthenticated ? 'connecté' : 'non connecté');
  }, [isAuthenticated]);

  // Charger les commandes de l'utilisateur
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Chargement des commandes pour l\'utilisateur authentifié');
        const result = await orderService.getUserOrders();
        console.log('Résultat de la requête:', result);
        
        if (result.success) {
          if (Array.isArray(result.orders) && result.orders.length > 0) {
            console.log('Commandes trouvées:', result.orders.length);
            setOrders(result.orders);
          } else {
            console.log('Aucune commande trouvée ou format incorrect');
            setOrders([]);
          }
        } else {
          console.error('Erreur API:', result.error);
          setError(result.error || 'Erreur lors du chargement des commandes');
        }
      } catch (err) {
        console.error('Erreur lors du chargement des commandes:', err);
        setError('Impossible de charger vos commandes pour le moment');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadOrders();
    } else {
      console.log('Utilisateur non authentifié, redirection vers la page de connexion');
      setOrders([]);
    }
  }, [isAuthenticated]);

  // Filtrer les commandes en fonction des filtres
  const filteredOrders = orders.filter(order => {
    // Filtre par numéro de commande
    const matchesSearch = searchTerm === '' || 
      (order.numero_commande && order.numero_commande.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtre par statut
    const matchesStatus = statusFilter === 'all' || order.statut === statusFilter;
    
    // Filtre par date
    const matchesDate = dateFilter === '' || 
      (order.date_commande && order.date_commande.substring(0, 10) === dateFilter);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Gérer la recherche
  const handleSearch = (e) => {
    e.preventDefault();
    // La recherche est déjà gérée par le state searchTerm
  };

  return (
    <div className="orders-container">
      <h1>Mes Commandes</h1>
      
      {/* Barre de recherche */}
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Rechercher par numéro de commande" 
          id="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>
          <FaSearch style={{ marginRight: '5px' }} /> Rechercher
        </button>
      </div>

      {/* Filtres */}
      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="status-filter">Filtrer par statut :</label>
          <select 
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Toutes les commandes</option>
            <option value="en_attente">En attente</option>
            <option value="confirmee">Confirmée</option>
            <option value="en_preparation">En préparation</option>
            <option value="prete_livraison">Prête pour livraison</option>
            <option value="en_livraison">En livraison</option>
            <option value="livree">Livrée</option>
            <option value="annulee">Annulée</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="date-filter">Filtrer par date :</label>
          <input 
            type="date" 
            id="date-filter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        
        {(statusFilter !== 'all' || dateFilter || searchTerm) && (
          <button 
            className="reset-filters-btn"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setDateFilter('');
            }}
          >
            <FaTimes style={{ marginRight: '5px' }} /> Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Affichage des commandes */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement de vos commandes...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <div className="error-icon">
            <FaTimes size={40} color="#e74c3c" />
          </div>
          <p className="error-message">{error}</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      ) : filteredOrders.length > 0 ? (
        filteredOrders.map(order => (
          <div className="order-card" key={order.id}>
            <div className="order-header">
              <span className="order-id">Commande #{order.numero_commande || order.id}</span>
              <span className="order-date">Passée le {orderService.formatDate(order.date_commande)}</span>
              <span className={`order-status ${order.statut}`}>
                {orderService.formatOrderStatus(order.statut)}
              </span>
            </div>
            <div className="order-details">
              <h3 className="order-section-title">Articles commandés</h3>
              <ul className="order-items">
                {order.articles && order.articles.length > 0 ? (
                  order.articles.map((article, index) => (
                    <li key={index}>
                      <div className="article-info">
                        <div className="article-image">
                          {article.produit && article.produit.image ? (
                            <img 
                              src={article.produit.image.startsWith('http') ? article.produit.image : `https://via.placeholder.com/100x100?text=${encodeURIComponent(article.produit.nom || 'Produit')}`} 
                              alt={article.produit.nom || 'Produit'} 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://via.placeholder.com/100x100?text=${encodeURIComponent(article.produit.nom || 'Produit')}`;
                              }}
                            />
                          ) : (
                            <div className="placeholder-image"></div>
                          )}
                        </div>
                        <div className="article-details">
                          <h4>
                            {article.produit && article.produit.nom ? article.produit.nom : 'Produit'} 
                            {article.produit && article.produit.marque && `(${article.produit.marque})`}
                          </h4>
                          <div className="article-meta">
                            <span>Quantité: <strong>{article.quantite || 1}</strong></span>
                            <span>Prix unitaire: <strong>
                              {article.prix_unitaire ? article.prix_unitaire.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : '0'} FC
                            </strong></span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="no-articles"><em>Détails des articles non disponibles</em></li>
                )}
              </ul>
              <div className="order-summary">
                <div className="summary-item total">
                  <strong>Total de la commande:</strong> 
                  <span className="price">
                    {order.total_commande ? order.total_commande.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : order.total ? order.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : '0'} FC
                  </span>
                </div>
                {order.adresse_livraison && (
                  <div className="summary-item address">
                    <FaMapMarkerAlt style={{ marginRight: '5px', color: '#3498db' }} />
                    <span>{order.adresse_livraison}</span>
                  </div>
                )}
              </div>
              <div className="order-actions">
                {order.statut !== 'livree' && order.statut !== 'annulee' && (
                  <button className="track-btn">
                    <FaMapMarkerAlt style={{ marginRight: '5px' }} /> Suivre la commande
                  </button>
                )}
                {order.statut === 'en_attente' && (
                  <button className="cancel-btn">
                    <FaTimes style={{ marginRight: '5px' }} /> Annuler la commande
                  </button>
                )}
                <button className="invoice-btn">
                  <FaFileInvoice style={{ marginRight: '5px' }} /> Télécharger la facture
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="no-orders">
          <div className="no-orders-icon">
            <img src="/assets/images/empty-orders.svg" alt="Aucune commande" 
                 onError={(e) => {
                   e.target.onerror = null;
                   e.target.style.display = 'none';
                 }} />
          </div>
          <h3>Aucune commande ne correspond à vos critères de recherche</h3>
          <p>Vous n'avez pas encore passé de commande ou aucune commande ne correspond à vos filtres actuels.</p>
          {searchTerm || statusFilter !== 'all' || dateFilter ? (
            <button 
              className="reset-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('');
              }}
            >
              <FaTimes style={{ marginRight: '5px' }} /> Réinitialiser les filtres
            </button>
          ) : (
            <Link to="/boutique" className="shop-now-btn">
              Découvrir nos produits
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default MesCommandes;
