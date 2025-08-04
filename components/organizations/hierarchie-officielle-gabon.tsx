/* @ts-nocheck */
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  GitBranch, Network, Building2, Users, Share2, Eye, Search, Filter,
  Crown, Star, Shield, Scale, GraduationCap, Briefcase, Car, Home,
  MapPin, Globe, Flag, Award, Target, Zap, Layers, Trees, Mountain,
  Calculator, Radio, Heart, Stethoscope, TrendingUp, Factory,
  ChevronDown, ChevronRight, ExternalLink, Info, Settings,
  BarChart3, ArrowRight, ArrowDown, Maximize2, Minimize2, Database,
  Vote, Landmark, Cpu, Phone, Mail, Wrench
} from 'lucide-react';

// Import statique supprimé - utiliser les APIs TRPC à la place
// import { relationsGenerator, RELATIONS_GENEREES } from '@/lib/services/relations-generator'; // Fichier supprimé

// === INTERFACES MISES À JOUR ===
interface NodeHierarchique {
  organisme: any;
  children: NodeHierarchique[];
  level: number;
  expanded: boolean;
  relations: {
    hierarchiques: number;
    collaboratives: number;
    informationnelles: number;
    total: number;
  };
  connected: string[];
}

interface StatistiquesHierarchie {
  totalOrganismes: number;
  totalRelations: number;
  organismesByGroupe: Record<string, number>;
  organismesByType: Record<string, number>;
  relationsByType: Record<string, number>;
  niveauxHierarchiques: number;
  densiteRelationnelle: number;
  topConnectes: Array<{ code: string; nom: string; relations: number }>;
}

export function HierarchieOfficielleGabon() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroupe, setSelectedGroupe] = useState<string>('TOUS_GROUPES');
  const [selectedType, setSelectedType] = useState<string>('TOUS_TYPES');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['PRESIDENCE', 'PRIMATURE']));
  const [viewMode, setViewMode] = useState<'tree' | 'network' | 'flat'>('tree');
  const [showStats, setShowStats] = useState(true);

  // === DONNÉES ENRICHIES ===
  // Données mockées réalistes en attendant l'intégration TRPC complète
  const organismes = useMemo(() => [
    {
      code: 'PRESIDENCE',
      nom: 'Présidence de la République',
      groupe: 'A',
      type: 'PRESIDENCE',
      niveau: 1,
      parentId: null
    },
    {
      code: 'PRIMATURE',
      nom: 'Primature',
      groupe: 'A',
      type: 'PRIMATURE',
      niveau: 2,
      parentId: 'PRESIDENCE'
    },
    {
      code: 'MIN_INTERIEUR',
      nom: 'Ministère de l\'Intérieur',
      groupe: 'B',
      type: 'MINISTERE',
      niveau: 3,
      parentId: 'PRIMATURE'
    }
  ], []);

  const relations = useMemo(() => ({
    'PRESIDENCE': {
      enfants: ['PRIMATURE'],
      type: 'hierarchique'
    },
    'PRIMATURE': {
      enfants: ['MIN_INTERIEUR'],
      type: 'hierarchique'
    }
  }), []); // TODO: Remplacer par un appel TRPC pour les relations

  // === CALCUL DES STATISTIQUES ===
  const statistiques = useMemo((): StatistiquesHierarchie => {
    const organismesByGroupe = organismes.reduce((acc, org) => {
      acc[org.groupe] = (acc[org.groupe] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const organismesByType = organismes.reduce((acc, org) => {
      acc[org.type] = (acc[org.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const relationsByType = relations.reduce((acc, rel) => {
      acc[rel.type] = (acc[rel.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculer les organismes les plus connectés
    const connectionsCount: Record<string, number> = {};
    relations.forEach(rel => {
      connectionsCount[rel.sourceId] = (connectionsCount[rel.sourceId] || 0) + 1;
      connectionsCount[rel.targetId] = (connectionsCount[rel.targetId] || 0) + 1;
    });

    const topConnectes = Object.entries(connectionsCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([code, relations]) => {
        const org = organismes.find(o => o.code === code);
        return {
          code,
          nom: org?.nom || code,
          relations
        };
      });

    const niveauxHierarchiques = Math.max(...organismes.map(o => o.niveau || 1));
    const maxPossibleRelations = (organismes.length * (organismes.length - 1)) / 2;
    const densiteRelationnelle = (relations.length / maxPossibleRelations) * 100;

    return {
      totalOrganismes: organismes.length,
      totalRelations: relations.length,
      organismesByGroupe,
      organismesByType,
      relationsByType,
      niveauxHierarchiques,
      densiteRelationnelle: Math.round(densiteRelationnelle * 100) / 100,
      topConnectes
    };
  }, [organismes, relations]);

  // === CONSTRUCTION DE L'ARBRE HIÉRARCHIQUE ===
  const hierarchieTree = useMemo(() => {
    const organismeMap = new Map(organismes.map(org => [org.code, org]));
    const relationMap = new Map<string, string[]>();

    // Construire la carte des relations
    relations.forEach(rel => {
      if (rel.type === 'HIERARCHIQUE') {
        if (!relationMap.has(rel.sourceId)) relationMap.set(rel.sourceId, []);
        relationMap.get(rel.sourceId)!.push(rel.targetId);
      }
    });

    // Fonction pour construire un nœud
    const buildNode = (organisme: any, level: number): NodeHierarchique => {
      const orgRelations = relationsGenerator.getRelationsForOrganisme(organisme.code);
      const hierarchiques = orgRelations.filter(r => r.type === 'HIERARCHIQUE').length;
      const collaboratives = orgRelations.filter(r => r.type === 'COLLABORATIVE').length;
      const informationnelles = orgRelations.filter(r => r.type === 'INFORMATIONELLE').length;

      const children: NodeHierarchique[] = [];
      const childrenCodes = relationMap.get(organisme.code) || organisme.flux?.hierarchiquesDescendants || [];

      childrenCodes.forEach(childCode => {
        const childOrg = organismeMap.get(childCode);
        if (childOrg && childOrg.parentId === organisme.code) {
          children.push(buildNode(childOrg, level + 1));
        }
      });

      return {
        organisme,
        children: children.sort((a, b) => a.organisme.nom.localeCompare(b.organisme.nom)),
        level,
        expanded: expandedNodes.has(organisme.code),
        relations: {
          hierarchiques,
          collaboratives,
          informationnelles,
          total: orgRelations.length
        },
        connected: orgRelations.map(r => r.sourceId === organisme.code ? r.targetId : r.sourceId)
      };
    };

    // Construire l'arbre depuis les racines
    const roots = organismes.filter(org => !org.parentId || org.parentId === '' || org.niveau === 1);
    return roots.map(root => buildNode(root, 1));
  }, [organismes, relations, expandedNodes]);

  // === ORGANISMES FILTRÉS ===
  const organismesFilters = useMemo(() => {
    return organismes.filter(org => {
      const matchGroupe = selectedGroupe === 'TOUS_GROUPES' || org.groupe === selectedGroupe;
      const matchType = selectedType === 'TOUS_TYPES' || org.type === selectedType;
      const matchSearch = !searchTerm ||
        org.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.sigle?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchGroupe && matchType && matchSearch;
    });
  }, [organismes, selectedGroupe, selectedType, searchTerm]);

  // === HANDLERS ===
  const toggleNode = useCallback((nodeCode: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeCode)) {
        newSet.delete(nodeCode);
      } else {
        newSet.add(nodeCode);
      }
      return newSet;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedNodes(new Set(organismes.map(o => o.code)));
  }, [organismes]);

  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set(['PRESIDENCE', 'PRIMATURE']));
  }, []);

  // === GETTERS POUR L'AFFICHAGE ===
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

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      'INSTITUTION_SUPREME': Crown,
      'MINISTERE': Building2,
      'DIRECTION_GENERALE': Target,
      'ETABLISSEMENT_PUBLIC': Factory,
      'GOUVERNORAT': Flag,
      'MAIRIE': Home,
      'PREFECTURE': MapPin,
      'ORGANISME_SOCIAL': Users,
      'AGENCE_PUBLIQUE': Settings,
      'INSTITUTION_JUDICIAIRE': Scale
    };
    return icons[type] || Building2;
  };

  // === RENDU DU NŒUD HIÉRARCHIQUE ===
  const renderNode = (node: NodeHierarchique, index: number) => {
    const { organisme, children, level, expanded, relations } = node;
    const GroupeIcon = getGroupeIcon(organisme.groupe);
    const TypeIcon = getTypeIcon(organisme.type);
    const hasChildren = children.length > 0;

    return (
      <div key={organisme.code} className="mb-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {/* Indentation et expand/collapse */}
                <div className="flex items-center" style={{ marginLeft: `${(level - 1) * 20}px` }}>
                  {hasChildren && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleNode(organisme.code)}
                      className="p-1 h-6 w-6"
                    >
                      {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  )}
                  {!hasChildren && <div className="w-6" />}
                </div>

                {/* Icône du groupe */}
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                  <GroupeIcon className="h-4 w-4 text-white" />
                </div>

                {/* Informations de l'organisme */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{organisme.nom}</h4>
                    <Badge className={getGroupeColor(organisme.groupe)} variant="outline">
                      {organisme.groupe}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {organisme.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{organisme.mission}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>📍 {organisme.ville}</span>
                    <span>📊 Niveau {organisme.niveau}</span>
                    <span>🔗 {relations.total} relations</span>
                  </div>
                </div>

                {/* Statistiques des relations */}
                <div className="flex flex-col gap-1 text-xs">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    H: {relations.hierarchiques}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    C: {relations.collaboratives}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    I: {relations.informationnelles}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Network className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enfants */}
        {expanded && hasChildren && (
          <div className="ml-4 mt-2 border-l-2 border-gray-200 pl-4">
            {children.map((child, childIndex) => renderNode(child, childIndex))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Organismes</p>
                <p className="text-2xl font-bold text-blue-600">{statistiques.totalOrganismes}</p>
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
                <p className="text-2xl font-bold text-green-600">{statistiques.totalRelations}</p>
              </div>
              <Network className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Niveaux Hiérarchiques</p>
                <p className="text-2xl font-bold text-purple-600">{statistiques.niveauxHierarchiques}</p>
              </div>
              <Layers className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Densité Relationnelle</p>
                <p className="text-2xl font-bold text-orange-600">{statistiques.densiteRelationnelle}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contrôles et filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Hiérarchie Administrative Officielle
          </CardTitle>
          <CardDescription>
            Structure hiérarchique mise à jour avec {statistiques.totalOrganismes} organismes et {statistiques.totalRelations} relations
          </CardDescription>
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
                <SelectItem value="TOUS_GROUPES">Tous les groupes</SelectItem>
                {Object.keys(statistiques.organismesByGroupe).sort().map(groupe => (
                  <SelectItem key={groupe} value={groupe}>
                    Groupe {groupe} ({statistiques.organismesByGroupe[groupe]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TOUS_TYPES">Tous les types</SelectItem>
                {Object.keys(statistiques.organismesByType).map(type => (
                  <SelectItem key={type} value={type}>
                    {type} ({statistiques.organismesByType[type]})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={expandAll}>
                <Maximize2 className="h-4 w-4 mr-1" />
                Tout Expandre
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll}>
                <Minimize2 className="h-4 w-4 mr-1" />
                Tout Réduire
              </Button>
            </div>
          </div>

          {/* Mode d'affichage */}
          <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <TabsList>
              <TabsTrigger value="tree">Vue Arbre</TabsTrigger>
              <TabsTrigger value="network">Vue Réseau</TabsTrigger>
              <TabsTrigger value="flat">Vue Liste</TabsTrigger>
            </TabsList>

            <TabsContent value="tree" className="mt-4">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-2">
                  {hierarchieTree.map((node, index) => renderNode(node, index))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="network" className="mt-4">
              <Card className="p-6">
                <div className="text-center text-gray-500">
                  <Network className="h-12 w-12 mx-auto mb-4" />
                  <p>Vue réseau en cours de développement</p>
                  <p className="text-sm">Affichera les {statistiques.totalRelations} relations graphiquement</p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="flat" className="mt-4">
              <ScrollArea className="h-[600px]">
                <div className="grid gap-4">
                  {organismesFilters.map((organisme) => {
                    const orgRelations = relationsGenerator.getRelationsForOrganisme(organisme.code);
                    const GroupeIcon = getGroupeIcon(organisme.groupe);

                    return (
                      <Card key={organisme.code} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                                <GroupeIcon className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">{organisme.nom}</h4>
                                  <Badge className={getGroupeColor(organisme.groupe)}>
                                    {organisme.groupe}
                                  </Badge>
                                  <Badge variant="secondary">{organisme.type}</Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{organisme.mission}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>📍 {organisme.ville}</span>
                                  <span>📊 Niveau {organisme.niveau}</span>
                                  <span>🔗 {orgRelations.length} relations</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Statistiques détaillées */}
      {showStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Répartition par Groupe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(statistiques.organismesByGroupe).map(([groupe, count]) => (
                <div key={groupe} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Groupe {groupe}</span>
                    <span>{count} organismes</span>
                  </div>
                  <Progress
                    value={(count / statistiques.totalOrganismes) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top 10 Organismes Connectés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {statistiques.topConnectes.map((org, index) => (
                  <div key={org.code} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium text-sm">{org.code}</p>
                        <p className="text-xs text-gray-600 truncate max-w-[200px]">{org.nom}</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {org.relations} relations
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
