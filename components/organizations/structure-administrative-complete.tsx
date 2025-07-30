'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Crown, Building2, Scale, Shield, Users, GraduationCap, Heart, Briefcase,
  Factory, Globe, Zap, Car, Home, Trees, Leaf, Mountain, Calculator,
  Radio, Stethoscope, Award, Flag, MapPin, Gavel, Target, Database,
  Settings, Eye, Network, Cpu, Phone, Mail, Receipt, Banknote, TrendingUp,
  Search, Filter, ChevronRight, ExternalLink, Info, FileText, BarChart3,
  Activity, Clock, CheckCircle, AlertTriangle, ArrowRight, Layers, Trophy
} from 'lucide-react';

import {
  ORGANISMES_GABON_COMPLETS as ORGANISMES_OFFICIELS_GABON,
  OrganismeOfficielGabon,
  getOrganismeOfficiel,
  getOrganismesByGroupe,
  getOrganismesByType,
  getStatistiquesOfficielles,
  getStatistiquesOrganismesEnrichis,
  NOUVEAUX_ORGANISMES_INFO,
  TOTAL_ORGANISMES_ENRICHIS
} from '@/lib/config/organismes-enrichis-gabon';

// === INTERFACES ===
interface StatistiquesGroupe {
  groupe: string;
  nom: string;
  count: number;
  couleur: string;
  performance: number;
  fluxJour: number;
}

interface FluxAdministratif {
  type: 'HIERARCHIQUE' | 'HORIZONTAL' | 'TRANSVERSAL';
  source: string;
  destination: string;
  volume: number;
  efficacite: number;
  description: string;
}

interface SystemeSIG {
  nom: string;
  gestionnaire: string;
  organismes: number;
  mission: string;
  couleur: string;
}

// === COMPOSANT PRINCIPAL ===
export const StructureAdministrativeComplete: React.FC = () => {
  // États
  const [organismes] = useState(ORGANISMES_OFFICIELS_GABON);
  const [rechercheTerme, setRechercheTerme] = useState('');
  const [groupeSelectionne, setGroupeSelectionne] = useState<string>('TOUS');
  const [typeSelectionne, setTypeSelectionne] = useState<string>('TOUS');
  const [organismeDetailModal, setOrganismeDetailModal] = useState<OrganismeOfficielGabon | null>(null);
  const [ongletActif, setOngletActif] = useState('structure');

  // Données statiques enrichies
  const statistiquesParGroupe: StatistiquesGroupe[] = [
    { groupe: 'A', nom: 'Institutions Suprêmes', count: 2, couleur: 'from-red-500 to-red-700', performance: 98.5, fluxJour: 127 },
    { groupe: 'B', nom: 'Ministères Sectoriels', count: 30, couleur: 'from-blue-500 to-blue-700', performance: 92.3, fluxJour: 2847 },
    { groupe: 'C', nom: 'Directions Générales', count: 8, couleur: 'from-green-500 to-green-700', performance: 89.7, fluxJour: 1923 },
    { groupe: 'D', nom: 'Établissements Publics', count: 10, couleur: 'from-purple-500 to-purple-700', performance: 85.2, fluxJour: 756 },
    { groupe: 'E', nom: 'Agences Spécialisées', count: 0, couleur: 'from-orange-500 to-orange-700', performance: 0, fluxJour: 0 },
    { groupe: 'F', nom: 'Institutions Judiciaires', count: 0, couleur: 'from-gray-500 to-gray-700', performance: 0, fluxJour: 0 },
    { groupe: 'G', nom: 'Administrations Territoriales', count: 67, couleur: 'from-teal-500 to-teal-700', performance: 83.6, fluxJour: 3456 }
  ];

  const systemesSIG: SystemeSIG[] = [
            { nom: 'ADMIN.GA', gestionnaire: 'DGDI', organismes: 160, mission: 'Plateforme gouvernementale unifiée', couleur: 'blue' },
    { nom: 'GRH_INTÉGRÉ', gestionnaire: 'DG_FONCTION_PUB', organismes: 89, mission: 'Gestion RH gouvernementale', couleur: 'green' },
    { nom: 'SIG_IDENTITÉ', gestionnaire: 'DGDI', organismes: 67, mission: 'Système national identité', couleur: 'purple' },
    { nom: 'STAT_NATIONAL', gestionnaire: 'DG_STATISTIQUE', organismes: 42, mission: 'Système statistique national', couleur: 'orange' },
    { nom: 'CASIER_JUDICIAIRE', gestionnaire: 'MIN_JUSTICE', organismes: 18, mission: 'Justice intégrée', couleur: 'gray' },
    { nom: 'SIGEFI', gestionnaire: 'MIN_ECONOMIE', organismes: 15, mission: 'Système intégré finances', couleur: 'red' }
  ];

  const fluxAdministratifs: FluxAdministratif[] = [
    {
      type: 'HIERARCHIQUE',
      source: 'MIN_INTÉRIEUR',
      destination: 'Gouvernorats',
      volume: 147,
      efficacite: 95.2,
      description: 'Tutelle administrative provinciale'
    },
    {
      type: 'HIERARCHIQUE',
      source: 'Gouvernorats',
      destination: 'Préfectures',
      volume: 892,
      efficacite: 91.8,
      description: 'Coordination départementale'
    },
    {
      type: 'HIERARCHIQUE',
      source: 'Préfectures',
      destination: 'Mairies',
      volume: 1456,
      efficacite: 87.3,
      description: 'Services communaux'
    },
    {
      type: 'HORIZONTAL',
      source: 'Bloc Régalien',
      destination: 'Coordination B1',
      volume: 1847,
      efficacite: 92.3,
      description: 'Intérieur ↔ Justice ↔ Défense ↔ Affaires Étrangères'
    },
    {
      type: 'HORIZONTAL',
      source: 'Bloc Économique',
      destination: 'Coordination B2',
      volume: 2156,
      efficacite: 94.1,
      description: 'Économie ↔ Budget ↔ Commerce ↔ Industrie'
    },
    {
      type: 'TRANSVERSAL',
      source: 'ADMIN.GA',
              destination: '160 Organismes',
      volume: 5420,
      efficacite: 96.7,
      description: 'Plateforme e-gouvernement unifiée'
    }
  ];

  const topOrganismes = [
    { code: 'PRIMATURE', nom: 'Primature', connexions: 32, groupe: 'A' },
    { code: 'MIN_INTERIEUR', nom: 'Min. Intérieur', connexions: 28, groupe: 'B' },
    { code: 'DGDI', nom: 'DGDI', connexions: 24, groupe: 'C' },
    { code: 'DGI', nom: 'DGI', connexions: 22, groupe: 'C' },
    { code: 'MIN_ECONOMIE', nom: 'Min. Économie', connexions: 21, groupe: 'B' },
    { code: 'CNSS', nom: 'CNSS', connexions: 19, groupe: 'D' },
    { code: 'MIN_SANTE', nom: 'Min. Santé', connexions: 18, groupe: 'B' },
    { code: 'GOUV_EST', nom: 'Gouv. Estuaire', connexions: 16, groupe: 'G' },
    { code: 'MIN_JUSTICE', nom: 'Min. Justice', connexions: 15, groupe: 'B' },
    { code: 'MIN_EDUCATION', nom: 'Min. Éducation', connexions: 14, groupe: 'B' }
  ];

  // Organismes filtrés
  const organismesFiltres = useMemo(() => {
    let filtres = Object.values(organismes);

    if (rechercheTerme) {
      filtres = filtres.filter(org =>
        org.nom.toLowerCase().includes(rechercheTerme.toLowerCase()) ||
        org.code.toLowerCase().includes(rechercheTerme.toLowerCase()) ||
        org.mission.toLowerCase().includes(rechercheTerme.toLowerCase()) ||
        org.attributions.some(attr => attr.toLowerCase().includes(rechercheTerme.toLowerCase()))
      );
    }

    if (groupeSelectionne !== 'TOUS') {
      filtres = filtres.filter(org => org.groupe === groupeSelectionne);
    }

    if (typeSelectionne !== 'TOUS') {
      filtres = filtres.filter(org => org.type === typeSelectionne);
    }

    return filtres;
  }, [organismes, rechercheTerme, groupeSelectionne, typeSelectionne]);

  // Fonctions utilitaires
  const getIconeGroupe = (groupe: string) => {
    switch (groupe) {
      case 'A': return Crown;
      case 'B': return Building2;
      case 'C': return Target;
      case 'D': return Factory;
      case 'E': return Globe;
      case 'F': return Scale;
      case 'G': return Flag;
      default: return Building2;
    }
  };

  const getIconeType = (type: string) => {
    switch (type) {
      case 'INSTITUTION_SUPREME': return Crown;
      case 'MINISTERE': return Building2;
      case 'DIRECTION_GENERALE': return Target;
      case 'ETABLISSEMENT_PUBLIC': return Factory;
      case 'AGENCE_SPECIALISEE': return Globe;
      case 'INSTITUTION_JUDICIAIRE': return Scale;
      case 'GOUVERNORAT': return Flag;
      case 'PREFECTURE': return MapPin;
      case 'MAIRIE': return Home;
      default: return Building2;
    }
  };

  const getCouleurStatut = (performance: number) => {
    if (performance >= 95) return 'text-green-600 bg-green-100';
    if (performance >= 90) return 'text-blue-600 bg-blue-100';
    if (performance >= 85) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getNiveauPerformance = (performance: number) => {
    if (performance >= 95) return 'Excellent';
    if (performance >= 90) return 'Très Bon';
    if (performance >= 85) return 'Bon';
    if (performance >= 80) return 'Satisfaisant';
    return 'À Améliorer';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Crown className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Structure Administrative Officielle Gabonaise</h1>
              <p className="text-blue-100">160 Organismes Publics • 9 Groupes (A-I) • République Gabonaise</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">87.5%</div>
            <div className="text-sm text-blue-100">Performance Nationale</div>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher organisme, mission, attributions..."
                value={rechercheTerme}
                onChange={(e) => setRechercheTerme(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
          </div>

          <Select value={groupeSelectionne} onValueChange={setGroupeSelectionne}>
            <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Groupe officiel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TOUS">Tous les groupes</SelectItem>
              <SelectItem value="A">Groupe A - Institutions Suprêmes</SelectItem>
              <SelectItem value="B">Groupe B - Ministères Sectoriels</SelectItem>
              <SelectItem value="C">Groupe C - Directions Générales</SelectItem>
              <SelectItem value="D">Groupe D - Établissements Publics</SelectItem>
              <SelectItem value="E">Groupe E - Agences Spécialisées</SelectItem>
              <SelectItem value="F">Groupe F - Institutions Judiciaires</SelectItem>
              <SelectItem value="G">Groupe G - Administrations Territoriales</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeSelectionne} onValueChange={setTypeSelectionne}>
            <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Type d'organisme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TOUS">Tous les types</SelectItem>
              <SelectItem value="INSTITUTION_SUPREME">Institution Suprême</SelectItem>
              <SelectItem value="MINISTERE">Ministère</SelectItem>
              <SelectItem value="DIRECTION_GENERALE">Direction Générale</SelectItem>
              <SelectItem value="ETABLISSEMENT_PUBLIC">Établissement Public</SelectItem>
              <SelectItem value="GOUVERNORAT">Gouvernorat</SelectItem>
              <SelectItem value="PREFECTURE">Préfecture</SelectItem>
              <SelectItem value="MAIRIE">Mairie</SelectItem>
            </SelectContent>
          </Select>

          <Badge variant="outline" className="px-3 py-1 bg-white/10 border-white/20 text-white">
                          {organismesFiltres.length} / 160 organismes
          </Badge>
        </div>
      </div>

      {/* Navigation par onglets */}
      <Tabs value={ongletActif} onValueChange={setOngletActif}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="structure" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Structure Générale
          </TabsTrigger>
          <TabsTrigger value="groupes" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Groupes A-G
          </TabsTrigger>
          <TabsTrigger value="flux" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Flux Administratifs
          </TabsTrigger>
          <TabsTrigger value="sig" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Systèmes SIG
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* STRUCTURE GÉNÉRALE */}
        <TabsContent value="structure" className="space-y-6">
          {/* Métriques principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-blue-700">117</div>
                    <p className="text-sm text-blue-600 mt-1">Organismes Officiels</p>
                  </div>
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-green-700">7</div>
                    <p className="text-sm text-green-600 mt-1">Groupes (A-G)</p>
                  </div>
                  <Layers className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-purple-700">6</div>
                    <p className="text-sm text-purple-600 mt-1">Systèmes SIG</p>
                  </div>
                  <Database className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-orange-700">87.5%</div>
                    <p className="text-sm text-orange-600 mt-1">Performance Globale</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hiérarchie administrative */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Hiérarchie Administrative Officielle
              </CardTitle>
              <CardDescription>
                Structure descendante selon la logique gouvernementale gabonaise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Niveau 1 - Institutions Suprêmes */}
                <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <Crown className="h-8 w-8 text-red-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-800">Niveau 1 : Institutions Suprêmes (A)</h3>
                    <p className="text-sm text-red-600">Présidence → Primature</p>
                  </div>
                  <Badge className="bg-red-600 text-white">2 organismes</Badge>
                </div>

                <ArrowRight className="h-6 w-6 text-gray-400 mx-auto" />

                {/* Niveau 2 - Ministères */}
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-800">Niveau 2 : Ministères Sectoriels (B)</h3>
                    <p className="text-sm text-blue-600">5 Blocs : Régalien, Économique, Social, Infrastructure, Innovation</p>
                  </div>
                  <Badge className="bg-blue-600 text-white">30 organismes</Badge>
                </div>

                <ArrowRight className="h-6 w-6 text-gray-400 mx-auto" />

                {/* Niveau 3 - Directions & Établissements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <Target className="h-8 w-8 text-green-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-800">Directions Générales (C)</h3>
                      <p className="text-sm text-green-600">DGI, DGDI, Douanes, etc.</p>
                    </div>
                    <Badge className="bg-green-600 text-white">8</Badge>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <Factory className="h-8 w-8 text-purple-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-purple-800">Établissements Publics (D)</h3>
                      <p className="text-sm text-purple-600">CNSS, CNAMGS, UOB, etc.</p>
                    </div>
                    <Badge className="bg-purple-600 text-white">10</Badge>
                  </div>
                </div>

                <ArrowRight className="h-6 w-6 text-gray-400 mx-auto" />

                {/* Niveau 4-6 - Administrations Territoriales */}
                <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-lg border-l-4 border-teal-500">
                  <Flag className="h-8 w-8 text-teal-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-teal-800">Administrations Territoriales (G)</h3>
                    <p className="text-sm text-teal-600">Gouvernorats (9) → Préfectures (48) → Mairies (50)</p>
                  </div>
                  <Badge className="bg-teal-600 text-white">107 organismes</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des organismes filtrés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Organismes Filtrés
                <Badge variant="outline">{organismesFiltres.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {organismesFiltres.map((organisme) => {
                  const IconeType = getIconeType(organisme.type);
                  const IconeGroupe = getIconeGroupe(organisme.groupe);

                  return (
                    <div
                      key={organisme.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setOrganismeDetailModal(organisme)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <IconeType className="h-5 w-5 text-blue-600" />
                          <Badge variant="outline" className="text-xs">
                            Groupe {organisme.groupe}
                          </Badge>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>

                      <h4 className="font-medium text-sm mb-1 line-clamp-2">{organisme.nom}</h4>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{organisme.mission}</p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{organisme.ville}</span>
                        <span>Niveau {organisme.niveau}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GROUPES A-G */}
        <TabsContent value="groupes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {statistiquesParGroupe.map((stat) => {
              const IconeGroupe = getIconeGroupe(stat.groupe);
              const isImplemented = stat.count > 0;

              return (
                <Card key={stat.groupe} className={`${isImplemented ? 'border-2' : 'border border-dashed opacity-60'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.couleur} flex items-center justify-center`}>
                          <IconeGroupe className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold">Groupe {stat.groupe}</div>
                          <div className="text-sm text-muted-foreground">{stat.nom}</div>
                        </div>
                      </div>
                      <Badge className={isImplemented ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                        {isImplemented ? `${stat.count} organismes` : 'À définir'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isImplemented ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">{stat.performance}%</div>
                            <div className="text-xs text-gray-500">Performance</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">{stat.fluxJour.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">Flux/jour</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-600">{stat.count}</div>
                            <div className="text-xs text-gray-500">Organismes</div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Efficacité</span>
                            <span className={getCouleurStatut(stat.performance)}>
                              {getNiveauPerformance(stat.performance)}
                            </span>
                          </div>
                          <Progress value={stat.performance} className="h-2" />
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setGroupeSelectionne(stat.groupe)}
                          className="w-full"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Voir les organismes
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-3">Groupe à implémenter</p>
                        <p className="text-xs text-gray-500">
                          {stat.groupe === 'E' ? 'Agences de régulation, organismes de contrôle' :
                           stat.groupe === 'F' ? 'Cour de Cassation, Cours d\'Appel, Tribunaux' :
                           'Organismes spécialisés'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* FLUX ADMINISTRATIFS */}
        <TabsContent value="flux" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Flux hiérarchiques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 rotate-90" />
                  Flux Hiérarchiques Descendants
                </CardTitle>
                <CardDescription>
                  Relations de tutelle selon la structure officielle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fluxAdministratifs.filter(f => f.type === 'HIERARCHIQUE').map((flux, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <ArrowRight className="h-4 w-4 text-blue-600 rotate-90" />
                        <div>
                          <div className="font-medium">{flux.source} → {flux.destination}</div>
                          <div className="text-sm text-gray-600">{flux.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">{flux.volume}</div>
                        <div className="text-xs text-gray-500">{flux.efficacite}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Flux horizontaux */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  Flux Horizontaux Inter-Ministériels
                </CardTitle>
                <CardDescription>
                  Coordination par blocs sectoriels (B1-B5)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fluxAdministratifs.filter(f => f.type === 'HORIZONTAL').map((flux, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <ArrowRight className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="font-medium">{flux.source}</div>
                          <div className="text-sm text-gray-600">{flux.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{flux.volume}</div>
                        <div className="text-xs text-gray-500">{flux.efficacite}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Flux transversaux */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Flux Transversaux via Systèmes SIG
              </CardTitle>
              <CardDescription>
                Échanges via les plateformes d'information gouvernementales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fluxAdministratifs.filter(f => f.type === 'TRANSVERSAL').map((flux, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <div className="flex items-center gap-3">
                      <Network className="h-6 w-6 text-purple-600" />
                      <div>
                        <div className="font-medium text-lg">{flux.source}</div>
                        <div className="text-sm text-gray-600">{flux.description}</div>
                        <div className="text-xs text-purple-600 font-medium">→ {flux.destination}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{flux.volume}</div>
                      <div className="text-sm text-gray-500">échanges/jour</div>
                      <div className="text-xs text-purple-600">{flux.efficacite}% efficacité</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SYSTÈMES SIG */}
        <TabsContent value="sig" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemesSIG.map((sig, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className={`h-5 w-5 text-${sig.couleur}-600`} />
                      <span className="text-lg">{sig.nom}</span>
                    </div>
                    <Badge className={`bg-${sig.couleur}-100 text-${sig.couleur}-800`}>
                      {sig.organismes} orgs
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Gestionnaire</Label>
                      <p className="text-sm text-gray-600">{sig.gestionnaire}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Mission</Label>
                      <p className="text-sm text-gray-600">{sig.mission}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Taux de connexion</span>
                      <span className="text-sm font-bold text-green-600">
                        {((sig.organismes / 117) * 100).toFixed(1)}%
                      </span>
                    </div>

                    <Progress
                      value={(sig.organismes / 117) * 100}
                      className={`h-2 bg-${sig.couleur}-100`}
                    />

                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Voir détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ANALYTICS */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Top 10 organismes les plus connectés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Top 10 Organismes les Plus Connectés
              </CardTitle>
              <CardDescription>
                Centralité administrative selon la logique officielle gabonaise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topOrganismes.map((org, index) => (
                  <div key={org.code} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      {index < 3 && (
                        <div className="flex">
                          {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                          {index === 1 && <Trophy className="h-4 w-4 text-gray-400" />}
                          {index === 2 && <Award className="h-4 w-4 text-orange-500" />}
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{org.nom}</div>
                        <div className="text-sm text-gray-600">Groupe {org.groupe}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{org.connexions} relations</Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Métriques de performance par groupe */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance par Groupes Officiels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statistiquesParGroupe.filter(s => s.count > 0).map((stat) => (
                  <div key={stat.groupe} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${stat.couleur}`} />
                      <span className="font-medium">Groupe {stat.groupe}: {stat.nom}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-green-600">{stat.performance}%</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${stat.couleur} h-2 rounded-full`}
                          style={{ width: `${stat.performance}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal détail organisme */}
      <Dialog open={!!organismeDetailModal} onOpenChange={() => setOrganismeDetailModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {organismeDetailModal && (
                <>
                  {React.createElement(getIconeType(organismeDetailModal.type), { className: "h-5 w-5" })}
                  {organismeDetailModal.nom}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {organismeDetailModal?.mission}
            </DialogDescription>
          </DialogHeader>

          {organismeDetailModal && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Code</Label>
                  <p className="text-sm">{organismeDetailModal.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Groupe</Label>
                  <p className="text-sm">Groupe {organismeDetailModal.groupe}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <p className="text-sm">{organismeDetailModal.type.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Niveau</Label>
                  <p className="text-sm">Niveau {organismeDetailModal.niveau}</p>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium">Attributions principales</Label>
                <ul className="mt-2 space-y-1">
                  {organismeDetailModal.attributions.slice(0, 5).map((attr, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                      {attr}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Label className="text-sm font-medium">Localisation</Label>
                <p className="text-sm text-gray-600">
                  {organismeDetailModal.adresse}, {organismeDetailModal.ville}, {organismeDetailModal.province}
                </p>
              </div>

              {organismeDetailModal.telephone && (
                <div>
                  <Label className="text-sm font-medium">Contact</Label>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {organismeDetailModal.telephone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {organismeDetailModal.telephone}
                      </span>
                    )}
                    {organismeDetailModal.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {organismeDetailModal.email}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
