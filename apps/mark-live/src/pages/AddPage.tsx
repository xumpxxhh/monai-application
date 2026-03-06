import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'ui/react';
import { useTransactions } from '../hooks/useTransactions';
import { AddTransactionForm } from '../components/AddTransactionForm';

export function AddPage() {
  const { categories, addTransaction, error: transactionError } = useTransactions();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleAddTransaction = async (data: {
    title: string;
    amount: number;
    category: string;
    time: string;
    remark?: string;
    type: 'income' | 'expense';
    imageFile?: File;
  }) => {
    setSubmitting(true);
    try {
      await addTransaction(data);
      toast.success('保存成功');
      navigate('/');
    } catch (err) {
      toast.error('保存失败，请重试：' + transactionError + err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AddTransactionForm
      categories={categories}
      onSubmit={handleAddTransaction}
      onCancel={() => navigate('/')}
      submitting={submitting}
    />
  );
}
