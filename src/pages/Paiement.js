import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Paiement.css';

const Paiement = () => {
  // Mock payment methods - in a real app, this would come from an API
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'mobile_money',
      provider: 'M-Pesa',
      number: '+243 98 765 4321',
      isDefault: true
    },
    {
      id: 2,
      type: 'mobile_money',
      provider: 'Orange Money',
      number: '+243 81 234 5678',
      isDefault: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    type: 'mobile_money',
    provider: '',
    number: '',
    isDefault: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPayment(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddPayment = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!newPayment.provider || !newPayment.number) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // Create new payment method with unique ID
    const newId = paymentMethods.length > 0 ? Math.max(...paymentMethods.map(p => p.id)) + 1 : 1;
    const paymentToAdd = {
      ...newPayment,
      id: newId
    };
    
    // If new payment is set as default, update other payment methods
    if (newPayment.isDefault) {
      setPaymentMethods(prev => 
        prev.map(method => ({
          ...method,
          isDefault: false
        }))
      );
    }
    
    // Add the new payment method
    setPaymentMethods(prev => [...prev, paymentToAdd]);
    
    // Reset form and hide it
    setNewPayment({
      type: 'mobile_money',
      provider: '',
      number: '',
      isDefault: false
    });
    setShowAddForm(false);
  };

  const handleSetDefault = (id) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const handleDeletePayment = (id) => {
    // Don't allow deletion of the default payment method
    const methodToDelete = paymentMethods.find(method => method.id === id);
    if (methodToDelete.isDefault) {
      alert('Vous ne pouvez pas supprimer la méthode de paiement par défaut');
      return;
    }
    
    // Remove the payment method
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  return (
    <div className="paiement-container">
      <h1>Mes Méthodes de Paiement</h1>
      
      <div className="payment-methods-list">
        {paymentMethods.map(method => (
          <div className={`payment-method-card ${method.isDefault ? 'default' : ''}`} key={method.id}>
            {method.isDefault && <span className="default-badge">Par défaut</span>}
            
            <div className="payment-method-icon">
              {method.provider === 'M-Pesa' && <span className="mpesa-icon">M-Pesa</span>}
              {method.provider === 'Orange Money' && <span className="orange-money-icon">Orange Money</span>}
              {method.provider === 'Airtel Money' && <span className="airtel-money-icon">Airtel Money</span>}
            </div>
            
            <div className="payment-method-details">
              <h3>{method.provider}</h3>
              <p>{method.number}</p>
            </div>
            
            <div className="payment-method-actions">
              {!method.isDefault && (
                <button 
                  className="set-default-btn"
                  onClick={() => handleSetDefault(method.id)}
                >
                  Définir par défaut
                </button>
              )}
              
              <button 
                className="edit-payment-btn"
                onClick={() => alert('Fonctionnalité à venir')}
              >
                Modifier
              </button>
              
              {!method.isDefault && (
                <button 
                  className="delete-payment-btn"
                  onClick={() => handleDeletePayment(method.id)}
                >
                  Supprimer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {showAddForm ? (
        <div className="add-payment-form">
          <h2>Ajouter une nouvelle méthode de paiement</h2>
          
          <form onSubmit={handleAddPayment}>
            <div className="form-group">
              <label htmlFor="type">Type de paiement *</label>
              <select 
                id="type" 
                name="type" 
                value={newPayment.type} 
                onChange={handleInputChange}
                required
              >
                <option value="mobile_money">Mobile Money</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="provider">Fournisseur *</label>
              <select 
                id="provider" 
                name="provider" 
                value={newPayment.provider} 
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionnez un fournisseur</option>
                <option value="M-Pesa">M-Pesa</option>
                <option value="Orange Money">Orange Money</option>
                <option value="Airtel Money">Airtel Money</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="number">Numéro de téléphone *</label>
              <input 
                type="tel" 
                id="number" 
                name="number" 
                value={newPayment.number} 
                onChange={handleInputChange}
                placeholder="+243 XX XXX XXXX"
                required
              />
            </div>
            
            <div className="form-group checkbox">
              <input 
                type="checkbox" 
                id="isDefault" 
                name="isDefault" 
                checked={newPayment.isDefault} 
                onChange={handleInputChange}
              />
              <label htmlFor="isDefault">Définir comme méthode de paiement par défaut</label>
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                Annuler
              </button>
              <button type="submit" className="save-btn">
                Ajouter la méthode de paiement
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button className="add-payment-btn" onClick={() => setShowAddForm(true)}>
          + Ajouter une nouvelle méthode de paiement
        </button>
      )}
      
      <div className="payment-info">
        <h3>Informations sur les paiements</h3>
        <p>
          Ocean's Water accepte les paiements par Mobile Money (M-Pesa, Orange Money, Airtel Money).
          Vos informations de paiement sont sécurisées et ne sont jamais partagées avec des tiers.
        </p>
      </div>
      
      <div className="back-link">
        <Link to="/mon-compte.html">Retour à mon compte</Link>
      </div>
    </div>
  );
};

export default Paiement;
