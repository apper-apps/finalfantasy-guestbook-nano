import { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import profileService from "@/services/api/profileService";
import Header from "@/components/organisms/Header";

// User Context for profile data
const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

const Layout = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (isAuthenticated && user) {
        try {
          // If profile is already in Redux store, use it
          if (user.profile) {
            setCurrentUser({
              ...user,
              profile: user.profile,
              // Map profile role to is_admin for compatibility
              is_admin: user.profile.role === 'admin'
            });
          } else if (user.userId) {
            // Fetch profile if not in store
            const profile = await profileService.getByUserId(user.userId);
            setCurrentUser({
              ...user,
              profile: profile,
              is_admin: profile?.role === 'admin'
            });
          } else {
            // Fallback to user data without profile
            setCurrentUser({
              ...user,
              is_admin: false
            });
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Fallback to user data without admin access
          setCurrentUser({
            ...user,
            is_admin: false
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    };

    loadUserProfile();
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

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