'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { OrganismeKnowledgeCard } from '@/components/knowledge/organisme-knowledge-card';
import {
  ORGANISMES_KNOWLEDGE_BASE,
  getKnowledgeBaseStats,
  getOrganismesByType,
  searchOrganismes,
  OrganismeKnowledge
} from '@/lib/data/organismes-knowledge-base';
import {
  Search,
  Building2,
  BarChart3,
  Database,
  Filter,
  TrendingUp,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  BookOpen,
  Globe,
  Users,
  FileText,
  RefreshCw
} from 'lucide-react';

export default function KnowledgeBasePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedFiabilite, setSelectedFiabilite] = useState<string>('all');
  const [selectedOrganisme, setSelectedOrganisme] = useState<OrganismeKnowledge | null>(null);
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');

  // Calcul des statistiques
  const stats = useMemo(() => getKnowledgeBaseStats(), []);

  // Filtrage des organismes
  const filteredOrganismes = useMemo(() => {
    let result = ORGANISMES_KNOWLEDGE_BASE;

    // Recherche textuelle
    if (searchTerm) {
      result = searchOrganismes(searchTerm);
    }

    // Filtre par type
    if (selectedType !== 'all') {
      result = result.filter(org => org.type === selectedType);
    }

    // Filtre par fiabilité
    if (selectedFiabilite !== 'all') {
      result = result.filter(org => org.metadonnees.fiabilite === selectedFiabilite);
    }

    return result;
  }, [searchTerm, selectedType, selectedFiabilite]);

  const getTypeColor = (type: OrganismeKnowledge['type']) => {
    switch (type) {
      case 'MINISTERE': return 'bg-blue-500';
      case 'DIRECTION_GENERALE': return 'bg-green-500';
      case 'AGENCE': return 'bg-orange-500';
      case 'ETABLISSEMENT_PUBLIC': return 'bg-purple-500';
      case 'ORGANISME_SPECIALISE': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: OrganismeKnowledge['type']) => {
    switch (type) {
      case 'MINISTERE': return 'Ministère';
      case 'DIRECTION_GENERALE': return 'Direction Générale';
      case 'AGENCE': return 'Agence';
      case 'ETABLISSEMENT_PUBLIC': return 'Établissement Public';
      case 'ORGANISME_SPECIALISE': return 'Organisme Spécialisé';
      default: return type;
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Database className="h-8 w-8 text-blue-500" />
              Base de Connaissances des Organismes
            </h1>
            <p className="text-muted-foreground mt-1">
              Informations complètes et vérifiées sur {stats.totalOrganismes} organismes gabonais
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
            <Button className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Organismes</p>
                  <p className="text-3xl font-bold">{stats.totalOrganismes}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Complétude Moyenne</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completudeMoyenne}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fiabilité Haute</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.fiabiliteHaute}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dernière MAJ</p>
                  <p className="text-lg font-bold">{new Date(stats.derniereMiseAJour).toLocaleDateString()}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sources Vérifiées</p>
                  <p className="text-3xl font-bold text-indigo-600">15+</p>
                </div>
                <Globe className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Répartition par type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Répartition par Type d'Organisme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(stats.repartitionParType).map(([type, count]) => (
                <div key={type} className="text-center p-4 rounded-lg border">
                  <div className={`w-12 h-12 rounded-full ${getTypeColor(type as any)} mx-auto mb-2 flex items-center justify-center`}>
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <p className="font-semibold text-2xl">{count}</p>
                  <p className="text-sm text-muted-foreground">{getTypeLabel(type as any)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filtres et recherche */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Recherche et Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, sigle ou description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Type d'organisme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="MINISTERE">Ministères</SelectItem>
                  <SelectItem value="DIRECTION_GENERALE">Directions Générales</SelectItem>
                  <SelectItem value="AGENCE">Agences</SelectItem>
                  <SelectItem value="ETABLISSEMENT_PUBLIC">Établissements Publics</SelectItem>
                  <SelectItem value="ORGANISME_SPECIALISE">Organismes Spécialisés</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedFiabilite} onValueChange={setSelectedFiabilite}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Fiabilité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes fiabilités</SelectItem>
                  <SelectItem value="HAUTE">Haute</SelectItem>
                  <SelectItem value="MOYENNE">Moyenne</SelectItem>
                  <SelectItem value="FAIBLE">Faible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(searchTerm || selectedType !== 'all' || selectedFiabilite !== 'all') && (
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">
                  {filteredOrganismes.length} résultat(s) trouvé(s)
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('all');
                    setSelectedFiabilite('all');
                  }}
                >
                  Réinitialiser
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Liste des organismes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Organismes ({filteredOrganismes.length})
            </h2>
          </div>

          {filteredOrganismes.length > 0 ? (
            <div className="grid gap-4">
              {filteredOrganismes.map((organisme) => (
                <Dialog key={organisme.id}>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer">
                      <OrganismeKnowledgeCard
                        organisme={organisme}
                        showFullDetails={false}
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Détails Complets - {organisme.nom}</DialogTitle>
                      <DialogDescription>
                        Informations complètes de la base de connaissances
                      </DialogDescription>
                    </DialogHeader>
                    <OrganismeKnowledgeCard
                      organisme={organisme}
                      showFullDetails={true}
                    />
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun organisme trouvé</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Essayez de modifier vos critères de recherche ou de supprimer les filtres.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('all');
                    setSelectedFiabilite('all');
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Informations sur la base de connaissances */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              À propos de la Base de Connaissances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Sources d'information</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Sites web officiels des organismes</li>
                  <li>• Profils LinkedIn institutionnels</li>
                  <li>• Communiqués et rapports officiels</li>
                  <li>• Documentation administrative publique</li>
                  <li>• Textes législatifs et réglementaires</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Mise à jour</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Actualisation continue des informations</li>
                  <li>• Vérification des sources multiples</li>
                  <li>• Validation par recoupement</li>
                  <li>• Suivi des changements organisationnels</li>
                  <li>• Amélioration de la complétude des données</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Cette base de connaissances est maintenue à jour pour fournir des informations
                précises et complètes sur les organismes publics gabonais. Les données sont
                vérifiées et enrichies régulièrement pour garantir leur pertinence et leur utilité
                dans le contexte de l'administration électronique.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
