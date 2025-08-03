'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  UserCheck,
  Users,
  MapPin,
  Search,
  Filter,
  Download,
  RefreshCw,
  TrendingUp,
  BarChart3,
  ArrowRight,
  Eye,
  Settings,
  Loader2,
  Phone,
  Mail,
  Calendar,
  Star,
  Euro,
  Building2,
  Briefcase,
  Crown,
  Activity,
  CheckCircle,
  AlertCircle,
  Award,
  Shield,
  Clock,
  FileText,
  CreditCard,
  Zap
} from 'lucide-react';

import { organismeCommercialService } from '@/lib/services/organisme-commercial.service';
import { OrganismeCommercial, TypeContrat } from '@/lib/types/organisme';

interface LoadingStates {
  loading: boolean;
  refreshing: boolean;
  renewingContract: string | null;
  updatingService: string | null;
  generatingInvoice: string | null;
}

interface ClientsStats {
  totalClients: number;
  chiffreAffairesTotal: number;
  chiffreAffairesMoyen: number;
  contratsActifs: number;
  contratsExpiration: number;
  satisfactionMoyenne: number;
  renouvellements: number;
  repartitionContrats: Record<TypeContrat, number>;
  evolutionCA: number;
}

export default function OrganismesClientsPage() {
  // États de base
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTypeContrat, setSelectedTypeContrat] = useState<string>('all');
  const [selectedStatutContrat, setSelectedStatutContrat] = useState<string>('all');
  const [selectedLocalisation, setSelectedLocalisation] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // États des données
  const [clients, setClients] = useState<OrganismeCommercial[]>([]);
  const [stats, setStats] = useState<ClientsStats | null>(null);

  // États des modales
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<OrganismeCommercial | null>(null);

  // États de chargement
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    loading: true,
    refreshing: false,
    renewingContract: null,
    updatingService: null,
    generatingInvoice: null
  });

  // Charger les données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, loading: true }));

      await new Promise(resolve => setTimeout(resolve, 600));

      const allOrganismes = organismeCommercialService.getAllOrganismes();
      const clientsData = allOrganismes.filter(org => org.status === 'CLIENT');

      // Calcul des statistiques clients
      const chiffreAffairesTotal = clientsData.reduce((sum, client) =>
        sum + (client.clientInfo?.montantAnnuel || 0), 0
      );

      const clientsStats: ClientsStats = {
        totalClients: clientsData.length,
        chiffreAffairesTotal,
        chiffreAffairesMoyen: clientsData.length > 0 ? chiffreAffairesTotal / clientsData.length : 0,
        contratsActifs: clientsData.filter(c => c.clientInfo?.statut === 'ACTIF').length,
        contratsExpiration: Math.floor(clientsData.length * 0.2), // 20% en expiration
        satisfactionMoyenne: 4.2,
        renouvellements: Math.floor(clientsData.length * 0.3),
        repartitionContrats: clientsData.reduce((acc, client) => {
          const type = client.clientInfo?.type || 'STANDARD';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<TypeContrat, number>),
        evolutionCA: 15.8 // % croissance
      };

      setClients(clientsData);
      setStats(clientsStats);
      toast.success('Données des clients chargées');
    } catch (error) {
      console.error('❌ Erreur chargement clients:', error);
      toast.error('❌ Erreur lors du chargement');
    } finally {
      setLoadingStates(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Filtrer les clients
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchSearch = client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTypeContrat = selectedTypeContrat === 'all' || client.clientInfo?.type === selectedTypeContrat;
      const matchStatutContrat = selectedStatutContrat === 'all' || client.clientInfo?.statut === selectedStatutContrat;
      const matchLocalisation = selectedLocalisation === 'all' || client.localisation === selectedLocalisation;
      const matchType = selectedType === 'all' || client.type === selectedType;

      return matchSearch && matchTypeContrat && matchStatutContrat && matchLocalisation && matchType;
    });
  }, [clients, searchTerm, selectedTypeContrat, selectedStatutContrat, selectedLocalisation, selectedType]);

  // Listes uniques pour les filtres
  const localisationsUniques = useMemo(() => [...new Set(clients.map(c => c.localisation))], [clients]);
  const typesUniques = useMemo(() => [...new Set(clients.map(c => c.type))], [clients]);

  // Gestionnaires d'événements
  const handleRefreshData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, refreshing: true }));
      await loadData();
    } finally {
      setLoadingStates(prev => ({ ...prev, refreshing: false }));
    }
  }, [loadData]);

  const handleRenewContract = useCallback(async (client: OrganismeCommercial) => {
    try {
      setLoadingStates(prev => ({ ...prev, renewingContract: client.id }));

      // Simulation renouvellement
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(`✅ Contrat de ${client.nom} renouvelé avec succès !`);
      setIsRenewalModalOpen(false);
      await loadData();
    } catch (error) {
      console.error('❌ Erreur renouvellement:', error);
      toast.error('❌ Erreur lors du renouvellement');
    } finally {
      setLoadingStates(prev => ({ ...prev, renewingContract: null }));
    }
  }, [loadData]);

  const handleGenerateInvoice = useCallback(async (client: OrganismeCommercial) => {
    try {
      setLoadingStates(prev => ({ ...prev, generatingInvoice: client.id }));

      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success(`📄 Facture générée pour ${client.nom}`);
    } catch (error) {
      console.error('❌ Erreur génération facture:', error);
      toast.error('❌ Erreur lors de la génération');
    } finally {
      setLoadingStates(prev => ({ ...prev, generatingInvoice: null }));
    }
  }, []);

  // Fonctions utilitaires
  const formatPrix = (prix: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(prix);
  };

  const getContratColor = (type?: TypeContrat) => {
    if (!type) return 'bg-gray-100 text-gray-800 border-gray-300';
    switch (type) {
      case 'STANDARD': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'PREMIUM': return 'bg-green-100 text-green-800 border-green-300';
      case 'ENTERPRISE': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'GOUVERNEMENTAL': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatutColor = (statut?: string) => {
    switch (statut) {
      case 'ACTIF': return 'bg-green-100 text-green-800 border-green-300';
      case 'EXPIRE': return 'bg-red-100 text-red-800 border-red-300';
      case 'SUSPENDU': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MINISTERE': return Building2;
      case 'MAIRIE': return MapPin;
      case 'DIRECTION_GENERALE': return Briefcase;
      case 'PREFECTURE': return MapPin;
      case 'PROVINCE': return Crown;
      default: return Building2;
    }
  };

  const getContratIcon = (type?: TypeContrat) => {
    switch (type) {
      case 'STANDARD': return Award;
      case 'PREMIUM': return Star;
      case 'ENTERPRISE': return Crown;
      case 'GOUVERNEMENTAL': return Shield;
      default: return Award;
    }
  };

  const getExpirationStatus = (dateExpiration?: string) => {
    if (!dateExpiration) return { color: 'gray', text: 'Non définie', days: 0 };

    const expDate = new Date(dateExpiration);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { color: 'red', text: 'Expiré', days: Math.abs(diffDays) };
    } else if (diffDays <= 30) {
      return { color: 'yellow', text: `${diffDays} jours`, days: diffDays };
    } else if (diffDays <= 90) {
      return { color: 'blue', text: `${diffDays} jours`, days: diffDays };
    } else {
      return { color: 'green', text: `${diffDays} jours`, days: diffDays };
    }
  };

  if (loadingStates.loading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chargement des clients...</h3>
              <p className="text-muted-foreground">Analyse des contrats et facturation en cours</p>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <UserCheck className="h-8 w-8 text-green-600" />
                Gestion des Clients
              </h1>
              <p className="text-gray-600">
                Suivi des contrats, facturation et satisfaction client
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRefreshData}
                disabled={loadingStates.refreshing}
              >
                {loadingStates.refreshing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Actualiser
              </Button>
            </div>
          </div>
        </div>

        {/* Métriques clients */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Clients</p>
                  <p className="text-2xl font-bold">{stats?.totalClients || 0}</p>
                  <p className="text-green-100 text-xs">Contrats actifs</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Chiffre d'Affaires</p>
                  <p className="text-2xl font-bold">
                    {stats ? Math.floor(stats.chiffreAffairesTotal / 1000000) : 0}M
                  </p>
                  <p className="text-blue-100 text-xs">FCFA annuel</p>
                </div>
                <Euro className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Satisfaction</p>
                  <p className="text-2xl font-bold">{stats?.satisfactionMoyenne || 0}</p>
                  <p className="text-yellow-100 text-xs">/ 5.0</p>
                </div>
                <Star className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Croissance CA</p>
                  <p className="text-2xl font-bold">+{stats?.evolutionCA || 0}%</p>
                  <p className="text-purple-100 text-xs">vs année précédente</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques détaillées */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Types de Contrats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats?.repartitionContrats || {}).map(([type, count]) => {
                  const ContratIcon = getContratIcon(type as TypeContrat);
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ContratIcon className="h-4 w-4 text-gray-600" />
                        <span className="text-sm">{type}</span>
                      </div>
                      <Badge className={getContratColor(type as TypeContrat)}>{count}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                Contrats & Échéances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Contrats actifs</span>
                  <Badge className="bg-green-100 text-green-800">{stats?.contratsActifs || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Expirent sous 30j</span>
                  <Badge className="bg-yellow-100 text-yellow-800">{stats?.contratsExpiration || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Renouvellements</span>
                  <Badge className="bg-blue-100 text-blue-800">{stats?.renouvellements || 0}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Satisfaction moyenne</span>
                    <span>{stats?.satisfactionMoyenne || 0}/5</span>
                  </div>
                  <Progress value={(stats?.satisfactionMoyenne || 0) * 20} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Taux de renouvellement</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Services actifs</span>
                    <span>95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher un client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={selectedTypeContrat} onValueChange={setSelectedTypeContrat}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type contrat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  <SelectItem value="STANDARD">Standard</SelectItem>
                  <SelectItem value="PREMIUM">Premium</SelectItem>
                  <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                  <SelectItem value="GOUVERNEMENTAL">Gouvernemental</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatutContrat} onValueChange={setSelectedStatutContrat}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="ACTIF">Actif</SelectItem>
                  <SelectItem value="EXPIRE">Expiré</SelectItem>
                  <SelectItem value="SUSPENDU">Suspendu</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLocalisation} onValueChange={setSelectedLocalisation}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Localisation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes villes</SelectItem>
                  {localisationsUniques.map(ville => (
                    <SelectItem key={ville} value={ville}>{ville}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTypeContrat('all');
                  setSelectedStatutContrat('all');
                  setSelectedLocalisation('all');
                  setSelectedType('all');
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des clients */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map((client) => {
            const TypeIcon = getTypeIcon(client.type);
            const ContratIcon = getContratIcon(client.clientInfo?.type);
            const expiration = getExpirationStatus(client.clientInfo?.dateExpiration);

            return (
              <Card
                key={client.code}
                className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center text-white flex-shrink-0">
                      <TypeIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg leading-tight truncate" title={client.nom}>
                        {client.nom}
                      </h3>
                      <p className="text-gray-600 text-sm truncate">{client.type}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Code: <span className="font-mono">{client.code}</span>
                      </p>
                    </div>
                  </div>

                  {/* Badges de contrat */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={getContratColor(client.clientInfo?.type)}>
                      <ContratIcon className="h-3 w-3 mr-1" />
                      {client.clientInfo?.type || 'STANDARD'}
                    </Badge>

                    <Badge className={getStatutColor(client.clientInfo?.statut)}>
                      {client.clientInfo?.statut === 'ACTIF' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 mr-1" />
                      )}
                      {client.clientInfo?.statut || 'ACTIF'}
                    </Badge>
                  </div>

                  {/* Informations contrat */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{client.localisation}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{client.stats.totalUsers} utilisateurs</span>
                    </div>
                    <div className="flex items-center text-sm text-green-600 font-medium">
                      <Euro className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{formatPrix(client.clientInfo?.montantAnnuel || 0)}/an</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>
                        Expire dans: <span className={`text-${expiration.color}-600 font-medium`}>
                          {expiration.text}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Indicateur d'expiration */}
                  {expiration.days <= 30 && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800 font-medium">
                          Renouvellement requis
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-2 pt-4 border-t">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedClient(client);
                        setIsRenewalModalOpen(true);
                      }}
                      disabled={loadingStates.renewingContract === client.id}
                    >
                      {loadingStates.renewingContract === client.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Zap className="h-4 w-4 mr-2" />
                      )}
                      Renouveler Contrat
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateInvoice(client)}
                        disabled={loadingStates.generatingInvoice === client.id}
                      >
                        {loadingStates.generatingInvoice === client.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedClient(client);
                          setIsDetailsModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredClients.length === 0 && (
            <div className="col-span-full text-center py-12">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
              <p className="text-gray-600 mb-4">
                Aucun client ne correspond aux critères de recherche actuels.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTypeContrat('all');
                  setSelectedStatutContrat('all');
                  setSelectedLocalisation('all');
                  setSelectedType('all');
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>

        {/* Footer avec résumé */}
        {filteredClients.length > 0 && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Affichage de {filteredClients.length} client(s) sur {clients.length} total
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600">
                    CA: {formatPrix(filteredClients.reduce((sum, c) => sum + (c.clientInfo?.montantAnnuel || 0), 0))}
                  </span>
                  <span className="text-blue-600">
                    {filteredClients.filter(c => c.clientInfo?.statut === 'ACTIF').length} Actifs
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal de renouvellement */}
        <Dialog open={isRenewalModalOpen} onOpenChange={setIsRenewalModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Renouveler le Contrat</DialogTitle>
              <DialogDescription>
                Renouvellement du contrat pour "{selectedClient?.nom}"
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Contrat Actuel</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Type:</span>
                    <span className="ml-2 font-medium">{selectedClient?.clientInfo?.type}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Montant:</span>
                    <span className="ml-2 font-medium">
                      {selectedClient?.clientInfo?.montantAnnuel ? formatPrix(selectedClient.clientInfo.montantAnnuel) : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700">Expiration:</span>
                    <span className="ml-2 font-medium">
                      {selectedClient?.clientInfo?.dateExpiration
                        ? new Date(selectedClient.clientInfo.dateExpiration).toLocaleDateString()
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700">Statut:</span>
                    <span className="ml-2 font-medium">{selectedClient?.clientInfo?.statut}</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Voulez-vous renouveler ce contrat avec les mêmes conditions ?
                </p>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" onClick={() => setIsRenewalModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button
                    onClick={() => selectedClient && handleRenewContract(selectedClient)}
                    disabled={loadingStates.renewingContract === selectedClient?.id}
                  >
                    {loadingStates.renewingContract === selectedClient?.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Renouvellement...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirmer le Renouvellement
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal détails client */}
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Détails Client</DialogTitle>
              <DialogDescription>
                Informations détaillées pour "{selectedClient?.nom}"
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations Générales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Code:</span>
                      <span className="ml-2 font-mono">{selectedClient?.code}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Type:</span>
                      <span className="ml-2">{selectedClient?.type}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Localisation:</span>
                      <span className="ml-2">{selectedClient?.localisation}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Utilisateurs:</span>
                      <span className="ml-2">{selectedClient?.stats.totalUsers}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contrat & Facturation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Type Contrat:</span>
                      <span className="ml-2">{selectedClient?.clientInfo?.type}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Montant Annuel:</span>
                      <span className="ml-2 font-medium text-green-600">
                        {selectedClient?.clientInfo?.montantAnnuel ? formatPrix(selectedClient.clientInfo.montantAnnuel) : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Date Signature:</span>
                      <span className="ml-2">
                        {selectedClient?.clientInfo?.dateSignature
                          ? new Date(selectedClient.clientInfo.dateSignature).toLocaleDateString()
                          : 'N/A'
                        }
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Responsable:</span>
                      <span className="ml-2">{selectedClient?.clientInfo?.responsableCommercial}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
