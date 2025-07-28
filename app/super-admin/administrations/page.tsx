/* @ts-nocheck */
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { toast } from 'sonner';
import { 
  Building2, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Users,
  FileText,
  Filter,
  BarChart3,
  Settings,
  Download,
  Upload,
  Plus,
  Eye,
  Edit,
  Trash2,
  Archive,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Activity,
  Star,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllAdministrations, getAllServices } from '@/lib/data/gabon-administrations';

export default function SuperAdminAdministrationsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrganisme, setSelectedOrganisme] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // CHARGEMENT DE TOUTES LES VRAIES DONNÉES DU JSON
  const allAdministrationsFromJSON = getAllAdministrations();
  const allServicesFromJSON = getAllServices();
  
  console.log('🏢 PAGE ADMINISTRATIONS - Organismes chargés:', allAdministrationsFromJSON.length);
  console.log('🏢 PAGE ADMINISTRATIONS - Services chargés:', allServicesFromJSON.length);

  // Transformation des données JSON en format dashboard avec métriques enrichies
  const mockAdministrations = allAdministrationsFromJSON.map((admin, index) => {
    // Génération de métriques basées sur le type
    const getMetrics = (type, idx) => {
      const baseMetrics = {
        'PRESIDENCE': { users: 150, demands: 50, satisfaction: 95, budget: 5.0 },
        'PRIMATURE': { users: 120, demands: 40, satisfaction: 93, budget: 4.2 },
        'MINISTERE': { users: 200, demands: 800, satisfaction: 88, budget: 3.5 },
        'DIRECTION_GENERALE': { users: 80, demands: 600, satisfaction: 85, budget: 2.8 },
        'PROVINCE': { users: 70, demands: 400, satisfaction: 83, budget: 2.1 },
        'MAIRIE': { users: 60, demands: 1200, satisfaction: 82, budget: 1.8 },
        'ORGANISME_SOCIAL': { users: 45, demands: 500, satisfaction: 80, budget: 1.5 },
        'INSTITUTION_JUDICIAIRE': { users: 35, demands: 300, satisfaction: 78, budget: 1.2 },
        'SERVICE_SPECIALISE': { users: 25, demands: 150, satisfaction: 75, budget: 0.8 }
      };
      
      const metrics = baseMetrics[type] || baseMetrics['SERVICE_SPECIALISE'];
      return {
        utilisateurs: metrics.users + (idx % 30),
        demandes_mois: metrics.demands + (idx % 100),
        satisfaction: Math.min(95, metrics.satisfaction + (idx % 10)),
        budget: `${(metrics.budget + (idx % 2)).toFixed(1)}M FCFA`,
        status: idx % 8 === 0 ? 'MAINTENANCE' : 'ACTIVE'
      };
    };

    const metrics = getMetrics(admin.type, index);
    const responsables = ['M. Jean OBIANG', 'Mme Marie NZENG', 'Dr. Paul MBOUMBA', 'Mme Sophie BOUKOUMOU', 'M. Pierre NZAMBA'];
    
    return {
      id: index + 1,
      nom: admin.nom,
      code: admin.code,
      type: admin.type,
      localisation: admin.localisation || 'Libreville',
      services: admin.services || [],
      responsable: responsables[index % responsables.length],
      dateCreation: `2024-01-${String((index % 28) + 1).padStart(2, '0')}`,
      derniere_activite: index % 3 === 0 ? "Hier" : "Aujourd'hui",
      telephone: `+241 0${(index % 9) + 1} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
      email: `contact@${admin.code.toLowerCase()}.ga`,
      adresse: `${index + 1} Avenue de l'Administration, ${admin.localisation || 'Libreville'}`,
      ...metrics
    };
  });

  const ORGANIZATION_TYPES = {
    PRESIDENCE: "Présidence",
    PRIMATURE: "Primature", 
    MINISTERE: "Ministère",
    DIRECTION_GENERALE: "Direction Générale",
    PROVINCE: "Province",
    PREFECTURE: "Préfecture",
    MAIRIE: "Mairie",
    ORGANISME_SOCIAL: "Organisme Social",
    INSTITUTION_JUDICIAIRE: "Institution Judiciaire",
    SERVICE_SPECIALISE: "Service Spécialisé",
    AUTRE: "Autre"
  };

  const STATUS_CONFIG = {
    ACTIVE: { label: 'Actif', color: 'bg-green-500', icon: CheckCircle },
    MAINTENANCE: { label: 'Maintenance', color: 'bg-yellow-500', icon: AlertTriangle },
    INACTIVE: { label: 'Inactif', color: 'bg-gray-500', icon: Clock },
  };

  // Calculs de statistiques
  const stats = {
    total: mockAdministrations.length,
    active: mockAdministrations.filter(org => org.status === 'ACTIVE').length,
    maintenance: mockAdministrations.filter(org => org.status === 'MAINTENANCE').length,
    totalUtilisateurs: mockAdministrations.reduce((sum, org) => sum + (org.utilisateurs || 0), 0),
    totalServices: mockAdministrations.reduce((sum, org) => sum + (org.services?.length || 0), 0),
    satisfactionMoyenne: Math.round(
      mockAdministrations.reduce((sum, org) => sum + (org.satisfaction || 0), 0) / mockAdministrations.length
    ),
    totalDemandes: mockAdministrations.reduce((sum, org) => sum + (org.demandes_mois || 0), 0)
  };

  // Filtrage des données
  const filteredAdministrations = mockAdministrations.filter(admin => {
    const matchesSearch = admin.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.localisation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || admin.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || admin.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Actions
  const handleViewDetails = (organisme) => {
    setSelectedOrganisme(organisme);
    setIsDetailsOpen(true);
    toast.info(`Affichage des détails de ${organisme.nom}`);
  };

  const handleEdit = (organisme) => {
    toast.info(`Modification de ${organisme.nom}...`);
    // TODO: Navigation vers page d'édition
  };

  const handleNavigateToServices = () => {
    toast.success('Redirection vers Services Publics...');
    router.push('/super-admin/services');
  };

  const handleNavigateToCreerOrganisme = () => {
    toast.success('Redirection vers Créer Organisme...');
    router.push('/super-admin/organisme/nouveau');
  };

  const exportToJSON = () => {
    try {
      const dataStr = JSON.stringify({
        exported_at: new Date().toISOString(),
        total_administrations: stats.total,
        administrations: filteredAdministrations,
        statistics: stats
      }, null, 2);
      
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `administrations-gabon-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success('Export JSON réussi !');
    } catch (error) {
      toast.error('Erreur lors de l\'export JSON');
    }
  };

  const exportToCSV = () => {
    try {
      const headers = ['Nom', 'Code', 'Type', 'Localisation', 'Statut', 'Utilisateurs', 'Services', 'Responsable', 'Satisfaction'];
      const csvContent = [
        headers.join(','),
        ...filteredAdministrations.map(admin => [
          `"${admin.nom}"`,
          `"${admin.code}"`,
          `"${ORGANIZATION_TYPES[admin.type]?.label}"`,
          `"${admin.localisation}"`,
          `"${STATUS_CONFIG[admin.status]?.label}"`,
          admin.utilisateurs || 0,
          admin.services?.length || 0,
          `"${admin.responsable}"`,
          `${admin.satisfaction}%`
        ].join(','))
      ].join('\n');

      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `administrations-gabon-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success('Export CSV réussi !');
    } catch (error) {
      toast.error('Erreur lors de l\'export CSV');
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
                <Button variant="default" asChild>
                  <Link href="/super-admin/administrations">
                    <Building2 className="mr-2 h-4 w-4" />
                    Administrations
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleNavigateToCreerOrganisme}>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer Organisme
                </Button>
                <Button variant="outline" onClick={handleNavigateToServices}>
                  <FileText className="mr-2 h-4 w-4" />
                  Services Publics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* En-tête */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-500" />
              Gestion des Administrations
            </h1>
            <p className="text-muted-foreground">
              Administration complète des {stats.total} organismes publics gabonais
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" onClick={exportToJSON}>
              <Download className="mr-2 h-4 w-4" />
              JSON
            </Button>
            <Button onClick={handleNavigateToCreerOrganisme}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvel Organisme
            </Button>
          </div>
        </div>

        {/* Organismes les Plus Performants */}
        <Card>
          <CardHeader>
            <CardTitle>🏆 Organismes les Plus Performants</CardTitle>
            <CardDescription>Top 3 par satisfaction client</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockAdministrations
                .sort((a, b) => (b.satisfaction || 0) - (a.satisfaction || 0))
                .slice(0, 3)
                .map((org, index) => (
                <Card key={org.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewDetails(org)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{org.satisfaction}%</div>
                        <div className="text-xs text-muted-foreground">satisfaction</div>
                      </div>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{org.nom}</h4>
                    <p className="text-xs text-muted-foreground">{org.responsable}</p>
                    <div className="flex items-center justify-between mt-3 text-xs">
                      <span>{org.demandes_mois} demandes/mois</span>
                      <Badge className={`text-white ${ORGANIZATION_TYPES[org.type]?.color}`}>
                        {ORGANIZATION_TYPES[org.type]?.label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Organismes</p>
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
                <FileText className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Services Publics</p>
                  <p className="text-2xl font-bold">{stats.totalServices}</p>
                  <p className="text-xs text-muted-foreground">
                    Moyenne {Math.round(stats.totalServices / stats.total)} services/organisme
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Utilisateurs Actifs</p>
                  <p className="text-2xl font-bold">{stats.totalUtilisateurs.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    Personnel des administrations
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
                    {stats.totalDemandes.toLocaleString()} demandes/mois
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardHeader>
            <CardTitle>Recherche et Filtres</CardTitle>
            <CardDescription>
              Filtrer et rechercher parmi {stats.total} organismes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="🔍 Rechercher par nom, code ou localisation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="lg:w-48">
                  <SelectValue placeholder="Type d'organisme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {Object.entries(ORGANIZATION_TYPES).map(([value, config]) => (
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
                setSelectedType('all');
                setSelectedStatus('all');
                toast.info('Filtres réinitialisés');
              }}>
                <Filter className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table des administrations */}
        <Card>
          <CardHeader>
            <CardTitle>
              📋 Liste des Administrations ({filteredAdministrations.length}/{stats.total})
            </CardTitle>
            <CardDescription>
              Gestion complète des organismes publics gabonais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organisme</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Activité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdministrations.map((admin) => (
                    <TableRow key={admin.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <div className="font-medium">{admin.nom}</div>
                          <div className="text-sm text-muted-foreground">{admin.code}</div>
                          <div className="text-xs text-muted-foreground">{admin.responsable}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-white ${ORGANIZATION_TYPES[admin.type]?.color}`}>
                          {ORGANIZATION_TYPES[admin.type]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          {admin.localisation}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{admin.satisfaction}%</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {admin.demandes_mois} demandes/mois
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{admin.utilisateurs} utilisateurs</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {admin.services?.length || 0} services
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-white ${STATUS_CONFIG[admin.status]?.color}`}>
                          {STATUS_CONFIG[admin.status]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(admin)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(admin)}
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

            {filteredAdministrations.length === 0 && (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun organisme trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  Aucun organisme ne correspond à vos critères de recherche.
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedStatus('all');
                }}>
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de détails */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Détails de l'administration
              </DialogTitle>
              <DialogDescription>
                Informations complètes pour {selectedOrganisme?.nom}
              </DialogDescription>
            </DialogHeader>
            
            {selectedOrganisme && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Informations générales</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Nom:</strong> {selectedOrganisme.nom}</div>
                      <div><strong>Code:</strong> {selectedOrganisme.code}</div>
                      <div><strong>Type:</strong> {ORGANIZATION_TYPES[selectedOrganisme.type]?.label}</div>
                      <div><strong>Localisation:</strong> {selectedOrganisme.localisation}</div>
                      <div><strong>Responsable:</strong> {selectedOrganisme.responsable}</div>
                      <div><strong>Budget:</strong> {selectedOrganisme.budget}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Contact</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {selectedOrganisme.telephone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {selectedOrganisme.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {selectedOrganisme.adresse}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Métriques de Performance</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-600">{selectedOrganisme.utilisateurs}</div>
                        <div className="text-xs text-muted-foreground">Utilisateurs</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-600">{selectedOrganisme.services?.length || 0}</div>
                        <div className="text-xs text-muted-foreground">Services</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <div className="text-lg font-bold text-purple-600">{selectedOrganisme.demandes_mois}</div>
                        <div className="text-xs text-muted-foreground">Demandes/mois</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded">
                        <div className="text-lg font-bold text-yellow-600">{selectedOrganisme.satisfaction}%</div>
                        <div className="text-xs text-muted-foreground">Satisfaction</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Services proposés</h4>
                    <div className="space-y-2">
                      {(selectedOrganisme.services || []).map((service, index) => (
                        <div key={index} className="flex items-center p-2 bg-muted/50 rounded">
                          <FileText className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="text-sm">{service}</span>
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
              <Button onClick={() => handleEdit(selectedOrganisme)}>
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