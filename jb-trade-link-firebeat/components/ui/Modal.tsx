import React, { Fragment } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, subtitle, children, size = 'md', footer }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 sm:p-0">
        {/* Backdrop with blur */}
        <div
          className="fixed inset-0 bg-slate-900 bg-opacity-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        ></div>

        {/* Panel */}
        <div className={`relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all duration-300 w-full ${sizes[size]} slide-in-up`}>
          {/* Header */}
          <div className="flex justify-between items-start p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 rounded-lg hover:bg-slate-200 transition-colors duration-200 text-slate-500 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
