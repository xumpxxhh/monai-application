import { useTransactions } from '../hooks/useTransactions'
import { Statistics } from '../components/Statistics'

export function StatisticsPage() {
  const { transactions, categories } = useTransactions()

  return <Statistics transactions={transactions} categories={categories} />
}
