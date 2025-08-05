import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const MobileMenuToggle = ({ isOpen, onClick }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="md:hidden"
    >
      <motion.div
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ApperIcon name={isOpen ? "X" : "Menu"} size={24} />
      </motion.div>
    </Button>
  );
};

export default MobileMenuToggle;