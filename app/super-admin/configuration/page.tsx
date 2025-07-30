'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { ConfigurationErrorDisplay } from '@/components/configuration/configuration-error-display';
import { ConfigurationImportExport } from '@/components/configuration/configuration-import-export';
import { useConfiguration } from '@/hooks/use-configuration';
import {
  Settings,
  Save,
  RefreshCw,
  Mail,
  Smartphone,
  Globe,
  Database,
  Server,
  Shield,
  Clock,
  FileText,
  Users,
  Building2,
  Zap,
  Lock,
  Eye,
  EyeOff,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle,
  Bell,
  TestTube,
  History
} from 'lucide-react';

export default function SuperAdminConfigurationPage() {
  const {
    config,
    isLoading,
    isSaving,
    isExporting,
    isImporting,
    unsavedChanges,
    errors,
    lastSaved,
    hasErrors,
    hasCriticalErrors,
    isReady,
    updateConfig,
    saveConfiguration,
    exportConfiguration,
    importConfiguration,
    resetToDefaults,
    testConfiguration,
    confirmUnsavedChanges
  } = useConfiguration();

  const [activeTab, setActiveTab] = useState('general');
  const [showPasswords, setShowPasswords] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);

  const handleTabChange = (value: string) => {
    if (unsavedChanges && !confirmUnsavedChanges()) {
      return;
    }
    setActiveTab(value);
  };

  const handleSave = async () => {
    const result = await saveConfiguration();
    return result;
  };

  const handleReset = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser la configuration aux valeurs par défaut ?')) {
      await resetToDefaults();
    }
  };

  const handleTest = async () => {
    await testConfiguration();
  };

  if (isLoading || !isReady || !config || !config.general) {
    return (
      <AuthenticatedLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="h-8 w-8 text-blue-500" />
              Configuration Système
            </h1>
            <p className="text-muted-foreground">
              Paramètres globaux et configuration de la plateforme
            </p>
            {lastSaved && (
              <p className="text-xs text-muted-foreground mt-1">
                <History className="h-3 w-3 inline mr-1" />
                Dernière sauvegarde: {lastSaved.toLocaleString('fr-FR')}
              </p>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {unsavedChanges && (
              <Badge variant="outline" className="text-orange-600 border-orange-300">
                <Clock className="h-3 w-3 mr-1" />
                Modifications non sauvegardées
              </Badge>
            )}
            {hasErrors && (
              <Badge variant={hasCriticalErrors ? "destructive" : "outline"} className={hasCriticalErrors ? "" : "text-yellow-600 border-yellow-300"}>
                <AlertTriangle className="h-3 w-3 mr-1" />
                {hasCriticalErrors ? "Erreurs critiques" : "Avertissements"}
              </Badge>
            )}
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={isSaving}
            >
              <TestTube className="mr-2 h-4 w-4" />
              Tester
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowImportExport(!showImportExport)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import/Export
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isSaving}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Réinitialiser
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || hasCriticalErrors}
              className="min-w-[120px]"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sauvegarde...</span>
                </div>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Affichage des erreurs */}
        {hasErrors && (
          <ConfigurationErrorDisplay
            errors={errors}
            onFixError={(error) => {
              // Naviguer vers l'onglet approprié
              setActiveTab(error.section);
            }}
          />
        )}

        {/* Section Import/Export */}
        {showImportExport && (
          <ConfigurationImportExport
            onExport={exportConfiguration}
            onImport={importConfiguration}
            isExporting={isExporting}
            isImporting={isImporting}
          />
        )}

        {/* Onglets de configuration */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="integrations">Intégrations</TabsTrigger>
            <TabsTrigger value="workflow">Workflows</TabsTrigger>
          </TabsList>

          {/* Configuration générale */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de base</CardTitle>
                  <CardDescription>Configuration principale du site</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="siteName">Nom du site</Label>
                    <Input
                      id="siteName"
                      value={config.general?.siteName || ''}
                      onChange={(e) => updateConfig('general', 'siteName', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="siteDescription">Description</Label>
                    <Textarea
                      id="siteDescription"
                      value={config.general?.siteDescription || ''}
                      onChange={(e) => updateConfig('general', 'siteDescription', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="defaultLanguage">Langue par défaut</Label>
                    <Select
                      value={config.general?.defaultLanguage || 'fr'}
                      onValueChange={(value) => updateConfig('general', 'defaultLanguage', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">Anglais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select
                      value={config.general?.timezone || 'Africa/Libreville'}
                      onValueChange={(value) => updateConfig('general', 'timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Libreville">Africa/Libreville</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mode de fonctionnement</CardTitle>
                  <CardDescription>Contrôles d'accès et maintenance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Mode maintenance</Label>
                      <p className="text-sm text-muted-foreground">
                        Désactive l'accès public au site
                      </p>
                    </div>
                    <Switch
                      checked={config.general?.maintenanceMode || false}
                      onCheckedChange={(checked) => updateConfig('general', 'maintenanceMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Inscription ouverte</Label>
                      <p className="text-sm text-muted-foreground">
                        Permet aux nouveaux utilisateurs de s'inscrire
                      </p>
                    </div>
                    <Switch
                      checked={config.general?.allowRegistration || false}
                      onCheckedChange={(checked) => updateConfig('general', 'allowRegistration', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configuration des notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Canaux de notification</CardTitle>
                  <CardDescription>Activation des différents moyens de communication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-500" />
                      <div>
                        <Label>Email</Label>
                        <p className="text-sm text-muted-foreground">Notifications par email</p>
                      </div>
                    </div>
                    <Switch
                      checked={config.notifications?.emailEnabled || false}
                      onCheckedChange={(checked) => updateConfig('notifications', 'emailEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-green-500" />
                      <div>
                        <Label>SMS</Label>
                        <p className="text-sm text-muted-foreground">Messages texte</p>
                      </div>
                    </div>
                    <Switch
                      checked={config.notifications?.smsEnabled || false}
                      onCheckedChange={(checked) => updateConfig('notifications', 'smsEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-purple-500" />
                      <div>
                        <Label>Push</Label>
                        <p className="text-sm text-muted-foreground">Notifications push web</p>
                      </div>
                    </div>
                    <Switch
                      checked={config.notifications?.pushEnabled || false}
                      onCheckedChange={(checked) => updateConfig('notifications', 'pushEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-green-600" />
                      <div>
                        <Label>WhatsApp</Label>
                        <p className="text-sm text-muted-foreground">Messages WhatsApp Business</p>
                      </div>
                    </div>
                    <Switch
                      checked={config.notifications?.whatsappEnabled || false}
                      onCheckedChange={(checked) => updateConfig('notifications', 'whatsappEnabled', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configuration Email</CardTitle>
                  <CardDescription>Paramètres SMTP et templates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="smtpHost">Serveur SMTP</Label>
                    <Input
                      id="smtpHost"
                      value={config.notifications?.smtpHost || ''}
                      onChange={(e) => updateConfig('notifications', 'smtpHost', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtpPort">Port</Label>
                      <Input
                        id="smtpPort"
                        value={config.notifications?.smtpPort || ''}
                        onChange={(e) => updateConfig('notifications', 'smtpPort', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpUser">Utilisateur</Label>
                      <Input
                        id="smtpUser"
                        value={config.notifications?.smtpUser || ''}
                        onChange={(e) => updateConfig('notifications', 'smtpUser', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="smtpPassword">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="smtpPassword"
                        type={showPasswords ? 'text' : 'password'}
                        value={config.notifications?.smtpPassword || ''}
                        onChange={(e) => updateConfig('notifications', 'smtpPassword', e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPasswords(!showPasswords)}
                      >
                        {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="smsProvider">Fournisseur SMS</Label>
                    <Select
                      value={config.notifications?.smsProvider || 'Airtel'}
                      onValueChange={(value) => updateConfig('notifications', 'smsProvider', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Airtel">Airtel Money</SelectItem>
                        <SelectItem value="Moov">Moov Money</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configuration sécurité */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Politique des mots de passe</CardTitle>
                  <CardDescription>Règles de sécurité pour les mots de passe</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="passwordMinLength">Longueur minimale</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={config.security?.passwordMinLength || 8}
                      onChange={(e) => updateConfig('security', 'passwordMinLength', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Majuscules requises</Label>
                      <Switch
                        checked={config.security?.passwordRequireUppercase || false}
                        onCheckedChange={(checked) => updateConfig('security', 'passwordRequireUppercase', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Chiffres requis</Label>
                      <Switch
                        checked={config.security?.passwordRequireNumbers || false}
                        onCheckedChange={(checked) => updateConfig('security', 'passwordRequireNumbers', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Symboles requis</Label>
                      <Switch
                        checked={config.security?.passwordRequireSymbols || false}
                        onCheckedChange={(checked) => updateConfig('security', 'passwordRequireSymbols', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sécurité des sessions</CardTitle>
                  <CardDescription>Gestion des connexions et tentatives</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="sessionTimeout">Expiration session (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={config.security?.sessionTimeout || 30}
                      onChange={(e) => updateConfig('security', 'sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxLoginAttempts">Tentatives max</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={config.security?.maxLoginAttempts || 5}
                      onChange={(e) => updateConfig('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="lockoutDuration">Durée blocage (minutes)</Label>
                    <Input
                      id="lockoutDuration"
                      type="number"
                      value={config.security?.lockoutDuration || 15}
                      onChange={(e) => updateConfig('security', 'lockoutDuration', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Authentification 2FA</Label>
                      <p className="text-sm text-muted-foreground">Double authentification</p>
                    </div>
                    <Switch
                      checked={config.security?.twoFactorEnabled || false}
                      onCheckedChange={(checked) => updateConfig('security', 'twoFactorEnabled', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configuration performance */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cache et optimisation</CardTitle>
                  <CardDescription>Paramètres de performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Cache activé</Label>
                      <p className="text-sm text-muted-foreground">Cache en mémoire des pages</p>
                    </div>
                    <Switch
                      checked={config.performance?.cacheEnabled || false}
                      onCheckedChange={(checked) => updateConfig('performance', 'cacheEnabled', checked)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cacheDuration">Durée cache (secondes)</Label>
                    <Input
                      id="cacheDuration"
                      type="number"
                      value={config.performance?.cacheDuration || 3600}
                      onChange={(e) => updateConfig('performance', 'cacheDuration', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compression</Label>
                      <p className="text-sm text-muted-foreground">Compression Gzip des réponses</p>
                    </div>
                    <Switch
                      checked={config.performance?.compressionEnabled || false}
                      onCheckedChange={(checked) => updateConfig('performance', 'compressionEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>CDN activé</Label>
                      <p className="text-sm text-muted-foreground">Réseau de distribution de contenu</p>
                    </div>
                    <Switch
                      checked={config.performance?.cdnEnabled || false}
                      onCheckedChange={(checked) => updateConfig('performance', 'cdnEnabled', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fichiers et stockage</CardTitle>
                  <CardDescription>Gestion des uploads et sauvegardes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="maxFileSize">Taille max fichier (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      value={config.performance?.maxFileSize || 10}
                      onChange={(e) => updateConfig('performance', 'maxFileSize', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="allowedFileTypes">Types autorisés</Label>
                    <Input
                      id="allowedFileTypes"
                      value={config.performance?.allowedFileTypes?.join(', ') || 'pdf, jpg, png, docx'}
                      onChange={(e) => updateConfig('performance', 'allowedFileTypes', e.target.value.split(', '))}
                      placeholder="pdf, jpg, png, docx"
                    />
                  </div>

                  <div>
                    <Label htmlFor="backupSchedule">Fréquence sauvegarde</Label>
                    <Select
                      value={config.performance?.databaseBackupSchedule || 'daily'}
                      onValueChange={(value) => updateConfig('performance', 'databaseBackupSchedule', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Toutes les heures</SelectItem>
                        <SelectItem value="daily">Quotidienne</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="logRetention">Rétention logs (jours)</Label>
                    <Input
                      id="logRetention"
                      type="number"
                      value={config.performance?.logRetentionDays || 30}
                      onChange={(e) => updateConfig('performance', 'logRetentionDays', parseInt(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configuration intégrations */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Services externes</CardTitle>
                  <CardDescription>Intégrations avec des services tiers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="paymentGateway">Passerelle de paiement</Label>
                    <Select
                      value={config.integrations?.paymentGateway || 'airtel_money'}
                      onValueChange={(value) => updateConfig('integrations', 'paymentGateway', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="airtel_money">Airtel Money</SelectItem>
                        <SelectItem value="moov_money">Moov Money</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="documentSignature">Signature électronique</Label>
                    <Select
                      value={config.integrations?.documentSignature || 'internal'}
                      onValueChange={(value) => updateConfig('integrations', 'documentSignature', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="docusign">DocuSign</SelectItem>
                        <SelectItem value="adobe_sign">Adobe Sign</SelectItem>
                        <SelectItem value="internal">Système interne</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="identityVerification">Vérification d'identité</Label>
                    <Select
                      value={config.integrations?.identityVerification || 'gabonese_id'}
                      onValueChange={(value) => updateConfig('integrations', 'identityVerification', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gabonese_id">CNI Gabonaise</SelectItem>
                        <SelectItem value="biometric">Biométrie</SelectItem>
                        <SelectItem value="manual">Vérification manuelle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Analytics et monitoring</CardTitle>
                  <CardDescription>Outils de suivi et d'analyse</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Analytics activées</Label>
                      <p className="text-sm text-muted-foreground">Collecte de données d'usage</p>
                    </div>
                    <Switch
                      checked={config.integrations?.analyticsEnabled || false}
                      onCheckedChange={(checked) => updateConfig('integrations', 'analyticsEnabled', checked)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="analyticsProvider">Fournisseur analytics</Label>
                    <Select
                      value={config.integrations?.analyticsProvider || 'internal'}
                      onValueChange={(value) => updateConfig('integrations', 'analyticsProvider', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">Système interne</SelectItem>
                        <SelectItem value="google_analytics">Google Analytics</SelectItem>
                        <SelectItem value="matomo">Matomo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="mapProvider">Fournisseur de cartes</Label>
                    <Select
                      value={config.integrations?.mapProvider || 'openstreetmap'}
                      onValueChange={(value) => updateConfig('integrations', 'mapProvider', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openstreetmap">OpenStreetMap</SelectItem>
                        <SelectItem value="google_maps">Google Maps</SelectItem>
                        <SelectItem value="mapbox">Mapbox</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configuration workflows */}
          <TabsContent value="workflow" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Automatisation</CardTitle>
                  <CardDescription>Règles et processus automatiques</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Attribution automatique</Label>
                      <p className="text-sm text-muted-foreground">Assigner les demandes automatiquement</p>
                    </div>
                    <Switch
                      checked={config.workflow?.autoAssignment || false}
                      onCheckedChange={(checked) => updateConfig('workflow', 'autoAssignment', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Escalade activée</Label>
                      <p className="text-sm text-muted-foreground">Escalader les demandes en retard</p>
                    </div>
                    <Switch
                      checked={config.workflow?.escalationEnabled || false}
                      onCheckedChange={(checked) => updateConfig('workflow', 'escalationEnabled', checked)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="escalationThreshold">Seuil escalade (heures)</Label>
                    <Input
                      id="escalationThreshold"
                      type="number"
                      value={config.workflow?.escalationThreshold || 24}
                      onChange={(e) => updateConfig('workflow', 'escalationThreshold', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="reminderSchedule">Rappels (heures)</Label>
                    <Input
                      id="reminderSchedule"
                      type="number"
                      value={config.workflow?.reminderSchedule || 12}
                      onChange={(e) => updateConfig('workflow', 'reminderSchedule', parseInt(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Validation et contrôle</CardTitle>
                  <CardDescription>Processus d'approbation et de qualité</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Workflow d'approbation</Label>
                      <p className="text-sm text-muted-foreground">Validation hiérarchique requise</p>
                    </div>
                    <Switch
                      checked={config.workflow?.approvalWorkflow || false}
                      onCheckedChange={(checked) => updateConfig('workflow', 'approvalWorkflow', checked)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="documentValidation">Validation documents</Label>
                    <Select
                      value={config.workflow?.documentValidation || 'manual'}
                      onValueChange={(value) => updateConfig('workflow', 'documentValidation', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manuelle</SelectItem>
                        <SelectItem value="automatic">Automatique</SelectItem>
                        <SelectItem value="hybrid">Hybride</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Contrôle qualité</Label>
                      <p className="text-sm text-muted-foreground">Vérification aléatoire des traitements</p>
                    </div>
                    <Switch
                      checked={config.workflow?.qualityControl || false}
                      onCheckedChange={(checked) => updateConfig('workflow', 'qualityControl', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* État de la configuration */}
        <Card className={`transition-colors ${
          unsavedChanges ? 'border-orange-200' :
          hasErrors ? 'border-red-200' :
          'border-green-200'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold flex items-center gap-2">
                  {unsavedChanges ? (
                    <Clock className="h-4 w-4 text-orange-500" />
                  ) : hasErrors ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  État de la configuration
                </h3>
                <p className="text-sm text-muted-foreground">
                  {unsavedChanges
                    ? 'Modifications en attente de sauvegarde'
                    : hasErrors
                    ? 'Configuration avec avertissements'
                    : 'Configuration synchronisée et fonctionnelle'
                  }
                </p>
                {lastSaved && !unsavedChanges && (
                  <p className="text-xs text-muted-foreground">
                    Dernière synchronisation: {lastSaved.toLocaleString('fr-FR')}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={exportConfiguration}
                  disabled={isExporting || isSaving}
                >
                  {isExporting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                      <span>Export...</span>
                    </div>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Exporter
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || hasCriticalErrors || (!unsavedChanges && !hasErrors)}
                  className="min-w-[160px]"
                >
                  {isSaving ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sauvegarde...</span>
                    </div>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {unsavedChanges
                        ? 'Sauvegarder les modifications'
                        : 'Configuration à jour'
                      }
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
