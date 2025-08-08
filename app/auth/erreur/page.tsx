'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Home, ArrowLeft, RefreshCw } from 'lucide-react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const error = searchParams.get('error') || 'default';
  const errorInfo = errorMessages[error.toLowerCase()] || errorMessages.default;

  const handleRetry = () => {
    router.push('/auth/connexion');
  };

  const handleHome = () => {
    router.push('/');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-xl">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">
          {errorInfo.title}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {errorInfo.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {errorInfo.action && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errorInfo.action}
            </AlertDescription>
          </Alert>
        )}

        {error !== 'default' && error !== 'undefined' && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 font-mono">
              Code d'erreur: {error}
            </p>
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <Button onClick={handleRetry} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer la connexion
          </Button>

          <Button variant="outline" onClick={handleBack} className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>

          <Button variant="secondary" onClick={handleHome} className="w-full">
            <Home className="h-4 w-4 mr-2" />
            Accueil
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Si le problème persiste, contactez le{' '}
            <a
              href="mailto:support@administration.ga"
              className="text-blue-600 hover:underline"
            >
              support technique
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

const errorMessages: Record<string, { title: string; description: string; action?: string }> = {
  'configuration': {
    title: 'Erreur de Configuration',
    description: 'Un problème de configuration a été détecté. Veuillez contacter l\'administrateur système.',
  },
  'accessdenied': {
    title: 'Accès Refusé',
    description: 'Vous n\'avez pas les autorisations nécessaires pour accéder à cette ressource.',
    action: 'Contactez votre administrateur pour obtenir les accès appropriés.',
  },
  'verification': {
    title: 'Erreur de Vérification',
    description: 'Le lien de vérification est invalide ou a expiré.',
    action: 'Veuillez demander un nouveau lien de vérification.',
  },
  'default': {
    title: 'Erreur d\'Authentification',
    description: 'Une erreur inattendue s\'est produite lors de l\'authentification.',
    action: 'Veuillez réessayer ou contacter le support technique.',
  },
  'credentialssignin': {
    title: 'Identifiants Incorrects',
    description: 'L\'email ou le mot de passe que vous avez saisi est incorrect.',
    action: 'Vérifiez vos identifiants et réessayez.',
  },
  'emailsignin': {
    title: 'Erreur d\'Envoi d\'Email',
    description: 'Impossible d\'envoyer l\'email de connexion.',
    action: 'Vérifiez votre adresse email et réessayez.',
  },
  'oauthsignin': {
    title: 'Erreur OAuth',
    description: 'Erreur lors de la connexion avec le fournisseur externe.',
    action: 'Réessayez avec un autre mode de connexion.',
  },
  'oauthcallback': {
    title: 'Erreur de Callback OAuth',
    description: 'Erreur lors du retour de connexion du fournisseur externe.',
  },
  'oauthcreateaccount': {
    title: 'Erreur de Création de Compte',
    description: 'Impossible de créer un compte avec ce fournisseur externe.',
  },
  'emailcreateaccount': {
    title: 'Erreur de Création de Compte',
    description: 'Impossible de créer un compte avec cette adresse email.',
  },
  'callback': {
    title: 'Erreur de Callback',
    description: 'Erreur lors du processus d\'authentification.',
  },
  'oauthaccountnotlinked': {
    title: 'Compte Non Lié',
    description: 'Ce compte externe est déjà associé à un autre utilisateur.',
    action: 'Connectez-vous avec vos identifiants habituels ou contactez le support.',
  },
  'sessionrequired': {
    title: 'Session Requise',
    description: 'Vous devez être connecté pour accéder à cette page.',
    action: 'Veuillez vous connecter pour continuer.',
  },
};

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Suspense fallback={
        <Card className="w-full max-w-md mx-auto border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </CardContent>
        </Card>
      }>
        <AuthErrorContent />
      </Suspense>
    </div>
  );
}
