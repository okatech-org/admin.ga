/* @ts-nocheck */
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Shield,
  Users,
  FileText,
  Phone,
  Mail,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Settings,
  ArrowLeft,
  Building2,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { getOrganismeDetails } from '@/lib/data/gabon-services-detailles';

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function DGDIHomePage() {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Récupérer les détails de la DGDI
  const organismeDetails = getOrganismeDetails('DGDI');

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    const toastId = toast.loading('Connexion en cours...');

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Email ou mot de passe incorrect', { id: toastId });
        return;
      }

      toast.success('Connexion réussie !', { id: toastId });
      setIsLoginModalOpen(false);
      router.push('/dgdi/dashboard');
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (email: string, password: string) => {
    form.setValue('email', email);
    form.setValue('password', password);
  };

  const services = [
    {
      titre: 'Carte Nationale d\'Identité',
      description: 'Demande et renouvellement de CNI',
      delai: '5-7 jours',
      statut: 'Disponible'
    },
    {
      titre: 'Passeport Biométrique',
      description: 'Demande de passeport ordinaire et diplomatique',
      delai: '10-15 jours',
      statut: 'Disponible'
    },
    {
      titre: 'Visa et Immigration',
      description: 'Traitement des demandes de visa',
      delai: '3-5 jours',
      statut: 'Disponible'
    },
    {
      titre: 'Naturalisation',
      description: 'Dossiers de naturalisation gabonaise',
      delai: '3-6 mois',
      statut: 'Sur rendez-vous'
    }
  ];

  const statistiques = [
    { label: 'CNI délivrées (mois)', valeur: '2,847', couleur: 'text-blue-600' },
    { label: 'Passeports émis', valeur: '1,156', couleur: 'text-green-600' },
    { label: 'Visas traités', valeur: '892', couleur: 'text-purple-600' },
    { label: 'Délai moyen', valeur: '6 jours', couleur: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header DGDI */}
      <header className="bg-white border-b border-blue-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DGDI</h1>
                <p className="text-sm text-gray-600">Direction Générale de la Documentation et de l'Immigration</p>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/auth/connexion">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux organismes
                </Link>
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsLoginModalOpen(true)}
              >
                <Lock className="w-4 h-4 mr-2" />
                Connexion
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl flex items-center justify-center shadow-xl">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenue à la DGDI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {organismeDetails?.description || 'Documentation, Immigration et Services aux Citoyens'}
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Services Numériques
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-blue-500 mr-2" />
              Délais Optimisés
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              Service de Qualité
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {statistiques.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className={`text-3xl font-bold ${stat.couleur} mb-2`}>
                  {stat.valeur}
                </div>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Services Principaux */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Nos Services Principaux
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{service.titre}</CardTitle>
                    <Badge
                      className={service.statut === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                    >
                      {service.statut}
                    </Badge>
                  </div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Délai de traitement:</span>
                    <span className="font-medium text-blue-600">{service.delai}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Section Contact */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-600" />
              Informations de Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">Adresse</p>
                  <p className="text-sm text-gray-600">Libreville, Gabon</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">Téléphone</p>
                  <p className="text-sm text-gray-600">+241 11 22 33 44</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-600">contact@dgdi.ga</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Accédez à votre Espace Professionnel
          </h3>
          <p className="text-gray-600 mb-6">
            Connectez-vous pour gérer les services et accéder aux outils administratifs
          </p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4"
            onClick={() => setIsLoginModalOpen(true)}
          >
            <Lock className="w-5 h-5 mr-2" />
            Se Connecter
          </Button>
        </div>
      </div>

      {/* Modal de Connexion */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Connexion DGDI
            </DialogTitle>
            <DialogDescription>
              Accédez à votre espace professionnel DGDI
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulaire de connexion */}
            <div>
              <h3 className="font-semibold mb-4">Connexion Manuelle</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              type="email"
                              placeholder="votre.email@dgdi.ga"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Votre mot de passe"
                              className="pl-10 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Connexion...' : 'Se Connecter'}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Comptes disponibles */}
            <div>
              <h3 className="font-semibold mb-4">Comptes Disponibles</h3>
              <div className="space-y-3">
                {organismeDetails?.comptesDisponibles?.map((compte, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => fillDemoAccount(compte.email, 'demo123')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <UserCheck className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{compte.titre}</h4>
                          <p className="text-sm text-gray-600">{compte.description}</p>
                          <p className="text-xs text-blue-600 font-medium">→ Rôle: {compte.role}</p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 font-mono">
                        {compte.email}
                      </div>
                    </CardContent>
                  </Card>
                )) || (
                  <p className="text-gray-500 text-sm">Aucun compte de démonstration disponible</p>
                )}
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  💡 Cliquez sur un compte pour remplir automatiquement le formulaire
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
