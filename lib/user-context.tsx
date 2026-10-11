"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { DBUser } from './db';

interface UserContextType {
  user: DBUser | null;
  setUser: (user: DBUser | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<DBUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const stored = localStorage.getItem('prabhashwara_user');
    if (stored) {
      try {
        const userData = JSON.parse(stored);

        // Validate user data has proper DB format (with UUID id and created_at)
        if (userData.id && userData.created_at && userData.id.includes('-')) {
          // Valid DB user
          setUserState(userData);
        } else {
          // Old format user - clear it and force re-auth
          console.log('Clearing old user data - migration required');
          localStorage.removeItem('prabhashwara_user');
          localStorage.removeItem('prabhashwara_pin');
        }
      } catch (e) {
        console.error('Failed to parse user data:', e);
        localStorage.removeItem('prabhashwara_user');
      }
    }
    setIsLoading(false);
  }, []);

  const setUser = (newUser: DBUser | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('prabhashwara_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('prabhashwara_user');
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
