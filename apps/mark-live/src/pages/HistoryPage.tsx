import { useTransactions } from '../hooks/useTransactions'
import { TransactionList } from '../components/TransactionList'

export function HistoryPage() {
  const { transactions, categories, deleteTransaction } = useTransactions()

  return (
    <TransactionList
      transactions={transactions}
      categories={categories}
      onDelete={deleteTransaction}
    />
  )
}
