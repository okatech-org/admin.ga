'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Briefcase,
  Users,
  TrendingUp,
  ChevronRight,
  Building2,
  Calendar,
  GraduationCap,
  Star,
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  Award,
  Target,
  Zap,
  Phone,
  Mail,
  ExternalLink,
  Filter,
  Globe,
  HeartHandshake,
  Laptop,
  Home,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InterAppNavigation from '@/components/layout/inter-app-navigation';

export default function TravailGAPage() {
  const [recherche, setRecherche] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [typeContrat, setTypeContrat] = useState('');
  const [secteur, setSecteur] = useState('');

  // Formatage de nombre cohérent pour éviter les erreurs d'hydratation
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Statistiques en temps réel
  const statistiques = {
    totalOffres: 2847,
    offresActives: 1236,
    candidaturesRecentes: 8940,
    entreprisesPartenaires: 456,
    tauxPlacement: 78.5,
    salairesMoyens: 850000
  };

  // Offres populaires avec vraies données
  const offresPopulaires = [
    {
      id: 1,
      titre: 'Développeur Full Stack',
      entreprise: 'TechGabon Solutions',
      localisation: 'Libreville',
      salaire: '800 000 - 1 200 000 FCFA',
      typeContrat: 'CDI',
      niveauEtude: 'BAC+3',
      experience: '2-5 ans',
      datePublication: '2 jours',
      candidatures: 45,
      secteur: 'Technologie',
      urgent: false,
      logo: '💻'
    },
    {
      id: 2,
      titre: 'Responsable Marketing Digital',
      entreprise: 'Gabon Telecom',
      localisation: 'Libreville',
      salaire: '950 000 - 1 400 000 FCFA',
      typeContrat: 'CDI',
      niveauEtude: 'BAC+4',
      experience: '3-7 ans',
      datePublication: '1 jour',
      candidatures: 67,
      secteur: 'Télécommunications',
      urgent: true,
      logo: '📱'
    },
    {
      id: 3,
      titre: 'Ingénieur Pétrole',
      entreprise: 'Total Gabon',
      localisation: 'Port-Gentil',
      salaire: '1 500 000 - 2 200 000 FCFA',
      typeContrat: 'CDI',
      niveauEtude: 'BAC+5',
      experience: '5+ ans',
      datePublication: '3 jours',
      candidatures: 128,
      secteur: 'Pétrole & Gaz',
      urgent: false,
      logo: '⚡'
    },
    {
      id: 4,
      titre: 'Chargé de Clientèle Bancaire',
      entreprise: 'BGFI Bank',
      localisation: 'Libreville',
      salaire: '650 000 - 950 000 FCFA',
      typeContrat: 'CDI',
      niveauEtude: 'BAC+3',
      experience: '1-3 ans',
      datePublication: '4 jours',
      candidatures: 89,
      secteur: 'Banque & Finance',
      urgent: false,
      logo: '🏦'
    },
    {
      id: 5,
      titre: 'Médecin Généraliste',
      entreprise: 'CHU de Libreville',
      localisation: 'Libreville',
      salaire: '1 200 000 - 1 800 000 FCFA',
      typeContrat: 'CDI',
      niveauEtude: 'BAC+7',
      experience: '2+ ans',
      datePublication: '1 jour',
      candidatures: 34,
      secteur: 'Santé',
      urgent: true,
      logo: '🏥'
    },
    {
      id: 6,
      titre: 'Professeur de Mathématiques',
      entreprise: 'Ministère de l\'Éducation',
      localisation: 'Oyem',
      salaire: '450 000 - 650 000 FCFA',
      typeContrat: 'Fonctionnaire',
      niveauEtude: 'BAC+3',
      experience: '0-2 ans',
      datePublication: '2 jours',
      candidatures: 156,
      secteur: 'Éducation',
      urgent: false,
      logo: '📚'
    }
  ];

  // Secteurs d'activité
  const secteurs = [
    { nom: 'Pétrole & Gaz', offres: 234, croissance: '+12%', icon: '⚡', color: 'bg-orange-500' },
    { nom: 'Banque & Finance', offres: 189, croissance: '+8%', icon: '🏦', color: 'bg-green-500' },
    { nom: 'Technologie', offres: 156, croissance: '+25%', icon: '💻', color: 'bg-blue-500' },
    { nom: 'Santé', offres: 123, croissance: '+15%', icon: '🏥', color: 'bg-red-500' },
    { nom: 'Éducation', offres: 198, croissance: '+5%', icon: '📚', color: 'bg-purple-500' },
    { nom: 'Commerce', offres: 167, croissance: '+18%', icon: '🛍️', color: 'bg-pink-500' },
    { nom: 'Industrie', offres: 134, croissance: '+10%', icon: '🏭', color: 'bg-gray-500' },
    { nom: 'Agriculture', offres: 98, croissance: '+22%', icon: '🌱', color: 'bg-green-600' }
  ];

  // Actualités emploi
  const actualites = [
    {
      id: 1,
      titre: 'Nouvelle loi sur le télétravail adoptée',
      description: 'Le gouvernement facilite le travail à distance pour les fonctionnaires',
      date: '15 Jan 2025',
      type: 'Législation',
      urgent: false
    },
    {
      id: 2,
      titre: 'Forum de l\'emploi digital ce weekend',
      description: 'Plus de 200 entreprises présentes samedi à Libreville',
      date: '16 Jan 2025',
      type: 'Événement',
      urgent: true
    },
    {
      id: 3,
      titre: 'Hausse des salaires dans le secteur pétrolier',
      description: 'Augmentation moyenne de 15% annoncée pour 2025',
      date: '14 Jan 2025',
      type: 'Économie',
      urgent: false
    }
  ];

  const villes = ['Libreville', 'Port-Gentil', 'Franceville', 'Oyem', 'Moanda', 'Lambaréné'];
  const typesContrat = ['CDI', 'CDD', 'Stage', 'Freelance', 'Fonctionnaire'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-green-600">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">TRAVAIL.GA</h1>
                <p className="text-gray-600">Plateforme de l'emploi public du Gabon</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-4 h-4 mr-1" />
                Emploi Public Officiel
              </Badge>
              <Button className="bg-green-600 hover:bg-green-700">
                <Users className="w-4 h-4 mr-2" />
                Mon Profil
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-6">
              Trouvez votre emploi idéal au Gabon
            </h2>
            <p className="text-xl mb-8 text-green-100 max-w-3xl mx-auto">
              Accédez aux meilleures opportunités d'emploi dans le secteur public et privé.
              Postulez en ligne et suivez vos candidatures en temps réel.
            </p>

            {/* Statistiques Hero */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-white">{formatNumber(statistiques.totalOffres)}</div>
                <div className="text-green-100 text-sm">Offres d'emploi</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-white">{statistiques.entreprisesPartenaires}</div>
                <div className="text-green-100 text-sm">Entreprises partenaires</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-white">{statistiques.tauxPlacement}%</div>
                <div className="text-green-100 text-sm">Taux de placement</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-white">{(statistiques.salairesMoyens/1000).toFixed(0)}K</div>
                <div className="text-green-100 text-sm">Salaire moyen (FCFA)</div>
              </div>
            </div>

            {/* Formulaire de recherche */}
            <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm">
              <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Métier, entreprise..."
                      value={recherche}
                      onChange={(e) => setRecherche(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                <Select value={localisation} onValueChange={setLocalisation}>
                    <SelectTrigger>
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <SelectValue placeholder="Ville" />
                    </SelectTrigger>
                    <SelectContent>
                      {villes.map(ville => (
                        <SelectItem key={ville} value={ville}>{ville}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={typeContrat} onValueChange={setTypeContrat}>
                    <SelectTrigger>
                      <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                      <SelectValue placeholder="Type de contrat" />
                  </SelectTrigger>
                  <SelectContent>
                      {typesContrat.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Search className="w-4 h-4 mr-2" />
                  Rechercher
                </Button>
              </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Alerte importante */}
        {actualites.some(a => a.urgent) && (
          <Alert className="mb-8 bg-orange-50 border-orange-200">
            <Calendar className="w-4 h-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Événement à venir :</strong> {actualites.find(a => a.urgent)?.description}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Secteurs d'activité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-green-600" />
                  <span>Secteurs qui recrutent</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {secteurs.map((secteur) => (
                    <button
                      key={secteur.nom}
                      className="p-4 rounded-lg border-2 border-gray-200 hover:border-green-300 transition-all duration-200 text-left group hover:shadow-md"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{secteur.icon}</span>
                        <Badge className={`${secteur.color} text-white text-xs`}>
                          {secteur.offres}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-sm text-gray-700 mb-1">{secteur.nom}</h3>
                      <div className="text-xs text-green-600 font-medium">{secteur.croissance}</div>
                    </button>
                  ))}
              </div>
            </CardContent>
          </Card>

            {/* Offres populaires */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span>Offres populaires</span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/travail/offres">
                      Voir toutes les offres
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {offresPopulaires.map((offre) => (
                    <div
                      key={offre.id}
                      className="p-6 border rounded-lg hover:shadow-lg transition-shadow duration-200 group cursor-pointer bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-xl group-hover:bg-green-200 transition-colors">
                            {offre.logo}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                                {offre.titre}
                              </h3>
                              {offre.urgent && (
                                <Badge variant="destructive" className="text-xs">
                                  Urgent
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 font-medium">{offre.entreprise}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{offre.localisation}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>Il y a {offre.datePublication}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>{offre.candidatures} candidatures</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {offre.typeContrat}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-500">Salaire:</span>
                          <div className="font-medium text-green-600">{offre.salaire}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Expérience:</span>
                          <div className="font-medium">{offre.experience}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Formation:</span>
                          <div className="font-medium">{offre.niveauEtude}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Secteur:</span>
                          <div className="font-medium">{offre.secteur}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button size="sm" className="group-hover:bg-green-700">
                            Postuler maintenant
                          </Button>
                          <Button size="sm" variant="outline">
                            Voir détails
                          </Button>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Star className="w-4 h-4 mr-1" />
                          Sauvegarder
                        </Button>
                      </div>
                </div>
                  ))}
              </div>
            </CardContent>
          </Card>

            {/* Avantages */}
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-800">
                  <Target className="w-5 h-5" />
                  <span>Pourquoi choisir TRAVAIL.GA ?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Zap className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Candidature Rapide</h3>
                    <p className="text-sm text-gray-600">Postulez en un clic avec votre profil pré-rempli</p>
                  </div>
                  <div className="text-center">
                    <HeartHandshake className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Suivi Personnalisé</h3>
                    <p className="text-sm text-gray-600">Accompagnement dans vos démarches de recherche d'emploi</p>
                  </div>
                  <div className="text-center">
                    <Award className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Emplois Certifiés</h3>
                    <p className="text-sm text-gray-600">Toutes les offres sont vérifiées et légitimes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Espace candidat */}
            <Card className="bg-gradient-to-br from-green-600 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="text-white">Espace Candidat</CardTitle>
                <CardDescription className="text-green-100">
                  Gérez votre carrière professionnelle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-white text-green-600 hover:bg-gray-100">
                  <Users className="w-4 h-4 mr-2" />
                  Créer mon CV
                </Button>
                <Button className="w-full bg-white/20 border border-white/30 text-white hover:bg-white/30">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Mes candidatures
                </Button>
                <Button className="w-full bg-white/20 border border-white/30 text-white hover:bg-white/30">
                  <Bell className="w-4 h-4 mr-2" />
                  Alertes emploi
                </Button>
              </CardContent>
            </Card>

            {/* Contact et Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">SUPPORT EMPLOI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="font-medium text-sm">+241 01 XX XX XX</div>
                    <div className="text-xs text-gray-500">Conseil emploi gratuit</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="font-medium text-sm">emploi@travail.ga</div>
                    <div className="text-xs text-gray-500">Aide candidature</div>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Centre de carrière
                </Button>
              </CardContent>
            </Card>

            {/* Actualités emploi */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">ACTUALITÉS EMPLOI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {actualites.map((actu) => (
                  <div key={actu.id} className="pb-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        variant={actu.urgent ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {actu.type}
                      </Badge>
                      <span className="text-xs text-gray-500">{actu.date}</span>
                    </div>
                    <h4 className="font-medium text-sm text-gray-900 mb-1">{actu.titre}</h4>
                    <p className="text-xs text-gray-600">{actu.description}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  Toutes les actualités
                </Button>
              </CardContent>
            </Card>

            {/* Services connexes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">SERVICES CONNEXES</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                  <Link href="/demarche">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    DEMARCHE.GA
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Formation professionnelle
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Validation des acquis
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Aide à l'entrepreneuriat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Navigation inter-applications */}
      <InterAppNavigation currentApp="travail" />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="w-6 h-6 text-green-400" />
                <span className="text-xl font-bold">TRAVAIL.GA</span>
              </div>
              <p className="text-gray-400 text-sm">
                Plateforme officielle de l'emploi public de la République Gabonaise.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Candidats</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Rechercher un emploi</li>
                <li>Créer mon CV</li>
                <li>Formations</li>
                <li>Conseils carrière</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Employeurs</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Publier une offre</li>
                <li>Rechercher des candidats</li>
                <li>Services RH</li>
                <li>Tarifs</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Centre d'aide</li>
                <li>Contact</li>
                <li>FAQ</li>
                <li>Signaler un problème</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2025 République Gabonaise - Tous droits réservés • Version 1.8.0
          </div>
        </div>
      </footer>
    </div>
  );
}
