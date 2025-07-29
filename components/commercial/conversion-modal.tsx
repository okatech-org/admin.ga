/* @ts-nocheck */
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Building2, Clock, Euro, Users, Star } from 'lucide-react';
import { OrganismeCommercial, TypeContrat, ConversionProspectData } from '@/lib/types/organisme';
import { organismeCommercialService } from '@/lib/services/organisme-commercial.service';
import { toast } from 'sonner';

interface ConversionModalProps {
  organisme: OrganismeCommercial;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Configuration des contrats avec détails
const CONTRATS_CONFIG = {
  STANDARD: {
    nom: 'Standard',
    prix: 2500000,
    duree: 12,
    couleur: 'bg-blue-100 text-blue-800 border-blue-300',
    icone: Building2,
    avantages: [
      'Gestion documentaire de base',
      'Services citoyens numériques',
      'Support technique standard',
      'Formation initiale incluse'
    ]
  },
  PREMIUM: {
    nom: 'Premium',
    prix: 8500000,
    duree: 24,
    couleur: 'bg-green-100 text-green-800 border-green-300',
    icone: Star,
    avantages: [
      'Gestion documentaire avancée',
      'Workflow automatisés',
      'Analytics et reporting',
      'Support technique prioritaire',
      'Formation équipes complète'
    ]
  },
  ENTERPRISE: {
    nom: 'Enterprise',
    prix: 25000000,
    duree: 36,
    couleur: 'bg-purple-100 text-purple-800 border-purple-300',
    icone: Users,
    avantages: [
      'Suite complète de services',
      'Intégration systèmes existants',
      'Support dédié 24/7',
      'API personnalisées',
      'Accompagnement dédié'
    ]
  },
  GOUVERNEMENTAL: {
    nom: 'Gouvernemental',
    prix: 50000000,
    duree: 48,
    couleur: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icone: CheckCircle,
    avantages: [
      'Suite gouvernementale complète',
      'Sécurité renforcée',
      'Conformité réglementaire',
      'Intégrations inter-ministérielles',
      'Support gouvernemental dédié'
    ]
  }
};

const RESPONSABLES_COMMERCIAUX = [
  'Jean-Pierre MBOUMBA',
  'Marie-Claire ASSEKO',
  'Sylvie OGANDAGA',
  'Paul NDONG MEZUI',
  'Christine MOUSSA'
];

export function ConversionModal({ organisme, isOpen, onClose, onSuccess }: ConversionModalProps) {
  const [etapeActuelle, setEtapeActuelle] = useState(1);
  const [typeContratSelectionne, setTypeContratSelectionne] = useState<TypeContrat | ''>('');
  const [formData, setFormData] = useState({
    responsableCommercial: '',
    dateSignature: new Date().toISOString().split('T')[0],
    dureePersonnalisee: '',
    conditions: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const contratConfig = typeContratSelectionne ? CONTRATS_CONFIG[typeContratSelectionne] : null;

  const formatPrix = (prix: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(prix);
  };

  const handleTypeContratChange = (type: TypeContrat) => {
    setTypeContratSelectionne(type);
    setEtapeActuelle(2);
  };

  const handleConversion = async () => {
    if (!typeContratSelectionne || !formData.responsableCommercial) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);

    const conversionData: ConversionProspectData = {
      organismeId: organisme.id,
      typeContrat: typeContratSelectionne,
      montantAnnuel: contratConfig!.prix,
      dureeContrat: formData.dureePersonnalisee ? parseInt(formData.dureePersonnalisee) : contratConfig!.duree,
      servicesSelectionnes: contratConfig!.avantages,
      responsableCommercial: formData.responsableCommercial,
      dateSignature: formData.dateSignature,
      conditions: formData.conditions || `Contrat ${contratConfig!.nom} standard avec clauses gouvernementales`
    };

    try {
      const success = organismeCommercialService.convertirEnClient(organisme.id, conversionData);

      if (success) {
        toast.success(`${organisme.nom} converti en client avec succès !`);
        onSuccess();
        onClose();
        resetForm();
      } else {
        toast.error('Erreur lors de la conversion');
      }
    } catch (error) {
      toast.error('Erreur lors de la conversion');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEtapeActuelle(1);
    setTypeContratSelectionne('');
    setFormData({
      responsableCommercial: '',
      dateSignature: new Date().toISOString().split('T')[0],
      dureePersonnalisee: '',
      conditions: '',
      notes: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Convertir en Client - {organisme.nom}
          </DialogTitle>
          <DialogDescription>
            Transformez ce prospect en client avec un contrat ADMIN.GA
          </DialogDescription>
        </DialogHeader>

        {/* Indicateur d'étapes */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              etapeActuelle >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${etapeActuelle >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              etapeActuelle >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${etapeActuelle >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              etapeActuelle >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Étape 1: Sélection du type de contrat */}
        {etapeActuelle === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Étape 1: Choisissez le type de contrat</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(CONTRATS_CONFIG).map(([type, config]) => {
                const IconeContrat = config.icone;
                return (
                  <Card
                    key={type}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      typeContratSelectionne === type ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleTypeContratChange(type as TypeContrat)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconeContrat className="h-5 w-5" />
                          <CardTitle className="text-lg">{config.nom}</CardTitle>
                        </div>
                        <Badge className={config.couleur}>
                          {config.duree} mois
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatPrix(config.prix)}
                          <span className="text-sm font-normal text-gray-500">/an</span>
                        </div>

                        <ul className="space-y-1">
                          {config.avantages.slice(0, 3).map((avantage, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              {avantage}
                            </li>
                          ))}
                          {config.avantages.length > 3 && (
                            <li className="text-sm text-gray-500">
                              + {config.avantages.length - 3} autres avantages
                            </li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Étape 2: Détails du contrat */}
        {etapeActuelle === 2 && contratConfig && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Étape 2: Détails du contrat {contratConfig.nom}</h3>
              <Button
                variant="outline"
                onClick={() => setEtapeActuelle(1)}
              >
                Changer de contrat
              </Button>
            </div>

            {/* Résumé du contrat sélectionné */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${contratConfig.couleur}`}>
                      <contratConfig.icone className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Contrat {contratConfig.nom}</h4>
                      <p className="text-gray-600">{formatPrix(contratConfig.prix)} / an</p>
                    </div>
                  </div>
                  <Badge className={contratConfig.couleur}>
                    {contratConfig.duree} mois
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Services inclus:</h5>
                    <ul className="space-y-1">
                      {contratConfig.avantages.map((avantage, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {avantage}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="responsable">Responsable commercial *</Label>
                      <Select
                        value={formData.responsableCommercial}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, responsableCommercial: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un responsable" />
                        </SelectTrigger>
                        <SelectContent>
                          {RESPONSABLES_COMMERCIAUX.map(responsable => (
                            <SelectItem key={responsable} value={responsable}>
                              {responsable}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="dateSignature">Date de signature *</Label>
                      <Input
                        id="dateSignature"
                        type="date"
                        value={formData.dateSignature}
                        onChange={(e) => setFormData(prev => ({ ...prev, dateSignature: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="dureePersonnalisee">Durée personnalisée (mois)</Label>
                      <Input
                        id="dureePersonnalisee"
                        type="number"
                        placeholder={`Par défaut: ${contratConfig.duree} mois`}
                        value={formData.dureePersonnalisee}
                        onChange={(e) => setFormData(prev => ({ ...prev, dureePersonnalisee: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div>
                <Label htmlFor="conditions">Conditions spéciales</Label>
                <Textarea
                  id="conditions"
                  placeholder="Conditions particulières du contrat..."
                  value={formData.conditions}
                  onChange={(e) => setFormData(prev => ({ ...prev, conditions: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes internes</Label>
                <Textarea
                  id="notes"
                  placeholder="Notes pour l'équipe commerciale..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setEtapeActuelle(1)}>
                Retour
              </Button>
              <Button
                onClick={() => setEtapeActuelle(3)}
                disabled={!formData.responsableCommercial}
              >
                Valider et continuer
              </Button>
            </div>
          </div>
        )}

        {/* Étape 3: Confirmation */}
        {etapeActuelle === 3 && contratConfig && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Étape 3: Confirmation de la conversion</h3>

            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Récapitulatif de la conversion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-2">Informations organisme:</h5>
                    <ul className="space-y-1 text-sm">
                      <li><strong>Nom:</strong> {organisme.nom}</li>
                      <li><strong>Type:</strong> {organisme.type}</li>
                      <li><strong>Localisation:</strong> {organisme.localisation}</li>
                      <li><strong>Utilisateurs:</strong> {organisme.stats.totalUsers}</li>
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Détails du contrat:</h5>
                    <ul className="space-y-1 text-sm">
                      <li><strong>Type:</strong> {contratConfig.nom}</li>
                      <li><strong>Montant:</strong> {formatPrix(contratConfig.prix)}/an</li>
                      <li><strong>Durée:</strong> {formData.dureePersonnalisee || contratConfig.duree} mois</li>
                      <li><strong>Responsable:</strong> {formData.responsableCommercial}</li>
                      <li><strong>Date signature:</strong> {new Date(formData.dateSignature).toLocaleDateString('fr-FR')}</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Conversion validée</span>
                  </div>
                  <p className="text-sm text-green-700">
                    {organisme.nom} va être automatiquement déplacé dans le volet "Clients"
                    et les services du contrat {contratConfig.nom} seront activés.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setEtapeActuelle(2)}>
                Retour
              </Button>
              <Button
                onClick={handleConversion}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Conversion en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmer la conversion
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
