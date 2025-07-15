import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Connexion.css';

const Connexion = () => {
  const [activeStep, setActiveStep] = useState('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, register, requestPasswordReset } = useAuth();

  // États pour les formulaires
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: ''
  });
  const [forgotEmail, setForgotEmail] = useState('');

  const goToStep = (step) => {
    setActiveStep(step);
    setMessage('');
    setError('');
  };

  // Gestion de la connexion
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(loginData.email, loginData.password);
    
    if (result.success) {
      setMessage('Connexion réussie ! Redirection...');
      setTimeout(() => {
        navigate('/'); // Rediriger vers la page d'accueil
      }, 1500);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  // Gestion de l'inscription
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation côté client
    if (signupData.password !== signupData.passwordConfirm) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    const result = await register(signupData);
    
    if (result.success) {
      setMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      setTimeout(() => {
        goToStep('login');
      }, 2000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  // Gestion du mot de passe oublié
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await requestPasswordReset(forgotEmail);
    
    if (result.success) {
      setMessage('Si cette adresse email existe, vous recevrez un lien de réinitialisation.');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="connexion-page-container">
      <div className="connexion-container">
        {/* Formulaire de connexion */}
        <div id="login-form" className={`form-step ${activeStep === 'login' ? 'active' : ''}`}>
          <h2>Ravis de vous revoir</h2>
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <input 
              type="email" 
              placeholder="Email" 
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              required 
            />
            <input 
              type="password" 
              placeholder="Mot de passe" 
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              required 
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Connexion...' : 'Connexion'}
            </button>
          </form>
          
          <p className="link-text" onClick={() => goToStep('forgot')}>Mot de passe oublié ?</p>
          <p>Vous n'avez pas de compte ? <span className="link-text" onClick={() => goToStep('signup')}>Se créer un compte</span></p>
        </div>

        {/* Formulaire mot de passe oublié */}
        <div id="forgot-form" className={`form-step ${activeStep === 'forgot' ? 'active' : ''}`}>
          <h2>Mot de passe oublié</h2>
          <p>Entrez votre adresse email pour recevoir un lien de réinitialisation</p>
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleForgotPassword}>
            <input 
              type="email" 
              placeholder="Email" 
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required 
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Envoi...' : 'Envoyer le lien'}
            </button>
          </form>
          
          <p className="link-text" onClick={() => goToStep('login')}>Retour à la connexion</p>
        </div>

        {/* Formulaire d'inscription */}
        <div id="signup-form" className={`form-step ${activeStep === 'signup' ? 'active' : ''}`}>
          <h2>Créer un compte</h2>
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSignup}>
            <input 
              type="text" 
              placeholder="Prénom" 
              value={signupData.firstName}
              onChange={(e) => setSignupData({...signupData, firstName: e.target.value})}
              required 
            />
            <input 
              type="text" 
              placeholder="Nom" 
              value={signupData.lastName}
              onChange={(e) => setSignupData({...signupData, lastName: e.target.value})}
              required 
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={signupData.email}
              onChange={(e) => setSignupData({...signupData, email: e.target.value})}
              required 
            />
            <input 
              type="tel" 
              placeholder="Téléphone" 
              value={signupData.phone}
              onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
            />
            <input 
              type="password" 
              placeholder="Mot de passe" 
              value={signupData.password}
              onChange={(e) => setSignupData({...signupData, password: e.target.value})}
              required 
            />
            <input 
              type="password" 
              placeholder="Confirmer le mot de passe" 
              value={signupData.passwordConfirm}
              onChange={(e) => setSignupData({...signupData, passwordConfirm: e.target.value})}
              required 
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer le compte'}
            </button>
          </form>
          
          <p>Vous avez déjà un compte ? <span className="link-text" onClick={() => goToStep('login')}>Se connecter</span></p>
        </div>
      </div>
    </div>
  );
};

export default Connexion;
