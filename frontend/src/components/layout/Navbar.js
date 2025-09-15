import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, ShoppingCart, User, Settings, Package, LogOut, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import useCategories from '../../hooks/useCategories';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState(null);
  const { categories: menuTree, loading: navLoading, error: navError } = useCategories();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();



  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  if (navLoading) {
    return <div>Loading navigation...</div>;
  }
  if (navError) {
    return <div>Error loading navigation</div>;
  }

  const cartItemCount = getCartItemCount();
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-neutral-100">
      {/* Top Tier */}
      <div className="bg-gradient-to-r from-primary-50 to-sage-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Search bar left */}
            <div className="flex-1 max-w-md hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e)=>setSearchQuery(e.target.value)}
                  placeholder="Search for natural beauty products..."
                  className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:outline-none focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                />
              </form>
            </div>

            {/* Logo center */}
            <div className="flex-1 flex justify-center">
              <Link to="/" className="group">
                <img 
                  src="https://rrhijmjgxjziseageung.supabase.co/storage/v1/object/public/logo/Logo-01.svg" 
                  alt="Pure Elements" 
                  className="h-12 w-auto group-hover:scale-105 transition-transform duration-200" 
                />
              </Link>
            </div>

            {/* Icons right */}
            <div className="flex-1 flex justify-end items-center space-x-6">
              {/* Cart */}
              {isAuthenticated && (
                <Link 
                  to="/cart" 
                  className="relative p-3 text-neutral-700 hover:text-primary-600 transition-all duration-200 hover:bg-primary-50 rounded-full group"
                >
                  <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium animate-pulse">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-neutral-700 hover:text-primary-600 transition-all duration-200 p-2 rounded-lg hover:bg-primary-50">
                    <User className="w-6 h-6" />
                    <span className="hidden md:block font-medium">{user?.email}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        to="/profile#orders"
                        className="flex items-center px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                      >
                        My Orders
                      </Link>
                      {isAdmin && (
                        <>
                          <div className="border-t border-neutral-100 my-1"></div>
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                          >
                            <Package className="w-4 h-4 mr-3" />
                            Admin Dashboard
                          </Link>
                          <Link
                            to="/admin/orders"
                            className="flex items-center px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                          >
                            Manage Orders
                          </Link>
                          <Link
                            to="/admin/categories/manage"
                            className="flex items-center px-4 py-3 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                          >
                            Manage Categories
                          </Link>
                        </>
                      )}
                      <div className="border-t border-neutral-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-neutral-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className="nav-link px-4 py-2 rounded-lg hover:bg-primary-50"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn-primary text-sm px-6 py-2"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tier - Navigation */}
      <div className="bg-white border-t border-neutral-100">
        <div className="container-custom">
          <div className="hidden md:flex items-center justify-center space-x-8 h-16">
            {/* Static link before categories */}
            <Link 
              to="/about" 
              className={`nav-link uppercase tracking-wide text-sm font-semibold ${location.pathname==='/about'?'active':''}`}
            >
              About Us
            </Link>
            {menuTree.map((item)=> (
              <div
               key={item.id}
               className="relative group"
               onMouseEnter={() => setOpenDesktopDropdown(item.id)}
               onMouseLeave={() => setOpenDesktopDropdown(null)}
             >
                <button className="flex items-center space-x-2 nav-link uppercase tracking-wide text-sm font-semibold">
                  <span>{item.name}</span>
                  {item.children && item.children.length>0 && <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"/>}
                </button>
                {item.children && item.children.length>0 && (
                  <div
                     className={`absolute left-0 mt-2 w-56 bg-white shadow-xl rounded-2xl border border-neutral-100 transition-all duration-300 p-4 z-50 
                       ${openDesktopDropdown===item.id ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'} 
                       group-hover:opacity-100 group-hover:visible group-hover:translate-y-0`}
                   >
                    <div className="grid grid-cols-1 gap-2">
                      {item.children.map((child)=>(
                        <Link 
                          key={child.id} 
                          to={`/products?category=${child.id}`} 
                          className="block px-4 py-3 text-sm text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 capitalize font-medium"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Link 
              to="/stores" 
              className={`nav-link uppercase tracking-wide text-sm font-semibold ${location.pathname==='/stores'?'active':''}`}
            >
              Stores
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100">
          <div className="px-4 pt-4 pb-6 space-y-4">
            {/* Search bar for mobile */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e)=>setSearchQuery(e.target.value)}
                  placeholder="Search for natural beauty products..."
                  className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:outline-none focus:border-primary-500 bg-neutral-50"
                />
              </div>
            </form>
            
            {/* Navigation links */}
            <div className="space-y-2">
              <Link 
                to="/about" 
                onClick={()=>setIsMenuOpen(false)} 
                className="block px-4 py-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 font-medium uppercase tracking-wide"
              >
                About Us
              </Link>
              {menuTree.map((item)=> (
                <div key={item.id}>
                  {/* Parent category button */}
                  <button
                    onClick={() => setOpenMobileDropdown(openMobileDropdown === item.id ? null : item.id)}
                    className="flex items-center justify-between w-full px-4 py-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 font-medium uppercase tracking-wide"
                  >
                    <span>{item.name}</span>
                    {item.children && item.children.length>0 && (
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openMobileDropdown === item.id ? 'rotate-180' : ''}`}/>
                    )}
                  </button>
                  {item.children && item.children.length>0 && openMobileDropdown === item.id && (
                    <div className="pl-6 space-y-1">
                      {item.children.map(child=> (
                        <Link 
                          key={child.id} 
                          to={`/products?category=${child.id}`} 
                          onClick={()=>setIsMenuOpen(false)} 
                          className="block px-4 py-2 text-sm text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 capitalize font-medium"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link 
                to="/stores" 
                onClick={()=>setIsMenuOpen(false)} 
                className="block px-4 py-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 font-medium uppercase tracking-wide"
              >
                Stores
              </Link>
            </div>

            {!isAuthenticated && (
              <div className="pt-4 border-t border-neutral-200 space-y-2">
                <Link
                  to="/login"
                  className="block px-4 py-3 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors duration-200 font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
