import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Connexion.css';

const Connexion = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    // In a real app, you would call an API to authenticate
    // For now, we'll just simulate a successful login
    console.log('Tentative de connexion avec:', { email, password });
    
    // Simulate successful login
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    
    // Redirect to account page
    navigate('/mon-compte.html');
  };

  return (
    <div className="connexion-container">
      <h1>Connexion</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="connexion-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
            required
          />
        </div>
        
        <button type="submit" className="connexion-btn">Se connecter</button>
      </form>
      
      <div className="connexion-links">
        <Link to="/inscription.html">Créer un compte</Link>
        <Link to="/mot-de-passe-oublie.html">Mot de passe oublié ?</Link>
      </div>
    </div>
  );
};

export default Connexion;
