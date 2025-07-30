'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Network, GitBranch, Building2, Users, Share2, Eye, Edit, Trash2, Plus,
  Search, Filter, RefreshCw, Download, Upload, Settings, BarChart3,
  Loader2, Crown, Star, Shield, Scale, GraduationCap, Briefcase,
  Car, Home, MapPin, Globe, Flag, Award, Target, Zap, Layers,
  ArrowUpDown, ArrowRight, ArrowLeft, MoreHorizontal, CheckCircle,
  XCircle, AlertTriangle, Info, ExternalLink, Copy, Save, X
} from 'lucide-react';

import {
  ORGANISMES_OFFICIELS_GABON,
  OrganismeOfficielGabon,
  getOrganismeOfficiel,
  getOrganismesByType,
  getOrganismesByGroupe,
  getOrganismesBySousGroupe,
  getStatistiquesOfficielles
} from '@/lib/config/organismes-officiels-gabon';

// === INTERFACES ===
interface RelationModification {
  id: string;
  sourceCode: string;
  targetCode: string;
  type: 'HIERARCHIQUE' | 'COLLABORATIVE' | 'INFORMATIONNELLE';
  action: 'ADD' | 'REMOVE' | 'MODIFY';
  timestamp: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface OrganismeNode {
  organisme: OrganismeComplet;
  children: OrganismeNode[];
  level: number;
  expanded: boolean;
}

interface RelationDragData {
  sourceCode: string;
  targetCode: string;
  relationType: string;
}

interface LoadingStates {
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  applying: boolean;
  exporting: boolean;
  importing: boolean;
}

// === COMPOSANT PRINCIPAL ===
export function OrganismeRelationModulator() {
  // États principaux
  const [organismes] = useState(ORGANISMES_GABONAIS_COMPLETS);
  const [selectedOrganisme, setSelectedOrganisme] = useState<OrganismeComplet | null>(null);
  const [modifications, setModifications] = useState<RelationModification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedNiveau, setSelectedNiveau] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'HIERARCHY' | 'NETWORK' | 'TABLE'>('HIERARCHY');
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    loading: false,
    saving: false,
    deleting: false,
    applying: false,
    exporting: false,
    importing: false
  });

  // États des modals
  const [showRelationModal, setShowRelationModal] = useState(false);
  const [showModificationModal, setShowModificationModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // États du formulaire de relation
  const [relationForm, setRelationForm] = useState({
    sourceCode: '',
    targetCode: '',
    type: 'COLLABORATIVE' as 'HIERARCHIQUE' | 'COLLABORATIVE' | 'INFORMATIONNELLE',
    description: '',
    justification: ''
  });

  // Statistiques calculées
  const stats = useMemo(() => getStatistiquesOrganismes(), []);

  // Organismes filtrés
  const filteredOrganismes = useMemo(() => {
    let filtered = Object.values(organismes);

    if (searchTerm) {
      filtered = filtered.filter(org =>
        org.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.mission.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== 'ALL') {
      filtered = filtered.filter(org => org.type === selectedType);
    }

    if (selectedNiveau) {
      filtered = filtered.filter(org => org.niveau === selectedNiveau);
    }

    return filtered.sort((a, b) => a.niveau - b.niveau || a.nom.localeCompare(b.nom));
  }, [organismes, searchTerm, selectedType, selectedNiveau]);

  // Générer l'arbre hiérarchique
  const hierarchyTree = useMemo(() => {
    const buildTree = (parentId: string | undefined, level: number = 0): OrganismeNode[] => {
      return filteredOrganismes
        .filter(org => org.parentId === parentId)
        .map(org => ({
          organisme: org,
          level,
          expanded: level < 2, // Expand jusqu'au niveau 2 par défaut
          children: buildTree(org.id, level + 1)
        }))
        .sort((a, b) => a.organisme.niveau - b.organisme.niveau);
    };

    return buildTree(undefined);
  }, [filteredOrganismes]);

  // Handlers pour les actions
  const handleCreateRelation = useCallback(async () => {
    if (!relationForm.sourceCode || !relationForm.targetCode) {
      toast.error('Veuillez sélectionner les organismes source et cible');
      return;
    }

    if (relationForm.sourceCode === relationForm.targetCode) {
      toast.error('Un organisme ne peut pas avoir une relation avec lui-même');
      return;
    }

    setLoadingStates(prev => ({ ...prev, saving: true }));

    try {
      const newModification: RelationModification = {
        id: `mod_${Date.now()}`,
        sourceCode: relationForm.sourceCode,
        targetCode: relationForm.targetCode,
        type: relationForm.type,
        action: 'ADD',
        timestamp: new Date().toISOString(),
        description: relationForm.description,
        status: 'PENDING'
      };

      setModifications(prev => [...prev, newModification]);
      setShowRelationModal(false);
      setRelationForm({
        sourceCode: '',
        targetCode: '',
        type: 'COLLABORATIVE',
        description: '',
        justification: ''
      });

      toast.success('✅ Relation ajoutée aux modifications en attente');
    } catch (error: any) {
      toast.error(`❌ Erreur: ${error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [relationForm]);

  const handleRemoveRelation = useCallback((sourceCode: string, targetCode: string, type: string) => {
    const newModification: RelationModification = {
      id: `mod_${Date.now()}`,
      sourceCode,
      targetCode,
      type: type as 'HIERARCHIQUE' | 'COLLABORATIVE' | 'INFORMATIONNELLE',
      action: 'REMOVE',
      timestamp: new Date().toISOString(),
      description: `Suppression de la relation ${type.toLowerCase()}`,
      status: 'PENDING'
    };

    setModifications(prev => [...prev, newModification]);
    toast.success('🗑️ Suppression ajoutée aux modifications');
  }, []);

  const handleApplyModifications = useCallback(async () => {
    if (modifications.length === 0) {
      toast.warning('Aucune modification à appliquer');
      return;
    }

    setLoadingStates(prev => ({ ...prev, applying: true }));

    try {
      // Simuler l'application des modifications
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Marquer toutes les modifications comme approuvées
      setModifications(prev =>
        prev.map(mod => ({ ...mod, status: 'APPROVED' as const }))
      );

      toast.success(`✅ ${modifications.length} modification(s) appliquée(s) avec succès`);
      toast.info('📧 Notifications envoyées aux organismes concernés');
    } catch (error: any) {
      toast.error(`❌ Erreur lors de l'application: ${error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, applying: false }));
    }
  }, [modifications]);

  const handleExportConfig = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, exporting: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const config = {
        organismes: Object.values(organismes),
        modifications,
        timestamp: new Date().toISOString(),
        stats
      };

      const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `organismes-relations-${new Date().toISOString().split('T')[0]}.json`;
      a.click();

      toast.success('📁 Configuration exportée avec succès');
    } catch (error: any) {
      toast.error(`❌ Erreur lors de l'export: ${error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, exporting: false }));
    }
  }, [organismes, modifications, stats]);

  // Composant pour afficher un organisme dans l'arbre
  const OrganismeTreeNode = ({ node, onSelect }: { node: OrganismeNode; onSelect: (org: OrganismeComplet) => void }) => {
    const [expanded, setExpanded] = useState(node.expanded);
    const IconComponent = node.organisme.branding.icon;

    return (
      <div className="ml-4">
        <div
          className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors ${
            selectedOrganisme?.code === node.organisme.code ? 'bg-blue-100 border border-blue-300' : ''
          }`}
          onClick={() => onSelect(node.organisme)}
        >
          {node.children.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? '−' : '+'}
            </Button>
          )}

          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${node.organisme.branding.couleurPrimaire}20` }}
          >
            <IconComponent
              className="h-4 w-4"
              style={{ color: node.organisme.branding.couleurPrimaire }}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{node.organisme.nomCourt}</span>
              <Badge variant="outline" className="text-xs">
                Niveau {node.organisme.niveau}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {node.organisme.type}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 truncate max-w-md">
              {node.organisme.mission}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setRelationForm(prev => ({ ...prev, sourceCode: node.organisme.code }));
                setShowRelationModal(true);
              }}
              title="Créer une relation"
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // Ouvrir modal de détails
              }}
              title="Voir les relations"
            >
              <Network className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {expanded && node.children.length > 0 && (
          <div className="ml-2 border-l border-gray-200">
            {node.children.map(child => (
              <OrganismeTreeNode
                key={child.organisme.id}
                node={child}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Network className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Modulateur de Relations Inter-Organismes</h1>
              <p className="text-sm text-gray-600">
                Gestion visuelle des {Object.keys(organismes).length} organismes gabonais et leurs relations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">
              {modifications.filter(m => m.status === 'PENDING').length} modifications en attente
            </Badge>

            <Button
              variant="outline"
              onClick={() => setShowStatsModal(true)}
              disabled={loadingStates.loading}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Statistiques
            </Button>

            <Button
              variant="outline"
              onClick={handleExportConfig}
              disabled={loadingStates.exporting}
            >
              {loadingStates.exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Exporter
            </Button>

            <Button
              onClick={handleApplyModifications}
              disabled={loadingStates.applying || modifications.filter(m => m.status === 'PENDING').length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {loadingStates.applying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Appliquer Changements
            </Button>
          </div>
        </div>
      </div>

      {/* Barre de filtres */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un organisme..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Type d'organisme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous les types</SelectItem>
              <SelectItem value="PRESIDENCE">Présidence</SelectItem>
              <SelectItem value="PRIMATURE">Primature</SelectItem>
              <SelectItem value="MINISTERE">Ministères</SelectItem>
              <SelectItem value="DIRECTION_GENERALE">Directions Générales</SelectItem>
              <SelectItem value="MAIRIE">Mairies</SelectItem>
              <SelectItem value="PREFECTURE">Préfectures</SelectItem>
              <SelectItem value="PROVINCE">Provinces</SelectItem>
              <SelectItem value="ORGANISME_SOCIAL">Organismes Sociaux</SelectItem>
              <SelectItem value="AGENCE_PUBLIQUE">Agences Publiques</SelectItem>
              <SelectItem value="INSTITUTION_JUDICIAIRE">Institutions Judiciaires</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedNiveau?.toString() || ''} onValueChange={(value) => setSelectedNiveau(value ? parseInt(value) : null)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Niveau 1</SelectItem>
              <SelectItem value="2">Niveau 2</SelectItem>
              <SelectItem value="3">Niveau 3</SelectItem>
              <SelectItem value="4">Niveau 4</SelectItem>
              <SelectItem value="5">Niveau 5</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 border rounded-lg p-1">
            <Button
              variant={viewMode === 'HIERARCHY' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('HIERARCHY')}
            >
              <GitBranch className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'NETWORK' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('NETWORK')}
            >
              <Network className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'TABLE' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('TABLE')}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex">
        {/* Panel principal */}
        <div className="flex-1 p-6">
          {viewMode === 'HIERARCHY' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Hiérarchie Administrative ({filteredOrganismes.length} organismes)
                </CardTitle>
                <CardDescription>
                  Structure hiérarchique des organismes gabonais avec possibilité de modification des relations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {hierarchyTree.map(node => (
                    <OrganismeTreeNode
                      key={node.organisme.id}
                      node={node}
                      onSelect={setSelectedOrganisme}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {viewMode === 'NETWORK' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Vue Réseau des Relations
                </CardTitle>
                <CardDescription>
                  Visualisation graphique des connexions entre organismes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Network className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Vue réseau en développement</p>
                    <p className="text-sm text-gray-500">Utilisera D3.js pour la visualisation interactive</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {viewMode === 'TABLE' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Vue Tableau des Organismes
                </CardTitle>
                <CardDescription>
                  Liste détaillée avec possibilité de tri et filtrage avancé
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Organisme</th>
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Niveau</th>
                        <th className="text-left p-2">Province</th>
                        <th className="text-left p-2">Relations</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrganismes.slice(0, 20).map(org => {
                        const IconComponent = org.branding.icon;
                        return (
                          <tr key={org.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-6 h-6 rounded flex items-center justify-center"
                                  style={{ backgroundColor: `${org.branding.couleurPrimaire}20` }}
                                >
                                  <IconComponent
                                    className="h-3 w-3"
                                    style={{ color: org.branding.couleurPrimaire }}
                                  />
                                </div>
                                <div>
                                  <div className="font-medium text-sm">{org.nomCourt}</div>
                                  <div className="text-xs text-gray-500">{org.nom}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-2">
                              <Badge variant="outline" className="text-xs">
                                {org.type}
                              </Badge>
                            </td>
                            <td className="p-2 text-center">
                              <Badge variant="secondary" className="text-xs">
                                {org.niveau}
                              </Badge>
                            </td>
                            <td className="p-2 text-sm">{org.province}</td>
                            <td className="p-2">
                              <div className="flex gap-1">
                                <Badge variant="outline" className="text-xs">
                                  H: {org.relations.hierarchiques.length}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  C: {org.relations.collaboratives.length}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  I: {org.relations.informationnelles.length}
                                </Badge>
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedOrganisme(org)}
                                  title="Voir détails"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setRelationForm(prev => ({ ...prev, sourceCode: org.code }));
                                    setShowRelationModal(true);
                                  }}
                                  title="Créer relation"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Panel latéral - Détails de l'organisme sélectionné */}
        {selectedOrganisme && (
          <div className="w-96 border-l border-gray-200 bg-white p-6">
            <div className="sticky top-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Détails de l'Organisme</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOrganisme(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${selectedOrganisme.branding.couleurPrimaire}20` }}
                    >
                      <selectedOrganisme.branding.icon
                        className="h-6 w-6"
                        style={{ color: selectedOrganisme.branding.couleurPrimaire }}
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{selectedOrganisme.nomCourt}</CardTitle>
                      <CardDescription className="text-sm">
                        {selectedOrganisme.type} • Niveau {selectedOrganisme.niveau}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Mission</Label>
                    <p className="text-sm text-gray-600 mt-1">{selectedOrganisme.mission}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Attributions</Label>
                    <ul className="text-sm text-gray-600 mt-1 space-y-1">
                      {selectedOrganisme.attributions.slice(0, 3).map((attr, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                          {attr}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Relations</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Hiérarchiques</span>
                        <Badge variant="outline">{selectedOrganisme.relations.hierarchiques.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Collaboratives</span>
                        <Badge variant="outline">{selectedOrganisme.relations.collaboratives.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Informationnelles</span>
                        <Badge variant="outline">{selectedOrganisme.relations.informationnelles.length}</Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => {
                        setRelationForm(prev => ({ ...prev, sourceCode: selectedOrganisme.code }));
                        setShowRelationModal(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Créer une Relation
                    </Button>

                    <Button variant="outline" className="w-full">
                      <Network className="mr-2 h-4 w-4" />
                      Voir le Réseau
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Modifications en attente pour cet organisme */}
              {modifications.filter(m => m.sourceCode === selectedOrganisme.code || m.targetCode === selectedOrganisme.code).length > 0 && (
                <Card className="mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Modifications en Attente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {modifications
                        .filter(m => m.sourceCode === selectedOrganisme.code || m.targetCode === selectedOrganisme.code)
                        .map(mod => (
                          <div key={mod.id} className="p-2 border rounded text-xs">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {mod.action} {mod.type}
                              </Badge>
                              <Badge
                                variant={mod.status === 'PENDING' ? 'default' : mod.status === 'APPROVED' ? 'secondary' : 'destructive'}
                                className="text-xs"
                              >
                                {mod.status}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mt-1">{mod.description}</p>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de création de relation */}
      <Dialog open={showRelationModal} onOpenChange={setShowRelationModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Créer une Nouvelle Relation
            </DialogTitle>
            <DialogDescription>
              Définissez une relation entre deux organismes gabonais
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Organisme Source</Label>
              <Select value={relationForm.sourceCode} onValueChange={(value) => setRelationForm(prev => ({ ...prev, sourceCode: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'organisme source" />
                </SelectTrigger>
                <SelectContent>
                  {filteredOrganismes.map(org => (
                    <SelectItem key={org.code} value={org.code}>
                      <div className="flex items-center gap-2">
                        <org.branding.icon className="h-4 w-4" />
                        {org.nomCourt}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Organisme Cible</Label>
              <Select value={relationForm.targetCode} onValueChange={(value) => setRelationForm(prev => ({ ...prev, targetCode: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'organisme cible" />
                </SelectTrigger>
                <SelectContent>
                  {filteredOrganismes
                    .filter(org => org.code !== relationForm.sourceCode)
                    .map(org => (
                      <SelectItem key={org.code} value={org.code}>
                        <div className="flex items-center gap-2">
                          <org.branding.icon className="h-4 w-4" />
                          {org.nomCourt}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Type de Relation</Label>
              <Select value={relationForm.type} onValueChange={(value) => setRelationForm(prev => ({ ...prev, type: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIERARCHIQUE">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4" />
                      Hiérarchique - Relation de tutelle
                    </div>
                  </SelectItem>
                  <SelectItem value="COLLABORATIVE">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Collaborative - Partenariat
                    </div>
                  </SelectItem>
                  <SelectItem value="INFORMATIONNELLE">
                    <div className="flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      Informationnelle - Partage de données
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Décrivez la nature de cette relation..."
                value={relationForm.description}
                onChange={(e) => setRelationForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label>Justification</Label>
              <Textarea
                placeholder="Justifiez la nécessité de cette relation..."
                value={relationForm.justification}
                onChange={(e) => setRelationForm(prev => ({ ...prev, justification: e.target.value }))}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRelationModal(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateRelation} disabled={loadingStates.saving}>
              {loadingStates.saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Créer la Relation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal des statistiques */}
      <Dialog open={showStatsModal} onOpenChange={setShowStatsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Statistiques des Organismes Gabonais
            </DialogTitle>
            <DialogDescription>
              Vue d'ensemble de la structure administrative
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Organismes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <p className="text-xs text-gray-500">Organismes configurés</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Modifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{modifications.length}</div>
                <p className="text-xs text-gray-500">En attente d'application</p>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Répartition par Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats.parType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between text-sm">
                      <span>{type.replace('_', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(count / stats.total) * 100}%` }}
                          />
                        </div>
                        <span className="font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Répartition par Niveau</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats.parNiveau).map(([niveau, count]) => (
                    <div key={niveau} className="flex items-center justify-between text-sm">
                      <span>Niveau {niveau.replace('niveau', '')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(count / stats.total) * 100}%` }}
                          />
                        </div>
                        <span className="font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatsModal(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
