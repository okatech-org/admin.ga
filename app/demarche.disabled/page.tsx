'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InterAppNavigation from '@/components/layout/inter-app-navigation';
import {
  Search,
  Filter,
  Globe,
  CreditCard,
  Users,
  Car,
  Heart,
  Home,
  Scale,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Receipt,
  Cross,
  Leaf,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle,
  Star,
  Phone,
  Mail,
  ExternalLink,
  Zap,
  Shield,
  Award,
  AlertTriangle,
  Loader2,
  User,
  BookOpen,
  FileText,
  Plus,
  X,
  Eye,
  Calendar,
  Download,
  Upload,
  Bell,
  Settings,
  LogOut,
  UserCheck,
  Archive,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { toast } from 'sonner';

// Types d'interface
interface Service {
  id: string;
  nom: string;
  description: string;
  icon: any;
  duree: string;
  prix: string;
  satisfaction: number;
  demandes: number;
  category: string;
  prerequis?: string[];
  pieces_requises?: string[];
  etapes?: string[];
}

interface Demande {
  id: string;
  serviceId: string;
  nom: string;
  status: 'en_cours' | 'en_attente' | 'completee' | 'rejetee';
  date_creation: Date;
  date_modification: Date;
  etape_actuelle: number;
  total_etapes: number;
  numero_dossier: string;
}

interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  avatar?: string;
  demandes: Demande[];
  favoris: string[];
}

type LoadingState = 'idle' | 'loading' | 'success' | 'error';
type NotificationType = 'info' | 'success' | 'warning' | 'error';

export default function DemarchePage() {
  const router = useRouter();

  // États principaux
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // États des modaux et UI
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id: number, type: NotificationType, message: string, timestamp: Date}>>([]);

  // États des formulaires
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [demandeForm, setDemandeForm] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: '',
    motif: '',
    fichiers: [] as File[]
  });

  // Données des services avec plus de détails
  const servicesPopulaires: Service[] = [
    {
      id: 'passeport',
      nom: 'Demande de Passeport',
      description: 'Obtenir ou renouveler votre passeport gabonais',
      icon: CreditCard,
      duree: '15 jours',
      prix: '25 000 FCFA',
      satisfaction: 4.8,
      demandes: 1250,
      category: 'identite',
      prerequis: ['Être de nationalité gabonaise', 'Avoir plus de 16 ans'],
      pieces_requises: ['CNI', 'Extrait de naissance', 'Photo d\'identité', 'Justificatif de domicile'],
      etapes: ['Dépôt de dossier', 'Vérification documents', 'Prise d\'empreintes', 'Production', 'Retrait']
    },
    {
      id: 'carte_identite',
      nom: 'Carte Nationale d\'Identité',
      description: 'Première demande ou renouvellement de CNI',
      icon: Users,
      duree: '7 jours',
      prix: '5 000 FCFA',
      satisfaction: 4.9,
      demandes: 2100,
      category: 'identite',
      prerequis: ['Être de nationalité gabonaise', 'Avoir plus de 16 ans'],
      pieces_requises: ['Extrait de naissance', 'Photo d\'identité', 'Justificatif de domicile'],
      etapes: ['Dépôt de dossier', 'Vérification documents', 'Production', 'Retrait']
    },
    {
      id: 'permis_conduire',
      nom: 'Permis de Conduire',
      description: 'Obtenir votre permis de conduire',
      icon: Car,
      duree: '21 jours',
      prix: '45 000 FCFA',
      satisfaction: 4.6,
      demandes: 890,
      category: 'transport',
      prerequis: ['Avoir plus de 18 ans', 'Certificat médical valide'],
      pieces_requises: ['CNI', 'Certificat médical', 'Photo d\'identité', 'Justificatif de domicile'],
      etapes: ['Formation théorique', 'Examen théorique', 'Formation pratique', 'Examen pratique', 'Retrait']
    },
    {
      id: 'extrait_naissance',
      nom: 'Extrait de Naissance',
      description: 'Obtenir un extrait d\'acte de naissance',
      icon: Heart,
      duree: '3 jours',
      prix: '1 000 FCFA',
      satisfaction: 4.9,
      demandes: 3200,
      category: 'etat_civil',
      prerequis: ['Être né au Gabon ou enfant de parents gabonais'],
      pieces_requises: ['Pièce d\'identité du demandeur', 'Justificatif de lien de parenté si nécessaire'],
      etapes: ['Dépôt de demande', 'Vérification', 'Production', 'Retrait']
    },
    {
      id: 'certificat_residence',
      nom: 'Certificat de Résidence',
      description: 'Justifier votre domicile au Gabon',
      icon: Home,
      duree: '5 jours',
      prix: '2 000 FCFA',
      satisfaction: 4.7,
      demandes: 1890,
      category: 'logement',
      prerequis: ['Résider effectivement à l\'adresse déclarée'],
      pieces_requises: ['CNI', 'Justificatif de domicile', 'Témoins'],
      etapes: ['Dépôt de demande', 'Enquête de voisinage', 'Validation', 'Retrait']
    },
    {
      id: 'casier_judiciaire',
      nom: 'Extrait de Casier Judiciaire',
      description: 'Bulletin n°3 du casier judiciaire',
      icon: Scale,
      duree: '7 jours',
      prix: '3 000 FCFA',
      satisfaction: 4.8,
      demandes: 1560,
      category: 'justice',
      prerequis: ['Demande personnelle uniquement'],
      pieces_requises: ['CNI', 'Justificatif de la demande'],
      etapes: ['Dépôt de demande', 'Vérification antécédents', 'Production', 'Retrait']
    }
  ];

  // Catégories avec actions
  const categories = [
    { id: 'tous', nom: 'Tous les Services', icon: Globe, count: 127, color: 'bg-blue-500' },
    { id: 'identite', nom: 'Documents d\'Identité', icon: CreditCard, count: 15, color: 'bg-green-500' },
    { id: 'etat_civil', nom: 'État Civil', icon: Users, count: 12, color: 'bg-purple-500' },
    { id: 'transport', nom: 'Transport & Véhicules', icon: Car, count: 8, color: 'bg-orange-500' },
    { id: 'social', nom: 'Protection Sociale', icon: Heart, count: 18, color: 'bg-pink-500' },
    { id: 'logement', nom: 'Logement & Habitat', icon: Home, count: 11, color: 'bg-indigo-500' },
    { id: 'justice', nom: 'Justice & Légal', icon: Scale, count: 9, color: 'bg-gray-600' },
    { id: 'emploi', nom: 'Emploi & Travail', icon: Briefcase, count: 14, color: 'bg-teal-500' },
    { id: 'education', nom: 'Éducation & Formation', icon: GraduationCap, count: 13, color: 'bg-yellow-500' },
    { id: 'economie', nom: 'Commerce & Économie', icon: TrendingUp, count: 16, color: 'bg-emerald-500' },
    { id: 'fiscal', nom: 'Fiscalité & Impôts', icon: Receipt, count: 7, color: 'bg-red-500' },
    { id: 'sante', nom: 'Santé & Médical', icon: Cross, count: 10, color: 'bg-rose-500' }
  ];

  // Actualités avec actions
  const actualites = [
    {
      id: 1,
      titre: 'Nouveauté : Demandes de passeport 100% en ligne',
      description: 'Plus besoin de se déplacer pour les renouvellements de passeport',
      date: '15 Jan 2025',
      type: 'Nouvelle fonctionnalité',
      urgent: false
    },
    {
      id: 2,
      titre: 'Maintenance programmée ce weekend',
      description: 'Services indisponibles samedi 18 janvier de 2h à 6h',
      date: '16 Jan 2025',
      type: 'Maintenance',
      urgent: true
    },
    {
      id: 3,
      titre: 'Réduction des délais pour les CNI',
      description: 'Nouveaux délais réduits à 5 jours ouvrés',
      date: '12 Jan 2025',
      type: 'Amélioration',
      urgent: false
    }
  ];

  const statistiquesGlobales = {
    totalDemarches: 127,
    demarchesMois: 15420,
    satisfactionMoyenne: 4.7,
    delaiMoyen: 8.5
  };

  // Simulation d'utilisateur connecté
  useEffect(() => {
    const savedUser = localStorage.getItem('demarche_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setCurrentUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  // Formatage de nombre
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Gestion des notifications
  const addNotification = useCallback((type: NotificationType, message: string) => {
    const newNotification = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);

    // Toast notification
    if (type === 'success') {
      toast.success(message);
    } else if (type === 'error') {
      toast.error(message);
    } else if (type === 'warning') {
      toast.warning(message);
    } else {
      toast.info(message);
    }

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  }, []);

  // Gestionnaire de connexion
  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      addNotification('error', 'Veuillez remplir tous les champs');
      return;
    }

    setLoadingState('loading');

    try {
      // Simulation d'API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Données utilisateur simulées
      const userData: User = {
        id: '1',
        nom: 'MVENG',
        prenom: 'Jean Pierre',
        email: loginForm.email,
        telephone: '+241 06 12 34 56',
        demandes: [],
        favoris: []
      };

      localStorage.setItem('demarche_user', JSON.stringify(userData));
      setCurrentUser(userData);
      setIsAuthenticated(true);
      setIsLoginModalOpen(false);
      setLoadingState('success');

      addNotification('success', `Bienvenue ${userData.prenom} ${userData.nom} !`);

    } catch (error) {
      setLoadingState('error');
      addNotification('error', 'Erreur de connexion. Veuillez réessayer.');
    }
  };

  // Gestionnaire de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('demarche_user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    addNotification('info', 'Vous avez été déconnecté');
  };

  // Gestionnaire de début de démarche
  const handleStartService = (service: Service) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      addNotification('warning', 'Veuillez vous connecter pour commencer cette démarche');
      return;
    }

    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  // Gestionnaire de soumission de démarche
  const handleSubmitDemande = async () => {
    if (!currentUser || !selectedService) return;

    setLoadingState('loading');

    try {
      // Validation des champs requis
      if (!demandeForm.nom || !demandeForm.prenom || !demandeForm.email) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // Simulation d'API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      const nouvelleDemande: Demande = {
        id: Date.now().toString(),
        serviceId: selectedService.id,
        nom: `${demandeForm.prenom} ${demandeForm.nom}`,
        status: 'en_cours',
        date_creation: new Date(),
        date_modification: new Date(),
        etape_actuelle: 1,
        total_etapes: selectedService.etapes?.length || 3,
        numero_dossier: `DEM${Date.now().toString().slice(-6)}`
      };

      // Mise à jour des données utilisateur
      const updatedUser = {
        ...currentUser,
        demandes: [...currentUser.demandes, nouvelleDemande]
      };

      setCurrentUser(updatedUser);
      localStorage.setItem('demarche_user', JSON.stringify(updatedUser));

      setLoadingState('success');
      setIsServiceModalOpen(false);

      addNotification('success', `Votre demande de ${selectedService.nom} a été créée avec succès ! Numéro de dossier: ${nouvelleDemande.numero_dossier}`);

      // Reset form
      setDemandeForm({ nom: '', prenom: '', telephone: '', email: '', adresse: '', motif: '', fichiers: [] });

    } catch (error) {
      setLoadingState('error');
      addNotification('error', error instanceof Error ? error.message : 'Erreur lors de la soumission');
    }
  };

  // Gestionnaire des favoris
  const handleToggleFavorite = (serviceId: string) => {
    if (!currentUser) {
      addNotification('warning', 'Connectez-vous pour gérer vos favoris');
      return;
    }

    const isFavorite = currentUser.favoris.includes(serviceId);
    const updatedFavoris = isFavorite
      ? currentUser.favoris.filter(id => id !== serviceId)
      : [...currentUser.favoris, serviceId];

    const updatedUser = { ...currentUser, favoris: updatedFavoris };
    setCurrentUser(updatedUser);
    localStorage.setItem('demarche_user', JSON.stringify(updatedUser));

    addNotification('success', isFavorite ? 'Service retiré des favoris' : 'Service ajouté aux favoris');
  };

  // Navigation vers les services
  const handleViewAllServices = () => {
    router.push('/demarche/services');
  };

  const handleViewService = (serviceId: string) => {
    router.push(`/demarche/service/${serviceId}`);
  };

  // Navigation vers les actualités
  const handleViewAllNews = () => {
    router.push('/demarche/actualites');
  };

  // Liens externes
  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Filtrage des services
  const filteredServices = servicesPopulaires.filter(service => {
    const matchesSearch = service.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'tous' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notif) => (
          <Alert key={notif.id} className={`w-80 ${
            notif.type === 'success' ? 'bg-green-50 border-green-200' :
            notif.type === 'error' ? 'bg-red-50 border-red-200' :
            notif.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
            'bg-blue-50 border-blue-200'
          }`}>
            <AlertDescription className={
              notif.type === 'success' ? 'text-green-800' :
              notif.type === 'error' ? 'text-red-800' :
              notif.type === 'warning' ? 'text-yellow-800' :
              'text-blue-800'
            }>
              {notif.message}
            </AlertDescription>
          </Alert>
        ))}
      </div>

      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">DEMARCHE.GA</h1>
                <p className="text-gray-600">Portail des démarches administratives du Gabon</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-4 h-4 mr-1" />
                Service Public Officiel
              </Badge>

              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    Bonjour, {currentUser?.prenom}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/demarche/profile')}
                    className="border-blue-600 text-blue-600"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Mon Profil
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Se Connecter
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-6">
              Vos démarches administratives simplifiées
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Effectuez vos démarches officielles en ligne, suivez vos dossiers en temps réel
              et gagnez du temps avec notre plateforme digitale sécurisée.
            </p>

            {/* Statistiques Hero */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-white">{statistiquesGlobales.totalDemarches}</div>
                <div className="text-blue-100 text-sm">Services disponibles</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-white">{formatNumber(statistiquesGlobales.demarchesMois)}</div>
                <div className="text-blue-100 text-sm">Démarches ce mois</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-white">{statistiquesGlobales.satisfactionMoyenne}/5</div>
                <div className="text-blue-100 text-sm">Satisfaction moyenne</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-white">{statistiquesGlobales.delaiMoyen} jours</div>
                <div className="text-blue-100 text-sm">Délai moyen</div>
              </div>
            </div>

            {/* Barre de recherche principale */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Rechercher une démarche (ex: passeport, carte d'identité...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border-0 shadow-xl bg-white"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <Filter className="w-4 h-4" />
                </Button>
              </div>

              {/* Filtres avancés */}
              {showAdvancedFilters && (
                <Card className="mt-4 p-4 bg-white/90 backdrop-blur-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div>
                      <Label className="text-sm font-medium">Délai maximum</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous délais" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-3">1-3 jours</SelectItem>
                          <SelectItem value="4-7">4-7 jours</SelectItem>
                          <SelectItem value="8-15">8-15 jours</SelectItem>
                          <SelectItem value="16+">Plus de 15 jours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Prix maximum</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous prix" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-5000">0 - 5 000 FCFA</SelectItem>
                          <SelectItem value="5001-15000">5 001 - 15 000 FCFA</SelectItem>
                          <SelectItem value="15001-30000">15 001 - 30 000 FCFA</SelectItem>
                          <SelectItem value="30001+">Plus de 30 000 FCFA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Note minimum</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Toutes notes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4.5">4.5+ ⭐⭐⭐⭐⭐</SelectItem>
                          <SelectItem value="4.0">4.0+ ⭐⭐⭐⭐</SelectItem>
                          <SelectItem value="3.5">3.5+ ⭐⭐⭐</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Actualités importantes */}
        {actualites.some(a => a.urgent) && (
          <Alert className="mb-8 bg-orange-50 border-orange-200">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Information importante :</strong> {actualites.find(a => a.urgent)?.description}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Catégories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <span>Catégories de Services</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left group hover:shadow-md ${
                        selectedCategory === category.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <category.icon className={`w-6 h-6 ${selectedCategory === category.id ? 'text-blue-600' : 'text-gray-500'}`} />
                        <Badge
                          variant="secondary"
                          className={`${category.color} text-white text-xs group-hover:scale-105 transition-transform`}
                        >
                          {category.count}
                        </Badge>
                      </div>
                      <h3 className={`font-medium text-sm ${selectedCategory === category.id ? 'text-blue-900' : 'text-gray-700'}`}>
                        {category.nom}
                      </h3>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Services populaires */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span>Services Populaires</span>
                    {filteredServices.length < servicesPopulaires.length && (
                      <Badge variant="outline">
                        {filteredServices.length} sur {servicesPopulaires.length}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewAllServices}
                  >
                    Voir tous les services
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className="p-6 border rounded-lg hover:shadow-lg transition-shadow duration-200 group cursor-pointer bg-gradient-to-br from-white to-gray-50 relative"
                    >
                      {/* Bouton favori */}
                      {isAuthenticated && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(service.id);
                          }}
                          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          {currentUser?.favoris.includes(service.id) ? (
                            <BookmarkCheck className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Bookmark className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      )}

                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <service.icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {service.nom}
                            </h3>
                            <div className="flex items-center space-x-1 mt-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{service.satisfaction}</span>
                              <span className="text-xs text-gray-400">({service.demandes} demandes)</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {service.duree}
                        </Badge>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">{service.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold text-green-600">
                          {service.prix}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewService(service.id);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Détails
                          </Button>
                          <Button
                            size="sm"
                            className="group-hover:bg-blue-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartService(service);
                            }}
                          >
                            Commencer
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredServices.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun service trouvé pour votre recherche.</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('tous');
                      }}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Avantages */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <Zap className="w-5 h-5" />
                  <span>Pourquoi choisir DEMARCHE.GA ?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">100% Sécurisé</h3>
                    <p className="text-sm text-gray-600">Vos données sont protégées avec le plus haut niveau de sécurité</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Gain de Temps</h3>
                    <p className="text-sm text-gray-600">Fini les files d'attente, effectuez vos démarches 24h/24</p>
                  </div>
                  <div className="text-center">
                    <Award className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Service Officiel</h3>
                    <p className="text-sm text-gray-600">Plateforme officielle du gouvernement gabonais</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mes démarches en cours (si connecté) */}
            {isAuthenticated && currentUser && currentUser.demandes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">MES DÉMARCHES EN COURS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentUser.demandes.slice(0, 3).map((demande) => (
                    <div key={demande.id} className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">#{demande.numero_dossier}</span>
                        <Badge variant={demande.status === 'en_cours' ? 'default' : 'secondary'}>
                          {demande.status === 'en_cours' ? 'En cours' :
                           demande.status === 'completee' ? 'Terminée' :
                           demande.status === 'en_attente' ? 'En attente' : 'Rejetée'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{demande.nom}</p>
                      <Progress
                        value={(demande.etape_actuelle / demande.total_etapes) * 100}
                        className="h-2"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Étape {demande.etape_actuelle} sur {demande.total_etapes}
                      </p>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    Voir toutes mes démarches
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Contact et Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">SUPPORT & CONTACT</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium text-sm">+241 01 XX XX XX</div>
                    <div className="text-xs text-gray-500">Lun-Ven 8h-17h</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium text-sm">support@demarche.ga</div>
                    <div className="text-xs text-gray-500">Réponse sous 24h</div>
                  </div>
                </div>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleExternalLink('https://aide.demarche.ga')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Centre d'aide
                </Button>
              </CardContent>
            </Card>

            {/* Actualités */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">ACTUALITÉS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {actualites.slice(0, 3).map((actu) => (
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
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleViewAllNews}
                >
                  Toutes les actualités
                </Button>
              </CardContent>
            </Card>

            {/* Liens utiles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">LIENS UTILES</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleExternalLink('https://gouvernement.ga')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Gouvernement du Gabon
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleExternalLink('https://ministeres.ga')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ministères
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleExternalLink('https://prefectures.ga')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Préfectures
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleExternalLink('https://mairies.ga')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Mairies
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modaux */}
      {/* Modal de connexion */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connexion à DEMARCHE.GA</DialogTitle>
            <DialogDescription>
              Connectez-vous pour accéder à vos démarches et suivre vos dossiers.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre.email@exemple.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Votre mot de passe"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter className="flex-col space-y-2">
            <Button
              onClick={handleLogin}
              disabled={loadingState === 'loading'}
              className="w-full"
            >
              {loadingState === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
            <div className="text-center text-sm text-gray-600">
              <p>Vous n'avez pas de compte ? </p>
              <Button variant="link" className="p-0">
                Créer un compte
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de démarche de service */}
      <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedService && <selectedService.icon className="w-5 h-5" />}
              <span>Nouvelle demande : {selectedService?.nom}</span>
            </DialogTitle>
            <DialogDescription>
              Remplissez le formulaire ci-dessous pour commencer votre démarche.
            </DialogDescription>
          </DialogHeader>

          {selectedService && (
            <Tabs defaultValue="info" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Informations</TabsTrigger>
                <TabsTrigger value="prerequis">Prérequis</TabsTrigger>
                <TabsTrigger value="formulaire">Formulaire</TabsTrigger>
              </TabsList>

              {/* Informations du service */}
              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Durée estimée</Label>
                    <p className="text-lg font-semibold">{selectedService.duree}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Coût</Label>
                    <p className="text-lg font-semibold text-green-600">{selectedService.prix}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Étapes du processus</Label>
                  <div className="mt-2 space-y-2">
                    {selectedService.etapes?.map((etape, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                          {index + 1}
                        </div>
                        <span className="text-sm">{etape}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Prérequis */}
              <TabsContent value="prerequis" className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Conditions requises</Label>
                  <ul className="mt-2 space-y-1">
                    {selectedService.prerequis?.map((prerequis, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{prerequis}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Pièces à fournir</Label>
                  <ul className="mt-2 space-y-1">
                    {selectedService.pieces_requises?.map((piece, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">{piece}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              {/* Formulaire */}
              <TabsContent value="formulaire" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prenom">Prénom *</Label>
                    <Input
                      id="prenom"
                      value={demandeForm.prenom}
                      onChange={(e) => setDemandeForm(prev => ({ ...prev, prenom: e.target.value }))}
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nom">Nom *</Label>
                    <Input
                      id="nom"
                      value={demandeForm.nom}
                      onChange={(e) => setDemandeForm(prev => ({ ...prev, nom: e.target.value }))}
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={demandeForm.email}
                      onChange={(e) => setDemandeForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                      id="telephone"
                      value={demandeForm.telephone}
                      onChange={(e) => setDemandeForm(prev => ({ ...prev, telephone: e.target.value }))}
                      placeholder="+241 XX XX XX XX"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="adresse">Adresse complète</Label>
                  <Textarea
                    id="adresse"
                    value={demandeForm.adresse}
                    onChange={(e) => setDemandeForm(prev => ({ ...prev, adresse: e.target.value }))}
                    placeholder="Votre adresse complète"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="motif">Motif de la demande</Label>
                  <Textarea
                    id="motif"
                    value={demandeForm.motif}
                    onChange={(e) => setDemandeForm(prev => ({ ...prev, motif: e.target.value }))}
                    placeholder="Précisez le motif de votre demande"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Pièces justificatives</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Glissez-déposez vos fichiers ici ou <Button variant="link" className="p-0">parcourez</Button>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Formats acceptés: PDF, JPG, PNG (max. 5MB par fichier)
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsServiceModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmitDemande}
              disabled={loadingState === 'loading' || !demandeForm.nom || !demandeForm.prenom || !demandeForm.email}
            >
              {loadingState === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                'Soumettre la demande'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Navigation inter-applications */}
      <InterAppNavigation currentApp="demarche" />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold">DEMARCHE.GA</span>
              </div>
              <p className="text-gray-400 text-sm">
                Plateforme officielle des démarches administratives de la République Gabonaise.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setSelectedCategory('identite')}>Documents d'identité</button></li>
                <li><button onClick={() => setSelectedCategory('etat_civil')}>État civil</button></li>
                <li><button onClick={() => setSelectedCategory('transport')}>Transport</button></li>
                <li><button onClick={() => setSelectedCategory('justice')}>Justice</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => handleExternalLink('https://aide.demarche.ga')}>Centre d'aide</button></li>
                <li><button onClick={() => handleExternalLink('https://faq.demarche.ga')}>FAQ</button></li>
                <li><button onClick={() => handleExternalLink('mailto:support@demarche.ga')}>Contact</button></li>
                <li><button onClick={() => handleExternalLink('https://tutoriels.demarche.ga')}>Tutoriels</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => handleExternalLink('https://demarche.ga/mentions-legales')}>Mentions légales</button></li>
                <li><button onClick={() => handleExternalLink('https://demarche.ga/confidentialite')}>Politique de confidentialité</button></li>
                <li><button onClick={() => handleExternalLink('https://demarche.ga/cgu')}>CGU</button></li>
                <li><button onClick={() => handleExternalLink('https://demarche.ga/accessibilite')}>Accessibilité</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2025 République Gabonaise - Tous droits réservés • Version 2.1.0
          </div>
        </div>
      </footer>
    </div>
  );
}
