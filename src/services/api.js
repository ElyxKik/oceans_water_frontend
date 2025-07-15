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
export const fetchApi = async (endpoint, options = {}) => {
  try {
    console.log(`Appel API: ${endpoint}`, options);
    
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
    console.log('Token d\'authentification présent:', !!token);
    
    if (token) {
      fetchOptions.headers.Authorization = `Token ${token}`;
    }

    // Construction de l'URL complète
    const fullUrl = getApiUrl(endpoint);
    console.log('URL complète:', fullUrl);
    
    // Exécution de la requête
    console.log('Options fetch:', fetchOptions);
    const response = await fetch(fullUrl, fetchOptions);
    console.log('Statut de la réponse:', response.status, response.statusText);

    // Vérification de la réponse
    if (!response.ok) {
      let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
      
      // Cloner la réponse pour pouvoir la lire
      const responseClone = response.clone();
      
      try {
        // Essayer de parser la réponse d'erreur comme JSON
        const errorBody = await responseClone.json();
        console.error('Données d\'erreur (JSON):', errorBody);
        // Construire un message d'erreur détaillé à partir du JSON
        errorMessage = JSON.stringify(errorBody);
      } catch (e) {
        try {
          // Si ce n'est pas du JSON, lire comme du texte brut
          const errorText = await responseClone.text();
          console.error('Données d\'erreur (texte):', errorText);
          if (errorText) errorMessage = errorText;
        } catch (textError) {
          console.error('Impossible de lire le corps de la réponse:', textError);
        }
      }
      
      // Lancer une erreur avec le message détaillé du backend
      throw new Error(errorMessage);
    }

    // Retourne les données JSON si la réponse est OK
    const jsonData = await response.json();
    console.log(`Réponse API (${endpoint}):`, jsonData);
    return jsonData;
  } catch (error) {
    console.error(`Erreur API détaillée (${endpoint}):`, error);
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
  
  // Créer un panier anonyme avec un identifiant unique
  createAnonymousCart: () => fetchApi('/api/v1/cart/anonymous/create/', {
    method: 'POST',
  }),
  
  // Récupérer un panier anonyme par son identifiant
  getAnonymousCart: (anonymousCartId) => fetchApi(`/api/v1/cart/anonymous/${anonymousCartId}/`),
  
  // Ajouter un produit au panier anonyme
  addItemAnonymous: (anonymousCartId, productId, quantity = 1, withDeposit = false) => fetchApi(`/api/v1/cart/anonymous/${anonymousCartId}/add/`, {
    method: 'POST',
    body: JSON.stringify({ 
      produit_id: productId, 
      quantite: quantity,
      avec_consigne: withDeposit
    }),
  }),
  
  // Mettre à jour la quantité d'un produit dans le panier anonyme
  updateItemAnonymous: (anonymousCartId, articleId, quantity) => fetchApi(`/api/v1/cart/anonymous/${anonymousCartId}/update/${articleId}/`, {
    method: 'POST',
    body: JSON.stringify({ quantite: quantity }),
  }),
  
  // Supprimer un produit du panier anonyme
  removeItemAnonymous: (anonymousCartId, articleId) => fetchApi(`/api/v1/cart/anonymous/${anonymousCartId}/remove/${articleId}/`, {
    method: 'DELETE',
  }),
  
  // Vider le panier anonyme
  clearAnonymousCart: (anonymousCartId) => fetchApi(`/api/v1/cart/anonymous/${anonymousCartId}/clear/`, {
    method: 'POST',
  }),
  
  // Vider le panier authentifié
  clearCart: (cartId) => fetchApi(`/api/v1/cart/paniers/${cartId}/vider/`, {
    method: 'POST',
  }),
  
  // Fusionner un panier anonyme avec le panier de l'utilisateur après connexion
  mergeAnonymousCart: (anonymousCartId) => fetchApi('/api/v1/cart/paniers/merge_anonymous/', {
    method: 'POST',
    body: JSON.stringify({ anonymous_cart_id: anonymousCartId }),
  }),
};

/**
 * Service pour les commandes
 */
export const orderService = {
  // Récupérer toutes les commandes de l'utilisateur
  getAll: () => fetchApi('/api/v1/orders/'),
  
  // Récupérer une commande par son ID
  getById: (id) => fetchApi(`/api/v1/orders/${id}/`),
  
  // Créer une nouvelle commande (pour utilisateurs authentifiés)
  create: (orderData) => fetchApi('/api/v1/orders/commandes/', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  // Créer une commande anonyme (pour utilisateurs non connectés)
  createAnonymous: (orderData) => fetchApi('/api/v1/orders/commandes/anonyme/', {
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
