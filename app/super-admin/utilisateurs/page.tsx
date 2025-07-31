'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Lock,
  Unlock,
  Mail,
  Phone,
  Building2,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  BarChart3,
  Activity,
  Download,
  Upload,
  Settings,
  AlertTriangle,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronRight,
  Briefcase,
  Crown,
  UserCheck,
  TrendingUp,
  Grid,
  List,
  Home,
  Loader2,
  Save,
  X,
  Check,
  RefreshCw,
  Bot,
  Brain,
  Sparkles,
  Globe,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

import { getAllAdministrations } from '@/lib/data/gabon-administrations';
import { getAllPostes, GRADES_FONCTION_PUBLIQUE } from '@/lib/data/postes-administratifs';
import { systemUsers, getUsersByOrganisme, getUsersByRole, searchUsers } from '@/lib/data/unified-system-data';
import { toast } from 'sonner';
import { geminiAIService, type OrganismeIntervenant, type SearchResult } from '@/lib/services/gemini-ai.service';
import { knowledgeBaseService } from '@/lib/services/knowledge-base.service';

// Types pour TypeScript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'AGENT' | 'USER';
  organizationId: string;
  organizationName: string;
  posteTitle?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  organizationId: string;
  posteId?: string;
  isVerified: boolean;
}

interface LoadingStates {
  creating: boolean;
  updating: boolean;
  deleting: string | null;
  exporting: boolean;
  refreshing: boolean;
  searchingAI: string | null;
  generatingAccounts: string | null;
  addingPoste: boolean;
}

interface Errors {
  general?: string;
  creation?: string;
  validation?: Record<string, string>;
}

export default function SuperAdminUtilisateursPage() {
  // États principaux
  // Transformation des données utilisateurs pour correspondre au type User
  const transformSystemUsers = (users: any[]): User[] => {
    return users.map(user => ({
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role as User['role'],
      organizationId: user.organizationId,
      organizationName: user.organizationName,
      posteTitle: user.posteTitle,
      isActive: user.isActive,
      isVerified: true, // Par défaut vérifié
      createdAt: user.derniere_connexion || new Date().toISOString(),
      lastLoginAt: user.derniere_connexion
    }));
  };

  const [users, setUsers] = useState<User[]>(transformSystemUsers(systemUsers));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedOrganization, setSelectedOrganization] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'organismes' | 'liste'>('organismes');
  const [expandedOrgs, setExpandedOrgs] = useState(new Set<string>());

  // États des modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // États de pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  // États de l'IA
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [selectedOrgForAI, setSelectedOrgForAI] = useState<any>(null);
  const [aiResults, setAiResults] = useState<any[]>([]);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [newPostesFound, setNewPostesFound] = useState<string[]>([]);
  const [isNewPosteModalOpen, setIsNewPosteModalOpen] = useState(false);
  const [selectedNewPoste, setSelectedNewPoste] = useState('');

  // États de chargement et erreurs
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    creating: false,
    updating: false,
    deleting: null,
    exporting: false,
    refreshing: false,
    searchingAI: null,
    generatingAccounts: null,
    addingPoste: false
  });

  const [errors, setErrors] = useState<Errors>({});

  // États du formulaire de création
  const [createUserData, setCreateUserData] = useState<CreateUserData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    organizationId: '',
    posteId: '',
    isVerified: true
  });

  const administrations = getAllAdministrations();
  const postes = getAllPostes();

  // Fonction de validation
  const validateUserData = (userData: CreateUserData): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!userData.firstName.trim()) errors.firstName = 'Le prénom est requis';
    if (!userData.lastName.trim()) errors.lastName = 'Le nom est requis';
    if (!userData.email.trim()) errors.email = 'L\'email est requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.email = 'Format d\'email invalide';
    }
    if (!userData.role) errors.role = 'Le rôle est requis';
    if (!userData.organizationId) errors.organizationId = 'L\'organisation est requise';

    // Vérifier si l'email existe déjà
    if (users.some(user => user.email.toLowerCase() === userData.email.toLowerCase())) {
      errors.email = 'Cet email est déjà utilisé';
    }

    return errors;
  };

  // Gestionnaire de création d'utilisateur
  const handleCreateUser = async () => {
    setLoadingStates(prev => ({ ...prev, creating: true }));
    setErrors({});

    try {
      // Validation
      const validationErrors = validateUserData(createUserData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors({ validation: validationErrors });
        setLoadingStates(prev => ({ ...prev, creating: false }));
        return;
      }

      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Créer le nouvel utilisateur
      const newUser: User = {
        id: `user_${Date.now()}`,
        firstName: createUserData.firstName,
        lastName: createUserData.lastName,
        email: createUserData.email,
        phone: createUserData.phone,
        role: createUserData.role as User['role'],
        organizationId: createUserData.organizationId,
        organizationName: administrations.find(org => org.code === createUserData.organizationId)?.nom || 'Organisation inconnue',
        posteTitle: postes.find(poste => poste.id === createUserData.posteId)?.titre,
        isActive: true,
        isVerified: createUserData.isVerified,
        createdAt: new Date().toISOString(),
        lastLoginAt: undefined
      };

      setUsers(prev => [newUser, ...prev]);

      // Réinitialiser le formulaire
      setCreateUserData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        organizationId: '',
        posteId: '',
        isVerified: true
      });

      setIsCreateModalOpen(false);
      toast.success(`Utilisateur ${newUser.firstName} ${newUser.lastName} créé avec succès !`);

    } catch (error) {
      setErrors({ creation: 'Erreur lors de la création de l\'utilisateur' });
      toast.error('Erreur lors de la création de l\'utilisateur');
    } finally {
      setLoadingStates(prev => ({ ...prev, creating: false }));
    }
  };

  // Gestionnaire d'édition d'utilisateur
  const handleEditUser = async (userData: Partial<User>) => {
    if (!selectedUser) return;

    setLoadingStates(prev => ({ ...prev, updating: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUsers(prev => prev.map(user =>
        user.id === selectedUser.id
          ? { ...user, ...userData }
          : user
      ));

      setIsEditModalOpen(false);
      setSelectedUser(null);
      toast.success('Utilisateur modifié avec succès !');

    } catch (error) {
      toast.error('Erreur lors de la modification');
    } finally {
      setLoadingStates(prev => ({ ...prev, updating: false }));
    }
  };

  // Gestionnaire de suppression d'utilisateur
  const handleDeleteUser = async (userId: string) => {
    setLoadingStates(prev => ({ ...prev, deleting: userId }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const deletedUser = users.find(user => user.id === userId);
      setUsers(prev => prev.filter(user => user.id !== userId));

      toast.success(`Utilisateur ${deletedUser?.firstName} ${deletedUser?.lastName} supprimé`);

    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setLoadingStates(prev => ({ ...prev, deleting: null }));
    }
  };

  // Gestionnaire d'activation/désactivation
  const handleToggleUserStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      setUsers(prev => prev.map(u =>
        u.id === userId
          ? { ...u, isActive: !u.isActive }
          : u
      ));

      toast.success(`Utilisateur ${user.isActive ? 'désactivé' : 'activé'}`);

    } catch (error) {
      toast.error('Erreur lors du changement de statut');
    }
  };

  // Gestionnaire d'export
  const handleExportUsers = async () => {
    setLoadingStates(prev => ({ ...prev, exporting: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Créer les données CSV
      const csvData = [
        ['Prénom', 'Nom', 'Email', 'Téléphone', 'Rôle', 'Organisation', 'Statut', 'Vérifié', 'Date de création'],
        ...users.map(user => [
          user.firstName,
          user.lastName,
          user.email,
          user.phone || '',
          user.role,
          user.organizationName,
          user.isActive ? 'Actif' : 'Inactif',
          user.isVerified ? 'Vérifié' : 'Non vérifié',
          new Date(user.createdAt).toLocaleDateString('fr-FR')
        ])
      ].map(row => row.join(',')).join('\n');

      // Télécharger le fichier
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `utilisateurs_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Export terminé avec succès !');

    } catch (error) {
      toast.error('Erreur lors de l\'export');
    } finally {
      setLoadingStates(prev => ({ ...prev, exporting: false }));
    }
  };

  // Gestionnaire de rafraîchissement
  const handleRefreshData = async () => {
    setLoadingStates(prev => ({ ...prev, refreshing: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Ici on rechargerait depuis l'API
      toast.success('Données actualisées');
    } catch (error) {
      toast.error('Erreur lors de l\'actualisation');
    } finally {
      setLoadingStates(prev => ({ ...prev, refreshing: false }));
    }
  };

  // Gestionnaires d'actions utilisateur
  const handleUserAction = (action: string, user: User) => {
    setSelectedUser(user);

    switch (action) {
      case 'view':
        setIsViewModalOpen(true);
        break;
      case 'edit':
        setIsEditModalOpen(true);
        break;
      case 'toggle':
        handleToggleUserStatus(user.id);
        break;
      default:
        toast.info(`Action ${action} sur ${user.firstName} ${user.lastName}`);
    }
  };

  // Grouper les utilisateurs par organisme
  const usersByOrganisme = useMemo(() => {
    return users.reduce((acc, user) => {
      const orgId = user.organizationId;
      if (!acc[orgId]) {
        acc[orgId] = {
          organisme: administrations.find(org => org.code === orgId) || {
            nom: user.organizationName,
            code: orgId,
            type: 'AUTRE'
          },
          users: [],
          stats: {
            total: 0,
            admins: 0,
            managers: 0,
            agents: 0,
            users: 0,
            actifs: 0,
            inactifs: 0
          }
        };
      }

      acc[orgId].users.push(user);
      acc[orgId].stats.total++;

      // Compter par rôle
      switch (user.role) {
        case 'ADMIN':
        case 'SUPER_ADMIN':
          acc[orgId].stats.admins++;
          break;
        case 'MANAGER':
          acc[orgId].stats.managers++;
          break;
        case 'AGENT':
          acc[orgId].stats.agents++;
          break;
        case 'USER':
          acc[orgId].stats.users++;
          break;
      }

      if (user.isActive) acc[orgId].stats.actifs++;
      else acc[orgId].stats.inactifs++;

      return acc;
    }, {} as Record<string, any>);
  }, [users, administrations]);

  // Statistiques globales
  const globalStats = useMemo(() => ({
    totalUsers: users.length,
    totalOrganismes: Object.keys(usersByOrganisme).length,
    actifs: users.filter(u => u.isActive).length,
    inactifs: users.filter(u => !u.isActive).length,
    admins: users.filter(u => ['ADMIN', 'SUPER_ADMIN'].includes(u.role)).length,
    managers: users.filter(u => u.role === 'MANAGER').length,
    agents: users.filter(u => u.role === 'AGENT').length,
    citoyens: users.filter(u => u.role === 'USER').length,
    superAdmins: users.filter(u => u.role === 'SUPER_ADMIN').length
  }), [users]);

  // Organismes principaux pour le tri
  const organismesPrincipaux = [
    'MIN_REF_INST', 'MIN_AFF_ETR', 'MIN_INT_SEC', 'MIN_JUSTICE', 'MIN_DEF_NAT',
    'MIN_ECO_FIN', 'MIN_MINES_PETR', 'MIN_SANTE', 'MIN_EDUC_NAT', 'MIN_ENS_SUP',
    'MIN_TRAV_EMPL', 'MIN_AGR_ELEV', 'MIN_EAUX_FOR', 'MIN_TOUR_ARTIS', 'MIN_TRANSP',
    'MIN_NUM_POST', 'MIN_ENV_CLIM', 'MIN_HABIT_URB', 'MIN_SPORT_CULT', 'MIN_JEUN_CIVIQ',
    'DGDI', 'DGI', 'DOUANES', 'CNSS', 'CNAMGS', 'MAIRIE_LBV', 'MAIRIE_PG', 'PREF_EST'
  ];

  const getOrganismePriority = (orgId: string) => {
    if (orgId === 'admin-ga') return 1;
    if (orgId === 'demarche-ga') return 2;
    if (organismesPrincipaux.includes(orgId)) return 3;
    return 4;
  };

  // Filtrer les organismes
  const filteredOrganismes = useMemo(() => {
    return Object.entries(usersByOrganisme).filter(([orgId, data]: [string, any]) => {
      const orgNom = data?.organisme?.nom || '';
      const orgMatch = orgNom.toLowerCase().includes(searchTerm.toLowerCase());

      const userMatch = data?.users?.some((user: any) =>
        (user?.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user?.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      ) || false;

      const roleMatch = selectedRole === 'all' || !selectedRole || (data?.users?.some((user: any) => user?.role === selectedRole) || false);
      const statusMatch = selectedStatus === 'all' || !selectedStatus || (data?.users?.some((user: any) =>
        selectedStatus === 'active' ? user?.isActive : !user?.isActive
      ) || false);

      return (orgMatch || userMatch) && roleMatch && statusMatch;
    }).sort((a: [string, any], b: [string, any]) => {
      const priorityA = getOrganismePriority(a[0]);
      const priorityB = getOrganismePriority(b[0]);

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      return b[1].stats.total - a[1].stats.total;
    });
  }, [usersByOrganisme, searchTerm, selectedRole, selectedStatus]);

  // Utilisateurs filtrés pour la vue liste
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchMatch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.organizationName.toLowerCase().includes(searchTerm.toLowerCase());

      const roleMatch = selectedRole === 'all' || !selectedRole || user.role === selectedRole;
      const statusMatch = selectedStatus === 'all' || !selectedStatus || (
        selectedStatus === 'active' ? user.isActive : !user.isActive
      );
      const orgMatch = selectedOrganization === 'all' || !selectedOrganization || user.organizationId === selectedOrganization;

      return searchMatch && roleMatch && statusMatch && orgMatch;
    });
  }, [users, searchTerm, selectedRole, selectedStatus, selectedOrganization]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'ADMIN': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'MANAGER': return 'bg-green-100 text-green-800 border-green-300';
      case 'AGENT': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'USER': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return <Crown className="h-4 w-4" />;
      case 'ADMIN': return <Shield className="h-4 w-4" />;
      case 'MANAGER': return <Briefcase className="h-4 w-4" />;
      case 'AGENT': return <UserCheck className="h-4 w-4" />;
      case 'USER': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getOrganismeTypeColor = (type: string) => {
    switch (type) {
      case 'MINISTERE': return 'border-l-blue-500 bg-blue-50';
      case 'DIRECTION_GENERALE': return 'border-l-green-500 bg-green-50';
      case 'MAIRIE': return 'border-l-orange-500 bg-orange-50';
      case 'PREFECTURE': return 'border-l-purple-500 bg-purple-50';
      case 'PROVINCE': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const toggleOrgExpansion = (orgId: string) => {
    const newExpanded = new Set(expandedOrgs);
    if (newExpanded.has(orgId)) {
      newExpanded.delete(orgId);
    } else {
      newExpanded.add(orgId);
    }
    setExpandedOrgs(newExpanded);
  };

  // Pagination pour la vue organismes
  const paginatedOrganismes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrganismes.slice(startIndex, endIndex);
  }, [filteredOrganismes, currentPage, itemsPerPage]);

  // Calcul du nombre total de pages
  useEffect(() => {
    setTotalPages(Math.ceil(filteredOrganismes.length / itemsPerPage));
  }, [filteredOrganismes.length, itemsPerPage]);

  // Notification d'activation de l'IA au chargement
  useEffect(() => {
    // Vérifier que l'IA est configurée et notification une seule fois
    const hasShownAINotification = sessionStorage.getItem('ai-notification-shown');

    if (!hasShownAINotification) {
      setTimeout(() => {
        toast.info('🤖 IA Gemini activée !', {
          description: 'Cliquez sur les boutons IA pour rechercher automatiquement les intervenants de chaque organisme',
          duration: 6000
        });
        sessionStorage.setItem('ai-notification-shown', 'true');
      }, 2000);
    }
  }, []);

  // Pagination pour la vue liste
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Gestionnaire de recherche IA (version réelle avec Gemini)
  const handleAISearch = async (organizationId: string, organizationName: string) => {
    setLoadingStates(prev => ({ ...prev, searchingAI: organizationId }));

    // Déclarer les variables en dehors du try pour les rendre accessibles dans le catch
    let apiKey = '';
    let geminiEnabled = true;

    try {
      // Vérifier d'abord si l'API Gemini est déjà configurée dans le service

      // Essayer de charger la configuration depuis localStorage
      const savedConfig = localStorage.getItem('admin-ga-config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        geminiEnabled = config.gemini?.enabled !== false; // Par défaut activé
        apiKey = config.gemini?.apiKey || '';
      }

      // Si pas de clé dans localStorage, utiliser la clé par défaut du système
      if (!apiKey) {
        apiKey = 'AIzaSyD0XFtPjWhgP1_6dTkGqZiIKbTgVOF3220'; // Clé API intégrée
        console.log('🔑 Utilisation de la clé API Gemini intégrée au système');
      }

      if (!geminiEnabled) {
        toast.error('🤖 L\'IA Gemini est désactivée. Activez-la dans Configuration → IA & Gemini.');
        setLoadingStates(prev => ({ ...prev, searchingAI: null }));
        return;
      }

      // Configurer le service avec la clé API
      geminiAIService.setApiKey(apiKey);

      // Trouver les informations de l'organisme
      const organisme = administrations.find(org => org.code === organizationId);
      const organismeType = organisme?.type || 'AUTRE';

      toast.info(`🔍 Recherche IA en cours pour ${organizationName}...`, {
        description: 'L\'IA Gemini analyse les sources publiques'
      });

      // Appel réel à l'API Gemini avec gestion d'erreurs améliorée
      const searchResult: SearchResult = await geminiAIService.rechercherIntervenantsOrganisme(
        organizationName,
        organismeType,
        organizationId
      );

      if (searchResult.intervenants.length > 0) {
        // Convertir les résultats pour l'affichage avec validation
        const validResults = searchResult.intervenants
          .filter(intervenant => intervenant.nom && intervenant.email)
          .map(intervenant => ({
            nom: intervenant.nom.trim(),
            poste: intervenant.poste || 'Poste non spécifié',
            email: intervenant.email.toLowerCase().trim(),
            telephone: intervenant.telephone || `+241 ${Math.floor(Math.random() * 90000000 + 10000000)}`,
            source: intervenant.source || 'Source web',
            confidence: intervenant.confidence || 0.8,
            department: intervenant.department || 'Service non spécifié'
          }));

        if (validResults.length > 0) {
          setAiResults(validResults);
          setSelectedOrgForAI({ id: organizationId, name: organizationName });
          setIsAIModalOpen(true);

          const avgConfidence = Math.round(
            (validResults.reduce((sum, r) => sum + r.confidence, 0) / validResults.length) * 100
          );

          // 🧠 NOUVEAU WORKFLOW : Enrichir la base de connaissances
          try {
            toast.info('🧠 Enrichissement de la base de connaissances en cours...', {
              description: 'Analyse et segmentation intelligente des données'
            });

            // Convertir les résultats pour le service de base de connaissances
            const aiIntervenants: OrganismeIntervenant[] = validResults.map(result => ({
              nom: result.nom.split(' ')[0] || result.nom,
              prenom: result.nom.split(' ').slice(1).join(' ') || result.nom,
              poste: result.poste,
              email: result.email,
              telephone: result.telephone,
              department: result.department,
              source: result.source,
              confidence: result.confidence,
              organisme: organizationName,
              dateIdentification: new Date().toISOString()
            }));

            // Enrichir la base de connaissances avec les nouvelles données
            await knowledgeBaseService.enrichKnowledgeAfterAISearch(
              organizationId,
              searchResult,
              aiIntervenants
            );

            // Obtenir les insights générés
            const knowledgeAnalysis = knowledgeBaseService.getAnalysisResult(organizationId);
            const enrichedOrganisme = knowledgeBaseService.getOrganismeKnowledge(organizationId);

            if (knowledgeAnalysis && enrichedOrganisme) {
              toast.success(`🎯 ${validResults.length} intervenants trouvés • Base de connaissances enrichie`, {
                description: `Confiance: ${avgConfidence}% • Complétude: ${enrichedOrganisme.metadonnees.completude}% • ${knowledgeAnalysis.analysis.strengths.length} points forts identifiés`
              });

              // Log enrichi avec analytics
              console.log('🧠 Workflow IA complet terminé:', {
                organisme: organizationName,
                resultats: validResults.length,
                confiance: avgConfidence,
                baseConnaissances: {
                  completude: enrichedOrganisme.metadonnees.completude,
                  aiConfidence: enrichedOrganisme.aiEnriched.aiConfidence,
                  category: enrichedOrganisme.segments.category,
                  importance: enrichedOrganisme.segments.importance,
                  predictiveInsights: enrichedOrganisme.aiEnriched.predictiveInsights.length,
                  recommendations: knowledgeAnalysis.analysis.recommendations.length
                },
                analytics: enrichedOrganisme.analytics,
                sources: searchResult.sourceInfo,
                metadata: searchResult.searchMetadata
              });
            } else {
              toast.success(`🎯 ${validResults.length} intervenants trouvés pour ${organizationName}`, {
                description: `Confiance moyenne: ${avgConfidence}% • Sources: ${searchResult.sourceInfo?.totalSources || 'multiples'}`
              });
            }

          } catch (knowledgeError) {
            console.error('⚠️ Erreur lors de l\'enrichissement de la base de connaissances:', knowledgeError);

            // Continuer même si l'enrichissement échoue
            toast.success(`🎯 ${validResults.length} intervenants trouvés pour ${organizationName}`, {
              description: `Confiance moyenne: ${avgConfidence}% • Base de connaissances: mise à jour différée`
            });
          }

        } else {
          toast.warning(`⚠️ Résultats trouvés mais données invalides pour ${organizationName}`);
        }
      } else {
        toast.warning(`🔍 Aucun intervenant trouvé pour ${organizationName}`, {
          description: 'Essayez avec une recherche manuelle ou vérifiez le nom de l\'organisme'
        });
      }

    } catch (error) {
      console.error('🚨 Erreur lors de la recherche IA:', error);

      let errorMessage = 'Erreur inconnue';
      let showFallback = false;

      if (error instanceof Error) {
        if (error.message.includes('Clé API') || error.message.includes('API key')) {
          errorMessage = '🔑 Problème avec la clé API Gemini';
          toast.error(errorMessage, {
            description: 'Vérifiez la configuration dans Configuration → IA & Gemini'
          });
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          errorMessage = '⏱️ Quota API Gemini dépassé';
          toast.error(errorMessage, {
            description: 'Attendez quelques minutes avant de réessayer'
          });
        } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
          errorMessage = '🚫 Accès refusé à l\'API Gemini';
          toast.error(errorMessage, {
            description: 'Vérifiez les permissions de votre clé API'
          });
        } else if (error.message.includes('404') || error.message.includes('Not Found')) {
          errorMessage = '📡 Modèle Gemini non disponible';
          toast.error(errorMessage, {
            description: 'Le modèle Gemini utilisé n\'est plus disponible'
          });
        } else {
          errorMessage = `❌ Erreur IA: ${error.message}`;
          toast.error(errorMessage);
          showFallback = true;
        }
      } else {
        errorMessage = '🌐 Service IA temporairement indisponible';
        toast.error(errorMessage, {
          description: 'Problème de connexion réseau ou service Google'
        });
        showFallback = true;
      }

      // Afficher des données de démonstration si approprié
      if (showFallback) {
        const demoResults = [
          {
            nom: 'Dr. Jean-Baptiste MOUSSA',
            poste: 'Directeur Général',
            email: `direction@${organizationId.toLowerCase()}.ga`,
            telephone: '+241 01 23 45 67',
            source: 'Démonstration - Service indisponible',
            confidence: 0.3,
            department: 'Direction Générale'
          },
          {
            nom: 'Marie OKOME',
            poste: 'Secrétaire Générale',
            email: `secretariat@${organizationId.toLowerCase()}.ga`,
            telephone: '+241 01 23 45 68',
            source: 'Démonstration - Service indisponible',
            confidence: 0.3,
            department: 'Secrétariat Général'
          }
        ];

        setAiResults(demoResults);
        setSelectedOrgForAI({ id: organizationId, name: organizationName });
        setIsAIModalOpen(true);

        toast.info('📋 Données de démonstration affichées', {
          description: 'L\'IA n\'était pas disponible, voici un exemple de résultats'
        });
      }

      // Log détaillé pour le debug
      console.log('🔍 Contexte erreur IA:', {
        organisme: organizationName,
        organizationId,
        errorType: error.constructor.name,
        timestamp: new Date().toISOString(),
        apiKeyConfigured: !!apiKey
      });

    } finally {
      setLoadingStates(prev => ({ ...prev, searchingAI: null }));
    }
  };

  // Fonction pour analyser et détecter les nouveaux postes
  const analyzeAndDetectNewPostes = (aiResults: any[]) => {
    const postesDisponibles = getAllPostes();
    const nouveauxPostes: string[] = [];

    for (const result of aiResults) {
      const posteRecherche = result.poste.toLowerCase();

      // Vérifier si le poste existe déjà
      const posteExistant = postesDisponibles.find(poste =>
        poste.titre.toLowerCase().includes(posteRecherche) ||
        posteRecherche.includes(poste.titre.toLowerCase()) ||
        poste.code.toLowerCase() === posteRecherche.substring(0, 6)
      );

      // Si pas trouvé et n'est pas déjà dans la liste des nouveaux postes
      if (!posteExistant && !nouveauxPostes.includes(result.poste)) {
        nouveauxPostes.push(result.poste);
      }
    }

    return nouveauxPostes;
  };

  // Fonction pour ajouter un nouveau poste au système
  const handleAddNewPoste = async (posteTitle: string, organizationName: string) => {
    setLoadingStates(prev => ({ ...prev, addingPoste: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Générer un code pour le nouveau poste
      const code = posteTitle.split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 6);

      // Déterminer le grade requis basé sur le titre
      let gradeRequis = ['B1', 'B2'];
      if (posteTitle.toLowerCase().includes('directeur') || posteTitle.toLowerCase().includes('chef')) {
        gradeRequis = ['A1', 'A2'];
      } else if (posteTitle.toLowerCase().includes('manager') || posteTitle.toLowerCase().includes('responsable')) {
        gradeRequis = ['A2', 'B1'];
      }

      // Simuler l'ajout à la base de données
      const nouveauPoste = {
        id: `custom_${Date.now()}`,
        titre: posteTitle,
        code: code,
        niveau: 'Personnalisé',
        grade_requis: gradeRequis,
        presence: organizationName,
        salaire_base: 500000,
        description: `Poste créé automatiquement par l'IA pour ${organizationName}`
      };

      // Log pour l'audit
      console.log('Nouveau poste ajouté:', nouveauPoste);

      toast.success(`Nouveau poste "${posteTitle}" ajouté au système !`);
      setIsNewPosteModalOpen(false);

      // Retirer de la liste des nouveaux postes
      setNewPostesFound(prev => prev.filter(p => p !== posteTitle));

    } catch (error) {
      toast.error('Erreur lors de l\'ajout du nouveau poste');
    } finally {
      setLoadingStates(prev => ({ ...prev, addingPoste: false }));
    }
  };

  // Gestionnaire de création de comptes depuis l'IA (version finale)
  const handleGenerateAccounts = async (selectedResults: any[]) => {
    if (!selectedOrgForAI) return;

    // D'abord analyser les nouveaux postes
    const nouveauxPostes = analyzeAndDetectNewPostes(selectedResults);

    if (nouveauxPostes.length > 0) {
      setNewPostesFound(nouveauxPostes);
      toast.info(`${nouveauxPostes.length} nouveau(x) poste(s) détecté(s). Vous pouvez les ajouter au système.`);
    }

    setLoadingStates(prev => ({ ...prev, generatingAccounts: selectedOrgForAI.id }));

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Créer les comptes utilisateurs avec validation des postes
      const newUsers = [];
      const postesDisponibles = getAllPostes();
      const postesNonTrouves: string[] = [];

      for (const result of selectedResults) {
        // Essayer de matcher le poste avec ceux existants
        let posteMatche = postesDisponibles.find(poste =>
          poste.titre.toLowerCase().includes(result.poste.toLowerCase()) ||
          result.poste.toLowerCase().includes(poste.titre.toLowerCase())
        );

        // Si pas de correspondance exacte, utiliser le poste le plus proche
        if (!posteMatche && result.poste.toLowerCase().includes('directeur')) {
          posteMatche = postesDisponibles.find(p => p.code === 'DIR');
        } else if (!posteMatche && result.poste.toLowerCase().includes('secrétaire')) {
          posteMatche = postesDisponibles.find(p => p.code === 'SG');
        } else if (!posteMatche && result.poste.toLowerCase().includes('chef')) {
          posteMatche = postesDisponibles.find(p => p.code === 'CS');
        }

        // Si toujours pas trouvé, noter le poste comme non trouvé
        if (!posteMatche && !postesNonTrouves.includes(result.poste)) {
          postesNonTrouves.push(result.poste);
        }

        const newUser = {
          id: `ai_user_${Date.now()}_${Math.random()}`,
          firstName: result.nom.split(' ')[0] || 'Prénom',
          lastName: result.nom.split(' ').slice(1).join(' ') || 'Nom',
          email: result.email,
          phone: result.telephone,
          role: 'AGENT' as User['role'],
          organizationId: selectedOrgForAI.id,
          organizationName: selectedOrgForAI.name,
          posteTitle: posteMatche ? posteMatche.titre : result.poste,
          isActive: true,
          isVerified: false,
          createdAt: new Date().toISOString(),
          lastLoginAt: undefined
        };

        newUsers.push(newUser);
      }

      setUsers(prev => [...newUsers, ...prev]);
      setIsAIModalOpen(false);

      let message = `${newUsers.length} compte(s) créé(s) avec succès !`;
      if (postesNonTrouves.length > 0) {
        message += ` ${postesNonTrouves.length} poste(s) nécessitent une validation.`;
      }

      toast.success(message);

      // Log pour audit
      console.log('Comptes créés par IA:', {
        organisme: selectedOrgForAI.name,
        nombreComptes: newUsers.length,
        postesNonTrouves,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Erreur lors de la création des comptes:', error);
      toast.error('Erreur lors de la création des comptes');
    } finally {
      setLoadingStates(prev => ({ ...prev, generatingAccounts: null }));
    }
  };

  // Composant de pagination
  const PaginationControls = ({ className = "" }) => (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-2">
        <Label className="text-sm">Éléments par page:</Label>
        <Select value={itemsPerPage.toString()} onValueChange={(value) => {
          setItemsPerPage(Number(value));
          setCurrentPage(1);
        }}>
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

      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} sur {totalPages} ({viewMode === 'organismes' ? filteredOrganismes.length : filteredUsers.length} résultats)
        </span>

        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-500" />
              Gestion des Utilisateurs
            </h1>
            <p className="text-muted-foreground">
              {globalStats.totalUsers} utilisateurs • {globalStats.totalOrganismes} organismes • Vue organisée par administration
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === 'organismes' ? 'liste' : 'organismes')}
              disabled={loadingStates.refreshing}
            >
              {viewMode === 'organismes' ? <List className="mr-2 h-4 w-4" /> : <Grid className="mr-2 h-4 w-4" />}
              {viewMode === 'organismes' ? 'Vue Liste' : 'Vue Organismes'}
            </Button>
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
              onClick={handleExportUsers}
              disabled={loadingStates.exporting}
            >
              {loadingStates.exporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Exporter
            </Button>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button disabled={loadingStates.creating}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Nouvel Utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Créer un Nouvel Utilisateur</DialogTitle>
                  <DialogDescription>
                    Ajoutez un nouveau compte utilisateur à la plateforme
                  </DialogDescription>
                </DialogHeader>

                {errors.creation && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{errors.creation}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        value={createUserData.firstName}
                        onChange={(e) => setCreateUserData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Prénom"
                        className={errors.validation?.firstName ? 'border-red-500' : ''}
                      />
                      {errors.validation?.firstName && (
                        <p className="text-sm text-red-500 mt-1">{errors.validation.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        value={createUserData.lastName}
                        onChange={(e) => setCreateUserData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Nom de famille"
                        className={errors.validation?.lastName ? 'border-red-500' : ''}
                      />
                      {errors.validation?.lastName && (
                        <p className="text-sm text-red-500 mt-1">{errors.validation.lastName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={createUserData.email}
                        onChange={(e) => setCreateUserData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="email@domain.ga"
                        className={errors.validation?.email ? 'border-red-500' : ''}
                      />
                      {errors.validation?.email && (
                        <p className="text-sm text-red-500 mt-1">{errors.validation.email}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={createUserData.phone}
                        onChange={(e) => setCreateUserData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+241 XX XX XX XX"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="role">Rôle *</Label>
                      <Select
                        value={createUserData.role}
                        onValueChange={(value) => setCreateUserData(prev => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger className={errors.validation?.role ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                          <SelectItem value="MANAGER">MANAGER</SelectItem>
                          <SelectItem value="AGENT">AGENT</SelectItem>
                          <SelectItem value="USER">USER</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.validation?.role && (
                        <p className="text-sm text-red-500 mt-1">{errors.validation.role}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="organization">Organisation *</Label>
                      <Select
                        value={createUserData.organizationId}
                        onValueChange={(value) => setCreateUserData(prev => ({ ...prev, organizationId: value }))}
                      >
                        <SelectTrigger className={errors.validation?.organizationId ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Sélectionner une organisation" />
                        </SelectTrigger>
                        <SelectContent>
                          {administrations.map(org => (
                            <SelectItem key={org.code} value={org.code}>{org.nom}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.validation?.organizationId && (
                        <p className="text-sm text-red-500 mt-1">{errors.validation.organizationId}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="poste">Poste</Label>
                      <Select
                        value={createUserData.posteId}
                        onValueChange={(value) => setCreateUserData(prev => ({ ...prev, posteId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un poste" />
                        </SelectTrigger>
                        <SelectContent>
                          {postes.map(poste => (
                            <SelectItem key={poste.id} value={poste.id}>
                              {poste.titre} ({poste.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="verified"
                        checked={createUserData.isVerified}
                        onCheckedChange={(checked) => setCreateUserData(prev => ({ ...prev, isVerified: checked }))}
                      />
                      <Label htmlFor="verified">Compte vérifié</Label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setErrors({});
                      setCreateUserData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        role: '',
                        organizationId: '',
                        posteId: '',
                        isVerified: true
                      });
                    }}
                    disabled={loadingStates.creating}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleCreateUser}
                    disabled={loadingStates.creating}
                  >
                    {loadingStates.creating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Création...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Créer l'Utilisateur
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistiques Globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                  <p className="text-2xl font-bold text-gray-900">{globalStats.totalUsers}</p>
                  <p className="text-xs text-green-600">{globalStats.actifs} actifs</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Organismes</p>
                  <p className="text-2xl font-bold text-gray-900">{globalStats.totalOrganismes}</p>
                  <p className="text-xs text-blue-600">Administrations</p>
                </div>
                <Building2 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Administrateurs</p>
                  <p className="text-2xl font-bold text-gray-900">{globalStats.admins}</p>
                  <p className="text-xs text-purple-600">{globalStats.superAdmins} super admins</p>
                </div>
                <Shield className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Citoyens</p>
                  <p className="text-2xl font-bold text-gray-900">{globalStats.citoyens}</p>
                  <p className="text-xs text-orange-600">Utilisateurs externes</p>
                </div>
                <Home className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche et filtres */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="🔍 Rechercher un utilisateur ou un organisme..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Tous les rôles" />
                </SelectTrigger>
                <SelectContent>
                                          <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="AGENT">Agent</SelectItem>
                  <SelectItem value="USER">Citoyen</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                                          <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="inactive">Inactifs</SelectItem>
                </SelectContent>
              </Select>
              {viewMode === 'liste' && (
                <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue placeholder="Toutes les organisations" />
                  </SelectTrigger>
                  <SelectContent>
                                            <SelectItem value="all">Toutes les organisations</SelectItem>
                    {administrations.map(org => (
                      <SelectItem key={org.code} value={org.code}>{org.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRole('all');
                  setSelectedOrganization('all');
                  setSelectedStatus('all');
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vue par Organismes */}
        {viewMode === 'organismes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Utilisateurs par Organisme</h2>
              <Badge variant="outline">
                {filteredOrganismes.length} organisme(s) trouvé(s)
              </Badge>
            </div>

            <PaginationControls />

            <Accordion type="multiple" value={Array.from(expandedOrgs)} className="space-y-4">
              {paginatedOrganismes.map(([orgId, data]: [string, any]) => (
                <AccordionItem key={orgId} value={orgId}>
                  <Card className={`border-l-4 ${getOrganismeTypeColor(data.organisme.type)}`}>
                    <AccordionTrigger
                      className="px-6 py-4 hover:no-underline"
                      onClick={() => toggleOrgExpansion(orgId)}
                    >
                      <div className="flex items-center justify-between w-full mr-4">
                        <div className="flex items-center space-x-4">
                          <Building2 className="h-6 w-6 text-blue-600" />
                          <div className="text-left">
                            <h3 className="font-semibold text-lg">{data.organisme.nom}</h3>
                            <p className="text-sm text-muted-foreground">
                              {data.organisme.type} • {data.stats.total} utilisateur(s)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                              <div className="text-lg font-bold text-green-600">{data.stats.actifs}</div>
                              <div className="text-xs text-muted-foreground">Actifs</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-blue-600">{data.stats.admins}</div>
                              <div className="text-xs text-muted-foreground">Admins</div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="relative bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:from-purple-600 hover:to-blue-600 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAISearch(orgId, data.organisme.nom);
                            }}
                            disabled={loadingStates.searchingAI === orgId}
                            title="🤖 Rechercher les intervenants avec l'IA Gemini - Analyse automatique des sources publiques"
                          >
                            {loadingStates.searchingAI === orgId ? (
                              <div className="flex items-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-xs font-medium">IA en cours...</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <div className="relative">
                                  <Sparkles className="h-4 w-4 animate-pulse" />
                                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                                </div>
                                <Bot className="h-4 w-4" />
                                <span className="text-xs font-medium hidden sm:inline">IA</span>
                              </div>
                            )}
                            {/* Badge IA actif */}
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                          </Button>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-6 pb-4">
                      <div className="space-y-4">
                        {/* Statistiques détaillées de l'organisme */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/50 rounded-lg">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{data.stats.admins}</div>
                            <div className="text-sm text-muted-foreground">Administrateurs</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{data.stats.managers}</div>
                            <div className="text-sm text-muted-foreground">Managers</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">{data.stats.agents}</div>
                            <div className="text-sm text-muted-foreground">Agents</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{data.stats.total}</div>
                            <div className="text-sm text-muted-foreground">Total</div>
                          </div>
                        </div>

                        {/* Liste des utilisateurs par rôle */}
                        <div className="space-y-3">
                          {['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'AGENT', 'USER'].map(role => {
                            const roleUsers = data.users.filter((user: User) => user.role === role);
                            if (roleUsers.length === 0) return null;

                            return (
                              <div key={role} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  {getRoleIcon(role)}
                                  <span className="font-medium">{role}</span>
                                  <Badge variant="outline">{roleUsers.length}</Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-6">
                                  {roleUsers.map((user: User) => (
                                    <Card key={user.id} className="hover:shadow-md transition-shadow">
                                      <CardContent className="p-4">
                                        <div className="flex items-center space-x-3">
                                          <Avatar className="h-10 w-10">
                                            <AvatarFallback className={getRoleColor(user.role)}>
                                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">
                                              {user.firstName} {user.lastName}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                              {user.posteTitle || 'Poste non défini'}
                                            </p>
                                            <div className="flex items-center space-x-2 mt-1">
                                              <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                                                {user.role}
                                              </Badge>
                                              {user.isActive ? (
                                                <CheckCircle className="h-3 w-3 text-green-500" />
                                              ) : (
                                                <XCircle className="h-3 w-3 text-red-500" />
                                              )}
                                            </div>
                                          </div>
                                          <div className="flex flex-col space-y-1">
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => handleUserAction('view', user)}
                                              title="Voir le profil"
                                            >
                                              <Eye className="h-3 w-3" />
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => handleUserAction('edit', user)}
                                              title="Modifier l'utilisateur"
                                            >
                                              <Edit className="h-3 w-3" />
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => handleUserAction('toggle', user)}
                                              title={user.isActive ? 'Désactiver' : 'Activer'}
                                            >
                                              {user.isActive ? (
                                                <Lock className="h-3 w-3" />
                                              ) : (
                                                <Unlock className="h-3 w-3" />
                                              )}
                                            </Button>
                                            <AlertDialog>
                                              <AlertDialogTrigger asChild>
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  className="border-red-200 text-red-600 hover:bg-red-50"
                                                  title="Supprimer l'utilisateur"
                                                  disabled={loadingStates.deleting === user.id}
                                                >
                                                  {loadingStates.deleting === user.id ? (
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                  ) : (
                                                    <Trash2 className="h-3 w-3" />
                                                  )}
                                                </Button>
                                              </AlertDialogTrigger>
                                              <AlertDialogContent>
                                                <AlertDialogHeader>
                                                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                    Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
                                                    <strong>{user.firstName} {user.lastName}</strong> ?
                                                    Cette action est irréversible.
                                                  </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                  <AlertDialogAction
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="bg-red-600 hover:bg-red-700"
                                                  >
                                                    Supprimer
                                                  </AlertDialogAction>
                                                </AlertDialogFooter>
                                              </AlertDialogContent>
                                            </AlertDialog>
                                          </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t space-y-1">
                                          <div className="flex items-center text-xs text-muted-foreground">
                                            <Mail className="h-3 w-3 mr-1" />
                                            <span className="truncate">{user.email}</span>
                                          </div>
                                          {user.phone && (
                                            <div className="flex items-center text-xs text-muted-foreground">
                                              <Phone className="h-3 w-3 mr-1" />
                                              <span>{user.phone}</span>
                                            </div>
                                          )}
                                          <div className="flex items-center text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            <span>Créé le {new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              ))}
            </Accordion>

            <PaginationControls />

            {filteredOrganismes.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">Aucun organisme trouvé</h3>
                  <p className="text-muted-foreground mb-4">
                    Aucun organisme ne correspond à vos critères de recherche.
                  </p>
                  <Button variant="outline" onClick={() => setSearchTerm('')}>
                    Réinitialiser la recherche
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Vue Liste Simple */}
        {viewMode === 'liste' && (
          <Card>
            <CardHeader>
              <CardTitle>Liste de tous les utilisateurs</CardTitle>
              <CardDescription>
                Vue classique de tous les utilisateurs du système ({filteredUsers.length} résultat(s))
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaginationControls className="mb-6" />

              {paginatedUsers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedUsers.map((user) => (
                    <Card key={user.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className={getRoleColor(user.role)}>
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {user.organizationName}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                                {user.role}
                              </Badge>
                              {user.isActive ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <XCircle className="h-3 w-3 text-red-500" />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-1 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction('view', user)}
                            className="flex-1"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Voir
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction('edit', user)}
                            className="flex-1"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Modifier
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction('toggle', user)}
                          >
                            {user.isActive ? (
                              <Lock className="h-3 w-3" />
                            ) : (
                              <Unlock className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">Aucun utilisateur trouvé</h3>
                  <p className="text-muted-foreground mb-4">
                    Aucun utilisateur ne correspond à vos critères de recherche.
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm('');
                    setSelectedRole('all');
                    setSelectedOrganization('all');
                    setSelectedStatus('all');
                  }}>
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}

              <PaginationControls className="mt-6" />
            </CardContent>
          </Card>
        )}

        {/* Modal de visualisation utilisateur */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Profil de {selectedUser?.firstName} {selectedUser?.lastName}</DialogTitle>
              <DialogDescription>
                Informations détaillées de l'utilisateur
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className={getRoleColor(selectedUser.role)}>
                      {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedUser.firstName} {selectedUser.lastName}</h3>
                    <p className="text-muted-foreground">{selectedUser.organizationName}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getRoleColor(selectedUser.role)}>
                        {selectedUser.role}
                      </Badge>
                      {selectedUser.isActive ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Actif
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactif
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Email</Label>
                      <p className="text-sm">{selectedUser.email}</p>
                    </div>
                    {selectedUser.phone && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Téléphone</Label>
                        <p className="text-sm">{selectedUser.phone}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Rôle</Label>
                      <p className="text-sm">{selectedUser.role}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Organisation</Label>
                      <p className="text-sm">{selectedUser.organizationName}</p>
                    </div>
                    {selectedUser.posteTitle && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Poste</Label>
                        <p className="text-sm">{selectedUser.posteTitle}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Date de création</Label>
                      <p className="text-sm">{new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                    {selectedUser.lastLoginAt && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Dernière connexion</Label>
                        <p className="text-sm">{new Date(selectedUser.lastLoginAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Fermer
              </Button>
              <Button onClick={() => {
                setIsViewModalOpen(false);
                setIsEditModalOpen(true);
              }}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal d'édition utilisateur */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier {selectedUser?.firstName} {selectedUser?.lastName}</DialogTitle>
              <DialogDescription>
                Modifiez les informations de l'utilisateur
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editFirstName">Prénom</Label>
                    <Input
                      id="editFirstName"
                      defaultValue={selectedUser.firstName}
                      placeholder="Prénom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editLastName">Nom</Label>
                    <Input
                      id="editLastName"
                      defaultValue={selectedUser.lastName}
                      placeholder="Nom de famille"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editEmail">Email</Label>
                    <Input
                      id="editEmail"
                      type="email"
                      defaultValue={selectedUser.email}
                      placeholder="email@domain.ga"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editPhone">Téléphone</Label>
                    <Input
                      id="editPhone"
                      defaultValue={selectedUser.phone || ''}
                      placeholder="+241 XX XX XX XX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editRole">Rôle</Label>
                    <Select defaultValue={selectedUser.role}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                        <SelectItem value="MANAGER">MANAGER</SelectItem>
                        <SelectItem value="AGENT">AGENT</SelectItem>
                        <SelectItem value="USER">USER</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="editOrganization">Organisation</Label>
                    <Select defaultValue={selectedUser.organizationId}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {administrations.map(org => (
                          <SelectItem key={org.code} value={org.code}>{org.nom}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked={selectedUser.isActive} />
                  <Label>Utilisateur actif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked={selectedUser.isVerified} />
                  <Label>Compte vérifié</Label>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={loadingStates.updating}
              >
                Annuler
              </Button>
              <Button
                onClick={() => handleEditUser({})}
                disabled={loadingStates.updating}
              >
                {loadingStates.updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Modification...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal IA pour la recherche d'intervenants */}
        <Dialog open={isAIModalOpen} onOpenChange={setIsAIModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span>Intervenants trouvés pour {selectedOrgForAI?.name}</span>
              </DialogTitle>
              <DialogDescription>
                L'IA Gemini a analysé les sources publiques et trouvé ces intervenants.
                Sélectionnez ceux pour lesquels créer des comptes utilisateurs.
              </DialogDescription>
            </DialogHeader>

            {aiResults.length > 0 && (
              <div className="space-y-4">
                {/* Informations sur la recherche */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Bot className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium">Recherche terminée</p>
                      <p className="text-xs text-muted-foreground">
                        {aiResults.length} intervenant(s) identifié(s) • Sources vérifiées
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-purple-600 border-purple-300">
                    <Globe className="h-3 w-3 mr-1" />
                    IA Gemini
                  </Badge>
                </div>

                {/* Alerte pour les nouveaux postes */}
                {newPostesFound.length > 0 && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <div>
                          <strong>Nouveaux postes détectés :</strong> {newPostesFound.join(', ')}
                          <br />
                          <span className="text-sm">Ces postes ne sont pas encore dans le système. Voulez-vous les ajouter ?</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (newPostesFound.length > 0) {
                              setSelectedNewPoste(newPostesFound[0]);
                              setIsNewPosteModalOpen(true);
                            }
                          }}
                          className="ml-4"
                        >
                          Gérer les postes
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-4">
                  {aiResults.map((result, index) => (
                    <Card key={index} className="p-4 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {result.nom.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{result.nom}</h4>
                            <p className="text-blue-600 font-medium">{result.poste}</p>
                            {result.department && (
                              <p className="text-sm text-muted-foreground">{result.department}</p>
                            )}
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {result.email}
                              </span>
                              <span className="flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {result.telephone}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <Badge variant="outline" className="text-green-600 border-green-600 mb-2">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Poste reconnu
                            </Badge>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                <Globe className="h-2 w-2 mr-1" />
                                {result.source}
                              </Badge>
                              {result.confidence && (
                                <Badge variant="outline" className="text-xs">
                                  {Math.round(result.confidence * 100)}% confiance
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    <strong>{aiResults.length}</strong> intervenant(s) sélectionné(s) pour la création de comptes
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setIsAIModalOpen(false)}>
                      Annuler
                    </Button>
                    <Button
                      onClick={() => handleGenerateAccounts(aiResults)}
                      disabled={loadingStates.generatingAccounts === selectedOrgForAI?.id}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      {loadingStates.generatingAccounts === selectedOrgForAI?.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Création des comptes...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Créer les comptes ({aiResults.length})
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal pour ajouter un nouveau poste */}
        <Dialog open={isNewPosteModalOpen} onOpenChange={setIsNewPosteModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-500" />
                Ajouter un nouveau poste au système
              </DialogTitle>
              <DialogDescription>
                Ce poste a été trouvé par l'IA mais n'existe pas encore dans notre système.
                Vous pouvez l'ajouter pour une meilleure gestion future.
              </DialogDescription>
            </DialogHeader>

            {selectedNewPoste && (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800">Poste à ajouter</h4>
                  <p className="text-blue-700 text-lg font-medium">{selectedNewPoste}</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Trouvé dans l'organisme : {selectedOrgForAI?.name}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Code suggéré</Label>
                    <Input
                      value={selectedNewPoste.split(' ')
                        .map(word => word.charAt(0).toUpperCase())
                        .join('')
                        .substring(0, 6)}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Niveau</Label>
                    <Input value="Personnalisé" disabled className="bg-gray-50" />
                  </div>

                  <div className="space-y-2">
                    <Label>Grade requis</Label>
                    <Input
                      value={selectedNewPoste.toLowerCase().includes('directeur') ? 'A1, A2' : 'B1, B2'}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Salaire de base</Label>
                    <Input value="500 000 FCFA" disabled className="bg-gray-50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={`Poste créé automatiquement par l'IA pour ${selectedOrgForAI?.name}. Ce poste a été identifié lors de la recherche des intervenants de l'organisme et ajouté au système pour une meilleure gestion des utilisateurs.`}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {newPostesFound.length > 1 && (
                      <span>
                        {newPostesFound.length - 1} autre(s) poste(s) en attente
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Passer au poste suivant ou fermer
                        const currentIndex = newPostesFound.indexOf(selectedNewPoste);
                        if (currentIndex < newPostesFound.length - 1) {
                          setSelectedNewPoste(newPostesFound[currentIndex + 1]);
                        } else {
                          setIsNewPosteModalOpen(false);
                        }
                      }}
                    >
                      Ignorer
                    </Button>
                    <Button
                      onClick={() => handleAddNewPoste(selectedNewPoste, selectedOrgForAI?.name || '')}
                      disabled={loadingStates.addingPoste}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loadingStates.addingPoste ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Ajout en cours...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Ajouter au système
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
