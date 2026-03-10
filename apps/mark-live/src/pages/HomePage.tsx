import { useTransactions } from '../hooks/useTransactions';
import { Dashboard } from '../components/Dashboard';
import { TransactionList } from '../components/TransactionList';

export function HomePage() {
  const { transactions, categories, loading, deleteTransaction, updateTransaction, getSummary } =
    useTransactions();
  const summary = getSummary();

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
        加载中…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Dashboard
        income={summary.income}
        expense={summary.expense}
        balance={summary.balance}
        todayExpense={summary.todayExpense}
        monthDailyAverageExpense={summary.monthDailyAverageExpense}
      />
      <TransactionList
        transactions={transactions.slice(0, 5)}
        categories={categories}
        onDelete={deleteTransaction}
        onUpdate={updateTransaction}
      />
    </div>
  );
}
