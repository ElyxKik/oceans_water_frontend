import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="bas-depage-footer">
        {/* Premier bloc: Marques disponibles */}
        <div className="bas-depage-footer-bloc">
          <h3>Marques disponibles</h3>
          <ul>
            <li>Swissta</li>
            <li>Spa</li>
            <li>Evian</li>
            <li>Abeer Cooling</li>
            <li>Eau Vive</li>
            <li>Eden</li>
            <li>Canadian Pure</li>
          </ul>
        </div>
      
        {/* Deuxième bloc: Informations générales */}
        <div className="bas-depage-footer-bloc">
          <h3>Informations générales</h3>
          <ul>
            <li>Nous livrons de l'eau minérale directement chez vous avec un service rapide et fiable.</li>
            <li>Paiement à la livraison, par carte bancaire ou Mobile Money.</li>
          </ul>
        </div>
      
        {/* Troisième bloc: Liens légaux */}
        <div className="bas-depage-footer-bloc">
          <h3>Liens légaux</h3>
          <ul>
            <li><Link to="/politique-de-confidentialite.html">Mentions légales et Politiques de confidentialité</Link></li>
            <li><Link to="/termes-cond.html">Termes et conditions</Link></li>
          </ul>
        </div>
      </div>

      <section id="contactus">
        <div className="contact-section">
          <h2>Nous Contacter</h2>
          <div className="contact-info">
            <p className="footer-text">Email : <a href="mailto:supportoceanswater@gmail.com">ocnswatercongo@gmail.com</a></p>
            <p className="footer-text">Téléphone : +243 975 215 488</p>
            <div className="social-links">
              <h3>Suivez-nous</h3>
              <a href="https://www.facebook.com/share/1CspuGovLf/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                <img src={require('../assets/img/contact/Facebook .PNG')} alt="fb" className="fb-logo" />
              </a>
              <a href="https://x.com/ocean_s_water?s=21" target="_blank" rel="noopener noreferrer">
                <img src={require('../assets/img/contact/X.PNG')} alt="x" />
              </a>
              <a href="https://www.instagram.com/ocean_s_water?igsh=cjZpbnRrZjUyaHFq&utm_source=qr" target="_blank" rel="noopener noreferrer">
                <img src={require('../assets/img/contact/insta.png')} alt="insta" />
              </a>
            </div>
          </div>
        </div>
      </section>
      <b>OCEAN'S WATER - {new Date().getFullYear()} tous droits réservés &copy;</b>
    </footer>
  );
};

export default Footer;
