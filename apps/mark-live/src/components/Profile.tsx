import { Card, CardContent, Button } from 'ui/react';
import { User, Settings, LogOut, ChevronRight, HelpCircle } from 'lucide-react';
import { logout, requestLogin, getUserInfo } from '../lib/api';
import { useEffect, useState } from 'react';

type UserInfo = {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
};

export function Profile() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const handleLogout = async () => {
    await logout();
    await requestLogin(window.location.href);
  };
  const menuItems = [
    { icon: Settings, label: '设置' },
    { icon: HelpCircle, label: '帮助与反馈' },
  ];

  useEffect(() => {
    getUserInfo()
      .then((response) => setUserInfo(response as UserInfo))
      .catch(() => setUserInfo(null));
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold truncate">{userInfo?.username ?? '用户'}</h2>
              <p className="text-sm text-gray-500 truncate">{userInfo?.email ?? '记录美好生活'}</p>
              {userInfo?.role && <p className="text-xs text-gray-400 mt-0.5">{userInfo.role}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <item.icon className="w-5 h-5 text-gray-500" />
              <span className="font-medium">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        ))}

        <Button
          variant="destructive"
          className="w-full flex items-center justify-center space-x-2 mt-8"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span>退出登录</span>
        </Button>
      </div>
    </div>
  );
}
