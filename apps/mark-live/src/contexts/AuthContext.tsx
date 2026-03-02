import { createContext, useContext, type ReactNode } from 'react';
import type { User, UserInfo } from '../types';

export type AuthContextValue = {
  user: User | null;
  userInfo: UserInfo | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  user,
  userInfo,
  children,
}: {
  user: User | null;
  userInfo: UserInfo | null;
  children: ReactNode;
}) {
  return <AuthContext.Provider value={{ user, userInfo }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
