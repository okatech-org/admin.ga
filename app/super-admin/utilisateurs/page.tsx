/* @ts-nocheck */
'use client';

import { useState } from 'react';
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
  Home
} from 'lucide-react';

import { getAllAdministrations } from '@/lib/data/gabon-administrations';
import { getAllPostes, GRADES_FONCTION_PUBLIQUE } from '@/lib/data/postes-administratifs';
import { systemUsers, getUsersByOrganisme, getUsersByRole, searchUsers } from '@/lib/data/unified-system-data';
import { toast } from 'sonner';

export default function SuperAdminUtilisateursPage() {
  const [users, setUsers] = useState(systemUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState('organismes'); // 'organismes' | 'liste' | 'hierarchy'
  const [expandedOrgs, setExpandedOrgs] = useState(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const administrations = getAllAdministrations();
  const postes = getAllPostes();

  // Grouper les utilisateurs par organisme
  const usersByOrganisme = users.reduce((acc, user) => {
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
          actifs: 0,
          inactifs: 0
        }
      };
    }

    acc[orgId].users.push(user);
    acc[orgId].stats.total++;
    acc[orgId].stats[user.role.toLowerCase() + 's'] = (acc[orgId].stats[user.role.toLowerCase() + 's'] || 0) + 1;
    if (user.isActive) acc[orgId].stats.actifs++;
    else acc[orgId].stats.inactifs++;

    return acc;
  }, {});

  // Statistiques globales
  const globalStats = {
    totalUsers: users.length,
    totalOrganismes: Object.keys(usersByOrganisme).length,
    actifs: users.filter(u => u.isActive).length,
    inactifs: users.filter(u => !u.isActive).length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    managers: users.filter(u => u.role === 'MANAGER').length,
    agents: users.filter(u => u.role === 'AGENT').length,
    citoyens: users.filter(u => u.role === 'USER').length,
    superAdmins: users.filter(u => u.role === 'SUPER_ADMIN').length
  };

  // Organismes principaux qui gèrent les services (28 organismes)
  const organismesPrincipaux = [
    'MIN_REF_INST', 'MIN_AFF_ETR', 'MIN_INT_SEC', 'MIN_JUSTICE', 'MIN_DEF_NAT',
    'MIN_ECO_FIN', 'MIN_MINES_PETR', 'MIN_SANTE', 'MIN_EDUC_NAT', 'MIN_ENS_SUP',
    'MIN_TRAV_EMPL', 'MIN_AGR_ELEV', 'MIN_EAUX_FOR', 'MIN_TOUR_ARTIS', 'MIN_TRANSP',
    'MIN_NUM_POST', 'MIN_ENV_CLIM', 'MIN_HABIT_URB', 'MIN_SPORT_CULT', 'MIN_JEUN_CIVIQ',
    'DGDI', 'DGI', 'DOUANES', 'CNSS', 'CNAMGS', 'MAIRIE_LBV', 'MAIRIE_PG', 'PREF_EST'
  ];

  // Fonction de tri personnalisée selon l'ordre demandé
  const getOrganismePriority = (orgId: string) => {
    if (orgId === 'admin-ga') return 1;           // ADMIN.GA en premier
    if (orgId === 'demarche-ga') return 2;        // DEMARCHE.GA en second
    if (organismesPrincipaux.includes(orgId)) return 3; // 28 organismes principaux
    return 4;                                     // Autres organismes
  };

  // Filtrer les organismes selon la recherche et le rôle
  const filteredOrganismes = Object.entries(usersByOrganisme).filter(([orgId, data]: [string, any]) => {
    const orgMatch = data.organisme.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const userMatch = data.users.some((user: any) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Si un rôle est sélectionné, vérifier que l'organisme a au moins un utilisateur de ce rôle
    const roleMatch = !selectedRole || data.users.some((user: any) => user.role === selectedRole);

    return (orgMatch || userMatch) && roleMatch;
  }).sort((a: [string, any], b: [string, any]) => {
    // Tri selon la priorité définie, puis par nombre d'utilisateurs
    const priorityA = getOrganismePriority(a[0]);
    const priorityB = getOrganismePriority(b[0]);

    if (priorityA !== priorityB) {
      return priorityA - priorityB; // Tri par priorité croissante
    }

    // À priorité égale, tri par nombre d'utilisateurs décroissant
    return b[1].stats.total - a[1].stats.total;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'ADMIN': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'MANAGER': return 'bg-green-100 text-green-800 border-green-300';
      case 'AGENT': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'USER': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'SUPER_ADMIN': return <Crown className="h-4 w-4" />;
      case 'ADMIN': return <Shield className="h-4 w-4" />;
      case 'MANAGER': return <Briefcase className="h-4 w-4" />;
      case 'AGENT': return <UserCheck className="h-4 w-4" />;
      case 'USER': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getOrganismeTypeColor = (type) => {
    switch (type) {
      case 'MINISTERE': return 'border-l-blue-500 bg-blue-50';
      case 'DIRECTION_GENERALE': return 'border-l-green-500 bg-green-50';
      case 'MAIRIE': return 'border-l-orange-500 bg-orange-50';
      case 'PREFECTURE': return 'border-l-purple-500 bg-purple-50';
      case 'PROVINCE': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const toggleOrgExpansion = (orgId) => {
    const newExpanded = new Set(expandedOrgs);
    if (newExpanded.has(orgId)) {
      newExpanded.delete(orgId);
    } else {
      newExpanded.add(orgId);
    }
    setExpandedOrgs(newExpanded);
  };

  const handleCreateUser = () => {
    toast.success('Utilisateur créé avec succès !');
    setIsCreateModalOpen(false);
  };

  const handleUserAction = (action, user) => {
    toast.info(`Action ${action} sur ${user.firstName} ${user.lastName}`);
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
            <Button variant="outline" onClick={() => setViewMode(viewMode === 'organismes' ? 'liste' : 'organismes')}>
              {viewMode === 'organismes' ? <List className="mr-2 h-4 w-4" /> : <Grid className="mr-2 h-4 w-4" />}
              {viewMode === 'organismes' ? 'Vue Liste' : 'Vue Organismes'}
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Nouvel Utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Créer un Nouvel Utilisateur</DialogTitle>
                  <DialogDescription>
                    Ajoutez un nouveau compte utilisateur à la plateforme
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" placeholder="Prénom" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" placeholder="Nom de famille" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="email@domain.ga" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" placeholder="+241 XX XX XX XX" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="role">Rôle</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
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
                      <Label htmlFor="organization">Organisation</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une organisation" />
                        </SelectTrigger>
                        <SelectContent>
                          {administrations.slice(0, 10).map(org => (
                            <SelectItem key={org.code} value={org.code}>{org.nom}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="poste">Poste</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un poste" />
                        </SelectTrigger>
                        <SelectContent>
                          {postes.slice(0, 10).map(poste => (
                            <SelectItem key={poste.id} value={poste.id}>
                              {poste.titre} ({poste.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="verified" defaultChecked />
                      <Label htmlFor="verified">Compte vérifié</Label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateUser}>
                    Créer l'Utilisateur
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
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="AGENT">Agent</SelectItem>
                  <SelectItem value="USER">Citoyen</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRole('');
                  setSelectedOrganization('');
                  setSelectedStatus('');
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

            <Accordion type="multiple" value={Array.from(expandedOrgs) as string[]} className="space-y-4">
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
                          {['ADMIN', 'MANAGER', 'AGENT', 'USER'].map(role => {
                            const roleUsers = data.users.filter(user => user.role === role);
                            if (roleUsers.length === 0) return null;

                            return (
                              <div key={role} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  {getRoleIcon(role)}
                                  <span className="font-medium">{role}</span>
                                  <Badge variant="outline">{roleUsers.length}</Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-6">
                                  {roleUsers.map((user) => (
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
                                            >
                                              <Eye className="h-3 w-3" />
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => handleUserAction('edit', user)}
                                            >
                                              <Edit className="h-3 w-3" />
                                            </Button>
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

        {/* Vue Liste Simple (fallback) */}
        {viewMode === 'liste' && (
          <Card>
            <CardHeader>
              <CardTitle>Liste de tous les utilisateurs</CardTitle>
              <CardDescription>
                Vue classique de tous les utilisateurs du système
              </CardDescription>
            </CardHeader>
            <CardContent>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {users.filter(user => {
                   const searchMatch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     user.email.toLowerCase().includes(searchTerm.toLowerCase());
                   const roleMatch = !selectedRole || user.role === selectedRole;
                   return searchMatch && roleMatch;
                 }).map((user) => (
                  <Card key={user.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
