'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { toast } from 'sonner';
import {
  Building2,
  Users,
  MapPin,
  Search,
  Filter,
  Download,
  RefreshCw,
  TrendingUp,
  Target,
  UserCheck,
  BarChart3,
  PieChart,
  ArrowRight,
  Eye,
  Settings,
  Loader2,
  Grid,
  List,
  Star,
  CheckCircle,
  Clock,
  AlertCircle,
  Euro,
  Calendar,
  Activity,
  Crown,
  Award,
  Shield,
  Briefcase
} from 'lucide-react';

import { organismeCommercialService } from '@/lib/services/organisme-commercial.service';
import { OrganismeCommercial, TypeContrat } from '@/lib/types/organisme';

interface LoadingStates {
  loading: boolean;
  refreshing: boolean;
  exporting: boolean;
  viewingDetails: string | null;
}

interface OrganismesStats {
  totalOrganismes: number;
  totalProspects: number;
  totalClients: number;
  chiffreAffairesTotal: number;
  pipelineValue: number;
  tauxConversion: number;
  conversionsRecentes: number;
  prospectsParPriorite: {
    haute: number;
    moyenne: number;
    basse: number;
  };
  clientsParContrat: {
    standard: number;
    premium: number;
    enterprise: number;
    gouvernemental: number;
  };
  repartitionGeographique: Record<string, number>;
  repartitionParType: Record<string, number>;
}

export default function OrganismesVueEnsemblePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterFromUrl = searchParams.get('filter');

  // États de base
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocalisation, setSelectedLocalisation] = useState<string>('all');
  const [selectedStatutCommercial, setSelectedStatutCommercial] = useState<string>(
    filterFromUrl === 'prospects' ? 'PROSPECT' :
    filterFromUrl === 'clients' ? 'CLIENT' : 'all'
  );
  const [selectedPriorite, setSelectedPriorite] = useState<string>('all');
  const [selectedContrat, setSelectedContrat] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // États des données
  const [organismes, setOrganismes] = useState<OrganismeCommercial[]>([]);
  const [stats, setStats] = useState<OrganismesStats | null>(null);

  // États de chargement
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    loading: true,
    refreshing: false,
    exporting: false,
    viewingDetails: null
  });

  // Charger les données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, loading: true }));

      await new Promise(resolve => setTimeout(resolve, 800));

      const allOrganismes = organismeCommercialService.getAllOrganismes();
      const prospects = allOrganismes.filter(org => org.status === 'PROSPECT');
      const clients = allOrganismes.filter(org => org.status === 'CLIENT');

      // Calcul des statistiques
      const organismeStats: OrganismesStats = {
        totalOrganismes: allOrganismes.length,
        totalProspects: prospects.length,
        totalClients: clients.length,
        chiffreAffairesTotal: clients.reduce((sum, client) => sum + (client.clientInfo?.montantAnnuel || 0), 0),
        pipelineValue: prospects.length * 15000000, // Estimation
        tauxConversion: Math.round((clients.length / allOrganismes.length) * 100),
        conversionsRecentes: 8,
        prospectsParPriorite: {
          haute: prospects.filter(p => p.prospectInfo?.priorite === 'HAUTE').length,
          moyenne: prospects.filter(p => p.prospectInfo?.priorite === 'MOYENNE').length,
          basse: prospects.filter(p => p.prospectInfo?.priorite === 'BASSE').length
        },
        clientsParContrat: {
          standard: clients.filter(c => c.clientInfo?.type === 'STANDARD').length,
          premium: clients.filter(c => c.clientInfo?.type === 'PREMIUM').length,
          enterprise: clients.filter(c => c.clientInfo?.type === 'ENTERPRISE').length,
          gouvernemental: clients.filter(c => c.clientInfo?.type === 'GOUVERNEMENTAL').length
        },
        repartitionGeographique: allOrganismes.reduce((acc, org) => {
          acc[org.localisation] = (acc[org.localisation] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        repartitionParType: allOrganismes.reduce((acc, org) => {
          acc[org.type] = (acc[org.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      setOrganismes(allOrganismes);
      setStats(organismeStats);
      toast.success('Données des organismes chargées avec succès');
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      toast.error('❌ Erreur lors du chargement des données');
    } finally {
      setLoadingStates(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Filtrer les organismes
  const filteredOrganismes = useMemo(() => {
    try {
      return organismes.filter(org => {
        const matchSearch = org.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           org.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = selectedType === 'all' || org.type === selectedType;
        const matchLocalisation = selectedLocalisation === 'all' || org.localisation === selectedLocalisation;
        const matchStatutCommercial = selectedStatutCommercial === 'all' || org.status === selectedStatutCommercial;
        const matchPriorite = selectedPriorite === 'all' ||
                             (org.status === 'PROSPECT' && org.prospectInfo?.priorite === selectedPriorite);
        const matchContrat = selectedContrat === 'all' ||
                           (org.status === 'CLIENT' && org.clientInfo?.type === selectedContrat);

        return matchSearch && matchType && matchLocalisation && matchStatutCommercial &&
               matchPriorite && matchContrat;
      });
    } catch (error) {
      console.error('❌ Erreur lors du filtrage:', error);
      return [];
    }
  }, [organismes, searchTerm, selectedType, selectedLocalisation, selectedStatutCommercial, selectedPriorite, selectedContrat]);

  // Listes uniques pour les filtres
  const typesUniques = useMemo(() => [...new Set(organismes.map(o => o.type))], [organismes]);
  const localisationsUniques = useMemo(() => [...new Set(organismes.map(o => o.localisation))], [organismes]);

  // Gestionnaires d'événements
  const handleRefreshData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, refreshing: true }));
      await loadData();
    } finally {
      setLoadingStates(prev => ({ ...prev, refreshing: false }));
    }
  }, [loadData]);

  const handleAccederProspects = useCallback(() => {
    router.push('/super-admin/organismes-prospects');
  }, [router]);

  const handleAccederClients = useCallback(() => {
    router.push('/super-admin/organismes-clients');
  }, [router]);

  const handleExportData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, exporting: true }));

      await new Promise(resolve => setTimeout(resolve, 1000));

      const exportData = {
        exported_at: new Date().toISOString(),
        total_organismes: filteredOrganismes.length,
        organismes: filteredOrganismes,
        statistics: stats,
        source: 'SUPER_ADMIN_ORGANISMES_VUE_ENSEMBLE'
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `organismes-vue-ensemble-${filteredOrganismes.length}-${new Date().toISOString().split('T')[0]}.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`✅ Export de ${filteredOrganismes.length} organismes réussi !`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'export:', error);
      toast.error('❌ Erreur lors de l\'export des données');
    } finally {
      setLoadingStates(prev => ({ ...prev, exporting: false }));
    }
  }, [filteredOrganismes, stats]);

  // Fonctions utilitaires
  const formatPrix = (prix: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(prix);
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

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'CLIENT': return 'bg-green-100 text-green-800 border-green-300';
      case 'PROSPECT': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'CLIENT': return UserCheck;
      case 'PROSPECT': return Target;
      default: return Building2;
    }
  };

  const getPrioriteColor = (priorite?: string) => {
    switch (priorite) {
      case 'HAUTE': return 'bg-red-100 text-red-800 border-red-300';
      case 'MOYENNE': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'BASSE': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getContratTypeColor = (type?: TypeContrat) => {
    if (!type) return 'bg-gray-100 text-gray-800 border-gray-300';
    switch (type) {
      case 'STANDARD': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'PREMIUM': return 'bg-green-100 text-green-800 border-green-300';
      case 'ENTERPRISE': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'GOUVERNEMENTAL': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loadingStates.loading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chargement de la vue d'ensemble...</h3>
              <p className="text-muted-foreground">Analyse des données commerciales en cours</p>
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
                <Building2 className="h-8 w-8 text-blue-600" />
                Organismes - Vue d'Ensemble
              </h1>
              <p className="text-gray-600">
                Tableau de bord commercial complet des organismes publics gabonais
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
              <Button
                variant="outline"
                onClick={handleExportData}
                disabled={loadingStates.exporting}
              >
                {loadingStates.exporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Exporter
              </Button>
            </div>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Organismes</p>
                  <p className="text-2xl font-bold">{stats?.totalOrganismes || 0}</p>
                  <p className="text-blue-100 text-xs">Organismes publics</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Prospects</p>
                  <p className="text-2xl font-bold">{stats?.totalProspects || 0}</p>
                  <p className="text-orange-100 text-xs">En prospection</p>
                </div>
                <Target className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Clients</p>
                  <p className="text-2xl font-bold">{stats?.totalClients || 0}</p>
                  <p className="text-green-100 text-xs">Contrats actifs</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Taux Conversion</p>
                  <p className="text-2xl font-bold">{stats?.tauxConversion || 0}%</p>
                  <p className="text-purple-100 text-xs">Prospects → Clients</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides vers pages dédiées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all cursor-pointer"
                onClick={handleAccederProspects}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Gérer les Prospects</h3>
                    <p className="text-gray-600">Prospection, qualification et conversion</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className="bg-red-100 text-red-800">
                        {stats?.prospectsParPriorite.haute || 0} Haute
                      </Badge>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {stats?.prospectsParPriorite.moyenne || 0} Moyenne
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        {stats?.prospectsParPriorite.basse || 0} Basse
                      </Badge>
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all cursor-pointer"
                onClick={handleAccederClients}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Gérer les Clients</h3>
                    <p className="text-gray-600">Contrats, facturation et support</p>
                    <div className="text-sm text-green-600 font-medium mt-2">
                      CA Total: {stats ? formatPrix(stats.chiffreAffairesTotal) : '0 FCFA'}
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques détaillées */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-blue-600" />
                Répartition par Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats?.repartitionParType || {}).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm">{type}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Contrats Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Standard</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {stats?.clientsParContrat.standard || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Premium</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {stats?.clientsParContrat.premium || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Enterprise</span>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">
                    {stats?.clientsParContrat.enterprise || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Gouvernemental</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {stats?.clientsParContrat.gouvernemental || 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-600" />
                Répartition Géographique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats?.repartitionGeographique || {})
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 6)
                  .map(([ville, count]) => (
                  <div key={ville} className="flex items-center justify-between">
                    <span className="text-sm truncate">{ville}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
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
                    placeholder="Rechercher un organisme..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={selectedStatutCommercial} onValueChange={setSelectedStatutCommercial}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut commercial" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="PROSPECT">Prospects</SelectItem>
                  <SelectItem value="CLIENT">Clients</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Type d'organisme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  {typesUniques.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocalisation} onValueChange={setSelectedLocalisation}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Ville" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes villes</SelectItem>
                  {localisationsUniques.map(ville => (
                    <SelectItem key={ville} value={ville}>{ville}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedStatutCommercial === 'PROSPECT' && (
                <Select value={selectedPriorite} onValueChange={setSelectedPriorite}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes priorités</SelectItem>
                    <SelectItem value="HAUTE">Haute</SelectItem>
                    <SelectItem value="MOYENNE">Moyenne</SelectItem>
                    <SelectItem value="BASSE">Basse</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {selectedStatutCommercial === 'CLIENT' && (
                <Select value={selectedContrat} onValueChange={setSelectedContrat}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type contrat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous contrats</SelectItem>
                    <SelectItem value="STANDARD">Standard</SelectItem>
                    <SelectItem value="PREMIUM">Premium</SelectItem>
                    <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                    <SelectItem value="GOUVERNEMENTAL">Gouvernemental</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedLocalisation('all');
                  setSelectedStatutCommercial('all');
                  setSelectedPriorite('all');
                  setSelectedContrat('all');
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>

              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des organismes */}
        <div className={`${
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
            : 'space-y-4'
        }`}>
          {filteredOrganismes.map((organisme) => {
            const TypeIcon = getTypeIcon(organisme.type);
            const StatutIcon = getStatutIcon(organisme.status);

            return (
              <Card
                key={organisme.code}
                className={`border-l-4 ${organisme.status === 'CLIENT' ? 'border-l-green-500' : 'border-l-blue-500'}
                           hover:shadow-lg transition-all duration-300`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                      <TypeIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg leading-tight truncate" title={organisme.nom}>
                        {organisme.nom}
                      </h3>
                      <p className="text-gray-600 text-sm truncate">{organisme.type}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Code: <span className="font-mono">{organisme.code}</span>
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={getStatutColor(organisme.status)}>
                      <StatutIcon className="h-3 w-3 mr-1" />
                      {organisme.status}
                    </Badge>

                    {organisme.status === 'PROSPECT' && organisme.prospectInfo && (
                      <Badge className={getPrioriteColor(organisme.prospectInfo.priorite)}>
                        {organisme.prospectInfo.priorite}
                      </Badge>
                    )}

                    {organisme.status === 'CLIENT' && organisme.clientInfo && (
                      <Badge className={getContratTypeColor(organisme.clientInfo.type)}>
                        {organisme.clientInfo.type}
                      </Badge>
                    )}
                  </div>

                  {/* Informations clés */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{organisme.localisation}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{organisme.stats.totalUsers} utilisateurs</span>
                    </div>
                    {organisme.status === 'CLIENT' && organisme.clientInfo && (
                      <div className="flex items-center text-sm text-green-600 font-medium">
                        <Euro className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{formatPrix(organisme.clientInfo.montantAnnuel)}/an</span>
                      </div>
                    )}
                    {organisme.status === 'PROSPECT' && (
                      <div className="flex items-center text-sm text-blue-600">
                        <Target className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>Valeur estimée: {formatPrix(15000000)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(
                        organisme.status === 'PROSPECT'
                          ? '/super-admin/organismes-prospects'
                          : '/super-admin/organismes-clients'
                      )}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Gérer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setLoadingStates(prev => ({ ...prev, viewingDetails: organisme.code }));
                        setTimeout(() => {
                          setLoadingStates(prev => ({ ...prev, viewingDetails: null }));
                          toast.success(`📊 Détails de ${organisme.nom}`);
                        }, 1000);
                      }}
                      disabled={loadingStates.viewingDetails === organisme.code}
                    >
                      {loadingStates.viewingDetails === organisme.code ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredOrganismes.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun organisme trouvé</h3>
              <p className="text-gray-600 mb-4">
                Aucun organisme ne correspond aux critères de recherche actuels.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedLocalisation('all');
                  setSelectedStatutCommercial('all');
                  setSelectedPriorite('all');
                  setSelectedContrat('all');
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>

        {/* Footer avec résumé */}
        {filteredOrganismes.length > 0 && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Affichage de {filteredOrganismes.length} organisme(s) sur {organismes.length} total
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-blue-600">
                    {filteredOrganismes.filter(o => o.status === 'PROSPECT').length} Prospects
                  </span>
                  <span className="text-green-600">
                    {filteredOrganismes.filter(o => o.status === 'CLIENT').length} Clients
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
