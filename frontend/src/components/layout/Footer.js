import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold">Pure_element</span>
            </div>
            <p className="text-gray-300 text-sm">
              Premium Ayurvedic beauty and wellness products crafted with natural ingredients 
              for your holistic well-being.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/pureelementsnaturalkosmetik" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/pure_elements_naturkosmetik/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com/@PureElementsNaturkosmetik" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/pure-elements-naturkosmetik/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <span className="text-gray-300 text-sm cursor-default">
                  Contact
                </span>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=hair-care" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Hair Care
                </Link>
              </li>
              <li>
                <Link to="/products?category=skin-care" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Skin Care
                </Link>
              </li>
              <li>
                <Link to="/products?category=body-care" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Body Care
                </Link>
              </li>
              <li>
                <Link to="/products?category=wellness" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Wellness
                </Link>
              </li>
              <li>
                <Link to="/products?category=gifting" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Gifting
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary-400" />
                <span className="text-gray-300 text-sm">info@pureelement.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary-400" />
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  123 Wellness Street<br />
                  Natural City, NC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Pure_element. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm cursor-default">
                Privacy Policy
              </span>
              <span className="text-gray-400 text-sm cursor-default">
                Terms of Service
              </span>
              <span className="text-gray-400 text-sm cursor-default">
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
