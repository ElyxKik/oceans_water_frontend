import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Deconnexion.css';

const Deconnexion = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate logout by removing user data from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    
    // Redirect to home page after logout
    setTimeout(() => {
      navigate('/');
    }, 2000);
  }, [navigate]);

  return (
    <div className="deconnexion-container">
      <h1>Déconnexion</h1>
      <p>Vous avez été déconnecté avec succès.</p>
      <p>Vous allez être redirigé vers la page d'accueil...</p>
    </div>
  );
};

export default Deconnexion;
