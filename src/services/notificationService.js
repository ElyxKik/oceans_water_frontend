import { fetchApi } from './api.js';

/**
 * Service pour gérer les notifications utilisateur
 */
const notificationService = {
  /**
   * Récupère toutes les notifications de l'utilisateur connecté
   * @returns {Promise} Liste des notifications
   */
  getUserNotifications: async () => {
    try {
      console.log('Tentative de récupération des notifications...');
      const token = localStorage.getItem('authToken');
      console.log('Token présent:', !!token);
      
      const result = await fetchApi('api/v1/notifications/');
      console.log('Résultat de la requête notifications:', result);
      return result;
    } catch (error) {
      console.error('Erreur détaillée lors de la récupération des notifications:', error);
      throw error;
    }
  },

  /**
   * Récupère uniquement les notifications non lues
   * @returns {Promise} Liste des notifications non lues
   */
  getUnreadNotifications: async () => {
    try {
      return await fetchApi('api/v1/notifications/non_lues/');
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications non lues:', error);
      throw error;
    }
  },

  /**
   * Récupère les notifications importantes
   * @returns {Promise} Liste des notifications importantes
   */
  getImportantNotifications: async () => {
    try {
      return await fetchApi('api/v1/notifications/importantes/');
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications importantes:', error);
      throw error;
    }
  },

  /**
   * Récupère les notifications par type
   * @param {string} type - Type de notification
   * @returns {Promise} Liste des notifications du type spécifié
   */
  getNotificationsByType: async (type) => {
    try {
      return await fetchApi(`api/v1/notifications/par_type/?type=${type}`);
    } catch (error) {
      console.error(`Erreur lors de la récupération des notifications de type ${type}:`, error);
      throw error;
    }
  },

  /**
   * Marque une notification comme lue
   * @param {number} id - ID de la notification
   * @returns {Promise} Notification mise à jour
   */
  markAsRead: async (id) => {
    try {
      return await fetchApi(`api/v1/notifications/${id}/marquer_comme_lue/`, {
        method: 'POST'
      });
    } catch (error) {
      console.error(`Erreur lors du marquage de la notification ${id} comme lue:`, error);
      throw error;
    }
  },

  /**
   * Marque une notification comme non lue
   * @param {number} id - ID de la notification
   * @returns {Promise} Notification mise à jour
   */
  markAsUnread: async (id) => {
    try {
      return await fetchApi(`api/v1/notifications/${id}/marquer_comme_non_lue/`, {
        method: 'POST'
      });
    } catch (error) {
      console.error(`Erreur lors du marquage de la notification ${id} comme non lue:`, error);
      throw error;
    }
  },

  /**
   * Marque toutes les notifications comme lues
   * @returns {Promise} Résultat de l'opération
   */
  markAllAsRead: async () => {
    try {
      return await fetchApi('api/v1/notifications/tout_marquer_comme_lu/', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
      throw error;
    }
  },

  /**
   * Supprime une notification (soft delete)
   * @param {number} id - ID de la notification
   * @returns {Promise} Résultat de l'opération
   */
  deleteNotification: async (id) => {
    try {
      return await fetchApi(`api/v1/notifications/${id}/`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error(`Erreur lors de la suppression de la notification ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtient le nombre de notifications non lues
   * @returns {Promise<number>} Nombre de notifications non lues
   */
  getUnreadCount: async () => {
    try {
      // Récupérer simplement les notifications non lues et compter leur nombre
      const notifications = await fetchApi('api/v1/notifications/non_lues/');
      // Vérifier si les données sont paginatées (format Django REST Framework)
      if (notifications && notifications.results && Array.isArray(notifications.results)) {
        return notifications.results.length;
      }
      // Sinon, vérifier si c'est un tableau simple
      return Array.isArray(notifications) ? notifications.length : 0;
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de notifications non lues:', error);
      return 0;
    }
  },

  /**
   * Récupère une notification par son ID
   * @param {number} id - ID de la notification
   * @returns {Promise} Notification
   */
  getNotificationById: async (id) => {
    try {
      return await fetchApi(`api/v1/notifications/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la récupération de la notification ${id}:`, error);
      throw error;
    }
  }
};

export default notificationService;
