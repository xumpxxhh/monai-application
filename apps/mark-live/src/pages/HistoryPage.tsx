import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useHistoryTransactions } from '../hooks/useTransactions';
import { TransactionList } from '../components/TransactionList';
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ui/react';

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
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
            <SelectTrigger id="history-time-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">近一周</SelectItem>
              <SelectItem value="30d">近一月</SelectItem>
              <SelectItem value="90d">近三月</SelectItem>
              <SelectItem value="all">全部时间</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="history-limit">条数限制</Label>
          <Select value={String(limit)} onValueChange={(value) => setLimit(Number(value))}>
            <SelectTrigger id="history-limit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50">仅查询50条</SelectItem>
              <SelectItem value="100">仅查询100条</SelectItem>
              <SelectItem value="200">仅查询200条</SelectItem>
            </SelectContent>
          </Select>
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
