import React from 'react';

import User from '@/entities/user.entity';
import UserService from '@/services/user.service';

import { setCookie, parseCookies, destroyCookie } from 'nookies';
import { useRouter } from 'next/navigation';

type UserData = User & { token: string };

interface AuthContextProps {
  user: UserData | null;
  isAuthenticated: boolean;

  signIn: (user: string, password: string, redirectTo?: string) => Promise<{ token: string; user: User }>;
  logout: (redirecTo?: string) => void;
}

export const AuthContext = React.createContext({} as AuthContextProps);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { 'verdeapp.token': token, 'verdeapp.user': userData } = parseCookies();

  const [user, setUser] = React.useState<UserData | null>(userData ? { ...JSON.parse(userData), token } : null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    if (token) {
      setUser({ ...JSON.parse(userData), token });

      UserService.getUserByJwt(token)
        .then((response) => {
          setUser({ ...response.data, token });
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  function signIn(user: string, password: string, redirectTo?: string): Promise<{ token: string; user: User }> {
    return new Promise((resolve, reject) => {
      UserService.authUser(user, password)
        .then((response) => {
          setUser(response.data.user);

          if (token) logout();

          setCookie(undefined, 'verdeapp.token', response.data.token, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });
          setCookie(undefined, 'verdeapp.user', JSON.stringify(response.data.user), {
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });

          resolve({
            token: response.data.token,
            user: response.data.user,
          });

          setTimeout(() => {
            if (redirectTo) router.push(redirectTo);
          }, 750);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async function logout(redirecTo?: string) {
    destroyCookie(undefined, 'verdeapp.token');
    destroyCookie(undefined, 'verdeapp.user');
    
    if (redirecTo) router.push(redirecTo);

    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
