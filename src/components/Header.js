import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
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

  return (
    <>
      <header className={`${scrolled ? 'scrolled' : ''} ${isHomePage ? 'home-page' : ''} ${isMobile ? 'mobile-view' : ''}`}>
        <div className="header-top">
          <Link to="/" className="logo-link">
            <img src={require('../assets/img/Logo/IMG_3871.PNG')} alt="logo" className="menu-logo" />
          </Link>

          <div className="header-icons">
            <Link to="/Mon-panier.html" className="icon-link">
              <img src={require('../assets/img/Home/panier_carton.png')} alt="Mon panier" className="panier-icon" />
            </Link>
            <Link to="/connexion.html" className="icon-link">
              <img src={require('../assets/img/Home/icone_connection.png')} alt="se connecter" className="connection-logo" />
            </Link>
            <div 
              className="menu-icon" 
              onClick={() => setMenuVisible(!menuVisible)}
              onMouseOver={showMenu}
              onMouseLeave={() => hideMenuAfterDelay(300)}
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
        className={menuVisible ? "" : "hidden"}
        onMouseOver={showMenu}
        onMouseLeave={() => hideMenuAfterDelay(300)}
      >
        <ul>
          <li><Link to="/shop">Boutique</Link></li>
          <li>
            <span className="submenu-trigger">Catégories</span>
            <ul className="submenu">
              <li><Link to="/shop/eau">Eaux</Link></li>
              <li><Link to="/shop/biere">Bières</Link></li>
              <li><Link to="/shop/jus">Jus</Link></li>
            </ul>
          </li>
          <li><Link to="/notifications.html">Notifications</Link></li>
          <li>
            <Link 
              to="/" 
              onClick={(e) => {
                e.preventDefault();
                // Si déjà sur la page d'accueil, faire défiler jusqu'à la section
                if (window.location.pathname === '/') {
                  document.getElementById('À propos de nous')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // Sinon, naviguer vers la page d'accueil avec un paramètre d'ancre
                  window.location.href = '/#À propos de nous';
                }
              }}
            >
              À propos de nous
            </Link>
          </li>
          <li><Link to="/support.html">Besoin d'aide ?</Link></li>
          <li>
            <Link 
              to="/" 
              onClick={(e) => {
                e.preventDefault();
                // Si déjà sur la page d'accueil, faire défiler jusqu'à la section
                if (window.location.pathname === '/') {
                  document.getElementById('Nous Contacter')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // Sinon, naviguer vers la page d'accueil avec un paramètre d'ancre
                  window.location.href = '/#Nous Contacter';
                }
              }}
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Header;
