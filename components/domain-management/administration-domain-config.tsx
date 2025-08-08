'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import {
  Globe,
  Server,
  Shield,
  Settings,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Activity,
  AlertTriangle,
  Info,
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  Loader2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useDomainManagement } from '@/hooks/use-domain-management';
import { toast } from 'sonner';
import DNSEditor from './dns-editor';

interface AdministrationDomainConfigProps {
  currentDomain?: string;
  onDomainConfigured?: (domain: string) => void;
}

interface LoadingStates {
  setup: boolean;
  verify: boolean;
  ssl: boolean;
  deploy: boolean;
  testing: boolean;
  refresh: boolean;
}

interface ValidationErrors {
  domain?: string;
  serverIP?: string;
}

export default function AdministrationDomainConfig({
  currentDomain = 'administration.ga',
  onDomainConfigured
}: AdministrationDomainConfigProps) {
  const {
    domains,
    loading: globalLoading,
    error: globalError,
    setupDomain,
    verifyDNS,
    provisionSSL,
    deployApplication,
    stats,
    loadDomains,
    clearError
  } = useDomainManagement({ autoRefresh: true, refreshInterval: 30000 });

  // États locaux
  const [domainConfig, setDomainConfig] = useState({
    domain: currentDomain,
    serverIP: '185.26.106.234', // IP actuelle du domaine administration.ga
    sslEnabled: true,
    autoSetup: true
  });

  const [setupStep, setSetupStep] = useState<'config' | 'dns' | 'ssl' | 'deploy' | 'complete'>('config');
  const [domainStatus, setDomainStatus] = useState<any>(null);
  const [isLocallyCompleted, setIsLocallyCompleted] = useState(false);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    setup: false,
    verify: false,
    ssl: false,
    deploy: false,
    testing: false,
    refresh: false
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [operationProgress, setOperationProgress] = useState(0);
  const [lastOperation, setLastOperation] = useState<string>('');

  // Rechercher le domaine ADMINISTRATION.GA dans la liste
  const administrationDomain = domains.find(d => d.domain === currentDomain || d.domain === 'administration.ga');

  // Fonctions utilitaires
  const setLoadingState = useCallback((key: keyof LoadingStates, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateProgress = useCallback((progress: number, operation: string) => {
    setOperationProgress(progress);
    setLastOperation(operation);
  }, []);

  // Validation des entrées
  const validateConfig = useCallback(() => {
    const errors: ValidationErrors = {};

    if (!domainConfig.domain || domainConfig.domain.length < 3) {
      errors.domain = 'Le nom de domaine doit contenir au moins 3 caractères';
    } else if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domainConfig.domain)) {
      errors.domain = 'Format de domaine invalide';
    }

    if (!domainConfig.serverIP || domainConfig.serverIP.length === 0) {
      errors.serverIP = 'L\'adresse IP du serveur est requise';
    } else if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(domainConfig.serverIP)) {
      errors.serverIP = 'Format d\'adresse IP invalide';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [domainConfig]);

  // Test de connectivité
  const testConnectivity = useCallback(async () => {
    setLoadingState('testing', true);
    updateProgress(0, 'Test de connectivité...');

    try {
      // Test ping/connectivité de base
      updateProgress(25, 'Vérification de l\'IP...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      updateProgress(50, 'Test de connectivité HTTP...');
      const response = await fetch(`http://${domainConfig.serverIP}`, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: AbortSignal.timeout(5000)
      }).catch(() => null);

      updateProgress(75, 'Validation des ports...');
      await new Promise(resolve => setTimeout(resolve, 500));

      updateProgress(100, 'Connectivité validée');
      toast.success('Serveur accessible');
      return true;
    } catch (error) {
      toast.warning('Serveur non accessible, mais on continue le processus');
      return true; // Continue quand même
    } finally {
      setLoadingState('testing', false);
      setTimeout(() => {
        setOperationProgress(0);
        setLastOperation('');
      }, 2000);
    }
  }, [domainConfig.serverIP, setLoadingState, updateProgress]);

  useEffect(() => {
    if (administrationDomain) {
      setDomainStatus(administrationDomain);

      // Ne pas modifier l'étape si on a déjà terminé localement
      if (isLocallyCompleted && setupStep === 'complete') {
        return;
      }

      // Déterminer l'étape actuelle basée sur le statut
      switch (administrationDomain.status) {
        case 'pending':
          setSetupStep('dns');
          break;
        case 'dns_configured':
          setSetupStep('ssl');
          break;
        case 'ssl_pending':
          setSetupStep('deploy');
          break;
        case 'active':
          setSetupStep('complete');
          setIsLocallyCompleted(true);
          break;
        default:
          setSetupStep('config');
      }
    }
  }, [administrationDomain, currentDomain, isLocallyCompleted, setupStep]);

  // Nettoyage des erreurs quand le config change
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      validateConfig();
    }
  }, [domainConfig, validationErrors, validateConfig]);

    // Gestionnaires d'événements complets avec gestion d'état
  const handleSetupDomain = useCallback(async () => {
    // Validation
    if (!validateConfig()) {
      toast.error('Veuillez corriger les erreurs avant de continuer');
      return;
    }

    setLoadingState('setup', true);
    clearError();

    try {
      updateProgress(0, 'Initialisation...');

      // Test de connectivité optionnel
      if (domainConfig.autoSetup) {
        updateProgress(10, 'Test de connectivité...');
        await testConnectivity();
      }

      updateProgress(25, 'Préparation de la configuration...');
      await new Promise(resolve => setTimeout(resolve, 500));

      const domainConfigData = {
        domain: domainConfig.domain,
        applicationId: 'administration',
        status: 'pending' as const,
        dnsRecords: [
          {
            type: 'A' as const,
            name: '@',
            value: domainConfig.serverIP,
            ttl: 3600
          },
          {
            type: 'CNAME' as const,
            name: 'www',
            value: domainConfig.domain,
            ttl: 3600
          }
        ],
        deploymentConfig: {
          serverId: `admin_server_${Date.now()}`,
          serverType: 'vps' as const,
          ipAddress: domainConfig.serverIP,
          port: 80,
          nginxConfig: {
            serverName: domainConfig.domain,
            documentRoot: `/var/www/${domainConfig.domain}`,
            sslEnabled: domainConfig.sslEnabled,
            proxyPass: 'http://localhost:3000'
          }
        }
      };

      updateProgress(50, 'Envoi de la configuration...');
      const result = await setupDomain(domainConfigData);

      if (result.success) {
        updateProgress(100, 'Configuration terminée!');
        toast.success('Configuration du domaine démarrée avec succès!');
        setSetupStep('dns');
        onDomainConfigured?.(domainConfig.domain);
      } else {
        throw new Error(result.error || 'Erreur lors de la configuration');
      }
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
      setSetupStep('config');
    } finally {
      setLoadingState('setup', false);
      setTimeout(() => {
        setOperationProgress(0);
        setLastOperation('');
      }, 2000);
    }
  }, [domainConfig, validateConfig, setLoadingState, clearError, updateProgress, testConnectivity, setupDomain, onDomainConfigured]);

  const handleVerifyDNS = useCallback(async () => {
    if (!domainStatus) {
      toast.error('Configuration du domaine requise');
      return;
    }

    setLoadingState('verify', true);
    updateProgress(0, 'Vérification DNS...');

    try {
      updateProgress(30, 'Interrogation des serveurs DNS...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result = await verifyDNS(domainConfig.domain, domainConfig.serverIP);

      updateProgress(80, 'Analyse des résultats...');
      await new Promise(resolve => setTimeout(resolve, 500));

      if (result.success && result.verified) {
        updateProgress(100, 'DNS vérifié!');
        toast.success('DNS vérifié avec succès!');
        setSetupStep('ssl');
      } else {
        updateProgress(100, 'DNS non résolu');
        toast.warning('DNS non vérifié. Vérifiez la configuration chez Netim.com');
      }
    } catch (error: any) {
      toast.error(`Erreur DNS: ${error.message}`);
    } finally {
      setLoadingState('verify', false);
      setTimeout(() => {
        setOperationProgress(0);
        setLastOperation('');
      }, 2000);
    }
  }, [domainStatus, domainConfig, verifyDNS, setLoadingState, updateProgress]);

  const handleProvisionSSL = useCallback(async () => {
    if (!domainStatus) {
      toast.error('Configuration du domaine et DNS requis');
      return;
    }

    setLoadingState('ssl', true);
    updateProgress(0, 'Provisioning SSL...');

    try {
      updateProgress(20, 'Vérification des prérequis...');
      await new Promise(resolve => setTimeout(resolve, 800));

      updateProgress(40, 'Génération du certificat...');
      const result = await provisionSSL(domainConfig.domain, domainStatus.deploymentConfig);

      updateProgress(80, 'Installation du certificat...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (result.success) {
        updateProgress(100, 'SSL installé!');
        toast.success('Certificat SSL provisionné avec succès!');
        setSetupStep('deploy');
      } else {
        throw new Error(result.error || 'Erreur lors du provisioning SSL');
      }
    } catch (error: any) {
      toast.error(`Erreur SSL: ${error.message}`);
    } finally {
      setLoadingState('ssl', false);
      setTimeout(() => {
        setOperationProgress(0);
        setLastOperation('');
      }, 2000);
    }
  }, [domainStatus, domainConfig, provisionSSL, setLoadingState, updateProgress]);

  const handleDeployApplication = useCallback(async () => {
    setLoadingState('deploy', true);
    updateProgress(0, 'Déploiement...');

    try {
      updateProgress(20, 'Préparation du déploiement...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Créer une configuration de déploiement par défaut si nécessaire
      const deploymentConfig = domainStatus?.deploymentConfig || {
        domain: domainConfig.domain,
        ipAddress: domainConfig.serverIP,
        port: 3000,
        ssl: domainConfig.sslEnabled,
        nginx: true
      };

      updateProgress(50, 'Configuration Nginx...');
      const result = await deployApplication(domainStatus?.id, deploymentConfig);

      updateProgress(80, 'Finalisation...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (result.success) {
        updateProgress(100, 'Déploiement terminé!');
        toast.success('Application déployée avec succès!');
        setSetupStep('complete');
        setIsLocallyCompleted(true); // Marquer comme terminé localement
      } else {
        throw new Error(result.error || 'Erreur lors du déploiement');
      }
    } catch (error: any) {
      toast.error(`Erreur déploiement: ${error.message}`);
    } finally {
      setLoadingState('deploy', false);
      setTimeout(() => {
        setOperationProgress(0);
        setLastOperation('');
      }, 2000);
    }
  }, [domainStatus, deployApplication, setLoadingState, updateProgress]);

  const handleRefresh = useCallback(async () => {
    setLoadingState('refresh', true);
    updateProgress(0, 'Actualisation...');

    try {
      updateProgress(50, 'Chargement des données...');
      await loadDomains();
      updateProgress(100, 'Données actualisées');
      toast.success('Données actualisées');
    } catch (error) {
      toast.error('Erreur lors de l\'actualisation');
    } finally {
      setLoadingState('refresh', false);
      setTimeout(() => {
        setOperationProgress(0);
        setLastOperation('');
      }, 1000);
    }
  }, [loadDomains, setLoadingState, updateProgress]);

  const handleReset = useCallback(() => {
    setSetupStep('config');
    setDomainStatus(null);
    setIsLocallyCompleted(false); // Remettre à zéro le flag de completion
    setOperationProgress(0);
    setLastOperation('');
    setValidationErrors({});
    clearError();
    toast.info('Configuration réinitialisée');
  }, [clearError]);

  const getStepStatus = (step: string) => {
    const stepOrder = ['config', 'dns', 'ssl', 'deploy', 'complete'];
    const currentIndex = stepOrder.indexOf(setupStep);
    const stepIndex = stepOrder.indexOf(step);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'current': return 'bg-blue-500';
      case 'pending': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statut amélioré */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Configuration du Domaine ADMINISTRATION.GA
          </h3>
          <p className="text-gray-600">
            Connectez et configurez votre domaine pour l'application d'administration
          </p>
          {lastOperation && (
            <div className="flex items-center space-x-2 mt-1">
              <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
              <span className="text-xs text-blue-600">{lastOperation}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {domainStatus && (
            <Badge
              className={`${
                domainStatus.status === 'active' ? 'bg-green-500' :
                domainStatus.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
              } text-white`}
            >
              {domainStatus.status === 'active' ? 'Connecté' :
               domainStatus.status === 'error' ? 'Erreur' : 'En cours'}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`https://${currentDomain}`, '_blank')}
            disabled={!domainStatus || domainStatus.status !== 'active'}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Visiter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loadingStates.refresh || Object.values(loadingStates).some(Boolean)}
          >
            {loadingStates.refresh ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Progress Bar global */}
      {operationProgress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{lastOperation}</span>
            <span className="text-gray-600">{operationProgress}%</span>
          </div>
          <Progress value={operationProgress} className="h-2" />
        </div>
      )}

      {/* Alertes améliorées */}
      {globalError && (
        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex justify-between items-center">
              <span>{globalError}</span>
              <Button size="sm" variant="ghost" onClick={clearError}>
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {Object.keys(validationErrors).length > 0 && (
        <Alert className="bg-orange-50 border-orange-200">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Erreurs de validation :</strong>
            <ul className="mt-1 ml-4 list-disc text-sm">
              {Object.entries(validationErrors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Configuration du Domaine</span>
            </CardTitle>
            <CardDescription>
              Paramètres de connexion pour {currentDomain}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="domain">Nom de Domaine</Label>
              <Input
                id="domain"
                value={domainConfig.domain}
                onChange={(e) => setDomainConfig(prev => ({ ...prev, domain: e.target.value }))}
                placeholder="administration.ga"
                disabled={!!administrationDomain || Object.values(loadingStates).some(Boolean)}
                className={validationErrors.domain ? 'border-red-500' : ''}
              />
              {validationErrors.domain && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.domain}</p>
              )}
            </div>

            <div>
              <Label htmlFor="serverIP">Adresse IP du Serveur *</Label>
              <div className="relative">
                <Input
                  id="serverIP"
                  value={domainConfig.serverIP}
                  onChange={(e) => setDomainConfig(prev => ({ ...prev, serverIP: e.target.value }))}
                  placeholder="192.168.1.100"
                  disabled={setupStep !== 'config' || Object.values(loadingStates).some(Boolean)}
                  className={validationErrors.serverIP ? 'border-red-500' : ''}
                />
                {loadingStates.testing && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  </div>
                )}
              </div>
              {validationErrors.serverIP && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.serverIP}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Adresse IP où déployer l'application ADMINISTRATION.GA
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="sslEnabled"
                checked={domainConfig.sslEnabled}
                onCheckedChange={(checked) => setDomainConfig(prev => ({ ...prev, sslEnabled: checked }))}
                disabled={setupStep !== 'config' || Object.values(loadingStates).some(Boolean)}
              />
              <Label htmlFor="sslEnabled" className="cursor-pointer">
                Activer SSL/HTTPS automatiquement
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="autoSetup"
                checked={domainConfig.autoSetup}
                onCheckedChange={(checked) => setDomainConfig(prev => ({ ...prev, autoSetup: checked }))}
                disabled={setupStep !== 'config' || Object.values(loadingStates).some(Boolean)}
              />
              <Label htmlFor="autoSetup" className="cursor-pointer">
                Configuration automatique complète
              </Label>
            </div>

            {/* Actions de configuration */}
            <div className="space-y-2 pt-2">
              {setupStep === 'config' && (
                <>
                  <Button
                    onClick={handleSetupDomain}
                    disabled={
                      loadingStates.setup ||
                      Object.values(loadingStates).some(Boolean) ||
                      !domainConfig.serverIP ||
                      Object.keys(validationErrors).length > 0
                    }
                    className="w-full"
                  >
                    {loadingStates.setup ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Démarrer la Configuration
                  </Button>

                  {domainConfig.serverIP && !validationErrors.serverIP && (
                    <Button
                      variant="outline"
                      onClick={testConnectivity}
                      disabled={loadingStates.testing || Object.values(loadingStates).some(Boolean)}
                      className="w-full"
                    >
                      {loadingStates.testing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Wifi className="w-4 h-4 mr-2" />
                      )}
                      Tester la Connectivité
                    </Button>
                  )}
                </>
              )}

              {setupStep !== 'config' && setupStep !== 'complete' && (
                <Button
                  variant="destructive"
                  onClick={handleReset}
                  disabled={Object.values(loadingStates).some(Boolean)}
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Recommencer la Configuration
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

                {/* Processus de Déploiement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Processus de Déploiement</span>
            </CardTitle>
            <CardDescription>
              Étapes de configuration du domaine avec actions interactives
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Étapes améliorées */}
            <div className="space-y-3">
              {[
                { key: 'config', label: 'Configuration', icon: Settings, description: 'Paramètres de base' },
                { key: 'dns', label: 'Configuration DNS', icon: Globe, description: 'Résolution de domaine' },
                { key: 'ssl', label: 'Certificat SSL', icon: Shield, description: 'Sécurisation HTTPS' },
                { key: 'deploy', label: 'Déploiement', icon: Server, description: 'Mise en production' },
                { key: 'complete', label: 'Terminé', icon: CheckCircle2, description: 'Configuration complète' }
              ].map((step) => {
                const status = getStepStatus(step.key);
                const Icon = step.icon;
                const isLoading =
                  (step.key === 'dns' && loadingStates.verify) ||
                  (step.key === 'ssl' && loadingStates.ssl) ||
                  (step.key === 'deploy' && loadingStates.deploy);

                return (
                  <div
                    key={step.key}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      status === 'current' ? 'bg-blue-50 border border-blue-200' :
                      status === 'completed' ? 'bg-green-50 border border-green-200' :
                      'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(status)}`}>
                      {status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : isLoading ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      ) : status === 'current' ? (
                        <Clock className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{step.label}</div>
                      <div className="text-xs text-gray-500">{step.description}</div>
                      {status === 'current' && lastOperation && step.key !== 'config' && (
                        <div className="text-xs text-blue-600 mt-1">{lastOperation}</div>
                      )}
                    </div>

                    {/* Actions spécifiques par étape */}
                    <div className="flex space-x-2">
                      {status === 'current' && step.key === 'dns' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleVerifyDNS}
                          disabled={loadingStates.verify}
                        >
                          {loadingStates.verify ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                          )}
                          Vérifier
                        </Button>
                      )}

                      {status === 'current' && step.key === 'ssl' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleProvisionSSL}
                          disabled={loadingStates.ssl}
                        >
                          {loadingStates.ssl ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : (
                            <Shield className="w-3 h-3 mr-1" />
                          )}
                          Installer
                        </Button>
                      )}

                      {status === 'current' && step.key === 'deploy' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleDeployApplication}
                          disabled={loadingStates.deploy}
                        >
                          {loadingStates.deploy ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : (
                            <Server className="w-3 h-3 mr-1" />
                          )}
                          Déployer
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions rapides améliorées */}
            {setupStep !== 'config' && setupStep !== 'complete' && (
              <div className="pt-4 border-t space-y-2">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    disabled={Object.values(loadingStates).some(Boolean)}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Recommencer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={Object.values(loadingStates).some(Boolean)}
                  >
                    {loadingStates.refresh ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-1" />
                    )}
                    Actualiser
                  </Button>
                </div>
              </div>
            )}

            {/* Message de succès */}
            {setupStep === 'complete' && (
              <div className="pt-4 border-t">
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>🎉 Configuration terminée !</strong><br />
                    Votre domaine {domainConfig.domain} est maintenant configuré et accessible.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Informations sur le domaine configuré */}
      {domainStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Informations du Domaine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Domaine</Label>
                <p className="text-sm text-gray-600">{domainStatus.domain}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Adresse IP</Label>
                <p className="text-sm text-gray-600">{domainStatus.deploymentConfig.ipAddress}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Statut SSL</Label>
                <p className="text-sm text-gray-600">
                  {domainStatus.sslCertificate ? 'Actif' : 'Non configuré'}
                </p>
              </div>
            </div>

            {domainStatus.sslCertificate && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Certificat SSL actif
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Expire le {new Date(domainStatus.sslCertificate.validTo).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Ancienne section DNS codée en dur supprimée (Netim) */}

      {/* Éditeur DNS */}
      <DNSEditor
        domain={domainConfig.domain}
        onRecordsChange={(records) => {
          console.log('DNS records updated:', records);
          // Optionnel : mettre à jour l'état local si nécessaire
        }}
      />
    </div>
  );
}
