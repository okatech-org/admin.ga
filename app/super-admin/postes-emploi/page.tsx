'use client';

// =============================================================================
// 🏛️ ADMINISTRATION.GA - Gestion des Postes et Emploi Public
// =============================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

import {
  Building2,
  Users,
  Briefcase,
  Target,
  UserPlus,
  Settings,
  BarChart3,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  AlertTriangle,
  Crown,
  Shield,
  Layers,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  TrendingUp,
  Users2,
  Zap,
  Database,
  Download,
  RefreshCw
} from 'lucide-react';

import { toast } from 'sonner';
import {
  Organisme,
  Poste,
  Personne,
  Affectation,
  OpportuniteEmploi,
  StatistiquesEmploi,
  StatutPoste,
  StatutFonctionnaire,
  NiveauHierarchique,
  FiltresPoste,
  FiltresFonctionnaire
} from '@/lib/types/poste-management';
import { posteManagementService } from '@/lib/services/poste-management.service';

// Types supplémentaires
type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'AGENT' | 'USER';

// =============================================================================
// 📊 TYPES ET INTERFACES LOCALES
// =============================================================================

interface PaginationState {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

interface LoadingStates {
  organismes: boolean;
  postes: boolean;
  fonctionnaires: boolean;
  opportunites: boolean;
  stats: boolean;
}

interface FiltresUI {
  recherche: string;
  statut_poste?: StatutPoste;
  niveau_hierarchique?: NiveauHierarchique;
  organisme_id?: string;
  est_strategique?: boolean;
  statut_fonctionnaire?: StatutFonctionnaire;
}

// =============================================================================
// 🎨 COMPOSANT PRINCIPAL
// =============================================================================

function PostesEmploiPageContent() {
  // États principaux
  const [activeTab, setActiveTab] = useState<string>('vue-ensemble');
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    organismes: false,
    postes: false,
    fonctionnaires: false,
    opportunites: false,
    stats: false
  });

  // Données
  const [organismes, setOrganismes] = useState<Organisme[]>([]);
  const [postes, setPostes] = useState<Poste[]>([]);
  const [fonctionnaires, setFonctionnaires] = useState<Personne[]>([]);
  const [opportunites, setOpportunites] = useState<OpportuniteEmploi[]>([]);
  const [statistiques, setStatistiques] = useState<StatistiquesEmploi | null>(null);

  // Filtres et recherche
  const [filtres, setFiltres] = useState<FiltresUI>({
    recherche: ''
  });

  // Pagination
  const [paginationPostes, setPaginationPostes] = useState<PaginationState>({
    page: 1,
    itemsPerPage: 12,
    totalItems: 0,
    totalPages: 0
  });

  const [paginationFonctionnaires, setPaginationFonctionnaires] = useState<PaginationState>({
    page: 1,
    itemsPerPage: 12,
    totalItems: 0,
    totalPages: 0
  });

  // Modales et sélections
  const [isCreatePosteModalOpen, setIsCreatePosteModalOpen] = useState(false);
  const [isAffectationModalOpen, setIsAffectationModalOpen] = useState(false);
  const [selectedPoste, setSelectedPoste] = useState<Poste | null>(null);
  const [selectedFonctionnaire, setSelectedFonctionnaire] = useState<Personne | null>(null);

  // =============================================================================
  // 📡 CHARGEMENT DES DONNÉES
  // =============================================================================

  const loadData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, stats: true }));

      // Chargement des données principales
      const organismesData = posteManagementService.getOrganismes();
      const statsData = posteManagementService.getStatistiquesEmploi();

      setOrganismes(organismesData);
      setStatistiques(statsData);

      toast.success('📊 Données chargées avec succès');
    } catch (error) {
      console.error('❌ Erreur chargement données:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoadingStates(prev => ({ ...prev, stats: false }));
    }
  }, []);

  const loadPostes = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, postes: true }));

      const filtresPostes: FiltresPoste = {
        organisme_ids: filtres.organisme_id ? [filtres.organisme_id] : undefined,
        statuts: filtres.statut_poste ? [filtres.statut_poste] : undefined,
        niveaux_hierarchiques: filtres.niveau_hierarchique ? [filtres.niveau_hierarchique] : undefined,
        est_strategique: filtres.est_strategique
      };

      const resultats = posteManagementService.rechercherPostes(
        filtresPostes,
        paginationPostes.page,
        paginationPostes.itemsPerPage
      );

      setPostes(resultats.items);
      setPaginationPostes(prev => ({
        ...prev,
        totalItems: resultats.total,
        totalPages: resultats.pages_total
      }));

    } catch (error) {
      console.error('❌ Erreur chargement postes:', error);
      toast.error('Erreur lors du chargement des postes');
    } finally {
      setLoadingStates(prev => ({ ...prev, postes: false }));
    }
  }, [filtres, paginationPostes.page, paginationPostes.itemsPerPage]);

  const loadFonctionnaires = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, fonctionnaires: true }));

      const filtresFonc: FiltresFonctionnaire = {
        statuts: filtres.statut_fonctionnaire ? [filtres.statut_fonctionnaire] : undefined,
        organismes_ids: filtres.organisme_id ? [filtres.organisme_id] : undefined
      };

      const resultats = posteManagementService.rechercherFonctionnaires(
        filtresFonc,
        paginationFonctionnaires.page
      );

      setFonctionnaires(resultats.items);
      setPaginationFonctionnaires(prev => ({
        ...prev,
        totalItems: resultats.total,
        totalPages: resultats.pages_total
      }));

    } catch (error) {
      console.error('❌ Erreur chargement fonctionnaires:', error);
      toast.error('Erreur lors du chargement des fonctionnaires');
    } finally {
      setLoadingStates(prev => ({ ...prev, fonctionnaires: false }));
    }
  }, [filtres, paginationFonctionnaires.page]);

  // Chargement initial
  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (activeTab === 'postes') {
      loadPostes();
    }
  }, [activeTab, loadPostes]);

  useEffect(() => {
    if (activeTab === 'fonctionnaires') {
      loadFonctionnaires();
    }
  }, [activeTab, loadFonctionnaires]);

  // =============================================================================
  // 🎯 CALCULS ET MÉTRIQUES
  // =============================================================================

  const postesVacantsPrioritaires = useMemo(() => {
    return posteManagementService.getPostesVacantsPrioritaires().slice(0, 10);
  }, []);

  const fonctionnairesDisponibles = useMemo(() => {
    return posteManagementService.getFonctionnairesDisponibles().slice(0, 10);
  }, []);

  // =============================================================================
  // 🎬 GESTIONNAIRES D'ÉVÉNEMENTS
  // =============================================================================

  const handleCreatePoste = () => {
    setIsCreatePosteModalOpen(true);
  };

  const handleAffectation = (poste: Poste) => {
    setSelectedPoste(poste);
    setIsAffectationModalOpen(true);
  };

  const handleCreateOpportunite = (poste: Poste) => {
    try {
      const opportunite = posteManagementService.creerOpportuniteEmploi(poste.id, 'CONCOURS_EXTERNE');
      toast.success(`✅ Opportunité d'emploi créée: ${opportunite.titre}`);
      loadData();
    } catch (error) {
      toast.error('Erreur lors de la création de l\'opportunité');
    }
  };

  const handleViewPosteDetails = (poste: Poste) => {
    toast.info(`📋 Détails du poste: ${poste.intitule}`);
  };

  const handleEditPoste = (poste: Poste) => {
    toast.info(`✏️ Modification du poste: ${poste.intitule}`);
  };

  const handleDeletePoste = (poste: Poste) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le poste "${poste.intitule}" ?`)) {
      try {
        posteManagementService.supprimerPoste(poste.id, 'Suppression manuelle');
        toast.success('✅ Poste supprimé avec succès');
        loadPostes();
      } catch (error) {
        toast.error('Erreur lors de la suppression du poste');
      }
    }
  };

  const handleViewFonctionnaireProfile = (fonctionnaire: Personne) => {
    toast.info(`👤 Profil de ${fonctionnaire.prenom} ${fonctionnaire.nom}`);
  };

  const handleEditFonctionnaire = (fonctionnaire: Personne) => {
    toast.info(`✏️ Modification du profil de ${fonctionnaire.prenom} ${fonctionnaire.nom}`);
  };

  const handleExportData = (type: 'postes' | 'fonctionnaires' | 'stats') => {
    setLoadingStates(prev => ({ ...prev, [type]: true }));

    setTimeout(() => {
      toast.success(`📊 Export ${type} généré avec succès`);
      setLoadingStates(prev => ({ ...prev, [type]: false }));
    }, 2000);
  };

  const handleRefreshData = () => {
    setLoadingStates(prev => ({
      ...prev,
      organismes: true,
      stats: true
    }));

    setTimeout(() => {
      loadData();
      if (activeTab === 'postes') loadPostes();
      if (activeTab === 'fonctionnaires') loadFonctionnaires();

      toast.success('🔄 Données actualisées');
      setLoadingStates(prev => ({
        ...prev,
        organismes: false,
        stats: false
      }));
    }, 1500);
  };

  // =============================================================================
  // 🎨 RENDU DES COMPOSANTS
  // =============================================================================

  const renderVueEnsemble = () => (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organismes</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistiques?.global.total_organismes || 0}</div>
            <p className="text-xs text-muted-foreground">
              Administration publique gabonaise
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Postes</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistiques?.global.total_postes || 0}</div>
            <p className="text-xs text-muted-foreground">
              {statistiques?.global.postes_vacants || 0} postes vacants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fonctionnaires</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistiques?.global.total_fonctionnaires || 0}</div>
            <p className="text-xs text-muted-foreground">
              {statistiques?.global.fonctionnaires_disponibles || 0} disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Occupation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistiques?.global.taux_occupation.toFixed(1) || 0}%
            </div>
            <Progress
              value={statistiques?.global.taux_occupation || 0}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Postes prioritaires et fonctionnaires disponibles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Postes vacants prioritaires */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Postes Vacants Prioritaires
            </CardTitle>
            <CardDescription>
              Postes stratégiques à pourvoir en urgence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {postesVacantsPrioritaires.map((poste) => (
                <div key={poste.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{poste.intitule}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      {organismes.find(o => o.id === poste.organisme_id)?.nom}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={poste.niveau_hierarchique === 'DIRECTION' ? 'destructive' : 'secondary'}>
                        {poste.niveau_hierarchique}
                      </Badge>
                      {poste.est_strategique && (
                        <Badge variant="outline">
                          <Crown className="h-3 w-3 mr-1" />
                          Stratégique
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCreateOpportunite(poste)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Publier
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAffectation(poste)}
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      Affecter
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fonctionnaires disponibles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users2 className="h-5 w-5 text-green-500" />
              Fonctionnaires Disponibles
            </CardTitle>
            <CardDescription>
              Personnel disponible pour affectation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fonctionnairesDisponibles.map((fonctionnaire) => (
                <div key={fonctionnaire.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {fonctionnaire.prenom} {fonctionnaire.nom}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {fonctionnaire.email}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={fonctionnaire.statut === 'DISPONIBLE' ? 'default' : 'secondary'}
                      >
                        {fonctionnaire.statut}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {fonctionnaire.competences.slice(0, 2).join(', ')}
                        {fonctionnaire.competences.length > 2 && '...'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedFonctionnaire(fonctionnaire)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Voir
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setSelectedFonctionnaire(fonctionnaire)}
                    >
                      <Target className="h-3 w-3 mr-1" />
                      Affecter
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques par niveau hiérarchique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Répartition par Niveau Hiérarchique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statistiques && Object.entries(statistiques.par_niveau).map(([niveau, stats]) => (
              <div key={niveau} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{niveau}</h4>
                  <Badge variant="outline">{stats.postes_total} postes</Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Occupés</span>
                    <span>{stats.postes_occupés}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Vacants</span>
                    <span className="text-red-600">{stats.postes_vacants}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Candidatures</span>
                    <span className="text-blue-600">{stats.candidatures_en_cours}</span>
                  </div>
                </div>
                <Progress
                  value={(stats.postes_occupés / stats.postes_total) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderGestionPostes = () => (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Postes</h2>
          <p className="text-muted-foreground">
            Administration des postes et fonctions publiques
          </p>
        </div>
        <Button onClick={handleCreatePoste}>
          <Plus className="h-4 w-4 mr-2" />
          Créer un Poste
        </Button>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="recherche">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="recherche"
                  placeholder="Rechercher un poste..."
                  value={filtres.recherche}
                  onChange={(e) => setFiltres(prev => ({ ...prev, recherche: e.target.value }))}
                  className="pl-8"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="statut-poste">Statut</Label>
              <Select
                value={filtres.statut_poste}
                onValueChange={(value) => setFiltres(prev => ({
                  ...prev,
                  statut_poste: value as StatutPoste
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OCCUPÉ">Occupé</SelectItem>
                  <SelectItem value="VACANT">Vacant</SelectItem>
                  <SelectItem value="EN_TRANSITION">En transition</SelectItem>
                  <SelectItem value="CRÉÉ">Créé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="niveau">Niveau</Label>
              <Select
                value={filtres.niveau_hierarchique}
                onValueChange={(value) => setFiltres(prev => ({
                  ...prev,
                  niveau_hierarchique: value as NiveauHierarchique
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les niveaux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DIRECTION">Direction</SelectItem>
                  <SelectItem value="ENCADREMENT">Encadrement</SelectItem>
                  <SelectItem value="EXÉCUTION">Exécution</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="organisme">Organisme</Label>
              <Select
                value={filtres.organisme_id}
                onValueChange={(value) => setFiltres(prev => ({
                  ...prev,
                  organisme_id: value
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les organismes" />
                </SelectTrigger>
                <SelectContent>
                  {organismes.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="strategique"
                checked={filtres.est_strategique || false}
                onCheckedChange={(checked) => setFiltres(prev => ({
                  ...prev,
                  est_strategique: checked as boolean || undefined
                }))}
              />
              <Label htmlFor="strategique">Postes stratégiques uniquement</Label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltres({ recherche: '' })}
              className="text-muted-foreground"
            >
              Effacer les filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des postes */}
      <Card>
        <CardHeader>
          <CardTitle>
            Postes ({paginationPostes.totalItems})
            {loadingStates.postes && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                Chargement...
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {postes.map((poste) => (
              <div key={poste.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{poste.intitule}</h3>
                      {poste.est_strategique && (
                        <Badge variant="destructive">
                          <Crown className="h-3 w-3 mr-1" />
                          Stratégique
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {organismes.find(o => o.id === poste.organisme_id)?.nom}
                      </div>
                      <div className="flex items-center gap-1">
                        <Layers className="h-3 w-3" />
                        {poste.niveau_hierarchique}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {poste.code_poste || 'N/A'}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {poste.description}
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      <Badge
                        variant={
                          poste.statut === 'OCCUPÉ' ? 'default' :
                          poste.statut === 'VACANT' ? 'destructive' :
                          'secondary'
                        }
                      >
                        {poste.statut}
                      </Badge>

                      {poste.affectation_actuelle && (
                        <Badge variant="outline">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Titulaire affecté
                        </Badge>
                      )}

                      {poste.processus_recrutement?.statut === 'OUVERT' && (
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          Recrutement en cours
                        </Badge>
                      )}
                    </div>

                    {poste.competences_requises.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Compétences requises:</p>
                        <div className="flex flex-wrap gap-1">
                          {poste.competences_requises.slice(0, 3).map((comp) => (
                            <Badge key={comp} variant="outline" className="text-xs">
                              {comp}
                            </Badge>
                          ))}
                          {poste.competences_requises.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{poste.competences_requises.length - 3} autres
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewPosteDetails(poste)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Détails
                    </Button>

                    {poste.statut === 'VACANT' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleAffectation(poste)}
                        >
                          <UserPlus className="h-3 w-3 mr-1" />
                          Affecter
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCreateOpportunite(poste)}
                        >
                          <Target className="h-3 w-3 mr-1" />
                          Publier
                        </Button>
                      </>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditPoste(poste)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Modifier
                    </Button>

                    {poste.statut !== 'OCCUPÉ' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeletePoste(poste)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Supprimer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {paginationPostes.totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPaginationPostes(prev => ({
                        ...prev,
                        page: Math.max(1, prev.page - 1)
                      }))}
                      className={paginationPostes.page === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>

                  {[...Array(paginationPostes.totalPages)].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => setPaginationPostes(prev => ({
                          ...prev,
                          page: i + 1
                        }))}
                        isActive={paginationPostes.page === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPaginationPostes(prev => ({
                        ...prev,
                        page: Math.min(prev.totalPages, prev.page + 1)
                      }))}
                      className={paginationPostes.page === paginationPostes.totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderGestionFonctionnaires = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Fonctionnaires</h2>
          <p className="text-muted-foreground">
            Personnel de l'administration publique gabonaise
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Nouveau Fonctionnaire
        </Button>
      </div>

      {/* Filtres fonctionnaires */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="recherche-fonc">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="recherche-fonc"
                  placeholder="Nom, prénom, email..."
                  value={filtres.recherche}
                  onChange={(e) => setFiltres(prev => ({ ...prev, recherche: e.target.value }))}
                  className="pl-8"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="statut-fonctionnaire">Statut</Label>
              <Select
                value={filtres.statut_fonctionnaire}
                onValueChange={(value) => setFiltres(prev => ({
                  ...prev,
                  statut_fonctionnaire: value as StatutFonctionnaire
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIF">Actif</SelectItem>
                  <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                  <SelectItem value="EN_RECHERCHE">En recherche</SelectItem>
                  <SelectItem value="RETRAITÉ">Retraité</SelectItem>
                  <SelectItem value="SUSPENDU">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="organisme-fonc">Organisme</Label>
              <Select
                value={filtres.organisme_id}
                onValueChange={(value) => setFiltres(prev => ({
                  ...prev,
                  organisme_id: value
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les organismes" />
                </SelectTrigger>
                <SelectContent>
                  {organismes.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltres({ recherche: '' })}
              className="text-muted-foreground"
            >
              Effacer les filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des fonctionnaires */}
      <Card>
        <CardHeader>
          <CardTitle>
            Fonctionnaires ({paginationFonctionnaires.totalItems})
            {loadingStates.fonctionnaires && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                Chargement...
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fonctionnaires.map((fonctionnaire) => (
              <div key={fonctionnaire.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {fonctionnaire.prenom} {fonctionnaire.nom}
                      </h3>
                      <Badge
                        variant={
                          fonctionnaire.statut === 'ACTIF' ? 'default' :
                          fonctionnaire.statut === 'DISPONIBLE' ? 'secondary' :
                          fonctionnaire.statut === 'EN_RECHERCHE' ? 'destructive' :
                          'outline'
                        }
                      >
                        {fonctionnaire.statut}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {fonctionnaire.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {fonctionnaire.telephone}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {fonctionnaire.ville_residence}
                      </div>
                    </div>

                    {fonctionnaire.affectation_actuelle && (
                      <div className="mt-2 p-2 bg-muted rounded">
                        <p className="text-sm">
                          <strong>Affectation actuelle:</strong>
                          <span className="ml-1">
                            {postes.find(p => p.id === fonctionnaire.affectation_actuelle?.poste_id)?.intitule || 'Poste non trouvé'}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Depuis le {new Date(fonctionnaire.affectation_actuelle.date_debut).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    )}

                    {fonctionnaire.competences.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Compétences:</p>
                        <div className="flex flex-wrap gap-1">
                          {fonctionnaire.competences.slice(0, 4).map((comp) => (
                            <Badge key={comp} variant="outline" className="text-xs">
                              {comp}
                            </Badge>
                          ))}
                          {fonctionnaire.competences.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{fonctionnaire.competences.length - 4} autres
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      {fonctionnaire.est_disponible_mutation && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          Disponible mutation
                        </div>
                      )}
                      {fonctionnaire.est_disponible_promotion && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          Disponible promotion
                        </div>
                      )}
                      {fonctionnaire.numero_matricule && (
                        <span>Matricule: {fonctionnaire.numero_matricule}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewFonctionnaireProfile(fonctionnaire)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Profil
                    </Button>

                    {fonctionnaire.statut === 'DISPONIBLE' && (
                      <Button
                        size="sm"
                        onClick={() => setSelectedFonctionnaire(fonctionnaire)}
                      >
                        <Target className="h-3 w-3 mr-1" />
                        Affecter
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditFonctionnaire(fonctionnaire)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Modifier
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination fonctionnaires */}
          {paginationFonctionnaires.totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPaginationFonctionnaires(prev => ({
                        ...prev,
                        page: Math.max(1, prev.page - 1)
                      }))}
                      className={paginationFonctionnaires.page === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>

                  {[...Array(paginationFonctionnaires.totalPages)].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => setPaginationFonctionnaires(prev => ({
                          ...prev,
                          page: i + 1
                        }))}
                        isActive={paginationFonctionnaires.page === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPaginationFonctionnaires(prev => ({
                        ...prev,
                        page: Math.min(prev.totalPages, prev.page + 1)
                      }))}
                      className={paginationFonctionnaires.page === paginationFonctionnaires.totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderMarcheEmploi = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Marché de l'Emploi Public</h2>
          <p className="text-muted-foreground">
            Opportunités d'emploi et candidatures
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Opportunité
        </Button>
      </div>

      {/* Statistiques du marché de l'emploi */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunités Ouvertes</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistiques?.marché_emploi.opportunités_ouvertes || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Postes en recrutement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidatures</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistiques?.marché_emploi.candidatures_en_cours || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              En cours d'évaluation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Postes Pourvus</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistiques?.marché_emploi.postes_pourvus_mois || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Ce mois-ci
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Délai Moyen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistiques?.marché_emploi.délai_moyen_pourvoi || 0}j
            </div>
            <p className="text-xs text-muted-foreground">
              Temps de pourvoi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Taux de succès */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Taux de Succès par Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Candidatures Internes</span>
                  <span>{statistiques?.marché_emploi.taux_succès_interne || 0}%</span>
                </div>
                <Progress value={statistiques?.marché_emploi.taux_succès_interne || 0} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Candidatures Externes</span>
                  <span>{statistiques?.marché_emploi.taux_succès_externe || 0}%</span>
                </div>
                <Progress value={statistiques?.marché_emploi.taux_succès_externe || 0} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full justify-start">
                <Search className="h-4 w-4 mr-2" />
                Rechercher des Candidats
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                Publier une Opportunité
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Gérer les Candidatures
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Rapport de Recrutement
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des opportunités (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Opportunités d'Emploi Actives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune opportunité d'emploi active pour le moment.</p>
            <p className="text-sm">Créez une nouvelle opportunité pour commencer.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // =============================================================================
  // 🎨 RENDU DES MODALES
  // =============================================================================

  const renderCreatePosteModal = () => (
    <Dialog open={isCreatePosteModalOpen} onOpenChange={setIsCreatePosteModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un Nouveau Poste</DialogTitle>
          <DialogDescription>
            Définissez les caractéristiques du nouveau poste administratif
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="intitule">Intitulé du poste *</Label>
              <Input
                id="intitule"
                placeholder="Directeur des Ressources Humaines"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="code-poste">Code du poste</Label>
              <Input
                id="code-poste"
                placeholder="DRH-001"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description du poste *</Label>
            <Textarea
              id="description"
              placeholder="Responsabilités et missions du poste..."
              className="mt-1"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="niveau">Niveau hiérarchique</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DIRECTION">Direction</SelectItem>
                  <SelectItem value="ENCADREMENT">Encadrement</SelectItem>
                  <SelectItem value="EXÉCUTION">Exécution</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="categorie">Catégorie</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Catégorie A</SelectItem>
                  <SelectItem value="B">Catégorie B</SelectItem>
                  <SelectItem value="C">Catégorie C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="organisme">Organisme *</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {organismes.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="strategique" />
            <Label htmlFor="strategique">Poste stratégique</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsCreatePosteModalOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={() => {
              toast.success('✅ Poste créé avec succès !');
              setIsCreatePosteModalOpen(false);
              loadPostes();
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Créer le poste
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderAffectationModal = () => (
    <Dialog open={isAffectationModalOpen} onOpenChange={setIsAffectationModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Affecter un Fonctionnaire</DialogTitle>
          <DialogDescription>
            {selectedPoste && `Poste: ${selectedPoste.intitule}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Détails du poste */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Poste à pourvoir</h3>
              {selectedPoste && (
                <Card>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">{selectedPoste.intitule}</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>Niveau: {selectedPoste.niveau_hierarchique}</p>
                        <p>Organisme: {organismes.find(o => o.id === selectedPoste.organisme_id)?.nom}</p>
                        {selectedPoste.est_strategique && (
                          <Badge variant="destructive" className="mt-2">
                            <Crown className="h-3 w-3 mr-1" />
                            Stratégique
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sélection du fonctionnaire */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Fonctionnaire disponible</h3>
              <div>
                <Label htmlFor="fonctionnaire">Sélectionner un fonctionnaire</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choisir un fonctionnaire" />
                  </SelectTrigger>
                  <SelectContent>
                    {fonctionnairesDisponibles.map((fonc) => (
                      <SelectItem key={fonc.id} value={fonc.id}>
                        {fonc.prenom} {fonc.nom} - {fonc.statut}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type-contrat">Type de contrat</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FONCTIONNAIRE">Fonctionnaire</SelectItem>
                  <SelectItem value="CONTRACTUEL">Contractuel</SelectItem>
                  <SelectItem value="DÉTACHEMENT">Détachement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date-debut">Date de début</Label>
              <Input
                id="date-debut"
                type="date"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="commentaires">Commentaires</Label>
            <Textarea
              id="commentaires"
              placeholder="Observations sur l'affectation..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsAffectationModalOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={() => {
              toast.success('✅ Affectation réalisée avec succès !');
              setIsAffectationModalOpen(false);
              loadPostes();
              loadFonctionnaires();
            }}>
              <UserPlus className="h-4 w-4 mr-2" />
              Confirmer l'affectation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderCreateOpportuniteModal = () => (
    <Dialog open={selectedPoste !== null && !isAffectationModalOpen} onOpenChange={() => setSelectedPoste(null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer une Opportunité d'Emploi</DialogTitle>
          <DialogDescription>
            Publier un poste pour recrutement externe
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="type-processus">Type de processus</Label>
            <Select>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONCOURS_EXTERNE">Concours externe</SelectItem>
                <SelectItem value="CONCOURS_INTERNE">Concours interne</SelectItem>
                <SelectItem value="NOMINATION_DIRECTE">Nomination directe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date-ouverture">Date d'ouverture</Label>
              <Input
                id="date-ouverture"
                type="date"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="date-fermeture">Date de fermeture</Label>
              <Input
                id="date-fermeture"
                type="date"
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setSelectedPoste(null)}
            >
              Annuler
            </Button>
            <Button onClick={() => {
              if (selectedPoste) {
                handleCreateOpportunite(selectedPoste);
              }
              setSelectedPoste(null);
            }}>
              <Target className="h-4 w-4 mr-2" />
              Publier l'opportunité
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // =============================================================================
  // 🎨 RENDU PRINCIPAL
  // =============================================================================

  return (
    <div className="space-y-8">
      {/* En-tête avec actions */}
      <div className="flex flex-col space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Gestion des Postes et Emploi Public</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Administration complète des postes, fonctionnaires et marché de l'emploi gabonais
          </p>
        </div>

        {/* Barre d'actions rapides */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="default"
              onClick={handleCreatePoste}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouveau Poste
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExportData('stats')}
              disabled={loadingStates.stats}
              className="flex items-center gap-2"
            >
              {loadingStates.stats ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Export Données
            </Button>
            <Button
              variant="outline"
              onClick={handleRefreshData}
              disabled={loadingStates.organismes || loadingStates.stats}
              className="flex items-center gap-2"
            >
              {loadingStates.organismes || loadingStates.stats ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Actualiser
            </Button>
          </div>

          {/* Indicateurs rapides */}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              {organismes.length} organismes
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              {statistiques?.global.total_postes || 0} postes
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              {statistiques?.global.total_fonctionnaires || 0} fonctionnaires
            </div>
          </div>
        </div>
      </div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="vue-ensemble" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Vue d'Ensemble
          </TabsTrigger>
          <TabsTrigger value="postes" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Postes
          </TabsTrigger>
          <TabsTrigger value="fonctionnaires" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Fonctionnaires
          </TabsTrigger>
          <TabsTrigger value="marche-emploi" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Marché Emploi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vue-ensemble">
          {renderVueEnsemble()}
        </TabsContent>

        <TabsContent value="postes">
          {renderGestionPostes()}
        </TabsContent>

        <TabsContent value="fonctionnaires">
          {renderGestionFonctionnaires()}
        </TabsContent>

        <TabsContent value="marche-emploi">
          {renderMarcheEmploi()}
        </TabsContent>
      </Tabs>

      {/* Modales */}
      {renderCreatePosteModal()}
      {renderAffectationModal()}
      {renderCreateOpportuniteModal()}
    </div>
  );
}

// =============================================================================
// 🎨 COMPOSANT PRINCIPAL AVEC LAYOUT
// =============================================================================

export default function PostesEmploiPage() {
  return (
    <AuthenticatedLayout>
      <PostesEmploiPageContent />
    </AuthenticatedLayout>
  );
}
