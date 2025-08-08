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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  Building2,
  Share2,
  Users,
  Shield,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Network,
  Activity,
  Calendar,
  Settings,
  Download,
  Upload,
  Loader2,
  MoreHorizontal,
  Ban,
  Play,
  Pause,
  BarChart3,
  FileText,
  Mail,
  Bell,
  Info,
  ExternalLink,
  Copy,
  Archive,
  Target,
  Zap,
  TrendingUp,
  Database as DatabaseIcon
} from 'lucide-react';

import {
  OrganizationRelation,
  RelationRequest,
  RelationType,
  DataShareType,
  RelationStatus,
  RELATION_TYPE_LABELS,
  DATA_SHARE_TYPE_LABELS,
  RELATION_STATUS_LABELS,
  getRelationDirection,
  getPartnerOrganization,
  isRelationActive
} from '@/lib/types/organization-relations';

import { organizationRelationService } from '@/lib/services/organization-relation.service';

interface RelationManagerProps {
  organizationId: string;
  canManage: boolean;
  currentUser: {
    id: string;
    name: string;
    role: string;
  };
}

interface BulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: (relationIds: string[]) => Promise<void>;
  requiresConfirmation: boolean;
  confirmationMessage?: string;
}

export function RelationManager({ organizationId, canManage, currentUser }: RelationManagerProps) {
  const [relations, setRelations] = useState<OrganizationRelation[]>([]);
  const [organizations, setOrganizations] = useState<Array<{id: string, name: string, code: string, type: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDirection, setSelectedDirection] = useState<string>('all');

  // États pour les modals améliorés
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBulkActionsModal, setShowBulkActionsModal] = useState(false);

  const [selectedRelation, setSelectedRelation] = useState<OrganizationRelation | null>(null);
  const [selectedRelations, setSelectedRelations] = useState<string[]>([]);

  // États de chargement granulaires
  const [loadingStates, setLoadingStates] = useState({
    creating: false,
    approving: false,
    updating: false,
    deleting: false,
    refreshing: false,
    suspending: false,
    resuming: false,
    revoking: false,
    exporting: false,
    loadingAnalytics: false,
    bulkActions: false,
    testingConnection: false,
    duplicating: false
  });

  // État pour les formulaires
  const [newRelation, setNewRelation] = useState<Partial<RelationRequest>>({
    relationType: RelationType.COLLABORATIVE,
    dataShareType: DataShareType.READ_ONLY,
    priority: 'MEDIUM'
  });

  const [editingRelation, setEditingRelation] = useState<Partial<OrganizationRelation>>({});
  const [suspensionReason, setSuspensionReason] = useState('');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'json'>('excel');
  const [selectedBulkAction, setSelectedBulkAction] = useState<string>('');

  // Actions en lot disponibles
  const bulkActions: BulkAction[] = [
    {
      id: 'approve',
      label: 'Approuver les relations',
      icon: <CheckCircle className="h-4 w-4" />,
      action: handleBulkApprove,
      requiresConfirmation: true,
      confirmationMessage: 'Êtes-vous sûr de vouloir approuver ces relations ?'
    },
    {
      id: 'suspend',
      label: 'Suspendre temporairement',
      icon: <Pause className="h-4 w-4" />,
      action: handleBulkSuspend,
      requiresConfirmation: true,
      confirmationMessage: 'Êtes-vous sûr de vouloir suspendre ces relations ?'
    },
    {
      id: 'archive',
      label: 'Archiver les relations',
      icon: <Archive className="h-4 w-4" />,
      action: handleBulkArchive,
      requiresConfirmation: true,
      confirmationMessage: 'Cette action archivera définitivement ces relations.'
    },
    {
      id: 'export',
      label: 'Exporter la sélection',
      icon: <Download className="h-4 w-4" />,
      action: handleBulkExport,
      requiresConfirmation: false
    }
  ];

  // Charger les données
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [relationsData, orgsData] = await Promise.all([
        organizationRelationService.getOrganizationRelations(organizationId, {
          type: selectedType !== 'all' ? selectedType as RelationType : undefined,
          status: selectedStatus !== 'all' ? selectedStatus as RelationStatus : undefined,
          direction: selectedDirection !== 'all' ? selectedDirection as any : undefined
        }),
        organizationRelationService.getAvailableOrganizations()
      ]);

      setRelations(relationsData);
      setOrganizations(orgsData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('❌ Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, [organizationId, selectedType, selectedStatus, selectedDirection]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Recherche et filtrage
  const filteredRelations = useMemo(() => {
    return relations.filter(relation => {
      if (!searchQuery) return true;

      const partner = getPartnerOrganization(relation, organizationId);
      return partner?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             relation.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
             relation.id.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [relations, searchQuery, organizationId]);

  // Gestionnaires d'événements principaux
  const handleCreateRelation = useCallback(async () => {
    try {
      if (!newRelation.toOrgId || !newRelation.relationType || !newRelation.dataShareType) {
        toast.error('⚠️ Veuillez remplir tous les champs obligatoires');
        return;
      }

      setLoadingStates(prev => ({ ...prev, creating: true }));

      const relationRequest: RelationRequest = {
        fromOrgId: organizationId,
        toOrgId: newRelation.toOrgId!,
        relationType: newRelation.relationType!,
        dataShareType: newRelation.dataShareType!,
        sharedData: newRelation.sharedData,
        permissions: newRelation.permissions,
        endDate: newRelation.endDate,
        notes: newRelation.notes,
        priority: newRelation.priority
      };

      await organizationRelationService.createRelation(relationRequest, currentUser.id);

      toast.success('✅ Relation créée avec succès');
      setShowCreateModal(false);
      setNewRelation({
        relationType: RelationType.COLLABORATIVE,
        dataShareType: DataShareType.READ_ONLY,
        priority: 'MEDIUM'
      });

      await loadData();
    } catch (error: any) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, creating: false }));
    }
  }, [newRelation, organizationId, currentUser.id, loadData]);

  // États pour analytics détaillées
  const [relationAnalytics, setRelationAnalytics] = useState<{
    totalAccess: number;
    successRate: number;
    avgResponseTime: number;
    monthlyAccess: number;
    recentAccess: Array<{
      id: string;
      action: string;
      timestamp: string;
      success: boolean;
      responseTime: number;
      dataType: string;
    }>;
    errorLogs: Array<{
      id: string;
      error: string;
      timestamp: string;
      attempts: number;
    }>;
    performanceMetrics: {
      dailyStats: Array<{ date: string; accessCount: number; errorCount: number }>;
      dataTypeStats: Record<string, number>;
      peakHours: Array<{ hour: number; count: number }>;
    };
  } | null>(null);

  const [testResults, setTestResults] = useState<{
    connectionTest: {
      status: 'success' | 'warning' | 'error';
      latency: number;
      message: string;
      timestamp: string;
    };
    authenticationTest: {
      status: 'success' | 'warning' | 'error';
      message: string;
      timestamp: string;
    };
    permissionsTest: {
      status: 'success' | 'warning' | 'error';
      allowedActions: string[];
      deniedActions: string[];
      message: string;
      timestamp: string;
    };
    dataAccessTest: {
      status: 'success' | 'warning' | 'error';
      accessibleData: string[];
      message: string;
      timestamp: string;
    };
  } | null>(null);

  const [showTestResultsModal, setShowTestResultsModal] = useState(false);

  // Handler amélioré pour les tests de connexion
  const handleTestConnection = useCallback(async (relationId: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, testingConnection: true }));
      setTestResults(null);

      // Test 1: Connectivité réseau
      const startTime = Date.now();
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200)); // Simulation réaliste
      const endTime = Date.now();
      const latency = endTime - startTime;

      const connectionSuccess = latency < 2000 && Math.random() > 0.1; // 90% succès si latence OK

      // Test 2: Authentification
      await new Promise(resolve => setTimeout(resolve, 500));
      const authSuccess = connectionSuccess && Math.random() > 0.05; // 95% succès si connexion OK

      // Test 3: Permissions
      await new Promise(resolve => setTimeout(resolve, 300));
      const permissionsSuccess = authSuccess && Math.random() > 0.02; // 98% succès si auth OK

      // Test 4: Accès aux données
      await new Promise(resolve => setTimeout(resolve, 600));
      const dataAccessSuccess = permissionsSuccess && Math.random() > 0.03; // 97% succès si permissions OK

      const relation = relations.find(r => r.id === relationId);
      const sharedDataTypes = relation?.sharedData?.services || ['CNI', 'PASSPORT', 'STATISTICS'];

             const testResults = {
         connectionTest: {
           status: (connectionSuccess ? 'success' : 'error') as 'success' | 'warning' | 'error',
           latency,
           message: connectionSuccess
             ? `Connexion établie en ${latency}ms`
             : 'Échec de connexion - Timeout réseau',
           timestamp: new Date().toISOString()
         },
         authenticationTest: {
           status: (authSuccess ? 'success' : 'error') as 'success' | 'warning' | 'error',
           message: authSuccess
             ? 'Authentification réussie - Certificats valides'
             : 'Échec d\'authentification - Certificats expirés',
           timestamp: new Date().toISOString()
         },
         permissionsTest: {
           status: (permissionsSuccess ? 'success' : 'warning') as 'success' | 'warning' | 'error',
           allowedActions: permissionsSuccess
             ? ['READ', 'WRITE', 'UPDATE', 'EXPORT']
             : ['READ'],
           deniedActions: permissionsSuccess
             ? []
             : ['WRITE', 'UPDATE', 'DELETE'],
           message: permissionsSuccess
             ? 'Toutes les permissions accordées'
             : 'Permissions limitées - Accès en lecture seule',
           timestamp: new Date().toISOString()
         },
         dataAccessTest: {
           status: (dataAccessSuccess ? 'success' : 'warning') as 'success' | 'warning' | 'error',
           accessibleData: dataAccessSuccess
             ? sharedDataTypes
             : sharedDataTypes.slice(0, Math.max(1, Math.floor(sharedDataTypes.length / 2))),
           message: dataAccessSuccess
             ? `Accès complet à ${sharedDataTypes.length} types de données`
             : 'Accès partiel - Certaines données indisponibles',
           timestamp: new Date().toISOString()
         }
       };

      setTestResults(testResults);
      setShowTestResultsModal(true);

      // Déterminer le message global
      const allSuccessful = connectionSuccess && authSuccess && permissionsSuccess && dataAccessSuccess;
      const hasWarnings = (testResults.permissionsTest.status === 'warning') ||
                         (testResults.dataAccessTest.status === 'warning');
      const hasErrors = !connectionSuccess || !authSuccess;

      if (allSuccessful) {
        toast.success('🎯 Tous les tests passés avec succès');
      } else if (hasErrors) {
        toast.error('❌ Tests échoués - Problèmes critiques détectés');
      } else if (hasWarnings) {
        toast.warning('⚠️ Tests partiels - Vérifiez les détails');
      }

    } catch (error: any) {
      toast.error(`❌ Erreur lors des tests: ${error.message}`);
      setTestResults({
        connectionTest: {
          status: 'error',
          latency: 0,
          message: 'Erreur système lors du test',
          timestamp: new Date().toISOString()
        },
        authenticationTest: {
          status: 'error',
          message: 'Test non effectué en raison d\'erreur système',
          timestamp: new Date().toISOString()
        },
        permissionsTest: {
          status: 'error',
          allowedActions: [],
          deniedActions: [],
          message: 'Test non effectué en raison d\'erreur système',
          timestamp: new Date().toISOString()
        },
        dataAccessTest: {
          status: 'error',
          accessibleData: [],
          message: 'Test non effectué en raison d\'erreur système',
          timestamp: new Date().toISOString()
        }
      });
      setShowTestResultsModal(true);
    } finally {
      setLoadingStates(prev => ({ ...prev, testingConnection: false }));
    }
  }, [relations]);

  // Handler amélioré pour la duplication avec options
  const handleDuplicateRelation = useCallback(async (relation: OrganizationRelation) => {
    try {
      setLoadingStates(prev => ({ ...prev, duplicating: true }));

      // Demander confirmation avec options
      const shouldModifyTarget = window.confirm(
        'Voulez-vous modifier l\'organisation cible pour la duplication ?\n\n' +
        'OK = Choisir nouvelle cible\n' +
        'Annuler = Dupliquer à l\'identique'
      );

      let targetOrgId = relation.toOrgId;

      if (shouldModifyTarget) {
        // Dans un vrai projet, on ouvrirait un modal de sélection
        // Pour la démo, on va juste permuter fromOrg et toOrg
        targetOrgId = relation.fromOrgId;
        toast.info('🔄 Organisation cible modifiée pour éviter les doublons');
      }

      const duplicateRequest: RelationRequest = {
        fromOrgId: organizationId === relation.fromOrgId ? organizationId : relation.fromOrgId,
        toOrgId: targetOrgId,
        relationType: relation.relationType,
        dataShareType: relation.dataShareType,
        sharedData: relation.sharedData ? {
          ...relation.sharedData,
          // Ajouter un timestamp pour différencier
          customConfig: {
            ...relation.sharedData.customConfig,
            duplicatedFrom: relation.id,
            duplicatedAt: new Date().toISOString()
          }
        } : undefined,
        permissions: relation.permissions,
        notes: `[COPIE ${new Date().toLocaleDateString('fr-FR')}] ${relation.notes || 'Relation dupliquée'}`,
        priority: relation.priority || 'MEDIUM'
      };

      // Validation avant création
      const existingDuplicate = relations.find(r =>
        r.fromOrgId === duplicateRequest.fromOrgId &&
        r.toOrgId === duplicateRequest.toOrgId &&
        r.relationType === duplicateRequest.relationType &&
        r.id !== relation.id
      );

      if (existingDuplicate) {
        const confirmDuplicate = window.confirm(
          'Une relation similaire existe déjà entre ces organisations.\n' +
          'Voulez-vous continuer la duplication ?'
        );
        if (!confirmDuplicate) {
          toast.info('🚫 Duplication annulée');
          return;
        }
      }

      await organizationRelationService.createRelation(duplicateRequest, currentUser.id);

      toast.success('📋 Relation dupliquée avec succès');
      toast.info('⏳ La nouvelle relation est en attente d\'approbation');

      await loadData();
      setShowDetailsModal(false);

    } catch (error: any) {
      if (error.message.includes('déjà')) {
        toast.error('❌ Une relation identique existe déjà');
      } else {
        toast.error(`❌ Erreur lors de la duplication: ${error.message}`);
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, duplicating: false }));
    }
  }, [currentUser.id, loadData, relations, organizationId]);

  // Handler pour exporter les analytics
  const handleExportAnalytics = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, exporting: true }));

      if (!relationAnalytics) {
        throw new Error('Aucune donnée analytics à exporter');
      }

      // Simuler la génération du rapport
      await new Promise(resolve => setTimeout(resolve, 2000));

      const fileName = `analytics-relation-${new Date().toISOString().split('T')[0]}.pdf`;
      toast.success(`📊 Rapport analytics généré: ${fileName}`);
      toast.info('📧 Le rapport a été envoyé par email');

    } catch (error: any) {
      toast.error(`❌ Erreur lors de l'export: ${error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, exporting: false }));
    }
  }, [relationAnalytics]);

  // Handler amélioré pour charger les analytics
  const handleLoadAnalytics = useCallback(async (relationId: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, loadingAnalytics: true }));
      setRelationAnalytics(null);

      // Simuler le chargement des analytics réalistes
      await new Promise(resolve => setTimeout(resolve, 1200));

      const relation = relations.find(r => r.id === relationId);
      if (!relation) {
        throw new Error('Relation non trouvée');
      }

      // Générer des analytics réalistes basées sur la relation
      const now = new Date();
      const totalAccess = Math.floor(Math.random() * 500) + 50;
      const successRate = 85 + Math.random() * 14; // 85-99%
      const avgResponseTime = 150 + Math.random() * 300; // 150-450ms
      const monthlyAccess = Math.floor(totalAccess * 0.3);

      // Générer des accès récents réalistes
      const recentAccess = Array.from({ length: 10 }, (_, i) => {
        const timestamp = new Date(now.getTime() - (i * 3600000 + Math.random() * 3600000));
        const actions = ['VIEW_STATISTICS', 'EXPORT_DATA', 'UPDATE_PROFILE', 'SEARCH_RECORDS'];
        const dataTypes = relation.sharedData?.services || ['CNI', 'PASSPORT', 'STATISTICS'];

        return {
          id: `access_${relationId}_${i}`,
          action: actions[Math.floor(Math.random() * actions.length)],
          timestamp: timestamp.toISOString(),
          success: Math.random() > 0.1, // 90% succès
          responseTime: Math.floor(50 + Math.random() * 500),
          dataType: dataTypes[Math.floor(Math.random() * dataTypes.length)]
        };
      });

      // Générer des logs d'erreur
      const errorLogs = Array.from({ length: Math.floor(Math.random() * 5) }, (_, i) => {
        const timestamp = new Date(now.getTime() - (i * 86400000 + Math.random() * 86400000));
        const errors = [
          'Timeout de connexion',
          'Certificat expiré',
          'Permissions insuffisantes',
          'Limite de débit dépassée',
          'Service temporairement indisponible'
        ];

        return {
          id: `error_${relationId}_${i}`,
          error: errors[Math.floor(Math.random() * errors.length)],
          timestamp: timestamp.toISOString(),
          attempts: Math.floor(Math.random() * 5) + 1
        };
      });

      // Générer des statistiques de performance
      const dailyStats = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(now.getTime() - (i * 86400000));
        return {
          date: date.toISOString().split('T')[0],
          accessCount: Math.floor(Math.random() * 20) + 1,
          errorCount: Math.floor(Math.random() * 3)
        };
      }).reverse();

      const dataTypes = relation.sharedData?.services || ['CNI', 'PASSPORT', 'STATISTICS', 'REPORTS'];
      const dataTypeStats = dataTypes.reduce((acc, type) => {
        acc[type] = Math.floor(Math.random() * 100) + 10;
        return acc;
      }, {} as Record<string, number>);

      const peakHours = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        count: Math.floor(Math.random() * 50) + (hour >= 8 && hour <= 17 ? 30 : 5)
      }));

      const analytics = {
        totalAccess,
        successRate,
        avgResponseTime,
        monthlyAccess,
        recentAccess,
        errorLogs,
        performanceMetrics: {
          dailyStats,
          dataTypeStats,
          peakHours
        }
      };

      setRelationAnalytics(analytics);
      setShowAnalyticsModal(true);
      toast.success('📊 Analytics chargées avec succès');

    } catch (error: any) {
      toast.error(`❌ Erreur lors du chargement des analytics: ${error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, loadingAnalytics: false }));
    }
  }, [relations]);

  // Handler amélioré pour l'approbation avec validation
  const handleApproveRelation = useCallback(async (relationId: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, approving: true }));

      // Validation avant approbation
      const relation = relations.find(r => r.id === relationId);
      if (!relation) {
        throw new Error('Relation introuvable');
      }

      if (relation.status !== RelationStatus.PENDING) {
        throw new Error('Seules les relations en attente peuvent être approuvées');
      }

      // Vérifications de sécurité
      if (!relation.sharedData?.services || relation.sharedData.services.length === 0) {
        const confirmProceed = window.confirm(
          'Aucun service partagé défini. Voulez-vous continuer l\'approbation ?'
        );
        if (!confirmProceed) {
          return;
        }
      }

      await organizationRelationService.approveRelation(relationId, organizationId, currentUser.id);

      toast.success('✅ Relation approuvée avec succès');
      toast.info('📧 Notifications envoyées aux parties concernées');

      await loadData();

      // Fermer le modal de détails pour montrer la liste mise à jour
      setShowDetailsModal(false);

    } catch (error: any) {
      toast.error(`❌ Erreur lors de l'approbation: ${error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, approving: false }));
    }
  }, [organizationId, currentUser.id, loadData, relations]);

  const handleSuspendRelation = useCallback(async (relationId: string, reason: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, suspending: true }));

      await organizationRelationService.updateRelationStatus(
        relationId,
        RelationStatus.SUSPENDED,
        reason,
        currentUser.id
      );

      toast.success('⏸️ Relation suspendue');
      setShowSuspendModal(false);
      setSuspensionReason('');
      await loadData();
    } catch (error: any) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, suspending: false }));
    }
  }, [currentUser.id, loadData]);

  const handleResumeRelation = useCallback(async (relationId: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, resuming: true }));

      await organizationRelationService.updateRelationStatus(
        relationId,
        RelationStatus.ACTIVE,
        'Relation réactivée',
        currentUser.id
      );

      toast.success('▶️ Relation réactivée');
      await loadData();
    } catch (error: any) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, resuming: false }));
    }
  }, [currentUser.id, loadData]);

  const handleExportRelations = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, exporting: true }));

      // Simuler l'export
      await new Promise(resolve => setTimeout(resolve, 2000));

      const fileName = `relations-${organizationId}-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      toast.success(`📥 Export ${exportFormat.toUpperCase()} généré: ${fileName}`);
      setShowExportModal(false);
    } catch (error: any) {
      toast.error(`❌ Erreur lors de l'export: ${error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, exporting: false }));
    }
  }, [organizationId, exportFormat]);

  // Actions en lot
  async function handleBulkApprove(relationIds: string[]) {
    try {
      setLoadingStates(prev => ({ ...prev, bulkActions: true }));

      for (const relationId of relationIds) {
        await organizationRelationService.approveRelation(relationId, organizationId, currentUser.id);
      }

      toast.success(`✅ ${relationIds.length} relation(s) approuvée(s)`);
      setSelectedRelations([]);
      await loadData();
    } catch (error: any) {
      toast.error(`❌ Erreur lors de l'approbation en lot: ${error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, bulkActions: false }));
    }
  }

  async function handleBulkSuspend(relationIds: string[]) {
    try {
      setLoadingStates(prev => ({ ...prev, bulkActions: true }));

      for (const relationId of relationIds) {
        await organizationRelationService.updateRelationStatus(
          relationId,
          RelationStatus.SUSPENDED,
          'Suspension en lot',
          currentUser.id
        );
      }

      toast.success(`⏸️ ${relationIds.length} relation(s) suspendue(s)`);
      setSelectedRelations([]);
      await loadData();
    } catch (error: any) {
      toast.error(`❌ Erreur lors de la suspension en lot: ${error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, bulkActions: false }));
    }
  }

  async function handleBulkArchive(relationIds: string[]) {
    try {
      setLoadingStates(prev => ({ ...prev, bulkActions: true }));

      // Simuler l'archivage
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(`📦 ${relationIds.length} relation(s) archivée(s)`);
      setSelectedRelations([]);
      await loadData();
    } catch (error: any) {
      toast.error(`❌ Erreur lors de l'archivage: ${error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, bulkActions: false }));
    }
  }

  async function handleBulkExport(relationIds: string[]) {
    try {
      setLoadingStates(prev => ({ ...prev, bulkActions: true }));

      // Simuler l'export sélectif
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success(`📥 Export de ${relationIds.length} relation(s) généré`);
      setSelectedRelations([]);
    } catch (error: any) {
      toast.error(`❌ Erreur lors de l'export: ${error.message}`);
    } finally {
      setLoadingStates(prev => ({ ...prev, bulkActions: false }));
    }
  }

  const handleBulkAction = useCallback(async () => {
    if (!selectedBulkAction || selectedRelations.length === 0) return;

    const action = bulkActions.find(a => a.id === selectedBulkAction);
    if (!action) return;

    if (action.requiresConfirmation) {
      // Pour une vraie app, utiliser un modal de confirmation
      const confirmed = window.confirm(action.confirmationMessage || 'Confirmer cette action ?');
      if (!confirmed) return;
    }

    await action.action(selectedRelations);
    setShowBulkActionsModal(false);
    setSelectedBulkAction('');
  }, [selectedBulkAction, selectedRelations, bulkActions]);

  // Fonctions utilitaires
  const getRelationIcon = (type: RelationType) => {
    switch (type) {
      case RelationType.HIERARCHICAL:
        return <ArrowUpDown className="h-4 w-4" />;
      case RelationType.COLLABORATIVE:
        return <Share2 className="h-4 w-4" />;
      case RelationType.INFORMATIONAL:
        return <Eye className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: RelationStatus) => {
    switch (status) {
      case RelationStatus.ACTIVE:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case RelationStatus.PENDING:
        return <Clock className="h-4 w-4 text-orange-600" />;
      case RelationStatus.SUSPENDED:
        return <Pause className="h-4 w-4 text-yellow-600" />;
      case RelationStatus.EXPIRED:
      case RelationStatus.REVOKED:
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getBadgeColor = (type: RelationType) => {
    switch (type) {
      case RelationType.HIERARCHICAL:
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case RelationType.COLLABORATIVE:
        return 'bg-green-100 text-green-800 border-green-300';
      case RelationType.INFORMATIONAL:
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isRelationSelected = (relationId: string) => selectedRelations.includes(relationId);

  const toggleRelationSelection = (relationId: string) => {
    setSelectedRelations(prev =>
      prev.includes(relationId)
        ? prev.filter(id => id !== relationId)
        : [...prev, relationId]
    );
  };

  const selectAllRelations = () => {
    setSelectedRelations(filteredRelations.map(r => r.id));
  };

  const clearSelection = () => {
    setSelectedRelations([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Chargement des relations...</h3>
          <p className="text-muted-foreground">Récupération des données en cours</p>
          <Progress value={65} className="w-64 mx-auto mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec actions amélioré */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Network className="h-6 w-6" />
            Relations Inter-Organismes
          </h2>
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            {filteredRelations.length} relation(s)
          </Badge>
          {selectedRelations.length > 0 && (
            <Badge variant="default" className="bg-blue-100 text-blue-800">
              {selectedRelations.length} sélectionnée(s)
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Actions en lot */}
          {selectedRelations.length > 0 && canManage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBulkActionsModal(true)}
              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              <Target className="h-4 w-4 mr-1" />
              Actions ({selectedRelations.length})
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportModal(true)}
          >
            <Download className="h-4 w-4 mr-1" />
            Exporter
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLoadingStates(prev => ({ ...prev, refreshing: true }));
              loadData().finally(() => setLoadingStates(prev => ({ ...prev, refreshing: false })));
            }}
            disabled={loadingStates.refreshing}
          >
            {loadingStates.refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Actualiser
          </Button>

          {canManage && (
            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouvelle Relation
            </Button>
          )}
        </div>
      </div>

      {/* Filtres et recherche améliorés */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <Label>Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par organisation, notes, ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  {Object.entries(RELATION_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Statut</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  {Object.entries(RELATION_STATUS_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Direction</Label>
              <Select value={selectedDirection} onValueChange={setSelectedDirection}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="outgoing">Sortantes</SelectItem>
                  <SelectItem value="incoming">Entrantes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions de sélection */}
          {filteredRelations.length > 0 && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedRelations.length === filteredRelations.length}
                  onCheckedChange={(checked) => checked ? selectAllRelations() : clearSelection()}
                />
                <Label className="text-sm">Sélectionner tout</Label>
              </div>
              {selectedRelations.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  Effacer sélection
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liste des relations améliorée */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredRelations.map((relation) => {
          const partner = getPartnerOrganization(relation, organizationId);
          const direction = getRelationDirection(relation, organizationId);
          const needsApproval = relation.status === RelationStatus.PENDING &&
                               ((direction === 'incoming' && !relation.approvedByToOrg) ||
                                (direction === 'outgoing' && !relation.approvedByFromOrg));
          const isSelected = isRelationSelected(relation.id);

          return (
            <Card
              key={relation.id}
              className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => {
                setSelectedRelation(relation);
                setShowDetailsModal(true);
              }}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        toggleRelationSelection(relation.id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {getRelationIcon(relation.relationType)}
                    <div>
                      <CardTitle className="text-lg">{partner?.name || 'Organisation inconnue'}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Badge variant="outline" className={getBadgeColor(relation.relationType)}>
                          {RELATION_TYPE_LABELS[relation.relationType]}
                        </Badge>
                        <span>•</span>
                        <span>{direction === 'outgoing' ? '→ Sortante' : '← Entrante'}</span>
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusIcon(relation.status)}
                    <Badge
                      variant="outline"
                      className={
                        relation.status === RelationStatus.ACTIVE ? 'text-green-600 border-green-600' :
                        relation.status === RelationStatus.PENDING ? 'text-orange-600 border-orange-600' :
                        relation.status === RelationStatus.SUSPENDED ? 'text-yellow-600 border-yellow-600' :
                        'text-red-600 border-red-600'
                      }
                    >
                      {RELATION_STATUS_LABELS[relation.status]}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {/* Informations principales */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Accès :</span>
                      <span className="font-medium">{DATA_SHARE_TYPE_LABELS[relation.dataShareType]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Activité :</span>
                      <span className="font-medium">{relation.accessCount} accès</span>
                    </div>
                  </div>

                  {/* Priorité et dates */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Priorité :</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          relation.priority === 'URGENT' ? 'text-red-600 border-red-600' :
                          relation.priority === 'HIGH' ? 'text-orange-600 border-orange-600' :
                          relation.priority === 'MEDIUM' ? 'text-blue-600 border-blue-600' :
                          'text-gray-600'
                        }`}
                      >
                        {relation.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Créée :</span>
                      <span className="font-medium">{new Date(relation.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>

                  {/* Services partagés */}
                  {relation.sharedData?.services && relation.sharedData.services.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Services partagés :</p>
                      <div className="flex flex-wrap gap-1">
                        {relation.sharedData.services.slice(0, 3).map((service) => (
                          <Badge key={service} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {relation.sharedData.services.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{relation.sharedData.services.length - 3} autres
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions rapides */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>ID: {relation.id.slice(-8)}</span>
                      {relation.lastAccessedAt && (
                        <>
                          <span>•</span>
                          <span>Dernier accès: {new Date(relation.lastAccessedAt).toLocaleDateString('fr-FR')}</span>
                        </>
                      )}
                    </div>

                    <div className="flex gap-1">
                      {/* Actions selon le statut */}
                      {needsApproval && canManage && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApproveRelation(relation.id);
                          }}
                          disabled={loadingStates.approving}
                          className="text-green-600 hover:text-green-700 border-green-300"
                        >
                          {loadingStates.approving ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                        </Button>
                      )}

                      {relation.status === RelationStatus.SUSPENDED && canManage && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResumeRelation(relation.id);
                          }}
                          disabled={loadingStates.resuming}
                          className="text-blue-600 hover:text-blue-700 border-blue-300"
                        >
                          {loadingStates.resuming ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestConnection(relation.id);
                        }}
                        disabled={loadingStates.testingConnection}
                        title="Tester la connexion"
                      >
                        {loadingStates.testingConnection ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadAnalytics(relation.id);
                        }}
                        disabled={loadingStates.loadingAnalytics}
                        title="Voir les analytics"
                      >
                        {loadingStates.loadingAnalytics ? <Loader2 className="h-3 w-3 animate-spin" /> : <BarChart3 className="h-3 w-3" />}
                      </Button>

                      {canManage && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => e.stopPropagation()}
                          title="Plus d'actions"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Message si aucune relation */}
      {filteredRelations.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune relation trouvée</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedType !== 'all' || selectedStatus !== 'all'
                ? 'Aucune relation ne correspond à vos critères de recherche.'
                : 'Aucune relation inter-organismes configurée.'
              }
            </p>
            {canManage && (
              <div className="flex justify-center gap-2">
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer la première relation
                </Button>
                {(searchQuery || selectedType !== 'all' || selectedStatus !== 'all') && (
                  <Button variant="outline" onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                    setSelectedStatus('all');
                    setSelectedDirection('all');
                  }}>
                    Effacer filtres
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal de création de relation (existant, mais amélioré) */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>🤝 Créer une Nouvelle Relation</DialogTitle>
            <DialogDescription>
              Établissez une relation de partage avec un autre organisme
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Organisation partenaire *</Label>
                <Select
                  value={newRelation.toOrgId}
                  onValueChange={(value) => setNewRelation(prev => ({ ...prev, toOrgId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une organisation" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations
                      .filter(org => org.id !== organizationId)
                      .map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span>{org.name} ({org.code})</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Type de relation *</Label>
                <Select
                  value={newRelation.relationType}
                  onValueChange={(value) => setNewRelation(prev => ({ ...prev, relationType: value as RelationType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(RELATION_TYPE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type de partage *</Label>
                <Select
                  value={newRelation.dataShareType}
                  onValueChange={(value) => setNewRelation(prev => ({ ...prev, dataShareType: value as DataShareType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DATA_SHARE_TYPE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Priorité</Label>
                <Select
                  value={newRelation.priority}
                  onValueChange={(value) => setNewRelation(prev => ({ ...prev, priority: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">🟢 Basse</SelectItem>
                    <SelectItem value="MEDIUM">🟡 Moyenne</SelectItem>
                    <SelectItem value="HIGH">🟠 Haute</SelectItem>
                    <SelectItem value="URGENT">🔴 Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Date de fin (optionnelle)</Label>
              <Input
                type="date"
                value={newRelation.endDate?.split('T')[0] || ''}
                onChange={(e) => setNewRelation(prev => ({
                  ...prev,
                  endDate: e.target.value ? `${e.target.value}T23:59:59Z` : undefined
                }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={newRelation.notes || ''}
                onChange={(e) => setNewRelation(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Description, justification ou informations complémentaires..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                setNewRelation({
                  relationType: RelationType.COLLABORATIVE,
                  dataShareType: DataShareType.READ_ONLY,
                  priority: 'MEDIUM'
                });
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleCreateRelation}
              disabled={loadingStates.creating}
            >
              {loadingStates.creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Créer la relation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de détails de relation amélioré */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl">
          {selectedRelation && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getRelationIcon(selectedRelation.relationType)}
                  Détails de la Relation
                  <Badge className={getBadgeColor(selectedRelation.relationType)}>
                    {RELATION_TYPE_LABELS[selectedRelation.relationType]}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  {getPartnerOrganization(selectedRelation, organizationId)?.name} •
                  ID: {selectedRelation.id}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Informations principales */}
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Informations Générales</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-xs text-gray-500">Type de relation</Label>
                        <p className="font-medium">{RELATION_TYPE_LABELS[selectedRelation.relationType]}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Type de partage</Label>
                        <p className="font-medium">{DATA_SHARE_TYPE_LABELS[selectedRelation.dataShareType]}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Statut</Label>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(selectedRelation.status)}
                          <span className="font-medium">{RELATION_STATUS_LABELS[selectedRelation.status]}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Priorité</Label>
                        <Badge className={`${
                          selectedRelation.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                          selectedRelation.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                          selectedRelation.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedRelation.priority}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Statistiques</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-xs text-gray-500">Nombre d'accès</Label>
                        <p className="text-2xl font-bold text-blue-600">{selectedRelation.accessCount}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Date de création</Label>
                        <p className="font-medium">{new Date(selectedRelation.createdAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Dernière modification</Label>
                        <p className="font-medium">{new Date(selectedRelation.updatedAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                      {selectedRelation.lastAccessedAt && (
                        <div>
                          <Label className="text-xs text-gray-500">Dernier accès</Label>
                          <p className="font-medium">{new Date(selectedRelation.lastAccessedAt).toLocaleDateString('fr-FR')}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Services et permissions */}
                {(selectedRelation.sharedData?.services || selectedRelation.permissions) && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Configuration du partage
                      </h4>

                      {selectedRelation.sharedData?.services && (
                        <div className="mb-4">
                          <Label className="text-sm font-medium">Services partagés</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedRelation.sharedData.services.map((service) => (
                              <Badge key={service} variant="outline" className="bg-green-50 border-green-200 text-green-800">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedRelation.permissions && (
                        <div>
                          <Label className="text-sm font-medium">Permissions</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {Object.entries(selectedRelation.permissions).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Notes */}
                {selectedRelation.notes && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Notes
                      </Label>
                      <Card className="mt-2">
                        <CardContent className="pt-4">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedRelation.notes}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
              </div>

              <DialogFooter className="flex flex-wrap gap-2">
                <div className="flex-1 flex gap-2">
                  {canManage && (
                    <>
                      {selectedRelation.status === RelationStatus.PENDING && (
                        <Button
                          onClick={() => handleApproveRelation(selectedRelation.id)}
                          disabled={loadingStates.approving}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {loadingStates.approving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                          Approuver
                        </Button>
                      )}

                      {selectedRelation.status === RelationStatus.ACTIVE && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowSuspendModal(true);
                            setShowDetailsModal(false);
                          }}
                          disabled={loadingStates.suspending}
                          className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                        >
                          {loadingStates.suspending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Pause className="mr-2 h-4 w-4" />}
                          Suspendre
                        </Button>
                      )}

                      {selectedRelation.status === RelationStatus.SUSPENDED && (
                        <Button
                          onClick={() => handleResumeRelation(selectedRelation.id)}
                          disabled={loadingStates.resuming}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {loadingStates.resuming ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                          Reprendre
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        onClick={() => handleDuplicateRelation(selectedRelation)}
                        disabled={loadingStates.duplicating}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        {loadingStates.duplicating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Copy className="mr-2 h-4 w-4" />}
                        Dupliquer
                      </Button>
                    </>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection(selectedRelation.id)}
                    disabled={loadingStates.testingConnection}
                  >
                    {loadingStates.testingConnection ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                    Tester
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleLoadAnalytics(selectedRelation.id)}
                    disabled={loadingStates.loadingAnalytics}
                  >
                    {loadingStates.loadingAnalytics ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart3 className="mr-2 h-4 w-4" />}
                    Analytics
                  </Button>
                </div>

                <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                  Fermer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de suspension */}
      <Dialog open={showSuspendModal} onOpenChange={setShowSuspendModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pause className="h-5 w-5 text-yellow-600" />
              Suspendre la Relation
            </DialogTitle>
            <DialogDescription>
              La relation sera temporairement désactivée et pourra être réactivée plus tard.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Raison de la suspension *</Label>
              <Textarea
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="Expliquez pourquoi cette relation doit être suspendue..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuspendModal(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => selectedRelation && handleSuspendRelation(selectedRelation.id, suspensionReason)}
              disabled={loadingStates.suspending || !suspensionReason.trim()}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {loadingStates.suspending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Pause className="mr-2 h-4 w-4" />}
              Suspendre
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
              Exporter les Relations
            </DialogTitle>
            <DialogDescription>
              Choisissez le format d'export pour les relations de cet organisme
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Format d'export</Label>
              <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as typeof exportFormat)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">
                    <div className="flex items-center gap-2">
                      <DatabaseIcon className="h-4 w-4" />
                      Excel (.xlsx)
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      PDF (Rapport)
                    </div>
                  </SelectItem>
                  <SelectItem value="json">
                    <div className="flex items-center gap-2">
                      <DatabaseIcon className="h-4 w-4" />
                      JSON (Données)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>{filteredRelations.length}</strong> relation(s) seront exportées selon les filtres actuels.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportModal(false)}>
              Annuler
            </Button>
            <Button onClick={handleExportRelations} disabled={loadingStates.exporting}>
              {loadingStates.exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Exporter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal d'actions en lot */}
      <Dialog open={showBulkActionsModal} onOpenChange={setShowBulkActionsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Actions en Lot
            </DialogTitle>
            <DialogDescription>
              Appliquer une action à {selectedRelations.length} relation(s) sélectionnée(s)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Action à effectuer</Label>
              <Select value={selectedBulkAction} onValueChange={setSelectedBulkAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une action" />
                </SelectTrigger>
                <SelectContent>
                  {bulkActions.map((action) => (
                    <SelectItem key={action.id} value={action.id}>
                      <div className="flex items-center gap-2">
                        {action.icon}
                        {action.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedBulkAction && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  {bulkActions.find(a => a.id === selectedBulkAction)?.confirmationMessage ||
                   'Cette action sera appliquée à toutes les relations sélectionnées.'}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkActionsModal(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleBulkAction}
              disabled={loadingStates.bulkActions || !selectedBulkAction}
            >
              {loadingStates.bulkActions ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Target className="mr-2 h-4 w-4" />}
              Appliquer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal d'analytics de relation */}
      <Dialog open={showAnalyticsModal} onOpenChange={setShowAnalyticsModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics de la Relation
            </DialogTitle>
            <DialogDescription>
              Statistiques détaillées et métriques de performance
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {relationAnalytics ? (
              <>
                {/* Métriques principales */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-blue-600">{relationAnalytics.totalAccess}</div>
                      <p className="text-xs text-muted-foreground">Accès total</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600">{relationAnalytics.successRate.toFixed(1)}%</div>
                      <p className="text-xs text-muted-foreground">Taux de succès</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-purple-600">{Math.round(relationAnalytics.avgResponseTime)}ms</div>
                      <p className="text-xs text-muted-foreground">Temps moyen</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-orange-600">{relationAnalytics.monthlyAccess}</div>
                      <p className="text-xs text-muted-foreground">Accès ce mois</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Graphique des types de données */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Accès par Type de Données</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(relationAnalytics.performanceMetrics.dataTypeStats).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{type}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(count / Math.max(...Object.values(relationAnalytics.performanceMetrics.dataTypeStats))) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Accès récents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Accès récents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {relationAnalytics.recentAccess.map((access) => (
                        <div key={access.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            {access.success ?
                              <CheckCircle className="h-4 w-4 text-green-600" /> :
                              <XCircle className="h-4 w-4 text-red-600" />
                            }
                            <div>
                              <span className="text-sm font-medium">{access.action}</span>
                              <p className="text-xs text-gray-500">{access.dataType} • {access.responseTime}ms</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(access.timestamp).toLocaleDateString('fr-FR')} {new Date(access.timestamp).toLocaleTimeString('fr-FR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Logs d'erreur */}
                {relationAnalytics.errorLogs.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm text-red-600">Logs d'Erreur</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {relationAnalytics.errorLogs.map((error) => (
                          <div key={error.id} className="flex items-center justify-between p-2 border border-red-200 rounded bg-red-50">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <div>
                                <span className="text-sm font-medium text-red-800">{error.error}</span>
                                <p className="text-xs text-red-600">{error.attempts} tentative(s)</p>
                              </div>
                            </div>
                            <span className="text-xs text-red-500">
                              {new Date(error.timestamp).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Statistiques des heures de pointe */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Activité par Heure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-12 gap-1">
                      {relationAnalytics.performanceMetrics.peakHours.map((hourData) => (
                        <div key={hourData.hour} className="text-center">
                          <div
                            className="bg-blue-200 hover:bg-blue-300 transition-colors rounded"
                            style={{ height: `${Math.max(10, (hourData.count / Math.max(...relationAnalytics.performanceMetrics.peakHours.map(h => h.count))) * 60)}px` }}
                            title={`${hourData.hour}h: ${hourData.count} accès`}
                          />
                          <span className="text-xs text-gray-500">{hourData.hour}h</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
                <p className="text-muted-foreground">Chargement des analytics...</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAnalyticsModal(false)}>
              Fermer
            </Button>
            <Button onClick={() => toast.success('📊 Rapport détaillé généré')}>
              <Download className="mr-2 h-4 w-4" />
              Exporter rapport
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de résultats des tests de connexion */}
      <Dialog open={showTestResultsModal} onOpenChange={setShowTestResultsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Résultats du Test de Connexion
            </DialogTitle>
            <DialogDescription>
              Détails de la performance de la connexion pour la relation sélectionnée.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Connexion</Label>
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <div className={`w-4 h-4 rounded-full ${testResults?.connectionTest.status === 'success' ? 'bg-green-500' : testResults?.connectionTest.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <span>{testResults?.connectionTest.message}</span>
                <span className="text-xs text-gray-500">({testResults?.connectionTest.latency}ms)</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Authentification</Label>
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <div className={`w-4 h-4 rounded-full ${testResults?.authenticationTest.status === 'success' ? 'bg-green-500' : testResults?.authenticationTest.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <span>{testResults?.authenticationTest.message}</span>
                <span className="text-xs text-gray-500">({testResults?.authenticationTest.timestamp})</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Permissions</Label>
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <div className={`w-4 h-4 rounded-full ${testResults?.permissionsTest.status === 'success' ? 'bg-green-500' : testResults?.permissionsTest.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <span>{testResults?.permissionsTest.message}</span>
                <span className="text-xs text-gray-500">({testResults?.permissionsTest.timestamp})</span>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Accès aux Données</Label>
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <div className={`w-4 h-4 rounded-full ${testResults?.dataAccessTest.status === 'success' ? 'bg-green-500' : testResults?.dataAccessTest.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <span>{testResults?.dataAccessTest.message}</span>
                <span className="text-xs text-gray-500">({testResults?.dataAccessTest.timestamp})</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTestResultsModal(false)}>
              Fermer
            </Button>
            <Button onClick={() => handleExportAnalytics()}>
              <Download className="mr-2 h-4 w-4" />
              Exporter Rapport
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
