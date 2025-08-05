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
          <MobileMenuToggle
            isOpen={isMobileMenuOpen}
            onClick={toggleMobileMenu}
          />
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden py-4 border-t border-gray-700"
            >
              <div className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <NavigationItem
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </NavigationItem>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;