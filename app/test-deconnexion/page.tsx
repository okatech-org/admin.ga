'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogoutButton } from '@/components/layout/logout-button';
import { UserMenu } from '@/components/layout/user-menu';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { CheckCircle, AlertCircle, User, Shield, Users, Settings } from 'lucide-react';

export default function TestDeconnexionPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full mx-auto mb-4"></div>
            <p>Chargement de la session...</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span>Non connecté</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Vous devez être connecté pour accéder à cette page.</p>
            <a 
              href="/auth/connexion" 
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
            >
              Se connecter
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'ADMIN':
        return <Shield className="h-5 w-5 text-orange-500" />;
      case 'MANAGER':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'AGENT':
        return <User className="h-5 w-5 text-green-500" />;
      default:
        return <User className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Administrateur';
      case 'ADMIN':
        return 'Administrateur';
      case 'MANAGER':
        return 'Responsable';
      case 'AGENT':
        return 'Agent';
      default:
        return 'Citoyen';
    }
  };

  const getDashboardLink = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        return '/admin/dashboard';
      case 'MANAGER':
        return '/manager/dashboard';
      case 'AGENT':
        return '/agent/dashboard';
      default:
        return '/citoyen/dashboard';
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Test des Fonctionnalités de Déconnexion</h1>
          <p className="text-muted-foreground">
            Vérification des boutons et composants de déconnexion
          </p>
        </div>

        {/* Informations de session */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Session Active</span>
            </CardTitle>
            <CardDescription>
              Informations de l'utilisateur connecté
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-medium">Nom complet</label>
                <p className="text-muted-foreground">{session.user.firstName} {session.user.lastName}</p>
              </div>
              <div>
                <label className="font-medium">Email</label>
                <p className="text-muted-foreground">{session.user.email}</p>
              </div>
              <div>
                <label className="font-medium">Rôle</label>
                <div className="flex items-center space-x-2">
                  {getRoleIcon(session.user.role)}
                  <span>{getRoleLabel(session.user.role)}</span>
                </div>
              </div>
              <div>
                <label className="font-medium">Statut</label>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connecté
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tests des composants de déconnexion */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Bouton de Déconnexion Standard</CardTitle>
              <CardDescription>
                Bouton par défaut avec style ghost
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LogoutButton />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bouton de Déconnexion Destructive</CardTitle>
              <CardDescription>
                Bouton avec variant destructive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LogoutButton variant="destructive" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bouton Sans Icône</CardTitle>
              <CardDescription>
                Bouton de déconnexion sans icône
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LogoutButton showIcon={false} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Menu Utilisateur</CardTitle>
              <CardDescription>
                Composant UserMenu avec avatar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <UserMenu />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bouton Personnalisé</CardTitle>
              <CardDescription>
                Bouton avec texte personnalisé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LogoutButton variant="outline" className="w-full">
                Quitter l'Application
              </LogoutButton>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
              <CardDescription>
                Lien vers votre tableau de bord
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href={getDashboardLink(session.user.role)}
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
              >
                <Settings className="mr-2 h-4 w-4" />
                Aller au Dashboard
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions de Test</CardTitle>
            <CardDescription>
              Comment tester les fonctionnalités
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>1. Sidebar :</strong> Le bouton "Se déconnecter" devrait être visible en bas de la sidebar (desktop)</p>
              <p><strong>2. Header :</strong> Cliquez sur votre avatar en haut à droite pour accéder au menu utilisateur</p>
              <p><strong>3. Boutons ci-dessus :</strong> Testez les différents styles de boutons de déconnexion</p>
              <p><strong>4. Feedback :</strong> Chaque déconnexion devrait afficher des toasts (loading + succès)</p>
              <p><strong>5. Redirection :</strong> Après déconnexion, vous devriez être redirigé vers la page d'accueil</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
} 