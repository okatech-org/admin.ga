'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Building2,
  Users,
  FileText,
  BarChart3,
  Settings,
  Bell,
  Calendar,
  Download,
  Upload,
  Activity,
  Shield,
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  User,
  ChevronRight,
  Globe,
  Database,
  Smartphone,
  Monitor,
  PieChart
} from 'lucide-react';
import { OrganismeMultiTenant, UtilisateurMultiTenant } from '@/lib/types/multi-tenant';

export default function DashboardOrganismePage() {
  const [organisme, setOrganisme] = useState<OrganismeMultiTenant | null>(null);
  const [utilisateur, setUtilisateur] = useState<UtilisateurMultiTenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsOrganisme, setStatsOrganisme] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // En production, récupérer depuis l'API avec le contexte tenant
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
          fonctionnalites_actives: ['Dashboard Avancé', 'API Publique', 'Analytics'],
          langue_defaut: 'fr'
        },
        pages_personnalisees: {
          message_bienvenue: 'Tableau de bord - Ministère de la Digitalisation',
          contenu_accueil: '',
          pied_page: '© 2024 Ministère de la Digitalisation'
        },
        integrations: {
          sso_actif: true,
          api_publique_activee: true,
          webhooks_actifs: false
        }
      };

      const utilisateurData: UtilisateurMultiTenant = {
        id: 'user_demo_001',
        email: 'admin@digitalisation.ga',
        nom: 'Administrateur',
        prenom: 'Demo',
        organisme_id: organismeData.id,
        role: 'admin_organisme',
        date_inscription: new Date().toISOString(),
        dernier_connexion: new Date().toISOString(),
        actif: true,
        preferences: {
          langue: 'fr',
          notifications: true,
          theme: 'light'
        }
      };

      // Statistiques simulées
      const stats = {
        utilisateurs: {
          total: 47,
          actifs_aujourd_hui: 23,
          nouveaux_ce_mois: 8,
          pourcentage_actifs: 89
        },
        documents: {
          total: 1247,
          traités_aujourd_hui: 34,
          en_attente: 12,
          approuvés: 1189
        },
        services: {
          disponibles: 28,
          utilisés: 24,
          maintenance: 1,
          temps_reponse_moyen: 1.2
        },
        systeme: {
          stockage_utilise: 67,
          cpu_utilisation: 23,
          memoire_utilisation: 45,
          uptime: 99.8
        }
      };

      setOrganisme(organismeData);
      setUtilisateur(utilisateurData);
      setStatsOrganisme(stats);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeconnexion = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (!organisme || !utilisateur) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Erreur d'accès</h2>
            <p className="text-gray-600">Impossible d'accéder au tableau de bord.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{
        '--couleur-primaire': organisme.couleur_primaire,
        '--couleur-secondaire': organisme.couleur_secondaire
      } as React.CSSProperties}
    >
      {/* Header du dashboard */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {organisme.logo_url && (
                <img
                  src={organisme.logo_url}
                  alt={`Logo ${organisme.nom}`}
                  className="h-10 object-contain"
                />
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{organisme.nom}</h1>
                <p className="text-sm text-gray-500">Tableau de Bord Administratif</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                <Badge className="bg-red-500 text-white text-xs ml-1">3</Badge>
              </Button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{utilisateur.prenom} {utilisateur.nom}</p>
                  <p className="text-xs text-gray-500">{utilisateur.role.replace('_', ' ')}</p>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={handleDeconnexion}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation secondaire */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { label: 'Vue d\'ensemble', active: true, icon: BarChart3 },
              { label: 'Utilisateurs', active: false, icon: Users },
              { label: 'Documents', active: false, icon: FileText },
              { label: 'Services', active: false, icon: Settings },
              { label: 'Analytics', active: false, icon: Activity }
            ].map((item, index) => (
              <button
                key={index}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  item.active
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message de bienvenue */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bonjour {utilisateur.prenom} 👋
          </h2>
          <p className="text-gray-600">
            Voici un aperçu de l'activité de {organisme.nom}
          </p>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Utilisateurs */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Utilisateurs Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{statsOrganisme.utilisateurs.total}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+{statsOrganisme.utilisateurs.nouveaux_ce_mois} ce mois</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Documents Traités</p>
                  <p className="text-2xl font-bold text-gray-900">{statsOrganisme.documents.total}</p>
                  <div className="flex items-center mt-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{statsOrganisme.documents.traités_aujourd_hui} aujourd'hui</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Services Disponibles</p>
                  <p className="text-2xl font-bold text-gray-900">{statsOrganisme.services.disponibles}</p>
                  <div className="flex items-center mt-2">
                    <Activity className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600">{statsOrganisme.services.utilisés} utilisés</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Temps de Réponse</p>
                  <p className="text-2xl font-bold text-gray-900">{statsOrganisme.services.temps_reponse_moyen}s</p>
                  <div className="flex items-center mt-2">
                    <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">-12% vs hier</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques et détails */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Activité récente */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Activité des 7 derniers jours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { jour: 'Lundi', utilisateurs: 67, documents: 45, color: 'bg-blue-500' },
                    { jour: 'Mardi', utilisateurs: 72, documents: 52, color: 'bg-blue-500' },
                    { jour: 'Mercredi', utilisateurs: 58, documents: 38, color: 'bg-blue-500' },
                    { jour: 'Jeudi', utilisateurs: 81, documents: 67, color: 'bg-blue-500' },
                    { jour: 'Vendredi', utilisateurs: 94, documents: 73, color: 'bg-blue-500' },
                    { jour: 'Samedi', utilisateurs: 45, documents: 21, color: 'bg-gray-400' },
                    { jour: 'Dimanche', utilisateurs: 23, documents: 12, color: 'bg-gray-400' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <span className="text-sm font-medium">{item.jour}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{item.utilisateurs} utilisateurs</span>
                        <span>{item.documents} documents</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Utilisation du système */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-green-600" />
                Utilisation Système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Stockage</span>
                  <span>{statsOrganisme.systeme.stockage_utilise}%</span>
                </div>
                <Progress value={statsOrganisme.systeme.stockage_utilise} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>CPU</span>
                  <span>{statsOrganisme.systeme.cpu_utilisation}%</span>
                </div>
                <Progress value={statsOrganisme.systeme.cpu_utilisation} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Mémoire</span>
                  <span>{statsOrganisme.systeme.memoire_utilisation}%</span>
                </div>
                <Progress value={statsOrganisme.systeme.memoire_utilisation} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Uptime</span>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium">{statsOrganisme.systeme.uptime}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Gérer les Utilisateurs',
              description: 'Ajouter, modifier ou supprimer des utilisateurs',
              icon: Users,
              color: 'blue',
              action: () => console.log('Gérer utilisateurs')
            },
            {
              title: 'Traiter Documents',
              description: 'Valider et traiter les documents en attente',
              icon: FileText,
              color: 'green',
              badge: statsOrganisme.documents.en_attente,
              action: () => console.log('Traiter documents')
            },
            {
              title: 'Configurer Services',
              description: 'Paramétrer et activer les services',
              icon: Settings,
              color: 'purple',
              action: () => console.log('Configurer services')
            },
            {
              title: 'Voir Analytics',
              description: 'Analyser les performances et l\'usage',
              icon: BarChart3,
              color: 'yellow',
              action: () => console.log('Voir analytics')
            }
          ].map((action, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={action.action}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center`}>
                    <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                  </div>
                  {action.badge && (
                    <Badge className="bg-red-500 text-white">{action.badge}</Badge>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  Accéder
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Configuration organisme */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Configuration de l'Organisme
            </CardTitle>
            <CardDescription>
              Paramètres et personnalisation de votre environnement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Domaines</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{organisme.domaine_personnalise}</span>
                    <Badge className="bg-green-100 text-green-800 text-xs">Actif</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">admin.ga/org/{organisme.slug}</span>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">Principal</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Fonctionnalités</h4>
                <div className="space-y-1">
                  {organisme.config.fonctionnalites_actives.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Quotas</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Utilisateurs</span>
                      <span>{statsOrganisme.utilisateurs.total}/{organisme.config.max_utilisateurs}</span>
                    </div>
                    <Progress
                      value={(statsOrganisme.utilisateurs.total / organisme.config.max_utilisateurs) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Settings className="h-4 w-4 mr-2" />
                Configurer l'Organisme
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* CSS personnalisé injecté */}
      {organisme.css_personnalise && (
        <style dangerouslySetInnerHTML={{ __html: organisme.css_personnalise }} />
      )}
    </div>
  );
}
