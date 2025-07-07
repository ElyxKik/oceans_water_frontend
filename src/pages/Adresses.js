import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Adresses.css';

const Adresses = () => {
  // Mock addresses data - in a real app, this would come from an API
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Domicile',
      street: '123 Avenue Principale',
      city: 'Kinshasa',
      district: 'Gombe',
      phone: '+243 123 456 789',
      isDefault: true
    },
    {
      id: 2,
      name: 'Bureau',
      street: '45 Boulevard du Commerce',
      city: 'Kinshasa',
      district: 'Limete',
      phone: '+243 987 654 321',
      isDefault: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    city: 'Kinshasa',
    district: '',
    phone: '',
    isDefault: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!newAddress.name || !newAddress.street || !newAddress.district || !newAddress.phone) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // Create new address with unique ID
    const newId = addresses.length > 0 ? Math.max(...addresses.map(a => a.id)) + 1 : 1;
    const addressToAdd = {
      ...newAddress,
      id: newId
    };
    
    // If new address is set as default, update other addresses
    if (newAddress.isDefault) {
      setAddresses(prev => 
        prev.map(addr => ({
          ...addr,
          isDefault: false
        }))
      );
    }
    
    // Add the new address
    setAddresses(prev => [...prev, addressToAdd]);
    
    // Reset form and hide it
    setNewAddress({
      name: '',
      street: '',
      city: 'Kinshasa',
      district: '',
      phone: '',
      isDefault: false
    });
    setShowAddForm(false);
  };

  const handleSetDefault = (id) => {
    setAddresses(prev => 
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }))
    );
  };

  const handleDeleteAddress = (id) => {
    // Don't allow deletion of the default address
    const addressToDelete = addresses.find(addr => addr.id === id);
    if (addressToDelete.isDefault) {
      alert('Vous ne pouvez pas supprimer l\'adresse par défaut');
      return;
    }
    
    // Remove the address
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  return (
    <div className="adresses-container">
      <h1>Mes Adresses de Livraison</h1>
      
      <div className="addresses-list">
        {addresses.map(address => (
          <div className={`address-card ${address.isDefault ? 'default' : ''}`} key={address.id}>
            {address.isDefault && <span className="default-badge">Par défaut</span>}
            
            <h3>{address.name}</h3>
            <p>{address.street}</p>
            <p>{address.district}, {address.city}</p>
            <p>Tél: {address.phone}</p>
            
            <div className="address-actions">
              {!address.isDefault && (
                <button 
                  className="set-default-btn"
                  onClick={() => handleSetDefault(address.id)}
                >
                  Définir par défaut
                </button>
              )}
              
              <button 
                className="edit-address-btn"
                onClick={() => alert('Fonctionnalité à venir')}
              >
                Modifier
              </button>
              
              {!address.isDefault && (
                <button 
                  className="delete-address-btn"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  Supprimer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {showAddForm ? (
        <div className="add-address-form">
          <h2>Ajouter une nouvelle adresse</h2>
          
          <form onSubmit={handleAddAddress}>
            <div className="form-group">
              <label htmlFor="name">Nom de l'adresse *</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={newAddress.name} 
                onChange={handleInputChange}
                placeholder="Ex: Domicile, Bureau, etc."
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="street">Rue et numéro *</label>
              <input 
                type="text" 
                id="street" 
                name="street" 
                value={newAddress.street} 
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="district">Commune *</label>
              <input 
                type="text" 
                id="district" 
                name="district" 
                value={newAddress.district} 
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="city">Ville</label>
              <input 
                type="text" 
                id="city" 
                name="city" 
                value={newAddress.city} 
                onChange={handleInputChange}
                readOnly
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Téléphone de contact *</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={newAddress.phone} 
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group checkbox">
              <input 
                type="checkbox" 
                id="isDefault" 
                name="isDefault" 
                checked={newAddress.isDefault} 
                onChange={handleInputChange}
              />
              <label htmlFor="isDefault">Définir comme adresse par défaut</label>
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                Annuler
              </button>
              <button type="submit" className="save-btn">
                Ajouter l'adresse
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button className="add-address-btn" onClick={() => setShowAddForm(true)}>
          + Ajouter une nouvelle adresse
        </button>
      )}
      
      <div className="back-link">
        <Link to="/mon-compte.html">Retour à mon compte</Link>
      </div>
    </div>
  );
};

export default Adresses;
