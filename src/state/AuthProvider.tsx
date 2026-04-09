import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, type ApiError } from '../api/mealPlannerApi';

type AuthContextValue = {
  createAccount: (name: string, email: string, password: string) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  userEmail: string;
  userName: string;
  error: string | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function restoreSession() {
      if (!api.hasToken()) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await api.getProfile();

        setUserEmail(profile.email);
        setUserName(profile.full_name);
        setIsAuthenticated(true);
      } catch (err) {
        api.clearToken();
        const apiError = err as ApiError;
        setError(apiError.message || 'Session expired');
        setUserEmail('');
        setUserName('');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    void restoreSession();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.signin(email, password);

      setUserEmail(response.user.email);
      setUserName(response.user.fullName);
      setIsAuthenticated(true);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Sign in failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createAccount = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.signup(email, password, name);

      setUserEmail(response.user.email);
      setUserName(response.user.fullName);
      setIsAuthenticated(true);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Account creation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await api.logout();
      setUserEmail('');
      setUserName('');
      setIsAuthenticated(false);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Sign out failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      createAccount,
      isAuthenticated,
      isLoading,
      signIn,
      signOut,
      userEmail,
      userName,
      error,
    }),
    [isAuthenticated, isLoading, userEmail, userName, error, signIn, signOut, createAccount]
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
