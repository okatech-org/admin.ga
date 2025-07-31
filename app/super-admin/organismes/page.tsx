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
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
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
  clientStatus: 'CLIENT' | 'PROSPECT' | 'INACTIF_CLIENT';
  satisfaction: number;
  demandesMois: number;
  revenus?: number;
  dernierAcces?: string;
}

interface LoadingStates {
  loading: boolean;
  refreshing: boolean;
  editing: string | null;
  viewingDetails: string | null;
  exporting: boolean;
  activating: string | null;
  updatingStatus: string | null;
  managingServices: string | null;
  managingRelations: string | null;
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
  clientsCount: number;
  prospectsCount: number;
  inactifClientsCount: number;
  totalRevenues: number;
  clientsRevenues: number;
  prospectsRevenues: number;
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

interface ServiceOrganisme {
  id: string;
  nom: string;
  description: string;
  type: 'ADMINISTRATIF' | 'SOCIAL' | 'ECONOMIQUE' | 'JURIDIQUE' | 'TECHNIQUE';
  status: 'ACTIF' | 'MAINTENANCE' | 'INACTIF';
  dateCreation: string;
  responsable?: string;
  delaiTraitement?: number;
  coutService?: number;
  documentRequis?: string[];
}

interface RelationOrganisme {
  id: string;
  organismeId: string;
  nomOrganisme: string;
  typeRelation: 'HIERARCHIQUE' | 'FONCTIONNELLE' | 'COOPERATION' | 'CONTRACTUELLE';
  direction: 'PARENT' | 'ENFANT' | 'BILATERAL';
  description: string;
  dateDebut: string;
  dateFin?: string;
  isActive: boolean;
}

export default function SuperAdminOrganismesPage() {
  // États de base
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedGroupe, setSelectedGroupe] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedClientStatus, setSelectedClientStatus] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // États de pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  // États des modals
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState<boolean>(false);
  const [isRelationsModalOpen, setIsRelationsModalOpen] = useState<boolean>(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
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
  const [organismeServices, setOrganismeServices] = useState<ServiceOrganisme[]>([]);
  const [organismeRelations, setOrganismeRelations] = useState<RelationOrganisme[]>([]);

  // États de chargement
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    loading: true,
    refreshing: false,
    editing: null,
    viewingDetails: null,
    exporting: false,
    activating: null,
    updatingStatus: null,
    managingServices: null,
    managingRelations: null
  });

  // Fonction de validation sécurisée
  const sanitizeString = useCallback((str: string | undefined, maxLength: number = 255): string => {
    if (!str) return '';
    return str.trim().substring(0, maxLength).replace(/[<>\"'&]/g, '');
  }, []);

  // Transformation des données ORGANISMES_ENRICHIS_GABON
  const organismes = useMemo((): OrganismeDisplay[] => {
    return Object.values(ORGANISMES_ENRICHIS_GABON).map(org => {
      const orgRelations = relationsGenerator.getRelationsForOrganisme(org.code);
      const services = org.services?.length || Math.floor(Math.random() * 15) + 5;
      const statusOptions: Array<'ACTIF' | 'MAINTENANCE' | 'INACTIF'> = ['ACTIF', 'MAINTENANCE', 'INACTIF'];
      const randomStatus = Math.random();
      const status = randomStatus > 0.95 ? 'INACTIF' : randomStatus > 0.85 ? 'MAINTENANCE' : 'ACTIF';

            // Classification intelligente automatique avec validation
      const satisfaction = Math.max(60, Math.min(100, Math.floor(Math.random() * 40) + 60)); // 60-100%
      const demandesMois = Math.max(10, Math.min(1000, Math.floor(Math.random() * 500) + 50)); // 10-1000 demandes
      const servicesCount = Math.max(1, Math.min(50, services)); // 1-50 services max

      let clientStatus: 'CLIENT' | 'PROSPECT' | 'INACTIF_CLIENT';
      if (servicesCount >= 15 && satisfaction >= 85 && demandesMois >= 200) {
        clientStatus = 'CLIENT';
      } else if (servicesCount >= 8 && satisfaction >= 70 && demandesMois >= 100) {
        clientStatus = 'PROSPECT';
      } else {
        clientStatus = 'INACTIF_CLIENT';
      }

      return {
        code: sanitizeString(org.code, 20),
        nom: sanitizeString(org.nom, 200),
        nomCourt: sanitizeString(org.nomCourt || org.sigle || org.nom?.substring(0, 20), 50),
        type: org.type,
        groupe: org.groupe,
        ville: sanitizeString(org.ville, 100),
        province: sanitizeString(org.province, 100),
        mission: sanitizeString(org.mission, 500),
        niveau: org.niveau,
        parentId: org.parentId,
        status,
        relations: orgRelations.length,
        services: servicesCount,
        telephone: org.telephone || `+241 0${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
        email: org.email || `contact@${org.code.toLowerCase()}.ga`,
        website: org.website || `${org.code.toLowerCase()}.ga`,
        dateCreation: org.dateCreation || '2020-01-01',
        responsable: org.responsable,
        effectif: org.effectif || Math.floor(Math.random() * 200) + 20,
        isActive: org.isActive !== false,
        clientStatus,
        satisfaction,
        demandesMois,
        revenus: clientStatus === 'CLIENT' ? Math.floor(Math.random() * 50000000) + 5000000 :
                clientStatus === 'PROSPECT' ? Math.floor(Math.random() * 10000000) + 1000000 : 0,
        dernierAcces: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      };
    });
  }, [sanitizeString]);

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
      const matchesClientStatus = selectedClientStatus === 'all' || org.clientStatus === selectedClientStatus;

      return matchesSearch && matchesGroupe && matchesType && matchesStatus && matchesProvince && matchesClientStatus;
    });
  }, [organismes, searchTerm, selectedGroupe, selectedType, selectedStatus, selectedProvince, selectedClientStatus]);

  // Pagination des organismes filtrés
  const paginatedOrganismes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrganismes.slice(startIndex, endIndex);
  }, [filteredOrganismes, currentPage, itemsPerPage]);

  // Calcul des informations de pagination
  const totalPages = Math.ceil(filteredOrganismes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredOrganismes.length);

  // Calcul des statistiques avec protection contre les données invalides
  const stats = useMemo((): OrganismesStats => {
    if (!organismes || organismes.length === 0) {
      return {
        totalOrganismes: 0, organismesActifs: 0, organismesMaintenance: 0, organismesInactifs: 0,
        totalServices: 0, totalRelations: 0, niveauxHierarchiques: 0, densiteRelationnelle: 0,
        clientsCount: 0, prospectsCount: 0, inactifClientsCount: 0, totalRevenues: 0,
        clientsRevenues: 0, prospectsRevenues: 0, groupes: {}, types: {}, provinces: {}
      };
    }

    const total = organismes.length;
    const actifs = organismes.filter(org => org?.status === 'ACTIF').length;
    const maintenance = organismes.filter(org => org?.status === 'MAINTENANCE').length;
    const inactifs = organismes.filter(org => org?.status === 'INACTIF').length;
    const totalServices = organismes.reduce((sum, org) => sum + (org?.services || 0), 0);
    const totalRelations = organismes.reduce((sum, org) => sum + (org?.relations || 0), 0);

    // Calculs des statuts clients avec protection
    const clientsCount = organismes.filter(org => org?.clientStatus === 'CLIENT').length;
    const prospectsCount = organismes.filter(org => org?.clientStatus === 'PROSPECT').length;
    const inactifClientsCount = organismes.filter(org => org?.clientStatus === 'INACTIF_CLIENT').length;
    const totalRevenues = organismes.reduce((sum, org) => sum + (org?.revenus || 0), 0);
    const clientsRevenues = organismes.filter(org => org?.clientStatus === 'CLIENT').reduce((sum, org) => sum + (org?.revenus || 0), 0);
    const prospectsRevenues = organismes.filter(org => org?.clientStatus === 'PROSPECT').reduce((sum, org) => sum + (org?.revenus || 0), 0);

    const groupes: Record<string, number> = {};
    const types: Record<string, number> = {};
    const provinces: Record<string, number> = {};

    organismes.forEach(org => {
      if (org?.groupe) groupes[org.groupe] = (groupes[org.groupe] || 0) + 1;
      if (org?.type) types[org.type] = (types[org.type] || 0) + 1;
      if (org?.province) provinces[org.province] = (provinces[org.province] || 0) + 1;
    });

    const niveaux = organismes.map(org => org?.niveau || 0).filter(n => n > 0);
    const maxNiveau = niveaux.length > 0 ? Math.max(...niveaux) : 0;

    return {
      totalOrganismes: total,
      organismesActifs: actifs,
      organismesMaintenance: maintenance,
      organismesInactifs: inactifs,
      totalServices,
      totalRelations,
      niveauxHierarchiques: maxNiveau,
      densiteRelationnelle: total > 0 ? Math.round((totalRelations / total) * 100) / 100 : 0,
      clientsCount,
      prospectsCount,
      inactifClientsCount,
      totalRevenues,
      clientsRevenues,
      prospectsRevenues,
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

  // Génération de services simulés pour un organisme
  const generateOrganismeServices = useCallback((organisme: OrganismeDisplay): ServiceOrganisme[] => {
    const services: ServiceOrganisme[] = [];
    const serviceTypes: ServiceOrganisme['type'][] = ['ADMINISTRATIF', 'SOCIAL', 'ECONOMIQUE', 'JURIDIQUE', 'TECHNIQUE'];
    const serviceStatus: ServiceOrganisme['status'][] = ['ACTIF', 'MAINTENANCE', 'INACTIF'];

    const serviceNames = [
      'Délivrance d\'actes administratifs',
      'Gestion des dossiers citoyens',
      'Service de renseignements',
      'Traitement des demandes',
      'Contrôle et inspection',
      'Assistance technique',
      'Formation et développement',
      'Suivi des projets',
      'Coordination inter-services',
      'Gestion documentaire'
    ];

    for (let i = 0; i < organisme.services; i++) {
      const randomStatus = Math.random();
      const status = randomStatus > 0.95 ? 'INACTIF' : randomStatus > 0.85 ? 'MAINTENANCE' : 'ACTIF';

      services.push({
        id: `service-${organisme.code}-${i + 1}`,
        nom: serviceNames[i % serviceNames.length] + (i >= serviceNames.length ? ` ${Math.floor(i / serviceNames.length) + 1}` : ''),
        description: `Service ${i + 1} de l'organisme ${organisme.nomCourt}`,
        type: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
        status,
        dateCreation: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        responsable: `Responsable Service ${i + 1}`,
        delaiTraitement: Math.floor(Math.random() * 30) + 1,
        coutService: Math.random() > 0.5 ? Math.floor(Math.random() * 50000) + 5000 : 0,
        documentRequis: [
          'Pièce d\'identité',
          'Justificatif de domicile',
          'Formulaire de demande'
        ].slice(0, Math.floor(Math.random() * 3) + 1)
      });
    }

    return services;
  }, []);

  // Génération de relations simulées pour un organisme
  const generateOrganismeRelations = useCallback((organisme: OrganismeDisplay): RelationOrganisme[] => {
    const relations: RelationOrganisme[] = [];
    const relationTypes: RelationOrganisme['typeRelation'][] = ['HIERARCHIQUE', 'FONCTIONNELLE', 'COOPERATION', 'CONTRACTUELLE'];
    const directions: RelationOrganisme['direction'][] = ['PARENT', 'ENFANT', 'BILATERAL'];

    // Obtenir une liste d'autres organismes pour les relations
    const autresOrganismes = organismes.filter(org => org.code !== organisme.code).slice(0, organisme.relations);

    autresOrganismes.forEach((autreOrg, index) => {
      relations.push({
        id: `relation-${organisme.code}-${autreOrg.code}`,
        organismeId: autreOrg.code,
        nomOrganisme: autreOrg.nom,
        typeRelation: relationTypes[Math.floor(Math.random() * relationTypes.length)],
        direction: directions[Math.floor(Math.random() * directions.length)],
        description: `Relation ${index + 1} entre ${organisme.nomCourt} et ${autreOrg.nomCourt}`,
        dateDebut: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dateFin: Math.random() > 0.8 ? new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
        isActive: Math.random() > 0.1
      });
    });

    return relations;
  }, [organismes]);

  // Fonctions utilitaires
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIF': return 'bg-green-100 text-green-800';
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800';
      case 'INACTIF': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClientStatusColor = (clientStatus: string) => {
    switch (clientStatus) {
      case 'CLIENT': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'PROSPECT': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'INACTIF_CLIENT': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getClientStatusIcon = (clientStatus: string) => {
    switch (clientStatus) {
      case 'CLIENT': return '💼';
      case 'PROSPECT': return '👀';
      case 'INACTIF_CLIENT': return '😴';
      default: return '❓';
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

  const handleViewServices = useCallback(async (organisme: OrganismeDisplay) => {
    try {
      setLoadingStates(prev => ({ ...prev, managingServices: organisme.code }));

      // Générer les services de l'organisme
      const services = generateOrganismeServices(organisme);
      setOrganismeServices(services);

      setSelectedOrganisme(organisme);
      setIsServicesModalOpen(true);
      toast.success(`📋 Services de ${organisme.nomCourt} chargés`);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des services:', error);
      toast.error('❌ Erreur lors du chargement des services');
    } finally {
      setLoadingStates(prev => ({ ...prev, managingServices: null }));
    }
  }, [generateOrganismeServices]);

  const handleViewRelations = useCallback(async (organisme: OrganismeDisplay) => {
    try {
      setLoadingStates(prev => ({ ...prev, managingRelations: organisme.code }));

      // Générer les relations de l'organisme
      const relations = generateOrganismeRelations(organisme);
      setOrganismeRelations(relations);

      setSelectedOrganisme(organisme);
      setIsRelationsModalOpen(true);
      toast.success(`🔗 Relations de ${organisme.nomCourt} chargées`);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des relations:', error);
      toast.error('❌ Erreur lors du chargement des relations');
    } finally {
      setLoadingStates(prev => ({ ...prev, managingRelations: null }));
    }
  }, [generateOrganismeRelations]);

  const handleDeleteService = useCallback(async (serviceId: string) => {
    try {
      const confirmed = window.confirm('⚠️ Supprimer ce service ?');
      if (!confirmed) return;

      setOrganismeServices(prev => prev.filter(service => service.id !== serviceId));
      toast.success('✅ Service supprimé');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      toast.error('❌ Erreur lors de la suppression');
    }
  }, []);

  const handleDeleteRelation = useCallback(async (relationId: string) => {
    try {
      const confirmed = window.confirm('⚠️ Supprimer cette relation ?');
      if (!confirmed) return;

      setOrganismeRelations(prev => prev.filter(relation => relation.id !== relationId));
      toast.success('✅ Relation supprimée');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      toast.error('❌ Erreur lors de la suppression');
    }
  }, []);

  // Fonction pour fermer toutes les modales
  const closeAllModals = useCallback(() => {
    setIsEditModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsServicesModalOpen(false);
    setIsRelationsModalOpen(false);
    setIsConvertModalOpen(false);
    setIsPreviewModalOpen(false);
    setSelectedOrganisme(null);
    setFormErrors({});
  }, []);

  // Fonction de conversion en client
  const handleConvertToClient = useCallback(async (organisme: OrganismeDisplay) => {
    try {
      closeAllModals();
      setSelectedOrganisme(organisme);
      setIsConvertModalOpen(true);
      toast.success(`🎯 Conversion de ${organisme.nomCourt} en client`);
    } catch (error) {
      console.error('❌ Erreur lors de la conversion:', error);
      toast.error('❌ Erreur lors de la conversion');
    }
  }, [closeAllModals]);

  // Fonction de prévisualisation de la page d'accueil
  const handlePreviewOrganisme = useCallback(async (organisme: OrganismeDisplay) => {
    try {
      closeAllModals();
      setSelectedOrganisme(organisme);
      setIsPreviewModalOpen(true);
      toast.success(`👀 Prévisualisation de ${organisme.nomCourt}`);
    } catch (error) {
      console.error('❌ Erreur lors de la prévisualisation:', error);
      toast.error('❌ Erreur lors de la prévisualisation');
    }
  }, [closeAllModals]);

    // Fonction de mise à jour du statut client
  const handleUpdateClientStatus = useCallback(async (organisme: OrganismeDisplay | null, newStatus: 'CLIENT' | 'PROSPECT' | 'INACTIF_CLIENT') => {
    if (!organisme) {
      toast.error('❌ Organisme non sélectionné');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, updatingStatus: organisme.code }));

      // Validation des données
      if (!organisme.code || !organisme.nomCourt) {
        throw new Error('Données organisme incomplètes');
      }

      // Simulation de mise à jour avec délai raisonnable
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success(`✅ ${organisme.nomCourt} maintenant classé comme ${newStatus}`);
      setIsConvertModalOpen(false);
      await handleRefreshData();
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', error);
      toast.error(`❌ Erreur lors de la mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, updatingStatus: null }));
    }
  }, [handleRefreshData]);

  // Gestionnaires de pagination
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Retour à la première page
  }, []);

  // Réinitialiser la page quand les filtres changent
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedGroupe('all');
    setSelectedType('all');
    setSelectedProvince('all');
    setSelectedStatus('all');
    setSelectedClientStatus('all');
    setCurrentPage(1);
  }, []);

  // Réinitialiser la page à 1 quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGroupe, selectedType, selectedProvince, selectedStatus, selectedClientStatus]);

  // Gestionnaire pour filtrer par groupe
  const handleFilterByGroupe = useCallback((groupe: string) => {
    setSelectedGroupe(groupe);
    setSelectedTab('grid'); // Basculer vers la grille pour voir les résultats
    setCurrentPage(1);
    toast.success(`📊 Filtrage par Groupe ${groupe} (${stats.groupes[groupe]} organismes)`);
  }, [stats.groupes]);

  // Gestionnaire pour filtrer par type
  const handleFilterByType = useCallback((type: string) => {
    setSelectedType(type);
    setSelectedTab('grid'); // Basculer vers la grille pour voir les résultats
    setCurrentPage(1);
    toast.success(`📊 Filtrage par ${type.replace('_', ' ')} (${stats.types[type]} organismes)`);
  }, [stats.types]);

  // Gestion de l'ESC pour fermer les modales
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAllModals();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [closeAllModals]);

  // Initialisation
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoadingStates(prev => ({ ...prev, loading: true }));
        // Simulation du chargement initial avec délai réduit
        await new Promise(resolve => setTimeout(resolve, 800));
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
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
                  <SelectTrigger className={selectedGroupe !== 'all' ? 'border-blue-300 bg-blue-50' : ''}>
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
                  <SelectTrigger className={selectedType !== 'all' ? 'border-purple-300 bg-purple-50' : ''}>
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

                <Select value={selectedClientStatus} onValueChange={setSelectedClientStatus}>
                  <SelectTrigger className={selectedClientStatus !== 'all' ? 'border-emerald-300 bg-emerald-50' : ''}>
                    <SelectValue placeholder="Statut Client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="CLIENT">💼 Clients ({stats.clientsCount || 0})</SelectItem>
                    <SelectItem value="PROSPECT">👀 Prospects ({stats.prospectsCount || 0})</SelectItem>
                    <SelectItem value="INACTIF_CLIENT">😴 Inactifs ({stats.inactifClientsCount || 0})</SelectItem>
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
                    <SelectValue placeholder="Statut Tech" />
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
                  onClick={resetFilters}
                >
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Onglet Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {/* Classification clients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎯 Classification Clients
                  <Badge variant="outline" className="text-xs">
                    Nouvelle fonctionnalité
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Classification intelligente basée sur l'activité et les performances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                     <div
                     className="p-4 rounded-lg border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 cursor-pointer transition-all group focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                     tabIndex={0}
                     role="button"
                     aria-label="Filtrer les clients"
                     onClick={() => {
                       setSelectedClientStatus('CLIENT');
                       setSelectedTab('grid');
                       toast.success(`💼 ${stats.clientsCount} clients affichés`);
                     }}
                     onKeyDown={(e) => {
                       if (e.key === 'Enter' || e.key === ' ') {
                         e.preventDefault();
                         setSelectedClientStatus('CLIENT');
                         setSelectedTab('grid');
                         toast.success(`💼 ${stats.clientsCount} clients affichés`);
                       }
                     }}
                   >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">💼</div>
                      <div>
                                                 <div className="font-semibold text-emerald-800">
                           {stats.clientsCount} Clients
                         </div>
                         <div className="text-sm text-emerald-600">≥15 services, ≥85% satisfaction</div>
                       </div>
                     </div>
                     <div className="mt-2 text-xs text-emerald-700">
                       Revenus: {stats.clientsRevenues.toLocaleString()} FCFA
                     </div>
                  </div>

                                     <div
                     className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-all group focus:ring-2 focus:ring-blue-500 focus:outline-none"
                     tabIndex={0}
                     role="button"
                     aria-label="Filtrer les prospects"
                     onClick={() => {
                       setSelectedClientStatus('PROSPECT');
                       setSelectedTab('grid');
                       toast.success(`👀 ${stats.prospectsCount} prospects affichés`);
                     }}
                     onKeyDown={(e) => {
                       if (e.key === 'Enter' || e.key === ' ') {
                         e.preventDefault();
                         setSelectedClientStatus('PROSPECT');
                         setSelectedTab('grid');
                         toast.success(`👀 ${stats.prospectsCount} prospects affichés`);
                       }
                     }}
                   >
                     <div className="flex items-center gap-3">
                       <div className="text-2xl">👀</div>
                       <div>
                         <div className="font-semibold text-blue-800">
                           {stats.prospectsCount} Prospects
                         </div>
                         <div className="text-sm text-blue-600">≥8 services, ≥70% satisfaction</div>
                       </div>
                     </div>
                     <div className="mt-2 text-xs text-blue-700">
                       Potentiel: {stats.prospectsRevenues.toLocaleString()} FCFA
                     </div>
                  </div>

                                     <div
                     className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all group focus:ring-2 focus:ring-gray-500 focus:outline-none"
                     tabIndex={0}
                     role="button"
                     aria-label="Filtrer les organismes inactifs"
                     onClick={() => {
                       setSelectedClientStatus('INACTIF_CLIENT');
                       setSelectedTab('grid');
                       toast.success(`😴 ${stats.inactifClientsCount} inactifs affichés`);
                     }}
                     onKeyDown={(e) => {
                       if (e.key === 'Enter' || e.key === ' ') {
                         e.preventDefault();
                         setSelectedClientStatus('INACTIF_CLIENT');
                         setSelectedTab('grid');
                         toast.success(`😴 ${stats.inactifClientsCount} inactifs affichés`);
                       }
                     }}
                   >
                     <div className="flex items-center gap-3">
                       <div className="text-2xl">😴</div>
                       <div>
                         <div className="font-semibold text-gray-800">
                           {stats.inactifClientsCount} Inactifs
                         </div>
                                                 <div className="text-sm text-gray-600">&lt;8 services ou &lt;70% satisfaction</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-700">
                      À réactiver ou convertir
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Répartition par groupes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Répartition par Groupes
                    <Badge variant="outline" className="text-xs">
                      Cliquable
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Cliquez sur un groupe pour filtrer les organismes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(stats.groupes).map(([groupe, count]) => (
                      <div
                        key={groupe}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-all duration-200 group"
                        onClick={() => handleFilterByGroupe(groupe)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-blue-500 group-hover:bg-blue-600 transition-colors"></div>
                          <span className="font-medium group-hover:text-blue-700 transition-colors">
                            Groupe {groupe}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm text-gray-600 group-hover:text-blue-600 font-semibold px-2 py-1 rounded-md group-hover:bg-blue-100 transition-all"
                          >
                            {count}
                          </span>
                          <Badge variant="outline" className="group-hover:border-blue-300 group-hover:text-blue-700 transition-colors">
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
                  <CardTitle className="flex items-center gap-2">
                    Répartition par Types
                    <Badge variant="outline" className="text-xs">
                      Cliquable
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Cliquez sur un type pour filtrer les organismes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(stats.types)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 6)
                      .map(([type, count]) => {
                        const Icon = getTypeIcon(type);
                        return (
                          <div
                            key={type}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-purple-50 hover:border-purple-200 cursor-pointer transition-all duration-200 group"
                            onClick={() => handleFilterByType(type)}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-4 h-4 text-gray-600 group-hover:text-purple-600 transition-colors" />
                              <span className="font-medium text-sm group-hover:text-purple-700 transition-colors">
                                {type.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className="text-sm text-gray-600 group-hover:text-purple-600 font-semibold px-2 py-1 rounded-md group-hover:bg-purple-100 transition-all"
                              >
                                {count}
                              </span>
                              <Badge variant="outline" className="group-hover:border-purple-300 group-hover:text-purple-700 transition-colors">
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
            {/* Indicateur de filtre actif */}
            {(selectedGroupe !== 'all' || selectedType !== 'all') && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium text-blue-800">
                    Filtre actif:
                    {selectedGroupe !== 'all' && (
                      <span className="ml-1 px-2 py-1 bg-blue-100 rounded text-xs">
                        Groupe {selectedGroupe}
                      </span>
                    )}
                    {selectedType !== 'all' && (
                      <span className="ml-1 px-2 py-1 bg-purple-100 rounded text-xs">
                        {selectedType.replace('_', ' ')}
                      </span>
                    )}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-auto text-xs h-6"
                    onClick={() => {
                      setSelectedGroupe('all');
                      setSelectedType('all');
                      toast.success('🔄 Filtres supprimés');
                    }}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedOrganismes.map((org) => {
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
                        <div className="flex flex-col gap-1">
                          <Badge className={getStatusColor(org.status)}>
                            {org.status}
                          </Badge>
                          <Badge variant="outline" className={getClientStatusColor(org.clientStatus)}>
                            {getClientStatusIcon(org.clientStatus)} {org.clientStatus}
                          </Badge>
                        </div>
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

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{org.satisfaction}% satisfaction</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span>{org.demandesMois} demandes/mois</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 block mb-1">Services</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full justify-between h-8"
                              onClick={() => handleViewServices(org)}
                              disabled={loadingStates.managingServices === org.code}
                            >
                              {loadingStates.managingServices === org.code ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <>
                                  <span className="font-medium">{org.services}</span>
                                  <FileText className="h-3 w-3" />
                                </>
                              )}
                            </Button>
                          </div>
                          <div>
                            <span className="text-gray-600 block mb-1">Relations</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full justify-between h-8"
                              onClick={() => handleViewRelations(org)}
                              disabled={loadingStates.managingRelations === org.code}
                            >
                              {loadingStates.managingRelations === org.code ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <>
                                  <span className="font-medium">{org.relations}</span>
                                  <Network className="h-3 w-3" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-2 border-t">
                          <div className="flex items-center gap-2">
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

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant={org.clientStatus === 'CLIENT' ? 'default' : 'outline'}
                              onClick={() => handleConvertToClient(org)}
                              className="flex-1"
                            >
                              <Target className="h-3 w-3 mr-1" />
                              {org.clientStatus === 'CLIENT' ? 'Client' : 'Convertir'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePreviewOrganisme(org)}
                            >
                              <Monitor className="h-3 w-3" />
                            </Button>
                          </div>
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

            {/* Pagination pour la grille */}
            {filteredOrganismes.length > 0 && (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>
                      Affichage de {startIndex} à {endIndex} sur {filteredOrganismes.length} organismes
                    </span>
                    <div className="flex items-center gap-2">
                      <span>Éléments par page:</span>
                      <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => handleItemsPerPageChange(parseInt(value))}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6</SelectItem>
                          <SelectItem value="12">12</SelectItem>
                          <SelectItem value="24">24</SelectItem>
                          <SelectItem value="48">48</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </TabsContent>

          {/* Onglet Liste */}
          <TabsContent value="list" className="space-y-6">
            {/* Indicateur de filtre actif */}
            {(selectedGroupe !== 'all' || selectedType !== 'all') && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium text-blue-800">
                    Filtre actif:
                    {selectedGroupe !== 'all' && (
                      <span className="ml-1 px-2 py-1 bg-blue-100 rounded text-xs">
                        Groupe {selectedGroupe}
                      </span>
                    )}
                    {selectedType !== 'all' && (
                      <span className="ml-1 px-2 py-1 bg-purple-100 rounded text-xs">
                        {selectedType.replace('_', ' ')}
                      </span>
                    )}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-auto text-xs h-6"
                    onClick={() => {
                      setSelectedGroupe('all');
                      setSelectedType('all');
                      toast.success('🔄 Filtres supprimés');
                    }}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Liste des Organismes ({filteredOrganismes.length})</CardTitle>
                <CardDescription>
                  Liste détaillée de tous les organismes filtrés - Page {currentPage} sur {totalPages}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {paginatedOrganismes.map((org) => {
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

                {/* Pagination pour la liste */}
                {filteredOrganismes.length > 0 && (
                  <div className="mt-6 flex flex-col items-center space-y-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                          Affichage de {startIndex} à {endIndex} sur {filteredOrganismes.length} organismes
                        </span>
                        <div className="flex items-center gap-2">
                          <span>Éléments par page:</span>
                          <Select
                            value={itemsPerPage.toString()}
                            onValueChange={(value) => handleItemsPerPageChange(parseInt(value))}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="6">6</SelectItem>
                              <SelectItem value="12">12</SelectItem>
                              <SelectItem value="24">24</SelectItem>
                              <SelectItem value="48">48</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) handlePageChange(currentPage - 1);
                            }}
                            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(page);
                                  }}
                                  isActive={currentPage === page}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          return null;
                        })}

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) handlePageChange(currentPage + 1);
                            }}
                            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
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

        {/* Modal de gestion des services */}
        <Dialog open={isServicesModalOpen} onOpenChange={setIsServicesModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-green-500" />
                <div>
                  <span>Gestion des Services</span>
                  {selectedOrganisme && (
                    <p className="text-sm font-normal text-gray-600">
                      {selectedOrganisme.nom} ({organismeServices.length} services)
                    </p>
                  )}
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Bouton d'ajout */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Gérez les services proposés par cet organisme
                </p>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter un service
                </Button>
              </div>

              {/* Liste des services */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {organismeServices.map((service) => (
                  <Card key={service.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-sm">{service.nom}</h4>
                            <Badge
                              variant="outline"
                              className={
                                service.status === 'ACTIF' ? 'text-green-700 border-green-300' :
                                service.status === 'MAINTENANCE' ? 'text-yellow-700 border-yellow-300' :
                                'text-red-700 border-red-300'
                              }
                            >
                              {service.status}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {service.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{service.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <UserCheck className="h-3 w-3" />
                              <span>{service.responsable}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{service.delaiTraitement} jours</span>
                            </div>
                            {service.coutService && service.coutService > 0 && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs">💰</span>
                                <span>{service.coutService.toLocaleString()} FCFA</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(service.dateCreation)}</span>
                            </div>
                          </div>
                          {service.documentRequis && service.documentRequis.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-1">Documents requis:</p>
                              <div className="flex flex-wrap gap-1">
                                {service.documentRequis.map((doc, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {doc}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {organismeServices.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Aucun service configuré</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsServicesModalOpen(false)}>
                Fermer
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les modifications
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de gestion des relations */}
        <Dialog open={isRelationsModalOpen} onOpenChange={setIsRelationsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Network className="h-6 w-6 text-purple-500" />
                <div>
                  <span>Gestion des Relations</span>
                  {selectedOrganisme && (
                    <p className="text-sm font-normal text-gray-600">
                      {selectedOrganisme.nom} ({organismeRelations.length} relations)
                    </p>
                  )}
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Bouton d'ajout */}
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Gérez les relations inter-organismes
                </p>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter une relation
                </Button>
              </div>

              {/* Liste des relations */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {organismeRelations.map((relation) => (
                  <Card key={relation.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-sm">{relation.nomOrganisme}</h4>
                            <Badge
                              variant="outline"
                              className={
                                relation.isActive ? 'text-green-700 border-green-300' : 'text-gray-500 border-gray-300'
                              }
                            >
                              {relation.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {relation.typeRelation}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {relation.direction}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{relation.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Début: {formatDate(relation.dateDebut)}</span>
                            </div>
                            {relation.dateFin && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Fin: {formatDate(relation.dateFin)}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              <span>ID: {relation.organismeId}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteRelation(relation.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {organismeRelations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Network className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Aucune relation configurée</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRelationsModalOpen(false)}>
                Fermer
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les modifications
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de conversion en client */}
        <Dialog open={isConvertModalOpen} onOpenChange={setIsConvertModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Target className="h-6 w-6 text-emerald-500" />
                <div>
                  <span>Conversion en Client</span>
                  {selectedOrganisme && (
                    <p className="text-sm font-normal text-gray-600">
                      {selectedOrganisme.nom}
                    </p>
                  )}
                </div>
              </DialogTitle>
            </DialogHeader>

            {selectedOrganisme && (
              <div className="space-y-6">
                {/* Analyse actuelle */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Analyse Actuelle</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedOrganisme.services}</div>
                        <p className="text-sm text-gray-600">Services</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{selectedOrganisme.satisfaction}%</div>
                        <p className="text-sm text-gray-600">Satisfaction</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{selectedOrganisme.demandesMois}</div>
                        <p className="text-sm text-gray-600">Demandes/mois</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Statut actuel:</span>
                      <Badge variant="outline" className={getClientStatusColor(selectedOrganisme.clientStatus)}>
                        {getClientStatusIcon(selectedOrganisme.clientStatus)} {selectedOrganisme.clientStatus}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Options de conversion */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Options de Conversion</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full justify-start"
                      variant={selectedOrganisme.clientStatus === 'CLIENT' ? 'default' : 'outline'}
                      onClick={() => handleUpdateClientStatus(selectedOrganisme, 'CLIENT')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-lg">💼</div>
                        <div className="text-left">
                          <div className="font-medium">Convertir en CLIENT</div>
                          <div className="text-sm text-gray-600">Accès complet, facturation, support prioritaire</div>
                        </div>
                      </div>
                    </Button>

                    <Button
                      className="w-full justify-start"
                      variant={selectedOrganisme.clientStatus === 'PROSPECT' ? 'default' : 'outline'}
                      onClick={() => handleUpdateClientStatus(selectedOrganisme, 'PROSPECT')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-lg">👀</div>
                        <div className="text-left">
                          <div className="font-medium">Marquer comme PROSPECT</div>
                          <div className="text-sm text-gray-600">Suivi commercial, démos, évaluation</div>
                        </div>
                      </div>
                    </Button>

                    <Button
                      className="w-full justify-start"
                      variant={selectedOrganisme.clientStatus === 'INACTIF_CLIENT' ? 'default' : 'outline'}
                      onClick={() => handleUpdateClientStatus(selectedOrganisme, 'INACTIF_CLIENT')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-lg">😴</div>
                        <div className="text-left">
                          <div className="font-medium">Marquer comme INACTIF</div>
                          <div className="text-sm text-gray-600">Pas d'engagement commercial actuel</div>
                        </div>
                      </div>
                    </Button>
                  </CardContent>
                </Card>

                {/* Revenus potentiels */}
                {selectedOrganisme.revenus && selectedOrganisme.revenus > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Revenus Estimés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-600">
                          {selectedOrganisme.revenus.toLocaleString()} FCFA
                        </div>
                        <p className="text-sm text-gray-600">Revenus annuels estimés</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConvertModalOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de prévisualisation */}
        <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Monitor className="h-6 w-6 text-blue-500" />
                <div>
                  <span>Prévisualisation Page d'Accueil</span>
                  {selectedOrganisme && (
                    <p className="text-sm font-normal text-gray-600">
                      {selectedOrganisme.nom}
                    </p>
                  )}
                </div>
              </DialogTitle>
            </DialogHeader>

            {selectedOrganisme && (
              <div className="space-y-6">
                {/* Mockup de la page d'accueil */}
                <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                          <Building2 className="w-8 h-8" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold">{selectedOrganisme.nom}</h1>
                          <p className="text-blue-100">{selectedOrganisme.mission.substring(0, 100)}...</p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="bg-white border-b px-6 py-3">
                      <div className="flex gap-6 text-sm">
                        <span className="font-medium text-blue-600 border-b-2 border-blue-600 pb-2">Accueil</span>
                        <span className="text-gray-600 hover:text-blue-600">Services</span>
                        <span className="text-gray-600 hover:text-blue-600">Démarches</span>
                        <span className="text-gray-600 hover:text-blue-600">Contact</span>
                        <span className="text-gray-600 hover:text-blue-600">Actualités</span>
                      </div>
                    </div>

                    {/* Contenu principal */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Services populaires */}
                        <div className="md:col-span-2">
                          <h2 className="text-xl font-semibold mb-4">Services les plus demandés</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['Demande d\'acte administratif', 'Renseignements généraux', 'Dépôt de dossier', 'Suivi de demande'].map((service, index) => (
                              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <h3 className="font-medium">{service}</h3>
                                    <p className="text-sm text-gray-600">En ligne • {Math.floor(Math.random() * 10) + 1}-{Math.floor(Math.random() * 10) + 5} jours</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Informations pratiques */}
                        <div>
                          <h2 className="text-xl font-semibold mb-4">Informations pratiques</h2>
                          <Card>
                            <CardContent className="p-4 space-y-3">
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span>{selectedOrganisme.ville}, {selectedOrganisme.province}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span>{selectedOrganisme.telephone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span>{selectedOrganisme.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span>Lun-Ven: 8h-17h</span>
                              </div>
                            </CardContent>
                          </Card>

                          <div className="mt-4">
                            <h3 className="font-medium mb-2">Statistiques</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Services disponibles</span>
                                <span className="font-medium">{selectedOrganisme.services}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Satisfaction</span>
                                <span className="font-medium">{selectedOrganisme.satisfaction}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Demandes/mois</span>
                                <span className="font-medium">{selectedOrganisme.demandesMois}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button className="flex-1">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visiter le site
                  </Button>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Personnaliser
                  </Button>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
