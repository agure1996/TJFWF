import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import client from '@/api/springBootClient';
import { appParams } from '@/lib/app-params';

interface AuthError {
  type: string;
  message: string;
}

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  isLoadingPublicSettings: boolean;
  authError: AuthError | null;
  logout: (shouldRedirect?: boolean) => void;
  navigateToLogin: () => void;
  checkAppState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState<AuthError | null>(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(false);
      setAuthError(null);

      // If we have a token, attempt to validate it with the backend
      if (appParams.token) {
        await checkUserAuth();
      } else {
        setIsLoadingAuth(false);
        setIsAuthenticated(false);
      }
    } catch (error: any) {
      console.error('App state check failed:', error);
      setAuthError({ type: 'unknown', message: error?.message || 'Failed to load app' });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const resp = await client.get('/auth/me');
      setUser(resp.data?.data ?? null);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
    } catch (error: any) {
      console.error('User auth check failed:', error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        setAuthError({ type: 'auth_required', message: 'Authentication required' });
      }
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    
    if (shouldRedirect) {
      // Clear token and redirect to login page (backend should handle session cleanup)
      localStorage.removeItem('base44_access_token');
      localStorage.removeItem('token');
      globalThis.location.href = '/login';
    } else {
      localStorage.removeItem('base44_access_token');
      localStorage.removeItem('token');
    }
  };

  const navigateToLogin = () => {
    // Redirect to a login route (backend or app should provide this)
    globalThis.location.href = '/login';
  };

  const value: AuthContextType = useMemo(() => ({
    user, 
    isAuthenticated, 
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    logout,
    navigateToLogin,
    checkAppState
  }), [user, isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
