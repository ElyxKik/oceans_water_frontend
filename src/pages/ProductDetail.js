import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { CartContext } from '../context/CartContext';
import { productService } from '../services/api';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour les avis
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewPending, setReviewPending] = useState(false);
  
  // États pour l'ajout au panier
  const [quantity, setQuantity] = useState(1);
  const [withDeposit, setWithDeposit] = useState(false);
  
  // État pour les notifications
  const [notification, setNotification] = useState(null);
  
  // Fonction pour afficher une notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    
    // Effacer la notification après 3 secondes
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  // Charger les détails du produit et les avis
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        // Récupérer les détails du produit
        const productData = await productService.getById(id);
        setProduct(productData);
        
        try {
          // Essayer de charger les avis du produit
          console.log('Chargement des avis pour le produit ID:', id);
          const reviewsData = await productService.getProductReviews(id);
          console.log('Avis reçus:', reviewsData);
          // Filtrer pour n'afficher que les avis approuvés
          const approvedReviews = reviewsData.filter(review => review.approuve === true);
          console.log('Avis approuvés:', approvedReviews);
          setReviews(approvedReviews);
          
          // Vérifier si l'utilisateur a déjà laissé un avis
          if (isAuthenticated) {
            const userReviewData = reviewsData.find(review => review.utilisateur_est_auteur);
            if (userReviewData) {
              setUserReview(userReviewData);
              setRating(userReviewData.note);
              setComment(userReviewData.commentaire);
              setReviewPending(!userReviewData.approuve);
            }
          }
        } catch (reviewError) {
          console.error('Erreur lors du chargement des avis:', reviewError);
          // Ne pas bloquer l'affichage du produit si les avis ne peuvent pas être chargés
          setReviews([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des détails du produit:', err);
        setError('Impossible de charger les détails du produit. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id, isAuthenticated]);
  
  // Gérer la soumission d'un avis
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      showNotification('Vous devez être connecté pour laisser un avis.', 'error');
      return;
    }
    
    if (rating === 0) {
      showNotification('Veuillez sélectionner une note.', 'error');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const reviewData = {
        produit: id,
        note: rating,
        commentaire: comment
      };
      
      if (userReview) {
        // Mettre à jour l'avis existant
        await productService.updateReview(userReview.id, reviewData);
        showNotification('Votre avis a été mis à jour et sera visible après modération.');
      } else {
        // Créer un nouvel avis
        await productService.addReview(id, reviewData);
        showNotification('Votre avis a été soumis et sera visible après modération.');
        
        // Réinitialiser le formulaire après la création d'un nouvel avis
        setRating(0);
        setComment('');
      }
      
      setReviewPending(true);
      setSubmitting(false);
    } catch (err) {
      console.error('Erreur lors de la soumission de l\'avis:', err);
      showNotification('Une erreur est survenue lors de la soumission de votre avis. Veuillez réessayer.', 'error');
      setSubmitting(false);
    }
  };
  
  // Gérer l'ajout au panier
  const handleAddToCart = () => {
    if (!product) return;
    
    if (quantity <= 0) {
      showNotification('Veuillez sélectionner une quantité valide.', 'error');
      return;
    }
    
    if (product.stock < quantity) {
      showNotification(`Désolé, il ne reste que ${product.stock} unités en stock.`, 'error');
      return;
    }
    
    try {
      // Préparer le produit avec l'option de consigne
      const productToAdd = {
        ...product,
        avec_consigne: withDeposit
      };
      
      // Ajouter au panier une fois par unité demandée
      for (let i = 0; i < quantity; i++) {
        addToCart(productToAdd);
      }
      
      showNotification(`${quantity} ${quantity > 1 ? 'unités' : 'unité'} de ${product.nom} ${quantity > 1 ? 'ont été ajoutées' : 'a été ajoutée'} à votre panier.`);
      
      // Rediriger vers le panier après un court délai
      setTimeout(() => {
        navigate('/Mon-panier.html');
      }, 1500);
    } catch (err) {
      console.error('Erreur lors de l\'ajout au panier:', err);
      showNotification('Une erreur est survenue lors de l\'ajout au panier. Veuillez réessayer.', 'error');
    }
  };
  
  // Calculer le prix total en fonction de la quantité et de la consigne
  const calculateTotalPrice = () => {
    if (!product) return 0;
    
    let total = product.prix * quantity;
    
    if (withDeposit && product.prix_consigne) {
      total += product.prix_consigne * quantity;
    }
    
    return total;
  };
  
  // Formater le prix avec séparateur de milliers
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  
  // Rendre les étoiles pour la notation
  const renderStars = (value, interactive = false) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (interactive) {
        // Pour les étoiles interactives (formulaire d'avis)
        stars.push(
          <span 
            key={i} 
            className={`star interactive ${i <= rating ? 'filled' : ''}`}
            onClick={() => setRating(i)}
            onMouseEnter={() => setRating(i)}
            onMouseLeave={() => {
              // Si l'utilisateur a déjà un avis, revenir à sa note actuelle
              // Sinon, conserver la dernière note sélectionnée
              if (userReview) {
                setRating(userReview.note);
              }
              // Ne pas réinitialiser à 0 si l'utilisateur n'a pas d'avis
            }}
          >
            {i <= rating ? <FaStar /> : <FaRegStar />}
          </span>
        );
      } else {
        // Pour les étoiles non interactives (affichage des avis)
        stars.push(
          <span key={i} className={`star ${i <= value ? 'filled' : ''}`}>
            {i <= value ? <FaStar /> : <FaRegStar />}
          </span>
        );
      }
    }
    
    return stars;
  };
  
  // Fonction pour obtenir une couleur cohérente selon la marque
  const getColorForBrand = (brand) => {
    const brandColors = {
      'Evian': '91CDF2',
      'Spa': '4CAF50',
      'Swissta': '0056b3',
      'Eden': '9C27B0',
      'Canadian Pure': 'FF5722',
      'Abeer Cooling': 'FFC107',
      'Eau Vive': '009688'
    };
    
    return brandColors[brand] || '87CEEB';
  };
  
  // Gestion des images avec fallback
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return `https://via.placeholder.com/400x400/${getColorForBrand(product?.marque?.nom || 'Marque')}/ffffff?text=${encodeURIComponent(product?.nom || 'Produit')}`;
    }
    
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Pour les images relatives du backend
    return `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="product-detail-container loading">
        <div className="spinner"></div>
        <p>Chargement du produit...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="product-detail-container error">
        <h2>Erreur</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/boutique')}>Retour à la boutique</button>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="product-detail-container error">
        <h2>Produit non trouvé</h2>
        <p>Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
        <button onClick={() => navigate('/boutique')}>Retour à la boutique</button>
      </div>
    );
  }
  
  return (
    <div className="product-detail-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      <div className="product-detail">
        <div className="product-image">
          {product.image ? (
            <img 
              src={getImageUrl(product.image)} 
              alt={product.nom} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://via.placeholder.com/400x400/${getColorForBrand(product?.marque?.nom || 'Marque')}/ffffff?text=${encodeURIComponent(product.nom)}`;
              }}
            />
          ) : (
            <div className="placeholder-image">
              {product.nom.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="product-info">
          <h1>{product.nom}</h1>
          
          {reviews.length > 0 && (
            <div className="product-rating">
              {renderStars(product.note_moyenne || 0)}
              <span className="rating-count">
                ({reviews.length} {reviews.length > 1 ? 'avis' : 'avis'})
              </span>
            </div>
          )}
          
          <div className="product-category">
            {product.categorie && <span>Catégorie: {product.categorie.nom}</span>}
            {product.marque && <span>Marque: {product.marque.nom}</span>}
          </div>
          
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description || 'Aucune description disponible.'}</p>
          </div>
          
          <div className="product-price">
            {product.prix_promo && product.prix_promo < product.prix ? (
              <>
                <span className="original-price">{formatPrice(product.prix)} FC</span>
                <span className="promo-price">{formatPrice(product.prix_promo)} FC</span>
                <span className="promo-badge">Promo</span>
              </>
            ) : (
              <span>{formatPrice(product.prix)} FC</span>
            )}
            
            {product.prix_consigne > 0 && (
              <div className="deposit-info">
                + Consigne: {formatPrice(product.prix_consigne)} FC (remboursable)
              </div>
            )}
          </div>
          
          <div className="product-stock">
            {product.stock > 0 ? (
              <span className="in-stock">{product.stock} en stock</span>
            ) : (
              <span className="out-of-stock">Rupture de stock</span>
            )}
          </div>
          
          <div className="product-actions">
            <div className="quantity-selector">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input 
                type="number" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={product.stock}
              />
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            
            {product.prix_consigne > 0 && (
              <div className="deposit-checkbox">
                <input 
                  type="checkbox" 
                  id="with-deposit" 
                  checked={withDeposit} 
                  onChange={(e) => setWithDeposit(e.target.checked)}
                />
                <label htmlFor="with-deposit">Ajouter la consigne ({formatPrice(product.prix_consigne)} FC)</label>
              </div>
            )}
            
            <div className="total-price">
              Total: {formatPrice(calculateTotalPrice())} FC
            </div>
            
            <button 
              className="add-to-cart-btn" 
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <FaShoppingCart /> Ajouter au panier
            </button>
          </div>
        </div>
      </div>
      
      <div className="product-reviews">
        <h2>Avis clients</h2>
        
        {isAuthenticated ? (
          reviewPending ? (
            <div className="review-form">
              <h3>Votre avis</h3>
              <p className="review-pending">
                Votre avis a été soumis et est en attente de modération. Merci pour votre contribution !
              </p>
            </div>
          ) : (
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <h3>{userReview ? 'Modifier votre avis' : 'Laisser un avis'}</h3>
              
              <div className="rating-input">
                <label>Votre note :</label>
                <div className="stars-input">
                  {renderStars(rating, true)}
                </div>
              </div>
              
              <div className="comment-input">
                <label htmlFor="comment">Votre commentaire :</label>
                <textarea 
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Partagez votre expérience avec ce produit..."
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="submit-review-btn"
                disabled={submitting || rating === 0}
              >
                {submitting ? 'Envoi en cours...' : userReview ? 'Modifier l\'avis' : 'Soumettre l\'avis'}
              </button>
            </form>
          )
        ) : (
          <div className="login-to-review">
            <p>Connectez-vous pour laisser un avis sur ce produit.</p>
            <button onClick={() => navigate('/connexion')}>Se connecter</button>
          </div>
        )}
        
        <div className="reviews-list">
          <h3>Avis des clients</h3>
          
          {reviews.length === 0 ? (
            <p className="no-reviews">Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <span className="review-author">{review.utilisateur_nom_complet || review.utilisateur_username}</span>
                  <span className="review-date">{new Date(review.date_creation).toLocaleDateString()}</span>
                </div>
                <div className="review-rating">
                  {renderStars(review.note)}
                </div>
                <div className="review-content">
                  <p>{review.commentaire}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
