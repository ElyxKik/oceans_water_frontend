import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/TitleBanner.css';

const TitleBanner = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Détecter la taille de l'écran
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // N'afficher que sur la page d'accueil
  if (!isHomePage) return null;

  return (
    <section className={`title-banner ${isMobile ? 'mobile-view' : ''}`}>
      <div className="title-content">
        <h1><b>OCEAN'S WATER</b></h1>
        <p>Votre service de livraison d'eau minérale à Kinshasa</p>
      </div>
    </section>
  );
};

export default TitleBanner;
