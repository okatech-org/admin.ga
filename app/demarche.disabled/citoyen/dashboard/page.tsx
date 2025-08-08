'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Download,
  Bell,
  User,
  Shield,
  Calendar,
  MessageCircle,
  Star,
  TrendingUp,
  Archive,
  Search,
  Filter
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface Demarche {
  id: string
  numero: string
  service: string
  status: 'en_cours' | 'en_attente' | 'completee' | 'rejetee'
  progression: number
  dateCreation: string
  dateModification: string
  delaiEstime: string
  organisme: string
  priorite: 'normale' | 'urgente' | 'haute'
}

interface Notification {
  id: string
  titre: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  date: string
  lu: boolean
}

export default function CitoyenDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [demarches, setDemarches] = useState<Demarche[]>([])

  // Simulation de données utilisateur
  const utilisateur = {
    prenom: 'Jean Pierre',
    nom: 'MVENG',
    email: 'jp.mveng@exemple.com',
    telephone: '+241 06 12 34 56',
    avatar: null,
    dateInscription: '2024-01-15',
    dernierLogin: '2025-01-16'
  }

  // Données simulées
  useEffect(() => {
    const demarchesSimulees: Demarche[] = [
      {
        id: '1',
        numero: 'DEM-2025-001234',
        service: 'Carte Nationale d\'Identité',
        status: 'en_cours',
        progression: 75,
        dateCreation: '2025-01-10',
        dateModification: '2025-01-15',
        delaiEstime: '7 jours',
        organisme: 'DGDI',
        priorite: 'normale'
      },
      {
        id: '2',
        numero: 'DEM-2025-001189',
        service: 'Extrait de Naissance',
        status: 'completee',
        progression: 100,
        dateCreation: '2025-01-05',
        dateModification: '2025-01-08',
        delaiEstime: '3 jours',
        organisme: 'Mairie de Libreville',
        priorite: 'normale'
      },
      {
        id: '3',
        numero: 'DEM-2025-001156',
        service: 'Passeport Biométrique',
        status: 'en_attente',
        progression: 25,
        dateCreation: '2025-01-12',
        dateModification: '2025-01-14',
        delaiEstime: '15 jours',
        organisme: 'DGDI',
        priorite: 'urgente'
      }
    ]

    const notificationsSimulees: Notification[] = [
      {
        id: '1',
        titre: 'Votre CNI est prête !',
        message: 'Votre carte nationale d\'identité est disponible pour retrait.',
        type: 'success',
        date: '2025-01-16',
        lu: false
      },
      {
        id: '2',
        titre: 'Documents manquants',
        message: 'Il manque une photo d\'identité pour votre demande de passeport.',
        type: 'warning',
        date: '2025-01-15',
        lu: false
      },
      {
        id: '3',
        titre: 'Nouvelle fonctionnalité',
        message: 'Vous pouvez maintenant suivre vos démarches par SMS.',
        type: 'info',
        date: '2025-01-14',
        lu: true
      }
    ]

    setDemarches(demarchesSimulees)
    setNotifications(notificationsSimulees)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_cours': return 'bg-blue-100 text-blue-800'
      case 'en_attente': return 'bg-yellow-100 text-yellow-800'
      case 'completee': return 'bg-green-100 text-green-800'
      case 'rejetee': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'en_cours': return 'En cours'
      case 'en_attente': return 'En attente'
      case 'completee': return 'Terminée'
      case 'rejetee': return 'Rejetée'
      default: return status
    }
  }

  const getPriorityIcon = (priorite: string) => {
    switch (priorite) {
      case 'urgente': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'haute': return <TrendingUp className="w-4 h-4 text-orange-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const notificationsNonLues = notifications.filter(n => !n.lu).length
  const demarchesEnCours = demarches.filter(d => d.status === 'en_cours').length
  const demarchesTerminees = demarches.filter(d => d.status === 'completee').length

  const filteredDemarches = demarches.filter(demarche => {
    const matchesSearch = demarche.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demarche.numero.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || demarche.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bonjour, {utilisateur.prenom} !
              </h1>
              <p className="text-gray-600">Gérez vos démarches administratives en toute simplicité</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                {notificationsNonLues > 0 && (
                  <Badge className="ml-2 bg-red-500">{notificationsNonLues}</Badge>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Mon Profil
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Alertes importantes */}
        {notifications.some(n => !n.lu && n.type === 'warning') && (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Vous avez des notifications importantes non lues.
              <Button variant="link" className="p-0 ml-1 text-yellow-800 underline">
                Voir les détails
              </Button>
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
                  <p className="text-sm font-medium text-gray-600">Démarches actives</p>
                  <p className="text-2xl font-bold text-gray-900">{demarchesEnCours}</p>
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
                  <p className="text-sm font-medium text-gray-600">Terminées</p>
                  <p className="text-2xl font-bold text-gray-900">{demarchesTerminees}</p>
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
                  <p className="text-sm font-medium text-gray-600">Temps moyen</p>
                  <p className="text-2xl font-bold text-gray-900">8j</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-900">4.8/5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
                <CardDescription>
                  Commencez une nouvelle démarche ou gérez vos documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/demarche/nouvelle">
                    <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                      <Plus className="w-5 h-5 mb-1" />
                      <span className="text-xs">Nouvelle démarche</span>
                    </Button>
                  </Link>
                  <Link href="/demarche/citoyen/documents">
                    <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                      <Archive className="w-5 h-5 mb-1" />
                      <span className="text-xs">Mes documents</span>
                    </Button>
                  </Link>
                  <Link href="/demarche/services">
                    <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                      <Search className="w-5 h-5 mb-1" />
                      <span className="text-xs">Parcourir services</span>
                    </Button>
                  </Link>
                  <Link href="/demarche/citoyen/historique">
                    <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
                      <Calendar className="w-5 h-5 mb-1" />
                      <span className="text-xs">Historique</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Mes démarches */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Mes Démarches</CardTitle>
                    <CardDescription>
                      Suivez l'avancement de vos démarches en cours
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Recherche et filtres */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Rechercher une démarche..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Tabs value={filterStatus} onValueChange={setFilterStatus}>
                    <TabsList>
                      <TabsTrigger value="all">Toutes</TabsTrigger>
                      <TabsTrigger value="en_cours">En cours</TabsTrigger>
                      <TabsTrigger value="completee">Terminées</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Liste des démarches */}
                <div className="space-y-4">
                  {filteredDemarches.map((demarche) => (
                    <div
                      key={demarche.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900">{demarche.service}</h3>
                            {getPriorityIcon(demarche.priorite)}
                          </div>
                          <p className="text-sm text-gray-600">#{demarche.numero}</p>
                          <p className="text-xs text-gray-500">
                            {demarche.organisme} • Créée le {new Date(demarche.dateCreation).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(demarche.status)}>
                            {getStatusText(demarche.status)}
                          </Badge>
                        </div>
                      </div>

                      {demarche.status !== 'completee' && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Progression</span>
                            <span className="text-sm font-medium text-gray-900">{demarche.progression}%</span>
                          </div>
                          <Progress value={demarche.progression} className="h-2" />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Délai estimé: {demarche.delaiEstime}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Détails
                          </Button>
                          {demarche.status === 'completee' && (
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              Télécharger
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredDemarches.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucune démarche trouvée</p>
                      <Button className="mt-4" asChild>
                        <Link href="/demarche/nouvelle">
                          <Plus className="w-4 h-4 mr-2" />
                          Commencer une démarche
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications récentes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.slice(0, 3).map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg border ${!notif.lu ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900">{notif.titre}</h4>
                        <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notif.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      {!notif.lu && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      )}
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  Voir toutes les notifications
                </Button>
              </CardContent>
            </Card>

            {/* Conseils et aide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conseils & Aide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <h4 className="font-medium text-sm text-green-900">Sécurité</h4>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    Vérifiez toujours que vous êtes sur le bon site officiel
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium text-sm text-blue-900">Support</h4>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">
                    Notre équipe répond sous 24h à vos questions
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Centre d'aide
                </Button>
              </CardContent>
            </Card>

            {/* Raccourcis utiles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Liens Utiles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/demarche/faq">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    FAQ
                  </Button>
                </Link>
                <Link href="/demarche/guide">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Guide d'utilisation
                  </Button>
                </Link>
                <Link href="/demarche/contact">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Nous contacter
                  </Button>
                </Link>
                <Link href="/demarche/horaires">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Horaires des services
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
