import React, { useState } from 'react';
import '../styles/Support.css';

const Support = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // FAQ data
  const faqs = [
    {
      question: "Comment suivre ma commande ?",
      answer: "Vous pouvez suivre votre commande en vous connectant à votre compte et en accédant à la section \"Mes Commandes\"."
    },
    {
      question: "Comment modifier mon mot de passe ?",
      answer: "Rendez-vous dans la section \"Mon Profil\" et cliquez sur \"Modifier le mot de passe\"."
    },
    {
      question: "Que faire si j'ai oublié mon mot de passe ?",
      answer: "Vous pouvez réinitialiser votre mot de passe en cliquant sur \"Mot de passe oublié\" sur la page de connexion."
    },
    {
      question: "Comment annuler une commande ?",
      answer: "Pour annuler une commande récente, contactez notre service client dans les 2 heures suivant votre achat."
    },
    {
      question: "Quels sont les délais de livraison ?",
      answer: "Les délais de livraison varient selon votre localisation. En général, nous livrons dans Kinshasa en 24h à 48h."
    }
  ];

  const toggleSection = (sectionId) => {
    if (activeSection === sectionId) {
      setActiveSection(null);
    } else {
      setActiveSection(sectionId);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dans une application réelle, vous enverriez les données du formulaire à une API
    // Pour l'instant, nous allons simplement réinitialiser le formulaire
    alert('Votre message a été envoyé avec succès!');
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className="support-container">
      <h1>Support Client</h1>
      <p className="support-subtitle">Nous sommes là pour vous aider !</p>

      {/* Options de support */}
      <div className="support-options">
        <div className="option" id="contact-form-section">
          <h2>Contactez-nous</h2>
          <p>Envoyez-nous un message, nous vous répondrons dans les plus brefs délais.</p>
          <button 
            className="option-btn" 
            onClick={() => toggleSection('contact-form')}
          >
            Nous contacter
          </button>
        </div>

        <div className="option" id="faq-section">
          <h2>FAQ</h2>
          <p>Consultez les questions fréquemment posées.</p>
          <button 
            className="option-btn" 
            onClick={() => toggleSection('faq')}
          >
            Voir FAQ
          </button>
        </div>
      </div>

      {/* Formulaire de contact */}
      <div className={`section ${activeSection === 'contact-form' ? 'active' : ''}`} id="contact-form">
        <h2>Formulaire de Contact</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Nom :</label>
          <input 
            type="text" 
            id="name" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Votre nom"
            required
          />

          <label htmlFor="email">Email :</label>
          <input 
            type="email" 
            id="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Votre email"
            required
          />

          <label htmlFor="message">Message :</label>
          <textarea 
            id="message" 
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5" 
            placeholder="Votre message"
            required
          ></textarea>

          <button type="submit" className="submit-btn">Envoyer</button>
        </form>
      </div>

      {/* FAQ */}
      <div className={`section ${activeSection === 'faq' ? 'active' : ''}`} id="faq">
        <h2>Questions Fréquentes</h2>
        {faqs.map((faq, index) => (
          <div className="faq-item" key={index}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>

      {/* Contact direct */}
      <div className="contact-direct">
        <h3>Nous contacter directement</h3>
        <p>Par téléphone : <strong>+243 975215488</strong></p>
        <p>Par email : <strong>support@ocnswater.com</strong></p>
      </div>
    </div>
  );
};

export default Support;
