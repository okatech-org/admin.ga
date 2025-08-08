'use client'

import React, { useState, useEffect } from 'react'
import { SuperAdminLayout } from '@/components/layouts/super-admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Building2,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Download,
  Upload,
  Key
} from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  userRole: 'CITOYEN' | 'AGENT' | 'ADMIN' | 'SUPER_ADMIN'
  phone?: string
  ville?: string
  province?: string
  isActive: boolean
  isVerified: boolean
  createdAt: string
  lastLogin?: string
  primaryOrganization?: {
    id: string
    name: string
    code: string
    type: string
  }
}

interface Organization {
  id: string
  name: string
  code: string
  type: string
  isActive: boolean
}

const USER_ROLES = [
  { value: 'CITOYEN', label: 'Citoyen', description: 'Utilisateur standard pour les démarches' },
  { value: 'AGENT', label: 'Agent', description: 'Agent de traitement dans un organisme' },
  { value: 'ADMIN', label: 'Administrateur', description: 'Administrateur d\'organisme' },
  { value: 'SUPER_ADMIN', label: 'Super Admin', description: 'Administrateur système' }
]

const PROVINCES_GABON = [
  'Estuaire', 'Haut-Ogooué', 'Moyen-Ogooué', 'Ngounié', 'Nyanga',
  'Ogooué-Ivindo', 'Ogooué-Lolo', 'Ogooué-Maritime', 'Woleu-Ntem'
]

export default function GestionUtilisateursDemarche() {
  const [users, setUsers] = useState<User[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    userRole: 'CITOYEN' as const,
    phone: '',
    ville: '',
    province: '',
    organizationId: '',
    isActive: true,
    isVerified: true,
    password: ''
  })

  // Chargement initial des données
  useEffect(() => {
    loadUsers()
    loadOrganizations()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/super-admin/users-demarche')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      } else {
        toast.error('Erreur lors du chargement des utilisateurs')
      }
    } catch (error) {
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const loadOrganizations = async () => {
    try {
      const response = await fetch('/api/super-admin/organizations')
      if (response.ok) {
        const data = await response.json()
        setOrganizations(data.organizations || [])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des organismes:', error)
    }
  }

  const handleCreateUser = async () => {
    try {
      if (!newUser.email || !newUser.firstName || !newUser.lastName) {
        toast.error('Veuillez remplir tous les champs obligatoires')
        return
      }

      if ((newUser.userRole === 'AGENT' || newUser.userRole === 'ADMIN') && !newUser.organizationId) {
        toast.error('Veuillez sélectionner un organisme pour les agents et administrateurs')
        return
      }

      const response = await fetch('/api/super-admin/users-demarche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newUser,
          organizationId: newUser.organizationId || null
        })
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Utilisateur créé avec succès')
        setIsCreateModalOpen(false)
        setNewUser({
          email: '',
          firstName: '',
          lastName: '',
          userRole: 'CITOYEN',
          phone: '',
          ville: '',
          province: '',
          organizationId: '',
          isActive: true,
          isVerified: true,
          password: ''
        })
        loadUsers()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erreur lors de la création')
      }
    } catch (error) {
      toast.error('Erreur de connexion')
    }
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return

    try {
      const response = await fetch(`/api/super-admin/users-demarche/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: editingUser.firstName,
          lastName: editingUser.lastName,
          phone: editingUser.phone,
          ville: editingUser.ville,
          province: editingUser.province,
          isActive: editingUser.isActive,
          isVerified: editingUser.isVerified
        })
      })

      if (response.ok) {
        toast.success('Utilisateur mis à jour avec succès')
        setIsEditModalOpen(false)
        setEditingUser(null)
        loadUsers()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      toast.error('Erreur de connexion')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return

    try {
      const response = await fetch(`/api/super-admin/users-demarche/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Utilisateur supprimé avec succès')
        loadUsers()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erreur lors de la suppression')
      }
    } catch (error) {
      toast.error('Erreur de connexion')
    }
  }

  const handleResetPassword = async (userId: string) => {
    try {
      const response = await fetch(`/api/super-admin/users-demarche/${userId}/reset-password`, {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(`Mot de passe réinitialisé: ${data.newPassword}`)
      } else {
        toast.error('Erreur lors de la réinitialisation')
      }
    } catch (error) {
      toast.error('Erreur de connexion')
    }
  }

  // Filtrage des utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = filterRole === 'all' || user.userRole === filterRole
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && user.isActive) ||
      (filterStatus === 'inactive' && !user.isActive) ||
      (filterStatus === 'verified' && user.isVerified) ||
      (filterStatus === 'unverified' && !user.isVerified)

    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-red-100 text-red-800'
      case 'ADMIN': return 'bg-purple-100 text-purple-800'
      case 'AGENT': return 'bg-blue-100 text-blue-800'
      case 'CITOYEN': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (user: User) => {
    if (!user.isActive) return <XCircle className="w-4 h-4 text-red-500" />
    if (!user.isVerified) return <AlertCircle className="w-4 h-4 text-yellow-500" />
    return <CheckCircle className="w-4 h-4 text-green-500" />
  }

  return (
    <SuperAdminLayout
      title="Gestion des Utilisateurs DEMARCHE.GA"
      description="Créer et gérer les comptes d'accès à la plateforme"
    >
      <div className="space-y-6">
        {/* Header avec actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Utilisateurs DEMARCHE.GA</h1>
            <p className="text-gray-600">Gérez les comptes citoyens, agents et administrateurs</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Nouvel utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
                  <DialogDescription>
                    Ajoutez un nouveau compte d'accès à DEMARCHE.GA
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  <Tabs defaultValue="informations">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="informations">Informations</TabsTrigger>
                      <TabsTrigger value="role">Rôle & Organisme</TabsTrigger>
                      <TabsTrigger value="localisation">Localisation</TabsTrigger>
                    </TabsList>

                    <TabsContent value="informations" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">Prénom *</Label>
                          <Input
                            id="firstName"
                            value={newUser.firstName}
                            onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                            placeholder="Prénom"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Nom *</Label>
                          <Input
                            id="lastName"
                            value={newUser.lastName}
                            onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
                            placeholder="Nom"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="email@exemple.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          value={newUser.phone}
                          onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+241 XX XX XX XX"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Mot de passe temporaire</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Laissez vide pour générer automatiquement"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Si vide, le mot de passe par défaut "Test123!" sera utilisé
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="role" className="space-y-4">
                      <div>
                        <Label>Rôle utilisateur *</Label>
                        <Select value={newUser.userRole} onValueChange={(value: any) => setNewUser(prev => ({ ...prev, userRole: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {USER_ROLES.map(role => (
                              <SelectItem key={role.value} value={role.value}>
                                <div>
                                  <div className="font-medium">{role.label}</div>
                                  <div className="text-sm text-gray-500">{role.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {(newUser.userRole === 'AGENT' || newUser.userRole === 'ADMIN') && (
                        <div>
                          <Label>Organisme *</Label>
                          <Select value={newUser.organizationId} onValueChange={(value) => setNewUser(prev => ({ ...prev, organizationId: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un organisme" />
                            </SelectTrigger>
                            <SelectContent>
                              {organizations.filter(org => org.isActive).map(org => (
                                <SelectItem key={org.id} value={org.id}>
                                  {org.code} - {org.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={newUser.isActive}
                          onCheckedChange={(checked) => setNewUser(prev => ({ ...prev, isActive: checked }))}
                        />
                        <Label>Compte actif</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={newUser.isVerified}
                          onCheckedChange={(checked) => setNewUser(prev => ({ ...prev, isVerified: checked }))}
                        />
                        <Label>Email vérifié</Label>
                      </div>
                    </TabsContent>

                    <TabsContent value="localisation" className="space-y-4">
                      <div>
                        <Label htmlFor="ville">Ville</Label>
                        <Input
                          id="ville"
                          value={newUser.ville}
                          onChange={(e) => setNewUser(prev => ({ ...prev, ville: e.target.value }))}
                          placeholder="Libreville"
                        />
                      </div>
                      <div>
                        <Label>Province</Label>
                        <Select value={newUser.province} onValueChange={(value) => setNewUser(prev => ({ ...prev, province: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une province" />
                          </SelectTrigger>
                          <SelectContent>
                            {PROVINCES_GABON.map(province => (
                              <SelectItem key={province} value={province}>
                                {province}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateUser}>
                    Créer l'utilisateur
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Agents</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.userRole === 'AGENT' || u.userRole === 'ADMIN').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Citoyens</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.userRole === 'CITOYEN').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardHeader>
            <CardTitle>Filtres et Recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-72">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher par nom, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  {USER_ROLES.map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
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

        {/* Liste des utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Utilisateurs ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Chargement...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun utilisateur trouvé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </h3>
                            <Badge className={getRoleBadgeColor(user.userRole)}>
                              {USER_ROLES.find(r => r.value === user.userRole)?.label}
                            </Badge>
                            {getStatusIcon(user)}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 space-x-4">
                            <span className="flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {user.email}
                            </span>
                            {user.phone && (
                              <span className="flex items-center">
                                <Phone className="w-4 h-4 mr-1" />
                                {user.phone}
                              </span>
                            )}
                            {user.primaryOrganization && (
                              <span className="flex items-center">
                                <Building2 className="w-4 h-4 mr-1" />
                                {user.primaryOrganization.code}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Créé le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                            {user.lastLogin && (
                              <span> • Dernière connexion: {new Date(user.lastLogin).toLocaleDateString('fr-FR')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingUser(user)
                            setIsEditModalOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleResetPassword(user.id)}
                        >
                          <Key className="w-4 h-4" />
                        </Button>
                        {user.userRole !== 'SUPER_ADMIN' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal d'édition */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Modifier l'utilisateur</DialogTitle>
              <DialogDescription>
                Modifiez les informations de {editingUser?.firstName} {editingUser?.lastName}
              </DialogDescription>
            </DialogHeader>

            {editingUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editFirstName">Prénom</Label>
                    <Input
                      id="editFirstName"
                      value={editingUser.firstName}
                      onChange={(e) => setEditingUser(prev => prev ? { ...prev, firstName: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editLastName">Nom</Label>
                    <Input
                      id="editLastName"
                      value={editingUser.lastName}
                      onChange={(e) => setEditingUser(prev => prev ? { ...prev, lastName: e.target.value } : null)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="editPhone">Téléphone</Label>
                  <Input
                    id="editPhone"
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser(prev => prev ? { ...prev, phone: e.target.value } : null)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editVille">Ville</Label>
                    <Input
                      id="editVille"
                      value={editingUser.ville || ''}
                      onChange={(e) => setEditingUser(prev => prev ? { ...prev, ville: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label>Province</Label>
                    <Select value={editingUser.province || ''} onValueChange={(value) => setEditingUser(prev => prev ? { ...prev, province: value } : null)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROVINCES_GABON.map(province => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editingUser.isActive}
                      onCheckedChange={(checked) => setEditingUser(prev => prev ? { ...prev, isActive: checked } : null)}
                    />
                    <Label>Compte actif</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editingUser.isVerified}
                      onCheckedChange={(checked) => setEditingUser(prev => prev ? { ...prev, isVerified: checked } : null)}
                    />
                    <Label>Email vérifié</Label>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateUser}>
                Sauvegarder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminLayout>
  )
}
