import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ModifierProfil.css';

const ModifierProfil = () => {
  const navigate = useNavigate();
  
  // Mock user data - in a real app, this would come from an API or context
  const [formData, setFormData] = useState({
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    phone: '+243 123 456 789',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // Password validation if user is trying to change password
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setError('Veuillez entrer votre mot de passe actuel');
        return;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Les nouveaux mots de passe ne correspondent pas');
        return;
      }
      
      if (formData.newPassword.length < 8) {
        setError('Le nouveau mot de passe doit contenir au moins 8 caractères');
        return;
      }
    }
    
    // In a real app, you would call an API to update the user profile
    // For now, we'll just simulate a successful update
    setError('');
    setMessage('Profil mis à jour avec succès');
    
    // Redirect to account page after a short delay
    setTimeout(() => {
      navigate('/mon-compte.html');
    }, 2000);
  };

  return (
    <div className="modifier-profil-container">
      <h1>Modifier mon profil</h1>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h2>Informations personnelles</h2>
          
          <div className="form-group">
            <label htmlFor="name">Nom complet *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Téléphone *</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Changer le mot de passe</h2>
          <p className="section-info">Laissez vide si vous ne souhaitez pas changer votre mot de passe</p>
          
          <div className="form-group">
            <label htmlFor="currentPassword">Mot de passe actuel</label>
            <input 
              type="password" 
              id="currentPassword" 
              name="currentPassword" 
              value={formData.currentPassword} 
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">Nouveau mot de passe</label>
            <input 
              type="password" 
              id="newPassword" 
              name="newPassword" 
              value={formData.newPassword} 
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/mon-compte.html')}>
            Annuler
          </button>
          <button type="submit" className="save-btn">
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModifierProfil;
