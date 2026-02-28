import { useTransactions } from '../hooks/useTransactions'
import { Dashboard } from '../components/Dashboard'
import { TransactionList } from '../components/TransactionList'

export function HomePage() {
  const { transactions, categories, deleteTransaction, getSummary } = useTransactions()
  const summary = getSummary()

  return (
    <div className="space-y-6">
      <Dashboard income={summary.income} expense={summary.expense} balance={summary.balance} />
      <TransactionList
        transactions={transactions.slice(0, 5)} // Show only recent 5
        categories={categories}
        onDelete={deleteTransaction}
      />
    </div>
  )
}
