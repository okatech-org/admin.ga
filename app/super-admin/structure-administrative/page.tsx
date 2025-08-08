'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SuperAdminLayout } from '@/components/layouts/super-admin-layout';
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
  ExternalLink,
  Plus,
  FileText,
  BarChart3,
  TreePine,
  Settings,
  Zap,
  Gauge,
  Activity,
  TrendingUp,
  CheckCircle2,
  Filter,
  Layout,
  Database
} from 'lucide-react';

// Import des nouveaux composants
import TreeView from '@/components/structure-administrative/tree-view';
import { StatistiquesCards, MetriquesNiveaux, AlertesIndicateurs } from '@/components/structure-administrative/stat-cards';
import FiltersSearch from '@/components/structure-administrative/filters-search';
import OrganismeForm from '@/components/structure-administrative/organisme-form';
import { structureAdministrativeService } from '@/lib/services/structure-administrative.service';
import {
  OrganismeAdministratif,
  StatistiquesStructure,
  FiltresStructure,
  NiveauHierarchique,
  TypeOrganisme,
  StatutOrganisme,
  CreationOrganismeData,
  ModificationOrganismeData
} from '@/lib/types/structure-administrative';

interface LoadingStates {
  loading: boolean;
  refreshing: boolean;
  exporting: boolean;
  auditing: boolean;
  updating: string | null;
  error: string | null;
}

export default function StructureAdministrativePage() {
  // États principaux
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedOrganisme, setSelectedOrganisme] = useState<OrganismeAdministratif | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // Données
  const [organismes, setOrganismes] = useState<OrganismeAdministratif[]>([]);
  const [statistiques, setStatistiques] = useState<StatistiquesStructure | null>(null);
  const [organismesFiltres, setOrganismesFiltres] = useState<OrganismeAdministratif[]>([]);

  // Filtres
  const [filtres, setFiltres] = useState<FiltresStructure>({
    niveaux: Object.values(NiveauHierarchique).filter(v => typeof v === 'number') as NiveauHierarchique[],
    types: Object.values(TypeOrganisme),
    statuts: [StatutOrganisme.ACTIF],
    provinces: [],
    searchTerm: '',
  });

  // États de chargement
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    loading: true,
    refreshing: false,
    exporting: false,
    auditing: false,
    updating: null,
    error: null
  });

  // Chargement initial
  useEffect(() => {
    loadData();
  }, []);

  // Application des filtres
  useEffect(() => {
    appliquerFiltres();
  }, [organismes, filtres]);

  const loadData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, loading: true, error: null }));

      const [organismes, stats] = await Promise.all([
        structureAdministrativeService.getOrganismes(),
        structureAdministrativeService.getStatistiques()
      ]);

      setOrganismes(organismes);
      setStatistiques(stats);
      toast.success('🇬🇦 Structure administrative chargée avec succès');

    } catch (error) {
      console.error('Erreur chargement structure:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setLoadingStates(prev => ({ ...prev, error: errorMessage }));
      toast.error(`❌ Erreur: ${errorMessage}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const appliquerFiltres = useCallback(async () => {
    try {
      const resultats = await structureAdministrativeService.rechercherOrganismes(
        filtres.searchTerm,
        filtres
      );
      setOrganismesFiltres(resultats.organismes);
    } catch (error) {
      console.error('Erreur filtrage:', error);
      setOrganismesFiltres(organismes);
    }
  }, [organismes, filtres]);

  const handleRefreshData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, refreshing: true }));
      await loadData();
    } finally {
      setLoadingStates(prev => ({ ...prev, refreshing: false }));
    }
  }, [loadData]);

  const handleExportStructure = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, exporting: true }));

      const exportData = await structureAdministrativeService.exporterStructure('JSON');

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

      toast.success('📄 Structure exportée avec succès');
    } catch (error) {
      console.error('Erreur export:', error);
      toast.error('❌ Erreur lors de l\'export');
    } finally {
      setLoadingStates(prev => ({ ...prev, exporting: false }));
    }
  }, []);

  const handleAuditStructure = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, auditing: true }));

      const audit = await structureAdministrativeService.effectuerAudit();

      toast.success(`🔍 Audit terminé: ${audit.anomalies.length} anomalie(s) détectée(s)`);
      console.log('Résultats audit:', audit);
    } catch (error) {
      console.error('Erreur audit:', error);
      toast.error('❌ Erreur lors de l\'audit');
    } finally {
      setLoadingStates(prev => ({ ...prev, auditing: false }));
    }
  }, []);

  const handleSelectOrganisme = useCallback((organisme: OrganismeAdministratif) => {
    setSelectedOrganisme(organisme);
  }, []);

  const handleEditOrganisme = useCallback((organisme: OrganismeAdministratif) => {
    setSelectedOrganisme(organisme);
    setShowEditForm(true);
  }, []);

  const handleViewOrganisme = useCallback((organisme: OrganismeAdministratif) => {
    setSelectedOrganisme(organisme);
    toast.info(`📋 Consultation: ${organisme.nom}`);
  }, []);

  const handleCreateOrganisme = useCallback(() => {
    setShowCreateForm(true);
  }, []);

  const handleFiltresChange = useCallback((nouveauxFiltres: FiltresStructure) => {
    setFiltres(nouveauxFiltres);
  }, []);

  const handleCreateOrganismeSubmit = useCallback(async (data: CreationOrganismeData) => {
    try {
      await structureAdministrativeService.creerOrganisme(data);
      await loadData(); // Recharger les données
      toast.success('🏢 Organisme créé avec succès');
    } catch (error) {
      console.error('Erreur création organisme:', error);
      throw error; // Laisser le formulaire gérer l'erreur
    }
  }, [loadData]);

  const handleEditOrganismeSubmit = useCallback(async (data: ModificationOrganismeData) => {
    try {
      await structureAdministrativeService.modifierOrganisme(data);
      await loadData(); // Recharger les données
      toast.success('📝 Organisme modifié avec succès');
    } catch (error) {
      console.error('Erreur modification organisme:', error);
      throw error; // Laisser le formulaire gérer l'erreur
    }
  }, [loadData]);

  // =============================================
  // GESTIONNAIRES POUR LES RAPPORTS
  // =============================================

  const handleGenerateOrganigramme = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, exporting: true }));

      // Simuler la génération d'organigramme PDF
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Générer un fichier PDF simulé
      const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 595 842]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 100
>>
stream
BT
/F1 12 Tf
50 800 Td
(Structure Administrative Gabonaise - Organigramme Officiel) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000201 00000 n
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
350
%%EOF`;

      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `organigramme-gabon-${new Date().toISOString().split('T')[0]}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('📊 Organigramme PDF généré avec succès');
    } catch (error) {
      console.error('Erreur génération organigramme:', error);
      toast.error('❌ Erreur lors de la génération de l\'organigramme');
    } finally {
      setLoadingStates(prev => ({ ...prev, exporting: false }));
    }
  }, []);

  const handleAnalyseEffectifs = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, exporting: true }));

      if (!statistiques) {
        toast.error('❌ Statistiques non disponibles');
        return;
      }

      // Générer rapport d'analyse des effectifs
      const rapport = {
        date_generation: new Date().toISOString(),
        titre: 'Analyse des Effectifs - Administration Gabonaise',
        donnees: {
          total_effectifs: statistiques.total_effectifs,
          total_cadres: statistiques.total_cadres,
          total_agents: statistiques.total_agents,
          postes_vacants: statistiques.postes_vacants,
          taux_occupation: statistiques.taux_occupation,
          repartition_par_niveau: {
            niveau_1: statistiques.niveau_1,
            niveau_2: statistiques.niveau_2,
            niveau_3: statistiques.niveau_3,
            niveau_4: statistiques.niveau_4,
            niveau_5: statistiques.niveau_5
          },
          analyse: {
            ratio_cadres_agents: (statistiques.total_cadres / statistiques.total_agents * 100).toFixed(2),
            deficit_effectifs: statistiques.postes_vacants,
            recommandations: [
              'Renforcement du recrutement pour les postes vacants',
              'Formation continue des agents en exercice',
              'Amélioration de la répartition géographique des effectifs'
            ]
          }
        }
      };

      const dataStr = JSON.stringify(rapport, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analyse-effectifs-gabon-${new Date().toISOString().split('T')[0]}.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('📈 Analyse des effectifs générée avec succès');
    } catch (error) {
      console.error('Erreur analyse effectifs:', error);
      toast.error('❌ Erreur lors de l\'analyse des effectifs');
    } finally {
      setLoadingStates(prev => ({ ...prev, exporting: false }));
    }
  }, [statistiques]);

  const handleRepartitionTerritoriale = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, exporting: true }));

      // Analyser la répartition territoriale
      const repartition = organismes.reduce((acc, organisme) => {
        const province = organisme.province || organisme.coordonnees?.province || 'Non spécifiée';
        if (!acc[province]) {
          acc[province] = {
            nombre_organismes: 0,
            total_effectifs: 0,
            organismes: []
          };
        }
        acc[province].nombre_organismes++;
        acc[province].total_effectifs += organisme.effectifs?.total || 0;
        acc[province].organismes.push({
          nom: organisme.nom,
          type: organisme.type,
          effectifs: organisme.effectifs?.total || 0
        });
        return acc;
      }, {} as Record<string, any>);

      const rapport = {
        date_generation: new Date().toISOString(),
        titre: 'Répartition Territoriale - Administration Gabonaise',
        nombre_provinces: Object.keys(repartition).length,
        repartition_par_province: repartition,
        statistiques_globales: {
          concentration_libreville: repartition['Estuaire']?.nombre_organismes || 0,
          pourcentage_concentration: ((repartition['Estuaire']?.nombre_organismes || 0) / organismes.length * 100).toFixed(2),
          provinces_sous_representees: Object.entries(repartition)
            .filter(([, data]: [string, any]) => data.nombre_organismes < 5)
            .map(([province]) => province)
        }
      };

      const dataStr = JSON.stringify(rapport, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `repartition-territoriale-gabon-${new Date().toISOString().split('T')[0]}.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('🗺️ Analyse territoriale générée avec succès');
    } catch (error) {
      console.error('Erreur répartition territoriale:', error);
      toast.error('❌ Erreur lors de l\'analyse territoriale');
    } finally {
      setLoadingStates(prev => ({ ...prev, exporting: false }));
    }
  }, [organismes]);

  // =============================================
  // GESTIONNAIRES POUR LES ACTIONS RAPIDES
  // =============================================

  const handleSynchroniserDonnees = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, refreshing: true }));

      toast.info('🔄 Synchronisation en cours...');

      // Simuler la synchronisation avec une source externe
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Recharger toutes les données
      await loadData();

      toast.success('✅ Données synchronisées avec succès');
    } catch (error) {
      console.error('Erreur synchronisation:', error);
      toast.error('❌ Erreur lors de la synchronisation');
    } finally {
      setLoadingStates(prev => ({ ...prev, refreshing: false }));
    }
  }, [loadData]);

  const handleSauvegarderStructure = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, exporting: true }));

      // Créer une sauvegarde complète
      const sauvegarde = {
        version: '1.0',
        date_sauvegarde: new Date().toISOString(),
        metadata: {
          nombre_organismes: organismes.length,
          utilisateur: 'system', // À remplacer par l'utilisateur connecté
          plateforme: 'ADMINISTRATION.GA'
        },
        structure_complete: {
          organismes: organismes,
          statistiques: statistiques,
          relations_hierarchiques: organismes
            .filter(o => o.parentId)
            .map(o => ({
              enfant: o.id,
              parent: o.parentId,
              niveau: o.niveau
            }))
        },
        configuration: {
          niveaux_hierarchiques: Object.values(NiveauHierarchique).filter(v => typeof v === 'number'),
          types_organismes: Object.values(TypeOrganisme),
          statuts_disponibles: Object.values(StatutOrganisme)
        }
      };

      const dataStr = JSON.stringify(sauvegarde, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sauvegarde-structure-gabon-${new Date().toISOString().split('T')[0]}.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('💾 Sauvegarde créée avec succès');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast.error('❌ Erreur lors de la sauvegarde');
    } finally {
      setLoadingStates(prev => ({ ...prev, exporting: false }));
    }
  }, [organismes, statistiques]);

  const handleConfigurationAvancee = useCallback(() => {
    toast.info('⚙️ Configuration avancée (fonctionnalité à venir)');
    // TODO: Implémenter un modal de configuration avancée
  }, []);

  // Écran de chargement moderne
  if (loadingStates.loading) {
    return (
      <SuperAdminLayout
        title="Structure Administrative"
        description="Chargement en cours..."
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <Loader2 className="h-10 w-10 animate-spin text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Crown className="h-4 w-4 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">Chargement de la Structure</h3>
              <p className="text-gray-600">Analyse de la hiérarchie administrative gabonaise...</p>
            </div>

            <div className="flex items-center justify-center gap-3 px-4 py-2 bg-blue-50 rounded-lg">
              <Database className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">République Gabonaise</span>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                <Activity className="w-3 h-3 mr-1" />
                En cours
              </Badge>
            </div>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout
      title="Structure Administrative"
      description={`Gestion moderne de la hiérarchie des ${organismes.length} organismes gabonais`}
    >
      <div className="space-y-6">
        {/* Alerte d'erreur moderne */}
        {loadingStates.error && (
          <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-red-800">Problème de connexion</p>
                <p className="text-sm text-red-600">{loadingStates.error}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLoadingStates(prev => ({ ...prev, error: null }))}
              className="text-red-600 hover:bg-red-100"
            >
              ✕
            </Button>
          </div>
        )}

        {/* Header moderne avec statut et actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${loadingStates.error ? 'bg-red-500' : 'bg-green-500'}`} />
              <span className="text-sm font-medium text-gray-700">
                {loadingStates.error ? 'Hors ligne' : `${organismes.length} organismes synchronisés`}
              </span>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Database className="w-3 h-3 mr-1" />
              Temps réel
            </Badge>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleCreateOrganisme}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouveau
            </Button>

            <Button
              variant="outline"
              onClick={handleRefreshData}
              disabled={loadingStates.refreshing}
              className="border-gray-300 hover:border-blue-300 hover:bg-blue-50"
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
              className="border-gray-300 hover:border-green-300 hover:bg-green-50"
            >
              {loadingStates.exporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Exporter
            </Button>

            <Button
              variant="outline"
              onClick={handleAuditStructure}
              disabled={loadingStates.auditing}
              className="border-gray-300 hover:border-orange-300 hover:bg-orange-50"
            >
              {loadingStates.auditing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Settings className="mr-2 h-4 w-4" />
              )}
              Audit
            </Button>
          </div>
        </div>

        {/* Navigation moderne avec onglets */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-50 p-1 rounded-xl h-auto">
                <TabsTrigger
                  value="dashboard"
                  className="flex items-center gap-2 py-3 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                >
                  <Gauge className="h-4 w-4" />
                  <span className="font-medium">Tableau de Bord</span>
                </TabsTrigger>
                <TabsTrigger
                  value="structure"
                  className="flex items-center gap-2 py-3 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                >
                  <TreePine className="h-4 w-4" />
                  <span className="font-medium">Hiérarchie</span>
                </TabsTrigger>
                <TabsTrigger
                  value="organismes"
                  className="flex items-center gap-2 py-3 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                >
                  <Building className="h-4 w-4" />
                  <span className="font-medium">Organismes</span>
                </TabsTrigger>
                <TabsTrigger
                  value="rapports"
                  className="flex items-center gap-2 py-3 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                >
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Rapports</span>
                </TabsTrigger>
              </TabsList>

              {/* Dashboard moderne */}
              <TabsContent value="dashboard" className="mt-6 space-y-6">
                {statistiques ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Vue d'Ensemble</h3>
                        <p className="text-sm text-gray-600">Métriques clés de la structure administrative</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Données à jour
                      </Badge>
                    </div>

                    <StatistiquesCards statistiques={statistiques} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <MetriquesNiveaux statistiques={statistiques} />
                      <AlertesIndicateurs statistiques={statistiques} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <BarChart3 className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">Chargement des statistiques...</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Structure hiérarchique moderne */}
              <TabsContent value="structure" className="mt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Hiérarchie Administrative</h3>
                    <p className="text-sm text-gray-600">Visualisation en arbre de la structure gabonaise</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Filter className="w-3 h-3 mr-1" />
                      {organismesFiltres.length} affichés
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <TreePine className="w-3 h-3 mr-1" />
                      {organismes.length} organismes officiels 🇬🇦
                    </Badge>
                  </div>
                </div>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <FiltersSearch
                      filtres={filtres}
                      onFiltresChange={handleFiltresChange}
                      totalOrganismes={organismes.length}
                      organismesFiltres={organismesFiltres.length}
                    />
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <TreeView
                      organismes={organismesFiltres}
                      onSelect={handleSelectOrganisme}
                      onEdit={handleEditOrganisme}
                      onView={handleViewOrganisme}
                      selectedId={selectedOrganisme?.id}
                      searchTerm={filtres.searchTerm}
                      showStats={true}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Liste moderne des organismes */}
              <TabsContent value="organismes" className="mt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Répertoire des Organismes</h3>
                    <p className="text-sm text-gray-600">Liste complète avec recherche et filtres avancés</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Building className="w-3 h-3 mr-1" />
                      {organismesFiltres.length} affichés
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Database className="w-3 h-3 mr-1" />
                      {organismes.length} organismes officiels
                    </Badge>
                  </div>
                </div>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <FiltersSearch
                      filtres={filtres}
                      onFiltresChange={handleFiltresChange}
                      totalOrganismes={organismes.length}
                      organismesFiltres={organismesFiltres.length}
                    />
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold">Organismes Publics</CardTitle>
                        <CardDescription>
                          {organismesFiltres.length} organisme(s) sur {organismes.length} organismes officiels gabonais 🇬🇦
                        </CardDescription>
                      </div>
                      <Button
                        onClick={handleCreateOrganisme}
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-600"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {organismesFiltres.length > 0 ? (
                        organismesFiltres.map((organisme) => (
                          <div
                            key={organisme.id}
                            className={`group p-4 border rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer ${
                              selectedOrganisme?.id === organisme.id
                                ? 'bg-blue-50 border-blue-300 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                            onClick={() => handleSelectOrganisme(organisme)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <Badge
                                  variant="outline"
                                  className="flex-shrink-0"
                                  style={{
                                    borderColor: statistiques ? Object.values({1: '#DC2626', 2: '#2563EB', 3: '#16A34A', 4: '#EA580C', 5: '#9333EA'})[organisme.niveau] : undefined,
                                    color: statistiques ? Object.values({1: '#DC2626', 2: '#2563EB', 3: '#16A34A', 4: '#EA580C', 5: '#9333EA'})[organisme.niveau] : undefined
                                  }}
                                >
                                  N{organisme.niveau}
                                </Badge>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                    {organisme.nom}
                                  </h4>
                                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-1 flex-wrap">
                                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                                      {organisme.code}
                                    </span>
                                    {organisme.sigle && (
                                      <span className="text-blue-600 font-medium">{organisme.sigle}</span>
                                    )}
                                    {organisme.responsable && (
                                      <span className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        {organisme.responsable.nom}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 flex-shrink-0">
                                <Badge
                                  variant="outline"
                                  className={
                                    organisme.statut === 'ACTIF' ? 'bg-green-50 text-green-700 border-green-200' :
                                    organisme.statut === 'INACTIF' ? 'bg-red-50 text-red-700 border-red-200' :
                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                                  }
                                >
                                  {organisme.statut}
                                </Badge>

                                {organisme.effectifs && (
                                  <Badge variant="outline" className="flex items-center gap-1 bg-gray-50">
                                    <Users className="h-3 w-3" />
                                    {organisme.effectifs.total}
                                  </Badge>
                                )}

                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewOrganisme(organisme);
                                    }}
                                    className="h-8 w-8 p-0 hover:bg-blue-100"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditOrganisme(organisme);
                                    }}
                                    className="h-8 w-8 p-0 hover:bg-green-100"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Building className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500">Aucun organisme trouvé avec ces critères</p>
                          <Button
                            variant="outline"
                            onClick={() => setFiltres(prev => ({ ...prev, searchTerm: '' }))}
                            className="mt-3"
                          >
                            Effacer les filtres
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Rapports et outils modernes */}
              <TabsContent value="rapports" className="mt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Rapports & Outils</h3>
                    <p className="text-sm text-gray-600">Génération de documents et outils d'analyse avancés</p>
                  </div>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    <FileText className="w-3 h-3 mr-1" />
                    8 outils disponibles
                  </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Rapports */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Rapports Officiels
                      </CardTitle>
                      <CardDescription>
                        Documents d'analyse de la structure administrative
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                        onClick={handleGenerateOrganigramme}
                        disabled={loadingStates.exporting}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            {loadingStates.exporting ? (
                              <Loader2 className="h-5 w-5 animate-spin text-red-600" />
                            ) : (
                              <FileText className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Organigramme Officiel</div>
                            <div className="text-sm text-gray-500">Document PDF hiérarchique</div>
                          </div>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all"
                        onClick={handleAnalyseEffectifs}
                        disabled={loadingStates.exporting}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            {loadingStates.exporting ? (
                              <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                            ) : (
                              <BarChart3 className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Analyse des Effectifs</div>
                            <div className="text-sm text-gray-500">Répartition et métriques RH</div>
                          </div>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
                        onClick={handleRepartitionTerritoriale}
                        disabled={loadingStates.exporting}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            {loadingStates.exporting ? (
                              <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                            ) : (
                              <MapPin className="h-5 w-5 text-purple-600" />
                            )}
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Répartition Territoriale</div>
                            <div className="text-sm text-gray-500">Cartographie par province</div>
                          </div>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all"
                        onClick={handleAuditStructure}
                        disabled={loadingStates.auditing}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            {loadingStates.auditing ? (
                              <Loader2 className="h-5 w-5 animate-spin text-orange-600" />
                            ) : (
                              <Settings className="h-5 w-5 text-orange-600" />
                            )}
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Audit de Cohérence</div>
                            <div className="text-sm text-gray-500">Vérification intégrité</div>
                          </div>
                        </div>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Outils */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Settings className="h-5 w-5 text-blue-600" />
                        Outils de Gestion
                      </CardTitle>
                      <CardDescription>
                        Actions rapides et maintenance du système
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                        onClick={handleCreateOrganisme}
                        disabled={loadingStates.loading}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Plus className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Nouvel Organisme</div>
                            <div className="text-sm text-gray-500">Ajouter à la structure</div>
                          </div>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                        onClick={handleSynchroniserDonnees}
                        disabled={loadingStates.refreshing}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            {loadingStates.refreshing ? (
                              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                            ) : (
                              <RefreshCw className="h-5 w-5 text-indigo-600" />
                            )}
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Synchronisation</div>
                            <div className="text-sm text-gray-500">Mise à jour des données</div>
                          </div>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4 border-gray-200 hover:border-cyan-300 hover:bg-cyan-50 transition-all"
                        onClick={handleSauvegarderStructure}
                        disabled={loadingStates.exporting}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                            {loadingStates.exporting ? (
                              <Loader2 className="h-5 w-5 animate-spin text-cyan-600" />
                            ) : (
                              <Download className="h-5 w-5 text-cyan-600" />
                            )}
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Sauvegarde Complète</div>
                            <div className="text-sm text-gray-500">Backup de sécurité</div>
                          </div>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full justify-start h-auto p-4 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                        onClick={handleConfigurationAvancee}
                        disabled={loadingStates.loading}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Settings className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Configuration</div>
                            <div className="text-sm text-gray-500">Paramètres avancés</div>
                          </div>
                        </div>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Panel moderne de détails d'organisme */}
        {selectedOrganisme && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {selectedOrganisme.nom}
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Organisme de niveau {selectedOrganisme.niveau} • {selectedOrganisme.code}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      selectedOrganisme.statut === 'ACTIF' ? 'bg-green-50 text-green-700 border-green-200' :
                      selectedOrganisme.statut === 'INACTIF' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }
                  >
                    {selectedOrganisme.statut}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedOrganisme(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Informations principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Informations générales */}
                <Card className="border-0 bg-white shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Layout className="h-4 w-4" />
                      Informations Générales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Code:</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {selectedOrganisme.code}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Sigle:</span>
                      <span className="text-sm font-medium text-blue-600">
                        {selectedOrganisme.sigle || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Type:</span>
                      <span className="text-sm font-medium">{selectedOrganisme.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Niveau:</span>
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: statistiques ? Object.values({1: '#DC2626', 2: '#2563EB', 3: '#16A34A', 4: '#EA580C', 5: '#9333EA'})[selectedOrganisme.niveau] : undefined,
                          color: statistiques ? Object.values({1: '#DC2626', 2: '#2563EB', 3: '#16A34A', 4: '#EA580C', 5: '#9333EA'})[selectedOrganisme.niveau] : undefined
                        }}
                      >
                        {selectedOrganisme.niveau}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Responsable */}
                <Card className="border-0 bg-white shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Responsable
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedOrganisme.responsable ? (
                      <div className="space-y-3">
                        <div>
                          <div className="font-medium text-gray-900">
                            {selectedOrganisme.responsable.nom}
                          </div>
                          <div className="text-sm text-gray-600">
                            {selectedOrganisme.responsable.titre}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="text-blue-600">{selectedOrganisme.responsable.email}</span>
                          </div>
                          {selectedOrganisme.responsable.telephone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span>{selectedOrganisme.responsable.telephone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Users className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">Aucun responsable désigné</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Effectifs & Budget */}
                <Card className="border-0 bg-white shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Effectifs & Budget
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedOrganisme.effectifs ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total agents</span>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {selectedOrganisme.effectifs.total}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Cadres:</span>
                          <span className="text-sm font-medium">{selectedOrganisme.effectifs.cadres}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Agents:</span>
                          <span className="text-sm font-medium">{selectedOrganisme.effectifs.agentsExecution}</span>
                        </div>
                        {selectedOrganisme.budget && (
                          <div className="pt-2 border-t">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Budget annuel:</span>
                              <span className="text-sm font-medium text-green-600">
                                {(selectedOrganisme.budget.annuel / 1000000000).toFixed(1)}Md FCFA
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <BarChart3 className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">Données non disponibles</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Mission */}
              <Card className="border-0 bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-700">Mission & Objectifs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedOrganisme.mission}</p>
                </CardContent>
              </Card>

              {/* Attributions */}
              {selectedOrganisme.attributions.length > 0 && (
                <Card className="border-0 bg-white shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-700">Attributions & Compétences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedOrganisme.attributions.map((attr, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{attr}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => handleEditOrganisme(selectedOrganisme)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
                <Button variant="outline" onClick={() => handleViewOrganisme(selectedOrganisme)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Consulter
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulaires modaux */}
        <OrganismeForm
          open={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateOrganismeSubmit}
          organismes={organismes}
          mode="create"
        />

        <OrganismeForm
          open={showEditForm}
          onClose={() => setShowEditForm(false)}
          onSubmit={handleEditOrganismeSubmit}
          organisme={selectedOrganisme}
          organismes={organismes}
          mode="edit"
        />
      </div>
    </SuperAdminLayout>
  );
}
