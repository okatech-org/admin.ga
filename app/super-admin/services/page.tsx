/* @ts-nocheck */
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { toast } from 'sonner';
import { 
  FileText, 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Upload,
  Building2,
  Users,
  DollarSign,
  Calendar,
  BarChart3,
  Settings,
  Star,
  TrendingUp,
  MapPin,
  Scale,
  Calculator,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Import des vraies données
import { getAllServices, getOrganismeMapping } from '@/lib/data/gabon-services-detailles';

export default function SuperAdminServicesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedService, setSelectedService] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Récupération des vraies données depuis le fichier JSON
  const realServices = useMemo(() => {
    const services = getAllServices();
    const organismeMapping = getOrganismeMapping();
    
    return services.map((service, index) => {
      // Mapper les catégories du JSON aux catégories de l'interface
      const mapCategory = (nom: string) => {
        const name = nom.toLowerCase();
        if (name.includes('cni') || name.includes('passeport') || name.includes('nationalité')) return 'IDENTITE';
        if (name.includes('naissance') || name.includes('mariage') || name.includes('décès')) return 'ETAT_CIVIL';
        if (name.includes('permis de conduire') || name.includes('véhicule') || name.includes('transport')) return 'TRANSPORT';
        if (name.includes('médical') || name.includes('santé') || name.includes('exercice')) return 'SANTE';
        if (name.includes('cnss') || name.includes('emploi') || name.includes('travail') || name.includes('allocation')) return 'SOCIAL';
        if (name.includes('commerce') || name.includes('rccm') || name.includes('patente') || name.includes('entreprise')) return 'COMMERCE';
        if (name.includes('permis de construire') || name.includes('titre') || name.includes('urbanisme')) return 'LOGEMENT';
        if (name.includes('casier') || name.includes('légalisation') || name.includes('tribunal')) return 'JUSTICE';
        if (name.includes('impôt') || name.includes('fiscal') || name.includes('quitus')) return 'FISCAL';
        if (name.includes('inscription') || name.includes('bourse') || name.includes('diplôme')) return 'EDUCATION';
        return 'ADMINISTRATIF';
      };

      // Générer des métriques réalistes basées sur l'index et le type de service
      const generateMetrics = (serviceNom: string, idx: number) => {
        const baseMetrics = {
          'CNI_PREMIERE': { satisfaction: 87, demandes: 680, status: 'ACTIVE' },
          'PASSEPORT_PREMIER': { satisfaction: 94, demandes: 450, status: 'ACTIVE' },
          'PERMIS_CONDUIRE': { satisfaction: 76, demandes: 320, status: 'ACTIVE' },
          'ACTE_NAISSANCE': { satisfaction: 92, demandes: 1200, status: 'ACTIVE' },
          'IMMAT_CNSS': { satisfaction: 82, demandes: 180, status: 'MAINTENANCE' },
          'CERT_MEDICAL': { satisfaction: 91, demandes: 125, status: 'ACTIVE' }
        };
        
        const serviceKey = service.code as keyof typeof baseMetrics;
        const base = baseMetrics[serviceKey] || {
          satisfaction: 75 + (idx % 20),
          demandes: 50 + (idx % 150),
          status: idx % 10 === 0 ? 'MAINTENANCE' : 'ACTIVE'
        };
        
        return base;
      };

      const metrics = generateMetrics(service.nom, index);
      const organismeInfo = organismeMapping[service.organisme_responsable];

      return {
        id: index + 1,
        nom: service.nom,
        organisme: organismeInfo?.nom || service.organisme_responsable,
        categorie: mapCategory(service.nom),
        description: `${service.nom} - ${service.delai_traitement}`,
        duree: service.delai_traitement,
        cout: service.cout,
        status: metrics.status,
        satisfaction: metrics.satisfaction,
        demandes_mois: metrics.demandes,
        documents_requis: service.documents_requis,
        responsable: `Responsable ${service.organisme_responsable}`,
        telephone: `+241 01 ${String(10 + (index % 90)).padStart(2, '0')} ${String(10 + (index % 90)).padStart(2, '0')} ${String(10 + (index % 90)).padStart(2, '0')}`,
        email: `${service.organisme_responsable.toLowerCase()}@gouv.ga`,
        derniere_maj: new Date(2024, 0, 1 + (index % 30)).toISOString().split('T')[0],
        lieu: `Bureau ${service.organisme_responsable}`,
        code_service: service.code,
        validite: service.validite || 'Variable',
        type_organisme: service.type_organisme
      };
    });
  }, []);

  // Catégories mises à jour pour correspondre aux vraies données
  const CATEGORIES = {
    IDENTITE: { label: 'Identité', color: 'bg-blue-500', icon: FileText },
    ETAT_CIVIL: { label: 'État Civil', color: 'bg-purple-500', icon: Users },
    TRANSPORT: { label: 'Transport', color: 'bg-green-500', icon: MapPin },
    SANTE: { label: 'Santé', color: 'bg-red-500', icon: Star },
    SOCIAL: { label: 'Social', color: 'bg-orange-500', icon: Building2 },
    COMMERCE: { label: 'Commerce', color: 'bg-cyan-500', icon: DollarSign },
    LOGEMENT: { label: 'Logement', color: 'bg-yellow-500', icon: Building2 },
    JUSTICE: { label: 'Justice', color: 'bg-gray-600', icon: Scale },
    FISCAL: { label: 'Fiscal', color: 'bg-emerald-500', icon: Calculator },
    EDUCATION: { label: 'Éducation', color: 'bg-indigo-500', icon: GraduationCap },
    ADMINISTRATIF: { label: 'Administratif', color: 'bg-slate-500', icon: FileText }
  };

  const STATUS_CONFIG = {
    ACTIVE: { label: 'Actif', color: 'bg-green-500', icon: CheckCircle },
    MAINTENANCE: { label: 'Maintenance', color: 'bg-yellow-500', icon: AlertTriangle },
    INACTIVE: { label: 'Inactif', color: 'bg-gray-500', icon: XCircle },
  };

  // Calculs de statistiques
  const stats = {
    total: realServices.length,
    active: realServices.filter(s => s.status === 'ACTIVE').length,
    maintenance: realServices.filter(s => s.status === 'MAINTENANCE').length,
    totalDemandes: realServices.reduce((sum, s) => sum + (s.demandes_mois || 0), 0),
    satisfactionMoyenne: Math.round(
      realServices.reduce((sum, s) => sum + (s.satisfaction || 0), 0) / realServices.length
    ),
    categoriesUniques: Object.keys(CATEGORIES).length,
    organismes: [...new Set(realServices.map(s => s.organisme))].length
  };

  // Services par catégorie
  const servicesByCategory = Object.keys(CATEGORIES).map(cat => ({
    categorie: cat,
    label: CATEGORIES[cat].label,
    color: CATEGORIES[cat].color,
    count: realServices.filter(s => s.categorie === cat).length,
    services: realServices.filter(s => s.categorie === cat),
    satisfactionMoyenne: Math.round(
      realServices.filter(s => s.categorie === cat).reduce((sum, s) => sum + (s.satisfaction || 0), 0) / 
      realServices.filter(s => s.categorie === cat).length
    ),
    totalDemandes: realServices.filter(s => s.categorie === cat).reduce((sum, s) => sum + (s.demandes_mois || 0), 0)
  }));

  // Filtrage
  const filteredServices = realServices.filter(service => {
    const matchesSearch = service.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.organisme.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategorie === 'all' || service.categorie === selectedCategorie;
    const matchesStatus = selectedStatus === 'all' || service.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Actions
  const handleViewDetails = (service) => {
    setSelectedService(service);
    setIsDetailsOpen(true);
    toast.info(`Affichage des détails de ${service.nom}`);
  };

  const handleEdit = (service) => {
    toast.info(`Modification du service ${service.nom}...`);
    // TODO: Navigation vers page d'édition
  };

  const handleNavigateToAdministrations = () => {
    toast.success('Redirection vers Administrations...');
    router.push('/super-admin/administrations');
  };

  const handleNavigateToCreerOrganisme = () => {
    toast.success('Redirection vers Créer Organisme...');
    router.push('/super-admin/organisme/nouveau');
  };

  const exportToJSON = () => {
    try {
      const dataStr = JSON.stringify({
        exported_at: new Date().toISOString(),
        total_services: stats.total,
        services: filteredServices,
        statistics: stats,
        categories: servicesByCategory
      }, null, 2);
      
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `services-publics-gabon-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success('Export JSON réussi !');
    } catch (error) {
      toast.error('Erreur lors de l\'export JSON');
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Navigation contextuelle */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">🏢 Gestion des Organismes</h3>
                <p className="text-sm text-muted-foreground">Naviguez entre les différents volets de gestion</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleNavigateToAdministrations}>
                  <Building2 className="mr-2 h-4 w-4" />
                  Administrations
                </Button>
                <Button variant="outline" onClick={handleNavigateToCreerOrganisme}>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer Organisme
                </Button>
                <Button variant="default" asChild>
                  <Link href="/super-admin/services">
                    <FileText className="mr-2 h-4 w-4" />
                    Services Publics
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* En-tête */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-8 w-8 text-green-500" />
              Gestion des Services Publics
            </h1>
            <p className="text-muted-foreground">
              Administration de {stats.total} services publics répartis en {stats.categoriesUniques} catégories
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToJSON}>
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
            <Button onClick={handleNavigateToCreerOrganisme}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Service
            </Button>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Services</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.active} actifs, {stats.maintenance} en maintenance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Organismes</p>
                  <p className="text-2xl font-bold">{stats.organismes}</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.categoriesUniques} catégories de services
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Demandes Mensuelles</p>
                  <p className="text-2xl font-bold">{stats.totalDemandes.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    Volume d'activité total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Satisfaction Moyenne</p>
                  <p className="text-2xl font-bold">{stats.satisfactionMoyenne}%</p>
                  <p className="text-xs text-muted-foreground">
                    Qualité de service globale
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets de gestion */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="categories">Catégories</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Services les plus demandés */}
              <Card>
                <CardHeader>
                  <CardTitle>🔥 Services les Plus Demandés</CardTitle>
                  <CardDescription>Top 3 par volume mensuel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {realServices
                      .sort((a, b) => (b.demandes_mois || 0) - (a.demandes_mois || 0))
                      .slice(0, 3)
                      .map((service, index) => (
                      <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r from-green-50 to-blue-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{service.nom}</p>
                            <p className="text-sm text-muted-foreground">{service.organisme}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">{service.demandes_mois}</p>
                          <p className="text-xs text-muted-foreground">demandes/mois</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Services les mieux notés */}
              <Card>
                <CardHeader>
                  <CardTitle>⭐ Services les Mieux Notés</CardTitle>
                  <CardDescription>Top 3 par satisfaction client</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {realServices
                      .sort((a, b) => (b.satisfaction || 0) - (a.satisfaction || 0))
                      .slice(0, 3)
                      .map((service, index) => (
                      <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{service.nom}</p>
                            <p className="text-sm text-muted-foreground">{service.organisme}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-yellow-600">{service.satisfaction}%</p>
                          <p className="text-xs text-muted-foreground">satisfaction</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Répartition par catégorie */}
            <Card>
              <CardHeader>
                <CardTitle>📊 Répartition par Catégorie</CardTitle>
                <CardDescription>Distribution des services par domaine</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {servicesByCategory.map((cat) => (
                    <div key={cat.categorie} className="p-4 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedCategorie(cat.categorie)}>
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={`text-white ${cat.color}`}>
                          {cat.label}
                        </Badge>
                        <span className="text-2xl font-bold">{cat.count}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Demandes/mois:</span>
                          <span className="font-medium">{cat.totalDemandes}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Satisfaction:</span>
                          <span className="font-medium">{cat.satisfactionMoyenne}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services */}
          <TabsContent value="services" className="space-y-6">
            {/* Filtres */}
            <Card>
              <CardHeader>
                <CardTitle>Recherche et Filtres</CardTitle>
                <CardDescription>
                  Filtrer et rechercher parmi {stats.total} services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="🔍 Rechercher par nom, organisme ou description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedCategorie} onValueChange={setSelectedCategorie}>
                    <SelectTrigger className="lg:w-48">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes catégories</SelectItem>
                      {Object.entries(CATEGORIES).map(([value, config]) => (
                        <SelectItem key={value} value={value}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="lg:w-48">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                        <SelectItem key={value} value={value}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm('');
                    setSelectedCategorie('all');
                    setSelectedStatus('all');
                    toast.info('Filtres réinitialisés');
                  }}>
                    <Filter className="mr-2 h-4 w-4" />
                    Réinitialiser
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Table des services */}
            <Card>
              <CardHeader>
                <CardTitle>
                  📋 Liste des Services ({filteredServices.length}/{stats.total})
                </CardTitle>
                <CardDescription>
                  Gestion complète des services publics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Organisme</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Coût & Durée</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredServices.map((service) => (
                        <TableRow key={service.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div>
                              <div className="font-medium">{service.nom}</div>
                              <div className="text-sm text-muted-foreground">{service.description}</div>
                              <div className="text-xs text-muted-foreground">Resp: {service.responsable}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-white ${CATEGORIES[service.categorie]?.color}`}>
                              {CATEGORIES[service.categorie]?.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Building2 className="h-4 w-4 mr-1 text-muted-foreground" />
                              {service.organisme}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="font-medium">{service.satisfaction}%</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {service.demandes_mois} demandes/mois
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                <span className="font-medium">{service.cout}</span>
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {service.duree}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`text-white ${STATUS_CONFIG[service.status]?.color}`}>
                              {STATUS_CONFIG[service.status]?.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(service)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(service)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredServices.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun service trouvé</h3>
                    <p className="text-muted-foreground mb-4">
                      Aucun service ne correspond à vos critères de recherche.
                    </p>
                    <Button variant="outline" onClick={() => {
                      setSearchTerm('');
                      setSelectedCategorie('all');
                      setSelectedStatus('all');
                    }}>
                      Réinitialiser les filtres
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Catégories */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesByCategory.map((cat) => (
                <Card key={cat.categorie} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge className={`text-white ${cat.color}`}>
                        {cat.label}
                      </Badge>
                      <span className="text-lg font-bold">{cat.count} services</span>
                    </CardTitle>
                    <CardDescription>
                      {cat.totalDemandes} demandes/mois • {cat.satisfactionMoyenne}% satisfaction
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {cat.services.slice(0, 3).map((service) => (
                        <div key={service.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div>
                            <p className="font-medium text-sm">{service.nom}</p>
                            <p className="text-xs text-muted-foreground">{service.organisme}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">{service.satisfaction}%</p>
                            <p className="text-xs text-muted-foreground">{service.demandes_mois}/mois</p>
                          </div>
                        </div>
                      ))}
                      {cat.count > 3 && (
                        <p className="text-center text-sm text-muted-foreground">
                          +{cat.count - 3} autres services
                        </p>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4" 
                      onClick={() => {
                        setSelectedCategorie(cat.categorie);
                        setSelectedTab('services');
                      }}
                    >
                      Voir tous les services
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>📈 Tendances par Catégorie</CardTitle>
                  <CardDescription>Volume d'activité mensuel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {servicesByCategory.map((cat) => (
                      <div key={cat.categorie} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{cat.label}</span>
                          <span className="text-muted-foreground">{cat.totalDemandes} demandes</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${cat.color}`}
                            data-width={`${(cat.totalDemandes / stats.totalDemandes) * 100}%`}
                            ref={(el) => {
                              if (el) el.style.width = el.dataset.width || '0%';
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>🎯 Métriques Clés</CardTitle>
                  <CardDescription>Indicateurs de performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                      <div className="text-sm text-muted-foreground">Services Total</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                      <div className="text-sm text-muted-foreground">Services Actifs</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{stats.totalDemandes.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Demandes/Mois</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{stats.satisfactionMoyenne}%</div>
                      <div className="text-sm text-muted-foreground">Satisfaction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal de détails */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Détails du service
              </DialogTitle>
              <DialogDescription>
                Informations complètes pour {selectedService?.nom}
              </DialogDescription>
            </DialogHeader>
            
            {selectedService && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Informations générales</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Nom:</strong> {selectedService.nom}</div>
                      <div><strong>Organisme:</strong> {selectedService.organisme}</div>
                      <div><strong>Catégorie:</strong> {CATEGORIES[selectedService.categorie]?.label}</div>
                      <div><strong>Description:</strong> {selectedService.description}</div>
                      <div><strong>Responsable:</strong> {selectedService.responsable}</div>
                      <div><strong>Lieu:</strong> {selectedService.lieu}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Contact</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Dernière MAJ: {selectedService.derniere_maj}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {selectedService.telephone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        {selectedService.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Métriques de Service</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-600">{selectedService.satisfaction}%</div>
                        <div className="text-xs text-muted-foreground">Satisfaction</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-600">{selectedService.demandes_mois}</div>
                        <div className="text-xs text-muted-foreground">Demandes/mois</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <div className="text-lg font-bold text-purple-600">{selectedService.cout}</div>
                        <div className="text-xs text-muted-foreground">Coût</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded">
                        <div className="text-lg font-bold text-yellow-600">{selectedService.duree}</div>
                        <div className="text-xs text-muted-foreground">Durée</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Documents requis</h4>
                    <div className="space-y-2">
                      {(selectedService.documents_requis || []).map((doc, index) => (
                        <div key={index} className="flex items-center p-2 bg-muted/50 rounded">
                          <FileText className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="text-sm">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                Fermer
              </Button>
              <Button onClick={() => handleEdit(selectedService)}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
} 