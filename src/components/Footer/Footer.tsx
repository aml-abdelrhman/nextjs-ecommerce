import React from "react";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "@/styles/Footer.scss";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerContent">
        <div className="about">
          <h3>Online Shop</h3>
          <p>Your one-stop online store for high-quality products        
           with fast and reliable shipping.</p>
        </div>

        <div className="links">
         <ul>
          <h4>Quick Links</h4>
          
            <li><a href="#products">Products</a></li>
            <li><a href="#offers">Offers</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="contact">
          <h4>Contact Us</h4>
          <p><FaMapMarkerAlt /> 123 Main Street, City, Country</p>
          <p><FaPhoneAlt /> +1 234 567 890</p>
          <p><FaEnvelope /> support@onlineshop.com</p>

          <div className="socialIcons">
            <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
            <a href="https://www.instagram.com/yourpage" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://www.facebook.com/yourpage" target="_blank" rel="noreferrer"><FaFacebookF /></a>
          </div>
        </div>
      </div>

      <div className="footerBottom">
        <p>© 2025 Online Shop. All rights reserved.</p>
      </div>
    </footer>
  );
}
