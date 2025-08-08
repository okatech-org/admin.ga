/* @ts-nocheck */
'use client';

import { useState, Suspense } from 'react';
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
import {
  Eye,
  EyeOff,
  Building2,
  Users,
  Settings,
  Lock,
  Mail,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

type LoginInput = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const callbackUrl = searchParams?.get('callbackUrl') || null;

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Compte de démonstration pour connexion directe (super admin uniquement)
  const compteSysteme = {
    title: 'Super Administrateur',
    email: 'superadmin@administration.ga',
    password: 'SuperAdmin2024!',
    description: 'Accès complet système ADMINISTRATION.GA',
    icon: Settings,
    color: 'bg-gray-800',
    destination: 'Interface Super Admin Moderne'
  };

  // Fonction pour déterminer la redirection selon le rôle
  const getRedirectPath = (user: any) => {
    const { role } = user;

    if (role === 'SUPER_ADMIN') {
      return '/super-admin'; // Nouvelle interface moderne
    }

    // Par défaut, rediriger vers DEMARCHE.GA pour les autres
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
        const redirectPath = callbackUrl || getRedirectPath(session.user);
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

  return (
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
            Connexion sécurisée pour les administrateurs
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
                          placeholder="admin@administration.ga"
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

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={() => fillDemoAccount(compteSysteme.email, compteSysteme.password)}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 ${compteSysteme.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <compteSysteme.icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-900">{compteSysteme.title}</h3>
                <p className="text-gray-600 mt-1">{compteSysteme.description}</p>
                <p className="text-blue-600 font-medium mt-2">→ {compteSysteme.destination}</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 font-mono mb-1">Email: {compteSysteme.email}</p>
              <p className="text-xs text-gray-400">Cliquez pour remplir automatiquement le formulaire</p>
            </div>
          </CardContent>
        </Card>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">💡 Accès aux Tests</h3>
          <p className="text-yellow-800 text-sm mb-3">
            Pour tester les organismes publics et l'espace citoyen, connectez-vous d'abord comme super admin.
          </p>
          <p className="text-yellow-700 text-xs">
            Le volet "Connexion DEMO" sera alors disponible dans le menu de navigation.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
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
                  <h1 className="text-xl font-bold text-gray-900">ADMINISTRATION.GA</h1>
                  <p className="text-xs text-gray-500">Accès administrateur système</p>
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
        <div className="max-w-4xl w-full">
          {/* Header principal */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Connexion Administrateur
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Accès réservé aux administrateurs système ADMINISTRATION.GA
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-blue-800 text-sm">
                Pour accéder aux organismes publics ou à l'espace citoyen, utilisez le volet "Connexion DEMO" dans le menu super admin.
              </p>
            </div>
          </div>

          {/* Connexion Administrative */}
          <Suspense fallback={
            <div className="flex items-center justify-center p-8">
              <div className="text-gray-500">Chargement...</div>
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
