/**
 * Configuration globale de l'application
 * Contient les variables d'environnement et les configurations
 */

// URL de base de l'API backend
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/';

// Fonction utilitaire pour construire les URLs d'API
export const getApiUrl = (endpoint) => {
  // S'assure que l'endpoint commence par un slash s'il n'en a pas déjà un
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${formattedEndpoint}`;
};
