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
            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white"
              >
                <ApperIcon name="LogOut" size={16} />
                <span>로그아웃</span>
              </Button>
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
              {isAuthenticated && (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center space-x-2 mt-4 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white"
                >
                  <ApperIcon name="LogOut" size={16} />
                  <span>로그아웃</span>
                </Button>
              )}
            </div>
          </motion.div>
        )}
</AnimatePresence>
    </header>
  );
}

export default Header;