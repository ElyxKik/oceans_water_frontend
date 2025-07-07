import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MesCommandes.css';

const MesCommandes = () => {
  // Sample order data - in a real app, this would come from an API
  const orders = [
    {
      id: 'CMD-001',
      date: '2025-06-30',
      status: 'Livré',
      total: 45000,
      items: [
        { id: 'Evian-6x1.5L', name: 'Evian 1.5L (Pack de 6)', quantity: 2, price: 12000 },
        { id: 'Vittel-6x1.5L', name: 'Vittel 1.5L (Pack de 6)', quantity: 1, price: 5000 },
        { id: 'Primus-24x33cl', name: 'Primus 33cl (Caisse de 24)', quantity: 1, price: 20000 }
      ]
    },
    {
      id: 'CMD-002',
      date: '2025-07-02',
      status: 'En cours de livraison',
      total: 28000,
      items: [
        { id: 'Spa-24x33cl', name: 'Spa 50cl (Paquet de 24)', quantity: 1, price: 15000 },
        { id: 'Tropicana-Orange-1L', name: 'Jus d\'Orange Tropicana 1L', quantity: 2, price: 7000 }
      ]
    }
  ];

  return (
    <div className="mes-commandes-container">
      <h1>Mes Commandes</h1>
      
      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map(order => (
            <div className="order-card" key={order.id}>
              <div className="order-header">
                <div>
                  <h3>Commande #{order.id}</h3>
                  <p className="order-date">Date: {order.date}</p>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="order-items">
                <h4>Articles</h4>
                <ul>
                  {order.items.map(item => (
                    <li key={item.id}>
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                      <span className="item-price">{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FC</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="order-footer">
                <div className="order-total">
                  <p>Total: <span>{order.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FC</span></p>
                </div>
                <div className="order-actions">
                  <Link to={`/commande-details/${order.id}`} className="view-details-btn">
                    Voir les détails
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-orders">
          <p>Vous n'avez pas encore passé de commande.</p>
          <Link to="/shop" className="shop-now-btn">
            Commencer vos achats
          </Link>
        </div>
      )}
    </div>
  );
};

export default MesCommandes;
