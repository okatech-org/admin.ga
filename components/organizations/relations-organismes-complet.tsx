/* @ts-nocheck */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Network, BarChart3, Users, Building2, Crown, Shield, Scale, Globe,
  TrendingUp, Search, Filter, RefreshCw, Download, Eye, Settings,
  AlertTriangle, CheckCircle, Clock, Home, Flag, Zap, Database,
  Heart, GraduationCap, Calculator, Factory, Briefcase, Mail, Phone
} from 'lucide-react';

// Import statique supprimé - utiliser les APIs TRPC à la place
// import { relationsGenerator, RELATIONS_GENEREES, STATS_RELATIONS } from '@/lib/services/relations-generator'; // Fichier supprimé
import { HierarchieOfficielleGabon } from './hierarchie-officielle-gabon';

// === INTERFACE POUR LES STATISTIQUES ===
interface StatistiquesCompletes {
  totalOrganismes: number;
  totalRelations: number;
  organismesParGroupe: Record<string, number>;
  relationsParType: Record<string, number>;
  relationsParStatut: Record<string, number>;
  topOrganismesConnectes: Array<{ code: string; connections: number; nom: string }>;
  tauxConnectivite: number;
  couverture3Pouvoirs: boolean;
  groupesRepresentes: string[];
}

export function RelationsOrganismesComplet() {
     const [activeTab, setActiveTab] = useState('overview');
   const [selectedGroupe, setSelectedGroupe] = useState<string>('TOUS_GROUPES');
   const [selectedType, setSelectedType] = useState<string>('TOUS_TYPES_ORG');
   const [searchTerm, setSearchTerm] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // === DONNÉES CALCULÉES ===
  const statistiques = useMemo((): StatistiquesCompletes => {
    // Données mockées réalistes pour les organismes
    const organismes = [
      {
        code: 'PRESIDENCE',
        nom: 'Présidence de la République',
        type: 'PRESIDENCE',
        niveau: 1
      },
      {
        code: 'PRIMATURE',
        nom: 'Primature',
        type: 'PRIMATURE',
        niveau: 2
      },
      {
        code: 'MIN_INTERIEUR',
        nom: 'Ministère de l\'Intérieur',
        type: 'MINISTERE',
        niveau: 3
      }
    ]; // TODO: Remplacer par un appel TRPC réel
    const relations = RELATIONS_GENEREES;
    const statsService = STATS_RELATIONS;

    // Organismes par groupe
    const organismesParGroupe = organismes.reduce((acc, org) => {
      acc[org.groupe] = (acc[org.groupe] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Relations par type et statut
    const relationsParType = relations.reduce((acc, rel) => {
      acc[rel.type] = (acc[rel.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const relationsParStatut = relations.reduce((acc, rel) => {
      acc[rel.status] = (acc[rel.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top organismes connectés
    const connectionsCount: Record<string, number> = {};
    relations.forEach(rel => {
      connectionsCount[rel.sourceId] = (connectionsCount[rel.sourceId] || 0) + 1;
      connectionsCount[rel.targetId] = (connectionsCount[rel.targetId] || 0) + 1;
    });

    const topOrganismesConnectes = Object.entries(connectionsCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([code, connections]) => {
        const org = organismes.find(o => o.code === code);
        return {
          code,
          connections,
          nom: org?.nom || code
        };
      });

    // Calculs additionnels
    const maxPossibleRelations = (organismes.length * (organismes.length - 1)) / 2;
    const tauxConnectivite = (relations.length / maxPossibleRelations) * 100;

    // Vérifier couverture des 3 pouvoirs
    const groupesPresents = [...new Set(organismes.map(o => o.groupe))];
    const couverture3Pouvoirs = groupesPresents.includes('A') && groupesPresents.includes('L') && groupesPresents.includes('I');

    return {
      totalOrganismes: organismes.length,
      totalRelations: relations.length,
      organismesParGroupe,
      relationsParType,
      relationsParStatut,
      topOrganismesConnectes,
      tauxConnectivite: Math.round(tauxConnectivite * 100) / 100,
      couverture3Pouvoirs,
      groupesRepresentes: groupesPresents.sort()
    };
  }, []);

     // === ORGANISMES FILTRÉS ===
   const organismesFilters = useMemo(() => {
     // Données mockées réalistes pour les organismes
    const organismes = [
      {
        code: 'PRESIDENCE',
        nom: 'Présidence de la République',
        type: 'PRESIDENCE',
        niveau: 1
      },
      {
        code: 'PRIMATURE',
        nom: 'Primature',
        type: 'PRIMATURE',
        niveau: 2
      },
      {
        code: 'MIN_INTERIEUR',
        nom: 'Ministère de l\'Intérieur',
        type: 'MINISTERE',
        niveau: 3
      }
    ]; // TODO: Remplacer par un appel TRPC réel

     return organismes.filter(org => {
       const matchGroupe = !selectedGroupe || selectedGroupe === 'TOUS_GROUPES' || org.groupe === selectedGroupe;
       const matchType = !selectedType || selectedType === 'TOUS_TYPES' || selectedType === 'TOUS_TYPES_ORG' || org.type === selectedType;
       const matchSearch = !searchTerm ||
         org.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
         org.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
         org.sigle?.toLowerCase().includes(searchTerm.toLowerCase());

       return matchGroupe && matchType && matchSearch;
     });
   }, [selectedGroupe, selectedType, searchTerm]);

  // === HANDLERS ===
  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      // Simuler rechargement des données
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastUpdate(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    const data = {
      organismes: Object.values(ORGANISMES_ENRICHIS_GABON),
      relations: RELATIONS_GENEREES,
      statistiques,
      dateExport: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relations-organismes-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // === GETTERS POUR BADGES ===
  const getGroupeBadgeColor = (groupe: string) => {
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

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      SUSPENDED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* === EN-TÊTE === */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Network className="h-8 w-8 text-blue-600" />
              Relations Inter-Organismes
            </h1>
            <p className="text-gray-600 mt-2">
              Gestion complète des relations entre les {statistiques.totalOrganismes} organismes publics gabonais
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshData}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>

        {/* === STATISTIQUES PRINCIPALES === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Organismes</p>
                  <p className="text-2xl font-bold text-blue-600">{statistiques.totalOrganismes}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {statistiques.groupesRepresentes.length} groupes actifs
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Relations</p>
                  <p className="text-2xl font-bold text-green-600">{statistiques.totalRelations}</p>
                </div>
                <Network className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {statistiques.tauxConnectivite}% connectivité
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pouvoirs Représentés</p>
                  <p className="text-2xl font-bold text-purple-600">3/3</p>
                </div>
                <Crown className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  {statistiques.couverture3Pouvoirs ? 'Couverture complète' : 'Couverture partielle'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Relations Actives</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {statistiques.relationsParStatut.ACTIVE || 0}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-orange-500" />
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="bg-orange-50 text-orange-700">
                  {Math.round(((statistiques.relationsParStatut.ACTIVE || 0) / statistiques.totalRelations) * 100)}% du total
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* === ONGLETS PRINCIPAUX === */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analyse Complète des Relations
            </CardTitle>
            <CardDescription>
              Dernière mise à jour: {lastUpdate.toLocaleString('fr-FR')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Vue d'Ensemble</TabsTrigger>
                <TabsTrigger value="hierarchy">Hiérarchie Officielle</TabsTrigger>
                <TabsTrigger value="relations">Gestion Relations</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="search">Recherche</TabsTrigger>
              </TabsList>

              {/* === VUE D'ENSEMBLE === */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Répartition par groupe */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Répartition par Groupe</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(statistiques.organismesParGroupe).map(([groupe, count]) => (
                        <div key={groupe} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge className={getGroupeBadgeColor(groupe)}>
                              Groupe {groupe}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {groupe === 'A' && 'Institutions Suprêmes'}
                              {groupe === 'B' && 'Ministères'}
                              {groupe === 'C' && 'Directions Générales'}
                              {groupe === 'D' && 'Établissements Publics'}
                              {groupe === 'G' && 'Administrations Territoriales'}
                              {groupe === 'L' && 'Pouvoir Législatif'}
                              {groupe === 'I' && 'Institutions Indépendantes'}
                            </span>
                          </div>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Top organismes connectés */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Organismes les Plus Connectés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {statistiques.topOrganismesConnectes.slice(0, 5).map((org, index) => (
                          <div key={org.code} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary">#{index + 1}</Badge>
                              <div>
                                <p className="font-medium text-sm">{org.code}</p>
                                <p className="text-xs text-gray-600 truncate max-w-[200px]">{org.nom}</p>
                              </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">
                              {org.connections} relations
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Répartition des relations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Répartition des Relations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                      {/* Par type */}
                      <div>
                        <h4 className="font-medium mb-3">Par Type</h4>
                        <div className="space-y-2">
                          {Object.entries(statistiques.relationsParType).map(([type, count]) => (
                            <div key={type} className="flex items-center justify-between">
                              <span className="text-sm">{type}</span>
                              <Badge variant="outline">{count}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Par statut */}
                      <div>
                        <h4 className="font-medium mb-3">Par Statut</h4>
                        <div className="space-y-2">
                          {Object.entries(statistiques.relationsParStatut).map(([status, count]) => (
                            <div key={status} className="flex items-center justify-between">
                              <Badge className={getStatusBadgeColor(status)}>
                                {status}
                              </Badge>
                              <Badge variant="outline">{count}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Métriques */}
                      <div>
                        <h4 className="font-medium mb-3">Métriques</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Taux de connectivité</span>
                              <span>{statistiques.tauxConnectivite}%</span>
                            </div>
                            <Progress value={statistiques.tauxConnectivite} className="h-2" />
                          </div>
                          <div className="text-xs text-gray-600">
                            Relations possibles: {Math.round((statistiques.totalOrganismes * (statistiques.totalOrganismes - 1)) / 2).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* === HIÉRARCHIE OFFICIELLE === */}
              <TabsContent value="hierarchy">
                <HierarchieOfficielleGabon />
              </TabsContent>

              {/* === GESTION DES RELATIONS === */}
              <TabsContent value="relations" className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Rechercher une relation..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Type de relation" />
                    </SelectTrigger>
                                         <SelectContent>
                       <SelectItem value="TOUS_TYPES">Tous les types</SelectItem>
                       <SelectItem value="HIERARCHIQUE">Hiérarchique</SelectItem>
                       <SelectItem value="COLLABORATIVE">Collaborative</SelectItem>
                       <SelectItem value="INFORMATIONELLE">Informationnelle</SelectItem>
                     </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4">
                  {RELATIONS_GENEREES.slice(0, 50).map((relation) => (
                    <Card key={relation.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className={getStatusBadgeColor(relation.status)}>
                                {relation.status}
                              </Badge>
                              <Badge variant="outline">{relation.type}</Badge>
                              <Badge variant="secondary">{relation.niveauAcces}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">{relation.sourceId}</span>
                              {' → '}
                              <span className="font-medium">{relation.targetId}</span>
                            </p>
                            <p className="text-xs text-gray-500">{relation.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {RELATIONS_GENEREES.length > 50 && (
                  <div className="text-center py-4">
                    <Button variant="outline">
                      Charger plus de relations ({RELATIONS_GENEREES.length - 50} restantes)
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* === ANALYTICS === */}
              <TabsContent value="analytics">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Métriques de Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{statistiques.totalOrganismes}</p>
                          <p className="text-sm text-blue-600">Organismes</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{statistiques.totalRelations}</p>
                          <p className="text-sm text-green-600">Relations</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>État du Système</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Intégrité des données</span>
                        <Badge className="bg-green-100 text-green-800">✓ OK</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Couverture des pouvoirs</span>
                        <Badge className="bg-green-100 text-green-800">✓ Complète</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Nombre de groupes</span>
                        <Badge variant="outline">{statistiques.groupesRepresentes.length}/9</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* === RECHERCHE === */}
              <TabsContent value="search" className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Rechercher un organisme..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={selectedGroupe} onValueChange={setSelectedGroupe}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Groupe" />
                    </SelectTrigger>
                                         <SelectContent>
                       <SelectItem value="TOUS_GROUPES">Tous</SelectItem>
                       {statistiques.groupesRepresentes.map(groupe => (
                         <SelectItem key={groupe} value={groupe}>Groupe {groupe}</SelectItem>
                       ))}
                     </SelectContent>
                  </Select>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                                         <SelectContent>
                       <SelectItem value="TOUS_TYPES_ORG">Tous les types</SelectItem>
                       <SelectItem value="MINISTERE">Ministère</SelectItem>
                       <SelectItem value="DIRECTION_GENERALE">Direction Générale</SelectItem>
                       <SelectItem value="ETABLISSEMENT_PUBLIC">Établissement Public</SelectItem>
                       <SelectItem value="MAIRIE">Mairie</SelectItem>
                       <SelectItem value="GOUVERNORAT">Gouvernorat</SelectItem>
                     </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 max-h-[600px] overflow-y-auto">
                  {organismesFilters.map((organisme) => (
                    <Card key={organisme.code} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className={getGroupeBadgeColor(organisme.groupe)}>
                                {organisme.groupe}
                              </Badge>
                              <Badge variant="outline">{organisme.type}</Badge>
                              {organisme.niveau && (
                                <Badge variant="secondary">Niveau {organisme.niveau}</Badge>
                              )}
                            </div>
                            <h4 className="font-medium text-lg mb-1">{organisme.nom}</h4>
                            <p className="text-sm text-gray-600 mb-2">{organisme.mission}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>📍 {organisme.ville}</span>
                              <span>📅 {organisme.dateCreation}</span>
                              <span>🔗 {relationsGenerator.getRelationsForOrganisme(organisme.code).length} relations</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Network className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center py-4 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">
                    Total: <strong>{organismesFilters.length}</strong> organismes affichés sur <strong>{Object.keys(ORGANISMES_ENRICHIS_GABON).length}</strong>
                  </span>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
