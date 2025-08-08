'use client';

import React, { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Globe,
  Server,
  Shield,
  Eye,
  Settings,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Upload,
  Activity,
  AlertTriangle,
  Info
} from 'lucide-react';
import { DomainConfig, DomainStatus, DNSRecord } from '@/lib/types/domain-management';

interface DomainManagementInterfaceProps {
  selectedApp: string;
}

export default function DomainManagementInterface({ selectedApp }: DomainManagementInterfaceProps) {
  const [domains, setDomains] = useState<DomainConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [newDomain, setNewDomain] = useState({
    domain: '',
    subdomain: '',
    serverIP: '',
    applicationPath: '',
    sslEnabled: true
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDomain, setSelectedDomain] = useState<DomainConfig | null>(null);

  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/domain-management?action=list');
      const data = await response.json();
      if (data.success) {
        setDomains(data.data || []);
      }
    } catch (error) {
      console.error('Erreur chargement domaines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDomain = async () => {
    if (!newDomain.domain || !newDomain.serverIP) {
      alert('Domaine et IP serveur requis');
      return;
    }

    setLoading(true);
    try {
      const domainConfig = {
        domain: newDomain.domain,
        subdomain: newDomain.subdomain,
        applicationId: selectedApp,
        status: 'pending' as DomainStatus,
        dnsRecords: [
          {
            type: 'A',
            name: '@',
            value: newDomain.serverIP,
            ttl: 3600
          },
          {
            type: 'CNAME',
            name: 'www',
            value: newDomain.domain,
            ttl: 3600
          }
        ] as Omit<DNSRecord, 'id' | 'status'>[],
        deploymentConfig: {
          serverId: `server_${Date.now()}`,
          serverType: 'vps' as const,
          ipAddress: newDomain.serverIP,
          port: 80,
          nginxConfig: {
            serverName: newDomain.domain,
            documentRoot: newDomain.applicationPath || `/var/www/${newDomain.domain}`,
            sslEnabled: newDomain.sslEnabled,
            proxyPass: selectedApp === 'administration' ? 'http://localhost:3000' :
                      selectedApp === 'demarche' ? 'http://localhost:3000/demarche' :
                      'http://localhost:3000/travail'
          }
        }
      };

      const response = await fetch('/api/domain-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'setup_domain',
          domainConfig
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Configuration du domaine démarrée avec succès!');
        setNewDomain({ domain: '', subdomain: '', serverIP: '', applicationPath: '', sslEnabled: true });
        loadDomains();
      } else {
        alert(`Erreur: ${data.error}`);
      }
    } catch (error) {
      console.error('Erreur création domaine:', error);
      alert('Erreur lors de la création du domaine');
    } finally {
      setLoading(false);
    }
  };

  const handleProvisionSSL = async (domain: string) => {
    if (!selectedDomain) return;

    setLoading(true);
    try {
      const response = await fetch('/api/domain-management/ssl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain,
          deploymentConfig: selectedDomain.deploymentConfig
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Certificat SSL provisionné avec succès!');
        loadDomains();
      } else {
        alert(`Erreur SSL: ${data.error}`);
      }
    } catch (error) {
      console.error('Erreur provisioning SSL:', error);
      alert('Erreur lors du provisioning SSL');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDNS = async (domain: string, expectedIP: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/domain-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_dns',
          domain,
          expectedIP
        })
      });

      const data = await response.json();
      if (data.success) {
        const isVerified = data.data.verified;
        alert(isVerified ? 'DNS vérifié avec succès!' : 'DNS non vérifié - vérifiez la configuration');
        if (isVerified) {
          loadDomains();
        }
      }
    } catch (error) {
      console.error('Erreur vérification DNS:', error);
      alert('Erreur lors de la vérification DNS');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: DomainStatus) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'dns_configured': return 'bg-blue-500';
      case 'ssl_pending': return 'bg-yellow-500';
      case 'pending': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      case 'suspended': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: DomainStatus) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'dns_configured': return 'DNS Configuré';
      case 'ssl_pending': return 'SSL en attente';
      case 'pending': return 'En attente';
      case 'error': return 'Erreur';
      case 'suspended': return 'Suspendu';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Gestion des Domaines - {selectedApp.toUpperCase()}.GA
          </h2>
          <p className="text-gray-600">
            Configuration et déploiement des domaines pour l'application {selectedApp}
          </p>
        </div>
        <Button onClick={loadDomains} variant="outline" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="configure">Configuration</TabsTrigger>
          <TabsTrigger value="dns">DNS & SSL</TabsTrigger>
          <TabsTrigger value="deployment">Déploiement</TabsTrigger>
        </TabsList>

        {/* Onglet Aperçu */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Domaines Actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {domains.filter(d => d.status === 'active').length}
                </div>
                <p className="text-xs text-gray-500">Sur {domains.length} total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Certificats SSL</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {domains.filter(d => d.sslCertificate?.status === 'active').length}
                </div>
                <p className="text-xs text-gray-500">Actifs et valides</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Configuration DNS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {domains.filter(d => d.status !== 'pending').length}
                </div>
                <p className="text-xs text-gray-500">Configurés</p>
              </CardContent>
            </Card>
          </div>

          {/* Liste des domaines */}
          <Card>
            <CardHeader>
              <CardTitle>Domaines Configurés</CardTitle>
              <CardDescription>
                Liste de tous les domaines configurés pour {selectedApp.toUpperCase()}.GA
              </CardDescription>
            </CardHeader>
            <CardContent>
              {domains.length === 0 ? (
                <div className="text-center py-8">
                  <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun domaine configuré</h3>
                  <p className="text-gray-600 mb-4">
                    Commencez par configurer votre premier domaine pour {selectedApp.toUpperCase()}.GA
                  </p>
                  <Button onClick={() => setActiveTab('configure')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Configurer un domaine
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {domains.map((domain) => (
                    <div key={domain.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{domain.domain}</h4>
                            <Badge
                              className={`${getStatusColor(domain.status)} text-white`}
                            >
                              {getStatusLabel(domain.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            IP: {domain.deploymentConfig.ipAddress} •
                            SSL: {domain.sslCertificate ? 'Actif' : 'Non configuré'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedDomain(domain);
                            setActiveTab('dns');
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Détails
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`https://${domain.domain}`, '_blank')}
                        >
                          <Globe className="w-4 h-4 mr-1" />
                          Visiter
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Configuration */}
        <TabsContent value="configure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nouveau Domaine</CardTitle>
              <CardDescription>
                Configurez un nouveau domaine pour {selectedApp.toUpperCase()}.GA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  Assurez-vous que votre domaine acheté sur Netim.com pointe vers nos serveurs de noms.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nom de Domaine *</Label>
                  <Input
                    placeholder="exemple.ga"
                    value={newDomain.domain}
                    onChange={(e) => setNewDomain(prev => ({ ...prev, domain: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Sous-domaine (optionnel)</Label>
                  <Input
                    placeholder="www"
                    value={newDomain.subdomain}
                    onChange={(e) => setNewDomain(prev => ({ ...prev, subdomain: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Adresse IP du Serveur *</Label>
                  <Input
                    placeholder="192.168.1.100"
                    value={newDomain.serverIP}
                    onChange={(e) => setNewDomain(prev => ({ ...prev, serverIP: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Chemin de l'Application</Label>
                  <Input
                    placeholder="/var/www/administration.ga"
                    value={newDomain.applicationPath}
                    onChange={(e) => setNewDomain(prev => ({ ...prev, applicationPath: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newDomain.sslEnabled}
                  onCheckedChange={(checked) => setNewDomain(prev => ({ ...prev, sslEnabled: checked }))}
                />
                <Label>Activer SSL/HTTPS automatiquement</Label>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleCreateDomain}
                  disabled={loading || !newDomain.domain || !newDomain.serverIP}
                  className="w-full"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Configurer le Domaine
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet DNS & SSL */}
        <TabsContent value="dns" className="space-y-6">
          {selectedDomain ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedDomain.domain}</CardTitle>
                  <CardDescription>
                    Configuration DNS et SSL pour ce domaine
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Status DNS */}
                  <div>
                    <h4 className="font-medium mb-3">Configuration DNS</h4>
                    <div className="space-y-2">
                      {selectedDomain.dnsRecords.map((record, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline">{record.type}</Badge>
                            <span className="font-mono text-sm">{record.name}</span>
                            <span className="text-gray-600">→</span>
                            <span className="font-mono text-sm">{record.value}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={record.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}>
                              {record.status === 'active' ? 'Actif' : 'En attente'}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerifyDNS(selectedDomain.domain, selectedDomain.deploymentConfig.ipAddress)}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status SSL */}
                  <div>
                    <h4 className="font-medium mb-3">Certificat SSL</h4>
                    {selectedDomain.sslCertificate ? (
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Certificat actif</p>
                            <p className="text-sm text-gray-600">
                              Émis par {selectedDomain.sslCertificate.issuer} •
                              Expire le {new Date(selectedDomain.sslCertificate.validTo).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Valide
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 border border-dashed rounded-lg text-center">
                        <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 mb-3">Aucun certificat SSL configuré</p>
                        <Button
                          onClick={() => handleProvisionSSL(selectedDomain.domain)}
                          disabled={loading}
                        >
                          {loading ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Shield className="w-4 h-4 mr-2" />
                          )}
                          Provisionner SSL
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Sélectionnez un domaine dans l'aperçu pour voir les détails DNS et SSL</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Déploiement */}
        <TabsContent value="deployment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Déploiements</CardTitle>
              <CardDescription>
                Logs et statut des déploiements pour {selectedApp.toUpperCase()}.GA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Aucun déploiement en cours. Les logs apparaîtront ici lors des prochains déploiements.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
