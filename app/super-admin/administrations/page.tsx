'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc/client';
import {
  Building2,
  Search,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  FileText,
  Filter,
  BarChart3,
  Settings,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Archive,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Activity,
  Star,
  Shield,
  Loader2,
  RefreshCw,
  MoreHorizontal,
  Copy,
  AlertCircle,
  Save,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OrganizationType } from '@/lib/data/gabon-administrations';

// === INTERFACES ET TYPES ===
interface LoadingStates {
  refreshing: boolean;
  exporting: boolean;
  deleting: string | null;
  archiving: string | null;
  editing: string | null;
  bulkAction: boolean;
}

interface ErrorStates {
  refresh: string | null;
  export: string | null;
  delete: string | null;
  edit: string | null;
  general: string | null;
}

interface EditFormData {
  name: string;
  code: string;
  type: OrganizationType;
  city: string;
  isActive: boolean;
}

export default function SuperAdminAdministrationsPage() {
  const router = useRouter();

  // États de base
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<OrganizationType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedOrganisation, setSelectedOrganisation] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // États des modales
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);

  // États de chargement et erreurs
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    refreshing: false,
    exporting: false,
    deleting: null,
    archiving: null,
    editing: null,
    bulkAction: false
  });

  const [errorStates, setErrorStates] = useState<ErrorStates>({
    refresh: null,
    export: null,
    delete: null,
    edit: null,
    general: null
  });

  // Formulaire d'édition
  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: '',
    code: '',
    type: 'AUTRE',
    city: '',
    isActive: true
  });

  // ✅ VRAIES REQUÊTES API tRPC
  const {
    data: organizationsData,
    isLoading,
    error,
    refetch
  } = trpc.organizations.list.useQuery({
    search: searchTerm || undefined,
    type: selectedType !== 'all' ? selectedType as any : undefined,
    isActive: selectedStatus === 'all' ? undefined : selectedStatus === 'active',
    limit: 100,
    offset: 0,
  });

  // Mutations pour les opérations CRUD
  const updateOrganization = trpc.organizations.update.useMutation({
    onSuccess: () => {
      toast.success('✅ Organisation mise à jour avec succès');
      setIsEditOpen(false);
      setSelectedOrganisation(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`❌ Erreur: ${error.message}`);
      setErrorStates(prev => ({ ...prev, edit: error.message }));
    },
    onSettled: () => {
      setLoadingStates(prev => ({ ...prev, editing: null }));
    }
  });

  const deleteOrganization = trpc.organizations.delete.useMutation({
    onSuccess: () => {
      toast.success('🗑️ Organisation supprimée avec succès');
      setIsDeleteConfirmOpen(false);
      setSelectedOrganisation(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`❌ Erreur: ${error.message}`);
      setErrorStates(prev => ({ ...prev, delete: error.message }));
    },
    onSettled: () => {
      setLoadingStates(prev => ({ ...prev, deleting: null }));
    }
  });

  // Configuration des types avec correspondance Prisma
  const ORGANIZATION_TYPES = {
    PRESIDENCE: "Présidence de la République",
    PRIMATURE: "Primature",
    MINISTERE: "Ministère",
    DIRECTION_GENERALE: "Direction Générale",
    PROVINCE: "Province",
    PREFECTURE: "Préfecture",
    MAIRIE: "Mairie",
    ORGANISME_SOCIAL: "Organisme Social",
    INSTITUTION_JUDICIAIRE: "Institution Judiciaire",
    AGENCE_PUBLIQUE: "Agence Publique",
    INSTITUTION_ELECTORALE: "Institution Électorale",
    AUTRE: "Autre"
  };

  const STATUS_CONFIG = {
    active: { label: 'Actif', color: 'bg-green-500', icon: CheckCircle },
    inactive: { label: 'Inactif', color: 'bg-gray-500', icon: Clock },
  };

  // Calculs de statistiques RÉELLES depuis les API
  const stats = useMemo(() => {
    if (!organizationsData) return null;

    const { organizations, total } = organizationsData;
    const activeCount = organizations.filter(org => org.isActive).length;
    const inactiveCount = total - activeCount;

    // Répartition par type
    const typeDistribution = organizations.reduce((acc, org) => {
      acc[org.type] = (acc[org.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

         // Services par organisation (depuis les settings)
     const totalServices = organizations.reduce((sum, org) => {
       const services = (org.settings as any)?.services || [];
       return sum + (Array.isArray(services) ? services.length : 0);
     }, 0);

    return {
      totalOrganisations: total,
      activeOrganisations: activeCount,
      inactiveOrganisations: inactiveCount,
      totalServices: totalServices,
      averageServicesPerOrg: total > 0 ? Math.round(totalServices / total * 100) / 100 : 0,
      typeDistribution,
      topTypes: Object.entries(typeDistribution)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([type, count]) => ({
          type: ORGANIZATION_TYPES[type as keyof typeof ORGANIZATION_TYPES] || type,
          count: count as number
        }))
    };
  }, [organizationsData]);

  // ✅ VRAIE FONCTION D'ACTUALISATION
  const handleRefresh = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, refreshing: true }));
    setErrorStates(prev => ({ ...prev, refresh: null }));

    try {
      await refetch();
      setSelectedItems([]);
      toast.success('✅ Données actualisées depuis la base de données');
    } catch (error) {
      const errorMsg = 'Erreur lors de l\'actualisation des données';
      setErrorStates(prev => ({ ...prev, refresh: errorMsg }));
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, refreshing: false }));
    }
  }, [refetch]);

  // Affichage des détails
  const handleViewDetails = useCallback((organisation: any) => {
    setSelectedOrganisation(organisation);
    setIsDetailsOpen(true);
    toast.info(`📋 Affichage des détails de ${organisation.name}`);
  }, []);

  // Préparation de l'édition
  const handleEditPrepare = useCallback((organisation: any) => {
    setSelectedOrganisation(organisation);
    setEditFormData({
      name: organisation.name,
      code: organisation.code,
      type: organisation.type,
      city: organisation.city || '',
      isActive: organisation.isActive
    });
    setIsEditOpen(true);
    toast.info(`✏️ Préparation de l'édition de ${organisation.name}`);
  }, []);

  // ✅ VRAIE SAUVEGARDE avec API
  const handleEditSave = useCallback(async () => {
    if (!selectedOrganisation) return;

    setLoadingStates(prev => ({ ...prev, editing: selectedOrganisation.id }));
    setErrorStates(prev => ({ ...prev, edit: null }));

    try {
      // Validation
      if (!editFormData.name.trim() || !editFormData.code.trim()) {
        throw new Error('Le nom et le code sont obligatoires');
      }

      await updateOrganization.mutateAsync({
        id: selectedOrganisation.id,
        data: {
          name: editFormData.name,
          // Note: Le code ne peut pas être modifié après création
          city: editFormData.city,
        }
      });

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erreur lors de la sauvegarde';
      setErrorStates(prev => ({ ...prev, edit: errorMsg }));
      toast.error(`❌ ${errorMsg}`);
    }
  }, [selectedOrganisation, editFormData, updateOrganization]);

  // Préparation de la suppression
  const handleDeletePrepare = useCallback((organisation: any) => {
    setSelectedOrganisation(organisation);
    setIsDeleteConfirmOpen(true);
  }, []);

  // ✅ VRAIE SUPPRESSION avec API
  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedOrganisation) return;

    setLoadingStates(prev => ({ ...prev, deleting: selectedOrganisation.id }));
    setErrorStates(prev => ({ ...prev, delete: null }));

    try {
      await deleteOrganization.mutateAsync({ id: selectedOrganisation.id });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erreur lors de la suppression';
      setErrorStates(prev => ({ ...prev, delete: errorMsg }));
      toast.error(`❌ ${errorMsg}`);
    }
  }, [selectedOrganisation, deleteOrganization]);

  // Sélection d'éléments
  const handleSelectItem = useCallback((id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (!organizationsData) return;

    if (selectedItems.length === organizationsData.organizations.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(organizationsData.organizations.map(org => org.id));
    }
  }, [selectedItems, organizationsData]);

  // Navigation
  const handleNavigateToServices = useCallback(() => {
    toast.success('🔄 Redirection vers Services Publics...');
    router.push('/super-admin/services');
  }, [router]);

  const handleNavigateToCreerOrganisme = useCallback(() => {
    toast.success('🔄 Redirection vers Créer Organisme...');
    router.push('/super-admin/organisme/nouveau');
  }, [router]);

  // ✅ Export avec vraies données
  const exportToJSON = useCallback(async () => {
    if (!organizationsData || !stats) return;

    setLoadingStates(prev => ({ ...prev, exporting: true }));
    setErrorStates(prev => ({ ...prev, export: null }));

    try {
      const dataToExport = {
        exported_at: new Date().toISOString(),
        source: 'Base de données système ADMINISTRATION.GA',
        statistics: stats,
        organizations: organizationsData.organizations,
        metadata: {
          total_organisations: organizationsData.total,
          total_services: stats.totalServices,
          filters: {
            search: searchTerm,
            type: selectedType,
            status: selectedStatus
          },
          version: '3.0.0'
        }
      };

      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `administrations-gabon-live-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success(`✅ Export JSON réussi ! ${organizationsData.organizations.length} organisations exportées`);
    } catch (error) {
      const errorMsg = 'Erreur lors de l\'export JSON';
      setErrorStates(prev => ({ ...prev, export: errorMsg }));
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, exporting: false }));
    }
  }, [organizationsData, stats, searchTerm, selectedType, selectedStatus]);

  // Réinitialisation des filtres
  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedStatus('all');
    setSelectedItems([]);
    toast.info('🔄 Filtres réinitialisés');
  }, []);

  // Gestion des erreurs de chargement
  if (error) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Erreur de Chargement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                {error.message || 'Impossible de charger les organisations'}
              </p>
              <Button onClick={handleRefresh} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
      </AuthenticatedLayout>
    );
  }

  // Écran de chargement
  if (isLoading && !organizationsData) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-muted-foreground">Chargement des organisations depuis la base de données...</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Navigation contextuelle */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">🏢 Gestion des Organisations (Base de Données Live)</h3>
                <p className="text-sm text-muted-foreground">
                  Données en temps réel synchronisées avec la base de données système
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="default" asChild>
                  <Link href="/super-admin/administrations">
                    <Building2 className="mr-2 h-4 w-4" />
                    Administrations
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNavigateToCreerOrganisme}
                  disabled={loadingStates.refreshing}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Créer Organisme
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNavigateToServices}
                  disabled={loadingStates.refreshing}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Services Publics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* En-tête avec vraies statistiques */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-500" />
              Organisations Système ADMINISTRATION.GA
              {(loadingStates.refreshing || isLoading) && <Loader2 className="h-6 w-6 animate-spin text-blue-500" />}
            </h1>
            <p className="text-muted-foreground">
              {stats?.totalOrganisations || 0} organisations • {stats?.totalServices || 0} services • Base de données live
            </p>
            {errorStates.general && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                <AlertCircle className="h-4 w-4" />
                {errorStates.general}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loadingStates.refreshing || loadingStates.exporting || isLoading}
            >
              {(loadingStates.refreshing || isLoading) ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Actualiser
            </Button>

            <Button
              variant="outline"
              onClick={exportToJSON}
              disabled={loadingStates.exporting || loadingStates.refreshing || isLoading || !organizationsData}
            >
              {loadingStates.exporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export Live
            </Button>

            <Button
              onClick={handleNavigateToCreerOrganisme}
              disabled={loadingStates.refreshing || isLoading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Organisation
            </Button>
          </div>
        </div>

        {/* Statistiques réelles depuis l'API */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Organisations</p>
                    <p className="text-2xl font-bold">{stats.totalOrganisations}</p>
                    <p className="text-xs text-muted-foreground">
                      {stats.activeOrganisations} actives • {stats.inactiveOrganisations} inactives
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
                    <p className="text-sm font-medium text-muted-foreground">Services Configurés</p>
                    <p className="text-2xl font-bold">{stats.totalServices}</p>
                    <p className="text-xs text-muted-foreground">
                      Moyenne {stats.averageServicesPerOrg} services/org
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Types d'Organismes</p>
                    <p className="text-2xl font-bold">{Object.keys(stats.typeDistribution).length}</p>
                    <p className="text-xs text-muted-foreground">
                      {stats.topTypes[0]?.type}: {stats.topTypes[0]?.count || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Synchronisation</p>
                    <p className="text-2xl font-bold text-green-600">LIVE</p>
                    <p className="text-xs text-muted-foreground">
                      Base de données en temps réel
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filtres et recherche */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recherche et Filtres</CardTitle>
                <CardDescription>
                  Rechercher parmi {stats?.totalOrganisations || 0} organisations en base de données
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="🔍 Rechercher par nom, code, description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value as any)}>
                <SelectTrigger className="lg:w-48">
                  <SelectValue placeholder="Type d'organisation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {Object.entries(ORGANIZATION_TYPES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as any)}>
                <SelectTrigger className="lg:w-48">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleResetFilters}>
                <Filter className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table des organisations avec vraies données */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  📋 Organisations en Base de Données ({organizationsData?.organizations.length || 0}/{organizationsData?.total || 0})
                </CardTitle>
                <CardDescription>
                  Données synchronisées en temps réel avec le système
                </CardDescription>
              </div>
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{selectedItems.length} sélectionnés</Badge>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={organizationsData ? selectedItems.length === organizationsData.organizations.length && organizationsData.organizations.length > 0 : false}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Organisation</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>Membres</TableHead>
                    <TableHead>Demandes</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizationsData?.organizations.map((org) => (
                    <TableRow
                      key={org.id}
                      className={`hover:bg-muted/50 ${selectedItems.includes(org.id) ? 'bg-blue-50' : ''}`}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(org.id)}
                          onCheckedChange={() => handleSelectItem(org.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{org.name}</div>
                          <div className="text-sm text-muted-foreground">{org.code}</div>
                          {org.description && (
                            <div className="text-xs text-muted-foreground max-w-48 truncate">
                              {org.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {ORGANIZATION_TYPES[org.type] || org.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          {org.city || 'Non spécifiée'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{org._count?.userMemberships || 0}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-green-500" />
                            <span className="font-medium">{org._count?.requests || 0}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-white ${org.isActive ? 'bg-green-500' : 'bg-gray-500'}`}>
                          {org.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(org)}
                            disabled={loadingStates.refreshing || isLoading}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPrepare(org)}
                            disabled={loadingStates.editing === org.id || loadingStates.refreshing || isLoading}
                          >
                            {loadingStates.editing === org.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Edit className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeletePrepare(org)}
                            disabled={loadingStates.deleting === org.id || loadingStates.refreshing || isLoading}
                            className="text-red-600 hover:text-red-700"
                          >
                            {loadingStates.deleting === org.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {organizationsData?.organizations.length === 0 && (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune organisation trouvée</h3>
                <p className="text-muted-foreground mb-4">
                  Aucune organisation ne correspond à vos critères de recherche.
                </p>
                <Button variant="outline" onClick={handleResetFilters}>
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de détails avec vraies informations */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations de l'Organisation
              </DialogTitle>
              <DialogDescription>
                Détails complets pour {selectedOrganisation?.name}
              </DialogDescription>
            </DialogHeader>

            {selectedOrganisation && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Informations générales</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Nom:</strong> {selectedOrganisation.name}</div>
                      <div><strong>Code:</strong> {selectedOrganisation.code}</div>
                      <div><strong>Type:</strong> {ORGANIZATION_TYPES[selectedOrganisation.type] || selectedOrganisation.type}</div>
                      <div><strong>Localisation:</strong> {selectedOrganisation.city || 'Non spécifiée'}</div>
                      <div><strong>Description:</strong> {selectedOrganisation.description || 'Aucune description'}</div>
                      <div><strong>Statut:</strong> {selectedOrganisation.isActive ? 'Actif' : 'Inactif'}</div>
                      <div><strong>Créée le:</strong> {new Date(selectedOrganisation.createdAt).toLocaleDateString('fr-FR')}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Statistiques</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-600">{selectedOrganisation._count?.userMemberships || 0}</div>
                        <div className="text-xs text-muted-foreground">Membres</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-600">{selectedOrganisation._count?.requests || 0}</div>
                        <div className="text-xs text-muted-foreground">Demandes</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Informations de contact</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Adresse:</strong> {selectedOrganisation.address || 'Non spécifiée'}</div>
                      <div><strong>Téléphone:</strong> {selectedOrganisation.phone || 'Non spécifié'}</div>
                      <div><strong>Email:</strong> {selectedOrganisation.email || 'Non spécifié'}</div>
                      <div><strong>Site web:</strong> {selectedOrganisation.website || 'Non spécifié'}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Services configurés</h4>
                    <ScrollArea className="h-32">
                      <div className="space-y-2">
                        {((selectedOrganisation.settings as any)?.services || []).map((service: string, index: number) => (
                          <div key={index} className="flex items-center p-2 bg-muted/50 rounded">
                            <FileText className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-sm">{service}</span>
                          </div>
                        ))}
                        {!((selectedOrganisation.settings as any)?.services?.length) && (
                          <p className="text-sm text-muted-foreground">Aucun service configuré</p>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Fermer
              </Button>
              <Button onClick={() => {
                if (selectedOrganisation) {
                  setIsDetailsOpen(false);
                  handleEditPrepare(selectedOrganisation);
                }
              }}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal d'édition */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Modifier l'organisation
              </DialogTitle>
              <DialogDescription>
                Modifiez les informations de {selectedOrganisation?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {errorStates.edit && (
                <div className="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded">
                  <AlertCircle className="h-4 w-4" />
                  {errorStates.edit}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Nom de l'organisation *</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nom de l'organisation"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-code">Code organisation (lecture seule)</Label>
                  <Input
                    id="edit-code"
                    value={editFormData.code}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-city">Ville/Localisation</Label>
                  <Input
                    id="edit-city"
                    value={editFormData.city}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Ville ou localisation"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-active"
                    checked={editFormData.isActive}
                    onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, isActive: !!checked }))}
                  />
                  <Label htmlFor="edit-active">Organisation active</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                disabled={loadingStates.editing !== null}
              >
                <X className="mr-2 h-4 w-4" />
                Annuler
              </Button>
              <Button
                onClick={handleEditSave}
                disabled={loadingStates.editing !== null}
              >
                {loadingStates.editing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Sauvegarder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de confirmation de suppression */}
        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Confirmer la suppression
              </DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer <strong>{selectedOrganisation?.name}</strong> ?
                Cette action est irréversible et supprimera définitivement l'organisation de la base de données.
              </DialogDescription>
            </DialogHeader>

            {errorStates.delete && (
              <div className="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded">
                <AlertCircle className="h-4 w-4" />
                {errorStates.delete}
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteConfirmOpen(false)}
                disabled={loadingStates.deleting !== null}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={loadingStates.deleting !== null}
              >
                {loadingStates.deleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Supprimer définitivement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
