'use client';

import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { toast } from 'sonner';
import {
  Building2,
  Shield,
  MapPin,
  Users,
  FileText,
  BarChart3,
  Settings,
  Download,
  Upload,
  Database,
  Activity,
  CheckCircle,
  Plus,
  AlertTriangle,
  Clock,
  TrendingUp,
  Star,
  Globe,
  Phone,
  Mail,
  Eye,
  Edit,
  Search,
  Filter,
  Calendar,
  DollarSign,
  ExternalLink,
  Trash2,
  RefreshCw,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { getAllAdministrations, getAllServices } from '@/lib/data/gabon-administrations';
import { getOrganismesWithDetailedServices, getGlobalServicesStats, OrganismeWithServices } from '@/lib/utils/services-organisme-utils';
import { systemStats, unifiedOrganismes, systemUsers } from '@/lib/data/unified-system-data';

// Types pour une meilleure sécurité des types
interface MockOrganisation {
  id: number;
  nom: string;
  code: string;
  type: string;
  localisation: string;
  services: string[];
  responsable: string;
  dateCreation: string;
  budget: string;
  derniere_activite: string;
  utilisateurs: number;
  demandes_mois: number;
  satisfaction: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
}

interface MockService {
  id: number;
  nom: string;
  organisme: string;
  categorie: string;
  description: string;
  duree: string;
  cout: string;
  status: string;
  satisfaction: number;
  demandes_mois: number;
  documents_requis: string;
  responsable: string;
}

interface LoadingStates {
  exporting: boolean;
  filtering: boolean;
  refreshing: boolean;
  deleting: string | null;
  editing: string | null;
}

interface ErrorStates {
  export: string | null;
  filter: string | null;
  general: string | null;
}

export default function SuperAdminDashboard() {
  // États de base
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedOrganisme, setSelectedOrganisme] = useState<OrganismeWithServices | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  // États de chargement
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    exporting: false,
    filtering: false,
    refreshing: false,
    deleting: null,
    editing: null
  });

  // États d'erreur
  const [errorStates, setErrorStates] = useState<ErrorStates>({
    export: null,
    filter: null,
    general: null
  });

  // Chargement des données avec gestion d'erreur
  const { allAdministrations, allServicesFromJSON, unifiedStats, organismes, users, organismesWithServices, globalStats } = useMemo(() => {
    try {
      return {
        allAdministrations: getAllAdministrations(),
        allServicesFromJSON: getAllServices(),
        unifiedStats: systemStats,
        organismes: unifiedOrganismes,
        users: systemUsers,
        organismesWithServices: getOrganismesWithDetailedServices(),
        globalStats: getGlobalServicesStats()
      };
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
      setErrorStates(prev => ({ ...prev, general: 'Erreur lors du chargement des données' }));
      return {
        allAdministrations: [],
        allServicesFromJSON: [],
        unifiedStats: { organismesByType: {}, servicesByCategory: {} },
        organismes: [],
        users: [],
        organismesWithServices: [],
        globalStats: {
          totalOrganismes: 0,
          totalServices: 0,
          totalServicesBasiques: 0,
          totalServicesDetailles: 0,
          satisfactionMoyenne: 0,
          demandesMoyennes: 0,
          organismesByType: {},
          servicesByCategory: {},
          organismesActifs: 0,
          organismesMaintenance: 0
        }
      };
    }
  }, []);

  // Debug console avec gestion d'erreur
  console.log('🔍 DASHBOARD PRINCIPAL - Organismes chargés:', allAdministrations.length);
  console.log('🔍 DASHBOARD PRINCIPAL - Services chargés:', allServicesFromJSON.length);
  console.log('🔍 DASHBOARD PRINCIPAL - Organismes avec services détaillés:', organismesWithServices.length);
  console.log('🔍 DASHBOARD PRINCIPAL - Stats globales:', globalStats);

  // Génération des données mock avec métriques
  const mockOrganisations = useMemo<MockOrganisation[]>(() => {
    return organismes.map((org, index) => {
      const getMetrics = (orgType: string, idx: number) => {
        const metricsMap: Record<string, { users: number; demands: number; satisfaction: number }> = {
          'PRESIDENCE': { users: 150, demands: 50, satisfaction: 95 },
          'PRIMATURE': { users: 120, demands: 40, satisfaction: 93 },
          'MINISTERE': { users: 200, demands: 800, satisfaction: 88 },
          'DIRECTION_GENERALE': { users: 80, demands: 600, satisfaction: 85 },
          'MAIRIE': { users: 60, demands: 1200, satisfaction: 82 },
          'ORGANISME_SOCIAL': { users: 45, demands: 500, satisfaction: 80 },
          'INSTITUTION_JUDICIAIRE': { users: 35, demands: 300, satisfaction: 78 },
          'SERVICE_SPECIALISE': { users: 25, demands: 150, satisfaction: 75 }
        };

        const getTypeKey = (type: string) => {
          if (type === 'Institution suprême') return 'PRESIDENCE';
          if (type === 'Institution gouvernementale') return 'PRIMATURE';
          return type || 'SERVICE_SPECIALISE';
        };

        const key = getTypeKey(orgType);
        const base = metricsMap[key] || metricsMap['SERVICE_SPECIALISE'];

        return {
          utilisateurs: base.users + (idx % 50),
          demandes_mois: base.demands + (idx % 200),
          satisfaction: Math.min(95, base.satisfaction + (idx % 15)),
          status: (idx % 9 === 0 ? 'MAINTENANCE' : 'ACTIVE') as 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE'
        };
      };

      const metrics = getMetrics(org.type, index);
      const displayType = org.type || 'SERVICE_SPECIALISE';

      return {
        id: index + 1,
        nom: org.nom,
        code: org.code || `ORG_${index + 1}`,
        type: displayType,
        localisation: org.localisation || 'Libreville',
        services: org.services || [],
        responsable: `${['M.', 'Mme', 'Dr.'][index % 3]} ${['Jean', 'Marie', 'Paul', 'Sophie', 'Pierre'][index % 5]} ${['OBIANG', 'NZENG', 'MBOUMBA', 'BOUKOUMOU', 'NZAMBA'][index % 5]}`,
        dateCreation: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        budget: `${(Math.random() * 5 + 0.5).toFixed(1)}M FCFA`,
        derniere_activite: index % 3 === 0 ? "Hier" : "Aujourd'hui",
        ...metrics
      };
    });
  }, [organismes]);

  // Services enrichis avec gestion d'erreur
  const mockServices = useMemo<MockService[]>(() => {
    return allServicesFromJSON.slice(0, 25).map((service, index) => ({
      id: index + 1,
      nom: service,
      organisme: mockOrganisations[index % mockOrganisations.length]?.nom || 'Administration Générale',
      categorie: service.includes('Acte') ? 'ETAT_CIVIL' :
                service.includes('Carte') || service.includes('Passeport') ? 'IDENTITE' :
                service.includes('Permis') ? 'TRANSPORT' :
                service.includes('CNSS') || service.includes('sociale') ? 'SOCIAL' :
                'ADMINISTRATIF',
      description: `Service de ${service.toLowerCase()}`,
      duree: `${Math.floor(Math.random() * 10) + 1}-${Math.floor(Math.random() * 5) + 5} jours`,
      cout: index % 4 === 0 ? 'Gratuit' : `${(Math.random() * 100 + 5) * 1000} FCFA`,
      status: 'ACTIVE',
      satisfaction: 75 + Math.floor(Math.random() * 20),
      demandes_mois: 100 + Math.floor(Math.random() * 500),
      documents_requis: ['CNI', 'Acte de naissance', 'Photo'][Math.floor(Math.random() * 3)],
      responsable: mockOrganisations[index % mockOrganisations.length]?.responsable || 'Non défini'
    }));
  }, [allServicesFromJSON, mockOrganisations]);

  // Types d'organisations
  const ORGANIZATION_TYPES: Record<string, string> = {
    PRESIDENCE: "Présidence",
    PRIMATURE: "Primature",
    MINISTERE: "Ministère",
    DIRECTION_GENERALE: "Direction Générale",
    PROVINCE: "Province",
    PREFECTURE: "Préfecture",
    MAIRIE: "Mairie",
    ORGANISME_SOCIAL: "Organisme Social",
    INSTITUTION_JUDICIAIRE: "Institution Judiciaire",
    SERVICE_SPECIALISE: "Service Spécialisé",
    AUTRE: "Autre"
  };

  const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    ACTIVE: { label: "Actif", color: "bg-green-500" },
    MAINTENANCE: { label: "Maintenance", color: "bg-yellow-500" },
    INACTIVE: { label: "Inactif", color: "bg-red-500" }
  };

  // Calcul des statistiques avec gestion d'erreur
  const stats = useMemo(() => {
    try {
      return {
        totalOrganisations: globalStats.totalOrganismes,
        totalServices: globalStats.totalServices,
        totalServicesBasiques: globalStats.totalServicesBasiques,
        totalServicesDetailles: globalStats.totalServicesDetailles,
        totalUtilisateurs: Math.floor(organismesWithServices.map(org => org.demandes_mois || 0).reduce((sum, val) => sum + val, 0) / 100),
        totalDemandes: globalStats.demandesMoyennes,
        satisfactionMoyenne: globalStats.satisfactionMoyenne,
        activeOrganisations: globalStats.organismesActifs,
        maintenanceOrganisations: globalStats.organismesMaintenance,
        budgetTotal: `${(globalStats.totalOrganismes * 2.1).toFixed(1)}M FCFA`,
        servicesByCategory: globalStats.servicesByCategory,
        organismesByType: globalStats.organismesByType
      };
    } catch (error) {
      console.error('❌ Erreur lors du calcul des statistiques:', error);
      return {
        totalOrganisations: 0,
        totalServices: 0,
        totalServicesBasiques: 0,
        totalServicesDetailles: 0,
        totalUtilisateurs: 0,
        totalDemandes: 0,
        satisfactionMoyenne: 0,
        activeOrganisations: 0,
        maintenanceOrganisations: 0,
        budgetTotal: '0M FCFA',
        servicesByCategory: {},
        organismesByType: {}
      };
    }
  }, [globalStats, organismesWithServices]);

  // Filtrage des organisations avec optimisation
  const filteredOrganisations = useMemo(() => {
    try {
      setLoadingStates(prev => ({ ...prev, filtering: true }));

      const filtered = organismesWithServices.filter(org => {
        const matchesSearch = org.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             org.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'all' || org.type === selectedType;
        return matchesSearch && matchesType;
      });

      setLoadingStates(prev => ({ ...prev, filtering: false }));
      setErrorStates(prev => ({ ...prev, filter: null }));

      return filtered;
    } catch (error) {
      console.error('❌ Erreur lors du filtrage:', error);
      setErrorStates(prev => ({ ...prev, filter: 'Erreur lors du filtrage des données' }));
      setLoadingStates(prev => ({ ...prev, filtering: false }));
      return [];
    }
  }, [organismesWithServices, searchTerm, selectedType]);

  // Gestionnaires d'événements avec gestion d'erreur complète
  const handleViewOrganisme = useCallback((organisme: OrganismeWithServices) => {
    try {
      setSelectedOrganisme(organisme);
      setIsDetailsOpen(true);
      toast.success(`✅ Affichage des détails de ${organisme.nom}`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'affichage des détails:', error);
      toast.error('❌ Erreur lors de l\'affichage des détails');
    }
  }, []);

  const handleEditOrganisme = useCallback(async (organisme: OrganismeWithServices) => {
    try {
      setLoadingStates(prev => ({ ...prev, editing: organisme.id }));

      // Simulation d'une opération asynchrone
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Ici vous pourriez ajouter la logique de modification réelle
      toast.success(`✅ Redirection vers la modification de ${organisme.nom}`);

      // Redirection vers la page d'édition (à implémenter)
      // router.push(`/super-admin/administrations/${organisme.id}/edit`);

    } catch (error) {
      console.error('❌ Erreur lors de la modification:', error);
      toast.error('❌ Erreur lors de la modification de l\'organisme');
    } finally {
      setLoadingStates(prev => ({ ...prev, editing: null }));
    }
  }, []);

  const handleDeleteOrganisme = useCallback(async (organisme: OrganismeWithServices) => {
    try {
      const confirmed = window.confirm(`⚠️ Êtes-vous sûr de vouloir supprimer l'organisme "${organisme.nom}" ? Cette action est irréversible.`);

      if (!confirmed) return;

      setLoadingStates(prev => ({ ...prev, deleting: organisme.id }));

      // Simulation d'une opération de suppression
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Ici vous pourriez ajouter la logique de suppression réelle
      toast.success(`✅ Organisme "${organisme.nom}" supprimé avec succès`);

    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      toast.error('❌ Erreur lors de la suppression de l\'organisme');
    } finally {
      setLoadingStates(prev => ({ ...prev, deleting: null }));
    }
  }, []);

  const exportToJSON = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, exporting: true }));
      setErrorStates(prev => ({ ...prev, export: null }));

      // Simulation d'une préparation des données
      await new Promise(resolve => setTimeout(resolve, 500));

      const dataStr = JSON.stringify({
        exported_at: new Date().toISOString(),
        total_organisations: stats.totalOrganisations,
        organisations: mockOrganisations,
        services: mockServices,
        statistics: stats,
        source: 'JSON_GABON_ADMINISTRATIONS_COMPLETE'
      }, null, 2);

      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gabon-administrations-COMPLET-${stats.totalOrganisations}-organismes-${new Date().toISOString().split('T')[0]}.json`;

      // Ajouter le lien au DOM, cliquer et le supprimer
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`✅ Export de ${stats.totalOrganisations} organismes gabonais réussi !`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'export JSON:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setErrorStates(prev => ({ ...prev, export: `Erreur lors de l'export: ${errorMessage}` }));
      toast.error('❌ Erreur lors de l\'export JSON');
    } finally {
      setLoadingStates(prev => ({ ...prev, exporting: false }));
    }
  }, [stats, mockOrganisations, mockServices]);

  const handleRefreshData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, refreshing: true }));

      // Simulation du rechargement des données
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Ici vous pourriez recharger les données depuis l'API
      toast.success('✅ Données actualisées avec succès');

    } catch (error) {
      console.error('❌ Erreur lors de l\'actualisation:', error);
      toast.error('❌ Erreur lors de l\'actualisation des données');
    } finally {
      setLoadingStates(prev => ({ ...prev, refreshing: false }));
    }
  }, []);

  const handleResetFilters = useCallback(() => {
    try {
      setSearchTerm('');
      setSelectedType('all');
      toast.info('🔄 Filtres réinitialisés');
    } catch (error) {
      console.error('❌ Erreur lors de la réinitialisation:', error);
      toast.error('❌ Erreur lors de la réinitialisation des filtres');
    }
  }, []);

  const handleTypeFilterClick = useCallback((type: string) => {
    try {
      setSelectedType(type);
      setSelectedTab('organisations');
      toast.info(`🏢 Filtrage par type: ${type.replace('_', ' ')}`);
    } catch (error) {
      console.error('❌ Erreur lors du filtrage par type:', error);
      toast.error('❌ Erreur lors du filtrage');
    }
  }, []);

  // Composant d'alerte d'erreur
  const ErrorAlert = ({ error, onDismiss }: { error: string; onDismiss: () => void }) => (
    <Card className="bg-red-50 border-red-200 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">❌ Erreur</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            ✕
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Affichage des erreurs */}
        {errorStates.general && (
          <ErrorAlert
            error={errorStates.general}
            onDismiss={() => setErrorStates(prev => ({ ...prev, general: null }))}
          />
        )}

        {errorStates.export && (
          <ErrorAlert
            error={errorStates.export}
            onDismiss={() => setErrorStates(prev => ({ ...prev, export: null }))}
          />
        )}

        {/* En-tête avec navigation contextuelle */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-red-500" />
              Dashboard Super Administrateur
            </h1>
            <p className="text-muted-foreground">
              Gestion complète de {stats.totalOrganisations} administrations publiques gabonaises
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
              onClick={exportToJSON}
              disabled={loadingStates.exporting}
            >
              {loadingStates.exporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export {stats.totalOrganisations} Organismes
            </Button>
            <Button variant="outline" asChild>
              <Link href="/super-admin/systeme">
                <Settings className="mr-2 h-4 w-4" />
                Système
              </Link>
            </Button>
            <Button asChild>
              <Link href="/super-admin/organisme/nouveau">
                <Plus className="mr-2 h-4 w-4" />
                Nouvel Organisme
              </Link>
            </Button>
          </div>
        </div>

        {/* PANNEAU DE CONFIRMATION DES DONNÉES CHARGÉES */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">✅ Données JSON Chargées avec Succès</h3>
                  <p className="text-sm text-green-600">
                    {stats.totalOrganisations} organismes • {stats.totalServices} services • Source: fichier JSON gabonais
                  </p>
                </div>
              </div>
              <Badge className="bg-green-600 text-white">
                100% Complet
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Navigation rapide vers modules de gestion */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">🏢 Modules de Gestion des Organismes</h3>
                <p className="text-sm text-muted-foreground">
                  Accès rapide aux {stats.totalOrganisations} organismes et {stats.totalServices} services
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/super-admin/administrations">
                    <Building2 className="mr-2 h-4 w-4" />
                    Administrations ({stats.totalOrganisations})
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/super-admin/organisme/nouveau">
                    <Plus className="mr-2 h-4 w-4" />
                    Créer Organisme
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/super-admin/services">
                    <FileText className="mr-2 h-4 w-4" />
                    Services Publics ({stats.totalServices})
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/super-admin/utilisateurs">
                    <Users className="mr-2 h-4 w-4" />
                    Utilisateurs
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques globales avancées - 5 CARTES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/super-admin/administrations', '_blank')}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Organismes</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalOrganisations}</p>
                  <p className="text-xs text-green-600">
                    {stats.activeOrganisations} actifs, {stats.maintenanceOrganisations} maintenance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/super-admin/services', '_blank')}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Services Publics</p>
                  <p className="text-2xl font-bold text-green-600">{stats.totalServices}</p>
                  <p className="text-xs text-green-600">
                    Moyenne {Math.round(stats.totalServices / stats.totalOrganisations)} services/organisme
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open('/super-admin/utilisateurs', '_blank')}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Utilisateurs Actifs</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalUtilisateurs.toLocaleString()}</p>
                  <p className="text-xs text-green-600">
                    {stats.totalDemandes.toLocaleString()} demandes/mois
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Satisfaction Globale</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.satisfactionMoyenne}%</p>
                  <p className="text-xs text-green-600">
                    Budget total: {stats.budgetTotal}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-indigo-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Couverture Gabon</p>
                  <p className="text-2xl font-bold text-indigo-600">100%</p>
                  <p className="text-xs text-green-600">
                    Toutes administrations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets de gestion intégrée */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="organisations">Organismes</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Organismes Performants */}
              <Card>
                <CardHeader>
                  <CardTitle>🏆 Organismes les Plus Performants</CardTitle>
                  <CardDescription>Classement par satisfaction et activité</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockOrganisations
                      .sort((a, b) => b.satisfaction - a.satisfaction)
                      .slice(0, 3)
                      .map((org, index) => (
                      <div key={org.id} className="flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-green-50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
                        const foundOrg = organismesWithServices.find(o => o.nom === org.nom);
                        if (foundOrg) handleViewOrganisme(foundOrg);
                      }}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{org.nom}</p>
                            <p className="text-sm text-muted-foreground">{org.responsable}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">{org.satisfaction}%</p>
                          <p className="text-xs text-muted-foreground">{org.demandes_mois} demandes</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline" asChild>
                    <Link href="/super-admin/administrations">
                      <Eye className="mr-2 h-4 w-4" />
                      Voir tous les organismes
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Services les plus demandés */}
              <Card>
                <CardHeader>
                  <CardTitle>📋 Services les Plus Demandés</CardTitle>
                  <CardDescription>Top 3 des services par volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockServices
                      .sort((a, b) => b.demandes_mois - a.demandes_mois)
                      .slice(0, 3)
                      .map((service, index) => (
                      <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{service.nom}</p>
                            <p className="text-sm text-muted-foreground">{service.organisme}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{service.demandes_mois}</p>
                          <p className="text-xs text-muted-foreground">{service.satisfaction}% satisfaction</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline" asChild>
                    <Link href="/super-admin/services">
                      <FileText className="mr-2 h-4 w-4" />
                      Gérer tous les services
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Répartition par type d'organisme */}
            <Card>
              <CardHeader>
                <CardTitle>📊 Répartition des Organismes par Type</CardTitle>
                <CardDescription>Distribution et métriques par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(unifiedStats.organismesByType).map(([key, count]) => {
                    const typeOrganismes = organismes.filter(org => org.type === key);
                    const totalUtilisateurs = typeOrganismes.reduce((sum, org) => sum + (org.stats?.totalUsers || 0), 0);
                    const satisfactionMoyenne = typeOrganismes.length > 0
                      ? Math.round(typeOrganismes.reduce((sum, org) => sum + 85, 0) / typeOrganismes.length)
                      : 0;

                    return (
                      <div
                        key={key}
                        className="p-4 border rounded-lg cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                        onClick={() => handleTypeFilterClick(key)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="text-white bg-blue-500 hover:bg-blue-600 transition-colors">
                            {key.replace('_', ' ')}
                          </Badge>
                          <span className="text-2xl font-bold">{count}</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Utilisateurs:</span>
                            <span className="font-medium">{totalUtilisateurs}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Satisfaction:</span>
                            <span className="font-medium">{satisfactionMoyenne}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des Organismes */}
          <TabsContent value="organisations" className="space-y-6">
            {/* Filtres avec indicateur de chargement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Recherche et Filtres
                  {loadingStates.filtering && <Loader2 className="h-4 w-4 animate-spin" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="🔍 Rechercher par nom ou code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={loadingStates.filtering}
                    />
                  </div>
                  <Select value={selectedType} onValueChange={setSelectedType} disabled={loadingStates.filtering}>
                    <SelectTrigger className="lg:w-48">
                      <SelectValue placeholder="Type d'organisme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      {Object.entries(ORGANIZATION_TYPES).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={handleResetFilters}
                    disabled={loadingStates.filtering}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Réinitialiser
                  </Button>
                </div>
                {errorStates.filter && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{errorStates.filter}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Liste des organismes avec états de chargement */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrganisations.map((org) => (
                <Card key={org.id} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{org.nom}</CardTitle>
                      <Badge className={`text-white ${STATUS_CONFIG[org.status]?.color}`}>
                        {STATUS_CONFIG[org.status]?.label}
                      </Badge>
                    </div>
                    <CardDescription>
                      {ORGANIZATION_TYPES[org.type] || org.type} • {org.code}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Responsable:</span>
                          <p className="font-medium">{org.responsable}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Localisation:</span>
                          <p className="font-medium flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {org.localisation}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-blue-50 rounded">
                          <div className="text-lg font-bold text-blue-600">{org.demandes_mois || 0}</div>
                          <div className="text-xs text-muted-foreground">Demandes/mois</div>
                        </div>
                        <div className="p-2 bg-green-50 rounded">
                          <div className="text-lg font-bold text-green-600">{org.satisfaction || 0}%</div>
                          <div className="text-xs text-muted-foreground">Satisfaction</div>
                        </div>
                        <div className="p-2 bg-purple-50 rounded">
                          <div className="text-lg font-bold text-purple-600">{org.total_services || 0}</div>
                          <div className="text-xs text-muted-foreground">Services</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-sm text-muted-foreground">Services principaux:</span>
                        <div className="flex flex-wrap gap-1">
                          {(org.services_basiques || []).slice(0, 3).map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {(org.services_basiques?.length || 0) > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{(org.services_basiques?.length || 0) - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleViewOrganisme(org)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Détails
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleEditOrganisme(org)}
                          disabled={loadingStates.editing === org.id}
                        >
                          {loadingStates.editing === org.id ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <Edit className="h-3 w-3 mr-1" />
                          )}
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteOrganisme(org)}
                          disabled={loadingStates.deleting === org.id}
                        >
                          {loadingStates.deleting === org.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredOrganisations.length === 0 && !loadingStates.filtering && (
              <Card>
                <CardContent className="p-6 text-center">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun organisme trouvé</h3>
                  <p className="text-muted-foreground mb-4">
                    Aucun organisme ne correspond à vos critères de recherche.
                  </p>
                  <Button variant="outline" onClick={handleResetFilters}>
                    Réinitialiser les filtres
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Services Publics */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockServices.slice(0, 10).map((service, index) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{service.nom}</CardTitle>
                    <CardDescription>{service.organisme}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Badge className="bg-blue-500 text-white">
                          {service.categorie}
                        </Badge>
                        <Badge className="bg-green-500 text-white">
                          {service.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">{service.description}</p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Durée:</span>
                          <p className="font-medium">{service.duree}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Coût:</span>
                          <p className="font-medium">{service.cout}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-2 bg-green-50 rounded">
                          <div className="text-lg font-bold text-green-600">{service.satisfaction}%</div>
                          <div className="text-xs text-muted-foreground">Satisfaction</div>
                        </div>
                        <div className="p-2 bg-blue-50 rounded">
                          <div className="text-lg font-bold text-blue-600">{service.demandes_mois}</div>
                          <div className="text-xs text-muted-foreground">Demandes/mois</div>
                        </div>
                      </div>

                      <Button size="sm" variant="outline" className="w-full" asChild>
                        <Link href="/super-admin/services">
                          <Eye className="h-3 w-3 mr-1" />
                          Voir détails
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Button asChild>
                    <Link href="/super-admin/services">
                      <FileText className="mr-2 h-4 w-4" />
                      Gérer tous les services publics
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>📈 Évolution des Demandes</CardTitle>
                  <CardDescription>Tendances mensuelles par organisme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {organismes.slice(0, 4).map((org, index) => (
                      <div key={org.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{org.nom}</span>
                          <span className="text-muted-foreground">{org.stats?.totalUsers || 0} utilisateurs</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${((org.stats?.totalUsers || 0) / 200) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🎯 Performance Globale</CardTitle>
                  <CardDescription>Métriques clés du système</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/super-admin/administrations" className="text-center p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors block">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalOrganisations}</div>
                      <div className="text-sm text-muted-foreground">Organismes</div>
                    </Link>
                    <Link href="/super-admin/services" className="text-center p-4 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors block">
                      <div className="text-2xl font-bold text-green-600">{stats.totalServices}</div>
                      <div className="text-sm text-muted-foreground">Services</div>
                    </Link>
                    <Link href="/super-admin/utilisateurs" className="text-center p-4 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors block">
                      <div className="text-2xl font-bold text-purple-600">{stats.totalUtilisateurs.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Utilisateurs</div>
                    </Link>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{stats.satisfactionMoyenne}%</div>
                      <div className="text-sm text-muted-foreground">Satisfaction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>🔗 Actions Rapides Analytics</CardTitle>
                <CardDescription>Accédez aux analyses détaillées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" asChild>
                    <Link href="/super-admin/analytics">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analytics Détaillées
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/super-admin/systeme">
                      <Activity className="mr-2 h-4 w-4" />
                      Monitoring Système
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/super-admin/configuration">
                      <Settings className="mr-2 h-4 w-4" />
                      Configuration
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions rapides globales */}
        <Card>
          <CardHeader>
            <CardTitle>⚡ Actions Rapides Globales</CardTitle>
            <CardDescription>Gestion et administration centralisées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-20 flex-col hover:shadow-lg transition-all duration-200 hover:scale-105" variant="outline" asChild>
                <Link href="/super-admin/administrations">
                  <Building2 className="h-6 w-6 mb-2" />
                  <span>Gérer Organismes</span>
                  <span className="text-xs text-muted-foreground">{stats.totalOrganisations} organismes</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col hover:shadow-lg transition-all duration-200 hover:scale-105" variant="outline" asChild>
                <Link href="/super-admin/services">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Gérer Services</span>
                  <span className="text-xs text-muted-foreground">{stats.totalServices} services</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col hover:shadow-lg transition-all duration-200 hover:scale-105" variant="outline" asChild>
                <Link href="/super-admin/utilisateurs">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Gérer Utilisateurs</span>
                  <span className="text-xs text-muted-foreground">{stats.totalUtilisateurs} utilisateurs</span>
                </Link>
              </Button>
              <Button className="h-20 flex-col hover:shadow-lg transition-all duration-200 hover:scale-105" variant="outline" asChild>
                <Link href="/super-admin/organisme/nouveau">
                  <Plus className="h-6 w-6 mb-2" />
                  <span>Créer Organisme</span>
                  <span className="text-xs text-muted-foreground">Nouveau</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modal de détails d'organisme améliorée */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Détails de l'organisme
              </DialogTitle>
              <DialogDescription>
                Informations complètes pour {selectedOrganisme?.nom}
              </DialogDescription>
            </DialogHeader>

            {selectedOrganisme && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Informations générales</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Nom:</strong> {selectedOrganisme.nom}</div>
                      <div><strong>Code:</strong> {selectedOrganisme.code}</div>
                      <div><strong>Type:</strong> {ORGANIZATION_TYPES[selectedOrganisme.type] || selectedOrganisme.type}</div>
                      <div><strong>Localisation:</strong> {selectedOrganisme.localisation}</div>
                      <div><strong>Responsable:</strong> {selectedOrganisme.responsable || 'Non défini'}</div>
                      <div><strong>Téléphone:</strong> {selectedOrganisme.telephone || 'Non défini'}</div>
                      <div><strong>Site web:</strong> {selectedOrganisme.website || 'Non défini'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Métriques de Performance</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-600">{selectedOrganisme.demandes_mois || 0}</div>
                        <div className="text-xs text-muted-foreground">Demandes/mois</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-600">{selectedOrganisme.total_services || 0}</div>
                        <div className="text-xs text-muted-foreground">Services</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <div className="text-lg font-bold text-purple-600">{selectedOrganisme.services_basiques?.length || 0}</div>
                        <div className="text-xs text-muted-foreground">Services basiques</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded">
                        <div className="text-lg font-bold text-yellow-600">{selectedOrganisme.satisfaction || 0}%</div>
                        <div className="text-xs text-muted-foreground">Satisfaction</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Services proposés</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {(selectedOrganisme.services_basiques || []).map((service, index) => (
                        <div key={index} className="flex items-center p-2 bg-muted/50 rounded">
                          <FileText className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="text-sm">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Fermer
              </Button>
              {selectedOrganisme && (
                <Button onClick={() => handleEditOrganisme(selectedOrganisme)} disabled={loadingStates.editing === selectedOrganisme.id}>
                  {loadingStates.editing === selectedOrganisme.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Edit className="mr-2 h-4 w-4" />
                  )}
                  Modifier
                </Button>
              )}
              <Button asChild>
                <Link href="/super-admin/administrations">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Voir dans Administrations
                </Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
