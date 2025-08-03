'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
  Users,
  Clock,
  UserCheck,
  Search,
  Filter,
  Download,
  RefreshCw,
  Loader2,
  User,
  MapPin,
  Calendar,
  Star,
  AlertCircle,
  CheckCircle,
  Building,
  Briefcase,
  GraduationCap,
  Phone,
  Mail,
  FileText,
  UserPlus,
  Settings,
  ArrowRight,
  BarChart3,
  TrendingUp,
  Activity,
  Award,
  Shield,
  Target,
  Plus,
  Edit,
  Eye,
  History,
  Share2
} from 'lucide-react';

interface FonctionnaireEnAttente {
  id: string;
  matricule: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  lieuNaissance: string;
  diplomes: {
    niveau: string;
    intitule: string;
    etablissement: string;
    annee: number;
  }[];
  experiencePrecedente?: {
    poste: string;
    organisme: string;
    duree: string;
    description: string;
  }[];
  statut: 'EN_ATTENTE' | 'AFFECTE' | 'DETACHE' | 'SUSPENDU';
  dateInscription: string;
  prioriteAffectation: 'HAUTE' | 'MOYENNE' | 'BASSE';
  preferences: {
    organismes: string[];
    regions: string[];
    typePoste: string[];
  };
  rattachementPrimaire?: {
    organisme: string;
    service: string;
    poste: string;
    dateDebut: string;
  };
  rattachementSecondaire?: {
    organisme: string;
    service: string;
    poste: string;
    dateDebut: string;
    pourcentageTemps: number;
  };
  historique: {
    action: string;
    date: string;
    organisme?: string;
    motif: string;
    responsable: string;
  }[];
  evaluation?: {
    note: number;
    commentaires: string;
    evaluateur: string;
    date: string;
  };
}

interface FonctionnairesStats {
  total: number;
  enAttente: number;
  affectes: number;
  detaches: number;
  suspendus: number;
  prioriteHaute: number;
  prioriteMoyenne: number;
  prioriteBasse: number;
  avecDoubleRattachement: number;
}

interface LoadingStates {
  loading: boolean;
  refreshing: boolean;
  affecting: string | null;
  updating: string | null;
  exporting: boolean;
}

interface AffectationForm {
  organismeDestination: string;
  service: string;
  poste: string;
  typeAffectation: 'PRIMAIRE' | 'SECONDAIRE' | 'MUTATION' | 'DETACHEMENT';
  dateDebut: string;
  pourcentageTemps: number;
  motif: string;
  observations: string;
}

export default function FonctionnairesAttentePage() {
  // États de base
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatut, setSelectedStatut] = useState<string>('all');
  const [selectedPriorite, setSelectedPriorite] = useState<string>('all');
  const [selectedOrganisme, setSelectedOrganisme] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(20);

  // États des données
  const [fonctionnaires, setFonctionnaires] = useState<FonctionnaireEnAttente[]>([]);
  const [stats, setStats] = useState<FonctionnairesStats | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  // États des modales
  const [isAffectationModalOpen, setIsAffectationModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isHistoriqueModalOpen, setIsHistoriqueModalOpen] = useState(false);
  const [selectedFonctionnaire, setSelectedFonctionnaire] = useState<FonctionnaireEnAttente | null>(null);

  // États de chargement
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    loading: true,
    refreshing: false,
    affecting: null,
    updating: null,
    exporting: false
  });

  // Formulaire d'affectation
  const [affectationForm, setAffectationForm] = useState<AffectationForm>({
    organismeDestination: '',
    service: '',
    poste: '',
    typeAffectation: 'PRIMAIRE',
    dateDebut: new Date().toISOString().split('T')[0],
    pourcentageTemps: 100,
    motif: '',
    observations: ''
  });

  const loadData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, loading: true }));

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(selectedStatut !== 'all' && { statut: selectedStatut }),
        ...(selectedPriorite !== 'all' && { priorite: selectedPriorite }),
        ...(selectedOrganisme !== 'all' && { organisme: selectedOrganisme }),
        ...(searchTerm && { recherche: searchTerm })
      });

      const response = await fetch(`/api/fonctionnaires/en-attente?${params}`);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setFonctionnaires(result.data);
        setStats(result.stats);
        setPagination(result.pagination);

        // Toast différencié selon le contexte
        if (searchTerm) {
          toast.success(`🔍 ${result.data.length} fonctionnaire(s) trouvé(s) pour "${searchTerm}"`);
        } else {
          toast.success(`✅ ${result.data.length} fonctionnaire(s) chargé(s)`);
        }
      } else {
        throw new Error(result.error || 'Erreur inconnue');
      }
    } catch (error) {
      console.error('❌ Erreur chargement fonctionnaires:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';

      if (errorMessage.includes('fetch')) {
        toast.error('❌ Erreur de connexion au serveur');
      } else if (errorMessage.includes('403')) {
        toast.error('❌ Accès non autorisé');
      } else {
        toast.error(`❌ Erreur lors du chargement: ${errorMessage}`);
      }

      // En cas d'erreur, on peut garder les données précédentes ou vider
      setFonctionnaires([]);
      setStats(null);
    } finally {
      setLoadingStates(prev => ({ ...prev, loading: false }));
    }
  }, [selectedStatut, selectedPriorite, selectedOrganisme, page, searchTerm, limit]);

  // Charger les données
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Effet pour la recherche avec debouncing
  useEffect(() => {
    if (searchTerm) {
      const timeoutId = setTimeout(() => {
        loadData();
      }, 500); // Attendre 500ms après la dernière frappe

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, loadData]);

  // Gestionnaires d'événements
  const handleRefreshData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, refreshing: true }));
      await loadData();
    } finally {
      setLoadingStates(prev => ({ ...prev, refreshing: false }));
    }
  }, [loadData]);

  const handleAffectation = useCallback(async () => {
    if (!selectedFonctionnaire) return;

    try {
      setLoadingStates(prev => ({ ...prev, affecting: selectedFonctionnaire.id }));

      const response = await fetch('/api/fonctionnaires/affecter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fonctionnaireId: selectedFonctionnaire.id,
          ...affectationForm,
          responsableAffectation: 'Direction des Ressources Humaines'
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Affectation de ${selectedFonctionnaire.prenom} ${selectedFonctionnaire.nom} créée avec succès`);
        setIsAffectationModalOpen(false);
        setAffectationForm({
          organismeDestination: '',
          service: '',
          poste: '',
          typeAffectation: 'PRIMAIRE',
          dateDebut: new Date().toISOString().split('T')[0],
          pourcentageTemps: 100,
          motif: '',
          observations: ''
        });
        await loadData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Erreur affectation:', error);
      toast.error('❌ Erreur lors de l\'affectation');
    } finally {
      setLoadingStates(prev => ({ ...prev, affecting: null }));
    }
  }, [selectedFonctionnaire, affectationForm, loadData]);

  const handleExportData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, exporting: true }));

      await new Promise(resolve => setTimeout(resolve, 1000));

      const exportData = {
        exported_at: new Date().toISOString(),
        total_fonctionnaires: fonctionnaires.length,
        fonctionnaires: fonctionnaires,
        statistics: stats,
        source: 'SUPER_ADMIN_FONCTIONNAIRES_ATTENTE'
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fonctionnaires-attente-${fonctionnaires.length}-${new Date().toISOString().split('T')[0]}.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`✅ Export de ${fonctionnaires.length} fonctionnaires réussi !`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'export:', error);
      toast.error('❌ Erreur lors de l\'export des données');
    } finally {
      setLoadingStates(prev => ({ ...prev, exporting: false }));
    }
  }, [fonctionnaires, stats]);

  // Fonctions utilitaires
  const getPrioriteColor = (priorite: FonctionnaireEnAttente['prioriteAffectation']) => {
    switch (priorite) {
      case 'HAUTE': return 'bg-red-100 text-red-800 border-red-300';
      case 'MOYENNE': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'BASSE': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatutColor = (statut: FonctionnaireEnAttente['statut']) => {
    switch (statut) {
      case 'EN_ATTENTE': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'AFFECTE': return 'bg-green-100 text-green-800 border-green-300';
      case 'DETACHE': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'SUSPENDU': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  const calculateAge = (dateNaissance: string) => {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loadingStates.loading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chargement des fonctionnaires...</h3>
              <p className="text-muted-foreground">Analyse des dossiers en attente d'affectation</p>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-600" />
                Fonctionnaires en Attente
              </h1>
              <p className="text-gray-600">
                Gestion des {stats?.total || 0} fonctionnaires en attente d'affectation avec double rattachement
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRefreshData}
                disabled={loadingStates.refreshing}
              >
                {loadingStates.refreshing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Actualiser
              </Button>
              <Button
                variant="outline"
                onClick={handleExportData}
                disabled={loadingStates.exporting}
              >
                {loadingStates.exporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Exporter
              </Button>
            </div>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Fonctionnaires</p>
                  <p className="text-2xl font-bold">{stats?.total || 0}</p>
                  <p className="text-blue-100 text-xs">Dossiers enregistrés</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">En Attente</p>
                  <p className="text-2xl font-bold">{stats?.enAttente || 0}</p>
                  <p className="text-orange-100 text-xs">À affecter</p>
                </div>
                <Clock className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Affectés</p>
                  <p className="text-2xl font-bold">{stats?.affectes || 0}</p>
                  <p className="text-green-100 text-xs">Postes attribués</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Double Rattachement</p>
                  <p className="text-2xl font-bold">{stats?.avecDoubleRattachement || 0}</p>
                  <p className="text-purple-100 text-xs">Multi-services</p>
                </div>
                <Share2 className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques détaillées */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Répartition par Statut
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">En attente</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">{stats?.enAttente || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Affectés</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{stats?.affectes || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Détachés</span>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">{stats?.detaches || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Suspendus</span>
                  </div>
                  <Badge className="bg-red-100 text-red-800">{stats?.suspendus || 0}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                Priorités d'Affectation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Priorité Haute</span>
                    <span>{stats?.prioriteHaute || 0}</span>
                  </div>
                  <Progress value={(stats?.prioriteHaute || 0) / (stats?.total || 1) * 100} className="h-2 bg-red-100" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Priorité Moyenne</span>
                    <span>{stats?.prioriteMoyenne || 0}</span>
                  </div>
                  <Progress value={(stats?.prioriteMoyenne || 0) / (stats?.total || 1) * 100} className="h-2 bg-yellow-100" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Priorité Basse</span>
                    <span>{stats?.prioriteBasse || 0}</span>
                  </div>
                  <Progress value={(stats?.prioriteBasse || 0) / (stats?.total || 1) * 100} className="h-2 bg-green-100" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Indicateurs RH
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Taux d'affectation</span>
                  <Badge className="bg-green-100 text-green-800">
                    {Math.round((stats?.affectes || 0) / (stats?.total || 1) * 100)}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Temps moyen attente</span>
                  <Badge className="bg-blue-100 text-blue-800">15j</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Nouvelles inscriptions</span>
                  <Badge className="bg-purple-100 text-purple-800">+12</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Évaluations complètes</span>
                  <Badge className="bg-yellow-100 text-yellow-800">85%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par nom, matricule, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={selectedStatut} onValueChange={setSelectedStatut}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                  <SelectItem value="AFFECTE">Affecté</SelectItem>
                  <SelectItem value="DETACHE">Détaché</SelectItem>
                  <SelectItem value="SUSPENDU">Suspendu</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPriorite} onValueChange={setSelectedPriorite}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes priorités</SelectItem>
                  <SelectItem value="HAUTE">Haute</SelectItem>
                  <SelectItem value="MOYENNE">Moyenne</SelectItem>
                  <SelectItem value="BASSE">Basse</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatut('all');
                  setSelectedPriorite('all');
                  setSelectedOrganisme('all');
                  setPage(1);
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des fonctionnaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {fonctionnaires.map((fonctionnaire) => (
            <Card
              key={fonctionnaire.id}
              className={`border-l-4 ${
                fonctionnaire.prioriteAffectation === 'HAUTE' ? 'border-l-red-500' :
                fonctionnaire.prioriteAffectation === 'MOYENNE' ? 'border-l-yellow-500' :
                'border-l-green-500'
              } hover:shadow-lg transition-all duration-300`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {fonctionnaire.prenom.charAt(0)}{fonctionnaire.nom.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg leading-tight">
                      {fonctionnaire.prenom} {fonctionnaire.nom}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Matricule: {fonctionnaire.matricule}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {calculateAge(fonctionnaire.dateNaissance)} ans • {fonctionnaire.lieuNaissance}
                    </p>
                  </div>
                </div>

                {/* Badges de statut */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={getStatutColor(fonctionnaire.statut)}>
                    {fonctionnaire.statut}
                  </Badge>

                  <Badge className={getPrioriteColor(fonctionnaire.prioriteAffectation)}>
                    {fonctionnaire.prioriteAffectation}
                  </Badge>

                  {fonctionnaire.rattachementPrimaire && fonctionnaire.rattachementSecondaire && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">
                      Double rattachement
                    </Badge>
                  )}
                </div>

                {/* Informations principales */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{fonctionnaire.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{fonctionnaire.telephone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>
                      {fonctionnaire.diplomes[0]?.niveau} en {fonctionnaire.diplomes[0]?.intitule}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Inscrit le {formatDate(fonctionnaire.dateInscription)}</span>
                  </div>
                </div>

                {/* Préférences d'affectation */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 mb-2">Préférences d'affectation:</p>
                  <div className="flex flex-wrap gap-1">
                    {fonctionnaire.preferences.organismes.slice(0, 2).map((org, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {org.length > 20 ? `${org.substring(0, 20)}...` : org}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Rattachements actuels */}
                {(fonctionnaire.rattachementPrimaire || fonctionnaire.rattachementSecondaire) && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs font-medium text-blue-800 mb-2">Rattachements actuels:</p>
                    {fonctionnaire.rattachementPrimaire && (
                      <div className="text-xs text-blue-700 mb-1">
                        <span className="font-medium">Primaire:</span> {fonctionnaire.rattachementPrimaire.poste} - {fonctionnaire.rattachementPrimaire.organisme}
                      </div>
                    )}
                    {fonctionnaire.rattachementSecondaire && (
                      <div className="text-xs text-blue-700">
                        <span className="font-medium">Secondaire:</span> {fonctionnaire.rattachementSecondaire.poste} ({fonctionnaire.rattachementSecondaire.pourcentageTemps}%)
                      </div>
                    )}
                  </div>
                )}

                {/* Évaluation */}
                {fonctionnaire.evaluation && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-green-800">
                        Évaluation: {fonctionnaire.evaluation.note}/20
                      </span>
                    </div>
                    <p className="text-xs text-green-700 line-clamp-2">
                      {fonctionnaire.evaluation.commentaires}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2 pt-4 border-t">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedFonctionnaire(fonctionnaire);
                      setIsAffectationModalOpen(true);
                    }}
                    disabled={loadingStates.affecting === fonctionnaire.id || fonctionnaire.statut === 'AFFECTE'}
                  >
                    {loadingStates.affecting === fonctionnaire.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <UserPlus className="h-4 w-4 mr-2" />
                    )}
                    {fonctionnaire.statut === 'AFFECTE' ? 'Déjà Affecté' : 'Affecter'}
                  </Button>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFonctionnaire(fonctionnaire);
                        setIsDetailsModalOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFonctionnaire(fonctionnaire);
                        setIsHistoriqueModalOpen(true);
                      }}
                    >
                      <History className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFonctionnaire(fonctionnaire);
                        // Ouvrir modal d'édition
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {fonctionnaires.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun fonctionnaire trouvé</h3>
              <p className="text-gray-600 mb-4">
                Aucun fonctionnaire ne correspond aux critères de recherche actuels.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatut('all');
                  setSelectedPriorite('all');
                  setSelectedOrganisme('all');
                  setPage(1);
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {pagination.page} sur {pagination.pages} • {pagination.total} fonctionnaires au total
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={pagination.page <= 1}
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => setPage(prev => Math.min(pagination.pages, prev + 1))}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal d'affectation */}
        <Dialog open={isAffectationModalOpen} onOpenChange={setIsAffectationModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Affecter un Fonctionnaire</DialogTitle>
              <DialogDescription>
                Affectation de {selectedFonctionnaire?.prenom} {selectedFonctionnaire?.nom}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organismeDestination">Organisme de destination</Label>
                  <Input
                    id="organismeDestination"
                    value={affectationForm.organismeDestination}
                    onChange={(e) => setAffectationForm(prev => ({
                      ...prev,
                      organismeDestination: e.target.value
                    }))}
                    placeholder="Nom de l'organisme"
                  />
                </div>

                <div>
                  <Label htmlFor="service">Service</Label>
                  <Input
                    id="service"
                    value={affectationForm.service}
                    onChange={(e) => setAffectationForm(prev => ({
                      ...prev,
                      service: e.target.value
                    }))}
                    placeholder="Nom du service"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="poste">Poste</Label>
                  <Input
                    id="poste"
                    value={affectationForm.poste}
                    onChange={(e) => setAffectationForm(prev => ({
                      ...prev,
                      poste: e.target.value
                    }))}
                    placeholder="Intitulé du poste"
                  />
                </div>

                <div>
                  <Label htmlFor="typeAffectation">Type d'affectation</Label>
                  <Select
                    value={affectationForm.typeAffectation}
                    onValueChange={(value: AffectationForm['typeAffectation']) =>
                      setAffectationForm(prev => ({ ...prev, typeAffectation: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRIMAIRE">Affectation Primaire</SelectItem>
                      <SelectItem value="SECONDAIRE">Affectation Secondaire</SelectItem>
                      <SelectItem value="MUTATION">Mutation</SelectItem>
                      <SelectItem value="DETACHEMENT">Détachement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateDebut">Date de début</Label>
                  <Input
                    type="date"
                    id="dateDebut"
                    value={affectationForm.dateDebut}
                    onChange={(e) => setAffectationForm(prev => ({
                      ...prev,
                      dateDebut: e.target.value
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="pourcentageTemps">Pourcentage de temps (%)</Label>
                  <Input
                    type="number"
                    id="pourcentageTemps"
                    min="10"
                    max="100"
                    value={affectationForm.pourcentageTemps}
                    onChange={(e) => setAffectationForm(prev => ({
                      ...prev,
                      pourcentageTemps: parseInt(e.target.value)
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="motif">Motif de l'affectation</Label>
                <Textarea
                  id="motif"
                  value={affectationForm.motif}
                  onChange={(e) => setAffectationForm(prev => ({
                    ...prev,
                    motif: e.target.value
                  }))}
                  placeholder="Motif et justification de l'affectation"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="observations">Observations</Label>
                <Textarea
                  id="observations"
                  value={affectationForm.observations}
                  onChange={(e) => setAffectationForm(prev => ({
                    ...prev,
                    observations: e.target.value
                  }))}
                  placeholder="Observations et notes complémentaires"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAffectationModalOpen(false)}>
                  Annuler
                </Button>
                <Button
                  onClick={handleAffectation}
                  disabled={!affectationForm.organismeDestination || !affectationForm.service || !affectationForm.poste}
                >
                  {loadingStates.affecting === selectedFonctionnaire?.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Affectation...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Confirmer l'Affectation
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal détails fonctionnaire */}
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Dossier Fonctionnaire</DialogTitle>
              <DialogDescription>
                Détails complets pour {selectedFonctionnaire?.prenom} {selectedFonctionnaire?.nom}
              </DialogDescription>
            </DialogHeader>

            {selectedFonctionnaire && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informations Personnelles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Nom complet:</span>
                        <span className="ml-2 font-medium">{selectedFonctionnaire.prenom} {selectedFonctionnaire.nom}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Matricule:</span>
                        <span className="ml-2 font-mono">{selectedFonctionnaire.matricule}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="ml-2">{selectedFonctionnaire.email}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Téléphone:</span>
                        <span className="ml-2">{selectedFonctionnaire.telephone}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Âge:</span>
                        <span className="ml-2">{calculateAge(selectedFonctionnaire.dateNaissance)} ans</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Lieu de naissance:</span>
                        <span className="ml-2">{selectedFonctionnaire.lieuNaissance}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Formation & Qualifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedFonctionnaire.diplomes.map((diplome, index) => (
                        <div key={index} className="border-l-4 border-l-blue-500 pl-3">
                          <p className="font-medium">{diplome.niveau} en {diplome.intitule}</p>
                          <p className="text-sm text-gray-600">{diplome.etablissement}</p>
                          <p className="text-xs text-gray-500">Année: {diplome.annee}</p>
                        </div>
                      ))}

                      {selectedFonctionnaire.experiencePrecedente && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Expérience Professionnelle</h4>
                          {selectedFonctionnaire.experiencePrecedente.map((exp, index) => (
                            <div key={index} className="border-l-4 border-l-green-500 pl-3 mb-2">
                              <p className="font-medium">{exp.poste}</p>
                              <p className="text-sm text-gray-600">{exp.organisme}</p>
                              <p className="text-xs text-gray-500">{exp.duree}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal historique */}
        <Dialog open={isHistoriqueModalOpen} onOpenChange={setIsHistoriqueModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Historique des Actions</DialogTitle>
              <DialogDescription>
                Historique complet pour {selectedFonctionnaire?.prenom} {selectedFonctionnaire?.nom}
              </DialogDescription>
            </DialogHeader>

            {selectedFonctionnaire && (
              <div className="space-y-4">
                {selectedFonctionnaire.historique.map((entry, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">{entry.action}</p>
                      <p className="text-sm text-gray-600">{entry.motif}</p>
                      {entry.organisme && (
                        <p className="text-xs text-blue-600">Organisme: {entry.organisme}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Par: {entry.responsable}</span>
                        <span>Le: {formatDate(entry.date)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
