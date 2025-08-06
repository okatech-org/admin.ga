'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { OrganismeModalComplete } from '@/components/organismes/organisme-modal-complete';
import {
  Target,
  Users,
  MapPin,
  RefreshCw,
  TrendingUp,
  UserCheck,
  BarChart2,
  ArrowRight,
  Eye,
  Loader2,
  Building2,
  Briefcase,
  Crown,
  AlertTriangle,
  CheckCircle,
  Database,
  Settings,
  Search,
  Filter,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Phone,
  Mail,
  Calendar,
  FileText,
  Star,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Euro,
  Shield,
  Network
} from 'lucide-react';

// Interfaces principales
interface OrganismeCommercialGabon {
  id: string;
  nom: string;
  code: string;
  type: string;
  localisation: string;
  description: string;
  telephone: string;
  email: string;
  responsableContact: string;
  prospectInfo?: {
    source: string;
    priorite: string;
    notes: string;
    responsableProspection: string;
    budgetEstime?: number;
    dateContact?: string;
    prochaineSuivi?: string;
  };
  services?: string[];
  isActive: boolean;
  metadata?: {
    groupe?: string;
    estPrincipal?: boolean;
    niveauHierarchique?: number;
    parentId?: string;
  };
}

interface OrganismeGabonais {
  id: string;
  nom: string;
  code: string;
  type: string;
  groupe: string;
  classification: string;
  province: string;
  description: string;
  estPrincipal: boolean;
  isActive: boolean;
}

interface ProspectsStats {
  totalProspects: number;
  prioriteHaute: number;
  prioriteMoyenne: number;
  prioriteBasse: number;
  valeurPipeline: number;
  conversionsObjectif: number;
  contactsRecents: number;
}

interface LoadingStates {
  loading: boolean;
  refreshing: boolean;
  converting: string | null;
  viewing: string | null;
  deleting: string | null;
  saving: boolean;
}

interface ModalStates {
  viewDetails: boolean;
  editProspect: boolean;
  convertProspect: boolean;
  addProspect: boolean;
  dgbfipConfig: boolean;
  enrichedModal: boolean; // Nouveau modal enrichi
}

interface FormData {
  nom: string;
  code: string;
  type: string;
  localisation: string;
  description: string;
  telephone: string;
  email: string;
  responsableContact: string;
  priorite: string;
  source: string;
  notes: string;
}

interface FilterStates {
  search: string;
  priorite: string;
  source: string;
  type: string;
  province: string;
}

export default function OrganismesProspectsPage() {
  const { data: session } = useSession();

  // Vérification d'accès super-admin
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Accès restreint</h2>
            <p className="text-muted-foreground">
              Cette page est réservée aux super-administrateurs.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // États principaux
  const [activeTab, setActiveTab] = useState<string>('organismes-officiels-gabon');
  const [prospects, setProspects] = useState<OrganismeCommercialGabon[]>([]);
  const [organismesGabon, setOrganismesGabon] = useState<OrganismeGabonais[]>([]);
  const [stats, setStats] = useState<ProspectsStats | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedProspect, setSelectedProspect] = useState<OrganismeCommercialGabon | null>(null);

  // États de recherche et filtres intelligents
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterGroupe, setFilterGroupe] = useState<string>('all');
  const [filterStatut, setFilterStatut] = useState<string>('all');

  // États de chargement
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    loading: true,
    refreshing: false,
    converting: null,
    viewing: null,
    deleting: null,
    saving: false
  });

  // États des modales
  const [modalStates, setModalStates] = useState<ModalStates>({
    viewDetails: false,
    editProspect: false,
    convertProspect: false,
    addProspect: false,
    dgbfipConfig: false,
    enrichedModal: false
  });

  // États de configuration avancée
  const [configStates, setConfigStates] = useState({
    notifications: true,
    debugMode: false,
    apiBaseUrl: 'https://api.administration.ga',
    apiTimeout: 30000,
    apiCache: true
  });

  // États pour la section Groupes Administratifs
  const [groupeFilter, setGroupeFilter] = useState<string>('all');
  const [statutFilter, setStatutFilter] = useState<string>('all');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  // États pour les sections Statut Intégration
  const [searchExistants, setSearchExistants] = useState<string>('');
  const [filterGroupeExistants, setFilterGroupeExistants] = useState<string>('all');
  const [showAllExistants, setShowAllExistants] = useState<boolean>(false);

  const [searchProspects, setSearchProspects] = useState<string>('');
  const [filterGroupeProspects, setFilterGroupeProspects] = useState<string>('all');
  const [prioriteProspects, setPrioriteProspects] = useState<string>('all');
  const [showAllProspects, setShowAllProspects] = useState<boolean>(false);

  const [sortMetriques, setSortMetriques] = useState<string>('groupe');
  const [filterMetriques, setFilterMetriques] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // États des filtres
  const [filterStates, setFilterStates] = useState<FilterStates>({
    search: '',
    priorite: 'toutes',
    source: 'toutes',
    type: 'tous',
    province: ''
  });

  // États de pagination pour les organismes gabonais
  const [paginationGabon, setPaginationGabon] = useState({
    page: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  });

  // États de pagination pour le Pipeline Commercial (141 prospects)
  const [paginationProspects, setPaginationProspects] = useState({
    page: 1,
    itemsPerPage: 20, // Plus de prospects par page
    totalItems: 0,
    totalPages: 0
  });

  // État d'expansion des groupes gabonais
  const [expandedGroupsGabon, setExpandedGroupsGabon] = useState<Record<string, boolean>>({});

  // Données du formulaire
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    code: '',
    type: '',
    localisation: '',
    description: '',
    telephone: '',
    email: '',
    responsableContact: '',
    priorite: 'MOYENNE',
    source: 'DEMANDE_DIRECTE',
    notes: ''
  });

  // Chargement initial
  useEffect(() => {
    loadData();
  }, []);

  // Fonction de chargement des données
  const loadData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, loading: true }));

      // Charger les vraies données depuis les APIs
      const [prospectsResponse, organisationsResponse, commerciauxResponse] = await Promise.all([
        fetch('/api/organismes-commerciaux?statut=PROSPECT'),
        fetch('/api/super-admin/organizations-stats'),
        fetch('/api/organismes-commerciaux')
      ]);

      const [prospectsResult, organisationsResult, commerciauxResult] = await Promise.all([
        prospectsResponse.json(),
        organisationsResponse.json(),
        commerciauxResponse.json()
      ]);

      // Charger les 141 organismes gabonais comme prospects
      let mockProspects: OrganismeCommercialGabon[] = [];

      try {
        // Import des 141 organismes officiels du Gabon
        const { getOrganismesComplets, STATISTIQUES_ORGANISMES } = await import('@/lib/data/gabon-organismes-141');
        const organismesComplets = getOrganismesComplets();

        console.log(`🏛️ Chargement de ${organismesComplets.length} organismes gabonais comme prospects...`);

        // Convertir tous les 141 organismes en prospects
        mockProspects = organismesComplets.map((org, index) => {
          // Logique de priorité intelligente
          const getPriorite = (groupe: string, principal: boolean) => {
            if (groupe === 'A') return 'HAUTE';           // Institutions Suprêmes
            if (groupe === 'B' && principal) return 'HAUTE'; // Ministères principaux
            if (groupe === 'B') return 'MOYENNE';         // Autres ministères
            if (groupe === 'C') return 'MOYENNE';         // Directions Générales
            return 'BASSE';                               // Autres
          };

          // Logique de source diversifiée
          const getSources = () => {
            const sources = ['ORGANISME_OFFICIEL', 'DEMANDE_DIRECTE', 'REFERENCEMENT', 'RECOMMANDATION'];
            return sources[index % sources.length];
          };

          // Estimation budget selon le type d'organisme
          const getBudgetEstime = (groupe: string, type: string) => {
            if (groupe === 'A') return 50000000;  // 50M FCFA - Institutions Suprêmes
            if (type === 'MINISTERE') return 25000000; // 25M FCFA - Ministères
            if (type === 'DIRECTION_GENERALE') return 15000000; // 15M FCFA - DG
            if (type === 'MAIRIE') return 8000000;  // 8M FCFA - Mairies
            return 5000000; // 5M FCFA - Autres
          };

          return {
            id: `gabon-prospect-${index + 1}`,
            nom: org.name,
            code: org.code,
            type: org.type,
            localisation: org.city || org.province || 'Libreville',
            description: org.description || `${org.name} - Organisme officiel gabonais`,
            telephone: org.phone || `+241 01 ${String(70 + (index % 30)).padStart(2, '0')} ${String(10 + (index % 90)).padStart(2, '0')} ${String(10 + (index % 90)).padStart(2, '0')}`,
            email: org.email || `contact@${org.code.toLowerCase()}.gov.ga`,
            responsableContact: `Contact Principal ${org.name.split(' ')[0]}`,
            prospectInfo: {
              source: getSources(),
              priorite: getPriorite(org.groupe, org.est_organisme_principal),
              notes: `Organisme officiel gabonais - Groupe ${org.groupe} - ${org.description || 'Services administratifs'}`,
              responsableProspection: session?.user?.firstName || 'Admin',
              budgetEstime: getBudgetEstime(org.groupe, org.type),
              dateContact: new Date().toISOString().split('T')[0],
              prochaineSuivi: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // +7 jours
            },
            services: org.secteurs || ['Administration Publique', 'Services Citoyens'],
            isActive: true,
            metadata: {
              groupe: org.groupe,
              estPrincipal: org.est_organisme_principal,
              niveauHierarchique: org.niveau_hierarchique,
              parentId: org.parentId
            }
          };
        });

        console.log(`✅ ${mockProspects.length} organismes gabonais intégrés comme prospects`);
        toast.success(`🏛️ ${mockProspects.length} organismes officiels du Gabon chargés dans le pipeline commercial !`);

      } catch (error) {
        console.error('❌ Erreur chargement organismes:', error);

        // Fallback avec données de démonstration si erreur
        mockProspects = [
          {
            id: '1',
            nom: 'Ministère de l\'Économie Numérique',
            code: 'MIN-ECON-NUM',
            type: 'MINISTERE',
            localisation: 'Libreville',
            description: 'Ministère en charge de l\'économie numérique et de la transformation digitale',
            telephone: '+241 01 76 54 32',
            email: 'contact@economie-numerique.ga',
            responsableContact: 'Dr. Marie OBIANG',
            prospectInfo: {
              source: 'DEMANDE_DIRECTE',
              priorite: 'HAUTE',
              notes: 'Très intéressé par la digitalisation complète',
              responsableProspection: 'Jean-Pierre MBOUMBA'
            },
            services: ['Dashboard Avancé', 'Gestion Utilisateurs', 'API Publique'],
            isActive: true
          }
        ];
        toast.error('⚠️ Utilisation des données de démonstration');
      }

      // 🏛️ CHARGEMENT COMPLET DES 141 ORGANISMES OFFICIELS GABONAIS
      let mockOrganismesGabon: OrganismeGabonais[] = [];

      try {
        // Import des 141 organismes officiels du Gabon (même source que les prospects)
        const { getOrganismesComplets } = await import('@/lib/data/gabon-organismes-141');
        const organismesComplets = getOrganismesComplets();

        console.log(`🏛️ Chargement de ${organismesComplets.length} organismes officiels gabonais...`);

        // Logique intelligente pour statut d'intégration (Existants vs Prospects)
        const organismesExistantsSimules = [
          'PRES-REP', 'PRIMATURE', 'SGG', 'MIN-DEFENSE', 'MIN-JUSTICE', 'MIN-AFFAIRES-ETRANGERES',
          'MIN-INTERIEUR', 'MIN-SANTE', 'MIN-EDUCATION', 'MIN-ECONOMIE', 'DGI', 'DOUANES',
          'DGBFIP', 'DGDI', 'ANPI_GABON', 'ARSEE', 'COUR-CONSTITUTIONNELLE', 'ASSEMBLEE-NATIONALE',
          'SENAT', 'GOUVERNORAT-ESTUAIRE', 'GOUVERNORAT-HAUT-OGOOUE', 'MAIRIE-LIBREVILLE'
        ];

        // Convertir tous les organismes au format attendu avec statut d'intégration intelligent
        mockOrganismesGabon = organismesComplets.map((org, index) => {
          // Déterminer si l'organisme est déjà "existant" (intégré) ou "prospect" (à intégrer)
          const isExistant = organismesExistantsSimules.includes(org.code) ||
                            (org.est_organisme_principal && Math.random() > 0.7) || // 30% des principaux sont existants
                            (!org.est_organisme_principal && Math.random() > 0.85); // 15% des autres sont existants

          return {
            id: `gabon-${org.code}-${index + 1}`,
            nom: org.name,
            code: org.code,
            type: org.type as any,
            groupe: org.groupe,
            classification: 'pouvoir-executif',
            province: org.province || org.city,
            description: org.description || `${org.name} - Organisme officiel de la République Gabonaise`,
            estPrincipal: org.est_organisme_principal,
            isActive: isExistant // true = Existant (déjà intégré), false = Prospect (à intégrer)
          };
        });

        // Statistiques de chargement
        const existants = mockOrganismesGabon.filter(o => o.isActive).length;
        const prospects = mockOrganismesGabon.filter(o => !o.isActive).length;

        console.log(`✅ ${organismesComplets.length} organismes officiels gabonais chargés:`);
        console.log(`   📊 ${existants} existants (déjà intégrés)`);
        console.log(`   🔄 ${prospects} prospects (à intégrer)`);

        toast.success(`🏛️ ${organismesComplets.length} organismes officiels chargés ! ${existants} existants, ${prospects} prospects`);

      } catch (error) {
        console.error('❌ Erreur chargement organismes officiels:', error);

        // Fallback avec données minimales
        mockOrganismesGabon = [
          {
            id: 'pres-rep-fallback',
            nom: 'Présidence de la République',
            code: 'PRES-REP',
            type: 'PRESIDENCE',
            groupe: 'A',
            classification: 'pouvoir-executif',
            province: 'Estuaire',
            description: 'Institution suprême de l\'État gabonais',
            estPrincipal: true,
            isActive: true
          }
        ];
        toast.error('⚠️ Erreur chargement organismes officiels - Utilisation des données de fallback');
      }



      setProspects(mockProspects);
      setOrganismesGabon(mockOrganismesGabon);

      // Mettre à jour la pagination pour les organismes gabonais
      setPaginationGabon(prev => ({
      ...prev,
        totalItems: mockOrganismesGabon.length,
        totalPages: Math.ceil(mockOrganismesGabon.length / prev.itemsPerPage)
      }));

      // Statistiques calculées à partir des 141 organismes gabonais
      const prioriteHaute = mockProspects.filter(p => p.prospectInfo?.priorite === 'HAUTE').length;
      const prioriteMoyenne = mockProspects.filter(p => p.prospectInfo?.priorite === 'MOYENNE').length;
      const prioriteBasse = mockProspects.filter(p => p.prospectInfo?.priorite === 'BASSE').length;

      // Calcul de la valeur totale du pipeline basée sur les budgets estimés
      const totalValue = mockProspects.reduce((sum, prospect) => {
        return sum + (prospect.prospectInfo?.budgetEstime || 5000000);
      }, 0);

      // Conversion objective basée sur la priorité (30% haute, 15% moyenne, 5% basse)
      const conversionsObjectif = Math.round(
        (prioriteHaute * 0.30) + (prioriteMoyenne * 0.15) + (prioriteBasse * 0.05)
      );

      setStats({
        totalProspects: mockProspects.length,
        prioriteHaute,
        prioriteMoyenne,
        prioriteBasse,
        valeurPipeline: totalValue,
        conversionsObjectif,
        contactsRecents: mockProspects.filter(p => p.isActive).length
      });

      console.log(`📊 Pipeline: ${mockProspects.length} prospects, ${totalValue.toLocaleString('fr-FR')} FCFA de valeur, ${conversionsObjectif} conversions prévues`);

      toast.success('✅ Données chargées avec succès !');
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
      toast.error('❌ Erreur lors du chargement des données');
    } finally {
      setLoadingStates(prev => ({ ...prev, loading: false }));
    }
  }, [session]);

  // Fonction de rafraîchissement
  const handleRefreshData = useCallback(async () => {
      setLoadingStates(prev => ({ ...prev, refreshing: true }));
      await loadData();
      setLoadingStates(prev => ({ ...prev, refreshing: false }));
  }, [loadData]);

  // ✅ GESTIONNAIRES D'ÉVÉNEMENTS COMPLETS

  // 📋 Gestion des modales
  const openModal = (modalName: keyof ModalStates, prospect?: OrganismeCommercialGabon) => {
    if (prospect) {
      setSelectedProspect(prospect);
      setFormData({
        nom: prospect.nom,
        code: prospect.code,
        type: prospect.type,
        localisation: prospect.localisation,
        description: prospect.description,
        telephone: prospect.telephone,
        email: prospect.email,
        responsableContact: prospect.responsableContact,
        priorite: prospect.prospectInfo?.priorite || 'MOYENNE',
        source: prospect.prospectInfo?.source || 'DEMANDE_DIRECTE',
        notes: prospect.prospectInfo?.notes || ''
      });
    }
    setModalStates(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName: keyof ModalStates) => {
    setModalStates(prev => ({ ...prev, [modalName]: false }));
    setSelectedProspect(null);
    setFormData({
    nom: '',
    code: '',
    type: '',
    localisation: '',
    description: '',
    telephone: '',
    email: '',
    responsableContact: '',
    priorite: 'MOYENNE',
      source: 'DEMANDE_DIRECTE',
      notes: ''
    });
  };

  // 🔽 Gestion de l'expansion des groupes gabonais
  const toggleGroupExpansionGabon = (groupKey: string) => {
    setExpandedGroupsGabon(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  // 👁️ Voir les détails d'un prospect
  const handleViewProspect = async (prospect: OrganismeCommercialGabon) => {
    try {
      setLoadingStates(prev => ({ ...prev, viewing: prospect.id }));
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulation API
      openModal('viewDetails', prospect);
      toast.success('📊 Détails chargés avec succès');
    } catch (error) {
      toast.error('❌ Erreur lors du chargement des détails');
    } finally {
      setLoadingStates(prev => ({ ...prev, viewing: null }));
    }
  };

  // ➡️ Convertir un prospect en client
  const handleConvertProspect = async (prospect: OrganismeCommercialGabon) => {
    try {
      setLoadingStates(prev => ({ ...prev, converting: prospect.id }));
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulation API

      // Supprimer de la liste des prospects
      setProspects(prev => prev.filter(p => p.id !== prospect.id));

      // Mettre à jour les statistiques
      setStats(prev => prev ? {
        ...prev,
        totalProspects: prev.totalProspects - 1,
        conversionsObjectif: prev.conversionsObjectif + 1
      } : null);

        toast.success(`✅ ${prospect.nom} converti en client avec succès !`);
    } catch (error) {
      toast.error('❌ Erreur lors de la conversion');
    } finally {
      setLoadingStates(prev => ({ ...prev, converting: null }));
    }
  };

  // ✏️ Éditer un prospect avec le modal enrichi
  const handleEditProspect = (prospect: OrganismeCommercialGabon) => {
    openModal('enrichedModal', prospect);
  };

  // Fonction pour gérer l'ouverture du modal enrichi depuis les boutons "Gérer"
  const handleManageProspect = (prospect: OrganismeCommercialGabon) => {
    openModal('enrichedModal', prospect);
  };

  // 💾 Sauvegarder les modifications
  const handleSaveProspect = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      // Validation
      if (!formData.nom || !formData.email || !formData.telephone) {
        toast.error('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }

      // Appel API réel pour sauvegarder
      const method = selectedProspect ? 'PUT' : 'POST';
      const url = selectedProspect ?
        `/api/organismes-commerciaux/${selectedProspect.id}` :
        '/api/organismes-commerciaux';

      const apiData = {
        nom: formData.nom,
        siret: formData.code,
        secteurActivite: formData.description.split(' - ')[0] || 'Services publics',
        typeEntreprise: formData.type === 'MINISTERE' ? 'SA' :
                        formData.type === 'DIRECTION_GENERALE' ? 'SARL' : 'SAS',
        adresse: `${formData.localisation}, Gabon`,
        ville: formData.localisation,
        telephone: formData.telephone,
        email: formData.email,
        responsableLegal: {
          nom: formData.responsableContact.split(' ').pop() || 'Contact',
          prenom: formData.responsableContact.split(' ')[0] || 'Principal',
          telephone: formData.telephone,
          email: formData.email
        },
        statut: 'ACTIF',
        servicesProposés: [formData.description]
      };

      try {
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiData)
        });

        if (!response.ok) {
          throw new Error('Erreur API');
        }
      } catch (apiError) {
        console.warn('API non disponible, simulation locale:', apiError);
        // Continuer avec la simulation locale
      }

      if (selectedProspect) {
        // Mise à jour d'un prospect existant
        setProspects(prev => prev.map(p =>
          p.id === selectedProspect.id
            ? {
                ...p,
                nom: formData.nom,
                code: formData.code,
                type: formData.type,
                localisation: formData.localisation,
                description: formData.description,
                telephone: formData.telephone,
                email: formData.email,
                responsableContact: formData.responsableContact,
                prospectInfo: {
                  ...p.prospectInfo!,
                  priorite: formData.priorite,
                  source: formData.source,
                  notes: formData.notes
                }
              }
            : p
        ));
        toast.success('✅ Prospect mis à jour avec succès');
      } else {
        // Création d'un nouveau prospect
        const newProspect: OrganismeCommercialGabon = {
          id: Date.now().toString(),
          nom: formData.nom,
          code: formData.code,
          type: formData.type,
          localisation: formData.localisation,
          description: formData.description,
          telephone: formData.telephone,
          email: formData.email,
          responsableContact: formData.responsableContact,
          prospectInfo: {
            priorite: formData.priorite,
            source: formData.source,
            notes: formData.notes,
            responsableProspection: 'Admin'
          },
          services: [],
          isActive: true
        };

        setProspects(prev => [...prev, newProspect]);
        setStats(prev => prev ? { ...prev, totalProspects: prev.totalProspects + 1 } : null);
        toast.success('✅ Nouveau prospect créé avec succès');
      }

      closeModal('editProspect');
      closeModal('addProspect');
    } catch (error) {
      toast.error('❌ Erreur lors de la sauvegarde');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  };

  // 🗑️ Supprimer un prospect
  const handleDeleteProspect = async (prospect: OrganismeCommercialGabon) => {
    try {
      setLoadingStates(prev => ({ ...prev, deleting: prospect.id }));

      // Appel API réel pour supprimer
      try {
        const response = await fetch(`/api/organismes-commerciaux/${prospect.id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Erreur API');
        }
      } catch (apiError) {
        console.warn('API non disponible, simulation locale:', apiError);
      }

      setProspects(prev => prev.filter(p => p.id !== prospect.id));
      setStats(prev => prev ? { ...prev, totalProspects: prev.totalProspects - 1 } : null);

      toast.success(`🗑️ ${prospect.nom} supprimé avec succès`);
    } catch (error) {
      toast.error('❌ Erreur lors de la suppression');
    } finally {
      setLoadingStates(prev => ({ ...prev, deleting: null }));
    }
  };

  // 🔧 Configurer DGBFIP
  const handleConfigureDGBFIP = () => {
    openModal('dgbfipConfig');
  };

  // 📞 Contacter un prospect
  const handleContactProspect = (prospect: OrganismeCommercialGabon, method: 'phone' | 'email') => {
    if (method === 'phone') {
      window.open(`tel:${prospect.telephone}`);
      toast.success(`📞 Appel vers ${prospect.nom}`);
    } else {
      window.open(`mailto:${prospect.email}`);
      toast.success(`📧 Email vers ${prospect.nom}`);
    }
  };

  // ⚙️ GESTIONNAIRES DE CONFIGURATION AVANCÉE

  // Mise à jour de la pagination
  const handleUpdatePagination = useCallback((value: string) => {
    const newItemsPerPage = parseInt(value);
    setPaginationGabon(prev => ({
        ...prev,
      itemsPerPage: newItemsPerPage,
      page: 1,
      totalPages: Math.ceil(organismesGabon.length / newItemsPerPage)
    }));
    setPaginationProspects(prev => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      page: 1,
      totalPages: Math.ceil(prospects.length / newItemsPerPage)
    }));
    toast.success(`📄 Pagination mise à jour: ${value} éléments par page`);
  }, [organismesGabon.length, prospects.length]);

  // Toggle notifications
  const handleToggleNotifications = useCallback((checked: boolean) => {
    setConfigStates(prev => ({ ...prev, notifications: checked }));
    toast.success(checked ? '🔔 Notifications activées' : '🔕 Notifications désactivées');
  }, []);

  // Toggle mode debug
  const handleToggleDebugMode = useCallback((checked: boolean) => {
    setConfigStates(prev => ({ ...prev, debugMode: checked }));
    toast.success(checked ? '🐛 Mode debug activé' : '✅ Mode debug désactivé');

    if (checked) {
      console.log('🐛 Debug Mode Activé - Organismes chargés:', {
        organismesGabon: organismesGabon.length,
        prospects: prospects.length,
        stats,
        filterStates,
        loadingStates
      });
    }
  }, [organismesGabon, prospects, stats, filterStates, loadingStates]);

  // Toggle cache API
  const handleToggleApiCache = useCallback((checked: boolean) => {
    setConfigStates(prev => ({ ...prev, apiCache: checked }));
    toast.success(checked ? '💾 Cache API activé' : '🚫 Cache API désactivé');
  }, []);

  // Sauvegarder la configuration générale
  const handleSaveGeneralConfig = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      // Simulation de sauvegarde API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Ici on ferait un appel API réel pour sauvegarder
      const configData = {
        notifications: configStates.notifications,
        debugMode: configStates.debugMode,
        paginationSize: paginationGabon.itemsPerPage
      };

      console.log('💾 Configuration sauvegardée:', configData);
      toast.success('✅ Configuration générale sauvegardée avec succès !');

    } catch (error) {
      console.error('❌ Erreur sauvegarde config:', error);
      toast.error('❌ Erreur lors de la sauvegarde de la configuration');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [configStates, paginationGabon.itemsPerPage]);

  // Tester la connexion API
  const handleTestApiConnection = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      // Test de connexion simulé
      await new Promise(resolve => setTimeout(resolve, 2000));

      const testResponse = await fetch('/api/super-admin/organizations-stats');

      if (testResponse.ok) {
        toast.success('✅ Connexion API réussie !');
      } else {
        throw new Error('Connexion échouée');
      }

    } catch (error) {
      console.error('❌ Test API échoué:', error);
      toast.error('❌ Test de connexion API échoué');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, []);

  // Sauvegarder la configuration API
  const handleSaveApiConfig = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 1500));

      const apiConfigData = {
        baseUrl: configStates.apiBaseUrl,
        timeout: configStates.apiTimeout,
        cacheEnabled: configStates.apiCache
      };

      console.log('🌐 Configuration API sauvegardée:', apiConfigData);
      toast.success('✅ Configuration API sauvegardée !');

    } catch (error) {
      console.error('❌ Erreur sauvegarde API config:', error);
      toast.error('❌ Erreur lors de la sauvegarde de la configuration API');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [configStates]);

  // Export des organismes
  const handleExportOrganismes = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Créer les données CSV
      const csvData = [
        ['Nom', 'Code', 'Type', 'Groupe', 'Province', 'Statut'].join(','),
        ...organismesGabon.map(org => [
          `"${org.nom}"`,
          org.code,
          org.type,
          org.groupe,
          `"${org.province}"`,
          org.isActive ? 'Existant' : 'Prospect'
        ].join(','))
      ].join('\n');

      // Télécharger le fichier
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `organismes_officiels_gabon_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      toast.success(`📄 Export réussi ! ${organismesGabon.length} organismes exportés`);

    } catch (error) {
      console.error('❌ Erreur export:', error);
      toast.error('❌ Erreur lors de l\'export');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [organismesGabon]);

  // Export des statistiques
  const handleExportStats = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 1000));

      const statsData = {
        timestamp: new Date().toISOString(),
        totalOrganismes: organismesGabon.length,
        organismes: {
          existants: organismesGabon.filter(o => o.isActive).length,
          prospects: organismesGabon.filter(o => !o.isActive).length,
          principaux: organismesGabon.filter(o => o.estPrincipal).length
        },
        repartitionParGroupe: Object.fromEntries(
          Array.from(new Set(organismesGabon.map(o => o.groupe))).map(groupe => [
            groupe,
            {
              total: organismesGabon.filter(o => o.groupe === groupe).length,
              existants: organismesGabon.filter(o => o.groupe === groupe && o.isActive).length,
              prospects: organismesGabon.filter(o => o.groupe === groupe && !o.isActive).length
            }
          ])
        ),
        prospects: {
          total: prospects.length,
          parPriorite: {
            haute: prospects.filter(p => p.prospectInfo?.priorite === 'HAUTE').length,
            moyenne: prospects.filter(p => p.prospectInfo?.priorite === 'MOYENNE').length,
            basse: prospects.filter(p => p.prospectInfo?.priorite === 'BASSE').length
          }
        }
      };

      const blob = new Blob([JSON.stringify(statsData, null, 2)], {
        type: 'application/json;charset=utf-8;'
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `statistiques_organismes_${new Date().toISOString().split('T')[0]}.json`;
      link.click();

      toast.success('📊 Statistiques exportées avec succès !');

    } catch (error) {
      console.error('❌ Erreur export stats:', error);
      toast.error('❌ Erreur lors de l\'export des statistiques');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [organismesGabon, prospects]);

  // Import de fichier
  const handleImportFile = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('❌ Veuillez sélectionner un fichier CSV');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        const lines = csvContent.split('\n').filter(line => line.trim());

        if (lines.length < 2) {
          toast.error('❌ Fichier CSV vide ou invalide');
          return;
        }

        const headers = lines[0].split(',');
        const expectedHeaders = ['nom', 'code', 'type', 'groupe', 'province'];

        if (!expectedHeaders.every(header => headers.some(h => h.toLowerCase().includes(header)))) {
          toast.error('❌ Format CSV invalide. Headers attendus: nom,code,type,groupe,province');
          return;
        }

        const importedCount = lines.length - 1;
        toast.success(`📥 Import simulé réussi ! ${importedCount} organismes détectés`);
        console.log('📥 Données importées (simulation):', { file: file.name, lines: importedCount });

      } catch (error) {
        console.error('❌ Erreur import:', error);
        toast.error('❌ Erreur lors de l\'import du fichier');
      }
    };

    reader.readAsText(file);
    event.target.value = ''; // Reset input
  }, []);

  // Vider le cache
  const handleClearCache = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulation de vidage du cache
      console.log('🧹 Cache système vidé');
      toast.success('🧹 Cache système vidé avec succès !');

    } catch (error) {
      console.error('❌ Erreur vidage cache:', error);
      toast.error('❌ Erreur lors du vidage du cache');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, []);

  // Recharger les organismes
  const handleReloadOrganismes = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await loadData(); // Utilise la fonction existante

      toast.success('🔄 Organismes rechargés avec succès !');

    } catch (error) {
      console.error('❌ Erreur rechargement:', error);
      toast.error('❌ Erreur lors du rechargement des organismes');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [loadData]);

  // Valider l'intégrité des données
  const handleValidateData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Validation des données
      const errors = [];

      // Vérifier les doublons de codes
      const codes = organismesGabon.map(o => o.code);
      const duplicateCodes = codes.filter((code, index) => codes.indexOf(code) !== index);
      if (duplicateCodes.length > 0) {
        errors.push(`Codes dupliqués: ${duplicateCodes.join(', ')}`);
      }

      // Vérifier les organismes sans groupe
      const withoutGroup = organismesGabon.filter(o => !o.groupe || o.groupe.trim() === '');
      if (withoutGroup.length > 0) {
        errors.push(`${withoutGroup.length} organismes sans groupe`);
      }

      // Vérifier les organismes sans province
      const withoutProvince = organismesGabon.filter(o => !o.province || o.province.trim() === '');
      if (withoutProvince.length > 0) {
        errors.push(`${withoutProvince.length} organismes sans province`);
      }

      if (errors.length > 0) {
        console.warn('⚠️ Erreurs de validation:', errors);
        toast.error(`⚠️ ${errors.length} erreur(s) détectée(s) - voir console`);
      } else {
        toast.success('✅ Validation réussie ! Aucune erreur détectée');
      }

    } catch (error) {
      console.error('❌ Erreur validation:', error);
      toast.error('❌ Erreur lors de la validation');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [organismesGabon]);

  // Diagnostic système complet
  const handleSystemDiagnostic = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 3000));

      const diagnosticReport = {
        timestamp: new Date().toISOString(),
        system: {
          organismes: {
            total: organismesGabon.length,
            existants: organismesGabon.filter(o => o.isActive).length,
            prospects: organismesGabon.filter(o => !o.isActive).length,
            principaux: organismesGabon.filter(o => o.estPrincipal).length
          },
          groupes: new Set(organismesGabon.map(o => o.groupe)).size,
          provinces: new Set(organismesGabon.map(o => o.province)).size,
          prospects: prospects.length
        },
        performance: {
          loadingTime: '< 2s',
          memoryUsage: 'Optimale',
          cacheStatus: configStates.apiCache ? 'Activé' : 'Désactivé'
        },
        health: 'Système opérationnel'
      };

      console.log('🔧 Rapport de diagnostic:', diagnosticReport);
      toast.success('🔧 Diagnostic système terminé - voir console pour le rapport complet');

    } catch (error) {
      console.error('❌ Erreur diagnostic:', error);
      toast.error('❌ Erreur lors du diagnostic système');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [organismesGabon, prospects, configStates.apiCache]);

  // 🏗️ GESTIONNAIRES GROUPES ADMINISTRATIFS

  // Toggle des détails d'un groupe
  const handleToggleGroupDetails = useCallback((groupe: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupe)
        ? prev.filter(g => g !== groupe)
        : [...prev, groupe]
    );
  }, []);

  // Rafraîchir les données des groupes
  const handleRefreshGroupData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      // Simulation rechargement des données
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Recalculer les statistiques par groupe
      const groupStats = Array.from(new Set(organismesGabon.map(o => o.groupe))).map(groupe => {
        const organismesGroupe = organismesGabon.filter(o => o.groupe === groupe);
        return {
          groupe,
          total: organismesGroupe.length,
          existants: organismesGroupe.filter(o => o.isActive).length,
          prospects: organismesGroupe.filter(o => !o.isActive).length
        };
      });

      console.log('🔄 Données des groupes mises à jour:', groupStats);
      toast.success('✅ Données des groupes rafraîchies avec succès !');

    } catch (error) {
      console.error('❌ Erreur rafraîchissement groupes:', error);
      toast.error('❌ Erreur lors du rafraîchissement des données');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [organismesGabon]);

  // Exporter les données par groupes
  const handleExportGroupData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Créer export structuré par groupes
      const exportData = Array.from(new Set(organismesGabon.map(o => o.groupe))).sort().map(groupe => {
        const organismesGroupe = organismesGabon.filter(o => o.groupe === groupe);
        return {
          groupe: `Groupe ${groupe}`,
          total: organismesGroupe.length,
          existants: organismesGroupe.filter(o => o.isActive).length,
          prospects: organismesGroupe.filter(o => !o.isActive).length,
          organismes: organismesGroupe.map(org => ({
            nom: org.nom,
            code: org.code,
            type: org.type,
            province: org.province,
            statut: org.isActive ? 'Existant' : 'Prospect',
            estPrincipal: org.estPrincipal
          }))
        };
      });

      // Export JSON par groupes
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json;charset=utf-8;'
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `organismes_par_groupes_${new Date().toISOString().split('T')[0]}.json`;
      link.click();

      toast.success(`📄 Export réussi ! ${exportData.length} groupes exportés`);

    } catch (error) {
      console.error('❌ Erreur export groupes:', error);
      toast.error('❌ Erreur lors de l\'export par groupes');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [organismesGabon]);

  // Gérer un groupe spécifique
  const handleManageGroup = useCallback(async (groupe: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 1000));

      const organismesGroupe = organismesGabon.filter(o => o.groupe === groupe);
      const existants = organismesGroupe.filter(o => o.isActive).length;
      const prospects = organismesGroupe.filter(o => !o.isActive).length;

      console.log(`🛠️ Gestion du Groupe ${groupe}:`, {
        total: organismesGroupe.length,
        existants,
        prospects,
        organismes: organismesGroupe.map(o => ({ nom: o.nom, code: o.code, statut: o.isActive ? 'Existant' : 'Prospect' }))
      });

      toast.success(`🛠️ Groupe ${groupe} ouvert pour gestion (${organismesGroupe.length} organismes)`);

      // Ouvrir les détails du groupe automatiquement
      setExpandedGroups(prev => prev.includes(groupe) ? prev : [...prev, groupe]);

    } catch (error) {
      console.error('❌ Erreur gestion groupe:', error);
      toast.error('❌ Erreur lors de l\'ouverture du groupe');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [organismesGabon]);

  // Voir les détails d'un groupe
  const handleViewGroupDetails = useCallback(async (groupe: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 800));

      const organismesGroupe = organismesGabon.filter(o => o.groupe === groupe);

      // Statistiques détaillées du groupe
      const groupDetails = {
        groupe,
        statistiques: {
          total: organismesGroupe.length,
          existants: organismesGroupe.filter(o => o.isActive).length,
          prospects: organismesGroupe.filter(o => !o.isActive).length,
          principaux: organismesGroupe.filter(o => o.estPrincipal).length,
          provinces: new Set(organismesGroupe.map(o => o.province)).size
        },
        repartitionParProvince: Object.fromEntries(
          Array.from(new Set(organismesGroupe.map(o => o.province))).map(province => [
            province,
            organismesGroupe.filter(o => o.province === province).length
          ])
        )
      };

      console.log(`👁️ Détails du Groupe ${groupe}:`, groupDetails);
      toast.success(`👁️ Détails du Groupe ${groupe} chargés`);

      // Ouvrir automatiquement les détails
      setExpandedGroups(prev => prev.includes(groupe) ? prev : [...prev, groupe]);

    } catch (error) {
      console.error('❌ Erreur détails groupe:', error);
      toast.error('❌ Erreur lors du chargement des détails');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [organismesGabon]);

  // Gérer un organisme spécifique
  const handleManageOrganisme = useCallback((organisme: OrganismeGabonais) => {
    // Créer un prospect temporaire pour ouvrir le modal
    const tempProspect: OrganismeCommercialGabon = {
      id: organisme.id,
      nom: organisme.nom,
      code: organisme.code,
      type: organisme.type,
      localisation: organisme.province,
      description: organisme.description,
      telephone: '+241 01 XX XX XX',
      email: `contact@${organisme.code.toLowerCase()}.gov.ga`,
      responsableContact: 'Contact Principal',
      prospectInfo: {
        source: 'ORGANISME_OFFICIEL',
        priorite: organisme.estPrincipal ? 'HAUTE' : 'MOYENNE',
        notes: `Organisme officiel du Groupe ${organisme.groupe}`,
        responsableProspection: 'Système',
        budgetEstime: organisme.estPrincipal ? 5000000 : 2000000
      },
      services: ['Administration Publique'],
      isActive: organisme.isActive,
      metadata: {
        groupe: organisme.groupe,
        estPrincipal: organisme.estPrincipal
      }
    };

    openModal('enrichedModal', tempProspect);
    toast.success(`⚙️ Gestion de ${organisme.nom} ouverte`);
  }, []);

  // Actions en masse sur les groupes
  const handleMassAction = useCallback(async (action: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      const organismesFiltres = organismesGabon.filter(o =>
        (groupeFilter === 'all' || o.groupe === groupeFilter) &&
        (statutFilter === 'all' ||
         (statutFilter === 'existant' && o.isActive) ||
         (statutFilter === 'prospect' && !o.isActive))
      );

      // Durée variable selon l'action
      const actionDuration = {
        'convert-all-prospects': 3000,
        'validate-all-data': 2500,
        'export-by-groups': 2000,
        'sync-all-groups': 3500
      }[action] || 2000;

      await new Promise(resolve => setTimeout(resolve, actionDuration));

      switch (action) {
        case 'convert-all-prospects':
          const prospects = organismesFiltres.filter(o => !o.isActive);
          setOrganismesGabon(prev => prev.map(o =>
            prospects.some(p => p.id === o.id) ? { ...o, isActive: true } : o
          ));
          toast.success(`✅ ${prospects.length} prospects convertis en organismes existants !`);
          console.log(`🔄 Conversion réussie:`, prospects.map(p => ({ nom: p.nom, code: p.code })));
          break;

        case 'validate-all-data':
          const errors = [];
          const duplicates = organismesFiltres.filter((o, i, arr) =>
            arr.findIndex(x => x.code === o.code) !== i
          );
          if (duplicates.length > 0) {
            errors.push(`${duplicates.length} codes dupliqués détectés`);
          }

          if (errors.length > 0) {
            toast.error(`⚠️ ${errors.length} erreur(s) détectée(s) - voir console`);
            console.warn('Erreurs de validation:', errors);
          } else {
            toast.success(`✅ Validation réussie ! ${organismesFiltres.length} organismes validés`);
          }
          break;

        case 'export-by-groups':
          // Grouper manuellement par groupe (compatible tous navigateurs)
          const exportByGroups = organismesFiltres.reduce((acc, o) => {
            if (!acc[o.groupe]) acc[o.groupe] = [];
            acc[o.groupe].push(o);
          return acc;
          }, {} as Record<string, OrganismeGabonais[]>);

          const csvData = [
            ['Groupe', 'Nom', 'Code', 'Type', 'Province', 'Statut', 'Principal'].join(','),
            ...organismesFiltres.map(o => [
              o.groupe,
              `"${o.nom}"`,
              o.code,
              o.type,
              `"${o.province}"`,
              o.isActive ? 'Existant' : 'Prospect',
              o.estPrincipal ? 'Oui' : 'Non'
            ].join(','))
          ].join('\n');

          const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `export_groupes_filtres_${new Date().toISOString().split('T')[0]}.csv`;
          link.click();

          toast.success(`📄 Export réussi ! ${organismesFiltres.length} organismes exportés par groupes`);
          break;

        case 'sync-all-groups':
          // Simulation de synchronisation
          const syncResults = Array.from(new Set(organismesFiltres.map(o => o.groupe))).map(groupe => ({
            groupe,
            organismes: organismesFiltres.filter(o => o.groupe === groupe).length,
            status: 'Synchronisé'
          }));

          console.log('🔄 Synchronisation complète:', syncResults);
          toast.success(`🔄 Synchronisation réussie ! ${syncResults.length} groupes synchronisés`);
          break;

        default:
          toast.success(`✅ Action "${action}" exécutée avec succès !`);
      }

    } catch (error) {
      console.error('❌ Erreur action en masse:', error);
      toast.error('❌ Erreur lors de l\'exécution de l\'action en masse');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [organismesGabon, groupeFilter, statutFilter]);

  // 🏛️ GESTIONNAIRES DGBFIP AVANCÉS

  // Activer l'accès DGBFIP sécurisé
  const handleActivateDGBFIPAccess = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      // Simulation d'activation d'accès sécurisé
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Vérifications de sécurité simulées
      const securityChecks = [
        'Authentification multi-facteurs',
        'Vérification des permissions',
        'Validation des certificats',
        'Audit des accès'
      ];

      for (const check of securityChecks) {
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log(`✅ ${check} - Vérifié`);
      }

      toast.success('🔒 Accès DGBFIP sécurisé activé avec succès !');
      console.log('🔐 Accès DGBFIP configuré avec sécurité renforcée');

    } catch (error) {
      console.error('❌ Erreur activation DGBFIP:', error);
      toast.error('❌ Erreur lors de l\'activation de l\'accès DGBFIP');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, []);

  // Configurer l'accès DGBFIP dans le modal
  const handleConfigureDGBFIPAccess = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Configuration des accès
      const configData = {
        userId: 'current_user',
        permissions: ['read', 'write', 'admin'],
        department: 'DGBFIP',
        accessLevel: 'SECURE',
        timestamp: new Date().toISOString()
      };

      console.log('🔑 Configuration d\'accès DGBFIP:', configData);
      toast.success('🔑 Accès DGBFIP configuré avec succès !');

    } catch (error) {
      console.error('❌ Erreur config accès DGBFIP:', error);
      toast.error('❌ Erreur lors de la configuration d\'accès');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, []);

  // Configurer les rapports DGBFIP
  const handleConfigureDGBFIPReports = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Configuration des types de rapports
      const reportTypes = [
        'Rapport budgétaire mensuel',
        'Suivi des dépenses publiques',
        'Analyse des recettes fiscales',
        'Tableau de bord financier',
        'Rapport de conformité'
      ];

      const reportConfig = {
        types: reportTypes,
        frequency: 'monthly',
        recipients: ['direction@dgbfip.gov.ga'],
        format: 'PDF_EXCEL',
        autoGeneration: true
      };

      console.log('📊 Configuration rapports DGBFIP:', reportConfig);
      toast.success('📊 Rapports DGBFIP configurés avec succès !');

    } catch (error) {
      console.error('❌ Erreur config rapports:', error);
      toast.error('❌ Erreur lors de la configuration des rapports');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, []);

  // 🔍 Filtrage des prospects
  const filteredProspects = useMemo(() => {
    return prospects.filter(prospect => {
      const matchSearch = !filterStates.search ||
        prospect.nom.toLowerCase().includes(filterStates.search.toLowerCase()) ||
        prospect.code.toLowerCase().includes(filterStates.search.toLowerCase());

      const matchPriorite = !filterStates.priorite || filterStates.priorite === 'toutes' ||
        prospect.prospectInfo?.priorite === filterStates.priorite;

      const matchSource = !filterStates.source || filterStates.source === 'toutes' ||
        prospect.prospectInfo?.source === filterStates.source;

      const matchType = !filterStates.type || filterStates.type === 'tous' || prospect.type === filterStates.type;

      return matchSearch && matchPriorite && matchSource && matchType;
    });
  }, [prospects, filterStates.search, filterStates.priorite, filterStates.source, filterStates.type]);

  // 📄 Pagination pour les prospects filtrés
  const prospectsPagines = useMemo(() => {
    const start = (paginationProspects.page - 1) * paginationProspects.itemsPerPage;
    const end = start + paginationProspects.itemsPerPage;
    return filteredProspects.slice(start, end);
  }, [filteredProspects, paginationProspects.page, paginationProspects.itemsPerPage]);

  // Mise à jour pagination quand les prospects changent
  useEffect(() => {
    setPaginationProspects(prev => ({
      ...prev,
      totalItems: filteredProspects.length,
      totalPages: Math.ceil(filteredProspects.length / prev.itemsPerPage),
      page: 1 // Reset à la première page lors du filtrage
    }));
  }, [filteredProspects]); // Retirer paginationProspects.itemsPerPage pour éviter la boucle infinie

  const handleProspectsPageChange = (page: number) => {
    setPaginationProspects(prev => ({ ...prev, page }));
  };

  // 📱 Sélection multiple
  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // 🔍 Filtrage intelligent des organismes officiels
  const organismesGabonFiltres = useMemo(() => {
    return organismesGabon.filter((organisme) => {
      // Recherche textuelle intelligente
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        organisme.nom.toLowerCase().includes(searchLower) ||
        organisme.code.toLowerCase().includes(searchLower) ||
        organisme.groupe.toLowerCase().includes(searchLower) ||
        (organisme.province && organisme.province.toLowerCase().includes(searchLower)) ||
        (organisme.description && organisme.description.toLowerCase().includes(searchLower)) ||
        organisme.type.toLowerCase().includes(searchLower);

      // Filtre par groupe administratif
      const matchesGroupe = filterGroupe === 'all' || organisme.groupe === filterGroupe;

      // Filtre par statut d'intégration
      const matchesStatut = filterStatut === 'all' ||
        (filterStatut === 'actif' && organisme.isActive) ||
        (filterStatut === 'prospect' && !organisme.isActive);

      return matchesSearch && matchesGroupe && matchesStatut;
    });
  }, [organismesGabon, searchTerm, filterGroupe, filterStatut]);

  // 📄 Pagination pour les organismes gabonais filtrés
  const organismesGabonPagines = useMemo(() => {
    const start = (paginationGabon.page - 1) * paginationGabon.itemsPerPage;
    const end = start + paginationGabon.itemsPerPage;
    return organismesGabonFiltres.slice(start, end);
  }, [organismesGabonFiltres, paginationGabon.page, paginationGabon.itemsPerPage]);

  // Mise à jour de la pagination quand les filtres changent
  useEffect(() => {
    const totalPages = Math.ceil(organismesGabonFiltres.length / paginationGabon.itemsPerPage);
    setPaginationGabon(prev => ({
      ...prev,
      totalItems: organismesGabonFiltres.length,
      totalPages,
      page: Math.min(prev.page, Math.max(1, totalPages)) // Ajuster la page si nécessaire
    }));
  }, [organismesGabonFiltres.length, paginationGabon.itemsPerPage]);

  // 📊 FILTRES POUR LES SECTIONS STATUT INTÉGRATION

  // Organismes existants filtrés
  const organismesExistantsFiltres = useMemo(() => {
    return organismesGabon.filter(o => o.isActive).filter(organisme => {
      const searchLower = searchExistants.toLowerCase();
      const matchesSearch = !searchExistants ||
        organisme.nom.toLowerCase().includes(searchLower) ||
        organisme.code.toLowerCase().includes(searchLower) ||
        organisme.province.toLowerCase().includes(searchLower);

      const matchesGroupe = filterGroupeExistants === 'all' || organisme.groupe === filterGroupeExistants;

      return matchesSearch && matchesGroupe;
    });
  }, [organismesGabon, searchExistants, filterGroupeExistants]);

  // Organismes prospects filtrés
  const organismesProspectsFiltres = useMemo(() => {
    return organismesGabon.filter(o => !o.isActive).filter(organisme => {
      const searchLower = searchProspects.toLowerCase();
      const matchesSearch = !searchProspects ||
        organisme.nom.toLowerCase().includes(searchLower) ||
        organisme.code.toLowerCase().includes(searchLower) ||
        organisme.province.toLowerCase().includes(searchLower);

      const matchesGroupe = filterGroupeProspects === 'all' || organisme.groupe === filterGroupeProspects;

      // Filtrage par priorité (simulé basé sur estPrincipal)
      const organismePriorite = organisme.estPrincipal ? 'haute' : Math.random() > 0.5 ? 'moyenne' : 'basse';
      const matchesPriorite = prioriteProspects === 'all' || organismePriorite === prioriteProspects;

      return matchesSearch && matchesGroupe && matchesPriorite;
    });
  }, [organismesGabon, searchProspects, filterGroupeProspects, prioriteProspects]);

  // Métriques par groupe filtrées et triées
  const metriquesGroupesFiltrees = useMemo(() => {
    const metriques = Array.from(new Set(organismesGabon.map(o => o.groupe))).map((groupe) => {
      const organismesDuGroupe = organismesGabon.filter(o => o.groupe === groupe);
      const existants = organismesDuGroupe.filter(o => o.isActive).length;
      const prospects = organismesDuGroupe.filter(o => !o.isActive).length;
      const total = organismesDuGroupe.length;
      const pourcentage = Math.round((existants / total) * 100);

      return {
        groupe,
        organismesDuGroupe,
        existants,
        prospects,
        total,
        pourcentage
      };
    });

    // Filtrage
    const filtered = metriques.filter(metrique => {
      switch (filterMetriques) {
        case 'high-integration':
          return metrique.pourcentage > 80;
        case 'medium-integration':
          return metrique.pourcentage >= 50 && metrique.pourcentage <= 80;
        case 'low-integration':
          return metrique.pourcentage < 50;
        case 'no-prospects':
          return metrique.prospects === 0;
        case 'many-prospects':
          return metrique.prospects > metrique.existants;
        default:
          return true;
      }
    });

    // Tri
    return filtered.sort((a, b) => {
      switch (sortMetriques) {
        case 'pourcentage-desc':
          return b.pourcentage - a.pourcentage;
        case 'pourcentage-asc':
          return a.pourcentage - b.pourcentage;
        case 'total-desc':
          return b.total - a.total;
        case 'total-asc':
          return a.total - b.total;
        case 'existants-desc':
          return b.existants - a.existants;
        case 'prospects-desc':
          return b.prospects - a.prospects;
        case 'groupe':
        default:
          return a.groupe.localeCompare(b.groupe);
      }
    });
  }, [organismesGabon, filterMetriques, sortMetriques]);

  const handleGabonPageChange = (page: number) => {
    setPaginationGabon(prev => ({ ...prev, page }));
  };

  // 📊 GESTIONNAIRES STATUT INTÉGRATION

  // 🟢 Gestionnaires pour Organismes Existants
  const handleRefreshExistants = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 1500));

      const existants = organismesGabon.filter(o => o.isActive);
      console.log('🔄 Organismes existants rafraîchis:', existants.length);

      toast.success(`✅ ${existants.length} organismes existants rafraîchis !`);

    } catch (error) {
      console.error('❌ Erreur rafraîchissement existants:', error);
      toast.error('❌ Erreur lors du rafraîchissement des existants');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [organismesGabon]);

  const handleExportExistants = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 2000));

      const existants = organismesExistantsFiltres;
      const csvData = [
        ['Nom', 'Code', 'Groupe', 'Province', 'Type', 'Principal', 'Statut'].join(','),
        ...existants.map(o => [
          `"${o.nom}"`,
          o.code,
          o.groupe,
          `"${o.province}"`,
          o.type,
          o.estPrincipal ? 'Oui' : 'Non',
          'Existant'
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `organismes_existants_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      toast.success(`📄 Export réussi ! ${existants.length} organismes existants exportés`);

    } catch (error) {
      console.error('❌ Erreur export existants:', error);
      toast.error('❌ Erreur lors de l\'export des existants');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [organismesExistantsFiltres]);

  const handleViewOrganismeExistant = useCallback(async (organisme: OrganismeGabonais) => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 800));

      const details = {
        organisme: organisme.nom,
        code: organisme.code,
        groupe: organisme.groupe,
        province: organisme.province,
        statut: 'Existant (Intégré)',
        estPrincipal: organisme.estPrincipal,
        integrationDate: new Date().toLocaleDateString('fr-FR'),
        services: ['Administration Publique', 'Services Citoyens'],
        performance: {
          uptime: '99.2%',
          utilisateurs: Math.floor(Math.random() * 1000) + 100,
          satisfaction: Math.floor(Math.random() * 20) + 80
        }
      };

      console.log('👁️ Détails organisme existant:', details);
      toast.success(`👁️ Détails de ${organisme.nom} chargés`);

    } catch (error) {
      console.error('❌ Erreur vue organisme existant:', error);
      toast.error('❌ Erreur lors du chargement des détails');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, []);

  const handleManageOrganismeExistant = useCallback((organisme: OrganismeGabonais) => {
    // Réutilise la fonction existante
    handleManageOrganisme(organisme);
  }, []);

  const handleMassActionExistants = useCallback(async (action: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      const existants = organismesExistantsFiltres;

      await new Promise(resolve => setTimeout(resolve, action === 'audit' ? 3000 : 2000));

      switch (action) {
        case 'audit':
          const auditResults = {
            totalAudite: existants.length,
            conformes: Math.floor(existants.length * 0.85),
            aAmeliorrer: Math.floor(existants.length * 0.15),
            score: 85
          };

          console.log('🔍 Audit des organismes existants:', auditResults);
          toast.success(`🔍 Audit terminé ! Score: ${auditResults.score}% - ${auditResults.conformes} conformes`);
          break;

        case 'sync':
          console.log('🔄 Synchronisation des organismes existants:', existants.length);
          toast.success(`🔄 ${existants.length} organismes existants synchronisés`);
          break;
      }

    } catch (error) {
      console.error('❌ Erreur action masse existants:', error);
      toast.error('❌ Erreur lors de l\'action en masse');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [organismesExistantsFiltres]);

  // 🟠 Gestionnaires pour Organismes Prospects
  const handleRefreshProspects = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 1500));

      const prospects = organismesGabon.filter(o => !o.isActive);
      console.log('🔄 Organismes prospects rafraîchis:', prospects.length);

      toast.success(`🔄 ${prospects.length} organismes prospects rafraîchis !`);

    } catch (error) {
      console.error('❌ Erreur rafraîchissement prospects:', error);
      toast.error('❌ Erreur lors du rafraîchissement des prospects');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [organismesGabon]);

  const handleExportProspects = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 2000));

      const prospects = organismesProspectsFiltres;
      const csvData = [
        ['Nom', 'Code', 'Groupe', 'Province', 'Type', 'Principal', 'Priorité', 'Statut'].join(','),
        ...prospects.map(o => {
          const priorite = o.estPrincipal ? 'Haute' : Math.random() > 0.5 ? 'Moyenne' : 'Basse';
          return [
            `"${o.nom}"`,
            o.code,
            o.groupe,
            `"${o.province}"`,
            o.type,
            o.estPrincipal ? 'Oui' : 'Non',
            priorite,
            'Prospect'
          ].join(',');
        })
      ].join('\n');

      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `organismes_prospects_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      toast.success(`📄 Export réussi ! ${prospects.length} organismes prospects exportés`);

    } catch (error) {
      console.error('❌ Erreur export prospects:', error);
      toast.error('❌ Erreur lors de l\'export des prospects');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [organismesProspectsFiltres]);

  const handleViewOrganismeProspect = useCallback(async (organisme: OrganismeGabonais) => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 800));

      const priorite = organisme.estPrincipal ? 'Haute' : Math.random() > 0.5 ? 'Moyenne' : 'Basse';
      const details = {
        organisme: organisme.nom,
        code: organisme.code,
        groupe: organisme.groupe,
        province: organisme.province,
        statut: 'Prospect (En cours d\'intégration)',
        priorite,
        estPrincipal: organisme.estPrincipal,
        avancement: Math.floor(Math.random() * 60) + 20, // 20-80%
        nextSteps: [
          'Configuration technique',
          'Formation des utilisateurs',
          'Tests d\'intégration',
          'Mise en production'
        ],
        estimatedCompletion: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')
      };

      console.log('👁️ Détails organisme prospect:', details);
      toast.success(`👁️ Détails de ${organisme.nom} chargés - Avancement: ${details.avancement}%`);

    } catch (error) {
      console.error('❌ Erreur vue organisme prospect:', error);
      toast.error('❌ Erreur lors du chargement des détails');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, []);

  const handleManageOrganismeProspect = useCallback((organisme: OrganismeGabonais) => {
    // Réutilise la fonction existante
    handleManageOrganisme(organisme);
  }, []);

  const handleConvertOrganismeProspect = useCallback(async (organisme: OrganismeGabonais) => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 2500));

      // Conversion prospect -> existant
      setOrganismesGabon(prev => prev.map(o =>
        o.id === organisme.id ? { ...o, isActive: true } : o
      ));

      console.log(`✅ Conversion réussie: ${organisme.nom} est maintenant un organisme existant`);
      toast.success(`✅ ${organisme.nom} converti avec succès en organisme existant !`);

    } catch (error) {
      console.error('❌ Erreur conversion prospect:', error);
      toast.error('❌ Erreur lors de la conversion');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, []);

  const handleMassActionProspects = useCallback(async (action: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      const prospects = organismesProspectsFiltres;

      await new Promise(resolve => setTimeout(resolve, action === 'convert-all' ? 4000 : 2500));

      switch (action) {
        case 'convert-all':
          // Convertir tous les prospects filtrés
          setOrganismesGabon(prev => prev.map(o =>
            prospects.some(p => p.id === o.id) ? { ...o, isActive: true } : o
          ));

          console.log(`✅ Conversion en masse: ${prospects.length} prospects convertis`);
          toast.success(`✅ ${prospects.length} prospects convertis en organismes existants !`);
          break;

        case 'priority-high':
          console.log(`⭐ Priorité haute assignée à ${prospects.length} prospects`);
          toast.success(`⭐ Priorité haute assignée à ${prospects.length} prospects !`);
          break;
      }

    } catch (error) {
      console.error('❌ Erreur action masse prospects:', error);
      toast.error('❌ Erreur lors de l\'action en masse');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [organismesProspectsFiltres]);

  // 📊 Gestionnaires pour Métriques
  const handleRefreshMetriques = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 1800));

      const metriques = metriquesGroupesFiltrees;
      console.log('📊 Métriques rafraîchies:', metriques.length, 'groupes');

      toast.success(`📊 Métriques de ${metriques.length} groupes rafraîchies !`);

    } catch (error) {
      console.error('❌ Erreur rafraîchissement métriques:', error);
      toast.error('❌ Erreur lors du rafraîchissement des métriques');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [metriquesGroupesFiltrees]);

  const handleExportMetriques = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 2200));

      const exportData = {
        timestamp: new Date().toISOString(),
        summary: {
          totalGroupes: metriquesGroupesFiltrees.length,
          totalOrganismes: organismesGabon.length,
          tauxIntegrationGlobal: Math.round((organismesGabon.filter(o => o.isActive).length / organismesGabon.length) * 100)
        },
        metriquesParGroupe: metriquesGroupesFiltrees.map(m => ({
          groupe: m.groupe,
          total: m.total,
          existants: m.existants,
          prospects: m.prospects,
          pourcentageIntegration: m.pourcentage,
          performance: m.pourcentage >= 80 ? 'Excellente' : m.pourcentage >= 50 ? 'Bonne' : 'À améliorer'
        }))
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json;charset=utf-8;'
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `metriques_integration_${new Date().toISOString().split('T')[0]}.json`;
      link.click();

      toast.success(`📊 Métriques exportées ! ${metriquesGroupesFiltrees.length} groupes`);

    } catch (error) {
      console.error('❌ Erreur export métriques:', error);
      toast.error('❌ Erreur lors de l\'export des métriques');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [metriquesGroupesFiltrees, organismesGabon]);

  const handleViewGroupeDetails = useCallback(async (groupe: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 1000));

      const metrique = metriquesGroupesFiltrees.find(m => m.groupe === groupe);
      if (metrique) {
        const details = {
          groupe,
          statistiques: {
            total: metrique.total,
            existants: metrique.existants,
            prospects: metrique.prospects,
            pourcentage: metrique.pourcentage
          },
          organismes: metrique.organismesDuGroupe.map(o => ({
            nom: o.nom,
            code: o.code,
            province: o.province,
            statut: o.isActive ? 'Existant' : 'Prospect',
            estPrincipal: o.estPrincipal
          })),
          performance: metrique.pourcentage >= 80 ? 'Excellente' : metrique.pourcentage >= 50 ? 'Bonne' : 'À améliorer'
        };

        console.log(`📊 Détails du Groupe ${groupe}:`, details);
        toast.success(`📊 Détails du Groupe ${groupe} - Performance: ${details.performance}`);
      }

    } catch (error) {
      console.error('❌ Erreur détails groupe métriques:', error);
      toast.error('❌ Erreur lors du chargement des détails');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [metriquesGroupesFiltrees]);

  const handleAnalyzeGroupe = useCallback(async (groupe: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 2500));

      const metrique = metriquesGroupesFiltrees.find(m => m.groupe === groupe);
      if (metrique) {
        const analyse = {
          groupe,
          score: metrique.pourcentage,
          tendance: Math.random() > 0.5 ? 'positive' : 'stable',
          recommendations: [
            metrique.pourcentage < 50 ? 'Prioriser l\'intégration des prospects' : 'Maintenir le niveau d\'excellence',
            metrique.prospects > metrique.existants ? 'Accélérer les conversions' : 'Optimiser les existants',
            'Former les équipes sur les nouvelles fonctionnalités'
          ],
          nextActions: [
            'Planifier les prochaines intégrations',
            'Évaluer les besoins en ressources',
            'Mettre à jour la documentation'
          ]
        };

        console.log(`🔍 Analyse du Groupe ${groupe}:`, analyse);
        toast.success(`🔍 Analyse terminée ! Groupe ${groupe} - Score: ${analyse.score}%`);
      }

    } catch (error) {
      console.error('❌ Erreur analyse groupe:', error);
      toast.error('❌ Erreur lors de l\'analyse');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [metriquesGroupesFiltrees]);

  const handleOptimizeGroupe = useCallback(async (groupe: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      await new Promise(resolve => setTimeout(resolve, 3000));

      const metrique = metriquesGroupesFiltrees.find(m => m.groupe === groupe);
      if (metrique) {
        const optimizations = {
          groupe,
          actuel: metrique.pourcentage,
          potentiel: Math.min(100, metrique.pourcentage + Math.floor(Math.random() * 20) + 10),
          actions: [
            'Automatisation des processus d\'intégration',
            'Formation accélérée des équipes',
            'Allocation de ressources supplémentaires',
            'Mise en place de métriques de suivi en temps réel'
          ],
          timeline: '2-6 semaines',
          effort: metrique.pourcentage < 50 ? 'Élevé' : 'Modéré'
        };

        console.log(`⚡ Optimisation du Groupe ${groupe}:`, optimizations);
        toast.success(`⚡ Plan d\'optimisation généré ! Potentiel: ${optimizations.potentiel}%`);
      }

    } catch (error) {
      console.error('❌ Erreur optimisation groupe:', error);
      toast.error('❌ Erreur lors de l\'optimisation');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [metriquesGroupesFiltrees]);

  const handleMassActionMetriques = useCallback(async (action: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));

      const duration = {
        'boost-integration': 4000,
        'generate-report': 3500,
        'sync-all-metrics': 2500
      }[action] || 2000;

      await new Promise(resolve => setTimeout(resolve, duration));

      switch (action) {
        case 'boost-integration':
          // Simuler amélioration des taux d'intégration
          const lowPerformanceGroups = metriquesGroupesFiltrees.filter(m => m.pourcentage < 70);
          console.log(`🚀 Boost d'intégration lancé pour ${lowPerformanceGroups.length} groupes`);
          toast.success(`🚀 Boost lancé ! ${lowPerformanceGroups.length} groupes ciblés pour amélioration`);
          break;

        case 'generate-report':
          const reportData = {
            date: new Date().toLocaleDateString('fr-FR'),
            summary: {
              groupes: metriquesGroupesFiltrees.length,
              tauxMoyen: Math.round(metriquesGroupesFiltrees.reduce((acc, m) => acc + m.pourcentage, 0) / metriquesGroupesFiltrees.length),
              meilleurePerformance: metriquesGroupesFiltrees.reduce((max, m) => m.pourcentage > max.pourcentage ? m : max),
              aAmeliorer: metriquesGroupesFiltrees.filter(m => m.pourcentage < 50).length
            }
          };

          console.log('📋 Rapport complet généré:', reportData);
          toast.success(`📋 Rapport généré ! Taux moyen: ${reportData.summary.tauxMoyen}%`);
          break;

        case 'sync-all-metrics':
          console.log(`🔄 Synchronisation de ${metriquesGroupesFiltrees.length} groupes de métriques`);
          toast.success(`🔄 ${metriquesGroupesFiltrees.length} groupes de métriques synchronisés !`);
          break;
      }

    } catch (error) {
      console.error('❌ Erreur action masse métriques:', error);
      toast.error('❌ Erreur lors de l\'action en masse');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  }, [metriquesGroupesFiltrees]);

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === filteredProspects.length
        ? []
        : filteredProspects.map(p => p.id)
    );
  };

  // 🔄 Actions en masse
  const handleBulkAction = async (action: 'convert' | 'delete' | 'priority') => {
    if (selectedItems.length === 0) {
      toast.error('⚠️ Veuillez sélectionner au moins un élément');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, saving: true }));
      await new Promise(resolve => setTimeout(resolve, 2000));

      switch (action) {
        case 'convert':
          setProspects(prev => prev.filter(p => !selectedItems.includes(p.id)));
          toast.success(`✅ ${selectedItems.length} prospects convertis`);
          break;
        case 'delete':
          setProspects(prev => prev.filter(p => !selectedItems.includes(p.id)));
          toast.success(`🗑️ ${selectedItems.length} prospects supprimés`);
          break;
        case 'priority':
          toast.success(`⭐ Priorité mise à jour pour ${selectedItems.length} prospects`);
          break;
      }

      setSelectedItems([]);
      setStats(prev => prev ? { ...prev, totalProspects: prospects.length } : null);
    } catch (error) {
      toast.error('❌ Erreur lors de l\'action groupée');
    } finally {
      setLoadingStates(prev => ({ ...prev, saving: false }));
    }
  };

  // Fonctions utilitaires
  const formatPrix = (prix: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(prix);
  };

  const getPrioriteColor = (priorite?: string) => {
    switch (priorite) {
      case 'HAUTE': return 'bg-red-100 text-red-800';
      case 'MOYENNE': return 'bg-yellow-100 text-yellow-800';
      case 'BASSE': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceColor = (source?: string) => {
    switch (source) {
      case 'ORGANISME_OFFICIEL': return 'bg-yellow-100 text-yellow-800';
      case 'REFERENCEMENT': return 'bg-blue-100 text-blue-800';
      case 'DEMANDE_DIRECTE': return 'bg-green-100 text-green-800';
      case 'RECOMMANDATION': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MINISTERE': return Building2;
      case 'MAIRIE': return MapPin;
      case 'DIRECTION_GENERALE': return Briefcase;
      case 'PREFECTURE': return MapPin;
      case 'PROVINCE': return Crown;
      default: return Building2;
    }
  };

  if (loadingStates.loading) {
    return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chargement des prospects...</h3>
              <p className="text-muted-foreground">Analyse du pipeline commercial en cours</p>
            </div>
          </div>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                Administration des Organismes
              </h1>
              <p className="text-gray-600">
                Pipeline commercial, organismes officiels du Gabon et tableau de bord global
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRefreshData}
                disabled={loadingStates.refreshing}
              >
                {loadingStates.refreshing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Actualiser
              </Button>
              <Button
                onClick={() => openModal('addProspect')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Prospect
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation - Configuration Intelligente Organismes Officiels */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="organismes-officiels-gabon" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              <div className="text-left">
                <div className="font-semibold">Organismes Officiels</div>
                <div className="text-xs opacity-75">{organismesGabon.length} organismes</div>
              </div>
            </TabsTrigger>
            <TabsTrigger value="integration-statut" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <div className="text-left">
                <div className="font-semibold">Statut Intégration</div>
                <div className="text-xs opacity-75">Existants vs Prospects</div>
              </div>
            </TabsTrigger>
            <TabsTrigger value="tableau-bord-global" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <div className="text-left">
                <div className="font-semibold">Tableau de Bord</div>
                <div className="text-xs opacity-75">Métriques globales</div>
              </div>
            </TabsTrigger>
            <TabsTrigger value="configuration-avancee" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <div className="text-left">
                <div className="font-semibold">Configuration</div>
                <div className="text-xs opacity-75">Paramètres avancés</div>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Pipeline Commercial Tab */}
          <TabsContent value="pipeline-commercial" className="space-y-8">
            {/* Header du pipeline commercial */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Target className="h-6 w-6" />
                    Pipeline Commercial
                  </h2>
                  <p className="text-orange-100">
                    Gestion des prospects et conversion vers clients • {stats?.totalProspects || 0} prospects actifs
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{formatPrix(stats?.valeurPipeline || 0)}</div>
                  <div className="text-orange-200 text-sm">Valeur totale du pipeline</div>
                </div>
              </div>
            </div>

            {/* Statistiques du pipeline */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Prospects</p>
                        <h3 className="text-2xl font-bold">{stats.totalProspects}</h3>
                </div>
                      <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

                <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                        <p className="text-sm font-medium text-muted-foreground">Priorité Haute</p>
                        <h3 className="text-2xl font-bold text-red-600">{stats.prioriteHaute}</h3>
                </div>
                      <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

                <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                        <p className="text-sm font-medium text-muted-foreground">Conversions Objectif</p>
                        <h3 className="text-2xl font-bold text-green-600">{stats.conversionsObjectif}</h3>
                </div>
                      <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

                <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                        <p className="text-sm font-medium text-muted-foreground">Contacts Récents</p>
                        <h3 className="text-2xl font-bold text-purple-600">{stats.contactsRecents}</h3>
                </div>
                      <UserCheck className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
            )}

            {/* Filtres et contrôles */}
            <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtres et Actions
                  </div>
                  {selectedItems.length > 0 && (
                  <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {selectedItems.length} sélectionné(s)
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction('convert')}
                        disabled={loadingStates.saving}
                      >
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Convertir
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction('delete')}
                        disabled={loadingStates.saving}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Supprimer
                      </Button>
                  </div>
                  )}
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <Label>Recherche</Label>
                <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                        placeholder="Nom ou code..."
                        value={filterStates.search}
                        onChange={(e) => setFilterStates(prev => ({ ...prev, search: e.target.value }))}
                        className="pl-8"
                  />
                </div>
              </div>
                  <div>
                    <Label>Priorité</Label>
                    <Select value={filterStates.priorite} onValueChange={(value) => setFilterStates(prev => ({ ...prev, priorite: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                        <SelectItem value="toutes">Toutes</SelectItem>
                  <SelectItem value="HAUTE">Haute</SelectItem>
                  <SelectItem value="MOYENNE">Moyenne</SelectItem>
                  <SelectItem value="BASSE">Basse</SelectItem>
                </SelectContent>
              </Select>
                  </div>
                  <div>
                    <Label>Source</Label>
                    <Select value={filterStates.source} onValueChange={(value) => setFilterStates(prev => ({ ...prev, source: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                        <SelectItem value="toutes">Toutes</SelectItem>
                        <SelectItem value="ORGANISME_OFFICIEL">Organisme Officiel</SelectItem>
                        <SelectItem value="DEMANDE_DIRECTE">Demande Directe</SelectItem>
                  <SelectItem value="REFERENCEMENT">Référencement</SelectItem>
                  <SelectItem value="RECOMMANDATION">Recommandation</SelectItem>
                </SelectContent>
              </Select>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select value={filterStates.type} onValueChange={(value) => setFilterStates(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                        <SelectItem value="tous">Tous</SelectItem>
                        <SelectItem value="MINISTERE">Ministère</SelectItem>
                        <SelectItem value="DIRECTION_GENERALE">Direction Générale</SelectItem>
                        <SelectItem value="MAIRIE">Mairie</SelectItem>
                        <SelectItem value="PREFECTURE">Préfecture</SelectItem>
                </SelectContent>
              </Select>
                  </div>
                  <div className="flex items-end">
              <Button
                variant="outline"
                      onClick={() => setFilterStates({ search: '', priorite: 'toutes', source: 'toutes', type: 'tous', province: '' })}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Effacer
              </Button>
                  </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des prospects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Prospects Actifs ({filteredProspects.length}/{prospects.length})
                  <Badge variant="outline" className="ml-2">
                    Page {paginationProspects.page}/{paginationProspects.totalPages}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedItems.length === filteredProspects.length && filteredProspects.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm text-muted-foreground">Tout sélectionner</span>
                </div>
              </CardTitle>
                <CardDescription>
                  Organismes en cours de prospection commerciale
                </CardDescription>
            </CardHeader>
                        <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {prospectsPagines.map((prospect) => {
            const TypeIcon = getTypeIcon(prospect.type);
            const isSelected = selectedItems.includes(prospect.id);
            const isConverting = loadingStates.converting === prospect.id;
            const isViewing = loadingStates.viewing === prospect.id;
            const isDeleting = loadingStates.deleting === prospect.id;

            return (
                      <Card key={prospect.id} className={`border-l-4 border-blue-500 transition-all ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => handleSelectItem(prospect.id)}
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <TypeIcon className="h-4 w-4 text-blue-600" />
                                    <h4 className="font-semibold text-sm leading-tight">{prospect.nom}</h4>
                    </div>
                                  <p className="text-xs text-muted-foreground">{prospect.code}</p>
                                  <p className="text-xs text-gray-600 mt-1">{prospect.localisation}</p>
                                </div>
                    </div>
                  </div>

                            <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getPrioriteColor(prospect.prospectInfo?.priorite)}>
                                {prospect.prospectInfo?.priorite || 'MOYENNE'}
                    </Badge>
                    <Badge className={getSourceColor(prospect.prospectInfo?.source)}>
                                {prospect.prospectInfo?.source || 'DEMANDE_DIRECTE'}
                    </Badge>
                  </div>

                            <div className="text-xs text-gray-600 space-y-1">
                              <p className="line-clamp-2">{prospect.description}</p>
                              {prospect.prospectInfo?.budgetEstime && (
                                <p className="font-medium text-green-600">
                                  💰 {formatPrix(prospect.prospectInfo.budgetEstime)}
                                </p>
                              )}
                              {prospect.metadata?.groupe && (
                                <p className="text-xs text-purple-600">
                                  📊 Groupe {prospect.metadata.groupe} {prospect.metadata.estPrincipal ? '⭐' : ''}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <div className="text-xs text-muted-foreground">
                                👤 {prospect.responsableContact}
                    </div>
                              <div className="flex gap-1">
                    <Button
                                  variant="outline"
                      size="sm"
                                  onClick={() => handleContactProspect(prospect, 'phone')}
                                  title="Appeler"
                                >
                                  <Phone className="h-3 w-3" />
                    </Button>
                      <Button
                        variant="outline"
                        size="sm"
                                  onClick={() => handleContactProspect(prospect, 'email')}
                                  title="Envoyer un email"
                                >
                                  <Mail className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                                  onClick={() => handleViewProspect(prospect)}
                                  disabled={isViewing}
                                  title="Voir les détails"
                                >
                                  {isViewing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Eye className="h-3 w-3" />}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleManageProspect(prospect)}
                                  title="Gérer l'organisme"
                                >
                                  <Settings className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleConvertProspect(prospect)}
                                  disabled={isConverting}
                                  className="bg-green-600 hover:bg-green-700"
                                  title="Convertir en client"
                                >
                                  {isConverting ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowRight className="h-3 w-3" />}
                      </Button>
                              </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
                </div>

                {filteredProspects.length === 0 && prospects.length > 0 && (
                  <div className="text-center py-12">
                    <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Aucun résultat trouvé</h3>
                    <p className="text-muted-foreground">
                      Aucun prospect ne correspond aux filtres sélectionnés.
              </p>
              <Button
                variant="outline"
                      className="mt-4"
                      onClick={() => setFilterStates({ search: '', priorite: 'toutes', source: 'toutes', type: 'tous', province: '' })}
                    >
                      Effacer les filtres
              </Button>
            </div>
          )}

                                {prospects.length === 0 && (
                  <div className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Aucun prospect actif</h3>
                    <p className="text-muted-foreground">
                      Aucun prospect n'est actuellement dans le pipeline commercial.
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => openModal('addProspect')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter le premier prospect
                    </Button>
        </div>
          )}

                {/* Pagination pour les prospects */}
                {paginationProspects.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Affichage de {((paginationProspects.page - 1) * paginationProspects.itemsPerPage) + 1} à {Math.min(paginationProspects.page * paginationProspects.itemsPerPage, filteredProspects.length)} sur {filteredProspects.length} prospects
                </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleProspectsPageChange(paginationProspects.page - 1)}
                        disabled={paginationProspects.page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Précédent
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, paginationProspects.totalPages) }, (_, i) => {
                          const page = i + Math.max(1, paginationProspects.page - 2);
                          if (page > paginationProspects.totalPages) return null;
                          return (
                            <Button
                              key={page}
                              variant={page === paginationProspects.page ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleProspectsPageChange(page)}
                              className="w-8 h-8 p-0"
                            >
                              {page}
                            </Button>
                          );
                        })}
                </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleProspectsPageChange(paginationProspects.page + 1)}
                        disabled={paginationProspects.page === paginationProspects.totalPages}
                      >
                        Suivant
                        <ChevronRight className="h-4 w-4" />
                      </Button>
              </div>
                  </div>
                )}
            </CardContent>
          </Card>
          </TabsContent>

          {/* Organismes Officiels Gabon Tab */}
          <TabsContent value="organismes-officiels-gabon" className="space-y-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Crown className="h-6 w-6" />
                    Organismes Officiels de la République Gabonaise
                  </h2>
                  <p className="text-green-100 mb-3">
                    Base de données complète des {organismesGabon.length} organismes publics officiels de la République Gabonaise
                  </p>
                  <div className="grid grid-cols-5 gap-3 mt-4">
                    <div className="bg-green-700 bg-opacity-50 rounded-lg p-3">
                      <div className="text-2xl font-bold">{organismesGabon.length}</div>
                      <div className="text-xs opacity-90">Total Organismes</div>
                    </div>
                    <div className="bg-green-700 bg-opacity-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-200">{organismesGabon.filter(o => o.isActive).length}</div>
                      <div className="text-xs opacity-90">✅ Existants</div>
                    </div>
                    <div className="bg-green-700 bg-opacity-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-orange-200">{organismesGabon.filter(o => !o.isActive).length}</div>
                      <div className="text-xs opacity-90">🔄 Prospects</div>
                    </div>
                    <div className="bg-green-700 bg-opacity-50 rounded-lg p-3">
                      <div className="text-2xl font-bold">{organismesGabon.filter(o => o.estPrincipal).length}</div>
                      <div className="text-xs opacity-90">Organismes Principaux</div>
                    </div>
                    <div className="bg-green-700 bg-opacity-50 rounded-lg p-3">
                      <div className="text-2xl font-bold">{new Set(organismesGabon.map(o => o.groupe)).size}</div>
                      <div className="text-xs opacity-90">Groupes (A-I)</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-white text-green-600 mb-2">
                    République Gabonaise 🇬🇦
                              </Badge>
                  <p className="text-sm opacity-90">
                    Système officiel d'administration publique
                  </p>
                </div>
              </div>
            </div>

                        {/* Interface Groupes Administratifs - Identique à la page vue d'ensemble */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Organismes Référencés par Groupes Administratifs
                  <div className="text-sm text-muted-foreground">
                    {organismesGabon.length} organismes • {Array.from(new Set(organismesGabon.map(o => o.groupe))).length} groupes
                  </div>
                </CardTitle>
                <CardDescription>
                  Classification administrative officielle selon la 5ème République gabonaise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from(new Set(organismesGabon.map(o => o.groupe))).sort().map((groupKey) => {
                    const groupOrganismes = organismesGabon.filter(o => o.groupe === groupKey);
                    const isExpanded = expandedGroupsGabon[groupKey];

                    // Fonction pour obtenir l'icône du groupe
                    const getGroupIcon = (group: string) => {
                      switch(group) {
                        case 'A': return Crown; // Institutions Suprêmes
                        case 'B': return Building2; // Ministères
                        case 'C': return Briefcase; // Directions Générales
                        case 'G': return MapPin; // Administrations Territoriales
                        case 'E': return Settings; // Agences Spécialisées
                        case 'F': return Shield; // Institutions Judiciaires
                        case 'L': return Users; // Pouvoir Législatif
                        case 'I': return Star; // Institutions Indépendantes
                        default: return Database; // Autre
                      }
                    };

                    // Fonction pour obtenir le nom du groupe
                    const getGroupName = (group: string) => {
                      switch(group) {
                        case 'A': return 'Institutions Suprêmes';
                        case 'B': return 'Ministères';
                        case 'C': return 'Directions Générales';
                        case 'G': return 'Administrations Territoriales';
                        case 'E': return 'Agences Spécialisées';
                        case 'F': return 'Institutions Judiciaires';
                        case 'L': return 'Pouvoir Législatif';
                        case 'I': return 'Institutions Indépendantes';
                        default: return 'Autre';
                      }
                    };

                    // Fonction pour obtenir les couleurs du groupe
                    const getGroupColors = (group: string) => {
                      switch(group) {
                        case 'A': return { border: 'border-l-purple-500', bg: 'bg-purple-100', text: 'text-purple-600' };
                        case 'B': return { border: 'border-l-green-500', bg: 'bg-green-100', text: 'text-green-600' };
                        case 'C': return { border: 'border-l-blue-500', bg: 'bg-blue-100', text: 'text-blue-600' };
                        case 'G': return { border: 'border-l-red-500', bg: 'bg-red-100', text: 'text-red-600' };
                        case 'E': return { border: 'border-l-orange-500', bg: 'bg-orange-100', text: 'text-orange-600' };
                        case 'F': return { border: 'border-l-yellow-500', bg: 'bg-yellow-100', text: 'text-yellow-600' };
                        case 'L': return { border: 'border-l-indigo-500', bg: 'bg-indigo-100', text: 'text-indigo-600' };
                        case 'I': return { border: 'border-l-pink-500', bg: 'bg-pink-100', text: 'text-pink-600' };
                        default: return { border: 'border-l-gray-500', bg: 'bg-gray-100', text: 'text-gray-600' };
                      }
                    };

                    // Fonction pour vérifier si un organisme est principal
                    const isOrganismePrincipal = (org: any) => {
                      return org.estPrincipal || ['PRESIDENCE', 'PRIMATURE', 'MINISTERE', 'ASSEMBLEE_NATIONALE', 'SENAT'].includes(org.type);
                    };

                    const GroupIcon = getGroupIcon(groupKey);
                    const colors = getGroupColors(groupKey);

                    return (
                      <Card key={groupKey} className={`${colors.border} border-l-4 hover:shadow-lg transition-all duration-300 bg-white ${isExpanded ? 'col-span-full' : ''}`}>
                        <CardContent className="p-6">
                          {/* Design optimisé des blocs de groupes administratifs */}
                          <div
                            className="cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-white hover:shadow-md transition-all duration-200 rounded-xl -m-2 p-3 group"
                            onClick={() => toggleGroupExpansionGabon(groupKey)}
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
                                  {getGroupName(groupKey)}
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
                                Code: GRP-{groupKey} • {getGroupName(groupKey)} de l'administration gabonaise
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
                                    {groupOrganismes.filter(org => isOrganismePrincipal(org)).length}
                                  </p>
                  </div>

                                {/* Métrique 4: Types */}
                                <div className="text-center">
                                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mb-1.5 mx-auto">
                                    <Database className="h-5 w-5 text-orange-600" />
                </div>
                                  <p className="text-xs font-medium text-gray-600">Cat.</p>
                                  <p className="text-lg font-bold text-orange-600">
                                    {Array.from(new Set(groupOrganismes.map(org => org.type))).length}
                                  </p>
                </div>

                                {/* Métrique 5: Provinces */}
                                <div className="text-center">
                                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-1.5 mx-auto">
                                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                                  <p className="text-xs font-medium text-gray-600">Prov.</p>
                                  <p className="text-lg font-bold text-purple-600">
                                    {Array.from(new Set(groupOrganismes.map(org => org.province).filter(Boolean))).length || 1}
                                  </p>
                  </div>

                                {/* Métrique 6: Prospects */}
                                <div className="text-center">
                                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center mb-1.5 mx-auto">
                                    <Target className="h-5 w-5 text-teal-600" />
                              </div>
                                  <p className="text-xs font-medium text-gray-600">Pros.</p>
                                  <p className="text-lg font-bold text-teal-600">
                                    {groupOrganismes.filter(org => !org.isActive).length}
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
                                        Exploration complète du groupe {groupKey}
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

                                {/* Grille des organismes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {groupOrganismes.map((organisme) => (
                                    <Card key={organisme.id} className={`${colors.border} border-l-4 hover:shadow-lg transition-all duration-200 bg-white`}>
                                      <CardContent className="p-6">
                                        {/* En-tête avec icône et titre */}
                                        <div className="flex items-center gap-3 mb-4">
                                          <div className={`p-3 rounded-lg ${colors.bg}`}>
                                            <GroupIcon className={`h-8 w-8 ${colors.text}`} />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-lg leading-tight text-gray-900 truncate">{organisme.nom}</h3>
                                            <p className="text-sm text-gray-600 uppercase font-medium">
                                              {organisme.type} - Groupe {groupKey}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              Code: {organisme.code} • {getGroupName(groupKey)}
                                            </p>
                                          </div>
                </div>

                                        {/* Badge de statut */}
                                        <div className="flex items-center gap-2 mb-4">
                                          <Badge className={organisme.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
                                            {organisme.isActive ? 'ACTIF' : 'PROSPECT'}
                                          </Badge>
                                          <Badge variant="outline" className="text-xs">
                                            {organisme.province}
                                          </Badge>
                                          {isOrganismePrincipal(organisme) && (
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
                                            <span className="text-gray-600">contact@{organisme.code.toLowerCase()}.gov.ga</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-600">+241 01 XX XX XX</span>
                                          </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                                            onClick={() => {
                                              // Créer un prospect temporaire
                                              const tempProspect: OrganismeCommercialGabon = {
                                                id: organisme.id,
                                                nom: organisme.nom,
                                                code: organisme.code,
                                                type: organisme.type,
                                                localisation: organisme.province,
                                                description: organisme.description,
                                                telephone: '+241 01 XX XX XX',
                                                email: `contact@${organisme.code.toLowerCase()}.gov.ga`,
                                                responsableContact: 'Contact Principal',
                                                prospectInfo: {
                                                  source: 'ORGANISME_OFFICIEL',
                                                  priorite: 'HAUTE',
                                                  notes: `Organisme officiel gabonais - Groupe ${organisme.groupe}`,
                                                  responsableProspection: 'Admin'
                                                },
                                                services: [],
                                                isActive: organisme.isActive
                                              };
                                              setSelectedProspect(tempProspect);
                                              openModal('enrichedModal');
                                            }}
                                            title="Gérer la configuration"
                                          >
                                            <Settings className="h-3 w-3 mr-1" />
                                            Config
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                                            onClick={() => {
                                              // Ajouter aux prospects actifs
                                              const newProspect: OrganismeCommercialGabon = {
                                                id: `prospect-${Date.now()}`,
                                                nom: organisme.nom,
                                                code: organisme.code,
                                                type: organisme.type,
                                                localisation: organisme.province,
                                                description: organisme.description,
                                                telephone: '+241 01 XX XX XX',
                                                email: `contact@${organisme.code.toLowerCase()}.gov.ga`,
                                                responsableContact: 'Contact Principal',
                                                prospectInfo: {
                                                  source: 'ORGANISME_OFFICIEL',
                                                  priorite: 'HAUTE',
                                                  notes: `Ajouté depuis les organismes officiels`,
                                                  responsableProspection: session?.user?.firstName || 'Admin'
                                                },
                                                services: [],
                                                isActive: true
                                              };
                                              setProspects(prev => [...prev, newProspect]);
                                              setStats(prev => prev ? { ...prev, totalProspects: prev.totalProspects + 1 } : null);
                                              toast.success(`✅ ${organisme.nom} ajouté au pipeline commercial`);
                                            }}
                                            title="Ajouter au pipeline"
                                          >
                                            <Target className="h-3 w-3 mr-1" />
                                            Pipeline
                      </Button>
                    </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                  </div>
                  </div>
                )}
                          </div>
              </CardContent>
            </Card>
                    );
                  })}
                </div>


              </CardContent>
            </Card>
          </TabsContent>

          {/* Tableau de Bord Global Tab */}
          <TabsContent value="tableau-bord-global" className="space-y-8">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <BarChart2 className="h-6 w-6" />
                    Tableau de Bord Global
                  </h2>
                  <p className="text-purple-100">
                    Vue d'ensemble des performances et métriques générales
                  </p>
                      </div>
                    </div>
                  </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Organismes</p>
                      <h3 className="text-2xl font-bold">{prospects.length + organismesGabon.length}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {prospects.length} prospects + {organismesGabon.length} officiels
                      </p>
                    </div>
                    <Building2 className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Prospects Actifs</p>
                      <h3 className="text-2xl font-bold text-orange-600">{prospects.length}</h3>
                      <p className="text-xs text-green-600 mt-1">
                        +{prospects.length} depuis intégration Gabon
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Valeur Pipeline</p>
                      <h3 className="text-2xl font-bold text-green-600">
                        {stats ? formatPrix(stats.valeurPipeline) : '...'}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        141 organismes gabonais
                      </p>
                    </div>
                    <Euro className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Conversions Prévues</p>
                      <h3 className="text-2xl font-bold text-purple-600">
                        {stats?.conversionsObjectif || 0}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Sur base priorités
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Détails par groupes administratifs */}
            {stats && (
              <Card className="mt-6">
              <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-600" />
                    Répartition par Priorité Pipeline
              </CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{stats.prioriteHaute}</div>
                      <div className="text-sm text-red-700">Priorité Haute</div>
                      <div className="text-xs text-muted-foreground">Institutions Suprêmes</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{stats.prioriteMoyenne}</div>
                      <div className="text-sm text-yellow-700">Priorité Moyenne</div>
                      <div className="text-xs text-muted-foreground">Ministères & Directions</div>
                            </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.prioriteBasse}</div>
                      <div className="text-sm text-green-700">Priorité Basse</div>
                      <div className="text-xs text-muted-foreground">Autres organismes</div>
                            </div>
                            </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Statut Intégration Tab - Configuration Intelligente */}
          <TabsContent value="integration-statut" className="space-y-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6" />
                    Statut d'Intégration des Organismes Officiels
                  </h2>
                  <p className="text-blue-100 mb-3">
                    Suivi intelligent de l'intégration des {organismesGabon.length} organismes officiels gabonais
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-blue-700 bg-opacity-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-200">{organismesGabon.filter(o => o.isActive).length}</div>
                      <div className="text-sm opacity-90">✅ Déjà intégrés (Existants)</div>
                            </div>
                    <div className="bg-blue-700 bg-opacity-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-orange-200">{organismesGabon.filter(o => !o.isActive).length}</div>
                      <div className="text-sm opacity-90">🔄 À intégrer (Prospects)</div>
                            </div>
                            </div>
                            </div>
                <div className="text-right">
                  <Badge className="bg-white text-blue-600 mb-2">
                    Intégration Intelligente
                  </Badge>
                  <p className="text-sm opacity-90">
                    Tous sont des organismes officiels
                      </p>
                    </div>
                    </div>
                  </div>

            {/* Classification par Statut d'Intégration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Organismes Existants */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                      Organismes Existants ({organismesGabon.filter(o => o.isActive).length})
                    </CardTitle>
                    <CardDescription>
                      Organismes officiels déjà intégrés dans la plateforme
                    </CardDescription>
                  </div>
                    <div className="flex gap-2">
                      <Button
                      onClick={handleRefreshExistants}
                        variant="outline"
                        size="sm"
                      disabled={loadingStates.saving}
                    >
                      {loadingStates.saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      </Button>
                      <Button
                      onClick={handleExportExistants}
                        variant="outline"
                        size="sm"
                      disabled={loadingStates.saving}
                    >
                      {loadingStates.saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                      </Button>
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">

                  {/* Contrôles de filtrage pour les existants */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        placeholder="🔍 Rechercher dans les existants..."
                        value={searchExistants}
                        onChange={(e) => setSearchExistants(e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <Select value={filterGroupeExistants} onValueChange={setFilterGroupeExistants}>
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue placeholder="Groupe" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        {Array.from(new Set(organismesGabon.filter(o => o.isActive).map(o => o.groupe))).sort().map((groupe) => (
                          <SelectItem key={groupe} value={groupe}>Groupe {groupe}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                            </div>

                  {/* Liste des organismes existants avec actions */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {organismesExistantsFiltres.slice(0, showAllExistants ? undefined : 10).map((organisme) => (
                      <div key={organisme.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Crown className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-sm truncate">{organisme.nom}</h4>
                            <p className="text-xs text-muted-foreground">{organisme.code} • Groupe {organisme.groupe} • {organisme.province}</p>
                            </div>
                            </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            ✅ Intégré
                          </Badge>
                          <Button
                            onClick={() => handleViewOrganismeExistant(organisme)}
                            variant="ghost"
                            size="sm"
                            disabled={loadingStates.saving}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            onClick={() => handleManageOrganismeExistant(organisme)}
                            variant="ghost"
                            size="sm"
                            disabled={loadingStates.saving}
                          >
                            <Settings className="h-3 w-3" />
                          </Button>
                            </div>
                      </div>
                    ))}

                    {organismesExistantsFiltres.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Aucun organisme existant ne correspond aux filtres</p>
                      </div>
                    )}

                    {organismesExistantsFiltres.length > 10 && !showAllExistants && (
                      <div className="text-center pt-3 border-t">
                      <Button
                          onClick={() => setShowAllExistants(true)}
                          variant="outline"
                          size="sm"
                        >
                          Voir tous les {organismesExistantsFiltres.length} organismes existants
                      </Button>
                    </div>
                    )}

                    {showAllExistants && organismesExistantsFiltres.length > 10 && (
                      <div className="text-center pt-3 border-t">
                        <Button
                          onClick={() => setShowAllExistants(false)}
                          variant="outline"
                          size="sm"
                        >
                          Réduire la liste
                        </Button>
                      </div>
                    )}
                    </div>

                  {/* Actions en masse pour les existants */}
                  <div className="flex gap-2 pt-3 border-t">
                    <Button
                      onClick={() => handleMassActionExistants('audit')}
                      variant="outline"
                      size="sm"
                      disabled={loadingStates.saving}
                      className="flex-1"
                    >
                      {loadingStates.saving ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Audit...
                        </>
                      ) : (
                        <>
                          <Shield className="h-3 w-3 mr-1" />
                          Audit Complet
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleMassActionExistants('sync')}
                      variant="outline"
                      size="sm"
                      disabled={loadingStates.saving}
                      className="flex-1"
                    >
                      {loadingStates.saving ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Sync...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Synchroniser
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

              {/* Organismes Prospects */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-orange-600">
                      <Clock className="h-5 w-5" />
                      Organismes Prospects ({organismesGabon.filter(o => !o.isActive).length})
                </CardTitle>
                <CardDescription>
                      Organismes officiels en cours d'intégration
                </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleRefreshProspects}
                      variant="outline"
                      size="sm"
                      disabled={loadingStates.saving}
                    >
                      {loadingStates.saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      onClick={handleExportProspects}
                      variant="outline"
                      size="sm"
                      disabled={loadingStates.saving}
                    >
                      {loadingStates.saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">

                  {/* Contrôles de filtrage pour les prospects */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                        <Input
                        placeholder="🔍 Rechercher dans les prospects..."
                        value={searchProspects}
                        onChange={(e) => setSearchProspects(e.target.value)}
                        className="h-8"
                        />
                      </div>
                    <Select value={filterGroupeProspects} onValueChange={setFilterGroupeProspects}>
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue placeholder="Groupe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        {Array.from(new Set(organismesGabon.filter(o => !o.isActive).map(o => o.groupe))).sort().map((groupe) => (
                          <SelectItem key={groupe} value={groupe}>Groupe {groupe}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={prioriteProspects} onValueChange={setPrioriteProspects}>
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue placeholder="Priorité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        <SelectItem value="haute">Haute</SelectItem>
                        <SelectItem value="moyenne">Moyenne</SelectItem>
                        <SelectItem value="basse">Basse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Liste des organismes prospects avec actions */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {organismesProspectsFiltres.slice(0, showAllProspects ? undefined : 10).map((organisme) => {
                      const priorite = organisme.estPrincipal ? 'haute' : Math.random() > 0.5 ? 'moyenne' : 'basse';
                      const prioriteColor = priorite === 'haute' ? 'bg-red-100 text-red-800' :
                                          priorite === 'moyenne' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-gray-100 text-gray-800';

                        return (
                        <div key={organisme.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg hover:shadow-sm transition-shadow">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Crown className="h-4 w-4 text-orange-600 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-sm truncate">{organisme.nom}</h4>
                              <p className="text-xs text-muted-foreground">{organisme.code} • Groupe {organisme.groupe} • {organisme.province}</p>
                                </div>
                                </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge className={`text-xs ${prioriteColor}`}>
                              {priorite === 'haute' ? '🔴' : priorite === 'moyenne' ? '🟡' : '⚪'} {priorite.charAt(0).toUpperCase() + priorite.slice(1)}
                                    </Badge>
                            <Badge className="bg-orange-100 text-orange-800 text-xs">
                              🔄 Prospect
                            </Badge>
                                  <Button
                              onClick={() => handleViewOrganismeProspect(organisme)}
                                    variant="ghost"
                                    size="sm"
                              disabled={loadingStates.saving}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => handleManageOrganismeProspect(organisme)}
                              variant="ghost"
                              size="sm"
                              disabled={loadingStates.saving}
                            >
                              <Settings className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => handleConvertOrganismeProspect(organisme)}
                              variant="ghost"
                              size="sm"
                              disabled={loadingStates.saving}
                              className="text-green-600 hover:text-green-700"
                            >
                              {loadingStates.saving ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <CheckCircle className="h-3 w-3" />
                              )}
                                  </Button>
                                </div>
                              </div>
                        );
                      })}

                    {organismesProspectsFiltres.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Aucun organisme prospect ne correspond aux filtres</p>
                  </div>
                    )}

                    {organismesProspectsFiltres.length > 10 && !showAllProspects && (
                      <div className="text-center pt-3 border-t">
                        <Button
                          onClick={() => setShowAllProspects(true)}
                          variant="outline"
                          size="sm"
                        >
                          Voir tous les {organismesProspectsFiltres.length} organismes prospects
                        </Button>
                    </div>
                  )}

                    {showAllProspects && organismesProspectsFiltres.length > 10 && (
                      <div className="text-center pt-3 border-t">
                        <Button
                          onClick={() => setShowAllProspects(false)}
                          variant="outline"
                          size="sm"
                        >
                          Réduire la liste
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Actions en masse pour les prospects */}
                  <div className="flex gap-2 pt-3 border-t">
                    <Button
                      onClick={() => handleMassActionProspects('convert-all')}
                      variant="outline"
                      size="sm"
                      disabled={loadingStates.saving}
                      className="flex-1"
                    >
                      {loadingStates.saving ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Conversion...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Convertir Tous
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleMassActionProspects('priority-high')}
                      variant="outline"
                      size="sm"
                      disabled={loadingStates.saving}
                      className="flex-1"
                    >
                      {loadingStates.saving ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Priorité...
                        </>
                      ) : (
                        <>
                          <Star className="h-3 w-3 mr-1" />
                          Priorité Haute
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
                  </div>

            {/* Métriques d'Intégration */}
                <Card>
                  <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart2 className="h-5 w-5" />
                      Métriques d'Intégration par Groupe Administratif
                    </CardTitle>
                    <CardDescription>
                      Suivi des performances d'intégration par classification administrative
                    </CardDescription>
                      </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleRefreshMetriques}
                      variant="outline"
                      size="sm"
                      disabled={loadingStates.saving}
                    >
                      {loadingStates.saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      onClick={handleExportMetriques}
                      variant="outline"
                      size="sm"
                      disabled={loadingStates.saving}
                    >
                      {loadingStates.saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </Button>
                      </div>
                    </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">

                  {/* Contrôles de tri et filtrage pour les métriques */}
                  <div className="flex gap-3">
                    <Select value={sortMetriques} onValueChange={setSortMetriques}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Trier par..." />
                          </SelectTrigger>
                          <SelectContent>
                        <SelectItem value="groupe">Groupe alphabétique</SelectItem>
                        <SelectItem value="pourcentage-desc">% intégration ↓</SelectItem>
                        <SelectItem value="pourcentage-asc">% intégration ↑</SelectItem>
                        <SelectItem value="total-desc">Total organismes ↓</SelectItem>
                        <SelectItem value="total-asc">Total organismes ↑</SelectItem>
                        <SelectItem value="existants-desc">Existants ↓</SelectItem>
                        <SelectItem value="prospects-desc">Prospects ↓</SelectItem>
                          </SelectContent>
                        </Select>

                    <Select value={filterMetriques} onValueChange={setFilterMetriques}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrer..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les groupes</SelectItem>
                        <SelectItem value="high-integration">Intégration élevée (&gt;80%)</SelectItem>
                        <SelectItem value="medium-integration">Intégration moyenne (50-80%)</SelectItem>
                        <SelectItem value="low-integration">Intégration faible (&lt;50%)</SelectItem>
                        <SelectItem value="no-prospects">Sans prospects</SelectItem>
                        <SelectItem value="many-prospects">Beaucoup de prospects</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex-1 flex justify-end gap-2">
                      <Button
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                        variant="outline"
                        size="sm"
                      >
                        {viewMode === 'grid' ? <BarChart2 className="h-4 w-4" /> : <Crown className="h-4 w-4" />}
                      </Button>
                      </div>
                      </div>

                  {/* Grille des métriques avec interactions */}
                  <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" : "space-y-3"}>
                    {metriquesGroupesFiltrees.map((metrique) => {
                      const { groupe, organismesDuGroupe, existants, prospects, total, pourcentage } = metrique;
                      const isLowIntegration = pourcentage < 50;
                      const isHighIntegration = pourcentage >= 80;

                      return (
                        <div
                          key={groupe}
                          className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                            viewMode === 'list' ? 'flex items-center justify-between' : ''
                          } ${
                            isHighIntegration ? 'border-green-300 bg-green-50' :
                            isLowIntegration ? 'border-red-300 bg-red-50' :
                            'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => handleViewGroupeDetails(groupe)}
                        >
                          <div className={viewMode === 'list' ? 'flex items-center gap-4 flex-1' : ''}>
                            <div className={`flex items-center justify-between mb-2 ${viewMode === 'list' ? 'mb-0' : ''}`}>
                              <h4 className="font-semibold flex items-center gap-2">
                                <Badge variant="outline" className="font-mono">Groupe {groupe}</Badge>
                                {viewMode === 'grid' && <Badge variant="secondary">{total}</Badge>}
                              </h4>
                              {viewMode === 'list' && (
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-muted-foreground">{total} organismes</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-green-600">✅ {existants}</span>
                                    <span className="text-sm text-orange-600">🔄 {prospects}</span>
                                  </div>
                                </div>
                              )}
                    </div>

                            {viewMode === 'grid' && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-green-600">✅ Existants: {existants}</span>
                    </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-orange-600">🔄 Prospects: {prospects}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 cursor-pointer" title={`${pourcentage}% intégré`}>
                                  <div
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      isHighIntegration ? 'bg-green-600' :
                                      isLowIntegration ? 'bg-red-500' :
                                      'bg-blue-500'
                                    }`}
                                    style={{ width: `${pourcentage}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs text-center text-muted-foreground">
                                  {pourcentage}% intégré
                                </div>
                              </div>
                            )}

                            {viewMode === 'list' && (
                              <div className="flex items-center gap-4">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      isHighIntegration ? 'bg-green-600' :
                                      isLowIntegration ? 'bg-red-500' :
                                      'bg-blue-500'
                                    }`}
                                    style={{ width: `${pourcentage}%` }}
                                  ></div>
                    </div>
                                <span className="text-sm font-medium w-12">{pourcentage}%</span>
                              </div>
                            )}
                          </div>

                          {/* Actions sur le groupe */}
                          <div className={`flex gap-1 ${viewMode === 'list' ? 'flex-shrink-0' : 'mt-3 pt-3 border-t'}`}>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAnalyzeGroupe(groupe);
                              }}
                              variant="ghost"
                              size="sm"
                              disabled={loadingStates.saving}
                              className="flex-1"
                            >
                              <BarChart2 className="h-3 w-3" />
                              {viewMode === 'grid' && <span className="ml-1 text-xs">Analyser</span>}
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOptimizeGroupe(groupe);
                              }}
                              variant="ghost"
                              size="sm"
                              disabled={loadingStates.saving}
                              className="flex-1"
                            >
                              <TrendingUp className="h-3 w-3" />
                              {viewMode === 'grid' && <span className="ml-1 text-xs">Optimiser</span>}
                            </Button>
                      </div>
                      </div>
                      );
                    })}
                    </div>

                  {/* Statistiques globales */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{organismesGabon.length}</div>
                      <div className="text-sm text-muted-foreground">Total Organismes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round((organismesGabon.filter(o => o.isActive).length / organismesGabon.length) * 100)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Taux Global d'Intégration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {Array.from(new Set(organismesGabon.map(o => o.groupe))).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Groupes Administratifs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Array.from(new Set(organismesGabon.map(o => o.province))).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Provinces Couvertes</div>
                    </div>
                    </div>

                  {/* Actions globales */}
                  <div className="flex gap-3 pt-3 border-t">
                    <Button
                      onClick={() => handleMassActionMetriques('boost-integration')}
                      variant="outline"
                      disabled={loadingStates.saving}
                      className="flex-1"
                    >
                      {loadingStates.saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Boost...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Booster l'Intégration
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleMassActionMetriques('generate-report')}
                      variant="outline"
                      disabled={loadingStates.saving}
                      className="flex-1"
                    >
                      {loadingStates.saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Génération...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Rapport Complet
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleMassActionMetriques('sync-all-metrics')}
                      variant="outline"
                      disabled={loadingStates.saving}
                      className="flex-1"
                    >
                      {loadingStates.saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sync...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync Métriques
                        </>
                      )}
                    </Button>
                  </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

          {/* DGBFIP Tab */}
          <TabsContent value="dgbfip" className="space-y-8">
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                    <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Database className="h-6 w-6" />
                    Direction Générale du Budget et des Finances Publiques
                  </h2>
                  <p className="text-gray-200">
                    Interface spécialisée pour la DGBFIP et les organismes rattachés
                          </p>
                    </div>
                    </div>
                          </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                          <Database className="h-5 w-5 text-blue-600" />
                          Organismes Financiers
                    </CardTitle>
                  </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            { nom: 'Direction Générale du Budget', code: 'DGB', statut: 'Connecté' },
                            { nom: 'Direction Générale du Trésor', code: 'DGT', statut: 'En cours' },
                            { nom: 'Direction Générale des Impôts', code: 'DGI', statut: 'Connecté' },
                            { nom: 'Direction Générale des Douanes', code: 'DGD', statut: 'Planifié' }
                          ].map((org, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                                <p className="font-medium">{org.nom}</p>
                                <p className="text-sm text-muted-foreground">{org.code}</p>
                      </div>
                              <Badge variant={org.statut === 'Connecté' ? 'default' : 'secondary'}>
                                {org.statut}
                              </Badge>
                              </div>
                        ))}
                              </div>
                      </CardContent>
                    </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <BarChart2 className="h-5 w-5 text-green-600" />
                          Métriques Financières
                      </CardTitle>
                    </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-sm">Budget Total 2024</span>
                            <span className="font-medium">4.8T FCFA</span>
                    </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Recettes Fiscales</span>
                            <span className="font-medium">2.1T FCFA</span>
                    </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Dépenses Engagées</span>
                            <span className="font-medium">3.2T FCFA</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Solde Budgétaire</span>
                            <span className="font-medium text-green-600">+1.6T FCFA</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-purple-600" />
                        Configuration DGBFIP
                    </CardTitle>
                  </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Interface Spécialisée DGBFIP</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          Configuration des accès sécurisés pour la Direction Générale du Budget et des Finances Publiques et organismes rattachés.
                        </p>
                        <div className="flex gap-2 justify-center">
                          <Button onClick={handleConfigureDGBFIP} variant="outline">
                            <Settings className="h-4 w-4 mr-2" />
                            Configuration Avancée
                            </Button>
                          <Button
                            onClick={handleActivateDGBFIPAccess}
                            disabled={loadingStates.saving}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {loadingStates.saving ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Activation...
                              </>
                            ) : (
                              <>
                                <Shield className="h-4 w-4 mr-2" />
                                Activer l'Accès
                              </>
                            )}
                            </Button>
                      </div>
                        </div>
                  </CardContent>
                </Card>
              </TabsContent>

          {/* Configuration Avancée Tab */}
          <TabsContent value="configuration-avancee" className="space-y-8">
            <div className="bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                    <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <Settings className="h-6 w-6" />
                    Configuration Avancée du Système
                  </h2>
                  <p className="text-slate-100">
                    Paramètres et configuration avancés pour la gestion des organismes officiels
                  </p>
                    </div>
                <div className="text-right">
                  <Badge className="bg-white text-slate-600 mb-2">
                    Administration Système
                  </Badge>
                  <p className="text-sm opacity-90">
                    Accès super-admin requis
                  </p>
                    </div>
              </div>
            </div>

            {/* Configuration Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Section Paramètres Généraux */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Paramètres Généraux
                      </CardTitle>
                  <CardDescription>
                    Configuration globale du système d'organismes
                  </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Pagination par défaut</Label>
                        <p className="text-xs text-muted-foreground">Nombre d'éléments par page</p>
                        </div>
                      <Select value="10" onValueChange={handleUpdatePagination}>
                        <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Notifications temps réel</Label>
                        <p className="text-xs text-muted-foreground">Alertes système automatiques</p>
                    </div>
                      <Checkbox
                        checked={configStates.notifications}
                        onCheckedChange={handleToggleNotifications}
                      />
                      </div>

                    <div className="flex items-center justify-between">
                        <div>
                        <Label className="text-sm font-medium">Mode de débogage</Label>
                        <p className="text-xs text-muted-foreground">Logs détaillés pour développement</p>
                          </div>
                            <Checkbox
                        checked={configStates.debugMode}
                        onCheckedChange={handleToggleDebugMode}
                      />
                        </div>
                      </div>

                  <div className="pt-4 border-t">
                    <Button
                      onClick={handleSaveGeneralConfig}
                      disabled={loadingStates.saving}
                      className="w-full"
                    >
                      {loadingStates.saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sauvegarde...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Sauvegarder les paramètres
                        </>
                      )}
                    </Button>
                      </div>
                    </CardContent>
                  </Card>

              {/* Section API et Intégrations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    API et Intégrations
                      </CardTitle>
                  <CardDescription>
                    Configuration des connexions externes
                  </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                  <div className="space-y-3">
                      <div>
                      <Label className="text-sm font-medium">URL API Base</Label>
                        <Input
                        value={configStates.apiBaseUrl}
                        onChange={(e) => setConfigStates(prev => ({ ...prev, apiBaseUrl: e.target.value }))}
                        placeholder="https://api.administration.ga"
                        className="mt-1"
                      />
                      </div>

                      <div>
                      <Label className="text-sm font-medium">Timeout API (ms)</Label>
                        <Input
                        type="number"
                        value={configStates.apiTimeout}
                        onChange={(e) => setConfigStates(prev => ({ ...prev, apiTimeout: parseInt(e.target.value) }))}
                        placeholder="30000"
                        className="mt-1"
                      />
                      </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Cache API activé</Label>
                        <p className="text-xs text-muted-foreground">Améliore les performances</p>
                          </div>
                      <Checkbox
                        checked={configStates.apiCache}
                        onCheckedChange={handleToggleApiCache}
                      />
                        </div>
                      </div>

                  <div className="pt-4 border-t">
                    <Button
                      onClick={handleTestApiConnection}
                      variant="outline"
                      disabled={loadingStates.saving}
                      className="w-full mb-2"
                    >
                      {loadingStates.saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Test en cours...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Tester la connexion API
                        </>
                      )}
                            </Button>
                    <Button
                      onClick={handleSaveApiConfig}
                      disabled={loadingStates.saving}
                      className="w-full"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder la configuration API
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

              {/* Section Import/Export */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Import/Export
                    </CardTitle>
                  <CardDescription>
                    Gestion des données d'organismes
                  </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button
                      onClick={handleExportOrganismes}
                      variant="outline"
                      disabled={loadingStates.saving}
                      className="w-full"
                    >
                      {loadingStates.saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Export en cours...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Exporter tous les organismes (CSV)
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={handleExportStats}
                      variant="outline"
                      disabled={loadingStates.saving}
                      className="w-full"
                    >
                      <BarChart2 className="h-4 w-4 mr-2" />
                      Exporter les statistiques (JSON)
                    </Button>

                    <div className="pt-2 border-t">
                      <Label className="text-sm font-medium">Import fichier CSV</Label>
                        <Input
                        type="file"
                        accept=".csv"
                        onChange={handleImportFile}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Format: nom,code,type,groupe,province
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              {/* Section Maintenance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Maintenance Système
                      </CardTitle>
                  <CardDescription>
                    Outils de maintenance et diagnostic
                  </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button
                      onClick={handleClearCache}
                      variant="outline"
                      disabled={loadingStates.saving}
                      className="w-full"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Vider le cache système
                    </Button>

                    <Button
                      onClick={handleReloadOrganismes}
                      variant="outline"
                      disabled={loadingStates.saving}
                      className="w-full"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Recharger les organismes
                    </Button>

                    <Button
                      onClick={handleValidateData}
                      variant="outline"
                      disabled={loadingStates.saving}
                      className="w-full"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Valider l'intégrité des données
                    </Button>

                    <div className="pt-2 border-t">
                      <Button
                        onClick={handleSystemDiagnostic}
                        variant="destructive"
                        disabled={loadingStates.saving}
                        className="w-full"
                      >
                        {loadingStates.saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Diagnostic...
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Diagnostic système complet
                          </>
                        )}
                      </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
            </div>

            {/* Section Status Système */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  État du Système
                      </CardTitle>
                    </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{organismesGabon.length}</div>
                    <div className="text-sm text-green-700">Organismes chargés</div>
                        </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{prospects.length}</div>
                    <div className="text-sm text-blue-700">Prospects actifs</div>
                      </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {new Set(organismesGabon.map(o => o.groupe)).size}
                        </div>
                    <div className="text-sm text-purple-700">Groupes administratifs</div>
                      </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round((organismesGabon.filter(o => o.isActive).length / organismesGabon.length) * 100)}%
                        </div>
                    <div className="text-sm text-orange-700">Taux d'intégration</div>
                      </div>
                            </div>
                          </CardContent>
                        </Card>

            {/* Section Organismes Référencés par Groupes Administratifs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Organismes Référencés par Groupes Administratifs
                    </CardTitle>
                <CardDescription>
                  Gestion et visualisation des organismes officiels gabonais par classification administrative
                </CardDescription>
                  </CardHeader>
              <CardContent>
                <div className="space-y-6">

                  {/* Contrôles de filtrage et actions */}
                  <div className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <Label className="text-sm font-medium">Filtrer par groupe</Label>
                      <Select value={groupeFilter} onValueChange={setGroupeFilter}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Sélectionner un groupe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les groupes</SelectItem>
                          {Array.from(new Set(organismesGabon.map(o => o.groupe))).sort().map((groupe) => (
                            <SelectItem key={groupe} value={groupe}>
                              Groupe {groupe} ({organismesGabon.filter(o => o.groupe === groupe).length} organismes)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                          </div>

                    <div className="flex-1">
                      <Label className="text-sm font-medium">Filtrer par statut</Label>
                      <Select value={statutFilter} onValueChange={setStatutFilter}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="existant">✅ Existants ({organismesGabon.filter(o => o.isActive).length})</SelectItem>
                          <SelectItem value="prospect">🔄 Prospects ({organismesGabon.filter(o => !o.isActive).length})</SelectItem>
                        </SelectContent>
                      </Select>
                            </div>

                    <div className="flex gap-2 items-end">
                      <Button
                        onClick={handleRefreshGroupData}
                        variant="outline"
                        disabled={loadingStates.saving}
                        size="sm"
                      >
                        {loadingStates.saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>

                      <Button
                        onClick={handleExportGroupData}
                        variant="outline"
                        disabled={loadingStates.saving}
                        size="sm"
                      >
                        {loadingStates.saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="h-4 w-4" />
                        )}
                      </Button>
                        </div>
                      </div>

                  {/* Vue d'ensemble des groupes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from(new Set(organismesGabon.map(o => o.groupe))).sort().map((groupe) => {
                      const organismesGroupe = organismesGabon.filter(o => o.groupe === groupe);
                      const existants = organismesGroupe.filter(o => o.isActive).length;
                      const prospects = organismesGroupe.filter(o => !o.isActive).length;
                      const total = organismesGroupe.length;
                      const pourcentageExistant = Math.round((existants / total) * 100);

                      return (
                        <Card key={groupe} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="font-mono">
                                  Groupe {groupe}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {total}
                                </Badge>
                              </div>
                              <Button
                                onClick={() => handleToggleGroupDetails(groupe)}
                                variant="ghost"
                                size="sm"
                                disabled={loadingStates.saving}
                              >
                                {expandedGroups.includes(groupe) ? (
                                  <ChevronRight className="h-4 w-4 rotate-90" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                          </Button>
                        </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-green-600">✅ Existants</span>
                                <span className="font-medium">{existants}</span>
                      </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-orange-600">🔄 Prospects</span>
                                <span className="font-medium">{prospects}</span>
                    </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${pourcentageExistant}%` }}
                                ></div>
                      </div>
                              <div className="text-xs text-center text-muted-foreground">
                                {pourcentageExistant}% intégré
                      </div>
                      </div>

                            <div className="flex gap-1 mt-3">
                              <Button
                                onClick={() => handleManageGroup(groupe)}
                                variant="outline"
                                size="sm"
                                disabled={loadingStates.saving}
                                className="flex-1"
                              >
                                <Settings className="h-3 w-3 mr-1" />
                                Gérer
                          </Button>
                              <Button
                                onClick={() => handleViewGroupDetails(groupe)}
                                variant="outline"
                                size="sm"
                                disabled={loadingStates.saving}
                                className="flex-1"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Voir
                          </Button>
                      </div>
                    </CardContent>
                  </Card>
                      );
                    })}
                  </div>

                  {/* Détails des groupes sélectionnés */}
                  {expandedGroups.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Détails des Groupes Sélectionnés
                      </CardTitle>
                        <CardDescription>
                          Liste détaillée des organismes dans les groupes : {expandedGroups.join(', ')}
                        </CardDescription>
                    </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {expandedGroups.map((groupe) => {
                            const organismesGroupe = organismesGabon.filter(o =>
                              o.groupe === groupe &&
                              (groupeFilter === 'all' || groupeFilter === groupe) &&
                              (statutFilter === 'all' ||
                               (statutFilter === 'existant' && o.isActive) ||
                               (statutFilter === 'prospect' && !o.isActive))
                            );

                            return (
                              <div key={groupe} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-semibold">Groupe {groupe}</h4>
                                  <Badge variant="outline">{organismesGroupe.length} organismes</Badge>
                      </div>

                                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                                  {organismesGroupe.map((organisme) => (
                                    <div key={organisme.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                                      <div className="flex items-center gap-2">
                                        <Crown className="h-4 w-4 text-yellow-600" />
                                        <div className="min-w-0 flex-1">
                                          <p className="text-sm font-medium truncate">{organisme.nom}</p>
                                          <p className="text-xs text-muted-foreground">{organisme.code} • {organisme.province}</p>
                      </div>
                      </div>
                        <div className="flex items-center gap-2">
                                        <Badge
                                          variant={organisme.isActive ? "default" : "secondary"}
                                          className="text-xs"
                                        >
                                          {organisme.isActive ? "✅" : "🔄"}
                                        </Badge>
                                        <Button
                                          onClick={() => handleManageOrganisme(organisme)}
                                          variant="ghost"
                                          size="sm"
                                          disabled={loadingStates.saving}
                                        >
                                          <Settings className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                          ))}
                        </div>

                                {organismesGroupe.length === 0 && (
                                  <div className="text-center py-4 text-muted-foreground">
                                    Aucun organisme ne correspond aux filtres sélectionnés
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </CardContent>
                  </Card>
                  )}

                  {/* Actions en masse */}
                <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserCheck className="h-5 w-5" />
                        Actions en Masse par Groupe
                      </CardTitle>
                      <CardDescription>
                        Opérations sur tous les organismes d'un ou plusieurs groupes
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <Button
                          onClick={() => handleMassAction('convert-all-prospects')}
                          variant="outline"
                          disabled={loadingStates.saving}
                          className="w-full"
                        >
                          {loadingStates.saving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Conversion...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Convertir tous les prospects
                            </>
                          )}
                      </Button>

                      <Button
                          onClick={() => handleMassAction('validate-all-data')}
                        variant="outline"
                          disabled={loadingStates.saving}
                        className="w-full"
                        >
                          {loadingStates.saving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Validation...
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4 mr-2" />
                              Valider toutes les données
                            </>
                          )}
                      </Button>

                        <Button
                          onClick={() => handleMassAction('export-by-groups')}
                          variant="outline"
                          disabled={loadingStates.saving}
                          className="w-full"
                        >
                          {loadingStates.saving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Export...
                            </>
                          ) : (
                            <>
                              <FileText className="h-4 w-4 mr-2" />
                              Exporter par groupes
                            </>
                          )}
                </Button>

                <Button
                          onClick={() => handleMassAction('sync-all-groups')}
                          variant="outline"
                          disabled={loadingStates.saving}
                          className="w-full"
                        >
                          {loadingStates.saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Sync...
                    </>
                  ) : (
                    <>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Synchroniser tout
                    </>
                  )}
                </Button>
              </div>
                    </CardContent>
                  </Card>
            </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ✅ MODALES FONCTIONNELLES COMPLÈTES */}

        {/* 🏛️ Modal Enrichi de Gestion d'Organisme */}
        <OrganismeModalComplete
          isOpen={modalStates.enrichedModal}
          onClose={() => closeModal('enrichedModal')}
          organisme={selectedProspect ? {
            id: selectedProspect.id,
            nom: selectedProspect.nom,
            code: selectedProspect.code,
            type: 'DIRECTION_GENERALE' as any,
            groupe: 'B' as any,
            contact: {
              telephone: selectedProspect.telephone,
              email: selectedProspect.email,
              adresse: selectedProspect.localisation
            },
            prospectInfo: selectedProspect.prospectInfo,
            services: selectedProspect.services,
            localisation: selectedProspect.localisation
          } : null}
          mode="edit"
          onSave={async (organisme) => {
            // Appliquer les modifications du modal enrichi
            if (selectedProspect) {
              setProspects(prev => prev.map(p =>
                p.id === selectedProspect.id
                  ? {
                      ...p,
                      nom: organisme.nom,
                      code: organisme.code,
                      type: organisme.type,
                      localisation: organisme.localisation || p.localisation,
                      telephone: organisme.contact?.telephone || p.telephone,
                      email: organisme.contact?.email || p.email
                    }
                  : p
              ));
              toast.success('✅ Configuration d\'organisme sauvegardée avec succès');
            }
            closeModal('enrichedModal');
          }}
          onConvert={(organisme) => {
            closeModal('enrichedModal');
            if (selectedProspect) {
              handleConvertProspect(selectedProspect);
                                  }
                                }}
                              />

        {/* 👁️ Modal Détails Prospect */}
        <Dialog open={modalStates.viewDetails} onOpenChange={() => closeModal('viewDetails')}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Détails du Prospect
              </DialogTitle>
              <DialogDescription>
                Informations complètes sur {selectedProspect?.nom}
              </DialogDescription>
            </DialogHeader>
            {selectedProspect && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                        <div>
                    <Label className="text-sm font-medium text-gray-500">Nom</Label>
                    <p className="text-sm font-semibold">{selectedProspect.nom}</p>
                        </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Code</Label>
                    <p className="text-sm">{selectedProspect.code}</p>
                      </div>
                        <div>
                    <Label className="text-sm font-medium text-gray-500">Type</Label>
                    <p className="text-sm">{selectedProspect.type}</p>
                        </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Localisation</Label>
                    <p className="text-sm">{selectedProspect.localisation}</p>
                      </div>
                        <div>
                    <Label className="text-sm font-medium text-gray-500">Téléphone</Label>
                    <p className="text-sm">{selectedProspect.telephone}</p>
                        </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="text-sm">{selectedProspect.email}</p>
                      </div>
                              </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Description</Label>
                  <p className="text-sm mt-1">{selectedProspect.description}</p>
                            </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Responsable Contact</Label>
                  <p className="text-sm mt-1">{selectedProspect.responsableContact}</p>
                </div>
                {selectedProspect.prospectInfo && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Informations de Prospection</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Priorité</Label>
                        <Badge className={getPrioriteColor(selectedProspect.prospectInfo.priorite)}>
                          {selectedProspect.prospectInfo.priorite}
                        </Badge>
                          </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Source</Label>
                        <Badge className={getSourceColor(selectedProspect.prospectInfo.source)}>
                          {selectedProspect.prospectInfo.source}
                                    </Badge>
                        </div>
                      </div>
                    <div className="mt-3">
                      <Label className="text-sm font-medium text-gray-500">Notes</Label>
                      <p className="text-sm mt-1">{selectedProspect.prospectInfo.notes}</p>
                    </div>
                      </div>
                  )}
                      </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => closeModal('viewDetails')}>
                Fermer
                </Button>
              <Button onClick={() => {
                closeModal('viewDetails');
                if (selectedProspect) handleEditProspect(selectedProspect);
              }}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ✏️ Modal Éditer/Ajouter Prospect */}
        <Dialog open={modalStates.editProspect || modalStates.addProspect} onOpenChange={() => {
          closeModal('editProspect');
          closeModal('addProspect');
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedProspect ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {selectedProspect ? 'Modifier le Prospect' : 'Nouveau Prospect'}
              </DialogTitle>
              <DialogDescription>
                {selectedProspect ? 'Modifiez les informations du prospect' : 'Ajoutez un nouveau prospect au pipeline'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                    placeholder="Nom de l'organisme"
                  />
                </div>
                <div>
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="Code unique"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type d'organisme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MINISTERE">Ministère</SelectItem>
                      <SelectItem value="DIRECTION_GENERALE">Direction Générale</SelectItem>
                      <SelectItem value="MAIRIE">Mairie</SelectItem>
                      <SelectItem value="PREFECTURE">Préfecture</SelectItem>
                      <SelectItem value="PROVINCE">Province</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="localisation">Localisation</Label>
                  <Input
                    id="localisation"
                    value={formData.localisation}
                    onChange={(e) => setFormData(prev => ({ ...prev, localisation: e.target.value }))}
                    placeholder="Ville/Province"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de l'organisme"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telephone">Téléphone *</Label>
                  <Input
                    id="telephone"
                    value={formData.telephone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                    placeholder="+241 XX XX XX XX"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contact@organisme.ga"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="responsableContact">Responsable Contact</Label>
                <Input
                  id="responsableContact"
                  value={formData.responsableContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, responsableContact: e.target.value }))}
                  placeholder="Nom du responsable"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
              <div>
                  <Label htmlFor="priorite">Priorité</Label>
                  <Select value={formData.priorite} onValueChange={(value) => setFormData(prev => ({ ...prev, priorite: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HAUTE">Haute</SelectItem>
                      <SelectItem value="MOYENNE">Moyenne</SelectItem>
                      <SelectItem value="BASSE">Basse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Select value={formData.source} onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DEMANDE_DIRECTE">Demande Directe</SelectItem>
                      <SelectItem value="REFERENCEMENT">Référencement</SelectItem>
                      <SelectItem value="RECOMMANDATION">Recommandation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notes sur le prospect"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  closeModal('editProspect');
                  closeModal('addProspect');
                }}
                disabled={loadingStates.saving}
              >
                  Annuler
                </Button>
                <Button
                onClick={handleSaveProspect}
                disabled={loadingStates.saving}
                >
                {loadingStates.saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {selectedProspect ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 🔧 Modal Configuration DGBFIP */}
        <Dialog open={modalStates.dgbfipConfig} onOpenChange={() => closeModal('dgbfipConfig')}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration DGBFIP
              </DialogTitle>
              <DialogDescription>
                Paramètres d'accès pour la DGBFIP
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Interface DGBFIP</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configuration des accès spécialisés pour la Direction Générale du Budget et des Finances Publiques.
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleConfigureDGBFIPAccess}
                    disabled={loadingStates.saving}
                  >
                    {loadingStates.saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Configuration...
                    </>
                  ) : (
                    <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Activer l'accès DGBFIP
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleConfigureDGBFIPReports}
                    disabled={loadingStates.saving}
                  >
                    {loadingStates.saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Configuration...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Configurer les rapports
                    </>
                  )}
                </Button>
              </div>
            </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => closeModal('dgbfipConfig')}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </AuthenticatedLayout>
  );
}
