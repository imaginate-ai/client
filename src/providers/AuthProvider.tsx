import { useContext, createContext, useState, useEffect } from 'react';
import { User } from '../types/User.types';

type AuthContextType = {
  user: User | undefined;
  loginRedirect: () => void;
  logOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

import { ReactNode } from 'react';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>();

  const loginRedirect = () => {
    window.location.replace(
      `${import.meta.env.VITE_API_URL}/user/authorize/google`,
    );
  };

  const getEmail = (): User['email'] | null => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    return email;
  };

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    window.history.replaceState({}, '', '/');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (user) {
      setUser(user);
    } else {
      const email = getEmail();
      if (email) {
        login({ email });
      }
    }
  }, []);

  const logOut = () => {
    setUser(undefined);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loginRedirect, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext<AuthContextType | null>(AuthContext);
};
