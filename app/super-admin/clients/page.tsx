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
  Euro,
  Calendar,
  UserCheck,
  ArrowRight,
  Search,
  Filter,
  Download,
  Settings,
  Edit,
  Eye,
  Trash2,
  RefreshCw,
  CreditCard,
  FileText,
  ExternalLink,
  Loader2,
  AlertCircle,
  Target,
  Plus,
  Monitor,
  Smartphone,
  Palette,
  Award,
  Crown,
  Zap,
  Database,
  Headphones,
  BookOpen,
  ChevronRight,
  TrendingDown,
  PieChart,
  DollarSign,
  X,
  Save,
  XCircle,
  Pause,
  Play,
  RotateCcw,
  Bell,
  MessageSquare,
  History,
  Receipt,
  AlertTriangle
} from 'lucide-react';

import { organismeCommercialService } from '@/lib/services/organisme-commercial.service';
import { OrganismeCommercial, TypeContrat } from '@/lib/types/organisme';
import { getOrganismeDetails, hasOrganismeDetails } from '@/lib/data/organismes-detailles';
import { ORGANISMES_BRANDING } from '@/lib/config/organismes-branding';
import { useRouter } from 'next/navigation';

interface LoadingStates {
  loading: boolean;
  refreshing: boolean;
  editing: string | null;
  deleting: string | null;
  exporting: boolean;
  viewingDetails: string | null;
  suspending: string | null;
  upgrading: string | null;
  renewing: string | null;
  invoicing: string | null;
  sendingNotification: string | null;
}

interface ClientsStats {
  totalClients: number;
  chiffreAffairesTotal: number;
  cartesEmises: number;
  servicesActifs: number;
  clientsActifs: number;
  clientsEnAttente: number;
  croissanceMensuelle: number;
  satisfactionMoyenne: number;
  contratsByType: Record<TypeContrat, number>;
  revenus: {
    mensuel: number;
    trimestriel: number;
    annuel: number;
  };
}

interface EditClientForm {
  nom: string;
  code: string;
  type: string;
  localisation: string;
  contact: string;
  telephone: string;
  siteWeb: string;
  description: string;
  contractType: TypeContrat;
  montantAnnuel: number;
  dateExpiration: string;
  statut: 'ACTIF' | 'EXPIRE' | 'SUSPENDU';
  responsable: string;
  departement: string;
}

interface ClientActivity {
  id: string;
  type: 'LOGIN' | 'SERVICE_USAGE' | 'PAYMENT' | 'SUPPORT' | 'CONTRACT_CHANGE';
  description: string;
  date: string;
  user: string;
  details?: string;
}

export default function SuperAdminClientsPage() {
  const router = useRouter();

  // États de base
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedContrat, setSelectedContrat] = useState<string>('all');
  const [selectedStatut, setSelectedStatut] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // États des modals
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);

  // États des données
  const [organismes, setOrganismes] = useState<OrganismeCommercial[]>([]);
  const [clientsStats, setClientsStats] = useState<ClientsStats | null>(null);
  const [selectedClient, setSelectedClient] = useState<OrganismeCommercial | null>(null);
  const [clientActivities, setClientActivities] = useState<ClientActivity[]>([]);
  const [notificationMessage, setNotificationMessage] = useState<string>('');

  // États de chargement
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    loading: true,
    refreshing: false,
    editing: null,
    deleting: null,
    exporting: false,
    viewingDetails: null,
    suspending: null,
    upgrading: null,
    renewing: null,
    invoicing: null,
    sendingNotification: null
  });

  // État du formulaire d'édition
  const [editForm, setEditForm] = useState<EditClientForm>({
    nom: '',
    code: '',
    type: '',
    localisation: '',
    contact: '',
    telephone: '',
    siteWeb: '',
    description: '',
    contractType: 'STANDARD',
    montantAnnuel: 0,
    dateExpiration: '',
    statut: 'ACTIF',
    responsable: '',
    departement: ''
  });

  const [formErrors, setFormErrors] = useState<Partial<EditClientForm>>({});

  // Charger les données des clients
  useEffect(() => {
    loadClientsData();
  }, []);

  const loadClientsData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, loading: true }));

      // Simulation d'un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 800));

      const allOrganismes = organismeCommercialService.getAllOrganismes();
      const clients = allOrganismes.filter(org => org.status === 'CLIENT');

      // Calcul des statistiques clients avancées
      const stats: ClientsStats = {
        totalClients: clients.length,
        chiffreAffairesTotal: clients.reduce((sum, client) => sum + (client.clientInfo?.montantAnnuel || 0), 0),
        cartesEmises: clients.length * 45,
        servicesActifs: clients.length * 8,
        clientsActifs: clients.filter(c => c.clientInfo?.statut === 'ACTIF').length,
        clientsEnAttente: clients.filter(c => c.clientInfo?.statut === 'EXPIRE').length,
        croissanceMensuelle: 12,
        satisfactionMoyenne: 94,
        contratsByType: {
          STANDARD: clients.filter(c => c.clientInfo?.type === 'STANDARD').length,
          PREMIUM: clients.filter(c => c.clientInfo?.type === 'PREMIUM').length,
          ENTERPRISE: clients.filter(c => c.clientInfo?.type === 'ENTERPRISE').length,
          GOUVERNEMENTAL: clients.filter(c => c.clientInfo?.type === 'GOUVERNEMENTAL').length
        },
        revenus: {
          mensuel: Math.round(clients.reduce((sum, client) => sum + (client.clientInfo?.montantAnnuel || 0), 0) / 12),
          trimestriel: Math.round(clients.reduce((sum, client) => sum + (client.clientInfo?.montantAnnuel || 0), 0) / 4),
          annuel: clients.reduce((sum, client) => sum + (client.clientInfo?.montantAnnuel || 0), 0)
        }
      };

      setOrganismes(clients);
      setClientsStats(stats);
      toast.success('Données des clients chargées avec succès');
    } catch (error) {
      console.error('❌ Erreur lors du chargement des clients:', error);
      toast.error('❌ Erreur lors du chargement des données');
    } finally {
      setLoadingStates(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Organismes principaux prioritaires
  const organismesPrincipaux = [
    'MIN_REF_INST', 'MIN_AFF_ETR', 'MIN_INT_SEC', 'MIN_JUSTICE', 'MIN_DEF_NAT',
    'MIN_ECO_FIN', 'MIN_MINES_PETR', 'MIN_SANTE', 'MIN_EDUC_NAT', 'MIN_ENS_SUP',
    'MIN_TRAV_EMPL', 'MIN_AGR_ELEV', 'MIN_EAUX_FOR', 'MIN_TOUR_ARTIS', 'MIN_TRANSP',
    'MIN_NUM_POST', 'MIN_ENV_CLIM', 'MIN_HABIT_URB', 'MIN_SPORT_CULT', 'MIN_JEUN_CIVIQ',
    'DGDI', 'DGI', 'DOUANES', 'CNSS', 'CNAMGS', 'MAIRIE_LBV', 'MAIRIE_PG', 'PREF_EST'
  ];

  // Filtrer les clients
  const filteredClients = useMemo(() => {
    try {
      return organismes.filter(org => {
        const matchSearch = org.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           org.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = selectedType === 'all' || org.type === selectedType;
        const matchContrat = selectedContrat === 'all' || org.clientInfo?.type === selectedContrat;
        const matchStatut = selectedStatut === 'all' || org.clientInfo?.statut === selectedStatut;
        return matchSearch && matchType && matchContrat && matchStatut;
      });
    } catch (error) {
      console.error('❌ Erreur lors du filtrage:', error);
      return [];
    }
  }, [organismes, searchTerm, selectedType, selectedContrat, selectedStatut]);

  // Types d'organismes uniques
  const typesUniques = useMemo(() => {
    return [...new Set(organismes.map(o => o.type))];
  }, [organismes]);

  // Validation du formulaire d'édition
  const validateEditForm = useCallback((form: EditClientForm): Partial<EditClientForm> => {
    const errors: Partial<EditClientForm> = {};

    if (!form.nom.trim()) errors.nom = 'Le nom est requis';
    if (!form.code.trim()) errors.code = 'Le code est requis';
    if (!form.type) errors.type = 'Le type est requis';
    if (!form.localisation.trim()) errors.localisation = 'La localisation est requise';
    if (!form.contact.trim()) {
      errors.contact = 'L\'email de contact est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact)) {
      errors.contact = 'Format d\'email invalide';
    }
    if (form.montantAnnuel <= 0) errors.montantAnnuel = form.montantAnnuel;
    if (!form.dateExpiration) errors.dateExpiration = 'La date d\'expiration est requise';

    return errors;
  }, []);

  // Générer des activités fictives pour un client
  const generateClientActivities = useCallback((organisme: OrganismeCommercial): ClientActivity[] => {
    const activities: ClientActivity[] = [];
    const now = new Date();

    // Génération d'activités simulées
    for (let i = 0; i < 10; i++) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000 * Math.random() * 30));
      const types: ClientActivity['type'][] = ['LOGIN', 'SERVICE_USAGE', 'PAYMENT', 'SUPPORT', 'CONTRACT_CHANGE'];
      const type = types[Math.floor(Math.random() * types.length)];

      activities.push({
        id: `activity-${i}`,
        type,
        description: {
          'LOGIN': 'Connexion au portail administratif',
          'SERVICE_USAGE': 'Utilisation du service de dématérialisation',
          'PAYMENT': 'Paiement de facture mensuelle',
          'SUPPORT': 'Demande de support technique',
          'CONTRACT_CHANGE': 'Modification du contrat'
        }[type],
        date: date.toISOString(),
        user: ['Admin Principal', 'Agent Système', 'Responsable IT', 'Manager'][Math.floor(Math.random() * 4)],
        details: type === 'PAYMENT' ? `${Math.floor(Math.random() * 500000 + 100000)} FCFA` : undefined
      });
    }

    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  // Gestionnaires d'événements
  const handleRefreshData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, refreshing: true }));
      await loadClientsData();
    } finally {
      setLoadingStates(prev => ({ ...prev, refreshing: false }));
    }
  }, [loadClientsData]);

  const handleAccederOrganisme = useCallback((organisme: OrganismeCommercial) => {
    try {
      const details = getOrganismeDetails(organisme.code);
      if (details && details.url) {
        router.push(details.url);
        toast.success(`🚀 Redirection vers ${organisme.nom}`);
      } else {
        toast.info(`📄 Page d'accueil de ${organisme.nom} en cours de développement`);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'accès à l\'organisme:', error);
      toast.error('❌ Erreur lors de l\'accès à l\'organisme');
    }
  }, [router]);

  const handleEditClient = useCallback(async (organisme: OrganismeCommercial) => {
    try {
      setLoadingStates(prev => ({ ...prev, editing: organisme.code }));

      // Remplir le formulaire avec les données actuelles
      setEditForm({
        nom: organisme.nom,
        code: organisme.code,
        type: organisme.type,
        localisation: organisme.localisation,
        contact: typeof organisme.contact === 'string' ? organisme.contact : organisme.contact?.email || '',
        telephone: typeof organisme.contact === 'object' ? organisme.contact?.telephone || '' : '',
        siteWeb: '',
        description: '',
        contractType: organisme.clientInfo?.type || 'STANDARD',
        montantAnnuel: organisme.clientInfo?.montantAnnuel || 0,
        dateExpiration: organisme.clientInfo?.dateExpiration || '',
        statut: organisme.clientInfo?.statut || 'ACTIF',
        responsable: '',
        departement: ''
      });

      setSelectedClient(organisme);
      setIsEditModalOpen(true);
      toast.success(`✅ Ouverture de l'édition de ${organisme.nom}`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'édition:', error);
      toast.error('❌ Erreur lors de l\'ouverture de l\'édition');
    } finally {
      setLoadingStates(prev => ({ ...prev, editing: null }));
    }
  }, []);

  const handleViewDetails = useCallback(async (organisme: OrganismeCommercial) => {
    try {
      setLoadingStates(prev => ({ ...prev, viewingDetails: organisme.code }));

      // Générer les activités du client
      const activities = generateClientActivities(organisme);
      setClientActivities(activities);

      setSelectedClient(organisme);
      setIsDetailsModalOpen(true);
      toast.success(`📊 Ouverture des détails de ${organisme.nom}`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'affichage des détails:', error);
      toast.error('❌ Erreur lors de l\'affichage des détails');
    } finally {
      setLoadingStates(prev => ({ ...prev, viewingDetails: null }));
    }
  }, [generateClientActivities]);

  const handleSaveClient = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, editing: selectedClient?.code || 'unknown' }));

      // Validation
      const errors = validateEditForm(editForm);
      setFormErrors(errors);

      if (Object.keys(errors).length > 0) {
        toast.error('❌ Veuillez corriger les erreurs du formulaire');
        return;
      }

      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(`✅ Client "${editForm.nom}" modifié avec succès`);
      setIsEditModalOpen(false);
      setSelectedClient(null);
      setFormErrors({});

      // Recharger les données
      await loadClientsData();
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      toast.error('❌ Erreur lors de la sauvegarde');
    } finally {
      setLoadingStates(prev => ({ ...prev, editing: null }));
    }
  }, [editForm, validateEditForm, selectedClient, loadClientsData]);

  const handleSuspendClient = useCallback(async (organisme: OrganismeCommercial) => {
    try {
      const confirmed = window.confirm(
        `⚠️ Êtes-vous sûr de vouloir suspendre le client "${organisme.nom}" ?\n\nCela désactivera temporairement tous ses services.`
      );

      if (!confirmed) return;

      setLoadingStates(prev => ({ ...prev, suspending: organisme.code }));

      // Simulation de suspension
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(`⏸️ Client "${organisme.nom}" suspendu avec succès`);
      await loadClientsData();
    } catch (error) {
      console.error('❌ Erreur lors de la suspension:', error);
      toast.error('❌ Erreur lors de la suspension');
    } finally {
      setLoadingStates(prev => ({ ...prev, suspending: null }));
    }
  }, [loadClientsData]);

  const handleRenewContract = useCallback(async (organisme: OrganismeCommercial) => {
    try {
      const confirmed = window.confirm(
        `🔄 Renouveler le contrat de "${organisme.nom}" pour une année supplémentaire ?`
      );

      if (!confirmed) return;

      setLoadingStates(prev => ({ ...prev, renewing: organisme.code }));

      // Simulation de renouvellement
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(`✅ Contrat de "${organisme.nom}" renouvelé pour une année`);
      await loadClientsData();
    } catch (error) {
      console.error('❌ Erreur lors du renouvellement:', error);
      toast.error('❌ Erreur lors du renouvellement');
    } finally {
      setLoadingStates(prev => ({ ...prev, renewing: null }));
    }
  }, [loadClientsData]);

  const handleGenerateInvoice = useCallback(async (organisme: OrganismeCommercial) => {
    try {
      setLoadingStates(prev => ({ ...prev, invoicing: organisme.code }));

      // Simulation de génération de facture
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Créer un blob pour la facture PDF (simulation)
      const pdfContent = `Facture pour ${organisme.nom}\nMontant: ${formatPrix(organisme.clientInfo?.montantAnnuel || 0)}\nDate: ${new Date().toLocaleDateString('fr-FR')}`;
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture-${organisme.code}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`📄 Facture générée pour "${organisme.nom}"`);
    } catch (error) {
      console.error('❌ Erreur lors de la génération de facture:', error);
      toast.error('❌ Erreur lors de la génération de facture');
    } finally {
      setLoadingStates(prev => ({ ...prev, invoicing: null }));
    }
  }, []);

  const handleSendNotification = useCallback(async (organisme: OrganismeCommercial) => {
    try {
      setSelectedClient(organisme);
      setIsNotificationModalOpen(true);
    } catch (error) {
      console.error('❌ Erreur lors de l\'ouverture de notification:', error);
      toast.error('❌ Erreur lors de l\'ouverture de notification');
    }
  }, []);

  const handleSendNotificationMessage = useCallback(async () => {
    try {
      if (!notificationMessage.trim()) {
        toast.error('❌ Le message ne peut pas être vide');
        return;
      }

      setLoadingStates(prev => ({ ...prev, sendingNotification: selectedClient?.code || 'unknown' }));

      // Simulation d'envoi de notification
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success(`📨 Notification envoyée à "${selectedClient?.nom}"`);
      setIsNotificationModalOpen(false);
      setNotificationMessage('');
      setSelectedClient(null);
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi:', error);
      toast.error('❌ Erreur lors de l\'envoi de la notification');
    } finally {
      setLoadingStates(prev => ({ ...prev, sendingNotification: null }));
    }
  }, [notificationMessage, selectedClient]);

  const handleExportData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, exporting: true }));

      // Simulation d'export
      await new Promise(resolve => setTimeout(resolve, 1000));

      const exportData = {
        exported_at: new Date().toISOString(),
        total_clients: filteredClients.length,
        clients: filteredClients,
        statistics: clientsStats,
        source: 'SUPER_ADMIN_CLIENTS_PAGE'
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `clients-admin-ga-${filteredClients.length}-${new Date().toISOString().split('T')[0]}.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`✅ Export de ${filteredClients.length} clients réussi !`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'export:', error);
      toast.error('❌ Erreur lors de l\'export des données');
    } finally {
      setLoadingStates(prev => ({ ...prev, exporting: false }));
    }
  }, [filteredClients, clientsStats]);

  // Fonctions utilitaires
  const formatPrix = (prix: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(prix);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MINISTERE': return Building2;
      case 'MAIRIE': return MapPin;
      case 'DIRECTION_GENERALE': return Shield;
      case 'PREFECTURE': return MapPin;
      case 'PROVINCE': return Globe;
      default: return Building2;
    }
  };

  const getContratTypeColor = (type?: TypeContrat) => {
    if (!type) return 'bg-gray-100 text-gray-800 border-gray-300';
    switch (type) {
      case 'STANDARD': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'PREMIUM': return 'bg-green-100 text-green-800 border-green-300';
      case 'ENTERPRISE': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'GOUVERNEMENTAL': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getContratIcon = (type?: TypeContrat) => {
    switch (type) {
      case 'STANDARD': return Award;
      case 'PREMIUM': return Star;
      case 'ENTERPRISE': return Crown;
      case 'GOUVERNEMENTAL': return Shield;
      default: return Award;
    }
  };

  const getActivityIcon = (type: ClientActivity['type']) => {
    switch (type) {
      case 'LOGIN': return Users;
      case 'SERVICE_USAGE': return Activity;
      case 'PAYMENT': return CreditCard;
      case 'SUPPORT': return Headphones;
      case 'CONTRACT_CHANGE': return FileText;
      default: return Activity;
    }
  };

  const getActivityColor = (type: ClientActivity['type']) => {
    switch (type) {
      case 'LOGIN': return 'text-blue-600';
      case 'SERVICE_USAGE': return 'text-green-600';
      case 'PAYMENT': return 'text-purple-600';
      case 'SUPPORT': return 'text-orange-600';
      case 'CONTRACT_CHANGE': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getBrandingForOrganisme = (organismeCode: string) => {
    return Object.values(ORGANISMES_BRANDING).find(b => b.code === organismeCode) || {
      code: 'DEFAULT',
      nom: 'Organisme',
      couleurPrimaire: '#3B82F6',
      couleurSecondaire: '#10B981',
      gradientClasses: 'from-blue-600 to-blue-800',
      icon: Building2,
      description: 'Au service du citoyen'
    };
  };

  if (loadingStates.loading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chargement des organismes clients...</h3>
              <p className="text-muted-foreground">Veuillez patienter pendant le chargement des données</p>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <UserCheck className="h-8 w-8 text-green-600" />
                Organismes Clients ADMIN.GA
              </h1>
              <p className="text-gray-600">
                Gestion complète des organismes clients avec environnements personnalisés, cartes membres et services digitaux
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
                onClick={handleExportData}
                disabled={loadingStates.exporting}
              >
                {loadingStates.exporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Exporter
              </Button>
            </div>
          </div>
        </div>

        {/* Tableau de bord financier */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Chiffre d'Affaires</p>
                  <p className="text-2xl font-bold">{clientsStats ? formatPrix(clientsStats.chiffreAffairesTotal) : '0 FCFA'}</p>
                  <p className="text-green-100 text-xs">+{clientsStats?.croissanceMensuelle || 0}% ce mois</p>
                </div>
                <Euro className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Clients Actifs</p>
                  <p className="text-2xl font-bold">{clientsStats?.totalClients || 0}</p>
                  <p className="text-blue-100 text-xs">{clientsStats?.clientsActifs || 0} actifs</p>
                </div>
                <UserCheck className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Services Déployés</p>
                  <p className="text-2xl font-bold">{clientsStats?.servicesActifs || 0}</p>
                  <p className="text-purple-100 text-xs">Env. interne, cartes, flux</p>
                </div>
                <Settings className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Cartes Émises</p>
                  <p className="text-2xl font-bold">{clientsStats?.cartesEmises || 0}</p>
                  <p className="text-orange-100 text-xs">Physiques + Virtuelles</p>
                </div>
                <CreditCard className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques par type de contrat */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Répartition par Type de Contrat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center border-l-4 border-l-blue-500">
                <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{clientsStats?.contratsByType.STANDARD || 0}</p>
                <p className="text-sm text-gray-600">Standard</p>
              </Card>
              <Card className="p-4 text-center border-l-4 border-l-green-500">
                <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{clientsStats?.contratsByType.PREMIUM || 0}</p>
                <p className="text-sm text-gray-600">Premium</p>
              </Card>
              <Card className="p-4 text-center border-l-4 border-l-purple-500">
                <Crown className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{clientsStats?.contratsByType.ENTERPRISE || 0}</p>
                <p className="text-sm text-gray-600">Enterprise</p>
              </Card>
              <Card className="p-4 text-center border-l-4 border-l-yellow-500">
                <Shield className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{clientsStats?.contratsByType.GOUVERNEMENTAL || 0}</p>
                <p className="text-sm text-gray-600">Gouvernemental</p>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Filtres */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher un organisme client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Type d'organisme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {typesUniques.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedContrat} onValueChange={setSelectedContrat}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type de contrat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous contrats</SelectItem>
                  <SelectItem value="STANDARD">Standard</SelectItem>
                  <SelectItem value="PREMIUM">Premium</SelectItem>
                  <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                  <SelectItem value="GOUVERNEMENTAL">Gouvernemental</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatut} onValueChange={setSelectedStatut}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="ACTIF">Actif</SelectItem>
                  <SelectItem value="EXPIRE">Expiré</SelectItem>
                  <SelectItem value="SUSPENDU">Suspendu</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedContrat('all');
                  setSelectedStatut('all');
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>

              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
                    <div className="bg-current rounded-[1px]"></div>
                    <div className="bg-current rounded-[1px]"></div>
                    <div className="bg-current rounded-[1px]"></div>
                    <div className="bg-current rounded-[1px]"></div>
                  </div>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <div className="flex flex-col gap-0.5 w-3 h-3">
                    <div className="bg-current h-0.5 rounded-[1px]"></div>
                    <div className="bg-current h-0.5 rounded-[1px]"></div>
                    <div className="bg-current h-0.5 rounded-[1px]"></div>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des organismes clients */}
        <div className={`${
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
            : 'space-y-4'
        }`}>
          {filteredClients.map((organisme) => {
            const TypeIcon = getTypeIcon(organisme.type);
            const ContratIcon = getContratIcon(organisme.clientInfo?.type);
            const branding = getBrandingForOrganisme(organisme.code);
            const details = getOrganismeDetails(organisme.code);

            if (viewMode === 'grid') {
              return (
                <Card
                  key={organisme.code}
                  className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
                >
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                        style={{ backgroundColor: branding.couleurPrimaire }}
                      >
                        <TypeIcon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg leading-tight truncate" title={organisme.nom}>
                          {organisme.nom}
                        </h3>
                        <p className="text-gray-600 text-sm truncate">{organisme.type}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Code: <span className="font-mono">{organisme.code}</span>
                        </p>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        CLIENT
                      </Badge>
                      {organismesPrincipaux.includes(organisme.code) && (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          PRINCIPAL
                        </Badge>
                      )}
                      <Badge className={getContratTypeColor(organisme.clientInfo?.type)}>
                        <ContratIcon className="h-3 w-3 mr-1" />
                        {organisme.clientInfo?.type}
                      </Badge>
                    </div>

                    {/* Informations clés */}
                    <div className="space-y-2 mb-4 flex-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{organisme.localisation}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{organisme.stats.totalUsers} utilisateurs</span>
                      </div>
                      <div className="flex items-center text-sm text-green-600 font-medium">
                        <Euro className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{formatPrix(organisme.clientInfo?.montantAnnuel || 0)}/an</span>
                      </div>
                      {details && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {details.comptes} comptes
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {details.services} services
                          </Badge>
                        </div>
                      )}
                      {organisme.clientInfo?.dateExpiration && (
                        <div className="text-xs text-gray-500">
                          Expire: {new Date(organisme.clientInfo.dateExpiration).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>

                    {/* Actions principales */}
                    <div className="space-y-2 pt-4 border-t">
                      {hasOrganismeDetails(organisme.code) && (
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => handleAccederOrganisme(organisme)}
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Accéder à {organisme.code}
                        </Button>
                      )}

                      {/* Boutons d'action secondaires */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClient(organisme)}
                          disabled={loadingStates.editing === organisme.code}
                        >
                          {loadingStates.editing === organisme.code ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Edit className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(organisme)}
                          disabled={loadingStates.viewingDetails === organisme.code}
                        >
                          {loadingStates.viewingDetails === organisme.code ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => router.push(`/super-admin/clients/${organisme.code}`)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Gérer
                        </Button>
                      </div>

                      {/* Actions avancées */}
                      <div className="grid grid-cols-3 gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateInvoice(organisme)}
                          disabled={loadingStates.invoicing === organisme.code}
                          title="Générer facture"
                        >
                          {loadingStates.invoicing === organisme.code ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Receipt className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRenewContract(organisme)}
                          disabled={loadingStates.renewing === organisme.code}
                          title="Renouveler contrat"
                        >
                          {loadingStates.renewing === organisme.code ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <RotateCcw className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendNotification(organisme)}
                          title="Envoyer notification"
                        >
                          <Bell className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Actions administratives */}
                      {organisme.clientInfo?.statut === 'ACTIF' ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={() => handleSuspendClient(organisme)}
                          disabled={loadingStates.suspending === organisme.code}
                        >
                          {loadingStates.suspending === organisme.code ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Pause className="h-4 w-4 mr-2" />
                          )}
                          Suspendre
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full"
                          onClick={() => handleSuspendClient(organisme)}
                          disabled={loadingStates.suspending === organisme.code}
                        >
                          {loadingStates.suspending === organisme.code ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4 mr-2" />
                          )}
                          Réactiver
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            } else {
              // Mode liste
              return (
                <Card key={organisme.code} className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: branding.couleurPrimaire }}
                        >
                          <TypeIcon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{organisme.nom}</h3>
                          <p className="text-gray-600">{organisme.type}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="flex items-center text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              {organisme.localisation}
                            </span>
                            <span className="flex items-center text-sm text-gray-500">
                              <Users className="h-4 w-4 mr-1" />
                              {organisme.stats.totalUsers} utilisateurs
                            </span>
                            <span className="flex items-center text-sm text-green-600 font-medium">
                              <Euro className="h-4 w-4 mr-1" />
                              {formatPrix(organisme.clientInfo?.montantAnnuel || 0)}/an
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex flex-col gap-1">
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              CLIENT
                            </Badge>
                            <Badge className={getContratTypeColor(organisme.clientInfo?.type)}>
                              <ContratIcon className="h-3 w-3 mr-1" />
                              {organisme.clientInfo?.type}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {hasOrganismeDetails(organisme.code) && (
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleAccederOrganisme(organisme)}
                            >
                              <ArrowRight className="h-4 w-4 mr-1" />
                              Accéder
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClient(organisme)}
                            disabled={loadingStates.editing === organisme.code}
                          >
                            {loadingStates.editing === organisme.code ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Edit className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(organisme)}
                            disabled={loadingStates.viewingDetails === organisme.code}
                          >
                            {loadingStates.viewingDetails === organisme.code ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => router.push(`/super-admin/clients/${organisme.code}`)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            }
          })}

          {filteredClients.length === 0 && (
            <div className="col-span-full text-center py-12">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
              <p className="text-gray-600 mb-4">
                Aucun organisme client ne correspond aux critères de recherche actuels.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedContrat('all');
                  setSelectedStatut('all');
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>

        {/* Footer avec résumé */}
        {filteredClients.length > 0 && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Affichage de {filteredClients.length} organisme(s) client(s) sur {organismes.length} total
                </div>
                <div className="text-sm text-gray-600">
                  Chiffre d'affaires total: <span className="font-semibold text-green-600">
                    {formatPrix(filteredClients.reduce((sum, client) => sum + (client.clientInfo?.montantAnnuel || 0), 0))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal d'édition */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier le client - {selectedClient?.nom}</DialogTitle>
              <DialogDescription>
                Modifiez les informations et paramètres du contrat client
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Informations générales</h3>

                <div>
                  <Label htmlFor="edit-nom">Nom de l'organisme *</Label>
                  <Input
                    id="edit-nom"
                    value={editForm.nom}
                    onChange={(e) => setEditForm(prev => ({ ...prev, nom: e.target.value }))}
                    className={formErrors.nom ? 'border-red-500' : ''}
                  />
                  {formErrors.nom && <p className="text-red-500 text-xs mt-1">{formErrors.nom}</p>}
                </div>

                <div>
                  <Label htmlFor="edit-code">Code organisme *</Label>
                  <Input
                    id="edit-code"
                    value={editForm.code}
                    onChange={(e) => setEditForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className={formErrors.code ? 'border-red-500' : ''}
                    disabled
                  />
                  {formErrors.code && <p className="text-red-500 text-xs mt-1">{formErrors.code}</p>}
                </div>

                <div>
                  <Label htmlFor="edit-type">Type d'organisme *</Label>
                  <Select
                    value={editForm.type}
                    onValueChange={(value) => setEditForm(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className={formErrors.type ? 'border-red-500' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MINISTERE">Ministère</SelectItem>
                      <SelectItem value="DIRECTION_GENERALE">Direction Générale</SelectItem>
                      <SelectItem value="MAIRIE">Mairie</SelectItem>
                      <SelectItem value="PREFECTURE">Préfecture</SelectItem>
                      <SelectItem value="PROVINCE">Province</SelectItem>
                      <SelectItem value="ORGANISME_SOCIAL">Organisme Social</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.type && <p className="text-red-500 text-xs mt-1">{formErrors.type}</p>}
                </div>

                <div>
                  <Label htmlFor="edit-localisation">Localisation *</Label>
                  <Input
                    id="edit-localisation"
                    value={editForm.localisation}
                    onChange={(e) => setEditForm(prev => ({ ...prev, localisation: e.target.value }))}
                    className={formErrors.localisation ? 'border-red-500' : ''}
                  />
                  {formErrors.localisation && <p className="text-red-500 text-xs mt-1">{formErrors.localisation}</p>}
                </div>

                <div>
                  <Label htmlFor="edit-contact">Email de contact *</Label>
                  <Input
                    id="edit-contact"
                    type="email"
                    value={editForm.contact}
                    onChange={(e) => setEditForm(prev => ({ ...prev, contact: e.target.value }))}
                    className={formErrors.contact ? 'border-red-500' : ''}
                  />
                  {formErrors.contact && <p className="text-red-500 text-xs mt-1">{formErrors.contact}</p>}
                </div>

                <div>
                  <Label htmlFor="edit-telephone">Téléphone</Label>
                  <Input
                    id="edit-telephone"
                    value={editForm.telephone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, telephone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Contrat & Facturation</h3>

                <div>
                  <Label htmlFor="edit-contract-type">Type de contrat</Label>
                  <Select
                    value={editForm.contractType}
                    onValueChange={(value: TypeContrat) => setEditForm(prev => ({ ...prev, contractType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STANDARD">Standard</SelectItem>
                      <SelectItem value="PREMIUM">Premium</SelectItem>
                      <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                      <SelectItem value="GOUVERNEMENTAL">Gouvernemental</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-montant">Montant annuel (FCFA) *</Label>
                  <Input
                    id="edit-montant"
                    type="number"
                    value={editForm.montantAnnuel}
                    onChange={(e) => setEditForm(prev => ({ ...prev, montantAnnuel: parseInt(e.target.value) || 0 }))}
                    className={formErrors.montantAnnuel ? 'border-red-500' : ''}
                  />
                  {formErrors.montantAnnuel && <p className="text-red-500 text-xs mt-1">{formErrors.montantAnnuel}</p>}
                </div>

                <div>
                  <Label htmlFor="edit-expiration">Date d'expiration *</Label>
                  <Input
                    id="edit-expiration"
                    type="date"
                    value={editForm.dateExpiration}
                    onChange={(e) => setEditForm(prev => ({ ...prev, dateExpiration: e.target.value }))}
                    className={formErrors.dateExpiration ? 'border-red-500' : ''}
                  />
                  {formErrors.dateExpiration && <p className="text-red-500 text-xs mt-1">{formErrors.dateExpiration}</p>}
                </div>

                <div>
                  <Label htmlFor="edit-statut">Statut</Label>
                  <Select
                    value={editForm.statut}
                    onValueChange={(value: 'ACTIF' | 'EXPIRE' | 'SUSPENDU') => setEditForm(prev => ({ ...prev, statut: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                                             <SelectItem value="ACTIF">Actif</SelectItem>
                       <SelectItem value="EXPIRE">Expiré</SelectItem>
                       <SelectItem value="SUSPENDU">Suspendu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-responsable">Responsable</Label>
                  <Input
                    id="edit-responsable"
                    value={editForm.responsable}
                    onChange={(e) => setEditForm(prev => ({ ...prev, responsable: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-departement">Département</Label>
                  <Input
                    id="edit-departement"
                    value={editForm.departement}
                    onChange={(e) => setEditForm(prev => ({ ...prev, departement: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={loadingStates.editing !== null}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSaveClient}
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

        {/* Modal de détails */}
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Détails du client - {selectedClient?.nom}</DialogTitle>
              <DialogDescription>
                Informations complètes et historique d'activité
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="contract">Contrat</TabsTrigger>
                <TabsTrigger value="activity">Activité</TabsTrigger>
                <TabsTrigger value="billing">Facturation</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Informations générales */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Informations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Nom</Label>
                        <p className="text-sm text-gray-600">{selectedClient?.nom}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Code</Label>
                        <p className="text-sm text-gray-600 font-mono">{selectedClient?.code}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Type</Label>
                        <p className="text-sm text-gray-600">{selectedClient?.type}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Localisation</Label>
                        <p className="text-sm text-gray-600">{selectedClient?.localisation}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Métriques */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Métriques</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Utilisateurs</Label>
                        <p className="text-2xl font-bold text-blue-600">{selectedClient?.stats.totalUsers}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Chiffre d'affaires annuel</Label>
                        <p className="text-lg font-semibold text-green-600">
                          {formatPrix(selectedClient?.clientInfo?.montantAnnuel || 0)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Satisfaction</Label>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">4.8/5</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Statut du contrat */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contrat</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Type</Label>
                        <Badge className={getContratTypeColor(selectedClient?.clientInfo?.type)} >
                          {selectedClient?.clientInfo?.type}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Statut</Label>
                        <Badge variant={selectedClient?.clientInfo?.statut === 'ACTIF' ? 'default' : 'secondary'}>
                          {selectedClient?.clientInfo?.statut}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Expiration</Label>
                        <p className="text-sm text-gray-600">
                          {selectedClient?.clientInfo?.dateExpiration
                            ? new Date(selectedClient.clientInfo.dateExpiration).toLocaleDateString('fr-FR')
                            : 'N/A'
                          }
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="contract" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Détails du contrat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="font-medium">Type de contrat</Label>
                          <div className="flex items-center gap-2 mt-1">
                            {React.createElement(getContratIcon(selectedClient?.clientInfo?.type), { className: "h-5 w-5" })}
                            <span>{selectedClient?.clientInfo?.type}</span>
                          </div>
                        </div>
                        <div>
                          <Label className="font-medium">Date de début</Label>
                          <p>01/01/2024</p>
                        </div>
                        <div>
                          <Label className="font-medium">Date d'expiration</Label>
                          <p>{selectedClient?.clientInfo?.dateExpiration
                            ? new Date(selectedClient.clientInfo.dateExpiration).toLocaleDateString('fr-FR')
                            : 'N/A'
                          }</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label className="font-medium">Montant annuel</Label>
                          <p className="text-2xl font-bold text-green-600">
                            {formatPrix(selectedClient?.clientInfo?.montantAnnuel || 0)}
                          </p>
                        </div>
                        <div>
                          <Label className="font-medium">Renouvellement automatique</Label>
                          <p>Activé</p>
                        </div>
                        <div>
                          <Label className="font-medium">Prochaine facturation</Label>
                          <p>01/01/2025</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Activité récente</CardTitle>
                    <CardDescription>Historique des actions et événements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {clientActivities.map((activity) => {
                        const ActivityIcon = getActivityIcon(activity.type);
                        return (
                          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                            <div className={`p-2 rounded-full ${getActivityColor(activity.type)} bg-gray-100`}>
                              <ActivityIcon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{activity.description}</p>
                              <p className="text-xs text-gray-500">
                                {activity.user} • {new Date(activity.date).toLocaleDateString('fr-FR', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              {activity.details && (
                                <p className="text-xs text-gray-600 mt-1">{activity.details}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique de facturation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { date: '2024-01-01', montant: selectedClient?.clientInfo?.montantAnnuel || 0, statut: 'Payé', numero: 'FAC-2024-001' },
                        { date: '2023-01-01', montant: (selectedClient?.clientInfo?.montantAnnuel || 0) * 0.9, statut: 'Payé', numero: 'FAC-2023-001' },
                        { date: '2022-01-01', montant: (selectedClient?.clientInfo?.montantAnnuel || 0) * 0.8, statut: 'Payé', numero: 'FAC-2022-001' }
                      ].map((facture, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{facture.numero}</p>
                            <p className="text-sm text-gray-600">{new Date(facture.date).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatPrix(facture.montant)}</p>
                            <Badge variant="default" className="text-xs">
                              {facture.statut}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Modal de notification */}
        <Dialog open={isNotificationModalOpen} onOpenChange={setIsNotificationModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Envoyer une notification</DialogTitle>
              <DialogDescription>
                Envoyer une notification à {selectedClient?.nom}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="notification-message">Message *</Label>
                <Textarea
                  id="notification-message"
                  placeholder="Rédigez votre message..."
                  rows={5}
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsNotificationModalOpen(false);
                  setNotificationMessage('');
                  setSelectedClient(null);
                }}
                disabled={loadingStates.sendingNotification !== null}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSendNotificationMessage}
                disabled={loadingStates.sendingNotification !== null || !notificationMessage.trim()}
              >
                {loadingStates.sendingNotification ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MessageSquare className="mr-2 h-4 w-4" />
                )}
                Envoyer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
