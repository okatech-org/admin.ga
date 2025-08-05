'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Imports Dialog supprimés - plus besoin de modale
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { toast } from 'sonner';
import {
  Building2,
  Users,
  Crown,
  Shield,
  MapPin,
  BarChart3,
  Search,
  Filter,
  Eye,
  TrendingUp,
  Activity,
  Briefcase,
  Landmark,
  Scale,
  Home,
  Factory,
  Globe,
  FileText,
  CheckCircle,
  AlertCircle,
  Network,
  Loader2,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  ExternalLink,
  Settings,
  BarChart2,
  Mail,
  Phone
} from 'lucide-react';
import {
  getOrganizationTypeLabel,
  getOrganizationTypeColor,
  getOrganizationBorderColor,
  getOrganizationGroup,
  ORGANIZATION_GROUPS,
  isOrganismePrincipal,
  filterOrganizations,
  sortOrganizations,
  generateOrganizationStats
} from '@/lib/utils/organization-utils';

interface OrganismeVueEnsemble {
  id: string;
  name: string;
  code: string;
  type: string;
  description?: string;
  city?: string;
  isActive: boolean;
  userCount?: number;
}

export default function OrganismesVueEnsemblePage() {
  const [organismes, setOrganismes] = useState<OrganismeVueEnsemble[]>([]);
  const [filteredOrganismes, setFilteredOrganismes] = useState<OrganismeVueEnsemble[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showPrincipalOnly, setShowPrincipalOnly] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [allExpanded, setAllExpanded] = useState(true);
  // État de la modale supprimé - on utilise maintenant expandedGroups pour le déploiement

  // Charger les organismes
  useEffect(() => {
    loadOrganismes();
    // Charger l'état des groupes depuis localStorage
    const savedExpandedState = localStorage.getItem('organismes-expanded-groups');
    if (savedExpandedState) {
      try {
        const parsedState = JSON.parse(savedExpandedState);
        setExpandedGroups(parsedState);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'état des groupes:', error);
      }
    }
  }, []);

  const loadOrganismes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/organizations/list?limit=500');
      const data = await response.json();

      if (data.success) {
        const sortedOrganismes = sortOrganizations(data.data.organizations || []);
        setOrganismes(sortedOrganismes);
      } else {
        throw new Error(data.error || 'Erreur lors du chargement');
      }
    } catch (err) {
      console.error('Erreur chargement organismes:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrage des organismes
  useEffect(() => {
    const filtered = filterOrganizations(organismes, {
      search: searchTerm,
      type: selectedType === 'all' ? undefined : selectedType,
      group: selectedGroup === 'all' ? undefined : selectedGroup,
      isPrincipal: showPrincipalOnly ? true : undefined
    });

    setFilteredOrganismes(filtered);
  }, [organismes, searchTerm, selectedType, selectedGroup, showPrincipalOnly]);

  // Initialiser l'état des groupes quand les organismes sont chargés
  useEffect(() => {
    if (filteredOrganismes.length > 0 && Object.keys(expandedGroups).length === 0) {
      const groupKeys = Array.from(new Set(filteredOrganismes.map(org => getOrganizationGroup(org.type) || 'AUTRE')));
      const initialExpandedState: Record<string, boolean> = {};

      // Par défaut, tous les groupes sont dépliés
      groupKeys.forEach(groupKey => {
        initialExpandedState[groupKey] = true;
      });

      setExpandedGroups(initialExpandedState);
    }
  }, [filteredOrganismes, expandedGroups]);

  // Sauvegarder l'état dans localStorage quand il change
  useEffect(() => {
    if (Object.keys(expandedGroups).length > 0) {
      localStorage.setItem('organismes-expanded-groups', JSON.stringify(expandedGroups));

      // Mettre à jour l'état allExpanded basé sur l'état des groupes
      const expandedValues = Object.values(expandedGroups);
      setAllExpanded(expandedValues.length > 0 && expandedValues.every(Boolean));
    }
  }, [expandedGroups]);

  // Statistiques
  const stats = useMemo(() => {
    return generateOrganizationStats(organismes);
  }, [organismes]);

  // Options pour les filtres
  const typeOptions = useMemo(() => {
    return Array.from(new Set(organismes.map(org => org.type))).sort();
  }, [organismes]);

  // Grouper les organismes par groupe administratif
  const organismesParGroupe = useMemo(() => {
    const grouped: Record<string, OrganismeVueEnsemble[]> = {};

    filteredOrganismes.forEach(org => {
      const group = getOrganizationGroup(org.type) || 'AUTRE';
      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push(org);
    });

    return grouped;
  }, [filteredOrganismes]);

  // Fonctions pour gérer l'expansion des groupes
  const toggleGroupExpansion = (groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  // Fonctions de modale supprimées - maintenant on utilise le déploiement in-place

  const toggleAllGroups = () => {
    const newExpandedState = !allExpanded;
    const newExpandedGroups: Record<string, boolean> = {};

    Object.keys(organismesParGroupe).forEach(groupKey => {
      newExpandedGroups[groupKey] = newExpandedState;
    });

    setExpandedGroups(newExpandedGroups);
    setAllExpanded(newExpandedState);
  };

  // Icônes pour les groupes
  const getGroupIcon = (group: string) => {
    const icons = {
      A: Crown,
      B: Building2,
      C: Briefcase,
      D: Factory,
      E: Scale,
      F: Shield,
      L: Landmark,
      I: Network
    };
    return icons[group as keyof typeof icons] || Building2;
  };

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
            <div>
              <h3 className="font-semibold text-lg">Chargement de la vue d'ensemble...</h3>
              <p className="text-muted-foreground">Récupération des organismes autonomes gabonais</p>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (error) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-96">
            <CardContent className="text-center p-6">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Erreur de chargement</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={loadOrganismes}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Globe className="h-8 w-8 text-green-500" />
              Vue d'ensemble des Organismes Gabonais
            </h1>
            <p className="text-muted-foreground">
              Administration et gestion des {filteredOrganismes.length} organismes gabonais référencés
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadOrganismes}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Button>
              <BarChart3 className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Organismes</p>
                  <h3 className="text-2xl font-bold">{stats.total}</h3>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Organismes Actifs</p>
                  <h3 className="text-2xl font-bold text-green-600">{stats.active}</h3>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Organismes Principaux</p>
                  <h3 className="text-2xl font-bold text-purple-600">{stats.principals}</h3>
                </div>
                <Crown className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Groupes Admin</p>
                  <h3 className="text-2xl font-bold text-orange-600">{Object.keys(stats.byGroup).length}</h3>
                </div>
                <Network className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4 items-end flex-wrap">
              <div className="flex-1 min-w-64">
                <label className="text-sm font-medium mb-2 block">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, code, ville..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Groupe Administratif</label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger className="w-56">
                    <SelectValue placeholder="Tous les groupes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les groupes</SelectItem>
                    {Object.entries(ORGANIZATION_GROUPS).map(([key, group]) => (
                      <SelectItem key={key} value={key}>
                        {(group as any).name} ({stats.byGroup[key] || 0})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Type d'Organisme</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-56">
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {typeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {getOrganizationTypeLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="principalOnly"
                  checked={showPrincipalOnly}
                  onChange={(e) => setShowPrincipalOnly(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="principalOnly" className="text-sm font-medium">
                  Organismes principaux uniquement
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organismes groupés */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Organismes par Groupes Administratifs ({filteredOrganismes.length})
            </h2>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={toggleAllGroups}
                className="flex items-center gap-2"
              >
                {allExpanded ? (
                  <>
                    <Minimize2 className="h-4 w-4" />
                    Réduire tout
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-4 w-4" />
                    Développer tout
                  </>
                )}
              </Button>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {Object.keys(organismesParGroupe).length} groupes
              </Badge>
            </div>
          </div>

          {Object.keys(organismesParGroupe).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(organismesParGroupe).map(([groupKey, groupOrganismes]) => {
              const group = ORGANIZATION_GROUPS[groupKey as keyof typeof ORGANIZATION_GROUPS];
              const isExpanded = expandedGroups[groupKey];
              const GroupIcon = getGroupIcon(groupKey);

                // Couleurs selon les groupes administratifs pour les cartes principales
                const getGroupColors = (group: string) => {
                  switch(group) {
                    case 'A': return { border: 'border-l-purple-500', bg: 'bg-purple-100', text: 'text-purple-600' }; // Institutions Suprêmes
                    case 'B': return { border: 'border-l-green-500', bg: 'bg-green-100', text: 'text-green-600' }; // Ministères
                    case 'C': return { border: 'border-l-blue-500', bg: 'bg-blue-100', text: 'text-blue-600' }; // Directions Générales
                    case 'G': return { border: 'border-l-red-500', bg: 'bg-red-100', text: 'text-red-600' }; // Administrations Territoriales
                    case 'E': return { border: 'border-l-orange-500', bg: 'bg-orange-100', text: 'text-orange-600' }; // Agences Spécialisées
                    case 'F': return { border: 'border-l-yellow-500', bg: 'bg-yellow-100', text: 'text-yellow-600' }; // Institutions Judiciaires
                    case 'L': return { border: 'border-l-indigo-500', bg: 'bg-indigo-100', text: 'text-indigo-600' }; // Pouvoir Législatif
                    case 'I': return { border: 'border-l-pink-500', bg: 'bg-pink-100', text: 'text-pink-600' }; // Institutions Indépendantes
                    default: return { border: 'border-l-gray-500', bg: 'bg-gray-100', text: 'text-gray-600' }; // Autre
                  }
                };

                const colors = getGroupColors(groupKey);

              return (
                  <Card key={groupKey} className={`${colors.border} border-l-4 hover:shadow-lg transition-all duration-300 bg-white ${isExpanded ? 'col-span-full' : ''}`}>
                    <CardContent className="p-6">
                                            {/* Design optimisé des blocs de groupes administratifs */}
                      <div
                        className="cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-white hover:shadow-md transition-all duration-200 rounded-xl -m-2 p-3 group"
                    onClick={() => toggleGroupExpansion(groupKey)}
                        title={isExpanded ? "Cliquer pour réduire" : "Cliquer pour développer"}
                      >
                        {/* En-tête principal simplifié */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`relative p-2.5 rounded-lg ${colors.bg} shadow-md`}>
                            <GroupIcon className={`h-8 w-8 ${colors.text}`} />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-gray-900 leading-tight truncate">
                              {(group as any)?.name || 'Autre'}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-green-50 text-green-700 border-green-200">
                                ACTIF
                              </Badge>
                              <span className="text-xs font-medium text-gray-500 uppercase">
                                GROUPE {groupKey} - NIVEAU {groupKey === 'A' ? '1' : groupKey === 'B' ? '2' : '3'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Description avec informations compactes */}
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                            Code: GRP-{groupKey} • {(group as any)?.description || 'Groupe d\'organismes de l\'administration gabonaise'}
                          </p>
                        </div>

                        {/* Dashboard compact des métriques - Layout optimisé */}
                        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-lg p-3 border border-gray-100 shadow-sm">
                          <div className="grid grid-cols-6 gap-3">
                            {/* Métrique 1: Total */}
                            <div className="text-center">
                              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-1.5 mx-auto">
                                <Building2 className="h-5 w-5 text-blue-600" />
                              </div>
                              <p className="text-xs font-medium text-gray-600">Total</p>
                              <p className="text-lg font-bold text-blue-600">{groupOrganismes.length}</p>
                            </div>

                            {/* Métrique 2: Actifs */}
                            <div className="text-center">
                              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-1.5 mx-auto">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              </div>
                              <p className="text-xs font-medium text-gray-600">Actifs</p>
                              <p className="text-lg font-bold text-green-600">
                                {groupOrganismes.filter(org => org.isActive).length}
                              </p>
                            </div>

                            {/* Métrique 3: Principaux */}
                            <div className="text-center">
                              <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center mb-1.5 mx-auto`}>
                                <Crown className={`h-5 w-5 ${colors.text}`} />
                              </div>
                              <p className="text-xs font-medium text-gray-600">VIP</p>
                              <p className={`text-lg font-bold ${colors.text}`}>
                                {groupOrganismes.filter(org => isOrganismePrincipal(org.type)).length}
                              </p>
                            </div>

                            {/* Métrique 4: Types */}
                            <div className="text-center">
                              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mb-1.5 mx-auto">
                                <Network className="h-5 w-5 text-orange-600" />
                              </div>
                              <p className="text-xs font-medium text-gray-600">Cat.</p>
                              <p className="text-lg font-bold text-orange-600">
                                {Array.from(new Set(groupOrganismes.map(org => org.type))).length}
                              </p>
                            </div>

                            {/* Métrique 5: Agents */}
                            <div className="text-center">
                              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-1.5 mx-auto">
                                <Users className="h-5 w-5 text-purple-600" />
                              </div>
                              <p className="text-xs font-medium text-gray-600">Staff</p>
                              <p className="text-lg font-bold text-purple-600">
                                {groupOrganismes.reduce((total, org) => total + (org.userCount || 0), 0)}
                              </p>
                            </div>

                            {/* Métrique 6: Zones */}
                            <div className="text-center">
                              <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center mb-1.5 mx-auto">
                                <MapPin className="h-5 w-5 text-teal-600" />
                              </div>
                              <p className="text-xs font-medium text-gray-600">Zones</p>
                              <p className="text-lg font-bold text-teal-600">
                                {Array.from(new Set(groupOrganismes.map(org => org.city).filter(Boolean))).length || 1}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section déployable des organismes */}
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                        {isExpanded && (
                          <div className="border-t border-gray-200 pt-6 mt-4">
                            {/* En-tête des organismes avec actions */}
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-lg ${colors.bg}`}>
                                  <Building2 className={`h-5 w-5 ${colors.text}`} />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-lg text-gray-900">
                                    Organismes détaillés
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Exploration complète du groupe
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <BarChart2 className="h-4 w-4 mr-2" />
                                  Statistiques
                                </Button>
                                <Button variant="outline" size="sm">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Exporter
                                </Button>
                              </div>
                            </div>

                            {/* Grille des organismes directement */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {groupOrganismes.map((org, index) => {
                                const TypeIcon = getGroupIcon(groupKey);

                                return (
                                  <Card key={org.id} className={`${colors.border} border-l-4 hover:shadow-lg transition-all duration-200 bg-white`}>
                                    <CardContent className="p-6">
                                      {/* En-tête avec icône et titre */}
                                      <div className="flex items-center gap-3 mb-4">
                                        <div className={`p-3 rounded-lg ${colors.bg}`}>
                                          <TypeIcon className={`h-8 w-8 ${colors.text}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h3 className="font-bold text-lg leading-tight text-gray-900 truncate">{org.name}</h3>
                                          <p className="text-sm text-gray-600 uppercase font-medium">
                                            {getOrganizationTypeLabel(org.type)} - Groupe {groupKey}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            Code: {org.code} • {
                                              groupKey === 'A' ? 'Institutions Suprêmes' :
                                              groupKey === 'B' ? 'Ministères' :
                                              groupKey === 'C' ? 'Directions Générales' :
                                              groupKey === 'G' ? 'Administrations Territoriales' :
                                              groupKey === 'E' ? 'Agences Spécialisées' :
                                              groupKey === 'F' ? 'Institutions Judiciaires' :
                                              groupKey === 'L' ? 'Pouvoir Législatif' :
                                              groupKey === 'I' ? 'Institutions Indépendantes' :
                                              'Autre'
                                            }
                                          </p>
                                        </div>
                                      </div>

                                      {/* Badge de statut */}
                                      <div className="flex items-center gap-2 mb-4">
                                        <Badge className={org.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
                                          {org.isActive ? 'ACTIF' : 'INACTIF'}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                          {org.userCount || 0} agents
                                        </Badge>
                                        {isOrganismePrincipal(org.type) && (
                                          <Crown className="h-4 w-4 text-yellow-500" />
                                        )}
                                      </div>

                                      {/* Informations de contact */}
                                      <div className="space-y-2 mb-4 text-sm">
                                        <div className="flex items-center gap-2">
                                          <Users className="h-4 w-4 text-gray-400" />
                                          <span className="text-gray-600">Responsable non spécifié</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Mail className="h-4 w-4 text-gray-400" />
                                          <span className="text-gray-600">{org.code.toLowerCase()}@{org.type.toLowerCase()}.ga</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Phone className="h-4 w-4 text-gray-400" />
                                          <span className="text-gray-600">+241 01 XX XX XX</span>
                                        </div>
                                      </div>

                                      {/* Actions */}
                                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Network className="h-4 w-4" />
                                          </Button>
                                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Settings className="h-4 w-4" />
                                          </Button>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {org.city || 'Libreville'}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions du groupe */}
                      {!isExpanded && (
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <BarChart2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-xs text-gray-500">
                            {groupOrganismes.filter(org => org.isActive).length}/{groupOrganismes.length}
                          </div>
                        </div>
                      )}
                    </CardContent>
                </Card>
              );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center p-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Aucun organisme trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  Aucun organisme ne correspond aux critères de filtrage actuels.
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  setSelectedGroup('all');
                  setSelectedType('all');
                  setShowPrincipalOnly(false);
                }}>
                  <Filter className="h-4 w-4 mr-2" />
                  Réinitialiser les filtres
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Ancienne modale supprimée - Les organismes s'affichent maintenant directement dans les cartes déployées */}
      </div>
    </AuthenticatedLayout>
  );
}
