import { Card, CardContent, CardHeader, CardTitle } from 'ui/react'
import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react'

interface DashboardProps {
  income: number
  expense: number
  balance: number
}

export function Dashboard({ income, expense, balance }: DashboardProps) {
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium opacity-80 flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            总余额
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">¥{balance.toFixed(2)}</div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ArrowDownCircle className="w-4 h-4 text-green-500" />
              收入
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">¥{income.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ArrowUpCircle className="w-4 h-4 text-red-500" />
              支出
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">¥{expense.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
