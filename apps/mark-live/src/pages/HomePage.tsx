import { useTransactions } from '../hooks/useTransactions';
import { Dashboard } from '../components/Dashboard';
import { TransactionList } from '../components/TransactionList';

export function HomePage() {
  const { transactions, categories, loading, error, refetch, deleteTransaction, getSummary } =
    useTransactions();
  const summary = getSummary();

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
        加载中…
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-destructive">
        <p>{error}</p>
        <button
          type="button"
          className="text-sm underline hover:no-underline"
          onClick={() => refetch()}
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Dashboard income={summary.income} expense={summary.expense} balance={summary.balance} />
      <TransactionList
        transactions={transactions.slice(0, 5)}
        categories={categories}
        onDelete={deleteTransaction}
      />
    </div>
  );
}
