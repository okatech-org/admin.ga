"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Globe,
  CheckCircle2,
  AlertCircle,
  Info,
  Save,
  X
} from 'lucide-react';

interface DNSRecord {
  id: string;
  type: string;
  name: string;
  value: string;
  ttl: number;
  priority?: number;
  status: 'active' | 'pending' | 'updating' | 'error';
  description?: string;
  created?: string;
  lastModified?: string;
}

interface DNSEditorProps {
  domain: string;
  initialRecords?: DNSRecord[];
  onRecordsChange?: (records: DNSRecord[]) => void;
}

export default function DNSEditor({ domain, initialRecords = [], onRecordsChange }: DNSEditorProps) {
  const [records, setRecords] = useState<DNSRecord[]>(initialRecords);
  const [dnsServers, setDnsServers] = useState<Array<{ name: string; type?: string; status?: string }>>([]);
  const [provider, setProvider] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DNSRecord | null>(null);
  const [formData, setFormData] = useState({
    type: 'A',
    name: '',
    value: '',
    ttl: 3600,
    priority: '',
    description: ''
  });

  const dnsTypes = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'PTR', 'SRV'];

  // Charger les enregistrements existants
  useEffect(() => {
    loadDNSRecords();
  }, [domain]);

  const loadDNSRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/domain-management/dns?domain=${domain}`);
      const result = await response.json();

      if (result.success && result.data.records) {
        setRecords(result.data.records);
        onRecordsChange?.(result.data.records);
        if (Array.isArray(result.data.dnsServers)) {
          setDnsServers(result.data.dnsServers);
        }
        if (typeof result.data.provider === 'string') {
          setProvider(result.data.provider);
        }
      }
    } catch (error) {
      console.error('Erreur chargement DNS:', error);
      toast.error('Erreur lors du chargement des enregistrements DNS');
    } finally {
      setLoading(false);
    }
  };

  const getRecordTemplate = async (type: string) => {
    try {
      const response = await fetch(`/api/domain-management/dns-editor?domain=${domain}&type=${type}`);
      const result = await response.json();

      if (result.success && result.data.templates[type]) {
        const template = result.data.templates[type];
        setFormData({
          type,
          name: template.name,
          value: template.value,
          ttl: template.ttl,
          priority: template.priority?.toString() || '',
          description: template.description
        });
      }
    } catch (error) {
      console.error('Erreur template:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const dnsRecord = {
        type: formData.type,
        name: formData.name,
        value: formData.value,
        ttl: formData.ttl,
        priority: formData.priority ? parseInt(formData.priority) : undefined,
        description: formData.description
      };

      const action = editingRecord ? 'update_record' : 'add_record';
      const body = {
        action,
        domain,
        dnsRecord,
        recordId: editingRecord?.id
      };

      const response = await fetch('/api/domain-management/dns-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.data.message);
        setIsDialogOpen(false);
        resetForm();
        await loadDNSRecords(); // Recharger les enregistrements
      } else {
        toast.error(result.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur sauvegarde DNS:', error);
      toast.error('Erreur serveur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recordId: string) => {
    try {
      setLoading(true);

      const response = await fetch('/api/domain-management/dns-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_record',
          domain,
          recordId
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.data.message);
        await loadDNSRecords(); // Recharger les enregistrements
      } else {
        toast.error(result.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur suppression DNS:', error);
      toast.error('Erreur serveur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'A',
      name: '',
      value: '',
      ttl: 3600,
      priority: '',
      description: ''
    });
    setEditingRecord(null);
  };

  const openEditDialog = (record: DNSRecord) => {
    setEditingRecord(record);
    setFormData({
      type: record.type,
      name: record.name,
      value: record.value,
      ttl: record.ttl,
      priority: record.priority?.toString() || '',
      description: record.description || ''
    });
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'updating': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="w-3 h-3" />;
      case 'pending': return <RefreshCw className="w-3 h-3 animate-spin" />;
      case 'updating': return <RefreshCw className="w-3 h-3 animate-spin" />;
      case 'error': return <AlertCircle className="w-3 h-3" />;
      default: return <Info className="w-3 h-3" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <span>Éditeur DNS</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadDNSRecords}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button
              size="sm"
              onClick={openAddDialog}
              disabled={loading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Gérez les enregistrements DNS pour {domain} • Serveurs: {dnsServers.length > 0 ? dnsServers.map((s) => s.name).join(', ') : 'chargement...'} {provider ? `(${provider})` : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Informations importantes */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Serveurs DNS détectés</strong><br />
            {dnsServers.length > 0 ? dnsServers.map((s) => s.name).join(', ') : 'En cours de détection...'} {provider ? `• Fournisseur: ${provider}` : ''}
            <br />Les modifications des enregistrements ci-dessous seront prises en compte après propagation DNS.
          </AlertDescription>
        </Alert>

        {/* Liste des enregistrements DNS */}
        <div className="space-y-3">
          {records.map((record) => (
            <div
              key={record.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="font-mono">
                        {record.type}
                      </Badge>
                      <Badge className={getStatusColor(record.status)}>
                        {getStatusIcon(record.status)}
                        <span className="ml-1 capitalize">{record.status}</span>
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">Nom</Label>
                    <div className="font-mono text-sm">
                      {record.name === '@' ? domain : `${record.name}.${domain}`}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">Valeur</Label>
                    <div className="font-mono text-sm break-all">
                      {record.value}
                      {record.priority && (
                        <span className="text-gray-500 ml-2">
                          (priorité: {record.priority})
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">TTL</Label>
                    <div className="text-sm">{record.ttl}s</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(record)}
                    disabled={loading}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(record.id)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {record.description && (
                <div className="mt-2 text-sm text-gray-600">
                  {record.description}
                </div>
              )}
            </div>
          ))}

          {records.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun enregistrement DNS trouvé</p>
              <p className="text-sm">Cliquez sur "Ajouter" pour créer votre premier enregistrement</p>
            </div>
          )}
        </div>

        {/* Dialog d'ajout/édition */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRecord ? 'Modifier l\'enregistrement DNS' : 'Ajouter un enregistrement DNS'}
              </DialogTitle>
              <DialogDescription>
                Configurez un nouvel enregistrement DNS pour {domain}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type d'enregistrement</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => {
                      setFormData({...formData, type: value});
                      getRecordTemplate(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dnsTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ttl">TTL (secondes)</Label>
                  <Input
                    id="ttl"
                    type="number"
                    value={formData.ttl}
                    onChange={(e) => setFormData({...formData, ttl: parseInt(e.target.value) || 3600})}
                    min="300"
                    max="86400"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="@ pour le domaine racine, ou sous-domaine"
                />
                <p className="text-xs text-gray-500 mt-1">
                  @ = {domain}, www = www.{domain}
                </p>
              </div>

              <div>
                <Label htmlFor="value">Valeur</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  placeholder="Adresse IP, domaine, ou texte selon le type"
                />
              </div>

              {formData.type === 'MX' && (
                <div>
                  <Label htmlFor="priority">Priorité (MX)</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    placeholder="10"
                    min="0"
                    max="65535"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="description">Description (optionnel)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Description de cet enregistrement"
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={loading}
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !formData.name || !formData.value}
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
