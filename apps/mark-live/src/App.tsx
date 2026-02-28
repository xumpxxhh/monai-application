import { useState } from 'react'
import { useTransactions } from './hooks/useTransactions'
import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { TransactionList } from './components/TransactionList'
import { AddTransactionForm } from './components/AddTransactionForm'
import { Statistics } from './components/Statistics'
import { Profile } from './components/Profile'

export default function App() {
  const { transactions, categories, addTransaction, deleteTransaction, getSummary } =
    useTransactions()
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'add' | 'statistics' | 'profile'>(
    'home',
  )
  const summary = getSummary()

  const handleAddTransaction = (data: {
    title: string
    amount: number
    categoryId: string
    date: string
    note?: string
    type: 'income' | 'expense'
  }) => {
    addTransaction(data)
    setActiveTab('home')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <Dashboard
              income={summary.income}
              expense={summary.expense}
              balance={summary.balance}
            />
            <TransactionList
              transactions={transactions.slice(0, 5)} // Show only recent 5
              categories={categories}
              onDelete={deleteTransaction}
            />
          </div>
        )
      case 'history':
        return (
          <TransactionList
            transactions={transactions}
            categories={categories}
            onDelete={deleteTransaction}
          />
        )
      case 'add':
        return (
          <AddTransactionForm
            categories={categories}
            onSubmit={handleAddTransaction}
            onCancel={() => setActiveTab('home')}
          />
        )
      case 'statistics':
        return <Statistics transactions={transactions} categories={categories} />
      case 'profile':
        return <Profile />
      default:
        return null
    }
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  )
}
