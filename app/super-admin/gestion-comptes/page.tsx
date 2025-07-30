'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
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
  Filter,
  Loader2,
  Trash2,
  Save,
  X
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

// Types pour TypeScript
interface Collaborateur {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'MANAGER' | 'AGENT';
  organizationId: string;
  organizationName: string;
  posteTitle: string;
  department?: string;
  grade?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

interface CollaborateurFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'MANAGER' | 'AGENT';
  organizationId: string;
  posteTitle: string;
  department: string;
  grade: string;
}

// États de chargement
interface LoadingStates {
  creating: boolean;
  updating: string | null;
  toggling: string | null;
  deleting: string | null;
}

export default function GestionComptesPage() {
  // État des collaborateurs avec persistance locale
  const [collaborateurs, setCollaborateurs] = useState<Collaborateur[]>(() => {
    const rawUsers = systemUsers || [];
    return rawUsers
      .filter((user: any) => ['ADMIN', 'MANAGER', 'AGENT'].includes(user.role))
      .map((user: any) => ({
        id: user.id?.toString() || `user_${Math.random()}`,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role as 'ADMIN' | 'MANAGER' | 'AGENT',
        organizationId: user.organizationId?.toString() || '',
        organizationName: user.organizationName || '',
        posteTitle: user.posteTitle || 'Poste non défini',
        department: user.department || '',
        grade: typeof user.grade === 'string' ? user.grade : '',
        isActive: user.isActive !== false,
        createdAt: user.createdAt || new Date().toISOString(),
      }));
  });

  const [filteredCollaborateurs, setFilteredCollaborateurs] = useState<Collaborateur[]>(collaborateurs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedOrganisation, setSelectedOrganisation] = useState('');

  // États des modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState<Collaborateur | null>(null);

  // États de chargement
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    creating: false,
    updating: null,
    toggling: null,
    deleting: null
  });

  // Formulaire
  const [formData, setFormData] = useState<CollaborateurFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'AGENT',
    organizationId: '',
    posteTitle: '',
    department: '',
    grade: ''
  });

  const [formErrors, setFormErrors] = useState<Partial<CollaborateurFormData>>({});

  const postes = getAllPostes();

  // Validation du formulaire
  const validateForm = (data: CollaborateurFormData): Partial<CollaborateurFormData> => {
    const errors: Partial<CollaborateurFormData> = {};

    if (!data.firstName.trim()) errors.firstName = 'Le prénom est requis';
    if (!data.lastName.trim()) errors.lastName = 'Le nom est requis';
    if (!data.email.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Format d\'email invalide';
    }
    if (!data.organizationId) errors.organizationId = 'L\'organisation est requise';
    if (!data.posteTitle.trim()) errors.posteTitle = 'Le poste est requis';

    // Vérifier unicité de l'email
    const existingUser = collaborateurs.find(
      c => c.email === data.email && c.id !== selectedCollaborateur?.id
    );
    if (existingUser) {
      errors.email = 'Cette adresse email est déjà utilisée';
    }

    return errors;
  };

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

    if (selectedRole) {
      filtered = filtered.filter(collab => collab.role === selectedRole);
    }

    if (selectedOrganisation) {
      filtered = filtered.filter(collab => collab.organizationId === selectedOrganisation);
    }

    setFilteredCollaborateurs(filtered);
  };

  // Appliquer les filtres à chaque changement
  useEffect(() => {
    handleFilter();
  }, [searchTerm, selectedStatus, selectedRole, selectedOrganisation, collaborateurs]);

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'AGENT',
      organizationId: '',
      posteTitle: '',
      department: '',
      grade: ''
    });
    setFormErrors({});
  };

  // Créer un collaborateur
  const handleCreateCollaborateur = async () => {
    const errors = validateForm(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }

    setLoadingStates(prev => ({ ...prev, creating: true }));

    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const organisation = unifiedOrganismes.find(org => org.id === formData.organizationId);

      const newCollaborateur: Collaborateur = {
        id: `user_${Date.now()}`,
        ...formData,
        organizationName: organisation?.nom || 'Organisation inconnue',
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      setCollaborateurs(prev => [...prev, newCollaborateur]);
      setIsCreateModalOpen(false);
      resetForm();
      toast.success('Collaborateur créé avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la création du collaborateur');
    } finally {
      setLoadingStates(prev => ({ ...prev, creating: false }));
    }
  };

  // Modifier un collaborateur
  const handleEditCollaborateur = (collaborateur: Collaborateur) => {
    setSelectedCollaborateur(collaborateur);
    setFormData({
      firstName: collaborateur.firstName,
      lastName: collaborateur.lastName,
      email: collaborateur.email,
      phone: collaborateur.phone || '',
      role: collaborateur.role,
      organizationId: collaborateur.organizationId,
      posteTitle: collaborateur.posteTitle,
      department: collaborateur.department || '',
      grade: collaborateur.grade || ''
    });
    setIsEditModalOpen(true);
  };

  // Sauvegarder les modifications
  const handleSaveEdit = async () => {
    if (!selectedCollaborateur) return;

    const errors = validateForm(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }

    setLoadingStates(prev => ({ ...prev, updating: selectedCollaborateur.id }));

    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const organisation = unifiedOrganismes.find(org => org.id === formData.organizationId);

      setCollaborateurs(prev => prev.map(collab =>
        collab.id === selectedCollaborateur.id
          ? {
              ...collab,
              ...formData,
              organizationName: organisation?.nom || collab.organizationName,
            }
          : collab
      ));

      setIsEditModalOpen(false);
      setSelectedCollaborateur(null);
      resetForm();
      toast.success('Collaborateur modifié avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la modification du collaborateur');
    } finally {
      setLoadingStates(prev => ({ ...prev, updating: null }));
    }
  };

  // Changer le statut (actif/inactif)
  const handleToggleStatus = async (collaborateur: Collaborateur) => {
    setLoadingStates(prev => ({ ...prev, toggling: collaborateur.id }));

    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCollaborateurs(prev => prev.map(collab =>
        collab.id === collaborateur.id
          ? { ...collab, isActive: !collab.isActive }
          : collab
      ));

      const status = collaborateur.isActive ? 'désactivé' : 'activé';
      toast.success(`${collaborateur.firstName} ${collaborateur.lastName} a été ${status}`);
    } catch (error) {
      toast.error('Erreur lors du changement de statut');
    } finally {
      setLoadingStates(prev => ({ ...prev, toggling: null }));
    }
  };

  // Supprimer un collaborateur
  const handleDeleteCollaborateur = async () => {
    if (!selectedCollaborateur) return;

    setLoadingStates(prev => ({ ...prev, deleting: selectedCollaborateur.id }));

    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCollaborateurs(prev => prev.filter(collab => collab.id !== selectedCollaborateur.id));
      setIsDeleteDialogOpen(false);
      setSelectedCollaborateur(null);
      toast.success('Collaborateur supprimé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setLoadingStates(prev => ({ ...prev, deleting: null }));
    }
  };

  // Utilitaires de style
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

  // Statistiques
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
            </TabsList>

            <Button
              onClick={() => setIsCreateModalOpen(true)}
              disabled={loadingStates.creating}
            >
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
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="AGENT">Agent</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedOrganisation} onValueChange={setSelectedOrganisation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par organisation" />
                    </SelectTrigger>
                    <SelectContent>
                      {unifiedOrganismes.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedStatus('');
                      setSelectedRole('');
                      setSelectedOrganisation('');
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
                            disabled={loadingStates.updating === collaborateur.id}
                          >
                            {loadingStates.updating === collaborateur.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Edit className="h-4 w-4" />
                            )}
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(collaborateur)}
                            disabled={loadingStates.toggling === collaborateur.id}
                          >
                            {loadingStates.toggling === collaborateur.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : collaborateur.isActive ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <Unlock className="h-4 w-4" />
                            )}
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedCollaborateur(collaborateur);
                              setIsDeleteDialogOpen(true);
                            }}
                            disabled={loadingStates.deleting === collaborateur.id}
                          >
                            {loadingStates.deleting === collaborateur.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
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
        </Tabs>

        {/* Modal de création */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un Nouveau Collaborateur</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau collaborateur à un organisme
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className={formErrors.firstName ? 'border-red-500' : ''}
                  />
                  {formErrors.firstName && (
                    <p className="text-sm text-red-500">{formErrors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className={formErrors.lastName ? 'border-red-500' : ''}
                  />
                  {formErrors.lastName && (
                    <p className="text-sm text-red-500">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={formErrors.email ? 'border-red-500' : ''}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: 'ADMIN' | 'MANAGER' | 'AGENT') =>
                      setFormData(prev => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="AGENT">Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizationId">Organisation *</Label>
                  <Select
                    value={formData.organizationId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, organizationId: value }))}
                  >
                    <SelectTrigger className={formErrors.organizationId ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Sélectionner une organisation" />
                    </SelectTrigger>
                    <SelectContent>
                      {unifiedOrganismes.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.organizationId && (
                    <p className="text-sm text-red-500">{formErrors.organizationId}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="posteTitle">Poste *</Label>
                <Input
                  id="posteTitle"
                  value={formData.posteTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, posteTitle: e.target.value }))}
                  className={formErrors.posteTitle ? 'border-red-500' : ''}
                />
                {formErrors.posteTitle && (
                  <p className="text-sm text-red-500">{formErrors.posteTitle}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Département</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  />
                </div>

                                 <div className="space-y-2">
                   <Label htmlFor="grade">Grade</Label>
                   <Select
                     value={formData.grade}
                     onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}
                   >
                     <SelectTrigger>
                       <SelectValue placeholder="Sélectionner un grade" />
                     </SelectTrigger>
                     <SelectContent>
                       {GRADES_FONCTION_PUBLIQUE.map((grade) => (
                         <SelectItem key={typeof grade === 'string' ? grade : grade.code} value={typeof grade === 'string' ? grade : grade.code}>
                           {typeof grade === 'string' ? grade : grade.nom}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                disabled={loadingStates.creating}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button
                onClick={handleCreateCollaborateur}
                disabled={loadingStates.creating}
              >
                {loadingStates.creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Créer
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal d'édition */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier le Collaborateur</DialogTitle>
              <DialogDescription>
                Modifiez les informations du collaborateur
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-firstName">Prénom *</Label>
                  <Input
                    id="edit-firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className={formErrors.firstName ? 'border-red-500' : ''}
                  />
                  {formErrors.firstName && (
                    <p className="text-sm text-red-500">{formErrors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-lastName">Nom *</Label>
                  <Input
                    id="edit-lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className={formErrors.lastName ? 'border-red-500' : ''}
                  />
                  {formErrors.lastName && (
                    <p className="text-sm text-red-500">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={formErrors.email ? 'border-red-500' : ''}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Téléphone</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Rôle *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: 'ADMIN' | 'MANAGER' | 'AGENT') =>
                      setFormData(prev => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="AGENT">Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-organizationId">Organisation *</Label>
                  <Select
                    value={formData.organizationId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, organizationId: value }))}
                  >
                    <SelectTrigger className={formErrors.organizationId ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Sélectionner une organisation" />
                    </SelectTrigger>
                    <SelectContent>
                      {unifiedOrganismes.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.organizationId && (
                    <p className="text-sm text-red-500">{formErrors.organizationId}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-posteTitle">Poste *</Label>
                <Input
                  id="edit-posteTitle"
                  value={formData.posteTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, posteTitle: e.target.value }))}
                  className={formErrors.posteTitle ? 'border-red-500' : ''}
                />
                {formErrors.posteTitle && (
                  <p className="text-sm text-red-500">{formErrors.posteTitle}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Département</Label>
                  <Input
                    id="edit-department"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-grade">Grade</Label>
                  <Select
                    value={formData.grade}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {GRADES_FONCTION_PUBLIQUE.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedCollaborateur(null);
                  resetForm();
                }}
                disabled={loadingStates.updating !== null}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={loadingStates.updating !== null}
              >
                {loadingStates.updating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Modification...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de confirmation de suppression */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer le collaborateur {selectedCollaborateur?.firstName} {selectedCollaborateur?.lastName} ?
                Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setSelectedCollaborateur(null);
                }}
                disabled={loadingStates.deleting !== null}
              >
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteCollaborateur}
                disabled={loadingStates.deleting !== null}
                className="bg-red-600 hover:bg-red-700"
              >
                {loadingStates.deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  'Supprimer'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AuthenticatedLayout>
  );
}
