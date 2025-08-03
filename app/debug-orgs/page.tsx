'use client';

import { useState, useMemo, useCallback } from 'react';
import { getAllAdministrations, getAllServices } from '@/lib/data/gabon-administrations';
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
  Bug,
  Search,
  Download,
  Filter,
  Building2,
  Settings,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  TrendingUp,
  BarChart3,
  Map,
  Code,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

interface DebugReport {
  missingCodes: any[];
  missingNames: any[];
  missingServices: any[];
  duplicateCodes: any[];
  inconsistentTypes: any[];
  inconsistentLocalisations: any[];
}

export default function DebugOrgsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [debugReport, setDebugReport] = useState<DebugReport | null>(null);

  const allAdministrations = getAllAdministrations();
  const allServices = getAllServices();

  // Analyse et statistiques détaillées
  const analysis = useMemo(() => {
    const typeCount = {};
    const localisationCount = {};
    const codeCount = {};
    let totalServices = 0;
    let withServices = 0;
    let withCodes = 0;
    let withDescriptions = 0;

    allAdministrations.forEach(org => {
      const type = org.type || 'Autre';
      const localisation = org.localisation || 'Non spécifiée';

      typeCount[type] = (typeCount[type] || 0) + 1;
      localisationCount[localisation] = (localisationCount[localisation] || 0) + 1;

      if (org.code) {
        withCodes++;
        codeCount[org.code] = (codeCount[org.code] || 0) + 1;
      }

      if (org.services && org.services.length > 0) {
        withServices++;
        totalServices += org.services.length;
      }

      if (org.description) {
        withDescriptions++;
      }
    });

    // Détection des codes dupliqués
    const duplicateCodes = Object.entries(codeCount)
      .filter(([_, count]) => Number(count) > 1)
      .map(([code]) => code);

    return {
      total: allAdministrations.length,
      totalServices: allServices.length,
      totalServicesFromOrgs: totalServices,
      withServices,
      withCodes,
      withDescriptions,
      completionRate: Math.round((withCodes / allAdministrations.length) * 100),
      serviceRate: Math.round((withServices / allAdministrations.length) * 100),
      typeCount,
      localisationCount,
      duplicateCodes,
      issues: {
        missingCodes: allAdministrations.length - withCodes,
        missingServices: allAdministrations.length - withServices,
        duplicates: duplicateCodes.length
      }
    };
  }, [allAdministrations, allServices]);

  // Rapport de débogage détaillé
  const runDetailedAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    toast.loading('Analyse en cours...');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const report: DebugReport = {
        missingCodes: allAdministrations.filter(org => !org.code),
        missingNames: allAdministrations.filter(org => !org.nom || org.nom.trim() === ''),
        missingServices: allAdministrations.filter(org => !org.services || org.services.length === 0),
        duplicateCodes: [],
        inconsistentTypes: [],
        inconsistentLocalisations: []
      };

      // Détection des codes dupliqués avec détails
      const codeMap = new Map();
      allAdministrations.forEach((org, index) => {
        if (org.code) {
          if (codeMap.has(org.code)) {
            codeMap.get(org.code).push({ ...org, originalIndex: index });
          } else {
            codeMap.set(org.code, [{ ...org, originalIndex: index }]);
          }
        }
      });

      report.duplicateCodes = Array.from(codeMap.entries())
        .filter(([_, orgs]) => orgs.length > 1)
        .map(([code, orgs]) => ({ code, organismes: orgs }));

      // Détection des incohérences de type
      const typeVariations = new Map();
      allAdministrations.forEach(org => {
        if (org.type) {
          const similar = org.type.toLowerCase().replace(/[^a-z]/g, '');
          if (typeVariations.has(similar)) {
            typeVariations.get(similar).add(org.type);
          } else {
            typeVariations.set(similar, new Set([org.type]));
          }
        }
      });

      report.inconsistentTypes = Array.from(typeVariations.entries())
        .filter(([_, variations]) => variations.size > 1)
        .map(([base, variations]) => ({ base, variations: Array.from(variations) }));

      setDebugReport(report);
      toast.success('Analyse terminée');
    } catch (error) {
      toast.error('Erreur lors de l\'analyse');
    } finally {
      setIsAnalyzing(false);
    }
  }, [allAdministrations]);

  // Filtrage des organismes
  const filteredOrganisations = useMemo(() => {
    let filtered = allAdministrations;

    if (searchTerm) {
      filtered = filtered.filter(org =>
        org.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedIssue) {
      switch (selectedIssue) {
        case 'missing-codes':
          filtered = filtered.filter(org => !org.code);
          break;
        case 'missing-services':
          filtered = filtered.filter(org => !org.services || org.services.length === 0);
          break;
        case 'missing-descriptions':
          filtered = filtered.filter(org => !org.description);
          break;
        case 'complete':
          filtered = filtered.filter(org => org.code && org.services && org.services.length > 0 && org.description);
          break;
      }
    }

    return filtered;
  }, [allAdministrations, searchTerm, selectedIssue]);

  const handleExportDebugReport = () => {
    try {
      const reportData = {
        timestamp: new Date().toISOString(),
        summary: analysis,
        detailedReport: debugReport,
        filteredData: filteredOrganisations
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `debug-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Rapport de debug exporté');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    }
  };

  const getIssueIcon = (issue: string) => {
    switch (issue) {
      case 'missing-codes': return <Code className="h-4 w-4 text-red-500" />;
      case 'missing-services': return <Settings className="h-4 w-4 text-amber-500" />;
      case 'missing-descriptions': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'complete': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Bug className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <PageHeader
        title="Debug - Organismes Gabonais"
        description="Outils de débogage et d'analyse des données des organismes"
        icon={<Bug className="h-8 w-8 text-orange-600" />}
        badge={{ text: `${analysis.total} organismes`, variant: 'outline' }}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={runDetailedAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <LoadingSpinner size="sm" />
              ) : (
                <AlertTriangle className="h-4 w-4 mr-2" />
              )}
              Analyser
            </Button>
            <Button
              variant="outline"
              onClick={handleExportDebugReport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      {/* Statistiques de santé */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Organismes Total"
          value={analysis.total}
          description="Organismes dans la base"
          icon={<Building2 className="h-5 w-5" />}
          trend={{ value: 100, label: "Base complète" }}
        />
        <StatCard
          title="Taux de Completion"
          value={`${analysis.completionRate}%`}
          description="Organismes avec codes"
          icon={<CheckCircle className="h-5 w-5" />}
          trend={{
            value: analysis.completionRate > 80 ? 15 : -10,
            label: analysis.completionRate > 80 ? "Bon" : "À améliorer"
          }}
        />
        <StatCard
          title="Avec Services"
          value={`${analysis.serviceRate}%`}
          description="Organismes avec services"
          icon={<Settings className="h-5 w-5" />}
          trend={{
            value: analysis.serviceRate > 70 ? 12 : -8,
            label: analysis.serviceRate > 70 ? "Bon" : "Incomplet"
          }}
        />
        <StatCard
          title="Problèmes Détectés"
          value={analysis.issues.missingCodes + analysis.issues.missingServices + analysis.issues.duplicates}
          description="Issues à résoudre"
          icon={<XCircle className="h-5 w-5" />}
          badge={{ text: 'Debug', variant: 'destructive' }}
        />
      </div>

      {/* Interface de filtrage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par nom, code ou type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedIssue}
                onChange={(e) => setSelectedIssue(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les organismes</option>
                <option value="missing-codes">Sans code</option>
                <option value="missing-services">Sans services</option>
                <option value="missing-descriptions">Sans description</option>
                <option value="complete">Complets</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {(searchTerm || selectedIssue) && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Info className="h-4 w-4" />
              <span>{filteredOrganisations.length} résultat(s) affiché(s)</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedIssue('');
                }}
              >
                Réinitialiser
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Onglets de débogage */}
      <Tabs defaultValue="organismes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="organismes">
            Organismes ({filteredOrganisations.length})
          </TabsTrigger>
          <TabsTrigger value="statistiques">
            Statistiques
          </TabsTrigger>
          <TabsTrigger value="problemes">
            Problèmes
            {analysis.issues.missingCodes + analysis.issues.missingServices > 0 && (
              <Badge variant="destructive" className="ml-2">
                {analysis.issues.missingCodes + analysis.issues.missingServices}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rapport">
            Rapport
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organismes" className="space-y-6">
          {filteredOrganisations.length === 0 ? (
            <EmptyState
              icon={<Search className="h-12 w-12" />}
              title="Aucun organisme trouvé"
              description="Modifiez vos critères de recherche ou filtres"
              action={{
                label: "Réinitialiser filtres",
                onClick: () => {
                  setSearchTerm('');
                  setSelectedIssue('');
                }
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrganisations.map((org, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{org.nom}</CardTitle>
                      <div className="flex flex-col gap-1">
                        <Badge variant={org.code ? "default" : "destructive"}>
                          {org.code || 'NO_CODE'}
                        </Badge>
                        {selectedIssue && getIssueIcon(selectedIssue)}
                      </div>
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
                        <Badge variant={org.services && org.services.length > 0 ? "default" : "outline"}>
                          {org.services?.length || 0}
                        </Badge>
                      </div>
                      {showDetails && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Description:</span>
                            <Badge variant={org.description ? "default" : "outline"}>
                              {org.description ? '✓' : '✗'}
                            </Badge>
                          </div>
                          {org.description && (
                            <p className="text-gray-600 text-xs mt-2 line-clamp-2">
                              {org.description}
                            </p>
                          )}
                        </>
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
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Répartition par Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analysis.typeCount).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm">{type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(Number(count) / analysis.total) * 100}%` }}
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
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Répartition Géographique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analysis.localisationCount).slice(0, 8).map(([localisation, count]) => (
                    <div key={localisation} className="flex items-center justify-between">
                      <span className="text-sm">{localisation}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(Number(count) / analysis.total) * 100}%` }}
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

        <TabsContent value="problemes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <XCircle className="h-5 w-5" />
                  Codes Manquants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {analysis.issues.missingCodes}
                </div>
                <p className="text-sm text-red-600">
                  Organismes sans code d'identification
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => setSelectedIssue('missing-codes')}
                >
                  Voir les détails
                </Button>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700">
                  <AlertTriangle className="h-5 w-5" />
                  Services Manquants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {analysis.issues.missingServices}
                </div>
                <p className="text-sm text-amber-600">
                  Organismes sans services définis
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => setSelectedIssue('missing-services')}
                >
                  Voir les détails
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Info className="h-5 w-5" />
                  Codes Dupliqués
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {analysis.issues.duplicates}
                </div>
                <p className="text-sm text-blue-600">
                  Codes utilisés plusieurs fois
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={runDetailedAnalysis}
                  disabled={isAnalyzing}
                >
                  Analyser
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rapport" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Rapport de Debug
              </CardTitle>
            </CardHeader>
            <CardContent>
              {debugReport ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-red-600">{debugReport.missingCodes.length}</div>
                      <div className="text-sm text-gray-600">Sans codes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-600">{debugReport.missingServices.length}</div>
                      <div className="text-sm text-gray-600">Sans services</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{debugReport.duplicateCodes.length}</div>
                      <div className="text-sm text-gray-600">Codes dupliqués</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{debugReport.inconsistentTypes.length}</div>
                      <div className="text-sm text-gray-600">Types incohérents</div>
                    </div>
                  </div>
                  <Button onClick={handleExportDebugReport} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter le rapport complet
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Button onClick={runDetailedAnalysis} disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <LoadingSpinner size="sm" text="Génération du rapport..." />
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Générer le rapport détaillé
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
