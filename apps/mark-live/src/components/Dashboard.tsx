import { Card, CardContent, CardHeader, CardTitle } from 'ui/react';
import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';

interface DashboardProps {
  income: number;
  expense: number;
  balance: number;
  todayExpense: number;
  weekDailyAverageExpense: number;
  monthDailyAverageExpense: number;
  yearDailyAverageExpense: number;
}

export function Dashboard({
  income,
  expense,
  balance,
  todayExpense,
  weekDailyAverageExpense,
  monthDailyAverageExpense,
  yearDailyAverageExpense,
}: DashboardProps) {
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
              总收入
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
              总支出
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">¥{expense.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Card>
          <CardHeader className="p-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ArrowUpCircle className="w-4 h-4 text-orange-500" />
              今日消费
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className="text-xl font-bold text-orange-600 text-center">
              ¥{todayExpense.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ArrowUpCircle className="w-4 h-4 text-blue-500" />
              周日消费
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className="text-xl font-bold text-blue-600 text-center">
              ¥{weekDailyAverageExpense.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ArrowUpCircle className="w-4 h-4 text-purple-500" />
              月日消费
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className="text-xl font-bold text-purple-600 text-center">
              ¥{monthDailyAverageExpense.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ArrowUpCircle className="w-4 h-4 text-cyan-500" />
              年日消费
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className="text-xl font-bold text-cyan-600 text-center">
              ¥{yearDailyAverageExpense.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
