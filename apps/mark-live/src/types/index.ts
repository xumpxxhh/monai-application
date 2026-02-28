export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string; // lucide-react icon name
  color?: string; // tailwind color class
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  categoryId: string;
  date: string; // ISO string
  note?: string;
  type: TransactionType;
  createdAt: number; // timestamp
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '餐饮', type: 'expense', icon: 'Utensils', color: 'bg-red-100 text-red-600' },
  { id: '2', name: '交通', type: 'expense', icon: 'Car', color: 'bg-blue-100 text-blue-600' },
  { id: '3', name: '购物', type: 'expense', icon: 'ShoppingBag', color: 'bg-purple-100 text-purple-600' },
  { id: '4', name: '居住', type: 'expense', icon: 'Home', color: 'bg-orange-100 text-orange-600' },
  { id: '5', name: '工资', type: 'income', icon: 'Wallet', color: 'bg-green-100 text-green-600' },
  { id: '6', name: '其他', type: 'expense', icon: 'MoreHorizontal', color: 'bg-gray-100 text-gray-600' },
];
