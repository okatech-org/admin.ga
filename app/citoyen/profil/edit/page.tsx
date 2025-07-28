/* @ts-nocheck */
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { useAuth } from '@/hooks/use-auth';
import { personalInfoSchema, addressSchema, contactSchema, professionalSchema, familySchema } from '@/lib/validations/profile';
import type { PersonalInfoInput, AddressInput, ContactInput, ProfessionalInput, FamilyInput } from '@/lib/validations/profile';
import { 
  User, 
  MapPin, 
  Phone, 
  Briefcase, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Save,
  CheckCircle
} from 'lucide-react';
import { FormError } from '@/components/ui/form-error';

const steps = [
  { 
    id: 1, 
    title: 'Informations personnelles', 
    description: 'Vos données de base',
    icon: User,
    schema: personalInfoSchema
  },
  { 
    id: 2, 
    title: 'Adresse', 
    description: 'Votre lieu de résidence',
    icon: MapPin,
    schema: addressSchema
  },
  { 
    id: 3, 
    title: 'Contact', 
    description: 'Moyens de communication',
    icon: Phone,
    schema: contactSchema
  },
  { 
    id: 4, 
    title: 'Profession', 
    description: 'Activité professionnelle',
    icon: Briefcase,
    schema: professionalSchema
  },
  { 
    id: 5, 
    title: 'Famille', 
    description: 'Informations familiales',
    icon: Users,
    schema: familySchema
  }
];

export default function EditProfilePage() {
  const { user, isLoading } = useAuth('USER');
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [profileData, setProfileData] = useState<any>({});

  const currentStepConfig = steps.find(step => step.id === currentStep)!;
  
  const form = useForm({
    resolver: zodResolver(currentStepConfig.schema),
    defaultValues: profileData
  });

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = form;

  useEffect(() => {
    if (profileData) {
      reset(profileData);
    }
  }, [profileData, reset, currentStep]);

  const onSubmit = async (data: any) => {
    const toastId = toast.loading('Sauvegarde en cours...');
    
    try {
      // Merger les données actuelles avec les nouvelles
      const updatedData = { ...profileData, ...data };
      
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfileData(updatedData);
      setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
      
      toast.success('Étape sauvegardée !', { id: toastId });
      
      // Passer à l'étape suivante si pas la dernière
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        // Toutes les étapes complétées
        toast.success('Profil complété avec succès !');
        router.push('/citoyen/profil');
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde', { id: toastId });
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const progressPercentage = (completedSteps.length / steps.length) * 100;

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Compléter mon profil</h1>
          <p className="text-muted-foreground">
            Renseignez vos informations pour accéder à tous les services
          </p>
        </div>

        {/* Progress */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Progression</CardTitle>
              <Badge variant="secondary">{completedSteps.length}/{steps.length} étapes</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="mb-4" />
            <div className="flex justify-between">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={`flex flex-col items-center space-y-2 p-2 rounded-lg transition-colors ${
                    step.id === currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : completedSteps.includes(step.id)
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'hover:bg-accent'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-background/20 flex items-center justify-center">
                    {completedSteps.includes(step.id) ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-xs text-center font-medium hidden sm:block">
                    {step.title}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <currentStepConfig.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>{currentStepConfig.title}</CardTitle>
                <CardDescription>{currentStepConfig.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input 
                      id="firstName"
                      {...register('firstName')}
                      className={errors.firstName ? 'border-destructive' : ''}
                    />
                    {errors.firstName && (
                      <FormError error={errors.firstName} />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input 
                      id="lastName"
                      {...register('lastName')}
                      className={errors.lastName ? 'border-destructive' : ''}
                    />
                    {errors.lastName && (
                      <FormError error={errors.lastName} />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date de naissance *</Label>
                    <Input 
                      id="dateOfBirth"
                      type="date"
                      {...register('dateOfBirth', { valueAsDate: true })}
                      className={errors.dateOfBirth ? 'border-destructive' : ''}
                    />
                    {errors.dateOfBirth && (
                      <FormError error={errors.dateOfBirth} />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="placeOfBirth">Lieu de naissance *</Label>
                    <Input 
                      id="placeOfBirth"
                      placeholder="Libreville"
                      {...register('placeOfBirth')}
                      className={errors.placeOfBirth ? 'border-destructive' : ''}
                    />
                    {errors.placeOfBirth && (
                      <FormError error={errors.placeOfBirth} />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Genre *</Label>
                    <Select onValueChange={(value) => setValue('gender', value)}>
                      <SelectTrigger className={errors.gender ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Sélectionner le genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MASCULIN">Masculin</SelectItem>
                        <SelectItem value="FEMININ">Féminin</SelectItem>
                        <SelectItem value="AUTRE">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <FormError error={errors.gender} />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationalité</Label>
                    <Input 
                      id="nationality"
                      defaultValue="Gabonaise"
                      {...register('nationality')}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="maritalStatus">Situation matrimoniale</Label>
                    <Select onValueChange={(value) => setValue('maritalStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la situation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CELIBATAIRE">Célibataire</SelectItem>
                        <SelectItem value="MARIE">Marié(e)</SelectItem>
                        <SelectItem value="DIVORCE">Divorcé(e)</SelectItem>
                        <SelectItem value="VEUF">Veuf/Veuve</SelectItem>
                        <SelectItem value="UNION_LIBRE">Union libre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Address */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Adresse complète *</Label>
                    <Textarea 
                      id="address"
                      placeholder="Quartier, rue, numéro..."
                      {...register('address')}
                      className={errors.address ? 'border-destructive' : ''}
                    />
                    {errors.address && (
                      <FormError error={errors.address} />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Ville *</Label>
                    <Input 
                      id="city"
                      placeholder="Libreville"
                      {...register('city')}
                      className={errors.city ? 'border-destructive' : ''}
                    />
                    {errors.city && (
                      <FormError error={errors.city} />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="province">Province *</Label>
                    <Select onValueChange={(value) => setValue('province', value)}>
                      <SelectTrigger className={errors.province ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Sélectionner la province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ESTUAIRE">Estuaire</SelectItem>
                        <SelectItem value="HAUT_OGOOUE">Haut-Ogooué</SelectItem>
                        <SelectItem value="MOYEN_OGOOUE">Moyen-Ogooué</SelectItem>
                        <SelectItem value="NGOUNIE">Ngounié</SelectItem>
                        <SelectItem value="NYANGA">Nyanga</SelectItem>
                        <SelectItem value="OGOOUE_IVINDO">Ogooué-Ivindo</SelectItem>
                        <SelectItem value="OGOOUE_LOLO">Ogooué-Lolo</SelectItem>
                        <SelectItem value="OGOOUE_MARITIME">Ogooué-Maritime</SelectItem>
                        <SelectItem value="WOLEU_NTEM">Woleu-Ntem</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.province && (
                      <FormError error={errors.province} />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input 
                      id="postalCode"
                      placeholder="BP 123"
                      {...register('postalCode')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input 
                      id="country"
                      defaultValue="Gabon"
                      {...register('country')}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Contact */}
              {currentStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Téléphone principal *</Label>
                    <Input 
                      id="phone"
                      placeholder="+241 07 12 34 56"
                      {...register('phone')}
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && (
                      <FormError error={errors.phone} />
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="alternatePhone">Téléphone alternatif</Label>
                    <Input 
                      id="alternatePhone"
                      placeholder="+241 06 98 76 54"
                      {...register('alternatePhone')}
                      className={errors.alternatePhone ? 'border-destructive' : ''}
                    />
                    {errors.alternatePhone && (
                      <FormError error={errors.alternatePhone} />
                    )}
                  </div>

                  <div className="space-y-4 md:col-span-2 border-t pt-4">
                    <h3 className="font-medium">Contact d'urgence</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact.name">Nom du contact</Label>
                        <Input 
                          id="emergencyContact.name"
                          placeholder="Marie DUPONT"
                          {...register('emergencyContact.name')}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact.phone">Téléphone</Label>
                        <Input 
                          id="emergencyContact.phone"
                          placeholder="+241 07 11 22 33"
                          {...register('emergencyContact.phone')}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact.relation">Relation</Label>
                        <Input 
                          id="emergencyContact.relation"
                          placeholder="Épouse, Frère, etc."
                          {...register('emergencyContact.relation')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Professional */}
              {currentStep === 4 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession *</Label>
                    <Input 
                      id="profession"
                      placeholder="Ingénieur, Professeur, Commerçant..."
                      {...register('profession')}
                      className={errors.profession ? 'border-destructive' : ''}
                    />
                    {errors.profession && (
                      <FormError error={errors.profession} />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employer">Employeur</Label>
                    <Input 
                      id="employer"
                      placeholder="Nom de l'entreprise ou organisation"
                      {...register('employer')}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Family */}
              {currentStep === 5 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Nom du père *</Label>
                    <Input 
                      id="fatherName"
                      placeholder="Pierre DUPONT"
                      {...register('fatherName')}
                      className={errors.fatherName ? 'border-destructive' : ''}
                    />
                    {errors.fatherName && (
                      <FormError error={errors.fatherName} />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motherName">Nom de la mère *</Label>
                    <Input 
                      id="motherName"
                      placeholder="Marie MARTIN"
                      {...register('motherName')}
                      className={errors.motherName ? 'border-destructive' : ''}
                    />
                    {errors.motherName && (
                      <FormError error={errors.motherName} />
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="spouseName">Nom du conjoint</Label>
                    <Input 
                      id="spouseName"
                      placeholder="Si marié(e)"
                      {...register('spouseName')}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPreviousStep}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Précédent
                </Button>

                <Button type="submit">
                  {currentStep === steps.length ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Finaliser le profil
                    </>
                  ) : (
                    <>
                      Suivant
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}