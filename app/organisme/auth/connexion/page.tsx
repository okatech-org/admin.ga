'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { OrganismeMultiTenant } from '@/lib/types/multi-tenant';

export default function ConnexionOrganismePage() {
  const [organisme, setOrganisme] = useState<OrganismeMultiTenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  useEffect(() => {
    loadOrganismeData();
  }, []);

  const loadOrganismeData = async () => {
    try {
      // En production, récupérer depuis l'API basé sur les headers X-Tenant-*
      const organismeData: OrganismeMultiTenant = {
        id: 'org_demo_001',
        nom: 'Ministère de la Digitalisation',
        slug: 'min-digitalisation',
        domaine_personnalise: 'digitalisation.ga',
        date_creation: new Date().toISOString(),
        statut: 'actif',
        logo_url: 'https://via.placeholder.com/200x80/1976d2/ffffff?text=LOGO',
        favicon_url: '/favicon.ico',
        couleur_primaire: '#1976d2',
        couleur_secondaire: '#42a5f5',
        css_personnalise: '',
        config: {
          max_utilisateurs: 100,
          fonctionnalites_actives: ['Dashboard Avancé', 'API Publique', 'SSO'],
          langue_defaut: 'fr'
        },
        pages_personnalisees: {
          message_bienvenue: 'Connectez-vous à votre espace sécurisé',
          contenu_accueil: '',
          pied_page: '© 2024 Ministère de la Digitalisation'
        },
        integrations: {
          sso_actif: true,
          api_publique_activee: true,
          webhooks_actifs: false
        }
      };

      setOrganisme(organismeData);
    } catch (error) {
      console.error('Erreur chargement organisme:', error);
      setError('Erreur lors du chargement de la page de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Validation côté client
      if (!formData.email || !formData.password) {
        throw new Error('Veuillez remplir tous les champs');
      }

      if (!formData.email.includes('@')) {
        throw new Error('Veuillez entrer une adresse email valide');
      }

      // Simulation de l'authentification
      await new Promise(resolve => setTimeout(resolve, 2000));

      // En production, appel API avec vérification du tenant
      const response = await simulateAuthentication(formData.email, formData.password, organisme?.id);

      if (response.success) {
        setSuccess('Connexion réussie ! Redirection...');

        // Redirection vers le dashboard après 1 seconde
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        throw new Error(response.error);
      }

    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const simulateAuthentication = async (email: string, password: string, organismeId?: string) => {
    // Simulation - en production, vérifier contre la base de données
    // avec isolation par organisme

    // Vérifier que l'utilisateur appartient à cet organisme
    if (!email.includes('@')) {
      return { success: false, error: 'Email invalide' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Mot de passe trop court' };
    }

    // Simulation d'utilisateurs valides pour la démonstration
    const utilisateursValides = [
      { email: 'admin@digitalisation.ga', password: 'admin123', role: 'admin_organisme' },
      { email: 'user@digitalisation.ga', password: 'user123', role: 'membre' },
      { email: 'demo@digitalisation.ga', password: 'demo123', role: 'invite' }
    ];

    const utilisateur = utilisateursValides.find(u => u.email === email && u.password === password);

    if (!utilisateur) {
      return {
        success: false,
        error: 'Email ou mot de passe incorrect, ou vous n\'appartenez pas à cet organisme'
      };
    }

    return { success: true, user: utilisateur };
  };

  const handleSSOLogin = () => {
    // Redirection vers le provider SSO configuré
    setSuccess('Redirection vers le système d\'authentification unique...');
    // En production: window.location.href = ssoProvider.authUrl
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!organisme) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Erreur de Configuration</h2>
            <p className="text-gray-600">Impossible de charger la page de connexion.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: `linear-gradient(135deg, ${organisme.couleur_primaire} 0%, ${organisme.couleur_secondaire} 100%)`
      }}
    >
      {/* Header minimaliste */}
      <header className="p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={() => window.location.href = '/'}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>

          {organisme.logo_url && (
            <img
              src={organisme.logo_url}
              alt={`Logo ${organisme.nom}`}
              className="h-10 object-contain"
            />
          )}
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Carte de connexion */}
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-white" />
              </div>

              <CardTitle className="text-2xl font-bold text-gray-900">
                {organisme.nom}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {organisme.pages_personnalisees.message_bienvenue}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Alertes */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {/* Formulaire de connexion */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Adresse Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder={`votre.email@${organisme.slug}.ga`}
                    className="mt-1"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Utilisez votre email professionnel de {organisme.nom}
                  </p>
                </div>

                <div>
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Mot de Passe
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Votre mot de passe"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))}
                    />
                    <Label htmlFor="rememberMe" className="text-sm">
                      Se souvenir de moi
                    </Label>
                  </div>

                  <Button variant="link" className="p-0 h-auto text-sm">
                    Mot de passe oublié ?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  style={{ backgroundColor: organisme.couleur_primaire }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Se Connecter
                    </>
                  )}
                </Button>
              </form>

              {/* SSO si activé */}
              {organisme.integrations.sso_actif && (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Ou</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleSSOLogin}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Connexion Unique (SSO)
                  </Button>
                </div>
              )}

              {/* Informations de sécurité */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Connexion Sécurisée</p>
                    <p className="text-blue-700 mt-1">
                      Vos données sont protégées par un chiffrement de niveau bancaire.
                      Seuls les membres autorisés de {organisme.nom} peuvent accéder à cette plateforme.
                    </p>
                  </div>
                </div>
              </div>

              {/* Aide */}
              <div className="text-center text-sm text-gray-600">
                <p>
                  Besoin d'aide ?
                  <Button variant="link" className="p-0 h-auto ml-1 text-sm">
                    Contactez le support
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Informations de démonstration */}
          <Card className="bg-white/95 backdrop-blur">
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-900 mb-2">Comptes de Démonstration</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Administrateur:</strong> admin@digitalisation.ga / admin123
                </div>
                <div>
                  <strong>Utilisateur:</strong> user@digitalisation.ga / user123
                </div>
                <div>
                  <strong>Invité:</strong> demo@digitalisation.ga / demo123
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-white/80">
        <p className="text-sm">
          {organisme.pages_personnalisees.pied_page}
        </p>
      </footer>

      {/* CSS personnalisé injecté */}
      {organisme.css_personnalise && (
        <style dangerouslySetInnerHTML={{ __html: organisme.css_personnalise }} />
      )}
    </div>
  );
}
