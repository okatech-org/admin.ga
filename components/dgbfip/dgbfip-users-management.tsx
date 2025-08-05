/* @ts-nocheck */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import {
  Building2,
  Users,
  Crown,
  Shield,
  Settings,
  Phone,
  Mail,
  Calendar,
  Search,
  Filter,
  Download,
  Upload,
  UserPlus,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  Star,
  TrendingUp,
  BarChart3,
  Loader2,
  RefreshCw,
  Database,
  FileText,
  Activity
} from 'lucide-react';

import { getDGBFIPUsers, getDGBFIPDirection, getDGBFIPStatistics, getDGBFIPOrganigramme, type DGBFIPUser } from '@/lib/data/dgbfip-users';

interface DGBFIPUsersManagementProps {
  onCreateUser?: () => void;
  onImportUsers?: () => void;
}

export default function DGBFIPUsersManagement({ onCreateUser, onImportUsers }: DGBFIPUsersManagementProps) {
  // États de base
  const [users, setUsers] = useState<DGBFIPUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<DGBFIPUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<DGBFIPUser | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Charger les données
  useEffect(() => {
    loadDGBFIPUsers();
  }, []);

  const loadDGBFIPUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      // Simulation d'un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 800));

      const dgbfipUsers = getDGBFIPUsers();
      setUsers(dgbfipUsers);
      setFilteredUsers(dgbfipUsers);
      toast.success('Utilisateurs DGBFIP chargés avec succès');
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs DGBFIP:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filtrer les utilisateurs
  useEffect(() => {
    let filtered = users;

    // Filtrage par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par rôle
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    // Filtrage par niveau - désactivé
    // if (selectedLevel !== 'all') {
    //   filtered = filtered.filter(user => user.niveau === parseInt(selectedLevel));
    // }

    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedRole, selectedLevel]);

  // Fonctions utilitaires
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800 border-red-300';
      case 'MANAGER': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'AGENT': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getLevelIcon = (niveau: number) => {
    switch (niveau) {
      case 1: return Crown;
      case 2: return Shield;
      case 3: return Settings;
      default: return Users;
    }
  };

  const getLevelLabel = (niveau: number) => {
    switch (niveau) {
      case 1: return 'Direction';
      case 2: return 'Encadrement';
      case 3: return 'Exécution';
      default: return 'Inconnu';
    }
  };

  const handleUserDetails = (user: DGBFIPUser) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const exportUsers = () => {
    const dataStr = JSON.stringify(users, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'dgbfip-users.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success('Export des utilisateurs DGBFIP généré');
  };

  // Données statistiques
  const direction = getDGBFIPDirection();
  const statistics = getDGBFIPStatistics();
  const organigramme = getDGBFIPOrganigramme();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Chargement DGBFIP...</h3>
          <p className="text-muted-foreground">Initialisation des comptes utilisateurs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec informations générales */}
      <Card className="border-l-4 border-l-blue-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Building2 className="h-6 w-6 text-blue-600" />
                {direction.organisation || 'Direction DGBFIP'}
              </CardTitle>
              <CardDescription className="mt-2">
                Libreville, Gabon • Ministère des Finances
              </CardDescription>
            </div>
            <div className="text-right">
              <Badge className="bg-blue-100 text-blue-800 mb-2">
                DGBFIP
              </Badge>
              <p className="text-sm text-muted-foreground">
                {statistics.total_comptes} comptes utilisateurs
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Onglets de gestion */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="hierarchy" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Hiérarchie
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Statistiques
          </TabsTrigger>
        </TabsList>

        {/* Onglet Utilisateurs */}
        <TabsContent value="users" className="space-y-6">
          {/* Actions et filtres */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestion des Utilisateurs DGBFIP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-center mb-6">
                {/* Recherche */}
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher un utilisateur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filtres */}
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous rôles</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="AGENT">Agent</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous niveaux</SelectItem>
                    <SelectItem value="1">Niveau 1</SelectItem>
                    <SelectItem value="2">Niveau 2</SelectItem>
                    <SelectItem value="3">Niveau 3</SelectItem>
                  </SelectContent>
                </Select>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={exportUsers}>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                  <Button onClick={onImportUsers}>
                    <Upload className="h-4 w-4 mr-2" />
                    Importer
                  </Button>
                  <Button onClick={onCreateUser}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Nouveau
                  </Button>
                </div>
              </div>

              {/* Liste des utilisateurs */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredUsers.map((user) => {
                  const LevelIcon = getLevelIcon(3); // Niveau par défaut

                  return (
                    <Card key={user.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleUserDetails(user)}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                              {user.prenom[0]}{user.nom[0]}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm leading-tight truncate">
                              {user.prenom} {user.nom}
                            </h4>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.service || user.role}
                            </p>

                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={getRoleBadgeColor(user.role)}>
                                {user.role}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <LevelIcon className="h-3 w-3 mr-1" />
                                Agent
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">{user.email.split('@')[0]}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span>Actif</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
                  <p className="text-gray-600">
                    Aucun utilisateur DGBFIP ne correspond aux critères de recherche.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Hiérarchie */}
        <TabsContent value="hierarchy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Organigramme DGBFIP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Niveau 1 - Direction */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Crown className="h-5 w-5 text-red-600" />
                    Niveau 1 - Direction ({organigramme.niveau_1_direction.total} postes)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {organigramme.niveau_1_direction.postes.map((poste, index) => (
                      <Card key={index} className="border-l-4 border-l-red-500">
                        <CardContent className="p-4">
                          <p className="font-medium text-sm">{poste}</p>
                          <Badge className="mt-2 bg-red-100 text-red-800">Direction</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Niveau 2 - Encadrement */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Niveau 2 - Encadrement ({organigramme.niveau_2_encadrement.total} postes)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {organigramme.niveau_2_encadrement.postes.map((poste, index) => (
                      <Card key={index} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <p className="font-medium text-sm">{poste}</p>
                          <Badge className="mt-2 bg-blue-100 text-blue-800">Encadrement</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Niveau 3 - Exécution */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-green-600" />
                    Niveau 3 - Exécution ({organigramme.niveau_3_execution.total} postes)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {organigramme.niveau_3_execution.postes.map((poste, index) => (
                      <Card key={index} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <p className="font-medium text-sm">{poste}</p>
                          <Badge className="mt-2 bg-green-100 text-green-800">Exécution</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Statistiques */}
        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Comptes</p>
                    <p className="text-2xl font-bold text-blue-600">{statistics.total_comptes}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Administrateurs</p>
                    <p className="text-2xl font-bold text-red-600">{statistics.repartition_par_role.ADMIN}</p>
                  </div>
                  <Crown className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Managers</p>
                    <p className="text-2xl font-bold text-blue-600">{statistics.repartition_par_role.MANAGER}</p>
                  </div>
                  <Shield className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Agents</p>
                    <p className="text-2xl font-bold text-green-600">{statistics.repartition_par_role.AGENT}</p>
                  </div>
                  <Settings className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informations de contact */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">+241 01 73 00 00</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">contact@dgbfip.ga</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Libreville, Gabon</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Responsable: Directeur Général</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Satisfaction: 98%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Dernière activité: Aujourd'hui</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de détails utilisateur */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de l'utilisateur</DialogTitle>
            <DialogDescription>
              Informations complètes sur le compte utilisateur DGBFIP
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
                    {selectedUser.prenom[0]}{selectedUser.nom[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.prenom} {selectedUser.nom}</h3>
                  <p className="text-muted-foreground">{selectedUser.service || 'Service non défini'}</p>
                  <Badge className={getRoleBadgeColor(selectedUser.role)}>
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Téléphone</Label>
                  <p className="text-sm text-muted-foreground">+241 XX XX XX XX</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date d'embauche</Label>
                  <p className="text-sm text-muted-foreground">Non spécifiée</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Spécialité</Label>
                  <p className="text-sm text-muted-foreground">{selectedUser.bureau || 'Non spécifiée'}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Organisme</Label>
                <p className="text-sm text-muted-foreground">DGBFIP</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
