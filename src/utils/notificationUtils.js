import orderIcon from '../assets/img/notifications/order-icon.svg';
import paymentIcon from '../assets/img/notifications/payment-icon.svg';
import promoIcon from '../assets/img/notifications/promo-icon.svg';

/**
 * Utilitaires pour la gestion des notifications
 */
const notificationUtils = {
  /**
   * Obtient l'icône correspondant au type de notification
   * @param {string} type - Type de notification
   * @returns {string} URL de l'icône
   */
  getIconForType: (type) => {
    // Types liés aux commandes
    if ([
      'commande_recue',
      'commande_confirmee',
      'commande_en_preparation',
      'commande_prete',
      'commande_en_livraison',
      'commande_livree',
      'commande_annulee'
    ].includes(type)) {
      return orderIcon;
    }
    
    // Types liés aux paiements
    if ([
      'paiement_recu',
      'paiement_refuse'
    ].includes(type)) {
      return paymentIcon;
    }
    
    // Types liés aux promotions
    if (type === 'promotion') {
      return promoIcon;
    }
    
    // Type inconnu, retourner une icône par défaut basée sur la première lettre du type
    const color = type ? 
      `#${Math.floor(((type.charCodeAt(0) * 1234567) % 0xffffff)).toString(16).padStart(6, '0')}` : 
      '#3498db';
    
    return `https://via.placeholder.com/50x50/${color.substring(1)}/FFFFFF?text=${type ? type.charAt(0).toUpperCase() : 'N'}`;
  },
  
  /**
   * Traduit le type de notification en texte lisible
   * @param {string} type - Type de notification
   * @returns {string} Texte traduit
   */
  getTypeLabel: (type) => {
    const typeLabels = {
      'commande_recue': 'Commande reçue',
      'commande_confirmee': 'Commande confirmée',
      'commande_en_preparation': 'En préparation',
      'commande_prete': 'Prête pour livraison',
      'commande_en_livraison': 'En livraison',
      'commande_livree': 'Commande livrée',
      'commande_annulee': 'Commande annulée',
      'paiement_recu': 'Paiement reçu',
      'paiement_refuse': 'Paiement refusé',
      'promotion': 'Promotion',
      'systeme': 'Système'
    };
    
    return typeLabels[type] || type;
  },
  
  /**
   * Formate une date relative (il y a X minutes, etc.)
   * @param {Date|string} date - Date à formater
   * @returns {string} Date relative formatée
   */
  formatTimeAgo: (date) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return 'À l\'instant';
    } else if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    } else if (diffInDays < 7) {
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    } else {
      return dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  }
};

export default notificationUtils;
