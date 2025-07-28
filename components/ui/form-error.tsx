/* @ts-nocheck */
import React from 'react';

interface FormErrorProps {
  error?: any;
}

export function FormError({ error }: FormErrorProps) {
  if (!error) return null;
  
  let message = 'Erreur de validation';
  
  if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object') {
    if (error.message) {
      message = typeof error.message === 'string' ? error.message : 'Erreur de validation';
    }
  }
    
  return (
    <p className="text-sm text-destructive">
      {message}
    </p>
  );
} 