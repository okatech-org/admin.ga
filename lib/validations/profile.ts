/* @ts-nocheck */
import { z } from 'zod';

export const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  dateOfBirth: z.date({
    required_error: 'La date de naissance est requise',
  }).refine(date => {
    const age = new Date().getFullYear() - date.getFullYear();
    return age >= 0 && age <= 120;
  }, 'Date de naissance invalide'),
  placeOfBirth: z.string().min(2, 'Le lieu de naissance est requis'),
  gender: z.enum(['MASCULIN', 'FEMININ', 'AUTRE'], {
    required_error: 'Le genre est requis',
  }),
  nationality: z.string().default('Gabonaise'),
  maritalStatus: z.enum(['CELIBATAIRE', 'MARIE', 'DIVORCE', 'VEUF', 'UNION_LIBRE']).optional(),
});

export const addressSchema = z.object({
  address: z.string().min(5, 'L\'adresse doit contenir au moins 5 caractères'),
  city: z.string().min(2, 'La ville est requise'),
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
  ], {
    required_error: 'La province est requise',
  }),
  postalCode: z.string().optional(),
  country: z.string().default('Gabon'),
});

export const contactSchema = z.object({
  phone: z.string().regex(/^\+241\s?[0-9]{8}$/, 'Format de téléphone invalide (ex: +241 07123456)'),
  alternatePhone: z.string().regex(/^\+241\s?[0-9]{8}$/, 'Format de téléphone invalide').optional().or(z.literal('')),
  emergencyContact: z.object({
    name: z.string().min(2, 'Le nom du contact d\'urgence est requis'),
    phone: z.string().regex(/^\+241\s?[0-9]{8}$/, 'Format de téléphone invalide'),
    relation: z.string().min(2, 'La relation est requise'),
  }).optional(),
});

export const professionalSchema = z.object({
  profession: z.string().min(2, 'La profession est requise'),
  employer: z.string().optional(),
});

export const familySchema = z.object({
  fatherName: z.string().min(2, 'Le nom du père est requis'),
  motherName: z.string().min(2, 'Le nom de la mère est requis'),
  spouseName: z.string().optional(),
  children: z.array(z.object({
    name: z.string(),
    dateOfBirth: z.date(),
    gender: z.enum(['MASCULIN', 'FEMININ']),
  })).optional(),
});

export const completeProfileSchema = personalInfoSchema
  .merge(addressSchema)
  .merge(contactSchema)
  .merge(professionalSchema)
  .merge(familySchema);

export const documentUploadSchema = z.object({
  type: z.enum([
    'PHOTO_IDENTITE',
    'ACTE_NAISSANCE',
    'JUSTIFICATIF_DOMICILE',
    'DIPLOME',
    'ATTESTATION_TRAVAIL',
    'CASIER_JUDICIAIRE',
    'CERTIFICAT_MEDICAL',
    'ACTE_MARIAGE',
    'CNI_RECTO',
    'CNI_VERSO',
    'PASSEPORT',
    'PERMIS_CONDUIRE'
  ]),
  name: z.string(),
  originalName: z.string(),
  url: z.string().url(),
  size: z.number(),
  mimeType: z.string(),
});

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ProfessionalInput = z.infer<typeof professionalSchema>;
export type FamilyInput = z.infer<typeof familySchema>;
export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;
export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;