import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { destroyCookie, parseCookies, setCookie } from 'nookies';
import Router from 'next/router';

import { setHttpClientAuthorization } from '$services/httpClient';
import { getUserInfo, login, User } from '$services/api/users';

interface SignInCredentals {
  email: string;
  password: string;
}

export interface AuthContextData {
  signIn: (credentials: SignInCredentals) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: User | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  const signOut = useCallback(() => {
    destroyCookie(undefined, 'skybar.token');
    setUser(null);
    Router.push('/');
  }, []);

  useEffect(() => {
    async function loadUser() {
      try {
        const { 'skybar.token': token } = parseCookies();

        if (!token) {
          return;
        }

        setHttpClientAuthorization(token);

        const user = await getUserInfo();

        setUser(user);
      } catch {
        signOut();
      } finally {
        setIsLoading(false);
      }
    }

    if (isLoading) {
      loadUser();
    }
  }, [isLoading, signOut]);

  const signIn = useCallback(async ({ email, password }: SignInCredentals) => {
    try {
      setIsLoading(true);

      const token = await login({ email, password });

      setCookie(undefined, 'skybar.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      setHttpClientAuthorization(token);

      const user = await getUserInfo();

      setUser(user);

      Router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, signIn, signOut, user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
