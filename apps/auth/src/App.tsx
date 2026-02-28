import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  toast,
} from 'ui/react'
import { Github, Mail } from 'lucide-react'
import { apiRequest } from './lib/api'
import { User, AuthResponse } from './types'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    validateToken()
  }, [])

  const validateToken = async () => {
    try {
      const response = await apiRequest<User>(`/validate`, 'GET')
      setUser(response)
    } catch (err) {
      setUser(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        await apiRequest<AuthResponse>(`/login`, 'POST', {
          email,
          password,
          username: username || undefined,
        })
        await validateToken()
        toast.success('登录成功！')
      } else {
        await apiRequest(`/register`, 'POST', {
          email,
          password,
          username: username || undefined,
        })
        toast.success('注册成功！请登录。')
        setIsLogin(true)
      }
    } catch (err: any) {
      toast.error(err.message || '发生错误')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await apiRequest('/logout', 'POST')
      toast.success('已退出登录')
    } catch (err) {
      console.error('Logout failed:', err)
      toast.error('退出登录失败')
    } finally {
      setUser(null)
      setEmail('')
      setPassword('')
      setUsername('')
    }
  }

  if (user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle>欢迎！</CardTitle>
            <CardDescription>您已登录。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">用户 ID：</span>
              <span>{user.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">角色：</span>
              <span className="capitalize">{user.role}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              退出登录
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            {isLogin ? '登录' : '创建账户'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin ? '请输入您的邮箱和密码以访问您的账户' : '在下方输入您的邮箱以创建账户'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-6">
            <Button variant="outline">
              <Github className="mr-2 h-4 w-4" />
              Github
            </Button>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">或者使用以下方式继续</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            {!isLogin && (
              <div className="grid gap-2">
                <Label htmlFor="username">用户名（可选）</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? '处理中...' : isLogin ? '登录' : '注册'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="px-8 text-center text-sm text-muted-foreground">
            {isLogin ? '还没有账户？ ' : '已有账户？ '}
            <button
              onClick={() => {
                setIsLogin(!isLogin)
              }}
              className="underline underline-offset-4 hover:text-primary"
            >
              {isLogin ? '去注册' : '去登录'}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
