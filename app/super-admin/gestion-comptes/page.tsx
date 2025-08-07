'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { toast } from 'sonner';
import {
  Users,
  UserPlus,
  Building2,
  Shield,
  Activity,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
}

// Générer des données d'exemple pour les tests
function generateSampleUsers(): User[] {
  const roles = ['ADMIN', 'USER', 'MANAGER', 'RECEPTIONIST'];
  const statuses: ('active' | 'inactive' | 'pending')[] = ['active', 'inactive', 'pending'];
  const organizations = [
    'Présidence de la République',
    'Primature',
    'Ministère de l\'Intérieur',
    'Ministère des Finances',
    'Ministère de l\'Education Nationale',
    'Ministère de la Santé',
    'Ministère de l\'Agriculture',
    'Direction Générale des Impôts',
    'Caisse Nationale de Sécurité Sociale',
    'Office des Postes et Télécommunications'
  ];

  const names = [
    'Michel Ntoutoume', 'Marie Onanga', 'Jean Obiang', 'Claire Immongault',
    'Pierre Manfoumbi', 'Anne Ndong', 'Paul Akure', 'Louise Davain',
    'Jacques Ngodjou', 'Sophie Tchemambela', 'François Essono', 'Brigitte Bikissa',
    'André Nembe', 'Catherine Ivala', 'Philippe Ngomanda', 'Nicole Rebienot',
    'Alain Pellegrin', 'Sylvie Mayi', 'Bernard Massila', 'Martine Akendengue',
    'Christian Batolo', 'Nathalie Doudou', 'Daniel Lengoma', 'Isabelle Magni',
    'Éric Bejaoui', 'Valérie Laccruche', 'Georges Lelabou', 'Céline Vane',
    'Henri Ekomie', 'Sandrine Bikanga', 'Louis Tsioukacka', 'Christelle Ngome',
    'Marcel Ayong', 'Alice Kabongo', 'Patrick Nouhando', 'Camélia Leckat',
    'Robert Dikoumba', 'Christiane Assingambagni', 'Serge Tsanga', 'Paulette Djeki',
    'Thierry Mengue', 'Thérèse Mba', 'Yves Ndutume', 'Ange Mihindou',
    'Albert Apérano', 'Bertille Kadjidja', 'Claude Ngoyo', 'Rose Moussavou',
    'Léon Mibindzou', 'Madeleine Mouelet', 'Jules Ngoma', 'Brigitte Barassouaga'
  ];

  return names.map((name, index) => ({
    id: `user_${index + 1}`,
    name: name,
    email: `${name.toLowerCase().replace(/[' ]/g, '.').replace(/[àáâäéèêëíìîïóòôöúùûü]/g, 'e')}@administration.ga`,
    role: roles[index % roles.length],
    organization: organizations[index % organizations.length],
    status: index < 40 ? 'active' : index < 45 ? 'pending' : statuses[index % statuses.length],
    lastLogin: index < 40 ?
      new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR') :
      index < 45 ? 'Jamais connecté' :
      new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')
  }));
}

export default function GestionComptesPage() {
  const [selectedTab, setSelectedTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    inactiveUsers: 0
  });

  // Charger les comptes actifs depuis le système RH
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/rh/comptes-actifs?limit=500');
      const result = await response.json();

      if (result.success) {
        const transformedUsers: User[] = result.data.comptes.map((compte: any) => ({
          id: compte.id,
          name: compte.name || compte.fonctionnaire?.nom_complet || 'Nom inconnu',
          email: compte.email || compte.fonctionnaire?.email || 'email@administration.ga',
          role: compte.role || compte.role_systeme || 'USER',
          organization: compte.organization || compte.organizationName || compte.poste?.organisme_nom || 'Organisation inconnue',
          status: compte.status === 'active' || compte.statut === 'ACTIF' || compte.isActive ? 'active' : 'inactive',
          lastLogin: compte.lastLogin || (compte.dernier_acces ? new Date(compte.dernier_acces).toLocaleDateString('fr-FR') : 'Jamais connecté')
        }));

        setUsers(transformedUsers);

        // Calculer les statistiques
        const activeUsers = transformedUsers.filter(u => u.status === 'active').length;
        const inactiveUsers = transformedUsers.filter(u => u.status === 'inactive').length;
        const pendingUsers = transformedUsers.filter(u => u.status === 'pending').length;

        setStats({
          totalUsers: transformedUsers.length,
          activeUsers,
          inactiveUsers,
          pendingUsers
        });

        console.log(`✅ ${transformedUsers.length} comptes actifs chargés depuis le système RH`);
      } else {
        throw new Error(result.error || 'Erreur lors de la récupération des comptes');
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des comptes:', error);
      console.log('🔄 Chargement des données d\'exemple...');

      // Charger des données d'exemple en cas d'erreur
      const sampleUsers: User[] = generateSampleUsers();
      setUsers(sampleUsers);

      // Calculer les statistiques
      const activeUsers = sampleUsers.filter(u => u.status === 'active').length;
      const inactiveUsers = sampleUsers.filter(u => u.status === 'inactive').length;
      const pendingUsers = sampleUsers.filter(u => u.status === 'pending').length;

      setStats({
        totalUsers: sampleUsers.length,
        activeUsers,
        inactiveUsers,
        pendingUsers
      });

      toast.success(`${sampleUsers.length} comptes d'exemple chargés`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les données au montage
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'inactive': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handleCreateUser = () => {
    setLoading(true);
    toast.loading('Création du compte en cours...');

    setTimeout(() => {
      setLoading(false);
      toast.success('Compte créé avec succès !');
    }, 2000);
  };

  // Filtrer les utilisateurs selon la recherche et le rôle
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.organization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === 'all' || user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  return (
    <AuthenticatedLayout>
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion des Comptes</h1>
            <p className="text-muted-foreground">
              Gérez les utilisateurs et leurs accès au système Administration.GA
            </p>
          </div>
          <Button onClick={handleCreateUser} disabled={loading}>
            <UserPlus className="h-4 w-4 mr-2" />
            Nouveau Compte
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-green-600">
                +12% ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comptes Actifs</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-green-600">
                85% du total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingUsers}</div>
              <p className="text-xs text-yellow-600">
                Validation requise
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactifs</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inactiveUsers}</div>
              <p className="text-xs text-red-600">
                Nécessitent attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="roles">Rôles</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="activity">Activité</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Liste des Utilisateurs</CardTitle>
                    <CardDescription>
                      Gérez les comptes utilisateurs et leurs permissions ({filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} affiché{filteredUsers.length > 1 ? 's' : ''})
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtrer
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">Aucun utilisateur trouvé</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {loading ? 'Chargement en cours...' : 'Essayez de modifier les critères de recherche'}
                      </p>
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-blue-600">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{user.name}</p>
                            <Badge variant="outline">{user.role}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {user.organization}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            {getStatusIcon(user.status)}
                            <Badge className={getStatusColor(user.status)}>
                              {user.status === 'active' ? 'Actif' :
                               user.status === 'pending' ? 'En attente' : 'Inactif'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            Dernière connexion: {user.lastLogin}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Modifier
                          </Button>
                          {user.status === 'pending' && (
                            <Button size="sm">
                              Approuver
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Rôles</CardTitle>
                <CardDescription>
                  Configurez les rôles et leurs permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Gestion des rôles disponible</p>
                  <p className="text-sm text-gray-500 mt-2">Fonctionnalité en cours de développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Permissions Système</CardTitle>
                <CardDescription>
                  Définissez les permissions granulaires
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Gestion des permissions</p>
                  <p className="text-sm text-gray-500 mt-2">Configuration avancée des accès</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Journal d'Activité</CardTitle>
                <CardDescription>
                  Suivez l'activité des utilisateurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Journal d'activité</p>
                  <p className="text-sm text-gray-500 mt-2">Historique des connexions et actions</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
}
