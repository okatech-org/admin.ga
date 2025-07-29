/* @ts-nocheck */
'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Eye,
  EyeOff,
  Building2,
  Users,
  UserCheck,
  Settings,
  Lock,
  Mail,
  ArrowRight,
  Shield,
  Briefcase,
  Heart,
  Scale,
  Car,
  Home,
  BookOpen,
  Stethoscope,
  Cross,
  GraduationCap,
  Wrench,
  TrendingUp,
  Receipt,
  Truck,
  Building,
  Hammer,
  Search,
  Leaf,
  Trees,
  Wheat,
  Radio,
  Palette,
  Anchor,
  Gavel,
  Calculator,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function SuperAdminConnexionDemoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'organismes' | 'direct' | 'citoyen'>('organismes');

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Organismes disponibles avec leurs caractéristiques (28 organismes principaux)
  const organismes = [
    // Ministères Régaliens
    {
      code: 'DGDI',
      nom: 'Direction Générale de la Documentation et de l\'Immigration',
      description: 'CNI, Passeports, Immigration',
      icon: Shield,
      color: 'bg-blue-600',
      comptes: 2,
      services: 15,
      url: '/dgdi'
    },
    {
      code: 'MIN_JUS',
      nom: 'Ministère de la Justice',
      description: 'Justice, Casier judiciaire',
      icon: Scale,
      color: 'bg-purple-600',
      comptes: 4,
      services: 12,
      url: '/min-jus'
    },
    {
      code: 'MIN_INT',
      nom: 'Ministère de l\'Intérieur',
      description: 'Sécurité, Administration territoriale',
      icon: Building2,
      color: 'bg-gray-700',
      comptes: 3,
      services: 8,
      url: '/min-int'
    },
    {
      code: 'MIN_DEF',
      nom: 'Ministère de la Défense',
      description: 'Service militaire, Anciens combattants',
      icon: Shield,
      color: 'bg-green-800',
      comptes: 2,
      services: 5,
      url: '/min-def'
    },

    // Services Sociaux
    {
      code: 'CNSS',
      nom: 'Caisse Nationale de Sécurité Sociale',
      description: 'Sécurité sociale, Retraites',
      icon: Heart,
      color: 'bg-green-600',
      comptes: 3,
      services: 14,
      url: '/cnss'
    },
    {
      code: 'CNAMGS',
      nom: 'Caisse Nationale d\'Assurance Maladie',
      description: 'Assurance maladie universelle',
      icon: Stethoscope,
      color: 'bg-red-600',
      comptes: 2,
      services: 10,
      url: '/cnamgs'
    },
    {
      code: 'MIN_SANTE',
      nom: 'Ministère de la Santé',
      description: 'Santé publique, Hôpitaux',
      icon: Cross,
      color: 'bg-red-500',
      comptes: 4,
      services: 11,
      url: '/min-sante'
    },
    {
      code: 'MIN_AFFAIRES_SOCIALES',
      nom: 'Ministère des Affaires Sociales',
      description: 'Protection sociale, Aide sociale',
      icon: Users,
      color: 'bg-pink-600',
      comptes: 3,
      services: 9,
      url: '/min-affaires-sociales'
    },

    // Éducation et Formation
    {
      code: 'MIN_EDUC',
      nom: 'Ministère de l\'Éducation Nationale',
      description: 'Éducation, Diplômes',
      icon: BookOpen,
      color: 'bg-indigo-600',
      comptes: 2,
      services: 13,
      url: '/min-educ'
    },
    {
      code: 'MIN_ENS_SUP',
      nom: 'Ministère de l\'Enseignement Supérieur',
      description: 'Universités, Recherche',
      icon: GraduationCap,
      color: 'bg-blue-700',
      comptes: 2,
      services: 7,
      url: '/min-ens-sup'
    },
    {
      code: 'MIN_FORMATION_PROF',
      nom: 'Ministère de la Formation Professionnelle',
      description: 'Formation technique, Apprentissage',
      icon: Wrench,
      color: 'bg-yellow-600',
      comptes: 2,
      services: 6,
      url: '/min-formation-prof'
    },

    // Économie et Commerce
    {
      code: 'MIN_ECONOMIE',
      nom: 'Ministère de l\'Économie',
      description: 'Commerce, Entreprises',
      icon: TrendingUp,
      color: 'bg-emerald-600',
      comptes: 3,
      services: 15,
      url: '/min-economie'
    },
    {
      code: 'DGI',
      nom: 'Direction Générale des Impôts',
      description: 'Fiscalité, Impôts',
      icon: Receipt,
      color: 'bg-amber-600',
      comptes: 4,
      services: 12,
      url: '/dgi'
    },
    {
      code: 'DOUANES',
      nom: 'Direction Générale des Douanes',
      description: 'Commerce international, Transit',
      icon: Truck,
      color: 'bg-blue-800',
      comptes: 3,
      services: 8,
      url: '/douanes'
    },
    {
      code: 'ANPI',
      nom: 'Agence Nationale de Promotion des Investissements',
      description: 'Investissements, Zones économiques',
      icon: Building,
      color: 'bg-teal-600',
      comptes: 2,
      services: 6,
      url: '/anpi'
    },

    // Transport et Infrastructure
    {
      code: 'MIN_TRANSPORT',
      nom: 'Ministère des Transports',
      description: 'Permis de conduire, Véhicules',
      icon: Car,
      color: 'bg-orange-600',
      comptes: 3,
      services: 11,
      url: '/min-transport'
    },
    {
      code: 'MIN_EQUIPEMENT',
      nom: 'Ministère des Équipements',
      description: 'Travaux publics, Infrastructure',
      icon: Hammer,
      color: 'bg-stone-600',
      comptes: 2,
      services: 7,
      url: '/min-equipement'
    },
    {
      code: 'MIN_HABITAT',
      nom: 'Ministère de l\'Habitat',
      description: 'Logement, Urbanisme',
      icon: Home,
      color: 'bg-lime-600',
      comptes: 3,
      services: 9,
      url: '/min-habitat'
    },

    // Emploi et Travail
    {
      code: 'MIN_TRAVAIL',
      nom: 'Ministère du Travail',
      description: 'Emploi, Relations sociales',
      icon: Briefcase,
      color: 'bg-cyan-600',
      comptes: 3,
      services: 10,
      url: '/min-travail'
    },
    {
      code: 'ANPE',
      nom: 'Agence Nationale Pour l\'Emploi',
      description: 'Recherche d\'emploi, Insertion',
      icon: Search,
      color: 'bg-violet-600',
      comptes: 2,
      services: 8,
      url: '/anpe'
    },

    // Environnement et Ressources
    {
      code: 'MIN_ENVIRONNEMENT',
      nom: 'Ministère de l\'Environnement',
      description: 'Protection environnementale',
      icon: Leaf,
      color: 'bg-green-700',
      comptes: 2,
      services: 6,
      url: '/min-environnement'
    },
    {
      code: 'MIN_EAUX_FORETS',
      nom: 'Ministère des Eaux et Forêts',
      description: 'Ressources forestières',
      icon: Trees,
      color: 'bg-emerald-700',
      comptes: 2,
      services: 5,
      url: '/min-eaux-forets'
    },
    {
      code: 'MIN_AGRICULTURE',
      nom: 'Ministère de l\'Agriculture',
      description: 'Agriculture, Élevage',
      icon: Wheat,
      color: 'bg-yellow-700',
      comptes: 3,
      services: 8,
      url: '/min-agriculture'
    },

    // Communication et Culture
    {
      code: 'MIN_COMMUNICATION',
      nom: 'Ministère de la Communication',
      description: 'Médias, Télécommunications',
      icon: Radio,
      color: 'bg-purple-700',
      comptes: 2,
      services: 5,
      url: '/min-communication'
    },
    {
      code: 'MIN_CULTURE',
      nom: 'Ministère de la Culture',
      description: 'Arts, Patrimoine culturel',
      icon: Palette,
      color: 'bg-rose-600',
      comptes: 2,
      services: 6,
      url: '/min-culture'
    },

    // Administrations Locales
    {
      code: 'MAIRE_LBV',
      nom: 'Mairie de Libreville',
      description: 'Services municipaux, État civil',
      icon: Building2,
      color: 'bg-blue-500',
      comptes: 5,
      services: 18,
      url: '/maire-lbv'
    },
    {
      code: 'MAIRE_PG',
      nom: 'Mairie de Port-Gentil',
      description: 'Services municipaux, Permis',
      icon: Anchor,
      color: 'bg-navy-600',
      comptes: 4,
      services: 14,
      url: '/maire-pg'
    },
    {
      code: 'CONSEIL_ETAT',
      nom: 'Conseil d\'État',
      description: 'Contentieux administratif',
      icon: Gavel,
      color: 'bg-gray-800',
      comptes: 2,
      services: 4,
      url: '/conseil-etat'
    },

    // Services Spécialisés
    {
      code: 'COUR_COMPTES',
      nom: 'Cour des Comptes',
      description: 'Contrôle financier public',
      icon: Calculator,
      color: 'bg-slate-700',
      comptes: 2,
      services: 3,
      url: '/cour-comptes'
    }
  ];

  // Comptes de démonstration pour connexion directe (super admin)
  const comptesSysteme = [
    {
      title: 'Super Administrateur',
      email: 'superadmin@admin.ga',
      password: 'SuperAdmin2024!',
      description: 'Accès complet système ADMIN.GA',
      icon: Settings,
      color: 'bg-gray-800',
      destination: 'Dashboard Super Admin'
    }
  ];

  // Fonction pour déterminer la redirection selon le rôle et l'organisme
  const getRedirectPath = (user: any) => {
    const { role, organization } = user;

    // Interface DEMARCHE.GA pour les citoyens - expérience séparée
    if (role === 'USER') {
      return '/citoyen/dashboard';
    }

    // Interface ADMIN.GA pour les administrateurs
    if (role === 'SUPER_ADMIN') {
      return '/super-admin/dashboard';
    }

    if (role === 'ADMIN') {
      return '/admin/dashboard';
    }

    if (role === 'MANAGER') {
      return '/manager/dashboard';
    }

    if (role === 'AGENT') {
      return '/agent/dashboard';
    }

    // Par défaut, rediriger vers DEMARCHE.GA pour les non-identifiés
    return '/demarche';
  };

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError('');

    const toastId = toast.loading('Connexion en cours...');

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Email ou mot de passe incorrect', { id: toastId });
        setError('Email ou mot de passe incorrect');
        return;
      }

      toast.success('Connexion réussie !', { id: toastId });

      const session = await getSession();
      if (session?.user) {
        const redirectPath = getRedirectPath(session.user);
        router.push(redirectPath);
      }
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.', { id: toastId });
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (email: string, password: string) => {
    form.setValue('email', email);
    form.setValue('password', password);
  };

  const goToOrganisme = (organismeUrl: string) => {
    router.push(organismeUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header Global */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">CONNEXION DEMO</h1>
                  <p className="text-xs text-gray-500">Interface de test pour organismes</p>
                </div>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/super-admin/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour Super Admin
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/demarche">
                  <Users className="w-4 h-4 mr-2" />
                  DEMARCHE.GA
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center p-8">
        <div className="max-w-7xl w-full">
          {/* Sélecteur de mode de connexion */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Interface de Test et Démonstration
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Accédez aux différents environnements de test selon votre profil
            </p>

            <div className="flex justify-center space-x-4 mb-8">
              <Button
                variant={selectedMode === 'organismes' ? 'default' : 'outline'}
                onClick={() => setSelectedMode('organismes')}
                className="px-6 py-3"
              >
                <Building2 className="w-5 h-5 mr-2" />
                Organismes Publics
              </Button>
              <Button
                variant={selectedMode === 'citoyen' ? 'default' : 'outline'}
                onClick={() => setSelectedMode('citoyen')}
                className="px-6 py-3"
              >
                <Users className="w-5 h-5 mr-2" />
                Espace Citoyen
              </Button>
              <Button
                variant={selectedMode === 'direct' ? 'default' : 'outline'}
                onClick={() => setSelectedMode('direct')}
                className="px-6 py-3"
              >
                <Settings className="w-5 h-5 mr-2" />
                Administration Système
              </Button>
            </div>
          </div>

          {/* Mode Organismes */}
          {selectedMode === 'organismes' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Sélectionnez votre Organisme</h2>
                <p className="text-gray-600 mb-8">Chaque organisme a sa propre interface de connexion</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organismes.map((organisme) => (
                  <Card
                    key={organisme.code}
                    className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-blue-300"
                    onClick={() => goToOrganisme(organisme.url)}
                  >
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className={`w-16 h-16 ${organisme.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <organisme.icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-lg font-bold">{organisme.code}</CardTitle>
                      <CardDescription className="font-medium text-gray-700">
                        {organisme.nom}
                      </CardDescription>
                      <p className="text-sm text-gray-500">{organisme.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Comptes disponibles:</span>
                          <Badge variant="secondary">{organisme.comptes} comptes</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Services:</span>
                          <Badge variant="outline">{organisme.services} services</Badge>
                        </div>
                      </div>
                      <Button className="w-full mt-4 group-hover:bg-blue-600 transition-colors">
                        Accéder à {organisme.code}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
                <h3 className="font-semibold text-blue-900 mb-3">💡 Comment ça fonctionne ?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                    <span>Cliquez sur votre organisme</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                    <span>Accédez à la page d'accueil de l'organisme</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                    <span>Connectez-vous avec votre compte</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mode Citoyen - Redirection directe */}
          {selectedMode === 'citoyen' && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center py-16">
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center animate-pulse">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Redirection vers DEMARCHE.GA</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Vous allez être redirigé vers la plateforme citoyenne...
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <p className="text-blue-800 text-sm">
                    ✅ Accès à tous les services • ✅ Interface citoyenne • ✅ Compte démo disponible
                  </p>
                </div>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-8 py-4"
                  onClick={() => router.push('/demarche')}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Continuer vers DEMARCHE.GA
                </Button>
              </div>
            </div>
          )}

          {/* Mode Administration Système (Connexion directe) */}
          {selectedMode === 'direct' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-xl">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">Administration Système</CardTitle>
                  <CardDescription>
                    Accès direct pour les administrateurs système
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adresse email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                  type="email"
                                  placeholder="admin@system.ga"
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
                                  placeholder="Mot de passe administrateur"
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
                        className="w-full bg-gray-800 hover:bg-gray-900"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Connexion...' : 'Connexion Administrateur'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Compte de démonstration système */}
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Compte de Test</h2>
                  <p className="text-gray-600">Administrateur système</p>
                </div>

                <div className="space-y-4">
                  {comptesSysteme.map((compte, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-shadow cursor-pointer group"
                      onClick={() => fillDemoAccount(compte.email, compte.password)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${compte.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <compte.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{compte.title}</h3>
                            <p className="text-sm text-gray-600">{compte.description}</p>
                            <p className="text-xs text-blue-600 font-medium mt-1">→ {compte.destination}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 font-mono">{compte.email}</p>
                            <p className="text-xs text-gray-400">Cliquer pour remplir</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
