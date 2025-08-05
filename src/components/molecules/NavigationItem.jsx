import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const NavigationItem = ({ to, icon, children, className, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-surface/50 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
          isActive ? "bg-surface text-primary" : "text-gray-300",
          className
        )
      }
    >
      {icon && <ApperIcon name={icon} size={20} />}
      <span className="font-medium">{children}</span>
    </NavLink>
  );
};

export default NavigationItem;