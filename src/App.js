import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import ScrollToTop component
import ScrollToTop from './components/ScrollToTop';

// Import ProtectedRoute component
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import Home from './pages/Home';
import Boutique from './pages/Boutique';
import CategoryProducts from './pages/CategoryProducts';
import MonPanier from './pages/MonPanier';
import Connexion from './pages/Connexion';
import Deconnexion from './pages/Deconnexion';
import MesCommandes from './pages/MesCommandes';
import MonCompte from './pages/MonCompte';
import ModifierProfil from './pages/ModifierProfil';
import Adresses from './pages/Adresses';
import Notifications from './pages/Notifications';
import Paiement from './pages/Paiement';
import Support from './pages/Support';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import TermesConditions from './pages/TermesConditions';
import ConfirmationCommande from './pages/ConfirmationCommande';

// Import components
import Header from './components/Header';
import TitleBanner from './components/TitleBanner';
import Footer from './components/Footer';

// Import context
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="App">
            <Header />
            <TitleBanner />
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/achat.html" element={<Boutique />} />
            <Route path="/boutique" element={<Boutique />} />
            {/* Redirection des routes shop vers boutique */}
            <Route path="/shop" element={<Boutique />} />
            <Route path="/shop/:category" element={<Boutique />} />
            <Route path="/shop/:category/:brand" element={<Boutique />} />
            {/* New category products route */}
            <Route path="/categorie/:categoryName" element={<CategoryProducts />} />
            {/* Legacy shop routes for backward compatibility */}
            <Route path="/boutique-biere.html" element={<Boutique />} />
            <Route path="/boutique-jus.html" element={<Boutique />} />
            <Route path="/Mon-panier.html" element={<MonPanier />} />
            <Route path="/connexion.html" element={<Connexion />} />
            <Route path="/deconnexion.html" element={<Deconnexion />} />
            <Route path="/mes-commandes.html" element={<ProtectedRoute><MesCommandes /></ProtectedRoute>} />
            <Route path="/mon-compte.html" element={<ProtectedRoute><MonCompte /></ProtectedRoute>} />
            <Route path="/modifier-profil.html" element={<ProtectedRoute><ModifierProfil /></ProtectedRoute>} />
            <Route path="/adresses.html" element={<ProtectedRoute><Adresses /></ProtectedRoute>} />
            <Route path="/notifications.html" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/paiement.html" element={<Paiement />} />
            <Route path="/confirmation-commande" element={<ConfirmationCommande />} />
            <Route path="/support.html" element={<Support />} />
            <Route path="/politique-de-confidentialite.html" element={<PolitiqueConfidentialite />} />
            <Route path="/termes-cond.html" element={<TermesConditions />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
