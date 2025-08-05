'use client';

// =============================================================================
// 🏛️ ADMINISTRATION.GA - Modal Complet de Gestion d'Organisme
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import {
  Building2,
  Phone,
  Target,
  FileText,
  Palette,
  Settings2,
  BarChart2,
  MapPin,
  Mail,
  Globe,
  Users,
  Shield,
  Lock,
  Key,
  Clock,
  Database,
  Upload,
  Download,
  Save,
  X,
  AlertTriangle,
  Info,
  Check,
  Settings,
  Users2,
  FileCheck,
  Bell,
  Zap,
  Crown,
  Layers,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit,
  Copy,
  Monitor,
  Smartphone,
  Tablet,
  Code,
  Image,
  Link,
  Loader2
} from 'lucide-react';

import { toast } from 'sonner';
import {
  ConfigurationOrganisme,
  OrganismeType,
  GroupeAdministratif,
  ValidationResult
} from '@/lib/types/organisme-configuration';
import { organismeConfigurationService } from '@/lib/services/organisme-configuration.service';
import { organismeIntegrationService } from '@/lib/services/organisme-integration.service';

// =============================================================================
// 📊 TYPES ET INTERFACES
// =============================================================================

export interface OrganismeModalData {
  id?: string;
  nom: string;
  code: string;
  type: OrganismeType;
  groupe: GroupeAdministratif;
  localisation?: string;
  contact?: {
    telephone?: string;
    email?: string;
    adresse?: string;
  };
  prospectInfo?: any;
  services?: string[];
  stats?: any;

  // Nouveaux champs de configuration complète
  configuration?: ConfigurationOrganisme;

  // Champs existants étendus
  [key: string]: any;
}

interface OrganismeModalProps {
  isOpen: boolean;
  onClose: () => void;
  organisme: OrganismeModalData | null;
  mode: 'view' | 'edit' | 'create';
  onSave?: (organisme: OrganismeModalData) => void;
  onConvert?: (organisme: OrganismeModalData) => void;
}

// =============================================================================
// 🎨 COMPOSANT PRINCIPAL
// =============================================================================

export function OrganismeModalComplete({
  isOpen,
  onClose,
  organisme,
  mode,
  onSave,
  onConvert
}: OrganismeModalProps) {
  // États
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<OrganismeModalData | null>(null);
  const [configuration, setConfiguration] = useState<ConfigurationOrganisme | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // =============================================================================
  // 🔄 INITIALISATION ET CHARGEMENT
  // =============================================================================

  useEffect(() => {
    if (organisme && isOpen) {
      setFormData({ ...organisme });
      loadConfiguration();
    }
  }, [organisme, isOpen]);

  const loadConfiguration = useCallback(async () => {
    if (!organisme?.id) return;

    try {
      setIsLoading(true);

      // Charger la configuration existante
      let config = await organismeConfigurationService.loadConfiguration(organisme.id);

      if (!config && organisme) {
        // Générer configuration par défaut si aucune existante
        config = organismeConfigurationService.generateDefaultConfiguration({
          id: organisme.id,
          code: organisme.code,
          nom: organisme.nom,
          type: organisme.type,
          groupe: organisme.groupe
        });
      }

      if (config) {
        setConfiguration(config);
        const validationResult = organismeConfigurationService.validateConfiguration(config);
        setValidation(validationResult);
      }
    } catch (error) {
      console.error('❌ Erreur chargement configuration:', error);
      toast.error('Erreur lors du chargement de la configuration');
    } finally {
      setIsLoading(false);
    }
  }, [organisme]);

  // =============================================================================
  // 🎬 GESTIONNAIRES D'ÉVÉNEMENTS
  // =============================================================================

  const handleFormChange = (field: string, value: any) => {
    if (!formData) return;

    const newFormData = { ...formData };

    // Navigation dans les objets imbriqués (ex: "contact.email")
    const keys = field.split('.');
    let current: any = newFormData;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;

    setFormData(newFormData);
    setHasChanges(true);
  };

  const handleConfigurationChange = (path: string, value: any) => {
    if (!configuration) return;

    const newConfig = { ...configuration };

    // Navigation dans la configuration (ex: "parametres.securite.authentification.longueur_minimale")
    const keys = path.split('.');
    let current: any = newConfig;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;

    // Valider la nouvelle configuration
    const validationResult = organismeConfigurationService.validateConfiguration(newConfig);

    setConfiguration(newConfig);
    setValidation(validationResult);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!formData || !configuration) return;

    try {
      setIsLoading(true);

      // Valider la configuration
      if (validation && !validation.valid) {
        toast.error('Configuration invalide. Corrigez les erreurs avant de sauvegarder.');
        return;
      }

      // Appliquer la configuration complète
      if (formData.id) {
        await organismeIntegrationService.appliquerConfiguration(formData.id, configuration);
      }

      // Sauvegarder les données de l'organisme
      if (onSave) {
        await onSave({ ...formData, configuration });
      }

      setHasChanges(false);
      toast.success('Configuration sauvegardée avec succès');

    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportConfiguration = () => {
    if (!configuration) return;

    try {
      const exportedConfig = organismeConfigurationService.exportConfiguration(configuration);

      // Téléchargement du fichier
      const blob = new Blob([exportedConfig], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `configuration-${formData?.code || 'organisme'}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Configuration exportée');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    }
  };

  // =============================================================================
  // 🎨 RENDU DES ONGLETS
  // =============================================================================

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Informations Générales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom">Nom de l'Organisme *</Label>
              <Input
                id="nom"
                value={formData?.nom || ''}
                onChange={(e) => handleFormChange('nom', e.target.value)}
                placeholder="Nom officiel de l'organisme"
              />
            </div>

            <div>
              <Label htmlFor="code">Code Organisme *</Label>
              <Input
                id="code"
                value={formData?.code || ''}
                onChange={(e) => handleFormChange('code', e.target.value)}
                placeholder="Ex: DGDI"
              />
            </div>

            <div>
              <Label htmlFor="type">Type d'Organisme</Label>
              <Select
                value={formData?.type || ''}
                onValueChange={(value) => handleFormChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MINISTERE">Ministère</SelectItem>
                  <SelectItem value="DIRECTION_GENERALE">Direction Générale</SelectItem>
                  <SelectItem value="DIRECTION">Direction</SelectItem>
                  <SelectItem value="SERVICE">Service</SelectItem>
                  <SelectItem value="MAIRIE">Mairie</SelectItem>
                  <SelectItem value="GOUVERNORAT">Gouvernorat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="groupe">Groupe Administratif</Label>
              <Select
                value={formData?.groupe || ''}
                onValueChange={(value) => handleFormChange('groupe', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le groupe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Groupe A (Institutions Suprêmes)</SelectItem>
                  <SelectItem value="B">Groupe B (Ministères)</SelectItem>
                  <SelectItem value="C">Groupe C (Directions Générales)</SelectItem>
                  <SelectItem value="D">Groupe D (Directions)</SelectItem>
                  <SelectItem value="E">Groupe E (Services)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {configuration && (
            <>
              <Separator />
              <div>
                <Label htmlFor="decret">Numéro de Décret de Création</Label>
                <Input
                  id="decret"
                  value={configuration.informations_generales.identification.numero_decret || ''}
                  onChange={(e) => handleConfigurationChange('informations_generales.identification.numero_decret', e.target.value)}
                  placeholder="Ex: Décret n°0123/PR/2023"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderContactTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            Localisation et Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {configuration && (
            <>
              <div className="md:col-span-2">
                <Label htmlFor="adresse">Adresse du Siège</Label>
                <Textarea
                  id="adresse"
                  value={configuration.informations_generales.localisation.siege_principal.adresse}
                  onChange={(e) => handleConfigurationChange('informations_generales.localisation.siege_principal.adresse', e.target.value)}
                  placeholder="Adresse complète du siège principal"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ville">Ville</Label>
                  <Input
                    id="ville"
                    value={configuration.informations_generales.localisation.siege_principal.ville}
                    onChange={(e) => handleConfigurationChange('informations_generales.localisation.siege_principal.ville', e.target.value)}
                    placeholder="Ex: Libreville"
                  />
                </div>

                <div>
                  <Label htmlFor="province">Province</Label>
                  <Select
                    value={configuration.informations_generales.localisation.siege_principal.province}
                    onValueChange={(value) => handleConfigurationChange('informations_generales.localisation.siege_principal.province', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Estuaire">Estuaire</SelectItem>
                      <SelectItem value="Haut-Ogooué">Haut-Ogooué</SelectItem>
                      <SelectItem value="Moyen-Ogooué">Moyen-Ogooué</SelectItem>
                      <SelectItem value="Ngounié">Ngounié</SelectItem>
                      <SelectItem value="Nyanga">Nyanga</SelectItem>
                      <SelectItem value="Ogooué-Ivindo">Ogooué-Ivindo</SelectItem>
                      <SelectItem value="Ogooué-Lolo">Ogooué-Lolo</SelectItem>
                      <SelectItem value="Ogooué-Maritime">Ogooué-Maritime</SelectItem>
                      <SelectItem value="Woleu-Ntem">Woleu-Ntem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    value={configuration.informations_generales.localisation.siege_principal.telephone || ''}
                    onChange={(e) => handleConfigurationChange('informations_generales.localisation.siege_principal.telephone', e.target.value)}
                    placeholder="+241 01 XX XX XX"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Officiel</Label>
                  <Input
                    id="email"
                    type="email"
                    value={configuration.informations_generales.localisation.siege_principal.email || ''}
                    onChange={(e) => handleConfigurationChange('informations_generales.localisation.siege_principal.email', e.target.value)}
                    placeholder="contact@organisme.gov.ga"
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderConfigurationTab = () => (
    <div className="space-y-6">
      {/* Configuration de Sécurité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Paramètres de Sécurité
          </CardTitle>
          <CardDescription>
            Configuration de l'authentification et des sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {configuration && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="authentification">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Authentification et Mots de Passe
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="longueur-mdp">Longueur minimale mot de passe</Label>
                      <Input
                        id="longueur-mdp"
                        type="number"
                        value={configuration.parametres.securite.authentification.politique_mot_de_passe.longueur_minimale}
                        onChange={(e) => handleConfigurationChange('parametres.securite.authentification.politique_mot_de_passe.longueur_minimale', parseInt(e.target.value))}
                        min="8"
                        max="32"
                      />
                    </div>

                    <div>
                      <Label htmlFor="complexite">Complexité requise</Label>
                      <Select
                        value={configuration.parametres.securite.authentification.politique_mot_de_passe.complexite}
                        onValueChange={(value) => handleConfigurationChange('parametres.securite.authentification.politique_mot_de_passe.complexite', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FAIBLE">Faible</SelectItem>
                          <SelectItem value="MOYENNE">Moyenne</SelectItem>
                          <SelectItem value="FORTE">Forte</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="expiration">Expiration (jours)</Label>
                      <Input
                        id="expiration"
                        type="number"
                        value={configuration.parametres.securite.authentification.politique_mot_de_passe.expiration_jours}
                        onChange={(e) => handleConfigurationChange('parametres.securite.authentification.politique_mot_de_passe.expiration_jours', parseInt(e.target.value))}
                        min="30"
                        max="365"
                      />
                    </div>

                    <div>
                      <Label htmlFor="tentatives">Tentatives max</Label>
                      <Input
                        id="tentatives"
                        type="number"
                        value={configuration.parametres.securite.authentification.politique_mot_de_passe.tentatives_max}
                        onChange={(e) => handleConfigurationChange('parametres.securite.authentification.politique_mot_de_passe.tentatives_max', parseInt(e.target.value))}
                        min="3"
                        max="10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Méthodes d'authentification disponibles</Label>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {['PASSWORD', '2FA_SMS', '2FA_APP', 'BIOMETRIE'].map((methode) => (
                        <div key={methode} className="flex items-center space-x-2">
                          <Checkbox
                            id={methode}
                            checked={configuration.parametres.securite.authentification.methodes_disponibles.includes(methode)}
                            onCheckedChange={(checked) => {
                              const current = configuration.parametres.securite.authentification.methodes_disponibles;
                              const newMethods = checked
                                ? [...current, methode]
                                : current.filter(m => m !== methode);
                              handleConfigurationChange('parametres.securite.authentification.methodes_disponibles', newMethods);
                            }}
                          />
                          <Label htmlFor={methode}>{methode}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sessions">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Gestion des Sessions
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="duree-max">Durée max session (minutes)</Label>
                      <Input
                        id="duree-max"
                        type="number"
                        value={configuration.parametres.securite.sessions.duree_max_minutes}
                        onChange={(e) => handleConfigurationChange('parametres.securite.sessions.duree_max_minutes', parseInt(e.target.value))}
                        min="60"
                        max="1440"
                      />
                    </div>

                    <div>
                      <Label htmlFor="timeout">Timeout inactivité (minutes)</Label>
                      <Input
                        id="timeout"
                        type="number"
                        value={configuration.parametres.securite.sessions.timeout_inactivite_minutes}
                        onChange={(e) => handleConfigurationChange('parametres.securite.sessions.timeout_inactivite_minutes', parseInt(e.target.value))}
                        min="5"
                        max="120"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sessions-simultanees">Sessions simultanées max</Label>
                      <Input
                        id="sessions-simultanees"
                        type="number"
                        value={configuration.parametres.securite.sessions.sessions_simultanees_max}
                        onChange={(e) => handleConfigurationChange('parametres.securite.sessions.sessions_simultanees_max', parseInt(e.target.value))}
                        min="1"
                        max="5"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Configuration des Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-purple-600" />
            Modules et Fonctionnalités
          </CardTitle>
          <CardDescription>
            Activation et configuration des modules de l'organisme
          </CardDescription>
        </CardHeader>
        <CardContent>
          {configuration && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="gestion-documentaire">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Gestion Documentaire
                    <Badge variant={configuration.modules.modules_base.gestion_documentaire.actif ? "default" : "secondary"}>
                      {configuration.modules.modules_base.gestion_documentaire.actif ? "Activé" : "Désactivé"}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={configuration.modules.modules_base.gestion_documentaire.actif}
                      onCheckedChange={(checked) => handleConfigurationChange('modules.modules_base.gestion_documentaire.actif', checked)}
                    />
                    <Label>Module activé</Label>
                  </div>

                  <div>
                    <Label>Stockage maximum (GB)</Label>
                    <Input
                      type="number"
                      value={configuration.modules.modules_base.gestion_documentaire.stockage_max_gb}
                      onChange={(e) => handleConfigurationChange('modules.modules_base.gestion_documentaire.stockage_max_gb', parseInt(e.target.value))}
                      min="10"
                      max="10000"
                    />
                  </div>

                  <div>
                    <Label>Types de fichiers autorisés</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {['PDF', 'DOCX', 'XLSX', 'JPG', 'PNG', 'MP4', 'ZIP'].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            checked={configuration.modules.modules_base.gestion_documentaire.types_fichiers_autorises.includes(type)}
                            onCheckedChange={(checked) => {
                              const current = configuration.modules.modules_base.gestion_documentaire.types_fichiers_autorises;
                              const newTypes = checked
                                ? [...current, type]
                                : current.filter(t => t !== type);
                              handleConfigurationChange('modules.modules_base.gestion_documentaire.types_fichiers_autorises', newTypes);
                            }}
                          />
                          <Label>{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="e-services">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    E-Services
                    <Badge variant={configuration.modules.modules_avances.e_services?.actif ? "default" : "secondary"}>
                      {configuration.modules.modules_avances.e_services?.actif ? "Activé" : "Désactivé"}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={configuration.modules.modules_avances.e_services?.actif || false}
                      onCheckedChange={(checked) => handleConfigurationChange('modules.modules_avances.e_services.actif', checked)}
                    />
                    <Label>Module activé</Label>
                  </div>

                  <div>
                    <Label>Services disponibles</Label>
                    <div className="space-y-2 mt-2">
                      {configuration.modules.modules_avances.e_services?.services_disponibles?.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">{service.nom}</p>
                            <p className="text-sm text-muted-foreground">
                              {service.delai_traitement_jours} jours - {service.frais} XAF
                            </p>
                          </div>
                          <Badge variant={service.paiement_en_ligne ? "default" : "secondary"}>
                            {service.paiement_en_ligne ? "Paiement en ligne" : "Paiement sur place"}
                          </Badge>
                        </div>
                      )) || []}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderBrandingTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-pink-600" />
            Identité Visuelle et Thème
          </CardTitle>
        </CardHeader>
        <CardContent>
          {configuration && (
            <>
              <div className="space-y-4">
                <h4 className="font-medium">Couleurs du Thème</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(configuration.branding.couleurs).map(([nom, couleur]) => (
                    <div key={nom}>
                      <Label htmlFor={nom} className="capitalize">{nom.replace('_', ' ')}</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id={nom}
                          type="color"
                          value={couleur}
                          onChange={(e) => handleConfigurationChange(`branding.couleurs.${nom}`, e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={couleur}
                          onChange={(e) => handleConfigurationChange(`branding.couleurs.${nom}`, e.target.value)}
                          placeholder="#000000"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Configuration de l'Interface</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="layout-type">Type de layout</Label>
                    <Select
                      value={configuration.branding.interface.layout.type}
                      onValueChange={(value) => handleConfigurationChange('branding.interface.layout.type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SIDEBAR">Sidebar</SelectItem>
                        <SelectItem value="TOP_NAV">Navigation supérieure</SelectItem>
                        <SelectItem value="COMBO">Combiné</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="theme-mode">Mode thème</Label>
                    <Select
                      value={configuration.branding.theme.mode}
                      onValueChange={(value) => handleConfigurationChange('branding.theme.mode', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CLAIR">Clair</SelectItem>
                        <SelectItem value="SOMBRE">Sombre</SelectItem>
                        <SelectItem value="AUTO">Automatique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="animations"
                      checked={configuration.branding.theme.animations}
                      onCheckedChange={(checked) => handleConfigurationChange('branding.theme.animations', checked)}
                    />
                    <Label htmlFor="animations">Animations activées</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sidebar-repliable"
                      checked={configuration.branding.interface.layout.sidebar_repliable}
                      onCheckedChange={(checked) => handleConfigurationChange('branding.interface.layout.sidebar_repliable', checked)}
                    />
                    <Label htmlFor="sidebar-repliable">Sidebar repliable</Label>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // =============================================================================
  // 🎨 RENDU PRINCIPAL
  // =============================================================================

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              {mode === 'create' ? 'Nouvel Organisme' : 'Configuration d\'Organisme'}
            </div>

            <div className="flex items-center gap-2">
              {validation && !validation.valid && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {validation.errors.length} erreur(s)
                </Badge>
              )}

              {validation && validation.warnings.length > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {validation.warnings.length} avertissement(s)
                </Badge>
              )}

              {hasChanges && (
                <Badge variant="secondary">
                  Non sauvegardé
                </Badge>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            Configuration complète pour "{formData.nom}"
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="general" className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              <span className="hidden md:inline">Général</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="hidden md:inline">Contact</span>
            </TabsTrigger>
            <TabsTrigger value="prospect" className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span className="hidden md:inline">Prospect</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-1">
              <Palette className="h-4 w-4" />
              <span className="hidden md:inline">Branding</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-1">
              <Settings2 className="h-4 w-4" />
              <span className="hidden md:inline">Config</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              <span className="hidden md:inline">Stats</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            {renderGeneralTab()}
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            {renderContactTab()}
          </TabsContent>

          <TabsContent value="prospect" className="mt-6">
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Informations de prospection</p>
              <p className="text-sm">(Contenu existant à conserver)</p>
            </div>
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Services de l'organisme</p>
              <p className="text-sm">(Contenu existant à conserver)</p>
            </div>
          </TabsContent>

          <TabsContent value="branding" className="mt-6">
            {renderBrandingTab()}
          </TabsContent>

          <TabsContent value="config" className="mt-6">
            {renderConfigurationTab()}
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <div className="text-center py-8 text-muted-foreground">
              <BarChart2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Statistiques de l'organisme</p>
              <p className="text-sm">(Contenu existant à conserver)</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions du modal */}
        <div className="flex items-center justify-between pt-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExportConfiguration}
              disabled={!configuration}
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter Config
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>

            {onConvert && (
              <Button
                variant="secondary"
                onClick={() => onConvert(formData)}
              >
                Convertir
              </Button>
            )}

            <Button
              onClick={handleSave}
              disabled={isLoading || (validation && !validation.valid)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Messages de validation */}
        {validation && validation.errors.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Erreurs de Configuration
              </h4>
              <ul className="space-y-1">
                {validation.errors.map((error, index) => (
                  <li key={index} className="text-red-600 text-sm">
                    <strong>{error.field}:</strong> {error.message}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
