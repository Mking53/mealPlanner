import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type AuthContextValue = {
  createAccount: (name: string, email: string, password: string) => void;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  userEmail: string;
  userName: string;
};

const DEFAULT_USER_NAME = 'Maya Carter';
const DEFAULT_USER_EMAIL = 'maya@example.com';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState(DEFAULT_USER_NAME);
  const [userEmail, setUserEmail] = useState(DEFAULT_USER_EMAIL);

  function signIn(email: string, _password: string) {
    const trimmedEmail = email.trim();
    const derivedName = trimmedEmail.split('@')[0]?.trim();

    setUserEmail(trimmedEmail);

    if (derivedName) {
      setUserName(
        derivedName
          .split(/[.\s_-]+/)
          .filter(Boolean)
          .map((part) => part[0]!.toUpperCase() + part.slice(1))
          .join(' ')
      );
    }

    setIsAuthenticated(true);
  }

  function createAccount(name: string, email: string, _password: string) {
    setUserName(name.trim());
    setUserEmail(email.trim());
    setIsAuthenticated(true);
  }

  function signOut() {
    setIsAuthenticated(false);
  }

  const value = useMemo(
    () => ({
      createAccount,
      isAuthenticated,
      signIn,
      signOut,
      userEmail,
      userName,
    }),
    [isAuthenticated, userEmail, userName]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
