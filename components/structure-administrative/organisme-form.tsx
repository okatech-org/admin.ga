'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  OrganismeAdministratif,
  CreationOrganismeData,
  ModificationOrganismeData,
  TypeOrganisme,
  NiveauHierarchique,
  StatutOrganisme
} from '@/lib/types/structure-administrative';

interface OrganismeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreationOrganismeData | ModificationOrganismeData) => Promise<void>;
  organisme?: OrganismeAdministratif | null;
  organismes: OrganismeAdministratif[];
  mode: 'create' | 'edit';
}

export default function OrganismeForm({
  open,
  onClose,
  onSubmit,
  organisme,
  organismes,
  mode
}: OrganismeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreationOrganismeData>({
    code: '',
    nom: '',
    sigle: '',
    type: TypeOrganisme.AUTRE,
    niveau: NiveauHierarchique.NIVEAU_3,
    parentId: undefined,
    mission: '',
    attributions: [],
    responsable: {
      nom: '',
      titre: '',
      email: ''
    },
    effectifs: {
      total: 0,
      cadres: 0,
      agentsExecution: 0
    },
    coordonnees: {
      adresse: '',
      ville: 'Libreville',
      province: 'Estuaire',
      email: ''
    }
  });

  const [newAttribution, setNewAttribution] = useState('');

  useEffect(() => {
    if (mode === 'edit' && organisme) {
      setFormData({
        code: organisme.code,
        nom: organisme.nom,
        sigle: organisme.sigle || '',
        type: organisme.type,
        niveau: organisme.niveau,
        parentId: organisme.parentId,
        mission: organisme.mission,
        attributions: organisme.attributions,
        responsable: organisme.responsable || {
          nom: '',
          titre: '',
          email: ''
        },
        effectifs: organisme.effectifs || {
          total: 0,
          cadres: 0,
          agentsExecution: 0
        },
        coordonnees: organisme.coordonnees || {
          adresse: '',
          ville: 'Libreville',
          province: 'Estuaire',
          email: ''
        }
      });
    }
  }, [mode, organisme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.code || !formData.nom) {
      toast.error('Le code et le nom sont obligatoires');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'edit' && organisme) {
        await onSubmit({
          ...formData,
          id: organisme.id
        } as ModificationOrganismeData);
      } else {
        await onSubmit(formData);
      }

      toast.success(mode === 'create' ? 'Organisme créé avec succès' : 'Organisme modifié avec succès');
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAttribution = () => {
    if (newAttribution.trim()) {
      setFormData({
        ...formData,
        attributions: [...formData.attributions, newAttribution.trim()]
      });
      setNewAttribution('');
    }
  };

  const handleRemoveAttribution = (index: number) => {
    setFormData({
      ...formData,
      attributions: formData.attributions.filter((_, i) => i !== index)
    });
  };

  const parentOptions = organismes.filter(o =>
    o.niveau < formData.niveau && (!organisme || o.id !== organisme.id)
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? '🏢 Créer un nouvel organisme' : '✏️ Modifier l\'organisme'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Remplissez les informations pour créer un nouvel organisme administratif'
              : `Modification de ${organisme?.nom}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ex: DGDI"
                required
                disabled={mode === 'edit'}
              />
            </div>
            <div>
              <Label htmlFor="sigle">Sigle</Label>
              <Input
                id="sigle"
                value={formData.sigle}
                onChange={(e) => setFormData({ ...formData, sigle: e.target.value })}
                placeholder="Ex: DGDI"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="nom">Nom complet *</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Ex: Direction Générale de la Digitalisation et de l'Innovation"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type d'organisme</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as TypeOrganisme })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TypeOrganisme).map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="niveau">Niveau hiérarchique</Label>
              <Select
                value={formData.niveau.toString()}
                onValueChange={(value) => setFormData({ ...formData, niveau: parseInt(value) as NiveauHierarchique })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(niveau => (
                    <SelectItem key={niveau} value={niveau.toString()}>
                      Niveau {niveau}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Organisme parent */}
          {formData.niveau > 1 && (
            <div>
              <Label htmlFor="parent">Organisme parent</Label>
              <Select
                value={formData.parentId || ''}
                onValueChange={(value) => setFormData({ ...formData, parentId: value || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un organisme parent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun</SelectItem>
                  {parentOptions.map(org => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.nom} (Niveau {org.niveau})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Mission */}
          <div>
            <Label htmlFor="mission">Mission</Label>
            <Textarea
              id="mission"
              value={formData.mission}
              onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              placeholder="Décrivez la mission principale de l'organisme"
              rows={3}
            />
          </div>

          {/* Attributions */}
          <div>
            <Label>Attributions</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newAttribution}
                  onChange={(e) => setNewAttribution(e.target.value)}
                  placeholder="Ajouter une attribution"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAttribution())}
                />
                <Button type="button" onClick={handleAddAttribution} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.attributions.map((attr, index) => (
                  <Badge key={index} variant="secondary" className="py-1">
                    {attr}
                    <button
                      type="button"
                      onClick={() => handleRemoveAttribution(index)}
                      className="ml-2 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Responsable */}
          <div className="space-y-4">
            <h3 className="font-semibold">Responsable</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="resp-nom">Nom du responsable</Label>
                <Input
                  id="resp-nom"
                  value={formData.responsable?.nom || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    responsable: { ...formData.responsable!, nom: e.target.value }
                  })}
                  placeholder="Nom complet"
                />
              </div>
              <div>
                <Label htmlFor="resp-titre">Titre</Label>
                <Input
                  id="resp-titre"
                  value={formData.responsable?.titre || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    responsable: { ...formData.responsable!, titre: e.target.value }
                  })}
                  placeholder="Ex: Directeur Général"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="resp-email">Email</Label>
              <Input
                id="resp-email"
                type="email"
                value={formData.responsable?.email || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  responsable: { ...formData.responsable!, email: e.target.value }
                })}
                placeholder="email@gouv.ga"
              />
            </div>
          </div>

          {/* Effectifs */}
          <div className="space-y-4">
            <h3 className="font-semibold">Effectifs</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="eff-cadres">Cadres</Label>
                <Input
                  id="eff-cadres"
                  type="number"
                  value={formData.effectifs?.cadres || 0}
                  onChange={(e) => setFormData({
                    ...formData,
                    effectifs: { ...formData.effectifs!, cadres: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="eff-agents">Agents</Label>
                <Input
                  id="eff-agents"
                  type="number"
                  value={formData.effectifs?.agentsExecution || 0}
                  onChange={(e) => setFormData({
                    ...formData,
                    effectifs: { ...formData.effectifs!, agentsExecution: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="eff-total">Total</Label>
                <Input
                  id="eff-total"
                  type="number"
                  value={(formData.effectifs?.cadres || 0) + (formData.effectifs?.agentsExecution || 0)}
                  disabled
                  className="bg-gray-100"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'create' ? 'Création...' : 'Modification...'}
                </>
              ) : (
                mode === 'create' ? 'Créer l\'organisme' : 'Enregistrer les modifications'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
