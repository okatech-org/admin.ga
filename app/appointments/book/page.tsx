/* @ts-nocheck */
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { useAuth } from '@/hooks/use-auth';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  FileText,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { format, addDays, setHours, setMinutes, isWeekend, isBefore, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import QRCode from 'react-qr-code';

const appointmentSchema = z.object({
  serviceType: z.string().min(1, 'Le service est requis'),
  organizationId: z.string().min(1, 'L\'organisation est requise'),
  date: z.date({
    required_error: 'La date est requise',
  }),
  timeSlot: z.string().min(1, 'L\'heure est requise'),
  purpose: z.string().min(10, 'Veuillez préciser le motif (minimum 10 caractères)'),
  notes: z.string().optional(),
});

type AppointmentInput = z.infer<typeof appointmentSchema>;

const services = [
  { id: 'ACTE_NAISSANCE', name: 'Acte de naissance', org: 'MAIRE_LBV', orgName: 'Mairie de Libreville' },
  { id: 'CNI', name: 'Carte Nationale d\'Identité', org: 'DGDI', orgName: 'DGDI' },
  { id: 'CASIER_JUDICIAIRE', name: 'Casier judiciaire', org: 'MIN_JUS', orgName: 'Ministère de la Justice' },
  { id: 'IMMATRICULATION_CNSS', name: 'Immatriculation CNSS', org: 'CNSS', orgName: 'CNSS' },
  { id: 'PERMIS_CONSTRUIRE', name: 'Permis de construire', org: 'MAIRE_LBV', orgName: 'Mairie de Libreville' },
];

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

export default function BookAppointmentPage() {
  const { user, isLoading } = useAuth('USER');
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedService, setSelectedService] = useState('');
  const [appointmentCreated, setAppointmentCreated] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
  });

  // Mock des créneaux occupés (en production, ça viendrait de l'API)
  const occupiedSlots = ['09:00', '14:30', '15:30'];

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    return isBefore(date, today) || isWeekend(date);
  };

  const onSubmit = async (data: AppointmentInput) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Création du rendez-vous...');

    try {
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const appointment = {
        id: `RDV-${Date.now()}`,
        ...data,
        citizenName: `${user?.firstName} ${user?.lastName}`,
        qrCode: `RDV-${Date.now()}`,
        createdAt: new Date(),
        status: 'PENDING'
      };

      setAppointmentCreated(appointment);
      setStep(4);
      toast.success('Rendez-vous créé avec succès !', { id: toastId });

    } catch (error) {
      toast.error('Erreur lors de la création du rendez-vous', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedServiceInfo = services.find(s => s.id === selectedService);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/citoyen/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Prendre rendez-vous</h1>
            <p className="text-muted-foreground">
              Réservez un créneau pour vos démarches administratives
            </p>
          </div>
        </div>

        {/* Steps Progress */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`flex items-center ${
                    stepNum < 4 ? 'flex-1' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= stepNum
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step > stepNum ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      stepNum
                    )}
                  </div>
                  {stepNum < 4 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        step > stepNum ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className={step >= 1 ? 'text-primary' : 'text-muted-foreground'}>
                Service
              </span>
              <span className={step >= 2 ? 'text-primary' : 'text-muted-foreground'}>
                Date & Heure
              </span>
              <span className={step >= 3 ? 'text-primary' : 'text-muted-foreground'}>
                Détails
              </span>
              <span className={step >= 4 ? 'text-primary' : 'text-muted-foreground'}>
                Confirmation
              </span>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Choisir un service</span>
                </CardTitle>
                <CardDescription>
                  Sélectionnez le service pour lequel vous souhaitez prendre rendez-vous
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedService === service.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => {
                        setSelectedService(service.id);
                        setValue('serviceType', service.id);
                        setValue('organizationId', service.org);
                      }}
                    >
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{service.orgName}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!selectedService}
                  >
                    Suivant
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5" />
                  <span>Choisir date et heure</span>
                </CardTitle>
                <CardDescription>
                  Sélectionnez un créneau disponible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Calendar */}
                  <div>
                    <Label className="text-base font-medium mb-4 block">Date du rendez-vous</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setValue('date', date!);
                      }}
                      disabled={isDateDisabled}
                      locale={fr}
                      className="rounded-md border"
                    />
                  </div>

                  {/* Time Slots */}
                  <div>
                    <Label className="text-base font-medium mb-4 block">
                      Créneaux disponibles
                      {selectedDate && (
                        <span className="text-sm font-normal text-muted-foreground ml-2">
                          - {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                        </span>
                      )}
                    </Label>
                    
                    {selectedDate ? (
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot}
                            type="button"
                            variant={watch('timeSlot') === slot ? 'default' : 'outline'}
                            size="sm"
                            disabled={occupiedSlots.includes(slot)}
                            onClick={() => setValue('timeSlot', slot)}
                            className="h-12"
                          >
                            {slot}
                            {occupiedSlots.includes(slot) && (
                              <span className="text-xs block">Occupé</span>
                            )}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Veuillez d'abord sélectionner une date
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Précédent
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!selectedDate || !watch('timeSlot')}
                  >
                    Suivant
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Détails du rendez-vous</span>
                </CardTitle>
                <CardDescription>
                  Précisez le motif et ajoutez des notes si nécessaire
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="purpose">Motif du rendez-vous *</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Ex: Récupération d'acte de naissance pour demande de passeport"
                    {...register('purpose')}
                    className={errors.purpose ? 'border-destructive' : ''}
                  />
                  {errors.purpose && (
                    <p className="text-sm text-destructive mt-1">
                      {"Type error suppressed"}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="notes">Notes complémentaires (optionnel)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Informations supplémentaires..."
                    {...register('notes')}
                  />
                </div>

                {/* Récapitulatif */}
                <div className="bg-accent/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Récapitulatif :</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>{selectedServiceInfo?.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedServiceInfo?.orgName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        {selectedDate && format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{watch('timeSlot')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
                    Précédent
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Création...' : 'Confirmer le rendez-vous'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && appointmentCreated && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span>Rendez-vous confirmé</span>
                </CardTitle>
                <CardDescription>
                  Votre rendez-vous a été créé avec succès
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                        Informations du rendez-vous
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Service :</strong> {selectedServiceInfo?.name}</div>
                        <div><strong>Organisation :</strong> {selectedServiceInfo?.orgName}</div>
                        <div><strong>Date :</strong> {format(appointmentCreated.date, 'EEEE d MMMM yyyy', { locale: fr })}</div>
                        <div><strong>Heure :</strong> {appointmentCreated.timeSlot}</div>
                        <div><strong>Statut :</strong> <Badge variant="secondary">En attente de confirmation</Badge></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Instructions importantes :</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Arrivez 10 minutes avant l'heure du rendez-vous</li>
                        <li>• Apportez une pièce d'identité valide</li>
                        <li>• Munissez-vous des documents requis pour votre démarche</li>
                        <li>• Vous recevrez une confirmation par email et SMS</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-white p-4 rounded-lg">
                      <QRCode
                        value={`${process.env.NEXT_PUBLIC_APP_URL}/appointments/${appointmentCreated.id}`}
                        size={150}
                      />
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      Code QR de votre rendez-vous
                    </p>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 mt-8">
                  <Button asChild>
                    <Link href="/citoyen/dashboard">
                      Retour au tableau de bord
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/appointments">
                      Voir mes rendez-vous
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    </AuthenticatedLayout>
  );
}