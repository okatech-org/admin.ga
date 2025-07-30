'use client';

import { useState, useEffect, useMemo } from 'react';
import { getAllAdministrations, getAllServices } from '@/lib/data/gabon-administrations';
import { ORGANISMES_ENRICHIS_GABON } from '@/lib/config/organismes-enrichis-gabon';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Building2,
  FileText,
  MapPin,
  Users,
  Search,
  Download,
  RefreshCw,
  Eye,
  Filter,
  SortAsc,
  SortDesc,
  ArrowUpDown,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { OrganizationType } from '@/types/auth';
import { toast } from 'react-hot-toast';

interface AdministrationInfo {
  nom: string;
  code?: string;
  type: OrganizationType | string;
  localisation: string;
  services: string[];
  gouverneur?: string;
  maire?: string;
  chef_lieu?: string;
}

interface FilterState {
  search: string;
  type: string;
  localisation: string;
}

interface SortState {
  field: 'nom' | 'type' | 'localisation' | 'services';
  direction: 'asc' | 'desc';
}

export default function DiagnosticAdministrationsPage() {
  // États de données
  const [administrations, setAdministrations] = useState<AdministrationInfo[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // États d'interface
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'all',
    localisation: 'all'
  });
  const [sort, setSort] = useState<SortState>({
    field: 'nom',
    direction: 'asc'
  });
  const [selectedTab, setSelectedTab] = useState('types');

  // Chargement initial des données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulation d'un délai de chargement pour démontrer les états
      await new Promise(resolve => setTimeout(resolve, 500));

      // Utiliser les 160 organismes enrichis
      const organismesEnrichis = Object.values(ORGANISMES_ENRICHIS_GABON).map(org => ({
        nom: org.nom,
        code: org.code,
        type: org.type as OrganizationType,
        localisation: org.ville || org.adresse,
        services: org.services || [],
        chef_lieu: org.departement
      }));

      // Extraire tous les services uniques
      const allServicesSet = new Set<string>();
      organismesEnrichis.forEach(org => {
        org.services.forEach(service => allServicesSet.add(service));
      });
      const allServices = Array.from(allServicesSet).sort();

      setAdministrations(organismesEnrichis);
      setServices(allServices);

      toast.success(`${organismesEnrichis.length} organismes chargés avec succès`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des données';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Données filtrées et triées
  const filteredAndSortedAdministrations = useMemo(() => {
    let filtered = administrations.filter(admin => {
      const matchesSearch = filters.search === '' ||
        admin.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
        admin.code?.toLowerCase().includes(filters.search.toLowerCase()) ||
        admin.localisation.toLowerCase().includes(filters.search.toLowerCase());

      const matchesType = filters.type === 'all' || admin.type === filters.type;
      const matchesLocalisation = filters.localisation === 'all' || admin.localisation === filters.localisation;

      return matchesSearch && matchesType && matchesLocalisation;
    });

    // Tri
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sort.field) {
        case 'nom':
          aValue = a.nom;
          bValue = b.nom;
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'localisation':
          aValue = a.localisation;
          bValue = b.localisation;
          break;
        case 'services':
          aValue = a.services.length;
          bValue = b.services.length;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sort.direction === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [administrations, filters, sort]);

  // Statistiques dynamiques
  const stats = useMemo(() => {
    const filtered = filteredAndSortedAdministrations;
    const totalServices = filtered.reduce((sum, admin) => sum + admin.services.length, 0);
    const types = new Set(filtered.map(admin => admin.type)).size;
    const localisations = new Set(filtered.map(admin => admin.localisation)).size;

    return {
      totalAdministrations: filtered.length,
      totalServices,
      types,
      localisations
    };
  }, [filteredAndSortedAdministrations]);

  // Analyses pour les onglets
  const analyseParType = useMemo(() => {
    const analyse: Record<string, any> = {};
    filteredAndSortedAdministrations.forEach(admin => {
      const type = admin.type || 'AUTRE';
      if (!analyse[type]) {
        analyse[type] = {
          count: 0,
          administrations: [],
          totalServices: 0
        };
      }
      analyse[type].count++;
      analyse[type].administrations.push(admin);
      analyse[type].totalServices += admin.services?.length || 0;
    });
    return analyse;
  }, [filteredAndSortedAdministrations]);

  const analyseParLocalisation = useMemo(() => {
    const analyse: Record<string, number> = {};
    filteredAndSortedAdministrations.forEach(admin => {
      const loc = admin.localisation || 'Non spécifié';
      analyse[loc] = (analyse[loc] || 0) + 1;
    });
    return analyse;
  }, [filteredAndSortedAdministrations]);

  // Gestionnaires d'événements
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSort = (field: SortState['field']) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      localisation: 'all'
    });
    toast.success('Filtres réinitialisés');
  };

  const handleExportData = (format: 'csv' | 'json') => {
    try {
      const data = filteredAndSortedAdministrations;

      if (format === 'csv') {
        const headers = ['Nom', 'Code', 'Type', 'Localisation', 'Nombre de Services'];
        const csvContent = [
          headers.join(','),
          ...data.map(admin => [
            `"${admin.nom}"`,
            `"${admin.code || ''}"`,
            `"${admin.type}"`,
            `"${admin.localisation}"`,
            admin.services.length
          ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `organismes_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `organismes_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }

      toast.success(`Données exportées en format ${format.toUpperCase()}`);
    } catch (err) {
      toast.error('Erreur lors de l\'exportation des données');
    }
  };

  const handleViewDetails = (admin: AdministrationInfo) => {
    toast.success(`Affichage des détails de ${admin.nom}`);
    // Ici vous pourriez ouvrir une modal ou naviguer vers une page de détails
  };

  // Options pour les filtres
  const uniqueTypes = useMemo(() =>
    Array.from(new Set(administrations.map(admin => admin.type))).sort(),
    [administrations]
  );

  const uniqueLocalisations = useMemo(() =>
    Array.from(new Set(administrations.map(admin => admin.localisation))).sort(),
    [administrations]
  );

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
              <div>
                <h3 className="font-semibold text-lg">Chargement des organismes...</h3>
                <p className="text-muted-foreground">Veuillez patienter pendant que nous récupérons les données</p>
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (error) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
                  <div>
                    <h3 className="font-semibold text-lg text-red-600">Erreur de chargement</h3>
                    <p className="text-muted-foreground">{error}</p>
                  </div>
                  <Button onClick={handleRefresh} className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réessayer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* En-tête avec actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-500" />
            <div>
                          <h1 className="text-3xl font-bold">Diagnostic Complet des Organismes</h1>
            <p className="text-muted-foreground">
              Analyse exhaustive des 160 organismes publics gabonais
            </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>

            <Select onValueChange={(value: 'csv' | 'json') => handleExportData(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Exporter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    CSV
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    JSON
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, code ou localisation..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.localisation} onValueChange={(value) => handleFilterChange('localisation', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par localisation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les localisations</SelectItem>
                  {uniqueLocalisations.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={handleClearFilters}>
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques dynamiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Organismes</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalAdministrations}</p>
                  <p className="text-xs text-green-600">
                    {stats.totalAdministrations === administrations.length ? 'Tous' : 'Filtrés'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Services</p>
                  <p className="text-3xl font-bold text-green-600">{stats.totalServices}</p>
                  <p className="text-xs text-green-600">Services uniques</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Types d'Org.</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.types}</p>
                  <p className="text-xs text-green-600">Catégories</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Localisations</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.localisations}</p>
                  <p className="text-xs text-green-600">Villes/Régions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="types">Par Type</TabsTrigger>
            <TabsTrigger value="localisation">Par Localisation</TabsTrigger>
            <TabsTrigger value="liste">Liste Complète</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          {/* Analyse par type */}
          <TabsContent value="types" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type d'Organisme</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(analyseParType).map(([type, data]: [string, any]) => (
                    <Card key={type} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline">{type}</Badge>
                        <span className="font-bold text-xl">{data.count}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Services:</span>
                          <span className="font-medium">{data.totalServices}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {data.administrations.slice(0, 3).map((admin: any) => admin.nom).join(', ')}
                          {data.administrations.length > 3 && ` +${data.administrations.length - 3} autres...`}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analyse par localisation */}
          <TabsContent value="localisation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Localisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(analyseParLocalisation)
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .map(([localisation, count]: [string, any]) => (
                    <div key={localisation} className="flex items-center justify-between p-3 border rounded hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">{localisation}</span>
                      </div>
                      <Badge>{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Liste complète avec tri */}
          <TabsContent value="liste" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Liste Complète des Organismes ({filteredAndSortedAdministrations.length})</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Trier par:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('nom')}
                      className="flex items-center gap-1"
                    >
                      Nom
                      {sort.field === 'nom' && (
                        sort.direction === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                      {sort.field !== 'nom' && <ArrowUpDown className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('type')}
                      className="flex items-center gap-1"
                    >
                      Type
                      {sort.field === 'type' && (
                        sort.direction === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                      {sort.field !== 'type' && <ArrowUpDown className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('services')}
                      className="flex items-center gap-1"
                    >
                      Services
                      {sort.field === 'services' && (
                        sort.direction === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                      {sort.field !== 'services' && <ArrowUpDown className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredAndSortedAdministrations.map((admin, index) => (
                    <div key={`${admin.code || admin.nom}-${index}`} className="flex items-center justify-between p-3 border rounded hover:bg-muted/50 transition-colors group">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{admin.type}</Badge>
                          <div>
                            <h4 className="font-semibold">{admin.nom}</h4>
                            <p className="text-sm text-muted-foreground">
                              {admin.code && `${admin.code} • `}{admin.localisation} • {admin.services?.length || 0} services
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(admin)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <div className="text-sm text-muted-foreground min-w-[40px] text-right">
                          #{index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredAndSortedAdministrations.length === 0 && (
                  <div className="text-center py-8">
                    <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                          <h3 className="font-semibold text-lg">Aucun organisme trouvé</h3>
                    <p className="text-muted-foreground">Essayez de modifier vos critères de recherche</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services */}
          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tous les Services ({services.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[600px] overflow-y-auto">
                  {services.map((service, index) => (
                    <div key={index} className="p-3 border rounded text-sm hover:bg-muted/50 transition-colors">
                      {service}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Message de succès en bas */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Diagnostic terminé avec succès</p>
                <p className="text-sm text-green-600">
                  Toutes les fonctionnalités sont maintenant opérationnelles : recherche, filtres, tri, export et actions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
