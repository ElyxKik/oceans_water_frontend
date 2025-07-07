import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import Home from './pages/Home';
import Achat from './pages/Achat';
import Shop from './pages/Shop';
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

// Import components
import Header from './components/Header';
import TitleBanner from './components/TitleBanner';
import Footer from './components/Footer';

// Import context
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Header />
          <TitleBanner />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/achat.html" element={<Achat />} />
            {/* New unified shop routes */}
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:category" element={<Shop />} />
            <Route path="/shop/:category/:brand" element={<Shop />} />
            {/* New category products route */}
            <Route path="/categorie/:categoryName" element={<CategoryProducts />} />
            {/* Legacy shop routes for backward compatibility */}
            <Route path="/boutique-biere.html" element={<Shop />} />
            <Route path="/boutique-jus.html" element={<Shop />} />
            <Route path="/Mon-panier.html" element={<MonPanier />} />
            <Route path="/connexion.html" element={<Connexion />} />
            <Route path="/deconnexion.html" element={<Deconnexion />} />
            <Route path="/mes-commandes.html" element={<MesCommandes />} />
            <Route path="/mon-compte.html" element={<MonCompte />} />
            <Route path="/modifier-profil.html" element={<ModifierProfil />} />
            <Route path="/adresses.html" element={<Adresses />} />
            <Route path="/notifications.html" element={<Notifications />} />
            <Route path="/paiement.html" element={<Paiement />} />
            <Route path="/support.html" element={<Support />} />
            <Route path="/politique-de-confidentialite.html" element={<PolitiqueConfidentialite />} />
            <Route path="/termes-cond.html" element={<TermesConditions />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
