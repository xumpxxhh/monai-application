import { ReactNode } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { Home, List, PlusCircle, User, PieChart } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col h-[100dvh] w-full min-w-0 max-w-full bg-gray-50 text-gray-900 overflow-hidden">
      <header className="w-full min-w-0 flex-shrink-0 bg-white shadow-sm z-10">
        <div className="w-full max-w-md mx-auto px-4 py-3 flex justify-between items-center min-w-0">
          <h1 className="text-xl font-bold text-primary truncate min-w-0 mr-2">mark live</h1>
          <div className="text-sm text-gray-500 flex-shrink-0">
            {dayjs().locale('zh-cn').format('M月D日 ddd')}
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 w-full min-w-0 overflow-x-hidden overflow-y-auto pb-24 scrollbar-hide">
        <div className="w-full max-w-md mx-auto min-w-0 min-h-0 p-4 box-border">{children}</div>
      </main>

      <nav className="w-full min-w-0 flex-shrink-0 bg-white border-t border-gray-200 pb-safe z-10">
        <div className="w-full max-w-md mx-auto min-w-0 flex justify-around items-center h-16">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">首页</span>
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            <List className="w-6 h-6" />
            <span className="text-xs">明细</span>
          </NavLink>

          <NavLink
            to="/add"
            className="flex flex-col items-center justify-center w-full h-full -mt-6"
          >
            <div className="bg-primary text-white rounded-full p-3 shadow-lg hover:bg-primary/90 transition-colors">
              <PlusCircle className="w-8 h-8" />
            </div>
            <span className="text-xs mt-1 text-gray-600">记一笔</span>
          </NavLink>

          <NavLink
            to="/statistics"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            <PieChart className="w-6 h-6" />
            <span className="text-xs">统计</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            <User className="w-6 h-6" />
            <span className="text-xs">个人</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
