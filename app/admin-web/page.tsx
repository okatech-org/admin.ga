'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { LogoPNG } from '@/components/ui/logo-png';
import { LogoAdministrationGA } from '@/components/ui/logo-administration-ga';
import { MenuManager } from '@/components/admin/menu-manager';
import { ContentManager } from '@/components/admin/content-manager';
import DomainManagementInterface from '@/components/domain-management/domain-management-interface';
import { InterAppNavigation } from '@/components/layout/inter-app-navigation';
import Link from 'next/link';
import {
  Settings, Upload, Eye, Save, RefreshCw, Image, Menu, FileText,
  Globe, Palette, Layout, Info, Bell, Link as LinkIcon, Users, Shield, Edit2, Trash2, Plus, Activity, CheckCircle2,
  Briefcase, TrendingUp, MapPin, Clock, DollarSign, Building2, Download, ArrowLeft, Home
} from 'lucide-react';

/**
 * Interface d'Administration Web
 *
 * Environnement complet pour modifier les applications ADMINISTRATION.GA et DEMARCHE.GA
 * - Gestion des logos et assets visuels
 * - Configuration des menus et navigation
 * - Gestion du contenu et actualités
 * - Paramètres généraux des applications
 */

type ApplicationType = 'administration' | 'demarche' | 'travail';
type ViewMode = 'selector' | 'config';

export default function AdminWebInterface() {
  const [viewMode, setViewMode] = useState<ViewMode>('selector');
  const [selectedApp, setSelectedApp] = useState<ApplicationType | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hasChanges, setHasChanges] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');


  // Configuration ADMINISTRATION.GA
  const [administrationConfig, setAdministrationConfig] = useState({
    enabled: true,
    name: 'ADMINISTRATION.GA',
    subtitle: 'République Gabonaise',
    description: 'Plateforme officielle d\'administration gabonaise',
    domain: 'administration.ga',
    logoUrl: '/images/logo-administration-ga.png',
    faviconUrl: '/favicon.ico',
    primaryColor: '#009E49',
    secondaryColor: '#FFD700',
    accentColor: '#3A75C4',
    features: {
      userManagement: true,
      organizationManagement: true,
      analytics: true,
      reporting: true,
      apiAccess: true
    },
    stats: {
      activeUsers: 1247,
      organizations: 160,
      dailyLogins: 312,
      uptime: '99.9%'
    }
  });

  // Configuration DEMARCHE.GA
  const [demarcheConfig, setDemarcheConfig] = useState({
    enabled: true,
    name: 'DEMARCHE.GA',
    subtitle: 'Démarches Simplifiées',
    description: 'Portail des démarches administratives gabonaises',
    domain: 'demarche.ga',
    logoUrl: '/images/logo-demarche-ga.png',
    faviconUrl: '/favicon.ico',
    primaryColor: '#1E40AF',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
    features: {
      onlineServices: true,
      documentTracking: true,
      citizenPortal: true,
      mobileApp: true,
      notifications: true
    },
    stats: {
      activeServices: 45,
      monthlyRequests: 2834,
      completedProcedures: 1956,
      uptime: '99.8%'
    }
  });

  // Configuration TRAVAIL.GA
  const [travailConfig, setTravailConfig] = useState({
    enabled: true,
    name: 'TRAVAIL.GA',
    subtitle: 'Emploi Public',
    description: 'Plateforme officielle de l\'emploi public au Gabon',
    domain: 'travail.ga',
    logoUrl: '/images/logo-travail-ga.png',
    faviconUrl: '/favicon.ico',
    primaryColor: '#1E40AF',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
    features: {
      candidatureEnLigne: true,
      uploadCV: true,
      notifications: true,
      statistiques: true,
      filtresAvances: true,
      exportOffres: true
    },
    parametres: {
      dureeOffre: 30,
      tailleMaxCV: 5,
      formatsCV: ['PDF', 'DOC', 'DOCX'],
      niveauxEtudes: ['Bac', 'Bac+2', 'Bac+3', 'Bac+5', 'Doctorat'],
      typesContrats: ['CDI', 'CDD', 'Stage', 'Consultance'],
      localisations: ['Libreville', 'Port-Gentil', 'Franceville', 'Oyem', 'Mouila']
    },
    stats: {
      offresActives: 24,
      candidaturesRecues: 342,
      offresExpirées: 8,
      tauxConversion: 12.5,
      organismeRecruteurs: 18,
      candidatsInscrits: 1567,
      uptime: '99.7%'
    }
  });

  const [newsItems, setNewsItems] = useState([
    {
      id: '1',
      title: 'Mise à jour du système ADMINISTRATION.GA',
      content: 'Nouvelle version avec fonctionnalités améliorées...',
      date: '2024-01-15',
      published: true,
      category: 'Système'
    }
  ]);

  // Navigation functions
  const handleSelectApplication = (app: ApplicationType) => {
    setSelectedApp(app);
    setViewMode('config');
    setActiveTab('dashboard');
  };

  const handleBackToSelector = () => {
    setViewMode('selector');
    setSelectedApp(null);
    setHasChanges(false);
  };

  const getCurrentConfig = () => {
    switch (selectedApp) {
      case 'administration':
        return administrationConfig;
      case 'demarche':
        return demarcheConfig;
      case 'travail':
        return travailConfig;
      default:
        return null;
    }
  };

  const updateCurrentConfig = (updates: any) => {
    switch (selectedApp) {
      case 'administration':
        setAdministrationConfig(prev => ({ ...prev, ...updates }));
        break;
      case 'demarche':
        setDemarcheConfig(prev => ({ ...prev, ...updates }));
        break;
      case 'travail':
        setTravailConfig(prev => ({ ...prev, ...updates }));
        break;
    }
    setHasChanges(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (file) {
      // Ici on traiterait l'upload du fichier
      const url = URL.createObjectURL(file);
      // setLogoSettings(prev => ({ ...prev, [type]: url })); // TODO: Implement logo settings
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      // Simulation d'une sauvegarde - ici on enverrait les données à l'API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Logs pour le développement
      console.log('Configuration sauvegardée:', {
        administrationConfig,
        demarcheConfig,
        travailConfig,
        newsItems,
        selectedApp,
        timestamp: new Date().toISOString()
      });

      setSaveStatus('saved');
      setHasChanges(false);

      // Reset status après 3 secondes
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleExportConfig = () => {
    const config = {
      administrationConfig,
      demarcheConfig,
      travailConfig,
      newsItems,
      exportDate: new Date().toISOString(),
      version: '2.0.0'
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `administration-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Bouton retour au Super Admin Dashboard */}
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Link href="/super-admin">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Super Admin
                </Link>
              </Button>

              <LogoAdministrationGA width={32} height={32} />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Interface d'Administration Web</h1>
                <p className="text-sm text-gray-600">Gestion des applications ADMINISTRATION.GA, DEMARCHE.GA & TRAVAIL.GA</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {hasChanges && (
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  Modifications non sauvées
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {isPreviewMode ? 'Mode Edition' : 'Aperçu'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || saveStatus === 'saving'}
                className={saveStatus === 'saved' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                {saveStatus === 'saving' && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                {saveStatus === 'saved' && <CheckCircle2 className="w-4 h-4 mr-2" />}
                {(saveStatus === 'idle' || saveStatus === 'error') && <Save className="w-4 h-4 mr-2" />}
                {saveStatus === 'saving' ? 'Sauvegarde...' :
                 saveStatus === 'saved' ? 'Sauvegardé !' :
                 saveStatus === 'error' ? 'Erreur' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </div>
      </div>


      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Breadcrumb Navigation */}
        {viewMode === 'config' && selectedApp && (
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm">
              <button
                onClick={handleBackToSelector}
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <span>← Applications</span>
              </button>
              <span className="text-gray-500">/</span>
              <span className="font-medium text-gray-900">
                {getCurrentConfig()?.name}
              </span>
            </nav>
          </div>
        )}

        {viewMode === 'selector' ? (
          // Vue Sélecteur d'Applications
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Administration des Applications Web
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Sélectionnez une application pour configurer ses paramètres, gérer son contenu et personnaliser son apparence.
              </p>
            </div>

            {/* Statistiques globales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                {
                  title: 'Applications Actives',
                  value: [administrationConfig, demarcheConfig, travailConfig].filter(app => app.enabled).length,
                  total: 3,
                  icon: Globe,
                  color: 'bg-blue-500'
                },
                {
                  title: 'Utilisateurs Totaux',
                  value: administrationConfig.stats.activeUsers + demarcheConfig.stats.monthlyRequests + travailConfig.stats.candidatsInscrits,
                  icon: Users,
                  color: 'bg-green-500'
                },
                {
                  title: 'Uptime Moyen',
                  value: '99.8%',
                  icon: Activity,
                  color: 'bg-purple-500'
                },
                {
                  title: 'Dernière MAJ',
                  value: '2h',
                  icon: Clock,
                  color: 'bg-orange-500'
                }
              ].map((metric) => (
                <Card key={metric.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                        <p className="text-3xl font-bold text-gray-900">
                          {typeof metric.value === 'number' && metric.total ? `${metric.value}/${metric.total}` : metric.value}
                        </p>
                      </div>
                      <div className={`p-3 rounded-full ${metric.color}`}>
                        <metric.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

                        {/* Architecture des domaines */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Globe className="w-5 h-5" />
                  Architecture des Domaines
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Chaque application web dispose de son propre nom de domaine distinct
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {[
                    {
                      name: 'ADMINISTRATION.GA',
                      domain: 'administration.ga',
                      description: 'Plateforme d\'administration gabonaise',
                      color: 'bg-green-100 text-green-800 border-green-200',
                      localPath: '',
                      icon: Shield
                    },
                    {
                      name: 'DEMARCHE.GA',
                      domain: 'demarche.ga',
                      description: 'Portail des démarches citoyennes',
                      color: 'bg-blue-100 text-blue-800 border-blue-200',
                      localPath: '/demarche',
                      icon: FileText
                    },
                    {
                      name: 'TRAVAIL.GA',
                      domain: 'travail.ga',
                      description: 'Plateforme de l\'emploi public',
                      color: 'bg-purple-100 text-purple-800 border-purple-200',
                      localPath: '/travail',
                      icon: Briefcase
                    }
                  ].map((app) => (
                    <div key={app.domain} className={`p-6 rounded-lg border-2 ${app.color} space-y-4`}>
                      {/* En-tête de l'application */}
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-white/50">
                          <app.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{app.name}</h4>
                          <p className="text-sm opacity-90">{app.description}</p>
                        </div>
                      </div>

                      {/* Section Développement Local */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                          <span className="text-sm font-medium">Développement Local</span>
                        </div>
                        <div className="pl-5">
                          <a
                            href={`http://localhost:3000${app.localPath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 text-sm font-mono bg-white/70 px-3 py-2 rounded-md hover:bg-white/90 transition-colors border"
                          >
                            <span>🔧</span>
                            <span>localhost:3000{app.localPath}</span>
                          </a>
                        </div>
                      </div>

                      {/* Section Production */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                          <span className="text-sm font-medium">Production</span>
                        </div>
                        <div className="pl-5">
                          <a
                            href={`https://${app.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 text-sm font-mono bg-white/70 px-3 py-2 rounded-md hover:bg-white/90 transition-colors border"
                          >
                            <Globe className="w-4 h-4" />
                            <span>{app.domain}</span>
                          </a>
                        </div>
                      </div>

                      {/* Actions rapides */}
                      <div className="pt-2 border-t border-white/30">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-white/50 hover:bg-white/80 border-white/50"
                            onClick={() => window.open(`http://localhost:3000${app.localPath}`, '_blank')}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Local
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-white/50 hover:bg-white/80 border-white/50"
                            onClick={() => window.open(`https://${app.domain}`, '_blank')}
                          >
                            <Globe className="w-4 h-4 mr-1" />
                            Live
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Information supplémentaire */}
                <div className="mt-6 p-4 bg-white/60 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Environnements disponibles :</p>
                      <ul className="space-y-1 text-blue-700">
                        <li>• <span className="font-mono">🔧 Local</span> : Environnement de développement sur localhost:3000</li>
                        <li>• <span className="font-mono">🌐 Production</span> : Applications déployées sur les domaines .ga</li>
                        <li>• Chaque application peut être testée indépendamment dans les deux environnements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cartes de sélection d'applications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ADMINISTRATION.GA */}
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
                <CardContent className="p-0">
                  <div
                    className="p-6 rounded-t-lg"
                    style={{
                      background: `linear-gradient(135deg, ${administrationConfig.primaryColor}15, ${administrationConfig.secondaryColor}15)`
                    }}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div
                        className="w-16 h-16 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: administrationConfig.primaryColor }}
                      >
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {administrationConfig.name}
                        </h3>
                        <p className="text-sm text-gray-600">{administrationConfig.subtitle}</p>
                      </div>
                      <Badge className={administrationConfig.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {administrationConfig.enabled ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{administrationConfig.description}</p>

                    {/* URL de l'application */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 text-sm">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-600">URL:</span>
                        <a
                          href={`https://${administrationConfig.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline font-medium"
                        >
                          {administrationConfig.domain}
                        </a>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span>{administrationConfig.stats.activeUsers} utilisateurs</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          <span>{administrationConfig.stats.organizations} organismes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-gray-500" />
                          <span>Uptime {administrationConfig.stats.uptime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>{administrationConfig.stats.dailyLogins} connexions/j</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t">
                    <Button
                      className="w-full"
                      asChild
                      style={{ backgroundColor: administrationConfig.primaryColor }}
                    >
                      <Link href="/admin-web/config/administration.ga">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurer ADMINISTRATION.GA
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* DEMARCHE.GA */}
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
                <CardContent className="p-0">
                  <div
                    className="p-6 rounded-t-lg"
                    style={{
                      background: `linear-gradient(135deg, ${demarcheConfig.primaryColor}15, ${demarcheConfig.secondaryColor}15)`
                    }}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div
                        className="w-16 h-16 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: demarcheConfig.primaryColor }}
                      >
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {demarcheConfig.name}
                        </h3>
                        <p className="text-sm text-gray-600">{demarcheConfig.subtitle}</p>
                      </div>
                      <Badge className={demarcheConfig.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {demarcheConfig.enabled ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{demarcheConfig.description}</p>

                    {/* URL de l'application */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 text-sm">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-600">URL:</span>
                        <a
                          href={`https://${demarcheConfig.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline font-medium"
                        >
                          {demarcheConfig.domain}
                        </a>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span>{demarcheConfig.stats.activeServices} services</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-gray-500" />
                          <span>{demarcheConfig.stats.monthlyRequests} demandes/mois</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-gray-500" />
                          <span>Uptime {demarcheConfig.stats.uptime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-gray-500" />
                          <span>{demarcheConfig.stats.completedProcedures} complétées</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t">
                    <Button
                      className="w-full"
                      asChild
                      style={{ backgroundColor: demarcheConfig.primaryColor }}
                    >
                      <Link href="/admin-web/config/demarche.ga">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurer DEMARCHE.GA
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* TRAVAIL.GA */}
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
                <CardContent className="p-0">
                  <div
                    className="p-6 rounded-t-lg"
                    style={{
                      background: `linear-gradient(135deg, ${travailConfig.primaryColor}15, ${travailConfig.secondaryColor}15)`
                    }}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div
                        className="w-16 h-16 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: travailConfig.primaryColor }}
                      >
                        <Briefcase className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {travailConfig.name}
                        </h3>
                        <p className="text-sm text-gray-600">{travailConfig.subtitle}</p>
                      </div>
                      <Badge className={travailConfig.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {travailConfig.enabled ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{travailConfig.description}</p>

                    {/* URL de l'application */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 text-sm">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-600">URL:</span>
                        <a
                          href={`https://${travailConfig.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline font-medium"
                        >
                          {travailConfig.domain}
                        </a>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="w-4 h-4 text-gray-500" />
                          <span>{travailConfig.stats.offresActives} offres actives</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span>{travailConfig.stats.candidatsInscrits} candidats</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-gray-500" />
                          <span>Uptime {travailConfig.stats.uptime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-gray-500" />
                          <span>{travailConfig.stats.tauxConversion}% conversion</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t">
                    <Button
                      className="w-full"
                      asChild
                      style={{ backgroundColor: travailConfig.primaryColor }}
                    >
                      <Link href="/admin-web/config/travail.ga">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurer TRAVAIL.GA
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Vue Configuration d'Application
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Navigation des onglets */}
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <Layout className="w-4 h-4" />
                <span>Tableau de Bord</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <span>Apparence</span>
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Fonctionnalités</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Contenu</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="domains" className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Domaines</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Paramètres</span>
              </TabsTrigger>
            </TabsList>

          {/* Tableau de Bord de l'Application */}
          <TabsContent value="dashboard" className="space-y-6">
            {(() => {
              const config = getCurrentConfig();
              if (!config) return null;

              // Métriques spécifiques selon l'application
              let metrics = [];
              if (selectedApp === 'administration' && 'activeUsers' in config.stats) {
                metrics = [
                  { title: 'Utilisateurs Actifs', value: config.stats.activeUsers, icon: Users, color: 'bg-blue-500' },
                  { title: 'Organismes', value: config.stats.organizations, icon: Building2, color: 'bg-green-500' },
                  { title: 'Connexions/Jour', value: config.stats.dailyLogins, icon: Activity, color: 'bg-purple-500' },
                  { title: 'Uptime', value: config.stats.uptime, icon: Shield, color: 'bg-orange-500' }
                ];
              } else if (selectedApp === 'demarche' && 'activeServices' in config.stats) {
                metrics = [
                  { title: 'Services Actifs', value: config.stats.activeServices, icon: FileText, color: 'bg-blue-500' },
                  { title: 'Demandes/Mois', value: config.stats.monthlyRequests, icon: TrendingUp, color: 'bg-green-500' },
                  { title: 'Procédures Complétées', value: config.stats.completedProcedures, icon: CheckCircle2, color: 'bg-purple-500' },
                  { title: 'Uptime', value: config.stats.uptime, icon: Shield, color: 'bg-orange-500' }
                ];
              } else if (selectedApp === 'travail' && 'offresActives' in config.stats) {
                metrics = [
                  { title: 'Offres Actives', value: config.stats.offresActives, icon: Briefcase, color: 'bg-blue-500' },
                  { title: 'Candidatures', value: config.stats.candidaturesRecues, icon: Users, color: 'bg-green-500' },
                  { title: 'Candidats Inscrits', value: config.stats.candidatsInscrits, icon: Users, color: 'bg-purple-500' },
                  { title: 'Taux Conversion', value: `${config.stats.tauxConversion}%`, icon: TrendingUp, color: 'bg-orange-500' }
                ];
              }

              return (
                <>
                  {/* En-tête de l'application */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-16 h-16 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: config.primaryColor }}
                          >
                            {selectedApp === 'administration' && <Shield className="w-8 h-8 text-white" />}
                            {selectedApp === 'demarche' && <FileText className="w-8 h-8 text-white" />}
                            {selectedApp === 'travail' && <Briefcase className="w-8 h-8 text-white" />}
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">{config.name}</h2>
                            <p className="text-gray-600">{config.description}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              🌐 <a
                                href={`https://${config.domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                              >
                                {config.domain}
                              </a> •
                              <Badge className={`ml-2 ${config.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {config.enabled ? 'Actif' : 'Inactif'}
                              </Badge>
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={config.enabled}
                          onCheckedChange={(checked) => updateCurrentConfig({ enabled: checked })}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Métriques principales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metrics.map((metric) => (
                      <Card key={metric.title}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                              <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                            </div>
                            <div className={`p-3 rounded-full ${metric.color}`}>
                              <metric.icon className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Actions rapides */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Actions Rapides</CardTitle>
                      <CardDescription>
                        Accès direct aux fonctionnalités principales de {config.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button
                          variant="outline"
                          className="h-20 flex flex-col gap-2 hover:bg-blue-50"
                          onClick={() => setActiveTab('appearance')}
                        >
                          <Palette className="w-5 h-5" />
                          <span className="text-xs">Apparence</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-20 flex flex-col gap-2 hover:bg-green-50"
                          onClick={() => setActiveTab('features')}
                        >
                          <Settings className="w-5 h-5" />
                          <span className="text-xs">Fonctionnalités</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-20 flex flex-col gap-2 hover:bg-purple-50"
                          onClick={() => setActiveTab('content')}
                        >
                          <FileText className="w-5 h-5" />
                          <span className="text-xs">Contenu</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-20 flex flex-col gap-2 hover:bg-orange-50"
                          onClick={() => setActiveTab('analytics')}
                        >
                          <TrendingUp className="w-5 h-5" />
                          <span className="text-xs">Analytics</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              );
            })()}
          </TabsContent>

          {/* Onglet Apparence */}
          <TabsContent value="appearance" className="space-y-6">
            {(() => {
              const config = getCurrentConfig();
              if (!config) return null;

              return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Configuration de l'identité */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Identité de l'Application</CardTitle>
                      <CardDescription>
                        Nom, sous-titre et description de {config.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Nom de l'application</Label>
                        <Input
                          value={config.name}
                          onChange={(e) => updateCurrentConfig({ name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Sous-titre</Label>
                        <Input
                          value={config.subtitle}
                          onChange={(e) => updateCurrentConfig({ subtitle: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={config.description}
                          onChange={(e) => updateCurrentConfig({ description: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Nom de Domaine</Label>
                        <div className="space-y-2">
                          <Input
                            value={config.domain}
                            onChange={(e) => updateCurrentConfig({ domain: e.target.value })}
                            placeholder="exemple.ga"
                          />
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Globe className="w-4 h-4" />
                            <span>URL complète:</span>
                            <a
                              href={`https://${config.domain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              https://{config.domain}
                            </a>
                          </div>
                          <p className="text-xs text-gray-500">
                            ⚠️ Domaine distinct pour chaque application :
                            {selectedApp === 'administration' && ' administration.ga'}
                            {selectedApp === 'demarche' && ' demarche.ga'}
                            {selectedApp === 'travail' && ' travail.ga'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Configuration des couleurs */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Palette de Couleurs</CardTitle>
                      <CardDescription>
                        Personnalisation de l'identité visuelle
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label>Couleur Primaire</Label>
                          <div className="flex items-center space-x-3 mt-2">
                            <input
                              type="color"
                              value={config.primaryColor}
                              onChange={(e) => updateCurrentConfig({ primaryColor: e.target.value })}
                              className="w-12 h-12 rounded border cursor-pointer"
                            />
                            <div className="flex-1">
                              <Input
                                value={config.primaryColor}
                                onChange={(e) => updateCurrentConfig({ primaryColor: e.target.value })}
                                className="font-mono"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label>Couleur Secondaire</Label>
                          <div className="flex items-center space-x-3 mt-2">
                            <input
                              type="color"
                              value={config.secondaryColor}
                              onChange={(e) => updateCurrentConfig({ secondaryColor: e.target.value })}
                              className="w-12 h-12 rounded border cursor-pointer"
                            />
                            <div className="flex-1">
                              <Input
                                value={config.secondaryColor}
                                onChange={(e) => updateCurrentConfig({ secondaryColor: e.target.value })}
                                className="font-mono"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label>Couleur d'Accent</Label>
                          <div className="flex items-center space-x-3 mt-2">
                            <input
                              type="color"
                              value={config.accentColor}
                              onChange={(e) => updateCurrentConfig({ accentColor: e.target.value })}
                              className="w-12 h-12 rounded border cursor-pointer"
                            />
                            <div className="flex-1">
                              <Input
                                value={config.accentColor}
                                onChange={(e) => updateCurrentConfig({ accentColor: e.target.value })}
                                className="font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Gestion des logos */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Logos et Assets</CardTitle>
                      <CardDescription>
                        Upload et gestion des éléments visuels
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Logo Principal</Label>
                        <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                          <div className="flex items-center justify-center space-x-4">
                            <div
                              className="w-16 h-16 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: config.primaryColor }}
                            >
                              {selectedApp === 'administration' && <Shield className="w-8 h-8 text-white" />}
                              {selectedApp === 'demarche' && <FileText className="w-8 h-8 text-white" />}
                              {selectedApp === 'travail' && <Briefcase className="w-8 h-8 text-white" />}
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>Format: PNG, SVG</p>
                              <p>Taille: 512x512px</p>
                            </div>
                          </div>
                          <div className="mt-3 flex justify-center">
                            <Button variant="outline" size="sm">
                              <Upload className="w-4 h-4 mr-2" />
                              Changer le logo
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label>Favicon</Label>
                        <div className="mt-2 flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            <Image className="w-4 h-4 text-gray-400" />
                          </div>
                          <Button variant="outline" size="sm">
                            Changer favicon
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Aperçu en temps réel */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Aperçu en Temps Réel</CardTitle>
                      <CardDescription>
                        Prévisualisation des modifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="p-6 rounded-lg border"
                        style={{
                          background: `linear-gradient(135deg, ${config.primaryColor}20, ${config.secondaryColor}20)`
                        }}
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: config.primaryColor }}
                          >
                            {selectedApp === 'administration' && <Shield className="w-6 h-6 text-white" />}
                            {selectedApp === 'demarche' && <FileText className="w-6 h-6 text-white" />}
                            {selectedApp === 'travail' && <Briefcase className="w-6 h-6 text-white" />}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold" style={{ color: config.primaryColor }}>
                              {config.name}
                            </h3>
                            <p className="text-sm" style={{ color: config.accentColor }}>
                              {config.subtitle}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{config.description}</p>
                        <div className="mt-3 flex space-x-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: config.primaryColor }}
                          ></div>
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: config.secondaryColor }}
                          ></div>
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: config.accentColor }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })()}
          </TabsContent>

          {/* Onglet Fonctionnalités */}
          <TabsContent value="features" className="space-y-6">
            {(() => {
              const config = getCurrentConfig();
              if (!config) return null;

              return (
                <Card>
                  <CardHeader>
                    <CardTitle>Gestion des Fonctionnalités</CardTitle>
                    <CardDescription>
                      Activer ou désactiver les modules de {config.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(config.features).map(([key, enabled]) => {
                        let featureInfo = { name: key, description: 'Fonctionnalité' };

                        // Descriptions spécifiques selon l'application
                        if (selectedApp === 'administration') {
                          const adminFeatures = {
                            userManagement: { name: 'Gestion Utilisateurs', description: 'Création et gestion des comptes utilisateurs' },
                            organizationManagement: { name: 'Gestion Organismes', description: 'Administration des organismes publics' },
                            analytics: { name: 'Analytics', description: 'Tableaux de bord et statistiques' },
                            reporting: { name: 'Rapports', description: 'Génération de rapports détaillés' },
                            apiAccess: { name: 'Accès API', description: 'Interface de programmation pour intégrations' }
                          };
                          featureInfo = adminFeatures[key] || featureInfo;
                        } else if (selectedApp === 'demarche') {
                          const demarcheFeatures = {
                            onlineServices: { name: 'Services en Ligne', description: 'Démarches administratives dématérialisées' },
                            documentTracking: { name: 'Suivi Documents', description: 'Traçabilité des documents administratifs' },
                            citizenPortal: { name: 'Portail Citoyen', description: 'Interface dédiée aux citoyens' },
                            mobileApp: { name: 'Application Mobile', description: 'Version mobile de DEMARCHE.GA' },
                            notifications: { name: 'Notifications', description: 'Alertes et notifications automatiques' }
                          };
                          featureInfo = demarcheFeatures[key] || featureInfo;
                        } else if (selectedApp === 'travail') {
                          const travailFeatures = {
                            candidatureEnLigne: { name: 'Candidatures en Ligne', description: 'Système de candidature dématérialisé' },
                            uploadCV: { name: 'Upload de CV', description: 'Téléchargement de CV au format PDF/DOC' },
                            notifications: { name: 'Notifications', description: 'Alertes email pour candidats et recruteurs' },
                            statistiques: { name: 'Statistiques', description: 'Tableaux de bord analytiques' },
                            filtresAvances: { name: 'Filtres Avancés', description: 'Recherche multicritères avancée' },
                            exportOffres: { name: 'Export Offres', description: 'Export PDF/Excel des offres d\'emploi' }
                          };
                          featureInfo = travailFeatures[key] || featureInfo;
                        }

                        return (
                          <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{featureInfo.name}</h4>
                              <p className="text-sm text-gray-600">{featureInfo.description}</p>
                            </div>
                            <Switch
                              checked={enabled}
                              onCheckedChange={(checked) => {
                                updateCurrentConfig({
                                  features: { ...config.features, [key]: checked }
                                });
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Configuration spéciale pour TRAVAIL.GA */}
                    {selectedApp === 'travail' && 'parametres' in config && (
                      <div className="mt-8 pt-6 border-t">
                        <h3 className="text-lg font-semibold mb-4">Paramètres Spécialisés TRAVAIL.GA</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <Label>Durée des offres (jours)</Label>
                            <Input
                              type="number"
                              value={config.parametres?.dureeOffre || 30}
                              onChange={(e) => updateCurrentConfig({
                                parametres: { ...config.parametres, dureeOffre: parseInt(e.target.value) || 30 }
                              })}
                            />
                          </div>
                          <div>
                            <Label>Taille max CV (MB)</Label>
                            <Input
                              type="number"
                              value={config.parametres?.tailleMaxCV || 5}
                              onChange={(e) => updateCurrentConfig({
                                parametres: { ...config.parametres, tailleMaxCV: parseInt(e.target.value) || 5 }
                              })}
                            />
                          </div>
                          <div>
                            <Label>Formats CV acceptés</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {(config.parametres?.formatsCV || []).map((format, index) => (
                                <Badge key={index} variant="outline">{format}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })()}
          </TabsContent>

          {/* Onglet Contenu */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion du Contenu</CardTitle>
                <CardDescription>
                  Pages, articles et contenus de l'application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Gestion de Contenu</h3>
                  <p className="text-gray-600 mb-4">
                    Fonctionnalité en cours de développement
                  </p>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter du contenu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics et Statistiques</CardTitle>
                <CardDescription>
                  Analyse de performance et métriques détaillées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Avancées</h3>
                  <p className="text-gray-600 mb-4">
                    Tableaux de bord analytiques en cours de développement
                  </p>
                  <Button variant="outline">
                    <Activity className="w-4 h-4 mr-2" />
                    Voir les métriques
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Paramètres */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres Système</CardTitle>
                  <CardDescription>
                    Configuration générale et sécurité
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Mode Maintenance</Label>
                      <p className="text-sm text-gray-600">Désactiver temporairement l'application</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Logs Détaillés</Label>
                      <p className="text-sm text-gray-600">Enregistrer les événements système</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Cache Activé</Label>
                      <p className="text-sm text-gray-600">Améliorer les performances</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export et Sauvegarde</CardTitle>
                  <CardDescription>
                    Gestion des données de configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handleExportConfig}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Exporter la Configuration
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Importer une Configuration
                  </Button>
                  <Button className="w-full" variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Réinitialiser aux Défauts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Gestion des Domaines */}
          <TabsContent value="domains" className="space-y-6">
            <DomainManagementInterface selectedApp={selectedApp} />
          </TabsContent>
        </Tabs>
        )}
      </div>
    </div>
  );
}
