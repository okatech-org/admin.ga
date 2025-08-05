/* @ts-nocheck */
'use client';

import { useState, useEffect } from 'react';
import { SuperAdminLayout } from '@/components/layouts/super-admin-layout';
import { DashboardWidget } from '@/components/super-admin/dashboard-widget';
import { SmartSearch } from '@/components/super-admin/smart-search';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit,
  Eye,
  Mail,
  Building2,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Download,
  BarChart3,
  Settings,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  Crown,
  HelpCircle,
  Lightbulb,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'AGENT' | 'CITIZEN';
  isActive: boolean;
  isVerified: boolean;
  organization?: {
    name: string;
    code: string;
  };
  lastLoginAt?: string;
  createdAt: string;
  profileCompletion: number;
}

export default function ModernUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Simulation des données
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Données mockées supprimées - utiliser TRPC à la place
const mockUsers: User[] = [
        {
          id: '1',
          email: 'admin@gabon.ga',
          firstName: 'Marie',
          lastName: 'Mbou',
          role: 'ADMIN',
          isActive: true,
          isVerified: true,
          organization: { name: 'Ministère de l\'Économie', code: 'MIN_ECO' },
          lastLoginAt: '2024-12-07T10:30:00Z',
          createdAt: '2024-01-15T08:00:00Z',
          profileCompletion: 95
        },
        {
          id: '2',
          email: 'jean.ondoua@education.ga',
          firstName: 'Jean',
          lastName: 'Ondoua',
          role: 'AGENT',
          isActive: true,
          isVerified: true,
          organization: { name: 'Ministère de l\'Éducation', code: 'MIN_EDU' },
          lastLoginAt: '2024-12-06T16:45:00Z',
          createdAt: '2024-02-20T09:15:00Z',
          profileCompletion: 87
        },
        {
          id: '3',
          email: 'sophie.nguema@sante.ga',
          firstName: 'Sophie',
          lastName: 'Nguema',
          role: 'AGENT',
          isActive: false,
          isVerified: true,
          organization: { name: 'Ministère de la Santé', code: 'MIN_SANTE' },
          lastLoginAt: '2024-11-28T14:20:00Z',
          createdAt: '2024-03-10T11:30:00Z',
          profileCompletion: 76
        },
        {
          id: '4',
          email: 'citoyen@example.com',
          firstName: 'Paul',
          lastName: 'Obame',
          role: 'CITIZEN',
          isActive: true,
          isVerified: false,
          lastLoginAt: '2024-12-07T09:15:00Z',
          createdAt: '2024-12-01T14:45:00Z',
          profileCompletion: 45
        }
      ];

      // TODO: Remplacer par TRPC pour les vraies données
    setUsers(mockUsers);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery ||
      `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' ||
      (selectedStatus === 'active' && user.isActive) ||
      (selectedStatus === 'inactive' && !user.isActive) ||
      (selectedStatus === 'verified' && user.isVerified) ||
      (selectedStatus === 'unverified' && !user.isVerified);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const userStats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    verified: users.filter(u => u.isVerified).length,
    admins: users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length,
    agents: users.filter(u => u.role === 'AGENT').length,
    citizens: users.filter(u => u.role === 'CITIZEN').length,
    pendingVerification: users.filter(u => !u.isVerified).length
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      SUPER_ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
      ADMIN: 'bg-blue-100 text-blue-800 border-blue-200',
      AGENT: 'bg-green-100 text-green-800 border-green-200',
      CITIZEN: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const labels = {
      SUPER_ADMIN: 'Super Admin',
      ADMIN: 'Administrateur',
      AGENT: 'Agent',
      CITIZEN: 'Citoyen'
    };

    return (
      <Badge className={cn('text-xs', styles[role as keyof typeof styles])}>
        {labels[role as keyof typeof labels]}
      </Badge>
    );
  };

  const getStatusIcon = (user: User) => {
    if (!user.isVerified) return <XCircle className="w-4 h-4 text-red-500" />;
    if (!user.isActive) return <Clock className="w-4 h-4 text-yellow-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  return (
    <SuperAdminLayout
      title="Gestion des Utilisateurs"
      description="Interface simplifiée pour administrer tous les comptes utilisateurs"
    >
      <div className="space-y-6">
        {/* Guide pour novices */}
        <Alert className="border-blue-200 bg-blue-50">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Guide rapide :</strong> Cette page centralise tous vos utilisateurs.
            Utilisez les filtres pour segmenter par rôle ou statut. Les badges colorés indiquent rapidement l'état de chaque compte.
          </AlertDescription>
        </Alert>

        {/* Métriques utilisateurs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardWidget
            title="Total Utilisateurs"
            value={userStats.total}
            icon={Users}
            color="bg-blue-500"
            description="Comptes enregistrés sur la plateforme"
            trend={12.5}
          />
          <DashboardWidget
            title="Comptes Actifs"
            value={userStats.active}
            icon={Activity}
            color="bg-green-500"
            description="Utilisateurs avec accès autorisé"
            trend={8.3}
          />
          <DashboardWidget
            title="En Attente Validation"
            value={userStats.pendingVerification}
            icon={Clock}
            color="bg-orange-500"
            description="Comptes nécessitant une vérification"
            actionLabel="Traiter"
            actionHref="/super-admin/fonctionnaires-attente"
          />
          <DashboardWidget
            title="Administrateurs"
            value={userStats.admins + userStats.agents}
            icon={Shield}
            color="bg-purple-500"
            description="Personnel administratif actif"
            trend={2.1}
          />
        </div>

        {/* Interface principale */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d'Ensemble</TabsTrigger>
            <TabsTrigger value="management">Gestion Avancée</TabsTrigger>
            <TabsTrigger value="analytics">Analyses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Outils de recherche et filtrage simplifiés */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Recherche et Filtres
                </CardTitle>
                <CardDescription>
                  Trouvez rapidement les utilisateurs que vous cherchez
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Rechercher par nom, email ou organisation..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filtrer par rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les rôles</SelectItem>
                      <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                      <SelectItem value="ADMIN">Administrateur</SelectItem>
                      <SelectItem value="AGENT">Agent</SelectItem>
                      <SelectItem value="CITIZEN">Citoyen</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="active">Actifs</SelectItem>
                      <SelectItem value="inactive">Inactifs</SelectItem>
                      <SelectItem value="verified">Vérifiés</SelectItem>
                      <SelectItem value="unverified">Non vérifiés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Liste des utilisateurs optimisée */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Utilisateurs ({filteredUsers.length})
                    </CardTitle>
                    <CardDescription>
                      Liste des comptes utilisateurs avec actions rapides
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exporter
                    </Button>
                    <Button size="sm">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Nouvel utilisateur
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {user.firstName[0]}{user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </h4>
                            {getRoleBadge(user.role)}
                            {getStatusIcon(user)}
                          </div>
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center gap-1 mb-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                            {user.organization && (
                              <div className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {user.organization.name}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right text-sm text-gray-500">
                          <div>Profil: {user.profileCompletion}%</div>
                          {user.lastLoginAt && (
                            <div>
                              Dernier accès: {new Date(user.lastLoginAt).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Actions groupées */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Actions Groupées
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Valider les comptes en attente ({userStats.pendingVerification})
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Envoyer notifications de rappel
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter rapport utilisateurs
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Audit des permissions
                  </Button>
                </CardContent>
              </Card>

              {/* Statistiques par organisation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Répartition par Organisation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                            { name: 'Ministère de l\'Économie', count: 0, percentage: 0 },
      { name: 'Ministère de l\'Éducation', count: 0, percentage: 0 },
      { name: 'Ministère de la Santé', count: 0, percentage: 0 },
      { name: 'Autres ministères', count: 0, percentage: 0 }
                    ].map((org, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{org.name}</span>
                          <span className="font-medium">{org.count} utilisateurs</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${org.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Tendances d'Inscription
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Graphiques d'analytics détaillés</p>
                    <Button variant="outline" className="mt-4">
                      Voir le rapport complet
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Activité Récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: 'Nouvelle inscription', user: 'Paul Obame', time: 'Il y a 2h' },
                      { action: 'Compte validé', user: 'Marie Mbou', time: 'Il y a 4h' },
                      { action: 'Mise à jour profil', user: 'Jean Ondoua', time: 'Il y a 6h' },
                      { action: 'Connexion admin', user: 'Sophie Nguema', time: 'Il y a 1j' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="flex-1">{activity.action}</span>
                        <span className="text-gray-500">{activity.user}</span>
                        <span className="text-gray-400">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
}
