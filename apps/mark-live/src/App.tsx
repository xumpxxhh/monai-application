import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import type { User, UserInfo } from './types';
import {
  validateAuth,
  requestLogin,
  exchangeTokenByCode,
  getUserInfo,
  refreshToken,
} from './lib/api';
import { AuthProvider } from './contexts/AuthContext';
import { ConfirmDialogProvider } from './components/ConfirmDialog';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { HistoryPage } from './pages/HistoryPage';
import { AddPage } from './pages/AddPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (code) {
          await exchangeTokenByCode();
        }

        let authUser;
        try {
          authUser = await validateAuth();
        } catch {
          // access token 过期，尝试静默刷新后重新校验
          await refreshToken();
          authUser = await validateAuth();
        }

        setUser(authUser);
        getUserInfo()
          .then((info) => setUserInfo(info as UserInfo))
          .catch(() => setUserInfo(null));
      } catch {
        // refresh token 也已失效，跳转登录
        requestLogin(window.location.href);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">校验身份中…</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AuthProvider user={user} userInfo={userInfo}>
      <ConfirmDialogProvider>
        <BrowserRouter basename={import.meta.env.VITE_APP_MARK_LIVE_BASE_PATH || ''}>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/add" element={<AddPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ConfirmDialogProvider>
    </AuthProvider>
  );
}
