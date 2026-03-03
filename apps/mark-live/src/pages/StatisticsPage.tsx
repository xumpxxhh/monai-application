import { useTransactions } from '../hooks/useTransactions';
import { Statistics } from '../components/Statistics';

export function StatisticsPage() {
  const { transactions, categories, loading, error, refetch } = useTransactions();

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

  return <Statistics transactions={transactions} categories={categories} />;
}
