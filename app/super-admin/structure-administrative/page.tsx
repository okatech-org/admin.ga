'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { StructureAdministrativeComplete } from '@/components/organizations/structure-administrative-complete';
import { toast } from 'sonner';
import {
  Building,
  Crown,
  Shield,
  Users,
  MapPin,
  Phone,
  Mail,
  Search,
  RefreshCw,
  Download,
  Eye,
  Edit,
  Loader2,
  AlertCircle,
  Briefcase,
  Globe,
  ExternalLink
} from 'lucide-react';

interface LoadingStates {
  loading: boolean;
  refreshing: boolean;
  exporting: boolean;
  updating: string | null;
  error: string | null;
}

interface StructureStats {
  totalOrganismes: number;
  totalMinisteres: number;
  totalDirections: number;
  totalEtablissements: number;
  totalProvinces: number;
  totalMairies: number;
  hierarchieNiveaux: number;
  organismsActifs: number;
}

interface OrganismeStructure {
  id: string;
  code: string;
  nom: string;
  type: 'PRESIDENCE' | 'PRIMATURE' | 'MINISTERE' | 'DIRECTION_GENERALE' | 'GOUVERNORAT' | 'MAIRIE' | 'AUTRE';
  niveau: number;
  responsable: string;
  contactEmail: string;
  contactTelephone: string;
  statut: 'ACTIF' | 'INACTIF' | 'EN_REORGANISATION';
  effectif: number;
  budget?: number;
}

export default function StructureAdministrativePage() {
  const [activeTab, setActiveTab] = useState<string>('structure');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedNiveau, setSelectedNiveau] = useState<string>('all');

  const [stats, setStats] = useState<StructureStats | null>(null);
  const [organismes, setOrganismes] = useState<OrganismeStructure[]>([]);

  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    loading: true,
    refreshing: false,
    exporting: false,
    updating: null,
    error: null
  });

  // Données simulées
  const organisme_data: OrganismeStructure[] = [
    {
      id: 'PRESIDENCE',
      code: 'PRES',
      nom: 'Présidence de la République',
      type: 'PRESIDENCE',
      niveau: 1,
      responsable: 'Brice Clotaire Oligui Nguema',
      contactEmail: 'president@presidence.ga',
      contactTelephone: '+241 01 72 20 20',
      statut: 'ACTIF',
      effectif: 450
    },
    {
      id: 'PRIMATURE',
      code: 'PRIM',
      nom: 'Primature',
      type: 'PRIMATURE',
      niveau: 2,
      responsable: 'Alexandre Barro Chambrier',
      contactEmail: 'premier.ministre@primature.ga',
      contactTelephone: '+241 01 72 30 30',
      statut: 'ACTIF',
      effectif: 280
    },
    {
      id: 'MIN_ECONOMIE',
      code: 'MEFP',
      nom: 'Ministère de l\'Économie et des Finances',
      type: 'MINISTERE',
      niveau: 3,
      responsable: 'Nicole Janine Lydie Roboty Mbou',
      contactEmail: 'ministre@economie.ga',
      contactTelephone: '+241 01 76 40 40',
      statut: 'ACTIF',
      effectif: 850,
      budget: 45000000000
    },
    {
      id: 'MIN_INTERIEUR',
      code: 'MINT',
      nom: 'Ministère de l\'Intérieur',
      type: 'MINISTERE',
      niveau: 3,
      responsable: 'Hermann Immongault',
      contactEmail: 'ministre@interieur.ga',
      contactTelephone: '+241 01 76 50 50',
      statut: 'ACTIF',
      effectif: 1250,
      budget: 35000000000
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, loading: true, error: null }));
      await new Promise(resolve => setTimeout(resolve, 1200));

      const statsData: StructureStats = {
        totalOrganismes: 307,
        totalMinisteres: 25,
        totalDirections: 67,
        totalEtablissements: 89,
        totalProvinces: 9,
        totalMairies: 117,
        hierarchieNiveaux: 6,
        organismsActifs: 299
      };

      setStats(statsData);
      setOrganismes(organisme_data);
      toast.success('✅ Structure administrative chargée');

    } catch (error) {
      console.error('Erreur chargement structure:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setLoadingStates(prev => ({ ...prev, error: errorMessage }));
      toast.error(`❌ Erreur: ${errorMessage}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const handleRefreshData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, refreshing: true }));
      await loadData();
    } finally {
      setLoadingStates(prev => ({ ...prev, refreshing: false }));
    }
  }, [loadData]);

  const handleUpdateOrganisme = useCallback(async (organismeId: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, updating: organismeId }));
      await new Promise(resolve => setTimeout(resolve, 1200));
      toast.success('✅ Organisme mis à jour');
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      toast.error('❌ Erreur lors de la mise à jour');
    } finally {
      setLoadingStates(prev => ({ ...prev, updating: null }));
    }
  }, []);

  const handleExportStructure = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, exporting: true }));
      await new Promise(resolve => setTimeout(resolve, 1500));

      const exportData = {
        exported_at: new Date().toISOString(),
        structure_administrative: organismes,
        statistiques: stats,
        total_organismes: organismes.length
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `structure-administrative-gabon-${new Date().toISOString().split('T')[0]}.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('✅ Structure exportée avec succès');
    } catch (error) {
      console.error('Erreur export:', error);
      toast.error('❌ Erreur lors de l\'export');
    } finally {
      setLoadingStates(prev => ({ ...prev, exporting: false }));
    }
  }, [organismes, stats]);

  const filteredOrganismes = useMemo(() => {
    return organismes.filter(org => {
      const matchSearch = org.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.responsable.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = selectedType === 'all' || org.type === selectedType;
      const matchNiveau = selectedNiveau === 'all' || org.niveau.toString() === selectedNiveau;

      return matchSearch && matchType && matchNiveau;
    });
  }, [organismes, searchTerm, selectedType, selectedNiveau]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PRESIDENCE': return Crown;
      case 'PRIMATURE': return Shield;
      case 'MINISTERE': return Building;
      case 'DIRECTION_GENERALE': return Briefcase;
      case 'GOUVERNORAT': return MapPin;
      case 'MAIRIE': return Globe;
      default: return Building;
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'ACTIF': return 'bg-green-100 text-green-800 border-green-300';
      case 'INACTIF': return 'bg-red-100 text-red-800 border-red-300';
      case 'EN_REORGANISATION': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loadingStates.loading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chargement de la structure administrative...</h3>
              <p className="text-muted-foreground">Analyse de la hiérarchie officielle gabonaise</p>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Alerte d'erreur */}
        {loadingStates.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Erreur système</p>
                <p className="text-sm text-red-600">{loadingStates.error}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLoadingStates(prev => ({ ...prev, error: null }))}
            >
              ✕
            </Button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Crown className="h-8 w-8 text-purple-600" />
                Structure Administrative Officielle
              </h1>
              <p className="text-gray-600">
                Hiérarchie complète des {stats?.totalOrganismes || 0} organismes publics gabonais
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
                onClick={handleExportStructure}
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

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Organismes</p>
                  <p className="text-2xl font-bold">{stats?.totalOrganismes || 0}</p>
                  <p className="text-purple-100 text-xs">Structure complète</p>
                </div>
                <Building className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Ministères</p>
                  <p className="text-2xl font-bold">{stats?.totalMinisteres || 0}</p>
                  <p className="text-blue-100 text-xs">Niveau central</p>
                </div>
                <Shield className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Directions</p>
                  <p className="text-2xl font-bold">{stats?.totalDirections || 0}</p>
                  <p className="text-green-100 text-xs">Structures techniques</p>
                </div>
                <Briefcase className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Collectivités</p>
                  <p className="text-2xl font-bold">{(stats?.totalProvinces || 0) + (stats?.totalMairies || 0)}</p>
                  <p className="text-orange-100 text-xs">Niveau territorial</p>
                </div>
                <MapPin className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="structure">Structure Hiérarchique</TabsTrigger>
            <TabsTrigger value="organismes">Liste des Organismes</TabsTrigger>
            <TabsTrigger value="composant">Vue Composant</TabsTrigger>
          </TabsList>

          <TabsContent value="structure" className="space-y-6">
            {/* Filtres */}
            <Card>
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

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Type d'organisme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous types</SelectItem>
                      <SelectItem value="PRESIDENCE">Présidence</SelectItem>
                      <SelectItem value="PRIMATURE">Primature</SelectItem>
                      <SelectItem value="MINISTERE">Ministères</SelectItem>
                      <SelectItem value="DIRECTION_GENERALE">Directions</SelectItem>
                      <SelectItem value="GOUVERNORAT">Gouvernorats</SelectItem>
                      <SelectItem value="MAIRIE">Mairies</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedNiveau} onValueChange={setSelectedNiveau}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous niveaux</SelectItem>
                      <SelectItem value="1">Niveau 1</SelectItem>
                      <SelectItem value="2">Niveau 2</SelectItem>
                      <SelectItem value="3">Niveau 3</SelectItem>
                      <SelectItem value="4">Niveau 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Liste des organismes filtrés */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredOrganismes.map((organisme) => {
                const TypeIcon = getTypeIcon(organisme.type);

                return (
                  <Card
                    key={organisme.id}
                    className={`border-l-4 ${
                      organisme.niveau === 1 ? 'border-l-purple-500' :
                      organisme.niveau === 2 ? 'border-l-blue-500' :
                      organisme.niveau === 3 ? 'border-l-green-500' :
                      'border-l-gray-500'
                    } hover:shadow-lg transition-all duration-300`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${
                          organisme.niveau === 1 ? 'bg-purple-600' :
                          organisme.niveau === 2 ? 'bg-blue-600' :
                          organisme.niveau === 3 ? 'bg-green-600' :
                          'bg-gray-600'
                        }`}>
                          <TypeIcon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg leading-tight" title={organisme.nom}>
                            {organisme.nom}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {organisme.type} - Niveau {organisme.niveau}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Code: <span className="font-mono">{organisme.code}</span>
                          </p>
                        </div>
                      </div>

                      {/* Statut et informations */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className={getStatutColor(organisme.statut)}>
                          {organisme.statut}
                        </Badge>
                        <Badge variant="outline">
                          {organisme.effectif} agents
                        </Badge>
                        {organisme.budget && (
                          <Badge variant="outline" className="text-green-600">
                            {Math.round(organisme.budget / 1000000000)}Md FCFA
                          </Badge>
                        )}
                      </div>

                      {/* Responsable */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{organisme.responsable}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{organisme.contactEmail}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{organisme.contactTelephone}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-3 gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateOrganisme(organisme.id)}
                          disabled={loadingStates.updating === organisme.id}
                        >
                          {loadingStates.updating === organisme.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Edit className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info(`📊 Détails de ${organisme.nom}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(organisme.contactEmail);
                            toast.success('Email copié');
                          }}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="organismes">
            <Card>
              <CardHeader>
                <CardTitle>Liste Complète des Organismes</CardTitle>
                <CardDescription>
                  {filteredOrganismes.length} organisme(s) affiché(s) sur {organismes.length} total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredOrganismes.map((organisme) => (
                    <div
                      key={organisme.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">Niveau {organisme.niveau}</Badge>
                        <div>
                          <h4 className="font-medium">{organisme.nom}</h4>
                          <p className="text-sm text-gray-600">{organisme.responsable}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatutColor(organisme.statut)}>
                          {organisme.statut}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info(`Navigation vers ${organisme.nom}`)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="composant">
            <div className="bg-gray-50 rounded-lg p-6">
              <StructureAdministrativeComplete />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
}
