/* @ts-nocheck */
'use client';

import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
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
  UserCheck, 
  Settings, 
  Lock, 
  Mail,
  ArrowLeft,
  Shield,
  Heart,
  Scale,
  Car,
  BookOpen,
  Stethoscope,
  User,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { getAllAdministrations } from '@/lib/data/gabon-administrations';

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function OrganismeLoginPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [organismeData, setOrganismeData] = useState(null);

  const organismeCode = params?.organisme as string;

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (organismeCode) {
      loadOrganismeData();
    }
  }, [organismeCode]);

  const loadOrganismeData = () => {
    try {
      const administrations = getAllAdministrations();
      
      const organisme = administrations.find(admin => 
        admin.code?.toLowerCase() === organismeCode.toLowerCase() ||
        admin.nom.toLowerCase().includes(organismeCode.toLowerCase())
      );

      if (!organisme) {
        router.push('/auth/connexion');
        return;
      }

      setOrganismeData({
        ...organisme,
        code: organisme.code || organismeCode.toUpperCase(),
        theme: getOrganismeTheme(organisme.code || organismeCode),
        comptes: getOrganismeComptes(organisme.code || organismeCode)
      });
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      router.push('/auth/connexion');
    }
  };

  const getOrganismeTheme = (code: string) => {
    const themes = {
      'DGDI': { primary: 'blue', secondary: 'indigo', icon: Shield },
      'CNSS': { primary: 'green', secondary: 'emerald', icon: Heart },
      'CNAMGS': { primary: 'red', secondary: 'rose', icon: Stethoscope },
      'MIN_JUS': { primary: 'purple', secondary: 'violet', icon: Scale },
      'MIN_TRANSPORT': { primary: 'orange', secondary: 'amber', icon: Car },
      'MIN_EDUC': { primary: 'indigo', secondary: 'blue', icon: BookOpen },
      'default': { primary: 'gray', secondary: 'slate', icon: Building2 }
    };
    return themes[code] || themes.default;
  };

  const getOrganismeComptes = (code: string) => {
    const comptes = {
      'DGDI': [
        {
          title: 'Administrateur DGDI',
          email: 'admin.dgdi@dgdi.ga',
          password: 'admin123',
          role: 'ADMIN',
          description: 'Administration complète DGDI'
        },
        {
          title: 'Agent DGDI',
          email: 'agent.dgdi@dgdi.ga', 
          password: 'agent123',
          role: 'AGENT',
          description: 'Traitement des dossiers CNI/Passeports'
        }
      ],
      'CNSS': [
        {
          title: 'Directeur CNSS',
          email: 'directeur.cnss@cnss.ga',
          password: 'directeur123',
          role: 'ADMIN',
          description: 'Direction générale CNSS'
        },
        {
          title: 'Gestionnaire CNSS',
          email: 'gestionnaire.cnss@cnss.ga',
          password: 'gestionnaire123',
          role: 'MANAGER',
          description: 'Gestion des prestations sociales'
        },
        {
          title: 'Agent CNSS',
          email: 'agent.cnss@cnss.ga',
          password: 'agent123',
          role: 'AGENT',
          description: 'Traitement des demandes'
        }
      ],
      'CNAMGS': [
        {
          title: 'Administrateur CNAMGS',
          email: 'admin.cnamgs@cnamgs.ga',
          password: 'admin123',
          role: 'ADMIN',
          description: 'Administration CNAMGS'
        },
        {
          title: 'Agent Médical',
          email: 'medical.cnamgs@cnamgs.ga',
          password: 'medical123',
          role: 'AGENT',
          description: 'Gestion des dossiers médicaux'
        }
      ],
      'MIN_JUS': [
        {
          title: 'Secrétaire Général',
          email: 'sg.justice@min-jus.ga',
          password: 'sg123',
          role: 'ADMIN',
          description: 'Secrétariat général du ministère'
        },
        {
          title: 'Directeur Casier Judiciaire',
          email: 'casier.justice@min-jus.ga',
          password: 'casier123',
          role: 'MANAGER',
          description: 'Direction du casier judiciaire'
        },
        {
          title: 'Agent Légalisation',
          email: 'legal.justice@min-jus.ga',
          password: 'legal123',
          role: 'AGENT',
          description: 'Légalisation de documents'
        },
        {
          title: 'Greffier',
          email: 'greffier.justice@min-jus.ga',
          password: 'greffier123',
          role: 'AGENT',
          description: 'Services du greffe'
        }
      ],
      'default': [
        {
          title: 'Administrateur',
          email: `admin@${code.toLowerCase()}.ga`,
          password: 'admin123',
          role: 'ADMIN',
          description: 'Administration de l\'organisme'
        },
        {
          title: 'Agent',
          email: `agent@${code.toLowerCase()}.ga`,
          password: 'agent123',
          role: 'AGENT',
          description: 'Agent de l\'organisme'
        }
      ]
    };
    return comptes[code] || comptes.default;
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
        // Rediriger vers le dashboard de l'organisme
        router.push(`/${organismeCode}/dashboard`);
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return Settings;
      case 'MANAGER': return UserCheck;
      case 'AGENT': return User;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-600';
      case 'MANAGER': return 'bg-orange-600';
      case 'AGENT': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  if (!organismeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const theme = organismeData.theme;
  const IconComponent = theme.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header Organisme */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => router.push(`/${organismeCode}`)}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-r from-${theme.primary}-600 to-${theme.secondary}-600 rounded-lg flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{organismeData.nom}</h1>
                  <p className="text-xs text-gray-500">Espace de Connexion - {organismeData.code}</p>
                </div>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
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
        <div className="max-w-6xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Connexion {organismeData.code}
            </h1>
            <p className="text-xl text-gray-600">
              Accès réservé aux agents et administrateurs de {organismeData.nom}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulaire de connexion */}
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-r from-${theme.primary}-600 to-${theme.secondary}-600 rounded-full flex items-center justify-center`}>
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
                <CardDescription>
                  Accès aux outils de travail {organismeData.code}
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
                          <FormLabel>Adresse email professionnelle</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input 
                                type="email" 
                                placeholder={`nom@${organismeCode.toLowerCase()}.ga`}
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
                                placeholder="Mot de passe professionnel"
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
                      className={`w-full bg-${theme.primary}-600 hover:bg-${theme.primary}-700`}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Connexion...' : 'Se connecter'}
                    </Button>
                  </form>
                </Form>

                <div className="mt-6 text-center">
                  <Link 
                    href={`/${organismeCode}/auth/mot-de-passe-oublie`}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Comptes de démonstration pour cet organisme */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Comptes de Test</h2>
                <p className="text-gray-600">Personnels de {organismeData.code}</p>
              </div>

              <div className="space-y-4">
                {organismeData.comptes.map((compte, index) => {
                  const RoleIcon = getRoleIcon(compte.role);
                  const roleColor = getRoleColor(compte.role);
                  
                  return (
                    <Card 
                      key={index}
                      className="hover:shadow-lg transition-shadow cursor-pointer group"
                      onClick={() => fillDemoAccount(compte.email, compte.password)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${roleColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <RoleIcon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{compte.title}</h3>
                            <p className="text-sm text-gray-600">{compte.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {compte.role}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {organismeData.code}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 font-mono">{compte.email}</p>
                            <p className="text-xs text-gray-400">Cliquer pour remplir</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className={`bg-${theme.primary}-50 border border-${theme.primary}-200 rounded-lg p-4`}>
                <h3 className={`font-semibold text-${theme.primary}-900 mb-2`}>ℹ️ Accès Réservé</h3>
                <p className={`text-sm text-${theme.primary}-800`}>
                  Cette interface est exclusivement destinée aux personnels de <strong>{organismeData.nom}</strong>.
                  Chaque organisme dispose de sa propre interface sécurisée.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">🔒 Sécurité</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Accès limité aux agents de {organismeData.code}</li>
                  <li>• Sessions sécurisées et chiffrées</li>
                  <li>• Audit des connexions</li>
                  <li>• Isolation des données par organisme</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 