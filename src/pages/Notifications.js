import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Notifications.css';

const Notifications = () => {
  // Mock notification settings - in a real app, this would come from an API
  const [settings, setSettings] = useState({
    email: {
      promotions: true,
      orderUpdates: true,
      deliveryAlerts: true,
      newsletter: false
    },
    sms: {
      promotions: false,
      orderUpdates: true,
      deliveryAlerts: true
    }
  });

  // Mock notifications - in a real app, this would come from an API
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'Commande livrée',
      message: 'Votre commande #CMD-001 a été livrée avec succès.',
      date: '2025-07-03T14:30:00',
      read: true
    },
    {
      id: 2,
      type: 'promo',
      title: 'Promotion spéciale weekend',
      message: 'Profitez de 15% de réduction sur toutes les eaux minérales ce weekend!',
      date: '2025-07-02T09:15:00',
      read: false
    },
    {
      id: 3,
      type: 'system',
      title: 'Mise à jour de votre profil',
      message: 'Votre profil a été mis à jour avec succès.',
      date: '2025-07-01T16:45:00',
      read: true
    }
  ]);

  const handleToggleSetting = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleMarkAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleDeleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="notifications-container">
      <h1>Notifications</h1>
      
      <div className="notifications-tabs">
        <button className="tab active">Notifications ({notifications.length})</button>
        <button className="tab">Paramètres</button>
      </div>
      
      <div className="notifications-content">
        <div className="notifications-list">
          <div className="notifications-header">
            <h2>Vos notifications {unreadCount > 0 && <span className="unread-badge">{unreadCount} non lues</span>}</h2>
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={handleMarkAllAsRead}>
                Tout marquer comme lu
              </button>
            )}
          </div>
          
          {notifications.length > 0 ? (
            <div className="notifications-items">
              {notifications.map(notification => (
                <div 
                  className={`notification-item ${!notification.read ? 'unread' : ''}`} 
                  key={notification.id}
                >
                  <div className={`notification-icon ${notification.type}`}></div>
                  <div className="notification-content">
                    <h3>{notification.title}</h3>
                    <p>{notification.message}</p>
                    <span className="notification-date">{formatDate(notification.date)}</span>
                  </div>
                  <div className="notification-actions">
                    {!notification.read && (
                      <button 
                        className="read-btn"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Marquer comme lu
                      </button>
                    )}
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteNotification(notification.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-notifications">
              <p>Vous n'avez aucune notification pour le moment.</p>
            </div>
          )}
        </div>
        
        <div className="notification-settings" style={{ display: 'none' }}>
          <h2>Paramètres de notifications</h2>
          
          <div className="settings-section">
            <h3>Notifications par email</h3>
            
            <div className="setting-item">
              <div className="setting-info">
                <h4>Promotions et offres spéciales</h4>
                <p>Recevez des emails sur nos dernières promotions et offres</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.email.promotions} 
                  onChange={() => handleToggleSetting('email', 'promotions')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h4>Mises à jour de commandes</h4>
                <p>Recevez des emails sur l'état de vos commandes</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.email.orderUpdates} 
                  onChange={() => handleToggleSetting('email', 'orderUpdates')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h4>Alertes de livraison</h4>
                <p>Recevez des emails concernant la livraison de vos commandes</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.email.deliveryAlerts} 
                  onChange={() => handleToggleSetting('email', 'deliveryAlerts')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h4>Newsletter</h4>
                <p>Recevez notre newsletter mensuelle</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.email.newsletter} 
                  onChange={() => handleToggleSetting('email', 'newsletter')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div className="settings-section">
            <h3>Notifications par SMS</h3>
            
            <div className="setting-item">
              <div className="setting-info">
                <h4>Promotions et offres spéciales</h4>
                <p>Recevez des SMS sur nos dernières promotions et offres</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.sms.promotions} 
                  onChange={() => handleToggleSetting('sms', 'promotions')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h4>Mises à jour de commandes</h4>
                <p>Recevez des SMS sur l'état de vos commandes</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.sms.orderUpdates} 
                  onChange={() => handleToggleSetting('sms', 'orderUpdates')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h4>Alertes de livraison</h4>
                <p>Recevez des SMS concernant la livraison de vos commandes</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.sms.deliveryAlerts} 
                  onChange={() => handleToggleSetting('sms', 'deliveryAlerts')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          
          <div className="settings-actions">
            <button className="save-settings-btn">
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
      
      <div className="back-link">
        <Link to="/mon-compte.html">Retour à mon compte</Link>
      </div>
    </div>
  );
};

export default Notifications;
