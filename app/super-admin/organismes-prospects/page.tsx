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
import { toast } from 'sonner';
import {
  Target,
  Users,
  MapPin,
  Search,
  Filter,
  Download,
  RefreshCw,
  TrendingUp,
  UserCheck,
  BarChart3,
  ArrowRight,
  Eye,
  Settings,
  Loader2,
  Phone,
  Mail,
  Calendar,
  Star,
  AlertCircle,
  Euro,
  Building2,
  Briefcase,
  Crown,
  Activity,
  Plus,
  Edit,
  CheckCircle
} from 'lucide-react';

import { organismeCommercialService } from '@/lib/services/organisme-commercial.service';
import { OrganismeCommercial, ConversionProspectData, TypeContrat } from '@/lib/types/organisme';

interface LoadingStates {
  loading: boolean;
  refreshing: boolean;
  converting: string | null;
  updating: string | null;
  contactant: string | null;
}

interface ProspectsStats {
  totalProspects: number;
  prioriteHaute: number;
  prioriteMoyenne: number;
  prioriteBasse: number;
  valeurPipeline: number;
  conversionsObjectif: number;
  contactsRecents: number;
  repartitionSources: Record<string, number>;
}

export default function OrganismesProspectsPage() {
  // États de base
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPriorite, setSelectedPriorite] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedLocalisation, setSelectedLocalisation] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // États des données
  const [prospects, setProspects] = useState<OrganismeCommercial[]>([]);
  const [stats, setStats] = useState<ProspectsStats | null>(null);

  // États des modales
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<OrganismeCommercial | null>(null);

  // États des formulaires
  const [conversionForm, setConversionForm] = useState<ConversionProspectData>({
    organismeId: '',
    typeContrat: 'STANDARD',
    montantAnnuel: 2500000,
    dureeContrat: 24,
    servicesSelectionnes: [],
    responsableCommercial: 'Jean-Pierre MBOUMBA',
    dateSignature: new Date().toISOString().split('T')[0],
    conditions: 'Contrat standard avec clauses gouvernementales'
  });

  // États de chargement
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    loading: true,
    refreshing: false,
    converting: null,
    updating: null,
    contactant: null
  });

  // Charger les données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, loading: true }));

      await new Promise(resolve => setTimeout(resolve, 600));

      const allOrganismes = organismeCommercialService.getAllOrganismes();
      const prospectsData = allOrganismes.filter(org => org.status === 'PROSPECT');

      // Calcul des statistiques prospects
      const prospectsStats: ProspectsStats = {
        totalProspects: prospectsData.length,
        prioriteHaute: prospectsData.filter(p => p.prospectInfo?.priorite === 'HAUTE').length,
        prioriteMoyenne: prospectsData.filter(p => p.prospectInfo?.priorite === 'MOYENNE').length,
        prioriteBasse: prospectsData.filter(p => p.prospectInfo?.priorite === 'BASSE').length,
        valeurPipeline: prospectsData.length * 15000000, // Estimation
        conversionsObjectif: 25,
        contactsRecents: Math.floor(prospectsData.length * 0.3),
        repartitionSources: prospectsData.reduce((acc, prospect) => {
          const source = prospect.prospectInfo?.source || 'AUTRE';
          acc[source] = (acc[source] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      setProspects(prospectsData);
      setStats(prospectsStats);
      toast.success('Données des prospects chargées');
    } catch (error) {
      console.error('❌ Erreur chargement prospects:', error);
      toast.error('❌ Erreur lors du chargement');
    } finally {
      setLoadingStates(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Filtrer les prospects
  const filteredProspects = useMemo(() => {
    return prospects.filter(prospect => {
      const matchSearch = prospect.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospect.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPriorite = selectedPriorite === 'all' || prospect.prospectInfo?.priorite === selectedPriorite;
      const matchSource = selectedSource === 'all' || prospect.prospectInfo?.source === selectedSource;
      const matchLocalisation = selectedLocalisation === 'all' || prospect.localisation === selectedLocalisation;
      const matchType = selectedType === 'all' || prospect.type === selectedType;

      return matchSearch && matchPriorite && matchSource && matchLocalisation && matchType;
    });
  }, [prospects, searchTerm, selectedPriorite, selectedSource, selectedLocalisation, selectedType]);

  // Listes uniques pour les filtres
  const localisationsUniques = useMemo(() => [...new Set(prospects.map(p => p.localisation))], [prospects]);
  const typesUniques = useMemo(() => [...new Set(prospects.map(p => p.type))], [prospects]);

  // Gestionnaires d'événements
  const handleRefreshData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, refreshing: true }));
      await loadData();
    } finally {
      setLoadingStates(prev => ({ ...prev, refreshing: false }));
    }
  }, [loadData]);

  const handleConvertToClient = useCallback(async (prospect: OrganismeCommercial) => {
    try {
      setLoadingStates(prev => ({ ...prev, converting: prospect.id }));

      // Simulation conversion
      await new Promise(resolve => setTimeout(resolve, 2000));

      const success = organismeCommercialService.convertirEnClient(prospect.id, conversionForm);

      if (success) {
        toast.success(`✅ ${prospect.nom} converti en client avec succès !`);
        setIsConvertModalOpen(false);
        await loadData(); // Recharger les données
      } else {
        toast.error('❌ Erreur lors de la conversion');
      }
    } catch (error) {
      console.error('❌ Erreur conversion:', error);
      toast.error('❌ Erreur lors de la conversion');
    } finally {
      setLoadingStates(prev => ({ ...prev, converting: null }));
    }
  }, [conversionForm, loadData]);

  const handleContactProspect = useCallback(async (prospect: OrganismeCommercial) => {
    try {
      setLoadingStates(prev => ({ ...prev, contactant: prospect.id }));

      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success(`📞 Contact enregistré pour ${prospect.nom}`);
    } catch (error) {
      console.error('❌ Erreur contact:', error);
      toast.error('❌ Erreur lors de l\'enregistrement du contact');
    } finally {
      setLoadingStates(prev => ({ ...prev, contactant: null }));
    }
  }, []);

  // Fonctions utilitaires
  const formatPrix = (prix: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(prix);
  };

  const getPrioriteColor = (priorite?: string) => {
    switch (priorite) {
      case 'HAUTE': return 'bg-red-100 text-red-800 border-red-300';
      case 'MOYENNE': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'BASSE': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSourceColor = (source?: string) => {
    switch (source) {
      case 'REFERENCEMENT': return 'bg-blue-100 text-blue-800';
      case 'DEMANDE_DIRECTE': return 'bg-green-100 text-green-800';
      case 'RECOMMANDATION': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MINISTERE': return Building2;
      case 'MAIRIE': return MapPin;
      case 'DIRECTION_GENERALE': return Briefcase;
      case 'PREFECTURE': return MapPin;
      case 'PROVINCE': return Crown;
      default: return Building2;
    }
  };

  if (loadingStates.loading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chargement des prospects...</h3>
              <p className="text-muted-foreground">Analyse du pipeline commercial en cours</p>
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
                <Target className="h-8 w-8 text-blue-600" />
                Gestion des Prospects
              </h1>
              <p className="text-gray-600">
                Pipeline commercial et conversion des organismes prospectés
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
            </div>
          </div>
        </div>

        {/* Métriques prospects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Prospects</p>
                  <p className="text-2xl font-bold">{stats?.totalProspects || 0}</p>
                  <p className="text-blue-100 text-xs">En prospection</p>
                </div>
                <Target className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Priorité Haute</p>
                  <p className="text-2xl font-bold">{stats?.prioriteHaute || 0}</p>
                  <p className="text-red-100 text-xs">Action immédiate</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Valeur Pipeline</p>
                  <p className="text-2xl font-bold">{stats ? Math.floor(stats.valeurPipeline / 1000000000) : 0}Md</p>
                  <p className="text-green-100 text-xs">FCFA estimés</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Objectif Mois</p>
                  <p className="text-2xl font-bold">{stats?.conversionsObjectif || 0}</p>
                  <p className="text-purple-100 text-xs">Conversions</p>
                </div>
                <UserCheck className="h-8 w-8 text-purple-200" />
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
                Répartition par Priorité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Haute</span>
                  </div>
                  <Badge className="bg-red-100 text-red-800">{stats?.prioriteHaute || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Moyenne</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">{stats?.prioriteMoyenne || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Basse</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{stats?.prioriteBasse || 0}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Sources d'Acquisition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats?.repartitionSources || {}).map(([source, count]) => (
                  <div key={source} className="flex items-center justify-between">
                    <span className="text-sm">{source.replace('_', ' ')}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Activité Récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Contacts cette semaine</span>
                  <Badge className="bg-blue-100 text-blue-800">{stats?.contactsRecents || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Conversions en cours</span>
                  <Badge className="bg-green-100 text-green-800">3</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Propositions envoyées</span>
                  <Badge className="bg-yellow-100 text-yellow-800">8</Badge>
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
                    placeholder="Rechercher un prospect..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

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

              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes sources</SelectItem>
                  <SelectItem value="REFERENCEMENT">Référencement</SelectItem>
                  <SelectItem value="DEMANDE_DIRECTE">Demande directe</SelectItem>
                  <SelectItem value="RECOMMANDATION">Recommandation</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLocalisation} onValueChange={setSelectedLocalisation}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Localisation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes villes</SelectItem>
                  {localisationsUniques.map(ville => (
                    <SelectItem key={ville} value={ville}>{ville}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedPriorite('all');
                  setSelectedSource('all');
                  setSelectedLocalisation('all');
                  setSelectedType('all');
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des prospects */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProspects.map((prospect) => {
            const TypeIcon = getTypeIcon(prospect.type);

            return (
              <Card
                key={prospect.code}
                className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                      <TypeIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg leading-tight truncate" title={prospect.nom}>
                        {prospect.nom}
                      </h3>
                      <p className="text-gray-600 text-sm truncate">{prospect.type}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Code: <span className="font-mono">{prospect.code}</span>
                      </p>
                    </div>
                  </div>

                  {/* Badges de statut */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={getPrioriteColor(prospect.prospectInfo?.priorite)}>
                      {prospect.prospectInfo?.priorite || 'NON_DEFINIE'}
                    </Badge>

                    <Badge className={getSourceColor(prospect.prospectInfo?.source)}>
                      {prospect.prospectInfo?.source?.replace('_', ' ') || 'AUTRE'}
                    </Badge>
                  </div>

                  {/* Informations clés */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{prospect.localisation}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{prospect.stats.totalUsers} utilisateurs</span>
                    </div>
                    <div className="flex items-center text-sm text-blue-600">
                      <Euro className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>Valeur estimée: {formatPrix(15000000)}</span>
                    </div>
                    {prospect.prospectInfo?.dernierContact && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>
                          Dernier contact: {new Date(prospect.prospectInfo.dernierContact).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {prospect.prospectInfo?.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {prospect.prospectInfo.notes}
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
                        setSelectedProspect(prospect);
                        setConversionForm(prev => ({ ...prev, organismeId: prospect.id }));
                        setIsConvertModalOpen(true);
                      }}
                      disabled={loadingStates.converting === prospect.id}
                    >
                      {loadingStates.converting === prospect.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <UserCheck className="h-4 w-4 mr-2" />
                      )}
                      Convertir en Client
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleContactProspect(prospect)}
                        disabled={loadingStates.contactant === prospect.id}
                      >
                        {loadingStates.contactant === prospect.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Phone className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProspect(prospect);
                          setIsUpdateModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredProspects.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun prospect trouvé</h3>
              <p className="text-gray-600 mb-4">
                Aucun prospect ne correspond aux critères de recherche actuels.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedPriorite('all');
                  setSelectedSource('all');
                  setSelectedLocalisation('all');
                  setSelectedType('all');
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>

        {/* Footer avec résumé */}
        {filteredProspects.length > 0 && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Affichage de {filteredProspects.length} prospect(s) sur {prospects.length} total
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-red-600">
                    {filteredProspects.filter(p => p.prospectInfo?.priorite === 'HAUTE').length} Haute priorité
                  </span>
                  <span className="text-blue-600">
                    Valeur: {formatPrix(filteredProspects.length * 15000000)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal de conversion */}
        <Dialog open={isConvertModalOpen} onOpenChange={setIsConvertModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Convertir en Client</DialogTitle>
              <DialogDescription>
                Conversion du prospect "{selectedProspect?.nom}" en client actif
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="typeContrat">Type de Contrat</Label>
                  <Select
                    value={conversionForm.typeContrat}
                    onValueChange={(value: TypeContrat) =>
                      setConversionForm(prev => ({ ...prev, typeContrat: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STANDARD">Standard (2.5M FCFA/an)</SelectItem>
                      <SelectItem value="PREMIUM">Premium (8.5M FCFA/an)</SelectItem>
                      <SelectItem value="ENTERPRISE">Enterprise (25M FCFA/an)</SelectItem>
                      <SelectItem value="GOUVERNEMENTAL">Gouvernemental (50M FCFA/an)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="montantAnnuel">Montant Annuel (FCFA)</Label>
                  <Input
                    type="number"
                    value={conversionForm.montantAnnuel}
                    onChange={(e) => setConversionForm(prev => ({
                      ...prev,
                      montantAnnuel: parseInt(e.target.value)
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dureeContrat">Durée (mois)</Label>
                  <Input
                    type="number"
                    value={conversionForm.dureeContrat}
                    onChange={(e) => setConversionForm(prev => ({
                      ...prev,
                      dureeContrat: parseInt(e.target.value)
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="dateSignature">Date de Signature</Label>
                  <Input
                    type="date"
                    value={conversionForm.dateSignature}
                    onChange={(e) => setConversionForm(prev => ({
                      ...prev,
                      dateSignature: e.target.value
                    }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="responsableCommercial">Responsable Commercial</Label>
                <Input
                  value={conversionForm.responsableCommercial}
                  onChange={(e) => setConversionForm(prev => ({
                    ...prev,
                    responsableCommercial: e.target.value
                  }))}
                />
              </div>

              <div>
                <Label htmlFor="conditions">Conditions Particulières</Label>
                <Textarea
                  value={conversionForm.conditions}
                  onChange={(e) => setConversionForm(prev => ({
                    ...prev,
                    conditions: e.target.value
                  }))}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsConvertModalOpen(false)}>
                  Annuler
                </Button>
                <Button
                  onClick={() => selectedProspect && handleConvertToClient(selectedProspect)}
                  disabled={!selectedProspect || loadingStates.converting === selectedProspect?.id}
                >
                  {loadingStates.converting === selectedProspect?.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Conversion...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmer la Conversion
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
