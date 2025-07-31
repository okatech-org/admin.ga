'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { toast } from 'sonner';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Upload,
  Building2,
  Users,
  DollarSign,
  Calendar,
  BarChart3,
  Settings,
  Star,
  TrendingUp,
  MapPin,
  Scale,
  Calculator,
  GraduationCap,
  Loader2,
  Save,
  X,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  SortAsc,
  SortDesc,
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Import des vraies données
import { getAllServices, getOrganismeMapping } from '@/lib/data/gabon-services-detailles';
import { getAllExpandedServices, getExpandedServicesCount } from '@/lib/data/expanded-gabon-services';

// Types pour TypeScript
interface Service {
  id: number;
  nom: string;
  organisme: string;
  categorie: string;
  description: string;
  duree: string;
  cout: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  satisfaction: number;
  demandes_mois: number;
  documents_requis: string[];
  responsable: string;
  telephone: string;
  email: string;
  derniere_maj: string;
  lieu: string;
  code_service: string;
  validite: string;
  type_organisme: string;
}

interface ServiceFormData {
  nom: string;
  organisme: string;
  categorie: string;
  description: string;
  duree: string;
  cout: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  documents_requis: string[];
  responsable: string;
  telephone: string;
  email: string;
  lieu: string;
  validite: string;
}

// États d'application améliorés
interface AppState {
  isLoading: boolean;
  isExporting: boolean;
  isSyncing: boolean;
  error: string | null;
  isSubmitting: boolean;
  isDeletingId: number | null;
  retryCount: number;
  lastSyncTime: Date | null;
}

// Types pour la pagination et le tri
interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

interface SortState {
  field: keyof Service | null;
  direction: 'asc' | 'desc';
}

// Validation améliorée
interface ValidationErrors {
  [key: string]: string;
}

export default function SuperAdminServicesPage() {
  const router = useRouter();

  // États principaux
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrganisme, setSelectedOrganisme] = useState('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // États de pagination et tri
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 0,
    totalPages: 0
  });

  const [sortState, setSortState] = useState<SortState>({
    field: null,
    direction: 'asc'
  });

  // États des modales
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  // États des modales de statistiques interactives
  const [isServicesListOpen, setIsServicesListOpen] = useState(false);
  const [isOrganismesListOpen, setIsOrganismesListOpen] = useState(false);
  const [isDemandesDetailOpen, setIsDemandesDetailOpen] = useState(false);
  const [isSatisfactionDetailOpen, setIsSatisfactionDetailOpen] = useState(false);

  // États pour la gestion des organismes/clients
  const [isConvertingToClient, setIsConvertingToClient] = useState<string | null>(null);
  const [clientStatuses, setClientStatuses] = useState<Record<string, 'PROSPECT' | 'CLIENT' | 'INACTIVE'>>({});
  const [selectedOrganismeForView, setSelectedOrganismeForView] = useState<string | null>(null);

  // États d'application améliorés
  const [appState, setAppState] = useState<AppState>({
    isLoading: false,
    isExporting: false,
    isSyncing: false,
    error: null,
    isSubmitting: false,
    isDeletingId: null,
    retryCount: 0,
    lastSyncTime: null
  });

  // État du formulaire avec validation
  const [formData, setFormData] = useState<ServiceFormData>({
    nom: '',
    organisme: '',
    categorie: 'ADMINISTRATIF',
    description: '',
    duree: '',
    cout: '',
    status: 'ACTIVE',
    documents_requis: [],
    responsable: '',
    telephone: '',
    email: '',
    lieu: '',
    validite: ''
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // État local des services pour simulation CRUD
  const [localServices, setLocalServices] = useState<Service[]>([]);

  // Récupération des vraies données depuis le fichier JSON (558 services)
  const realServices = useMemo(() => {
    const services = getAllExpandedServices(); // Utiliser les 558 services étendus
    const organismeMapping = getOrganismeMapping();

    return services.map((service, index) => {
      // Mapper les catégories du JSON aux catégories de l'interface
      const mapCategory = (nom: string) => {
        const name = nom.toLowerCase();
        if (name.includes('cni') || name.includes('passeport') || name.includes('nationalité')) return 'IDENTITE';
        if (name.includes('naissance') || name.includes('mariage') || name.includes('décès')) return 'ETAT_CIVIL';
        if (name.includes('permis de conduire') || name.includes('véhicule') || name.includes('transport')) return 'TRANSPORT';
        if (name.includes('médical') || name.includes('santé') || name.includes('exercice')) return 'SANTE';
        if (name.includes('cnss') || name.includes('emploi') || name.includes('travail') || name.includes('allocation')) return 'SOCIAL';
        if (name.includes('commerce') || name.includes('rccm') || name.includes('patente') || name.includes('entreprise')) return 'COMMERCE';
        if (name.includes('permis de construire') || name.includes('titre') || name.includes('urbanisme')) return 'LOGEMENT';
        if (name.includes('casier') || name.includes('légalisation') || name.includes('tribunal')) return 'JUSTICE';
        if (name.includes('impôt') || name.includes('fiscal') || name.includes('quitus')) return 'FISCAL';
        if (name.includes('inscription') || name.includes('bourse') || name.includes('diplôme')) return 'EDUCATION';
        return 'ADMINISTRATIF';
      };

      // Générer des métriques réalistes basées sur l'index et le type de service
      const generateMetrics = (serviceNom: string, idx: number) => {
        const baseMetrics = {
          'CNI_PREMIERE': { satisfaction: 87, demandes: 680, status: 'ACTIVE' as const },
          'PASSEPORT_PREMIER': { satisfaction: 94, demandes: 450, status: 'ACTIVE' as const },
          'PERMIS_CONDUIRE': { satisfaction: 76, demandes: 320, status: 'ACTIVE' as const },
          'ACTE_NAISSANCE': { satisfaction: 92, demandes: 1200, status: 'ACTIVE' as const },
          'IMMAT_CNSS': { satisfaction: 82, demandes: 180, status: 'MAINTENANCE' as const },
          'CERT_MEDICAL': { satisfaction: 91, demandes: 125, status: 'ACTIVE' as const }
        };

        const serviceKey = service.code as keyof typeof baseMetrics;
        const base = baseMetrics[serviceKey] || {
          satisfaction: 75 + (idx % 20),
          demandes: 50 + (idx % 150),
          status: (idx % 10 === 0 ? 'MAINTENANCE' : 'ACTIVE') as 'ACTIVE' | 'MAINTENANCE'
        };

        return base;
      };

      const metrics = generateMetrics(service.nom, index);
      const organismeInfo = organismeMapping[service.organisme_responsable];

      return {
        id: index + 1,
        nom: service.nom,
        organisme: organismeInfo?.nom || service.organisme_responsable,
        categorie: mapCategory(service.nom),
        description: `${service.nom} - ${service.delai_traitement}`,
        duree: service.delai_traitement,
        cout: service.cout,
        status: metrics.status,
        satisfaction: metrics.satisfaction,
        demandes_mois: metrics.demandes,
        documents_requis: service.documents_requis,
        responsable: `Responsable ${service.organisme_responsable}`,
        telephone: `+241 01 ${String(10 + (index % 90)).padStart(2, '0')} ${String(10 + (index % 90)).padStart(2, '0')} ${String(10 + (index % 90)).padStart(2, '0')}`,
        email: `${service.organisme_responsable.toLowerCase()}@gouv.ga`,
        derniere_maj: new Date(2024, 0, 1 + (index % 30)).toISOString().split('T')[0],
        lieu: `Bureau ${service.organisme_responsable}`,
        code_service: service.code,
        validite: service.validite || 'Variable',
        type_organisme: service.type_organisme
      } satisfies Service;
    });
  }, []);

  // Initialiser les services locaux au premier rendu
  useEffect(() => {
    if (localServices.length === 0) {
      setLocalServices(realServices);
      setAppState(prev => ({ ...prev, lastSyncTime: new Date() }));
    }
  }, [realServices, localServices.length]);

  // Services effectifs (locaux pour simulation CRUD)
  const services = localServices.length > 0 ? localServices : realServices;

  // Catégories mises à jour pour correspondre aux vraies données
  const CATEGORIES = {
    IDENTITE: { label: 'Identité', color: 'bg-blue-500', icon: FileText },
    ETAT_CIVIL: { label: 'État Civil', color: 'bg-purple-500', icon: Users },
    TRANSPORT: { label: 'Transport', color: 'bg-green-500', icon: MapPin },
    SANTE: { label: 'Santé', color: 'bg-red-500', icon: Star },
    SOCIAL: { label: 'Social', color: 'bg-orange-500', icon: Building2 },
    COMMERCE: { label: 'Commerce', color: 'bg-cyan-500', icon: DollarSign },
    LOGEMENT: { label: 'Logement', color: 'bg-yellow-500', icon: Building2 },
    JUSTICE: { label: 'Justice', color: 'bg-gray-600', icon: Scale },
    FISCAL: { label: 'Fiscal', color: 'bg-emerald-500', icon: Calculator },
    EDUCATION: { label: 'Éducation', color: 'bg-indigo-500', icon: GraduationCap },
    ADMINISTRATIF: { label: 'Administratif', color: 'bg-slate-500', icon: FileText }
  };

  const STATUS_CONFIG = {
    ACTIVE: { label: 'Actif', color: 'bg-green-500', icon: CheckCircle },
    MAINTENANCE: { label: 'Maintenance', color: 'bg-yellow-500', icon: AlertTriangle },
    INACTIVE: { label: 'Inactif', color: 'bg-gray-500', icon: XCircle },
  };

  // Liste des organismes uniques pour le filtre
  const uniqueOrganismes = useMemo(() => {
    return [...new Set(services.map(s => s.organisme))].sort();
  }, [services]);

    // Fonction utilitaire pour déterminer le statut par défaut
  const getDefaultClientStatus = useCallback((organisme: string, orgServices: any[]) => {
    if (orgServices.length >= 15 && orgServices.reduce((sum, s) => sum + s.satisfaction, 0) / orgServices.length >= 85) {
      return 'CLIENT';
    } else if (orgServices.length >= 5) {
      return 'PROSPECT';
    } else {
      return 'INACTIVE';
    }
  }, []);

  // Données détaillées pour les modales interactives
  const detailedStats = useMemo(() => {
    const organismesWithStats = uniqueOrganismes.map(organisme => {
      const orgServices = services.filter(s => s.organisme === organisme);

      // Utiliser le statut depuis l'état ou calculer le défaut
      const clientStatus = clientStatuses[organisme] || getDefaultClientStatus(organisme, orgServices);

      return {
        nom: organisme,
        code: organisme, // Utiliser le nom comme code pour la démo
        nombreServices: orgServices.length,
        servicesActifs: orgServices.filter(s => s.status === 'ACTIVE').length,
        servicesMaintenance: orgServices.filter(s => s.status === 'MAINTENANCE').length,
        totalDemandes: orgServices.reduce((sum, s) => sum + (s.demandes_mois || 0), 0),
        satisfactionMoyenne: orgServices.length > 0 ? Math.round(
          orgServices.reduce((sum, s) => sum + (s.satisfaction || 0), 0) / orgServices.length
        ) : 0,
        services: orgServices,
        clientStatus,
        revenue: orgServices.reduce((sum, s) => sum + (s.demandes_mois * 2500), 0), // Estimation du chiffre d'affaires
        lastActivity: new Date(2024, 11, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
        website: `https://${organisme.toLowerCase().replace(/[^a-z]/g, '-')}.gouv.ga`,
        contactEmail: `contact@${organisme.toLowerCase().replace(/[^a-z]/g, '-')}.gouv.ga`
      };
    }).sort((a, b) => {
      // Trier par statut client d'abord, puis par nombre de services
      const statusOrder = { 'CLIENT': 3, 'PROSPECT': 2, 'INACTIVE': 1 };
      if (statusOrder[a.clientStatus] !== statusOrder[b.clientStatus]) {
        return statusOrder[b.clientStatus] - statusOrder[a.clientStatus];
      }
      return b.nombreServices - a.nombreServices;
    });

    const servicesParDemandes = [...services]
      .sort((a, b) => (b.demandes_mois || 0) - (a.demandes_mois || 0));

    const servicesParSatisfaction = [...services]
      .sort((a, b) => (b.satisfaction || 0) - (a.satisfaction || 0));

    return {
      organismes: organismesWithStats,
      servicesParDemandes,
      servicesParSatisfaction
    };
  }, [services, uniqueOrganismes, clientStatuses, getDefaultClientStatus]);

  // Fonction de tri
  const sortServices = useCallback((servicesToSort: Service[], field: keyof Service, direction: 'asc' | 'desc') => {
    return [...servicesToSort].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // Conversion pour les champs numériques
      if (field === 'satisfaction' || field === 'demandes_mois') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      // Conversion pour les dates
      if (field === 'derniere_maj') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, []);

  // Filtrage et tri
  const filteredAndSortedServices = useMemo(() => {
    let filtered = services.filter(service => {
      const matchesSearch = service.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.organisme.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.responsable.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategorie === 'all' || service.categorie === selectedCategorie;
      const matchesStatus = selectedStatus === 'all' || service.status === selectedStatus;
      const matchesOrganisme = selectedOrganisme === 'all' || service.organisme === selectedOrganisme;
      return matchesSearch && matchesCategory && matchesStatus && matchesOrganisme;
    });

    // Appliquer le tri si un champ est sélectionné
    if (sortState.field) {
      filtered = sortServices(filtered, sortState.field, sortState.direction);
    }

    return filtered;
  }, [services, searchTerm, selectedCategorie, selectedStatus, selectedOrganisme, sortState, sortServices]);

  // Pagination
  const paginatedServices = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredAndSortedServices.slice(startIndex, endIndex);
  }, [filteredAndSortedServices, pagination.currentPage, pagination.itemsPerPage]);

  // Mise à jour de la pagination quand les données changent
  useEffect(() => {
    const totalItems = filteredAndSortedServices.length;
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);

    setPagination(prev => ({
      ...prev,
      totalItems,
      totalPages,
      // Réajuster la page courante si nécessaire
      currentPage: prev.currentPage > totalPages ? Math.max(1, totalPages) : prev.currentPage
    }));
  }, [filteredAndSortedServices.length, pagination.itemsPerPage]);

  // Calculs de statistiques sur les données filtrées
  const stats = useMemo(() => {
    const filtered = filteredAndSortedServices;
    return {
      total: services.length,
      totalFiltered: filtered.length,
      active: filtered.filter(s => s.status === 'ACTIVE').length,
      maintenance: filtered.filter(s => s.status === 'MAINTENANCE').length,
      totalDemandes: filtered.reduce((sum, s) => sum + (s.demandes_mois || 0), 0),
      satisfactionMoyenne: filtered.length > 0 ? Math.round(
        filtered.reduce((sum, s) => sum + (s.satisfaction || 0), 0) / filtered.length
      ) : 0,
      categoriesUniques: Object.keys(CATEGORIES).length,
      organismes: [...new Set(services.map(s => s.organisme))].length // Compter sur TOUS les services, pas seulement les filtrés
    };
  }, [services.length, filteredAndSortedServices]);

  // Services par catégorie pour les données filtrées
  const servicesByCategory = useMemo(() => {
    return Object.keys(CATEGORIES).map(cat => {
      const categoryServices = filteredAndSortedServices.filter(s => s.categorie === cat);
      return {
        categorie: cat,
        label: CATEGORIES[cat].label,
        color: CATEGORIES[cat].color,
        count: categoryServices.length,
        services: categoryServices,
        satisfactionMoyenne: categoryServices.length > 0 ? Math.round(
          categoryServices.reduce((sum, s) => sum + (s.satisfaction || 0), 0) / categoryServices.length
        ) : 0,
        totalDemandes: categoryServices.reduce((sum, s) => sum + (s.demandes_mois || 0), 0)
      };
    }).filter(cat => cat.count > 0); // Ne montrer que les catégories avec des services
  }, [filteredAndSortedServices]);

  // Fonctions de pagination
  const goToPage = useCallback((page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: Math.max(1, Math.min(page, prev.totalPages))
    }));
    toast.success(`Navigation vers la page ${page}`);
  }, []);

  const changeItemsPerPage = useCallback((newItemsPerPage: number) => {
    setPagination(prev => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1 // Retourner à la première page
    }));
    toast.success(`Affichage de ${newItemsPerPage} éléments par page`);
  }, []);

  // Fonction de tri
  const handleSort = useCallback((field: keyof Service) => {
    setSortState(prev => {
      const newDirection = prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc';
      toast.success(`Tri par ${field} ${newDirection === 'asc' ? 'croissant' : 'décroissant'}`);
      return {
        field,
        direction: newDirection
      };
    });
  }, []);

  // Fonction pour obtenir l'icône de tri
  const getSortIcon = useCallback((field: keyof Service) => {
    if (sortState.field !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground hover:text-blue-500 transition-colors" />;
    }
    return sortState.direction === 'asc'
      ? <SortAsc className="h-4 w-4 text-blue-500" />
      : <SortDesc className="h-4 w-4 text-blue-500" />;
  }, [sortState]);

  // Validation améliorée du formulaire
  const validateForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    // Validation des champs obligatoires
    if (!formData.nom.trim()) {
      errors.nom = 'Le nom du service est requis';
    } else if (formData.nom.length < 3) {
      errors.nom = 'Le nom doit contenir au moins 3 caractères';
    }

    if (!formData.organisme.trim()) {
      errors.organisme = 'L\'organisme responsable est requis';
    }

    if (!formData.description.trim()) {
      errors.description = 'La description est requise';
    } else if (formData.description.length < 10) {
      errors.description = 'La description doit contenir au moins 10 caractères';
    }

    if (!formData.duree.trim()) {
      errors.duree = 'La durée de traitement est requise';
    }

    if (!formData.cout.trim()) {
      errors.cout = 'Le coût est requis';
    }

    if (!formData.responsable.trim()) {
      errors.responsable = 'Le responsable est requis';
    }

    if (!formData.telephone.trim()) {
      errors.telephone = 'Le numéro de téléphone est requis';
    } else if (!/^\+241\s?[0-9\s]{8,}$/.test(formData.telephone)) {
      errors.telephone = 'Format invalide (ex: +241 01 23 45 67)';
    }

    if (!formData.lieu.trim()) {
      errors.lieu = 'Le lieu est requis';
    }

    // Validation de l'email (optionnel mais doit être valide si fourni)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format d\'email invalide';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error(`${Object.keys(errors).length} erreur(s) de validation détectée(s)`);
      return false;
    }

    return true;
  }, [formData]);

  // Actions avec gestion d'erreurs améliorée
  const handleViewDetails = useCallback((service: Service) => {
    try {
      setSelectedService(service);
      setIsDetailsOpen(true);
      toast.success(`Affichage des détails de "${service.nom}"`);
    } catch (error) {
      toast.error('Erreur lors de l\'ouverture des détails');
      console.error('Error opening details:', error);
    }
  }, []);

  const handleEdit = useCallback((service: Service) => {
    try {
      setSelectedService(service);
      setFormData({
        nom: service.nom,
        organisme: service.organisme,
        categorie: service.categorie,
        description: service.description,
        duree: service.duree,
        cout: service.cout,
        status: service.status,
        documents_requis: service.documents_requis,
        responsable: service.responsable,
        telephone: service.telephone,
        email: service.email,
        lieu: service.lieu,
        validite: service.validite
      });
      setValidationErrors({});
      setIsEditModalOpen(true);
      toast.success(`Modification du service "${service.nom}"`);
    } catch (error) {
      toast.error('Erreur lors de l\'ouverture de l\'éditeur');
      console.error('Error opening edit modal:', error);
    }
  }, []);

  const handleCreate = useCallback(() => {
    try {
      setSelectedService(null);
      setFormData({
        nom: '',
        organisme: '',
        categorie: 'ADMINISTRATIF',
        description: '',
        duree: '',
        cout: '',
        status: 'ACTIVE',
        documents_requis: [],
        responsable: '',
        telephone: '',
        email: '',
        lieu: '',
        validite: ''
      });
      setValidationErrors({});
      setIsCreateModalOpen(true);
      toast.success('Création d\'un nouveau service');
    } catch (error) {
      toast.error('Erreur lors de l\'ouverture du formulaire de création');
      console.error('Error opening create modal:', error);
    }
  }, []);

  const handleDelete = useCallback((service: Service) => {
    try {
      setServiceToDelete(service);
      setIsDeleteDialogOpen(true);
      toast.warning(`Confirmation de suppression de "${service.nom}"`);
    } catch (error) {
      toast.error('Erreur lors de l\'ouverture de la confirmation');
      console.error('Error opening delete dialog:', error);
    }
  }, []);

  const handleNavigateToAdministrations = useCallback(() => {
    try {
      toast.loading('Redirection vers Administrations...');
      router.push('/super-admin/administrations');
    } catch (error) {
      toast.error('Erreur lors de la navigation');
      console.error('Navigation error:', error);
    }
  }, [router]);

  const handleNavigateToCreerOrganisme = useCallback(() => {
    try {
      toast.loading('Redirection vers Créer Organisme...');
      router.push('/super-admin/organisme/nouveau');
    } catch (error) {
      toast.error('Erreur lors de la navigation');
      console.error('Navigation error:', error);
    }
  }, [router]);

  const handleCloseModals = useCallback(() => {
    setIsDetailsOpen(false);
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setIsDeleteDialogOpen(false);
    setServiceToDelete(null);
    setValidationErrors({});

    // Fermer les modales de statistiques
    setIsServicesListOpen(false);
    setIsOrganismesListOpen(false);
    setIsDemandesDetailOpen(false);
    setIsSatisfactionDetailOpen(false);

    // Nettoyer les états de gestion des organismes
    setIsConvertingToClient(null);
    setSelectedOrganismeForView(null);
  }, []);

  const handleSubmitForm = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setAppState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      // Simulation d'un délai réseau
      await new Promise(resolve => setTimeout(resolve, 800));

      const newService: Service = {
        id: selectedService?.id || Date.now(),
        nom: formData.nom.trim(),
        organisme: formData.organisme.trim(),
        categorie: formData.categorie,
        description: formData.description.trim(),
        duree: formData.duree.trim(),
        cout: formData.cout.trim(),
        status: formData.status,
        satisfaction: selectedService?.satisfaction || Math.floor(Math.random() * 20) + 70,
        demandes_mois: selectedService?.demandes_mois || Math.floor(Math.random() * 100) + 20,
        documents_requis: formData.documents_requis.filter(doc => doc.trim()),
        responsable: formData.responsable.trim(),
        telephone: formData.telephone.trim(),
        email: formData.email.trim(),
        derniere_maj: new Date().toISOString().split('T')[0],
        lieu: formData.lieu.trim(),
        code_service: selectedService?.code_service || `SRV_${Date.now()}`,
        validite: formData.validite.trim(),
        type_organisme: selectedService?.type_organisme || ''
      };

      if (selectedService) {
        // Modification
        const updatedServices = localServices.map(s =>
          s.id === selectedService.id ? { ...newService, satisfaction: s.satisfaction, demandes_mois: s.demandes_mois } : s
        );
        setLocalServices(updatedServices);
        toast.success(`✅ Service "${newService.nom}" mis à jour avec succès !`);
      } else {
        // Création
        setLocalServices(prev => [...prev, newService]);
        toast.success(`🎉 Service "${newService.nom}" créé avec succès !`);
      }

      handleCloseModals();

      // Réinitialiser les filtres seulement pour la création
      if (!selectedService) {
        resetFilters();
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setAppState(prev => ({ ...prev, error: errorMessage }));
      toast.error(`❌ Erreur lors de la sauvegarde: ${errorMessage}`);
      console.error('Save error:', error);
    } finally {
      setAppState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [formData, validateForm, selectedService, localServices, handleCloseModals]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!serviceToDelete) return;

    setAppState(prev => ({ ...prev, isDeletingId: serviceToDelete.id, error: null }));

    try {
      // Simulation d'un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedServices = localServices.filter(s => s.id !== serviceToDelete.id);
      setLocalServices(updatedServices);
      toast.success(`🗑️ Service "${serviceToDelete.nom}" supprimé avec succès !`);
      handleCloseModals();

      // Si on supprime le dernier élément de la page, retourner à la page précédente
      if (paginatedServices.length === 1 && pagination.currentPage > 1) {
        goToPage(pagination.currentPage - 1);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setAppState(prev => ({ ...prev, error: errorMessage }));
      toast.error(`❌ Erreur lors de la suppression: ${errorMessage}`);
      console.error('Delete error:', error);
    } finally {
      setAppState(prev => ({ ...prev, isDeletingId: null }));
    }
  }, [serviceToDelete, localServices, handleCloseModals, paginatedServices.length, pagination.currentPage, goToPage]);

  const handleCancel = useCallback(() => {
    handleCloseModals();
    if (selectedService) {
      setFormData({
        nom: selectedService.nom,
        organisme: selectedService.organisme,
        categorie: selectedService.categorie,
        description: selectedService.description,
        duree: selectedService.duree,
        cout: selectedService.cout,
        status: selectedService.status,
        documents_requis: selectedService.documents_requis,
        responsable: selectedService.responsable,
        telephone: selectedService.telephone,
        email: selectedService.email,
        lieu: selectedService.lieu,
        validite: selectedService.validite
      });
    }
    toast.info('🚫 Modifications annulées');
  }, [selectedService, handleCloseModals]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategorie('all');
    setSelectedStatus('all');
    setSelectedOrganisme('all');
    setSortState({ field: null, direction: 'asc' });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    toast.success('🔄 Filtres réinitialisés');
  }, []);

  // Handlers pour les cartes de statistiques interactives
  const handleServicesClick = useCallback(() => {
    setIsServicesListOpen(true);
    toast.info('📋 Affichage de la liste complète des services');
  }, []);

  const handleOrganismesClick = useCallback(() => {
    setIsOrganismesListOpen(true);
    toast.info('🏢 Affichage de la liste des organismes');
  }, []);

  const handleDemandesClick = useCallback(() => {
    setIsDemandesDetailOpen(true);
    toast.info('📊 Affichage du détail des demandes mensuelles');
  }, []);

  const handleSatisfactionClick = useCallback(() => {
    setIsSatisfactionDetailOpen(true);
    toast.info('⭐ Affichage du détail de la satisfaction');
  }, []);

  // Fonctions de gestion des organismes/clients
  const handleConvertToClient = useCallback(async (organismeCode: string, organismeNom: string) => {
    setIsConvertingToClient(organismeCode);

    try {
      // Simulation de l'API de conversion
      await new Promise(resolve => setTimeout(resolve, 2000));

      setClientStatuses(prev => ({
        ...prev,
        [organismeNom]: 'CLIENT'
      }));

      toast.success(`🎉 ${organismeNom} a été converti en client avec succès !`);
    } catch (error) {
      toast.error(`❌ Erreur lors de la conversion de ${organismeNom}`);
    } finally {
      setIsConvertingToClient(null);
    }
  }, []);

  const handleViewOrganisme = useCallback((organismeCode: string, organismeNom: string, website: string) => {
    // Ouvrir dans un nouvel onglet
    window.open(website, '_blank');
    toast.info(`🌐 Ouverture de la page d'accueil de ${organismeNom}`);
  }, []);

  const handleManageClient = useCallback((organismeCode: string, organismeNom: string) => {
    // Redirection vers la gestion client
    router.push(`/super-admin/clients/${organismeCode}`);
    toast.info(`⚙️ Redirection vers la gestion de ${organismeNom}`);
  }, [router]);

  const handleToggleStatus = useCallback((organismeNom: string, currentStatus: string) => {
    const statusMap = {
      'CLIENT': 'PROSPECT',
      'PROSPECT': 'INACTIVE',
      'INACTIVE': 'PROSPECT'
    };

    const newStatus = statusMap[currentStatus] || 'PROSPECT';
    setClientStatuses(prev => ({
      ...prev,
      [organismeNom]: newStatus as 'PROSPECT' | 'CLIENT' | 'INACTIVE'
    }));

    toast.success(`📊 Statut de ${organismeNom} changé vers ${newStatus}`);
  }, []);

  const syncData = useCallback(async () => {
    setAppState(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLocalServices(realServices);
      setAppState(prev => ({ ...prev, lastSyncTime: new Date() }));
      toast.success('🔄 Données synchronisées avec succès !');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de synchronisation';
      setAppState(prev => ({ ...prev, error: errorMessage }));
      toast.error(`❌ Erreur de synchronisation: ${errorMessage}`);
    } finally {
      setAppState(prev => ({ ...prev, isSyncing: false }));
    }
  }, [realServices]);

  const exportToJSON = useCallback(async () => {
    setAppState(prev => ({ ...prev, isExporting: true, error: null }));

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const dataStr = JSON.stringify({
        exported_at: new Date().toISOString(),
        total_services: stats.total,
        services: filteredAndSortedServices,
        statistics: stats,
        categories: servicesByCategory,
        export_metadata: {
          filters_applied: {
            search: searchTerm,
            category: selectedCategorie,
            status: selectedStatus,
            organisme: selectedOrganisme
          },
          total_services_before_filter: services.length,
          filtered_services_count: filteredAndSortedServices.length,
          sort_applied: sortState.field ? {
            field: sortState.field,
            direction: sortState.direction
          } : null
        }
      }, null, 2);

      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `services-publics-gabon-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success(`📥 Export JSON réussi ! ${filteredAndSortedServices.length} services exportés`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'export';
      setAppState(prev => ({ ...prev, error: errorMessage }));
      toast.error(`❌ Erreur lors de l'export: ${errorMessage}`);
      console.error('Export error:', error);
    } finally {
      setAppState(prev => ({ ...prev, isExporting: false }));
    }
  }, [stats, filteredAndSortedServices, servicesByCategory, searchTerm, selectedCategorie, selectedStatus, selectedOrganisme, services.length, sortState]);

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Navigation contextuelle */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">🏢 Gestion des Organismes</h3>
                <p className="text-sm text-muted-foreground">Naviguez entre les différents volets de gestion</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleNavigateToAdministrations}>
                  <Building2 className="mr-2 h-4 w-4" />
                  Administrations
                </Button>
                <Button variant="outline" onClick={handleNavigateToCreerOrganisme}>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer Organisme
                </Button>
                <Button variant="default" asChild>
                  <Link href="/super-admin/services">
                    <FileText className="mr-2 h-4 w-4" />
                    Services Publics
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* En-tête */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-8 w-8 text-green-500" />
              Gestion des Services Publics
            </h1>
                          <p className="text-muted-foreground">
                Administration de {stats.totalFiltered} services publics répartis en {stats.categoriesUniques} catégories
                {stats.totalFiltered > 20 && (
                  <span className="block text-sm mt-1">
                    Page {pagination.currentPage} sur {pagination.totalPages} • {pagination.itemsPerPage} par page
                  </span>
                )}
                {appState.lastSyncTime && (
                  <span className="flex text-xs text-green-600 mt-1 items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Dernière sync: {appState.lastSyncTime.toLocaleTimeString()}
                  </span>
                )}
                {appState.error && (
                  <span className="flex text-xs text-red-600 mt-1 items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Erreur: {appState.error}
                  </span>
                )}
              </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={syncData}
              disabled={appState.isSyncing}
              className="transition-all hover:scale-105"
            >
              {appState.isSyncing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Sync
            </Button>
            <Button
              variant="outline"
              onClick={exportToJSON}
              disabled={appState.isExporting}
              className="transition-all hover:scale-105"
            >
              {appState.isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export JSON
            </Button>
            <Button
              onClick={handleCreate}
              className="transition-all hover:scale-105 bg-gradient-to-r from-green-500 to-blue-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Service
            </Button>
          </div>
        </div>

        {/* Statistiques globales interactives */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-green-200 hover:border-green-400"
            onClick={handleServicesClick}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Services</p>
                  <p className="text-2xl font-bold text-green-600">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.active} actifs, {stats.maintenance} en maintenance
                  </p>
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    👆 Cliquez pour voir la liste
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-blue-200 hover:border-blue-400"
            onClick={handleOrganismesClick}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Organismes</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.organismes}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.categoriesUniques} catégories de services
                  </p>
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    👆 Cliquez pour voir la liste
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-purple-200 hover:border-purple-400"
            onClick={handleDemandesClick}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Demandes Mensuelles</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalDemandes.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    Volume d'activité total
                  </p>
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    👆 Cliquez pour voir le détail
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-yellow-200 hover:border-yellow-400"
            onClick={handleSatisfactionClick}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Satisfaction Moyenne</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.satisfactionMoyenne}%</p>
                  <p className="text-xs text-muted-foreground">
                    Qualité de service globale
                  </p>
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    👆 Cliquez pour voir le détail
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets de gestion */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="categories">Catégories</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Services les plus demandés */}
              <Card>
                <CardHeader>
                  <CardTitle>🔥 Services les Plus Demandés</CardTitle>
                  <CardDescription>Top 3 par volume mensuel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services
                      .sort((a, b) => (b.demandes_mois || 0) - (a.demandes_mois || 0))
                      .slice(0, 3)
                      .map((service, index) => (
                      <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r from-green-50 to-blue-50">
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
                          <p className="text-2xl font-bold text-green-600">{service.demandes_mois}</p>
                          <p className="text-xs text-muted-foreground">demandes/mois</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Services les mieux notés */}
              <Card>
                <CardHeader>
                  <CardTitle>⭐ Services les Mieux Notés</CardTitle>
                  <CardDescription>Top 3 par satisfaction client</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services
                      .sort((a, b) => (b.satisfaction || 0) - (a.satisfaction || 0))
                      .slice(0, 3)
                      .map((service, index) => (
                      <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{service.nom}</p>
                            <p className="text-sm text-muted-foreground">{service.organisme}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-yellow-600">{service.satisfaction}%</p>
                          <p className="text-xs text-muted-foreground">satisfaction</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Répartition par catégorie */}
            <Card>
              <CardHeader>
                <CardTitle>📊 Répartition par Catégorie</CardTitle>
                <CardDescription>Distribution des services par domaine</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {servicesByCategory.map((cat) => (
                    <div key={cat.categorie} className="p-4 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedCategorie(cat.categorie)}>
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={`text-white ${cat.color}`}>
                          {cat.label}
                        </Badge>
                        <span className="text-2xl font-bold">{cat.count}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Demandes/mois:</span>
                          <span className="font-medium">{cat.totalDemandes}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Satisfaction:</span>
                          <span className="font-medium">{cat.satisfactionMoyenne}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services */}
          <TabsContent value="services" className="space-y-6">
            {/* Barre de contrôle intelligente */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      🔍 Recherche et Filtres Intelligents
                      <Badge variant="secondary" className="text-xs">
                        {stats.totalFiltered}/{stats.total}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Navigation intuitive parmi {stats.totalFiltered} services
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Grille
                    </Button>
                    <Button
                      variant={viewMode === 'table' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('table')}
                    >
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Tableau
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Recherche principale */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="🔍 Rechercher par nom, organisme, description ou responsable..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filtres rapides par catégorie */}
                <div>
                  <p className="text-sm font-medium mb-2">Filtres rapides par catégorie :</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategorie === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategorie('all')}
                    >
                      Toutes ({stats.total})
                    </Button>
                    {Object.entries(CATEGORIES).slice(0, 6).map(([value, config]) => {
                      const count = servicesByCategory.find(cat => cat.categorie === value)?.count || 0;
                      return (
                        <Button
                          key={value}
                          variant={selectedCategorie === value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedCategorie(value)}
                          className={selectedCategorie === value ? `${config.color} text-white` : ''}
                        >
                          {config.label} ({count})
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Filtres avancés */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts ({stats.total})</SelectItem>
                      <SelectItem value="ACTIVE">
                        Actifs ({stats.active})
                      </SelectItem>
                      <SelectItem value="MAINTENANCE">
                        Maintenance ({stats.maintenance})
                      </SelectItem>
                      <SelectItem value="INACTIVE">
                        Inactifs ({stats.total - stats.active - stats.maintenance})
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedOrganisme} onValueChange={setSelectedOrganisme}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par organisme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les organismes ({uniqueOrganismes.length})</SelectItem>
                      {uniqueOrganismes.slice(0, 10).map(org => (
                        <SelectItem key={org} value={org}>{org}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={resetFilters} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Réinitialiser tout
                  </Button>
                </div>

                {/* Indicateurs de filtres actifs */}
                {(searchTerm || selectedCategorie !== 'all' || selectedStatus !== 'all' || selectedOrganisme !== 'all') && (
                  <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-sm font-medium text-blue-800">Filtres actifs :</span>
                    {searchTerm && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Recherche: "{searchTerm}"
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setSearchTerm('')} />
                      </Badge>
                    )}
                    {selectedCategorie !== 'all' && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {CATEGORIES[selectedCategorie]?.label}
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setSelectedCategorie('all')} />
                      </Badge>
                    )}
                    {selectedStatus !== 'all' && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {STATUS_CONFIG[selectedStatus]?.label}
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setSelectedStatus('all')} />
                      </Badge>
                    )}
                    {selectedOrganisme !== 'all' && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        {selectedOrganisme}
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setSelectedOrganisme('all')} />
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Affichage intelligent des services */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {viewMode === 'grid' ? '🏢' : '📋'} {viewMode === 'grid' ? 'Services par Catégorie' : 'Tableau Détaillé'}
                      <Badge variant="outline">
                        {stats.totalFiltered}/{stats.total}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {stats.totalFiltered < stats.total ? (
                        <>
                          Affichage de {stats.totalFiltered} services filtrés sur {stats.total} au total
                          {sortState.field && (
                            <span className="ml-2 text-blue-600">
                              • Trié par {sortState.field} ({sortState.direction === 'asc' ? 'croissant' : 'décroissant'})
                            </span>
                          )}
                        </>
                      ) : (
                        `Gestion complète des ${stats.total} services publics`
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => changeItemsPerPage(20)}
                      className={pagination.itemsPerPage === 20 ? 'bg-blue-50' : ''}
                    >
                      20/page
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => changeItemsPerPage(50)}
                      className={pagination.itemsPerPage === 50 ? 'bg-blue-50' : ''}
                    >
                      50/page
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Mode Grille - Affichage par catégories */}
                {viewMode === 'grid' && (
                  <div className="space-y-6">
                    {/* Navigation rapide par catégories */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 mb-6">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3">🧭 Navigation rapide par catégories</h3>
                      <div className="flex flex-wrap gap-2">
                        {servicesByCategory.map((cat) => (
                          <Button
                            key={cat.categorie}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              document.getElementById(`category-${cat.categorie}`)?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                              });
                            }}
                            className="text-xs hover:scale-105 transition-transform"
                          >
                            <span className={`w-2 h-2 rounded-full mr-2 ${cat.color}`}></span>
                            {cat.label} ({cat.count})
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Statistiques contextuelles rapides */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-lg font-bold text-blue-600">{servicesByCategory.length}</div>
                        <div className="text-xs text-blue-800">Catégories actives</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-lg font-bold text-green-600">{stats.satisfactionMoyenne}%</div>
                        <div className="text-xs text-green-800">Satisfaction moyenne</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-lg font-bold text-purple-600">{Math.round(stats.totalDemandes / stats.totalFiltered)}</div>
                        <div className="text-xs text-purple-800">Demandes moy./service</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-lg font-bold text-orange-600">{stats.organismes}</div>
                        <div className="text-xs text-orange-800">Organismes concernés</div>
                      </div>
                    </div>

                    {servicesByCategory.map((category) => (
                      <div key={category.categorie} id={`category-${category.categorie}`} className="space-y-4 scroll-mt-20">
                        {/* En-tête de catégorie */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border shadow-sm">
                          <div className="flex items-center gap-3">
                            <Badge className={`text-white ${category.color} px-3 py-1`}>
                              {category.label}
                            </Badge>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">{category.count} services</span>
                              <span className="mx-2">•</span>
                              <span>{category.satisfactionMoyenne}% satisfaction</span>
                              <span className="mx-2">•</span>
                              <span>{category.totalDemandes} demandes/mois</span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedCategorie(category.categorie);
                              setViewMode('table');
                            }}
                          >
                            Voir en tableau
                          </Button>
                        </div>

                        {/* Services de la catégorie */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {category.services.slice(
                            (pagination.currentPage - 1) * pagination.itemsPerPage,
                            pagination.currentPage * pagination.itemsPerPage
                          ).map((service) => (
                            <Card key={service.id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  {/* En-tête du service */}
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-sm line-clamp-2">{service.nom}</h4>
                                      <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                                        <Building2 className="h-3 w-3" />
                                        {service.organisme}
                                      </p>
                                    </div>
                                    <Badge className={`text-white ${STATUS_CONFIG[service.status]?.color} text-xs`}>
                                      {STATUS_CONFIG[service.status]?.label}
                                    </Badge>
                                  </div>

                                  {/* Métriques clés */}
                                  <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 text-yellow-500" />
                                      <span className="font-medium">{service.satisfaction}%</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <TrendingUp className="h-3 w-3 text-blue-500" />
                                      <span>{service.demandes_mois}/mois</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <DollarSign className="h-3 w-3 text-green-500" />
                                      <span className="font-medium">{service.cout}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3 text-purple-500" />
                                      <span>{service.duree}</span>
                                    </div>
                                  </div>

                                  {/* Responsable */}
                                  <div className="text-xs text-gray-600">
                                    <span className="font-medium">Resp:</span> {service.responsable}
                                  </div>

                                  {/* Actions */}
                                  <div className="flex items-center gap-1 pt-2 border-t">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleViewDetails(service)}
                                      className="flex-1 h-7 text-xs"
                                    >
                                      <Eye className="h-3 w-3 mr-1" />
                                      Voir
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEdit(service)}
                                      className="flex-1 h-7 text-xs"
                                    >
                                      <Edit className="h-3 w-3 mr-1" />
                                      Éditer
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDelete(service)}
                                      disabled={appState.isDeletingId === service.id}
                                      className="h-7 w-7 p-0 text-red-600 hover:bg-red-50"
                                    >
                                      {appState.isDeletingId === service.id ? (
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
                      </div>
                    ))}

                    {/* Bouton de retour en haut */}
                    {servicesByCategory.length > 3 && (
                      <div className="flex justify-center pt-6">
                        <Button
                          variant="outline"
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          className="gap-2 hover:bg-blue-50"
                        >
                          <ChevronUp className="h-4 w-4" />
                          Retour en haut
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Mode Tableau - Affichage classique */}
                {viewMode === 'table' && (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => handleSort('nom')}
                              className="h-auto p-0 font-medium hover:bg-transparent"
                            >
                              Service
                              {getSortIcon('nom')}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => handleSort('categorie')}
                              className="h-auto p-0 font-medium hover:bg-transparent"
                            >
                              Catégorie
                              {getSortIcon('categorie')}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => handleSort('organisme')}
                              className="h-auto p-0 font-medium hover:bg-transparent"
                            >
                              Organisme
                              {getSortIcon('organisme')}
                            </Button>
                          </TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => handleSort('satisfaction')}
                              className="h-auto p-0 font-medium hover:bg-transparent"
                            >
                              Performance
                              {getSortIcon('satisfaction')}
                            </Button>
                          </TableHead>
                          <TableHead>Coût & Durée</TableHead>
                          <TableHead>
                            <Button
                              variant="ghost"
                              onClick={() => handleSort('status')}
                              className="h-auto p-0 font-medium hover:bg-transparent"
                            >
                              Statut
                              {getSortIcon('status')}
                            </Button>
                          </TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedServices.map((service) => (
                          <TableRow key={service.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div>
                                <div className="font-medium">{service.nom}</div>
                                <div className="text-sm text-muted-foreground">{service.description}</div>
                                <div className="text-xs text-muted-foreground">Resp: {service.responsable}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`text-white ${CATEGORIES[service.categorie]?.color}`}>
                                {CATEGORIES[service.categorie]?.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Building2 className="h-4 w-4 mr-1 text-muted-foreground" />
                                {service.organisme}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  <span className="font-medium">{service.satisfaction}%</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {service.demandes_mois} demandes/mois
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-green-500" />
                                  <span className="font-medium">{service.cout}</span>
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {service.duree}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`text-white ${STATUS_CONFIG[service.status]?.color}`}>
                                {STATUS_CONFIG[service.status]?.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewDetails(service)}
                                  className="transition-all hover:scale-105 hover:bg-blue-50 hover:border-blue-200"
                                  title="Voir les détails"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(service)}
                                  className="transition-all hover:scale-105 hover:bg-orange-50 hover:border-orange-200"
                                  title="Modifier"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(service)}
                                  disabled={appState.isDeletingId === service.id}
                                  className="transition-all hover:scale-105 hover:bg-red-50 hover:border-red-200 disabled:opacity-50"
                                  title="Supprimer"
                                >
                                  {appState.isDeletingId === service.id ? (
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
                )}

                {paginatedServices.length === 0 && filteredAndSortedServices.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun service trouvé</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || selectedCategorie !== 'all' || selectedStatus !== 'all' || selectedOrganisme !== 'all' ? (
                        <>
                          Aucun service ne correspond à vos critères de recherche.
                          <br />
                          Essayez de modifier ou supprimer les filtres appliqués.
                        </>
                      ) : (
                        'Aucun service disponible dans la base de données.'
                      )}
                    </p>
                    {(searchTerm || selectedCategorie !== 'all' || selectedStatus !== 'all' || selectedOrganisme !== 'all') && (
                      <Button variant="outline" onClick={resetFilters}>
                        Réinitialiser les filtres
                      </Button>
                    )}
                  </div>
                )}

                {paginatedServices.length === 0 && filteredAndSortedServices.length > 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun service sur cette page</h3>
                    <p className="text-muted-foreground mb-4">
                      {filteredAndSortedServices.length} services trouvés, mais aucun sur la page {pagination.currentPage}.
                    </p>
                    <Button variant="outline" onClick={() => goToPage(1)}>
                      Retourner à la première page
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2 py-4 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  variant="outline"
                  onClick={() => goToPage(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  onClick={() => goToPage(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Suivant
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => goToPage(1)}
                    disabled={pagination.currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => goToPage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-700">
                    Page <span className="font-medium">{pagination.currentPage}</span> sur{' '}
                    <span className="font-medium">{pagination.totalPages}</span>
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => goToPage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => goToPage(pagination.totalPages)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    Afficher
                  </span>
                                     <Select
                     value={`${pagination.itemsPerPage}`}
                     onValueChange={(value) => changeItemsPerPage(Number(value))}
                   >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[10, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-700">
                    entrées
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Catégories */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesByCategory.map((cat) => (
                <Card key={cat.categorie} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge className={`text-white ${cat.color}`}>
                        {cat.label}
                      </Badge>
                      <span className="text-lg font-bold">{cat.count} services</span>
                    </CardTitle>
                    <CardDescription>
                      {cat.totalDemandes} demandes/mois • {cat.satisfactionMoyenne}% satisfaction
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {cat.services.slice(0, 3).map((service) => (
                        <div key={service.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div>
                            <p className="font-medium text-sm">{service.nom}</p>
                            <p className="text-xs text-muted-foreground">{service.organisme}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">{service.satisfaction}%</p>
                            <p className="text-xs text-muted-foreground">{service.demandes_mois}/mois</p>
                          </div>
                        </div>
                      ))}
                      {cat.count > 3 && (
                        <p className="text-center text-sm text-muted-foreground">
                          +{cat.count - 3} autres services
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => {
                        setSelectedCategorie(cat.categorie);
                        setSelectedTab('services');
                      }}
                    >
                      Voir tous les services
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>📈 Tendances par Catégorie</CardTitle>
                  <CardDescription>Volume d'activité mensuel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {servicesByCategory.map((cat) => (
                      <div key={cat.categorie} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{cat.label}</span>
                          <span className="text-muted-foreground">{cat.totalDemandes} demandes</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${cat.color}`}
                            data-width={`${(cat.totalDemandes / stats.totalDemandes) * 100}%`}
                            ref={(el) => {
                              if (el) el.style.width = el.dataset.width || '0%';
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🎯 Métriques Clés</CardTitle>
                  <CardDescription>Indicateurs de performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                      <div className="text-sm text-muted-foreground">Services Total</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                      <div className="text-sm text-muted-foreground">Services Actifs</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{stats.totalDemandes.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Demandes/Mois</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{stats.satisfactionMoyenne}%</div>
                      <div className="text-sm text-muted-foreground">Satisfaction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modales de statistiques interactives */}

        {/* Modal Liste des Services */}
        <Dialog open={isServicesListOpen} onOpenChange={setIsServicesListOpen}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                Liste Complète des Services ({stats.total} services)
              </DialogTitle>
              <DialogDescription>
                Tous les services publics disponibles dans le système
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm line-clamp-2">{service.nom}</h4>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {service.organisme}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className={`text-white ${CATEGORIES[service.categorie]?.color} text-xs`}>
                          {CATEGORIES[service.categorie]?.label}
                        </Badge>
                        <Badge className={`text-white ${STATUS_CONFIG[service.status]?.color} text-xs`}>
                          {STATUS_CONFIG[service.status]?.label}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span>{service.satisfaction}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-blue-500" />
                          <span>{service.demandes_mois}/mois</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => setIsServicesListOpen(false)}>
                Fermer
              </Button>
            </div>
          </DialogContent>
        </Dialog>

                {/* Modal Liste des Organismes - Version enrichie avec gestion clients */}
        <Dialog open={isOrganismesListOpen} onOpenChange={setIsOrganismesListOpen}>
          <DialogContent className="max-w-7xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                Gestion des Organismes & Clients ({stats.organismes} organismes)
              </DialogTitle>
              <DialogDescription>
                Gérez vos organismes publics, convertissez-les en clients et accédez à leurs configurations
              </DialogDescription>
            </DialogHeader>

            {/* Statistiques de répartition par statut */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-xl font-bold text-green-600">
                  {detailedStats.organismes.filter(o => o.clientStatus === 'CLIENT').length}
                </div>
                <div className="text-sm text-gray-600">Clients Actifs</div>
              </div>
              <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-xl font-bold text-blue-600">
                  {detailedStats.organismes.filter(o => o.clientStatus === 'PROSPECT').length}
                </div>
                <div className="text-sm text-gray-600">Prospects</div>
              </div>
              <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-xl font-bold text-gray-600">
                  {detailedStats.organismes.filter(o => o.clientStatus === 'INACTIVE').length}
                </div>
                <div className="text-sm text-gray-600">Inactifs</div>
              </div>
            </div>

            {/* Liste des organismes organisée par statut */}
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {['CLIENT', 'PROSPECT', 'INACTIVE'].map(status => {
                const organismesStatus = detailedStats.organismes.filter(o => o.clientStatus === status);
                if (organismesStatus.length === 0) return null;

                const statusConfig = {
                  'CLIENT': { label: '💼 Clients Actifs', color: 'border-green-500', bgColor: 'bg-green-50', textColor: 'text-green-700' },
                  'PROSPECT': { label: '🎯 Prospects', color: 'border-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
                  'INACTIVE': { label: '💤 Inactifs', color: 'border-gray-500', bgColor: 'bg-gray-50', textColor: 'text-gray-700' }
                };

                return (
                  <div key={status} className={`border-l-4 ${statusConfig[status].color} pl-4`}>
                    <h3 className={`text-lg font-semibold mb-3 ${statusConfig[status].textColor}`}>
                      {statusConfig[status].label} ({organismesStatus.length})
                    </h3>

                    <div className="space-y-3">
                      {organismesStatus.map((organisme, index) => (
                        <Card key={organisme.nom} className={`hover:shadow-lg transition-all duration-200 ${statusConfig[status].bgColor} border-l-4 ${statusConfig[status].color}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full ${statusConfig[status].color.replace('border', 'bg')} text-white flex items-center justify-center text-sm font-bold`}>
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-lg">{organisme.nom}</h4>
                                    <Badge
                                      className={`text-xs px-2 py-1 cursor-pointer transition-colors ${
                                        organisme.clientStatus === 'CLIENT' ? 'bg-green-500 hover:bg-green-600' :
                                        organisme.clientStatus === 'PROSPECT' ? 'bg-blue-500 hover:bg-blue-600' :
                                        'bg-gray-500 hover:bg-gray-600'
                                      } text-white`}
                                      onClick={() => handleToggleStatus(organisme.nom, organisme.clientStatus)}
                                      title="Cliquer pour changer le statut"
                                    >
                                      {organisme.clientStatus}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <p>📧 {organisme.contactEmail}</p>
                                    <p>🌐 {organisme.website}</p>
                                    <p>📅 Dernière activité: {organisme.lastActivity}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="text-xl font-bold text-blue-600">{organisme.satisfactionMoyenne}%</p>
                                <p className="text-xs text-gray-600">satisfaction</p>
                                <p className="text-lg font-bold text-green-600 mt-1">{organisme.revenue.toLocaleString()} FCFA</p>
                                <p className="text-xs text-gray-600">revenue estimé</p>
                              </div>
                            </div>

                            {/* Métriques détaillées */}
                            <div className="grid grid-cols-5 gap-3 text-sm mb-4">
                              <div className="text-center p-2 bg-white rounded shadow-sm">
                                <div className="font-bold text-green-600">{organisme.servicesActifs}</div>
                                <div className="text-xs text-gray-600">Actifs</div>
                              </div>
                              <div className="text-center p-2 bg-white rounded shadow-sm">
                                <div className="font-bold text-yellow-600">{organisme.servicesMaintenance}</div>
                                <div className="text-xs text-gray-600">Maintenance</div>
                              </div>
                              <div className="text-center p-2 bg-white rounded shadow-sm">
                                <div className="font-bold text-purple-600">{organisme.totalDemandes}</div>
                                <div className="text-xs text-gray-600">Demandes/mois</div>
                              </div>
                              <div className="text-center p-2 bg-white rounded shadow-sm">
                                <div className="font-bold text-blue-600">{organisme.nombreServices}</div>
                                <div className="text-xs text-gray-600">Total services</div>
                              </div>
                              <div className="text-center p-2 bg-white rounded shadow-sm">
                                <div className="font-bold text-indigo-600">{Math.round(organisme.revenue / organisme.nombreServices).toLocaleString()}</div>
                                <div className="text-xs text-gray-600">Rev/service</div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewOrganisme(organisme.code, organisme.nom, organisme.website)}
                                className="transition-all hover:scale-105 bg-blue-50 hover:bg-blue-100 border-blue-200"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Voir le site
                              </Button>

                              {organisme.clientStatus === 'CLIENT' ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleManageClient(organisme.code, organisme.nom)}
                                  className="transition-all hover:scale-105 bg-green-500 hover:bg-green-600"
                                >
                                  <Settings className="h-3 w-3 mr-1" />
                                  Gérer Client
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handleConvertToClient(organisme.code, organisme.nom)}
                                  disabled={isConvertingToClient === organisme.code}
                                  className="transition-all hover:scale-105 bg-green-500 hover:bg-green-600"
                                >
                                  {isConvertingToClient === organisme.code ? (
                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                  ) : (
                                    <Plus className="h-3 w-3 mr-1" />
                                  )}
                                  Convertir en Client
                                </Button>
                              )}

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedCategorie('all');
                                  setSelectedOrganisme(organisme.nom);
                                  setSelectedTab('services');
                                  setIsOrganismesListOpen(false);
                                }}
                                className="transition-all hover:scale-105 bg-purple-50 hover:bg-purple-100 border-purple-200"
                              >
                                <FileText className="h-3 w-3 mr-1" />
                                Voir Services
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                className="transition-all hover:scale-105 bg-orange-50 hover:bg-orange-100 border-orange-200"
                              >
                                <BarChart3 className="h-3 w-3 mr-1" />
                                Analytics
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-600">
                💡 Cliquez sur les badges de statut pour les modifier • Les organismes sont triés par statut et performance
              </div>
              <Button variant="outline" onClick={() => setIsOrganismesListOpen(false)}>
                Fermer
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal Détails des Demandes */}
        <Dialog open={isDemandesDetailOpen} onOpenChange={setIsDemandesDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                Détail des Demandes Mensuelles ({stats.totalDemandes.toLocaleString()} demandes)
              </DialogTitle>
              <DialogDescription>
                Services les plus demandés et analyse du volume d'activité
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">🔥 Top 10 des Services les Plus Demandés</h3>
                <div className="space-y-3">
                  {detailedStats.servicesParDemandes.slice(0, 10).map((service, index) => (
                    <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{service.nom}</p>
                          <p className="text-sm text-gray-600">{service.organisme}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-purple-600">{service.demandes_mois}</p>
                        <p className="text-xs text-gray-600">demandes/mois</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">📊 Répartition par Organisme</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {detailedStats.organismes.slice(0, 6).map((organisme) => (
                    <div key={organisme.nom} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{organisme.nom}</span>
                        <span className="text-lg font-bold text-purple-600">{organisme.totalDemandes}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(organisme.totalDemandes / stats.totalDemandes) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => setIsDemandesDetailOpen(false)}>
                Fermer
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal Détails de la Satisfaction */}
        <Dialog open={isSatisfactionDetailOpen} onOpenChange={setIsSatisfactionDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Détail de la Satisfaction ({stats.satisfactionMoyenne}% moyenne)
              </DialogTitle>
              <DialogDescription>
                Services les mieux notés et analyse de la qualité de service
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">⭐ Top 10 des Services les Mieux Notés</h3>
                <div className="space-y-3">
                  {detailedStats.servicesParSatisfaction.slice(0, 10).map((service, index) => (
                    <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{service.nom}</p>
                          <p className="text-sm text-gray-600">{service.organisme}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-yellow-600">{service.satisfaction}%</p>
                        <p className="text-xs text-gray-600">satisfaction</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">🏢 Satisfaction par Organisme</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {detailedStats.organismes
                    .sort((a, b) => b.satisfactionMoyenne - a.satisfactionMoyenne)
                    .slice(0, 8)
                    .map((organisme) => (
                    <div key={organisme.nom} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{organisme.nom}</span>
                        <span className="text-lg font-bold text-yellow-600">{organisme.satisfactionMoyenne}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${organisme.satisfactionMoyenne}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{organisme.nombreServices} services</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">📈 Distribution de la Satisfaction</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {services.filter(s => s.satisfaction >= 90).length}
                    </div>
                    <div className="text-sm text-gray-600">Excellents (≥90%)</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {services.filter(s => s.satisfaction >= 75 && s.satisfaction < 90).length}
                    </div>
                    <div className="text-sm text-gray-600">Bons (75-89%)</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {services.filter(s => s.satisfaction < 75).length}
                    </div>
                    <div className="text-sm text-gray-600">À améliorer (&lt;75%)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => setIsSatisfactionDetailOpen(false)}>
                Fermer
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de détails */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Détails du service
              </DialogTitle>
              <DialogDescription>
                Informations complètes pour {selectedService?.nom}
              </DialogDescription>
            </DialogHeader>

            {selectedService && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Informations générales</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Nom:</strong> {selectedService.nom}</div>
                      <div><strong>Organisme:</strong> {selectedService.organisme}</div>
                      <div><strong>Catégorie:</strong> {CATEGORIES[selectedService.categorie]?.label}</div>
                      <div><strong>Description:</strong> {selectedService.description}</div>
                      <div><strong>Responsable:</strong> {selectedService.responsable}</div>
                      <div><strong>Lieu:</strong> {selectedService.lieu}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Contact</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Dernière MAJ: {selectedService.derniere_maj}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {selectedService.telephone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        {selectedService.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Métriques de Service</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-600">{selectedService.satisfaction}%</div>
                        <div className="text-xs text-muted-foreground">Satisfaction</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-600">{selectedService.demandes_mois}</div>
                        <div className="text-xs text-muted-foreground">Demandes/mois</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <div className="text-lg font-bold text-purple-600">{selectedService.cout}</div>
                        <div className="text-xs text-muted-foreground">Coût</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded">
                        <div className="text-lg font-bold text-yellow-600">{selectedService.duree}</div>
                        <div className="text-xs text-muted-foreground">Durée</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Documents requis</h4>
                    <div className="space-y-2">
                      {(selectedService.documents_requis || []).map((doc, index) => (
                        <div key={index} className="flex items-center p-2 bg-muted/50 rounded">
                          <FileText className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="text-sm">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

                          <DialogFooter>
                <Button variant="outline" onClick={handleCloseModals}>
                  Fermer
                </Button>
                <Button onClick={() => selectedService && handleEdit(selectedService)} disabled={!selectedService}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de création/modification */}
        <Dialog open={isEditModalOpen || isCreateModalOpen} onOpenChange={handleCloseModals}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedService ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {selectedService ? 'Modifier le Service' : 'Créer un Nouveau Service'}
              </DialogTitle>
              <DialogDescription>
                {selectedService ? 'Modifiez les détails du service existant.' : 'Définissez les détails du nouveau service.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom">Nom du Service</Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                    required
                    disabled={appState.isSubmitting}
                    className={validationErrors.nom ? 'border-red-500' : ''}
                  />
                  {validationErrors.nom && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.nom}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="organisme">Organisme Responsable</Label>
                  <Input
                    id="organisme"
                    name="organisme"
                    value={formData.organisme}
                    onChange={(e) => setFormData(prev => ({ ...prev, organisme: e.target.value }))}
                    required
                    disabled={appState.isSubmitting}
                    className={validationErrors.organisme ? 'border-red-500' : ''}
                  />
                  {validationErrors.organisme && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.organisme}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="categorie">Catégorie</Label>
                                      <Select
                      value={formData.categorie}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, categorie: value }))}
                      disabled={appState.isSubmitting}
                    >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORIES).map(([value, config]) => (
                        <SelectItem key={value} value={value}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.categorie && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.categorie}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="status">Statut</Label>
                                      <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE' }))}
                      disabled={appState.isSubmitting}
                    >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                        <SelectItem key={value} value={value}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.status && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.status}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    disabled={appState.isSubmitting}
                    className={validationErrors.description ? 'border-red-500' : ''}
                  />
                  {validationErrors.description && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.description}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="documents_requis">Documents Requis (séparés par une virgule)</Label>
                  <Textarea
                    id="documents_requis"
                    name="documents_requis"
                    value={formData.documents_requis.join(', ')}
                    onChange={(e) => setFormData(prev => ({ ...prev, documents_requis: e.target.value.split(',').map(d => d.trim()) }))}
                    placeholder="Ex: Attestation de domicile, Certificat de naissance, etc."
                    disabled={appState.isSubmitting}
                    className={validationErrors.documents_requis ? 'border-red-500' : ''}
                  />
                  {validationErrors.documents_requis && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.documents_requis}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="responsable">Responsable</Label>
                  <Input
                    id="responsable"
                    name="responsable"
                    value={formData.responsable}
                    onChange={(e) => setFormData(prev => ({ ...prev, responsable: e.target.value }))}
                    required
                    disabled={appState.isSubmitting}
                    className={validationErrors.responsable ? 'border-red-500' : ''}
                  />
                  {validationErrors.responsable && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.responsable}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                    required
                    disabled={appState.isSubmitting}
                    className={validationErrors.telephone ? 'border-red-500' : ''}
                  />
                  {validationErrors.telephone && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.telephone}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={appState.isSubmitting}
                    className={validationErrors.email ? 'border-red-500' : ''}
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="lieu">Lieu</Label>
                  <Input
                    id="lieu"
                    name="lieu"
                    value={formData.lieu}
                    onChange={(e) => setFormData(prev => ({ ...prev, lieu: e.target.value }))}
                    required
                    disabled={appState.isSubmitting}
                    className={validationErrors.lieu ? 'border-red-500' : ''}
                  />
                  {validationErrors.lieu && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.lieu}</p>
                  )}
                </div>
                                 <div>
                   <Label htmlFor="duree">Durée de Traitement</Label>
                   <Input
                     id="duree"
                     name="duree"
                     value={formData.duree}
                     onChange={(e) => setFormData(prev => ({ ...prev, duree: e.target.value }))}
                     placeholder="Ex: 5-7 jours ouvrables"
                     required
                     disabled={appState.isSubmitting}
                     className={validationErrors.duree ? 'border-red-500' : ''}
                   />
                   {validationErrors.duree && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.duree}</p>
                  )}
                 </div>
                 <div>
                   <Label htmlFor="cout">Coût</Label>
                   <Input
                     id="cout"
                     name="cout"
                     value={formData.cout}
                     onChange={(e) => setFormData(prev => ({ ...prev, cout: e.target.value }))}
                     placeholder="Ex: 10 000 FCFA"
                     required
                     disabled={appState.isSubmitting}
                     className={validationErrors.cout ? 'border-red-500' : ''}
                   />
                   {validationErrors.cout && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.cout}</p>
                  )}
                 </div>
                 <div className="md:col-span-2">
                   <Label htmlFor="validite">Validité</Label>
                   <Input
                     id="validite"
                     name="validite"
                     value={formData.validite}
                     onChange={(e) => setFormData(prev => ({ ...prev, validite: e.target.value }))}
                     placeholder="Ex: 5 ans, permanente"
                     disabled={appState.isSubmitting}
                     className={validationErrors.validite ? 'border-red-500' : ''}
                   />
                   {validationErrors.validite && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.validite}</p>
                  )}
                 </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCancel} disabled={appState.isSubmitting}>
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
                <Button type="submit" disabled={appState.isSubmitting}>
                  {appState.isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {selectedService ? 'Enregistrer les modifications' : 'Créer le service'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal de confirmation de suppression */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Êtes-vous absolument sûr de vouloir supprimer ce service ?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Le service sera définitivement supprimé.
              </AlertDialogDescription>
            </AlertDialogHeader>
                         <AlertDialogFooter>
               <AlertDialogCancel onClick={handleCloseModals} disabled={appState.isDeletingId !== null}>
                 Annuler
               </AlertDialogCancel>
               <AlertDialogAction
                 onClick={handleDeleteConfirm}
                 className="bg-red-600 hover:bg-red-700"
                 disabled={appState.isDeletingId !== null}
               >
                 {appState.isDeletingId !== null ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Suppression...
                   </>
                 ) : (
                   <>
                     <Trash2 className="mr-2 h-4 w-4" />
                     Supprimer
                   </>
                 )}
               </AlertDialogAction>
             </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AuthenticatedLayout>
  );
}
