import { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { Category, TransactionType } from '../types/index';
import { Button, Input, Label } from 'ui/react';
import { Calendar, Camera, Check, DollarSign, ImagePlus, X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { ImageViewer } from './ImageViewer';

interface AddTransactionFormProps {
  categories: Category[];
  onSubmit: (data: {
    title: string;
    amount: number;
    category: string;
    time: string;
    remark?: string;
    type: TransactionType;
    imageFile?: File;
  }) => void | Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
}

export function AddTransactionForm({
  categories,
  onSubmit,
  onCancel,
  submitting,
}: AddTransactionFormProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [time, setTime] = useState(dayjs().format('YYYY-MM-DD'));
  const [remark, setRemark] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
    e.target.value = '';
  };

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !category || !time) return;

    onSubmit({
      title,
      amount: parseFloat(amount),
      category,
      time,
      remark,
      type,
      imageFile: imageFile ?? undefined,
    });
  };

  const filteredCategories = categories.filter((c) => c.type === type);

  const IconComponent = ({ name, className }: { name: string; className?: string }) => {
    const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
      name
    ];
    return Icon ? <Icon className={className} /> : <Icons.HelpCircle className={className} />;
  };

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      <div className="flex justify-center p-1 bg-gray-100 rounded-lg min-w-0">
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            type === 'expense'
              ? 'bg-white shadow-sm text-red-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
          onClick={() => setType('expense')}
        >
          支出
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            type === 'income'
              ? 'bg-white shadow-sm text-green-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
          onClick={() => setType('income')}
        >
          收入
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">标题</Label>
          <Input
            id="title"
            placeholder="例如：午餐、超市购物"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">金额</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="pl-9 text-lg"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2 min-w-0">
          <Label>分类</Label>
          <div className="grid grid-cols-4 gap-2 sm:gap-3 min-w-0">
            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl border transition-all min-w-0 ${
                  category === cat.id
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div
                  className={`p-2 rounded-full mb-2 shrink-0 ${cat.color || 'bg-gray-100 text-gray-600'}`}
                >
                  <IconComponent name={cat.icon} className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-gray-600 truncate w-full text-center min-w-0">
                  {cat.name}
                </span>
                {category === cat.id && (
                  <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">日期</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              id="time"
              type="date"
              className="pl-9"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="remark">备注 (可选)</Label>
          <Input
            id="remark"
            placeholder="这笔钱是做什么的？"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>消费/收入凭证 (可选)</Label>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageChange}
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          {imagePreview ? (
            <div className="flex justify-center w-full">
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="凭证预览"
                  className="h-24 w-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setShowViewer(true)}
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 p-1 bg-gray-800 text-white rounded-full hover:bg-gray-600"
                  aria-label="移除图片"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center gap-4 w-full">
              <div
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-primary hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors"
              >
                <Camera className="w-6 h-6 mb-2" />
                <span className="text-xs">拍照</span>
              </div>
              <div
                onClick={() => galleryInputRef.current?.click()}
                className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-primary hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors"
              >
                <ImagePlus className="w-6 h-6 mb-2" />
                <span className="text-xs">相册</span>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={submitting}
          >
            取消
          </Button>
          <Button type="submit" className="flex-1" disabled={submitting}>
            {submitting ? '保存中…' : '保存'}
          </Button>
        </div>
      </form>
      {showViewer && imagePreview && (
        <ImageViewer src={imagePreview} onClose={() => setShowViewer(false)} />
      )}
    </div>
  );
}
