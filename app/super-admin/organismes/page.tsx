/* @ts-nocheck */
/* eslint-disable react/no-unknown-property */
/* webhint-disable no-inline-styles */
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { ConversionModal } from '@/components/commercial/conversion-modal';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Settings,
  Users,
  FileText,
  MapPin,
  Phone,
  Mail,
  Globe,
  Shield,
  Activity,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  TrendingUp,
  AlertTriangle,
  Download,
  Upload,
  Info,
  Target,
  Euro,
  Calendar,
  UserCheck,
  ArrowRight
} from 'lucide-react';

import { getAllAdministrations } from '@/lib/data/gabon-administrations';
import { ORGANISMES_BRANDING } from '@/lib/config/organismes-branding';
import { organismeCommercialService } from '@/lib/services/organisme-commercial.service';
import { OrganismeCommercial, TypeContrat } from '@/lib/types/organisme';
import { getOrganismeDetails, hasOrganismeDetails } from '@/lib/data/organismes-detailles';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function SuperAdminOrganismesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatut, setSelectedStatut] = useState('');
  const [selectedPriorite, setSelectedPriorite] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrganisme, setSelectedOrganisme] = useState<OrganismeCommercial | null>(null);
  const [conversionModalOpen, setConversionModalOpen] = useState(false);
  const [organismeToConvert, setOrganismeToConvert] = useState<OrganismeCommercial | null>(null);
  const [organismes, setOrganismes] = useState<OrganismeCommercial[]>([]);
  const [statsCommerciales, setStatsCommerciales] = useState(null);

  // Charger les données commerciales
  useEffect(() => {
    loadOrganismesData();
  }, []);

  const loadOrganismesData = () => {
    const allOrganismes = organismeCommercialService.getAllOrganismes();
    const stats = organismeCommercialService.getStatistiquesCommerciales();
    setOrganismes(allOrganismes);
    setStatsCommerciales(stats);
  };

  // Organismes principaux qui gèrent les services (28 organismes)
  const organismesPrincipaux = [
    'MIN_REF_INST', 'MIN_AFF_ETR', 'MIN_INT_SEC', 'MIN_JUSTICE', 'MIN_DEF_NAT',
    'MIN_ECO_FIN', 'MIN_MINES_PETR', 'MIN_SANTE', 'MIN_EDUC_NAT', 'MIN_ENS_SUP',
    'MIN_TRAV_EMPL', 'MIN_AGR_ELEV', 'MIN_EAUX_FOR', 'MIN_TOUR_ARTIS', 'MIN_TRANSP',
    'MIN_NUM_POST', 'MIN_ENV_CLIM', 'MIN_HABIT_URB', 'MIN_SPORT_CULT', 'MIN_JEUN_CIVIQ',
    'DGDI', 'DGI', 'DOUANES', 'CNSS', 'CNAMGS', 'MAIRIE_LBV', 'MAIRIE_PG', 'PREF_EST'
  ];

  // Séparer prospects et clients
  const prospects = organismes.filter(org => org.status === 'PROSPECT');
  const clients = organismes.filter(org => org.status === 'CLIENT');

  // Fonction de priorité pour le tri
  const getOrganismePriority = (organismeCode: string) => {
    if (organismesPrincipaux.includes(organismeCode)) return 1; // 28 organismes principaux
    return 2; // Autres organismes
  };

  // Filtrer prospects
  const filteredProspects = prospects.filter(org => {
    const matchSearch = org.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       org.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = !selectedType || org.type === selectedType;
    const matchPriorite = !selectedPriorite || org.prospectInfo?.priorite === selectedPriorite;

    return matchSearch && matchType && matchPriorite;
  }).sort((a, b) => {
    // Tri selon la priorité : 28 organismes principaux → autres
    const priorityA = getOrganismePriority(a.code);
    const priorityB = getOrganismePriority(b.code);

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return a.nom.localeCompare(b.nom);
  });

  // Filtrer clients
  const filteredClients = clients.filter(org => {
    const matchSearch = org.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       org.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = !selectedType || org.type === selectedType;

    return matchSearch && matchType;
  }).sort((a, b) => {
    // Tri selon la priorité : 28 organismes principaux → autres
    const priorityA = getOrganismePriority(a.code);
    const priorityB = getOrganismePriority(b.code);

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return a.nom.localeCompare(b.nom);
  });

  // Statistiques
  const stats = {
    total: organismes.length,
    prospects: prospects.length,
    clients: clients.length,
    conversionRate: organismes.length > 0 ? (clients.length / organismes.length * 100).toFixed(1) : 0,
    chiffreAffaires: statsCommerciales?.clients.chiffreAffairesTotal || 0,
    ministeres: organismes.filter(o => o.type === 'MINISTERE').length,
    mairies: organismes.filter(o => o.type === 'MAIRIE').length,
    directions: organismes.filter(o => o.type === 'DIRECTION_GENERALE').length
  };

  // Types d'organismes uniques
  const typesUniques = [...new Set(organismes.map(o => o.type))];

  const getStatutColor = () => {
    return 'bg-green-100 text-green-800'; // Tous actifs par défaut
  };

  const getContratTypeColor = (type?: TypeContrat) => {
    if (!type) return 'bg-gray-100 text-gray-800 border-gray-300';

    switch (type) {
      case 'STANDARD': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'PREMIUM': return 'bg-green-100 text-green-800 border-green-300';
      case 'ENTERPRISE': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'GOUVERNEMENTAL': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatPrix = (prix: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(prix);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'MINISTERE': return Building2;
      case 'MAIRIE': return MapPin;
      case 'DIRECTION_GENERALE': return Shield;
      case 'PREFECTURE': return MapPin;
      case 'PROVINCE': return Globe;
      default: return Building2;
    }
  };

  const getBrandingForOrganisme = (organismeCode) => {
    return Object.values(ORGANISMES_BRANDING).find(b => b.code === organismeCode) || {
      code: 'DEFAULT',
      nom: 'Organisme',
      nomCourt: 'ORG',
      couleurPrimaire: '#3B82F6',
      couleurSecondaire: '#10B981',
      couleurAccent: '#6366F1',
      gradientClasses: 'from-blue-600 to-blue-800',
      backgroundClasses: 'from-blue-50 via-white to-blue-100',
      icon: Building2,
      slogan: 'Service Public',
      description: 'Au service du citoyen'
    };
  };

    const handleCreateOrganisme = () => {
    toast.success('Fonctionnalité de création d\'organisme en cours de développement');
    setIsCreateModalOpen(false);
  };

  const handleEditOrganisme = (organisme) => {
    setSelectedOrganisme(organisme);
    toast.info(`Édition de ${organisme.nom} en cours de développement`);
  };

  const handleDeleteOrganisme = (organisme) => {
    toast.error(`Suppression de ${organisme.nom} en cours de développement`);
  };

  const handleToggleStatut = (organisme) => {
    toast.success(`Statut de ${organisme.nom} modifié avec succès`);
  };

  const handleConversionSuccess = () => {
    loadOrganismesData(); // Recharger les données après conversion
    setConversionModalOpen(false);
    setOrganismeToConvert(null);
  };

  const handleAccederOrganisme = (organisme: OrganismeCommercial) => {
    const details = getOrganismeDetails(organisme.code);
    if (details && details.url) {
      router.push(details.url);
    } else {
      toast.info(`Page d'accueil de ${organisme.nom} en cours de développement`);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des Organismes
          </h1>
          <p className="text-gray-600">
            Administration complète des organismes publics gabonais - Création, modification, paramétrage
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Prospects</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.prospects}</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clients</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.clients}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ministères</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.ministeres}</p>
                </div>
                <Building2 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mairies</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.mairies}</p>
                </div>
                <MapPin className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Directions</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.directions}</p>
                </div>
                <Shield className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Information sur l'ordre et priorités */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Gestion Commerciale des Organismes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-blue-800 mb-2">🎯 Prospects ({stats.prospects})</h4>
                    <p className="text-sm text-blue-700 mb-2">
                      Organismes publics intéressés par les services ADMIN.GA
                    </p>
                    <div className="text-sm text-blue-600">
                      • Référencement et prospection active<br/>
                      • Classification par priorité (Haute/Moyenne/Basse)<br/>
                      • Suivi commercial et négociation<br/>
                      • Conversion en clients via contrats
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-2">✅ Clients ({stats.clients})</h4>
                    <p className="text-sm text-blue-700 mb-2">
                      Organismes avec contrats actifs et gestion complète
                    </p>
                    <div className="text-sm text-blue-600">
                      • Contrats Standard, Premium, Enterprise, Gouvernemental<br/>
                      • CA Total: <strong>{formatPrix(stats.chiffreAffaires)}</strong><br/>
                      • Gestion des renouvellements et évolutions<br/>
                      • Support et accompagnement dédiés
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <span className="font-medium">🚀 Taux de conversion :</span>
                    {stats.conversionRate}% des prospects deviennent clients.
                    Utilisez le bouton <Badge className="bg-green-600 text-white mx-1">Passer Client</Badge>
                    pour convertir un prospect.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="prospects" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="prospects" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Prospects ({stats.prospects})
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Clients ({stats.clients})
              </TabsTrigger>
              <TabsTrigger value="creation">Créer un Organisme</TabsTrigger>
              <TabsTrigger value="analytics">Analytics Commercial</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvel Organisme
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Créer un Nouvel Organisme</DialogTitle>
                    <DialogDescription>
                      Ajoutez un nouvel organisme public à la plateforme ADMIN.GA
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="nom">Nom de l'organisme</Label>
                        <Input id="nom" placeholder="Ex: Ministère de la Santé" />
                      </div>
                      <div>
                        <Label htmlFor="code">Code organisme</Label>
                        <Input id="code" placeholder="Ex: MIN_SANTE" />
                      </div>
                      <div>
                        <Label htmlFor="type">Type d'organisme</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MINISTERE">Ministère</SelectItem>
                            <SelectItem value="DIRECTION_GENERALE">Direction Générale</SelectItem>
                            <SelectItem value="MAIRIE">Mairie</SelectItem>
                            <SelectItem value="PREFECTURE">Préfecture</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="localisation">Localisation</Label>
                        <Input id="localisation" placeholder="Ex: Libreville" />
                      </div>
                      <div>
                        <Label htmlFor="contact">Email de contact</Label>
                        <Input id="contact" type="email" placeholder="contact@organisme.ga" />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Description de l'organisme..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleCreateOrganisme}>
                      Créer l'organisme
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Onglet Prospects */}
          <TabsContent value="prospects" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      Gestion des Prospects
                    </CardTitle>
                    <CardDescription>
                      Organismes publics intéressés par les services ADMIN.GA
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                    {stats.conversionRate}% de conversion
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filtres prospects */}
                <div className="flex flex-wrap gap-4 mb-6">
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

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrer par type" />
                    </SelectTrigger>
                    <SelectContent>
                      {typesUniques.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedPriorite} onValueChange={setSelectedPriorite}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrer par priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HAUTE">Priorité Haute</SelectItem>
                      <SelectItem value="MOYENNE">Priorité Moyenne</SelectItem>
                      <SelectItem value="BASSE">Priorité Basse</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedType('');
                      setSelectedPriorite('');
                    }}
                  >
                    Réinitialiser
                  </Button>
                </div>

                {/* Liste des prospects */}
                <div className="grid gap-4">
                  {filteredProspects.map((organisme) => {
                    const TypeIcon = getTypeIcon(organisme.type);
                    const branding = getBrandingForOrganisme(organisme.code);
                    const details = getOrganismeDetails(organisme.code);

                    return (
                      <Card key={organisme.code} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                                style={{ backgroundColor: branding.couleurPrimaire }}
                              >
                                <TypeIcon className="h-6 w-6" />
                              </div>

                              <div className="flex-1">
                                <h3 className="font-bold text-lg">{organisme.nom}</h3>
                                <p className="text-gray-600">{organisme.type}</p>
                                {details && (
                                  <p className="text-sm text-gray-500 mt-1">{details.description}</p>
                                )}
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="flex items-center text-sm text-gray-500">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {organisme.localisation}
                                  </span>
                                  <span className="flex items-center text-sm text-gray-500">
                                    <Users className="h-4 w-4 mr-1" />
                                    {organisme.stats.totalUsers} utilisateurs
                                  </span>
                                  {details && (
                                    <>
                                      <Badge variant="secondary" className="text-xs">
                                        {details.comptes} comptes
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {details.services} services
                                      </Badge>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="flex flex-col gap-1">
                                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                                    PROSPECT
                                  </Badge>
                                  {organismesPrincipaux.includes(organisme.code) && (
                                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                      PRINCIPAL
                                    </Badge>
                                  )}
                                  <Badge className={`
                                    ${organisme.prospectInfo?.priorite === 'HAUTE' ? 'bg-red-100 text-red-800 border-red-300' : ''}
                                    ${organisme.prospectInfo?.priorite === 'MOYENNE' ? 'bg-orange-100 text-orange-800 border-orange-300' : ''}
                                    ${organisme.prospectInfo?.priorite === 'BASSE' ? 'bg-gray-100 text-gray-800 border-gray-300' : ''}
                                  `}>
                                    {organisme.prospectInfo?.priorite}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  Code: {organisme.code}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Source: {organisme.prospectInfo?.source}
                                </p>
                              </div>

                              <div className="flex flex-col items-center gap-2">
                                {hasOrganismeDetails(organisme.code) && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => handleAccederOrganisme(organisme)}
                                  >
                                    <ArrowRight className="h-4 w-4 mr-1" />
                                    Accéder à {organisme.code}
                                  </Button>
                                )}
                                <div className="flex gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditOrganisme(organisme)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    size="sm"
                                    onClick={() => {
                                      setOrganismeToConvert(organisme);
                                      setConversionModalOpen(true);
                                    }}
                                  >
                                    <UserCheck className="h-4 w-4 mr-1" />
                                    Passer Client
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {filteredProspects.length === 0 && (
                    <div className="text-center py-12">
                      <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun prospect trouvé</h3>
                      <p className="text-gray-600">
                        Aucun prospect ne correspond aux critères de recherche actuels.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Clients */}
          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-green-600" />
                      Gestion des Clients
                    </CardTitle>
                    <CardDescription>
                      Organismes clients avec contrats actifs ADMIN.GA
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      {formatPrix(stats.chiffreAffaires)} CA Total
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                      {stats.clients} clients actifs
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filtres clients */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher un client..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrer par type" />
                    </SelectTrigger>
                    <SelectContent>
                      {typesUniques.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedType('');
                    }}
                  >
                    Réinitialiser
                  </Button>
                </div>

                {/* Liste des clients */}
                <div className="grid gap-4">
                  {filteredClients.map((organisme) => {
                    const TypeIcon = getTypeIcon(organisme.type);
                    const branding = getBrandingForOrganisme(organisme.code);
                    const details = getOrganismeDetails(organisme.code);

                    return (
                      <Card key={organisme.code} className="hover:shadow-md transition-shadow border-green-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                                style={{ backgroundColor: branding.couleurPrimaire }}
                              >
                                <TypeIcon className="h-6 w-6" />
                              </div>

                              <div className="flex-1">
                                <h3 className="font-bold text-lg">{organisme.nom}</h3>
                                <p className="text-gray-600">{organisme.type}</p>
                                {details && (
                                  <p className="text-sm text-gray-500 mt-1">{details.description}</p>
                                )}
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="flex items-center text-sm text-gray-500">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {organisme.localisation}
                                  </span>
                                  <span className="flex items-center text-sm text-gray-500">
                                    <Users className="h-4 w-4 mr-1" />
                                    {organisme.stats.totalUsers} utilisateurs
                                  </span>
                                  <span className="flex items-center text-sm text-green-600 font-medium">
                                    <Euro className="h-4 w-4 mr-1" />
                                    {formatPrix(organisme.clientInfo?.montantAnnuel || 0)}/an
                                  </span>
                                  {details && (
                                    <>
                                      <Badge variant="secondary" className="text-xs">
                                        {details.comptes} comptes
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {details.services} services
                                      </Badge>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="flex flex-col gap-1">
                                  <Badge className="bg-green-100 text-green-800 border-green-300">
                                    CLIENT
                                  </Badge>
                                  {organismesPrincipaux.includes(organisme.code) && (
                                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                      PRINCIPAL
                                    </Badge>
                                  )}
                                  <Badge className={getContratTypeColor(organisme.clientInfo?.type)}>
                                    {organisme.clientInfo?.type}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  Code: {organisme.code}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Expire: {organisme.clientInfo?.dateExpiration ? new Date(organisme.clientInfo.dateExpiration).toLocaleDateString('fr-FR') : 'N/A'}
                                </p>
                              </div>

                              <div className="flex flex-col items-center gap-2">
                                {hasOrganismeDetails(organisme.code) && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => handleAccederOrganisme(organisme)}
                                  >
                                    <ArrowRight className="h-4 w-4 mr-1" />
                                    Accéder à {organisme.code}
                                  </Button>
                                )}
                                <div className="flex gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditOrganisme(organisme)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedOrganisme(organisme)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {filteredClients.length === 0 && (
                    <div className="text-center py-12">
                      <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
                      <p className="text-gray-600">
                        Aucun client ne correspond aux critères de recherche actuels.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Création */}
          <TabsContent value="creation">
            <Card>
              <CardHeader>
                <CardTitle>Assistant de Création d'Organisme</CardTitle>
                <CardDescription>
                  Créez facilement un nouvel organisme public avec tous ses paramètres
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Assistant de création en cours de développement
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Utilisez le bouton "Nouvel Organisme" pour créer un organisme
                  </p>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ouvrir le formulaire de création
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Analytics */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Commercial</CardTitle>
                <CardDescription>
                  Analysez les performances commerciales et les tendances des organismes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Chiffre d'Affaires</h4>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                      <p className="text-2xl font-bold text-gray-900">{formatPrix(stats.chiffreAffaires)}</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      Chiffre d'affaires total généré par les organismes clients.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Conversion Rate</h4>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                      <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      Pourcentage de conversion des prospects en clients.
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-medium">Tendances de Conversion</h4>
                  <p className="text-sm text-gray-600">
                    Analysez les variations de la conversion rate au fil du temps.
                  </p>
                  <div className="mt-4">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                    <p className="text-sm text-gray-600">
                      Graphique des tendances de conversion.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de conversion */}
        {organismeToConvert && (
          <ConversionModal
            organisme={organismeToConvert}
            isOpen={conversionModalOpen}
            onClose={() => {
              setConversionModalOpen(false);
              setOrganismeToConvert(null);
            }}
            onSuccess={handleConversionSuccess}
          />
        )}
      </div>
    </AuthenticatedLayout>
  );
}
