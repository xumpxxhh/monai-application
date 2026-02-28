import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from 'ui/react'
import { Transaction, Category } from '../types/index'

interface StatisticsProps {
  transactions: Transaction[]
  categories: Category[]
}

export function Statistics({ transactions, categories }: StatisticsProps) {
  const processData = (type: 'income' | 'expense') => {
    const filtered = transactions.filter((t) => t.type === type)
    const grouped = filtered.reduce(
      (acc, curr) => {
        const category = categories.find((c) => c.id === curr.categoryId)
        const name = category?.name || 'Unknown'
        if (!acc[name]) {
          acc[name] = 0
        }
        acc[name] += curr.amount
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }

  const expenseData = processData('expense')
  const incomeData = processData('income')

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">支出统计</CardTitle>
        </CardHeader>
        <CardContent>
          {expenseData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value?: number) => (value != null ? `¥${value.toFixed(2)}` : '')}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">暂无支出数据</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">收入统计</CardTitle>
        </CardHeader>
        <CardContent>
          {incomeData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {incomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value?: number) => (value != null ? `¥${value.toFixed(2)}` : '')}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">暂无收入数据</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
