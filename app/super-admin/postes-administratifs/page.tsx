/* @ts-nocheck */
"use client";

import { useState, useEffect, useMemo } from 'react';
import { trpc } from '@/lib/trpc/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import {
  Users,
  Building2,
  Search,
  Plus,
  Edit,
  Eye,
  UserPlus,
  BookOpen,
  Settings,
  Award,
  TrendingUp,
  Shield,
  Briefcase,
  GraduationCap,
  Stethoscope,
  Calculator,
  Wrench,
  FileText,
  Filter,
  Loader2,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

import {
  CATEGORIES_POSTES,
  GRADES_FONCTION_PUBLIQUE,
  DIRECTIONS_CENTRALES,
  POSTES_TRANSFORMATION_DIGITALE,
  HIERARCHIE_TERRITORIALE,
  METADATA_ADMINISTRATION,
  getAllPostes,
  getPostesByGrade
} from '@/lib/data/postes-administratifs';

import {
  genererComptesParOrganisme,
  genererTousLesComptes,
  getStatistiquesComptes
} from '@/lib/data/postes-administratifs-gabon';

// Import statique supprimé - utiliser les APIs TRPC à la place

// Types pour la gestion d'état
interface FormData {
  // Informations personnelles
  nom: string;
  prenom: string;
  email: string;
  telephone: string;

  // Affectation administrative
  administration: string;
  poste: string;
  grade: string;
  service: string;
  salaire?: number;
  dateAffectation: string;
}

interface FormErrors {
  [key: string]: string;
}

interface LoadingStates {
  creating: boolean;
  loading: boolean;
  submitting: boolean;
}

export default function PostesAdministratifsPage() {
  // Données des organismes via TRPC
  const { data: organizationsData, isLoading: organismsLoading } = trpc.organizations.list.useQuery({
    limit: 1000,
    offset: 0
  });

  const organismes = useMemo(() => {
    if (!organizationsData?.organizations) return [];
    return organizationsData.organizations.map(org => ({
      code: org.code,
      nom: org.name,
      type: org.type,
      ville: org.city || 'Non spécifiée',
      isActive: org.isActive
    }));
  }, [organizationsData]);

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState('');
  const [selectedPoste, setSelectedPoste] = useState<any | null>(null);

  // États pour les comptes utilisateurs des 307 organismes
  const [comptesGeneres, setComptesGeneres] = useState<any[]>([]);
  const [organismeSelectionne, setOrganismeSelectionne] = useState<string>('');
  const [comptesParOrganisme, setComptesParOrganisme] = useState<Record<string, any[]>>({});
  const [generationEnCours, setGenerationEnCours] = useState(false);

  // États pour le formulaire de création
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    administration: '',
    poste: '',
    grade: '',
    service: '',
    dateAffectation: new Date().toISOString().split('T')[0]
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    creating: false,
    loading: false,
    submitting: false
  });

  // État pour les dialogs
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Listes dynamiques pour les selects
  const [administrations] = useState([
    { id: 'ministere-sante', nom: 'Ministère de la Santé' },
    { id: 'ministere-education', nom: 'Ministère de l\'Éducation Nationale' },
    { id: 'ministere-justice', nom: 'Ministère de la Justice' },
    { id: 'dgdi', nom: 'DGDI - Direction Générale de l\'Informatique' },
    { id: 'dgi', nom: 'DGI - Direction Générale des Impôts' },
    { id: 'cnss', nom: 'CNSS - Caisse Nationale de Sécurité Sociale' },
    { id: 'mairie-libreville', nom: 'Mairie de Libreville' },
    { id: 'mairie-port-gentil', nom: 'Mairie de Port-Gentil' },
    { id: 'prefecture-estuaire', nom: 'Préfecture de l\'Estuaire' }
  ]);

  // Filtrage des postes
  const filteredPostes = getAllPostes().filter(poste => {
    const matchSearch = poste.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       poste.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGrade = !selectedGrade || poste.grade.includes(selectedGrade);
    const matchCategorie = !selectedCategorie || poste.categorie === selectedCategorie;

    return matchSearch && matchGrade && matchCategorie;
  });

  // Statistiques
  const stats = {
    totalPostes: getAllPostes().length,
    postesDirection: getAllPostes().filter(p => p.categorie?.includes('Direction')).length,
    postesTechniques: getAllPostes().filter(p => p.categorie?.includes('Service')).length,
    postesAdmin: getAllPostes().filter(p => p.categorie?.includes('Bureau')).length,
    postesOperationnels: getAllPostes().filter(p => p.categorie?.includes('Section')).length
  };

  // Fonctions pour la génération de comptes
  const genererComptesTousOrganismes = async () => {
    setGenerationEnCours(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation
      const comptes = genererTousLesComptes();
      setComptesGeneres(comptes);

      // Organiser par organisme
      const comptesParOrg: Record<string, any[]> = {};
      comptes.forEach(compte => {
        if (!comptesParOrg[compte.organismeId]) {
          comptesParOrg[compte.organismeId] = [];
        }
        comptesParOrg[compte.organismeId].push(compte);
      });
      setComptesParOrganisme(comptesParOrg);

      toast.success(`✅ ${comptes.length} comptes générés pour 307 organismes`);
    } catch (error) {
      toast.error('Erreur lors de la génération des comptes');
    } finally {
      setGenerationEnCours(false);
    }
  };

  const genererComptesOrganisme = (organismeCode: string) => {
    const organisme = organismes.find(org => org.code === organismeCode);
    if (!organisme) return;

    const comptes = genererComptesParOrganisme(organisme.nom);
    setComptesParOrganisme(prev => ({
      ...prev,
      [organismeCode]: comptes
    }));

    toast.success(`✅ ${comptes.length} comptes générés pour ${organisme.nom}`);
  };

  // Statistiques des comptes générés
  const statsComptes = comptesGeneres.length > 0 ? getStatistiquesComptes() : null;

  // Fonctions utilitaires
  const getCategorieIcon = (categorieId: string) => {
    switch (categorieId) {
      case 'direction': return Shield;
      case 'technique': return Settings;
      case 'administratif': return FileText;
      case 'operationnel': return Wrench;
      default: return Briefcase;
    }
  };

  const formatSalaire = (salaire: number) => {
    return new Intl.NumberFormat('fr-FR').format(salaire) + ' FCFA';
  };

  // Validation du formulaire
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Validation des champs obligatoires
    if (!formData.nom.trim()) {
      errors.nom = 'Le nom est obligatoire';
    }
    if (!formData.prenom.trim()) {
      errors.prenom = 'Le prénom est obligatoire';
    }
    if (!formData.email.trim()) {
      errors.email = 'L\'email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format d\'email invalide';
    }
    if (!formData.telephone.trim()) {
      errors.telephone = 'Le téléphone est obligatoire';
    } else if (!/^\+241\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/.test(formData.telephone)) {
      errors.telephone = 'Format de téléphone invalide (+241 XX XX XX XX)';
    }
    if (!formData.administration) {
      errors.administration = 'L\'administration est obligatoire';
    }
    if (!formData.poste) {
      errors.poste = 'Le poste est obligatoire';
    }
    if (!formData.grade) {
      errors.grade = 'Le grade est obligatoire';
    }
    if (!formData.service.trim()) {
      errors.service = 'Le service est obligatoire';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Gestionnaires d'événements
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Nettoyer l'erreur pour ce champ
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSelectChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Logique spéciale pour le poste (mettre à jour le salaire)
    if (field === 'poste') {
      const selectedPoste = getAllPostes().find(p => p.id === value);
      if (selectedPoste) {
        setFormData(prev => ({
          ...prev,
          salaire: 500000 // Valeur par défaut
        }));
      }
    }

    // Nettoyer l'erreur pour ce champ
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedGrade('');
    setSelectedCategorie('');
    toast.success('Filtres réinitialisés');
  };

  const handleViewDetails = (poste: any) => {
    setSelectedPoste(poste);
    setIsDetailDialogOpen(true);
  };

  const handleQuickCreateAccount = (poste: any) => {
    // Pré-remplir le formulaire avec le poste sélectionné
    setFormData(prev => ({
      ...prev,
      poste: poste.id,
      grade: poste.grade_requis[0], // Premier grade requis
      salaire: (poste as any).salaire_base || 0
    }));
    setIsCreateDialogOpen(true);
    toast(`Formulaire pré-rempli pour le poste: ${poste.titre}`);
  };

  const handleCancelForm = () => {
    // Réinitialiser le formulaire
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      administration: '',
      poste: '',
      grade: '',
      service: '',
      dateAffectation: new Date().toISOString().split('T')[0]
    });
    setFormErrors({});
    setIsCreateDialogOpen(false);
    toast('Formulaire annulé');
  };

  const handleSubmitForm = async () => {
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setLoadingStates(prev => ({ ...prev, submitting: true }));

    try {
      // Simulation d'appel API pour créer le compte
      await simulateAccountCreation(formData);

      toast.success('Compte collaborateur créé avec succès !');
      setIsCreateDialogOpen(false);

      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        administration: '',
        poste: '',
        grade: '',
        service: '',
        dateAffectation: new Date().toISOString().split('T')[0]
      });
      setFormErrors({});

    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
      toast.error('Erreur lors de la création du compte. Veuillez réessayer.');
    } finally {
      setLoadingStates(prev => ({ ...prev, submitting: false }));
    }
  };

  // Simulation d'appel API
  const simulateAccountCreation = async (data: FormData): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulation d'un taux d'échec de 10%
        if (Math.random() > 0.9) {
          reject(new Error('Erreur serveur simulée'));
        } else {
          console.log('Compte créé:', data);
          resolve();
        }
      }, 2000); // Simulation de 2 secondes de traitement
    });
  };

  // Effet pour charger les données initiales
  useEffect(() => {
    setLoadingStates(prev => ({ ...prev, loading: true }));

    // Simulation de chargement initial
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, loading: false }));
    }, 500);
  }, []);

  // Indicateur de chargement pour les organismes
  if (organismsLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Chargement des organismes...</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (loadingStates.loading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Chargement des postes administratifs...</p>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des Postes Administratifs
          </h1>
          <p className="text-gray-600">
            Base de connaissances complète des fonctions publiques gabonaises pour la création et gestion des comptes collaborateurs
          </p>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Postes</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalPostes}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Direction</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.postesDirection}</p>
                </div>
                <Shield className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Techniques</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.postesTechniques}</p>
                </div>
                <Settings className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Administratifs</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.postesAdmin}</p>
                </div>
                <FileText className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Opérationnels</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.postesOperationnels}</p>
                </div>
                <Wrench className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="postes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="postes">Tous les Postes</TabsTrigger>
            <TabsTrigger value="categories">Par Catégories</TabsTrigger>
            <TabsTrigger value="grades">Par Grades</TabsTrigger>
            <TabsTrigger value="directions">Directions Standards</TabsTrigger>
            <TabsTrigger value="comptes-organismes">Comptes Organismes</TabsTrigger>
            <TabsTrigger value="creation">Créer Compte</TabsTrigger>
          </TabsList>

          {/* Onglet Tous les Postes */}
          <TabsContent value="postes" className="space-y-6">
            {/* Filtres */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres et Recherche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un poste..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {GRADES_FONCTION_PUBLIQUE.map(grade => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedCategorie} onValueChange={setSelectedCategorie}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES_POSTES.map(categorie => (
                        <SelectItem key={categorie} value={categorie}>
                          {categorie}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="hover:bg-gray-50"
                  >
                    Réinitialiser
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Liste des postes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPostes.map((poste) => (
                <Card key={poste.id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{(poste as any).titre || poste.nom}</CardTitle>
                        <CardDescription className="font-mono text-sm">
                          Code: {(poste as any).code || poste.id}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {(poste as any).grade_requis?.join(', ') || poste.grade}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Niveau</p>
                        <p className="font-medium">{(poste as any).niveau || poste.grade}</p>
                      </div>

                      {(poste as any).salaire_base && (
                        <div>
                          <p className="text-sm text-gray-600">Salaire de base</p>
                          <p className="font-medium text-green-600">
                            {formatSalaire((poste as any).salaire_base)}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-sm text-gray-600">Catégorie</p>
                        <p className="text-sm">{poste.categorie}</p>
                      </div>

                      {/* Grade du poste */}
                      <div>
                        <p className="text-sm text-gray-600">Grade</p>
                        <Badge variant="outline" className="text-xs">
                          {poste.grade}
                        </Badge>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(poste)}
                          className="hover:bg-gray-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>

                        <Button
                          size="sm"
                          className="flex-1 hover:bg-blue-600"
                          onClick={() => handleQuickCreateAccount(poste)}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Créer Compte
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPostes.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun poste trouvé
                  </h3>
                  <p className="text-gray-600">
                    Essayez de modifier vos critères de recherche
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Onglet Par Catégories */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid gap-6">
              {CATEGORIES_POSTES.map((categorie) => {
                const IconComponent = getCategorieIcon(categorie);
                const postesCategorie = getAllPostes().filter(p => p.categorie === categorie);
                return (
                  <Card key={categorie}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <IconComponent className="h-6 w-6" />
                        {categorie}
                        <Badge variant="outline">{postesCategorie.length} postes</Badge>
                      </CardTitle>
                      <CardDescription>Postes de catégorie {categorie}</CardDescription>
                      <div className="flex gap-2">
                        <span className="text-sm text-gray-600">Grades dans cette catégorie:</span>
                        {[...new Set(postesCategorie.map(p => p.grade))].map(grade => (
                          <Badge key={grade} variant="secondary">{grade}</Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {postesCategorie.map((poste) => (
                          <div key={poste.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                               onClick={() => handleViewDetails(poste)}>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{poste.nom}</h4>
                              <span className="text-xs text-gray-500 font-mono">{poste.id}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Grade: {poste.grade}</p>
                            {(poste as any).salaire_base && (
                              <p className="text-sm font-medium text-green-600">
                                {formatSalaire((poste as any).salaire_base)}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Onglet Par Grades */}
          <TabsContent value="grades" className="space-y-6">
            <div className="grid gap-6">
              {GRADES_FONCTION_PUBLIQUE.map((grade) => {
                const postesGrade = getPostesByGrade(grade);
                return (
                  <Card key={grade}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Award className="h-6 w-6" />
                        {grade}
                        <Badge variant="outline">{postesGrade.length} postes</Badge>
                      </CardTitle>
                      <CardDescription>
                        Grade de la fonction publique gabonaise
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {postesGrade.map((poste) => (
                          <div key={poste.id} className="text-center p-3 border rounded hover:bg-gray-50 cursor-pointer"
                               onClick={() => handleViewDetails(poste)}>
                            <p className="font-medium text-sm">{poste.nom}</p>
                            <p className="text-xs text-gray-500">{poste.id}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Onglet Directions Standards */}
          <TabsContent value="directions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Directions Centrales Standards</CardTitle>
                <CardDescription>
                  Directions qu'on retrouve dans la plupart des ministères gabonais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {DIRECTIONS_CENTRALES.map((direction) => (
                    <div key={direction} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-lg">{direction}</h4>
                          <p className="font-medium">Direction Centrale</p>
                          <p className="text-sm text-gray-600">Fonction administrative centrale</p>
                        </div>
                        <Badge variant="outline">
                          5 postes standards
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Postes standards:</p>
                        <div className="flex flex-wrap gap-2">
                          {['DIR-01', 'ADJT-02', 'CHEF-03', 'SEC-04'].map((code) => (
                            <Badge key={code} variant="secondary">{code}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Comptes Organismes */}
          <TabsContent value="comptes-organismes" className="space-y-6">
            {/* Header avec génération globale */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-6 w-6" />
                      Comptes Utilisateurs par Organisme
                    </CardTitle>
                    <CardDescription>
                      Génération automatique des comptes selon la hiérarchie administrative gabonaise
                    </CardDescription>
                  </div>
                  <Button
                    onClick={genererComptesTousOrganismes}
                    disabled={generationEnCours}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {generationEnCours ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Générer 307 Organismes
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>

              {statsComptes && (
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600">Total Comptes</p>
                      <p className="text-2xl font-bold text-blue-700">{statsComptes.total_comptes}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600">Comptes Actifs</p>
                      <p className="text-2xl font-bold text-green-700">{statsComptes.comptes_actifs}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600">Comptes Inactifs</p>
                      <p className="text-2xl font-bold text-purple-700">{statsComptes.comptes_inactifs}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-orange-600">Salaire Moyen</p>
                      <p className="text-2xl font-bold text-orange-700">{formatSalaire(statsComptes.salaire_moyen)}</p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Sélection d'organisme */}
            <Card>
              <CardHeader>
                <CardTitle>Sélectionner un Organisme</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select value={organismeSelectionne} onValueChange={setOrganismeSelectionne}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un organisme..." />
                    </SelectTrigger>
                    <SelectContent>
                      {organismes.map((org) => (
                        <SelectItem key={org.code} value={org.code}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            {org.nom}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={() => organismeSelectionne && genererComptesOrganisme(organismeSelectionne)}
                    disabled={!organismeSelectionne}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Générer Comptes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Affichage des comptes par organisme */}
            {organismeSelectionne && comptesParOrganisme[organismeSelectionne] && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    Comptes - {organismes.find(o => o.code === organismeSelectionne)?.nom}
                  </CardTitle>
                  <CardDescription>
                    {comptesParOrganisme[organismeSelectionne].length} comptes générés selon la hiérarchie administrative
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {comptesParOrganisme[organismeSelectionne].map((compte) => (
                      <div key={compte.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="font-semibold">{compte.prenom} {compte.nom}</p>
                            <p className="text-sm text-gray-600">{compte.poste}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-mono text-sm">{compte.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Téléphone</p>
                            <p className="text-sm">{compte.phone}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                compte.role === 'ADMIN' ? 'default' :
                                compte.role === 'MANAGER' ? 'secondary' : 'outline'
                              }
                            >
                              {compte.role}
                            </Badge>
                            <Badge variant="outline">
                              Niveau {compte.niveau}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Affichage global si comptes générés */}
            {comptesGeneres.length > 0 && !organismeSelectionne && (
              <Card>
                <CardHeader>
                  <CardTitle>Tous les Comptes Générés ({comptesGeneres.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {Object.entries(comptesParOrganisme).map(([orgCode, comptes]) => (
                      <div key={orgCode} className="border rounded p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {organismes.find(o => o.code === orgCode)?.nom}
                            </p>
                            <p className="text-sm text-gray-600">{comptes.length} comptes</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setOrganismeSelectionne(orgCode)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Onglet Création de Compte */}
          <TabsContent value="creation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-6 w-6" />
                  Créer un Compte Collaborateur
                </CardTitle>
                <CardDescription>
                  Créer un nouveau compte utilisateur basé sur les postes administratifs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Informations personnelles */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg border-b pb-2">Informations personnelles</h3>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="prenom">Prénom *</Label>
                        <Input
                          id="prenom"
                          placeholder="Prénom"
                          value={formData.prenom}
                          onChange={(e) => handleInputChange('prenom', e.target.value)}
                          className={formErrors.prenom ? 'border-red-500' : ''}
                        />
                        {formErrors.prenom && (
                          <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {formErrors.prenom}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="nom">Nom *</Label>
                        <Input
                          id="nom"
                          placeholder="Nom"
                          value={formData.nom}
                          onChange={(e) => handleInputChange('nom', e.target.value)}
                          className={formErrors.nom ? 'border-red-500' : ''}
                        />
                        {formErrors.nom && (
                          <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {formErrors.nom}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">Email professionnel *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="prenom.nom@administration.ga"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={formErrors.email ? 'border-red-500' : ''}
                        />
                        {formErrors.email && (
                          <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {formErrors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="telephone">Téléphone *</Label>
                        <Input
                          id="telephone"
                          placeholder="+241 XX XX XX XX"
                          value={formData.telephone}
                          onChange={(e) => handleInputChange('telephone', e.target.value)}
                          className={formErrors.telephone ? 'border-red-500' : ''}
                        />
                        {formErrors.telephone && (
                          <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {formErrors.telephone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Affectation administrative */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg border-b pb-2">Affectation administrative</h3>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="administration">Administration *</Label>
                        <Select value={formData.administration} onValueChange={(value) => handleSelectChange('administration', value)}>
                          <SelectTrigger className={formErrors.administration ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Sélectionner une administration" />
                          </SelectTrigger>
                          <SelectContent>
                            {administrations.map((admin) => (
                              <SelectItem key={admin.id} value={admin.id}>
                                {admin.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formErrors.administration && (
                          <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {formErrors.administration}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="poste">Poste *</Label>
                        <Select value={formData.poste} onValueChange={(value) => handleSelectChange('poste', value)}>
                          <SelectTrigger className={formErrors.poste ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Sélectionner un poste" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAllPostes().map((poste) => (
                              <SelectItem key={poste.id} value={poste.id}>
                                {poste.nom} ({poste.id})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formErrors.poste && (
                          <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {formErrors.poste}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="grade">Grade *</Label>
                        <Select value={formData.grade} onValueChange={(value) => handleSelectChange('grade', value)}>
                          <SelectTrigger className={formErrors.grade ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Sélectionner un grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {GRADES_FONCTION_PUBLIQUE.map((grade) => (
                              <SelectItem key={grade} value={grade}>
                                {grade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formErrors.grade && (
                          <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {formErrors.grade}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="service">Service/Direction *</Label>
                        <Input
                          id="service"
                          placeholder="Ex: Direction des Ressources Humaines"
                          value={formData.service}
                          onChange={(e) => handleInputChange('service', e.target.value)}
                          className={formErrors.service ? 'border-red-500' : ''}
                        />
                        {formErrors.service && (
                          <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {formErrors.service}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="dateAffectation">Date d'affectation</Label>
                        <Input
                          id="dateAffectation"
                          type="date"
                          value={formData.dateAffectation}
                          onChange={(e) => handleInputChange('dateAffectation', e.target.value)}
                        />
                      </div>

                      {formData.salaire && (
                        <div>
                          <Label>Salaire estimé</Label>
                          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                            <p className="font-medium text-green-700">
                              {formatSalaire(formData.salaire)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Aperçu du compte à créer */}
                {formData.nom && formData.prenom && formData.poste && (
                  <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Aperçu du compte à créer
                    </h4>
                    <div className="text-sm text-blue-800">
                      <p><strong>Utilisateur:</strong> {formData.prenom} {formData.nom}</p>
                      <p><strong>Email:</strong> {formData.email}</p>
                      <p><strong>Poste:</strong> {getAllPostes().find(p => p.id === formData.poste)?.nom}</p>
                      <p><strong>Administration:</strong> {administrations.find(a => a.id === formData.administration)?.nom}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handleCancelForm}
                    disabled={loadingStates.submitting}
                    className="hover:bg-gray-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSubmitForm}
                    disabled={loadingStates.submitting}
                    className="hover:bg-blue-600"
                  >
                    {loadingStates.submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Création en cours...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Créer le Compte
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog de détails du poste */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedPoste?.titre}</DialogTitle>
              <DialogDescription>
                Code: {selectedPoste?.code} - {selectedPoste?.niveau}
              </DialogDescription>
            </DialogHeader>
            {selectedPoste && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-sm text-gray-600">Grades requis</p>
                    <div className="flex gap-1 mt-1">
                      {selectedPoste.grade_requis.map(grade => (
                        <Badge key={grade}>{grade}</Badge>
                      ))}
                    </div>
                  </div>
                  {selectedPoste.salaire_base && (
                    <div>
                      <p className="font-medium text-sm text-gray-600">Salaire de base</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatSalaire(selectedPoste.salaire_base)}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="font-medium text-sm text-gray-600">Présence</p>
                  <p>{selectedPoste.presence}</p>
                </div>

                {selectedPoste.description && (
                  <div>
                    <p className="font-medium text-sm text-gray-600">Description</p>
                    <p>{selectedPoste.description}</p>
                  </div>
                )}

                {selectedPoste.specialites && (
                  <div>
                    <p className="font-medium text-sm text-gray-600">Spécialités</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedPoste.specialites.map((spec, idx) => (
                        <Badge key={idx} variant="secondary">{spec}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPoste.nomination && (
                  <div>
                    <p className="font-medium text-sm text-gray-600">Mode de nomination</p>
                    <p>{selectedPoste.nomination}</p>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                    Fermer
                  </Button>
                  <Button onClick={() => {
                    setIsDetailDialogOpen(false);
                    handleQuickCreateAccount(selectedPoste);
                  }}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Créer Compte pour ce Poste
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog de création rapide */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-6 w-6" />
                Création Rapide de Compte
              </DialogTitle>
              <DialogDescription>
                Créer un nouveau compte collaborateur avec les informations pré-remplies
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations personnelles */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg border-b pb-2">Informations personnelles</h3>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="modal-prenom">Prénom *</Label>
                    <Input
                      id="modal-prenom"
                      placeholder="Prénom"
                      value={formData.prenom}
                      onChange={(e) => handleInputChange('prenom', e.target.value)}
                      className={formErrors.prenom ? 'border-red-500' : ''}
                    />
                    {formErrors.prenom && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.prenom}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="modal-nom">Nom *</Label>
                    <Input
                      id="modal-nom"
                      placeholder="Nom"
                      value={formData.nom}
                      onChange={(e) => handleInputChange('nom', e.target.value)}
                      className={formErrors.nom ? 'border-red-500' : ''}
                    />
                    {formErrors.nom && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.nom}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="modal-email">Email professionnel *</Label>
                    <Input
                      id="modal-email"
                      type="email"
                      placeholder="prenom.nom@administration.ga"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={formErrors.email ? 'border-red-500' : ''}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="modal-telephone">Téléphone *</Label>
                    <Input
                      id="modal-telephone"
                      placeholder="+241 XX XX XX XX"
                      value={formData.telephone}
                      onChange={(e) => handleInputChange('telephone', e.target.value)}
                      className={formErrors.telephone ? 'border-red-500' : ''}
                    />
                    {formErrors.telephone && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.telephone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Affectation administrative */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg border-b pb-2">Affectation administrative</h3>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="modal-administration">Administration *</Label>
                    <Select value={formData.administration} onValueChange={(value) => handleSelectChange('administration', value)}>
                      <SelectTrigger className={formErrors.administration ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Sélectionner une administration" />
                      </SelectTrigger>
                      <SelectContent>
                        {administrations.map((admin) => (
                          <SelectItem key={admin.id} value={admin.id}>
                            {admin.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.administration && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.administration}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="modal-poste">Poste *</Label>
                    <Select value={formData.poste} onValueChange={(value) => handleSelectChange('poste', value)}>
                      <SelectTrigger className={formErrors.poste ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Sélectionner un poste" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAllPostes().map((poste) => (
                          <SelectItem key={poste.id} value={poste.id}>
                            {poste.nom} ({poste.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.poste && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.poste}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="modal-grade">Grade *</Label>
                    <Select value={formData.grade} onValueChange={(value) => handleSelectChange('grade', value)}>
                      <SelectTrigger className={formErrors.grade ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Sélectionner un grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADES_FONCTION_PUBLIQUE.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.grade && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.grade}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="modal-service">Service/Direction *</Label>
                    <Input
                      id="modal-service"
                      placeholder="Ex: Direction des Ressources Humaines"
                      value={formData.service}
                      onChange={(e) => handleInputChange('service', e.target.value)}
                      className={formErrors.service ? 'border-red-500' : ''}
                    />
                    {formErrors.service && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {formErrors.service}
                      </p>
                    )}
                  </div>

                  {formData.salaire && (
                    <div>
                      <Label>Salaire estimé</Label>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="font-medium text-green-700">
                          {formatSalaire(formData.salaire)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleCancelForm}
                disabled={loadingStates.submitting}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button
                onClick={handleSubmitForm}
                disabled={loadingStates.submitting}
              >
                {loadingStates.submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Créer le Compte
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
