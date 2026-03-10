import { createContext, useCallback, useContext, useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'ui/react';

export interface ConfirmOptions {
  title?: string;
  message: string;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('确认');
  const [message, setMessage] = useState('');
  const resolveRef = useRef<(value: boolean) => void>(() => {});
  const didConfirmRef = useRef(false);

  const confirm = useCallback<ConfirmFn>((options) => {
    setTitle(options.title ?? '确认');
    setMessage(options.message);
    setOpen(true);
    didConfirmRef.current = false;
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleConfirm = () => {
    resolveRef.current(true);
    didConfirmRef.current = true;
    setOpen(false);
  };

  const handleCancel = () => {
    resolveRef.current(false);
    setOpen(false);
  };

  const handleOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen && !didConfirmRef.current) handleCancel();
    didConfirmRef.current = false;
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent className="w-[90%] max-w-sm rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-3 sm:gap-3">
            <AlertDialogCancel className="flex-1 mt-0" onClick={handleCancel}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction className="flex-1 mt-0" onClick={handleConfirm}>
              确定
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirmDialog(): ConfirmFn {
  const confirm = useContext(ConfirmContext);
  if (!confirm) {
    throw new Error('useConfirmDialog must be used within ConfirmDialogProvider');
  }
  return confirm;
}
