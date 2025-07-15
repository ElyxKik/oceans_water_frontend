import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import notificationService from '../services/notificationService';
import '../styles/NotificationBadge.css';

/**
 * Composant pour afficher un badge avec le nombre de notifications non lues
 */
const NotificationBadge = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Récupérer le nombre de notifications non lues
  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const count = await notificationService.getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('Erreur lors de la récupération du nombre de notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnreadCount();

    // Rafraîchir le compteur toutes les minutes
    const intervalId = setInterval(fetchUnreadCount, 60000);

    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  if (!isAuthenticated || loading || unreadCount === 0) {
    return (
      <Link to="/notifications" className="notification-icon-link">
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          className="notification-icon"
        >
          <path 
            d="M12,22 C13.1,22 14,21.1 14,20 L10,20 C10,21.1 10.9,22 12,22 Z M18,16 L18,11 C18,7.93 16.36,5.36 13.5,4.68 L13.5,4 C13.5,3.17 12.83,2.5 12,2.5 C11.17,2.5 10.5,3.17 10.5,4 L10.5,4.68 C7.63,5.36 6,7.92 6,11 L6,16 L4,18 L4,19 L20,19 L20,18 L18,16 Z" 
            fill="#3498db" 
          />
        </svg>
      </Link>
    );
  }

  return (
    <Link to="/notifications" className="notification-icon-link">
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        className="notification-icon"
      >
        <path 
          d="M12,22 C13.1,22 14,21.1 14,20 L10,20 C10,21.1 10.9,22 12,22 Z M18,16 L18,11 C18,7.93 16.36,5.36 13.5,4.68 L13.5,4 C13.5,3.17 12.83,2.5 12,2.5 C11.17,2.5 10.5,3.17 10.5,4 L10.5,4.68 C7.63,5.36 6,7.92 6,11 L6,16 L4,18 L4,19 L20,19 L20,18 L18,16 Z" 
          fill="#3498db" 
        />
      </svg>
      {unreadCount > 0 && (
        <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
      )}
    </Link>
  );
};

export default NotificationBadge;
