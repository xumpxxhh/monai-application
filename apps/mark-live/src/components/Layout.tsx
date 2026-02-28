import { ReactNode } from 'react'
import { Home, List, PlusCircle, User, PieChart } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
  activeTab: 'home' | 'history' | 'add' | 'statistics' | 'profile'
  onTabChange: (tab: 'home' | 'history' | 'add' | 'statistics' | 'profile') => void
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <header className="bg-white shadow-sm flex-none z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">生活记账</h1>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('zh-CN', {
              month: 'long',
              day: 'numeric',
              weekday: 'short',
            })}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto p-4 overflow-y-auto pb-24 scrollbar-hide">
        {children}
      </main>

      <nav className="flex-none bg-white border-t border-gray-200 pb-safe z-10">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          <button
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              activeTab === 'home' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">首页</span>
          </button>

          <button
            onClick={() => onTabChange('history')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              activeTab === 'history' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <List className="w-6 h-6" />
            <span className="text-xs">明细</span>
          </button>

          <button
            onClick={() => onTabChange('add')}
            className="flex flex-col items-center justify-center w-full h-full -mt-6"
          >
            <div className="bg-primary text-white rounded-full p-3 shadow-lg hover:bg-primary/90 transition-colors">
              <PlusCircle className="w-8 h-8" />
            </div>
            <span className="text-xs mt-1 text-gray-600">记一笔</span>
          </button>

          <button
            onClick={() => onTabChange('statistics')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              activeTab === 'statistics' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <PieChart className="w-6 h-6" />
            <span className="text-xs">统计</span>
          </button>

          <button
            onClick={() => onTabChange('profile')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              activeTab === 'profile' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">个人</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
