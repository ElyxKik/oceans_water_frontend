import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Ce composant réinitialise la position de défilement à chaque changement de route
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Si nous avons un hash dans l'URL (comme #contactus), ne pas défiler vers le haut
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      // Si nous avons un hash, attendre que le DOM soit chargé puis défiler vers l'élément
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo(0, 0);
        }
      }, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
