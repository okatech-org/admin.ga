'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  BarChart3,
  Users,
  Settings,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Mail,
  Shield,
  Building,
  Calendar,
  Activity,
  Target,
  Award,
  AlertTriangle,
  Search,
  Filter,
  UserPlus,
  Loader2
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Agent {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  matricule: string
  statut: 'actif' | 'inactif' | 'en_conge'
  role: string
  dateEmbauche: string
  performance: {
    dossiersMois: number
    delaiMoyen: number
    satisfaction: number
  }
}

interface Service {
  id: string
  nom: string
  description: string
  cout: number
  dureeEstimee: number
  status: 'actif' | 'inactif' | 'maintenance'
  demandesTotales: number
  demandesMois: number
  satisfactionMoyenne: number
}

interface Statistique {
  periode: string
  demandes: number
  validees: number
  rejetees: number
  enAttente: number
  delaiMoyen: number
  satisfaction: number
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false)
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [agents, setAgents] = useState<Agent[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [statistiques, setStatistiques] = useState<Statistique[]>([])

  // Simulation de données administrateur
  const admin = {
    nom: 'OGANDAGA',
    prenom: 'Daniel',
    organisme: 'DGDI - Direction Générale',
    role: 'Administrateur Principal',
    email: 'd.ogandaga@dgdi.ga'
  }

  // Données simulées
  useEffect(() => {
    const agentsSimules: Agent[] = [
      {
        id: '1',
        nom: 'AKOMO',
        prenom: 'Marie Claire',
        email: 'mc.akomo@dgdi.ga',
        telephone: '+241 06 11 22 33',
        matricule: 'AG-2024-001',
        statut: 'actif',
        role: 'Agent Senior',
        dateEmbauche: '2024-01-15',
        performance: {
          dossiersMois: 47,
          delaiMoyen: 3.2,
          satisfaction: 4.8
        }
      },
      {
        id: '2',
        nom: 'MBENG',
        prenom: 'Paul Henri',
        email: 'ph.mbeng@dgdi.ga',
        telephone: '+241 06 22 33 44',
        matricule: 'AG-2024-002',
        statut: 'actif',
        role: 'Agent',
        dateEmbauche: '2024-03-10',
        performance: {
          dossiersMois: 35,
          delaiMoyen: 4.1,
          satisfaction: 4.6
        }
      },
      {
        id: '3',
        nom: 'NZAMBA',
        prenom: 'Sophie',
        email: 's.nzamba@dgdi.ga',
        telephone: '+241 06 33 44 55',
        matricule: 'AG-2024-003',
        statut: 'en_conge',
        role: 'Agent Junior',
        dateEmbauche: '2024-06-01',
        performance: {
          dossiersMois: 28,
          delaiMoyen: 4.8,
          satisfaction: 4.4
        }
      }
    ]

    const servicesSimules: Service[] = [
      {
        id: '1',
        nom: 'Carte Nationale d\'Identité',
        description: 'Première demande et renouvellement de CNI',
        cout: 5000,
        dureeEstimee: 7,
        status: 'actif',
        demandesTotales: 2847,
        demandesMois: 234,
        satisfactionMoyenne: 4.8
      },
      {
        id: '2',
        nom: 'Passeport Biométrique',
        description: 'Demande et renouvellement de passeport',
        cout: 70000,
        dureeEstimee: 15,
        status: 'actif',
        demandesTotales: 1256,
        demandesMois: 89,
        satisfactionMoyenne: 4.6
      },
      {
        id: '3',
        nom: 'Visa de Sortie',
        description: 'Autorisation de sortie du territoire',
        cout: 15000,
        dureeEstimee: 5,
        status: 'maintenance',
        demandesTotales: 567,
        demandesMois: 12,
        satisfactionMoyenne: 4.3
      }
    ]

    const statistiquesSimulees: Statistique[] = [
      {
        periode: 'Janvier 2025',
        demandes: 335,
        validees: 298,
        rejetees: 15,
        enAttente: 22,
        delaiMoyen: 6.8,
        satisfaction: 4.7
      },
      {
        periode: 'Décembre 2024',
        demandes: 312,
        validees: 285,
        rejetees: 18,
        enAttente: 9,
        delaiMoyen: 7.2,
        satisfaction: 4.6
      }
    ]

    setAgents(agentsSimules)
    setServices(servicesSimules)
    setStatistiques(statistiquesSimulees)
  }, [])

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-800'
      case 'inactif': return 'bg-red-100 text-red-800'
      case 'en_conge': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case 'actif': return 'bg-green-100 text-green-800'
      case 'inactif': return 'bg-red-100 text-red-800'
      case 'maintenance': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const agentsActifs = agents.filter(a => a.statut === 'actif').length
  const servicesActifs = services.filter(s => s.status === 'actif').length
  const demandesTotales = statistiques[0]?.demandes || 0
  const satisfactionMoyenne = statistiques[0]?.satisfaction || 0

  const performanceMoyenne = agents.reduce((acc, agent) => acc + agent.performance.dossiersMois, 0) / agents.length
  const delaiMoyenGlobal = agents.reduce((acc, agent) => acc + agent.performance.delaiMoyen, 0) / agents.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Administration - {admin.prenom} {admin.nom}
              </h1>
              <p className="text-gray-600">{admin.organisme} • {admin.role}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                <Shield className="w-4 h-4 mr-1" />
                Administrateur
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configuration
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Agents actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{agentsActifs}</p>
                  <p className="text-xs text-gray-500">sur {agents.length} agents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Services actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{servicesActifs}</p>
                  <p className="text-xs text-gray-500">sur {services.length} services</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Demandes ce mois</p>
                  <p className="text-2xl font-bold text-gray-900">{demandesTotales}</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% vs mois dernier
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-900">{satisfactionMoyenne}/5</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +0.1 vs mois dernier
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets principaux */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="agents">Gestion des Agents</TabsTrigger>
            <TabsTrigger value="services">Gestion des Services</TabsTrigger>
            <TabsTrigger value="statistics">Statistiques</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance globale */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Globale</CardTitle>
                  <CardDescription>Indicateurs clés de performance du service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Dossiers traités/agent/mois</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{Math.round(performanceMoyenne)}</span>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        <Target className="w-3 h-3 mr-1" />
                        Objectif: 40
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Délai moyen de traitement</span>
                    <span className="font-semibold">{delaiMoyenGlobal.toFixed(1)} jours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Taux de validation</span>
                    <span className="font-semibold text-green-600">89%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Services disponibles</span>
                    <span className="font-semibold">{servicesActifs}/{services.length}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Alertes et notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Alertes & Notifications</CardTitle>
                  <CardDescription>Points d'attention importants</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Alert className="bg-orange-50 border-orange-200">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <AlertDescription className="text-orange-800 text-sm">
                      Service "Visa de Sortie" en maintenance depuis 2 jours
                    </AlertDescription>
                  </Alert>
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 text-sm">
                      22 dossiers en attente de traitement nécessitent une attention
                    </AlertDescription>
                  </Alert>
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-green-800 text-sm">
                      Objectifs mensuels atteints à 94%
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
                <CardDescription>Gérez votre service efficacement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <UserPlus className="w-6 h-6 mb-2" />
                    <span className="text-sm">Ajouter Agent</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Plus className="w-6 h-6 mb-2" />
                    <span className="text-sm">Nouveau Service</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Download className="w-6 h-6 mb-2" />
                    <span className="text-sm">Export Données</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <BarChart3 className="w-6 h-6 mb-2" />
                    <span className="text-sm">Rapports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des agents */}
          <TabsContent value="agents" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Gestion des Agents</h3>
                <p className="text-gray-600">Gérez votre équipe et suivez les performances</p>
              </div>
              <Button onClick={() => setIsAgentModalOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Ajouter un Agent
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div key={agent.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-900">
                              {agent.prenom} {agent.nom}
                            </h4>
                            <Badge className={getStatutColor(agent.statut)}>
                              {agent.statut.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {agent.role}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{agent.email}</p>
                          <p className="text-xs text-gray-500">
                            Matricule: {agent.matricule} • Embauché le {new Date(agent.dateEmbauche).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Dossiers/mois</p>
                              <p className="font-semibold">{agent.performance.dossiersMois}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Délai moyen</p>
                              <p className="font-semibold">{agent.performance.delaiMoyen}j</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Satisfaction</p>
                              <p className="font-semibold">{agent.performance.satisfaction}/5</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end space-x-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4 mr-1" />
                          Contacter
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des services */}
          <TabsContent value="services" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Gestion des Services</h3>
                <p className="text-gray-600">Configurez et gérez vos services administratifs</p>
              </div>
              <Button onClick={() => setIsServiceModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Service
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-900">{service.nom}</h4>
                            <Badge className={getServiceStatusColor(service.status)}>
                              {service.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{service.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Coût: {service.cout.toLocaleString()} FCFA</span>
                            <span>Délai: {service.dureeEstimee} jours</span>
                            <span>Satisfaction: {service.satisfactionMoyenne}/5</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Ce mois</p>
                              <p className="font-semibold">{service.demandesMois}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Total</p>
                              <p className="font-semibold">{service.demandesTotales}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Statistiques
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-1" />
                          Configuration
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistiques */}
          <TabsContent value="statistics" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Statistiques Détaillées</h3>
                <p className="text-gray-600">Analysez les performances de votre service</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Période
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {statistiques.map((stat, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{stat.periode}</CardTitle>
                    <CardDescription>Résumé des activités</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{stat.demandes}</p>
                        <p className="text-sm text-gray-600">Demandes reçues</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{stat.validees}</p>
                        <p className="text-sm text-gray-600">Validées</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">{stat.rejetees}</p>
                        <p className="text-sm text-gray-600">Rejetées</p>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">{stat.enAttente}</p>
                        <p className="text-sm text-gray-600">En attente</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Délai moyen</span>
                        <span className="font-semibold">{stat.delaiMoyen} jours</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Satisfaction</span>
                        <span className="font-semibold">{stat.satisfaction}/5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Nouvel Agent */}
      <Dialog open={isAgentModalOpen} onOpenChange={setIsAgentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un Nouvel Agent</DialogTitle>
            <DialogDescription>
              Créez un nouveau compte agent pour votre service
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Prénom</Label>
                <Input className="mt-1" placeholder="Prénom" />
              </div>
              <div>
                <Label>Nom</Label>
                <Input className="mt-1" placeholder="Nom" />
              </div>
            </div>
            <div>
              <Label>Email professionnel</Label>
              <Input className="mt-1" type="email" placeholder="prenom.nom@organisme.ga" />
            </div>
            <div>
              <Label>Téléphone</Label>
              <Input className="mt-1" placeholder="+241 XX XX XX XX" />
            </div>
            <div>
              <Label>Rôle</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="agent_senior">Agent Senior</SelectItem>
                  <SelectItem value="superviseur">Superviseur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAgentModalOpen(false)}>
              Annuler
            </Button>
            <Button>
              Créer l'Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Nouveau Service */}
      <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Créer un Nouveau Service</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau service administratif
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Nom du service</Label>
              <Input className="mt-1" placeholder="Ex: Carte d'identité" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea className="mt-1" placeholder="Description détaillée du service" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Coût (FCFA)</Label>
                <Input className="mt-1" type="number" placeholder="5000" />
              </div>
              <div>
                <Label>Durée estimée (jours)</Label>
                <Input className="mt-1" type="number" placeholder="7" />
              </div>
            </div>
            <div>
              <Label>Statut initial</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionnez le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsServiceModalOpen(false)}>
              Annuler
            </Button>
            <Button>
              Créer le Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
