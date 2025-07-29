/* @ts-nocheck */
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Scale,
  Users,
  FileText,
  Phone,
  Mail,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  ArrowLeft,
  CheckCircle,
  Clock,
  Star,
  Gavel,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { getOrganismeDetails } from '@/lib/data/organismes-detailles';

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function MinistereJusticeHomePage() {
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

  // Récupérer les détails du Ministère de la Justice
  const organismeDetails = getOrganismeDetails('MIN_JUSTICE');

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
      router.push('/min-justice/dashboard');
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
      titre: 'Casier Judiciaire',
      description: 'Demande de casier judiciaire vierge',
      delai: '24-48h',
      statut: 'Disponible'
    },
    {
      titre: 'Actes de Justice',
      description: 'Certification et légalisation d\'actes',
      delai: '2-3 jours',
      statut: 'Disponible'
    },
    {
      titre: 'Audiences Publiques',
      description: 'Programmation et suivi des audiences',
      delai: 'Selon planning',
      statut: 'Sur rendez-vous'
    },
    {
      titre: 'Assistance Juridique',
      description: 'Conseil et orientation juridique',
      delai: 'Immédiat',
      statut: 'Disponible'
    }
  ];

  const statistiques = [
    { label: 'Casiers traités (mois)', valeur: '1,247', couleur: 'text-purple-600' },
    { label: 'Audiences tenues', valeur: '156', couleur: 'text-green-600' },
    { label: 'Dossiers en cours', valeur: '892', couleur: 'text-orange-600' },
    { label: 'Délai moyen', valeur: '2 jours', couleur: 'text-blue-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* Header Ministère Justice */}
      <header className="bg-white border-b border-purple-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MINISTÈRE DE LA JUSTICE</h1>
                <p className="text-sm text-gray-600">République Gabonaise</p>
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
                className="bg-purple-600 hover:bg-purple-700"
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
            <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-purple-800 rounded-3xl flex items-center justify-center shadow-xl">
              <Scale className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ministère de la Justice
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {organismeDetails?.description || 'Justice, Équité et État de Droit'}
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Services Judiciaires
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-purple-500 mr-2" />
              Traitement Rapide
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              Transparence
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
            Nos Services Judiciaires
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Gavel className="h-5 w-5 text-purple-600" />
                      {service.titre}
                    </CardTitle>
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
                    <span className="font-medium text-purple-600">{service.delai}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Section Mission */}
        <Card className="bg-purple-50 border-purple-200 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Notre Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Le Ministère de la Justice œuvre pour garantir l'équité, la transparence et l'efficacité
              du système judiciaire gabonais. Nous nous engageons à fournir des services de qualité,
              à protéger les droits des citoyens et à maintenir l'état de droit dans notre République.
            </p>
          </CardContent>
        </Card>

        {/* Section Contact */}
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-purple-600" />
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
                  <p className="text-sm text-gray-600">+241 11 44 55 66</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-600">contact@justice.ga</p>
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
            Connectez-vous pour gérer les dossiers judiciaires et accéder aux outils administratifs
          </p>
          <Button
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 px-8 py-4"
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
              <Scale className="h-6 w-6 text-purple-600" />
              Connexion Ministère de la Justice
            </DialogTitle>
            <DialogDescription>
              Accédez à votre espace professionnel du Ministère de la Justice
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
                              placeholder="votre.email@justice.ga"
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
                    className="w-full bg-purple-600 hover:bg-purple-700"
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
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                          <UserCheck className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{compte.titre}</h4>
                          <p className="text-sm text-gray-600">{compte.description}</p>
                          <p className="text-xs text-purple-600 font-medium">→ Rôle: {compte.role}</p>
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
              <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-xs text-purple-800">
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
