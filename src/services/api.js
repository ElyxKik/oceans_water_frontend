/**
 * Service API pour gérer les appels au backend
 */
import { getApiUrl } from '../config';

/**
 * Fonction générique pour effectuer des requêtes HTTP
 * @param {string} endpoint - Point d'accès API (ex: '/products/')
 * @param {Object} options - Options fetch (méthode, headers, body, etc.)
 * @returns {Promise} - Promesse avec les données de la réponse
 */
const fetchApi = async (endpoint, options = {}) => {
  try {
    // Configuration par défaut des requêtes
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Pour envoyer les cookies avec les requêtes
    };

    // Fusion des options par défaut avec les options spécifiées
    const fetchOptions = {
      ...defaultOptions,
      ...options,
    };

    // Ajout du token d'authentification s'il existe
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchOptions.headers.Authorization = `Token ${token}`;
    }

    // Exécution de la requête
    const response = await fetch(getApiUrl(endpoint), fetchOptions);

    // Vérification de la réponse
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `Erreur ${response.status}: ${response.statusText}`);
    }

    // Retourne les données JSON si la réponse est OK
    return await response.json();
  } catch (error) {
    console.error(`Erreur API (${endpoint}):`, error);
    throw error;
  }
};

/**
 * Fonction utilitaire pour traiter les images des produits
 * @param {string} imagePath - Chemin de l'image
 * @returns {string} - URL de l'image (locale ou distante)
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/300x300?text=Produit';
  }
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  try {
    return require(`../assets/${imagePath}`);
  } catch (error) {
    console.warn(`Image non trouvée: ${imagePath}`);
    return 'https://via.placeholder.com/300x300?text=Produit';
  }
};

/**
 * Service pour les produits
 */
export const productService = {
  // Récupérer tous les produits
  getAll: () => fetchApi('/api/v1/products/produits/'),
  
  // Récupérer les produits par catégorie
  getByCategory: (categoryId) => fetchApi(`/api/v1/products/produits/?categorie=${categoryId}`),
  
  // Récupérer les produits par marque
  getByBrand: (brandId) => fetchApi(`/api/v1/products/produits/?marque=${brandId}`),
  
  // Récupérer les produits par catégorie et marque
  getByCategoryAndBrand: (categoryId, brandId) => fetchApi(`/api/v1/products/produits/?categorie=${categoryId}&marque=${brandId}`),
  
  // Récupérer un produit par son ID
  getById: (id) => fetchApi(`/api/v1/products/produits/${id}/`),
  
  // Récupérer toutes les catégories
  getAllCategories: () => fetchApi('/api/v1/products/categories/'),
  
  // Récupérer toutes les marques
  getAllBrands: () => fetchApi('/api/v1/products/marques/'),
  
  // Récupérer les produits en vedette (les plus récents)
  getFeatured: (limit = 4) => fetchApi(`/api/v1/products/produits/?ordering=-date_ajout&limit=${limit}`),
};

/**
 * Service pour le panier
 */
export const cartService = {
  // Vérifier si l'utilisateur est authentifié
  isAuthenticated: () => !!localStorage.getItem('authToken'),
  
  // Récupérer le panier de l'utilisateur authentifié
  getUserCart: () => fetchApi('/api/v1/cart/paniers/mon_panier/'),
  
  // Ajouter un produit au panier authentifié
  addItemAuthenticated: (cartId, productId, quantity = 1, withDeposit = false) => fetchApi(`/api/v1/cart/paniers/${cartId}/ajouter_produit/`, {
    method: 'POST',
    body: JSON.stringify({ 
      produit_id: productId, 
      quantite: quantity,
      avec_consigne: withDeposit
    }),
  }),
  
  // Mettre à jour la quantité d'un produit dans le panier authentifié
  updateItemAuthenticated: (cartId, articleId, quantity) => fetchApi(`/api/v1/cart/paniers/${cartId}/modifier-quantite/${articleId}/`, {
    method: 'POST',
    body: JSON.stringify({ quantite: quantity }),
  }),
  
  // Supprimer un produit du panier authentifié
  removeItemAuthenticated: (cartId, articleId) => fetchApi(`/api/v1/cart/paniers/${cartId}/supprimer-article/${articleId}/`, {
    method: 'DELETE',
  }),
  
  // Valider les produits du panier anonyme
  validateAnonymousCart: (productIds) => fetchApi('/api/v1/cart/anonymous/validate/', {
    method: 'POST',
    body: JSON.stringify({ product_ids: productIds }),
  }),
  
  // Récupérer les informations d'un produit pour le panier anonyme
  getAnonymousProduct: (productId) => fetchApi(`/api/v1/cart/anonymous/product/${productId}/`),
};

/**
 * Service pour les commandes
 */
export const orderService = {
  // Récupérer toutes les commandes de l'utilisateur
  getAll: () => fetchApi('/api/v1/orders/'),
  
  // Récupérer une commande par son ID
  getById: (id) => fetchApi(`/api/v1/orders/${id}/`),
  
  // Créer une nouvelle commande
  create: (orderData) => fetchApi('/api/v1/orders/', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
};

/**
 * Service pour l'authentification
 */
export const authService = {
  // Connexion utilisateur
  login: (credentials) => fetchApi('/api/v1/accounts/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  // Inscription utilisateur
  register: (userData) => fetchApi('/api/v1/accounts/register/', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  // Déconnexion utilisateur
  logout: () => fetchApi('/api/v1/accounts/logout/', {
    method: 'POST',
  }),
  
  // Récupérer les informations de l'utilisateur connecté
  getCurrentUser: () => fetchApi('/api/v1/accounts/me/'),
  
  // Mettre à jour les informations de l'utilisateur
  updateProfile: (userData) => fetchApi('/api/v1/accounts/me/', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
};

const apiServices = {
  productService,
  cartService,
  orderService,
  authService,
};

export default apiServices;
