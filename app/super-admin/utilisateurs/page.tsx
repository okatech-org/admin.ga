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
  RefreshCw
} from 'lucide-react';

import { getAllAdministrations } from '@/lib/data/gabon-administrations';
import { getAllPostes, GRADES_FONCTION_PUBLIQUE } from '@/lib/data/postes-administratifs';
import { systemUsers, getUsersByOrganisme, getUsersByRole, searchUsers } from '@/lib/data/unified-system-data';
import { toast } from 'sonner';

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

  // États de chargement et erreurs
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    creating: false,
    updating: false,
    deleting: null,
    exporting: false,
    refreshing: false
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

            <Accordion type="multiple" value={Array.from(expandedOrgs)} className="space-y-4">
              {filteredOrganismes.map(([orgId, data]: [string, any]) => (
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
              {filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUsers.map((user) => (
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
      </div>
    </AuthenticatedLayout>
  );
}
