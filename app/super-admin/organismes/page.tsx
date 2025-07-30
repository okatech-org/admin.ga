'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  Building2,
  Users,
  MapPin,
  Phone,
  Mail,
  Globe,
  Shield,
  Activity,
  BarChart3,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  Calendar,
  UserCheck,
  ArrowRight,
  Search,
  Filter,
  Download,
  Settings,
  Edit,
  Eye,
  RefreshCw,
  FileText,
  ExternalLink,
  Loader2,
  AlertCircle,
  Target,
  Plus,
  Network,
  Crown,
  Flag,
  Home,
  Scale,
  Award,
  Factory,
  Landmark,
  Vote,
  ChevronRight,
  PieChart,
  X,
  Save,
  AlertTriangle,
  Database,
  Layers,
  Zap,
  Grid,
  List,
  Monitor,
  Smartphone
} from 'lucide-react';

import { ORGANISMES_ENRICHIS_GABON } from '@/lib/config/organismes-enrichis-gabon';
import { relationsGenerator, RELATIONS_GENEREES, STATS_RELATIONS } from '@/lib/services/relations-generator';

// Types pour la gestion d'état
interface OrganismeDisplay {
  code: string;
  nom: string;
  nomCourt: string;
  type: string;
  groupe: string;
  ville: string;
  province: string;
  mission: string;
  niveau: number;
  parentId?: string;
  status: 'ACTIF' | 'MAINTENANCE' | 'INACTIF';
  relations: number;
  services: number;
  telephone?: string;
  email?: string;
  website?: string;
  dateCreation: string;
  responsable?: string;
  effectif?: number;
  isActive: boolean;
}

interface LoadingStates {
  loading: boolean;
  refreshing: boolean;
  editing: string | null;
  viewingDetails: string | null;
  exporting: boolean;
  activating: string | null;
  updatingStatus: string | null;
}

interface OrganismesStats {
  totalOrganismes: number;
  organismesActifs: number;
  organismesMaintenance: number;
  organismesInactifs: number;
  totalServices: number;
  totalRelations: number;
  niveauxHierarchiques: number;
  densiteRelationnelle: number;
  groupes: {
    [key: string]: number;
  };
  types: {
    [key: string]: number;
  };
  provinces: {
    [key: string]: number;
  };
}

interface EditOrganismeForm {
  nom: string;
  nomCourt: string;
  type: string;
  ville: string;
  province: string;
  mission: string;
  telephone: string;
  email: string;
  website: string;
  responsable: string;
  effectif: number;
  status: 'ACTIF' | 'MAINTENANCE' | 'INACTIF';
  services: string[];
}

interface OrganismeActivity {
  id: string;
  type: 'STATUS_CHANGE' | 'RELATION_UPDATE' | 'SERVICE_UPDATE' | 'DATA_UPDATE' | 'ACCESS';
  description: string;
  date: string;
  user: string;
  details?: string;
}

export default function SuperAdminOrganismesPage() {
  // États de base
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedGroupe, setSelectedGroupe] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // États des modals
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [selectedOrganisme, setSelectedOrganisme] = useState<OrganismeDisplay | null>(null);

  // États de formulaire
  const [editForm, setEditForm] = useState<EditOrganismeForm>({
    nom: '',
    nomCourt: '',
    type: '',
    ville: '',
    province: '',
    mission: '',
    telephone: '',
    email: '',
    website: '',
    responsable: '',
    effectif: 0,
    status: 'ACTIF',
    services: []
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [organismeActivities, setOrganismeActivities] = useState<OrganismeActivity[]>([]);

  // États de chargement
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    loading: true,
    refreshing: false,
    editing: null,
    viewingDetails: null,
    exporting: false,
    activating: null,
    updatingStatus: null
  });

  // Transformation des données ORGANISMES_ENRICHIS_GABON
  const organismes = useMemo((): OrganismeDisplay[] => {
    return Object.values(ORGANISMES_ENRICHIS_GABON).map(org => {
      const orgRelations = relationsGenerator.getRelationsForOrganisme(org.code);
      const services = org.services?.length || Math.floor(Math.random() * 15) + 5;
      const statusOptions: Array<'ACTIF' | 'MAINTENANCE' | 'INACTIF'> = ['ACTIF', 'MAINTENANCE', 'INACTIF'];
      const randomStatus = Math.random();
      const status = randomStatus > 0.95 ? 'INACTIF' : randomStatus > 0.85 ? 'MAINTENANCE' : 'ACTIF';

      return {
        code: org.code,
        nom: org.nom,
        nomCourt: org.nomCourt || org.sigle || org.nom.substring(0, 20),
        type: org.type,
        groupe: org.groupe,
        ville: org.ville,
        province: org.province,
        mission: org.mission,
        niveau: org.niveau,
        parentId: org.parentId,
        status,
        relations: orgRelations.length,
        services,
        telephone: org.telephone || `+241 0${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
        email: org.email || `contact@${org.code.toLowerCase()}.ga`,
        website: org.website || `${org.code.toLowerCase()}.ga`,
        dateCreation: org.dateCreation || '2020-01-01',
        responsable: org.responsable,
        effectif: org.effectif || Math.floor(Math.random() * 200) + 20,
        isActive: org.isActive !== false
      };
    });
  }, []);

  // Filtrage des organismes
  const filteredOrganismes = useMemo(() => {
    return organismes.filter(org => {
      const matchesSearch = !searchTerm ||
        org.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.ville.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGroupe = selectedGroupe === 'all' || org.groupe === selectedGroupe;
      const matchesType = selectedType === 'all' || org.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || org.status === selectedStatus;
      const matchesProvince = selectedProvince === 'all' || org.province === selectedProvince;

      return matchesSearch && matchesGroupe && matchesType && matchesStatus && matchesProvince;
    });
  }, [organismes, searchTerm, selectedGroupe, selectedType, selectedStatus, selectedProvince]);

  // Calcul des statistiques
  const stats = useMemo((): OrganismesStats => {
    const total = organismes.length;
    const actifs = organismes.filter(org => org.status === 'ACTIF').length;
    const maintenance = organismes.filter(org => org.status === 'MAINTENANCE').length;
    const inactifs = organismes.filter(org => org.status === 'INACTIF').length;
    const totalServices = organismes.reduce((sum, org) => sum + org.services, 0);
    const totalRelations = organismes.reduce((sum, org) => sum + org.relations, 0);

    const groupes: Record<string, number> = {};
    const types: Record<string, number> = {};
    const provinces: Record<string, number> = {};

    organismes.forEach(org => {
      groupes[org.groupe] = (groupes[org.groupe] || 0) + 1;
      types[org.type] = (types[org.type] || 0) + 1;
      provinces[org.province] = (provinces[org.province] || 0) + 1;
    });

    return {
      totalOrganismes: total,
      organismesActifs: actifs,
      organismesMaintenance: maintenance,
      organismesInactifs: inactifs,
      totalServices,
      totalRelations,
      niveauxHierarchiques: Math.max(...organismes.map(org => org.niveau)),
      densiteRelationnelle: total > 0 ? Math.round((totalRelations / total) * 100) / 100 : 0,
      groupes,
      types,
      provinces
    };
  }, [organismes]);

  // Options pour les filtres
  const groupeOptions = useMemo(() =>
    Array.from(new Set(organismes.map(org => org.groupe))).sort()
  , [organismes]);

  const typeOptions = useMemo(() =>
    Array.from(new Set(organismes.map(org => org.type))).sort()
  , [organismes]);

  const provinceOptions = useMemo(() =>
    Array.from(new Set(organismes.map(org => org.province))).sort()
  , [organismes]);

  // Génération d'activités simulées pour un organisme
  const generateOrganismeActivities = useCallback((organisme: OrganismeDisplay): OrganismeActivity[] => {
    const activities: OrganismeActivity[] = [];
    const now = new Date();

    for (let i = 0; i < 8; i++) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000 * Math.random() * 30));
      const types: OrganismeActivity['type'][] = ['STATUS_CHANGE', 'RELATION_UPDATE', 'SERVICE_UPDATE', 'DATA_UPDATE', 'ACCESS'];
      const type = types[Math.floor(Math.random() * types.length)];

      activities.push({
        id: `activity-${i}`,
        type,
        description: {
          'STATUS_CHANGE': 'Changement de statut organisationnel',
          'RELATION_UPDATE': 'Mise à jour des relations inter-organismes',
          'SERVICE_UPDATE': 'Modification des services proposés',
          'DATA_UPDATE': 'Mise à jour des informations générales',
          'ACCESS': 'Accès au portail administratif'
        }[type],
        date: date.toISOString(),
        user: ['Admin Système', 'Responsable RH', 'Directeur IT', 'Secrétaire Général'][Math.floor(Math.random() * 4)],
        details: type === 'SERVICE_UPDATE' ? `${Math.floor(Math.random() * 5) + 1} services modifiés` : undefined
      });
    }

    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  // Fonctions utilitaires
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIF': return 'bg-green-100 text-green-800';
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800';
      case 'INACTIF': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PRESIDENCE': return Crown;
      case 'PRIMATURE': return Flag;
      case 'MINISTERE': return Building2;
      case 'DIRECTION_GENERALE': return Settings;
      case 'GOUVERNORAT': return Home;
      case 'PREFECTURE': return Scale;
      case 'MAIRIE': return Landmark;
      case 'ETABLISSEMENT_PUBLIC': return Factory;
      case 'INSTITUTION_JUDICIAIRE': return Shield;
      default: return Building2;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Gestionnaires d'événements
  const handleRefreshData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, refreshing: true }));
      // Simulation du rechargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('✅ Données actualisées');
    } finally {
      setLoadingStates(prev => ({ ...prev, refreshing: false }));
    }
  }, []);

  const handleViewDetails = useCallback(async (organisme: OrganismeDisplay) => {
    try {
      setLoadingStates(prev => ({ ...prev, viewingDetails: organisme.code }));

      // Générer les activités de l'organisme
      const activities = generateOrganismeActivities(organisme);
      setOrganismeActivities(activities);

      setSelectedOrganisme(organisme);
      setIsDetailsModalOpen(true);
      toast.success(`📊 Ouverture des détails de ${organisme.nom}`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'affichage des détails:', error);
      toast.error('❌ Erreur lors de l\'affichage des détails');
    } finally {
      setLoadingStates(prev => ({ ...prev, viewingDetails: null }));
    }
  }, [generateOrganismeActivities]);

  const handleEditOrganisme = useCallback(async (organisme: OrganismeDisplay) => {
    try {
      setLoadingStates(prev => ({ ...prev, editing: organisme.code }));

      // Remplir le formulaire avec les données actuelles
      setEditForm({
        nom: organisme.nom,
        nomCourt: organisme.nomCourt,
        type: organisme.type,
        ville: organisme.ville,
        province: organisme.province,
        mission: organisme.mission,
        telephone: organisme.telephone || '',
        email: organisme.email || '',
        website: organisme.website || '',
        responsable: organisme.responsable || '',
        effectif: organisme.effectif || 0,
        status: organisme.status,
        services: [] // À implémenter selon vos besoins
      });

      setSelectedOrganisme(organisme);
      setIsEditModalOpen(true);
      toast.success(`✅ Ouverture de l'édition de ${organisme.nom}`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'édition:', error);
      toast.error('❌ Erreur lors de l\'ouverture de l\'édition');
    } finally {
      setLoadingStates(prev => ({ ...prev, editing: null }));
    }
  }, []);

  const handleToggleStatus = useCallback(async (organisme: OrganismeDisplay) => {
    try {
      const newStatus = organisme.status === 'ACTIF' ? 'MAINTENANCE' : 'ACTIF';
      const confirmed = window.confirm(
        `⚠️ Changer le statut de "${organisme.nom}" vers "${newStatus}" ?\n\nCela affectera l'accès aux services.`
      );

      if (!confirmed) return;

      setLoadingStates(prev => ({ ...prev, updatingStatus: organisme.code }));

      // Simulation de mise à jour
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success(`✅ Statut de "${organisme.nom}" mis à jour vers "${newStatus}"`);
      await handleRefreshData();
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du statut:', error);
      toast.error('❌ Erreur lors de la mise à jour du statut');
    } finally {
      setLoadingStates(prev => ({ ...prev, updatingStatus: null }));
    }
  }, [handleRefreshData]);

  const handleExportData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, exporting: true }));

      // Simulation d'export
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Créer un CSV des organismes filtrés
      const csvContent = [
        ['Code', 'Nom', 'Type', 'Ville', 'Province', 'Statut', 'Services', 'Relations'].join(','),
        ...filteredOrganismes.map(org => [
          org.code,
          `"${org.nom}"`,
          org.type,
          org.ville,
          org.province,
          org.status,
          org.services,
          org.relations
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `organismes-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`📄 Export de ${filteredOrganismes.length} organismes terminé`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'export:', error);
      toast.error('❌ Erreur lors de l\'export');
    } finally {
      setLoadingStates(prev => ({ ...prev, exporting: false }));
    }
  }, [filteredOrganismes]);

  // Validation du formulaire d'édition
  const validateEditForm = useCallback((form: EditOrganismeForm): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!form.nom.trim()) errors.nom = 'Le nom est obligatoire';
    if (!form.nomCourt.trim()) errors.nomCourt = 'Le nom court est obligatoire';
    if (!form.type.trim()) errors.type = 'Le type est obligatoire';
    if (!form.ville.trim()) errors.ville = 'La ville est obligatoire';
    if (!form.province.trim()) errors.province = 'La province est obligatoire';
    if (!form.mission.trim()) errors.mission = 'La mission est obligatoire';

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Format d\'email invalide';
    }

    if (form.telephone && !/^\+241\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/.test(form.telephone)) {
      errors.telephone = 'Format de téléphone invalide (+241 XX XX XX XX)';
    }

    return errors;
  }, []);

  const handleSaveOrganisme = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, editing: selectedOrganisme?.code || 'unknown' }));

      // Validation
      const errors = validateEditForm(editForm);
      setFormErrors(errors);

      if (Object.keys(errors).length > 0) {
        toast.error('❌ Veuillez corriger les erreurs du formulaire');
        return;
      }

      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(`✅ Organisme "${editForm.nom}" modifié avec succès`);
      setIsEditModalOpen(false);
      setSelectedOrganisme(null);
      setFormErrors({});

      // Recharger les données
      await handleRefreshData();
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      toast.error('❌ Erreur lors de la sauvegarde');
    } finally {
      setLoadingStates(prev => ({ ...prev, editing: null }));
    }
  }, [editForm, validateEditForm, selectedOrganisme, handleRefreshData]);

  // Initialisation
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoadingStates(prev => ({ ...prev, loading: true }));
        // Simulation du chargement initial
        await new Promise(resolve => setTimeout(resolve, 1000));
      } finally {
        setLoadingStates(prev => ({ ...prev, loading: false }));
      }
    };

    initializeData();
  }, []);

  if (loadingStates.loading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
            <div>
              <h3 className="font-semibold text-lg">Chargement des organismes...</h3>
              <p className="text-muted-foreground">Récupération des 160 organismes publics gabonais</p>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Organismes</h1>
            <p className="text-gray-600 mt-1">
              Administration des 160 organismes publics gabonais
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleRefreshData}
              disabled={loadingStates.refreshing}
            >
              {loadingStates.refreshing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Actualiser
            </Button>

            <Button
              variant="outline"
              onClick={handleExportData}
              disabled={loadingStates.exporting}
            >
              {loadingStates.exporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Exporter
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Organismes</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalOrganismes}</p>
                  <p className="text-xs text-green-600">
                    {stats.organismesActifs} actifs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Network className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Relations</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalRelations}</p>
                  <p className="text-xs text-gray-600">
                    {stats.densiteRelationnelle} par organisme
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
                  <p className="text-sm font-medium text-gray-600">Services</p>
                  <p className="text-3xl font-bold text-green-600">{stats.totalServices}</p>
                  <p className="text-xs text-gray-600">
                    {Math.round(stats.totalServices / stats.totalOrganismes)} par organisme
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
                  <p className="text-sm font-medium text-gray-600">Statut</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs">{stats.organismesActifs}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-xs">{stats.organismesMaintenance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-xs">{stats.organismesInactifs}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Distribution des statuts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation par onglets */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="grid">Grille</TabsTrigger>
              <TabsTrigger value="list">Liste</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Filtres */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres et Recherche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedGroupe} onValueChange={setSelectedGroupe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Groupe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les groupes</SelectItem>
                    {groupeOptions.map(groupe => (
                      <SelectItem key={groupe} value={groupe}>
                        Groupe {groupe} ({stats.groupes[groupe]})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {typeOptions.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ')} ({stats.types[type]})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                  <SelectTrigger>
                    <SelectValue placeholder="Province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les provinces</SelectItem>
                    {provinceOptions.map(province => (
                      <SelectItem key={province} value={province}>
                        {province} ({stats.provinces[province]})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="ACTIF">Actif ({stats.organismesActifs})</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance ({stats.organismesMaintenance})</SelectItem>
                    <SelectItem value="INACTIF">Inactif ({stats.organismesInactifs})</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedGroupe('all');
                    setSelectedType('all');
                    setSelectedProvince('all');
                    setSelectedStatus('all');
                  }}
                >
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Onglet Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Répartition par groupes */}
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par Groupes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.groupes).map(([groupe, count]) => (
                      <div key={groupe} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="font-medium">Groupe {groupe}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{count}</span>
                          <Badge variant="outline">
                            {Math.round((count / stats.totalOrganismes) * 100)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Répartition par types */}
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.types)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 6)
                      .map(([type, count]) => {
                        const Icon = getTypeIcon(type);
                        return (
                          <div key={type} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-gray-600" />
                              <span className="font-medium text-sm">
                                {type.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">{count}</span>
                              <Badge variant="outline">
                                {Math.round((count / stats.totalOrganismes) * 100)}%
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Organismes récents */}
            <Card>
              <CardHeader>
                <CardTitle>Organismes Récemment Modifiés</CardTitle>
                <CardDescription>
                  {filteredOrganismes.length} organismes correspondent aux filtres
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredOrganismes.slice(0, 5).map((org) => (
                    <div key={org.code} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{org.nom}</p>
                          <p className="text-sm text-gray-600">{org.ville}, {org.province}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(org.status)}>
                          {org.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(org)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Grille */}
          <TabsContent value="grid" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrganismes.map((org) => {
                const Icon = getTypeIcon(org.type);
                return (
                  <Card key={org.code} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{org.nomCourt}</CardTitle>
                            <CardDescription className="text-sm">
                              {org.code}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={getStatusColor(org.status)}>
                          {org.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {org.mission}
                        </p>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{org.ville}, {org.province}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Services</span>
                            <p className="font-medium">{org.services}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Relations</span>
                            <p className="font-medium">{org.relations}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(org)}
                            disabled={loadingStates.viewingDetails === org.code}
                          >
                            {loadingStates.viewingDetails === org.code ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditOrganisme(org)}
                            disabled={loadingStates.editing === org.code}
                          >
                            {loadingStates.editing === org.code ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Edit className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(org)}
                            disabled={loadingStates.updatingStatus === org.code}
                          >
                            {loadingStates.updatingStatus === org.code ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : org.status === 'ACTIF' ? (
                              <AlertTriangle className="h-4 w-4" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredOrganismes.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Aucun organisme trouvé</h3>
                  <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Onglet Liste */}
          <TabsContent value="list" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Liste des Organismes ({filteredOrganismes.length})</CardTitle>
                <CardDescription>
                  Liste détaillée de tous les organismes filtrés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredOrganismes.map((org) => {
                    const Icon = getTypeIcon(org.type);
                    return (
                      <div key={org.code} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-sm">{org.nom}</h3>
                              <Badge variant="outline" className="text-xs">
                                {org.code}
                              </Badge>
                              <Badge className={getStatusColor(org.status)}>
                                {org.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {org.ville}, {org.province}
                              </span>
                              <span>{org.type.replace('_', ' ')}</span>
                              <span>{org.services} services</span>
                              <span>{org.relations} relations</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(org)}
                            disabled={loadingStates.viewingDetails === org.code}
                          >
                            {loadingStates.viewingDetails === org.code ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditOrganisme(org)}
                            disabled={loadingStates.editing === org.code}
                          >
                            {loadingStates.editing === org.code ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Edit className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(org)}
                            disabled={loadingStates.updatingStatus === org.code}
                          >
                            {loadingStates.updatingStatus === org.code ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : org.status === 'ACTIF' ? (
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de détails */}
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {selectedOrganisme && (
                  <>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{selectedOrganisme.nom}</h2>
                      <p className="text-sm text-gray-600">{selectedOrganisme.code}</p>
                    </div>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            {selectedOrganisme && (
              <div className="space-y-6">
                {/* Informations générales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Informations Générales</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Type</span>
                          <p className="font-medium">{selectedOrganisme.type.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Groupe</span>
                          <p className="font-medium">Groupe {selectedOrganisme.groupe}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Localisation</span>
                          <p className="font-medium">{selectedOrganisme.ville}, {selectedOrganisme.province}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Niveau</span>
                          <p className="font-medium">Niveau {selectedOrganisme.niveau}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Statut</span>
                          <Badge className={getStatusColor(selectedOrganisme.status)}>
                            {selectedOrganisme.status}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-gray-600">Effectif</span>
                          <p className="font-medium">{selectedOrganisme.effectif} agents</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-600 text-sm">Mission</span>
                        <p className="font-medium mt-1">{selectedOrganisme.mission}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contact et Accès</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedOrganisme.telephone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">{selectedOrganisme.telephone}</span>
                        </div>
                      )}
                      {selectedOrganisme.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">{selectedOrganisme.email}</span>
                        </div>
                      )}
                      {selectedOrganisme.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">{selectedOrganisme.website}</span>
                        </div>
                      )}
                      {selectedOrganisme.responsable && (
                        <div>
                          <span className="text-gray-600 text-sm">Responsable</span>
                          <p className="font-medium">{selectedOrganisme.responsable}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <FileText className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-600">{selectedOrganisme.services}</p>
                      <p className="text-sm text-gray-600">Services</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Network className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-purple-600">{selectedOrganisme.relations}</p>
                      <p className="text-sm text-gray-600">Relations</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">{selectedOrganisme.effectif}</p>
                      <p className="text-sm text-gray-600">Effectif</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Activités récentes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Activités Récentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-48">
                      <div className="space-y-3">
                        {organismeActivities.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <Activity className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium">{activity.description}</p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                                <span>{activity.user}</span>
                                <span>•</span>
                                <span>{formatDate(activity.date)}</span>
                                {activity.details && (
                                  <>
                                    <span>•</span>
                                    <span>{activity.details}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
                Fermer
              </Button>
              {selectedOrganisme && (
                <Button onClick={() => handleEditOrganisme(selectedOrganisme)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal d'édition */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier l'Organisme</DialogTitle>
              <DialogDescription>
                Modification des informations de {selectedOrganisme?.nom}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom">Nom complet *</Label>
                  <Input
                    id="nom"
                    value={editForm.nom}
                    onChange={(e) => setEditForm(prev => ({ ...prev, nom: e.target.value }))}
                    className={formErrors.nom ? 'border-red-500' : ''}
                  />
                  {formErrors.nom && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.nom}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="nomCourt">Nom court *</Label>
                  <Input
                    id="nomCourt"
                    value={editForm.nomCourt}
                    onChange={(e) => setEditForm(prev => ({ ...prev, nomCourt: e.target.value }))}
                    className={formErrors.nomCourt ? 'border-red-500' : ''}
                  />
                  {formErrors.nomCourt && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.nomCourt}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select value={editForm.type} onValueChange={(value) => setEditForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className={formErrors.type ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.type && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.type}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select value={editForm.status} onValueChange={(value: 'ACTIF' | 'MAINTENANCE' | 'INACTIF') => setEditForm(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIF">Actif</SelectItem>
                      <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                      <SelectItem value="INACTIF">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ville">Ville *</Label>
                  <Input
                    id="ville"
                    value={editForm.ville}
                    onChange={(e) => setEditForm(prev => ({ ...prev, ville: e.target.value }))}
                    className={formErrors.ville ? 'border-red-500' : ''}
                  />
                  {formErrors.ville && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.ville}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="province">Province *</Label>
                  <Select value={editForm.province} onValueChange={(value) => setEditForm(prev => ({ ...prev, province: value }))}>
                    <SelectTrigger className={formErrors.province ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Sélectionner la province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinceOptions.map(province => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.province && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.province}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    value={editForm.telephone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, telephone: e.target.value }))}
                    placeholder="+241 XX XX XX XX"
                    className={formErrors.telephone ? 'border-red-500' : ''}
                  />
                  {formErrors.telephone && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.telephone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className={formErrors.email ? 'border-red-500' : ''}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    value={editForm.website}
                    onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="responsable">Responsable</Label>
                  <Input
                    id="responsable"
                    value={editForm.responsable}
                    onChange={(e) => setEditForm(prev => ({ ...prev, responsable: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="effectif">Effectif</Label>
                  <Input
                    id="effectif"
                    type="number"
                    value={editForm.effectif}
                    onChange={(e) => setEditForm(prev => ({ ...prev, effectif: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="mission">Mission *</Label>
                <Textarea
                  id="mission"
                  value={editForm.mission}
                  onChange={(e) => setEditForm(prev => ({ ...prev, mission: e.target.value }))}
                  rows={3}
                  className={formErrors.mission ? 'border-red-500' : ''}
                />
                {formErrors.mission && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.mission}</p>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button
                onClick={handleSaveOrganisme}
                disabled={loadingStates.editing !== null}
              >
                {loadingStates.editing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
