'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  MessageCircle,
  User,
  Calendar,
  Filter,
  Search,
  Download,
  Upload,
  Settings,
  BarChart3,
  Users,
  TrendingUp,
  AlertTriangle,
  PhoneCall,
  Mail,
  Building,
  XCircle,
  Loader2
} from 'lucide-react'

interface Dossier {
  id: string
  numero: string
  service: string
  citoyen: {
    nom: string
    prenom: string
    email: string
    telephone: string
  }
  status: 'nouveau' | 'en_traitement' | 'en_attente_info' | 'valide' | 'rejete'
  priorite: 'normale' | 'urgente' | 'haute'
  dateCreation: string
  dateModification: string
  delaiRestant: number
  progression: number
  documentsManquants: string[]
  commentaires: number
}

interface Message {
  id: string
  expediteur: string
  contenu: string
  date: string
  type: 'agent' | 'citoyen' | 'systeme'
}

export default function AgentDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [actionType, setActionType] = useState<'valider' | 'rejeter' | 'demander_info'>('valider')
  const [actionComment, setActionComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [dossiers, setDossiers] = useState<Dossier[]>([])

  // Simulation de données agent
  const agent = {
    nom: 'AKOMO',
    prenom: 'Marie Claire',
    organisme: 'DGDI - Direction Générale',
    service: 'Section CNI et Passeports',
    matricule: 'AG-2024-001',
    email: 'mc.akomo@dgdi.ga'
  }

  // Données simulées
  useEffect(() => {
    const dossiersSimules: Dossier[] = [
      {
        id: '1',
        numero: 'DEM-2025-001234',
        service: 'Carte Nationale d\'Identité',
        citoyen: {
          nom: 'MVENG',
          prenom: 'Jean Pierre',
          email: 'jp.mveng@exemple.com',
          telephone: '+241 06 12 34 56'
        },
        status: 'nouveau',
        priorite: 'normale',
        dateCreation: '2025-01-16',
        dateModification: '2025-01-16',
        delaiRestant: 6,
        progression: 20,
        documentsManquants: [],
        commentaires: 0
      },
      {
        id: '2',
        numero: 'DEM-2025-001235',
        service: 'Passeport Biométrique',
        citoyen: {
          nom: 'NDONG',
          prenom: 'Sarah',
          email: 'sarah.ndong@exemple.com',
          telephone: '+241 06 23 45 67'
        },
        status: 'en_attente_info',
        priorite: 'urgente',
        dateCreation: '2025-01-14',
        dateModification: '2025-01-15',
        delaiRestant: 12,
        progression: 60,
        documentsManquants: ['Photo d\'identité conforme', 'Justificatif de domicile récent'],
        commentaires: 2
      },
      {
        id: '3',
        numero: 'DEM-2025-001236',
        service: 'Renouvellement CNI',
        citoyen: {
          nom: 'OBAME',
          prenom: 'Michel',
          email: 'm.obame@exemple.com',
          telephone: '+241 06 34 56 78'
        },
        status: 'en_traitement',
        priorite: 'haute',
        dateCreation: '2025-01-13',
        dateModification: '2025-01-16',
        delaiRestant: 4,
        progression: 80,
        documentsManquants: [],
        commentaires: 1
      }
    ]

    setDossiers(dossiersSimules)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nouveau': return 'bg-blue-100 text-blue-800'
      case 'en_traitement': return 'bg-yellow-100 text-yellow-800'
      case 'en_attente_info': return 'bg-orange-100 text-orange-800'
      case 'valide': return 'bg-green-100 text-green-800'
      case 'rejete': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'nouveau': return 'Nouveau'
      case 'en_traitement': return 'En traitement'
      case 'en_attente_info': return 'En attente d\'infos'
      case 'valide': return 'Validé'
      case 'rejete': return 'Rejeté'
      default: return status
    }
  }

  const getPriorityColor = (priorite: string) => {
    switch (priorite) {
      case 'urgente': return 'text-red-600'
      case 'haute': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  const getPriorityIcon = (priorite: string) => {
    switch (priorite) {
      case 'urgente': return <AlertTriangle className="w-4 h-4" />
      case 'haute': return <TrendingUp className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const handleAction = async () => {
    if (!selectedDossier) return

    setLoading(true)
    try {
      // Simulation d'API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mise à jour du statut selon l'action
      const newStatus = actionType === 'valider' ? 'valide' :
                       actionType === 'rejeter' ? 'rejete' : 'en_attente_info'

      setDossiers(prev => prev.map(d =>
        d.id === selectedDossier.id
          ? { ...d, status: newStatus as any, dateModification: new Date().toISOString().split('T')[0] }
          : d
      ))

      setIsActionModalOpen(false)
      setActionComment('')

    } catch (error) {
      console.error('Erreur lors de l\'action:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDossiers = dossiers.filter(dossier => {
    const matchesSearch =
      dossier.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${dossier.citoyen.prenom} ${dossier.citoyen.nom}`.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || dossier.status === filterStatus
    const matchesPriority = filterPriority === 'all' || dossier.priorite === filterPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const nouveauxDossiers = dossiers.filter(d => d.status === 'nouveau').length
  const enTraitement = dossiers.filter(d => d.status === 'en_traitement').length
  const enAttente = dossiers.filter(d => d.status === 'en_attente_info').length
  const urgents = dossiers.filter(d => d.priorite === 'urgente').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Espace Agent - {agent.prenom} {agent.nom}
              </h1>
              <p className="text-gray-600">{agent.organisme} • {agent.service}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                <Building className="w-4 h-4 mr-1" />
                {agent.matricule}
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Alertes importantes */}
        {urgents > 0 && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Vous avez {urgents} dossier(s) urgent(s) à traiter en priorité.
            </AlertDescription>
          </Alert>
        )}

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Nouveaux dossiers</p>
                  <p className="text-2xl font-bold text-gray-900">{nouveauxDossiers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En traitement</p>
                  <p className="text-2xl font-bold text-gray-900">{enTraitement}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-gray-900">{enAttente}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Urgents</p>
                  <p className="text-2xl font-bold text-gray-900">{urgents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>File de Traitement</CardTitle>
                    <CardDescription>
                      Gérez et traitez les dossiers de demandes
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Statistiques
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Recherche et filtres */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher un dossier, citoyen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="nouveau">Nouveau</SelectItem>
                      <SelectItem value="en_traitement">En traitement</SelectItem>
                      <SelectItem value="en_attente_info">En attente</SelectItem>
                      <SelectItem value="valide">Validé</SelectItem>
                      <SelectItem value="rejete">Rejeté</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filtrer par priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes priorités</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                      <SelectItem value="haute">Haute</SelectItem>
                      <SelectItem value="normale">Normale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Liste des dossiers */}
                <div className="space-y-4">
                  {filteredDossiers.map((dossier) => (
                    <div
                      key={dossier.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900">{dossier.service}</h3>
                            <div className={`flex items-center space-x-1 ${getPriorityColor(dossier.priorite)}`}>
                              {getPriorityIcon(dossier.priorite)}
                              <span className="text-xs capitalize">{dossier.priorite}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">#{dossier.numero}</p>
                          <p className="text-sm text-gray-900">
                            {dossier.citoyen.prenom} {dossier.citoyen.nom}
                          </p>
                          <p className="text-xs text-gray-500">
                            Créé le {new Date(dossier.dateCreation).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(dossier.status)}>
                            {getStatusText(dossier.status)}
                          </Badge>
                          {dossier.delaiRestant <= 2 && (
                            <Badge variant="destructive" className="text-xs">
                              Urgent
                            </Badge>
                          )}
                        </div>
                      </div>

                      {dossier.documentsManquants.length > 0 && (
                        <Alert className="mb-3 bg-orange-50 border-orange-200">
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                          <AlertDescription className="text-orange-800 text-sm">
                            Documents manquants: {dossier.documentsManquants.join(', ')}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{dossier.delaiRestant} jours restants</span>
                          </div>
                          {dossier.commentaires > 0 && (
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{dossier.commentaires} message(s)</span>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDossier(dossier)
                              setIsDetailsModalOpen(true)
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Voir
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDossier(dossier)
                              setIsActionModalOpen(true)
                            }}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Traiter
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredDossiers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucun dossier trouvé</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Planifier rendez-vous
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter rapport
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Import documents
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Contacts utiles
                </Button>
              </CardContent>
            </Card>

            {/* Mes performances */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mes Performances</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Dossiers traités ce mois</span>
                  <span className="font-semibold">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Délai moyen de traitement</span>
                  <span className="font-semibold">3.2 jours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Taux de satisfaction</span>
                  <span className="font-semibold text-green-600">96%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Objectif mensuel</span>
                  <span className="font-semibold">94% (47/50)</span>
                </div>
              </CardContent>
            </Card>

            {/* Contacts d'urgence */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contacts d'Urgence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <PhoneCall className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">Support technique</div>
                    <div className="text-xs text-gray-500">+241 01 XX XX XX</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">Superviseur</div>
                    <div className="text-xs text-gray-500">chef.service@dgdi.ga</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">Administration</div>
                    <div className="text-xs text-gray-500">admin@dgdi.ga</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de détails du dossier */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du Dossier</DialogTitle>
            {selectedDossier && (
              <DialogDescription>
                #{selectedDossier.numero} - {selectedDossier.service}
              </DialogDescription>
            )}
          </DialogHeader>

          {selectedDossier && (
            <div className="space-y-6">
              {/* Informations du citoyen */}
              <div>
                <h4 className="font-medium mb-3">Informations du demandeur</h4>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm text-gray-600">Nom complet</Label>
                    <p className="font-medium">{selectedDossier.citoyen.prenom} {selectedDossier.citoyen.nom}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Email</Label>
                    <p className="font-medium">{selectedDossier.citoyen.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Téléphone</Label>
                    <p className="font-medium">{selectedDossier.citoyen.telephone}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Statut</Label>
                    <Badge className={getStatusColor(selectedDossier.status)}>
                      {getStatusText(selectedDossier.status)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Progression */}
              <div>
                <h4 className="font-medium mb-3">Progression du dossier</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Avancement</span>
                    <span className="text-sm font-medium">{selectedDossier.progression}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${selectedDossier.progression}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Documents manquants */}
              {selectedDossier.documentsManquants.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Documents manquants</h4>
                  <ul className="space-y-1">
                    {selectedDossier.documentsManquants.map((doc, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Historique des actions */}
              <div>
                <h4 className="font-medium mb-3">Historique des actions</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Dossier créé</span>
                      <span className="text-xs text-gray-500">{selectedDossier.dateCreation}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Demande soumise par le citoyen</p>
                  </div>
                  {selectedDossier.status !== 'nouveau' && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Prise en charge</span>
                        <span className="text-xs text-gray-500">{selectedDossier.dateModification}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Dossier assigné pour traitement</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal d'action sur le dossier */}
      <Dialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Action sur le Dossier</DialogTitle>
            {selectedDossier && (
              <DialogDescription>
                #{selectedDossier.numero} - {selectedDossier.citoyen.prenom} {selectedDossier.citoyen.nom}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Type d'action</Label>
              <Select value={actionType} onValueChange={(value: any) => setActionType(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="valider">Valider le dossier</SelectItem>
                  <SelectItem value="rejeter">Rejeter le dossier</SelectItem>
                  <SelectItem value="demander_info">Demander des informations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Commentaire</Label>
              <Textarea
                placeholder="Ajoutez un commentaire ou une justification..."
                value={actionComment}
                onChange={(e) => setActionComment(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAction} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : (
                'Confirmer l\'action'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
