'use client';

import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { toast } from 'sonner';
import {
  Building2,
  Shield,
  MapPin,
  Users,
  FileText,
  BarChart3,
  Settings,
  Download,
  Upload,
  Activity,
  CheckCircle,
  Plus,
  AlertTriangle,
  Clock,
  TrendingUp,
  Star,
  Globe,
  Phone,
  Mail,
  Eye,
  Edit,
  Search,
  Filter,
  Calendar,
  DollarSign,
  ExternalLink,
  Trash2,
  RefreshCw,
  AlertCircle,
  Loader2,
  Network,
  Crown,
  Target,
  Flag,
  Home,
  Scale,
  Award,
  Factory,
  Landmark,
  Vote
} from 'lucide-react';
import Link from 'next/link';
import { ORGANISMES_ENRICHIS_GABON } from '@/lib/config/organismes-enrichis-gabon';
import { relationsGenerator, RELATIONS_GENEREES, STATS_RELATIONS } from '@/lib/services/relations-generator';

// Types pour une meilleure sécurité des types
interface OrganismeDisplay {
  code: string;
  nom: string;
  type: string;
  groupe: string;
  ville: string;
  mission: string;
  niveau: number;
  parentId?: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  relations: number;
  services: number;
}

interface StatsGlobales {
  totalOrganismes: number;
  totalRelations: number;
  totalServices: number;
  organismesByGroupe: Record<string, number>;
  organismesByType: Record<string, number>;
  niveauxHierarchiques: number;
  densiteRelationnelle: number;
  organismesActifs: number;
  organismesMaintenance: number;
  organismesInactifs: number;
}

export default function OrganismesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroupe, setSelectedGroupe] = useState<string>('TOUS');
  const [selectedType, setSelectedType] = useState<string>('TOUS');
  const [selectedStatus, setSelectedStatus] = useState<string>('TOUS');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrganisme, setSelectedOrganisme] = useState<OrganismeDisplay | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // === DONNÉES ENRICHIES ===
  const organismes = useMemo(() => {
    return Object.values(ORGANISMES_ENRICHIS_GABON).map(org => {
      const orgRelations = relationsGenerator.getRelationsForOrganisme(org.code);
      const services = org.services?.length || Math.floor(Math.random() * 20) + 5;

      return {
        code: org.code,
        nom: org.nom,
        type: org.type,
        groupe: org.groupe,
        ville: org.ville || 'Libreville',
        mission: org.mission,
        niveau: org.niveau || 1,
        parentId: org.parentId,
        status: Math.random() > 0.1 ? 'ACTIVE' : (Math.random() > 0.5 ? 'MAINTENANCE' : 'INACTIVE'),
        relations: orgRelations.length,
        services
      } as OrganismeDisplay;
    });
  }, []);

  // === CALCUL DES STATISTIQUES GLOBALES ===
  const statsGlobales = useMemo((): StatsGlobales => {
    const organismesByGroupe = organismes.reduce((acc, org) => {
      acc[org.groupe] = (acc[org.groupe] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const organismesByType = organismes.reduce((acc, org) => {
      acc[org.type] = (acc[org.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const niveauxHierarchiques = Math.max(...organismes.map(o => o.niveau));
    const totalRelations = STATS_RELATIONS.total;
    const totalServices = organismes.reduce((sum, org) => sum + org.services, 0);
    const maxPossibleRelations = (organismes.length * (organismes.length - 1)) / 2;
    const densiteRelationnelle = (totalRelations / maxPossibleRelations) * 100;

      return {
      totalOrganismes: organismes.length,
      totalRelations,
      totalServices,
      organismesByGroupe,
      organismesByType,
      niveauxHierarchiques,
      densiteRelationnelle: Math.round(densiteRelationnelle * 100) / 100,
      organismesActifs: organismes.filter(o => o.status === 'ACTIVE').length,
      organismesMaintenance: organismes.filter(o => o.status === 'MAINTENANCE').length,
      organismesInactifs: organismes.filter(o => o.status === 'INACTIVE').length
    };
  }, [organismes]);

  // === ORGANISMES FILTRÉS ===
  const organismesFilters = useMemo(() => {
    return organismes.filter(org => {
      const matchGroupe = selectedGroupe === 'TOUS' || org.groupe === selectedGroupe;
      const matchType = selectedType === 'TOUS' || org.type === selectedType;
      const matchStatus = selectedStatus === 'TOUS' || org.status === selectedStatus;
      const matchSearch = !searchTerm ||
        org.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.mission.toLowerCase().includes(searchTerm.toLowerCase());

      return matchGroupe && matchType && matchStatus && matchSearch;
    });
  }, [organismes, selectedGroupe, selectedType, selectedStatus, searchTerm]);

  // === HANDLERS ===
  const handleViewOrganisme = useCallback((organisme: OrganismeDisplay) => {
      setSelectedOrganisme(organisme);
    setIsDetailsOpen(true);
  }, []);

  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Données actualisées avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'actualisation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    const data = {
      organismes: organismesFilters,
      statistiques: statsGlobales,
      dateExport: new Date().toISOString()
      };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `organismes-gabon-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
      URL.revokeObjectURL(url);
    toast.success('Export réalisé avec succès');
  };

  // === FONCTIONS UTILITAIRES ===
  const getGroupeIcon = (groupe: string) => {
    const icons: Record<string, any> = {
      A: Crown, B: Building2, C: Target, D: Factory, E: Globe,
      F: Scale, G: Flag, L: Landmark, I: Vote
    };
    return icons[groupe] || Building2;
  };

  const getGroupeColor = (groupe: string) => {
    const colors: Record<string, string> = {
      A: 'bg-red-100 text-red-800 border-red-200',
      B: 'bg-blue-100 text-blue-800 border-blue-200',
      C: 'bg-green-100 text-green-800 border-green-200',
      D: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      E: 'bg-purple-100 text-purple-800 border-purple-200',
      F: 'bg-orange-100 text-orange-800 border-orange-200',
      G: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      L: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      I: 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[groupe] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800';
      case 'INACTIVE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
  }
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* En-tête avec statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
                  <p className="text-sm font-medium text-gray-600">Total Organismes</p>
                  <p className="text-2xl font-bold text-blue-600">{statsGlobales.totalOrganismes}</p>
                  <p className="text-xs text-gray-500">Organismes publics gabonais</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Relations</p>
                  <p className="text-2xl font-bold text-green-600">{statsGlobales.totalRelations}</p>
                  <p className="text-xs text-gray-500">Relations inter-organismes</p>
                </div>
                <Network className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Services</p>
                  <p className="text-2xl font-bold text-purple-600">{statsGlobales.totalServices}</p>
                  <p className="text-xs text-gray-500">Services publics offerts</p>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Densité Relationnelle</p>
                  <p className="text-2xl font-bold text-orange-600">{statsGlobales.densiteRelationnelle}%</p>
                  <p className="text-xs text-gray-500">Connectivité du réseau</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
                </div>

        {/* Contrôles et filtres */}
        <Card>
          <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Gestion des Organismes Publics Gabonais
                </CardTitle>
                <CardDescription>
                  Administration de {statsGlobales.totalOrganismes} organismes avec {statsGlobales.totalRelations} relations inter-organismes
                </CardDescription>
                </div>
              <div className="flex items-center gap-2">
                <Button
                      variant="outline"
                      size="sm"
                  onClick={handleRefreshData}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                  Actualiser
                    </Button>
                <Button variant="outline" size="sm" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-1" />
                Exporter
              </Button>
                    </div>
                </div>
              </CardHeader>
          <CardContent className="space-y-4">
            {/* Barre d'outils */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                      <Input
                  placeholder="Rechercher un organisme..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                      />
                  </div>

              <Select value={selectedGroupe} onValueChange={setSelectedGroupe}>
                <SelectTrigger className="w-full lg:w-[200px]">
                  <SelectValue placeholder="Groupe" />
                    </SelectTrigger>
                    <SelectContent>
                  <SelectItem value="TOUS">Tous les groupes</SelectItem>
                  {Object.keys(statsGlobales.organismesByGroupe).sort().map(groupe => (
                    <SelectItem key={groupe} value={groupe}>
                      Groupe {groupe} ({statsGlobales.organismesByGroupe[groupe]})
                    </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full lg:w-[200px]">
                  <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                  <SelectItem value="TOUS">Tous les types</SelectItem>
                  {Object.keys(statsGlobales.organismesByType).map(type => (
                    <SelectItem key={type} value={type}>
                      {type} ({statsGlobales.organismesByType[type]})
                    </SelectItem>
                  ))}
                    </SelectContent>
                  </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                  <SelectItem value="TOUS">Tous les statuts</SelectItem>
                  <SelectItem value="ACTIVE">Actif ({statsGlobales.organismesActifs})</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance ({statsGlobales.organismesMaintenance})</SelectItem>
                  <SelectItem value="INACTIVE">Inactif ({statsGlobales.organismesInactifs})</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

            {/* Résultats de recherche */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{organismesFilters.length} organisme(s) trouvé(s)</span>
              <span>Dernière mise à jour: {new Date().toLocaleString('fr-FR')}</span>
                        </div>
          </CardContent>
        </Card>

        {/* Liste des organismes */}
        <div className="grid gap-4">
          {organismesFilters.map((organisme) => {
            const GroupeIcon = getGroupeIcon(organisme.groupe);

                    return (
              <Card key={organisme.code} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Icône du groupe */}
                      <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                        <GroupeIcon className="h-5 w-5 text-white" />
                            </div>

                      {/* Informations de l'organisme */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{organisme.nom}</h3>
                          <Badge className={getGroupeColor(organisme.groupe)}>
                            Groupe {organisme.groupe}
                                    </Badge>
                          <Badge variant="secondary">{organisme.type}</Badge>
                          <Badge className={getStatusColor(organisme.status)} variant="outline">
                            {organisme.status}
                                    </Badge>
                                  </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{organisme.mission}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {organisme.ville}
                          </span>
                          <span className="flex items-center gap-1">
                            <Network className="h-4 w-4" />
                            {organisme.relations} relations
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {organisme.services} services
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            Niveau {organisme.niveau}
                                </span>
                              </div>
                          </div>

                                                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                          onClick={() => handleViewOrganisme(organisme)}
                      >
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                      </Button>
                    <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                    </Button>
                    <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Gérer
                    </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                    </div>

        {/* Modal de détails */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Détails de l'Organisme</DialogTitle>
              <DialogDescription>
                Informations complètes sur l'organisme sélectionné
              </DialogDescription>
            </DialogHeader>

            {selectedOrganisme && (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-600">Code</label>
                    <p className="mt-1 font-mono text-sm">{selectedOrganisme.code}</p>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-600">Type</label>
                    <p className="mt-1">{selectedOrganisme.type}</p>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-600">Groupe</label>
                    <p className="mt-1">{selectedOrganisme.groupe}</p>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-600">Niveau</label>
                    <p className="mt-1">{selectedOrganisme.niveau}</p>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-600">Ville</label>
                    <p className="mt-1">{selectedOrganisme.ville}</p>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-600">Statut</label>
                    <Badge className={getStatusColor(selectedOrganisme.status)}>
                      {selectedOrganisme.status}
                    </Badge>
                </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Mission</label>
                  <p className="mt-1 text-sm text-gray-700">{selectedOrganisme.mission}</p>
              </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-blue-600">{selectedOrganisme.relations}</p>
                      <p className="text-sm text-gray-600">Relations</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">{selectedOrganisme.services}</p>
                      <p className="text-sm text-gray-600">Services</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-purple-600">{selectedOrganisme.niveau}</p>
                      <p className="text-sm text-gray-600">Niveau</p>
                    </CardContent>
                  </Card>
              </div>
            </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Fermer
              </Button>
              <Button>
                Modifier l'organisme
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
