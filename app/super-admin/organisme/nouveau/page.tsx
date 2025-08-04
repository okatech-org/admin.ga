/* @ts-nocheck */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Building2,
  Plus,
  FileText,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Users,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc/client';
import { useForm } from 'react-hook-form';
import { OrganizationType, ServiceType } from '@prisma/client';

// Types des organisations et leurs labels
const ORGANIZATION_TYPES = [
  { value: 'MINISTERE', label: 'Ministère' },
  { value: 'DIRECTION_GENERALE', label: 'Direction Générale' },
  { value: 'MAIRIE', label: 'Mairie' },
  { value: 'ORGANISME_SOCIAL', label: 'Organisme Social' },
  { value: 'INSTITUTION_JUDICIAIRE', label: 'Institution Judiciaire' },
  { value: 'AGENCE_PUBLIQUE', label: 'Agence Publique' },
  { value: 'INSTITUTION_ELECTORALE', label: 'Institution Électorale' },
  { value: 'PREFECTURE', label: 'Préfecture' },
  { value: 'PROVINCE', label: 'Province' },
  { value: 'PRESIDENCE', label: 'Présidence' },
  { value: 'PRIMATURE', label: 'Primature' },
  { value: 'AUTRE', label: 'Autre' },
];

// Services disponibles
const AVAILABLE_SERVICES = [
  { value: 'ACTE_NAISSANCE', label: 'Acte de Naissance' },
  { value: 'ACTE_MARIAGE', label: 'Acte de Mariage' },
  { value: 'ACTE_DECES', label: 'Acte de Décès' },
  { value: 'CNI', label: 'Carte Nationale d\'Identité' },
  { value: 'PASSEPORT', label: 'Passeport' },
  { value: 'PERMIS_CONDUIRE', label: 'Permis de Conduire' },
  { value: 'CARTE_SEJOUR', label: 'Carte de Séjour' },
  { value: 'CASIER_JUDICIAIRE', label: 'Casier Judiciaire' },
  { value: 'CERTIFICAT_NATIONALITE', label: 'Certificat de Nationalité' },
  { value: 'PERMIS_CONSTRUIRE', label: 'Permis de Construire' },
  { value: 'AUTORISATION_COMMERCE', label: 'Autorisation de Commerce' },
  { value: 'CERTIFICAT_RESIDENCE', label: 'Certificat de Résidence' },
  { value: 'IMMATRICULATION_CNSS', label: 'Immatriculation CNSS' },
  { value: 'CARTE_CNAMGS', label: 'Carte CNAMGS' },
  { value: 'ATTESTATION_TRAVAIL', label: 'Attestation de Travail' },
];

// Jours de la semaine
const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Lundi' },
  { key: 'tuesday', label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday', label: 'Jeudi' },
  { key: 'friday', label: 'Vendredi' },
  { key: 'saturday', label: 'Samedi' },
  { key: 'sunday', label: 'Dimanche' },
];

interface OrganizationFormData {
  name: string;
  type: OrganizationType;
  code: string;
  description: string;
  parentId?: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  workingHours: Record<string, { start: string; end: string }>;
  services: string[];
}

export default function NouvelOrganismePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: '',
    type: 'MINISTERE' as OrganizationType,
    code: '',
    description: '',
    parentId: 'none',
    address: '',
    city: '',
    phone: '',
    email: '',
    website: '',
    workingHours: {},
    services: [],
  });

  // TRPC queries et mutations
  const { data: parentOrganizations } = trpc.organizations.getForHierarchy.useQuery();
  const createOrganization = trpc.organizations.create.useMutation({
    onSuccess: (data) => {
      toast.success('Organisme créé avec succès !');
      router.push('/super-admin/administrations');
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
      setErrors({ submit: error.message });
    },
  });

  // Gestionnaires d'événements
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Nettoyer l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleWorkingHourChange = (day: string, type: 'start' | 'end', value: string) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [type]: value,
        },
      },
    }));
  };

  const toggleService = (serviceValue: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceValue)
        ? prev.services.filter(s => s !== serviceValue)
        : [...prev.services, serviceValue],
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
      if (!formData.code.trim()) newErrors.code = 'Le code est requis';
      if (formData.code.length > 20) newErrors.code = 'Le code ne peut dépasser 20 caractères';
      if (!formData.type) newErrors.type = 'Le type est requis';
    } else if (step === 2) {
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email invalide';
      }
      if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
        newErrors.website = 'URL invalide (doit commencer par http:// ou https://)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const submitData = {
        ...formData,
        email: formData.email || undefined,
        website: formData.website || undefined,
        parentId: formData.parentId === 'none' ? undefined : formData.parentId || undefined,
        workingHours: Object.keys(formData.workingHours).length > 0 ? formData.workingHours : undefined,
      };

      await createOrganization.mutateAsync(submitData);
    } catch (error) {
      // L'erreur est gérée dans onError
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rendu des étapes
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Informations Générales</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'organisme *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Ex: Ministère de l'Intérieur"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Code organisme *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => updateFormData('code', e.target.value.toUpperCase())}
                  placeholder="Ex: MIN_INTERIEUR"
                  className={errors.code ? 'border-red-500' : ''}
                />
                {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type d'organisme *</Label>
              <Select value={formData.type} onValueChange={(value) => updateFormData('type', value)}>
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {ORGANIZATION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Description de l'organisme et de ses missions..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">Organisation parent (optionnel)</Label>
              <Select value={formData.parentId} onValueChange={(value) => updateFormData('parentId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Aucune organisation parent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune organisation parent</SelectItem>
                  {parentOrganizations && Array.isArray(parentOrganizations) && parentOrganizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name} ({org.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold">Informations de Contact</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  placeholder="Adresse complète"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  placeholder="Ex: Libreville"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="+241 XX XX XX XX"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="contact@organisme.ga"
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Site Web</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                  placeholder="https://www.organisme.ga"
                  className={`pl-10 ${errors.website ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold">Heures d'Ouverture</h3>
            </div>

            <div className="space-y-4">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.key} className="flex items-center gap-4">
                  <div className="w-24">
                    <Label>{day.label}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={formData.workingHours[day.key]?.start || ''}
                      onChange={(e) => handleWorkingHourChange(day.key, 'start', e.target.value)}
                      className="w-32"
                    />
                    <span className="text-muted-foreground">à</span>
                    <Input
                      type="time"
                      value={formData.workingHours[day.key]?.end || ''}
                      onChange={(e) => handleWorkingHourChange(day.key, 'end', e.target.value)}
                      className="w-32"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-semibold">Services Proposés</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AVAILABLE_SERVICES.map((service) => (
                <div key={service.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={service.value}
                    checked={formData.services.includes(service.value)}
                    onCheckedChange={() => toggleService(service.value)}
                  />
                  <Label
                    htmlFor={service.value}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {service.label}
                  </Label>
                </div>
              ))}
            </div>

            {formData.services.length > 0 && (
              <div className="space-y-2">
                <Label>Services sélectionnés :</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.services.map((serviceValue) => {
                    const service = AVAILABLE_SERVICES.find(s => s.value === serviceValue);
                    return (
                      <Badge key={serviceValue} variant="secondary">
                        {service?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Navigation contextuelle */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">🏢 Gestion des Organismes</h3>
                <p className="text-sm text-muted-foreground">Création d'un nouvel organisme public</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/super-admin/administrations">
                    <Building2 className="mr-2 h-4 w-4" />
                    Administrations
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/super-admin/services">
                    <FileText className="mr-2 h-4 w-4" />
                    Services Publics
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/super-admin/administrations">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Building2 className="h-8 w-8 text-blue-500" />
                Créer un Nouvel Organisme
              </h1>
              <p className="text-muted-foreground">
                Configuration complète et modulaire d'un organisme public
              </p>
            </div>
          </div>
        </div>

        {/* Indicateur d'étapes */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {[
                { step: 1, label: 'Informations', icon: Building2 },
                { step: 2, label: 'Contact', icon: MapPin },
                { step: 3, label: 'Horaires', icon: Clock },
                { step: 4, label: 'Services', icon: FileText },
              ].map(({ step, label, icon: Icon }) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step === currentStep
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : step < currentStep
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 text-gray-500'
                  }`}>
                    {step < currentStep ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm ${
                    step === currentStep ? 'font-semibold text-blue-500' : ''
                  }`}>
                    {label}
                  </span>
                  {step < 4 && <div className="w-8 h-0.5 bg-gray-300 mx-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contenu du formulaire */}
        <Card>
          <CardHeader>
            <CardTitle>Étape {currentStep} sur 4</CardTitle>
            <CardDescription>
              Remplissez toutes les informations nécessaires pour créer l'organisme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStepContent()}

            {/* Messages d'erreur globaux */}
            {errors.submit && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            <Separator />

            {/* Boutons de navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1 || isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Précédent
              </Button>

              <div className="flex gap-2">
                {currentStep < 4 ? (
                  <Button onClick={handleNext} disabled={isSubmitting}>
                    Suivant
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Création...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Créer l'Organisme
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
