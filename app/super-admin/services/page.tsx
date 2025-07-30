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
  SortDesc
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

// États d'application
interface AppState {
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  isDeletingId: number | null;
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

export default function SuperAdminServicesPage() {
  const router = useRouter();

  // États principaux
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrganisme, setSelectedOrganisme] = useState('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');

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

  // États de l'application
  const [appState, setAppState] = useState<AppState>({
    isLoading: false,
    error: null,
    isSubmitting: false,
    isDeletingId: null
  });

  // État du formulaire
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
      organismes: [...new Set(filtered.map(s => s.organisme))].length
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
  }, []);

  const changeItemsPerPage = useCallback((newItemsPerPage: number) => {
    setPagination(prev => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1 // Retourner à la première page
    }));
  }, []);

  // Fonction de tri
  const handleSort = useCallback((field: keyof Service) => {
    setSortState(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Fonction pour obtenir l'icône de tri
  const getSortIcon = useCallback((field: keyof Service) => {
    if (sortState.field !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return sortState.direction === 'asc'
      ? <SortAsc className="h-4 w-4 text-blue-500" />
      : <SortDesc className="h-4 w-4 text-blue-500" />;
  }, [sortState]);

  // Actions
  const handleViewDetails = (service: Service) => {
    setSelectedService(service);
    setIsDetailsOpen(true);
    toast.info(`Affichage des détails de ${service.nom}`);
  };

  const handleEdit = (service: Service) => {
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
    setIsEditModalOpen(true);
    toast.info(`Modification du service ${service.nom}...`);
  };

  const handleCreate = () => {
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
    setIsCreateModalOpen(true);
    toast.info('Création d\'un nouveau service...');
  };

  const handleDelete = (service: Service) => {
    setServiceToDelete(service);
    setIsDeleteDialogOpen(true);
  };

  const handleNavigateToAdministrations = () => {
    toast.success('Redirection vers Administrations...');
    router.push('/super-admin/administrations');
  };

  const handleNavigateToCreerOrganisme = () => {
    toast.success('Redirection vers Créer Organisme...');
    router.push('/super-admin/organisme/nouveau');
  };

  const handleCloseModals = () => {
    setIsDetailsOpen(false);
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setIsDeleteDialogOpen(false);
    setServiceToDelete(null);
  };

     const validateForm = (): boolean => {
     if (!formData.nom.trim()) {
       toast.error('Le nom du service est requis.');
       return false;
     }
     if (!formData.organisme.trim()) {
       toast.error('L\'organisme responsable est requis.');
       return false;
     }
     if (!formData.description.trim()) {
       toast.error('La description est requise.');
       return false;
     }
     if (!formData.duree.trim()) {
       toast.error('La durée de traitement est requise.');
       return false;
     }
     if (!formData.cout.trim()) {
       toast.error('Le coût est requis.');
       return false;
     }
     if (!formData.responsable.trim()) {
       toast.error('Le responsable est requis.');
       return false;
     }
     if (!formData.telephone.trim()) {
       toast.error('Le numéro de téléphone est requis.');
       return false;
     }
     if (!formData.lieu.trim()) {
       toast.error('Le lieu est requis.');
       return false;
     }
     if (formData.email && !formData.email.includes('@')) {
       toast.error('L\'email doit être valide.');
       return false;
     }
     return true;
   };

   const handleSubmitForm = async (e: React.FormEvent) => {
     e.preventDefault();

     if (!validateForm()) {
       return;
     }

     setAppState(prev => ({ ...prev, isSubmitting: true }));

     try {
      const newService: Service = {
        id: selectedService?.id || Date.now(), // Générer un ID unique
        nom: formData.nom,
        organisme: formData.organisme,
        categorie: formData.categorie,
        description: formData.description,
        duree: formData.duree,
        cout: formData.cout,
        status: formData.status,
        satisfaction: 0, // Aucune métrique générée ici, juste pour le type
        demandes_mois: 0, // Aucune métrique générée ici, juste pour le type
        documents_requis: formData.documents_requis,
        responsable: formData.responsable,
        telephone: formData.telephone,
        email: formData.email,
        derniere_maj: new Date().toISOString().split('T')[0],
        lieu: formData.lieu,
        code_service: '', // Pas de code_service dans le JSON, générer un ID unique
        validite: formData.validite,
        type_organisme: '' // Pas de type_organisme dans le JSON
      };

      if (selectedService) {
                 // Modification
         const updatedServices = localServices.map(s => s.id === selectedService.id ? { ...newService, satisfaction: s.satisfaction, demandes_mois: s.demandes_mois } : s);
         setLocalServices(updatedServices);
         toast.success(`Service "${newService.nom}" mis à jour avec succès !`);
       } else {
         // Création - générer des métriques initiales réalistes
         newService.id = Date.now();
         newService.satisfaction = Math.floor(Math.random() * 20) + 70; // Entre 70 et 90%
         newService.demandes_mois = Math.floor(Math.random() * 100) + 20; // Entre 20 et 120
         setLocalServices(prev => [...prev, newService]);
         toast.success(`Service "${newService.nom}" créé avec succès !`);
       }
       handleCloseModals();
              // Ne pas réinitialiser les filtres après modification pour un meilleur UX
        if (!selectedService) {
          resetFilters();
        }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde du service.');
      console.error(error);
    } finally {
      setAppState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;

    setAppState(prev => ({ ...prev, isDeletingId: serviceToDelete.id }));
    try {
      const updatedServices = localServices.filter(s => s.id !== serviceToDelete.id);
             setLocalServices(updatedServices);
       toast.success(`Service "${serviceToDelete.nom}" supprimé avec succès !`);
       handleCloseModals();
       resetFilters();
    } catch (error) {
      toast.error('Erreur lors de la suppression du service.');
      console.error(error);
    } finally {
      setAppState(prev => ({ ...prev, isDeletingId: null }));
    }
  };

  const handleCancel = () => {
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
  };

    const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategorie('all');
    setSelectedStatus('all');
    setSelectedOrganisme('all');
    toast.info('Filtres réinitialisés');
  }, []);

  const exportToJSON = () => {
    try {
      setAppState(prev => ({ ...prev, isLoading: true }));

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
          filtered_services_count: filteredAndSortedServices.length
        }
      }, null, 2);

      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `services-publics-gabon-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success(`Export JSON réussi ! ${filteredAndSortedServices.length} services exportés.`);
    } catch (error) {
      toast.error('Erreur lors de l\'export JSON');
      console.error(error);
    } finally {
      setAppState(prev => ({ ...prev, isLoading: false }));
    }
  };

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
              </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToJSON} disabled={appState.isLoading}>
              {appState.isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export JSON
            </Button>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Service
            </Button>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Services</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.active} actifs, {stats.maintenance} en maintenance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Organismes</p>
                  <p className="text-2xl font-bold">{stats.organismes}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.categoriesUniques} catégories de services
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Demandes Mensuelles</p>
                  <p className="text-2xl font-bold">{stats.totalDemandes.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    Volume d'activité total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Satisfaction Moyenne</p>
                  <p className="text-2xl font-bold">{stats.satisfactionMoyenne}%</p>
                  <p className="text-xs text-muted-foreground">
                    Qualité de service globale
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
            {/* Filtres */}
            <Card>
              <CardHeader>
                <CardTitle>Recherche et Filtres</CardTitle>
                <CardDescription>
                  Filtrer et rechercher parmi {stats.totalFiltered} services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="🔍 Rechercher par nom, organisme ou description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedCategorie} onValueChange={setSelectedCategorie}>
                    <SelectTrigger className="lg:w-48">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes catégories</SelectItem>
                      {Object.entries(CATEGORIES).map(([value, config]) => (
                        <SelectItem key={value} value={value}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="lg:w-48">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                        <SelectItem key={value} value={value}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedOrganisme} onValueChange={setSelectedOrganisme}>
                    <SelectTrigger className="lg:w-48">
                      <SelectValue placeholder="Organisme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les organismes</SelectItem>
                      {uniqueOrganismes.map(org => (
                        <SelectItem key={org} value={org}>{org}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={resetFilters}>
                    <Filter className="mr-2 h-4 w-4" />
                    Réinitialiser
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Table des services */}
            <Card>
                              <CardHeader>
                  <CardTitle>
                    📋 Liste des Services ({stats.totalFiltered}/{stats.total})
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
                </CardHeader>
              <CardContent>
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
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(service)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(service)}
                                disabled={appState.isDeletingId === service.id}
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
                  />
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
                  />
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
                  />
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
                  />
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
                  />
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
                  />
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
                  />
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
                  />
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
                   />
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
                   />
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
                   />
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
