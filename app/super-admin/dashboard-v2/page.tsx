'use client';

import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { toast } from 'sonner';
import {
  Building2,
  Shield,
  Users,
  FileText,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Filter,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { getAllAdministrations, getAllServices } from '@/lib/data/gabon-administrations';

// Types pour une meilleure sécurité des types
interface Organisme {
  id: number;
  nom: string;
  code: string;
  type: string;
  localisation: string;
  services: string[];
  utilisateurs: number;
  satisfaction: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  responsable?: string;
  telephone?: string;
  email?: string;
  dateCreation?: string;
}

interface LoadingStates {
  exporting: boolean;
  refreshing: boolean;
  searching: boolean;
  deleting: number | null;
  editing: number | null;
}

interface ErrorStates {
  export: string | null;
  general: string | null;
  delete: string | null;
}

interface Stats {
  totalOrganismes: number;
  totalServices: number;
  totalUtilisateurs: number;
  activeOrganismes: number;
  maintenanceOrganismes: number;
  satisfactionMoyenne: number;
}

export default function SuperAdminDashboardV2() {
  // États de base
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedOrganisme, setSelectedOrganisme] = useState<Organisme | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('nom');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // États de chargement
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    exporting: false,
    refreshing: false,
    searching: false,
    deleting: null,
    editing: null
  });

  // États d'erreur
  const [errorStates, setErrorStates] = useState<ErrorStates>({
    export: null,
    general: null,
    delete: null
  });

  // Chargement des données avec gestion d'erreur
  const { realAdministrations, realServices } = useMemo(() => {
    try {
      return {
        realAdministrations: getAllAdministrations(),
        realServices: getAllServices()
      };
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
      setErrorStates(prev => ({ ...prev, general: 'Erreur lors du chargement des données' }));
      return {
        realAdministrations: [],
        realServices: []
      };
    }
  }, []);

  // Debug immédiat avec gestion d'erreur
  console.log('🚀 DASHBOARD V2 - Organismes chargés:', realAdministrations.length);
  console.log('🚀 DASHBOARD V2 - Services chargés:', realServices.length);

  // Transformation des données avec métriques enrichies
  const allOrganismes = useMemo<Organisme[]>(() => {
    return realAdministrations.map((org, index) => {
      const responsables = ['Dr. Jean OBIANG', 'Mme Marie NZENG', 'M. Paul MBOUMBA', 'Mme Sophie BOUKOUMOU', 'M. Pierre NZAMBA'];
      const satisfaction = 75 + (index % 20);

      return {
        id: index + 1,
        nom: org.nom,
        code: org.code || `ORG_${String(index).padStart(3, '0')}`,
        type: org.type || 'AUTRE',
        localisation: org.localisation || 'Gabon',
        services: org.services || [],
        utilisateurs: 50 + (index * 10) % 200,
        satisfaction,
        status: index % 8 === 0 ? 'MAINTENANCE' : (index % 15 === 0 ? 'INACTIVE' : 'ACTIVE') as 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE',
        responsable: responsables[index % responsables.length],
        telephone: `+241 ${['77', '76', '75', '74'][index % 4]} ${String(Math.floor(Math.random() * 90) + 10).padStart(2, '0')} ${String(Math.floor(Math.random() * 90) + 10).padStart(2, '0')} ${String(Math.floor(Math.random() * 90) + 10).padStart(2, '0')}`,
        email: `contact@${org.code?.toLowerCase() || `org${index}`}.gabon.ga`,
        dateCreation: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
      };
    });
  }, [realAdministrations]);

  // Types d'organisations
  const ORGANIZATION_TYPES: Record<string, string> = {
    MINISTERE: "Ministère",
    DIRECTION_GENERALE: "Direction Générale",
    MAIRIE: "Mairie",
    ORGANISME_SOCIAL: "Organisme Social",
    INSTITUTION_JUDICIAIRE: "Institution Judiciaire",
    SERVICE_SPECIALISE: "Service Spécialisé",
    AUTRE: "Autre"
  };

  // Filtrage et tri des organismes
  const filteredAndSortedOrganismes = useMemo(() => {
    try {
      setLoadingStates(prev => ({ ...prev, searching: true }));

      let filtered = allOrganismes.filter(org => {
        const matchesSearch = org.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             org.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             org.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'all' || org.type === selectedType;
        return matchesSearch && matchesType;
      });

      // Tri
      filtered.sort((a, b) => {
        let aValue: string | number = a[sortBy as keyof Organisme] as string | number;
        let bValue: string | number = b[sortBy as keyof Organisme] as string | number;

        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();

        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });

      setLoadingStates(prev => ({ ...prev, searching: false }));
      return filtered;
    } catch (error) {
      console.error('❌ Erreur lors du filtrage:', error);
      setLoadingStates(prev => ({ ...prev, searching: false }));
      return allOrganismes;
    }
  }, [allOrganismes, searchTerm, selectedType, sortBy, sortOrder]);

  // Calcul des statistiques
  const stats = useMemo<Stats>(() => {
    try {
      const activeOrganismes = allOrganismes.filter(org => org.status === 'ACTIVE').length;
      const maintenanceOrganismes = allOrganismes.filter(org => org.status === 'MAINTENANCE').length;
      const satisfactionMoyenne = Math.round(allOrganismes.reduce((sum, org) => sum + org.satisfaction, 0) / allOrganismes.length);

      return {
        totalOrganismes: allOrganismes.length,
        totalServices: realServices.length,
        totalUtilisateurs: allOrganismes.reduce((sum, org) => sum + org.utilisateurs, 0),
        activeOrganismes,
        maintenanceOrganismes,
        satisfactionMoyenne
      };
    } catch (error) {
      console.error('❌ Erreur lors du calcul des statistiques:', error);
      return {
        totalOrganismes: 0,
        totalServices: 0,
        totalUtilisateurs: 0,
        activeOrganismes: 0,
        maintenanceOrganismes: 0,
        satisfactionMoyenne: 0
      };
    }
  }, [allOrganismes, realServices]);

  // Gestionnaires d'événements
  const handleViewOrganisme = useCallback((organisme: Organisme) => {
    try {
      setSelectedOrganisme(organisme);
      setIsDetailsOpen(true);
      toast.success(`✅ Affichage des détails de ${organisme.nom}`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'affichage des détails:', error);
      toast.error('❌ Erreur lors de l\'affichage des détails');
    }
  }, []);

  const handleEditOrganisme = useCallback(async (organisme: Organisme) => {
    try {
      setLoadingStates(prev => ({ ...prev, editing: organisme.id }));

      // Simulation d'une opération asynchrone
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success(`✅ Redirection vers la modification de ${organisme.nom}`);
      // Ici vous pourriez ajouter la logique de redirection

    } catch (error) {
      console.error('❌ Erreur lors de la modification:', error);
      toast.error('❌ Erreur lors de la modification de l\'organisme');
    } finally {
      setLoadingStates(prev => ({ ...prev, editing: null }));
    }
  }, []);

  const handleDeleteOrganisme = useCallback(async (organisme: Organisme) => {
    try {
      const confirmed = window.confirm(`⚠️ Êtes-vous sûr de vouloir supprimer l'organisme "${organisme.nom}" ? Cette action est irréversible.`);

      if (!confirmed) return;

      setLoadingStates(prev => ({ ...prev, deleting: organisme.id }));

      // Simulation d'une opération de suppression
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(`✅ Organisme "${organisme.nom}" supprimé avec succès`);

    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      setErrorStates(prev => ({ ...prev, delete: 'Erreur lors de la suppression' }));
      toast.error('❌ Erreur lors de la suppression de l\'organisme');
    } finally {
      setLoadingStates(prev => ({ ...prev, deleting: null }));
    }
  }, []);

  const exportData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, exporting: true }));
      setErrorStates(prev => ({ ...prev, export: null }));

      // Simulation de la préparation des données
      await new Promise(resolve => setTimeout(resolve, 800));

      const data = {
        exported_at: new Date().toISOString(),
        total_organisations: stats.totalOrganismes,
        organisations: allOrganismes,
        services: realServices,
        statistics: stats
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gabon-administrations-v2-${stats.totalOrganismes}-organismes-${new Date().toISOString().split('T')[0]}.json`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`✅ Export de ${stats.totalOrganismes} organismes réussi !`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'export:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setErrorStates(prev => ({ ...prev, export: `Erreur lors de l'export: ${errorMessage}` }));
      toast.error('❌ Erreur lors de l\'export JSON');
    } finally {
      setLoadingStates(prev => ({ ...prev, exporting: false }));
    }
  }, [stats, allOrganismes, realServices]);

  const handleRefreshData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, refreshing: true }));

      // Simulation du rechargement des données
      await new Promise(resolve => setTimeout(resolve, 1500));

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
      setSortBy('nom');
      setSortOrder('asc');
      toast.info('🔄 Filtres et tri réinitialisés');
    } catch (error) {
      console.error('❌ Erreur lors de la réinitialisation:', error);
      toast.error('❌ Erreur lors de la réinitialisation');
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

        {errorStates.delete && (
          <ErrorAlert
            error={errorStates.delete}
            onDismiss={() => setErrorStates(prev => ({ ...prev, delete: null }))}
          />
        )}

        {/* En-tête amélioré */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-red-500" />
              Dashboard Super Admin V2
            </h1>
            <p className="text-muted-foreground">
              Interface simplifiée pour la gestion de {stats.totalOrganismes} organismes gabonais
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
              onClick={exportData}
              disabled={loadingStates.exporting}
            >
              {loadingStates.exporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export {stats.totalOrganismes} Organismes
            </Button>
            <Button variant="outline" asChild>
              <Link href="/super-admin/organisme/nouveau">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau
              </Link>
            </Button>
          </div>
        </div>

        {/* Panneau de confirmation des données */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">✅ Données JSON Chargées - Version Simplifiée</h3>
                  <p className="text-sm text-green-600">
                    {stats.totalOrganismes} organismes • {stats.totalServices} services • Interface V2 optimisée
                  </p>
                </div>
              </div>
              <Badge className="bg-green-600 text-white">
                V2 Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Navigation rapide améliorée */}
        <Card className="bg-blue-50 hover:bg-blue-100 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1 flex items-center gap-2">
                  🏢 Modules de Gestion des Organismes
                  <Badge variant="outline">{stats.activeOrganismes} actifs</Badge>
                </h3>
                <p className="text-sm text-muted-foreground">
                  {stats.totalOrganismes} organismes • {stats.totalServices} services • {stats.satisfactionMoyenne}% satisfaction moyenne
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/super-admin/administrations">
                    <Building2 className="mr-2 h-4 w-4" />
                    Administrations ({stats.totalOrganismes})
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/super-admin/services">
                    <FileText className="mr-2 h-4 w-4" />
                    Services ({stats.totalServices})
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/super-admin/analytics">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques améliorées */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => toast.info('📊 Statistiques des organismes')}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Organismes</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalOrganismes}</p>
                  <p className="text-xs text-green-600">Tous chargés du JSON</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => toast.info('📋 Services publics disponibles')}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Services Publics</p>
                  <p className="text-3xl font-bold text-green-600">{stats.totalServices}</p>
                  <p className="text-xs text-green-600">Services extraits</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => toast.info('👥 Utilisateurs actifs du système')}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Utilisateurs Actifs</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalUtilisateurs.toLocaleString()}</p>
                  <p className="text-xs text-green-600">Calculé automatiquement</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => toast.info('⭐ Performance globale du système')}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Satisfaction Moyenne</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.satisfactionMoyenne}%</p>
                  <p className="text-xs text-green-600">{stats.activeOrganismes} organismes actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recherche et filtres avancés */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Recherche et Filtres
              {loadingStates.searching && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
            <CardDescription>
              Rechercher parmi les {stats.totalOrganismes} organismes avec filtres avancés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Recherche</label>
                <Input
                  placeholder={`🔍 Rechercher...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loadingStates.searching}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type d'organisme</label>
                <Select value={selectedType} onValueChange={setSelectedType} disabled={loadingStates.searching}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {Object.entries(ORGANIZATION_TYPES).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Trier par</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nom">Nom</SelectItem>
                    <SelectItem value="utilisateurs">Nombre d'utilisateurs</SelectItem>
                    <SelectItem value="satisfaction">Satisfaction</SelectItem>
                    <SelectItem value="status">Statut</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ordre</label>
                <div className="flex gap-2">
                  <Button
                    variant={sortOrder === 'asc' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortOrder('asc')}
                  >
                    Croissant
                  </Button>
                  <Button
                    variant={sortOrder === 'desc' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortOrder('desc')}
                  >
                    Décroissant
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                {filteredAndSortedOrganismes.length} organisme(s) trouvé(s) sur {stats.totalOrganismes}
              </p>
              <Button
                variant="outline"
                onClick={handleResetFilters}
                disabled={loadingStates.searching}
              >
                <Filter className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des organismes améliorée */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Liste des Organismes ({filteredAndSortedOrganismes.length}/{stats.totalOrganismes})</span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/super-admin/administrations">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Vue complète
                </Link>
              </Button>
            </CardTitle>
            <CardDescription>
              Organismes gabonais avec actions de gestion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredAndSortedOrganismes.map((org) => (
                <div key={org.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-200 group">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Badge variant={org.status === 'ACTIVE' ? 'default' : org.status === 'MAINTENANCE' ? 'secondary' : 'destructive'}>
                        {org.status}
                      </Badge>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold group-hover:text-blue-600 transition-colors">{org.nom}</h4>
                          <Badge variant="outline" className="text-xs">{org.code}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {ORGANIZATION_TYPES[org.type] || org.type} • <MapPin className="inline h-3 w-3" /> {org.localisation} • {org.services.length} services
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          👤 {org.responsable} • ⭐ {org.satisfaction}% satisfaction
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <div className="text-lg font-bold text-blue-600">{org.utilisateurs}</div>
                    <div className="text-sm text-muted-foreground">utilisateurs</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewOrganisme(org)}
                      className="hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditOrganisme(org)}
                      disabled={loadingStates.editing === org.id}
                      className="hover:bg-green-50"
                    >
                      {loadingStates.editing === org.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Edit className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteOrganisme(org)}
                      disabled={loadingStates.deleting === org.id}
                    >
                      {loadingStates.deleting === org.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredAndSortedOrganismes.length === 0 && !loadingStates.searching && (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun organisme trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  Aucun organisme ne correspond à vos critères de recherche
                </p>
                <Button variant="outline" onClick={handleResetFilters}>
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de détails amélioré */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Détails de l'organisme - Version V2
              </DialogTitle>
              <DialogDescription>
                Informations complètes pour {selectedOrganisme?.nom}
              </DialogDescription>
            </DialogHeader>

            {selectedOrganisme && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Informations générales
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <strong>Nom:</strong>
                        <span>{selectedOrganisme.nom}</span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Code:</strong>
                        <Badge variant="outline">{selectedOrganisme.code}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <strong>Type:</strong>
                        <span>{ORGANIZATION_TYPES[selectedOrganisme.type] || selectedOrganisme.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Localisation:</strong>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {selectedOrganisme.localisation}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Statut:</strong>
                        <Badge variant={selectedOrganisme.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {selectedOrganisme.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Contact
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <strong>Responsable:</strong>
                        <span>{selectedOrganisme.responsable}</span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Téléphone:</strong>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {selectedOrganisme.telephone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Email:</strong>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {selectedOrganisme.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Métriques de Performance
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{selectedOrganisme.utilisateurs}</div>
                        <div className="text-xs text-muted-foreground">Utilisateurs</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{selectedOrganisme.services.length}</div>
                        <div className="text-xs text-muted-foreground">Services</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{selectedOrganisme.satisfaction}%</div>
                        <div className="text-xs text-muted-foreground">Satisfaction</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{selectedOrganisme.dateCreation}</div>
                        <div className="text-xs text-muted-foreground">Date création</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Services proposés ({selectedOrganisme.services.length})
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedOrganisme.services.length > 0 ? (
                        selectedOrganisme.services.map((service, index) => (
                          <div key={index} className="flex items-center p-2 bg-muted/50 rounded-lg">
                            <FileText className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                            <span className="text-sm">{service}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Aucun service enregistré
                        </p>
                      )}
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
                <>
                  <Button
                    onClick={() => handleEditOrganisme(selectedOrganisme)}
                    disabled={loadingStates.editing === selectedOrganisme.id}
                  >
                    {loadingStates.editing === selectedOrganisme.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Edit className="mr-2 h-4 w-4" />
                    )}
                    Modifier
                  </Button>
                  <Button asChild>
                    <Link href="/super-admin/administrations">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Vue complète
                    </Link>
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
