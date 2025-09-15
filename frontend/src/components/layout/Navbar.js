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
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm border-neutral-100">
      {/* Top Tier */}
      <div className="bg-gradient-to-r from-primary-50 to-sage-50">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            {/* Search bar left */}
            <div className="hidden flex-1 max-w-md md:block">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 w-5 h-5 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e)=>setSearchQuery(e.target.value)}
                  placeholder="Search for natural beauty products..."
                  className="py-3 pr-4 pl-12 w-full rounded-full border backdrop-blur-sm transition-all duration-200 border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:outline-none focus:border-primary-500 bg-white/80"
                />
              </form>
            </div>

            {/* Logo center */}
            <div className="flex flex-1 justify-center">
              <Link to="/" className="group">
                <img 
                  src="https://rrhijmjgxjziseageung.supabase.co/storage/v1/object/public/logo/Logo-01.svg" 
                  alt="Pure Elements" 
                  className="w-auto h-12 transition-transform duration-200 group-hover:scale-105" 
                />
              </Link>
            </div>

            {/* Icons right */}
            <div className="flex flex-1 justify-end items-center space-x-6">
              {/* Cart */}
              {isAuthenticated && (
                <Link 
                  to="/cart" 
                  className="relative p-3 rounded-full transition-all duration-200 text-neutral-700 hover:text-primary-600 hover:bg-primary-50 group"
                >
                  <ShoppingCart className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />
                  {cartItemCount > 0 && (
                    <span className="flex absolute -top-1 -right-1 justify-center items-center w-6 h-6 text-xs font-medium text-white rounded-full animate-pulse bg-primary-600">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center p-2 space-x-2 rounded-lg transition-all duration-200 text-neutral-700 hover:text-primary-600 hover:bg-primary-50">
                    <User className="w-6 h-6" />
                    <span className="hidden font-medium md:block">{user?.email}</span>
                  </button>
                  <div className="overflow-hidden absolute right-0 invisible z-50 mt-2 w-56 bg-white rounded-2xl border shadow-xl opacity-0 transition-all duration-300 border-neutral-100 group-hover:opacity-100 group-hover:visible">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm transition-colors duration-200 text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
                      >
                        <Settings className="mr-3 w-4 h-4" />
                        Profile
                      </Link>
                      <Link
                        to="/profile#orders"
                        className="flex items-center px-4 py-3 text-sm transition-colors duration-200 text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
                      >
                        My Orders
                      </Link>
                      {isAdmin && (
                        <>
                          <div className="my-1 border-t border-neutral-100"></div>
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center px-4 py-3 text-sm transition-colors duration-200 text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
                          >
                            <Package className="mr-3 w-4 h-4" />
                            Admin Dashboard
                          </Link>
                          <Link
                            to="/admin/orders"
                            className="flex items-center px-4 py-3 text-sm transition-colors duration-200 text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
                          >
                            Manage Orders
                          </Link>
                          <Link
                            to="/admin/categories/manage"
                            className="flex items-center px-4 py-3 text-sm transition-colors duration-200 text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
                          >
                            Manage Categories
                          </Link>
                        </>
                      )}
                      <div className="my-1 border-t border-neutral-100"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-3 w-full text-sm transition-colors duration-200 text-neutral-700 hover:bg-red-50 hover:text-red-600"
                      >
                        <LogOut className="mr-3 w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className="px-4 py-2 rounded-lg nav-link hover:bg-primary-50"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-6 py-2 text-sm btn-primary"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg transition-all duration-200 md:hidden text-neutral-700 hover:text-primary-600 hover:bg-primary-50"
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
          <div className="hidden justify-center items-center space-x-8 h-16 md:flex">
            {/* Static link before categories */}
            <Link 
              to="/about" 
              className={`nav-link uppercase tracking-wide text-sm font-semibold whitespace-nowrap ${location.pathname==='/about'?'active':''}`}
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
                {item.name === 'Products' ? (
                  <Link to="/products" className="flex items-center space-x-2 text-sm font-semibold tracking-wide uppercase whitespace-nowrap nav-link">
                    <span>{item.name}</span>
                    {item.children && item.children.length>0 && <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"/>}
                  </Link>
                ) : (
                  <button className="flex items-center space-x-2 text-sm font-semibold tracking-wide uppercase whitespace-nowrap nav-link">
                    <span>{item.name}</span>
                    {item.children && item.children.length>0 && <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"/>}
                  </button>
                )}
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
                          className="block px-4 py-3 text-sm font-medium capitalize rounded-lg transition-all duration-200 text-neutral-700 hover:text-primary-600 hover:bg-primary-50"
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
              className={`nav-link uppercase tracking-wide text-sm font-semibold whitespace-nowrap ${location.pathname==='/stores'?'active':''}`}
            >
              Stores
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-white border-t md:hidden border-neutral-100">
          <div className="px-4 pt-4 pb-6 space-y-4">
            {/* Search bar for mobile */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 w-5 h-5 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e)=>setSearchQuery(e.target.value)}
                  placeholder="Search for natural beauty products..."
                  className="py-3 pr-4 pl-12 w-full rounded-full border border-neutral-200 focus:ring-2 focus:ring-primary-500 focus:outline-none focus:border-primary-500 bg-neutral-50"
                />
              </div>
            </form>
            
            {/* Navigation links */}
            <div className="space-y-2">
              <Link 
                to="/about" 
                onClick={()=>setIsMenuOpen(false)} 
                className="block px-4 py-3 font-medium tracking-wide uppercase rounded-lg transition-colors duration-200 text-neutral-700 hover:text-primary-600 hover:bg-primary-50"
              >
                About Us
              </Link>
              {menuTree.map((item)=> (
                <div key={item.id}>
                  {/* Parent category button */}
                  <button
                    onClick={() => setOpenMobileDropdown(openMobileDropdown === item.id ? null : item.id)}
                    className="flex justify-between items-center px-4 py-3 w-full font-medium tracking-wide uppercase rounded-lg transition-colors duration-200 text-neutral-700 hover:text-primary-600 hover:bg-primary-50"
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
                          className="block px-4 py-2 text-sm font-medium capitalize rounded-lg transition-colors duration-200 text-neutral-600 hover:text-primary-600 hover:bg-primary-50"
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
                className="block px-4 py-3 font-medium tracking-wide uppercase rounded-lg transition-colors duration-200 text-neutral-700 hover:text-primary-600 hover:bg-primary-50"
              >
                Stores
              </Link>
            </div>

            {!isAuthenticated && (
              <div className="pt-4 space-y-2 border-t border-neutral-200">
                <Link
                  to="/login"
                  className="block px-4 py-3 font-medium rounded-lg transition-colors duration-200 text-neutral-700 hover:text-primary-600 hover:bg-primary-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 font-medium text-center text-white rounded-lg transition-colors duration-200 bg-primary-600 hover:bg-primary-700"
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
