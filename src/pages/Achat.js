import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import '../styles/Achat.css';

const Achat = () => {
  const { addToCart } = useContext(CartContext);
  const [activeCategory, setActiveCategory] = useState('all');

  // All products data
  const products = [
    // Evian products
    {
      id: "Evian-4x1,5L",
      marque: "Evian",
      titre: "Evian 1,5L",
      description: "paquet de 4 bouteilles",
      prix: 15000,
      image: "img/Marques/Evian/Evian_4x1,5L.jpg",
      category: "evian"
    },
    {
      id: "Evian-6x1,5L",
      marque: "Evian",
      titre: "Evian 1,5L",
      description: "paquet de 6 bouteilles",
      prix: 22000,
      image: "img/Marques/Evian/Evian_6x1,5L.jpg",
      category: "evian"
    },
    {
      id: "Evian-6x50cl",
      marque: "Evian",
      titre: "Evian 50cl",
      description: "paquet de 6 bouteilles",
      prix: 12000,
      image: "img/Marques/Evian/Evian_6x50cl.jpg",
      category: "evian"
    },
    
    // Swissta products
    {
      id: "Swissta-19L-echangbidon",
      marque: "Swissta",
      titre: "Swissta 19L",
      description: "Grand bidon pour fontaine",
      prix: 10000,
      image: "img/Marques/Swissta/Swissta_19l_old.JPEG",
      category: "swissta"
    },
    {
      id: "Swissta-19L-nouveaubidon",
      marque: "Swissta",
      titre: "Swissta 19L",
      description: "Grand bidon pour fontaine (nouveau)",
      prix: 15000,
      image: "img/Marques/Swissta/Swissta_19l_new.JPEG",
      category: "swissta"
    },
    {
      id: "Swissta-6x1,5L",
      marque: "Swissta",
      titre: "Swissta 1,5L",
      description: "paquet de 6 bouteilles",
      prix: 12000,
      image: "img/Marques/Swissta/Swissta_6x1,5l.JPEG",
      category: "swissta"
    },
    
    // Spa products
    {
      id: "Spa-24x33cl",
      marque: "Spa",
      titre: "Spa 50cl",
      description: "Paquet de 24 bouteilles",
      prix: 15000,
      image: "img/Marques/Spa/Spa_24x50cl.JPEG",
      category: "spa"
    },
    {
      id: "Spa-6x1,5L",
      marque: "Spa",
      titre: "Spa 1,5L",
      description: "Paquet de 6 bouteilles",
      prix: 15000,
      image: "img/Marques/Spa/Spa_6x1,5l.JPEG",
      category: "spa"
    },
    
    // Abeer Cooling products
    {
      id: "Abeer-cooling-19L-echange-bidon",
      marque: "Abber Cooling",
      titre: "Abeer Cooling 19L",
      description: "Grand bidon pour fontaine",
      prix: 12000,
      image: "img/Marques/Abeer-cooling/Abeer_Cooling_19L_old.JPEG",
      category: "abeer"
    },
    {
      id: "Abeer-cooling-19L-nouveau-bidon",
      marque: "Abber Cooling",
      titre: "Abeer Cooling 19L",
      description: "Grand bidon pour fontaine (nouveau)",
      prix: 17000,
      image: "img/Marques/Abeer-cooling/Abeer_Cooling_19L_new.JPEG",
      category: "abeer"
    },
    
    // Eau Vive products
    {
      id: "Eau-vive-bleu-gazeuze-6x50cl",
      marque: "Eau Vive",
      titre: "Eau vive 50CL",
      description: "paquet de 6 bouteilles",
      prix: 13000,
      image: "img/Marques/Eau-vive/Eau_vive_bleu_gazeuse.jpeg",
      category: "eauvive"
    },
    {
      id: "Eau-vive-rouge-gazeuze-6x50cl",
      marque: "Eau Vive",
      titre: "Eau vive 50CL",
      description: "paquet de 6 bouteilles",
      prix: 13000,
      image: "img/Marques/Eau-vive/Eau_vive_rouge_gazeuse.jpeg",
      category: "eauvive"
    },
    
    // Canadian Pure products
    {
      id: "Canadian-pure-6x1,5L",
      marque: "Canadian Pure",
      titre: "Canadian pure 1,5L",
      description: "Paquet de 6 bouteilles",
      prix: 15000,
      image: "img/Marques/Canadian-pure/Canadian_6x1.5l.JPEG",
      category: "canadian"
    }
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="achat-container page-container">
      <h1>Boutique d'eau</h1>
      
      <div className="category-filter">
        <button 
          className={activeCategory === 'all' ? 'active' : ''} 
          onClick={() => setActiveCategory('all')}
        >
          Toutes les marques
        </button>
        <button 
          className={activeCategory === 'evian' ? 'active' : ''} 
          onClick={() => setActiveCategory('evian')}
        >
          Evian
        </button>
        <button 
          className={activeCategory === 'swissta' ? 'active' : ''} 
          onClick={() => setActiveCategory('swissta')}
        >
          Swissta
        </button>
        <button 
          className={activeCategory === 'spa' ? 'active' : ''} 
          onClick={() => setActiveCategory('spa')}
        >
          Spa
        </button>
        <button 
          className={activeCategory === 'abeer' ? 'active' : ''} 
          onClick={() => setActiveCategory('abeer')}
        >
          Abeer Cooling
        </button>
        <button 
          className={activeCategory === 'eauvive' ? 'active' : ''} 
          onClick={() => setActiveCategory('eauvive')}
        >
          Eau Vive
        </button>
        <button 
          className={activeCategory === 'canadian' ? 'active' : ''} 
          onClick={() => setActiveCategory('canadian')}
        >
          Canadian Pure
        </button>
      </div>
      
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div className="water-item" key={product.id}>
            <img src={require(`../assets/${product.image}`)} alt={product.id} />
            <div className="water-info">
              <h3 className="inisible-text">{product.titre}</h3>
              <p className="inisible-text">{product.description}</p>
              <p className="prix">{product.prix.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FC</p>
              <button 
                className="buy-now-btn" 
                onClick={() => handleAddToCart(product)}
              >
                Acheter
              </button>
              <span className="prix-plus">{product.prix.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FC</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achat;
