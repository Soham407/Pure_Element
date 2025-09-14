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
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Tier */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Search bar left */}
            <div className="flex-1 max-w-md hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e)=>setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:outline-none"
                />
              </form>
            </div>

            {/* Logo center */}
            <div className="flex-1 flex justify-center">
              <Link to="/">
                <img src="https://rrhijmjgxjziseageung.supabase.co/storage/v1/object/public/logo/Logo-01.svg" alt="Pure Elements" className="h-10 w-auto" />
              </Link>
            </div>

            {/* Icons right */}
            <div className="flex-1 flex justify-end items-center space-x-4">
              {/* Cart */}
              {isAuthenticated && (
                <Link 
                  to="/cart" 
                  className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                    <User className="w-6 h-6" />
                    <span className="hidden md:block">{user?.email}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="/profile#orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                      >
                        My Orders
                      </Link>
                      {isAdmin && (
                        <>
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                          >
                            <Package className="w-4 h-4 mr-2" />
                            Admin Dashboard
                          </Link>
                          <Link
                            to="/admin/orders"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                          >
                            Manage Orders
                          </Link>
                          <Link
                            to="/admin/categories/manage"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                          >
                            Manage Categories
                          </Link>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn-primary"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-primary-600"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tier - Navigation */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center justify-center space-x-6 h-14">
            {/* Static link before categories */}
            <Link to="/about" className={`text-gray-700 hover:text-primary-600 uppercase ${location.pathname==='/about'?'text-primary-600 font-medium':''}`}>ABOUT US</Link>
            {menuTree.map((item)=> (
              <div
               key={item.id}
               className="relative group"
               onMouseEnter={() => setOpenDesktopDropdown(item.id)}
               onMouseLeave={() => setOpenDesktopDropdown(null)}
             >
                <button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 uppercase">
                  <span>{item.name}</span>
                  {item.children && item.children.length>0 && <ChevronDown className="w-4 h-4"/>}
                </button>
                {item.children && item.children.length>0 && (
                  <div
                     className={`absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md transition-all p-2 z-50 
                       ${openDesktopDropdown===item.id ? 'opacity-100 visible' : 'opacity-0 invisible'} 
                       group-hover:opacity-100 group-hover:visible`}
                   >
                    {item.children.map((child)=>(
                      <Link key={child.id} to={`/products?category=${child.id}`} className="block px-3 py-1 text-sm text-gray-700 hover:text-primary-600 capitalize">
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link to="/stores" className={`text-gray-700 hover:text-primary-600 uppercase ${location.pathname==='/stores'?'text-primary-600 font-medium':''}`}>STORES</Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Search bar for mobile */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e)=>setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:outline-none"
                />
              </div>
            </form>
            
            {/* Navigation links */}
            <div className="space-y-1">
              <Link to="/about" onClick={()=>setIsMenuOpen(false)} className="block px-2 py-1 text-gray-700 hover:text-primary-600">ABOUT US</Link>
              {menuTree.map((item)=> (
                <div key={item.id}>
                  {/* Parent category button */}
                  <button
                    onClick={() => setOpenMobileDropdown(openMobileDropdown === item.id ? null : item.id)}
                    className="flex items-center justify-between w-full px-2 py-1 text-gray-700 hover:text-primary-600 uppercase"
                  >
                    <span>{item.name}</span>
                    {item.children && item.children.length>0 && <ChevronDown className="w-4 h-4"/>}
                  </button>
                  {item.children && item.children.length>0 && openMobileDropdown === item.id && (
                    <div className="pl-4">
                      {item.children.map(child=> (
                        <Link key={child.id} to={`/products?category=${child.id}`} onClick={()=>setIsMenuOpen(false)} className="block px-2 py-1 text-sm text-gray-600 hover:text-primary-600 capitalize">
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link to="/stores" onClick={()=>setIsMenuOpen(false)} className="block px-2 py-1 text-gray-700 hover:text-primary-600">STORES</Link>
            </div>

            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
