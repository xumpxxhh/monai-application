import { useTransactions } from '../hooks/useTransactions';
import { TransactionList } from '../components/TransactionList';

export function HistoryPage() {
  const { transactions, categories, loading, error, refetch, deleteTransaction } =
    useTransactions();

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
        加载中…
      </div>
    );
  }

  return (
    <TransactionList
      transactions={transactions}
      categories={categories}
      onDelete={deleteTransaction}
    />
  );
}
