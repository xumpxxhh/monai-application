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

  return <Statistics transactions={transactions} categories={categories} />;
}
