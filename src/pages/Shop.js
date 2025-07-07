import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import '../styles/Shop.css';

const Shop = () => {
  const { addToCart } = useContext(CartContext);
  const { category, brand } = useParams();
  const navigate = useNavigate();
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeBrand, setActiveBrand] = useState('all');
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [brands, setBrands] = useState(['all']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Category names mapping for display
  const categoryNames = {
    'all': 'Tous les produits',
    'eau': 'Eaux',
    'biere': 'Bières',
    'jus': 'Jus'
  };

  // Charger tous les produits depuis l'API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAll();
        setAllProducts(data);
        
        // Extraire les catégories et marques uniques
        const uniqueCategories = ['all', ...new Set(data.map(product => product.category))];
        const uniqueBrands = ['all', ...new Set(data.map(product => product.brand || product.marque))];
        
        setCategories(uniqueCategories);
        setBrands(uniqueBrands);
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des produits:', err);
        setError('Impossible de charger les produits. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Filtrer les produits en fonction de la catégorie et de la marque active
  useEffect(() => {
    // Définir les filtres initiaux en fonction des paramètres d'URL
    if (category && category !== 'all') {
      setActiveCategory(category);
    }
    
    if (brand && brand !== 'all') {
      setActiveBrand(brand);
    }
    
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        let data;
        
        // Appeler l'API avec les filtres appropriés
        if (activeCategory !== 'all' && activeBrand !== 'all') {
          data = await productService.getByCategoryAndBrand(activeCategory, activeBrand);
        } else if (activeCategory !== 'all') {
          data = await productService.getByCategory(activeCategory);
        } else if (activeBrand !== 'all') {
          data = await productService.getByBrand(activeBrand);
        } else {
          data = allProducts; // Utiliser les produits déjà chargés si aucun filtre
        }
        
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du filtrage des produits:', err);
        setError('Impossible de filtrer les produits. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };
    
    // Si nous avons déjà les produits, filtrer localement pour éviter des appels API inutiles
    if (allProducts.length > 0) {
      let filteredProducts = [...allProducts];
      
      if (activeCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
          product.category === activeCategory);
      }
      
      if (activeBrand !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
          (product.brand || product.marque) === activeBrand);
      }
      
      setProducts(filteredProducts);
    } else if (!loading) {
      // Si nous n'avons pas encore les produits et que nous ne sommes pas en train de les charger
      fetchFilteredProducts();
    }
  }, [activeCategory, activeBrand, category, brand, allProducts, loading]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    // Update URL to reflect the filter
    if (activeBrand === 'all') {
      navigate(`/shop/${category}`);
    } else {
      navigate(`/shop/${category}/${activeBrand}`);
    }
  };

  // Handle brand change
  const handleBrandChange = (brand) => {
    setActiveBrand(brand);
    // Update URL to reflect the filter
    if (activeCategory === 'all') {
      navigate(`/shop/all/${brand}`);
    } else {
      navigate(`/shop/${activeCategory}/${brand}`);
    }
  };

  return (
    <div className="shop-container page-container">
      <h1>Boutique</h1>
      
      <div className="filters-container">
        <div className="filter-section">
          <h3>Catégories</h3>
          <div className="filter-options">
            {categories.map(cat => (
              <button 
                key={cat}
                className={activeCategory === cat ? 'active' : ''}
                onClick={() => handleCategoryChange(cat)}
              >
                {categoryNames[cat] || cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="filter-section">
          <h3>Marques</h3>
          <div className="filter-options">
            {brands.map(brand => (
              <button 
                key={brand}
                className={activeBrand === brand ? 'active' : ''}
                onClick={() => handleBrandChange(brand)}
              >
                {brand === 'all' ? 'Toutes les marques' : brand}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="products-grid">
        {loading ? (
          <div className="loading">
            <p>Chargement des produits...</p>
          </div>
        ) : error ? (
          <div className="error">
            <p>{error}</p>
          </div>
        ) : products.length > 0 ? (
          products.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              onAddToCart={() => addToCart(product)}
            />
          ))
        ) : (
          <div className="no-products">
            <p>Aucun produit ne correspond à votre sélection.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
