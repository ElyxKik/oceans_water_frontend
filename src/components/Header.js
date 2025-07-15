import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { cart } = useContext(CartContext);
  const { isAuthenticated, user, logout } = useAuth();
  
  // Calculer le nombre total d'articles dans le panier
  const cartItemCount = cart.reduce((total, item) => total + item.quantite, 0);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  let menuTimeout = null;

  // Détecter le défilement de la page et la taille de l'écran
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Appeler les gestionnaires immédiatement pour définir l'état initial
    handleScroll();
    handleResize();
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (menuTimeout) clearTimeout(menuTimeout);
    };
  }, [menuTimeout]);

  const showMenu = () => {
    if (menuTimeout) clearTimeout(menuTimeout);
    setMenuVisible(true);
  };

  const hideMenu = () => {
    if (menuTimeout) clearTimeout(menuTimeout);
    setMenuVisible(false);
  };

  const hideMenuAfterDelay = (delay) => {
    if (menuTimeout) clearTimeout(menuTimeout);
    menuTimeout = setTimeout(() => {
      hideMenu();
    }, delay);
  };

  // Fonction pour fermer le menu quand on clique sur un lien
  const handleLinkClick = () => {
    setMenuVisible(false);
  };

  return (
    <>
      {menuVisible && <div className="menu-overlay" onClick={() => setMenuVisible(false)}></div>}
      <header className={`${scrolled ? 'scrolled' : ''} ${isHomePage ? 'home-page' : ''} ${isMobile ? 'mobile-view' : ''}`}>
        <div className="header-top">
          <Link to="/" className="logo-link">
            <img src={require('../assets/img/Logo/IMG_3871.PNG')} alt="logo" className="menu-logo" />
          </Link>

          <div className="header-icons">
            <Link to="/Mon-panier.html" className="icon-link cart-icon-container">
              <img src={require('../assets/img/Home/panier_carton.png')} alt="Mon panier" className="panier-icon" />
              {cartItemCount > 0 && (
                <span className="cart-counter">{cartItemCount}</span>
              )}
            </Link>
            {/* Icône de notification supprimée */}
            {isAuthenticated ? (
              <div className="user-menu">
                <span className="user-greeting">Bonjour {user?.first_name || 'Utilisateur'}</span>
                <div className="user-dropdown">
                  <Link to="/mon-compte.html" className="icon-link">
                    <img src={require('../assets/img/Home/icone_connection.png')} alt="Mon compte" className="connection-logo" />
                  </Link>
                  <div className="dropdown-content">
                    <Link to="/mon-compte.html">Mon compte</Link>
                    <Link to="/mes-commandes.html">Mes commandes</Link>
                    <button onClick={logout} className="logout-btn">Déconnexion</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/connexion.html" className="icon-link">
                <img src={require('../assets/img/Home/icone_connection.png')} alt="se connecter" className="connection-logo" />
              </Link>
            )}
            <div 
              className={`menu-icon ${menuVisible ? 'active' : ''}`} 
              onClick={() => setMenuVisible(!menuVisible)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        
        {/* Le titre et le slogan ont été déplacés vers une section séparée dans Home.js */}
      </header>

      <nav 
        id="dropdown-menu" 
        className={`mobile-menu ${menuVisible ? "active" : ""}`}
      >
        <ul>
          <li><Link to="/boutique" onClick={handleLinkClick}>Boutique</Link></li>
          <li><Link to="/notifications.html" onClick={handleLinkClick}>Notifications</Link></li>
          <li>
            <Link 
              to="/" 
              onClick={(e) => {
                e.preventDefault();
                // Si déjà sur la page d'accueil, faire défiler jusqu'à la section
                if (isHomePage) {
                  document.getElementById('À propos de nous')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // Sinon, naviguer vers la page d'accueil avec un hash
                  navigate('/#À propos de nous');
                }
              }}
            >
              À propos de nous
            </Link>
          </li>
          <li><Link to="/support.html" onClick={handleLinkClick}>Besoin d'aide ?</Link></li>
          <li>
            <Link 
              to="/" 
              onClick={(e) => {
                e.preventDefault();
                // Si déjà sur la page d'accueil, faire défiler jusqu'au footer
                if (isHomePage) {
                  document.getElementById('contactus')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // Sinon, naviguer vers la page d'accueil avec un hash pour le footer
                  navigate('/#contactus');
                }
              }}
            >
              Contact
            </Link>
          </li>
          <li className="close-menu-button">
            <button onClick={() => setMenuVisible(false)}>Fermer le menu</button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Header;
