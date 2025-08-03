'use client';

import { useState, useMemo } from 'react';
import { getAllAdministrations, getAllServices } from '@/lib/data/gabon-administrations';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Database as DatabaseIcon,
  Search,
  Download,
  RefreshCw,
  Building2,
  Settings,
  Eye,
  Filter,
  BarChart3,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

export default function TestDataPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const allAdministrations = getAllAdministrations();
  const allServicesFromJSON = getAllServices();

  // Calculs statistiques
  const stats = useMemo(() => {
    const typeCount = {};
    const localisationCount = {};
    let totalServices = 0;

    allAdministrations.forEach(org => {
      const type = org.type || 'Autre';
      const localisation = org.localisation || 'Non spécifiée';

      typeCount[type] = (typeCount[type] || 0) + 1;
      localisationCount[localisation] = (localisationCount[localisation] || 0) + 1;
      totalServices += org.services?.length || 0;
    });

    return {
      totalOrganismes: allAdministrations.length,
      totalServices: allServicesFromJSON.length,
      totalServicesFromOrgs: totalServices,
      types: Object.keys(typeCount).length,
      localisations: Object.keys(localisationCount).length,
      typeCount,
      localisationCount
    };
  }, [allAdministrations, allServicesFromJSON]);

  // Filtrage des données
  const filteredOrganisations = useMemo(() => {
    return allAdministrations.filter(org => {
      const matchesSearch = searchTerm === '' ||
        org.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === '' || org.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [allAdministrations, searchTerm, selectedType]);

  const handleRefreshData = async () => {
    setIsLoading(true);
    toast.loading('Actualisation des données...');

    try {
      // Simulation d'actualisation
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Données actualisées avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'actualisation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateData = async () => {
    setIsValidating(true);
    toast.loading('Validation des données en cours...');

    try {
      // Simulation de validation
      await new Promise(resolve => setTimeout(resolve, 3000));

      const errors = allAdministrations.filter(org => !org.code || !org.nom).length;
      const warnings = allAdministrations.filter(org => !org.services || org.services.length === 0).length;

      if (errors > 0) {
        toast.error(`${errors} erreur(s) détectée(s) dans les données`);
      } else if (warnings > 0) {
        toast.warning(`${warnings} avertissement(s) trouvé(s)`);
      } else {
        toast.success('Validation réussie - Aucune erreur détectée');
      }
    } catch (error) {
      toast.error('Erreur lors de la validation');
    } finally {
      setIsValidating(false);
    }
  };

  const handleExportData = () => {
    try {
      const dataToExport = {
        timestamp: new Date().toISOString(),
        statistics: stats,
        organismes: allAdministrations,
        services: allServicesFromJSON
      };

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gabon-administrations-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Export réalisé avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    }
  };

  const uniqueTypes = Array.from(new Set(allAdministrations.map(org => org.type).filter(Boolean)));

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto p-6 space-y-8">
        <PageHeader
          title="Test & Validation des Données"
          description="Visualisez, testez et validez les données des organismes gabonais"
                      icon={DatabaseIcon}
          badge={{ text: `${stats.totalOrganismes} organismes`, variant: 'secondary' }}
          actions={
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRefreshData}
                disabled={isLoading || isValidating}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Actualiser
              </Button>
              <Button
                variant="outline"
                onClick={handleValidateData}
                disabled={isLoading || isValidating}
              >
                {isValidating ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Valider
              </Button>
              <Button
                variant="outline"
                onClick={handleExportData}
                disabled={isLoading || isValidating}
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          }
        />

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Organismes Total"
            value={stats.totalOrganismes}
            description="Organismes chargés depuis JSON"
            icon={Building2}
            badge={{ text: 'Actif', variant: 'default' }}
          />
          <StatCard
            title="Services Total"
            value={stats.totalServices}
            description="Services extraits et catalogués"
            icon={Settings}
            badge={{ text: 'Extraction', variant: 'secondary' }}
          />
          <StatCard
            title="Types d'Organismes"
            value={stats.types}
            description="Catégories différentes"
            icon={BarChart3}
          />
          <StatCard
            title="Localisations"
            value={stats.localisations}
            description="Zones géographiques"
            icon={Filter}
          />
        </div>

        {/* Interface de filtrage et recherche */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Recherche et Filtres
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher par nom, code ou description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tous les types</option>
                  {uniqueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {viewMode === 'grid' ? 'Liste' : 'Grille'}
                </Button>
              </div>
            </div>

            {searchTerm || selectedType ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="h-4 w-4" />
                <span>{filteredOrganisations.length} résultat(s) trouvé(s)</span>
                {(searchTerm || selectedType) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedType('');
                    }}
                  >
                    Effacer filtres
                  </Button>
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Onglets de visualisation */}
        <Tabs defaultValue="organismes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="organismes">
              Organismes ({filteredOrganisations.length})
            </TabsTrigger>
            <TabsTrigger value="statistiques">
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="validation">
              Validation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="organismes" className="space-y-6">
            {filteredOrganisations.length === 0 ? (
              <EmptyState
                icon={Search}
                title="Aucun organisme trouvé"
                description="Essayez de modifier vos critères de recherche"
                action={{
                  label: "Réinitialiser filtres",
                  onClick: () => {
                    setSearchTerm('');
                    setSelectedType('');
                  }
                }}
              />
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
                {filteredOrganisations.map((org, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg line-clamp-2">{org.nom}</CardTitle>
                        <Badge variant="outline">{org.code || 'NO_CODE'}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <Badge variant="secondary">{org.type || 'N/A'}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Localisation:</span>
                          <span className="font-medium">{org.localisation || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Services:</span>
                          <span className="font-bold text-blue-600">{org.services?.length || 0}</span>
                        </div>
                        {org.description && (
                          <p className="text-gray-600 text-xs mt-2 line-clamp-2">
                            {org.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="statistiques" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.typeCount).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm">{type}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(Number(count) / stats.totalOrganismes) * 100}%` }}
                            />
                          </div>
                          <Badge variant="outline">{String(count)}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Répartition par Localisation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.localisationCount).slice(0, 8).map(([localisation, count]) => (
                      <div key={localisation} className="flex items-center justify-between">
                        <span className="text-sm">{localisation}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${(Number(count) / stats.totalOrganismes) * 100}%` }}
                            />
                          </div>
                          <Badge variant="outline">{String(count)}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="validation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Rapport de Validation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-green-900">Codes valides</div>
                        <div className="text-sm text-green-700">
                          {allAdministrations.filter(org => org.code).length}/{stats.totalOrganismes}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <Settings className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-900">Avec services</div>
                        <div className="text-sm text-blue-700">
                          {allAdministrations.filter(org => org.services && org.services.length > 0).length}/{stats.totalOrganismes}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      <div>
                        <div className="font-medium text-amber-900">À vérifier</div>
                        <div className="text-sm text-amber-700">
                          {allAdministrations.filter(org => !org.services || org.services.length === 0).length}/{stats.totalOrganismes}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleValidateData} disabled={isValidating} className="w-full">
                    {isValidating ? (
                      <LoadingSpinner size="sm" text="Validation en cours..." />
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Lancer validation complète
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
}
