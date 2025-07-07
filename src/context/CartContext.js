import React, { createContext, useState, useEffect } from 'react';
import { cartService, getImageUrl } from '../services/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const deliveryFee = 6000; // Frais de livraison

  // État pour stocker l'ID du panier utilisateur authentifié
  const [userCartId, setUserCartId] = useState(null);
  // État pour suivre si l'utilisateur est authentifié
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // État pour suivre si le panier est en cours de chargement
  const [loading, setLoading] = useState(true);

  // Charger le panier depuis l'API ou localStorage au montage du composant
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        // Vérifier si l'utilisateur est authentifié
        const authenticated = cartService.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          // Essayer de charger le panier depuis le backend
          try {
            const cartData = await cartService.getUserCart();
            if (cartData && cartData.id) {
              setUserCartId(cartData.id);
              
              // Transformer les articles du panier dans le format attendu par notre application
              if (cartData.articles && cartData.articles.length > 0) {
                const formattedCart = cartData.articles.map(item => ({
                  id: item.produit.id,
                  titre: item.produit.nom,
                  prix: item.prix_unitaire,
                  image: item.produit.image,
                  quantite: item.quantite,
                  avec_consigne: item.avec_consigne,
                  prix_consigne: item.prix_consigne_unitaire,
                  articleId: item.id // Stocker l'ID de l'article pour les opérations futures
                }));
                setCart(formattedCart);
              } else {
                // Panier vide sur le backend
                setCart([]);
              }
            }
          } catch (apiError) {
            console.error('Erreur lors du chargement du panier depuis l\'API:', apiError);
            // En cas d'erreur avec l'API, charger depuis le localStorage
            loadFromLocalStorage();
          }
        } else {
          // Utilisateur non authentifié, charger depuis le localStorage
          loadFromLocalStorage();
          
          // Si des produits sont dans le localStorage, valider leur existence et prix
          if (cart.length > 0) {
            validateLocalCart();
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du panier:', error);
        loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };
    
    // Fonction pour charger le panier depuis le localStorage
    const loadFromLocalStorage = () => {
      const savedCart = localStorage.getItem('panier');
      if (savedCart) {
        try {
          const localCart = JSON.parse(savedCart);
          setCart(localCart);
        } catch (parseError) {
          console.error('Erreur lors du parsing du panier local:', parseError);
          setCart([]);
        }
      }
    };
    
    // Fonction pour valider les produits du panier local avec le backend
    const validateLocalCart = async () => {
      try {
        const savedCart = localStorage.getItem('panier');
        if (savedCart) {
          const localCart = JSON.parse(savedCart);
          if (localCart.length > 0) {
            // Extraire les IDs des produits
            const productIds = localCart.map(item => item.id);
            
            // Valider les produits avec le backend
            const validationResult = await cartService.validateAnonymousCart(productIds);
            
            if (validationResult.products) {
              // Mettre à jour les informations des produits (prix, disponibilité, etc.)
              const updatedCart = localCart.map(localItem => {
                const serverProduct = validationResult.products.find(p => p.id === localItem.id);
                if (serverProduct) {
                  return {
                    ...localItem,
                    prix: serverProduct.prix,
                    titre: serverProduct.nom,
                    image: serverProduct.image
                  };
                }
                return localItem;
              });
              
              // Filtrer les produits qui n'existent plus
              const filteredCart = updatedCart.filter(item => 
                !validationResult.missing_ids.includes(String(item.id))
              );
              
              // Mettre à jour le panier local
              setCart(filteredCart);
              localStorage.setItem('panier', JSON.stringify(filteredCart));
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de la validation du panier local:', error);
      }
    };
    
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Surveiller les changements dans le panier pour la validation
  useEffect(() => {
    // Cette dépendance est intentionnellement vide car nous ne voulons exécuter
    // cette validation que lorsque le composant est monté
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.length]);

  // Calculate total price - using useEffect to avoid dependency issues
  useEffect(() => {
    const subtotal = cart.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
    const shipping = subtotal >= 58000 ? 0 : deliveryFee;
    setTotal(subtotal + shipping);
  }, [cart, deliveryFee]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('panier', JSON.stringify(cart));
  }, [cart]);

  // Add product to cart
  const addToCart = async (product) => {
    try {
      const existingProduct = cart.find(item => item.id === product.id);
      
      if (existingProduct) {
        // Mise à jour locale du panier
        const updatedCart = cart.map(item => 
          item.id === product.id 
            ? { ...item, quantite: item.quantite + 1 } 
            : item
        );
        setCart(updatedCart);
        
        // Mise à jour du panier sur le backend si authentifié
        if (isAuthenticated && userCartId) {
          try {
            await cartService.updateItemAuthenticated(
              userCartId, 
              existingProduct.articleId, 
              existingProduct.quantite + 1
            );
          } catch (apiError) {
            console.error('Erreur API lors de la mise à jour du panier:', apiError);
          }
        }
        
        // Toujours mettre à jour le localStorage
        localStorage.setItem('panier', JSON.stringify(updatedCart));
      } else {
        // Préparer le nouveau produit pour le panier
        const newProduct = { 
          ...product, 
          quantite: 1,
          // Assurer que l'image est correctement formatée
          image: product.image || 'https://via.placeholder.com/300x300?text=Produit'
        };
        
        const newCart = [...cart, newProduct];
        setCart(newCart);
        
        // Ajouter au panier sur le backend si authentifié
        if (isAuthenticated && userCartId) {
          try {
            const response = await cartService.addItemAuthenticated(
              userCartId, 
              product.id, 
              1,
              false // sans consigne par défaut
            );
            
            // Mettre à jour l'articleId pour les opérations futures
            if (response && response.articles) {
              const addedArticle = response.articles.find(a => a.produit.id === product.id);
              if (addedArticle) {
                // Mettre à jour le cart avec l'articleId
                setCart(newCart.map(item => 
                  item.id === product.id 
                    ? { ...item, articleId: addedArticle.id } 
                    : item
                ));
              }
            }
          } catch (apiError) {
            console.error('Erreur API lors de l\'ajout au panier:', apiError);
          }
        }
        
        // Toujours mettre à jour le localStorage
        localStorage.setItem('panier', JSON.stringify(newCart));
      }
      
      alert(`${product.titre || product.nom} a été ajouté à votre panier.`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      alert(`Erreur lors de l'ajout au panier. Veuillez réessayer.`);
    }
  };

  // Remove product from cart
  const removeFromCart = async (productId) => {
    try {
      // Trouver le produit à supprimer pour obtenir son articleId si disponible
      const productToRemove = cart.find(item => item.id === productId);
      
      // Suppression locale du panier
      const updatedCart = cart.filter(item => item.id !== productId);
      setCart(updatedCart);
      
      // Mettre à jour le localStorage
      localStorage.setItem('panier', JSON.stringify(updatedCart));
      
      // Suppression du panier sur le backend si authentifié
      if (isAuthenticated && userCartId && productToRemove && productToRemove.articleId) {
        try {
          await cartService.removeItemAuthenticated(userCartId, productToRemove.articleId);
        } catch (apiError) {
          console.error('Erreur API lors de la suppression du produit:', apiError);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
      alert(`Erreur lors de la suppression du produit. Veuillez réessayer.`);
    }
  };

  // Update product quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(productId);
      } else {
        // Trouver le produit à mettre à jour
        const productToUpdate = cart.find(item => item.id === productId);
        
        // Mise à jour locale du panier
        const updatedCart = cart.map(item => 
          item.id === productId 
            ? { ...item, quantite: quantity } 
            : item
        );
        setCart(updatedCart);
        
        // Mettre à jour le localStorage
        localStorage.setItem('panier', JSON.stringify(updatedCart));
        
        // Mise à jour du panier sur le backend si authentifié
        if (isAuthenticated && userCartId && productToUpdate && productToUpdate.articleId) {
          try {
            await cartService.updateItemAuthenticated(userCartId, productToUpdate.articleId, quantity);
          } catch (apiError) {
            console.error('Erreur API lors de la mise à jour de la quantité:', apiError);
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error);
      alert(`Erreur lors de la mise à jour de la quantité. Veuillez réessayer.`);
    }
  };

  // Format number with spaces (e.g., 12 000)
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Fonction pour obtenir l'URL d'image correcte
  const getProductImage = (imagePath) => {
    return getImageUrl(imagePath);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      total, 
      deliveryFee,
      addToCart, 
      removeFromCart, 
      updateQuantity,
      formatNumber,
      loading,
      isAuthenticated,
      getProductImage
    }}>
      {children}
    </CartContext.Provider>
  );
};
