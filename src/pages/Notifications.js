import React, { useState, useEffect } from 'react';
import '../styles/Notifications.css';
import notificationService from '../services/notificationService';
import notificationUtils from '../utils/notificationUtils';
import { useAuth } from '../contexts/AuthContext';

const Notifications = () => {
  const { isAuthenticated, user } = useAuth();
  
  // États pour gérer les notifications et le filtrage
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effet pour charger les notifications depuis l'API
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      setError(null); // Réinitialiser les erreurs précédentes
      
      notificationService.getUserNotifications()
        .then(data => {
          console.log('Données reçues du service:', data);
          
          // Vérifier si les données sont paginatées (format Django REST Framework)
          let notificationsData = data;
          if (data && data.results && Array.isArray(data.results)) {
            console.log('Données paginatées détectées');
            notificationsData = data.results;
          }
          
          // Vérification que notificationsData est bien un tableau
          if (!Array.isArray(notificationsData)) {
            console.error('Format de données incorrect:', notificationsData);
            throw new Error('Format de données incorrect');
          }
          
          // Transformer les données de l'API pour correspondre à la structure attendue
          const formattedNotifications = notificationsData.map(notif => ({
            id: notif.id,
            type: notif.type,
            type_display: notif.type_display || notif.type,
            icon: notificationUtils.getIconForType(notif.type),
            title: notif.titre,
            message: notif.message,
            date: new Date(notif.date_creation),
            date_relative: notif.date_relative || 'Date inconnue',
            read: Boolean(notif.lue),
            highlight: Boolean(notif.importante)
          }));
          
          console.log('Notifications formatées:', formattedNotifications);
          setNotifications(formattedNotifications);
          setLoading(false);
        })
        .catch(err => {
          console.error('Erreur détaillée lors du chargement des notifications:', err);
          setError('Impossible de charger vos notifications. Veuillez réessayer plus tard.');
          setLoading(false);
        });
    }
  }, [isAuthenticated]);
  

  
  // Effet pour filtrer les notifications en fonction du filtre actif
  useEffect(() => {
    switch(activeFilter) {
      case 'unread':
        setFilteredNotifications(notifications.filter(notif => !notif.read));
        break;
      case 'read':
        setFilteredNotifications(notifications.filter(notif => notif.read));
        break;
      default:
        setFilteredNotifications(notifications);
    }
  }, [activeFilter, notifications]);

  // Fonction pour marquer une notification comme lue
  const handleMarkAsRead = (id) => {
    notificationService.markAsRead(id)
      .then(() => {
        setNotifications(notifications.map(notification => 
          notification.id === id ? { ...notification, read: true, highlight: false } : notification
        ));
      })
      .catch(err => {
        console.error('Erreur lors du marquage de la notification comme lue:', err);
        setError('Impossible de marquer la notification comme lue. Veuillez réessayer.');
      });
  };

  // Fonction pour supprimer une notification
  const handleDeleteNotification = (id) => {
    notificationService.deleteNotification(id)
      .then(() => {
        setNotifications(notifications.filter(notification => notification.id !== id));
      })
      .catch(err => {
        console.error('Erreur lors de la suppression de la notification:', err);
        setError('Impossible de supprimer la notification. Veuillez réessayer.');
      });
  };



  // Fonction pour afficher l'icône de notification
  const renderNotificationIcon = (notification) => {
    const fallbackIcon = `https://via.placeholder.com/50x50/3498db/FFFFFF?text=${notification.type.charAt(0).toUpperCase()}`;
    
    return (
      <img 
        src={notification.icon || fallbackIcon} 
        alt={notification.type_display || notification.type} 
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackIcon;
        }}
      />
    );
  };

  // Fonction pour marquer toutes les notifications comme lues
  const handleMarkAllAsRead = () => {
    if (notifications.filter(n => !n.read).length === 0) return;
    
    notificationService.markAllAsRead()
      .then(() => {
        setNotifications(notifications.map(notification => ({
          ...notification,
          read: true,
          highlight: false
        })));
      })
      .catch(err => {
        console.error('Erreur lors du marquage de toutes les notifications comme lues:', err);
        setError('Impossible de marquer toutes les notifications comme lues. Veuillez réessayer.');
      });
  };

  // Si l'utilisateur n'est pas connecté, afficher un message
  if (!isAuthenticated) {
    return (
      <div className="notifications-container">
        <h1>Notifications</h1>
        <div className="empty-notifications">
          Veuillez vous connecter pour voir vos notifications.
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <h1>Notifications</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* Section de filtrage */}
      <div className="filter-section">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          Tout ({notifications.length})
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'unread' ? 'active' : ''}`}
          onClick={() => setActiveFilter('unread')}
        >
          Non lus ({notifications.filter(n => !n.read).length})
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'read' ? 'active' : ''}`}
          onClick={() => setActiveFilter('read')}
        >
          Lus ({notifications.filter(n => n.read).length})
        </button>
        
        {notifications.filter(n => !n.read).length > 0 && (
          <button 
            className="mark-all-read-btn"
            onClick={handleMarkAllAsRead}
          >
            Tout marquer comme lu
          </button>
        )}
      </div>
      
      {/* Liste des notifications */}
      <div className="notification-list">
        {loading ? (
          <div className="loading-spinner">Chargement des notifications...</div>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-card ${notification.read ? 'read' : 'unread'} ${notification.highlight ? 'highlight' : ''}`}
            >
              <div className="notification-icon">
                {renderNotificationIcon(notification)}
              </div>
              
              <div className="notification-content">
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
                <span className="notification-time">{notification.date_relative || notificationUtils.formatTimeAgo(notification.date)}</span>
              </div>
              
              <div className="notification-actions">
                <button 
                  className={`mark-read-btn ${notification.read ? 'disabled' : ''}`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  disabled={notification.read}
                >
                  {notification.read ? 'Lu' : 'Marquer comme lu'}
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteNotification(notification.id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-notifications">
            Vous n'avez pas de notifications {activeFilter === 'unread' ? 'non lues' : activeFilter === 'read' ? 'lues' : ''}.
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
