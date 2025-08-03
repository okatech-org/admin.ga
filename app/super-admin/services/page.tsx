'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import {
  Zap,
  Building2,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Download,
  BarChart3,
  Users,
  FileText,
  Timer,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Hash,
  TrendingUp
} from 'lucide-react';

interface Service {
  id: string;
  nom: string;
  code: string;
  type: 'ADMINISTRATIF' | 'CIVIL' | 'JURIDIQUE' | 'FISCAL' | 'SOCIAL' | 'TECHNIQUE';
  description: string;
  organisme: {
    id: string;
    name: string;
    code: string;
  };
  statut: 'ACTIF' | 'INACTIF' | 'MAINTENANCE' | 'SUSPENDU';
  delaiTraitement: number;
  cout?: number;
  documentsRequis: string[];
  etapes: string[];
  prerequis?: string[];
  responsable?: string;
  contact?: {
    telephone?: string;
    email?: string;
    adresse?: string;
  };
  statistiques: {
    demandesTotal: number;
    demandesEnCours: number;
    demandesTraitees: number;
    tempsTraitementMoyen: number;
    tauxSatisfaction: number;
  };
  dateCreation: string;
  derniereMiseAJour: string;
}

interface StatistiquesServices {
  total: number;
  actifs: number;
  inactifs: number;
  enMaintenance: number;
  repartitionParType: Record<string, number>;
  delaiMoyenTraitement: number;
  demandesTotal: number;
  demandesEnCours: number;
  tauxUtilisation: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [statistiques, setStatistiques] = useState<StatistiquesServices | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatut, setSelectedStatut] = useState('all');
  const [selectedOrganisme, setSelectedOrganisme] = useState('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, [selectedType, selectedStatut, selectedOrganisme]);

  // Effet pour la recherche en temps réel
  useEffect(() => {
    if (searchTerm) {
      const timeoutId = setTimeout(() => {
        // Filtrer en temps réel sans recharger depuis l'API
        toast.info(`🔍 Recherche: "${searchTerm}"`);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm]);

  const loadServices = async () => {
    setLoading(true);
    try {
      // Simuler des données de services
      await new Promise(resolve => setTimeout(resolve, 1000));

      const servicesSimules: Service[] = [
        {
          id: '1',
          nom: 'Demande de Carte Nationale d\'Identité',
          code: 'CNI_001',
          type: 'CIVIL',
          description: 'Service de demande et de renouvellement de la carte nationale d\'identité gabonaise',
          organisme: {
            id: 'dgdi',
            name: 'Direction Générale de la Documentation et de l\'Immigration',
            code: 'DGDI'
          },
          statut: 'ACTIF',
          delaiTraitement: 15,
          cout: 5000,
          documentsRequis: [
            'Acte de naissance',
            'Certificat de nationalité',
            'Photo d\'identité récente',
            'Justificatif de domicile'
          ],
          etapes: [
            'Dépôt du dossier',
            'Vérification des documents',
            'Prise d\'empreintes',
            'Fabrication de la carte',
            'Retrait'
          ],
          prerequis: ['Être de nationalité gabonaise', 'Âge minimum: 16 ans'],
          responsable: 'Service des CNI',
          contact: {
            telephone: '+241 01 23 45 67',
            email: 'cni@dgdi.ga',
            adresse: 'Avenue Léon Mba, Libreville'
          },
          statistiques: {
            demandesTotal: 1250,
            demandesEnCours: 85,
            demandesTraitees: 1165,
            tempsTraitementMoyen: 12,
            tauxSatisfaction: 87
          },
          dateCreation: '2024-01-15T08:00:00Z',
          derniereMiseAJour: '2025-01-10T14:30:00Z'
        },
        {
          id: '2',
          nom: 'Déclaration Fiscale des Entreprises',
          code: 'DFE_001',
          type: 'FISCAL',
          description: 'Service de déclaration et de suivi des obligations fiscales des entreprises',
          organisme: {
            id: 'dgi',
            name: 'Direction Générale des Impôts',
            code: 'DGI'
          },
          statut: 'ACTIF',
          delaiTraitement: 7,
          documentsRequis: [
            'Registre de commerce',
            'Bilans comptables',
            'Relevés bancaires',
            'Factures et reçus'
          ],
          etapes: [
            'Soumission de la déclaration',
            'Vérification comptable',
            'Calcul des impôts',
            'Émission de l\'avis',
            'Paiement'
          ],
          responsable: 'Service des Entreprises',
          contact: {
            telephone: '+241 01 34 56 78',
            email: 'entreprises@dgi.ga'
          },
          statistiques: {
            demandesTotal: 890,
            demandesEnCours: 45,
            demandesTraitees: 845,
            tempsTraitementMoyen: 6,
            tauxSatisfaction: 92
          },
          dateCreation: '2024-02-01T09:00:00Z',
          derniereMiseAJour: '2025-01-12T11:20:00Z'
        },
        {
          id: '3',
          nom: 'Autorisation de Travail pour Étrangers',
          code: 'ATE_001',
          type: 'ADMINISTRATIF',
          description: 'Service d\'autorisation de travail pour les ressortissants étrangers',
          organisme: {
            id: 'min_travail',
            name: 'Ministère du Travail',
            code: 'MIN_TRAVAIL'
          },
          statut: 'ACTIF',
          delaiTraitement: 30,
          cout: 25000,
          documentsRequis: [
            'Passeport valide',
            'Contrat de travail',
            'Diplômes certifiés',
            'Casier judiciaire',
            'Certificat médical'
          ],
          etapes: [
            'Dépôt de la demande',
            'Examen du dossier',
            'Enquête employeur',
            'Validation ministérielle',
            'Délivrance de l\'autorisation'
          ],
          prerequis: ['Contrat de travail signé', 'Absence de casier judiciaire'],
          responsable: 'Direction de l\'Immigration de Travail',
          statistiques: {
            demandesTotal: 156,
            demandesEnCours: 23,
            demandesTraitees: 133,
            tempsTraitementMoyen: 28,
            tauxSatisfaction: 78
          },
          dateCreation: '2024-03-10T10:00:00Z',
          derniereMiseAJour: '2025-01-08T16:45:00Z'
        }
      ];

      // Calculer les statistiques
      const total = servicesSimules.length;
      const actifs = servicesSimules.filter(s => s.statut === 'ACTIF').length;
      const inactifs = servicesSimules.filter(s => s.statut === 'INACTIF').length;
      const enMaintenance = servicesSimules.filter(s => s.statut === 'MAINTENANCE').length;

      const repartitionParType = servicesSimules.reduce((acc, service) => {
        acc[service.type] = (acc[service.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const delaiMoyenTraitement = Math.round(
        servicesSimules.reduce((sum, s) => sum + s.delaiTraitement, 0) / servicesSimules.length
      );

      const demandesTotal = servicesSimules.reduce((sum, s) => sum + s.statistiques.demandesTotal, 0);
      const demandesEnCours = servicesSimules.reduce((sum, s) => sum + s.statistiques.demandesEnCours, 0);

      const statistiquesCalculees: StatistiquesServices = {
        total: 558, // Total réel du système
        actifs: 547,
        inactifs: 8,
        enMaintenance: 3,
        repartitionParType,
        delaiMoyenTraitement,
        tauxUtilisation: 78,
        demandesTotal,
        demandesEnCours
      };

      setServices(servicesSimules);
      setStatistiques(statistiquesCalculees);

    } catch (error) {
      console.error('Erreur lors du chargement des services:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const getStatutColor = (statut: string) => {
    const colors = {
      ACTIF: 'bg-green-100 text-green-800',
      INACTIF: 'bg-gray-100 text-gray-800',
      MAINTENANCE: 'bg-orange-100 text-orange-800',
      SUSPENDU: 'bg-red-100 text-red-800'
    };
    return colors[statut] || colors.INACTIF;
  };

  const getStatutIcon = (statut: string) => {
    const icons = {
      ACTIF: CheckCircle,
      INACTIF: XCircle,
      MAINTENANCE: Settings,
      SUSPENDU: AlertCircle
    };
    return icons[statut] || XCircle;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      ADMINISTRATIF: 'bg-blue-100 text-blue-800',
      CIVIL: 'bg-green-100 text-green-800',
      JURIDIQUE: 'bg-purple-100 text-purple-800',
      FISCAL: 'bg-orange-100 text-orange-800',
      SOCIAL: 'bg-pink-100 text-pink-800',
      TECHNIQUE: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.ADMINISTRATIF;
  };

  const servicesFiltres = services.filter(service => {
    const matchSearch = searchTerm === '' ||
      service.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.organisme.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchType = selectedType === 'all' || service.type === selectedType;
    const matchStatut = selectedStatut === 'all' || service.statut === selectedStatut;

    return matchSearch && matchType && matchStatut;
  });

  const exporterDonnees = () => {
    const data = services.map(s => ({
      nom: s.nom,
      code: s.code,
      type: s.type,
      organisme: s.organisme.name,
      statut: s.statut,
      delaiTraitement: s.delaiTraitement,
      demandesTotal: s.statistiques.demandesTotal,
      tauxSatisfaction: s.statistiques.tauxSatisfaction
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `services-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Données exportées avec succès');
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" text="Chargement des services..." />
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <PageHeader
          title="Gestion des Services"
          description="Administration et suivi des 558 services administratifs gabonais"
          actions={[
            {
              label: 'Actualiser',
              icon: RefreshCw,
              onClick: loadServices,
              variant: 'outline'
            },
            {
              label: 'Exporter',
              icon: Download,
              onClick: exporterDonnees,
              variant: 'outline'
            },
            {
              label: 'Nouveau Service',
              icon: Plus,
              onClick: () => toast.info('Fonctionnalité en développement')
            }
          ]}
        />

        {/* Statistiques */}
        {statistiques && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Total Services"
              value={statistiques.total}
              icon={Zap}
              color="blue"
              description={`${statistiques.actifs} actifs`}
            />
            <StatCard
              title="Services Actifs"
              value={statistiques.actifs}
              icon={CheckCircle}
              color="green"
              trend={{ value: 2.3, label: 'ce mois' }}
            />
            <StatCard
              title="Demandes/mois"
              value={statistiques.demandesTotal}
              icon={FileText}
              color="purple"
              description={`${statistiques.demandesEnCours} en cours`}
            />
            <StatCard
              title="Délai moyen"
              value={`${statistiques.delaiMoyenTraitement}j`}
              icon={Timer}
              color="orange"
              trend={{ value: -5.2, label: 'amélioration' }}
            />
          </div>
        )}

        {/* Filtres */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres de recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="ADMINISTRATIF">Administratif</SelectItem>
                  <SelectItem value="CIVIL">Civil</SelectItem>
                  <SelectItem value="JURIDIQUE">Juridique</SelectItem>
                  <SelectItem value="FISCAL">Fiscal</SelectItem>
                  <SelectItem value="SOCIAL">Social</SelectItem>
                  <SelectItem value="TECHNIQUE">Technique</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatut} onValueChange={setSelectedStatut}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="ACTIF">Actif</SelectItem>
                  <SelectItem value="INACTIF">Inactif</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="SUSPENDU">Suspendu</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedOrganisme} onValueChange={setSelectedOrganisme}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les organismes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les organismes</SelectItem>
                  <SelectItem value="dgdi">DGDI</SelectItem>
                  <SelectItem value="dgi">DGI</SelectItem>
                  <SelectItem value="min_travail">Ministère du Travail</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des services */}
        <Card>
          <CardHeader>
            <CardTitle>
              Services ({servicesFiltres.length})
            </CardTitle>
            <CardDescription>
              Liste des services administratifs disponibles
            </CardDescription>
          </CardHeader>
          <CardContent>
            {servicesFiltres.length === 0 ? (
              <EmptyState
                icon={Zap}
                title="Aucun service trouvé"
                description="Aucun service ne correspond à vos critères de recherche."
                action={{
                  label: 'Créer un nouveau service',
                  onClick: () => toast.info('Fonctionnalité en développement'),
                  icon: Plus
                }}
              />
            ) : (
              <div className="space-y-4">
                {servicesFiltres.map((service) => {
                  const StatutIcon = getStatutIcon(service.statut);

                  return (
                    <div key={service.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">
                              {service.nom}
                            </h3>
                            <Badge variant="outline" className={getTypeColor(service.type)}>
                              {service.type}
                            </Badge>
                            <Badge variant="outline" className={getStatutColor(service.statut)}>
                              <StatutIcon className="h-3 w-3 mr-1" />
                              {service.statut}
                            </Badge>
                            <Badge variant="outline">
                              {service.code}
                            </Badge>
                          </div>

                          <p className="text-gray-700 mb-3 line-clamp-2">
                            {service.description}
                          </p>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              <span>{service.organisme.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Timer className="h-4 w-4" />
                              <span>{service.delaiTraitement} jours</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <BarChart3 className="h-4 w-4" />
                              <span>{service.statistiques.demandesTotal} demandes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              <span>{service.statistiques.tauxSatisfaction}% satisfaction</span>
                            </div>
                          </div>

                          {service.cout && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                              <DollarSign className="h-4 w-4" />
                              <span>Coût: {service.cout.toLocaleString()} FCFA</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowDetails(
                              showDetails === service.id ? null : service.id
                            )}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toast.info(`✏️ Édition du service: ${service.nom}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => toast.info(`⚙️ Configuration du service: ${service.nom}`)}
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Configurer
                          </Button>
                        </div>
                      </div>

                      {/* Détails étendus */}
                      {showDetails === service.id && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Documents requis */}
                            <div>
                              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Documents requis
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-600">
                                {service.documentsRequis.map((doc, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-blue-500">•</span>
                                    {doc}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Étapes du processus */}
                            <div>
                              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                <Hash className="h-4 w-4" />
                                Étapes du processus
                              </h4>
                              <ol className="space-y-1 text-sm text-gray-600">
                                {service.etapes.map((etape, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-green-500 font-semibold">{index + 1}.</span>
                                    {etape}
                                  </li>
                                ))}
                              </ol>
                            </div>

                            {/* Contact et statistiques */}
                            <div className="space-y-4">
                              {/* Contact */}
                              {service.contact && (
                                <div>
                                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    Contact
                                  </h4>
                                  <div className="space-y-1 text-sm text-gray-600">
                                    {service.responsable && (
                                      <div className="flex items-center gap-2">
                                        <Briefcase className="h-3 w-3" />
                                        <span>{service.responsable}</span>
                                      </div>
                                    )}
                                    {service.contact.telephone && (
                                      <div className="flex items-center gap-2">
                                        <Phone className="h-3 w-3" />
                                        <span>{service.contact.telephone}</span>
                                      </div>
                                    )}
                                    {service.contact.email && (
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-3 w-3" />
                                        <span>{service.contact.email}</span>
                                      </div>
                                    )}
                                    {service.contact.adresse && (
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-3 w-3" />
                                        <span>{service.contact.adresse}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Statistiques détaillées */}
                              <div>
                                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                  <BarChart3 className="h-4 w-4" />
                                  Statistiques
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">En cours:</span>
                                    <span className="font-medium">{service.statistiques.demandesEnCours}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Traitées:</span>
                                    <span className="font-medium">{service.statistiques.demandesTraitees}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Temps moyen:</span>
                                    <span className="font-medium">{service.statistiques.tempsTraitementMoyen}j</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Satisfaction:</span>
                                    <span className="font-medium text-green-600">{service.statistiques.tauxSatisfaction}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Prérequis */}
                          {service.prerequis && service.prerequis.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Prérequis
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-600">
                                {service.prerequis.map((prerequis, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-orange-500">⚠</span>
                                    {prerequis}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
