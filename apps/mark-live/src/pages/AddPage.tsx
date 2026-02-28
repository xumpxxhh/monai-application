import { useNavigate } from 'react-router-dom'
import { useTransactions } from '../hooks/useTransactions'
import { AddTransactionForm } from '../components/AddTransactionForm'

export function AddPage() {
  const { categories, addTransaction } = useTransactions()
  const navigate = useNavigate()

  const handleAddTransaction = (data: {
    title: string
    amount: number
    categoryId: string
    date: string
    note?: string
    type: 'income' | 'expense'
  }) => {
    addTransaction(data)
    navigate('/')
  }

  return (
    <AddTransactionForm
      categories={categories}
      onSubmit={handleAddTransaction}
      onCancel={() => navigate('/')}
    />
  )
}
