'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Users,
  Share2,
  Network,
  Activity,
  Eye,
  Settings,
  ArrowUpDown,
  Layers,
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
  Edit,
  Trash2,
  Plus,
  MoreHorizontal,
  Loader2,
  Target,
  Zap,
  BarChart3,
  FileText,
  Info,
  ExternalLink,
  Copy,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Database,
  Archive
} from 'lucide-react';

import { OrganizationHierarchy } from '@/lib/types/organization-relations';

interface HierarchyViewProps {
  organization: OrganizationHierarchy;
  level?: number;
  maxLevel?: number;
  onSelect?: (org: OrganizationHierarchy) => void;
  selectedOrgId?: string;
  showStats?: boolean;
  compact?: boolean;
  onEdit?: (org: OrganizationHierarchy) => void;
  onManageRelations?: (org: OrganizationHierarchy) => void;
  canManage?: boolean;
}

interface HierarchyNodeProps extends HierarchyViewProps {
  isRoot?: boolean;
}

interface OrganizationEditForm {
  name: string;
  code: string;
  type: string;
  description?: string;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

function HierarchyNode({
  organization,
  level = 0,
  maxLevel = 3,
  onSelect,
  selectedOrgId,
  showStats = true,
  compact = false,
  isRoot = false,
  onEdit,
  onManageRelations,
  canManage = false
}: HierarchyNodeProps) {
  const [isExpanded, setIsExpanded] = useState(isRoot || level < 2);
  const [showActions, setShowActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasChildren = organization.childOrgs && organization.childOrgs.length > 0;
  const isSelected = selectedOrgId === organization.id;
  const shouldShowChildren = isExpanded && hasChildren && level < maxLevel;

  const getTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'MINISTERE':
        return <Building2 className="h-4 w-4 text-blue-600" />;
      case 'DIRECTION':
        return <Layers className="h-4 w-4 text-green-600" />;
      case 'MAIRIE':
        return <Building2 className="h-4 w-4 text-purple-600" />;
      case 'ORGANISME_SOCIAL':
        return <Users className="h-4 w-4 text-orange-600" />;
      case 'PROVINCE':
        return <MapPin className="h-4 w-4 text-indigo-600" />;
      case 'INSTITUTION':
        return <Building2 className="h-4 w-4 text-red-600" />;
      default:
        return <Building2 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'MINISTERE':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'DIRECTION':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'MAIRIE':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'ORGANISME_SOCIAL':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'PROVINCE':
        return 'bg-indigo-50 border-indigo-200 text-indigo-800';
      case 'INSTITUTION':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPriorityLevel = (relationCount: number, sharedServicesCount: number) => {
    const totalActivity = relationCount + sharedServicesCount;
    if (totalActivity >= 10) return { level: 'HIGH', color: 'text-red-600', icon: '🔥' };
    if (totalActivity >= 5) return { level: 'MEDIUM', color: 'text-orange-600', icon: '⚡' };
    if (totalActivity >= 1) return { level: 'LOW', color: 'text-green-600', icon: '✅' };
    return { level: 'NONE', color: 'text-gray-600', icon: '💤' };
  };

  const getLevelDepth = (level: number) => {
    if (compact) return level * 16;
    return level * 24;
  };

  const handleActionClick = useCallback(async (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);

    try {
      switch (action) {
        case 'view':
          onSelect?.(organization);
          toast.success(`📋 Organisation ${organization.name} sélectionnée`);
          break;
        case 'edit':
          onEdit?.(organization);
          break;
        case 'manage-relations':
          onManageRelations?.(organization);
          break;
        case 'analytics':
          // Simuler le chargement d'analytics
          await new Promise(resolve => setTimeout(resolve, 1000));
          toast.success(`📊 Analytics de ${organization.name} chargées`);
          break;
        case 'test-connection':
          // Simuler un test de connexion
          await new Promise(resolve => setTimeout(resolve, 2000));
          const success = Math.random() > 0.2;
          if (success) {
            toast.success(`🎯 Connexion à ${organization.name} réussie`);
          } else {
            toast.warning(`⚠️ Problème de connexion avec ${organization.name}`);
          }
          break;
        case 'duplicate':
          // Simuler la duplication
          await new Promise(resolve => setTimeout(resolve, 1500));
          toast.success(`📋 Organisation ${organization.name} dupliquée`);
          break;
        case 'export':
          // Simuler l'export
          await new Promise(resolve => setTimeout(resolve, 1000));
          toast.success(`📥 Données de ${organization.name} exportées`);
          break;
        default:
          toast.info(`Action ${action} sur ${organization.name}`);
      }
    } catch (error) {
      toast.error(`❌ Erreur lors de l'action ${action}`);
    } finally {
      setIsLoading(false);
    }
  }, [organization, onSelect, onEdit, onManageRelations]);

  const priority = getPriorityLevel(organization.relationCount || 0, organization.sharedServicesCount || 0);

  return (
    <div className={cn("relative", level > 0 && `ml-${getLevelDepth(level) / 4}`)}>
      {/* Lignes de connexion pour la hiérarchie */}
      {level > 0 && !compact && (
        <>
          {/* Ligne horizontale */}
          <div className="absolute -left-6 top-6 w-6 h-px bg-gray-300"></div>
          {/* Ligne verticale */}
          <div className="absolute -left-6 top-0 w-px h-6 bg-gray-300"></div>
        </>
      )}

      <Card
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-md group",
          isSelected && "ring-2 ring-blue-500 shadow-lg bg-blue-50",
          level === 0 && "border-2 border-blue-200",
          !compact && "mb-2"
        )}
        onClick={() => onSelect?.(organization)}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <CardContent className={cn("p-4", compact && "p-3")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {/* Bouton d'expansion */}
              {hasChildren && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title={isExpanded ? 'Réduire' : 'Développer'}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              )}

              {/* Icône de type */}
              {getTypeIcon(organization.type)}

              {/* Informations principales */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={cn(
                    "font-semibold truncate max-w-xs",
                    compact ? "text-sm" : "text-base"
                  )}>
                    {organization.name}
                  </h3>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {organization.code}
                  </Badge>
                  <Badge className={cn("text-xs shrink-0", getTypeColor(organization.type))}>
                    {organization.type}
                  </Badge>

                  {/* Indicateur de priorité */}
                  <div className={cn("text-xs flex items-center gap-1", priority.color)} title={`Activité: ${priority.level}`}>
                    <span>{priority.icon}</span>
                  </div>
                </div>

                {/* Statistiques */}
                {showStats && !compact && (
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Network className="h-3 w-3" />
                      <span>{organization.relationCount || 0} relations</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="h-3 w-3" />
                      <span>{organization.sharedServicesCount || 0} services</span>
                    </div>
                    {hasChildren && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{organization.childOrgs.length} enfants</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Layers className="h-3 w-3" />
                      <span>Niveau {organization.level || level}</span>
                    </div>
                  </div>
                )}

                {/* Description courte */}
                {(organization as any).description && !compact && (
                  <p className="text-xs text-gray-600 mt-1 truncate max-w-md">
                    {(organization as any).description}
                  </p>
                )}
              </div>
            </div>

            {/* Actions contextuelles */}
            <div className={cn(
              "flex items-center gap-1 transition-opacity",
              showActions || isSelected ? "opacity-100" : "opacity-0"
            )}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}

              {!isLoading && (
                <>
                  {/* Action principale - Voir */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleActionClick('view', e)}
                    title="Voir les détails"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>

                  {/* Gérer les relations */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleActionClick('manage-relations', e)}
                    title="Gérer les relations"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <Network className="h-3 w-3" />
                  </Button>

                  {/* Analytics */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleActionClick('analytics', e)}
                    title="Voir les analytics"
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    <BarChart3 className="h-3 w-3" />
                  </Button>

                  {/* Test de connexion */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleActionClick('test-connection', e)}
                    title="Tester la connexion"
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                  >
                    <Zap className="h-3 w-3" />
                  </Button>

                  {/* Actions d'édition (si autorisé) */}
                  {canManage && (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleActionClick('edit', e)}
                        title="Modifier"
                        className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>

                      {/* Menu d'actions supplémentaires */}
                      <div className="relative">
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Plus d'actions"
                          className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Progress bar pour l'activité */}
          {showStats && !compact && (organization.relationCount > 0 || organization.sharedServicesCount > 0) && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Activité</span>
                <span>{((organization.relationCount + organization.sharedServicesCount) / 20 * 100).toFixed(0)}%</span>
              </div>
              <Progress
                value={Math.min((organization.relationCount + organization.sharedServicesCount) / 20 * 100, 100)}
                className="h-1.5"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Organisations enfants */}
      {shouldShowChildren && (
        <div className={cn("space-y-2 relative", !compact && "ml-6")}>
          {/* Ligne verticale pour les enfants */}
          {!compact && level < maxLevel - 1 && (
            <div className="absolute -left-6 top-0 bottom-4 w-px bg-gray-300"></div>
          )}

          {organization.childOrgs.map((childOrg, index) => (
            <HierarchyNode
              key={childOrg.id}
              organization={childOrg}
              level={level + 1}
              maxLevel={maxLevel}
              onSelect={onSelect}
              selectedOrgId={selectedOrgId}
              showStats={showStats}
              compact={compact}
              onEdit={onEdit}
              onManageRelations={onManageRelations}
              canManage={canManage}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function HierarchyView({
  organization,
  onSelect,
  selectedOrgId,
  showStats = true,
  compact = false,
  maxLevel = 3,
  onEdit,
  onManageRelations,
  canManage = false
}: HierarchyViewProps) {
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterActivity, setFilterActivity] = useState<string>('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState<OrganizationHierarchy | null>(null);
  const [editForm, setEditForm] = useState<OrganizationEditForm>({
    name: '',
    code: '',
    type: '',
    description: '',
    contact: {}
  });

  const [loadingStates, setLoadingStates] = useState({
    refreshing: false,
    exporting: false,
    editing: false,
    analyzing: false
  });

  // Statistiques calculées
  const hierarchyStats = useMemo(() => {
    const countOrgs = (org: OrganizationHierarchy): { total: number; byType: Record<string, number>; totalRelations: number; totalServices: number } => {
      const stats = {
        total: 1,
        byType: { [org.type]: 1 },
        totalRelations: org.relationCount || 0,
        totalServices: org.sharedServicesCount || 0
      };

      if (org.childOrgs) {
        org.childOrgs.forEach(child => {
          const childStats = countOrgs(child);
          stats.total += childStats.total;
          stats.totalRelations += childStats.totalRelations;
          stats.totalServices += childStats.totalServices;

          Object.entries(childStats.byType).forEach(([type, count]) => {
            stats.byType[type] = (stats.byType[type] || 0) + count;
          });
        });
      }

      return stats;
    };

    return countOrgs(organization);
  }, [organization]);

  // Fonctions de filtrage
  const filterOrganizations = useCallback((org: OrganizationHierarchy): OrganizationHierarchy | null => {
    // Filtrer par recherche
    if (searchQuery && !org.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !org.code.toLowerCase().includes(searchQuery.toLowerCase())) {
      return null;
    }

    // Filtrer par type
    if (filterType !== 'all' && org.type !== filterType) {
      return null;
    }

    // Filtrer par activité
    if (filterActivity !== 'all') {
      const totalActivity = (org.relationCount || 0) + (org.sharedServicesCount || 0);
      switch (filterActivity) {
        case 'high':
          if (totalActivity < 10) return null;
          break;
        case 'medium':
          if (totalActivity < 5 || totalActivity >= 10) return null;
          break;
        case 'low':
          if (totalActivity >= 5) return null;
          break;
        case 'none':
          if (totalActivity > 0) return null;
          break;
      }
    }

    // Filtrer récursivement les enfants
    const filteredChildren = org.childOrgs?.map(child => filterOrganizations(child)).filter(Boolean) || [];

    return {
      ...org,
      childOrgs: filteredChildren
    };
  }, [searchQuery, filterType, filterActivity]);

  const filteredOrganization = useMemo(() => {
    return filterOrganizations(organization);
  }, [organization, filterOrganizations]);

  // Gestionnaires d'événements
  const handleToggleView = useCallback(() => {
    setViewMode(prev => prev === 'tree' ? 'list' : 'tree');
    toast.info(`🔄 Basculé en vue ${viewMode === 'tree' ? 'liste' : 'arbre'}`);
  }, [viewMode]);

  const handleRefresh = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, refreshing: true }));
    try {
      // Simuler le rafraîchissement
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('🔄 Hiérarchie actualisée');
    } catch (error) {
      toast.error('❌ Erreur lors de l\'actualisation');
    } finally {
      setLoadingStates(prev => ({ ...prev, refreshing: false }));
    }
  }, []);

  const handleExport = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, exporting: true }));
    try {
      // Simuler l'export
      await new Promise(resolve => setTimeout(resolve, 2000));
      const fileName = `hierarchie-${organization.code}-${new Date().toISOString().split('T')[0]}.json`;
      toast.success(`📥 Hiérarchie exportée: ${fileName}`);
      setShowExportModal(false);
    } catch (error) {
      toast.error('❌ Erreur lors de l\'export');
    } finally {
      setLoadingStates(prev => ({ ...prev, exporting: false }));
    }
  }, [organization.code]);

     const handleEdit = useCallback((org: OrganizationHierarchy) => {
    setEditingOrg(org);
    setEditForm({
      name: org.name,
      code: org.code,
      type: org.type,
      description: (org as any).description || '',
      contact: (org as any).contact || {}
    });
    setShowEditModal(true);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editingOrg) return;

    setLoadingStates(prev => ({ ...prev, editing: true }));
    try {
      // Simuler la sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`✅ Organisation ${editForm.name} mise à jour`);
      setShowEditModal(false);
      setEditingOrg(null);
    } catch (error) {
      toast.error('❌ Erreur lors de la sauvegarde');
    } finally {
      setLoadingStates(prev => ({ ...prev, editing: false }));
    }
  }, [editingOrg, editForm]);

  const handleAnalyzeHierarchy = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, analyzing: true }));
    try {
      // Simuler l'analyse
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('📊 Analyse de la hiérarchie terminée');
    } catch (error) {
      toast.error('❌ Erreur lors de l\'analyse');
    } finally {
      setLoadingStates(prev => ({ ...prev, analyzing: false }));
    }
  }, []);

  const renderListView = useCallback(() => {
    const flattenOrgs = (org: OrganizationHierarchy, level: number = 0): Array<OrganizationHierarchy & { level: number }> => {
      const result = [{ ...org, level }];
      if (org.childOrgs) {
        org.childOrgs.forEach(child => {
          result.push(...flattenOrgs(child, level + 1));
        });
      }
      return result;
    };

    const flatOrgs = filteredOrganization ? flattenOrgs(filteredOrganization) : [];

    return (
      <div className="space-y-2">
        {flatOrgs.map((org) => (
          <Card
            key={org.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md group",
              selectedOrgId === org.id && "ring-2 ring-blue-500 shadow-lg bg-blue-50",
              `ml-${org.level * 4}`
            )}
            onClick={() => onSelect?.(org)}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {/* Indentation visuelle */}
                  {Array.from({ length: org.level }).map((_, i) => (
                    <div key={i} className="w-4 h-px bg-gray-300"></div>
                  ))}

                  {getTypeIcon(org.type)}

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{org.name}</span>
                      <Badge variant="outline" className="text-xs">{org.code}</Badge>
                      <Badge className={cn("text-xs", getTypeColor(org.type))}>{org.type}</Badge>
                    </div>
                    {showStats && (
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{org.relationCount || 0} relations</span>
                        <span>{org.sharedServicesCount || 0} services</span>
                        <span>Niveau {org.level}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect?.(org);
                    }}
                    title="Sélectionner"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onManageRelations?.(org);
                    }}
                    title="Gérer les relations"
                  >
                    <Network className="h-3 w-3" />
                  </Button>

                  {canManage && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(org);
                      }}
                      title="Modifier"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }, [filteredOrganization, onSelect, selectedOrgId, showStats, onManageRelations, canManage, handleEdit]);

  const getTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'MINISTERE':
        return <Building2 className="h-4 w-4 text-blue-600" />;
      case 'DIRECTION':
        return <Layers className="h-4 w-4 text-green-600" />;
      case 'MAIRIE':
        return <Building2 className="h-4 w-4 text-purple-600" />;
      case 'ORGANISME_SOCIAL':
        return <Users className="h-4 w-4 text-orange-600" />;
      case 'PROVINCE':
        return <MapPin className="h-4 w-4 text-indigo-600" />;
      case 'INSTITUTION':
        return <Building2 className="h-4 w-4 text-red-600" />;
      default:
        return <Building2 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'MINISTERE':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'DIRECTION':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'MAIRIE':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'ORGANISME_SOCIAL':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'PROVINCE':
        return 'bg-indigo-50 border-indigo-200 text-indigo-800';
      case 'INSTITUTION':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête amélioré avec contrôles */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-xl font-semibold">Hiérarchie Organisationnelle</h3>
              <p className="text-sm text-gray-600">
                {hierarchyStats.total} organisation(s) • {hierarchyStats.totalRelations} relations • {hierarchyStats.totalServices} services
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAnalyzeHierarchy}
              disabled={loadingStates.analyzing}
              className="hidden md:flex"
            >
              {loadingStates.analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
              Analyser
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportModal(true)}
              className="hidden md:flex"
            >
              <Download className="h-4 w-4" />
              Exporter
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loadingStates.refreshing}
            >
              {loadingStates.refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Actualiser
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleView}
              className="flex items-center gap-2"
            >
              {viewMode === 'tree' ? <Layers className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
              {viewMode === 'tree' ? 'Vue liste' : 'Vue arbre'}
            </Button>
          </div>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Recherche</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Nom ou code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Type d'organisation</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {Object.keys(hierarchyStats.byType).map(type => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(type)}
                          <span>{type} ({hierarchyStats.byType[type]})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Niveau d'activité</Label>
                <Select value={filterActivity} onValueChange={setFilterActivity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous niveaux</SelectItem>
                    <SelectItem value="high">🔥 Haute (10+)</SelectItem>
                    <SelectItem value="medium">⚡ Moyenne (5-9)</SelectItem>
                    <SelectItem value="low">✅ Faible (1-4)</SelectItem>
                    <SelectItem value="none">💤 Aucune (0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Profondeur max</Label>
                <Select value={maxLevel.toString()} onValueChange={(value) => {
                  // Dans une vraie app, ceci mettrait à jour maxLevel
                  toast.info(`Profondeur limitée à ${value} niveaux`);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 niveaux</SelectItem>
                    <SelectItem value="3">3 niveaux</SelectItem>
                    <SelectItem value="4">4 niveaux</SelectItem>
                    <SelectItem value="5">5 niveaux</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Boutons de contrôle des filtres */}
            {(searchQuery || filterType !== 'all' || filterActivity !== 'all') && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                    setFilterActivity('all');
                  }}
                >
                  Effacer tous les filtres
                </Button>
                <span className="text-xs text-gray-500">Filtres actifs</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Statistiques détaillées */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{hierarchyStats.total}</div>
              <div className="text-sm text-gray-600">Organisations</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{hierarchyStats.totalRelations}</div>
              <div className="text-sm text-gray-600">Relations totales</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">{hierarchyStats.totalServices}</div>
              <div className="text-sm text-gray-600">Services partagés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">{Object.keys(hierarchyStats.byType).length}</div>
              <div className="text-sm text-gray-600">Types différents</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Vue hiérarchique ou liste */}
      <Card>
        <CardContent className="pt-6">
          {!filteredOrganization ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun résultat</h3>
              <p className="text-gray-600">Aucune organisation ne correspond à vos critères de recherche.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                  setFilterActivity('all');
                }}
              >
                Effacer les filtres
              </Button>
            </div>
          ) : viewMode === 'tree' ? (
            <HierarchyNode
              organization={filteredOrganization}
              level={0}
              maxLevel={maxLevel}
              onSelect={onSelect}
              selectedOrgId={selectedOrgId}
              showStats={showStats}
              compact={compact}
              isRoot={true}
              onEdit={handleEdit}
              onManageRelations={onManageRelations}
              canManage={canManage}
            />
          ) : (
            renderListView()
          )}
        </CardContent>
      </Card>

      {/* Légende améliorée */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="h-4 w-4" />
            Légende et Indicateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Types d'organisations */}
            <div>
              <h4 className="font-medium mb-3">Types d'organisations</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span>Ministère</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-green-600" />
                  <span>Direction</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-purple-600" />
                  <span>Mairie</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-600" />
                  <span>Organisme Social</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                  <span>Province</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-red-600" />
                  <span>Institution</span>
                </div>
              </div>
            </div>

            {/* Indicateurs d'activité */}
            <div>
              <h4 className="font-medium mb-3">Niveaux d'activité</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span>🔥</span>
                  <span>Haute activité (10+ relations/services)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⚡</span>
                  <span>Activité moyenne (5-9)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span>Faible activité (1-4)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💤</span>
                  <span>Aucune activité (0)</span>
                </div>
              </div>
            </div>

            {/* Actions disponibles */}
            <div>
              <h4 className="font-medium mb-3">Actions disponibles</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span>Voir les détails</span>
                </div>
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-green-600" />
                  <span>Gérer les relations</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  <span>Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-orange-600" />
                  <span>Test de connexion</span>
                </div>
                {canManage && (
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4 text-gray-600" />
                    <span>Modifier</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal d'édition d'organisation */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Modifier l'Organisation
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations de {editingOrg?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nom de l'organisation *</Label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom complet"
                />
              </div>

              <div>
                <Label>Code *</Label>
                <Input
                  value={editForm.code}
                  onChange={(e) => setEditForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="CODE_ORG"
                />
              </div>
            </div>

            <div>
              <Label>Type d'organisation *</Label>
              <Select
                value={editForm.type}
                onValueChange={(value) => setEditForm(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MINISTERE">Ministère</SelectItem>
                  <SelectItem value="DIRECTION">Direction</SelectItem>
                  <SelectItem value="MAIRIE">Mairie</SelectItem>
                  <SelectItem value="ORGANISME_SOCIAL">Organisme Social</SelectItem>
                  <SelectItem value="PROVINCE">Province</SelectItem>
                  <SelectItem value="INSTITUTION">Institution</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description de l'organisation..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email de contact</Label>
                <Input
                  type="email"
                  value={editForm.contact?.email || ''}
                  onChange={(e) => setEditForm(prev => ({
                    ...prev,
                    contact: { ...prev.contact, email: e.target.value }
                  }))}
                  placeholder="contact@organisation.ga"
                />
              </div>

              <div>
                <Label>Téléphone</Label>
                <Input
                  value={editForm.contact?.phone || ''}
                  onChange={(e) => setEditForm(prev => ({
                    ...prev,
                    contact: { ...prev.contact, phone: e.target.value }
                  }))}
                  placeholder="+241 XX XX XX XX"
                />
              </div>
            </div>

            <div>
              <Label>Adresse</Label>
              <Input
                value={editForm.contact?.address || ''}
                onChange={(e) => setEditForm(prev => ({
                  ...prev,
                  contact: { ...prev.contact, address: e.target.value }
                }))}
                placeholder="Adresse complète"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={loadingStates.editing || !editForm.name || !editForm.code || !editForm.type}
            >
              {loadingStates.editing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal d'export */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Exporter la Hiérarchie
            </DialogTitle>
            <DialogDescription>
              Exportez la structure hiérarchique et les données associées
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Format</Label>
                <Select defaultValue="json">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON (Structure)</SelectItem>
                    <SelectItem value="excel">Excel (Tableau)</SelectItem>
                    <SelectItem value="pdf">PDF (Diagramme)</SelectItem>
                    <SelectItem value="svg">SVG (Graphique)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Niveau de détail</Label>
                <Select defaultValue="full">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Informations de base</SelectItem>
                    <SelectItem value="full">Détails complets</SelectItem>
                    <SelectItem value="stats">Avec statistiques</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Options d'export</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="include-relations" defaultChecked />
                  <Label htmlFor="include-relations" className="text-sm">Inclure les relations</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="include-contacts" defaultChecked />
                  <Label htmlFor="include-contacts" className="text-sm">Inclure les contacts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="include-stats" defaultChecked />
                  <Label htmlFor="include-stats" className="text-sm">Inclure les statistiques</Label>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>{hierarchyStats.total}</strong> organisations seront exportées
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportModal(false)}>
              Annuler
            </Button>
            <Button onClick={handleExport} disabled={loadingStates.exporting}>
              {loadingStates.exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Exporter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
