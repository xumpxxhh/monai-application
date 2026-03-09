import { useState, useEffect, useCallback } from 'react';
import { Transaction, Category, DEFAULT_CATEGORIES } from '../types/index';
import { listBills, createBillFormData, deleteBill } from '../lib/api';
import { toast } from 'ui/react';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);

  const fetchBills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listBills({ page: 1, pageSize: 20 });
      setTransactions(res.items);
    } catch (err) {
      const msg = (err as { message?: string })?.message ?? '获取账单失败';
      setError(msg);
      toast.error(msg);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

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
      return created;
    } catch (err) {
      const msg = (err as { message?: string })?.message ?? '新增账单失败';
      setError(msg);
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    setError(null);
    try {
      await deleteBill(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      const msg = (err as { message?: string })?.message ?? '删除账单失败';
      setError(msg);
      throw err;
    }
  };

  const getSummary = () => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const now = new Date();
    const todayStr = now
      .toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
      .replace(/\//g, '-');
    const currentYearStr = now.getFullYear().toString();
    const currentMonthStr = (now.getMonth() + 1).toString().padStart(2, '0');
    const currentYearMonthPrefix = `${currentYearStr}-${currentMonthStr}`;

    const todayExpense = transactions
      .filter((t) => t.type === 'expense' && t.time.startsWith(todayStr))
      .reduce((acc, curr) => acc + curr.amount, 0);

    const monthExpense = transactions
      .filter((t) => t.type === 'expense' && t.time.startsWith(currentYearMonthPrefix))
      .reduce((acc, curr) => acc + curr.amount, 0);

    const currentDay = now.getDate();
    const monthDailyAverageExpense = currentDay > 0 ? monthExpense / currentDay : 0;

    return {
      income,
      expense,
      balance: income - expense,
      todayExpense,
      monthDailyAverageExpense,
    };
  };

  return {
    transactions,
    categories,
    loading,
    error,
    refetch: fetchBills,
    addTransaction,
    deleteTransaction,
    getSummary,
  };
}
