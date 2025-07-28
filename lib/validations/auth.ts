/* @ts-nocheck */
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z
    .string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  phone: z
    .string()
    .optional()
    .refine((phone) => {
      if (!phone) return true;
      return /^\+241\s?[0-9]{8}$/.test(phone);
    }, 'Format de téléphone invalide (ex: +241 07123456)'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export const profileSchema = z.object({
  dateOfBirth: z.date().optional(),
  placeOfBirth: z.string().optional(),
  gender: z.enum(['MASCULIN', 'FEMININ', 'AUTRE']).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.enum([
    'ESTUAIRE',
    'HAUT_OGOOUE',
    'MOYEN_OGOOUE',
    'NGOUNIE',
    'NYANGA',
    'OGOOUE_IVINDO',
    'OGOOUE_LOLO',
    'OGOOUE_MARITIME',
    'WOLEU_NTEM'
  ]).optional(),
  profession: z.string().optional(),
  employer: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;