'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import {
  Brain,
  Database,
  Search,
  Filter,
  RefreshCw,
  Target,
  Users,
  Building2,
  Eye,
  Download,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  Activity,
  BookOpen
} from 'lucide-react';

import { knowledgeBaseService, type OrganismeKnowledge, type KnowledgeAnalysis } from '@/lib/services/knowledge-base.service';
import { toast } from 'sonner';

export default function KnowledgeBasePage() {
  // États principaux
  const [organismes, setOrganismes] = useState<OrganismeKnowledge[]>([]);
  const [filteredOrganismes, setFilteredOrganismes] = useState<OrganismeKnowledge[]>([]);
  const [selectedOrganisme, setSelectedOrganisme] = useState<OrganismeKnowledge | null>(null);
  const [analysisResult, setAnalysisResult] = useState<KnowledgeAnalysis | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // États de filtrage
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImportance, setSelectedImportance] = useState('all');

  // États des modales
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  // Chargement initial des données
  useEffect(() => {
    loadKnowledgeBase();
  }, []);

  const loadKnowledgeBase = async () => {
    try {
      setLoading(true);

      // Charger tous les organismes enrichis
      const allOrganismes = knowledgeBaseService.getAllKnowledge();
      setOrganismes(allOrganismes);
      setFilteredOrganismes(allOrganismes);

      // Charger les statistiques
      const kbStats = knowledgeBaseService.getGlobalStats();
      setStats(kbStats);

      toast.success(`📚 Base de connaissances chargée - ${allOrganismes.length} organismes`);

    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement de la base de connaissances');
    } finally {
      setLoading(false);
    }
  };

  // Filtrage des organismes
  useEffect(() => {
    let filtered = organismes;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(org =>
        org.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(org => org.segments.category === selectedCategory);
    }

    // Filtre par importance
    if (selectedImportance !== 'all') {
      filtered = filtered.filter(org => org.segments.importance === selectedImportance);
    }

    setFilteredOrganismes(filtered);
  }, [organismes, searchTerm, selectedCategory, selectedImportance]);

  // Ouvrir l'analyse détaillée d'un organisme
  const handleViewAnalysis = (organisme: OrganismeKnowledge) => {
    setSelectedOrganisme(organisme);

    // Charger l'analyse IA si disponible
    const analysis = knowledgeBaseService.getAnalysisResult(organisme.id);
    setAnalysisResult(analysis);

    setIsAnalysisModalOpen(true);
  };

  // Utilitaires d'affichage
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'STRATEGIQUE': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'OPERATIONNEL': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'SUPPORT': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'TECHNIQUE': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'CRITIQUE': return 'bg-red-100 text-red-800 border-red-300';
      case 'IMPORTANTE': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'NORMALE': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'FAIBLE': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCompletenessColor = (completeness: number) => {
    if (completeness >= 80) return 'text-green-600';
    if (completeness >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="h-8 w-8 text-purple-500" />
              Base de Connaissances IA
            </h1>
            <p className="text-muted-foreground">
              Analyse intelligente et enrichissement automatique des données organisationnelles
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadKnowledgeBase} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Statistiques globales */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Organismes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrganismes}</p>
                  </div>
                  <Database className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Complétude Moyenne</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(stats.moyenneCompletude)}%</p>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Score Numérique</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(stats.moyenneNumerisation)}%</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Critiques</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.organismesCritiques}</p>
                    <p className="text-xs text-red-600">Haute importance</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filtres */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="🔍 Rechercher un organisme..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes catégories</SelectItem>
                  <SelectItem value="STRATEGIQUE">Stratégique</SelectItem>
                  <SelectItem value="OPERATIONNEL">Opérationnel</SelectItem>
                  <SelectItem value="SUPPORT">Support</SelectItem>
                  <SelectItem value="TECHNIQUE">Technique</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedImportance} onValueChange={setSelectedImportance}>
                <SelectTrigger>
                  <SelectValue placeholder="Importance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes importances</SelectItem>
                  <SelectItem value="CRITIQUE">Critique</SelectItem>
                  <SelectItem value="IMPORTANTE">Importante</SelectItem>
                  <SelectItem value="NORMALE">Normale</SelectItem>
                  <SelectItem value="FAIBLE">Faible</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedImportance('all');
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des organismes */}
        <Card>
          <CardHeader>
            <CardTitle>Organismes Enrichis ({filteredOrganismes.length})</CardTitle>
            <CardDescription>
              Base de connaissances intelligente avec analyse IA et segmentation automatique
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredOrganismes.map((organisme) => (
                <Card key={organisme.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* En-tête de l'organisme */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg leading-tight">{organisme.nom}</h3>
                          <p className="text-sm text-muted-foreground">{organisme.code}</p>
                        </div>
                      </div>

                      {/* Badges de classification */}
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getCategoryColor(organisme.segments.category)}>
                          {organisme.segments.category}
                        </Badge>
                        <Badge className={getImportanceColor(organisme.segments.importance)}>
                          {organisme.segments.importance}
                        </Badge>
                      </div>

                      {/* Métriques */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Complétude</span>
                          <span className={`font-medium ${getCompletenessColor(organisme.metadonnees.completude)}`}>
                            {organisme.metadonnees.completude}%
                          </span>
                        </div>
                        <Progress
                          value={organisme.metadonnees.completude}
                          className="h-2"
                        />

                        <div className="flex items-center justify-between text-sm">
                          <span>Score Numérique</span>
                          <span className="font-medium">
                            {Math.round(organisme.analytics.scoreNumerisation)}%
                          </span>
                        </div>
                        <Progress
                          value={organisme.analytics.scoreNumerisation}
                          className="h-2"
                        />
                      </div>

                      {/* Analytics */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {organisme.intervenants.length} intervenants
                        </div>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {organisme.structure.departments.length} départements
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          {organisme.analytics.efficaciteProcessus}% efficacité
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {organisme.metadonnees.fiabilite}% fiabilité
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewAnalysis(organisme)}
                          className="flex-1"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Analyser
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredOrganismes.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">Aucun organisme trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  Aucun organisme ne correspond à vos critères de recherche.
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedImportance('all');
                }}>
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal d'analyse détaillée */}
        <Dialog open={isAnalysisModalOpen} onOpenChange={setIsAnalysisModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Analyse Détaillée : {selectedOrganisme?.nom}
              </DialogTitle>
              <DialogDescription>
                Intelligence artificielle et analytics pour cet organisme
              </DialogDescription>
            </DialogHeader>

            {selectedOrganisme && (
              <div className="space-y-6">
                {/* Vue d'ensemble */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Informations Générales</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">Nom complet</p>
                        <p className="text-sm">{selectedOrganisme.nom}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Type</p>
                        <p className="text-sm">{selectedOrganisme.type}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Code</p>
                        <p className="text-sm">{selectedOrganisme.code}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Classification</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Catégorie</p>
                        <Badge className={getCategoryColor(selectedOrganisme.segments.category)}>
                          {selectedOrganisme.segments.category}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Importance</p>
                        <Badge className={getImportanceColor(selectedOrganisme.segments.importance)}>
                          {selectedOrganisme.segments.importance}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Complexité</p>
                        <Badge variant="outline">{selectedOrganisme.segments.complexite}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedOrganisme.metadonnees.completude}%</div>
                        <div className="text-sm text-muted-foreground">Complétude</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{selectedOrganisme.analytics.scoreNumerisation}%</div>
                        <div className="text-sm text-muted-foreground">Numérique</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{selectedOrganisme.analytics.efficaciteProcessus}%</div>
                        <div className="text-sm text-muted-foreground">Efficacité</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{selectedOrganisme.intervenants.length}</div>
                        <div className="text-sm text-muted-foreground">Intervenants</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Analyse SWOT si disponible */}
                {analysisResult && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-green-600">Forces</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {analysisResult.analysis.strengths.map((strength, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{strength}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-orange-600">Recommandations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {analysisResult.analysis.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Info className="h-4 w-4 text-blue-500" />
                              <span className="text-sm">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
