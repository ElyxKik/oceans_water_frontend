// Service d'authentification pour communiquer avec le backend Django
const API_BASE_URL = 'http://localhost:8000/api/v1';

class AuthService {
    constructor() {
        this.token = localStorage.getItem('authToken');
    }

    // Configuration des headers pour les requêtes
    getHeaders(includeAuth = false) {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (includeAuth && this.token) {
            headers['Authorization'] = `Token ${this.token}`;
        }

        return headers;
    }

    // Connexion utilisateur
    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/token-auth/`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    username: email, // Django utilise username pour l'email
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.token;
                localStorage.setItem('authToken', data.token);
                
                // Récupérer les informations de l'utilisateur
                const userInfo = await this.getCurrentUser();
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                
                return { success: true, token: data.token, user: userInfo };
            } else {
                return { 
                    success: false, 
                    error: data.non_field_errors?.[0] || 'Erreur de connexion' 
                };
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            return { 
                success: false, 
                error: 'Erreur de connexion au serveur' 
            };
        }
    }

    // Inscription utilisateur
    async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/accounts/register/`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    username: userData.email, // Utiliser l'email comme username
                    email: userData.email,
                    password: userData.password,
                    password_confirm: userData.passwordConfirm,
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                    phone_number: userData.phone,
                    role: 'client' // Par défaut, les nouveaux utilisateurs sont des clients
                })
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, user: data };
            } else {
                // Gérer les erreurs de validation
                let errorMessage = 'Erreur lors de l\'inscription';
                if (data.username) {
                    errorMessage = data.username[0];
                } else if (data.email) {
                    errorMessage = data.email[0];
                } else if (data.password) {
                    errorMessage = data.password[0];
                } else if (data.non_field_errors) {
                    errorMessage = data.non_field_errors[0];
                }
                
                return { success: false, error: errorMessage };
            }
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            return { 
                success: false, 
                error: 'Erreur de connexion au serveur' 
            };
        }
    }

    // Récupérer les informations de l'utilisateur connecté
    async getCurrentUser() {
        try {
            const response = await fetch(`${API_BASE_URL}/accounts/me/`, {
                method: 'GET',
                headers: this.getHeaders(true)
            });

            if (response.ok) {
                const userData = await response.json();
                return userData;
            } else {
                throw new Error('Impossible de récupérer les informations utilisateur');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des informations utilisateur:', error);
            throw error;
        }
    }

    // Demande de réinitialisation de mot de passe
    async requestPasswordReset(email) {
        try {
            const response = await fetch(`${API_BASE_URL}/accounts/password-reset/`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, message: 'Email de réinitialisation envoyé' };
            } else {
                return { 
                    success: false, 
                    error: data.email?.[0] || 'Erreur lors de l\'envoi de l\'email' 
                };
            }
        } catch (error) {
            console.error('Erreur lors de la demande de réinitialisation:', error);
            return { 
                success: false, 
                error: 'Erreur de connexion au serveur' 
            };
        }
    }

    // Déconnexion
    logout() {
        this.token = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
    }

    // Vérifier si l'utilisateur est connecté
    isAuthenticated() {
        // Toujours vérifier le localStorage actuel, pas seulement la variable d'instance
        const currentToken = localStorage.getItem('authToken');
        // Mettre à jour la variable d'instance si nécessaire
        if (currentToken && this.token !== currentToken) {
            this.token = currentToken;
        }
        return !!currentToken;
    }

    // Récupérer le token
    getToken() {
        // Toujours récupérer la dernière version du token depuis le localStorage
        const currentToken = localStorage.getItem('authToken');
        // Mettre à jour la variable d'instance si nécessaire
        if (currentToken && this.token !== currentToken) {
            this.token = currentToken;
        }
        return this.token;
    }

    // Récupérer les informations utilisateur depuis le localStorage
    getUserInfo() {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    }
}

export default new AuthService();
