import User from '@/entities/user.entity';
import UserService from '@/services/user.service';
import React from 'react';
import { setCookie, parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';

type UserData = User & { token: string };

interface AuthContextProps {
  user: UserData | null;
  isAuthenticated: boolean;

  signIn: (user: string, password: string, redirectTo?: string) => Promise<{ token: string; user: User }>;
  logout: () => void;
}

export const AuthContext = React.createContext({} as AuthContextProps);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { 'verdeapp.token': token, 'verdeapp.user': userData } = parseCookies();

  const [user, setUser] = React.useState<UserData | null>(userData ? { ...JSON.parse(userData), token } : null);
  const router = useRouter();

  React.useEffect(() => {
    if (token) {
      UserService.getUserByJwt(token)
        .then((response) => {
          setUser({ ...response.data, token });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  function signIn(user: string, password: string, redirectTo?: string): Promise<{ token: string; user: User }> {
    return new Promise((resolve, reject) => {
      UserService.authUser(user, password)
        .then((response) => {
          setUser(response.data.user);
          setCookie(undefined, 'verdeapp.token', response.data.token, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });
          setCookie(undefined, 'verdeapp.user', JSON.stringify(response.data.user), {
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });
          if (redirectTo) router.push(redirectTo);
          resolve({
            token: response.data.token,
            user: response.data.user,
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async function logout() {
    setCookie(undefined, 'verdeapp.token', '', {
      maxAge: -1,
    });

    setUser(null);

    router.push('/login');
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, logout }}>{children}</AuthContext.Provider>
  );
}
