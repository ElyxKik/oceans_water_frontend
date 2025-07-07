import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import '../styles/BoutiqueBiere.css';

const BoutiqueBiere = () => {
  const { addToCart } = useContext(CartContext);
  const [activeCategory, setActiveCategory] = useState('all');

  // Beer products data
  const products = [
    {
      id: "Primus-24x33cl",
      marque: "Primus",
      titre: "Primus 33cl",
      description: "Caisse de 24 bouteilles",
      prix: 20000,
      image: "img/Marques/Bieres/primus_24x33cl.jpg",
      category: "primus"
    },
    {
      id: "Primus-6x65cl",
      marque: "Primus",
      titre: "Primus 65cl",
      description: "Pack de 6 bouteilles",
      prix: 12000,
      image: "img/Marques/Bieres/primus_6x65cl.jpg",
      category: "primus"
    },
    {
      id: "Tembo-24x33cl",
      marque: "Tembo",
      titre: "Tembo 33cl",
      description: "Caisse de 24 bouteilles",
      prix: 22000,
      image: "img/Marques/Bieres/tembo_24x33cl.jpg",
      category: "tembo"
    },
    {
      id: "Tembo-6x65cl",
      marque: "Tembo",
      titre: "Tembo 65cl",
      description: "Pack de 6 bouteilles",
      prix: 13000,
      image: "img/Marques/Bieres/tembo_6x65cl.jpg",
      category: "tembo"
    },
    {
      id: "Mutzig-24x33cl",
      marque: "Mutzig",
      titre: "Mutzig 33cl",
      description: "Caisse de 24 bouteilles",
      prix: 24000,
      image: "img/Marques/Bieres/mutzig_24x33cl.jpg",
      category: "mutzig"
    },
    {
      id: "Mutzig-6x65cl",
      marque: "Mutzig",
      titre: "Mutzig 65cl",
      description: "Pack de 6 bouteilles",
      prix: 14000,
      image: "img/Marques/Bieres/mutzig_6x65cl.jpg",
      category: "mutzig"
    },
    {
      id: "Doppel-24x33cl",
      marque: "Doppel",
      titre: "Doppel 33cl",
      description: "Caisse de 24 bouteilles",
      prix: 25000,
      image: "img/Marques/Bieres/doppel_24x33cl.jpg",
      category: "doppel"
    },
    {
      id: "Doppel-6x65cl",
      marque: "Doppel",
      titre: "Doppel 65cl",
      description: "Pack de 6 bouteilles",
      prix: 15000,
      image: "img/Marques/Bieres/doppel_6x65cl.jpg",
      category: "doppel"
    },
    {
      id: "Turbo-24x33cl",
      marque: "Turbo King",
      titre: "Turbo King 33cl",
      description: "Caisse de 24 bouteilles",
      prix: 26000,
      image: "img/Marques/Bieres/turbo_24x33cl.jpg",
      category: "turbo"
    },
    {
      id: "Turbo-6x65cl",
      marque: "Turbo King",
      titre: "Turbo King 65cl",
      description: "Pack de 6 bouteilles",
      prix: 16000,
      image: "img/Marques/Bieres/turbo_6x65cl.jpg",
      category: "turbo"
    }
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="boutique-container">
      <h1>Boutique de Bières</h1>
      
      <div className="category-filter">
        <button 
          className={activeCategory === 'all' ? 'active' : ''} 
          onClick={() => setActiveCategory('all')}
        >
          Toutes les marques
        </button>
        <button 
          className={activeCategory === 'primus' ? 'active' : ''} 
          onClick={() => setActiveCategory('primus')}
        >
          Primus
        </button>
        <button 
          className={activeCategory === 'tembo' ? 'active' : ''} 
          onClick={() => setActiveCategory('tembo')}
        >
          Tembo
        </button>
        <button 
          className={activeCategory === 'mutzig' ? 'active' : ''} 
          onClick={() => setActiveCategory('mutzig')}
        >
          Mutzig
        </button>
        <button 
          className={activeCategory === 'doppel' ? 'active' : ''} 
          onClick={() => setActiveCategory('doppel')}
        >
          Doppel
        </button>
        <button 
          className={activeCategory === 'turbo' ? 'active' : ''} 
          onClick={() => setActiveCategory('turbo')}
        >
          Turbo King
        </button>
      </div>
      
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div className="beer-item" key={product.id}>
            <img src={require(`../assets/${product.image}`)} alt={product.id} />
            <div className="beer-info">
              <h3>{product.titre}</h3>
              <p>{product.description}</p>
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

export default BoutiqueBiere;
