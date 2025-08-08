'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Users,
  Database as DatabaseIcon,
  Check,
  X,
  AlertTriangle,
  Eye,
  Edit,
  Save,
  Filter,
  SortAsc,
  SortDesc,
  Mail,
  Phone,
  Building2,
  Bot,
  Sparkles,
  Shield,
  CheckCircle,
  XCircle,
  Star,
  User,
  Loader2,
  Download,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

interface AIGeneratedData {
  id: string;
  type: 'USER' | 'ORGANIZATION' | 'SERVICE' | 'POSTE';
  nom: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  poste?: string;
  organismeId?: string;
  organismeNom?: string;
  source: string;
  confidence: number;
  aiGenerated: boolean;
  validationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MODIFIED';
  validationNotes?: string;
  conflicts?: string[];
  suggestedChanges?: Record<string, any>;
  metadata?: {
    searchQuery?: string;
    generatedAt: string;
    aiModel: string;
    sourceData?: any;
  };
}

interface ValidationRule {
  field: string;
  required: boolean;
  validator?: (value: any) => boolean;
  errorMessage: string;
}

interface AIDataValidationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  aiData: AIGeneratedData[];
  onValidateAndSave: (validatedData: AIGeneratedData[]) => Promise<void>;
  organizationName?: string;
  dataType: 'users' | 'organizations' | 'services' | 'postes';
}

export function AIDataValidationModal({
  isOpen,
  onOpenChange,
  aiData,
  onValidateAndSave,
  organizationName,
  dataType
}: AIDataValidationModalProps) {
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [validationData, setValidationData] = useState<AIGeneratedData[]>(aiData);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'confidence' | 'nom' | 'status'>('confidence');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<Record<string, any>>({});
  const [editingItem, setEditingItem] = useState<string | null>(null);

  // Règles de validation par type de données
  const validationRules: Record<string, ValidationRule[]> = {
    users: [
      { field: 'nom', required: true, errorMessage: 'Le nom est requis' },
      { field: 'email', required: true, validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), errorMessage: 'Email invalide' },
      { field: 'telephone', required: false, validator: (v) => !v || /^\+241/.test(v), errorMessage: 'Format téléphone invalide' }
    ],
    organizations: [
      { field: 'nom', required: true, errorMessage: 'Le nom d\'organisation est requis' },
      { field: 'type', required: true, errorMessage: 'Le type d\'organisation est requis' }
    ],
    services: [
      { field: 'nom', required: true, errorMessage: 'Le nom du service est requis' },
      { field: 'description', required: false, errorMessage: '' }
    ],
    postes: [
      { field: 'nom', required: true, errorMessage: 'Le titre du poste est requis' }
    ]
  };

  // Filtrage et tri des données
  const filteredAndSortedData = useMemo(() => {
    let filtered = validationData.filter(item => {
      const searchMatch = item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const statusMatch = filterStatus === 'all' || item.validationStatus.toLowerCase() === filterStatus;

      return searchMatch && statusMatch;
    });

    // Tri
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'confidence':
          aValue = a.confidence;
          bValue = b.confidence;
          break;
        case 'nom':
          aValue = a.nom.toLowerCase();
          bValue = b.nom.toLowerCase();
          break;
        case 'status':
          aValue = a.validationStatus;
          bValue = b.validationStatus;
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [validationData, searchTerm, filterStatus, sortBy, sortDirection]);

  // Validation automatique des données
  const validateData = async () => {
    setIsValidating(true);
    const results: Record<string, any> = {};

    try {
      for (const item of validationData) {
        const rules = validationRules[dataType] || [];
        const errors: string[] = [];
        const warnings: string[] = [];

        // Validation des règles
        for (const rule of rules) {
          const value = (item as any)[rule.field];
          if (rule.required && (!value || value.toString().trim() === '')) {
            errors.push(rule.errorMessage);
          } else if (value && rule.validator && !rule.validator(value)) {
            errors.push(rule.errorMessage);
          }
        }

        // Détection de doublons potentiels
        const duplicates = validationData.filter(other =>
          other.id !== item.id &&
          (other.nom.toLowerCase() === item.nom.toLowerCase() ||
           (other.email && item.email && other.email.toLowerCase() === item.email.toLowerCase()))
        );

        if (duplicates.length > 0) {
          warnings.push(`Doublon potentiel détecté avec ${duplicates.length} autre(s) entrée(s)`);
        }

        // Vérification de la confiance IA
        if (item.confidence < 0.6) {
          warnings.push('Confiance IA faible (< 60%)');
        }

        results[item.id] = {
          isValid: errors.length === 0,
          errors,
          warnings,
          score: Math.max(0, item.confidence * 100 - errors.length * 20 - warnings.length * 10)
        };
      }

      setValidationResults(results);
      toast.success(`Validation terminée • ${Object.values(results).filter((r: any) => r.isValid).length} éléments valides`);
    } catch (error) {
      toast.error('Erreur lors de la validation');
    } finally {
      setIsValidating(false);
    }
  };

  // Mise à jour du statut de validation
  const updateValidationStatus = (id: string, status: AIGeneratedData['validationStatus'], notes?: string) => {
    setValidationData(prev => prev.map(item =>
      item.id === id
        ? { ...item, validationStatus: status, validationNotes: notes }
        : item
    ));
  };

  // Édition d'un élément
  const updateItem = (id: string, updates: Partial<AIGeneratedData>) => {
    setValidationData(prev => prev.map(item =>
      item.id === id
        ? { ...item, ...updates, validationStatus: 'MODIFIED' }
        : item
    ));
  };

  // Sélection multiple
  const toggleSelection = (id: string) => {
    setSelectedData(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    const allIds = filteredAndSortedData.map(item => item.id);
    setSelectedData(allIds);
  };

  const deselectAll = () => {
    setSelectedData([]);
  };

  // Approbation en lot
  const bulkApprove = () => {
    selectedData.forEach(id => updateValidationStatus(id, 'APPROVED'));
    toast.success(`${selectedData.length} éléments approuvés`);
  };

  const bulkReject = () => {
    selectedData.forEach(id => updateValidationStatus(id, 'REJECTED'));
    toast.error(`${selectedData.length} éléments rejetés`);
  };

  // Sauvegarde finale
  const handleSave = async () => {
    const approvedData = validationData.filter(item =>
      item.validationStatus === 'APPROVED' || item.validationStatus === 'MODIFIED'
    );

    if (approvedData.length === 0) {
      toast.warning('Aucune donnée approuvée à sauvegarder');
      return;
    }

    try {
      await onValidateAndSave(approvedData);
      onOpenChange(false);
      toast.success(`${approvedData.length} éléments sauvegardés en base de données`);
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  // Statistiques
  const stats = useMemo(() => {
    const total = validationData.length;
    const pending = validationData.filter(item => item.validationStatus === 'PENDING').length;
    const approved = validationData.filter(item => item.validationStatus === 'APPROVED').length;
    const rejected = validationData.filter(item => item.validationStatus === 'REJECTED').length;
    const modified = validationData.filter(item => item.validationStatus === 'MODIFIED').length;
    const avgConfidence = total > 0 ? validationData.reduce((sum, item) => sum + item.confidence, 0) / total : 0;

    return { total, pending, approved, rejected, modified, avgConfidence };
  }, [validationData]);

  const getStatusColor = (status: AIGeneratedData['validationStatus']) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-300';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-300';
      case 'MODIFIED': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getStatusIcon = (status: AIGeneratedData['validationStatus']) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED': return <XCircle className="h-4 w-4" />;
      case 'MODIFIED': return <Edit className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3">
            <Bot className="h-6 w-6 text-purple-500" />
            <span>Validation des données IA</span>
            <Badge variant="outline" className="text-purple-600">
              <Sparkles className="h-3 w-3 mr-1" />
              {dataType} • {organizationName}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Examinez, validez et modifiez les données générées par l'IA avant leur enregistrement en base de données.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-[calc(95vh-8rem)] gap-4">
          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Card className="p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-xs text-muted-foreground">En attente</div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                <div className="text-xs text-muted-foreground">Approuvés</div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                <div className="text-xs text-muted-foreground">Rejetés</div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.modified}</div>
                <div className="text-xs text-muted-foreground">Modifiés</div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.round(stats.avgConfidence * 100)}%</div>
                <div className="text-xs text-muted-foreground">Confiance IA</div>
              </div>
            </Card>
          </div>

          {/* Barre de contrôles */}
          <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <Input
                placeholder="🔍 Rechercher dans les données..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvés</SelectItem>
                <SelectItem value="rejected">Rejetés</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confidence">Confiance IA</SelectItem>
                <SelectItem value="nom">Nom</SelectItem>
                <SelectItem value="status">Statut</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            >
              {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>

          {/* Actions en lot */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedData.length === filteredAndSortedData.length && filteredAndSortedData.length > 0}
                  onCheckedChange={(checked) => checked ? selectAll() : deselectAll()}
                />
                <span className="text-sm">
                  {selectedData.length} sélectionné(s) sur {filteredAndSortedData.length}
                </span>
              </div>
              {selectedData.length > 0 && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={bulkApprove}>
                    <Check className="h-4 w-4 mr-1" />
                    Approuver ({selectedData.length})
                  </Button>
                  <Button size="sm" variant="outline" onClick={bulkReject}>
                    <X className="h-4 w-4 mr-1" />
                    Rejeter ({selectedData.length})
                  </Button>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={validateData}
                disabled={isValidating}
              >
                {isValidating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Shield className="h-4 w-4 mr-2" />
                )}
                Valider automatiquement
              </Button>
            </div>
          </div>

          {/* Liste des données */}
          <div className="flex-1 overflow-auto">
            <div className="grid gap-3">
              {filteredAndSortedData.map((item) => (
                <Card key={item.id} className={`p-4 hover:shadow-md transition-shadow ${selectedData.includes(item.id) ? 'ring-2 ring-blue-500' : ''}`}>
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedData.includes(item.id)}
                      onCheckedChange={() => toggleSelection(item.id)}
                    />

                    {/* Avatar/Icône */}
                    <div className="flex-shrink-0">
                      {dataType === 'users' ? (
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                            {item.nom.charAt(0)}{item.prenom?.charAt(0) || ''}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Informations principales */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-lg truncate">
                            {editingItem === item.id ? (
                              <Input
                                value={item.nom}
                                onChange={(e) => updateItem(item.id, { nom: e.target.value })}
                                className="w-64"
                              />
                            ) : (
                              item.nom
                            )}
                          </h4>
                          {item.prenom && (
                            <p className="text-sm text-muted-foreground">{item.prenom}</p>
                          )}
                          {item.poste && (
                            <p className="text-sm font-medium text-blue-600">{item.poste}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(item.validationStatus)}>
                            {getStatusIcon(item.validationStatus)}
                            <span className="ml-1">{item.validationStatus}</span>
                          </Badge>
                          <Badge variant="outline" className="text-purple-600">
                            {Math.round(item.confidence * 100)}% IA
                          </Badge>
                        </div>
                      </div>

                      {/* Détails */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                        {item.email && (
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {editingItem === item.id ? (
                              <Input
                                value={item.email}
                                onChange={(e) => updateItem(item.id, { email: e.target.value })}
                                className="h-6 text-xs"
                              />
                            ) : (
                              <span className="truncate">{item.email}</span>
                            )}
                          </div>
                        )}
                        {item.telephone && (
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            <span>{item.telephone}</span>
                          </div>
                        )}
                        {item.source && (
                          <div className="flex items-center">
                            <Bot className="h-3 w-3 mr-1" />
                            <span>Source: {item.source}</span>
                          </div>
                        )}
                        {item.organismeNom && (
                          <div className="flex items-center">
                            <Building2 className="h-3 w-3 mr-1" />
                            <span className="truncate">{item.organismeNom}</span>
                          </div>
                        )}
                      </div>

                      {/* Résultats de validation */}
                      {validationResults[item.id] && (
                        <div className="mb-3">
                          {validationResults[item.id].errors.length > 0 && (
                            <Alert className="mb-2 border-red-200">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <AlertDescription className="text-red-700">
                                <strong>Erreurs:</strong> {validationResults[item.id].errors.join(', ')}
                              </AlertDescription>
                            </Alert>
                          )}
                          {validationResults[item.id].warnings.length > 0 && (
                            <Alert className="mb-2 border-yellow-200">
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              <AlertDescription className="text-yellow-700">
                                <strong>Avertissements:</strong> {validationResults[item.id].warnings.join(', ')}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )}

                      {/* Notes de validation */}
                      {item.validationNotes && (
                        <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
                          <strong>Notes:</strong> {item.validationNotes}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateValidationStatus(item.id, 'APPROVED')}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateValidationStatus(item.id, 'REJECTED')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Actions finales */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              <strong>{stats.approved + stats.modified}</strong> éléments seront sauvegardés
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                disabled={stats.approved + stats.modified === 0}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                                    <DatabaseIcon className="h-4 w-4 mr-2" />
                Sauvegarder en base ({stats.approved + stats.modified})
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
