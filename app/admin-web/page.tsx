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
import {
  Settings, Upload, Eye, Save, RefreshCw, Image, Menu, FileText,
  Globe, Palette, Layout, Info, Bell, Link, Users, Shield, Edit2, Trash2, Plus, Activity, CheckCircle2
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

export default function AdminWebInterface() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hasChanges, setHasChanges] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // États pour les différentes sections
  const [logoSettings, setLogoSettings] = useState({
    administrationGA: '/images/logo-administration-ga.png',
    demarcheGA: '/images/logo-demarche-ga.png',
    favicon: '/favicon.ico'
  });

  const [appSettings, setAppSettings] = useState({
    administrationGA: {
      name: 'ADMINISTRATION.GA',
      subtitle: 'République Gabonaise',
      description: 'Plateforme officielle d\'administration gabonaise',
      primaryColor: '#009E49',
      secondaryColor: '#FFD700',
      accentColor: '#3A75C4'
    },
    demarcheGA: {
      name: 'DEMARCHE.GA',
      subtitle: 'Démarches Simplifiées',
      description: 'Portail des démarches administratives gabonaises',
      primaryColor: '#1E40AF',
      secondaryColor: '#10B981',
      accentColor: '#F59E0B'
    }
  });

  const [menuItems, setMenuItems] = useState([
    { id: '1', label: 'Accueil', url: '/', icon: 'Home', visible: true, order: 1 },
    { id: '2', label: 'Utilisateurs', url: '/super-admin/utilisateurs', icon: 'Users', visible: true, order: 2 },
    { id: '3', label: 'Organismes', url: '/super-admin/organismes', icon: 'Building2', visible: true, order: 3 },
    { id: '4', label: 'Analytics', url: '/super-admin/analytics', icon: 'BarChart3', visible: true, order: 4 }
  ]);

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

  const handleSave = () => {
    // Ici on sauvegarderait les modifications
    setHasChanges(false);
    alert('✅ Modifications sauvegardées avec succès !');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (file) {
      // Ici on traiterait l'upload du fichier
      const url = URL.createObjectURL(file);
      setLogoSettings(prev => ({ ...prev, [type]: url }));
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
        logoSettings,
        appSettings,
        newsItems,
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
      logoSettings,
      appSettings,
      newsItems,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
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
              <LogoAdministrationGA width={32} height={32} />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Interface d'Administration Web</h1>
                <p className="text-sm text-gray-600">Gestion des applications ADMINISTRATION.GA & DEMARCHE.GA</p>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation des onglets */}
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Layout className="w-4 h-4" />
              <span>Tableau de Bord</span>
            </TabsTrigger>
            <TabsTrigger value="logos" className="flex items-center space-x-2">
              <Image className="w-4 h-4" />
              <span>Logos & Assets</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Apparence</span>
            </TabsTrigger>
            <TabsTrigger value="menus" className="flex items-center space-x-2">
              <Menu className="w-4 h-4" />
              <span>Menus</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Contenu</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Actualités</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Paramètres</span>
            </TabsTrigger>
          </TabsList>

          {/* Onglet Tableau de Bord */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Métriques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Applications', value: '2', description: 'ADMINISTRATION.GA, DEMARCHE.GA', icon: Globe, color: 'bg-blue-500' },
                { title: 'Logos Actifs', value: '3', description: 'Assets visuels configurés', icon: Image, color: 'bg-green-500' },
                { title: 'Pages de Contenu', value: '12', description: 'Pages et articles publiés', icon: FileText, color: 'bg-purple-500' },
                { title: 'Actualités', value: '5', description: 'News en cours', icon: Bell, color: 'bg-orange-500' }
              ].map((metric) => (
                <Card key={metric.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                        <p className="text-xs text-gray-500">{metric.description}</p>
                      </div>
                      <div className={`p-3 rounded-full ${metric.color}`}>
                        <metric.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Actions Rapides */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Actions Rapides
                  </CardTitle>
                  <CardDescription>
                    Accès direct aux fonctionnalités les plus utilisées
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { title: 'Changer Logo', tab: 'logos', icon: Image, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
                      { title: 'Modifier Menus', tab: 'menus', icon: Menu, color: 'bg-green-100 text-green-700 hover:bg-green-200' },
                      { title: 'Nouvelle Actualité', tab: 'news', icon: Bell, color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
                      { title: 'Paramètres', tab: 'settings', icon: Settings, color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' }
                    ].map((action) => (
                      <Button
                        key={action.title}
                        variant="outline"
                        className={`h-20 flex flex-col gap-2 ${action.color} border-0`}
                        onClick={() => setActiveTab(action.tab)}
                      >
                        <action.icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{action.title}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Statut du Système */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Statut du Système
                  </CardTitle>
                  <CardDescription>
                    État de santé des applications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { app: 'ADMINISTRATION.GA', status: 'En ligne', uptime: '99.9%', color: 'bg-green-100 text-green-800' },
                    { app: 'DEMARCHE.GA', status: 'En ligne', uptime: '99.8%', color: 'bg-green-100 text-green-800' }
                  ].map((app) => (
                    <div key={app.app} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">{app.app}</p>
                        <p className="text-sm text-gray-600">Uptime: {app.uptime}</p>
                      </div>
                      <Badge className={app.color}>
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Activité Récente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Activité Récente
                </CardTitle>
                <CardDescription>
                  Dernières modifications apportées aux applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'Logo ADMINISTRATION.GA mis à jour', user: 'Super Admin', time: 'Il y a 2 heures', type: 'logo' },
                    { action: 'Nouveau menu ajouté à DEMARCHE.GA', user: 'Super Admin', time: 'Il y a 1 jour', type: 'menu' },
                    { action: 'Actualité publiée sur la page d\'accueil', user: 'Super Admin', time: 'Il y a 2 jours', type: 'content' },
                    { action: 'Paramètres de sécurité modifiés', user: 'Super Admin', time: 'Il y a 3 jours', type: 'system' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'logo' ? 'bg-blue-100' :
                        activity.type === 'menu' ? 'bg-green-100' :
                        activity.type === 'content' ? 'bg-orange-100' : 'bg-purple-100'
                      }`}>
                        {activity.type === 'logo' && <Image className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'menu' && <Menu className="w-4 h-4 text-green-600" />}
                        {activity.type === 'content' && <FileText className="w-4 h-4 text-orange-600" />}
                        {activity.type === 'system' && <Shield className="w-4 h-4 text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">Par {activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Logos & Assets */}
          <TabsContent value="logos" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ADMINISTRATION.GA */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Image className="w-5 h-5" />
                    <span>ADMINISTRATION.GA</span>
                  </CardTitle>
                  <CardDescription>
                    Gestion des logos et assets visuels pour l'application d'administration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Logo principal */}
                  <div>
                    <Label>Logo Principal</Label>
                    <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="flex items-center justify-center space-x-4">
                        <LogoAdministrationGA width={48} height={48} />
                        <div className="text-sm text-gray-600">
                          <p>Format: PNG, SVG</p>
                          <p>Taille recommandée: 512x512px</p>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-center">
                        <Label htmlFor="logo-admin" className="cursor-pointer">
                          <Button variant="outline" size="sm" asChild>
                            <span>
                              <Upload className="w-4 h-4 mr-2" />
                              Changer le logo
                            </span>
                          </Button>
                        </Label>
                        <Input
                          id="logo-admin"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'administrationGA')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Favicon */}
                  <div>
                    <Label>Favicon</Label>
                    <div className="mt-2 flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <Image className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="favicon-admin" className="cursor-pointer">
                          <Button variant="outline" size="sm" asChild>
                            <span>Changer favicon</span>
                          </Button>
                        </Label>
                        <Input
                          id="favicon-admin"
                          type="file"
                          accept=".ico,.png"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'favicon')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Couleurs du thème */}
                  <div className="space-y-3">
                    <Label>Couleurs du Thème</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Primaire</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={appSettings.administrationGA.primaryColor}
                            onChange={(e) => {
                              setAppSettings(prev => ({
                                ...prev,
                                administrationGA: {
                                  ...prev.administrationGA,
                                  primaryColor: e.target.value
                                }
                              }));
                              setHasChanges(true);
                            }}
                            className="w-8 h-8 rounded border"
                          />
                          <span className="text-xs font-mono">{appSettings.administrationGA.primaryColor}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Secondaire</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={appSettings.administrationGA.secondaryColor}
                            onChange={(e) => {
                              setAppSettings(prev => ({
                                ...prev,
                                administrationGA: {
                                  ...prev.administrationGA,
                                  secondaryColor: e.target.value
                                }
                              }));
                              setHasChanges(true);
                            }}
                            className="w-8 h-8 rounded border"
                          />
                          <span className="text-xs font-mono">{appSettings.administrationGA.secondaryColor}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Accent</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={appSettings.administrationGA.accentColor}
                            onChange={(e) => {
                              setAppSettings(prev => ({
                                ...prev,
                                administrationGA: {
                                  ...prev.administrationGA,
                                  accentColor: e.target.value
                                }
                              }));
                              setHasChanges(true);
                            }}
                            className="w-8 h-8 rounded border"
                          />
                          <span className="text-xs font-mono">{appSettings.administrationGA.accentColor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* DEMARCHE.GA */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>DEMARCHE.GA</span>
                  </CardTitle>
                  <CardDescription>
                    Gestion des logos et assets visuels pour l'application citoyenne
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Logo principal DEMARCHE.GA */}
                  <div>
                    <Label>Logo Principal</Label>
                    <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="flex items-center justify-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Globe className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Format: PNG, SVG</p>
                          <p>Taille recommandée: 512x512px</p>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-center">
                        <Label htmlFor="logo-demarche" className="cursor-pointer">
                          <Button variant="outline" size="sm" asChild>
                            <span>
                              <Upload className="w-4 h-4 mr-2" />
                              Changer le logo
                            </span>
                          </Button>
                        </Label>
                        <Input
                          id="logo-demarche"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'demarcheGA')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Couleurs du thème DEMARCHE.GA */}
                  <div className="space-y-3">
                    <Label>Couleurs du Thème</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Primaire</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={appSettings.demarcheGA.primaryColor}
                            onChange={(e) => {
                              setAppSettings(prev => ({
                                ...prev,
                                demarcheGA: {
                                  ...prev.demarcheGA,
                                  primaryColor: e.target.value
                                }
                              }));
                              setHasChanges(true);
                            }}
                            className="w-8 h-8 rounded border"
                          />
                          <span className="text-xs font-mono">{appSettings.demarcheGA.primaryColor}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Secondaire</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={appSettings.demarcheGA.secondaryColor}
                            onChange={(e) => {
                              setAppSettings(prev => ({
                                ...prev,
                                demarcheGA: {
                                  ...prev.demarcheGA,
                                  secondaryColor: e.target.value
                                }
                              }));
                              setHasChanges(true);
                            }}
                            className="w-8 h-8 rounded border"
                          />
                          <span className="text-xs font-mono">{appSettings.demarcheGA.secondaryColor}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Accent</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={appSettings.demarcheGA.accentColor}
                            onChange={(e) => {
                              setAppSettings(prev => ({
                                ...prev,
                                demarcheGA: {
                                  ...prev.demarcheGA,
                                  accentColor: e.target.value
                                }
                              }));
                              setHasChanges(true);
                            }}
                            className="w-8 h-8 rounded border"
                          />
                          <span className="text-xs font-mono">{appSettings.demarcheGA.accentColor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Aperçu des logos */}
            <Card>
              <CardHeader>
                <CardTitle>Aperçu des Modifications</CardTitle>
                <CardDescription>
                  Visualisation en temps réel des changements apportés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">ADMINISTRATION.GA</h4>
                    <div
                      className="p-4 rounded-lg border"
                      style={{
                        background: `linear-gradient(135deg, ${appSettings.administrationGA.primaryColor}, ${appSettings.administrationGA.secondaryColor}, ${appSettings.administrationGA.accentColor})`
                      }}
                    >
                      <div className="flex items-center space-x-3 text-white">
                        <LogoAdministrationGA width={32} height={32} />
                        <div>
                          <div className="font-bold">{appSettings.administrationGA.name}</div>
                          <div className="text-sm opacity-90">{appSettings.administrationGA.subtitle}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">DEMARCHE.GA</h4>
                    <div
                      className="p-4 rounded-lg border"
                      style={{
                        background: `linear-gradient(135deg, ${appSettings.demarcheGA.primaryColor}, ${appSettings.demarcheGA.secondaryColor}, ${appSettings.demarcheGA.accentColor})`
                      }}
                    >
                      <div className="flex items-center space-x-3 text-white">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold">{appSettings.demarcheGA.name}</div>
                          <div className="text-sm opacity-90">{appSettings.demarcheGA.subtitle}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Apparence */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres d'Apparence</CardTitle>
                <CardDescription>
                  Configuration des thèmes et styles visuels des applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Configuration ADMINISTRATION.GA */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">ADMINISTRATION.GA</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nom de l'application</Label>
                      <Input
                        value={appSettings.administrationGA.name}
                        onChange={(e) => {
                          setAppSettings(prev => ({
                            ...prev,
                            administrationGA: { ...prev.administrationGA, name: e.target.value }
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Sous-titre</Label>
                      <Input
                        value={appSettings.administrationGA.subtitle}
                        onChange={(e) => {
                          setAppSettings(prev => ({
                            ...prev,
                            administrationGA: { ...prev.administrationGA, subtitle: e.target.value }
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        value={appSettings.administrationGA.description}
                        onChange={(e) => {
                          setAppSettings(prev => ({
                            ...prev,
                            administrationGA: { ...prev.administrationGA, description: e.target.value }
                          }));
                          setHasChanges(true);
                        }}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Configuration DEMARCHE.GA */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">DEMARCHE.GA</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nom de l'application</Label>
                      <Input
                        value={appSettings.demarcheGA.name}
                        onChange={(e) => {
                          setAppSettings(prev => ({
                            ...prev,
                            demarcheGA: { ...prev.demarcheGA, name: e.target.value }
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Sous-titre</Label>
                      <Input
                        value={appSettings.demarcheGA.subtitle}
                        onChange={(e) => {
                          setAppSettings(prev => ({
                            ...prev,
                            demarcheGA: { ...prev.demarcheGA, subtitle: e.target.value }
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        value={appSettings.demarcheGA.description}
                        onChange={(e) => {
                          setAppSettings(prev => ({
                            ...prev,
                            demarcheGA: { ...prev.demarcheGA, description: e.target.value }
                          }));
                          setHasChanges(true);
                        }}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Menus */}
          <TabsContent value="menus">
            <MenuManager onSave={(menus) => { setHasChanges(true); console.log('Menus saved:', menus); }} />
          </TabsContent>

          {/* Onglet Contenu */}
          <TabsContent value="content">
            <ContentManager onSave={(content) => { setHasChanges(true); console.log('Content saved:', content); }} />
          </TabsContent>

          {/* Onglet Actualités */}
          <TabsContent value="news" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Gestion des Actualités</span>
                </CardTitle>
                <CardDescription>
                  Publier et gérer les actualités et annonces pour les applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {newsItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-1">{item.content}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant={item.published ? 'default' : 'secondary'}>
                            {item.published ? 'Publié' : 'Brouillon'}
                          </Badge>
                          <Badge variant="outline">{item.category}</Badge>
                          <span className="text-xs text-gray-500">{item.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une actualité
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
                  <CardTitle>Paramètres Généraux</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Mode Maintenance</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch />
                      <span className="text-sm text-gray-600">Activer le mode maintenance</span>
                    </div>
                  </div>
                  <div>
                    <Label>Notifications Email</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch defaultChecked />
                      <span className="text-sm text-gray-600">Envoyer les notifications par email</span>
                    </div>
                  </div>
                  <div>
                    <Label>Analytics</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch defaultChecked />
                      <span className="text-sm text-gray-600">Activer le tracking analytics</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sécurité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Authentification 2FA</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch />
                      <span className="text-sm text-gray-600">Exiger la double authentification</span>
                    </div>
                  </div>
                  <div>
                    <Label>Session Timeout</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="30">30 minutes</option>
                      <option value="60" defaultChecked>1 heure</option>
                      <option value="120">2 heures</option>
                      <option value="240">4 heures</option>
                    </select>
                  </div>
                  <div>
                    <Label>Logs de Sécurité</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Switch defaultChecked />
                      <span className="text-sm text-gray-600">Enregistrer les événements de sécurité</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
