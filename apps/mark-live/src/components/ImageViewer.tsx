import { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ImageViewerProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

export function ImageViewer({ src, alt = '图片预览', onClose }: ImageViewerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-50"
        onClick={onClose}
        aria-label="关闭预览"
      >
        <X className="w-6 h-6" />
      </button>
      <div
        className="relative max-w-full max-h-full overflow-hidden flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt={alt} className="max-w-full max-h-[90vh] object-contain rounded-md" />
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
