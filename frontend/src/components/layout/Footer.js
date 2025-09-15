import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-sage-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/95 via-neutral-800/95 to-sage-900/95"></div>
      <div className="container-custom relative z-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-2xl font-bold font-playfair">Pure Elements</span>
            </div>
            <p className="text-neutral-300 text-base leading-relaxed">
              Premium Ayurvedic beauty and wellness products crafted with natural ingredients 
              and ancient wisdom for your holistic well-being and natural radiance.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/pureelementsnaturalkosmetik" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-700 hover:bg-primary-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/pure_elements_naturkosmetik/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-700 hover:bg-primary-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com/@PureElementsNaturkosmetik" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-700 hover:bg-primary-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/pure-elements-naturkosmetik/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-700 hover:bg-primary-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold font-playfair">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 text-base font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 text-base font-medium">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 text-base font-medium">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/stores" className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 text-base font-medium">
                  Store Locations
                </Link>
              </li>
              <li>
                <span className="text-neutral-400 text-base font-medium cursor-default">
                  Contact
                </span>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold font-playfair">Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products?category=hair-care" className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 text-base font-medium">
                  Hair Care
                </Link>
              </li>
              <li>
                <Link to="/products?category=skin-care" className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 text-base font-medium">
                  Skin Care
                </Link>
              </li>
              <li>
                <Link to="/products?category=body-care" className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 text-base font-medium">
                  Body Care
                </Link>
              </li>
              <li>
                <Link to="/products?category=wellness" className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 text-base font-medium">
                  Wellness
                </Link>
              </li>
              <li>
                <Link to="/products?category=gifting" className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 text-base font-medium">
                  Gifting
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold font-playfair">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary-600/20 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary-400" />
                </div>
                <span className="text-neutral-300 text-base font-medium">info@pureelements.com</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary-600/20 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary-400" />
                </div>
                <span className="text-neutral-300 text-base font-medium">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary-600/20 rounded-full flex items-center justify-center mt-1">
                  <MapPin className="w-5 h-5 text-primary-400" />
                </div>
                <span className="text-neutral-300 text-base font-medium leading-relaxed">
                  123 Wellness Street<br />
                  Natural City, NC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-neutral-400 text-base font-medium">
              © 2024 Pure Elements. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <span className="text-neutral-400 text-base font-medium cursor-default hover:text-primary-400 transition-colors duration-200">
                Privacy Policy
              </span>
              <span className="text-neutral-400 text-base font-medium cursor-default hover:text-primary-400 transition-colors duration-200">
                Terms of Service
              </span>
              <span className="text-neutral-400 text-base font-medium cursor-default hover:text-primary-400 transition-colors duration-200">
                Return Policy
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
