// Service pour gérer les commandes
const API_BASE_URL = 'http://localhost:8000/api/v1';

class OrderService {
    constructor() {
        this.token = localStorage.getItem('authToken');
    }

    // Configuration des headers pour les requêtes
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Token ${this.token}`;
        }

        return headers;
    }

    // Récupérer les commandes de l'utilisateur
    async getUserOrders() {
        try {
            // Vérifier si le token est présent
            this.token = localStorage.getItem('authToken');
            if (!this.token) {
                return { success: false, error: 'Utilisateur non authentifié' };
            }
            
            const response = await fetch(`${API_BASE_URL}/orders/commandes/`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                // Le backend retourne un objet avec results pour la pagination
                const orders = data.results || data;
                console.log('Commandes récupérées:', orders);
                return { success: true, orders };
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Erreur API:', response.status, errorData);
                return { 
                    success: false, 
                    error: errorData.detail || `Erreur lors de la récupération des commandes (${response.status})` 
                };
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes:', error);
            return { success: false, error: 'Erreur de connexion au serveur' };
        }
    }

    // Récupérer une commande spécifique
    async getOrderById(orderId) {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/commandes/${orderId}/`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (response.ok) {
                const order = await response.json();
                return { success: true, order };
            } else {
                const errorData = await response.json().catch(() => ({}));
                return { 
                    success: false, 
                    error: errorData.detail || 'Commande non trouvée' 
                };
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de la commande:', error);
            return { success: false, error: 'Erreur de connexion au serveur' };
        }
    }

    // Formater le statut de la commande (basé sur le modèle Django)
    formatOrderStatus(status) {
        const statusMap = {
            'en_attente': 'En attente',
            'confirmee': 'Confirmée',
            'en_preparation': 'En préparation',
            'prete_livraison': 'Prête pour livraison',
            'en_livraison': 'En livraison',
            'livree': 'Livrée',
            'annulee': 'Annulée'
        };
        return statusMap[status] || status;
    }

    // Formater la date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Créer une commande pour un utilisateur authentifié
    async create(orderData) {
        try {
            // Vérifier si le token est présent
            this.token = localStorage.getItem('authToken');
            if (!this.token) {
                console.error('Tentative de créer une commande sans authentification');
                return { success: false, error: 'Utilisateur non authentifié' };
            }
            
            // Log détaillé des données envoyées pour le débogage
            console.log('Création d\'une commande authentifiée avec token:', this.token);
            console.log('Données de commande envoyées:', JSON.stringify(orderData, null, 2));
            
            // Vérification des champs requis
            if (!orderData.adresse_livraison) {
                console.error('Erreur: adresse_livraison manquante');
                return { success: false, error: 'Adresse de livraison requise' };
            }
            
            if (!orderData.telephone_livraison) {
                console.error('Erreur: telephone_livraison manquant');
                return { success: false, error: 'Numéro de téléphone requis' };
            }
            
            if (!orderData.articles || !Array.isArray(orderData.articles) || orderData.articles.length === 0) {
                console.error('Erreur: articles manquants ou format incorrect');
                return { success: false, error: 'Articles de commande requis' };
            }
            
            const response = await fetch(`${API_BASE_URL}/orders/commandes/`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Commande créée avec succès:', data);
                return { success: true, order: data };
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Erreur API:', response.status, errorData);
                console.error('Détails de l\'erreur:', JSON.stringify(errorData));
                return { 
                    success: false, 
                    error: errorData.detail || `Erreur lors de la création de la commande (${response.status})` 
                };
            }
        } catch (error) {
            console.error('Erreur lors de la création de la commande:', error);
            return { success: false, error: 'Erreur de connexion au serveur' };
        }
    }
    
    // Créer une commande anonyme (sans authentification)
    async createAnonymous(orderData) {
        try {
            console.log('Création d\'une commande anonyme');
            const response = await fetch(`${API_BASE_URL}/orders/commandes/anonyme/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Commande anonyme créée avec succès:', data);
                return { success: true, order: data };
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Erreur API:', response.status, errorData);
                return { 
                    success: false, 
                    error: errorData.detail || `Erreur lors de la création de la commande anonyme (${response.status})` 
                };
            }
        } catch (error) {
            console.error('Erreur lors de la création de la commande anonyme:', error);
            return { success: false, error: 'Erreur de connexion au serveur' };
        }
    }
}

export default new OrderService();
