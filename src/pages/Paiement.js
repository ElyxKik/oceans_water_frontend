import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Paiement.css';
import { CartContext } from '../context/CartContext';
import orderService from '../services/orderService';

const Paiement = () => {
  const { cart, total, clearCart, loading } = useContext(CartContext);
  const navigate = useNavigate();

  // États pour gérer le processus de paiement
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // État pour gérer les données du formulaire
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    avenue: '',
    number: '',
    quartier: '',
    commune: '',
    reference: '',
    notes: '', // Champ pour les notes/instructions spéciales
    payment_method: '',
    card_number: '',
    expiry_date: '',
    cvv: '',
    mobile_operator: '',
    'transactio-id': '',
    'phone-number': ''
  });

  // Frais de livraison (désactivés)
  const deliveryFee = 0;
  // S'assurer que 'total' est un nombre valide
  const finalTotal = typeof total === 'number' ? total : 0;
  const totalWithDelivery = finalTotal + deliveryFee;

  // Gestionnaire de changement pour tous les inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Vérifier si le panier est vide seulement après le chargement
  useEffect(() => {
    // Ne vérifier que si le chargement est terminé
    if (!loading && cart.length === 0) {
      setError('Votre panier est vide. Veuillez ajouter des produits avant de procéder au paiement.');
    } else if (!loading && cart.length > 0) {
      // Effacer l'erreur si le panier contient des produits
      setError('');
    }
  }, [cart.length, loading]);

  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validation des champs obligatoires
      const { full_name, phone_number, avenue, number, quartier, commune, payment_method } = formData;
      if (!full_name || !phone_number || !avenue || !number || !quartier || !commune) {
        setError('Veuillez remplir tous les champs personnels et d\'adresse.');
        setIsSubmitting(false);
        return;
      }

      if (!payment_method) {
        setError('Veuillez sélectionner un mode de paiement.');
        setIsSubmitting(false);
        return;
      }

      // Nous permettons maintenant aux utilisateurs non connectés de passer commande
      // Vérification du token d'authentification
      const token = localStorage.getItem('authToken');
      const isAuthenticated = !!token;
      console.log('État d\'authentification:', isAuthenticated ? 'Authentifié' : 'Non authentifié');
      console.log('Token d\'authentification:', token);
      
      // Si l'utilisateur n'est pas authentifié mais qu'un email est fourni, utiliser cet email pour la commande anonyme
      if (!isAuthenticated && formData.email) {
        console.log('Email pour commande anonyme:', formData.email);
      }
      
      // Vérifier si le panier n'est pas vide
      if (cart.length === 0) {
        setError('Votre panier est vide. Impossible de passer une commande.');
        setIsSubmitting(false);
        return;
      }

      // Traitement selon le mode de paiement
      if (payment_method === 'carte_bancaire') {
        const { card_number, expiry_date, cvv } = formData;
        if (!card_number || !expiry_date || !cvv) {
          setError('Veuillez remplir tous les détails de la carte bancaire.');
          setIsSubmitting(false);
          return;
        }
        // Simulation de paiement par carte bancaire (pas d'appel API réel)
        console.log('Simulation de paiement par carte bancaire');
        setTimeout(() => {
          setPaymentSuccess(true);
          clearCart();
          setIsSubmitting(false);
          navigate('/confirmation-commande');
        }, 2000);
        return;
      } 
      
      else if (payment_method === 'mobile_money') {
        const { mobile_operator } = formData;
        const transactionId = formData['transactio-id'];
        const phoneNumber = formData['phone-number'];

        if (!mobile_operator || !transactionId || !phoneNumber) {
          setError('Veuillez choisir un opérateur et remplir les informations de transaction.');
          setIsSubmitting(false);
          return;
        }
        // Simulation de paiement par mobile money (pas d'appel API réel)
        console.log(`Simulation de paiement via ${formData.mobile_operator}`);
        console.log(`Transaction ID: ${transactionId}, Phone: ${phoneNumber}`);
        setTimeout(() => {
          setPaymentSuccess(true);
          clearCart();
          setIsSubmitting(false);
          navigate('/confirmation-commande');
        }, 2000);
        return;
      } 
      
      // Pour le paiement à la livraison (paiement_livraison)
      else if (payment_method === 'a_la_livraison') {
        // Créer une commande réelle dans le backend
        console.log('Création d\'une commande avec paiement à la livraison...');
      
        // Afficher le panier complet pour débogage
        console.log('Contenu complet du panier:', JSON.stringify(cart, null, 2));
        
        // Préparer les articles pour la commande
        const orderArticles = cart.map(item => {
          // Déboguer pour voir la structure exacte de l'article
          console.log('Structure de l\'article du panier:', item);
          
          // Déterminer l'ID du produit de manière sécurisée
          let produitId;
          let produitNom = '';
          
          if (item.produit && typeof item.produit === 'object' && item.produit.id) {
            produitId = item.produit.id;
            produitNom = item.produit.nom || 'Inconnu';
            console.log(`Produit objet: ID=${produitId}, Nom=${produitNom}`);
          } else if (item.produit_id) {
            produitId = item.produit_id;
            produitNom = item.nom || 'Inconnu';
            console.log(`Produit avec produit_id: ID=${produitId}, Nom=${produitNom}`);
          } else if (item.id) {
            produitId = item.id;
            produitNom = item.nom || 'Inconnu';
            console.log(`Produit avec id direct: ID=${produitId}, Nom=${produitNom}`);
          } else if (typeof item.produit === 'number') {
            produitId = item.produit;
            produitNom = item.nom || 'Inconnu';
            console.log(`Produit avec produit numérique: ID=${produitId}, Nom=${produitNom}`);
          } else {
            // Fallback si aucun ID n'est trouvé
            console.error('Impossible de déterminer l\'ID du produit pour l\'article:', item);
            produitId = 0; // Valeur par défaut qui sera gérée côté backend
          }
          
          return {
            produit: parseInt(produitId, 10), // Assurer que produit est un nombre entier
            quantite: parseInt(item.quantite, 10) || 1,
            avec_consigne: Boolean(item.avec_consigne) || false,
            bouteilles_echangees: 0 // Par défaut
          };
        });
        
        // Créer l'objet de données de commande avec tous les champs nécessaires
        const orderData = {
          // Adresse complète formatée
          adresse_livraison: `${avenue} ${number}, ${quartier}, ${commune}${formData.reference ? `, ${formData.reference}` : ''}`,
          telephone_livraison: phone_number,
          // Utiliser le champ notes pour son usage prévu - informations supplémentaires
          notes: formData.notes || '',
          // Ajouter le mode de paiement sélectionné
          mode_paiement: formData.payment_method || 'a_la_livraison',
          // date_livraison_prevue: null, // Optionnel
          articles: orderArticles
        };
        
        // Ajouter l'email et le nom du client pour les commandes anonymes
        if (!isAuthenticated && formData.email) {
          orderData.email_anonyme = formData.email;
          orderData.client_anonyme = formData.full_name;
          console.log('Informations client anonyme ajoutées:', orderData.client_anonyme, orderData.email_anonyme);
        }
        
        try {
          // Log détaillé des données de commande avant envoi
          console.log('Données de commande avant envoi:', JSON.stringify(orderData, null, 2));
          console.log('Articles formatés:', JSON.stringify(orderData.articles, null, 2));
          console.log('État d\'authentification:', isAuthenticated ? 'Authentifié' : 'Non authentifié');
          
          // Vérification des données avant envoi
          if (!orderData.adresse_livraison) {
            throw new Error('Adresse de livraison manquante');
          }
          
          if (!orderData.telephone_livraison) {
            throw new Error('Numéro de téléphone manquant');
          }
          
          if (!orderData.articles || !Array.isArray(orderData.articles) || orderData.articles.length === 0) {
            throw new Error('Articles de commande manquants ou format incorrect');
          }
          
          // Utiliser le service approprié selon que l'utilisateur est authentifié ou non
          let response;
          if (isAuthenticated) {
            console.log('Création d\'une commande authentifiée');
            response = await orderService.create(orderData);
          } else {
            console.log('Création d\'une commande anonyme');
            response = await orderService.createAnonymous(orderData);
          }
          
          console.log('Commande créée avec succès:', response);
          
          // Vider le panier après une commande réussie (frontend et backend)
          setPaymentSuccess(true);
          await clearCart(); // Cette fonction va maintenant appeler l'API pour vider le panier dans le backend
          
          // Afficher un message de confirmation et rediriger
          setIsSubmitting(false);
          navigate('/confirmation-commande');
        } catch (orderError) {
          console.error('Erreur lors de la création de la commande:', orderError);
          setError(orderError.response?.data?.detail || 'Erreur lors de la création de la commande. Veuillez réessayer.');
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la soumission de la commande:', error);
      
      const errorMessage = error.response?.data?.detail || 
                         (typeof error.response?.data === 'string' ? error.response.data : 'Une erreur est survenue lors de la création de la commande.');
      setError(errorMessage);

    } finally {
      setIsSubmitting(false);
    }
  };

  // URLs des logos
  const visaLogo = "https://via.placeholder.com/40x30/1a73e8/ffffff?text=Visa";
  const mastercardLogo = "https://via.placeholder.com/40x30/eb001b/ffffff?text=MC";
  const airtelMoneyLogo = "https://via.placeholder.com/40x30/ff0000/ffffff?text=Airtel";
  const orangeMoneyLogo = "https://via.placeholder.com/70x40/ff6600/ffffff?text=Orange";
  const mPesaLogo = "https://via.placeholder.com/40x30/00a651/ffffff?text=M-Pesa";

  return (
    <div className="payment-container">
      <h1>Finaliser votre commande</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Messages d'état */}
        <div className="status-messages">
          {loading && <div className="loading-message">Chargement du panier...</div>}
          {error && <div className="error-message">{error}</div>}
          {isSubmitting && <div className="loading-message">Traitement en cours...</div>}
          {paymentSuccess && <div className="success-message">Paiement réussi! Redirection...</div>}
        </div>

        <div className="form-sections-container">
          <div className="form-section-left">
            {/* Détails personnels */}
            <div className="section personal-details">
              <h2>Détails personnels</h2>
              <div className="form-group">
                <label htmlFor="full_name">Nom complet :</label>
                <input type="text" id="full_name" name="full_name" placeholder="prénom Nom" value={formData.full_name} onChange={handleChange} required disabled={isSubmitting} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Adresse email :</label>
                <input type="email" id="email" name="email" placeholder="votre@email.com" value={formData.email} onChange={handleChange} required={!localStorage.getItem('token')} disabled={isSubmitting} />
              </div>
              <div className="form-group">
                <label htmlFor="phone_number">Numéro de téléphone :</label>
                <input type="tel" id="phone_number" name="phone_number" placeholder="+243 XXXX XXX XXX" value={formData.phone_number} onChange={handleChange} required disabled={isSubmitting} />
              </div>
            </div>

            {/* Adresse de Livraison */}
            <div className="section delivery-details">
              <h2>Adresse de Livraison</h2>
              <div className="form-group">
                <label htmlFor="avenue">Avenue :</label>
                <input type="text" id="avenue" name="avenue" value={formData.avenue} onChange={handleChange} required disabled={isSubmitting} />
              </div>
              <div className="form-group">
                <label htmlFor="number">Numéro :</label>
                <input type="text" id="number" name="number" value={formData.number} onChange={handleChange} required disabled={isSubmitting} />
              </div>
              <div className="form-group">
                <label htmlFor="quartier">Quartier :</label>
                <input type="text" id="quartier" name="quartier" value={formData.quartier} onChange={handleChange} required disabled={isSubmitting} />
              </div>
              <div className="form-group">
                <label htmlFor="commune">Commune :</label>
                <input type="text" id="commune" name="commune" value={formData.commune} onChange={handleChange} required disabled={isSubmitting} />
              </div>
              <div className="form-group">
                <label htmlFor="reference">Référence :</label>
                <input type="text" id="reference" name="reference" value={formData.reference} onChange={handleChange} disabled={isSubmitting} />
              </div>
              <div className="form-group">
                <label htmlFor="notes">Note :</label>
                <input type="text" id="notes" name="notes" value={formData.notes} onChange={handleChange} disabled={isSubmitting} />
              </div>
            </div>
          </div>

          <div className="form-section-right">
            {/* Mode de paiement */}
            <div className="section payment-details">
              <h2>Mode de Paiement</h2>
              <div className="form-group">
                <label htmlFor="payment_method">Choisir le mode de paiement :</label>
                <select id="payment_method" name="payment_method" value={formData.payment_method} onChange={handleChange} required disabled={isSubmitting}>
                  <option value="">Sélectionnez</option>
                  <option value="carte_bancaire">Carte Bancaire</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="a_la_livraison">Paiement à la livraison</option>
                </select>
              </div>

              {/* Options pour Carte Bancaire */}
              {formData.payment_method === 'carte_bancaire' && (
                <div className="payment-option">
                  <h3>Paiement par Carte Bancaire</h3>
                  <div className="card-logos">
                    <img src={visaLogo} alt="Visa" className="card-logo" />
                    <img src={mastercardLogo} alt="Mastercard" className="card-logo" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="card_number">Numéro de carte :</label>
                    <input type="text" id="card_number" name="card_number" placeholder="XXXX XXXX XXXX XXXX" value={formData.card_number} onChange={handleChange} required disabled={isSubmitting} />
                  </div>
                  <div className="form-group-inline">
                    <div className="form-group">
                      <label htmlFor="expiry_date">Date d'expiration :</label>
                      <input type="text" id="expiry_date" name="expiry_date" placeholder="MM/AA" value={formData.expiry_date} onChange={handleChange} required disabled={isSubmitting} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cvv">CVV :</label>
                      <input type="text" id="cvv" name="cvv" placeholder="XXX" value={formData.cvv} onChange={handleChange} required disabled={isSubmitting} />
                    </div>
                  </div>
                </div>
              )}

              {/* Options pour Mobile Money */}
              {formData.payment_method === 'mobile_money' && (
                <div className="payment-option">
                  <h3>Paiement via Mobile Money</h3>
                  <div className="form-group">
                    <label>Choisir votre opérateur :</label>
                    <div className="radio-option">
                      <input type="radio" id="airtelmoney" name="mobile_operator" value="airtelmoney" checked={formData.mobile_operator === 'airtelmoney'} onChange={handleChange} disabled={isSubmitting} />
                      <label htmlFor="airtelmoney"><img src={airtelMoneyLogo} alt="Airtel Money" className="operator-logo" /> Airtel Money : <span className="pay-number">0975215488</span></label>
                    </div>
                    <div className="radio-option">
                      <input type="radio" id="orangemoney" name="mobile_operator" value="orangemoney" checked={formData.mobile_operator === 'orangemoney'} onChange={handleChange} disabled={isSubmitting} />
                      <label htmlFor="orangemoney"><img src={orangeMoneyLogo} alt="Orange Money" className="orange-money" /> Orange Money : <span className="pay-number">0852678911</span></label>
                    </div>
                    <div className="radio-option">
                      <input type="radio" id="mpsa" name="mobile_operator" value="mpsa" checked={formData.mobile_operator === 'mpsa'} onChange={handleChange} disabled={isSubmitting} />
                      <label htmlFor="mpsa"><img src={mPesaLogo} alt="M-Pesa" className="operator-logo" /> M-Pesa : <span className="pay-number">0834954866</span></label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="transactio-id">Numéro de transaction :</label>
                    <input type="text" id="transactio-id" name="transactio-id" value={formData['transactio-id']} onChange={handleChange} required disabled={isSubmitting} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone-number">Numéro de téléphone utilisé :</label>
                    <input type="tel" id="phone-number" name="phone-number" value={formData['phone-number']} onChange={handleChange} required disabled={isSubmitting} />
                  </div>
                </div>
              )}

              {/* Paiement à la livraison */}
              {formData.payment_method === 'a_la_livraison' && (
                <div className="payment-option">
                  <h3>Paiement à la livraison</h3>
                  <p>Vous paierez lors de la réception de votre commande. Assurez-vous d'avoir le montant exact.</p>
                </div>
              )}
            </div>

            {/* Résumé de la commande */}
            <div className="section order-summary">
              <h2>Résumé de la commande</h2>
              <div className="summary-items">
                {cart.map((item, index) => {
                  // Déterminer les informations du produit en toute sécurité
                  const productId = item.produit?.id || item.produit_id || item.id || index;
                  const productName = item.produit?.nom || item.nom || 'Produit';
                  const unitPrice = item.prix_unitaire ?? item.prix ?? 0;
                  return (
                    <div key={productId} className="summary-item">
                      <div className="item-details">
                        <span className="item-name">{productName}</span>
                        <span className="item-quantity">x{item.quantite}</span>
                      </div>
                      <span className="item-price">{(unitPrice * item.quantite).toLocaleString()} FC</span>
                    </div>
                  );
                })}
              </div>
              <div className="summary-total">
                <div className="total-line">
                  <span>Sous-total :</span>
                  <span>{finalTotal.toLocaleString()} FC</span>
                </div>
                <div className="total-line">
                  <span>Frais de livraison :</span>
                  <span>{deliveryFee.toLocaleString()} FC</span>
                </div>
                <div className="total-line grand-total">
                  <span>Total :</span>
                  <span>{totalWithDelivery.toLocaleString()} FC</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton de soumission */}
        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Traitement en cours...' : 'Confirmer la commande'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Paiement;
