import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import '../styles/CategoryProducts.css';

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarque, setSelectedMarque] = useState('');
  const [marques, setMarques] = useState([]);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer toutes les catégories pour trouver celle qui correspond au nom dans l'URL
        const categoriesResponse = await productService.getAllCategories();
        const categories = categoriesResponse.results || [];
        
        // Trouver la catégorie correspondante (insensible à la casse)
        const matchedCategory = categories.find(
          cat => cat.nom.toLowerCase() === categoryName.toLowerCase()
        );
        
        if (!matchedCategory) {
          throw new Error(`Catégorie "${categoryName}" non trouvée`);
        }
        
        setCategory(matchedCategory);
        
        // Récupérer les produits de cette catégorie
        const productsResponse = await productService.getByCategory(matchedCategory.id);
        const productsData = productsResponse.results || [];
        
        // Transformer les produits au format attendu par le frontend
        const transformedProducts = productsData.map(product => ({
          id: product.id,
          marque: product.marque || 'Non spécifiée',
          titre: product.nom,
          description: `${product.unite || 'unité'}`,
          prix: parseFloat(product.prix),
          image: product.image && product.image.startsWith('http') ? product.image : 
                 product.image ? `http://localhost:8000${product.image}` : 
                 `https://via.placeholder.com/300x200/0056b3/ffffff?text=${encodeURIComponent(product.nom)}`
        }));
        
        // Extraire les marques uniques
        const uniqueMarques = [...new Set(transformedProducts.map(p => p.marque).filter(m => m && m !== 'Non spécifiée'))];
        setMarques(uniqueMarques.sort());
        
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
        setLoading(false);
      } catch (err) {
        console.error(`Erreur lors du chargement des produits de la catégorie ${categoryName}:`, err);
        setError(err.message || 'Une erreur est survenue lors du chargement des produits');
        setLoading(false);
      }
    };
    
    fetchCategoryAndProducts();
  }, [categoryName]);

  // Effet pour filtrer les produits
  useEffect(() => {
    let filtered = products;

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.marque.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrer par marque
    if (selectedMarque) {
      filtered = filtered.filter(product => product.marque === selectedMarque);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedMarque]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMarqueChange = (e) => {
    setSelectedMarque(e.target.value);
  };

  return (
    <div className="category-products-container">
      {/* Barre de filtre */}
      <section className="filtrage">
        <div className="search-bar">
          <input 
            type="text" 
            id="search-bar" 
            placeholder="Rechercher un produit" 
            aria-label="Champ de recherche produit"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="filters">
          <select 
            id="marque" 
            value={selectedMarque} 
            onChange={handleMarqueChange}
          >
            <option value="">Filtrer par Marque</option>
            {marques.map(marque => (
              <option key={marque} value={marque}>{marque}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Message de Bienvenue */}
      <section className="welcome">
        <h2>
          {loading ? 'Chargement...' : 
           category ? `Achetez ${category.nom.toLowerCase()} sans bouger de chez vous.` : 
           'Achetez vos produits sans bouger de chez vous.'}
        </h2>
        <p>Commandez et on vous livre au plus vite</p>
        <p>On vous livre partout.</p>
        <p><b>A la maison !</b></p>
        <p><b>Au bureau !</b></p>
        <p><b>Et même dans vos evenements.</b></p>
      </section>

      {loading ? (
        <div className="loading-container">
          <p>Chargement des produits...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <Link to="/" className="back-home-btn">
            Retourner à l'accueil
          </Link>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="no-products-container">
          <p>{products.length === 0 ? 
            'Aucun produit disponible dans cette catégorie pour le moment.' : 
            'Aucun produit ne correspond à vos critères de recherche.'}
          </p>
          {products.length === 0 && (
            <Link to="/" className="back-home-btn">
              Retourner à l'accueil
            </Link>
          )}
        </div>
      ) : (
        <div className="custom-water-grid">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={addToCart} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
