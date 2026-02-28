import { useState } from 'react'
import { Category, TransactionType } from '../types/index'
import { Button, Input, Label } from 'ui/react'
import { Calendar, Check, DollarSign } from 'lucide-react'
import * as Icons from 'lucide-react'

interface AddTransactionFormProps {
  categories: Category[]
  onSubmit: (data: {
    title: string
    amount: number
    categoryId: string
    date: string
    note?: string
    type: TransactionType
  }) => void
  onCancel: () => void
}

export function AddTransactionForm({ categories, onSubmit, onCancel }: AddTransactionFormProps) {
  const [type, setType] = useState<TransactionType>('expense')
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [note, setNote] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !amount || !categoryId || !date) return

    onSubmit({
      title,
      amount: parseFloat(amount),
      categoryId,
      date,
      note,
      type,
    })
  }

  const filteredCategories = categories.filter((c) => c.type === type)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = ({ name, className }: { name: string; className?: string }) => {
    const Icon = (Icons as any)[name]
    return Icon ? <Icon className={className} /> : <Icons.HelpCircle className={className} />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center p-1 bg-gray-100 rounded-lg">
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            type === 'expense'
              ? 'bg-white shadow-sm text-red-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
          onClick={() => setType('expense')}
        >
          支出
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            type === 'income'
              ? 'bg-white shadow-sm text-green-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
          onClick={() => setType('income')}
        >
          收入
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">标题</Label>
          <Input
            id="title"
            placeholder="例如：午餐、超市购物"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">金额</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="pl-9 text-lg"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>分类</Label>
          <div className="grid grid-cols-4 gap-3">
            {filteredCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setCategoryId(category.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  categoryId === category.id
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div
                  className={`p-2 rounded-full mb-2 ${
                    category.color || 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <IconComponent name={category.icon} className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-gray-600 truncate w-full text-center">
                  {category.name}
                </span>
                {categoryId === category.id && (
                  <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">日期</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              id="date"
              type="date"
              className="pl-9"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">备注 (可选)</Label>
          <Input
            id="note"
            placeholder="这笔钱是做什么的？"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="pt-4 flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
            取消
          </Button>
          <Button type="submit" className="flex-1">
            保存
          </Button>
        </div>
      </form>
    </div>
  )
}
