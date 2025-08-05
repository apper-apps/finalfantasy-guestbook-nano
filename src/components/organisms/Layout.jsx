import { createContext, useContext, useState } from "react";
import Header from "@/components/organisms/Header";

// User Context for demo purposes
const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

const Layout = ({ children }) => {
  // Mock user data for demo - in real app this would come from auth
  const [currentUser] = useState({
    Id: 1,
    name: "관리자",
    is_admin: true
  });

  return (
    <UserContext.Provider value={{ currentUser }}>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </UserContext.Provider>
  );
};

export default Layout;