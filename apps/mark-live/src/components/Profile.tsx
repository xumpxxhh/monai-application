import { Card, CardContent, CardHeader, CardTitle, Button } from 'ui/react'
import { User, Settings, LogOut, ChevronRight, HelpCircle } from 'lucide-react'

export function Profile() {
  const menuItems = [
    { icon: Settings, label: '设置' },
    { icon: HelpCircle, label: '帮助与反馈' },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">用户</h2>
              <p className="text-sm text-gray-500">记录美好生活</p>
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
        >
          <LogOut className="w-4 h-4" />
          <span>退出登录</span>
        </Button>
      </div>
    </div>
  )
}
