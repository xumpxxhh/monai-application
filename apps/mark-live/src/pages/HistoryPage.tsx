import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useHistoryTransactions } from '../hooks/useTransactions';
import { TransactionList } from '../components/TransactionList';
import { Label } from 'ui/react';

type TimeRange = '7d' | '30d' | '90d' | 'all';

export function HistoryPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [limit, setLimit] = useState<number>(50);

  const { startDate, endDate } = useMemo(() => {
    if (timeRange === 'all') {
      return { startDate: undefined, endDate: undefined };
    }
    const days = timeRange === '7d' ? 7 : timeRange === '90d' ? 90 : 30;
    return {
      startDate: dayjs().subtract(days, 'day').format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD'),
    };
  }, [timeRange]);

  const { transactions, categories, loading, deleteTransaction } = useHistoryTransactions({
    startDate,
    endDate,
    page: 1,
    pageSize: limit,
  });

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
        加载中…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="history-time-range">时间范围</Label>
          <select
            id="history-time-range"
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          >
            <option value="7d">近一周</option>
            <option value="30d">近一月</option>
            <option value="90d">近三月</option>
            <option value="all">全部时间</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="history-limit">条数限制</Label>
          <select
            id="history-limit"
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={String(limit)}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value="50">仅查询50条</option>
            <option value="100">仅查询100条</option>
            <option value="200">仅查询200条</option>
          </select>
        </div>
      </div>

      <TransactionList
        transactions={transactions}
        categories={categories}
        onDelete={deleteTransaction}
      />
    </div>
  );
}
