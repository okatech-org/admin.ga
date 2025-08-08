'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Search,
  Users,
  Building2,
  Download,
  RefreshCw,
  Filter,
  Mail,
  Phone,
  MapPin,
  BarChart3,
  FileJson,
  FileSpreadsheet
} from 'lucide-react';
import {
  getUnifiedSystemDataWithCache,
  invalidateCache,
  searchOrganismes,
  searchUsers,
  getOrganismesByType,
  getUsersByRole,
  exportToJSON,
  exportUsersToCSV,
  exportOrganismesToCSV,
  type UnifiedSystemData,
  type SystemUser,
  type UnifiedOrganisme
} from '@/lib/data/unified-system-data';

export default function UnifiedDataViewer() {
  const [data, setData] = useState<UnifiedSystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('organismes');
  const [filteredOrganismes, setFilteredOrganismes] = useState<UnifiedOrganisme[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<SystemUser[]>([]);

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, []);

  // Appliquer les filtres quand les données ou les critères changent
  useEffect(() => {
    if (!data) return;

    // Filtrer les organismes
    let organismes = data.unifiedOrganismes;
    if (searchTerm) {
      organismes = searchOrganismes(data, searchTerm);
    }
    if (selectedType !== 'all') {
      organismes = organismes.filter(org => org.type === selectedType);
    }
    setFilteredOrganismes(organismes);

    // Filtrer les utilisateurs
    let users = data.systemUsers;
    if (searchTerm) {
      users = searchUsers(data, searchTerm);
    }
    if (selectedRole !== 'all') {
      users = users.filter(user => user.role === selectedRole);
    }
    setFilteredUsers(users);
  }, [data, searchTerm, selectedType, selectedRole]);

  const loadData = async () => {
    try {
      setLoading(true);
      const unifiedData = await getUnifiedSystemDataWithCache();
      setData(unifiedData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    invalidateCache();
    await loadData();
  };

  const handleExport = (format: 'json' | 'csv-users' | 'csv-organismes') => {
    if (!data) return;

    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'json':
        content = exportToJSON(data);
        filename = 'unified-data.json';
        mimeType = 'application/json';
        break;
      case 'csv-users':
        content = exportUsersToCSV(filteredUsers);
        filename = 'users.csv';
        mimeType = 'text/csv';
        break;
      case 'csv-organismes':
        content = exportOrganismesToCSV(filteredOrganismes);
        filename = 'organismes.csv';
        mimeType = 'text/csv';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement des données unifiées...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <Alert className="m-6">
        <AlertDescription>
          Erreur lors du chargement des données. Veuillez rafraîchir la page.
        </AlertDescription>
      </Alert>
    );
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'INSTITUTION_SUPREME': 'bg-purple-500',
      'MINISTERE': 'bg-blue-500',
      'DIRECTION_GENERALE': 'bg-green-500',
      'ETABLISSEMENT_PUBLIC': 'bg-yellow-500',
      'ENTREPRISE_PUBLIQUE': 'bg-orange-500',
      'ETABLISSEMENT_SANTE': 'bg-red-500',
      'UNIVERSITE': 'bg-indigo-500',
      'GOUVERNORAT': 'bg-teal-500',
      'PREFECTURE': 'bg-cyan-500',
      'MAIRIE': 'bg-pink-500',
      'AUTORITE_REGULATION': 'bg-emerald-500',
      'FORCE_SECURITE': 'bg-gray-500'
    };
    return colors[type] || 'bg-gray-400';
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'destructive';
      case 'USER': return 'default';
      case 'RECEPTIONIST': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Données Unifiées du Système</h1>
          <p className="text-muted-foreground">
            {data.statistics.totalOrganismes} organismes • {data.statistics.totalUsers} utilisateurs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Rafraîchir
          </Button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Organismes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.statistics.totalOrganismes}</div>
            <p className="text-xs text-muted-foreground">organismes officiels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.statistics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {data.statistics.activeUsers} actifs • {data.statistics.inactiveUsers} inactifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.statistics.averageUsersPerOrganisme}</div>
            <p className="text-xs text-muted-foreground">utilisateurs/organisme</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Couverture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">admin & réception</p>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {activeTab === 'organismes' && (
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Type d'organisme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {Object.keys(data.statistics.organismesByType).map(type => (
                <SelectItem key={type} value={type}>
                  {type.replace(/_/g, ' ')} ({data.statistics.organismesByType[type]})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {activeTab === 'utilisateurs' && (
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les rôles</SelectItem>
              {Object.keys(data.statistics.usersByRole).map(role => (
                <SelectItem key={role} value={role}>
                  {role} ({data.statistics.usersByRole[role]})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Tabs principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="organismes">
              <Building2 className="h-4 w-4 mr-2" />
              Organismes
            </TabsTrigger>
            <TabsTrigger value="utilisateurs">
              <Users className="h-4 w-4 mr-2" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="statistiques">
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistiques
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
              <FileJson className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport(activeTab === 'organismes' ? 'csv-organismes' : 'csv-users')}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Tab Organismes */}
        <TabsContent value="organismes">
          <Card>
            <CardHeader>
              <CardTitle>Liste des Organismes</CardTitle>
              <CardDescription>
                {filteredOrganismes.length} organismes trouvés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {filteredOrganismes.map((org) => (
                    <div key={org.code} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{org.nom}</h3>
                          <p className="text-sm text-muted-foreground">Code: {org.code}</p>
                          {org.description && (
                            <p className="text-sm mt-1">{org.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(org.type)}>
                            {org.type.replace(/_/g, ' ')}
                          </Badge>
                          {org.status === 'ACTIF' ? (
                            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>
                          ) : (
                            <Badge variant="secondary">Inactif</Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {org.contact.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{org.contact.email}</span>
                          </div>
                        )}
                        {org.contact.telephone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{org.contact.telephone}</span>
                          </div>
                        )}
                        {org.contact.adresse && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-xs">{org.contact.adresse}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span>
                          <strong>{org.stats.totalUsers}</strong> utilisateurs
                        </span>
                        <span>
                          <strong>{org.stats.activeUsers}</strong> actifs
                        </span>
                        {org.stats.adminCount !== undefined && (
                          <span>
                            <strong>{org.stats.adminCount}</strong> admin(s)
                          </span>
                        )}
                        {org.stats.receptionistCount !== undefined && (
                          <span>
                            <strong>{org.stats.receptionistCount}</strong> réceptionniste(s)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Utilisateurs */}
        <TabsContent value="utilisateurs">
          <Card>
            <CardHeader>
              <CardTitle>Liste des Utilisateurs</CardTitle>
              <CardDescription>
                {filteredUsers.length} utilisateurs trouvés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">
                          {user.honorificTitle && <span className="text-muted-foreground mr-2">{user.honorificTitle}</span>}
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">{user.position}</div>
                        <div className="flex items-center gap-3 mt-1 text-xs">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </span>
                          {user.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {user.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                        <Badge variant="outline">
                          {user.organismeCode}
                        </Badge>
                        <Badge
                          variant={user.status === 'active' ? 'default' : 'secondary'}
                          className={user.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                        >
                          {user.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Statistiques */}
        <TabsContent value="statistiques">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type d'Organisme</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(data.statistics.organismesByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getTypeColor(type)}`} />
                        <span className="text-sm">{type.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{count}</span>
                        <span className="text-xs text-muted-foreground">
                          ({Math.round((count / data.statistics.totalOrganismes) * 100)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Rôle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(data.statistics.usersByRole).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={getRoleBadgeVariant(role)}>
                          {role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{count}</span>
                        <span className="text-xs text-muted-foreground">
                          ({Math.round((count / data.statistics.totalUsers) * 100)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métadonnées du Système</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Version</dt>
                    <dd className="font-medium">{data.metadata.version}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Source</dt>
                    <dd className="font-medium">{data.metadata.source}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Généré le</dt>
                    <dd className="font-medium">
                      {new Date(data.metadata.generatedAt).toLocaleDateString('fr-FR')}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Heure</dt>
                    <dd className="font-medium">
                      {new Date(data.metadata.generatedAt).toLocaleTimeString('fr-FR')}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques Globales</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Total Organismes</dt>
                    <dd className="font-bold text-lg">{data.statistics.totalOrganismes}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Total Utilisateurs</dt>
                    <dd className="font-bold text-lg">{data.statistics.totalUsers}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Utilisateurs Actifs</dt>
                    <dd className="font-bold text-green-600">{data.statistics.activeUsers}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Utilisateurs Inactifs</dt>
                    <dd className="font-bold text-gray-400">{data.statistics.inactiveUsers}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Moyenne/Organisme</dt>
                    <dd className="font-bold">{data.statistics.averageUsersPerOrganisme}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
