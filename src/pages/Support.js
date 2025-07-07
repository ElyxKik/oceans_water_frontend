import React, { useState } from 'react';
import '../styles/Support.css';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    orderNumber: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // FAQ data
  const faqs = [
    {
      question: "Comment suivre ma commande ?",
      answer: "Vous pouvez suivre votre commande en vous connectant à votre compte et en visitant la section 'Mes Commandes'. Vous y trouverez toutes les informations concernant l'état de votre livraison."
    },
    {
      question: "Quels sont les délais de livraison ?",
      answer: "Les délais de livraison varient selon votre localisation. En général, nous livrons dans Kinshasa en 24h à 48h. Pour les autres villes, le délai peut aller jusqu'à 5 jours ouvrables."
    },
    {
      question: "Comment puis-je modifier ou annuler ma commande ?",
      answer: "Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant sa validation. Pour cela, contactez notre service client par téléphone au +243 123 456 789 ou par email à support@oceanswater.cd."
    },
    {
      question: "Quels sont les modes de paiement acceptés ?",
      answer: "Nous acceptons les paiements par Mobile Money (M-Pesa, Orange Money, Airtel Money) ainsi que le paiement à la livraison dans certaines zones de Kinshasa."
    },
    {
      question: "Comment retourner un produit ?",
      answer: "Si vous avez reçu un produit endommagé ou non conforme, vous pouvez le retourner dans un délai de 48h après réception. Contactez notre service client pour organiser le retour et le remplacement."
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }
    
    // In a real app, you would send the form data to an API
    // For now, we'll just simulate a successful submission
    setError('');
    setSubmitted(true);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      orderNumber: ''
    });
  };

  return (
    <div className="support-container">
      <h1>Support Client</h1>
      
      <div className="support-sections">
        <div className="faq-section">
          <h2>Questions fréquentes</h2>
          
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div className="faq-item" key={index}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="contact-section">
          <h2>Nous contacter</h2>
          
          <div className="contact-info">
            <div className="contact-method">
              <h3>Par téléphone</h3>
              <p>+243 123 456 789</p>
              <p className="contact-hours">Du lundi au samedi, 8h - 18h</p>
            </div>
            
            <div className="contact-method">
              <h3>Par email</h3>
              <p>support@oceanswater.cd</p>
              <p className="contact-hours">Réponse sous 24h</p>
            </div>
            
            <div className="contact-method">
              <h3>Adresse</h3>
              <p>123 Avenue du Commerce</p>
              <p>Gombe, Kinshasa</p>
              <p className="contact-hours">Bureaux ouverts du lundi au vendredi, 9h - 17h</p>
            </div>
          </div>
          
          <div className="contact-form">
            <h3>Formulaire de contact</h3>
            
            {submitted ? (
              <div className="success-message">
                <p>Votre message a été envoyé avec succès. Notre équipe vous répondra dans les plus brefs délais.</p>
                <button onClick={() => setSubmitted(false)}>Envoyer un autre message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                  <label htmlFor="name">Nom complet *</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="orderNumber">Numéro de commande (optionnel)</label>
                  <input 
                    type="text" 
                    id="orderNumber" 
                    name="orderNumber" 
                    value={formData.orderNumber} 
                    onChange={handleChange}
                    placeholder="Ex: CMD-001"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Sujet *</label>
                  <select 
                    id="subject" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="question">Question sur un produit</option>
                    <option value="order">Problème avec ma commande</option>
                    <option value="delivery">Question sur la livraison</option>
                    <option value="return">Retour produit</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange}
                    rows="5"
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="submit-btn">
                  Envoyer le message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
