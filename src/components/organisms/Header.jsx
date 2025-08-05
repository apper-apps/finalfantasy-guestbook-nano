import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import NavigationItem from "@/components/molecules/NavigationItem";
import MobileMenuToggle from "@/components/molecules/MobileMenuToggle";
import { useUser } from "@/components/organisms/Layout";
import Button from "@/components/atoms/Button";
function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser } = useUser();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);
const navigationItems = [
    { to: "/home", icon: "Home", label: "홈" },
    { to: "/post", icon: "PenTool", label: "글쓰기" },
    ...(currentUser?.is_admin ? [{ to: "/admin", icon: "Settings", label: "관리자" }] : [])
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
<header className="sticky top-0 z-40 glass-effect border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/home" 
            className="flex items-center space-x-3 text-white hover:text-primary transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Sparkles" size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              Final Fantasy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-8">
              {navigationItems.map((item) => (
                <NavigationItem 
                  key={item.to} 
                  to={item.to} 
                  icon={item.icon}
                >
                  {item.label}
                </NavigationItem>
              ))}
            </nav>
            
            {/* Logout Button */}
{!isAuthenticated ? (
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white"
                >
                  <ApperIcon name="LogIn" size={16} />
                  <span>로그인 / 회원가입</span>
                </Button>
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm hover:bg-primary/80 transition-colors"
                >
                  {currentUser?.firstName?.charAt(0) || currentUser?.name?.charAt(0) || 'U'}
                </button>
                
                <AnimatePresence>
                  {isMobileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-10 w-48 bg-surface border border-gray-600 rounded-lg shadow-lg z-50"
                    >
                      <div className="py-2">
                        <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-2">
                          <ApperIcon name="User" size={16} />
                          <span>프로필</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-2"
                        >
                          <ApperIcon name="LogOut" size={16} />
                          <span>로그아웃</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <MobileMenuToggle 
              isOpen={isMobileMenuOpen} 
              onClick={toggleMobileMenu} 
            />
</div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-surface border-t border-gray-800/50"
          >
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => (
                <NavigationItem 
                  key={item.to} 
                  to={item.to} 
                  icon={item.icon}
                  onClick={closeMobileMenu}
                  className="block w-full"
                >
                  {item.label}
                </NavigationItem>
              ))}
              
              {/* Mobile Logout Button */}
{!isAuthenticated ? (
                <Link to="/login" className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center space-x-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white"
                  >
                    <ApperIcon name="LogIn" size={16} />
                    <span>로그인 / 회원가입</span>
                  </Button>
                </Link>
              ) : (
                <div className="mt-4 border-t border-gray-700 pt-4">
                  <div className="flex items-center space-x-3 mb-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
                      {currentUser?.firstName?.charAt(0) || currentUser?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {currentUser?.firstName || currentUser?.name || '사용자'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {currentUser?.emailAddress || currentUser?.email}
                      </p>
                    </div>
                  </div>
                  
                  <button className="w-full px-2 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-2 rounded">
                    <ApperIcon name="User" size={16} />
                    <span>프로필</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full px-2 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center space-x-2 rounded mt-1"
                  >
                    <ApperIcon name="LogOut" size={16} />
                    <span>로그아웃</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
</AnimatePresence>
    </header>
  );
}

export default Header;