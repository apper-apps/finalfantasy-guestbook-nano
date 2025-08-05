import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NavigationItem from "@/components/molecules/NavigationItem";
import MobileMenuToggle from "@/components/molecules/MobileMenuToggle";
import ApperIcon from "@/components/ApperIcon";
import { useUser } from "@/components/organisms/Layout";

const Header = () => {
  const { currentUser } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { to: "/home", icon: "Home", label: "홈" },
    { to: "/post", icon: "PenTool", label: "글쓰기" },
    ...(currentUser?.is_admin ? [{ to: "/admin", icon: "Settings", label: "관리자" }] : []),
  ];
  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-gray-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/home"
            className="flex items-center space-x-2 text-xl font-bold gradient-text hover:scale-105 transition-transform duration-200"
          >
            <ApperIcon name="Gamepad2" size={24} />
            <span>Finalfantasy Guestbook</span>
          </Link>

          {/* Desktop Navigation */}
<nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <NavigationItem key={item.to} to={item.to} icon={item.icon}>
                {item.label}
              </NavigationItem>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
<div className="md:hidden">
            <MobileMenuToggle
              isOpen={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
{/* Mobile Drawer Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                onClick={closeMobileMenu}
              />
              
              {/* Drawer */}
              <motion.nav
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 left-0 h-full w-80 max-w-[85vw] glass-effect border-r border-gray-700 z-50 md:hidden"
              >
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Gamepad2" size={24} />
                      <span className="text-lg font-bold gradient-text">Menu</span>
                    </div>
                    <button
                      onClick={closeMobileMenu}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ApperIcon name="X" size={20} />
                    </button>
                  </div>
                  
                  {/* Navigation Items */}
                  <div className="flex-1 px-6 py-4">
                    <div className="space-y-2">
                      {navigationItems.map((item) => (
                        <NavigationItem
                          key={item.to}
                          to={item.to}
                          icon={item.icon}
                          onClick={closeMobileMenu}
                          className="w-full justify-start px-4 py-3 text-base"
                        >
                          {item.label}
                        </NavigationItem>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;