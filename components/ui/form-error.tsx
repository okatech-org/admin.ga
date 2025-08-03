import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  message?: string;
  error?: any;
  className?: string;
}

export function FormError({ message, error, className = '' }: FormErrorProps) {
  const errorMessage = message || error?.message;
  if (!errorMessage) return null;

  return (
    <div className={`flex items-center gap-2 text-sm text-red-600 ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <span>{errorMessage}</span>
    </div>
  );
}
