'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Download, FileText, FileSpreadsheet, File, Image,
  Settings, Clock, CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import {
  OrganizationRelation,
  RelationType,
  RelationStatus,
  RELATION_TYPE_LABELS,
  RELATION_STATUS_LABELS
} from '@/lib/types/organization-relations';

// === INTERFACES ===
interface ExportSettings {
  format: 'csv' | 'excel' | 'pdf' | 'json' | 'png';
  includeInactive: boolean;
  includeMetadata: boolean;
  includePermissions: boolean;
  includeAuditData: boolean;
  filterByType: RelationType | 'all';
  filterByStatus: RelationStatus | 'all';
  groupBy: 'none' | 'type' | 'status' | 'organization';
  sortBy: 'name' | 'date' | 'access' | 'priority';
  sortOrder: 'asc' | 'desc';
}

interface ExportProgress {
  stage: 'preparing' | 'processing' | 'generating' | 'complete' | 'error';
  progress: number;
  message: string;
  downloadUrl?: string;
}

// === COMPOSANT PRINCIPAL ===
interface RelationsExportManagerProps {
  relations: OrganizationRelation[];
  organizations: any[];
  isOpen: boolean;
  onClose: () => void;
}

export const RelationsExportManager: React.FC<RelationsExportManagerProps> = ({
  relations,
  organizations,
  isOpen,
  onClose
}) => {
  const [settings, setSettings] = useState<ExportSettings>({
    format: 'csv',
    includeInactive: false,
    includeMetadata: true,
    includePermissions: true,
    includeAuditData: false,
    filterByType: 'all',
    filterByStatus: 'all',
    groupBy: 'none',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'fromOrg', 'toOrg', 'type', 'status', 'accessCount', 'createdAt'
  ]);

  // Colonnes disponibles
  const availableColumns = [
    { id: 'fromOrg', label: 'Organisation Source', required: true },
    { id: 'toOrg', label: 'Organisation Cible', required: true },
    { id: 'type', label: 'Type de Relation', required: false },
    { id: 'status', label: 'Statut', required: false },
    { id: 'dataShareType', label: 'Type de Partage', required: false },
    { id: 'accessCount', label: 'Nombre d\'Accès', required: false },
    { id: 'priority', label: 'Priorité', required: false },
    { id: 'createdAt', label: 'Date de Création', required: false },
    { id: 'updatedAt', label: 'Dernière Mise à Jour', required: false },
    { id: 'startDate', label: 'Date de Début', required: false },
    { id: 'endDate', label: 'Date de Fin', required: false },
    { id: 'notes', label: 'Notes', required: false },
    { id: 'permissions', label: 'Permissions', required: false }
  ];

  // Relations filtrées selon les paramètres
  const filteredRelations = useMemo(() => {
    let filtered = [...relations];

    // Filtre par type
    if (settings.filterByType !== 'all') {
      filtered = filtered.filter(rel => rel.relationType === settings.filterByType);
    }

    // Filtre par statut
    if (settings.filterByStatus !== 'all') {
      filtered = filtered.filter(rel => rel.status === settings.filterByStatus);
    }

    // Filtre par statut actif/inactif
    if (!settings.includeInactive) {
      filtered = filtered.filter(rel => rel.status === RelationStatus.ACTIVE);
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (settings.sortBy) {
        case 'name':
          aValue = a.fromOrg?.name || '';
          bValue = b.fromOrg?.name || '';
          break;
        case 'date':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'access':
          aValue = a.accessCount || 0;
          bValue = b.accessCount || 0;
          break;
        case 'priority':
          const priorityOrder = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'URGENT': 4 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (settings.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [relations, settings]);

  // Aperçu du nombre de relations à exporter
  const previewStats = useMemo(() => {
    const total = filteredRelations.length;
    const active = filteredRelations.filter(rel => rel.status === RelationStatus.ACTIVE).length;
    const pending = filteredRelations.filter(rel => rel.status === RelationStatus.PENDING).length;

    return { total, active, pending };
  }, [filteredRelations]);

  // Génération des données d'export
  const generateExportData = () => {
    return filteredRelations.map(relation => {
      const data: any = {};

      selectedColumns.forEach(columnId => {
        switch (columnId) {
          case 'fromOrg':
            data.organisationSource = relation.fromOrg?.name || 'N/A';
            break;
          case 'toOrg':
            data.organisationCible = relation.toOrg?.name || 'N/A';
            break;
          case 'type':
            data.typeRelation = RELATION_TYPE_LABELS[relation.relationType];
            break;
          case 'status':
            data.statut = RELATION_STATUS_LABELS[relation.status];
            break;
          case 'dataShareType':
            data.typePartage = relation.dataShareType;
            break;
          case 'accessCount':
            data.nombreAcces = relation.accessCount || 0;
            break;
          case 'priority':
            data.priorite = relation.priority;
            break;
          case 'createdAt':
            data.dateCreation = new Date(relation.createdAt).toLocaleDateString('fr-FR');
            break;
          case 'updatedAt':
            data.derniereMiseAJour = new Date(relation.updatedAt).toLocaleDateString('fr-FR');
            break;
          case 'startDate':
            data.dateDebut = relation.startDate ? new Date(relation.startDate).toLocaleDateString('fr-FR') : '';
            break;
          case 'endDate':
            data.dateFin = relation.endDate ? new Date(relation.endDate).toLocaleDateString('fr-FR') : '';
            break;
          case 'notes':
            data.notes = relation.notes || '';
            break;
          case 'permissions':
            if (settings.includePermissions && relation.permissions) {
              const perms = [];
              if (relation.permissions.canView) perms.push('Lecture');
              if (relation.permissions.canExport) perms.push('Export');
              if (relation.permissions.canModify) perms.push('Modification');
              if (relation.permissions.canDelete) perms.push('Suppression');
              data.permissions = perms.join(', ');
            }
            break;
        }
      });

      // Métadonnées supplémentaires si demandées
      if (settings.includeMetadata) {
        data.id = relation.id;
        data.approuveeParSource = relation.approvedByFromOrg ? 'Oui' : 'Non';
        data.approuveeParCible = relation.approvedByToOrg ? 'Oui' : 'Non';
        data.dateApprobation = relation.approvedAt ? new Date(relation.approvedAt).toLocaleDateString('fr-FR') : '';
      }

      return data;
    });
  };

  // Export CSV
  const exportToCSV = async (data: any[]) => {
    if (data.length === 0) {
      throw new Error('Aucune donnée à exporter');
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `relations-inter-organismes-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  // Export JSON
  const exportToJSON = async (data: any[]) => {
    const jsonContent = JSON.stringify({
      exportDate: new Date().toISOString(),
      totalRelations: data.length,
      settings: settings,
      relations: data
    }, null, 2);

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `relations-inter-organismes-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  // Export PDF (simulation)
  const exportToPDF = async (data: any[]) => {
    // Dans un vrai projet, on utiliserait jsPDF ou une bibliothèque similaire
    toast.info('Export PDF en cours de développement. Utilisez CSV ou JSON pour le moment.');
  };

  // Gestionnaire d'export principal
  const handleExport = async () => {
    try {
      setProgress({
        stage: 'preparing',
        progress: 0,
        message: 'Préparation des données...'
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      setProgress({
        stage: 'processing',
        progress: 25,
        message: 'Filtrage et tri des relations...'
      });

      const exportData = generateExportData();
      await new Promise(resolve => setTimeout(resolve, 500));

      setProgress({
        stage: 'generating',
        progress: 75,
        message: `Génération du fichier ${settings.format.toUpperCase()}...`
      });

      // Export selon le format choisi
      switch (settings.format) {
        case 'csv':
          await exportToCSV(exportData);
          break;
        case 'json':
          await exportToJSON(exportData);
          break;
        case 'pdf':
          await exportToPDF(exportData);
          break;
        case 'excel':
          // Utiliser csv pour simulation Excel
          await exportToCSV(exportData);
          break;
        default:
          throw new Error('Format non supporté');
      }

      setProgress({
        stage: 'complete',
        progress: 100,
        message: 'Export terminé avec succès !'
      });

      toast.success(`${exportData.length} relations exportées en ${settings.format.toUpperCase()}`);

      // Reset après 2 secondes
      setTimeout(() => {
        setProgress(null);
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      setProgress({
        stage: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      });
      toast.error('Erreur lors de l\'export');
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv':
      case 'excel':
        return <FileSpreadsheet className="w-4 h-4" />;
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'json':
        return <File className="w-4 h-4" />;
      case 'png':
        return <Image className="w-4 h-4" />;
      default:
        return <Download className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export des Relations Inter-Organismes
          </DialogTitle>
          <DialogDescription>
            Configurez et exportez les données des relations selon vos besoins
          </DialogDescription>
        </DialogHeader>

        {progress ? (
          // Affichage du progrès
          <div className="py-8">
            <div className="text-center mb-6">
              {progress.stage === 'complete' ? (
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              ) : progress.stage === 'error' ? (
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              ) : (
                <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
              )}

              <h3 className="text-lg font-semibold mb-2">
                {progress.stage === 'complete' ? 'Export Terminé' :
                 progress.stage === 'error' ? 'Erreur d\'Export' :
                 'Export en Cours'}
              </h3>

              <p className="text-gray-600 mb-4">{progress.message}</p>

              {progress.stage !== 'error' && (
                <Progress value={progress.progress} className="w-full max-w-md mx-auto" />
              )}
            </div>
          </div>
        ) : (
          // Configuration d'export
          <div className="space-y-6">
            {/* Aperçu des données */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Aperçu des Données</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{previewStats.total}</div>
                    <div className="text-sm text-gray-600">Relations au total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{previewStats.active}</div>
                    <div className="text-sm text-gray-600">Relations actives</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{previewStats.pending}</div>
                    <div className="text-sm text-gray-600">En attente</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Format et options générales */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Format et Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="format">Format d'Export</Label>
                    <Select
                      value={settings.format}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, format: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="w-4 h-4" />
                            CSV (Excel)
                          </div>
                        </SelectItem>
                        <SelectItem value="json">
                          <div className="flex items-center gap-2">
                            <File className="w-4 h-4" />
                            JSON
                          </div>
                        </SelectItem>
                        <SelectItem value="pdf" disabled>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            PDF (bientôt)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="includeInactive"
                        checked={settings.includeInactive}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, includeInactive: checked }))}
                      />
                      <Label htmlFor="includeInactive" className="text-sm">Inclure relations inactives</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="includeMetadata"
                        checked={settings.includeMetadata}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, includeMetadata: checked }))}
                      />
                      <Label htmlFor="includeMetadata" className="text-sm">Inclure métadonnées</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="includePermissions"
                        checked={settings.includePermissions}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, includePermissions: checked }))}
                      />
                      <Label htmlFor="includePermissions" className="text-sm">Inclure permissions</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Filtres */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Filtres</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="filterType">Type de Relation</Label>
                    <Select
                      value={settings.filterByType}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, filterByType: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        {Object.entries(RELATION_TYPE_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="filterStatus">Statut</Label>
                    <Select
                      value={settings.filterByStatus}
                      onValueChange={(value) => setSettings(prev => ({ ...prev, filterByStatus: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        {Object.entries(RELATION_STATUS_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="sortBy">Trier par</Label>
                      <Select
                        value={settings.sortBy}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, sortBy: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Nom</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="access">Accès</SelectItem>
                          <SelectItem value="priority">Priorité</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="sortOrder">Ordre</Label>
                      <Select
                        value={settings.sortOrder}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, sortOrder: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asc">Croissant</SelectItem>
                          <SelectItem value="desc">Décroissant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sélection des colonnes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Colonnes à Exporter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableColumns.map(column => (
                    <div key={column.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={column.id}
                        checked={selectedColumns.includes(column.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedColumns(prev => [...prev, column.id]);
                          } else if (!column.required) {
                            setSelectedColumns(prev => prev.filter(id => id !== column.id));
                          }
                        }}
                        disabled={column.required}
                      />
                      <Label
                        htmlFor={column.id}
                        className={`text-sm ${column.required ? 'font-medium' : ''}`}
                      >
                        {column.label}
                        {column.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter>
          {progress ? (
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button
                onClick={handleExport}
                disabled={previewStats.total === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {getFormatIcon(settings.format)}
                <span className="ml-2">
                  Exporter {previewStats.total} relation{previewStats.total !== 1 ? 's' : ''}
                </span>
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
