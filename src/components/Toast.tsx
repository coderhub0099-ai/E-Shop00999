/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const success = useCallback((msg: string) => toast(msg, 'success'), [toast]);
  const error = useCallback((msg: string) => toast(msg, 'error'), [toast]);
  const info = useCallback((msg: string) => toast(msg, 'info'), [toast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      
      {/* Toast Render Stack */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full font-sans pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            let bgColor = 'bg-white';
            let borderColor = 'border-gray-900';
            let icon = <Info className="w-5 h-5 text-blue-500" />;
            let emoji = '🍊';

            if (t.type === 'success') {
              bgColor = 'bg-white';
              borderColor = 'border-emerald-200';
              icon = <CheckCircle className="w-5 h-5 text-emerald-600" />;
              emoji = '🎉';
            } else if (t.type === 'error') {
              bgColor = 'bg-white';
              borderColor = 'border-rose-205';
              icon = <AlertCircle className="w-5 h-5 text-rose-600" />;
              emoji = '⚠️';
            } else {
              bgColor = 'bg-white';
              borderColor = 'border-blue-200';
              icon = <Info className="w-5 h-5 text-blue-500" />;
              emoji = '🍊';
            }

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`pointer-events-auto flex items-center gap-3 p-3.5 rounded-xl border shadow-md ${bgColor} ${borderColor}`}
                id={`toast-${t.id}`}
              >
                <div className="flex-shrink-0 text-base h-8 w-8 bg-slate-50 border border-slate-150 rounded-lg flex items-center justify-center select-none shadow-2xs">
                  {emoji}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    {t.message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(t.id)}
                  className="p-1 hover:bg-slate-100/60 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside a ToastProvider context.');
  }
  return context;
};
