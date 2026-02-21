import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface ErrorAlertProps {
  message: string;
  className?: string;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  className,
  onDismiss,
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300',
        className
      )}
    >
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <p className="flex-1 text-sm">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-600 hover:text-red-800"
        >
          ×
        </button>
      )}
    </div>
  );
};

