import React from 'react';
import { Link } from 'react-router-dom';

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/pure_elements_naturkosmetik/',
    svg: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9A4.5 4.5 0 0 1 16.5 21h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3zm9.75 2.25h.008v.008h-.008v-.008zM12 8.25A3.75 3.75 0 1 0 12 15.75 3.75 3.75 0 0 0 12 8.25z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/pureelementsnaturalkosmetik',
    svg: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
        <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@PureElementsNaturkosmetik',
    svg: (
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
        <path d="M23.498 6.186a2.994 2.994 0 0 0-2.108-2.116C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.39.57A2.994 2.994 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.994 2.994 0 0 0 2.108 2.116C4.5 20.5 12 20.5 12 20.5s7.5 0 9.39-.57a2.994 2.994 0 0 0 2.108-2.116C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.75 15.568V8.432L15.818 12l-6.068 3.568z"/>
      </svg>
    ),
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#909C76] text-white font-sans">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Information */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Information</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-white transition-colors text-white">About Us</Link></li>
              <li><Link to="/stores" className="hover:text-white transition-colors text-white">Our Stores</Link></li>
            </ul>
          </div>
          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              <li><span className="cursor-default text-white">Shipping & Delivery</span></li>
              <li><span className="cursor-default text-white">Returns & Refunds</span></li>
              <li><span className="cursor-default text-white">FAQs</span></li>
            </ul>
          </div>
          {/* Office Address */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Office Address</h3>
            <div className="mb-3">
              <span className="font-semibold text-white">Corporate Office:</span>
              <div className="text-sm leading-relaxed mt-1 text-white">
                1st Floor, 5/6, Shreeji House,<br />
                Opp. Tata Power House, Senapati Bapat Marg,<br />
                Dadar (W), Mumbai - 400028
              </div>
            </div>
            <div>
              <span className="font-semibold text-white">Mahabaleshwar Office:</span>
              <div className="text-sm leading-relaxed mt-1 text-white">
                Shop No. 1, Hotel Dreamland Compound,<br />
                Mahabaleshwar - 412806
              </div>
            </div>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contact info</h3>
            <ul className="space-y-2 text-sm text-white">
              <li><span className="font-semibold text-white">Customer Support:</span> +91 9021099099</li>
              <li><span className="font-semibold text-white">WhatsApp:</span> +91 9021099099</li>
              <li><span className="font-semibold text-white">Email:</span> customercare@pureelements.in</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Social & Payment Section */}
      <div className="border-t border-[#7d8b5e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Follow Us */}
          <div className="flex items-center gap-3">
            <span className="font-semibold mr-2">Follow us:</span>
            {socialLinks.map((icon) => (
              <a
                key={icon.name}
                href={icon.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white transition-colors p-2 rounded-full bg-[#7d8b5e] hover:bg-[#a1b47a]"
                aria-label={icon.name}
              >
                {icon.svg}
              </a>
            ))}
          </div>
          {/* Payment Methods */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold mr-2">Payment Methods:</span>
            <img
              src="https://rrhijmjgxjziseageung.supabase.co/storage/v1/object/public/logo/imgi_323_pay-us-600x66.jpeg"
              alt="Payment Methods"
              className="h-10 w-auto max-w-xs object-contain bg-white rounded shadow"
              style={{ minWidth: 120 }}
            />
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="bg-[#7d8b5e] text-center py-3 text-sm text-white">
        © 2025 Pure Elements. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
