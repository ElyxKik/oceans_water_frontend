import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/ProtectedRoute.css';

/**
 * Composant pour protéger les routes qui nécessitent une authentification
 * Vérifie à la fois le contexte d'authentification et le localStorage
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Vérifier directement le token dans localStorage
    const authToken = localStorage.getItem('authToken');
    setHasToken(!!authToken);
    setCheckingAuth(false);
  }, []);

  // Afficher un indicateur de chargement pendant la vérification
  if (loading || checkingAuth) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  // et qu'il n'y a pas de token dans le localStorage
  if (!isAuthenticated && !hasToken) {
    console.log('Accès refusé: redirection vers la page de connexion');
    return <Navigate to="/connexion" replace />;
  }

  // Si l'utilisateur est authentifié ou a un token, afficher le contenu protégé
  return children;
};

export default ProtectedRoute;
