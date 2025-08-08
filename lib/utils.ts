/* @ts-nocheck */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate un nombre avec la locale française pour éviter les problèmes d'hydratation
 * Utilise toujours 'fr-FR' pour garantir un formatage cohérent côté serveur et client
 */
export function formatNumber(value: number, locale: string = 'fr-FR'): string {
  return value.toLocaleString(locale);
}

/**
 * Formate un prix en FCFA
 */
export function formatPrice(value: number): string {
  return `${formatNumber(value)} FCFA`;
}
