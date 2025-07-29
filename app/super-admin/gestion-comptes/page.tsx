/* @ts-nocheck */
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import {
  Users,
  UserPlus,
  Search,
  Edit,
  Lock,
  Unlock,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Calendar,
  Filter
} from 'lucide-react';

import {
  getAllPostes,
  GRADES_FONCTION_PUBLIQUE
} from '@/lib/data/postes-administratifs';

import {
  systemUsers,
  getUsersByRole,
  unifiedOrganismes,
  getUsersByOrganisme
} from '@/lib/data/unified-system-data';

import { toast } from 'sonner';
import React from 'react';

export default function GestionComptesPage() {
  // Utiliser les vrais utilisateurs du système (agents et collaborateurs uniquement)
  const collaborateurs = systemUsers.filter(user =>
    ['ADMIN', 'MANAGER', 'AGENT'].includes(user.role)
  );

  const [filteredCollaborateurs, setFilteredCollaborateurs] = useState(collaborateurs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const postes = getAllPostes();

  // Filtrer les collaborateurs
  const handleFilter = () => {
    let filtered = collaborateurs;

    if (searchTerm) {
      filtered = filtered.filter(collab =>
        collab.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collab.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collab.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collab.organizationName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(collab =>
        selectedStatus === 'actif' ? collab.isActive : !collab.isActive
      );
    }

    setFilteredCollaborateurs(filtered);
  };

  // Appliquer les filtres à chaque changement
  React.useEffect(() => {
    handleFilter();
  }, [searchTerm, selectedStatus]);

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-blue-100 text-blue-800';
      case 'MANAGER': return 'bg-green-100 text-green-800';
      case 'AGENT': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEditCollaborateur = (collaborateur: any) => {
    toast.info(`Édition de ${collaborateur.firstName} ${collaborateur.lastName} en cours de développement`);
  };

  const handleToggleStatus = (collaborateur: any) => {
    toast.success(`Statut de ${collaborateur.firstName} ${collaborateur.lastName} modifié`);
  };

  const handleCreateCollaborateur = () => {
    toast.success('Fonctionnalité de création de collaborateur en cours de développement');
  };

  const statistiques = {
    total: collaborateurs.length,
    actifs: collaborateurs.filter(c => c.isActive).length,
    inactifs: collaborateurs.filter(c => !c.isActive).length,
    parRole: {
      admin: collaborateurs.filter(c => c.role === 'ADMIN').length,
      manager: collaborateurs.filter(c => c.role === 'MANAGER').length,
      agent: collaborateurs.filter(c => c.role === 'AGENT').length
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des Comptes Collaborateurs
          </h1>
          <p className="text-gray-600">
            Administration des comptes collaborateurs et agents des organismes publics
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{statistiques.total}</p>
                </div>
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{statistiques.actifs}</p>
                </div>
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactifs</p>
                  <p className="text-2xl font-bold text-gray-900">{statistiques.inactifs}</p>
                </div>
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-2xl font-bold text-gray-900">{statistiques.parRole.admin}</p>
                </div>
                <UserPlus className="h-6 w-6 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Managers</p>
                  <p className="text-2xl font-bold text-gray-900">{statistiques.parRole.manager}</p>
                </div>
                <UserPlus className="h-6 w-6 text-indigo-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Agents</p>
                  <p className="text-2xl font-bold text-gray-900">{statistiques.parRole.agent}</p>
                </div>
                <UserPlus className="h-6 w-6 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="liste" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="liste">Liste des Collaborateurs</TabsTrigger>
              <TabsTrigger value="creation">Créer un Collaborateur</TabsTrigger>
            </TabsList>

            <Button onClick={handleCreateCollaborateur}>
              <UserPlus className="h-4 w-4 mr-2" />
              Nouveau Collaborateur
            </Button>
          </div>

          {/* Onglet Liste */}
          <TabsContent value="liste" className="space-y-6">
            {/* Filtres */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres et Recherche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un collaborateur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="inactif">Inactif</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedStatus('');
                    }}
                  >
                    Réinitialiser
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Liste des collaborateurs */}
            <div className="grid gap-4">
              {filteredCollaborateurs.map((collaborateur) => (
                <Card key={collaborateur.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {collaborateur.firstName.charAt(0)}{collaborateur.lastName.charAt(0)}
                        </div>

                        <div>
                          <h3 className="font-bold text-lg">
                            {collaborateur.firstName} {collaborateur.lastName}
                          </h3>
                          <p className="text-gray-600">{collaborateur.posteTitle}</p>
                          <p className="text-sm text-gray-500">{collaborateur.organizationName}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="flex items-center text-sm text-gray-500">
                              <Mail className="h-4 w-4 mr-1" />
                              {collaborateur.email}
                            </span>
                            {collaborateur.phone && (
                              <span className="flex items-center text-sm text-gray-500">
                                <Phone className="h-4 w-4 mr-1" />
                                {collaborateur.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getRoleColor(collaborateur.role)}>
                              {collaborateur.role}
                            </Badge>
                            <Badge className={getStatusColor(collaborateur.isActive)}>
                              {collaborateur.isActive ? 'ACTIF' : 'INACTIF'}
                            </Badge>
                            {collaborateur.grade && (
                              <Badge variant="outline">
                                {collaborateur.grade}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Créé le: {formatDate(collaborateur.createdAt)}
                          </p>
                          {collaborateur.department && (
                            <p className="text-sm text-gray-500">
                              Département: {collaborateur.department}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCollaborateur(collaborateur)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(collaborateur)}
                          >
                            {collaborateur.isActive ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <Unlock className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCollaborateurs.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun collaborateur trouvé
                  </h3>
                  <p className="text-gray-600">
                    Essayez de modifier vos critères de recherche
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Onglet Création */}
          <TabsContent value="creation">
            <Card>
              <CardHeader>
                <CardTitle>Créer un Nouveau Collaborateur</CardTitle>
                <CardDescription>
                  Ajoutez un nouveau collaborateur à un organisme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Formulaire de création en cours de développement
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Cette fonctionnalité sera bientôt disponible pour créer de nouveaux collaborateurs
                  </p>
                  <Button onClick={handleCreateCollaborateur}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Créer un collaborateur
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
}
