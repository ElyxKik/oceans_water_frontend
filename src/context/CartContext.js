import React, { createContext, useState, useEffect } from 'react';
import { cartService, productService, getImageUrl } from '../services/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const deliveryFee = 6000; // Frais de livraison

  // État pour stocker l'ID du panier utilisateur authentifié
  const [userCartId, setUserCartId] = useState(null);
  // État pour stocker l'ID du panier anonyme
  const [anonymousCartId, setAnonymousCartId] = useState(null);
  // État pour suivre si l'utilisateur est authentifié
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // État pour suivre si le panier est en cours de chargement
  const [loading, setLoading] = useState(true);
  // État pour stocker les erreurs du panier
  const [cartErrors, setCartErrors] = useState([]);

  // Fonction pour récupérer les détails d'un produit par son ID
  const fetchProductDetails = async (productId) => {
    try {
      const productDetails = await productService.getById(productId);
      return productDetails;
    } catch (error) {
      console.error(`Impossible de récupérer les détails du produit ${productId}:`, error);
      setCartErrors(prev => [...prev, `Erreur lors de la récupération du produit ${productId}`]);
      return null;
    }
  };

  // Charger le panier depuis l'API au montage du composant
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        // Vérifier si l'utilisateur est authentifié
        const authenticated = cartService.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          // Utilisateur authentifié : charger son panier depuis le backend
          try {
            // Récupérer le panier utilisateur
            const cartData = await cartService.getUserCart();
            if (cartData && cartData.id) {
              setUserCartId(cartData.id);
              
              // Si un panier anonyme existe, le fusionner avec le panier utilisateur
              const storedAnonymousCartId = localStorage.getItem('anonymousCartId');
              if (storedAnonymousCartId) {
                try {
                  await cartService.mergeAnonymousCart(storedAnonymousCartId);
                  localStorage.removeItem('anonymousCartId');
                  setAnonymousCartId(null);
                  // Après la fusion, récupérer le panier mis à jour
                  const updatedCartData = await cartService.getUserCart();
                  if (updatedCartData && updatedCartData.id) {
                    cartData = updatedCartData;
                  }
                } catch (mergeError) {
                  console.error('Erreur lors de la fusion des paniers:', mergeError);
                }
              }
              
              // Transformer les articles du panier dans le format attendu par notre application
              if (cartData.articles && cartData.articles.length > 0) {
                // Réinitialiser les erreurs du panier
                setCartErrors([]);
                
                // Traiter les articles du panier de manière asynchrone
                const formattedCart = await Promise.all(cartData.articles.map(async (item) => {
                  // Vérifier si produit est un objet complet ou juste un ID
                  let produit;
                  
                  if (typeof item.produit !== 'object' || !item.produit.nom) {
                    // Récupérer l'ID du produit
                    const productId = typeof item.produit === 'object' ? item.produit.id : item.produit;
                    
                    // Récupérer les détails complets du produit depuis l'API
                    const productDetails = await fetchProductDetails(productId);
                    
                    if (productDetails) {
                      produit = productDetails;
                    } else {
                      // Ajouter une erreur si on ne peut pas récupérer les détails
                      setCartErrors(prev => [...prev, `Article ${item.id}: Données produit incomplètes (ID: ${productId})`]);
                      produit = { id: productId };
                    }
                  } else {
                    produit = item.produit;
                  }
                  
                  // Extraire les propriétés avec vérification d'existence
                  const productId = produit.id || 0;
                  const productName = produit.nom || `Produit #${productId}`;
                  const productBrand = produit.marque?.nom || '';
                  
                  // Formater correctement l'URL de l'image
                  let imageUrl = produit.image;
                  if (imageUrl && !imageUrl.startsWith('http')) {
                    imageUrl = `http://localhost:8000${imageUrl}`;
                  } else if (!imageUrl || imageUrl.includes('undefined')) {
                    // Utiliser un placeholder sécurisé avec l'ID du produit
                    const safeText = encodeURIComponent(`Produit #${productId}`).replace(/%20/g, '+');
                    imageUrl = `https://placehold.co/300x300/0096c7/ffffff/png?text=${safeText}`;
                  }

                  // Créer un objet article formaté avec des valeurs par défaut sécurisées
                  const formattedItem = {
                    id: productId,
                    titre: productName,
                    nom: productName,
                    marque: productBrand,
                    prix: item.prix_unitaire || 0,
                    image: imageUrl,
                    quantite: item.quantite || 1,
                    avec_consigne: item.avec_consigne || false,
                    prix_consigne: item.prix_consigne_unitaire || 0,
                    articleId: item.id, // Stocker l'ID de l'article pour les opérations futures
                    produit: produit // Stocker l'objet produit complet
                  };
                  
                  console.log('Article formaté:', formattedItem);
                  return formattedItem;
                }));
                setCart(formattedCart);
              } else {
                // Panier vide sur le backend
                setCart([]);
              }
            }
          } catch (apiError) {
            console.error('Erreur lors du chargement du panier utilisateur:', apiError);
            setCart([]);
          }
        } else {
          // Utilisateur non authentifié : utiliser un panier anonyme
          try {
            // Vérifier si un ID de panier anonyme existe déjà dans le localStorage
            let storedAnonymousCartId = localStorage.getItem('anonymousCartId');
            
            if (!storedAnonymousCartId) {
              // Créer un nouveau panier anonyme
              try {
                const newAnonymousCart = await cartService.createAnonymousCart();
                storedAnonymousCartId = newAnonymousCart.id;
                localStorage.setItem('anonymousCartId', storedAnonymousCartId);
              } catch (createError) {
                console.error('Erreur lors de la création du panier anonyme:', createError);
                // Fallback au localStorage si la création échoue
                loadFromLocalStorage();
                setLoading(false);
                return;
              }
            }
            
            setAnonymousCartId(storedAnonymousCartId);
            
            // Récupérer le panier anonyme depuis le backend
            try {
              const anonymousCartData = await cartService.getAnonymousCart(storedAnonymousCartId);
              
              if (anonymousCartData && anonymousCartData.articles && anonymousCartData.articles.length > 0) {
                // Réinitialiser les erreurs du panier
                setCartErrors([]);
                
                // Traiter les articles du panier de manière asynchrone
                const formattedCart = await Promise.all(anonymousCartData.articles.map(async (item) => {
                  // Vérifier si produit est un objet complet ou juste un ID
                  let produit;
                  
                  if (typeof item.produit !== 'object' || !item.produit.nom) {
                    // Récupérer l'ID du produit
                    const productId = typeof item.produit === 'object' ? item.produit.id : item.produit;
                    
                    // Récupérer les détails complets du produit depuis l'API
                    const productDetails = await fetchProductDetails(productId);
                    
                    if (productDetails) {
                      produit = productDetails;
                    } else {
                      // Ajouter une erreur si on ne peut pas récupérer les détails
                      setCartErrors(prev => [...prev, `Article ${item.id}: Données produit incomplètes (ID: ${productId})`]);
                      produit = { id: productId };
                    }
                  } else {
                    produit = item.produit;
                  }
                  
                  // Extraire les propriétés avec vérification d'existence
                  const productId = produit.id || 0;
                  const productName = produit.nom || `Produit #${productId}`;
                  const productBrand = produit.marque?.nom || '';
                  
                  // Formater correctement l'URL de l'image
                  let imageUrl = produit.image;
                  if (imageUrl && !imageUrl.startsWith('http')) {
                    imageUrl = `http://localhost:8000${imageUrl}`;
                  } else if (!imageUrl || imageUrl.includes('undefined')) {
                    // Utiliser un placeholder sécurisé avec l'ID du produit
                    const safeText = encodeURIComponent(`Produit #${productId}`).replace(/%20/g, '+');
                    imageUrl = `https://placehold.co/300x300/0096c7/ffffff/png?text=${safeText}`;
                  }

                  // Créer un objet article formaté avec des valeurs par défaut sécurisées
                  return {
                    id: productId,
                    titre: productName,
                    nom: productName,
                    marque: productBrand,
                    prix: item.prix_unitaire || 0,
                    image: imageUrl,
                    quantite: item.quantite || 1,
                    avec_consigne: item.avec_consigne || false,
                    prix_consigne: item.prix_consigne_unitaire || 0,
                    articleId: item.id,
                    produit: produit
                  };
                }));
                setCart(formattedCart);
              } else {
                // Panier anonyme vide
                setCart([]);
              }
            } catch (getError) {
              console.error('Erreur lors de la récupération du panier anonyme:', getError);
              // Fallback au localStorage si la récupération échoue
              loadFromLocalStorage();
            }
          } catch (error) {
            console.error('Erreur lors de la gestion du panier anonyme:', error);
            // Fallback au localStorage en cas d'erreur
            loadFromLocalStorage();
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du panier:', error);
        loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };
    
    // Fonction pour charger le panier depuis le localStorage (fonction de secours)
  const loadFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('panier');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        return parsedCart; // Retourner le panier pour utilisation dans validateLocalCart
      }
      return [];
    } catch (error) {
      console.error('Erreur lors du chargement du panier depuis localStorage:', error);
      return [];
    }
  };
    
    // Fonction pour valider les produits du panier local avec le backend
  const validateLocalCart = async (localCartItems) => {
    try {
      // Extraire les IDs des produits du panier local
      const productIds = localCartItems.map(item => item.id);
      
      if (productIds.length === 0) {
        return;
      }
      
      // Valider les produits avec le backend
      const validationResponse = await cartService.validateAnonymousCart(productIds);
      
      if (validationResponse && validationResponse.valid_products) {
        // Mettre à jour les détails des produits avec les données du backend
        const updatedCart = localCartItems
          .filter(item => validationResponse.valid_products.some(validProduct => validProduct.id === item.id))
          .map(item => {
            const validProduct = validationResponse.valid_products.find(p => p.id === item.id);
            
            if (validProduct) {
              // Formater correctement l'URL de l'image
              let imageUrl = validProduct.image;
              if (imageUrl && !imageUrl.startsWith('http')) {
                imageUrl = `http://localhost:8000${imageUrl}`;
              } else if (!imageUrl) {
                imageUrl = `https://via.placeholder.com/300x300?text=${encodeURIComponent(validProduct.nom)}`;
              }
              
              return {
                ...item,
                titre: validProduct.nom,
                nom: validProduct.nom,
                prix: validProduct.prix,
                marque: validProduct.marque?.nom || '',
                image: imageUrl,
                produit: validProduct // Stocker l'objet produit complet
              };
            }
            return item;
          });
        
        setCart(updatedCart);
        
        // Si un panier anonyme existe, essayer de synchroniser les produits
        if (anonymousCartId) {
          try {
            // Pour chaque produit validé, l'ajouter au panier anonyme
            for (const item of updatedCart) {
              await cartService.addItemAnonymous(
                anonymousCartId,
                item.id,
                item.quantite,
                item.avec_consigne || false
              );
            }
            // Après synchronisation, ne plus utiliser le localStorage
            localStorage.removeItem('panier');
          } catch (syncError) {
            console.error('Erreur lors de la synchronisation avec le panier anonyme:', syncError);
            // Fallback au localStorage en cas d'erreur
            localStorage.setItem('panier', JSON.stringify(updatedCart));
          }
        } else {
          // Pas de panier anonyme, utiliser le localStorage comme fallback
          localStorage.setItem('panier', JSON.stringify(updatedCart));
        }
        
        // Afficher un message si des produits ont été supprimés
        if (updatedCart.length < localCartItems.length) {
          const removedCount = localCartItems.length - updatedCart.length;
          console.warn(`${removedCount} produit(s) ont été supprimés du panier car ils ne sont plus disponibles.`);
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
    const newTotal = cart.reduce((sum, item) => {
      const itemPrice = parseFloat(item.prix) || 0;
      const consignePrice = item.avec_consigne ? (parseFloat(item.prix_consigne) || 0) : 0;
      return sum + (itemPrice + consignePrice) * item.quantite;
    }, 0);
    setTotal(newTotal);
  }, [cart]);
  
  // Fonction pour synchroniser l'état du panier après connexion/déconnexion
  const syncCartAfterAuth = async (isLoggedIn) => {
    try {
      if (isLoggedIn) {
        // L'utilisateur vient de se connecter
        setIsAuthenticated(true);
        
        // Si un panier anonyme existe, le fusionner avec le panier utilisateur
        if (anonymousCartId) {
          try {
            await cartService.mergeAnonymousCart(anonymousCartId);
            localStorage.removeItem('anonymousCartId');
            setAnonymousCartId(null);
          } catch (mergeError) {
            console.error('Erreur lors de la fusion des paniers après connexion:', mergeError);
          }
        }
        
        // Charger le panier utilisateur
        try {
          const cartData = await cartService.getUserCart();
          if (cartData && cartData.id) {
            setUserCartId(cartData.id);
            
            // Transformer les articles du panier
            if (cartData.articles && cartData.articles.length > 0) {
              const formattedCart = cartData.articles.map(item => {
                // Formater l'URL de l'image
                let imageUrl = item.produit.image;
                if (imageUrl && !imageUrl.startsWith('http')) {
                  imageUrl = `http://localhost:8000${imageUrl}`;
                } else if (!imageUrl) {
                  imageUrl = `https://via.placeholder.com/300x300?text=${encodeURIComponent(item.produit.nom)}`;
                }

                return {
                  id: item.produit.id,
                  titre: item.produit.nom,
                  nom: item.produit.nom,
                  marque: item.produit.marque?.nom || '',
                  prix: item.prix_unitaire,
                  image: imageUrl,
                  quantite: item.quantite,
                  avec_consigne: item.avec_consigne,
                  prix_consigne: item.prix_consigne_unitaire,
                  articleId: item.id,
                  produit: item.produit
                };
              });
              setCart(formattedCart);
            } else {
              setCart([]);
            }
          }
        } catch (apiError) {
          console.error('Erreur lors du chargement du panier utilisateur après connexion:', apiError);
        }
      } else {
        // L'utilisateur vient de se déconnecter
        setIsAuthenticated(false);
        setUserCartId(null);
        
        // Créer un nouveau panier anonyme
        try {
          const newAnonymousCart = await cartService.createAnonymousCart();
          const newAnonymousCartId = newAnonymousCart.id;
          localStorage.setItem('anonymousCartId', newAnonymousCartId);
          setAnonymousCartId(newAnonymousCartId);
          
          // Synchroniser le panier actuel avec le nouveau panier anonyme
          for (const item of cart) {
            await cartService.addItemAnonymous(
              newAnonymousCartId,
              item.id,
              item.quantite,
              item.avec_consigne || false
            );
          }
        } catch (createError) {
          console.error('Erreur lors de la création du panier anonyme après déconnexion:', createError);
          // Fallback au localStorage
          localStorage.setItem('panier', JSON.stringify(cart));
        }
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation du panier après changement d\'authentification:', error);
    }
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('panier', JSON.stringify(cart));
  }, [cart]);

  // Ajouter un produit au panier
  const addToCart = async (product) => {
    try {
      // Vérifier si le produit a du stock disponible
      // Le stock peut être dans product.stock ou dans product.produit.stock
      const stockDisponible = product.stock !== undefined ? product.stock : 
                           (product.produit && product.produit.stock !== undefined ? product.produit.stock : 0);
      
      if (stockDisponible <= 0) {
        alert(`Désolé, ${product.titre || product.nom || 'Ce produit'} est actuellement en rupture de stock.`);
        return;
      }
      
      // Vérifier si le produit est déjà dans le panier
      const existingProduct = cart.find(item => item.id === product.id);
      
      if (existingProduct) {
        // Si le produit existe déjà, vérifier si on peut incrémenter la quantité
        if (existingProduct.quantite >= stockDisponible) {
          alert(`Désolé, il n'y a que ${stockDisponible} unités disponibles en stock pour ce produit.`);
          return;
        }
        
        // Mise à jour locale du panier
        const updatedCart = cart.map(item => 
          item.id === product.id 
            ? { ...item, quantite: item.quantite + 1 } 
            : item
        );
        setCart(updatedCart);
        
        // Mise à jour du panier sur le backend
        try {
          if (isAuthenticated && userCartId) {
            // Utilisateur authentifié
            await cartService.updateItemAuthenticated(
              userCartId, 
              existingProduct.articleId, 
              existingProduct.quantite + 1
            );
          } else if (anonymousCartId) {
            // Utilisateur anonyme
            await cartService.updateItemAnonymous(
              anonymousCartId,
              existingProduct.articleId,
              existingProduct.quantite + 1
            );
          }
        } catch (apiError) {
          console.error('Erreur API lors de la mise à jour du panier:', apiError);
          // Fallback au localStorage en cas d'erreur
          localStorage.setItem('panier', JSON.stringify(updatedCart));
        }
      } else {
        // Préparer le nouveau produit pour le panier
        // Formater correctement l'URL de l'image
        let imageUrl = product.image;
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `http://localhost:8000${imageUrl}`;
        } else if (!imageUrl) {
          imageUrl = `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.titre || product.nom || 'Produit')}`;
        }
        
        const newProduct = { 
          ...product, 
          quantite: 1,
          // Assurer que le titre est toujours défini
          titre: product.titre || product.nom || 'Produit',
          nom: product.nom || product.titre || 'Produit', // Assurer la compatibilité dans les deux sens
          // Assurer que l'image est correctement formatée
          image: imageUrl
        };
        
        // Ajouter au panier sur le backend
        try {
          let response;
          if (isAuthenticated && userCartId) {
            // Utilisateur authentifié
            response = await cartService.addItemAuthenticated(
              userCartId, 
              product.id, 
              1,
              false // sans consigne par défaut
            );
          } else if (anonymousCartId) {
            // Utilisateur anonyme
            response = await cartService.addItemAnonymous(
              anonymousCartId,
              product.id,
              1,
              false // sans consigne par défaut
            );
          }
          
          // Mettre à jour l'articleId pour les opérations futures
          if (response && response.articles) {
            const addedArticle = response.articles.find(a => a.produit.id === product.id);
            if (addedArticle) {
              // Ajouter le produit avec l'articleId
              const productWithArticleId = { 
                ...newProduct, 
                articleId: addedArticle.id,
                produit: addedArticle.produit
              };
              setCart([...cart, productWithArticleId]);
            } else {
              // Fallback si l'article n'est pas trouvé dans la réponse
              setCart([...cart, newProduct]);
            }
          } else {
            // Fallback si la réponse ne contient pas d'articles
            setCart([...cart, newProduct]);
          }
        } catch (apiError) {
          console.error('Erreur API lors de l\'ajout au panier:', apiError);
          // Fallback au localStorage en cas d'erreur
          const newCart = [...cart, newProduct];
          setCart(newCart);
          localStorage.setItem('panier', JSON.stringify(newCart));
        }
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
      
      // Suppression du panier sur le backend
      if (productToRemove && productToRemove.articleId) {
        try {
          if (isAuthenticated && userCartId) {
            // Utilisateur authentifié
            await cartService.removeItemAuthenticated(userCartId, productToRemove.articleId);
          } else if (anonymousCartId) {
            // Utilisateur anonyme
            await cartService.removeItemAnonymous(anonymousCartId, productToRemove.articleId);
          }
        } catch (apiError) {
          console.error('Erreur API lors de la suppression du produit:', apiError);
          // Fallback au localStorage en cas d'erreur
          localStorage.setItem('panier', JSON.stringify(updatedCart));
        }
      } else {
        // Fallback au localStorage si l'articleId n'est pas disponible
        localStorage.setItem('panier', JSON.stringify(updatedCart));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
      alert(`Erreur lors de la suppression du produit. Veuillez réessayer.`);
    }
  };

  // Update product quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      // Garantir que la quantité est au moins 1
      const safeQuantity = Math.max(1, quantity);
      
      // Trouver le produit à mettre à jour
      const productToUpdate = cart.find(item => item.id === productId);
      
      // Vérifier si le stock est suffisant
      // Le stock peut être dans productToUpdate.stock ou dans productToUpdate.produit.stock
      const stockDisponible = productToUpdate.stock !== undefined ? productToUpdate.stock : 
                           (productToUpdate.produit && productToUpdate.produit.stock !== undefined ? productToUpdate.produit.stock : 0);
      
      if (stockDisponible > 0 && safeQuantity > stockDisponible) {
        alert(`Désolé, il n'y a que ${stockDisponible} unités disponibles en stock pour ce produit.`);
        // Limiter la quantité au stock disponible
        return updateQuantity(productId, stockDisponible);
      }
      
      // Mise à jour locale du panier
      const updatedCart = cart.map(item => 
        item.id === productId 
          ? { ...item, quantite: safeQuantity } 
          : item
      );
      setCart(updatedCart);
      
      // Mise à jour du panier sur le backend
      if (productToUpdate && productToUpdate.articleId) {
        try {
          if (isAuthenticated && userCartId) {
            // Utilisateur authentifié
            await cartService.updateItemAuthenticated(userCartId, productToUpdate.articleId, safeQuantity);
          } else if (anonymousCartId) {
            // Utilisateur anonyme
            await cartService.updateItemAnonymous(anonymousCartId, productToUpdate.articleId, safeQuantity);
          }
        } catch (apiError) {
          console.error('Erreur API lors de la mise à jour de la quantité:', apiError);
          // Fallback au localStorage en cas d'erreur
          localStorage.setItem('panier', JSON.stringify(updatedCart));
        }
      } else {
        // Fallback au localStorage si l'articleId n'est pas disponible
        localStorage.setItem('panier', JSON.stringify(updatedCart));
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

  // Fonction pour vider complètement le panier
  const clearCart = async () => {
    try {
      setCart([]);
      localStorage.removeItem('panier');
      
      try {
        if (isAuthenticated && userCartId) {
          // Vider le panier utilisateur
          await cartService.clearCart(userCartId);
        } else if (anonymousCartId) {
          // Vider le panier anonyme
          await cartService.clearAnonymousCart(anonymousCartId);
        }
      } catch (apiError) {
        console.error('Erreur API lors du vidage du panier:', apiError);
      }
    } catch (error) {
      console.error('Erreur lors du vidage du panier:', error);
    }
  };

  // Fonction pour obtenir l'URL d'image correcte
  const getProductImage = (imagePath) => {
    return getImageUrl(imagePath);
  };

  // Composant pour afficher les erreurs du panier
  const CartErrors = () => {
    if (cartErrors.length === 0) return null;
    
    return (
      <div className="cart-errors">
        <h3>Problèmes détectés dans votre panier</h3>
        <ul>
          {cartErrors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
        <p>Veuillez contacter le support si ces erreurs persistent.</p>
      </div>
    );
  };

  // Valeur du contexte à exposer
  const contextValue = {
    cart,
    total,
    deliveryFee,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loading,
    isAuthenticated,
    syncCartAfterAuth,
    formatNumber,
    getProductImage,
    cartErrors,
    CartErrors
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
