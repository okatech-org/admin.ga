'use client';

import React, { useState } from 'react';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPIGrid } from '@/components/ui/kpi-card';
import { StatsTable } from '@/components/ui/stats-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePostesStats } from '@/hooks/use-statistics';
import { toast } from 'react-hot-toast';
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Target,
  MapPin,
  Calendar,
  RefreshCw,
  Download,
  Filter,
  Plus,
  Search,
  UserPlus,
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle,
  AlertCircle,
  FileText,
  Settings,
  Eye,
  Edit3,
  Send
} from 'lucide-react';

export default function PostesEmploiPage() {
  const { data, loading, error, refresh } = usePostesStats({
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMutationModalOpen, setIsMutationModalOpen] = useState(false);
  const [selectedPoste, setSelectedPoste] = useState<any>(null);

  // États pour la gestion des actions RH
  const [actionType, setActionType] = useState<'affecter' | 'muter' | 'promouvoir' | ''>('');
  const [selectedUser, setSelectedUser] = useState('');

  // KPIs des postes et emplois
  const kpiData = data ? [
    {
      id: 'total-postes',
      title: 'Total Postes',
      value: data.overview.total_postes_echantillon,
      trend: 0,
      subtitle: 'Postes autorisés échantillon',
      icon: <Target className="h-4 w-4" />,
      status: 'info' as const
    },
    {
      id: 'postes-pourvus',
      title: 'Postes Pourvus',
      value: data.overview.postes_pourvus_noms_reels,
      trend: 2,
      subtitle: `${data.overview.taux_pourvoi}% avec noms réels`,
      icon: <UserCheck className="h-4 w-4" />,
      status: 'success' as const
    },
    {
      id: 'postes-vacants',
      title: 'Postes Vacants',
      value: data.overview.postes_vacants,
      trend: -1,
      subtitle: `${data.overview.taux_vacance}% à pourvoir`,
      icon: <UserX className="h-4 w-4" />,
      status: 'warning' as const
    },
    {
      id: 'fonctionnaires',
      title: 'Fonctionnaires',
      value: data.fonctionnaires.total_fonctionnaires_reels,
      trend: 0,
      subtitle: 'Noms réels identifiés',
      icon: <Users className="h-4 w-4" />,
      status: 'info' as const
    }
  ] : [];

  // Colonnes pour le tableau des ministres
  const ministresColumns = [
    { key: 'poste', label: 'Poste', sortable: true },
    { key: 'nom', label: 'Titulaire', sortable: true },
    {
      key: 'status',
      label: 'Statut',
      type: 'badge' as const,
      formatter: () => <span className="text-green-600 font-medium">En fonction</span>
    }
  ];

  // Colonnes pour le tableau des gouverneurs
  const gouverneursColumns = [
    { key: 'poste', label: 'Province', sortable: true },
    { key: 'nom', label: 'Gouverneur', sortable: true },
    {
      key: 'status',
      label: 'Statut',
      type: 'badge' as const,
      formatter: () => <span className="text-green-600 font-medium">Nommé</span>
    }
  ];

  // Colonnes pour les directeurs
  const directeursColumns = [
    { key: 'poste', label: 'Fonction', sortable: true },
    { key: 'nom', label: 'Titulaire', sortable: true },
    {
      key: 'status',
      label: 'Statut',
      type: 'badge' as const,
      formatter: () => <span className="text-blue-600 font-medium">Confirmé</span>
    }
  ];

  // Colonnes pour l'analyse par niveau
  const niveauxColumns = [
    { key: 'niveau', label: 'Niveau', sortable: true },
    { key: 'total', label: 'Total Postes', type: 'number' as const, sortable: true },
    { key: 'pourvus', label: 'Pourvus', type: 'number' as const, sortable: true },
    { key: 'vacants', label: 'Vacants', type: 'number' as const, sortable: true },
    {
      key: 'pourcentage',
      label: 'Taux Pourvoi',
      type: 'percentage' as const,
      formatter: (value: number) => `${value.toFixed(1)}%`
    }
  ];

  const niveauxData = data ? [
    {
      niveau: 'Direction',
      total: data.repartition_par_niveau.direction.total,
      pourvus: data.repartition_par_niveau.direction.pourvus,
      vacants: data.repartition_par_niveau.direction.vacants,
      pourcentage: (data.repartition_par_niveau.direction.pourvus / data.repartition_par_niveau.direction.total) * 100
    },
    {
      niveau: 'Encadrement',
      total: data.repartition_par_niveau.encadrement.total,
      pourvus: data.repartition_par_niveau.encadrement.pourvus,
      vacants: data.repartition_par_niveau.encadrement.vacants,
      pourcentage: (data.repartition_par_niveau.encadrement.pourvus / data.repartition_par_niveau.encadrement.total) * 100
    },
    {
      niveau: 'Exécution',
      total: data.repartition_par_niveau.execution.total,
      pourvus: data.repartition_par_niveau.execution.pourvus,
      vacants: data.repartition_par_niveau.execution.vacants,
      pourcentage: (data.repartition_par_niveau.execution.pourvus / data.repartition_par_niveau.execution.total) * 100
    }
  ] : [];

  if (error) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-96">
          <CardHeader>
              <CardTitle className="text-red-600">Erreur de chargement</CardTitle>
              <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
              <Button onClick={refresh} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
                        </Button>
          </CardContent>
        </Card>
                  </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Postes & Emploi</h1>
            <p className="text-gray-600">
              Gestion des postes administratifs et situation de l'emploi public gabonais
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={refresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter Rapport
            </Button>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Poste
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Créer un Nouveau Poste</DialogTitle>
                  <DialogDescription>
                    Créer un nouveau poste administratif dans un organisme
                  </DialogDescription>
                </DialogHeader>
                <CreatePosteForm onClose={() => setIsCreateModalOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* KPIs */}
        <KPIGrid
          kpis={kpiData}
          columns={4}
          loading={loading}
        />

        {/* Actions RH rapides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Actions RH Rapides
            </CardTitle>
            <CardDescription>
              Gestion des affectations, mutations et promotions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2 h-16"
                onClick={() => setActionType('affecter')}
              >
                <UserPlus className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Affecter</div>
                  <div className="text-sm text-gray-500">À un poste</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 h-16"
                onClick={() => setIsMutationModalOpen(true)}
              >
                <ArrowRight className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Muter</div>
                  <div className="text-sm text-gray-500">Changement poste</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 h-16"
                onClick={() => setActionType('promouvoir')}
              >
                <TrendingUp className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Promouvoir</div>
                  <div className="text-sm text-gray-500">Avancement</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 h-16"
              >
                <FileText className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Rapport RH</div>
                  <div className="text-sm text-gray-500">Générer</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analyse détaillée */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="ministres">Ministres</TabsTrigger>
            <TabsTrigger value="gouverneurs">Gouverneurs</TabsTrigger>
            <TabsTrigger value="directeurs">Directeurs</TabsTrigger>
            <TabsTrigger value="postes-vacants">Postes Vacants</TabsTrigger>
            <TabsTrigger value="analytics">Analyses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Répartition par niveau */}
      <Card>
        <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Répartition par Niveau
                  </CardTitle>
                  <CardDescription>
                    Distribution des postes par niveau hiérarchique
                  </CardDescription>
        </CardHeader>
        <CardContent>
                  <StatsTable
                    title=""
                    columns={niveauxColumns}
                    data={niveauxData}
                    searchable={false}
                    exportable={false}
                    pagination={false}
                    loading={loading}
                  />
        </CardContent>
      </Card>

              {/* Indicateurs RH */}
      <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Indicateurs RH
                  </CardTitle>
                  <CardDescription>
                    Métriques de gestion des ressources humaines
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Taux de féminisation (Direction)</span>
                        <span className="font-semibold">{data.indicateurs_rh.taux_feminisation_direction}%</span>
                    </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Âge moyen (Direction)</span>
                        <span className="font-semibold">{data.indicateurs_rh.moyenne_age_direction} ans</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Renouvellement annuel</span>
                        <span className="font-semibold">{data.indicateurs_rh.taux_renouvellement_annuel}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Satisfaction affectation</span>
                        <span className="font-semibold">{data.indicateurs_rh.satisfaction_affectation}%</span>
                      </div>
                    </>
          )}
        </CardContent>
      </Card>
    </div>
          </TabsContent>

          <TabsContent value="ministres">
            <StatsTable
              title="Ministres en Fonction"
              description={`${data?.postes_avec_noms.ministres.total || 0} ministres nommés officiellement`}
              columns={ministresColumns}
              data={data?.postes_avec_noms.ministres.liste || []}
              loading={loading}
              searchable={true}
              exportable={true}
            />
          </TabsContent>

          <TabsContent value="gouverneurs">
            <StatsTable
              title="Gouverneurs de Province"
              description={`${data?.postes_avec_noms.gouverneurs.total || 0} gouverneurs pour les 9 provinces`}
              columns={gouverneursColumns}
              data={data?.postes_avec_noms.gouverneurs.liste || []}
              loading={loading}
              searchable={true}
              exportable={true}
            />
          </TabsContent>

          <TabsContent value="directeurs">
            <StatsTable
              title="Directeurs & Conseillers Confirmés"
              description={`${data?.postes_avec_noms.directeurs_confirmes.total || 0} postes de direction avec titulaires confirmés`}
              columns={directeursColumns}
              data={data?.postes_avec_noms.directeurs_confirmes.liste || []}
              loading={loading}
              searchable={true}
              exportable={true}
            />
          </TabsContent>

          <TabsContent value="postes-vacants" className="space-y-6">
            {/* Filtres pour postes vacants */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Recherche de Postes Vacants
                </CardTitle>
                <CardDescription>
                  {data?.overview.postes_vacants || 0} postes vacants disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un poste..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Niveau hiérarchique" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous niveaux</SelectItem>
                      <SelectItem value="direction">Direction</SelectItem>
                      <SelectItem value="encadrement">Encadrement</SelectItem>
                      <SelectItem value="execution">Exécution</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type d'organisme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous types</SelectItem>
                      <SelectItem value="ministere">Ministère</SelectItem>
                      <SelectItem value="direction-generale">Direction Générale</SelectItem>
                      <SelectItem value="mairie">Mairie</SelectItem>
                      <SelectItem value="prefecture">Préfecture</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => {
                    setSearchTerm('');
                    setSelectedLevel('');
                    setSelectedStatus('');
                  }}>
                    Réinitialiser
                  </Button>
                </div>

                {/* Alerte postes prioritaires */}
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Postes prioritaires à pourvoir :</strong> {data?.repartition_par_niveau.direction.vacants || 0} postes de direction vacant(s) nécessitent une attention immédiate.
                  </AlertDescription>
                </Alert>

                {/* Liste des postes vacants par niveau */}
                <div className="space-y-6">
                  {/* Postes de Direction Vacants */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Postes de Direction Vacants</span>
                        <Badge variant="destructive">{data?.repartition_par_niveau.direction.vacants || 0}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PostesVacantsGrid
                        level="direction"
                        count={data?.repartition_par_niveau.direction.vacants || 0}
                        searchTerm={searchTerm}
                        selectedStatus={selectedStatus}
                      />
                    </CardContent>
                  </Card>

                  {/* Postes d'Encadrement Vacants */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Postes d'Encadrement Vacants</span>
                        <Badge variant="secondary">{data?.repartition_par_niveau.encadrement.vacants || 0}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PostesVacantsGrid
                        level="encadrement"
                        count={data?.repartition_par_niveau.encadrement.vacants || 0}
                        searchTerm={searchTerm}
                        selectedStatus={selectedStatus}
                      />
                    </CardContent>
                  </Card>

                  {/* Postes d'Exécution Vacants */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Postes d'Exécution Vacants</span>
                        <Badge variant="outline">{data?.repartition_par_niveau.execution.vacants || 0}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PostesVacantsGrid
                        level="execution"
                        count={data?.repartition_par_niveau.execution.vacants || 0}
                        searchTerm={searchTerm}
                        selectedStatus={selectedStatus}
                      />
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique d'évolution */}
        <Card>
          <CardHeader>
                  <CardTitle>Évolution du Recrutement</CardTitle>
                  <CardDescription>Tendances sur les 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
                  <div className="space-y-3">
                    {data?.graphiques.evolution_recrutement.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.mois}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-xs">Nouveaux: {item.nouveaux}</span>
                          <span className="text-xs">Mutations: {item.mutations}</span>
                          <span className="text-sm font-semibold">{item.total_actifs}</span>
                    </div>
                  </div>
                ))}
              </div>
          </CardContent>
        </Card>

              {/* Mobilité géographique */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Mobilité Géographique
            </CardTitle>
                  <CardDescription>Répartition territoriale des affectations</CardDescription>
          </CardHeader>
          <CardContent>
                  <div className="space-y-3">
                    {data?.graphiques.mobilite_geographique.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.region}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm">Affectés: {item.affectes}</span>
                          <span className="text-xs text-orange-600">Mutations: {item.demandes_mutation}</span>
              </div>
                </div>
              ))}
            </div>
        </CardContent>
      </Card>
                    </div>
        </TabsContent>
              </Tabs>

        {/* Modal de gestion des mutations */}
        <Dialog open={isMutationModalOpen} onOpenChange={setIsMutationModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Gestion des Mutations & Affectations</DialogTitle>
              <DialogDescription>
                Gérer les mutations, affectations et promotions des fonctionnaires
              </DialogDescription>
            </DialogHeader>
            <MutationManagementForm onClose={() => setIsMutationModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}

// Composant pour afficher les postes vacants
function PostesVacantsGrid({
  level,
  count,
  searchTerm,
  selectedStatus
}: {
  level: string;
  count: number;
  searchTerm: string;
  selectedStatus: string;
}) {
  // Génération de données exemple pour les postes vacants
  const generatePostesVacants = (niveau: string, nombre: number) => {
    const organismes = [
      'Ministère de la Santé', 'Ministère de l\'Éducation', 'Ministère de la Justice',
      'DGDI', 'DGI', 'CNSS', 'CNAMGS', 'Mairie de Libreville', 'Préfecture Estuaire'
    ];

    const postesParNiveau = {
      direction: ['Directeur', 'Directeur Adjoint', 'Chef de Service', 'Responsable'],
      encadrement: ['Chef de Bureau', 'Superviseur', 'Coordinateur', 'Gestionnaire'],
      execution: ['Agent', 'Secrétaire', 'Assistant', 'Technicien']
    };

    return Array.from({ length: Math.min(nombre, 20) }, (_, i) => {
      const organisme = organismes[i % organismes.length];
      const posteTitres = postesParNiveau[niveau as keyof typeof postesParNiveau] || ['Poste'];
      const titre = posteTitres[i % posteTitres.length];

      return {
        id: `${niveau}-${i + 1}`,
        titre: `${titre} ${organisme}`,
        organisme,
        niveau,
        dateVacance: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        priorite: Math.random() > 0.7 ? 'haute' : Math.random() > 0.4 ? 'moyenne' : 'normale',
        salaire: 300000 + Math.floor(Math.random() * 500000)
      };
    });
  };

  const postes = generatePostesVacants(level, count);

  // Filtrage
  const filteredPostes = postes.filter(poste => {
    const matchSearch = !searchTerm ||
      poste.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poste.organisme.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = !selectedStatus ||
      poste.organisme.toLowerCase().includes(selectedStatus.toLowerCase());

    return matchSearch && matchStatus;
  });

  if (filteredPostes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Aucun poste vacant trouvé pour ce niveau</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredPostes.map((poste) => (
        <Card key={poste.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-sm">{poste.titre}</h4>
                <p className="text-xs text-gray-500">{poste.organisme}</p>
              </div>
              <Badge
                variant={
                  poste.priorite === 'haute' ? 'destructive' :
                  poste.priorite === 'moyenne' ? 'default' : 'secondary'
                }
                className="text-xs"
              >
                {poste.priorite}
              </Badge>
            </div>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Vacant depuis:</span>
                <span>{poste.dateVacance.toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex justify-between">
                <span>Salaire base:</span>
                <span className="font-medium">{poste.salaire.toLocaleString()} FCFA</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" className="flex-1">
                <Eye className="h-3 w-3 mr-1" />
                Détails
              </Button>
              <Button size="sm" className="flex-1">
                <UserPlus className="h-3 w-3 mr-1" />
                Affecter
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Composant pour créer un nouveau poste
function CreatePosteForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    titre: '',
    organisme: '',
    niveau: '',
    description: '',
    salaire: '',
    prerequis: ''
  });

  const handleSubmit = () => {
    toast.success('Nouveau poste créé avec succès !');
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre du poste</label>
          <Input
            placeholder="Ex: Directeur des Ressources Humaines"
            value={formData.titre}
            onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Organisme</label>
          <Select value={formData.organisme} onValueChange={(value) => setFormData(prev => ({ ...prev, organisme: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un organisme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ministere-sante">Ministère de la Santé</SelectItem>
              <SelectItem value="ministere-education">Ministère de l'Éducation</SelectItem>
              <SelectItem value="dgdi">DGDI</SelectItem>
              <SelectItem value="cnss">CNSS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Niveau hiérarchique</label>
          <Select value={formData.niveau} onValueChange={(value) => setFormData(prev => ({ ...prev, niveau: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="direction">Direction</SelectItem>
              <SelectItem value="encadrement">Encadrement</SelectItem>
              <SelectItem value="execution">Exécution</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Salaire base (FCFA)</label>
          <Input
            type="number"
            placeholder="Ex: 500000"
            value={formData.salaire}
            onChange={(e) => setFormData(prev => ({ ...prev, salaire: e.target.value }))}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description du poste</label>
        <Input
          placeholder="Description des responsabilités..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Prérequis</label>
        <Input
          placeholder="Ex: Diplôme Bac+5, 5 ans d'expérience..."
          value={formData.prerequis}
          onChange={(e) => setFormData(prev => ({ ...prev, prerequis: e.target.value }))}
        />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={handleSubmit}>
          <Plus className="h-4 w-4 mr-2" />
          Créer le Poste
        </Button>
      </div>
    </div>
  );
}

// Composant pour gérer les mutations
function MutationManagementForm({ onClose }: { onClose: () => void }) {
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPoste, setSelectedPoste] = useState('');

  const handleSubmit = () => {
    toast.success('Action RH effectuée avec succès !');
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Type d'action</label>
          <Select value={selectedAction} onValueChange={setSelectedAction}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="affecter">Affecter à un poste</SelectItem>
              <SelectItem value="muter">Muter vers un autre poste</SelectItem>
              <SelectItem value="promouvoir">Promouvoir</SelectItem>
              <SelectItem value="detacher">Détacher</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Fonctionnaire</label>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un fonctionnaire" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user1">Jean MBAMBA (Agent en attente)</SelectItem>
              <SelectItem value="user2">Marie NZANGUE (Chef de bureau)</SelectItem>
              <SelectItem value="user3">Paul NGUEMA (Directeur adjoint)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Poste de destination</label>
          <Select value={selectedPoste} onValueChange={setSelectedPoste}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un poste" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="poste1">Directeur RH - Min. Santé</SelectItem>
              <SelectItem value="poste2">Chef Service - DGDI</SelectItem>
              <SelectItem value="poste3">Gestionnaire - CNSS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedAction && selectedUser && selectedPoste && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Aperçu de l'action :</strong> {selectedAction} pour le fonctionnaire sélectionné vers le poste choisi.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={handleSubmit} disabled={!selectedAction || !selectedUser || !selectedPoste}>
          <Send className="h-4 w-4 mr-2" />
          Valider l'Action
        </Button>
      </div>
    </div>
  );
}
