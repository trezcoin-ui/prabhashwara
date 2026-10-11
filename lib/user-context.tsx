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
        setUserState(userData);
      } catch (e) {
        console.error('Failed to parse user data:', e);
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
