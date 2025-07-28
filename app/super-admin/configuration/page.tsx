/* @ts-nocheck */
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
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
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
  Bell
} from 'lucide-react';

// Configuration mock
const initialConfig = {
  general: {
    siteName: 'Administration.GA',
    siteDescription: 'Plateforme numérique de l\'administration gabonaise',
    maintenanceMode: false,
    allowRegistration: true,
    defaultLanguage: 'fr',
    timezone: 'Africa/Libreville'
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: true,
    whatsappEnabled: false,
    defaultEmailTemplate: 'modern',
    smtpHost: 'smtp.admin.ga',
    smtpPort: '587',
    smtpUser: 'noreply@admin.ga',
    smtpPassword: '••••••••',
    smsProvider: 'Airtel',
    smsApiKey: '••••••••'
  },
  security: {
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    twoFactorEnabled: false,
    ipWhitelist: [],
    securityHeaders: true
  },
  performance: {
    cacheEnabled: true,
    cacheDuration: 3600,
    compressionEnabled: true,
    cdnEnabled: false,
    cdnUrl: '',
    maxFileSize: 10,
    allowedFileTypes: ['pdf', 'jpg', 'png', 'docx'],
    databaseBackupSchedule: 'daily',
    logRetentionDays: 30
  },
  integrations: {
    analyticsEnabled: true,
    analyticsProvider: 'internal',
    paymentGateway: 'airtel_money',
    documentSignature: 'docusign',
    identityVerification: 'gabonese_id',
    mapProvider: 'openstreetmap',
    videoConferencing: 'zoom'
  },
  workflow: {
    autoAssignment: true,
    escalationEnabled: true,
    escalationThreshold: 48,
    reminderSchedule: 24,
    approvalWorkflow: true,
    documentValidation: 'manual',
    qualityControl: true
  }
};

export default function SuperAdminConfigurationPage() {
  const [config, setConfig] = useState(initialConfig);
  const [activeTab, setActiveTab] = useState('general');
  const [showPasswords, setShowPasswords] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const updateConfig = (section, key, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setUnsavedChanges(true);
  };

  const saveConfiguration = () => {
    console.log('Sauvegarde de la configuration:', config);
    setUnsavedChanges(false);
    // Ici on ferait l'appel API
  };

  const resetToDefaults = () => {
    setConfig(initialConfig);
    setUnsavedChanges(true);
  };

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
          </div>
          <div className="flex gap-2">
            {unsavedChanges && (
              <Badge variant="outline" className="text-orange-600">
                Modifications non sauvegardées
              </Badge>
            )}
            <Button variant="outline" onClick={resetToDefaults}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Réinitialiser
            </Button>
            <Button onClick={saveConfiguration}>
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder
            </Button>
          </div>
        </div>

        {/* Onglets de configuration */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                      value={config.general.siteName}
                      onChange={(e) => updateConfig('general', 'siteName', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="siteDescription">Description</Label>
                    <Textarea
                      id="siteDescription"
                      value={config.general.siteDescription}
                      onChange={(e) => updateConfig('general', 'siteDescription', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="defaultLanguage">Langue par défaut</Label>
                    <Select 
                      value={config.general.defaultLanguage} 
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
                      value={config.general.timezone} 
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
                      checked={config.general.maintenanceMode}
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
                      checked={config.general.allowRegistration}
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
                      checked={config.notifications.emailEnabled}
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
                      checked={config.notifications.smsEnabled}
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
                      checked={config.notifications.pushEnabled}
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
                      checked={config.notifications.whatsappEnabled}
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
                      value={config.notifications.smtpHost}
                      onChange={(e) => updateConfig('notifications', 'smtpHost', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtpPort">Port</Label>
                      <Input
                        id="smtpPort"
                        value={config.notifications.smtpPort}
                        onChange={(e) => updateConfig('notifications', 'smtpPort', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpUser">Utilisateur</Label>
                      <Input
                        id="smtpUser"
                        value={config.notifications.smtpUser}
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
                        value={config.notifications.smtpPassword}
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
                      value={config.notifications.smsProvider} 
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
                      value={config.security.passwordMinLength}
                      onChange={(e) => updateConfig('security', 'passwordMinLength', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Majuscules requises</Label>
                      <Switch
                        checked={config.security.passwordRequireUppercase}
                        onCheckedChange={(checked) => updateConfig('security', 'passwordRequireUppercase', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Chiffres requis</Label>
                      <Switch
                        checked={config.security.passwordRequireNumbers}
                        onCheckedChange={(checked) => updateConfig('security', 'passwordRequireNumbers', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Symboles requis</Label>
                      <Switch
                        checked={config.security.passwordRequireSymbols}
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
                      value={config.security.sessionTimeout}
                      onChange={(e) => updateConfig('security', 'sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxLoginAttempts">Tentatives max</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={config.security.maxLoginAttempts}
                      onChange={(e) => updateConfig('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="lockoutDuration">Durée blocage (minutes)</Label>
                    <Input
                      id="lockoutDuration"
                      type="number"
                      value={config.security.lockoutDuration}
                      onChange={(e) => updateConfig('security', 'lockoutDuration', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Authentification 2FA</Label>
                      <p className="text-sm text-muted-foreground">Double authentification</p>
                    </div>
                    <Switch
                      checked={config.security.twoFactorEnabled}
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
                      checked={config.performance.cacheEnabled}
                      onCheckedChange={(checked) => updateConfig('performance', 'cacheEnabled', checked)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cacheDuration">Durée cache (secondes)</Label>
                    <Input
                      id="cacheDuration"
                      type="number"
                      value={config.performance.cacheDuration}
                      onChange={(e) => updateConfig('performance', 'cacheDuration', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compression</Label>
                      <p className="text-sm text-muted-foreground">Compression Gzip des réponses</p>
                    </div>
                    <Switch
                      checked={config.performance.compressionEnabled}
                      onCheckedChange={(checked) => updateConfig('performance', 'compressionEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>CDN activé</Label>
                      <p className="text-sm text-muted-foreground">Réseau de distribution de contenu</p>
                    </div>
                    <Switch
                      checked={config.performance.cdnEnabled}
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
                      value={config.performance.maxFileSize}
                      onChange={(e) => updateConfig('performance', 'maxFileSize', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="allowedFileTypes">Types autorisés</Label>
                    <Input
                      id="allowedFileTypes"
                      value={config.performance.allowedFileTypes.join(', ')}
                      onChange={(e) => updateConfig('performance', 'allowedFileTypes', e.target.value.split(', '))}
                      placeholder="pdf, jpg, png, docx"
                    />
                  </div>

                  <div>
                    <Label htmlFor="backupSchedule">Fréquence sauvegarde</Label>
                    <Select 
                      value={config.performance.databaseBackupSchedule} 
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
                      value={config.performance.logRetentionDays}
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
                      value={config.integrations.paymentGateway} 
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
                      value={config.integrations.documentSignature} 
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
                      value={config.integrations.identityVerification} 
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
                      checked={config.integrations.analyticsEnabled}
                      onCheckedChange={(checked) => updateConfig('integrations', 'analyticsEnabled', checked)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="analyticsProvider">Fournisseur analytics</Label>
                    <Select 
                      value={config.integrations.analyticsProvider} 
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
                      value={config.integrations.mapProvider} 
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
                      checked={config.workflow.autoAssignment}
                      onCheckedChange={(checked) => updateConfig('workflow', 'autoAssignment', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Escalade activée</Label>
                      <p className="text-sm text-muted-foreground">Escalader les demandes en retard</p>
                    </div>
                    <Switch
                      checked={config.workflow.escalationEnabled}
                      onCheckedChange={(checked) => updateConfig('workflow', 'escalationEnabled', checked)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="escalationThreshold">Seuil escalade (heures)</Label>
                    <Input
                      id="escalationThreshold"
                      type="number"
                      value={config.workflow.escalationThreshold}
                      onChange={(e) => updateConfig('workflow', 'escalationThreshold', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="reminderSchedule">Rappels (heures)</Label>
                    <Input
                      id="reminderSchedule"
                      type="number"
                      value={config.workflow.reminderSchedule}
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
                      checked={config.workflow.approvalWorkflow}
                      onCheckedChange={(checked) => updateConfig('workflow', 'approvalWorkflow', checked)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="documentValidation">Validation documents</Label>
                    <Select 
                      value={config.workflow.documentValidation} 
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
                      checked={config.workflow.qualityControl}
                      onCheckedChange={(checked) => updateConfig('workflow', 'qualityControl', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions finales */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">État de la configuration</h3>
                <p className="text-sm text-muted-foreground">
                  {unsavedChanges ? 'Modifications en attente de sauvegarde' : 'Configuration synchronisée'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter config
                </Button>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Importer config
                </Button>
                <Button onClick={saveConfiguration} disabled={!unsavedChanges}>
                  <Save className="mr-2 h-4 w-4" />
                  {unsavedChanges ? 'Sauvegarder les modifications' : 'Configuration sauvegardée'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
} 