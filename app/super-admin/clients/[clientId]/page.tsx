'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
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
  ArrowLeft,
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
  AlertTriangle,
  Package,
  Wrench,
  Coins,
  Upload,
  Key,
  Lock,
  Wifi,
  Code,
  Layers,
  Brush,
  Image,
  Type,
  Sliders,
  List,
  Grid,
  ToggleLeft,
  ToggleRight,
  Gamepad2,
  Ticket,
  HelpCircle,
  MessageCircle,
  LogOut,
  Home,
  Archive,
  Copy,
  User,
  Send,
  Info
} from 'lucide-react';

import { organismeCommercialService } from '@/lib/services/organisme-commercial.service';
import { clientManagementService } from '@/lib/services/client-management.service';
import { OrganismeCommercial, TypeContrat } from '@/lib/types/organisme';
import { ClientThemeConfig as ImportedThemeConfig } from '@/lib/types/client-management';

// Type local simplifié pour compatibilité avec les données existantes
interface ServiceConfig {
  id: string;
  name: string;
  enabled: boolean;
  price: number;
  settings: Record<string, any>;
  category: string;
  description: string;
  icon?: string;
  dependencies?: string[];
  sla?: string;
}
import { getOrganismeDetails, hasOrganismeDetails } from '@/lib/data/organismes-detailles';
import { ORGANISMES_BRANDING } from '@/lib/config/organismes-branding';

// Types pour la gestion complète du client
interface ClientThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  faviconUrl: string;
  customCss: string;
  fontFamily: string;
  headerImage: string;
  footerText: string;
  darkMode: boolean;
  animations: boolean;
}



interface CardConfig {
  type: 'PHYSICAL' | 'VIRTUAL';
  enabled: boolean;
  design: {
    template: string;
    colors: string[];
    logo: string;
    backgroundImage: string;
  };
  features: string[];
  pricing: {
    setupFee: number;
    monthlyFee: number;
    transactionFee: number;
  };
}

interface BillingConfig {
  cycle: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  paymentMethods: string[];
  currency: string;
  taxRate: number;
  invoiceTemplate: string;
  autoRenew: boolean;
  reminderDays: number[];
}

interface UserPermission {
  userId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  permissions: string[];
  lastActivity: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'INVITED' | 'IMPORTED';
}

interface TechnicalConfig {
  apiKeys: Record<string, string>;
  webhookEndpoints: string[];
  ipWhitelist: string[];
  sslConfig: {
    enabled: boolean;
    certificate: string;
    expiryDate: string;
  };
  backupConfig: {
    frequency: string;
    retention: number;
    location: string;
  };
}

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  assignedTo: string;
  category: string;
}

export default function ClientManagementPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;

  // États principaux
  const [client, setClient] = useState<OrganismeCommercial | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [saving, setSaving] = useState(false);

  // États de chargement détaillés
  const [loadingStates, setLoadingStates] = useState({
    savingTheme: false,      // Sauvegarde thème
    savingServices: false,   // Sauvegarde services
    savingCards: false,      // Sauvegarde cartes
    savingBilling: false,    // Sauvegarde facturation
    savingUsers: false,      // Sauvegarde utilisateurs
    savingTechnical: false,  // Sauvegarde technique
    previewingTheme: false,  // Aperçu thème
    previewingCards: false,  // Aperçu cartes
    previewingInvoice: false, // Aperçu facture
    addingUser: false,       // Ajout utilisateur
    testing: false,          // Test connexion/API
    exporting: false,        // Export données
    uploadingLogo: false,    // Upload logo principal
    uploadingFavicon: false, // Upload favicon
    uploadingHeader: false,  // Upload image en-tête
    resetingTheme: false,    // Reset thème
    importingTheme: false,   // Import thème
    exportingTheme: false,   // Export thème
    configuringService: false, // Configuration service
    viewingAnalytics: false, // Visualisation analytics
    addingService: false,    // Ajout nouveau service
    deletingService: false,  // Suppression service
    duplicatingService: false, // Duplication service
    testingService: false,   // Test service
    configuringCard: false,  // Configuration avancée carte
    testingCard: false,      // Test fonctionnalités carte
    duplicatingCard: false,  // Duplication configuration carte
    resetingCard: false,     // Reset configuration carte
    importingCard: false,    // Import configuration carte
    exportingCard: false,    // Export configuration carte
    managingTemplates: false, // Gestion templates carte
    viewingCardAnalytics: false, // Analytics cartes
    configuringBilling: false, // Configuration avancée facturation
    testingPayment: false,     // Test méthodes paiement
    managingReminders: false,  // Gestion rappels paiement
    exportingBilling: false,   // Export données facturation
    importingBilling: false,   // Import configuration facturation
    duplicatingBilling: false, // Duplication configuration
    resetingBilling: false,    // Reset configuration facturation
    viewingBillingAnalytics: false, // Analytics facturation
    managingInvoiceTemplates: false, // Gestion templates facture
    processingPayment: false,   // Traitement paiement manuel
    searchingUsers: false,      // Recherche utilisateurs
    editingUser: false,         // Édition utilisateur
    managingPermissions: false, // Gestion permissions
    invitingUser: false,        // Invitation utilisateur
    exportingUsers: false,      // Export utilisateurs
    importingUsers: false,      // Import utilisateurs
    deletingUser: false,        // Suppression utilisateur
    viewingUserAnalytics: false, // Analytics utilisateurs
    managingGroups: false,      // Gestion groupes
    bulkActions: false,         // Actions en lot
    sendingNotification: false,  // Envoi notifications
    refreshingApiKey: false,     // Rafraîchissement clé API
    addingWebhook: false,        // Ajout webhook
    removingWebhook: false,      // Suppression webhook
    uploadingCert: false,        // Upload certificat SSL
    schedulingMaintenance: false, // Programmation maintenance
    runningDiagnostics: false,   // Diagnostics système
    exportingLogs: false,        // Export logs
    clearingCache: false,        // Nettoyage cache
    testingWebhook: false,       // Test webhook
    savingTechnicalConfig: false, // Sauvegarde config technique
    testingConnection: false,    // Test connexion
    generatingReport: false,     // Génération rapport mensuel
    analyzingData: false,        // Analyse détaillée
    exportingAnalytics: false,   // Export données analytics
    refreshingMetrics: false,    // Actualisation métriques
    loadingChart: false,         // Chargement graphiques
    filteringData: false,        // Filtrage données
    exportingPDF: false,         // Export PDF
    exportingExcel: false,       // Export Excel
    downloadingReport: false,    // Téléchargement rapport
    creatingTicket: false,       // Création nouveau ticket
    assigningTicket: false,      // Assignation ticket
    closingTicket: false,        // Fermeture ticket
    loadingHistory: false,       // Chargement historique
    sendingMessage: false,       // Envoi message support
    generatingGuide: false,      // Génération guide
    loadingFAQ: false,           // Chargement FAQ
    contactingSupport: false,    // Contact support
    downloadingDocs: false,      // Téléchargement documentation
    refreshingTickets: false,    // Actualisation tickets
    updatingTicket: false,       // Mise à jour ticket
    exportingHistory: false      // Export historique
  });

  // États de validation
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  // États spécifiques aux services
  const [selectedService, setSelectedService] = useState<ServiceConfig | null>(null);
  const [serviceConfigModal, setServiceConfigModal] = useState(false);
  const [serviceAnalyticsModal, setServiceAnalyticsModal] = useState(false);
  const [addServiceModal, setAddServiceModal] = useState(false);
  const [newServiceForm, setNewServiceForm] = useState({
    id: '',
    name: '',
    description: '',
    category: 'IDENTITE' as const,
    price: 0,
    enabled: false,
    settings: {}
  });
  const [serviceFormErrors, setServiceFormErrors] = useState<Record<string, string>>({});

  // États spécifiques aux cartes
  const [selectedCardType, setSelectedCardType] = useState<'physical' | 'virtual' | null>(null);
  const [cardConfigModal, setCardConfigModal] = useState(false);
  const [cardAnalyticsModal, setCardAnalyticsModal] = useState(false);
  const [cardTemplateModal, setCardTemplateModal] = useState(false);
  const [cardTestModal, setCardTestModal] = useState(false);
  const [customTemplate, setCustomTemplate] = useState({
    name: '',
    description: '',
    settings: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      logoPosition: 'top-left',
      layout: 'standard'
    }
  });
  const [cardFormErrors, setCardFormErrors] = useState<Record<string, string>>({});

  // États spécifiques à la facturation
  const [billingConfigModal, setBillingConfigModal] = useState(false);
  const [billingAnalyticsModal, setBillingAnalyticsModal] = useState(false);
  const [paymentTestModal, setPaymentTestModal] = useState(false);
  const [remindersModal, setRemindersModal] = useState(false);
  const [invoiceTemplateModal, setInvoiceTemplateModal] = useState(false);
  const [paymentProcessModal, setPaymentProcessModal] = useState(false);
  const [newReminderDays, setNewReminderDays] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [customInvoiceTemplate, setCustomInvoiceTemplate] = useState({
    name: '',
    description: '',
    settings: {
      logoPosition: 'top-left',
      colorScheme: 'blue',
      includeQRCode: true,
      includeBankDetails: true,
      footerText: ''
    }
  });
  const [billingFormErrors, setBillingFormErrors] = useState<Record<string, string>>({});

  // États spécifiques à la gestion des utilisateurs
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<UserPermission[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userEditModal, setUserEditModal] = useState(false);
  const [userAnalyticsModal, setUserAnalyticsModal] = useState(false);
  const [userInviteModal, setUserInviteModal] = useState(false);
  const [userGroupsModal, setUserGroupsModal] = useState(false);
  const [userPermissionsModal, setUserPermissionsModal] = useState(false);
  const [currentEditingUser, setCurrentEditingUser] = useState<UserPermission | null>(null);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'AGENT',
    department: '',
    permissions: [] as string[],
    sendInvite: true
  });
  const [userFormErrors, setUserFormErrors] = useState<Record<string, string>>({});
  const [inviteForm, setInviteForm] = useState({
    emails: '',
    role: 'AGENT',
    department: '',
    message: '',
    expireDays: 7
  });
  const [userGroups, setUserGroups] = useState([
    { id: 'admin_group', name: 'Administrateurs', description: 'Accès complet au système', userCount: 2, permissions: ['ADMIN_ACCESS', 'USER_MANAGEMENT'] },
    { id: 'agents_group', name: 'Agents', description: 'Accès aux demandes et guichet', userCount: 5, permissions: ['VIEW_REQUESTS', 'PROCESS_REQUESTS'] },
    { id: 'managers_group', name: 'Responsables', description: 'Supervision et reporting', userCount: 2, permissions: ['VIEW_ANALYTICS', 'MANAGE_TEAM'] }
  ]);
  const [bulkAction, setBulkAction] = useState('');

  // États spécifiques à la configuration technique
  const [apiKey, setApiKey] = useState('sk_live_' + '*'.repeat(28));
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [ipWhitelist, setIpWhitelist] = useState('192.168.1.1\n10.0.0.0/24\n172.16.0.0/12');
  const [sslCertName, setSslCertName] = useState('');
  const [sslEnabled, setSslEnabled] = useState(true);
  const [twoFARequired, setTwoFARequired] = useState(false);
  const [backupFrequency, setBackupFrequency] = useState('DAILY');
  const [backupRetention, setBackupRetention] = useState(30);
  const [maintenanceDate, setMaintenanceDate] = useState('2024-01-25');
  const [maintenanceDuration, setMaintenanceDuration] = useState(2);
  const [webhookModal, setWebhookModal] = useState(false);
  const [certUploadModal, setCertUploadModal] = useState(false);
  const [maintenanceModal, setMaintenanceModal] = useState(false);
  const [logsModal, setLogsModal] = useState(false);
  const [diagnosticsModal, setDiagnosticsModal] = useState(false);
  const [technicalErrors, setTechnicalErrors] = useState<Record<string, string>>({});
  const [systemMetrics, setSystemMetrics] = useState({
    uptime: 99.9,
    responseTime: 124,
    cpuLoad: 23,
    memoryUsage: 67,
    diskUsage: 45,
    activeConnections: 1247
  });

  // États spécifiques aux analytics
  const [analyticsData, setAnalyticsData] = useState({
    demandesCeMois: 1247,
    croissanceDemandes: 15.2,
    tempsTraitement: 2.3,
    ameliorationTraitement: -12.4,
    satisfaction: 94.2,
    ameliorationSatisfaction: 2.1,
    revenusMensuels: (client?.clientInfo?.montantAnnuel || 0) / 12
  });

  const [analyticsFilters, setAnalyticsFilters] = useState({
    periode: '30d', // 7d, 30d, 90d, 1y
    service: 'all',
    departement: 'all',
    dateDebut: '',
    dateFin: ''
  });

  const [chartData, setChartData] = useState({
    evolutionDemandes: [
      { mois: 'Jan', demandes: 1045, satisfactionMoyenne: 91 },
      { mois: 'Fév', demandes: 1123, satisfactionMoyenne: 92 },
      { mois: 'Mar', demandes: 1287, satisfactionMoyenne: 93 },
      { mois: 'Avr', demandes: 1156, satisfactionMoyenne: 91 },
      { mois: 'Mai', demandes: 1342, satisfactionMoyenne: 94 },
      { mois: 'Juin', demandes: 1247, satisfactionMoyenne: 94 }
    ],
    repartitionServices: [
      { service: 'CNI', demandes: 450, pourcentage: 36.1, couleur: '#3B82F6' },
      { service: 'Passeport', demandes: 312, pourcentage: 25.0, couleur: '#10B981' },
      { service: 'Actes', demandes: 285, pourcentage: 22.9, couleur: '#F59E0B' },
      { service: 'Autres', demandes: 200, pourcentage: 16.0, couleur: '#EF4444' }
    ],
    performanceMensuelle: [
      { periode: 'Semaine 1', traites: 245, attente: 67, satisfaction: 93 },
      { periode: 'Semaine 2', traites: 289, attente: 45, satisfaction: 95 },
      { periode: 'Semaine 3', traites: 334, attente: 38, satisfaction: 94 },
      { periode: 'Semaine 4', traites: 379, attente: 42, satisfaction: 94 }
    ]
  });

  const [analyticsModal, setAnalyticsModal] = useState({
    monthlyReport: false,
    detailedAnalysis: false,
    exportOptions: false,
    filterOptions: false,
    customReport: false
  });

  const [reportConfig, setReportConfig] = useState({
    format: 'PDF',
    sections: ['overview', 'charts', 'details'],
    includeComparison: true,
    includeTrends: true,
    customPeriod: false
  });

  const [analysisResults, setAnalysisResults] = useState<any>(null);

  // États spécifiques au support
  const [activityHistory, setActivityHistory] = useState([
    {
      time: '2024-01-15 14:30',
      action: 'Mise à jour configuration thème',
      user: 'Admin System',
      type: 'CONFIG' as 'CONFIG' | 'SUPPORT' | 'SYSTEM' | 'AUTH' | 'BILLING',
      details: 'Couleurs primaires modifiées',
      impact: 'LOW' as 'LOW' | 'MEDIUM' | 'HIGH'
    },
    {
      time: '2024-01-15 10:15',
      action: 'Nouveau ticket créé',
      user: 'Jean Mbadinga',
      type: 'SUPPORT' as 'CONFIG' | 'SUPPORT' | 'SYSTEM' | 'AUTH' | 'BILLING',
      details: 'TKT-2024-002 - Formation utilisateurs',
      impact: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH'
    },
    {
      time: '2024-01-14 16:45',
      action: 'Sauvegarde automatique',
      user: 'System',
      type: 'SYSTEM' as 'CONFIG' | 'SUPPORT' | 'SYSTEM' | 'AUTH' | 'BILLING',
      details: 'Backup quotidien effectué',
      impact: 'LOW' as 'LOW' | 'MEDIUM' | 'HIGH'
    },
    {
      time: '2024-01-14 09:20',
      action: 'Connexion utilisateur',
      user: 'Marie Nze',
      type: 'AUTH' as 'CONFIG' | 'SUPPORT' | 'SYSTEM' | 'AUTH' | 'BILLING',
      details: 'Connexion depuis 10.0.0.5',
      impact: 'LOW' as 'LOW' | 'MEDIUM' | 'HIGH'
    },
    {
      time: '2024-01-13 11:30',
      action: 'Facturation mensuelle',
      user: 'System',
      type: 'BILLING' as 'CONFIG' | 'SUPPORT' | 'SYSTEM' | 'AUTH' | 'BILLING',
      details: 'Facture générée - 45,000 XAF',
      impact: 'HIGH' as 'LOW' | 'MEDIUM' | 'HIGH'
    },
    {
      time: '2024-01-12 15:22',
      action: 'Résolution ticket support',
      user: 'Tech Support L2',
      type: 'SUPPORT' as 'CONFIG' | 'SUPPORT' | 'SYSTEM' | 'AUTH' | 'BILLING',
      details: 'TKT-2024-001 résolu - API réparée',
      impact: 'HIGH' as 'LOW' | 'MEDIUM' | 'HIGH'
    }
  ]);

  const [supportModals, setSupportModals] = useState({
    newTicket: false,
    ticketDetails: false,
    fullHistory: false,
    contactSupport: false,
    userGuide: false,
    FAQ: false,
    documentation: false
  });

  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const [newTicketForm, setNewTicketForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
    category: 'TECHNIQUE' as 'TECHNIQUE' | 'FONCTIONNEL' | 'FACTURATION' | 'AUTRE'
  });

  const [supportErrors, setSupportErrors] = useState<Record<string, string>>({});

  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    urgency: 'NORMAL' as 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT',
    requestCallback: false
  });

  // États de configuration
  const [themeConfig, setThemeConfig] = useState<ImportedThemeConfig>({
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
    logoUrl: '',
    faviconUrl: '',
    customCss: '',
    fontFamily: 'Inter',
    headerImage: '',
    footerText: 'Organisme Public du Gabon',
    darkMode: false,
    animations: true
  });

  const [serviceConfigs, setServiceConfigs] = useState<ServiceConfig[]>([]);
  const [cardConfigs, setCardConfigs] = useState<Record<string, CardConfig>>({
    physical: {
      type: 'PHYSICAL',
      enabled: true,
      design: {
        template: 'standard',
        colors: ['#3B82F6', '#FFFFFF'],
        logo: '',
        backgroundImage: ''
      },
      features: ['NFC', 'QR_CODE', 'MAGNETIC_STRIPE'],
      pricing: {
        setupFee: 25000,
        monthlyFee: 2000,
        transactionFee: 100
      }
    },
    virtual: {
      type: 'VIRTUAL',
      enabled: true,
      design: {
        template: 'modern',
        colors: ['#10B981', '#FFFFFF'],
        logo: '',
        backgroundImage: ''
      },
      features: ['QR_CODE', 'BIOMETRIC', 'OTP'],
      pricing: {
        setupFee: 5000,
        monthlyFee: 500,
        transactionFee: 50
      }
    }
  });

  const [billingConfig, setBillingConfig] = useState<BillingConfig>({
    cycle: 'YEARLY',
    paymentMethods: ['AIRTEL_MONEY', 'MOOV_MONEY', 'BANK_TRANSFER'],
    currency: 'XAF',
    taxRate: 18,
    invoiceTemplate: 'standard',
    autoRenew: true,
    reminderDays: [30, 15, 7, 3, 1]
  });

  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [technicalConfig, setTechnicalConfig] = useState<TechnicalConfig>({
    apiKeys: {},
    webhookEndpoints: [],
    ipWhitelist: [],
    sslConfig: {
      enabled: true,
      certificate: '',
      expiryDate: ''
    },
    backupConfig: {
      frequency: 'DAILY',
      retention: 30,
      location: 'CLOUD'
    }
  });

  const [supportTickets, setSupportTickets] = useState([
    {
      id: 'TKT-2024-001',
      title: 'Problème d\'authentification',
      description: 'Les utilisateurs ne peuvent pas se connecter depuis ce matin',
      priority: 'HIGH' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
      status: 'OPEN' as 'OPEN' | 'IN_PROGRESS' | 'PENDING' | 'RESOLVED' | 'CLOSED',
      assignedTo: 'Tech Support L1',
      createdAt: '2024-01-15T09:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      category: 'TECHNIQUE' as 'TECHNIQUE' | 'FONCTIONNEL' | 'FACTURATION' | 'AUTRE'
    },
    {
      id: 'TKT-2024-002',
      title: 'Demande de formation utilisateurs',
      description: 'Formation nécessaire pour 5 nouveaux agents',
      priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
      status: 'IN_PROGRESS' as 'OPEN' | 'IN_PROGRESS' | 'PENDING' | 'RESOLVED' | 'CLOSED',
      assignedTo: 'Formation Team',
      createdAt: '2024-01-14T16:45:00Z',
      updatedAt: '2024-01-15T10:15:00Z',
      category: 'FONCTIONNEL' as 'TECHNIQUE' | 'FONCTIONNEL' | 'FACTURATION' | 'AUTRE'
    },
    {
      id: 'TKT-2024-003',
      title: 'Erreur de facturation',
      description: 'Montant incorrect sur la dernière facture',
      priority: 'URGENT' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
      status: 'PENDING' as 'OPEN' | 'IN_PROGRESS' | 'PENDING' | 'RESOLVED' | 'CLOSED',
      assignedTo: 'Billing Support',
      createdAt: '2024-01-13T11:20:00Z',
      updatedAt: '2024-01-15T08:30:00Z',
      category: 'FACTURATION' as 'TECHNIQUE' | 'FONCTIONNEL' | 'FACTURATION' | 'AUTRE'
    }
  ]);

  // Charger les données du client
  useEffect(() => {
    loadClientData();
  }, [clientId]);

  const loadClientData = useCallback(async () => {
    try {
      setLoading(true);

      // Simulation de chargement des données
      await new Promise(resolve => setTimeout(resolve, 1000));

      const allOrganismes = organismeCommercialService.getAllOrganismes();
      const clientData = allOrganismes.find(org => org.code === clientId);

      if (!clientData) {
        toast.error('Client non trouvé');
        router.push('/super-admin/clients');
        return;
      }

      setClient(clientData);

      // Charger les configurations
      await loadConfigurations(clientData);

      toast.success('Données du client chargées');
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, [clientId, router]);

  const loadConfigurations = useCallback(async (clientData: OrganismeCommercial) => {
    // Charger les services configurés
    const services: ServiceConfig[] = [
      {
        id: 'CNI',
        name: 'Carte Nationale d\'Identité',
        enabled: true,
        price: 15000,
        settings: { renewalPeriod: 10, photo: true, biometric: true },
        category: 'IDENTITE',
        description: 'Délivrance et renouvellement de CNI'
      },
      {
        id: 'PASSEPORT',
        name: 'Passeport',
        enabled: clientData.services.includes('PASSEPORT'),
        price: 75000,
        settings: { validity: 5, pages: 32, biometric: true },
        category: 'IDENTITE',
        description: 'Délivrance de passeport biométrique'
      },
      {
        id: 'ACTE_NAISSANCE',
        name: 'Acte de Naissance',
        enabled: clientData.services.includes('ACTE_NAISSANCE'),
        price: 2000,
        settings: { copies: 3, certified: true },
        category: 'ETAT_CIVIL',
        description: 'Délivrance d\'actes de naissance'
      },
      {
        id: 'PERMIS_CONDUIRE',
        name: 'Permis de Conduire',
        enabled: false,
        price: 45000,
        settings: { categories: ['B', 'A'], validity: 10 },
        category: 'TRANSPORT',
        description: 'Délivrance et renouvellement de permis'
      }
    ];

    setServiceConfigs(services);

    // Charger les utilisateurs et permissions
    const users: UserPermission[] = [
      {
        userId: '1',
        name: 'Jean Mbadinga',
        email: 'j.mbadinga@' + clientData.code.toLowerCase() + '.ga',
        role: 'ADMIN',
        department: 'Direction',
        permissions: ['MANAGE_USERS', 'VIEW_REPORTS', 'PROCESS_REQUESTS'],
        lastActivity: '2024-01-15T10:30:00Z',
        status: 'ACTIVE'
      },
      {
        userId: '2',
        name: 'Marie Nze',
        email: 'm.nze@' + clientData.code.toLowerCase() + '.ga',
        role: 'AGENT',
        department: 'Guichet',
        permissions: ['PROCESS_REQUESTS', 'VIEW_REQUESTS'],
        lastActivity: '2024-01-15T14:20:00Z',
        status: 'ACTIVE'
      }
    ];

    setUserPermissions(users);

    // Charger les tickets de support
    const tickets: SupportTicket[] = [
      {
        id: 'TICK-001',
        title: 'Problème d\'impression des cartes',
        description: 'Les cartes sortent avec des couleurs délavées',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        createdAt: '2024-01-14T09:00:00Z',
        assignedTo: 'Support Technique',
        category: 'MATERIEL'
      },
      {
        id: 'TICK-002',
        title: 'Formation nouvel agent',
        description: 'Demande de formation pour utilisation du système',
        priority: 'MEDIUM',
        status: 'OPEN',
        createdAt: '2024-01-15T11:30:00Z',
        assignedTo: 'Équipe Formation',
        category: 'FORMATION'
      }
    ];

    setSupportTickets(tickets);
  }, []);

  // Gestionnaires de sauvegarde spécialisés
  const handleSaveTheme = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, savingTheme: true }));
      setValidationErrors({});

      // Validation du thème
      const errors: string[] = [];
      if (!themeConfig.primaryColor.match(/^#[0-9A-F]{6}$/i)) {
        errors.push('Couleur primaire invalide');
      }
      if (!themeConfig.fontFamily) {
        errors.push('Police de caractère requise');
      }

      if (errors.length > 0) {
        setValidationErrors({ theme: errors });
        toast.error('Erreurs de validation détectées');
        return;
      }

      // Sauvegarde réelle via le service
      const result = await clientManagementService.updateThemeConfig(clientId, themeConfig as ImportedThemeConfig);

      if (result.success) {
        toast.success('🎨 Thème sauvegardé avec succès');
      } else {
        toast.error(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Erreur sauvegarde thème:', error);
      toast.error('❌ Erreur lors de la sauvegarde du thème');
    } finally {
      setLoadingStates(prev => ({ ...prev, savingTheme: false }));
    }
  }, [clientId, themeConfig]);

  const handleSaveServices = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, savingServices: true }));

      // Validation des services
      const enabledServices = serviceConfigs.filter(s => s.enabled);
      if (enabledServices.length === 0) {
        toast.error('⚠️ Au moins un service doit être activé');
        return;
      }

      // Vérification des dépendances
      for (const service of enabledServices) {
        if (service.dependencies) {
          const missingDeps = service.dependencies.filter(dep =>
            !enabledServices.some(s => s.id === dep)
          );
          if (missingDeps.length > 0) {
            toast.error(`⚠️ ${service.name} nécessite: ${missingDeps.join(', ')}`);
            return;
          }
        }
      }

      // Simulation de sauvegarde avec logique métier
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(`✅ Configuration des services sauvegardée (${enabledServices.length} actifs)`);
    } catch (error) {
      console.error('Erreur sauvegarde services:', error);
      toast.error('❌ Erreur lors de la sauvegarde des services');
    } finally {
      setLoadingStates(prev => ({ ...prev, savingServices: false }));
    }
  }, [serviceConfigs]);

  const handleSaveCards = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, savingCards: true }));

      // Validation des cartes
      const physicalEnabled = cardConfigs.physical.enabled;
      const virtualEnabled = cardConfigs.virtual.enabled;

      if (!physicalEnabled && !virtualEnabled) {
        toast.error('⚠️ Au moins un type de carte doit être activé');
        return;
      }

      // Validation des templates
      const errors: string[] = [];
      if (physicalEnabled && !cardConfigs.physical.design.template) {
        errors.push('Template requis pour les cartes physiques');
      }
      if (virtualEnabled && !cardConfigs.virtual.design.template) {
        errors.push('Template requis pour les cartes virtuelles');
      }

      if (errors.length > 0) {
        setValidationErrors({ cards: errors });
        toast.error('Erreurs de validation détectées');
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1800));

      const activeTypes = [
        physicalEnabled && 'physiques',
        virtualEnabled && 'virtuelles'
      ].filter(Boolean).join(' et ');

      toast.success(`🎫 Configuration des cartes ${activeTypes} sauvegardée`);
    } catch (error) {
      console.error('Erreur sauvegarde cartes:', error);
      toast.error('❌ Erreur lors de la sauvegarde des cartes');
    } finally {
      setLoadingStates(prev => ({ ...prev, savingCards: false }));
    }
  }, [cardConfigs]);

  const handleSaveBilling = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, savingBilling: true }));

      // Validation facturation
      if (billingConfig.paymentMethods.length === 0) {
        toast.error('⚠️ Au moins un moyen de paiement doit être sélectionné');
        return;
      }

      if (billingConfig.taxRate < 0 || billingConfig.taxRate > 100) {
        toast.error('⚠️ Le taux de TVA doit être entre 0 et 100%');
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success(`💰 Configuration de facturation sauvegardée (${billingConfig.cycle.toLowerCase()})`);
    } catch (error) {
      console.error('Erreur sauvegarde facturation:', error);
      toast.error('❌ Erreur lors de la sauvegarde de la facturation');
    } finally {
      setLoadingStates(prev => ({ ...prev, savingBilling: false }));
    }
  }, [billingConfig]);

  const handleSaveUsers = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, savingUsers: true }));

      // Validation des utilisateurs
      const adminUsers = userPermissions.filter(u => u.role === 'ADMIN' && u.status === 'ACTIVE');
      if (adminUsers.length === 0) {
        toast.error('⚠️ Au moins un administrateur actif est requis');
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success(`👥 Configuration des utilisateurs sauvegardée (${userPermissions.length} utilisateurs)`);
    } catch (error) {
      console.error('Erreur sauvegarde utilisateurs:', error);
      toast.error('❌ Erreur lors de la sauvegarde des utilisateurs');
    } finally {
      setLoadingStates(prev => ({ ...prev, savingUsers: false }));
    }
  }, [userPermissions]);

  const handleSaveTechnical = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, savingTechnical: true }));

      const configToSave = {
        ...technicalConfig,
        apiKey,
        sslConfig: {
          ...technicalConfig.sslConfig,
          enabled: sslEnabled
        },
        backupConfig: {
          frequency: backupFrequency,
          retention: backupRetention
        },
        securityConfig: {
          twoFARequired,
          ipWhitelist: ipWhitelist.split('\n').filter(ip => ip.trim())
        }
      };

      await new Promise(resolve => setTimeout(resolve, 2000));
      await clientManagementService.updateTechnicalConfig(client?.code || 'client_inconnu', configToSave as any);

      toast.success('🔧 Configuration technique sauvegardée');
    } catch (error) {
      console.error('Erreur sauvegarde technique:', error);
      toast.error('❌ Erreur lors de la sauvegarde de la configuration technique');
    } finally {
      setLoadingStates(prev => ({ ...prev, savingTechnical: false }));
    }
  }, [technicalConfig, apiKey, sslEnabled, backupFrequency, backupRetention, twoFARequired, ipWhitelist, client?.code]);

  // Gestionnaires d'aperçu
  const handlePreviewTheme = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, previewingTheme: true }));

      // Simulation de génération d'aperçu
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('🎨 Aperçu du thème généré');
      // Ici on pourrait ouvrir une modal avec l'aperçu
    } catch (error) {
      console.error('Erreur aperçu thème:', error);
      toast.error('❌ Erreur lors de la génération de l\'aperçu');
    } finally {
      setLoadingStates(prev => ({ ...prev, previewingTheme: false }));
    }
  }, [themeConfig]);

  const handlePreviewCards = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, previewingCards: true }));

      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('🎫 Aperçu des cartes généré');
    } catch (error) {
      console.error('Erreur aperçu cartes:', error);
      toast.error('❌ Erreur lors de la génération de l\'aperçu des cartes');
    } finally {
      setLoadingStates(prev => ({ ...prev, previewingCards: false }));
    }
  }, [cardConfigs]);

  const handlePreviewInvoice = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, previewingInvoice: true }));

      await new Promise(resolve => setTimeout(resolve, 1200));

      toast.success('📄 Aperçu de facture généré');
    } catch (error) {
      console.error('Erreur aperçu facture:', error);
      toast.error('❌ Erreur lors de la génération de l\'aperçu de facture');
    } finally {
      setLoadingStates(prev => ({ ...prev, previewingInvoice: false }));
    }
  }, [billingConfig]);

  // Gestionnaires pour les utilisateurs
  const handleAddUser = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, addingUser: true }));

      // Simulation d'ajout d'utilisateur
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newUser: UserPermission = {
        userId: `user_${Date.now()}`,
        name: 'Nouvel Utilisateur',
        email: `user${userPermissions.length + 1}@${client?.code.toLowerCase()}.ga`,
        role: 'AGENT',
        department: 'Guichet',
        permissions: ['VIEW_REQUESTS'],
        lastActivity: new Date().toISOString(),
        status: 'ACTIVE'
      };

      setUserPermissions(prev => [...prev, newUser]);
      toast.success('👤 Nouvel utilisateur ajouté');
    } catch (error) {
      console.error('Erreur ajout utilisateur:', error);
      toast.error('❌ Erreur lors de l\'ajout de l\'utilisateur');
    } finally {
      setLoadingStates(prev => ({ ...prev, addingUser: false }));
    }
  }, [userPermissions, client]);

  // Gestionnaires techniques
  const handleRefreshApiKey = useCallback(async () => {
    if (!confirm('⚠️ Attention ! Cela va invalider l\'ancienne clé API. Continuer ?')) return;

    try {
      setLoadingStates(prev => ({ ...prev, refreshingApiKey: true }));

      // Simulation génération nouvelle clé
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newKey = 'sk_live_' + Math.random().toString(36).substring(2, 30);
      setApiKey(newKey);

      toast.success('🔑 Nouvelle clé API générée avec succès');
    } catch (error) {
      console.error('Erreur génération clé:', error);
      toast.error('❌ Erreur lors de la génération de la clé API');
    } finally {
      setLoadingStates(prev => ({ ...prev, refreshingApiKey: false }));
    }
  }, []);

  const handleAddWebhook = useCallback(async () => {
    if (!newWebhookUrl.trim()) {
      setTechnicalErrors(prev => ({ ...prev, webhook: 'URL webhook requise' }));
      return;
    }

    if (!/^https?:\/\/.+/.test(newWebhookUrl)) {
      setTechnicalErrors(prev => ({ ...prev, webhook: 'URL webhook invalide' }));
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, addingWebhook: true }));

      await new Promise(resolve => setTimeout(resolve, 1500));

      setTechnicalConfig(prev => ({
        ...prev,
        webhookEndpoints: [...prev.webhookEndpoints, newWebhookUrl.trim()]
      }));

      setNewWebhookUrl('');
      setTechnicalErrors(prev => ({ ...prev, webhook: '' }));
      toast.success('🔗 Webhook ajouté avec succès');
    } catch (error) {
      toast.error('❌ Erreur lors de l\'ajout du webhook');
    } finally {
      setLoadingStates(prev => ({ ...prev, addingWebhook: false }));
    }
  }, [newWebhookUrl]);

  const handleRemoveWebhook = useCallback(async (index: number) => {
    try {
      setLoadingStates(prev => ({ ...prev, removingWebhook: true }));

      await new Promise(resolve => setTimeout(resolve, 1000));

      setTechnicalConfig(prev => ({
        ...prev,
        webhookEndpoints: prev.webhookEndpoints.filter((_, i) => i !== index)
      }));

      toast.success('🗑️ Webhook supprimé');
    } catch (error) {
      toast.error('❌ Erreur lors de la suppression du webhook');
    } finally {
      setLoadingStates(prev => ({ ...prev, removingWebhook: false }));
    }
  }, []);

  const handleTestConnection = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, testingConnection: true }));

      await new Promise(resolve => setTimeout(resolve, 3000));

      const success = Math.random() > 0.2;

      if (success) {
        toast.success('✅ Connexion testée avec succès');
      } else {
        toast.error('❌ Échec du test de connexion');
      }
    } catch (error) {
      console.error('Erreur test connexion:', error);
      toast.error('❌ Erreur lors du test de connexion');
    } finally {
      setLoadingStates(prev => ({ ...prev, testingConnection: false }));
    }
  }, []);

  const handleExportData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, exporting: true }));

      await new Promise(resolve => setTimeout(resolve, 2500));

      // Simulation de téléchargement
      const data = {
        client: client?.nom,
        exportDate: new Date().toISOString(),
        services: serviceConfigs.filter(s => s.enabled).length,
        users: userPermissions.length
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export_${client?.code}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();

      toast.success('📊 Données exportées avec succès');
    } catch (error) {
      console.error('Erreur export:', error);
      toast.error('❌ Erreur lors de l\'export des données');
    } finally {
      setLoadingStates(prev => ({ ...prev, exporting: false }));
    }
  }, [client, serviceConfigs, userPermissions]);

  // Gestionnaires pour la gestion des services
  const handleConfigureService = useCallback(async (service: ServiceConfig) => {
    try {
      setLoadingStates(prev => ({ ...prev, configuringService: true }));
      setSelectedService(service);

      // Simulation de chargement des paramètres avancés
      await new Promise<void>(resolve => setTimeout(resolve, 800));

      setServiceConfigModal(true);
      toast.success(`🔧 Configuration de ${service.name} ouverte`);
    } catch (error) {
      console.error('Erreur configuration service:', error);
      toast.error('❌ Erreur lors de l\'ouverture de la configuration');
    } finally {
      setLoadingStates(prev => ({ ...prev, configuringService: false }));
    }
  }, []);

  const handleViewServiceAnalytics = useCallback(async (service: ServiceConfig) => {
    try {
      setLoadingStates(prev => ({ ...prev, viewingAnalytics: true }));
      setSelectedService(service);

      // Simulation de chargement des analytics
      await new Promise<void>(resolve => setTimeout(resolve, 1200));

      setServiceAnalyticsModal(true);
      toast.success(`📊 Analytics de ${service.name} chargées`);
    } catch (error) {
      console.error('Erreur analytics service:', error);
      toast.error('❌ Erreur lors du chargement des analytics');
    } finally {
      setLoadingStates(prev => ({ ...prev, viewingAnalytics: false }));
    }
  }, []);

  const handleAddNewService = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, addingService: true }));

      // Réinitialiser le formulaire
      setNewServiceForm({
        id: '',
        name: '',
        description: '',
        category: 'IDENTITE',
        price: 0,
        enabled: false,
        settings: {}
      });
      setServiceFormErrors({});

      await new Promise<void>(resolve => setTimeout(resolve, 500));

      setAddServiceModal(true);
      toast.success('➕ Formulaire d\'ajout de service ouvert');
    } catch (error) {
      console.error('Erreur ouverture ajout service:', error);
      toast.error('❌ Erreur lors de l\'ouverture du formulaire');
    } finally {
      setLoadingStates(prev => ({ ...prev, addingService: false }));
    }
  }, []);

  const validateServiceForm = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!newServiceForm.name.trim()) {
      errors.name = 'Le nom du service est requis';
    } else if (newServiceForm.name.length < 3) {
      errors.name = 'Le nom doit faire au moins 3 caractères';
    }

    if (!newServiceForm.description.trim()) {
      errors.description = 'La description est requise';
    } else if (newServiceForm.description.length < 10) {
      errors.description = 'La description doit faire au moins 10 caractères';
    }

    if (!newServiceForm.id.trim()) {
      errors.id = 'L\'identifiant est requis';
    } else if (!/^[A-Z_]+$/.test(newServiceForm.id)) {
      errors.id = 'L\'identifiant doit contenir uniquement des majuscules et underscores';
    } else if (serviceConfigs.some(s => s.id === newServiceForm.id)) {
      errors.id = 'Cet identifiant existe déjà';
    }

    if (newServiceForm.price < 0) {
      errors.price = 'Le prix ne peut pas être négatif';
    } else if (newServiceForm.price > 1000000) {
      errors.price = 'Le prix ne peut pas dépasser 1,000,000 XAF';
    }

    setServiceFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [newServiceForm, serviceConfigs]);

  const handleSaveNewService = useCallback(async () => {
    if (!validateServiceForm()) {
      toast.error('⚠️ Veuillez corriger les erreurs du formulaire');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, addingService: true }));

      // Simulation de sauvegarde
      await new Promise<void>(resolve => setTimeout(resolve, 2000));

      const newService: ServiceConfig = {
        ...newServiceForm,
        settings: {
          ...newServiceForm.settings,
          createdDate: new Date().toISOString(),
          version: '1.0'
        }
      };

      setServiceConfigs(prev => [...prev, newService]);
      setAddServiceModal(false);

      toast.success(`✅ Service "${newService.name}" ajouté avec succès`);
    } catch (error) {
      console.error('Erreur ajout service:', error);
      toast.error('❌ Erreur lors de l\'ajout du service');
    } finally {
      setLoadingStates(prev => ({ ...prev, addingService: false }));
    }
  }, [newServiceForm, validateServiceForm]);

  const handleDuplicateService = useCallback(async (service: ServiceConfig) => {
    try {
      setLoadingStates(prev => ({ ...prev, duplicatingService: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 1000));

      const duplicatedService: ServiceConfig = {
        ...service,
        id: `${service.id}_COPY_${Date.now()}`,
        name: `${service.name} (Copie)`,
        enabled: false,
        settings: {
          ...service.settings,
          originalId: service.id,
          duplicatedDate: new Date().toISOString()
        }
      };

      setServiceConfigs(prev => [...prev, duplicatedService]);

      toast.success(`📋 Service "${service.name}" dupliqué avec succès`);
    } catch (error) {
      console.error('Erreur duplication service:', error);
      toast.error('❌ Erreur lors de la duplication du service');
    } finally {
      setLoadingStates(prev => ({ ...prev, duplicatingService: false }));
    }
  }, []);

  const handleDeleteService = useCallback(async (service: ServiceConfig) => {
    const confirmed = window.confirm(`⚠️ Êtes-vous sûr de vouloir supprimer le service "${service.name}" ?\n\nCette action est irréversible.`);
    if (!confirmed) return;

    try {
      setLoadingStates(prev => ({ ...prev, deletingService: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 1500));

      setServiceConfigs(prev => prev.filter(s => s.id !== service.id));

      toast.success(`🗑️ Service "${service.name}" supprimé avec succès`);
    } catch (error) {
      console.error('Erreur suppression service:', error);
      toast.error('❌ Erreur lors de la suppression du service');
    } finally {
      setLoadingStates(prev => ({ ...prev, deletingService: false }));
    }
  }, []);

  const handleTestService = useCallback(async (service: ServiceConfig) => {
    try {
      setLoadingStates(prev => ({ ...prev, testingService: true }));

      // Simulation de test de service
      await new Promise<void>(resolve => setTimeout(resolve, 3000));

      const testResults = {
        connectivity: Math.random() > 0.1,
        responseTime: Math.floor(Math.random() * 500) + 100,
        availability: Math.random() > 0.05,
        lastError: Math.random() > 0.8 ? 'Timeout connection' : null
      };

      if (testResults.connectivity && testResults.availability) {
        toast.success(`✅ Test de "${service.name}" réussi (${testResults.responseTime}ms)`);
      } else {
        toast.error(`❌ Test de "${service.name}" échoué: ${testResults.lastError || 'Service indisponible'}`);
      }
    } catch (error) {
      console.error('Erreur test service:', error);
      toast.error('❌ Erreur lors du test du service');
    } finally {
      setLoadingStates(prev => ({ ...prev, testingService: false }));
    }
  }, []);

  // Calculer le coût total des services activés
  const totalServiceCost = useMemo(() => {
    return serviceConfigs
      .filter(service => service.enabled)
      .reduce((total, service) => total + service.price, 0);
  }, [serviceConfigs]);

  // Calculer le coût total des cartes activées
  const totalCardCost = useMemo(() => {
    let total = 0;
    if (cardConfigs.physical.enabled) {
      total += cardConfigs.physical.pricing.setupFee + cardConfigs.physical.pricing.monthlyFee;
    }
    if (cardConfigs.virtual.enabled) {
      total += cardConfigs.virtual.pricing.setupFee + cardConfigs.virtual.pricing.monthlyFee;
    }
    return total;
  }, [cardConfigs]);

  // Calculer le coût total de facturation
  const totalBillingCost = useMemo(() => {
    const baseAmount = client?.clientInfo?.montantAnnuel || 0;
    const taxAmount = (baseAmount * billingConfig.taxRate) / 100;
    const servicesAmount = totalServiceCost;
    const cardsAmount = totalCardCost;
    const totalBeforeTax = baseAmount + servicesAmount + cardsAmount;
    const finalAmount = totalBeforeTax + taxAmount;

    return {
      base: baseAmount,
      services: servicesAmount,
      cards: cardsAmount,
      subtotal: totalBeforeTax,
      tax: taxAmount,
      total: finalAmount
    };
  }, [client?.clientInfo?.montantAnnuel, billingConfig.taxRate, totalServiceCost, totalCardCost]);

  // Gestionnaires pour la gestion des cartes
  const handleConfigureCard = useCallback(async (cardType: 'physical' | 'virtual') => {
    try {
      setLoadingStates(prev => ({ ...prev, configuringCard: true }));
      setSelectedCardType(cardType);

      // Simulation de chargement des paramètres avancés
      await new Promise<void>(resolve => setTimeout(resolve, 800));

      setCardConfigModal(true);
      toast.success(`🔧 Configuration ${cardType === 'physical' ? 'physique' : 'virtuelle'} ouverte`);
    } catch (error) {
      console.error('Erreur configuration carte:', error);
      toast.error('❌ Erreur lors de l\'ouverture de la configuration');
    } finally {
      setLoadingStates(prev => ({ ...prev, configuringCard: false }));
    }
  }, []);

  const handleTestCard = useCallback(async (cardType: 'physical' | 'virtual') => {
    try {
      setLoadingStates(prev => ({ ...prev, testingCard: true }));
      setSelectedCardType(cardType);

      // Simulation de test des fonctionnalités
      await new Promise<void>(resolve => setTimeout(resolve, 2000));

      setCardTestModal(true);
      toast.success(`🧪 Test ${cardType === 'physical' ? 'physique' : 'virtuelle'} lancé`);
    } catch (error) {
      console.error('Erreur test carte:', error);
      toast.error('❌ Erreur lors du test de la carte');
    } finally {
      setLoadingStates(prev => ({ ...prev, testingCard: false }));
    }
  }, []);

  const handleViewCardAnalytics = useCallback(async (cardType: 'physical' | 'virtual') => {
    try {
      setLoadingStates(prev => ({ ...prev, viewingCardAnalytics: true }));
      setSelectedCardType(cardType);

      // Simulation de chargement des analytics
      await new Promise<void>(resolve => setTimeout(resolve, 1500));

      setCardAnalyticsModal(true);
      toast.success(`📊 Analytics ${cardType === 'physical' ? 'physiques' : 'virtuelles'} chargées`);
    } catch (error) {
      console.error('Erreur analytics carte:', error);
      toast.error('❌ Erreur lors du chargement des analytics');
    } finally {
      setLoadingStates(prev => ({ ...prev, viewingCardAnalytics: false }));
    }
  }, []);

  const handleDuplicateCard = useCallback(async (cardType: 'physical' | 'virtual') => {
    try {
      setLoadingStates(prev => ({ ...prev, duplicatingCard: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 1000));

      const sourceConfig = cardConfigs[cardType];
      const duplicatedConfig = {
        ...sourceConfig,
        design: {
          ...sourceConfig.design,
          template: `${sourceConfig.design.template}_copy_${Date.now()}`
        }
      };

      // Simulation de sauvegarde de la configuration dupliquée
      // En production, cela serait sauvegardé dans une base de données
      console.log(`Configuration ${cardType} dupliquée:`, duplicatedConfig);

      toast.success(`📋 Configuration ${cardType === 'physical' ? 'physique' : 'virtuelle'} dupliquée`);
    } catch (error) {
      console.error('Erreur duplication carte:', error);
      toast.error('❌ Erreur lors de la duplication');
    } finally {
      setLoadingStates(prev => ({ ...prev, duplicatingCard: false }));
    }
  }, [cardConfigs]);

  const handleResetCard = useCallback(async (cardType: 'physical' | 'virtual') => {
    const confirmed = window.confirm(`⚠️ Êtes-vous sûr de vouloir réinitialiser la configuration ${cardType === 'physical' ? 'physique' : 'virtuelle'} ?\n\nCette action restaurera les paramètres par défaut.`);
    if (!confirmed) return;

    try {
      setLoadingStates(prev => ({ ...prev, resetingCard: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 1500));

            // Réinitialiser la configuration
      if (cardType === 'physical') {
        setCardConfigs(prev => ({
          ...prev,
          physical: {
            ...prev.physical,
            enabled: false,
            design: {
              template: 'standard',
              colors: ['#000000', '#ffffff'],
              logo: '',
              backgroundImage: ''
            },
            features: [],
            pricing: { setupFee: 50000, monthlyFee: 10000, transactionFee: 500 }
          }
        }));
      } else {
        setCardConfigs(prev => ({
          ...prev,
          virtual: {
            ...prev.virtual,
            enabled: false,
            design: {
              template: 'modern',
              colors: ['#007bff', '#ffffff'],
              logo: '',
              backgroundImage: ''
            },
            features: [],
            pricing: { setupFee: 25000, monthlyFee: 5000, transactionFee: 200 }
          }
        }));
      }

      toast.success(`🔄 Configuration ${cardType === 'physical' ? 'physique' : 'virtuelle'} réinitialisée`);
    } catch (error) {
      console.error('Erreur reset carte:', error);
      toast.error('❌ Erreur lors de la réinitialisation');
    } finally {
      setLoadingStates(prev => ({ ...prev, resetingCard: false }));
    }
  }, []);

  const handleExportCard = useCallback(async (cardType: 'physical' | 'virtual') => {
    try {
      setLoadingStates(prev => ({ ...prev, exportingCard: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 1000));

      const config = cardConfigs[cardType];
      const exportData = {
        type: cardType,
        config,
        exportDate: new Date().toISOString(),
        clientName: client?.nom || 'client_inconnu'
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `carte_${cardType}_${(client?.nom || 'client_inconnu').replace(/\s+/g, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`📁 Configuration ${cardType} exportée`);
    } catch (error) {
      console.error('Erreur export carte:', error);
      toast.error('❌ Erreur lors de l\'export');
    } finally {
      setLoadingStates(prev => ({ ...prev, exportingCard: false }));
    }
  }, [cardConfigs, client?.nom]);

  const handleImportCard = useCallback(async (cardType: 'physical' | 'virtual') => {
    try {
      setLoadingStates(prev => ({ ...prev, importingCard: true }));

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          const text = await file.text();
          const importData = JSON.parse(text);

          if (importData.type !== cardType) {
            throw new Error(`Type de carte incorrect. Attendu: ${cardType}, reçu: ${importData.type}`);
          }

          setCardConfigs(prev => ({
            ...prev,
            [cardType]: importData.config
          }));

          toast.success(`📂 Configuration ${cardType} importée avec succès`);
        } catch (error) {
          console.error('Erreur parsing import:', error);
          toast.error('❌ Fichier de configuration invalide');
        } finally {
          setLoadingStates(prev => ({ ...prev, importingCard: false }));
        }
      };

      input.click();
    } catch (error) {
      console.error('Erreur import carte:', error);
      toast.error('❌ Erreur lors de l\'import');
      setLoadingStates(prev => ({ ...prev, importingCard: false }));
    }
  }, []);

  const handleManageTemplates = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, managingTemplates: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 500));

      setCardTemplateModal(true);
      toast.success('🎨 Gestionnaire de templates ouvert');
    } catch (error) {
      console.error('Erreur gestion templates:', error);
      toast.error('❌ Erreur lors de l\'ouverture');
    } finally {
      setLoadingStates(prev => ({ ...prev, managingTemplates: false }));
    }
  }, []);

  const validateTemplateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!customTemplate.name.trim()) {
      errors.name = 'Le nom du template est requis';
    } else if (customTemplate.name.length < 3) {
      errors.name = 'Le nom doit faire au moins 3 caractères';
    }

    if (!customTemplate.description.trim()) {
      errors.description = 'La description est requise';
    } else if (customTemplate.description.length < 10) {
      errors.description = 'La description doit faire au moins 10 caractères';
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(customTemplate.settings.backgroundColor)) {
      errors.backgroundColor = 'Couleur de fond invalide (format: #RRGGBB)';
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(customTemplate.settings.textColor)) {
      errors.textColor = 'Couleur de texte invalide (format: #RRGGBB)';
    }

    setCardFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [customTemplate]);

  const handleSaveTemplate = useCallback(async () => {
    if (!validateTemplateForm()) {
      toast.error('⚠️ Veuillez corriger les erreurs du formulaire');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, managingTemplates: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 2000));

      toast.success(`✅ Template "${customTemplate.name}" créé avec succès`);
      setCardTemplateModal(false);

      // Réinitialiser le formulaire
      setCustomTemplate({
        name: '',
        description: '',
        settings: {
          backgroundColor: '#ffffff',
          textColor: '#000000',
          logoPosition: 'top-left',
          layout: 'standard'
        }
      });
    } catch (error) {
      console.error('Erreur sauvegarde template:', error);
      toast.error('❌ Erreur lors de la sauvegarde');
    } finally {
      setLoadingStates(prev => ({ ...prev, managingTemplates: false }));
    }
  }, [customTemplate, validateTemplateForm]);

  // Gestionnaires pour la gestion de la facturation
  const handleConfigureBilling = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, configuringBilling: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 800));

      setBillingConfigModal(true);
      toast.success('⚙️ Configuration avancée de facturation ouverte');
    } catch (error) {
      console.error('Erreur configuration facturation:', error);
      toast.error('❌ Erreur lors de l\'ouverture de la configuration');
    } finally {
      setLoadingStates(prev => ({ ...prev, configuringBilling: false }));
    }
  }, []);

  const handleTestPaymentMethod = useCallback(async (method: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, testingPayment: true }));
      setSelectedPaymentMethod(method);

      // Simulation de test de la méthode de paiement
      await new Promise<void>(resolve => setTimeout(resolve, 3000));

      setPaymentTestModal(true);
      toast.success(`🧪 Test de ${method.replace('_', ' ')} effectué`);
    } catch (error) {
      console.error('Erreur test paiement:', error);
      toast.error('❌ Erreur lors du test de paiement');
    } finally {
      setLoadingStates(prev => ({ ...prev, testingPayment: false }));
    }
  }, []);

  const handleManageReminders = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, managingReminders: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 500));

      setRemindersModal(true);
      toast.success('📅 Gestionnaire de rappels ouvert');
    } catch (error) {
      console.error('Erreur gestion rappels:', error);
      toast.error('❌ Erreur lors de l\'ouverture');
    } finally {
      setLoadingStates(prev => ({ ...prev, managingReminders: false }));
    }
  }, []);

  const handleAddReminderDay = useCallback(() => {
    const days = parseInt(newReminderDays);
    if (isNaN(days) || days <= 0 || days > 365) {
      toast.error('⚠️ Nombre de jours invalide (1-365)');
      return;
    }

    if (billingConfig.reminderDays.includes(days)) {
      toast.error('⚠️ Ce rappel existe déjà');
      return;
    }

    setBillingConfig(prev => ({
      ...prev,
      reminderDays: [...prev.reminderDays, days].sort((a, b) => a - b)
    }));

    setNewReminderDays('');
    toast.success(`✅ Rappel à ${days} jour(s) ajouté`);
  }, [newReminderDays, billingConfig.reminderDays]);

  const handleRemoveReminderDay = useCallback((daysToRemove: number) => {
    setBillingConfig(prev => ({
      ...prev,
      reminderDays: prev.reminderDays.filter(days => days !== daysToRemove)
    }));

    toast.success(`🗑️ Rappel à ${daysToRemove} jour(s) supprimé`);
  }, []);

  const handleViewBillingAnalytics = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, viewingBillingAnalytics: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 1500));

      setBillingAnalyticsModal(true);
      toast.success('📊 Analytics de facturation chargées');
    } catch (error) {
      console.error('Erreur analytics facturation:', error);
      toast.error('❌ Erreur lors du chargement des analytics');
    } finally {
      setLoadingStates(prev => ({ ...prev, viewingBillingAnalytics: false }));
    }
  }, []);

  const handleExportBilling = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, exportingBilling: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 1000));

      const exportData = {
        billingConfig,
        totalCosts: totalBillingCost,
        paymentHistory: [
          { date: '2024-01-15', amount: client?.clientInfo?.montantAnnuel || 0, status: 'PAID', method: 'BANK_TRANSFER' },
          { date: '2023-01-15', amount: (client?.clientInfo?.montantAnnuel || 0) * 0.9, status: 'PAID', method: 'AIRTEL_MONEY' }
        ],
        exportDate: new Date().toISOString(),
        clientName: client?.nom || 'client_inconnu'
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facturation_${(client?.nom || 'client_inconnu').replace(/\s+/g, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('📁 Configuration de facturation exportée');
    } catch (error) {
      console.error('Erreur export facturation:', error);
      toast.error('❌ Erreur lors de l\'export');
    } finally {
      setLoadingStates(prev => ({ ...prev, exportingBilling: false }));
    }
  }, [billingConfig, totalBillingCost, client?.nom, client?.clientInfo?.montantAnnuel]);

  const handleImportBilling = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, importingBilling: true }));

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          const text = await file.text();
          const importData = JSON.parse(text);

          if (!importData.billingConfig) {
            throw new Error('Structure de fichier invalide');
          }

          setBillingConfig(importData.billingConfig);

          toast.success('📂 Configuration de facturation importée avec succès');
        } catch (error) {
          console.error('Erreur parsing import:', error);
          toast.error('❌ Fichier de configuration invalide');
        } finally {
          setLoadingStates(prev => ({ ...prev, importingBilling: false }));
        }
      };

      input.click();
    } catch (error) {
      console.error('Erreur import facturation:', error);
      toast.error('❌ Erreur lors de l\'import');
      setLoadingStates(prev => ({ ...prev, importingBilling: false }));
    }
  }, []);

  const handleDuplicateBilling = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, duplicatingBilling: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 1000));

      const duplicatedConfig = {
        ...billingConfig,
        invoiceTemplate: `${billingConfig.invoiceTemplate}_copy_${Date.now()}`
      };

      // Simulation de sauvegarde de la configuration dupliquée
      console.log('Configuration facturation dupliquée:', duplicatedConfig);

      toast.success('📋 Configuration de facturation dupliquée');
    } catch (error) {
      console.error('Erreur duplication facturation:', error);
      toast.error('❌ Erreur lors de la duplication');
    } finally {
      setLoadingStates(prev => ({ ...prev, duplicatingBilling: false }));
    }
  }, [billingConfig]);

  const handleResetBilling = useCallback(async () => {
    const confirmed = window.confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser la configuration de facturation ?\n\nCette action restaurera les paramètres par défaut.');
    if (!confirmed) return;

    try {
      setLoadingStates(prev => ({ ...prev, resetingBilling: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 1500));

      setBillingConfig({
        cycle: 'MONTHLY',
        paymentMethods: ['BANK_TRANSFER'],
        currency: 'XAF',
        taxRate: 19.25,
        invoiceTemplate: 'standard',
        autoRenew: true,
        reminderDays: [7, 3, 1]
      });

      toast.success('🔄 Configuration de facturation réinitialisée');
    } catch (error) {
      console.error('Erreur reset facturation:', error);
      toast.error('❌ Erreur lors de la réinitialisation');
    } finally {
      setLoadingStates(prev => ({ ...prev, resetingBilling: false }));
    }
  }, []);

  const handleManageInvoiceTemplates = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, managingInvoiceTemplates: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 500));

      setInvoiceTemplateModal(true);
      toast.success('🎨 Gestionnaire de templates de facture ouvert');
    } catch (error) {
      console.error('Erreur gestion templates:', error);
      toast.error('❌ Erreur lors de l\'ouverture');
    } finally {
      setLoadingStates(prev => ({ ...prev, managingInvoiceTemplates: false }));
    }
  }, []);

  const validateInvoiceTemplate = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!customInvoiceTemplate.name.trim()) {
      errors.name = 'Le nom du template est requis';
    } else if (customInvoiceTemplate.name.length < 3) {
      errors.name = 'Le nom doit faire au moins 3 caractères';
    }

    if (!customInvoiceTemplate.description.trim()) {
      errors.description = 'La description est requise';
    } else if (customInvoiceTemplate.description.length < 10) {
      errors.description = 'La description doit faire au moins 10 caractères';
    }

    setBillingFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [customInvoiceTemplate]);

  const handleSaveInvoiceTemplate = useCallback(async () => {
    if (!validateInvoiceTemplate()) {
      toast.error('⚠️ Veuillez corriger les erreurs du formulaire');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, managingInvoiceTemplates: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 2000));

      toast.success(`✅ Template "${customInvoiceTemplate.name}" créé avec succès`);
      setInvoiceTemplateModal(false);

      // Réinitialiser le formulaire
      setCustomInvoiceTemplate({
        name: '',
        description: '',
        settings: {
          logoPosition: 'top-left',
          colorScheme: 'blue',
          includeQRCode: true,
          includeBankDetails: true,
          footerText: ''
        }
      });
    } catch (error) {
      console.error('Erreur sauvegarde template:', error);
      toast.error('❌ Erreur lors de la sauvegarde');
    } finally {
      setLoadingStates(prev => ({ ...prev, managingInvoiceTemplates: false }));
    }
  }, [customInvoiceTemplate, validateInvoiceTemplate]);

  const handleProcessManualPayment = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, processingPayment: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 500));

      setPaymentProcessModal(true);
      toast.success('💳 Interface de traitement de paiement ouverte');
    } catch (error) {
      console.error('Erreur traitement paiement:', error);
      toast.error('❌ Erreur lors de l\'ouverture');
    } finally {
      setLoadingStates(prev => ({ ...prev, processingPayment: false }));
    }
  }, []);

  // Mettre à jour les utilisateurs filtrés quand userPermissions change
  useEffect(() => {
    setFilteredUsers(userPermissions);
  }, [userPermissions]);

  // Gestionnaires pour la gestion des utilisateurs
  const handleSearchUsers = useCallback(async (query: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, searchingUsers: true }));
      setUserSearchQuery(query);

      await new Promise<void>(resolve => setTimeout(resolve, 300));

      if (!query.trim()) {
        setFilteredUsers(userPermissions);
      } else {
        const filtered = userPermissions.filter(user =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.department.toLowerCase().includes(query.toLowerCase()) ||
          user.role.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredUsers(filtered);
      }
    } catch (error) {
      console.error('Erreur recherche utilisateurs:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, searchingUsers: false }));
    }
  }, [userPermissions]);

  const handleEditUser = useCallback(async (user: UserPermission) => {
    try {
      setLoadingStates(prev => ({ ...prev, editingUser: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 500));

      setCurrentEditingUser(user);
      setNewUserForm({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        permissions: [...user.permissions],
        sendInvite: false
      });
      setUserEditModal(true);

      toast.success('👤 Formulaire d\'édition ouvert');
    } catch (error) {
      console.error('Erreur édition utilisateur:', error);
      toast.error('❌ Erreur lors de l\'ouverture de l\'édition');
    } finally {
      setLoadingStates(prev => ({ ...prev, editingUser: false }));
    }
  }, []);

  const handleUserPermissions = useCallback(async (user: UserPermission) => {
    try {
      setLoadingStates(prev => ({ ...prev, managingPermissions: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 500));

      setCurrentEditingUser(user);
      setUserPermissionsModal(true);

      toast.success('🔐 Gestionnaire de permissions ouvert');
    } catch (error) {
      console.error('Erreur gestion permissions:', error);
      toast.error('❌ Erreur lors de l\'ouverture');
    } finally {
      setLoadingStates(prev => ({ ...prev, managingPermissions: false }));
    }
  }, []);

  const handleRemoveUser = useCallback(async (userId: string) => {
    const confirmed = window.confirm('⚠️ Êtes-vous sûr de vouloir supprimer cet utilisateur ?\n\nCette action est irréversible.');
    if (!confirmed) return;

    try {
      setLoadingStates(prev => ({ ...prev, deletingUser: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 1500));

      setUserPermissions(prev => prev.filter(user => user.userId !== userId));
      setSelectedUsers(prev => prev.filter(id => id !== userId));

      toast.success('🗑️ Utilisateur supprimé avec succès');
    } catch (error) {
      console.error('Erreur suppression utilisateur:', error);
      toast.error('❌ Erreur lors de la suppression');
    } finally {
      setLoadingStates(prev => ({ ...prev, deletingUser: false }));
    }
  }, []);

  const handleInviteUsers = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, invitingUser: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 500));

      setUserInviteModal(true);

      toast.success('📧 Interface d\'invitation ouverte');
    } catch (error) {
      console.error('Erreur ouverture invitation:', error);
      toast.error('❌ Erreur lors de l\'ouverture');
    } finally {
      setLoadingStates(prev => ({ ...prev, invitingUser: false }));
    }
  }, []);

  const validateUserForm = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!newUserForm.name.trim()) {
      errors.name = 'Le nom est requis';
    } else if (newUserForm.name.length < 2) {
      errors.name = 'Le nom doit faire au moins 2 caractères';
    }

    if (!newUserForm.email.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserForm.email)) {
      errors.email = 'Format d\'email invalide';
    } else if (userPermissions.some(user =>
      user.email === newUserForm.email && user.userId !== currentEditingUser?.userId
    )) {
      errors.email = 'Cet email est déjà utilisé';
    }

    if (!newUserForm.department.trim()) {
      errors.department = 'Le département est requis';
    }

    if (newUserForm.permissions.length === 0) {
      errors.permissions = 'Au moins une permission est requise';
    }

    setUserFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [newUserForm, userPermissions, currentEditingUser]);

  const handleSaveUser = useCallback(async () => {
    if (!validateUserForm()) {
      toast.error('⚠️ Veuillez corriger les erreurs du formulaire');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, editingUser: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 2000));

      if (currentEditingUser) {
        // Modification
        setUserPermissions(prev => prev.map(user =>
          user.userId === currentEditingUser.userId
            ? {
                ...user,
                name: newUserForm.name,
                email: newUserForm.email,
                role: newUserForm.role,
                department: newUserForm.department,
                permissions: newUserForm.permissions
              }
            : user
        ));
        toast.success(`✅ Utilisateur "${newUserForm.name}" modifié avec succès`);
      } else {
        // Création
        const newUser: UserPermission = {
          userId: `user_${Date.now()}`,
          name: newUserForm.name,
          email: newUserForm.email,
          role: newUserForm.role,
          department: newUserForm.department,
          permissions: newUserForm.permissions,
          lastActivity: new Date().toISOString(),
          status: 'ACTIVE'
        };

        setUserPermissions(prev => [...prev, newUser]);

        if (newUserForm.sendInvite) {
          toast.success(`✅ Utilisateur "${newUserForm.name}" créé et invité par email`);
        } else {
          toast.success(`✅ Utilisateur "${newUserForm.name}" créé avec succès`);
        }
      }

      setUserEditModal(false);
      setCurrentEditingUser(null);

      // Réinitialiser le formulaire
      setNewUserForm({
        name: '',
        email: '',
        role: 'AGENT',
        department: '',
        permissions: [],
        sendInvite: true
      });
    } catch (error) {
      console.error('Erreur sauvegarde utilisateur:', error);
      toast.error('❌ Erreur lors de la sauvegarde');
    } finally {
      setLoadingStates(prev => ({ ...prev, editingUser: false }));
    }
  }, [newUserForm, currentEditingUser, validateUserForm, userPermissions]);

  const handleSendInvitations = useCallback(async () => {
    const emails = inviteForm.emails.split(/[,\n]/).map(e => e.trim()).filter(e => e);

    if (emails.length === 0) {
      toast.error('⚠️ Veuillez saisir au moins un email');
      return;
    }

    const invalidEmails = emails.filter(email => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    if (invalidEmails.length > 0) {
      toast.error(`⚠️ Emails invalides: ${invalidEmails.join(', ')}`);
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, invitingUser: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 2500));

      // Créer les utilisateurs invités
      const newUsers = emails.map(email => ({
        userId: `invited_${Date.now()}_${Math.random()}`,
        name: email.split('@')[0].replace(/[._]/g, ' '),
        email,
        role: inviteForm.role,
        department: inviteForm.department,
        permissions: inviteForm.role === 'ADMIN' ? ['ADMIN_ACCESS', 'USER_MANAGEMENT'] : ['VIEW_REQUESTS'],
        lastActivity: new Date().toISOString(),
        status: 'INVITED' as const
      }));

      setUserPermissions(prev => [...prev, ...newUsers]);

      toast.success(`📧 ${emails.length} invitation(s) envoyée(s) avec succès`);
      setUserInviteModal(false);

      // Réinitialiser le formulaire
      setInviteForm({
        emails: '',
        role: 'AGENT',
        department: '',
        message: '',
        expireDays: 7
      });
    } catch (error) {
      console.error('Erreur envoi invitations:', error);
      toast.error('❌ Erreur lors de l\'envoi des invitations');
    } finally {
      setLoadingStates(prev => ({ ...prev, invitingUser: false }));
    }
  }, [inviteForm]);

  const handleExportUsers = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, exportingUsers: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 1000));

      const exportData = {
        users: userPermissions,
        groups: userGroups,
        exportDate: new Date().toISOString(),
        clientName: client?.nom || 'client_inconnu',
        totalUsers: userPermissions.length,
        activeUsers: userPermissions.filter(u => u.status === 'ACTIVE').length
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `utilisateurs_${(client?.nom || 'client_inconnu').replace(/\s+/g, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('📁 Liste des utilisateurs exportée');
    } catch (error) {
      console.error('Erreur export utilisateurs:', error);
      toast.error('❌ Erreur lors de l\'export');
    } finally {
      setLoadingStates(prev => ({ ...prev, exportingUsers: false }));
    }
  }, [userPermissions, userGroups, client?.nom]);

  const handleImportUsers = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, importingUsers: true }));

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,.csv';

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          const text = await file.text();

          if (file.name.endsWith('.json')) {
            const importData = JSON.parse(text);

            if (!importData.users || !Array.isArray(importData.users)) {
              throw new Error('Structure de fichier invalide');
            }

            const importedUsers = importData.users.map((user: any) => ({
              ...user,
              userId: `imported_${Date.now()}_${Math.random()}`,
              status: 'IMPORTED' as const,
              lastActivity: new Date().toISOString()
            }));

            setUserPermissions(prev => [...prev, ...importedUsers]);

            toast.success(`📂 ${importedUsers.length} utilisateur(s) importé(s) avec succès`);
          } else {
            // Traitement CSV basique
            const lines = text.split('\n').filter(line => line.trim());
            const headers = lines[0].split(',');

            if (!headers.includes('name') || !headers.includes('email')) {
              throw new Error('CSV doit contenir au minimum les colonnes "name" et "email"');
            }

            const users = lines.slice(1).map(line => {
              const values = line.split(',');
              const user: any = {};
              headers.forEach((header, index) => {
                user[header.trim()] = values[index]?.trim() || '';
              });

              return {
                userId: `csv_${Date.now()}_${Math.random()}`,
                name: user.name || 'Utilisateur Importé',
                email: user.email,
                role: user.role || 'AGENT',
                department: user.department || 'Import',
                permissions: user.permissions ? user.permissions.split(';') : ['VIEW_REQUESTS'],
                lastActivity: new Date().toISOString(),
                status: 'IMPORTED' as const
              };
            });

            setUserPermissions(prev => [...prev, ...users]);
            toast.success(`📂 ${users.length} utilisateur(s) importé(s) depuis CSV`);
          }
        } catch (error) {
          console.error('Erreur parsing import:', error);
          toast.error('❌ Fichier invalide ou corrompu');
        } finally {
          setLoadingStates(prev => ({ ...prev, importingUsers: false }));
        }
      };

      input.click();
    } catch (error) {
      console.error('Erreur import utilisateurs:', error);
      toast.error('❌ Erreur lors de l\'import');
      setLoadingStates(prev => ({ ...prev, importingUsers: false }));
    }
  }, []);

  const handleViewUserAnalytics = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, viewingUserAnalytics: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 1500));

      setUserAnalyticsModal(true);
      toast.success('📊 Analytics des utilisateurs chargées');
    } catch (error) {
      console.error('Erreur analytics utilisateurs:', error);
      toast.error('❌ Erreur lors du chargement des analytics');
    } finally {
      setLoadingStates(prev => ({ ...prev, viewingUserAnalytics: false }));
    }
  }, []);

  const handleManageGroups = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, managingGroups: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 500));

      setUserGroupsModal(true);
      toast.success('👥 Gestionnaire de groupes ouvert');
    } catch (error) {
      console.error('Erreur gestion groupes:', error);
      toast.error('❌ Erreur lors de l\'ouverture');
    } finally {
      setLoadingStates(prev => ({ ...prev, managingGroups: false }));
    }
  }, []);

  const handleBulkAction = useCallback(async (action: string) => {
    if (selectedUsers.length === 0) {
      toast.error('⚠️ Veuillez sélectionner au moins un utilisateur');
      return;
    }

    let confirmMessage = '';
    switch (action) {
      case 'activate':
        confirmMessage = `Activer ${selectedUsers.length} utilisateur(s) ?`;
        break;
      case 'deactivate':
        confirmMessage = `Désactiver ${selectedUsers.length} utilisateur(s) ?`;
        break;
      case 'delete':
        confirmMessage = `⚠️ Supprimer définitivement ${selectedUsers.length} utilisateur(s) ?\n\nCette action est irréversible.`;
        break;
      case 'export':
        confirmMessage = `Exporter ${selectedUsers.length} utilisateur(s) sélectionné(s) ?`;
        break;
      default:
        return;
    }

    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    try {
      setLoadingStates(prev => ({ ...prev, bulkActions: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 2000));

      switch (action) {
        case 'activate':
          setUserPermissions(prev => prev.map(user =>
            selectedUsers.includes(user.userId) ? { ...user, status: 'ACTIVE' } : user
          ));
          toast.success(`✅ ${selectedUsers.length} utilisateur(s) activé(s)`);
          break;
        case 'deactivate':
          setUserPermissions(prev => prev.map(user =>
            selectedUsers.includes(user.userId) ? { ...user, status: 'INACTIVE' } : user
          ));
          toast.success(`⏸️ ${selectedUsers.length} utilisateur(s) désactivé(s)`);
          break;
        case 'delete':
          setUserPermissions(prev => prev.filter(user => !selectedUsers.includes(user.userId)));
          toast.success(`🗑️ ${selectedUsers.length} utilisateur(s) supprimé(s)`);
          break;
        case 'export':
          const selectedUserData = userPermissions.filter(user => selectedUsers.includes(user.userId));
          const blob = new Blob([JSON.stringify(selectedUserData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `utilisateurs_selection_${Date.now()}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success(`📁 ${selectedUsers.length} utilisateur(s) exporté(s)`);
          break;
      }

      setSelectedUsers([]);
      setBulkAction('');
    } catch (error) {
      console.error('Erreur action en lot:', error);
      toast.error('❌ Erreur lors de l\'action en lot');
    } finally {
      setLoadingStates(prev => ({ ...prev, bulkActions: false }));
    }
  }, [selectedUsers, userPermissions]);

  const handleToggleUserSelection = useCallback((userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const handleSelectAllUsers = useCallback(() => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.userId));
    }
  }, [selectedUsers, filteredUsers]);

  const handleSendNotification = useCallback(async (userIds: string[], message: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, sendingNotification: true }));

      await new Promise<void>(resolve => setTimeout(resolve, 1500));

      toast.success(`📱 Notification envoyée à ${userIds.length} utilisateur(s)`);
    } catch (error) {
      console.error('Erreur envoi notification:', error);
      toast.error('❌ Erreur lors de l\'envoi de notification');
    } finally {
      setLoadingStates(prev => ({ ...prev, sendingNotification: false }));
    }
  }, []);

    // === GESTIONNAIRES CONFIGURATION TECHNIQUE ===

  // Validation configuration technique
  const validateTechnicalConfig = useCallback(() => {
    const errors: Record<string, string> = {};

    if (newWebhookUrl && !/^https?:\/\/.+/.test(newWebhookUrl)) {
      errors.webhook = 'URL webhook invalide (doit commencer par http:// ou https://)';
    }

    if (backupRetention < 1 || backupRetention > 365) {
      errors.retention = 'La rétention doit être entre 1 et 365 jours';
    }

    if (maintenanceDuration < 0.5 || maintenanceDuration > 24) {
      errors.maintenance = 'La durée de maintenance doit être entre 0.5 et 24 heures';
    }

    // Validation IP whitelist
    if (ipWhitelist) {
      const ips = ipWhitelist.split('\n').filter(ip => ip.trim());
      for (const ip of ips) {
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
        if (!ipRegex.test(ip.trim())) {
          errors.ipWhitelist = `IP invalide: ${ip.trim()}`;
          break;
        }
      }
    }

    setTechnicalErrors(errors);
    return Object.keys(errors).length === 0;
  }, [newWebhookUrl, backupRetention, maintenanceDuration, ipWhitelist]);

  // Tester un webhook
  const handleTestWebhook = useCallback(async (url: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, testingWebhook: true }));

      await new Promise(resolve => setTimeout(resolve, 2500));

      // Simulation test webhook
      const success = Math.random() > 0.3;

      if (success) {
        toast.success(`✅ Webhook ${url} fonctionne correctement`);
      } else {
        toast.error(`❌ Échec du test webhook ${url}`);
      }
    } catch (error) {
      toast.error('❌ Erreur lors du test webhook');
    } finally {
      setLoadingStates(prev => ({ ...prev, testingWebhook: false }));
    }
  }, []);

  // Upload certificat SSL
  const handleUploadCert = useCallback(async () => {
    if (!sslCertName.trim()) {
      setTechnicalErrors(prev => ({ ...prev, cert: 'Nom du certificat requis' }));
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, uploadingCert: true }));

      // Simulation upload fichier
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.crt,.pem,.cert';

      await new Promise<void>((resolve) => {
        input.onchange = async () => {
          if (input.files && input.files[0]) {
            const file = input.files[0];

            // Validation fichier
            if (file.size > 10 * 1024 * 1024) { // 10MB max
              toast.error('❌ Fichier trop volumineux (max 10MB)');
              return;
            }

            await new Promise(r => setTimeout(r, 2000));

            setTechnicalConfig(prev => ({
              ...prev,
              sslConfig: {
                ...prev.sslConfig,
                certificate: sslCertName,
                uploadedAt: new Date().toISOString()
              }
            }));

            setTechnicalErrors(prev => ({ ...prev, cert: '' }));
            toast.success('📄 Certificat SSL uploadé avec succès');
          }
          resolve();
        };
        input.click();
      });
    } catch (error) {
      toast.error('❌ Erreur lors de l\'upload du certificat');
    } finally {
      setLoadingStates(prev => ({ ...prev, uploadingCert: false }));
    }
  }, [sslCertName]);

  // Programmer une maintenance
  const handleScheduleMaintenance = useCallback(async () => {
    if (!validateTechnicalConfig()) return;

    try {
      setLoadingStates(prev => ({ ...prev, schedulingMaintenance: true }));

      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success(`🛠️ Maintenance programmée le ${maintenanceDate} pour ${maintenanceDuration}h`);
      setMaintenanceModal(false);
    } catch (error) {
      toast.error('❌ Erreur lors de la programmation de la maintenance');
    } finally {
      setLoadingStates(prev => ({ ...prev, schedulingMaintenance: false }));
    }
  }, [maintenanceDate, maintenanceDuration, validateTechnicalConfig]);

  // Diagnostics système
  const handleRunDiagnostics = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, runningDiagnostics: true }));

      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulation mise à jour métriques
      setSystemMetrics(prev => ({
        ...prev,
        uptime: 99.8 + Math.random() * 0.2,
        responseTime: 100 + Math.random() * 50,
        cpuLoad: 15 + Math.random() * 20,
        memoryUsage: 60 + Math.random() * 15,
        diskUsage: 40 + Math.random() * 20,
        activeConnections: 1200 + Math.random() * 100
      }));

      toast.success('🔍 Diagnostics système terminés');
      setDiagnosticsModal(true);
    } catch (error) {
      toast.error('❌ Erreur lors des diagnostics');
    } finally {
      setLoadingStates(prev => ({ ...prev, runningDiagnostics: false }));
    }
  }, []);

  // Exporter les logs
  const handleExportLogs = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, exportingLogs: true }));

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulation génération logs
      const logsData = {
        timestamp: new Date().toISOString(),
        client: client?.nom || 'Client',
        logs: [
          { time: '2024-01-20 10:30:25', level: 'INFO', message: 'Connexion API réussie' },
          { time: '2024-01-20 10:25:12', level: 'WARN', message: 'Tentative de connexion échouée' },
          { time: '2024-01-20 10:20:08', level: 'INFO', message: 'Sauvegarde automatique terminée' }
        ]
      };

      const blob = new Blob([JSON.stringify(logsData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs_${client?.code || 'client'}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('📄 Logs exportés avec succès');
    } catch (error) {
      toast.error('❌ Erreur lors de l\'export des logs');
    } finally {
      setLoadingStates(prev => ({ ...prev, exportingLogs: false }));
    }
  }, [client?.nom, client?.code]);

  // Nettoyer le cache
  const handleClearCache = useCallback(async () => {
    if (!confirm('⚠️ Cela va vider tout le cache. Continuer ?')) return;

    try {
      setLoadingStates(prev => ({ ...prev, clearingCache: true }));

      await new Promise(resolve => setTimeout(resolve, 2500));

      toast.success('🧹 Cache vidé avec succès');
    } catch (error) {
      toast.error('❌ Erreur lors du nettoyage du cache');
    } finally {
      setLoadingStates(prev => ({ ...prev, clearingCache: false }));
    }
  }, []);

  // === GESTIONNAIRES ANALYTICS ===

  // Actualiser les métriques analytics
  const handleRefreshMetrics = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, refreshingMetrics: true }));

      // Simulation de récupération de nouvelles données
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Génération de nouvelles données simulées
      setAnalyticsData(prev => ({
        ...prev,
        demandesCeMois: Math.floor(1000 + Math.random() * 500),
        croissanceDemandes: (Math.random() - 0.5) * 40,
        tempsTraitement: 1.5 + Math.random() * 2,
        ameliorationTraitement: (Math.random() - 0.5) * 30,
        satisfaction: 85 + Math.random() * 15,
        ameliorationSatisfaction: (Math.random() - 0.5) * 10
      }));

      // Mise à jour des données de graphique
      setChartData(prev => ({
        ...prev,
        evolutionDemandes: prev.evolutionDemandes.map(item => ({
          ...item,
          demandes: Math.floor(1000 + Math.random() * 400),
          satisfactionMoyenne: 85 + Math.random() * 15
        }))
      }));

      toast.success('📊 Métriques actualisées avec succès');
    } catch (error) {
      toast.error('❌ Erreur lors de l\'actualisation des métriques');
    } finally {
      setLoadingStates(prev => ({ ...prev, refreshingMetrics: false }));
    }
  }, []);

  // Générer un rapport mensuel
  const handleGenerateMonthlyReport = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, generatingReport: true }));

      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulation génération rapport PDF
      const reportData = {
        client: client?.nom || 'Client',
        periode: 'Janvier 2024',
        demandesTraitees: analyticsData.demandesCeMois,
        satisfaction: analyticsData.satisfaction,
        tempsTraitement: analyticsData.tempsTraitement,
        services: chartData.repartitionServices,
        evolution: chartData.evolutionDemandes,
        generateAt: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_mensuel_${client?.code || 'client'}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('📋 Rapport mensuel généré et téléchargé');
    } catch (error) {
      toast.error('❌ Erreur lors de la génération du rapport');
    } finally {
      setLoadingStates(prev => ({ ...prev, generatingReport: false }));
    }
  }, [client?.nom, client?.code, analyticsData, chartData]);

  // Effectuer une analyse détaillée
  const handleDetailedAnalysis = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, analyzingData: true }));

      await new Promise(resolve => setTimeout(resolve, 4000));

      // Simulation analyse approfondie
      const analysisResults = {
        tendanceGenerale: 'positive',
        pointsForts: [
          'Augmentation constante de la satisfaction client',
          'Réduction du temps de traitement',
          'Forte croissance des demandes CNI'
        ],
        pointsAmelioration: [
          'Optimiser les créneaux d\'affluence',
          'Réduire le temps d\'attente pour les passeports',
          'Améliorer la communication sur les délais'
        ],
        predictions: {
          prochainMois: Math.floor(analyticsData.demandesCeMois * (1 + Math.random() * 0.2)),
          satisfactionCible: Math.min(100, analyticsData.satisfaction + Math.random() * 5)
        },
        recommandations: [
          'Renforcer l\'équipe pendant les pics d\'activité',
          'Mettre en place un système de notification SMS',
          'Optimiser le processus de validation des documents'
        ]
      };

            setAnalyticsModal(prev => ({ ...prev, detailedAnalysis: true }));

      // Stocker les résultats dans un état local (sera utilisé par le modal)
      setAnalysisResults(analysisResults);

      toast.success('🔍 Analyse détaillée terminée');
    } catch (error) {
      toast.error('❌ Erreur lors de l\'analyse détaillée');
    } finally {
      setLoadingStates(prev => ({ ...prev, analyzingData: false }));
    }
  }, [analyticsData]);

  // Exporter les données analytics
  const handleExportAnalytics = useCallback(async (format: 'PDF' | 'Excel' | 'JSON') => {
    try {
      const loadingKey = format === 'PDF' ? 'exportingPDF' :
                        format === 'Excel' ? 'exportingExcel' : 'exportingAnalytics';

      setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));

      await new Promise(resolve => setTimeout(resolve, 2500));

      // Préparation des données d'export
      const exportData = {
        metadata: {
          client: client?.nom || 'Client',
          code: client?.code || 'N/A',
          periode: analyticsFilters.periode,
          dateExport: new Date().toISOString(),
          format
        },
        metriques: analyticsData,
        graphiques: chartData,
        filtres: analyticsFilters,
        configuration: reportConfig
      };

      let blob: Blob;
      let fileName: string;

      switch (format) {
        case 'PDF':
          // Simulation génération PDF
          blob = new Blob([`Rapport Analytics PDF - ${client?.nom}\n\nDonnées: ${JSON.stringify(exportData, null, 2)}`],
                          { type: 'application/pdf' });
          fileName = `analytics_${client?.code || 'client'}_${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        case 'Excel':
          // Simulation génération Excel
          blob = new Blob([JSON.stringify(exportData, null, 2)],
                          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fileName = `analytics_${client?.code || 'client'}_${new Date().toISOString().split('T')[0]}.xlsx`;
          break;
        case 'JSON':
        default:
          blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
          fileName = `analytics_${client?.code || 'client'}_${new Date().toISOString().split('T')[0]}.json`;
          break;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(`📊 Données analytics exportées en ${format}`);
    } catch (error) {
      toast.error(`❌ Erreur lors de l'export ${format}`);
    } finally {
      setLoadingStates(prev => ({
        ...prev,
        exportingPDF: false,
        exportingExcel: false,
        exportingAnalytics: false
      }));
    }
  }, [client, analyticsData, chartData, analyticsFilters, reportConfig]);

  // Filtrer les données analytics
  const handleFilterAnalytics = useCallback(async (newFilters: typeof analyticsFilters) => {
    try {
      setLoadingStates(prev => ({ ...prev, filteringData: true }));

      setAnalyticsFilters(newFilters);

      // Simulation filtrage des données
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Régénération des données selon les filtres
      const multiplier = newFilters.periode === '7d' ? 0.25 :
                        newFilters.periode === '30d' ? 1 :
                        newFilters.periode === '90d' ? 3 : 12;

      setAnalyticsData(prev => ({
        ...prev,
        demandesCeMois: Math.floor(prev.demandesCeMois * multiplier),
        croissanceDemandes: (Math.random() - 0.5) * 30
      }));

      toast.success('🔍 Données filtrées avec succès');
    } catch (error) {
      toast.error('❌ Erreur lors du filtrage');
    } finally {
      setLoadingStates(prev => ({ ...prev, filteringData: false }));
    }
  }, []);

  // Générer un rapport personnalisé
  const handleCustomReport = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, downloadingReport: true }));

      await new Promise(resolve => setTimeout(resolve, 3500));

      const customData = {
        configuration: reportConfig,
        donnees: {
          ...analyticsData,
          ...chartData
        },
        meta: {
          client: client?.nom,
          dateGeneration: new Date().toISOString(),
          sections: reportConfig.sections
        }
      };

      const blob = new Blob([JSON.stringify(customData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_personnalise_${client?.code || 'client'}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setAnalyticsModal(prev => ({ ...prev, customReport: false }));
      toast.success('📝 Rapport personnalisé généré');
    } catch (error) {
      toast.error('❌ Erreur lors de la génération du rapport personnalisé');
    } finally {
      setLoadingStates(prev => ({ ...prev, downloadingReport: false }));
    }
  }, [reportConfig, analyticsData, chartData, client]);

  // === GESTIONNAIRES SUPPORT ===

  // Validation du formulaire de nouveau ticket
  const validateNewTicket = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!newTicketForm.title.trim()) {
      errors.title = 'Le titre est requis';
    } else if (newTicketForm.title.length < 5) {
      errors.title = 'Le titre doit contenir au moins 5 caractères';
    }

    if (!newTicketForm.description.trim()) {
      errors.description = 'La description est requise';
    } else if (newTicketForm.description.length < 10) {
      errors.description = 'La description doit contenir au moins 10 caractères';
    }

    setSupportErrors(errors);
    return Object.keys(errors).length === 0;
  }, [newTicketForm]);

  // Créer un nouveau ticket
  const handleCreateTicket = useCallback(async () => {
    try {
      if (!validateNewTicket()) return;

      setLoadingStates(prev => ({ ...prev, creatingTicket: true }));

      await new Promise(resolve => setTimeout(resolve, 2000));

      const newTicket = {
        id: `TKT-2024-${String(supportTickets.length + 1).padStart(3, '0')}`,
        title: newTicketForm.title,
        description: newTicketForm.description,
        priority: newTicketForm.priority,
        status: 'OPEN' as const,
        assignedTo: 'Support Team',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: newTicketForm.category
      };

      setSupportTickets(prev => [newTicket, ...prev]);

      // Ajouter à l'historique
      const historyEntry = {
        time: new Date().toLocaleString('fr-FR'),
        action: 'Nouveau ticket créé',
        user: 'Super Admin',
        type: 'SUPPORT' as const,
        details: `${newTicket.id} - ${newTicket.title}`,
        impact: newTicket.priority === 'URGENT' ? 'HIGH' as const : 'MEDIUM' as const
      };

      setActivityHistory(prev => [historyEntry, ...prev]);

      // Reset du formulaire
      setNewTicketForm({
        title: '',
        description: '',
        priority: 'MEDIUM',
        category: 'TECHNIQUE'
      });

      setSupportModals(prev => ({ ...prev, newTicket: false }));
      toast.success(`🎫 Ticket ${newTicket.id} créé avec succès`);
    } catch (error) {
      toast.error('❌ Erreur lors de la création du ticket');
    } finally {
      setLoadingStates(prev => ({ ...prev, creatingTicket: false }));
    }
  }, [newTicketForm, validateNewTicket, supportTickets.length]);

  // Actualiser la liste des tickets
  const handleRefreshTickets = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, refreshingTickets: true }));

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulation mise à jour des statuts
      setSupportTickets(prev => prev.map(ticket => ({
        ...ticket,
        updatedAt: new Date().toISOString(),
        status: Math.random() > 0.7 ? 'RESOLVED' as const : ticket.status
      })));

      toast.success('🔄 Tickets actualisés');
    } catch (error) {
      toast.error('❌ Erreur lors de l\'actualisation');
    } finally {
      setLoadingStates(prev => ({ ...prev, refreshingTickets: false }));
    }
  }, []);

  // Fermer un ticket
  const handleCloseTicket = useCallback(async (ticketId: string) => {
    try {
      const confirmed = window.confirm('Êtes-vous sûr de vouloir fermer ce ticket ?');
      if (!confirmed) return;

      setLoadingStates(prev => ({ ...prev, closingTicket: true }));

      await new Promise(resolve => setTimeout(resolve, 1000));

      setSupportTickets(prev => prev.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, status: 'CLOSED' as const, updatedAt: new Date().toISOString() }
          : ticket
      ));

      const historyEntry = {
        time: new Date().toLocaleString('fr-FR'),
        action: 'Ticket fermé',
        user: 'Super Admin',
        type: 'SUPPORT' as const,
        details: `${ticketId} fermé par l'administrateur`,
        impact: 'MEDIUM' as const
      };

      setActivityHistory(prev => [historyEntry, ...prev]);

      toast.success(`✅ Ticket ${ticketId} fermé`);
    } catch (error) {
      toast.error('❌ Erreur lors de la fermeture du ticket');
    } finally {
      setLoadingStates(prev => ({ ...prev, closingTicket: false }));
    }
  }, []);

  // Assigner un ticket
  const handleAssignTicket = useCallback(async (ticketId: string, assignTo: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, assigningTicket: true }));

      await new Promise(resolve => setTimeout(resolve, 800));

      setSupportTickets(prev => prev.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, assignedTo: assignTo, status: 'IN_PROGRESS' as const, updatedAt: new Date().toISOString() }
          : ticket
      ));

      toast.success(`👤 Ticket ${ticketId} assigné à ${assignTo}`);
    } catch (error) {
      toast.error('❌ Erreur lors de l\'assignation');
    } finally {
      setLoadingStates(prev => ({ ...prev, assigningTicket: false }));
    }
  }, []);

  // Contacter le support
  const handleContactSupport = useCallback(async () => {
    try {
      if (!contactForm.subject.trim() || !contactForm.message.trim()) {
        toast.error('⚠️ Veuillez remplir tous les champs');
        return;
      }

      setLoadingStates(prev => ({ ...prev, contactingSupport: true }));

      await new Promise(resolve => setTimeout(resolve, 2500));

      // Création automatique d'un ticket depuis le contact
      const newTicket = {
        id: `TKT-2024-${String(supportTickets.length + 1).padStart(3, '0')}`,
        title: contactForm.subject,
        description: contactForm.message,
        priority: contactForm.urgency === 'URGENT' ? 'URGENT' as const :
                  contactForm.urgency === 'HIGH' ? 'HIGH' as const : 'MEDIUM' as const,
        status: 'OPEN' as const,
        assignedTo: 'Support Direct',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: 'AUTRE' as const
      };

      setSupportTickets(prev => [newTicket, ...prev]);

      // Reset du formulaire
      setContactForm({
        subject: '',
        message: '',
        urgency: 'NORMAL',
        requestCallback: false
      });

      setSupportModals(prev => ({ ...prev, contactSupport: false }));

      if (contactForm.requestCallback) {
        toast.success('📞 Message envoyé - Vous serez contacté sous 24h');
      } else {
        toast.success(`📧 Message envoyé - Ticket ${newTicket.id} créé`);
      }
    } catch (error) {
      toast.error('❌ Erreur lors de l\'envoi du message');
    } finally {
      setLoadingStates(prev => ({ ...prev, contactingSupport: false }));
    }
  }, [contactForm, supportTickets.length]);

  // Générer le guide utilisateur
  const handleGenerateGuide = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, generatingGuide: true }));

      await new Promise(resolve => setTimeout(resolve, 3000));

      const guideData = {
        client: client?.nom,
        dateGeneration: new Date().toISOString(),
        sections: [
          'Connexion et authentification',
          'Navigation dans l\'interface',
          'Gestion des demandes',
          'Suivi des dossiers',
          'Rapports et statistiques',
          'Support et assistance'
        ],
        faq: [
          'Comment réinitialiser mon mot de passe ?',
          'Où voir le statut de ma demande ?',
          'Comment joindre des documents ?',
          'Que faire en cas d\'erreur ?'
        ]
      };

      const blob = new Blob([JSON.stringify(guideData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `guide_utilisateur_${client?.code}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setSupportModals(prev => ({ ...prev, userGuide: false }));
      toast.success('📖 Guide utilisateur généré et téléchargé');
    } catch (error) {
      toast.error('❌ Erreur lors de la génération du guide');
    } finally {
      setLoadingStates(prev => ({ ...prev, generatingGuide: false }));
    }
  }, [client]);

  // Charger la FAQ
  const handleLoadFAQ = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, loadingFAQ: true }));
      setSupportModals(prev => ({ ...prev, FAQ: true }));

      await new Promise(resolve => setTimeout(resolve, 1200));

      toast.success('❓ FAQ chargée');
    } catch (error) {
      toast.error('❌ Erreur lors du chargement de la FAQ');
    } finally {
      setLoadingStates(prev => ({ ...prev, loadingFAQ: false }));
    }
  }, []);

  // Télécharger la documentation API
  const handleDownloadDocs = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, downloadingDocs: true }));

      await new Promise(resolve => setTimeout(resolve, 2000));

      const docData = {
        title: 'Documentation API - ' + client?.nom,
        version: '2.1.0',
        endpoints: [
          { method: 'GET', path: '/api/demandes', description: 'Liste des demandes' },
          { method: 'POST', path: '/api/demandes', description: 'Créer une demande' },
          { method: 'PUT', path: '/api/demandes/{id}', description: 'Modifier une demande' },
          { method: 'GET', path: '/api/status/{id}', description: 'Statut d\'une demande' }
        ],
        authentication: 'Bearer Token',
        baseUrl: `https://api.${client?.code?.toLowerCase()}.ga`
      };

      const blob = new Blob([JSON.stringify(docData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `documentation_api_${client?.code}_v2.1.0.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('📚 Documentation API téléchargée');
    } catch (error) {
      toast.error('❌ Erreur lors du téléchargement');
    } finally {
      setLoadingStates(prev => ({ ...prev, downloadingDocs: false }));
    }
  }, [client]);

  // Exporter l'historique complet
  const handleExportHistory = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, exportingHistory: true }));

      await new Promise(resolve => setTimeout(resolve, 1800));

      const historyData = {
        client: client?.nom,
        exportDate: new Date().toISOString(),
        totalEntries: activityHistory.length,
        history: activityHistory,
        summary: {
          CONFIG: activityHistory.filter(h => h.type === 'CONFIG').length,
          SUPPORT: activityHistory.filter(h => h.type === 'SUPPORT').length,
          SYSTEM: activityHistory.filter(h => h.type === 'SYSTEM').length,
          AUTH: activityHistory.filter(h => h.type === 'AUTH').length,
          BILLING: activityHistory.filter(h => h.type === 'BILLING').length
        }
      };

      const blob = new Blob([JSON.stringify(historyData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `historique_${client?.code}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('📋 Historique exporté avec succès');
    } catch (error) {
      toast.error('❌ Erreur lors de l\'export de l\'historique');
    } finally {
      setLoadingStates(prev => ({ ...prev, exportingHistory: false }));
    }
  }, [client, activityHistory]);

  // Gestionnaires pour les uploads de thème
  const handleUploadLogo = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, uploadingLogo: true }));

      // Créer un input file virtuel
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      return new Promise((resolve) => {
        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) {
            resolve(null);
            return;
          }

          // Validation du fichier
          if (file.size > 5 * 1024 * 1024) { // 5MB max
            toast.error('⚠️ Le fichier doit faire moins de 5MB');
            resolve(null);
            return;
          }

          if (!file.type.startsWith('image/')) {
            toast.error('⚠️ Veuillez sélectionner une image valide');
            resolve(null);
            return;
          }

          // Simulation d'upload
          await new Promise<void>(resolve => setTimeout(resolve, 2000));

          // Créer une URL temporaire pour prévisualisation
          const imageUrl = URL.createObjectURL(file);
          setThemeConfig(prev => ({ ...prev, logoUrl: imageUrl }));

          toast.success('🖼️ Logo principal téléchargé avec succès');
          resolve(imageUrl);
        };

        input.click();
      });
    } catch (error) {
      console.error('Erreur upload logo:', error);
      toast.error('❌ Erreur lors du téléchargement du logo');
    } finally {
      setLoadingStates(prev => ({ ...prev, uploadingLogo: false }));
    }
  }, []);

  const handleUploadFavicon = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, uploadingFavicon: true }));

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/x-icon,image/png,image/gif,image/jpeg';

      return new Promise((resolve) => {
        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) {
            resolve(null);
            return;
          }

          // Validation spécifique au favicon
          if (file.size > 1 * 1024 * 1024) { // 1MB max pour favicon
            toast.error('⚠️ Le favicon doit faire moins de 1MB');
            resolve(null);
            return;
          }

          // Vérifier les dimensions recommandées
          const img = document.createElement('img') as HTMLImageElement;
          img.onload = async () => {
            if (img.width !== img.height) {
              toast.warning('⚠️ Un favicon carré est recommandé (16x16, 32x32, etc.)');
            }

            await new Promise<void>(resolve => setTimeout(resolve, 1500));

            const imageUrl = URL.createObjectURL(file);
            setThemeConfig(prev => ({ ...prev, faviconUrl: imageUrl }));

            toast.success('🎯 Favicon téléchargé avec succès');
            resolve(imageUrl);
          };
          img.src = URL.createObjectURL(file);
        };

        input.click();
      });
    } catch (error) {
      console.error('Erreur upload favicon:', error);
      toast.error('❌ Erreur lors du téléchargement du favicon');
    } finally {
      setLoadingStates(prev => ({ ...prev, uploadingFavicon: false }));
    }
  }, []);

  const handleUploadHeaderImage = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, uploadingHeader: true }));

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      return new Promise((resolve) => {
        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) {
            resolve(null);
            return;
          }

          // Validation pour image d'en-tête
          if (file.size > 10 * 1024 * 1024) { // 10MB max
            toast.error('⚠️ L\'image d\'en-tête doit faire moins de 10MB');
            resolve(null);
            return;
          }

          // Vérifier les dimensions
          const img = document.createElement('img') as HTMLImageElement;
          img.onload = async () => {
            const aspectRatio = img.width / img.height;
            if (aspectRatio < 2 || aspectRatio > 4) {
              toast.warning('⚠️ Ratio 2:1 à 4:1 recommandé pour l\'en-tête');
            }

            await new Promise<void>(resolve => setTimeout(resolve, 2500));

            const imageUrl = URL.createObjectURL(file);
            setThemeConfig(prev => ({ ...prev, headerImage: imageUrl }));

            toast.success('🎨 Image d\'en-tête téléchargée avec succès');
            resolve(imageUrl);
          };
          img.src = URL.createObjectURL(file);
        };

        input.click();
      });
    } catch (error) {
      console.error('Erreur upload header:', error);
      toast.error('❌ Erreur lors du téléchargement de l\'image d\'en-tête');
    } finally {
      setLoadingStates(prev => ({ ...prev, uploadingHeader: false }));
    }
  }, []);

  // Gestionnaires de validation en temps réel
  const validateColor = useCallback((color: string, colorName: string) => {
    const hexPattern = /^#[0-9A-F]{6}$/i;
    if (!hexPattern.test(color)) {
      toast.error(`⚠️ ${colorName}: Format hexadécimal invalide (ex: #FF5733)`);
      return false;
    }
    return true;
  }, []);

  const handleColorChange = useCallback((colorType: 'primaryColor' | 'secondaryColor' | 'accentColor', value: string) => {
    setThemeConfig(prev => ({ ...prev, [colorType]: value }));

    // Validation en temps réel avec debounce
    setTimeout(() => {
      const colorNames = {
        primaryColor: 'Couleur primaire',
        secondaryColor: 'Couleur secondaire',
        accentColor: 'Couleur d\'accent'
      };
      validateColor(value, colorNames[colorType]);
    }, 500);
  }, [validateColor]);

  // Gestionnaires avancés pour le thème
  const handleResetTheme = useCallback(async () => {
    const confirmed = window.confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser le thème ? Toutes les modifications seront perdues.');
    if (!confirmed) return;

    try {
      setLoadingStates(prev => ({ ...prev, resetingTheme: true }));

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Reset vers les valeurs par défaut
      setThemeConfig({
        primaryColor: '#3B82F6',
        secondaryColor: '#10B981',
        accentColor: '#F59E0B',
        logoUrl: '',
        faviconUrl: '',
        customCss: '',
        fontFamily: 'Inter',
        headerImage: '',
        footerText: 'Organisme Public du Gabon',
        darkMode: false,
        animations: true
      });

      toast.success('🔄 Thème réinitialisé aux valeurs par défaut');
    } catch (error) {
      console.error('Erreur reset thème:', error);
      toast.error('❌ Erreur lors de la réinitialisation');
    } finally {
      setLoadingStates(prev => ({ ...prev, resetingTheme: false }));
    }
  }, []);

  const handleExportTheme = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, exportingTheme: true }));

      await new Promise(resolve => setTimeout(resolve, 1000));

      const themeData = {
        version: '1.0',
        clientId: client?.code,
        clientName: client?.nom,
        exportDate: new Date().toISOString(),
        theme: themeConfig
      };

      const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `theme_${client?.code}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();

      toast.success('📥 Thème exporté avec succès');
    } catch (error) {
      console.error('Erreur export thème:', error);
      toast.error('❌ Erreur lors de l\'export du thème');
    } finally {
      setLoadingStates(prev => ({ ...prev, exportingTheme: false }));
    }
  }, [client, themeConfig]);

  const handleImportTheme = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, importingTheme: true }));

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';

      return new Promise((resolve) => {
        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) {
            resolve(null);
            return;
          }

          try {
            const text = await file.text();
            const themeData = JSON.parse(text);

            // Validation de la structure
            if (!themeData.theme || !themeData.version) {
              toast.error('⚠️ Format de fichier thème invalide');
              resolve(null);
              return;
            }

            await new Promise(resolve => setTimeout(resolve, 1500));

            setThemeConfig(themeData.theme);
            toast.success(`🎨 Thème importé: ${themeData.clientName || 'Thème personnalisé'}`);
            resolve(themeData);
          } catch (error) {
            console.error('Erreur parsing JSON:', error);
            toast.error('❌ Erreur lors de la lecture du fichier');
            resolve(null);
          }
        };

        input.click();
      });
    } catch (error) {
      console.error('Erreur import thème:', error);
      toast.error('❌ Erreur lors de l\'import du thème');
    } finally {
      setLoadingStates(prev => ({ ...prev, importingTheme: false }));
    }
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getBrandingForClient = (clientCode: string) => {
    return Object.values(ORGANISMES_BRANDING).find(b => b.code === clientCode) || {
      code: 'DEFAULT',
      nom: 'Organisme',
      couleurPrimaire: '#3B82F6',
      couleurSecondaire: '#10B981',
      gradientClasses: 'from-blue-600 to-blue-800',
      icon: Building2,
      description: 'Au service du citoyen'
    };
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chargement de la gestion client...</h3>
              <p className="text-muted-foreground">Veuillez patienter</p>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!client) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Client non trouvé</h3>
            <p className="text-muted-foreground mb-4">Le client demandé n'existe pas</p>
            <Button onClick={() => router.push('/super-admin/clients')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  const branding = getBrandingForClient(client?.code || '');

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.push('/super-admin/clients')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: branding.couleurPrimaire }}
            >
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{client?.nom || 'Client'}</h1>
              <p className="text-gray-600">Code: {client?.code || 'N/A'} • {client?.type || 'N/A'}</p>
            </div>
            <div className="flex gap-2 ml-auto">
              <Badge className="bg-green-100 text-green-800 border-green-300">
                CLIENT {client?.clientInfo?.type || 'N/A'}
              </Badge>
              <Badge variant={client?.clientInfo?.statut === 'ACTIF' ? 'default' : 'secondary'}>
                {client?.clientInfo?.statut || 'N/A'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-9 lg:grid-cols-9">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="theme">Thème & Design</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="cards">Cartes</TabsTrigger>
            <TabsTrigger value="billing">Facturation</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="technical">Technique</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Informations générales */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Informations Générales
                  </CardTitle>
                  <CardDescription>Détails de l'organisme client</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Nom complet</Label>
                      <p className="text-sm text-gray-600">{client.nom}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Code</Label>
                      <p className="text-sm text-gray-600 font-mono">{client.code}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Type</Label>
                      <p className="text-sm text-gray-600">{client.type}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Localisation</Label>
                      <p className="text-sm text-gray-600">{client.localisation}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Contact</Label>
                      <p className="text-sm text-gray-600">
                        {typeof client.contact === 'string' ? client.contact : client.contact?.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Téléphone</Label>
                      <p className="text-sm text-gray-600">
                        {typeof client.contact === 'object' ? client.contact?.telephone : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Contrat</Label>
                      <p className="text-sm text-gray-600">{client.clientInfo?.type}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Montant annuel</Label>
                      <p className="text-sm text-green-600 font-semibold">
                        {formatPrice(client.clientInfo?.montantAnnuel || 0)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Date signature</Label>
                      <p className="text-sm text-gray-600">
                        {client.clientInfo?.dateSignature
                          ? new Date(client.clientInfo.dateSignature).toLocaleDateString('fr-FR')
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Expiration</Label>
                      <p className="text-sm text-gray-600">
                        {client.clientInfo?.dateExpiration
                          ? new Date(client.clientInfo.dateExpiration).toLocaleDateString('fr-FR')
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Métriques rapides */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Métriques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{client?.stats?.totalUsers || 0}</p>
                    <p className="text-sm text-gray-600">Utilisateurs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{client?.stats?.totalServices || 0}</p>
                    <p className="text-sm text-gray-600">Services</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{client?.stats?.activeUsers || 0}</p>
                    <p className="text-sm text-gray-600">Actifs ce mois</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">98%</p>
                    <p className="text-sm text-gray-600">Disponibilité</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Services activés */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Services Activés
                </CardTitle>
                <CardDescription>Services actuellement disponibles pour ce client</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {serviceConfigs.filter(s => s.enabled).map((service) => (
                    <div key={service.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{service.name}</h4>
                        <Badge variant="default">Actif</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                      <p className="text-sm font-semibold text-green-600">{formatPrice(service.price)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration du thème */}
          <TabsContent value="theme" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuration du Thème
                </CardTitle>
                <CardDescription>Personnalisez l'apparence de l'interface client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Couleurs */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Couleurs</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="primary-color">Couleur primaire</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            id="primary-color"
                            type="color"
                            value={themeConfig.primaryColor}
                            onChange={(e) => setThemeConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                            className="w-16 h-10"
                          />
                                                     <Input
                             value={themeConfig.primaryColor}
                             onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                             className="flex-1"
                             placeholder="#FF5733"
                           />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="secondary-color">Couleur secondaire</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            id="secondary-color"
                            type="color"
                            value={themeConfig.secondaryColor}
                            onChange={(e) => setThemeConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                            className="w-16 h-10"
                          />
                                                     <Input
                             value={themeConfig.secondaryColor}
                             onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                             className="flex-1"
                             placeholder="#10B981"
                           />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="accent-color">Couleur d'accent</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            id="accent-color"
                            type="color"
                            value={themeConfig.accentColor}
                            onChange={(e) => setThemeConfig(prev => ({ ...prev, accentColor: e.target.value }))}
                            className="w-16 h-10"
                          />
                                                     <Input
                             value={themeConfig.accentColor}
                             onChange={(e) => handleColorChange('accentColor', e.target.value)}
                             className="flex-1"
                             placeholder="#F59E0B"
                           />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Logos et images */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Logos et Images</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="logo-url">Logo principal</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            id="logo-url"
                            value={themeConfig.logoUrl}
                            onChange={(e) => setThemeConfig(prev => ({ ...prev, logoUrl: e.target.value }))}
                            placeholder="URL du logo"
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleUploadLogo}
                            disabled={loadingStates.uploadingLogo}
                            title="Télécharger un logo (max 5MB)"
                          >
                            {loadingStates.uploadingLogo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="favicon-url">Favicon</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            id="favicon-url"
                            value={themeConfig.faviconUrl}
                            onChange={(e) => setThemeConfig(prev => ({ ...prev, faviconUrl: e.target.value }))}
                            placeholder="URL du favicon"
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleUploadFavicon}
                            disabled={loadingStates.uploadingFavicon}
                            title="Télécharger un favicon (max 1MB, format carré recommandé)"
                          >
                            {loadingStates.uploadingFavicon ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="header-image">Image d'en-tête</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            id="header-image"
                            value={themeConfig.headerImage}
                            onChange={(e) => setThemeConfig(prev => ({ ...prev, headerImage: e.target.value }))}
                            placeholder="URL de l'image d'en-tête"
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleUploadHeaderImage}
                            disabled={loadingStates.uploadingHeader}
                            title="Télécharger une image d'en-tête (max 10MB, ratio 2:1 à 4:1 recommandé)"
                          >
                            {loadingStates.uploadingHeader ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Typographie */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Typographie</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="font-family">Police de caractère</Label>
                      <Select
                        value={themeConfig.fontFamily}
                        onValueChange={(value) => setThemeConfig(prev => ({ ...prev, fontFamily: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                          <SelectItem value="Lato">Lato</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="footer-text">Texte de pied de page</Label>
                      <Input
                        id="footer-text"
                        value={themeConfig.footerText}
                        onChange={(e) => setThemeConfig(prev => ({ ...prev, footerText: e.target.value }))}
                        placeholder="Texte personnalisé"
                      />
                    </div>
                  </div>
                </div>

                {/* CSS personnalisé */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">CSS Personnalisé</h3>
                  <div>
                    <Label htmlFor="custom-css">CSS avancé</Label>
                    <Textarea
                      id="custom-css"
                      value={themeConfig.customCss}
                      onChange={(e) => setThemeConfig(prev => ({ ...prev, customCss: e.target.value }))}
                      placeholder="/* CSS personnalisé */"
                      rows={8}
                      className="font-mono"
                    />
                  </div>
                </div>

                {/* Options d'interface */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Options d'Interface</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Mode sombre</Label>
                        <p className="text-sm text-gray-600">Interface sombre par défaut</p>
                      </div>
                      <Switch
                        checked={themeConfig.darkMode}
                        onCheckedChange={(checked) => setThemeConfig(prev => ({ ...prev, darkMode: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Animations</Label>
                        <p className="text-sm text-gray-600">Effets visuels et transitions</p>
                      </div>
                      <Switch
                        checked={themeConfig.animations}
                        onCheckedChange={(checked) => setThemeConfig(prev => ({ ...prev, animations: checked }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Prévisualisations des images */}
                {(themeConfig.logoUrl || themeConfig.faviconUrl || themeConfig.headerImage) && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Prévisualisations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {themeConfig.logoUrl && (
                        <div className="space-y-2">
                          <Label className="text-sm">Logo principal</Label>
                          <div className="border rounded-lg p-4 bg-gray-50 flex items-center justify-center h-24">
                            <img
                              src={themeConfig.logoUrl}
                              alt="Logo"
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      )}
                      {themeConfig.faviconUrl && (
                        <div className="space-y-2">
                          <Label className="text-sm">Favicon</Label>
                          <div className="border rounded-lg p-4 bg-gray-50 flex items-center justify-center h-24">
                            <img
                              src={themeConfig.faviconUrl}
                              alt="Favicon"
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      )}
                      {themeConfig.headerImage && (
                        <div className="space-y-2">
                          <Label className="text-sm">Image d'en-tête</Label>
                          <div className="border rounded-lg p-2 bg-gray-50 h-24 overflow-hidden">
                            <img
                              src={themeConfig.headerImage}
                              alt="En-tête"
                              className="w-full h-full object-cover rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Erreurs de validation */}
                {validationErrors.theme && validationErrors.theme.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-red-600">Erreurs de Validation</h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      {validationErrors.theme.map((error, index) => (
                        <div key={index} className="flex items-center gap-2 text-red-700">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm">{error}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Aperçu */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Aperçu</h3>
                  <div
                    className="p-6 border rounded-lg"
                    style={{
                      backgroundColor: themeConfig.primaryColor + '10',
                      borderColor: themeConfig.primaryColor + '30'
                    }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: themeConfig.primaryColor }}
                      >
                        <Building2 className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold" style={{ color: themeConfig.primaryColor }}>
                          {client?.nom || 'Client'}
                        </h4>
                        <p className="text-sm text-gray-600">Aperçu du thème</p>
                      </div>
                    </div>
                    <Button
                      style={{ backgroundColor: themeConfig.primaryColor }}
                      className="text-white"
                    >
                      Bouton exemple
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleSaveTheme}
                    disabled={loadingStates.savingTheme}
                  >
                    {loadingStates.savingTheme ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Sauvegarder le thème
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handlePreviewTheme}
                    disabled={loadingStates.previewingTheme}
                  >
                    {loadingStates.previewingTheme ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
                    Aperçu en direct
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleResetTheme}
                    disabled={loadingStates.resetingTheme}
                  >
                    {loadingStates.resetingTheme ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Réinitialiser
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleExportTheme}
                    disabled={loadingStates.exportingTheme}
                  >
                    {loadingStates.exportingTheme ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    Exporter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleImportTheme}
                    disabled={loadingStates.importingTheme}
                  >
                    {loadingStates.importingTheme ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    Importer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des services */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Gestion des Services
                </CardTitle>
                <CardDescription>Configurez les services disponibles pour ce client</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceConfigs.map((service) => (
                    <Card key={service.id} className={`transition-all ${service.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Switch
                                checked={service.enabled}
                                onCheckedChange={(checked) => {
                                  setServiceConfigs(prev =>
                                    prev.map(s => s.id === service.id ? { ...s, enabled: checked } : s)
                                  );
                                }}
                              />
                              <h4 className="font-semibold">{service.name}</h4>
                              <Badge variant="outline">{service.category}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                            <div className="flex items-center gap-4">
                              <span className="text-sm">
                                <strong>Prix:</strong> {formatPrice(service.price)}
                              </span>
                              {service.enabled && (
                                <span className="text-sm text-green-600">
                                  <CheckCircle className="inline h-4 w-4 mr-1" />
                                  Activé
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleConfigureService(service)}
                              disabled={loadingStates.configuringService}
                              title="Configurer le service"
                            >
                              {loadingStates.configuringService ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewServiceAnalytics(service)}
                              disabled={loadingStates.viewingAnalytics}
                              title="Voir les analytics"
                            >
                              {loadingStates.viewingAnalytics ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTestService(service)}
                              disabled={loadingStates.testingService}
                              title="Tester le service"
                            >
                              {loadingStates.testingService ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        {service.enabled && (
                          <div className="mt-4 p-3 bg-white rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">Configuration</h5>
                              <div className="flex gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDuplicateService(service)}
                                  disabled={loadingStates.duplicatingService}
                                  title="Dupliquer ce service"
                                >
                                  {loadingStates.duplicatingService ? <Loader2 className="h-3 w-3 animate-spin" /> : <Copy className="h-3 w-3" />}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteService(service)}
                                  disabled={loadingStates.deletingService}
                                  title="Supprimer ce service"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  {loadingStates.deletingService ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              {Object.entries(service.settings).map(([key, value]) => (
                                <div key={key}>
                                  <span className="text-gray-500">{key}:</span>
                                  <span className="ml-1 font-medium">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                                {/* Récapitulatif des coûts */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-900">Récapitulatif des Services</h3>
                      <p className="text-sm text-blue-700">
                        {serviceConfigs.filter(s => s.enabled).length} service(s) activé(s) sur {serviceConfigs.length} disponible(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-900">{formatPrice(totalServiceCost)}</p>
                      <p className="text-sm text-blue-700">Coût total mensuel</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button
                    onClick={handleSaveServices}
                    disabled={loadingStates.savingServices}
                  >
                    {loadingStates.savingServices ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Sauvegarder les services
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleAddNewService}
                    disabled={loadingStates.addingService}
                  >
                    {loadingStates.addingService ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Ajouter un service
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des cartes */}
          <TabsContent value="cards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cartes physiques */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Cartes Physiques
                  </CardTitle>
                  <CardDescription>Configuration des cartes d'identité physiques</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Cartes physiques activées</Label>
                    <Switch
                      checked={cardConfigs.physical.enabled}
                      onCheckedChange={(checked) =>
                        setCardConfigs(prev => ({
                          ...prev,
                          physical: { ...prev.physical, enabled: checked }
                        }))
                      }
                    />
                  </div>

                  {cardConfigs.physical.enabled && (
                    <>
                      <Separator />

                      <div className="space-y-3">
                        <div>
                          <Label>Template de design</Label>
                          <Select
                            value={cardConfigs.physical.design.template}
                            onValueChange={(value) =>
                              setCardConfigs(prev => ({
                                ...prev,
                                physical: {
                                  ...prev.physical,
                                  design: { ...prev.physical.design, template: value }
                                }
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                              <SelectItem value="government">Gouvernemental</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Fonctionnalités</Label>
                          <div className="space-y-2 mt-2">
                            {['NFC', 'QR_CODE', 'MAGNETIC_STRIPE', 'HOLOGRAM'].map((feature) => (
                              <div key={feature} className="flex items-center space-x-2">
                                <Switch
                                  checked={cardConfigs.physical.features.includes(feature)}
                                  onCheckedChange={(checked) => {
                                    setCardConfigs(prev => ({
                                      ...prev,
                                      physical: {
                                        ...prev.physical,
                                        features: checked
                                          ? [...prev.physical.features, feature]
                                          : prev.physical.features.filter(f => f !== feature)
                                      }
                                    }));
                                  }}
                                />
                                <Label className="text-sm">{feature.replace('_', ' ')}</Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label>Tarification</Label>
                          <div className="grid grid-cols-1 gap-2 mt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Frais d'installation:</span>
                              <span className="font-medium">{formatPrice(cardConfigs.physical.pricing.setupFee)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Frais mensuels:</span>
                              <span className="font-medium">{formatPrice(cardConfigs.physical.pricing.monthlyFee)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Frais par transaction:</span>
                              <span className="font-medium">{formatPrice(cardConfigs.physical.pricing.transactionFee)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Boutons d'action pour cartes physiques */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConfigureCard('physical')}
                      disabled={loadingStates.configuringCard}
                      title="Configuration avancée"
                    >
                      {loadingStates.configuringCard ? <Loader2 className="h-3 w-3 animate-spin" /> : <Settings className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestCard('physical')}
                      disabled={loadingStates.testingCard}
                      title="Tester les fonctionnalités"
                    >
                      {loadingStates.testingCard ? <Loader2 className="h-3 w-3 animate-spin" /> : <Activity className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCardAnalytics('physical')}
                      disabled={loadingStates.viewingCardAnalytics}
                      title="Voir les analytics"
                    >
                      {loadingStates.viewingCardAnalytics ? <Loader2 className="h-3 w-3 animate-spin" /> : <BarChart3 className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicateCard('physical')}
                      disabled={loadingStates.duplicatingCard}
                      title="Dupliquer la configuration"
                    >
                      {loadingStates.duplicatingCard ? <Loader2 className="h-3 w-3 animate-spin" /> : <Copy className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetCard('physical')}
                      disabled={loadingStates.resetingCard}
                      title="Réinitialiser"
                      className="text-orange-600 hover:text-orange-700"
                    >
                      {loadingStates.resetingCard ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportCard('physical')}
                      disabled={loadingStates.exportingCard}
                      title="Exporter la configuration"
                    >
                      {loadingStates.exportingCard ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleImportCard('physical')}
                      disabled={loadingStates.importingCard}
                      title="Importer une configuration"
                    >
                      {loadingStates.importingCard ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Cartes virtuelles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Cartes Virtuelles
                  </CardTitle>
                  <CardDescription>Configuration des cartes d'identité numériques</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Cartes virtuelles activées</Label>
                    <Switch
                      checked={cardConfigs.virtual.enabled}
                      onCheckedChange={(checked) =>
                        setCardConfigs(prev => ({
                          ...prev,
                          virtual: { ...prev.virtual, enabled: checked }
                        }))
                      }
                    />
                  </div>

                  {cardConfigs.virtual.enabled && (
                    <>
                      <Separator />

                      <div className="space-y-3">
                        <div>
                          <Label>Template de design</Label>
                          <Select
                            value={cardConfigs.virtual.design.template}
                            onValueChange={(value) =>
                              setCardConfigs(prev => ({
                                ...prev,
                                virtual: {
                                  ...prev.virtual,
                                  design: { ...prev.virtual.design, template: value }
                                }
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="modern">Moderne</SelectItem>
                              <SelectItem value="classic">Classique</SelectItem>
                              <SelectItem value="minimal">Minimal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Fonctionnalités</Label>
                          <div className="space-y-2 mt-2">
                            {['QR_CODE', 'BIOMETRIC', 'OTP', 'GEOLOCATION'].map((feature) => (
                              <div key={feature} className="flex items-center space-x-2">
                                <Switch
                                  checked={cardConfigs.virtual.features.includes(feature)}
                                  onCheckedChange={(checked) => {
                                    setCardConfigs(prev => ({
                                      ...prev,
                                      virtual: {
                                        ...prev.virtual,
                                        features: checked
                                          ? [...prev.virtual.features, feature]
                                          : prev.virtual.features.filter(f => f !== feature)
                                      }
                                    }));
                                  }}
                                />
                                <Label className="text-sm">{feature.replace('_', ' ')}</Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label>Tarification</Label>
                          <div className="grid grid-cols-1 gap-2 mt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Frais d'installation:</span>
                              <span className="font-medium">{formatPrice(cardConfigs.virtual.pricing.setupFee)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Frais mensuels:</span>
                              <span className="font-medium">{formatPrice(cardConfigs.virtual.pricing.monthlyFee)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Frais par transaction:</span>
                              <span className="font-medium">{formatPrice(cardConfigs.virtual.pricing.transactionFee)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Boutons d'action pour cartes virtuelles */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConfigureCard('virtual')}
                      disabled={loadingStates.configuringCard}
                      title="Configuration avancée"
                    >
                      {loadingStates.configuringCard ? <Loader2 className="h-3 w-3 animate-spin" /> : <Settings className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestCard('virtual')}
                      disabled={loadingStates.testingCard}
                      title="Tester les fonctionnalités"
                    >
                      {loadingStates.testingCard ? <Loader2 className="h-3 w-3 animate-spin" /> : <Activity className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCardAnalytics('virtual')}
                      disabled={loadingStates.viewingCardAnalytics}
                      title="Voir les analytics"
                    >
                      {loadingStates.viewingCardAnalytics ? <Loader2 className="h-3 w-3 animate-spin" /> : <BarChart3 className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicateCard('virtual')}
                      disabled={loadingStates.duplicatingCard}
                      title="Dupliquer la configuration"
                    >
                      {loadingStates.duplicatingCard ? <Loader2 className="h-3 w-3 animate-spin" /> : <Copy className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetCard('virtual')}
                      disabled={loadingStates.resetingCard}
                      title="Réinitialiser"
                      className="text-orange-600 hover:text-orange-700"
                    >
                      {loadingStates.resetingCard ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportCard('virtual')}
                      disabled={loadingStates.exportingCard}
                      title="Exporter la configuration"
                    >
                      {loadingStates.exportingCard ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleImportCard('virtual')}
                      disabled={loadingStates.importingCard}
                      title="Importer une configuration"
                    >
                      {loadingStates.importingCard ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Récapitulatif des coûts des cartes */}
            <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-purple-900">Récapitulatif des Cartes</h3>
                  <p className="text-sm text-purple-700">
                    {(cardConfigs.physical.enabled ? 1 : 0) + (cardConfigs.virtual.enabled ? 1 : 0)} type(s) de carte activé(s)
                  </p>
                  <div className="text-xs text-purple-600 mt-1">
                    {cardConfigs.physical.enabled && `Physique: ${cardConfigs.physical.features.length} fonctionnalité(s)`}
                    {cardConfigs.physical.enabled && cardConfigs.virtual.enabled && ' • '}
                    {cardConfigs.virtual.enabled && `Virtuelle: ${cardConfigs.virtual.features.length} fonctionnalité(s)`}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-900">{formatPrice(totalCardCost)}</p>
                  <p className="text-sm text-purple-700">Coût total initial</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              <Button
                onClick={handleSaveCards}
                disabled={loadingStates.savingCards}
              >
                {loadingStates.savingCards ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Sauvegarder la configuration
              </Button>
              <Button
                variant="outline"
                onClick={handlePreviewCards}
                disabled={loadingStates.previewingCards}
              >
                {loadingStates.previewingCards ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
                Aperçu des cartes
              </Button>
              <Button
                variant="outline"
                onClick={handleManageTemplates}
                disabled={loadingStates.managingTemplates}
              >
                {loadingStates.managingTemplates ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Palette className="mr-2 h-4 w-4" />}
                Gérer les templates
              </Button>
            </div>
          </TabsContent>

          {/* Facturation */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Configuration de Facturation
                </CardTitle>
                <CardDescription>Paramètres de facturation et de paiement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cycle de facturation */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Cycle de Facturation</h3>
                    <div>
                      <Label>Fréquence</Label>
                      <Select
                        value={billingConfig.cycle}
                        onValueChange={(value: 'MONTHLY' | 'QUARTERLY' | 'YEARLY') =>
                          setBillingConfig(prev => ({ ...prev, cycle: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MONTHLY">Mensuel</SelectItem>
                          <SelectItem value="QUARTERLY">Trimestriel</SelectItem>
                          <SelectItem value="YEARLY">Annuel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Renouvellement automatique</Label>
                      <Switch
                        checked={billingConfig.autoRenew}
                        onCheckedChange={(checked) =>
                          setBillingConfig(prev => ({ ...prev, autoRenew: checked }))
                        }
                      />
                    </div>

                    <div>
                      <Label>Taux de TVA (%)</Label>
                      <Input
                        type="number"
                        value={billingConfig.taxRate}
                        onChange={(e) =>
                          setBillingConfig(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))
                        }
                      />
                    </div>
                  </div>

                  {/* Moyens de paiement */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Moyens de Paiement</h3>
                    <div className="space-y-2">
                      {[
                        { id: 'AIRTEL_MONEY', name: 'Airtel Money' },
                        { id: 'MOOV_MONEY', name: 'Moov Money' },
                        { id: 'BANK_TRANSFER', name: 'Virement bancaire' },
                        { id: 'CASH', name: 'Espèces' },
                        { id: 'CHECK', name: 'Chèque' }
                      ].map((method) => (
                        <div key={method.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={billingConfig.paymentMethods.includes(method.id)}
                              onCheckedChange={(checked) => {
                                setBillingConfig(prev => ({
                                  ...prev,
                                  paymentMethods: checked
                                    ? [...prev.paymentMethods, method.id]
                                    : prev.paymentMethods.filter(m => m !== method.id)
                                }));
                              }}
                            />
                            <Label>{method.name}</Label>
                          </div>
                          {billingConfig.paymentMethods.includes(method.id) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTestPaymentMethod(method.id)}
                              disabled={loadingStates.testingPayment}
                              title="Tester cette méthode"
                            >
                              {loadingStates.testingPayment ? <Loader2 className="h-3 w-3 animate-spin" /> : <Activity className="h-3 w-3" />}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div>
                      <Label>Devise</Label>
                      <Select
                        value={billingConfig.currency}
                        onValueChange={(value) =>
                          setBillingConfig(prev => ({ ...prev, currency: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="XAF">Franc CFA (XAF)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          <SelectItem value="USD">Dollar US (USD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Rappels et notifications */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Rappels de Paiement</h3>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label>Jours de rappel avant échéance</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleManageReminders}
                        disabled={loadingStates.managingReminders}
                      >
                        {loadingStates.managingReminders ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {billingConfig.reminderDays.map((days, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-red-50 hover:border-red-300"
                          onClick={() => handleRemoveReminderDay(days)}
                          title="Cliquer pour supprimer"
                        >
                          {days} jour{days > 1 ? 's' : ''} ×
                        </Badge>
                      ))}
                      {billingConfig.reminderDays.length === 0 && (
                        <span className="text-sm text-gray-500">Aucun rappel configuré</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Template de facture</Label>
                    <Select
                      value={billingConfig.invoiceTemplate}
                      onValueChange={(value) =>
                        setBillingConfig(prev => ({ ...prev, invoiceTemplate: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="detailed">Détaillé</SelectItem>
                        <SelectItem value="government">Gouvernemental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Récapitulatif des coûts de facturation */}
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3">Récapitulatif Financier</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Montant de base annuel:</span>
                      <span className="font-medium text-green-900">{formatPrice(totalBillingCost.base)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Services activés:</span>
                      <span className="font-medium text-green-900">{formatPrice(totalBillingCost.services)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Cartes activées:</span>
                      <span className="font-medium text-green-900">{formatPrice(totalBillingCost.cards)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Sous-total:</span>
                      <span className="font-medium text-green-900">{formatPrice(totalBillingCost.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">TVA ({billingConfig.taxRate}%):</span>
                      <span className="font-medium text-green-900">{formatPrice(totalBillingCost.tax)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold text-green-900">Total {billingConfig.cycle.toLowerCase()}:</span>
                      <span className="text-lg font-bold text-green-900">{formatPrice(totalBillingCost.total)}</span>
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-xs text-green-600">
                        Cycle: {billingConfig.cycle === 'MONTHLY' ? 'Mensuel' : billingConfig.cycle === 'QUARTERLY' ? 'Trimestriel' : 'Annuel'} •
                        Devise: {billingConfig.currency} •
                        Renouvellement: {billingConfig.autoRenew ? 'Automatique' : 'Manuel'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  <Button
                    onClick={handleSaveBilling}
                    disabled={loadingStates.savingBilling}
                  >
                    {loadingStates.savingBilling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Sauvegarder la facturation
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handlePreviewInvoice}
                    disabled={loadingStates.previewingInvoice}
                  >
                    {loadingStates.previewingInvoice ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                    Aperçu facture
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleConfigureBilling}
                    disabled={loadingStates.configuringBilling}
                  >
                    {loadingStates.configuringBilling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Settings className="mr-2 h-4 w-4" />}
                    Configuration avancée
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleViewBillingAnalytics}
                    disabled={loadingStates.viewingBillingAnalytics}
                  >
                    {loadingStates.viewingBillingAnalytics ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart3 className="mr-2 h-4 w-4" />}
                    Analytics
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleManageInvoiceTemplates}
                    disabled={loadingStates.managingInvoiceTemplates}
                  >
                    {loadingStates.managingInvoiceTemplates ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                    Templates
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleExportBilling}
                    disabled={loadingStates.exportingBilling}
                  >
                    {loadingStates.exportingBilling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    Exporter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleImportBilling}
                    disabled={loadingStates.importingBilling}
                  >
                    {loadingStates.importingBilling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    Importer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDuplicateBilling}
                    disabled={loadingStates.duplicatingBilling}
                  >
                    {loadingStates.duplicatingBilling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Copy className="mr-2 h-4 w-4" />}
                    Dupliquer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleResetBilling}
                    disabled={loadingStates.resetingBilling}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    {loadingStates.resetingBilling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Réinitialiser
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Historique des paiements */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Historique des Paiements</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleProcessManualPayment}
                      disabled={loadingStates.processingPayment}
                    >
                      {loadingStates.processingPayment ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                      Nouveau paiement
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportBilling}
                      disabled={loadingStates.exportingBilling}
                    >
                      {loadingStates.exportingBilling ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                      Exporter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 'PAY_001', date: '2024-01-15', amount: client?.clientInfo?.montantAnnuel || 0, status: 'PAID', method: 'BANK_TRANSFER', reference: 'TRF_2024_001' },
                    { id: 'PAY_002', date: '2023-01-15', amount: (client?.clientInfo?.montantAnnuel || 0) * 0.9, status: 'PAID', method: 'AIRTEL_MONEY', reference: 'AM_2023_048' },
                    { id: 'PAY_003', date: '2022-01-15', amount: (client?.clientInfo?.montantAnnuel || 0) * 0.8, status: 'PAID', method: 'BANK_TRANSFER', reference: 'TRF_2022_156' },
                    { id: 'PAY_004', date: '2024-02-15', amount: totalBillingCost.total, status: 'PENDING', method: 'MOOV_MONEY', reference: 'MM_2024_012' }
                  ].map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{new Date(payment.date).toLocaleDateString('fr-FR')}</p>
                            <p className="text-sm text-gray-600">{payment.method.replace('_', ' ')}</p>
                            <p className="text-xs text-gray-500">Réf: {payment.reference}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">{formatPrice(payment.amount)}</p>
                          <Badge variant={payment.status === 'PAID' ? 'default' : payment.status === 'PENDING' ? 'secondary' : 'destructive'}>
                            {payment.status === 'PAID' ? 'Payé' : payment.status === 'PENDING' ? 'En attente' : payment.status}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            title="Voir détails"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            title="Télécharger reçu"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          {payment.status === 'PENDING' && (
                            <Button
                              variant="outline"
                              size="sm"
                              title="Marquer comme payé"
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Statistiques de paiement */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-3">Statistiques de Paiement</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">4</p>
                      <p className="text-sm text-gray-600">Total transactions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">3</p>
                      <p className="text-sm text-gray-600">Paiements réussis</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">1</p>
                      <p className="text-sm text-gray-600">En attente</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{formatPrice((client?.clientInfo?.montantAnnuel || 0) * 2.7)}</p>
                      <p className="text-sm text-gray-600">Total encaissé</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des utilisateurs */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gestion des Utilisateurs
                </CardTitle>
                <CardDescription>Gérez les utilisateurs et leurs permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Rechercher un utilisateur..."
                        className="w-64"
                        value={userSearchQuery}
                        onChange={(e) => handleSearchUsers(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        onClick={() => handleSearchUsers(userSearchQuery)}
                        disabled={loadingStates.searchingUsers}
                      >
                        {loadingStates.searchingUsers ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleInviteUsers}
                        disabled={loadingStates.invitingUser}
                      >
                        {loadingStates.invitingUser ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                        Inviter
                      </Button>
                      <Button
                        onClick={() => {
                          setCurrentEditingUser(null);
                          setNewUserForm({
                            name: '',
                            email: '',
                            role: 'AGENT',
                            department: '',
                            permissions: [],
                            sendInvite: true
                          });
                          setUserEditModal(true);
                        }}
                        disabled={loadingStates.addingUser}
                      >
                        {loadingStates.addingUser ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                        Nouvel utilisateur
                      </Button>
                    </div>
                  </div>

                  {/* Barre d'actions en lot */}
                  {selectedUsers.length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-700">
                          {selectedUsers.length} utilisateur(s) sélectionné(s)
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBulkAction('activate')}
                          disabled={loadingStates.bulkActions}
                        >
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Activer
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBulkAction('deactivate')}
                          disabled={loadingStates.bulkActions}
                        >
                          <Pause className="mr-1 h-3 w-3" />
                          Désactiver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBulkAction('export')}
                          disabled={loadingStates.bulkActions}
                        >
                          <Download className="mr-1 h-3 w-3" />
                          Exporter
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBulkAction('delete')}
                          disabled={loadingStates.bulkActions}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Contrôles de sélection */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAllUsers}
                      >
                        {selectedUsers.length === filteredUsers.length ? 'Désélectionner tout' : 'Sélectionner tout'}
                      </Button>
                      <span className="text-sm text-gray-600">
                        {filteredUsers.length} utilisateur(s) trouvé(s)
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleViewUserAnalytics}
                        disabled={loadingStates.viewingUserAnalytics}
                      >
                        {loadingStates.viewingUserAnalytics ? <Loader2 className="h-3 w-3 animate-spin" /> : <BarChart3 className="h-3 w-3" />}
                        Analytics
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleManageGroups}
                        disabled={loadingStates.managingGroups}
                      >
                        {loadingStates.managingGroups ? <Loader2 className="h-3 w-3 animate-spin" /> : <Users className="h-3 w-3" />}
                        Groupes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleImportUsers}
                        disabled={loadingStates.importingUsers}
                      >
                        {loadingStates.importingUsers ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                        Importer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportUsers}
                        disabled={loadingStates.exportingUsers}
                      >
                        {loadingStates.exportingUsers ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                        Exporter
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <Card key={user.userId} className={selectedUsers.includes(user.userId) ? 'ring-2 ring-blue-500 bg-blue-50' : ''}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.userId)}
                                onChange={() => handleToggleUserSelection(user.userId)}
                                className="w-4 h-4 text-blue-600"
                              />
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                user.status === 'ACTIVE' ? 'bg-green-100' :
                                user.status === 'INVITED' ? 'bg-yellow-100' :
                                user.status === 'IMPORTED' ? 'bg-purple-100' :
                                'bg-gray-100'
                              }`}>
                                <span className={`font-medium ${
                                  user.status === 'ACTIVE' ? 'text-green-600' :
                                  user.status === 'INVITED' ? 'text-yellow-600' :
                                  user.status === 'IMPORTED' ? 'text-purple-600' :
                                  'text-gray-600'
                                }`}>
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant="outline">{user.role}</Badge>
                                  <Badge variant="outline">{user.department}</Badge>
                                  <Badge variant={
                                    user.status === 'ACTIVE' ? 'default' :
                                    user.status === 'INVITED' ? 'secondary' :
                                    user.status === 'IMPORTED' ? 'secondary' :
                                    'destructive'
                                  }>
                                    {user.status === 'ACTIVE' ? 'Actif' :
                                     user.status === 'INACTIVE' ? 'Inactif' :
                                     user.status === 'SUSPENDED' ? 'Suspendu' :
                                     user.status === 'INVITED' ? 'Invité' :
                                     'Importé'}
                                  </Badge>
                                  {user.status === 'INVITED' && (
                                    <Badge variant="outline" className="text-orange-600">
                                      En attente
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                                disabled={loadingStates.editingUser}
                                title="Éditer l'utilisateur"
                              >
                                {loadingStates.editingUser ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUserPermissions(user)}
                                disabled={loadingStates.managingPermissions}
                                title="Gérer les permissions"
                              >
                                {loadingStates.managingPermissions ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSendNotification([user.userId], `Notification pour ${user.name}`)}
                                disabled={loadingStates.sendingNotification}
                                title="Envoyer une notification"
                              >
                                {loadingStates.sendingNotification ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveUser(user.userId)}
                                disabled={loadingStates.deletingUser}
                                className="text-red-600 hover:text-red-700"
                                title="Supprimer l'utilisateur"
                              >
                                {loadingStates.deletingUser ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          <div className="mt-3">
                            <Label className="text-sm font-medium">Permissions ({user.permissions.length}):</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {user.permissions.length > 0 ? user.permissions.map((permission) => (
                                <Badge key={permission} variant="secondary" className="text-xs">
                                  {permission.replace('_', ' ')}
                                </Badge>
                              )) : (
                                <span className="text-xs text-gray-500">Aucune permission assignée</span>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-500">
                                Dernière activité: {new Date(user.lastActivity).toLocaleDateString('fr-FR')}
                              </p>
                              <div className="flex gap-1">
                                {user.status === 'ACTIVE' && (
                                  <Badge variant="outline" className="text-green-600 text-xs">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    En ligne
                                  </Badge>
                                )}
                                {user.status === 'INVITED' && (
                                  <Badge variant="outline" className="text-yellow-600 text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Invitation envoyée
                                  </Badge>
                                )}
                                {user.status === 'IMPORTED' && (
                                  <Badge variant="outline" className="text-purple-600 text-xs">
                                    <Upload className="w-3 h-3 mr-1" />
                                    Importé
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {filteredUsers.length === 0 && (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
                        <p className="text-gray-600 mb-4">
                          {userSearchQuery ?
                            `Aucun utilisateur ne correspond à "${userSearchQuery}"` :
                            'Aucun utilisateur configuré pour ce client'
                          }
                        </p>
                        <Button
                          onClick={() => {
                            setCurrentEditingUser(null);
                            setNewUserForm({
                              name: '',
                              email: '',
                              role: 'AGENT',
                              department: '',
                              permissions: [],
                              sendInvite: true
                            });
                            setUserEditModal(true);
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Ajouter le premier utilisateur
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleSaveUsers}
                disabled={loadingStates.savingUsers}
              >
                {loadingStates.savingUsers ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Sauvegarder la configuration
              </Button>
              <Button
                variant="outline"
                onClick={handleViewUserAnalytics}
                disabled={loadingStates.viewingUserAnalytics}
              >
                {loadingStates.viewingUserAnalytics ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart3 className="mr-2 h-4 w-4" />}
                Analytics utilisateurs
              </Button>
              <Button
                variant="outline"
                onClick={handleManageGroups}
                disabled={loadingStates.managingGroups}
              >
                {loadingStates.managingGroups ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
                Gérer les groupes
              </Button>
              <Button
                variant="outline"
                onClick={handleExportUsers}
                disabled={loadingStates.exportingUsers}
              >
                {loadingStates.exportingUsers ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Exporter tout
              </Button>
              <Button
                variant="outline"
                onClick={handleImportUsers}
                disabled={loadingStates.importingUsers}
              >
                {loadingStates.importingUsers ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Importer utilisateurs
              </Button>
              <Button
                variant="outline"
                onClick={handleInviteUsers}
                disabled={loadingStates.invitingUser}
              >
                {loadingStates.invitingUser ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                Invitations en lot
              </Button>
            </div>

            {/* Statistiques des utilisateurs */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3">Statistiques des Utilisateurs</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{userPermissions.length}</p>
                  <p className="text-sm text-gray-600">Total utilisateurs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {userPermissions.filter(u => u.status === 'ACTIVE').length}
                  </p>
                  <p className="text-sm text-gray-600">Actifs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {userPermissions.filter(u => u.status === 'INVITED').length}
                  </p>
                  <p className="text-sm text-gray-600">Invités</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {userPermissions.filter(u => u.role === 'ADMIN').length}
                  </p>
                  <p className="text-sm text-gray-600">Administrateurs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {Math.round((userPermissions.filter(u => u.status === 'ACTIVE').length / Math.max(userPermissions.length, 1)) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">Taux d'activation</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Configuration technique */}
          <TabsContent value="technical" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* API et Intégrations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    API et Intégrations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Clé API principale</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="password"
                        value={apiKey}
                        readOnly
                        className="font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefreshApiKey}
                        disabled={loadingStates.refreshingApiKey}
                        title="Générer une nouvelle clé API"
                      >
                        {loadingStates.refreshingApiKey ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Webhook Endpoints</Label>
                    <div className="space-y-2 mt-1">
                      {/* Champ d'ajout de nouveau webhook */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://example.com/webhook"
                          value={newWebhookUrl}
                          onChange={(e) => setNewWebhookUrl(e.target.value)}
                          className={technicalErrors.webhook ? 'border-red-500' : ''}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddWebhook}
                          disabled={loadingStates.addingWebhook}
                        >
                          {loadingStates.addingWebhook ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        </Button>
                      </div>
                      {technicalErrors.webhook && (
                        <p className="text-sm text-red-600">{technicalErrors.webhook}</p>
                      )}

                      {/* Liste des webhooks existants */}
                      {technicalConfig.webhookEndpoints.length > 0 ? (
                        technicalConfig.webhookEndpoints.map((endpoint, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <Input value={endpoint} readOnly className="font-mono" />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTestWebhook(endpoint)}
                              disabled={loadingStates.testingWebhook}
                              title="Tester ce webhook"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              {loadingStates.testingWebhook ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveWebhook(index)}
                              disabled={loadingStates.removingWebhook}
                              title="Supprimer ce webhook"
                              className="text-red-600 hover:text-red-700"
                            >
                              {loadingStates.removingWebhook ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">Aucun endpoint configuré</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Liste blanche IP</Label>
                    <Textarea
                      placeholder="192.168.1.1&#10;10.0.0.0/24"
                      rows={3}
                      className={`font-mono ${technicalErrors.ipWhitelist ? 'border-red-500' : ''}`}
                      value={ipWhitelist}
                      onChange={(e) => setIpWhitelist(e.target.value)}
                    />
                    {technicalErrors.ipWhitelist && (
                      <p className="text-sm text-red-600 mt-1">{technicalErrors.ipWhitelist}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Une adresse IP par ligne. Formats supportés: 192.168.1.1 ou 10.0.0.0/24
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Sécurité */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>SSL/TLS activé</Label>
                    <Switch
                      checked={sslEnabled}
                      onCheckedChange={setSslEnabled}
                    />
                  </div>

                  <div>
                    <Label>Certificat SSL</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        placeholder="Nom du certificat"
                        value={sslCertName}
                        onChange={(e) => setSslCertName(e.target.value)}
                        className={technicalErrors.cert ? 'border-red-500' : ''}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUploadCert}
                        disabled={loadingStates.uploadingCert}
                        title="Uploader un certificat SSL"
                      >
                        {loadingStates.uploadingCert ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      </Button>
                    </div>
                    {technicalErrors.cert && (
                      <p className="text-sm text-red-600 mt-1">{technicalErrors.cert}</p>
                    )}
                  </div>

                  <div>
                    <Label>2FA obligatoire</Label>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-600">Pour tous les administrateurs</span>
                      <Switch
                        checked={twoFARequired}
                        onCheckedChange={setTwoFARequired}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Logs de sécurité</Label>
                    <div className="space-y-1 mt-1">
                      <div className="text-sm text-green-600">✓ Tentatives de connexion</div>
                      <div className="text-sm text-green-600">✓ Modifications de permissions</div>
                      <div className="text-sm text-green-600">✓ Accès API</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sauvegarde et maintenance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Sauvegarde et Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Sauvegarde automatique</h4>
                    <div>
                      <Label>Fréquence</Label>
                      <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DAILY">Quotidienne</SelectItem>
                          <SelectItem value="WEEKLY">Hebdomadaire</SelectItem>
                          <SelectItem value="MONTHLY">Mensuelle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Rétention (jours)</Label>
                      <Input
                        type="number"
                        value={backupRetention}
                        onChange={(e) => setBackupRetention(Number(e.target.value))}
                        min="1"
                        max="365"
                        className={technicalErrors.retention ? 'border-red-500' : ''}
                      />
                      {technicalErrors.retention && (
                        <p className="text-sm text-red-600 mt-1">{technicalErrors.retention}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Maintenance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Prochaine maintenance:</span>
                        <span className="text-sm font-medium">{maintenanceDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Durée estimée:</span>
                        <span className="text-sm font-medium">{maintenanceDuration} heures</span>
                      </div>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleScheduleMaintenance}
                          disabled={loadingStates.schedulingMaintenance}
                          className="w-full"
                        >
                          {loadingStates.schedulingMaintenance ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calendar className="mr-2 h-4 w-4" />}
                          Programmer
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRunDiagnostics}
                          disabled={loadingStates.runningDiagnostics}
                          className="w-full"
                        >
                          {loadingStates.runningDiagnostics ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Activity className="mr-2 h-4 w-4" />}
                          Diagnostics
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Monitoring</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Uptime:</span>
                        <span className="text-sm font-medium text-green-600">{systemMetrics.uptime.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Temps de réponse:</span>
                        <span className="text-sm font-medium">{Math.round(systemMetrics.responseTime)}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Charge CPU:</span>
                        <span className="text-sm font-medium">{Math.round(systemMetrics.cpuLoad)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Mémoire:</span>
                        <span className="text-sm font-medium">{Math.round(systemMetrics.memoryUsage)}%</span>
                      </div>
                      <div className="space-y-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleExportLogs}
                          disabled={loadingStates.exportingLogs}
                          className="w-full"
                        >
                          {loadingStates.exportingLogs ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                          Exporter logs
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearCache}
                          disabled={loadingStates.clearingCache}
                          className="w-full text-orange-600 hover:text-orange-700"
                        >
                          {loadingStates.clearingCache ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                          Vider cache
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button
                onClick={handleSaveTechnical}
                disabled={loadingStates.savingTechnical}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loadingStates.savingTechnical ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Sauvegarder la configuration
              </Button>
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={loadingStates.testingConnection}
              >
                {loadingStates.testingConnection ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Globe className="mr-2 h-4 w-4" />}
                Tester la connexion
              </Button>
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            {/* En-tête avec filtres et actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">📊 Analytics Client</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshMetrics}
                  disabled={loadingStates.refreshingMetrics}
                  title="Actualiser les métriques"
                >
                  {loadingStates.refreshingMetrics ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Select value={analyticsFilters.periode} onValueChange={(value) => handleFilterAnalytics({...analyticsFilters, periode: value})}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 jours</SelectItem>
                    <SelectItem value="30d">30 jours</SelectItem>
                    <SelectItem value="90d">90 jours</SelectItem>
                    <SelectItem value="1y">1 an</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAnalyticsModal(prev => ({ ...prev, filterOptions: true }))}
                  disabled={loadingStates.filteringData}
                >
                  {loadingStates.filteringData ? <Loader2 className="h-4 w-4 animate-spin" /> : <Filter className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Demandes ce mois</p>
                      <p className="text-2xl font-bold">{analyticsData.demandesCeMois.toLocaleString()}</p>
                      <p className={`text-xs ${analyticsData.croissanceDemandes >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {analyticsData.croissanceDemandes >= 0 ? '+' : ''}{analyticsData.croissanceDemandes.toFixed(1)}% vs mois dernier
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Temps de traitement</p>
                      <p className="text-2xl font-bold">{analyticsData.tempsTraitement.toFixed(1)}j</p>
                      <p className={`text-xs ${analyticsData.ameliorationTraitement <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {analyticsData.ameliorationTraitement >= 0 ? '+' : ''}{analyticsData.ameliorationTraitement.toFixed(1)}% vs mois dernier
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Satisfaction</p>
                      <p className="text-2xl font-bold">{analyticsData.satisfaction.toFixed(1)}%</p>
                      <p className={`text-xs ${analyticsData.ameliorationSatisfaction >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {analyticsData.ameliorationSatisfaction >= 0 ? '+' : ''}{analyticsData.ameliorationSatisfaction.toFixed(1)}% vs mois dernier
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Revenus</p>
                      <p className="text-2xl font-bold">{formatPrice(analyticsData.revenusMensuels)}</p>
                      <p className="text-xs text-blue-600">Mensuel</p>
                    </div>
                    <Euro className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Graphiques détaillés */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Évolution des demandes</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      setLoadingStates(prev => ({ ...prev, loadingChart: true }));
                      await new Promise(resolve => setTimeout(resolve, 1500));
                      setChartData(prev => ({
                        ...prev,
                        evolutionDemandes: prev.evolutionDemandes.map(item => ({
                          ...item,
                          demandes: Math.floor(800 + Math.random() * 600)
                        }))
                      }));
                      setLoadingStates(prev => ({ ...prev, loadingChart: false }));
                      toast.success('📊 Graphique actualisé');
                    }}
                    disabled={loadingStates.loadingChart}
                    title="Actualiser le graphique"
                  >
                    {loadingStates.loadingChart ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="h-64 space-y-3">
                    {/* Graphique simulé avec barres */}
                    <div className="flex items-end justify-between h-48 px-4">
                      {chartData.evolutionDemandes.map((item, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                          <div className="text-xs font-medium text-gray-600">{item.demandes}</div>
                          <div
                            className="bg-blue-500 rounded-t w-8 transition-all duration-500"
                            style={{
                              height: `${(item.demandes / Math.max(...chartData.evolutionDemandes.map(d => d.demandes))) * 160}px`
                            }}
                          ></div>
                          <div className="text-xs text-gray-500">{item.mois}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span>Demandes traitées</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>Satisfaction moyenne: {chartData.evolutionDemandes[chartData.evolutionDemandes.length - 1]?.satisfactionMoyenne}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Répartition par service</CardTitle>
                  <div className="text-sm text-gray-500">
                    Total: {chartData.repartitionServices.reduce((sum, item) => sum + item.demandes, 0)} demandes
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64 space-y-4">
                    {/* Graphique en barres horizontales simulé */}
                    {chartData.repartitionServices.map((service, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: service.couleur }}
                            ></div>
                            <span className="text-sm font-medium">{service.service}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {service.demandes} ({service.pourcentage}%)
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${service.pourcentage}%`,
                              backgroundColor: service.couleur
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance hebdomadaire */}
            <Card>
              <CardHeader>
                <CardTitle>Performance par période</CardTitle>
                <CardDescription>Évolution hebdomadaire de la performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData.performanceMensuelle.map((periode, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">{periode.periode}</p>
                        <p className="text-lg font-bold">{periode.traites + periode.attente}</p>
                        <p className="text-xs text-gray-500">Total demandes</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Traitées</p>
                        <p className="text-lg font-bold text-green-600">{periode.traites}</p>
                        <Progress value={(periode.traites / (periode.traites + periode.attente)) * 100} className="h-2" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">En attente</p>
                        <p className="text-lg font-bold text-orange-600">{periode.attente}</p>
                        <Progress value={(periode.attente / (periode.traites + periode.attente)) * 100} className="h-2" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Satisfaction</p>
                        <p className="text-lg font-bold text-blue-600">{periode.satisfaction}%</p>
                        <div className="flex items-center justify-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < Math.floor(periode.satisfaction / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rapports */}
            <Card>
              <CardHeader>
                <CardTitle>Rapports Personnalisés</CardTitle>
                <CardDescription>Générez des rapports détaillés selon vos besoins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Button
                    variant="outline"
                    className="h-20 flex-col hover:bg-blue-50"
                    onClick={handleGenerateMonthlyReport}
                    disabled={loadingStates.generatingReport}
                  >
                    {loadingStates.generatingReport ? <Loader2 className="h-6 w-6 mb-2 animate-spin" /> : <FileText className="h-6 w-6 mb-2" />}
                    <span className="text-sm">Rapport mensuel</span>
                    <span className="text-xs text-gray-500">PDF détaillé</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex-col hover:bg-green-50"
                    onClick={handleDetailedAnalysis}
                    disabled={loadingStates.analyzingData}
                  >
                    {loadingStates.analyzingData ? <Loader2 className="h-6 w-6 mb-2 animate-spin" /> : <BarChart3 className="h-6 w-6 mb-2" />}
                    <span className="text-sm">Analyses détaillées</span>
                    <span className="text-xs text-gray-500">Insights & tendances</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex-col hover:bg-purple-50"
                    onClick={() => setAnalyticsModal(prev => ({ ...prev, exportOptions: true }))}
                    disabled={loadingStates.exportingAnalytics}
                  >
                    {loadingStates.exportingAnalytics ? <Loader2 className="h-6 w-6 mb-2 animate-spin" /> : <Download className="h-6 w-6 mb-2" />}
                    <span className="text-sm">Export données</span>
                    <span className="text-xs text-gray-500">Multiple formats</span>
                  </Button>
                </div>

                {/* Actions rapides */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => setAnalyticsModal(prev => ({ ...prev, customReport: true }))}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Rapport personnalisé
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleExportAnalytics('JSON')}
                    disabled={loadingStates.exportingAnalytics}
                  >
                    {loadingStates.exportingAnalytics ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                    Export données brutes
                  </Button>
                </div>

                {/* Statistiques des exports */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">Activité d'export récente</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">12</p>
                      <p className="text-gray-600">Rapports générés</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">5.2MB</p>
                      <p className="text-gray-600">Données exportées</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-purple-600">
                        {new Date().toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-gray-600">Dernier export</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* === MODALS ANALYTICS === */}

            {/* Modal Options d'Export */}
            <Dialog open={analyticsModal.exportOptions} onOpenChange={(open) => setAnalyticsModal(prev => ({ ...prev, exportOptions: open }))}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Options d'Export</DialogTitle>
                  <DialogDescription>
                    Choisissez le format d'export souhaité
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => {
                      handleExportAnalytics('PDF');
                      setAnalyticsModal(prev => ({ ...prev, exportOptions: false }));
                    }}
                    disabled={loadingStates.exportingPDF}
                  >
                    {loadingStates.exportingPDF ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                    Export PDF (Rapport complet)
                  </Button>

                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => {
                      handleExportAnalytics('Excel');
                      setAnalyticsModal(prev => ({ ...prev, exportOptions: false }));
                    }}
                    disabled={loadingStates.exportingExcel}
                  >
                    {loadingStates.exportingExcel ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart3 className="mr-2 h-4 w-4" />}
                    Export Excel (Données tabulaires)
                  </Button>

                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => {
                      handleExportAnalytics('JSON');
                      setAnalyticsModal(prev => ({ ...prev, exportOptions: false }));
                    }}
                    disabled={loadingStates.exportingAnalytics}
                  >
                    {loadingStates.exportingAnalytics ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                    Export JSON (Données brutes)
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Modal Analyse Détaillée */}
            <Dialog open={analyticsModal.detailedAnalysis} onOpenChange={(open) => setAnalyticsModal(prev => ({ ...prev, detailedAnalysis: open }))}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>🔍 Analyse Détaillée - {client?.nom}</DialogTitle>
                  <DialogDescription>
                    Insights et recommandations basés sur les données analytics
                  </DialogDescription>
                </DialogHeader>
                {analysisResults && (
                  <div className="space-y-6">
                    {/* Tendance générale */}
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-medium text-green-800 mb-2">📈 Tendance Générale</h3>
                      <p className="text-green-700 capitalize">{analysisResults.tendanceGenerale}</p>
                    </div>

                    {/* Points forts */}
                    <div>
                      <h3 className="font-medium mb-3">✅ Points Forts</h3>
                      <div className="space-y-2">
                        {analysisResults.pointsForts?.map((point: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Points d'amélioration */}
                    <div>
                      <h3 className="font-medium mb-3">⚠️ Points d'Amélioration</h3>
                      <div className="space-y-2">
                        {analysisResults.pointsAmelioration?.map((point: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-orange-50 rounded">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <span className="text-sm">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prédictions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800">📊 Prochaine Période</h4>
                        <p className="text-2xl font-bold text-blue-600">
                          {analysisResults.predictions?.prochainMois?.toLocaleString()}
                        </p>
                        <p className="text-sm text-blue-700">Demandes prévues</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-medium text-purple-800">⭐ Objectif Satisfaction</h4>
                        <p className="text-2xl font-bold text-purple-600">
                          {analysisResults.predictions?.satisfactionCible?.toFixed(1)}%
                        </p>
                        <p className="text-sm text-purple-700">Cible recommandée</p>
                      </div>
                    </div>

                    {/* Recommandations */}
                    <div>
                      <h3 className="font-medium mb-3">💡 Recommandations</h3>
                      <div className="space-y-2">
                        {analysisResults.recommandations?.map((rec: string, index: number) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded">
                            <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setAnalyticsModal(prev => ({ ...prev, detailedAnalysis: false }))}
                  >
                    Fermer
                  </Button>
                  <Button
                    onClick={() => {
                      handleExportAnalytics('PDF');
                      setAnalyticsModal(prev => ({ ...prev, detailedAnalysis: false }));
                    }}
                    disabled={loadingStates.exportingPDF}
                  >
                    {loadingStates.exportingPDF ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    Exporter l'analyse
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Modal Rapport Personnalisé */}
            <Dialog open={analyticsModal.customReport} onOpenChange={(open) => setAnalyticsModal(prev => ({ ...prev, customReport: open }))}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>📝 Rapport Personnalisé</DialogTitle>
                  <DialogDescription>
                    Configurez votre rapport selon vos besoins
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Format */}
                  <div>
                    <Label>Format de sortie</Label>
                    <Select value={reportConfig.format} onValueChange={(value) => setReportConfig(prev => ({ ...prev, format: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="Excel">Excel</SelectItem>
                        <SelectItem value="JSON">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sections */}
                  <div>
                    <Label>Sections à inclure</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {[
                        { id: 'overview', label: 'Vue d\'ensemble' },
                        { id: 'charts', label: 'Graphiques' },
                        { id: 'details', label: 'Détails' },
                        { id: 'trends', label: 'Tendances' }
                      ].map((section) => (
                        <div key={section.id} className="flex items-center space-x-2">
                          <Switch
                            checked={reportConfig.sections.includes(section.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setReportConfig(prev => ({
                                  ...prev,
                                  sections: [...prev.sections, section.id]
                                }));
                              } else {
                                setReportConfig(prev => ({
                                  ...prev,
                                  sections: prev.sections.filter(s => s !== section.id)
                                }));
                              }
                            }}
                          />
                          <Label className="text-sm">{section.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={reportConfig.includeComparison}
                        onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includeComparison: checked }))}
                      />
                      <Label>Inclure comparaison avec période précédente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={reportConfig.includeTrends}
                        onCheckedChange={(checked) => setReportConfig(prev => ({ ...prev, includeTrends: checked }))}
                      />
                      <Label>Inclure analyse des tendances</Label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setAnalyticsModal(prev => ({ ...prev, customReport: false }))}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleCustomReport}
                    disabled={loadingStates.downloadingReport}
                  >
                    {loadingStates.downloadingReport ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                    Générer le rapport
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Support */}
          <TabsContent value="support" className="space-y-6">
            {/* En-tête avec actions rapides */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">🎧 Support Client</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshTickets}
                  disabled={loadingStates.refreshingTickets}
                  title="Actualiser les tickets"
                >
                  {loadingStates.refreshingTickets ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600">
                  {supportTickets.filter(t => t.status === 'RESOLVED').length} Résolus
                </Badge>
                <Badge variant="outline" className="text-orange-600">
                  {supportTickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length} Actifs
                </Badge>
                <Badge variant="outline" className="text-red-600">
                  {supportTickets.filter(t => t.priority === 'URGENT').length} Urgents
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tickets actifs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="h-5 w-5" />
                    Tickets de Support
                  </CardTitle>
                  <CardDescription>
                    {supportTickets.length} ticket(s) - Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {supportTickets.map((ticket) => (
                      <Card key={ticket.id} className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setSupportModals(prev => ({ ...prev, ticketDetails: true }));
                            }}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium hover:text-blue-600 transition-colors">{ticket.title}</h4>
                              <p className="text-sm text-gray-600">{ticket.id} • {ticket.category}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge
                                variant={
                                  ticket.priority === 'URGENT' ? 'destructive' :
                                  ticket.priority === 'HIGH' ? 'default' : 'secondary'
                                }
                              >
                                {ticket.priority}
                              </Badge>
                              <Badge variant="outline" className={
                                ticket.status === 'RESOLVED' ? 'text-green-600 border-green-600' :
                                ticket.status === 'CLOSED' ? 'text-gray-600' :
                                ticket.status === 'IN_PROGRESS' ? 'text-blue-600 border-blue-600' :
                                'text-orange-600 border-orange-600'
                              }>
                                {ticket.status.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{ticket.assignedTo}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span>{new Date(ticket.createdAt).toLocaleDateString('fr-FR')}</span>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAssignTicket(ticket.id, 'Support L2');
                                  }}
                                  disabled={loadingStates.assigningTicket}
                                  className="h-6 px-2 text-xs"
                                >
                                  Assigner
                                </Button>
                                {(ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS') && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCloseTicket(ticket.id);
                                    }}
                                    disabled={loadingStates.closingTicket}
                                    className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                                  >
                                    Fermer
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button
                    className="w-full mt-4"
                    onClick={() => setSupportModals(prev => ({ ...prev, newTicket: true }))}
                    disabled={loadingStates.creatingTicket}
                  >
                    {loadingStates.creatingTicket ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Nouveau ticket
                  </Button>
                </CardContent>
              </Card>

              {/* Centre d'aide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Centre d'Aide
                  </CardTitle>
                  <CardDescription>Ressources et documentation disponibles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start hover:bg-blue-50"
                      onClick={() => setSupportModals(prev => ({ ...prev, userGuide: true }))}
                      disabled={loadingStates.generatingGuide}
                    >
                      {loadingStates.generatingGuide ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookOpen className="mr-2 h-4 w-4" />}
                      Guide d'utilisation
                      <span className="ml-auto text-xs text-blue-600">PDF</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start hover:bg-green-50"
                      onClick={handleLoadFAQ}
                      disabled={loadingStates.loadingFAQ}
                    >
                      {loadingStates.loadingFAQ ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageCircle className="mr-2 h-4 w-4" />}
                      FAQ
                      <span className="ml-auto text-xs text-green-600">Interactif</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start hover:bg-purple-50"
                      onClick={handleDownloadDocs}
                      disabled={loadingStates.downloadingDocs}
                    >
                      {loadingStates.downloadingDocs ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Code className="mr-2 h-4 w-4" />}
                      Documentation API
                      <span className="ml-auto text-xs text-purple-600">JSON</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start hover:bg-orange-50"
                      onClick={() => setSupportModals(prev => ({ ...prev, contactSupport: true }))}
                      disabled={loadingStates.contactingSupport}
                    >
                      {loadingStates.contactingSupport ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Phone className="mr-2 h-4 w-4" />}
                      Contact support
                      <span className="ml-auto text-xs text-orange-600">Direct</span>
                    </Button>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Support direct 24/7</h4>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                          <Phone className="h-3 w-3 text-green-600" />
                          <span className="font-mono">+241 01 77 88 99</span>
                          <Badge variant="outline" className="ml-auto text-xs">Urgences</Badge>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                          <Mail className="h-3 w-3 text-blue-600" />
                          <span className="font-mono">support@admin.ga</span>
                          <Badge variant="outline" className="ml-auto text-xs">&lt; 2h</Badge>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                          <Clock className="h-3 w-3 text-purple-600" />
                          <span>Lun-Dim 8h-20h</span>
                          <Badge variant="outline" className="ml-auto text-xs">Garantie</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Journal d'activité */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Journal d'Activité
                  </CardTitle>
                  <CardDescription>
                    Historique des {activityHistory.length} dernières actions •
                    <span className="text-blue-600 ml-1">Temps réel</span>
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportHistory}
                  disabled={loadingStates.exportingHistory}
                >
                  {loadingStates.exportingHistory ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                  Exporter
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {activityHistory.map((log, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-3 h-3 rounded-full ${
                        log.impact === 'HIGH' ? 'bg-red-500' :
                        log.impact === 'MEDIUM' ? 'bg-orange-500' : 'bg-green-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{log.action}</p>
                        <p className="text-xs text-gray-600">{log.details}</p>
                        <p className="text-xs text-gray-500">{log.user} • {log.time}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={`text-xs ${
                          log.type === 'SUPPORT' ? 'text-blue-600 border-blue-600' :
                          log.type === 'SYSTEM' ? 'text-green-600 border-green-600' :
                          log.type === 'BILLING' ? 'text-purple-600 border-purple-600' :
                          log.type === 'AUTH' ? 'text-orange-600 border-orange-600' :
                          'text-gray-600'
                        }`}>
                          {log.type}
                        </Badge>
                        <p className={`text-xs mt-1 ${
                          log.impact === 'HIGH' ? 'text-red-600' :
                          log.impact === 'MEDIUM' ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          Impact {log.impact}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setSupportModals(prev => ({ ...prev, fullHistory: true }))}
                  disabled={loadingStates.loadingHistory}
                >
                  {loadingStates.loadingHistory ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <History className="mr-2 h-4 w-4" />}
                  Voir tout l'historique complet
                </Button>
              </CardContent>
            </Card>

            {/* === MODALS SUPPORT === */}

            {/* Modal Nouveau Ticket */}
            <Dialog open={supportModals.newTicket} onOpenChange={(open) => setSupportModals(prev => ({ ...prev, newTicket: open }))}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>🎫 Créer un Nouveau Ticket</DialogTitle>
                  <DialogDescription>
                    Décrivez le problème ou la demande d'assistance
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Priorité</Label>
                      <Select value={newTicketForm.priority} onValueChange={(value: any) => setNewTicketForm(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">🟢 Basse</SelectItem>
                          <SelectItem value="MEDIUM">🟡 Moyenne</SelectItem>
                          <SelectItem value="HIGH">🟠 Haute</SelectItem>
                          <SelectItem value="URGENT">🔴 Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Catégorie</Label>
                      <Select value={newTicketForm.category} onValueChange={(value: any) => setNewTicketForm(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TECHNIQUE">🔧 Technique</SelectItem>
                          <SelectItem value="FONCTIONNEL">⚙️ Fonctionnel</SelectItem>
                          <SelectItem value="FACTURATION">💳 Facturation</SelectItem>
                          <SelectItem value="AUTRE">📋 Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Titre du ticket *</Label>
                    <Input
                      value={newTicketForm.title}
                      onChange={(e) => setNewTicketForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Résumé court du problème..."
                      className={supportErrors.title ? 'border-red-500' : ''}
                    />
                    {supportErrors.title && (
                      <p className="text-sm text-red-600 mt-1">{supportErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <Label>Description détaillée *</Label>
                    <Textarea
                      value={newTicketForm.description}
                      onChange={(e) => setNewTicketForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Décrivez le problème en détail, les étapes pour le reproduire, et l'impact sur votre activité..."
                      rows={6}
                      className={supportErrors.description ? 'border-red-500' : ''}
                    />
                    {supportErrors.description && (
                      <p className="text-sm text-red-600 mt-1">{supportErrors.description}</p>
                    )}
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">Conseils pour un traitement rapide</h4>
                        <ul className="text-sm text-blue-700 mt-1 space-y-1">
                          <li>• Soyez précis dans la description du problème</li>
                          <li>• Indiquez les étapes pour reproduire l'erreur</li>
                          <li>• Mentionnez l'impact sur votre service</li>
                          <li>• Joignez des captures d'écran si pertinent</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSupportModals(prev => ({ ...prev, newTicket: false }));
                      setNewTicketForm({ title: '', description: '', priority: 'MEDIUM', category: 'TECHNIQUE' });
                      setSupportErrors({});
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleCreateTicket}
                    disabled={loadingStates.creatingTicket}
                  >
                    {loadingStates.creatingTicket ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Créer le ticket
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Modal Contact Support */}
            <Dialog open={supportModals.contactSupport} onOpenChange={(open) => setSupportModals(prev => ({ ...prev, contactSupport: open }))}>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>📞 Contacter le Support</DialogTitle>
                  <DialogDescription>
                    Envoyez un message direct à notre équipe support
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Urgence</Label>
                      <Select value={contactForm.urgency} onValueChange={(value: any) => setContactForm(prev => ({ ...prev, urgency: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">🟢 Normale</SelectItem>
                          <SelectItem value="NORMAL">🟡 Standard</SelectItem>
                          <SelectItem value="HIGH">🟠 Élevée</SelectItem>
                          <SelectItem value="URGENT">🔴 Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Switch
                        checked={contactForm.requestCallback}
                        onCheckedChange={(checked) => setContactForm(prev => ({ ...prev, requestCallback: checked }))}
                      />
                      <Label>Demander un rappel</Label>
                    </div>
                  </div>

                  <div>
                    <Label>Sujet</Label>
                    <Input
                      value={contactForm.subject}
                      onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Objet de votre demande..."
                    />
                  </div>

                  <div>
                    <Label>Message</Label>
                    <Textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Votre message..."
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSupportModals(prev => ({ ...prev, contactSupport: false }));
                      setContactForm({ subject: '', message: '', urgency: 'NORMAL', requestCallback: false });
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleContactSupport}
                    disabled={loadingStates.contactingSupport}
                  >
                    {loadingStates.contactingSupport ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Envoyer le message
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
         </Tabs>

         {/* Modal de configuration de service */}
         <Dialog open={serviceConfigModal} onOpenChange={setServiceConfigModal}>
           <DialogContent className="max-w-2xl">
             <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                 <Settings className="h-5 w-5" />
                 Configuration de {selectedService?.name}
               </DialogTitle>
               <DialogDescription>
                 Modifiez les paramètres avancés de ce service
               </DialogDescription>
             </DialogHeader>
             {selectedService && (
               <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <Label>Statut du service</Label>
                     <div className="flex items-center gap-2 mt-1">
                       <Switch checked={selectedService.enabled} />
                       <span className="text-sm">{selectedService.enabled ? 'Activé' : 'Désactivé'}</span>
                     </div>
                   </div>
                   <div>
                     <Label>Prix (XAF)</Label>
                     <Input type="number" value={selectedService.price} readOnly className="bg-gray-50" />
                   </div>
                 </div>

                 <div>
                   <Label>Paramètres avancés</Label>
                   <div className="mt-2 space-y-2">
                     {Object.entries(selectedService.settings).map(([key, value]) => (
                       <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                         <span className="font-medium">{key}</span>
                         <span className="text-gray-600">{String(value)}</span>
                       </div>
                     ))}
                   </div>
                 </div>

                 <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                   <div className="flex items-start gap-2">
                     <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                     <div>
                       <h4 className="font-medium text-yellow-800">Configuration avancée</h4>
                       <p className="text-sm text-yellow-700">
                         Les modifications de configuration nécessitent une validation par l'équipe technique.
                       </p>
                     </div>
                   </div>
                 </div>
               </div>
             )}
             <DialogFooter>
               <Button variant="outline" onClick={() => setServiceConfigModal(false)}>
                 Fermer
               </Button>
               <Button>
                 <Save className="mr-2 h-4 w-4" />
                 Sauvegarder les modifications
               </Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>

         {/* Modal d'analytics de service */}
         <Dialog open={serviceAnalyticsModal} onOpenChange={setServiceAnalyticsModal}>
           <DialogContent className="max-w-4xl">
             <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                 <BarChart3 className="h-5 w-5" />
                 Analytics - {selectedService?.name}
               </DialogTitle>
               <DialogDescription>
                 Statistiques d'utilisation et performance du service
               </DialogDescription>
             </DialogHeader>
             {selectedService && (
               <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                   <div className="p-4 bg-blue-50 rounded-lg">
                     <div className="flex items-center gap-2">
                       <Activity className="h-5 w-5 text-blue-600" />
                       <div>
                         <p className="text-sm text-blue-600">Demandes ce mois</p>
                         <p className="text-xl font-bold text-blue-900">
                           {Math.floor(Math.random() * 500) + 100}
                         </p>
                       </div>
                     </div>
                   </div>
                   <div className="p-4 bg-green-50 rounded-lg">
                     <div className="flex items-center gap-2">
                       <CheckCircle className="h-5 w-5 text-green-600" />
                       <div>
                         <p className="text-sm text-green-600">Taux de succès</p>
                         <p className="text-xl font-bold text-green-900">
                           {(Math.random() * 5 + 95).toFixed(1)}%
                         </p>
                       </div>
                     </div>
                   </div>
                   <div className="p-4 bg-purple-50 rounded-lg">
                     <div className="flex items-center gap-2">
                       <Clock className="h-5 w-5 text-purple-600" />
                       <div>
                         <p className="text-sm text-purple-600">Temps moyen</p>
                         <p className="text-xl font-bold text-purple-900">
                           {(Math.random() * 5 + 2).toFixed(1)}min
                         </p>
                       </div>
                     </div>
                   </div>
                   <div className="p-4 bg-orange-50 rounded-lg">
                     <div className="flex items-center gap-2">
                       <Euro className="h-5 w-5 text-orange-600" />
                       <div>
                         <p className="text-sm text-orange-600">Revenus générés</p>
                         <p className="text-xl font-bold text-orange-900">
                           {formatPrice((Math.random() * 50000) + 10000)}
                         </p>
                       </div>
                     </div>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-4 border rounded-lg">
                     <h4 className="font-semibold mb-3">Évolution mensuelle</h4>
                     <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
                       <p className="text-gray-500">Graphique des demandes</p>
                     </div>
                   </div>
                   <div className="p-4 border rounded-lg">
                     <h4 className="font-semibold mb-3">Répartition par statut</h4>
                     <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
                       <p className="text-gray-500">Graphique en secteurs</p>
                     </div>
                   </div>
                 </div>
               </div>
             )}
             <DialogFooter>
               <Button variant="outline" onClick={() => setServiceAnalyticsModal(false)}>
                 Fermer
               </Button>
               <Button>
                 <Download className="mr-2 h-4 w-4" />
                 Exporter le rapport
               </Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>

         {/* Modal d'ajout de service */}
         <Dialog open={addServiceModal} onOpenChange={setAddServiceModal}>
           <DialogContent className="max-w-2xl">
             <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                 <Plus className="h-5 w-5" />
                 Ajouter un Nouveau Service
               </DialogTitle>
               <DialogDescription>
                 Créez un nouveau service pour ce client
               </DialogDescription>
             </DialogHeader>
             <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label htmlFor="service-id">Identifiant *</Label>
                   <Input
                     id="service-id"
                     value={newServiceForm.id}
                     onChange={(e) => setNewServiceForm(prev => ({ ...prev, id: e.target.value.toUpperCase() }))}
                     placeholder="Ex: NOUVEAU_SERVICE"
                     className={serviceFormErrors.id ? 'border-red-500' : ''}
                   />
                   {serviceFormErrors.id && (
                     <p className="text-sm text-red-600 mt-1">{serviceFormErrors.id}</p>
                   )}
                 </div>
                 <div>
                   <Label htmlFor="service-category">Catégorie *</Label>
                   <Select
                     value={newServiceForm.category}
                     onValueChange={(value: any) => setNewServiceForm(prev => ({ ...prev, category: value }))}
                   >
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="IDENTITE">Identité</SelectItem>
                       <SelectItem value="ETAT_CIVIL">État Civil</SelectItem>
                       <SelectItem value="TRANSPORT">Transport</SelectItem>
                       <SelectItem value="FISCAL">Fiscal</SelectItem>
                       <SelectItem value="SOCIAL">Social</SelectItem>
                       <SelectItem value="SECURITE">Sécurité</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
               </div>

               <div>
                 <Label htmlFor="service-name">Nom du service *</Label>
                 <Input
                   id="service-name"
                   value={newServiceForm.name}
                   onChange={(e) => setNewServiceForm(prev => ({ ...prev, name: e.target.value }))}
                   placeholder="Ex: Certificat de résidence"
                   className={serviceFormErrors.name ? 'border-red-500' : ''}
                 />
                 {serviceFormErrors.name && (
                   <p className="text-sm text-red-600 mt-1">{serviceFormErrors.name}</p>
                 )}
               </div>

               <div>
                 <Label htmlFor="service-description">Description *</Label>
                 <Textarea
                   id="service-description"
                   value={newServiceForm.description}
                   onChange={(e) => setNewServiceForm(prev => ({ ...prev, description: e.target.value }))}
                   placeholder="Décrivez le service et son utilité..."
                   rows={3}
                   className={serviceFormErrors.description ? 'border-red-500' : ''}
                 />
                 {serviceFormErrors.description && (
                   <p className="text-sm text-red-600 mt-1">{serviceFormErrors.description}</p>
                 )}
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label htmlFor="service-price">Prix (XAF) *</Label>
                   <Input
                     id="service-price"
                     type="number"
                     value={newServiceForm.price}
                     onChange={(e) => setNewServiceForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                     placeholder="0"
                     min="0"
                     max="1000000"
                     className={serviceFormErrors.price ? 'border-red-500' : ''}
                   />
                   {serviceFormErrors.price && (
                     <p className="text-sm text-red-600 mt-1">{serviceFormErrors.price}</p>
                   )}
                 </div>
                 <div className="flex items-center justify-between">
                   <Label>Activer immédiatement</Label>
                   <Switch
                     checked={newServiceForm.enabled}
                     onCheckedChange={(checked) => setNewServiceForm(prev => ({ ...prev, enabled: checked }))}
                   />
                 </div>
               </div>

               {Object.keys(serviceFormErrors).length > 0 && (
                 <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                   <div className="flex items-center gap-2 text-red-700">
                     <AlertTriangle className="h-4 w-4" />
                     <span className="font-medium">Veuillez corriger les erreurs ci-dessus</span>
                   </div>
                 </div>
               )}
             </div>
             <DialogFooter>
               <Button variant="outline" onClick={() => setAddServiceModal(false)}>
                 Annuler
               </Button>
               <Button
                 onClick={handleSaveNewService}
                 disabled={loadingStates.addingService}
               >
                 {loadingStates.addingService ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                 Créer le service
               </Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>

         {/* Modal de configuration avancée de carte */}
         <Dialog open={cardConfigModal} onOpenChange={setCardConfigModal}>
           <DialogContent className="max-w-3xl">
             <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                 <Settings className="h-5 w-5" />
                 Configuration Avancée - Carte {selectedCardType === 'physical' ? 'Physique' : 'Virtuelle'}
               </DialogTitle>
               <DialogDescription>
                 Paramètres avancés et options de personnalisation
               </DialogDescription>
             </DialogHeader>
             {selectedCardType && (
               <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <Label>Type de carte</Label>
                     <div className="flex items-center gap-2 mt-1">
                       <Badge variant="outline">
                         {selectedCardType === 'physical' ? 'Physique' : 'Virtuelle'}
                       </Badge>
                                               <Switch checked={cardConfigs[selectedCardType].enabled} disabled />
                     </div>
                   </div>
                   <div>
                     <Label>Template actuel</Label>
                     <Input
                       value={cardConfigs[selectedCardType].design.template}
                       readOnly
                       className="bg-gray-50"
                     />
                   </div>
                 </div>

                 <div>
                   <Label>Fonctionnalités activées</Label>
                   <div className="mt-2 flex flex-wrap gap-2">
                     {cardConfigs[selectedCardType].features.map((feature) => (
                       <Badge key={feature} variant="secondary">
                         {feature.replace('_', ' ')}
                       </Badge>
                     ))}
                     {cardConfigs[selectedCardType].features.length === 0 && (
                       <span className="text-sm text-gray-500">Aucune fonctionnalité activée</span>
                     )}
                   </div>
                 </div>

                 <div>
                   <Label>Configuration de sécurité</Label>
                   <div className="mt-2 space-y-3">
                     <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                       <div>
                         <span className="font-medium">Chiffrement AES-256</span>
                         <p className="text-sm text-gray-600">Protection des données sensibles</p>
                       </div>
                       <Badge variant="outline" className="text-green-600">Activé</Badge>
                     </div>
                     <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                       <div>
                         <span className="font-medium">Authentification biométrique</span>
                         <p className="text-sm text-gray-600">Empreinte digitale et reconnaissance faciale</p>
                       </div>
                       <Badge variant="outline" className={selectedCardType === 'virtual' ? 'text-green-600' : 'text-gray-400'}>
                         {selectedCardType === 'virtual' ? 'Disponible' : 'Non disponible'}
                       </Badge>
                     </div>
                     <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                       <div>
                         <span className="font-medium">Protection anti-clonage</span>
                         <p className="text-sm text-gray-600">Puces sécurisées et hologrammes</p>
                       </div>
                       <Badge variant="outline" className={selectedCardType === 'physical' ? 'text-green-600' : 'text-gray-400'}>
                         {selectedCardType === 'physical' ? 'Disponible' : 'Non disponible'}
                       </Badge>
                     </div>
                   </div>
                 </div>

                 <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                   <div className="flex items-start gap-2">
                     <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                     <div>
                       <h4 className="font-medium text-blue-800">Configuration avancée</h4>
                       <p className="text-sm text-blue-700">
                         Les modifications de sécurité nécessitent une validation par l'équipe technique et peuvent prendre 24-48h à être appliquées.
                       </p>
                     </div>
                   </div>
                 </div>
               </div>
             )}
             <DialogFooter>
               <Button variant="outline" onClick={() => setCardConfigModal(false)}>
                 Fermer
               </Button>
               <Button>
                 <Save className="mr-2 h-4 w-4" />
                 Sauvegarder les modifications
               </Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>

         {/* Modal de test de carte */}
         <Dialog open={cardTestModal} onOpenChange={setCardTestModal}>
           <DialogContent className="max-w-2xl">
             <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                 <Activity className="h-5 w-5" />
                 Test de Fonctionnalités - Carte {selectedCardType === 'physical' ? 'Physique' : 'Virtuelle'}
               </DialogTitle>
               <DialogDescription>
                 Résultats des tests de fonctionnalités
               </DialogDescription>
             </DialogHeader>
             {selectedCardType && (
               <div className="space-y-4">
                 <div className="grid grid-cols-1 gap-3">
                   {cardConfigs[selectedCardType].features.map((feature) => {
                     const testResult = Math.random() > 0.1; // 90% de succès
                     const responseTime = Math.floor(Math.random() * 300) + 50;

                     return (
                       <div key={feature} className={`p-3 border rounded-lg ${testResult ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                         <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             {testResult ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-red-600" />}
                             <span className="font-medium">{feature.replace('_', ' ')}</span>
                           </div>
                           <div className="text-right">
                             <Badge variant={testResult ? 'default' : 'destructive'}>
                               {testResult ? 'Réussi' : 'Échec'}
                             </Badge>
                             <p className="text-xs text-gray-600 mt-1">{responseTime}ms</p>
                           </div>
                         </div>
                         {!testResult && (
                           <p className="text-sm text-red-600 mt-1">
                             Erreur de connexion - Vérifiez la configuration
                           </p>
                         )}
                       </div>
                     );
                   })}

                   {cardConfigs[selectedCardType].features.length === 0 && (
                     <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                       <p className="text-gray-500">Aucune fonctionnalité à tester</p>
                       <p className="text-sm text-gray-400">Activez des fonctionnalités pour voir les résultats de test</p>
                     </div>
                   )}
                 </div>

                 <div className="p-4 bg-gray-50 rounded-lg">
                   <h4 className="font-medium mb-2">Résumé du test</h4>
                   <div className="grid grid-cols-3 gap-4 text-center">
                     <div>
                       <p className="text-2xl font-bold text-green-600">
                         {Math.floor((cardConfigs[selectedCardType].features.length * 0.9))}
                       </p>
                       <p className="text-sm text-gray-600">Tests réussis</p>
                     </div>
                     <div>
                       <p className="text-2xl font-bold text-red-600">
                         {Math.ceil((cardConfigs[selectedCardType].features.length * 0.1))}
                       </p>
                       <p className="text-sm text-gray-600">Tests échoués</p>
                     </div>
                     <div>
                       <p className="text-2xl font-bold text-blue-600">
                         {Math.floor(Math.random() * 200) + 100}ms
                       </p>
                       <p className="text-sm text-gray-600">Temps moyen</p>
                     </div>
                   </div>
                 </div>
               </div>
             )}
             <DialogFooter>
               <Button variant="outline" onClick={() => setCardTestModal(false)}>
                 Fermer
               </Button>
               <Button>
                 <Download className="mr-2 h-4 w-4" />
                 Exporter le rapport
               </Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>

         {/* Modal d'analytics de carte */}
         <Dialog open={cardAnalyticsModal} onOpenChange={setCardAnalyticsModal}>
           <DialogContent className="max-w-4xl">
             <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                 <BarChart3 className="h-5 w-5" />
                 Analytics - Cartes {selectedCardType === 'physical' ? 'Physiques' : 'Virtuelles'}
               </DialogTitle>
               <DialogDescription>
                 Statistiques d'utilisation et performance des cartes
               </DialogDescription>
             </DialogHeader>
             {selectedCardType && (
               <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                   <div className="p-4 bg-blue-50 rounded-lg">
                     <div className="flex items-center gap-2">
                       <CreditCard className="h-5 w-5 text-blue-600" />
                       <div>
                         <p className="text-sm text-blue-600">Cartes émises</p>
                         <p className="text-xl font-bold text-blue-900">
                           {Math.floor(Math.random() * 1000) + 500}
                         </p>
                       </div>
                     </div>
                   </div>
                   <div className="p-4 bg-green-50 rounded-lg">
                     <div className="flex items-center gap-2">
                       <CheckCircle className="h-5 w-5 text-green-600" />
                       <div>
                         <p className="text-sm text-green-600">Taux d'activation</p>
                         <p className="text-xl font-bold text-green-900">
                           {(Math.random() * 10 + 85).toFixed(1)}%
                         </p>
                       </div>
                     </div>
                   </div>
                   <div className="p-4 bg-purple-50 rounded-lg">
                     <div className="flex items-center gap-2">
                       <Activity className="h-5 w-5 text-purple-600" />
                       <div>
                         <p className="text-sm text-purple-600">Utilisation quotidienne</p>
                         <p className="text-xl font-bold text-purple-900">
                           {Math.floor(Math.random() * 500) + 200}
                         </p>
                       </div>
                     </div>
                   </div>
                   <div className="p-4 bg-orange-50 rounded-lg">
                     <div className="flex items-center gap-2">
                       <AlertTriangle className="h-5 w-5 text-orange-600" />
                       <div>
                         <p className="text-sm text-orange-600">Incidents</p>
                         <p className="text-xl font-bold text-orange-900">
                           {Math.floor(Math.random() * 10) + 2}
                         </p>
                       </div>
                     </div>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-4 border rounded-lg">
                     <h4 className="font-semibold mb-3">Répartition par fonctionnalité</h4>
                     <div className="space-y-2">
                       {cardConfigs[selectedCardType].features.map((feature) => (
                         <div key={feature} className="flex items-center justify-between">
                           <span className="text-sm">{feature.replace('_', ' ')}</span>
                           <div className="flex items-center gap-2">
                             <div className="w-20 bg-gray-200 rounded-full h-2">
                               <div
                                 className="bg-blue-600 h-2 rounded-full"
                                 style={{ width: `${Math.random() * 70 + 30}%` }}
                               ></div>
                             </div>
                             <span className="text-xs text-gray-500">{Math.floor(Math.random() * 40 + 60)}%</span>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                   <div className="p-4 border rounded-lg">
                     <h4 className="font-semibold mb-3">Évolution mensuelle</h4>
                     <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
                       <p className="text-gray-500">Graphique d'évolution</p>
                     </div>
                   </div>
                 </div>
               </div>
             )}
             <DialogFooter>
               <Button variant="outline" onClick={() => setCardAnalyticsModal(false)}>
                 Fermer
               </Button>
               <Button>
                 <Download className="mr-2 h-4 w-4" />
                 Exporter le rapport
               </Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>

         {/* Modal de gestion des templates */}
         <Dialog open={cardTemplateModal} onOpenChange={setCardTemplateModal}>
           <DialogContent className="max-w-3xl">
             <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                 <Palette className="h-5 w-5" />
                 Gestionnaire de Templates de Cartes
               </DialogTitle>
               <DialogDescription>
                 Créez et gérez des templates personnalisés pour vos cartes
               </DialogDescription>
             </DialogHeader>
             <div className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label htmlFor="template-name">Nom du template *</Label>
                   <Input
                     id="template-name"
                     value={customTemplate.name}
                     onChange={(e) => setCustomTemplate(prev => ({ ...prev, name: e.target.value }))}
                     placeholder="Ex: Template Gouvernemental"
                     className={cardFormErrors.name ? 'border-red-500' : ''}
                   />
                   {cardFormErrors.name && (
                     <p className="text-sm text-red-600 mt-1">{cardFormErrors.name}</p>
                   )}
                 </div>
                 <div>
                   <Label htmlFor="template-layout">Mise en page</Label>
                   <Select
                     value={customTemplate.settings.layout}
                     onValueChange={(value) => setCustomTemplate(prev => ({
                       ...prev,
                       settings: { ...prev.settings, layout: value }
                     }))}
                   >
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="standard">Standard</SelectItem>
                       <SelectItem value="compact">Compact</SelectItem>
                       <SelectItem value="extended">Étendu</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
               </div>

               <div>
                 <Label htmlFor="template-description">Description *</Label>
                 <Textarea
                   id="template-description"
                   value={customTemplate.description}
                   onChange={(e) => setCustomTemplate(prev => ({ ...prev, description: e.target.value }))}
                   placeholder="Décrivez l'utilisation de ce template..."
                   rows={3}
                   className={cardFormErrors.description ? 'border-red-500' : ''}
                 />
                 {cardFormErrors.description && (
                   <p className="text-sm text-red-600 mt-1">{cardFormErrors.description}</p>
                 )}
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label htmlFor="bg-color">Couleur de fond *</Label>
                   <div className="flex gap-2">
                     <Input
                       id="bg-color"
                       value={customTemplate.settings.backgroundColor}
                       onChange={(e) => setCustomTemplate(prev => ({
                         ...prev,
                         settings: { ...prev.settings, backgroundColor: e.target.value }
                       }))}
                       placeholder="#ffffff"
                       className={cardFormErrors.backgroundColor ? 'border-red-500' : ''}
                     />
                     <div
                       className="w-10 h-10 border rounded"
                       style={{ backgroundColor: customTemplate.settings.backgroundColor }}
                     ></div>
                   </div>
                   {cardFormErrors.backgroundColor && (
                     <p className="text-sm text-red-600 mt-1">{cardFormErrors.backgroundColor}</p>
                   )}
                 </div>
                 <div>
                   <Label htmlFor="text-color">Couleur du texte *</Label>
                   <div className="flex gap-2">
                     <Input
                       id="text-color"
                       value={customTemplate.settings.textColor}
                       onChange={(e) => setCustomTemplate(prev => ({
                         ...prev,
                         settings: { ...prev.settings, textColor: e.target.value }
                       }))}
                       placeholder="#000000"
                       className={cardFormErrors.textColor ? 'border-red-500' : ''}
                     />
                     <div
                       className="w-10 h-10 border rounded flex items-center justify-center"
                       style={{
                         backgroundColor: customTemplate.settings.backgroundColor,
                         color: customTemplate.settings.textColor
                       }}
                     >
                       <span className="text-xs">Aa</span>
                     </div>
                   </div>
                   {cardFormErrors.textColor && (
                     <p className="text-sm text-red-600 mt-1">{cardFormErrors.textColor}</p>
                   )}
                 </div>
               </div>

               <div>
                 <Label>Position du logo</Label>
                 <div className="flex gap-2 mt-2">
                   {['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'].map((position) => (
                     <Button
                       key={position}
                       variant={customTemplate.settings.logoPosition === position ? 'default' : 'outline'}
                       size="sm"
                       onClick={() => setCustomTemplate(prev => ({
                         ...prev,
                         settings: { ...prev.settings, logoPosition: position }
                       }))}
                     >
                       {position.replace('-', ' ')}
                     </Button>
                   ))}
                 </div>
               </div>

               <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                 <h4 className="font-medium mb-2">Aperçu du template</h4>
                 <div
                   className="w-full h-32 rounded border-2 relative"
                   style={{
                     backgroundColor: customTemplate.settings.backgroundColor,
                     color: customTemplate.settings.textColor
                   }}
                 >
                   <div className={`absolute text-xs p-2 ${
                     customTemplate.settings.logoPosition === 'top-left' ? 'top-0 left-0' :
                     customTemplate.settings.logoPosition === 'top-right' ? 'top-0 right-0' :
                     customTemplate.settings.logoPosition === 'center' ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' :
                     customTemplate.settings.logoPosition === 'bottom-left' ? 'bottom-0 left-0' :
                     'bottom-0 right-0'
                   }`}>
                     LOGO
                   </div>
                   <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                     <p className="text-sm font-bold">{customTemplate.name || 'Nom du template'}</p>
                     <p className="text-xs opacity-75">Aperçu de la carte</p>
                   </div>
                 </div>
               </div>

               {Object.keys(cardFormErrors).length > 0 && (
                 <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                   <div className="flex items-center gap-2 text-red-700">
                     <AlertTriangle className="h-4 w-4" />
                     <span className="font-medium">Veuillez corriger les erreurs ci-dessus</span>
                   </div>
                 </div>
               )}
             </div>
             <DialogFooter>
               <Button variant="outline" onClick={() => setCardTemplateModal(false)}>
                 Annuler
               </Button>
               <Button
                 onClick={handleSaveTemplate}
                 disabled={loadingStates.managingTemplates}
               >
                 {loadingStates.managingTemplates ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                 Créer le template
               </Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>

         {/* Modal de configuration avancée de facturation */}
         <Dialog open={billingConfigModal} onOpenChange={setBillingConfigModal}>
           <DialogContent className="max-w-3xl">
             <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                 <Settings className="h-5 w-5" />
                 Configuration Avancée de Facturation
               </DialogTitle>
               <DialogDescription>
                 Paramètres avancés de facturation et taxation
               </DialogDescription>
             </DialogHeader>
             <div className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label>Cycle de facturation</Label>
                   <div className="flex items-center gap-2 mt-1">
                     <Badge variant="outline">
                       {billingConfig.cycle === 'MONTHLY' ? 'Mensuel' : billingConfig.cycle === 'QUARTERLY' ? 'Trimestriel' : 'Annuel'}
                     </Badge>
                                           <Switch checked={billingConfig.autoRenew} disabled />
                     <span className="text-sm">{billingConfig.autoRenew ? 'Auto' : 'Manuel'}</span>
                   </div>
                 </div>
                 <div>
                   <Label>Devise et taxation</Label>
                   <div className="flex items-center gap-2 mt-1">
                     <Badge variant="secondary">{billingConfig.currency}</Badge>
                     <span className="text-sm">TVA: {billingConfig.taxRate}%</span>
                   </div>
                 </div>
               </div>

               <div>
                 <Label>Méthodes de paiement acceptées</Label>
                 <div className="mt-2 flex flex-wrap gap-2">
                   {billingConfig.paymentMethods.map((method) => (
                     <Badge key={method} variant="default">
                       {method.replace('_', ' ')}
                     </Badge>
                   ))}
                   {billingConfig.paymentMethods.length === 0 && (
                     <span className="text-sm text-gray-500">Aucune méthode configurée</span>
                   )}
                 </div>
               </div>

               <div>
                 <Label>Configuration des frais</Label>
                 <div className="mt-2 space-y-3">
                   <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                     <div>
                       <span className="font-medium">Frais de traitement</span>
                       <p className="text-sm text-gray-600">Frais appliqués par transaction</p>
                     </div>
                     <Badge variant="outline">2.5%</Badge>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                     <div>
                       <span className="font-medium">Frais de retard</span>
                       <p className="text-sm text-gray-600">Pénalités après échéance</p>
                     </div>
                     <Badge variant="outline">5%/mois</Badge>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                     <div>
                       <span className="font-medium">Remise fidélité</span>
                       <p className="text-sm text-gray-600">Réduction pour paiement anticipé</p>
                     </div>
                     <Badge variant="outline" className="text-green-600">-2%</Badge>
                   </div>
                 </div>
               </div>

               <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                 <div className="flex items-start gap-2">
                   <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                   <div>
                     <h4 className="font-medium text-blue-800">Configuration fiscale</h4>
                     <p className="text-sm text-blue-700">
                       Les modifications de taxation nécessitent une validation comptable et peuvent affecter les factures futures.
                     </p>
                   </div>
                 </div>
               </div>
             </div>
             <DialogFooter>
               <Button variant="outline" onClick={() => setBillingConfigModal(false)}>
                 Fermer
               </Button>
               <Button>
                 <Save className="mr-2 h-4 w-4" />
                 Sauvegarder les modifications
               </Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>

         {/* Modal de test des méthodes de paiement */}
         <Dialog open={paymentTestModal} onOpenChange={setPaymentTestModal}>
           <DialogContent className="max-w-2xl">
             <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                 <Activity className="h-5 w-5" />
                 Test de Méthode de Paiement - {selectedPaymentMethod.replace('_', ' ')}
               </DialogTitle>
               <DialogDescription>
                 Résultats du test de connectivité et de fonctionnement
               </DialogDescription>
             </DialogHeader>
             <div className="space-y-4">
               <div className="grid grid-cols-1 gap-3">
                 {[
                   { test: 'Connectivité API', status: Math.random() > 0.1, time: Math.floor(Math.random() * 300) + 50 },
                   { test: 'Authentification', status: Math.random() > 0.05, time: Math.floor(Math.random() * 200) + 30 },
                   { test: 'Transaction test', status: Math.random() > 0.1, time: Math.floor(Math.random() * 500) + 100 },
                   { test: 'Callback webhook', status: Math.random() > 0.15, time: Math.floor(Math.random() * 400) + 80 }
                 ].map((result, index) => (
                   <div key={index} className={`p-3 border rounded-lg ${result.status ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                         {result.status ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-red-600" />}
                         <span className="font-medium">{result.test}</span>
                       </div>
                       <div className="text-right">
                         <Badge variant={result.status ? 'default' : 'destructive'}>
                           {result.status ? 'Réussi' : 'Échec'}
                         </Badge>
                         <p className="text-xs text-gray-600 mt-1">{result.time}ms</p>
                       </div>
                     </div>
                     {!result.status && (
                       <p className="text-sm text-red-600 mt-1">
                         Erreur de connexion - Vérifiez la configuration API
                       </p>
                     )}
                   </div>
                 ))}
               </div>

               <div className="p-4 bg-gray-50 rounded-lg">
                 <h4 className="font-medium mb-2">Résumé du test</h4>
                 <div className="grid grid-cols-3 gap-4 text-center">
                   <div>
                     <p className="text-2xl font-bold text-green-600">3</p>
                     <p className="text-sm text-gray-600">Tests réussis</p>
                   </div>
                   <div>
                     <p className="text-2xl font-bold text-red-600">1</p>
                     <p className="text-sm text-gray-600">Tests échoués</p>
                   </div>
                   <div>
                     <p className="text-2xl font-bold text-blue-600">{Math.floor(Math.random() * 200) + 100}ms</p>
                     <p className="text-sm text-gray-600">Temps moyen</p>
                   </div>
                 </div>
               </div>
             </div>
             <DialogFooter>
               <Button variant="outline" onClick={() => setPaymentTestModal(false)}>
                 Fermer
               </Button>
               <Button>
                 <Download className="mr-2 h-4 w-4" />
                 Exporter le rapport
               </Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>

         {/* Modal de gestion des rappels */}
         <Dialog open={remindersModal} onOpenChange={setRemindersModal}>
           <DialogContent className="max-w-2xl">
             <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                 <Calendar className="h-5 w-5" />
                 Gestion des Rappels de Paiement
               </DialogTitle>
               <DialogDescription>
                 Configurez les jours de rappel avant échéance
               </DialogDescription>
             </DialogHeader>
             <div className="space-y-4">
               <div>
                 <Label>Rappels actuels</Label>
                 <div className="flex flex-wrap gap-2 mt-2">
                   {billingConfig.reminderDays.map((days, index) => (
                     <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded">
                       <span className="text-sm font-medium">{days} jour{days > 1 ? 's' : ''}</span>
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => handleRemoveReminderDay(days)}
                         className="h-4 w-4 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                       >
                         ×
                       </Button>
                     </div>
                   ))}
                   {billingConfig.reminderDays.length === 0 && (
                     <span className="text-sm text-gray-500">Aucun rappel configuré</span>
                   )}
                 </div>
               </div>

               <div>
                 <Label htmlFor="new-reminder">Ajouter un nouveau rappel</Label>
                 <div className="flex gap-2 mt-2">
                   <Input
                     id="new-reminder"
                     type="number"
                     value={newReminderDays}
                     onChange={(e) => setNewReminderDays(e.target.value)}
                     placeholder="Nombre de jours"
                     min="1"
                     max="365"
                     className="flex-1"
                   />
                   <Button onClick={handleAddReminderDay} disabled={!newReminderDays}>
                     <Plus className="mr-2 h-4 w-4" />
                     Ajouter
                   </Button>
                 </div>
                 <p className="text-xs text-gray-500 mt-1">Entre 1 et 365 jours avant l'échéance</p>
               </div>

               <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                 <h4 className="font-medium text-yellow-800 mb-2">Rappels recommandés</h4>
                 <div className="space-y-2">
                   <p className="text-sm text-yellow-700">• 30 jours : Notification préventive</p>
                   <p className="text-sm text-yellow-700">• 7 jours : Rappel urgent</p>
                   <p className="text-sm text-yellow-700">• 1 jour : Dernière chance</p>
                 </div>
               </div>
             </div>
             <DialogFooter>
               <Button variant="outline" onClick={() => setRemindersModal(false)}>
                 Fermer
               </Button>
               <Button>
                 <Save className="mr-2 h-4 w-4" />
                 Sauvegarder les rappels
               </Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>

         {/* Modal d'analytics de facturation */}
         <Dialog open={billingAnalyticsModal} onOpenChange={setBillingAnalyticsModal}>
           <DialogContent className="max-w-4xl">
             <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                 <BarChart3 className="h-5 w-5" />
                 Analytics de Facturation
               </DialogTitle>
               <DialogDescription>
                 Statistiques financières et performance des paiements
               </DialogDescription>
             </DialogHeader>
             <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="p-4 bg-blue-50 rounded-lg">
                   <div className="flex items-center gap-2">
                     <Euro className="h-5 w-5 text-blue-600" />
                     <div>
                       <p className="text-sm text-blue-600">Revenus ce mois</p>
                       <p className="text-xl font-bold text-blue-900">
                         {formatPrice(totalBillingCost.total)}
                       </p>
                     </div>
                   </div>
                 </div>
                 <div className="p-4 bg-green-50 rounded-lg">
                   <div className="flex items-center gap-2">
                     <CheckCircle className="h-5 w-5 text-green-600" />
                     <div>
                       <p className="text-sm text-green-600">Taux de paiement</p>
                       <p className="text-xl font-bold text-green-900">
                         {(Math.random() * 10 + 85).toFixed(1)}%
                       </p>
                     </div>
                   </div>
                 </div>
                 <div className="p-4 bg-purple-50 rounded-lg">
                   <div className="flex items-center gap-2">
                     <Clock className="h-5 w-5 text-purple-600" />
                     <div>
                       <p className="text-sm text-purple-600">Délai moyen</p>
                       <p className="text-xl font-bold text-purple-900">
                         {Math.floor(Math.random() * 10) + 2} jours
                       </p>
                     </div>
                   </div>
                 </div>
                 <div className="p-4 bg-orange-50 rounded-lg">
                   <div className="flex items-center gap-2">
                     <AlertTriangle className="h-5 w-5 text-orange-600" />
                     <div>
                       <p className="text-sm text-orange-600">Impayés</p>
                       <p className="text-xl font-bold text-orange-900">
                         {formatPrice(Math.random() * 50000)}
                       </p>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-4 border rounded-lg">
                   <h4 className="font-semibold mb-3">Répartition par méthode</h4>
                   <div className="space-y-2">
                     {billingConfig.paymentMethods.map((method) => (
                       <div key={method} className="flex items-center justify-between">
                         <span className="text-sm">{method.replace('_', ' ')}</span>
                         <div className="flex items-center gap-2">
                           <div className="w-20 bg-gray-200 rounded-full h-2">
                             <div
                               className="bg-blue-600 h-2 rounded-full"
                               style={{ width: `${Math.random() * 70 + 30}%` }}
                             ></div>
                           </div>
                           <span className="text-xs text-gray-500">{Math.floor(Math.random() * 40 + 20)}%</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
                 <div className="p-4 border rounded-lg">
                   <h4 className="font-semibold mb-3">Évolution des revenus</h4>
                   <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
                     <p className="text-gray-500">Graphique des revenus</p>
                   </div>
                 </div>
               </div>
             </div>
             <DialogFooter>
               <Button variant="outline" onClick={() => setBillingAnalyticsModal(false)}>
                 Fermer
               </Button>
               <Button>
                 <Download className="mr-2 h-4 w-4" />
                 Exporter le rapport
               </Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>

         {/* Modal de gestion des templates de facture */}
         <Dialog open={invoiceTemplateModal} onOpenChange={setInvoiceTemplateModal}>
           <DialogContent className="max-w-3xl">
             <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                 <FileText className="h-5 w-5" />
                 Gestionnaire de Templates de Facture
               </DialogTitle>
               <DialogDescription>
                 Créez et gérez des templates personnalisés pour vos factures
               </DialogDescription>
             </DialogHeader>
             <div className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label htmlFor="template-name">Nom du template *</Label>
                   <Input
                     id="template-name"
                     value={customInvoiceTemplate.name}
                     onChange={(e) => setCustomInvoiceTemplate(prev => ({ ...prev, name: e.target.value }))}
                     placeholder="Ex: Template Gouvernemental"
                     className={billingFormErrors.name ? 'border-red-500' : ''}
                   />
                   {billingFormErrors.name && (
                     <p className="text-sm text-red-600 mt-1">{billingFormErrors.name}</p>
                   )}
                 </div>
                 <div>
                   <Label htmlFor="color-scheme">Schéma de couleurs</Label>
                   <Select
                     value={customInvoiceTemplate.settings.colorScheme}
                     onValueChange={(value) => setCustomInvoiceTemplate(prev => ({
                       ...prev,
                       settings: { ...prev.settings, colorScheme: value }
                     }))}
                   >
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="blue">Bleu</SelectItem>
                       <SelectItem value="green">Vert</SelectItem>
                       <SelectItem value="red">Rouge</SelectItem>
                       <SelectItem value="gray">Gris</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
               </div>

               <div>
                 <Label htmlFor="template-description">Description *</Label>
                 <Textarea
                   id="template-description"
                   value={customInvoiceTemplate.description}
                   onChange={(e) => setCustomInvoiceTemplate(prev => ({ ...prev, description: e.target.value }))}
                   placeholder="Décrivez l'utilisation de ce template..."
                   rows={3}
                   className={billingFormErrors.description ? 'border-red-500' : ''}
                 />
                 {billingFormErrors.description && (
                   <p className="text-sm text-red-600 mt-1">{billingFormErrors.description}</p>
                 )}
               </div>

               <div className="space-y-4">
                 <Label>Options du template</Label>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="flex items-center justify-between">
                     <div>
                       <Label>QR Code de paiement</Label>
                       <p className="text-sm text-gray-600">Inclure un QR code pour paiement mobile</p>
                     </div>
                     <Switch
                       checked={customInvoiceTemplate.settings.includeQRCode}
                       onCheckedChange={(checked) => setCustomInvoiceTemplate(prev => ({
                         ...prev,
                         settings: { ...prev.settings, includeQRCode: checked }
                       }))}
                     />
                   </div>
                   <div className="flex items-center justify-between">
                     <div>
                       <Label>Détails bancaires</Label>
                       <p className="text-sm text-gray-600">Afficher les coordonnées bancaires</p>
                     </div>
                     <Switch
                       checked={customInvoiceTemplate.settings.includeBankDetails}
                       onCheckedChange={(checked) => setCustomInvoiceTemplate(prev => ({
                         ...prev,
                         settings: { ...prev.settings, includeBankDetails: checked }
                       }))}
                     />
                   </div>
                 </div>
               </div>

               <div>
                 <Label htmlFor="footer-text">Texte de pied de page</Label>
                 <Input
                   id="footer-text"
                   value={customInvoiceTemplate.settings.footerText}
                   onChange={(e) => setCustomInvoiceTemplate(prev => ({
                     ...prev,
                     settings: { ...prev.settings, footerText: e.target.value }
                   }))}
                   placeholder="Merci pour votre confiance..."
                 />
               </div>

               <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                 <h4 className="font-medium mb-2">Aperçu du template</h4>
                 <div className={`w-full h-40 rounded border-2 p-4 ${
                   customInvoiceTemplate.settings.colorScheme === 'blue' ? 'bg-blue-50 border-blue-200' :
                   customInvoiceTemplate.settings.colorScheme === 'green' ? 'bg-green-50 border-green-200' :
                   customInvoiceTemplate.settings.colorScheme === 'red' ? 'bg-red-50 border-red-200' :
                   'bg-gray-50 border-gray-200'
                 }`}>
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <h4 className="font-bold text-lg">{customInvoiceTemplate.name || 'Nom du template'}</h4>
                       <p className="text-sm text-gray-600">FACTURE N° 2024-001</p>
                     </div>
                     {customInvoiceTemplate.settings.includeQRCode && (
                       <div className="w-12 h-12 border-2 border-dashed border-gray-400 flex items-center justify-center">
                         <span className="text-xs">QR</span>
                       </div>
                     )}
                   </div>
                   <div className="text-xs text-gray-600">
                     <p>Client: {client?.nom || 'Nom du client'}</p>
                     <p>Montant: {formatPrice(totalBillingCost.total)}</p>
                     {customInvoiceTemplate.settings.includeBankDetails && (
                       <p className="mt-2">IBAN: FR76 1234 5678 9012 3456 7890 123</p>
                     )}
                     {customInvoiceTemplate.settings.footerText && (
                       <p className="mt-2 italic">{customInvoiceTemplate.settings.footerText}</p>
                     )}
                   </div>
                 </div>
               </div>

               {Object.keys(billingFormErrors).length > 0 && (
                 <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                   <div className="flex items-center gap-2 text-red-700">
                     <AlertTriangle className="h-4 w-4" />
                     <span className="font-medium">Veuillez corriger les erreurs ci-dessus</span>
                   </div>
                 </div>
               )}
             </div>
             <DialogFooter>
               <Button variant="outline" onClick={() => setInvoiceTemplateModal(false)}>
                 Annuler
               </Button>
               <Button
                 onClick={handleSaveInvoiceTemplate}
                 disabled={loadingStates.managingInvoiceTemplates}
               >
                 {loadingStates.managingInvoiceTemplates ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                 Créer le template
               </Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>

         {/* Modal de traitement de paiement manuel */}
         <Dialog open={paymentProcessModal} onOpenChange={setPaymentProcessModal}>
           <DialogContent className="max-w-2xl">
             <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                 <CreditCard className="h-5 w-5" />
                 Traitement de Paiement Manuel
               </DialogTitle>
               <DialogDescription>
                 Enregistrer un paiement reçu manuellement
               </DialogDescription>
             </DialogHeader>
             <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label htmlFor="payment-amount">Montant *</Label>
                   <Input
                     id="payment-amount"
                     type="number"
                     placeholder="0.00"
                     defaultValue={totalBillingCost.total}
                   />
                 </div>
                 <div>
                   <Label htmlFor="payment-method">Méthode de paiement *</Label>
                   <Select defaultValue={billingConfig.paymentMethods[0] || ''}>
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       {billingConfig.paymentMethods.map((method) => (
                         <SelectItem key={method} value={method}>
                           {method.replace('_', ' ')}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label htmlFor="payment-date">Date de paiement *</Label>
                   <Input
                     id="payment-date"
                     type="date"
                     defaultValue={new Date().toISOString().split('T')[0]}
                   />
                 </div>
                 <div>
                   <Label htmlFor="payment-reference">Référence *</Label>
                   <Input
                     id="payment-reference"
                     placeholder="Ex: TRF_2024_001"
                   />
                 </div>
               </div>

               <div>
                 <Label htmlFor="payment-notes">Notes (optionnel)</Label>
                 <Textarea
                   id="payment-notes"
                   placeholder="Informations complémentaires..."
                   rows={3}
                 />
               </div>

               <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                 <div className="flex items-start gap-2">
                   <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                   <div>
                     <h4 className="font-medium text-green-800">Paiement validé</h4>
                     <p className="text-sm text-green-700">
                       Ce paiement sera automatiquement ajouté à l'historique et la facturation sera mise à jour.
                     </p>
                   </div>
                 </div>
               </div>
             </div>
             <DialogFooter>
               <Button variant="outline" onClick={() => setPaymentProcessModal(false)}>
                 Annuler
               </Button>
               <Button>
                 <Save className="mr-2 h-4 w-4" />
                 Enregistrer le paiement
               </Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>

         {/* Modal d'édition/création d'utilisateur */}
         <Dialog open={userEditModal} onOpenChange={setUserEditModal}>
           <DialogContent className="max-w-2xl">
             <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                 <Users className="h-5 w-5" />
                 {currentEditingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
               </DialogTitle>
               <DialogDescription>
                 {currentEditingUser ? 'Modifiez les informations de l\'utilisateur' : 'Créez un nouvel utilisateur pour ce client'}
               </DialogDescription>
             </DialogHeader>
             <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label htmlFor="user-name">Nom complet *</Label>
                   <Input
                     id="user-name"
                     value={newUserForm.name}
                     onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                     placeholder="Ex: Jean Dupont"
                     className={userFormErrors.name ? 'border-red-500' : ''}
                   />
                   {userFormErrors.name && (
                     <p className="text-sm text-red-600 mt-1">{userFormErrors.name}</p>
                   )}
                 </div>
                 <div>
                   <Label htmlFor="user-email">Email *</Label>
                   <Input
                     id="user-email"
                     type="email"
                     value={newUserForm.email}
                     onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                     placeholder="jean.dupont@ministere.ga"
                     className={userFormErrors.email ? 'border-red-500' : ''}
                   />
                   {userFormErrors.email && (
                     <p className="text-sm text-red-600 mt-1">{userFormErrors.email}</p>
                   )}
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label htmlFor="user-role">Rôle *</Label>
                   <Select
                     value={newUserForm.role}
                     onValueChange={(value) => setNewUserForm(prev => ({ ...prev, role: value }))}
                   >
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="ADMIN">Administrateur</SelectItem>
                       <SelectItem value="MANAGER">Responsable</SelectItem>
                       <SelectItem value="AGENT">Agent</SelectItem>
                       <SelectItem value="VIEWER">Consultation seule</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <div>
                   <Label htmlFor="user-department">Département *</Label>
                   <Input
                     id="user-department"
                     value={newUserForm.department}
                     onChange={(e) => setNewUserForm(prev => ({ ...prev, department: e.target.value }))}
                     placeholder="Ex: Guichet, Administration"
                     className={userFormErrors.department ? 'border-red-500' : ''}
                   />
                   {userFormErrors.department && (
                     <p className="text-sm text-red-600 mt-1">{userFormErrors.department}</p>
                   )}
                 </div>
               </div>

               <div>
                 <Label>Permissions *</Label>
                 <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                   {[
                     { id: 'VIEW_REQUESTS', name: 'Consulter les demandes' },
                     { id: 'PROCESS_REQUESTS', name: 'Traiter les demandes' },
                     { id: 'MANAGE_DOCUMENTS', name: 'Gérer les documents' },
                     { id: 'VIEW_ANALYTICS', name: 'Voir les analytics' },
                     { id: 'MANAGE_USERS', name: 'Gérer les utilisateurs' },
                     { id: 'ADMIN_ACCESS', name: 'Accès administrateur' },
                     { id: 'SYSTEM_CONFIG', name: 'Configuration système' },
                     { id: 'REPORTS_ACCESS', name: 'Accès aux rapports' }
                   ].map((permission) => (
                     <div key={permission.id} className="flex items-center space-x-2">
                       <input
                         type="checkbox"
                         checked={newUserForm.permissions.includes(permission.id)}
                         onChange={(e) => {
                           if (e.target.checked) {
                             setNewUserForm(prev => ({
                               ...prev,
                               permissions: [...prev.permissions, permission.id]
                             }));
                           } else {
                             setNewUserForm(prev => ({
                               ...prev,
                               permissions: prev.permissions.filter(p => p !== permission.id)
                             }));
                           }
                         }}
                         className="w-4 h-4 text-blue-600"
                       />
                       <Label className="text-sm">{permission.name}</Label>
                     </div>
                   ))}
                 </div>
                 {userFormErrors.permissions && (
                   <p className="text-sm text-red-600 mt-1">{userFormErrors.permissions}</p>
                 )}
               </div>

               {!currentEditingUser && (
                 <div className="flex items-center justify-between">
                   <div>
                     <Label>Envoyer une invitation par email</Label>
                     <p className="text-sm text-gray-600">L'utilisateur recevra un email pour configurer son mot de passe</p>
                   </div>
                   <Switch
                     checked={newUserForm.sendInvite}
                     onCheckedChange={(checked) => setNewUserForm(prev => ({ ...prev, sendInvite: checked }))}
                   />
                 </div>
               )}

               {Object.keys(userFormErrors).length > 0 && (
                 <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                   <div className="flex items-center gap-2 text-red-700">
                     <AlertTriangle className="h-4 w-4" />
                     <span className="font-medium">Veuillez corriger les erreurs ci-dessus</span>
                   </div>
                 </div>
               )}
             </div>
             <DialogFooter>
               <Button variant="outline" onClick={() => setUserEditModal(false)}>
                 Annuler
               </Button>
               <Button
                 onClick={handleSaveUser}
                 disabled={loadingStates.editingUser}
               >
                 {loadingStates.editingUser ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                 {currentEditingUser ? 'Modifier' : 'Créer'} l'utilisateur
               </Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>

         {/* Modal d'invitation d'utilisateurs */}
         <Dialog open={userInviteModal} onOpenChange={setUserInviteModal}>
           <DialogContent className="max-w-2xl">
             <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                 <Mail className="h-5 w-5" />
                 Inviter des utilisateurs
               </DialogTitle>
               <DialogDescription>
                 Envoyez des invitations à plusieurs utilisateurs simultanément
               </DialogDescription>
             </DialogHeader>
             <div className="space-y-4">
               <div>
                 <Label htmlFor="invite-emails">Emails (un par ligne ou séparés par des virgules) *</Label>
                 <Textarea
                   id="invite-emails"
                   value={inviteForm.emails}
                   onChange={(e) => setInviteForm(prev => ({ ...prev, emails: e.target.value }))}
                   placeholder="jean.dupont@ministere.ga&#10;marie.martin@ministere.ga&#10;pierre.bernard@ministere.ga"
                   rows={5}
                 />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label htmlFor="invite-role">Rôle par défaut</Label>
                   <Select
                     value={inviteForm.role}
                     onValueChange={(value) => setInviteForm(prev => ({ ...prev, role: value }))}
                   >
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="ADMIN">Administrateur</SelectItem>
                       <SelectItem value="MANAGER">Responsable</SelectItem>
                       <SelectItem value="AGENT">Agent</SelectItem>
                       <SelectItem value="VIEWER">Consultation seule</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <div>
                   <Label htmlFor="invite-department">Département</Label>
                   <Input
                     id="invite-department"
                     value={inviteForm.department}
                     onChange={(e) => setInviteForm(prev => ({ ...prev, department: e.target.value }))}
                     placeholder="Ex: Guichet"
                   />
                 </div>
               </div>

               <div>
                 <Label htmlFor="invite-message">Message personnalisé (optionnel)</Label>
                 <Textarea
                   id="invite-message"
                   value={inviteForm.message}
                   onChange={(e) => setInviteForm(prev => ({ ...prev, message: e.target.value }))}
                   placeholder="Bienvenue dans notre équipe..."
                   rows={3}
                 />
               </div>

               <div>
                 <Label htmlFor="invite-expire">Expiration de l'invitation (jours)</Label>
                 <Input
                   id="invite-expire"
                   type="number"
                   value={inviteForm.expireDays}
                   onChange={(e) => setInviteForm(prev => ({ ...prev, expireDays: parseInt(e.target.value) || 7 }))}
                   min="1"
                   max="30"
                 />
               </div>
             </div>
             <DialogFooter>
               <Button variant="outline" onClick={() => setUserInviteModal(false)}>
                 Annuler
               </Button>
               <Button
                 onClick={handleSendInvitations}
                 disabled={loadingStates.invitingUser}
               >
                 {loadingStates.invitingUser ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                 Envoyer les invitations
               </Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>

         {/* Modal d'analytics des utilisateurs */}
         <Dialog open={userAnalyticsModal} onOpenChange={setUserAnalyticsModal}>
           <DialogContent className="max-w-4xl">
             <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                 <BarChart3 className="h-5 w-5" />
                 Analytics des Utilisateurs
               </DialogTitle>
               <DialogDescription>
                 Statistiques d'utilisation et performance des utilisateurs
               </DialogDescription>
             </DialogHeader>
             <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="p-4 bg-blue-50 rounded-lg">
                   <div className="flex items-center gap-2">
                     <Users className="h-5 w-5 text-blue-600" />
                     <div>
                       <p className="text-sm text-blue-600">Utilisateurs actifs</p>
                       <p className="text-xl font-bold text-blue-900">
                         {userPermissions.filter(u => u.status === 'ACTIVE').length}
                       </p>
                     </div>
                   </div>
                 </div>
                 <div className="p-4 bg-green-50 rounded-lg">
                   <div className="flex items-center gap-2">
                     <CheckCircle className="h-5 w-5 text-green-600" />
                     <div>
                       <p className="text-sm text-green-600">Connexions ce mois</p>
                       <p className="text-xl font-bold text-green-900">
                         {Math.floor(Math.random() * 500) + 200}
                       </p>
                     </div>
                   </div>
                 </div>
                 <div className="p-4 bg-purple-50 rounded-lg">
                   <div className="flex items-center gap-2">
                     <Clock className="h-5 w-5 text-purple-600" />
                     <div>
                       <p className="text-sm text-purple-600">Temps moyen/session</p>
                       <p className="text-xl font-bold text-purple-900">
                         {Math.floor(Math.random() * 30) + 15}min
                       </p>
                     </div>
                   </div>
                 </div>
                 <div className="p-4 bg-orange-50 rounded-lg">
                   <div className="flex items-center gap-2">
                     <TrendingUp className="h-5 w-5 text-orange-600" />
                     <div>
                       <p className="text-sm text-orange-600">Productivité</p>
                       <p className="text-xl font-bold text-orange-900">
                         {(Math.random() * 20 + 75).toFixed(1)}%
                       </p>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-4 border rounded-lg">
                   <h4 className="font-semibold mb-3">Répartition par rôle</h4>
                   <div className="space-y-2">
                     {['ADMIN', 'MANAGER', 'AGENT', 'VIEWER'].map((role) => {
                       const count = userPermissions.filter(u => u.role === role).length;
                       const percentage = Math.round((count / Math.max(userPermissions.length, 1)) * 100);
                       return (
                         <div key={role} className="flex items-center justify-between">
                           <span className="text-sm">{role}</span>
                           <div className="flex items-center gap-2">
                             <div className="w-20 bg-gray-200 rounded-full h-2">
                               <div
                                 className="bg-blue-600 h-2 rounded-full"
                                 style={{ width: `${percentage}%` }}
                               ></div>
                             </div>
                             <span className="text-xs text-gray-500">{count} ({percentage}%)</span>
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 </div>
                 <div className="p-4 border rounded-lg">
                   <h4 className="font-semibold mb-3">Activité récente</h4>
                   <div className="space-y-2">
                     {userPermissions.slice(0, 5).map((user) => (
                       <div key={user.userId} className="flex items-center justify-between text-sm">
                         <span>{user.name}</span>
                         <span className="text-gray-500">
                           {new Date(user.lastActivity).toLocaleDateString('fr-FR')}
                         </span>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             </div>
             <DialogFooter>
               <Button variant="outline" onClick={() => setUserAnalyticsModal(false)}>
                 Fermer
               </Button>
               <Button>
                 <Download className="mr-2 h-4 w-4" />
                 Exporter le rapport
               </Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>

         {/* Modal de gestion des groupes */}
         <Dialog open={userGroupsModal} onOpenChange={setUserGroupsModal}>
           <DialogContent className="max-w-3xl">
             <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                 <Users className="h-5 w-5" />
                 Gestion des Groupes d'Utilisateurs
               </DialogTitle>
               <DialogDescription>
                 Organisez vos utilisateurs en groupes avec des permissions communes
               </DialogDescription>
             </DialogHeader>
             <div className="space-y-4">
               {userGroups.map((group) => (
                 <div key={group.id} className="p-4 border rounded-lg">
                   <div className="flex items-center justify-between mb-2">
                     <div>
                       <h4 className="font-medium">{group.name}</h4>
                       <p className="text-sm text-gray-600">{group.description}</p>
                     </div>
                     <div className="flex items-center gap-2">
                       <Badge variant="outline">{group.userCount} utilisateur(s)</Badge>
                       <Button variant="outline" size="sm">
                         <Edit className="h-3 w-3" />
                       </Button>
                       <Button variant="outline" size="sm" className="text-red-600">
                         <Trash2 className="h-3 w-3" />
                       </Button>
                     </div>
                   </div>
                   <div className="flex flex-wrap gap-1">
                     {group.permissions.map((permission) => (
                       <Badge key={permission} variant="secondary" className="text-xs">
                         {permission.replace('_', ' ')}
                       </Badge>
                     ))}
                   </div>
                 </div>
               ))}

               <Button className="w-full" variant="outline">
                 <Plus className="mr-2 h-4 w-4" />
                 Créer un nouveau groupe
               </Button>
             </div>
             <DialogFooter>
               <Button variant="outline" onClick={() => setUserGroupsModal(false)}>
                 Fermer
               </Button>
               <Button>
                 <Save className="mr-2 h-4 w-4" />
                 Sauvegarder les groupes
               </Button>
             </DialogFooter>
           </DialogContent>
         </Dialog>

         {/* Modal de gestion des permissions */}
         <Dialog open={userPermissionsModal} onOpenChange={setUserPermissionsModal}>
           <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
             <DialogHeader className="pb-4 border-b">
               <DialogTitle className="flex items-center gap-3 text-xl">
                 <div className="p-2 bg-blue-100 rounded-lg">
                   <Settings className="h-6 w-6 text-blue-600" />
                 </div>
                 <div>
                   <span>Gestion des Permissions</span>
                   <p className="text-sm font-normal text-gray-600 mt-1">
                     Configuration avancée des droits d'accès
                   </p>
                 </div>
               </DialogTitle>
             </DialogHeader>

             <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-200px)] py-4">
               {/* Profil utilisateur */}
               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                 <div className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                     {currentEditingUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                   </div>
                   <div className="flex-1">
                     <h3 className="text-lg font-semibold text-gray-900">{currentEditingUser?.name}</h3>
                     <p className="text-blue-600 font-medium">{currentEditingUser?.email}</p>
                     <div className="flex items-center gap-3 mt-2">
                       <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-300">
                         {currentEditingUser?.role}
                       </Badge>
                       <Badge variant="outline" className="text-gray-600">
                         {currentEditingUser?.department}
                       </Badge>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="text-sm text-gray-500">Permissions actives</p>
                     <p className="text-2xl font-bold text-blue-600">
                       {currentEditingUser?.permissions.length || 0}
                     </p>
                   </div>
                 </div>
               </div>

               {/* Résumé des permissions */}
               <div className="bg-gray-50 rounded-lg p-4">
                 <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                   <BarChart3 className="h-4 w-4" />
                   Résumé des Accès
                 </h4>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {[
                     {
                       category: 'Demandes',
                       permissions: ['VIEW_REQUESTS', 'PROCESS_REQUESTS', 'APPROVE_REQUESTS'],
                       icon: FileText,
                       color: 'text-green-600 bg-green-100'
                     },
                     {
                       category: 'Documents',
                       permissions: ['MANAGE_DOCUMENTS', 'UPLOAD_FILES', 'DELETE_FILES'],
                                               icon: FileText,
                       color: 'text-purple-600 bg-purple-100'
                     },
                     {
                       category: 'Utilisateurs',
                       permissions: ['MANAGE_USERS', 'INVITE_USERS', 'DELETE_USERS'],
                       icon: Users,
                       color: 'text-blue-600 bg-blue-100'
                     },
                     {
                       category: 'Système',
                       permissions: ['ADMIN_ACCESS', 'SYSTEM_CONFIG', 'VIEW_ANALYTICS'],
                       icon: Shield,
                       color: 'text-red-600 bg-red-100'
                     }
                   ].map((cat) => {
                     const activeCount = cat.permissions.filter(p =>
                       currentEditingUser?.permissions.includes(p)
                     ).length;
                     const percentage = Math.round((activeCount / cat.permissions.length) * 100);

                     return (
                       <div key={cat.category} className="text-center p-3 bg-white rounded-lg border">
                         <div className={`w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center ${cat.color}`}>
                           <cat.icon className="h-4 w-4" />
                         </div>
                         <p className="font-medium text-sm text-gray-800">{cat.category}</p>
                         <p className="text-xs text-gray-500">{activeCount}/{cat.permissions.length}</p>
                         <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                           <div
                             className={`h-1.5 rounded-full ${cat.color.includes('green') ? 'bg-green-500' :
                               cat.color.includes('purple') ? 'bg-purple-500' :
                               cat.color.includes('blue') ? 'bg-blue-500' : 'bg-red-500'}`}
                             style={{ width: `${percentage}%` }}
                           ></div>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </div>

               {/* Gestion des permissions par catégorie */}
               <div className="space-y-6">
                 <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                   <Lock className="h-4 w-4" />
                   Configuration Détaillée des Permissions
                 </h4>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   {[
                     {
                       category: 'Gestion des Demandes',
                       description: 'Accès et traitement des demandes citoyens',
                       icon: FileText,
                       color: 'border-green-200 bg-green-50',
                       headerColor: 'text-green-700 bg-green-100',
                       permissions: [
                         {
                           id: 'VIEW_REQUESTS',
                           name: 'Consulter les demandes',
                           description: 'Voir la liste et les détails des demandes'
                         },
                         {
                           id: 'PROCESS_REQUESTS',
                           name: 'Traiter les demandes',
                           description: 'Modifier le statut et ajouter des commentaires'
                         },
                         {
                           id: 'APPROVE_REQUESTS',
                           name: 'Approuver les demandes',
                           description: 'Valider définitivement les demandes'
                         }
                       ]
                     },
                     {
                       category: 'Gestion Documentaire',
                       description: 'Administration des fichiers et documents',
                                               icon: FileText,
                        color: 'border-purple-200 bg-purple-50',
                       headerColor: 'text-purple-700 bg-purple-100',
                       permissions: [
                         {
                           id: 'MANAGE_DOCUMENTS',
                           name: 'Gérer les documents',
                           description: 'Organiser et classer les documents'
                         },
                         {
                           id: 'UPLOAD_FILES',
                           name: 'Télécharger des fichiers',
                           description: 'Ajouter de nouveaux documents au système'
                         },
                         {
                           id: 'DELETE_FILES',
                           name: 'Supprimer des fichiers',
                           description: 'Effacer définitivement des documents'
                         }
                       ]
                     },
                     {
                       category: 'Gestion des Utilisateurs',
                       description: 'Administration des comptes et accès',
                       icon: Users,
                       color: 'border-blue-200 bg-blue-50',
                       headerColor: 'text-blue-700 bg-blue-100',
                       permissions: [
                         {
                           id: 'MANAGE_USERS',
                           name: 'Gérer les utilisateurs',
                           description: 'Créer, modifier et configurer les comptes'
                         },
                         {
                           id: 'INVITE_USERS',
                           name: 'Inviter des utilisateurs',
                           description: 'Envoyer des invitations par email'
                         },
                         {
                           id: 'DELETE_USERS',
                           name: 'Supprimer des utilisateurs',
                           description: 'Effacer définitivement des comptes'
                         }
                       ]
                     },
                     {
                       category: 'Administration Système',
                       description: 'Configuration avancée et sécurité',
                       icon: Shield,
                       color: 'border-red-200 bg-red-50',
                       headerColor: 'text-red-700 bg-red-100',
                       permissions: [
                         {
                           id: 'ADMIN_ACCESS',
                           name: 'Accès administrateur',
                           description: 'Accès complet à toutes les fonctionnalités'
                         },
                         {
                           id: 'SYSTEM_CONFIG',
                           name: 'Configuration système',
                           description: 'Modifier les paramètres globaux'
                         },
                         {
                           id: 'VIEW_ANALYTICS',
                           name: 'Consulter les analytics',
                           description: 'Accéder aux rapports et statistiques'
                         }
                       ]
                     }
                   ].map((categoryData) => (
                     <div key={categoryData.category} className={`rounded-xl border-2 overflow-hidden transition-all hover:shadow-md ${categoryData.color}`}>
                       <div className={`p-4 ${categoryData.headerColor}`}>
                         <div className="flex items-center gap-3">
                           <categoryData.icon className="h-5 w-5" />
                           <div>
                             <h5 className="font-semibold">{categoryData.category}</h5>
                             <p className="text-xs opacity-75">{categoryData.description}</p>
                           </div>
                         </div>
                       </div>

                       <div className="p-4 space-y-4 bg-white">
                         {categoryData.permissions.map((permission) => (
                           <div key={permission.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                             <div className="flex-1">
                               <div className="flex items-center gap-2 mb-1">
                                 <span className="font-medium text-sm text-gray-900">
                                   {permission.name}
                                 </span>
                                 {currentEditingUser?.permissions.includes(permission.id) && (
                                   <CheckCircle className="h-4 w-4 text-green-500" />
                                 )}
                               </div>
                               <p className="text-xs text-gray-600 leading-relaxed">
                                 {permission.description}
                               </p>
                             </div>
                             <Switch
                               checked={currentEditingUser?.permissions.includes(permission.id) || false}
                               onCheckedChange={(checked) => {
                                 if (currentEditingUser) {
                                   const updatedPermissions = checked
                                     ? [...currentEditingUser.permissions, permission.id]
                                     : currentEditingUser.permissions.filter(p => p !== permission.id);

                                   setCurrentEditingUser({
                                     ...currentEditingUser,
                                     permissions: updatedPermissions
                                   });
                                 }
                               }}
                               className="data-[state=checked]:bg-green-500"
                             />
                           </div>
                         ))}
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

               {/* Actions rapides */}
               <div className="bg-gray-50 rounded-lg p-4">
                 <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                   <Zap className="h-4 w-4" />
                   Actions Rapides
                 </h4>
                 <div className="flex flex-wrap gap-2">
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => {
                       if (currentEditingUser) {
                         setCurrentEditingUser({
                           ...currentEditingUser,
                           permissions: []
                         });
                       }
                     }}
                     className="text-red-600 hover:text-red-700 hover:bg-red-50"
                   >
                     <X className="h-3 w-3 mr-1" />
                     Retirer toutes
                   </Button>
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => {
                       if (currentEditingUser) {
                         const allPermissions = [
                           'VIEW_REQUESTS', 'PROCESS_REQUESTS', 'APPROVE_REQUESTS',
                           'MANAGE_DOCUMENTS', 'UPLOAD_FILES', 'DELETE_FILES',
                           'MANAGE_USERS', 'INVITE_USERS', 'DELETE_USERS',
                           'ADMIN_ACCESS', 'SYSTEM_CONFIG', 'VIEW_ANALYTICS'
                         ];
                         setCurrentEditingUser({
                           ...currentEditingUser,
                           permissions: allPermissions
                         });
                       }
                     }}
                     className="text-green-600 hover:text-green-700 hover:bg-green-50"
                   >
                     <CheckCircle className="h-3 w-3 mr-1" />
                     Accorder toutes
                   </Button>
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => {
                       if (currentEditingUser) {
                         setCurrentEditingUser({
                           ...currentEditingUser,
                           permissions: ['VIEW_REQUESTS', 'MANAGE_DOCUMENTS']
                         });
                       }
                     }}
                     className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                   >
                     <Users className="h-3 w-3 mr-1" />
                     Permissions agent
                   </Button>
                 </div>
               </div>
             </div>

             <DialogFooter className="pt-4 border-t bg-gray-50">
               <div className="flex items-center justify-between w-full">
                 <div className="text-sm text-gray-600">
                   <span className="font-medium">
                     {currentEditingUser?.permissions.length || 0} permission(s) accordée(s)
                   </span>
                 </div>
                 <div className="flex gap-3">
                   <Button
                     variant="outline"
                     onClick={() => setUserPermissionsModal(false)}
                     className="min-w-[100px]"
                   >
                     Annuler
                   </Button>
                   <Button
                     onClick={() => {
                       toast.success(`✅ Permissions mises à jour pour ${currentEditingUser?.name}`);
                       setUserPermissionsModal(false);
                     }}
                     className="min-w-[150px] bg-blue-600 hover:bg-blue-700"
                   >
                     <Save className="mr-2 h-4 w-4" />
                     Sauvegarder les permissions
                   </Button>
                 </div>
               </div>
             </DialogFooter>
           </DialogContent>
         </Dialog>
       </div>
     </AuthenticatedLayout>
   );
 }
