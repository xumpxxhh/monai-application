import { Transaction, Category } from '../types/index'
import { Trash2 } from 'lucide-react'
import { Button } from 'ui/react'
import * as Icons from 'lucide-react'

interface TransactionListProps {
  transactions: Transaction[]
  categories: Category[]
  onDelete: (id: string) => void
}

export function TransactionList({ transactions, categories, onDelete }: TransactionListProps) {
  // Group transactions by date
  const groupedTransactions = transactions.reduce(
    (groups, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(transaction)
      return groups
    },
    {} as Record<string, Transaction[]>,
  )

  const getCategory = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)
  }

  const IconComponent = ({ name, className }: { name: string; className?: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Icon = (Icons as any)[name]
    return Icon ? <Icon className={className} /> : <Icons.HelpCircle className={className} />
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">最近记录</h2>
      {Object.keys(groupedTransactions).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500 space-y-4">
          <div className="p-4 bg-gray-100 rounded-full">
            <Icons.Receipt className="w-8 h-8 text-gray-400" />
          </div>
          <p>暂无记录</p>
          <p className="text-xs">点击下方 + 按钮开始记账</p>
        </div>
      ) : (
        Object.entries(groupedTransactions).map(([date, items]) => (
          <div key={date} className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500 sticky top-14 bg-gray-50 py-1 z-0">
              {date}
            </h3>
            <div className="space-y-3">
              {items.map((transaction) => {
                const category = getCategory(transaction.categoryId)
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          category?.color || 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <IconComponent name={category?.icon || 'HelpCircle'} className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.title || category?.name || 'Unknown'}
                        </p>
                        <div className="flex flex-col text-xs text-gray-500">
                          {transaction.title && category?.name && <span>{category.name}</span>}
                          {transaction.note && <span>{transaction.note}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}¥{transaction.amount.toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                        onClick={() => onDelete(transaction.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
