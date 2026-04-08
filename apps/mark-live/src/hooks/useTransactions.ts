import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import { Transaction, Category, DEFAULT_CATEGORIES } from '../types/index';
import {
  listBills,
  createBillFormData,
  updateBill,
  deleteBill,
  getBillsStats,
  BillsStatsResponse,
} from '../lib/api';
import { toast } from 'ui/react';

const DEFAULT_STATS: BillsStatsResponse = {
  totalBalance: 0,
  totalIncome: 0,
  totalExpense: 0,
  todayExpense: 0,
  weekDailyAverageExpense: 0,
  monthDailyAverageExpense: 0,
  yearDailyAverageExpense: 0,
};

type UseTransactionsOptions = {
  startDate?: string;
  endDate?: string;
  page?:number;
  pageSize?: number;
  withStats?: boolean;
};

export function useTransactions(options: UseTransactionsOptions = {}) {
  const { startDate, endDate, page, pageSize, withStats = true } = options;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<BillsStatsResponse>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);

  const fetchBills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listBills({
        startDate,
        endDate,
        page,
        pageSize,
      });
      setTransactions(res.items);
    } catch (err) {
      const msg = (err as { message?: string })?.message ?? '获取账单失败';
      setError(msg);
      toast.error(msg);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, pageSize]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await getBillsStats();
      setStats(res);
    } catch {
      setStats(DEFAULT_STATS);
    }
  }, []);

  useEffect(() => {
    if (withStats) {
      void Promise.all([fetchBills(), fetchStats()]);
      return;
    }
    void fetchBills();
  }, [fetchBills, fetchStats, withStats]);

  const refetch = useCallback(async () => {
    if (withStats) {
      await Promise.all([fetchBills(), fetchStats()]);
      return;
    }
    await fetchBills();
  }, [fetchBills, fetchStats, withStats]);

  const addTransaction = async (
    transaction: Omit<Transaction, 'id' | 'createdAt'> & { imageFile?: File },
  ) => {
    setError(null);
    try {
      const created = await createBillFormData({
        type: transaction.type,
        title: transaction.title,
        amount: transaction.amount,
        category: transaction.category,
        time: transaction.time,
        remark: transaction.remark,
        imageFile: transaction.imageFile,
      });
      setTransactions((prev) => [created as Transaction, ...prev]);
      if (withStats) {
        await fetchStats();
      }
      return created;
    } catch (err) {
      const msg = (err as { message?: string })?.message ?? '新增账单失败';
      setError(msg);
      throw err;
    }
  };

  const updateTransaction = async (
    id: string,
    data: {
      title: string;
      amount: number;
      category: string;
      time: string;
      remark?: string;
      imageUrl?: string;
    },
  ) => {
    setError(null);
    try {
      const updated = await updateBill(id, data);
      setTransactions((prev) => prev.map((t) => (t.id === id ? (updated as Transaction) : t)));
      if (withStats) {
        await fetchStats();
      }
      return updated;
    } catch (err) {
      const msg = (err as { message?: string })?.message ?? '更新账单失败';
      setError(msg);
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    setError(null);
    try {
      await deleteBill(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      if (withStats) {
        await fetchStats();
      }
    } catch (err) {
      const msg = (err as { message?: string })?.message ?? '删除账单失败';
      setError(msg);
      throw err;
    }
  };

  const getSummary = () => {
    return {
      income: stats.totalIncome,
      expense: stats.totalExpense,
      balance: stats.totalBalance,
      todayExpense: stats.todayExpense,
      weekDailyAverageExpense: stats.weekDailyAverageExpense,
      monthDailyAverageExpense: stats.monthDailyAverageExpense,
      yearDailyAverageExpense: stats.yearDailyAverageExpense,
    };
  };

  return {
    transactions,
    categories,
    loading,
    error,
    refetch,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getSummary,
  };
}

export function useHomeTransactions() {
  const startDate = dayjs().startOf('month').format('YYYY-MM-DD');
  const endDate = dayjs().endOf('month').format('YYYY-MM-DD');
  return useTransactions({ startDate, endDate, withStats: true });
}

type UseHistoryTransactionsOptions = {
  startDate?: string;
  endDate?: string;
  page?:number;
  pageSize?: number;
};

export function useHistoryTransactions(options: UseHistoryTransactionsOptions = {}) {
  return useTransactions({ ...options, withStats: false });
}
