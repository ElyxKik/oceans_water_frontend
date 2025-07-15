import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Vérifier si l'utilisateur est déjà connecté au chargement de l'app
        const initializeAuth = async () => {
            try {
                console.log('Initialisation de l\'authentification...');
                // Vérifier directement le token dans localStorage
                const authToken = localStorage.getItem('authToken');
                
                if (authToken) {
                    console.log('Token trouvé dans localStorage');
                    // Mettre à jour le token dans le service
                    authService.token = authToken;
                    
                    // Récupérer les infos utilisateur
                    const userInfo = authService.getUserInfo();
                    if (userInfo) {
                        console.log('Infos utilisateur trouvées dans localStorage');
                        setUser(userInfo);
                        setIsAuthenticated(true);
                    } else {
                        console.log('Récupération des infos utilisateur depuis l\'API');
                        // Si pas d'info utilisateur, récupérer depuis l'API
                        try {
                            const currentUser = await authService.getCurrentUser();
                            localStorage.setItem('userInfo', JSON.stringify(currentUser));
                            setUser(currentUser);
                            setIsAuthenticated(true);
                        } catch (apiError) {
                            console.error('Erreur API lors de la récupération des infos utilisateur:', apiError);
                            // Si l'API échoue mais qu'on a un token, on garde l'utilisateur connecté
                            // mais sans ses infos détaillées
                            setIsAuthenticated(true);
                        }
                    }
                } else {
                    console.log('Aucun token trouvé, utilisateur non authentifié');
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
                // En cas d'erreur grave, déconnecter l'utilisateur
                authService.logout();
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
        
        // Ajouter un écouteur d'événement pour détecter les changements de localStorage
        const handleStorageChange = (e) => {
            if (e.key === 'authToken') {
                if (e.newValue) {
                    console.log('Token mis à jour dans un autre onglet');
                    initializeAuth();
                } else {
                    console.log('Token supprimé dans un autre onglet');
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = async (email, password) => {
        try {
            const result = await authService.login(email, password);
            if (result.success) {
                setUser(result.user);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            return { success: false, error: 'Erreur de connexion' };
        }
    };

    const register = async (userData) => {
        try {
            const result = await authService.register(userData);
            return result;
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            return { success: false, error: 'Erreur d\'inscription' };
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const requestPasswordReset = async (email) => {
        try {
            const result = await authService.requestPasswordReset(email);
            return result;
        } catch (error) {
            console.error('Erreur lors de la demande de réinitialisation:', error);
            return { success: false, error: 'Erreur de réinitialisation' };
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        requestPasswordReset
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
