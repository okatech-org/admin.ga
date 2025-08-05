'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Users, Building2, FileText, TrendingUp, AlertTriangle, CheckCircle,
  Calendar, Clock, Target, BarChart3, PieChart, Activity,
  Mail, Phone, Globe, MapPin, User, Crown, Settings
} from 'lucide-react';

interface MinistereData {
  id: string;
  code: string;
  nom: string;
  ministre: string;
  type: 'ministre_etat' | 'ministre';
  secteurs: string[];
  attributions: string[];
  personnel: {
    total: number;
    par_niveau: {
      direction: number;
      encadrement: number;
      execution: number;
    };
    par_statut: {
      actifs: number;
      en_conge: number;
      en_mission: number;
    };
  };
  budget: {
    alloue: number;
    consomme: number;
    pourcentage_execution: number;
    principaux_postes: Array<{
      libelle: string;
      montant: number;
      pourcentage: number;
    }>;
  };
  activites: {
    projets_en_cours: number;
    projets_termines: number;
    reunions_ce_mois: number;
    documents_traites: number;
  };
  indicateurs: {
    satisfaction_usagers: number;
    delai_moyen_traitement: number;
    taux_digitalisation: number;
    efficacite_budgetaire: number;
  };
  contact: {
    email: string;
    telephone: string;
    adresse: string;
    site_web?: string;
  };
}

interface TableauBordMinistereProps {
  ministereCode: string;
}

export function TableauBordMinistere({ ministereCode }: TableauBordMinistereProps) {
  const [ministereData, setMinistereData] = useState<MinistereData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simuler le chargement des données ministérielles
    const chargerDonneesMinistere = async () => {
      setIsLoading(true);

      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Données simulées réalistes basées sur le code ministère
      const donneesSimulees: MinistereData = {
        id: ministereCode,
        code: ministereCode,
        nom: getMinistereNom(ministereCode),
        ministre: getMinisterNom(ministereCode),
        type: getMinistereType(ministereCode),
        secteurs: getMinistereSecteurs(ministereCode),
        attributions: getMinistereAttributions(ministereCode),
        personnel: {
          total: Math.floor(Math.random() * 500) + 200,
          par_niveau: {
            direction: Math.floor(Math.random() * 20) + 10,
            encadrement: Math.floor(Math.random() * 80) + 40,
            execution: Math.floor(Math.random() * 200) + 100
          },
          par_statut: {
            actifs: Math.floor(Math.random() * 400) + 180,
            en_conge: Math.floor(Math.random() * 20) + 5,
            en_mission: Math.floor(Math.random() * 15) + 3
          }
        },
        budget: {
          alloue: Math.floor(Math.random() * 50000000000) + 10000000000,
          consomme: Math.floor(Math.random() * 35000000000) + 8000000000,
          pourcentage_execution: Math.floor(Math.random() * 40) + 60,
          principaux_postes: [
            { libelle: 'Personnel', montant: 15000000000, pourcentage: 45 },
            { libelle: 'Investissement', montant: 8000000000, pourcentage: 25 },
            { libelle: 'Fonctionnement', montant: 6000000000, pourcentage: 18 },
            { libelle: 'Transferts', montant: 4000000000, pourcentage: 12 }
          ]
        },
        activites: {
          projets_en_cours: Math.floor(Math.random() * 20) + 5,
          projets_termines: Math.floor(Math.random() * 15) + 8,
          reunions_ce_mois: Math.floor(Math.random() * 25) + 10,
          documents_traites: Math.floor(Math.random() * 500) + 200
        },
        indicateurs: {
          satisfaction_usagers: Math.floor(Math.random() * 30) + 70,
          delai_moyen_traitement: Math.floor(Math.random() * 10) + 5,
          taux_digitalisation: Math.floor(Math.random() * 40) + 45,
          efficacite_budgetaire: Math.floor(Math.random() * 25) + 75
        },
        contact: {
          email: `contact@${ministereCode.toLowerCase()}.gouv.ga`,
          telephone: `+241 01 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
          adresse: `BP ${Math.floor(Math.random() * 9000) + 1000} Libreville`,
          site_web: `https://${ministereCode.toLowerCase()}.gouv.ga`
        }
      };

      setMinistereData(donneesSimulees);
      setIsLoading(false);
    };

    chargerDonneesMinistere();
  }, [ministereCode]);

  // Fonctions de mappage pour simuler les données
  function getMinistereNom(code: string): string {
    const noms: Record<string, string> = {
      'MEF': 'Ministère d\'État de l\'Économie et des Finances',
      'MEN': 'Ministère d\'État de l\'Éducation Nationale',
      'MTM': 'Ministère d\'État des Transports et de la Logistique',
      'MAE': 'Ministère des Affaires Étrangères',
      'MJ': 'Ministère de la Justice',
      'MISD': 'Ministère de l\'Intérieur et de la Sécurité',
      'MSAS': 'Ministère de la Santé et des Affaires Sociales',
      'MEEC': 'Ministère de l\'Environnement et des Changements Climatiques',
      'MHUAT': 'Ministère de l\'Habitat, de l\'Urbanisme et de l\'Aménagement du Territoire',
      'MDN': 'Ministère de la Défense Nationale'
    };
    return noms[code] || `Ministère ${code}`;
  }

  function getMinisterNom(code: string): string {
    const ministres: Record<string, string> = {
      'MEF': 'Henri-Claude OYIMA',
      'MEN': 'Camélia NTOUTOUME-LECLERCQ',
      'MTM': 'Ulrich MANFOUMBI MANFOUMBI',
      'MAE': 'Régis ONANGA NDIAYE',
      'MJ': 'Paul-Marie GONDJOUT',
      'MISD': 'Hermann IMMONGAULT',
      'MSAS': 'Dr Adrien MOUGOUGOU',
      'MEEC': 'Professeur Lee WHITE',
      'MHUAT': 'Olivier NANG EKOMIE',
      'MDN': 'Général Brigitte ONKANOWA'
    };
    return ministres[code] || 'Ministre à définir';
  }

  function getMinistereType(code: string): 'ministre_etat' | 'ministre' {
    const ministresEtat = ['MEF', 'MEN', 'MTM'];
    return ministresEtat.includes(code) ? 'ministre_etat' : 'ministre';
  }

  function getMinistereSecteurs(code: string): string[] {
    const secteurs: Record<string, string[]> = {
      'MEF': ['Économie', 'Finances', 'Budget', 'Douanes'],
      'MEN': ['Éducation', 'Formation', 'Instruction civique'],
      'MTM': ['Transports', 'Logistique', 'Maritime', 'Aérien'],
      'MAE': ['Diplomatie', 'Coopération', 'Relations internationales'],
      'MJ': ['Justice', 'Droits humains', 'Législation'],
      'MISD': ['Sécurité', 'Administration territoriale', 'Décentralisation'],
      'MSAS': ['Santé publique', 'Protection sociale', 'Affaires sociales'],
      'MEEC': ['Environnement', 'Climat', 'Biodiversité', 'Développement durable'],
      'MHUAT': ['Habitat', 'Urbanisme', 'Aménagement territoire'],
      'MDN': ['Défense', 'Forces armées', 'Sécurité nationale']
    };
    return secteurs[code] || ['Secteur à définir'];
  }

  function getMinistereAttributions(code: string): string[] {
    const attributions: Record<string, string[]> = {
      'MEF': [
        'Élaboration et mise en œuvre de la politique économique',
        'Gestion des finances publiques',
        'Politique budgétaire et fiscale',
        'Relations avec les institutions financières',
        'Développement du secteur privé'
      ],
      'MEN': [
        'Définition de la politique éducative nationale',
        'Organisation du système éducatif',
        'Formation des enseignants',
        'Évaluation des apprentissages',
        'Promotion de l\'égalité des chances'
      ],
      'MTM': [
        'Politique des transports multimodaux',
        'Développement des infrastructures',
        'Régulation du transport',
        'Sécurité routière et maritime',
        'Facilitation du commerce'
      ],
      'MAE': [
        'Conduite de la diplomatie gabonaise',
        'Négociation des accords internationaux',
        'Protection des ressortissants à l\'étranger',
        'Coopération bilatérale et multilatérale',
        'Promotion de l\'image du Gabon'
      ],
      'MSAS': [
        'Politique de santé publique',
        'Organisation du système de soins',
        'Prévention et promotion de la santé',
        'Protection sociale des populations',
        'Lutte contre les épidémies'
      ]
    };
    return attributions[code] || ['Attribution à définir'];
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données du ministère...</p>
        </div>
      </div>
    );
  }

  if (!ministereData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Données non disponibles</h3>
        <p className="text-gray-600">Impossible de charger les données pour le ministère {ministereCode}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête du ministère */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <Building2 className="h-8 w-8" />
              <Badge
                variant={ministereData.type === 'ministre_etat' ? 'default' : 'secondary'}
                className="bg-white text-blue-800"
              >
                {ministereData.type === 'ministre_etat' ? 'Ministère d\'État' : 'Ministère'}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold mb-2">{ministereData.nom}</h1>
            <div className="flex items-center space-x-2 text-blue-100">
              <Crown className="h-5 w-5" />
              <span className="font-medium">{ministereData.ministre}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Code</p>
            <p className="text-xl font-mono font-bold">{ministereData.code}</p>
          </div>
        </div>

        {/* Secteurs d'activité */}
        <div className="mt-4">
          <p className="text-blue-100 text-sm mb-2">Secteurs d'activité</p>
          <div className="flex flex-wrap gap-2">
            {ministereData.secteurs.map((secteur, index) => (
              <Badge key={index} variant="outline" className="bg-blue-700 border-blue-500 text-white">
                {secteur}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Indicateurs clés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personnel Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ministereData.personnel.total}</div>
            <p className="text-xs text-muted-foreground">
              {ministereData.personnel.par_statut.actifs} actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exécution Budgétaire</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ministereData.budget.pourcentage_execution}%</div>
            <Progress value={ministereData.budget.pourcentage_execution} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets Actifs</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ministereData.activites.projets_en_cours}</div>
            <p className="text-xs text-muted-foreground">
              {ministereData.activites.projets_termines} terminés cette année
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction Usagers</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ministereData.indicateurs.satisfaction_usagers}%</div>
            <Progress value={ministereData.indicateurs.satisfaction_usagers} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Onglets détaillés */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="personnel">Personnel</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="activites">Activités</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attributions principales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Attributions Principales</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {ministereData.attributions.map((attribution, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{attribution}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Indicateurs de performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Indicateurs de Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Digitalisation</span>
                    <span>{ministereData.indicateurs.taux_digitalisation}%</span>
                  </div>
                  <Progress value={ministereData.indicateurs.taux_digitalisation} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Efficacité Budgétaire</span>
                    <span>{ministereData.indicateurs.efficacite_budgetaire}%</span>
                  </div>
                  <Progress value={ministereData.indicateurs.efficacite_budgetaire} />
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Délai moyen de traitement</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">{ministereData.indicateurs.delai_moyen_traitement} jours</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="personnel" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Niveau</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Direction</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={(ministereData.personnel.par_niveau.direction / ministereData.personnel.total) * 100} className="w-24" />
                      <span className="text-sm font-medium">{ministereData.personnel.par_niveau.direction}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Encadrement</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={(ministereData.personnel.par_niveau.encadrement / ministereData.personnel.total) * 100} className="w-24" />
                      <span className="text-sm font-medium">{ministereData.personnel.par_niveau.encadrement}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Exécution</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={(ministereData.personnel.par_niveau.execution / ministereData.personnel.total) * 100} className="w-24" />
                      <span className="text-sm font-medium">{ministereData.personnel.par_niveau.execution}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statut du Personnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Actifs</span>
                    </div>
                    <span className="font-medium">{ministereData.personnel.par_statut.actifs}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span>En congé</span>
                    </div>
                    <span className="font-medium">{ministereData.personnel.par_statut.en_conge}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>En mission</span>
                    </div>
                    <span className="font-medium">{ministereData.personnel.par_statut.en_mission}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Exécution Budgétaire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Budget alloué</span>
                      <span>{formatCurrency(ministereData.budget.alloue)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Budget consommé</span>
                      <span>{formatCurrency(ministereData.budget.consomme)}</span>
                    </div>
                    <Progress value={ministereData.budget.pourcentage_execution} />
                    <p className="text-xs text-gray-600 mt-1">
                      {ministereData.budget.pourcentage_execution}% d'exécution
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Poste</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ministereData.budget.principaux_postes.map((poste, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{poste.libelle}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={poste.pourcentage} className="w-16" />
                        <span className="text-xs font-medium w-8">{poste.pourcentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activites" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Projets en Cours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{ministereData.activites.projets_en_cours}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Projets Terminés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{ministereData.activites.projets_termines}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Réunions ce Mois</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{ministereData.activites.reunions_ce_mois}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Documents Traités</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{ministereData.activites.documents_traites}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{ministereData.contact.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-medium">{ministereData.contact.telephone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Adresse</p>
                    <p className="font-medium">{ministereData.contact.adresse}</p>
                  </div>
                </div>
                {ministereData.contact.site_web && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Site Web</p>
                      <a
                        href={ministereData.contact.site_web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {ministereData.contact.site_web}
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Consulter les rapports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Planifier une réunion
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres du ministère
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Rapports d'activité
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
