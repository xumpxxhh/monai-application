import { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { Transaction, Category } from '../types/index';
import { Trash2, Pencil } from 'lucide-react';
import { Button, toast } from 'ui/react';
import * as Icons from 'lucide-react';
import { ImageViewer } from './ImageViewer';
import { useConfirmDialog } from './ConfirmDialog';
import { AddTransactionForm } from './AddTransactionForm';
import type { UpdateTransactionFormData } from './AddTransactionForm';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (id: string) => void | Promise<void>;
  onUpdate?: (id: string, data: UpdateTransactionFormData) => void | Promise<unknown>;
}

export function TransactionList({
  transactions,
  categories,
  onDelete,
  onUpdate,
}: TransactionListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const confirm = useConfirmDialog();

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: '删除确认',
      message: '确定要删除这条账单记录吗？此操作无法恢复。',
    });
    if (!ok) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } catch {
      toast.error('删除失败，请重试');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdate = async (id: string, data: UpdateTransactionFormData) => {
    if (!onUpdate) return;
    setUpdatingId(id);
    try {
      await onUpdate(id, data);
      toast.success('修改成功');
      setEditingTransaction(null);
    } catch {
      toast.error('修改失败，请重试');
    } finally {
      setUpdatingId(null);
    }
  };

  // Group transactions by time (与后端 bill.time 一致)
  const groupedTransactions = transactions.reduce(
    (groups, transaction) => {
      const timeLabel = dayjs(transaction.time).locale('zh-cn').format('YYYY年M月D日');
      if (!groups[timeLabel]) {
        groups[timeLabel] = [];
      }
      groups[timeLabel].push(transaction);
      return groups;
    },
    {} as Record<string, Transaction[]>,
  );

  const getCategory = (category: string) => {
    return categories.find((c) => c.id === category);
  };

  const IconComponent = ({ name, className }: { name: string; className?: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Icon = (Icons as any)[name];
    return Icon ? <Icon className={className} /> : <Icons.HelpCircle className={className} />;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">最近记录</h2>
      {Object.keys(groupedTransactions).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500 space-y-4">
          <div className="p-4 bg-gray-100 rounded-full">
            <Icons.Receipt className="w-8 h-8 text-gray-400" />
          </div>
          <p>暂无记录</p>
          <p className="text-xs">点击下方 + 按钮开始记账</p>
        </div>
      ) : (
        Object.entries(groupedTransactions).map(([timeLabel, items]) => (
          <div key={timeLabel} className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500 sticky top-14 bg-gray-50 py-1 z-0">
              {timeLabel}
            </h3>
            <div className="space-y-3">
              {items.map((transaction) => {
                const cat = getCategory(transaction.category);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow min-w-0"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`p-2 rounded-full shrink-0 ${
                          cat?.color || 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <IconComponent name={cat?.icon || 'HelpCircle'} className="w-5 h-5" />
                      </div>
                      {transaction.imageUrl && (
                        <img
                          src={transaction.imageUrl}
                          alt="凭证"
                          className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setPreviewImage(transaction.imageUrl as string)}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate">
                          {transaction.title || cat?.name || 'Unknown'}
                        </p>
                        <div className="flex flex-col text-xs text-gray-500 truncate">
                          {transaction.title && cat?.name && <span>{cat.name}</span>}
                          {transaction.remark && <span>{transaction.remark}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`font-semibold whitespace-nowrap ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}¥{transaction.amount.toFixed(2)}
                      </span>
                      {onUpdate && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-primary"
                          onClick={() => setEditingTransaction(transaction)}
                          disabled={updatingId === transaction.id}
                          aria-label="编辑"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                        onClick={() => handleDelete(transaction.id)}
                        disabled={deletingId === transaction.id}
                        aria-label="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
      {previewImage && <ImageViewer src={previewImage} onClose={() => setPreviewImage(null)} />}

      {editingTransaction && onUpdate && (
        <div className="fixed inset-0 z-50 bg-black/50 flex flex-col items-center justify-end sm:justify-center p-0 sm:p-4">
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-background rounded-t-2xl sm:rounded-2xl shadow-xl p-4 pb-safe"
            role="dialog"
            aria-modal="true"
            aria-label="编辑账单"
          >
            <h3 className="text-lg font-semibold mb-4">编辑账单</h3>
            <AddTransactionForm
              categories={categories}
              initialTransaction={editingTransaction}
              onUpdate={(id, data) => handleUpdate(id, data)}
              onSubmit={() => {}}
              onCancel={() => setEditingTransaction(null)}
              submitting={updatingId === editingTransaction.id}
            />
          </div>
        </div>
      )}
    </div>
  );
}
