'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Mail,
  Send,
  Inbox,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  Archive,
  Search,
  Filter,
  Download,
  RefreshCw,
  Loader2,
  FileText,
  Paperclip,
  Users,
  Building,
  Calendar,
  Star,
  Flag,
  Shield,
  Lock,
  Globe,
  Zap,
  TrendingUp,
  BarChart3,
  Activity,
  MessageSquare,
  Phone,
  Video,
  Plus,
  Settings,
  ArrowRight
} from 'lucide-react';

interface Communication {
  id: string;
  expediteur: {
    nom: string;
    organisme: string;
    poste: string;
  };
  destinataire: {
    nom: string;
    organisme: string;
    poste: string;
  };
  objet: string;
  contenu: string;
  priorite: 'BASSE' | 'MOYENNE' | 'HAUTE' | 'URGENTE';
  statut: 'ENVOYE' | 'RECU' | 'LU' | 'TRAITE' | 'ARCHIVE';
  dateEnvoi: string;
  dateLecture?: string;
  dateTraitement?: string;
  pieceJointe?: {
    nom: string;
    taille: number;
    type: string;
  };
  accuseReception: boolean;
  confidentialite: 'PUBLIC' | 'INTERNE' | 'CONFIDENTIEL' | 'SECRET';
}

interface CommunicationsStats {
  total: number;
  envoyes: number;
  recus: number;
  lus: number;
  traites: number;
  archives: number;
  urgentes: number;
  hautes: number;
  confidentielles: number;
}

interface LoadingStates {
  loading: boolean;
  refreshing: boolean;
  sending: boolean;
  archiving: string | null;
  marking: string | null;
}

export default function CommunicationsPage() {
  // États de base
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPriorite, setSelectedPriorite] = useState<string>('all');
  const [selectedStatut, setSelectedStatut] = useState<string>('all');
  const [selectedOrganisme, setSelectedOrganisme] = useState<string>('all');
  const [selectedConfidentialite, setSelectedConfidentialite] = useState<string>('all');

  // États des données
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [stats, setStats] = useState<CommunicationsStats | null>(null);

  // États des modales
  const [isNewCommModalOpen, setIsNewCommModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);

  // États de chargement
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    loading: true,
    refreshing: false,
    sending: false,
    archiving: null,
    marking: null
  });

  // Formulaire nouvelle communication
  const [newCommForm, setNewCommForm] = useState({
    expediteurNom: '',
    expediteurOrganisme: '',
    expediteurPoste: '',
    destinataireNom: '',
    destinataireOrganisme: '',
    destinatairePoste: '',
    objet: '',
    contenu: '',
    priorite: 'MOYENNE' as Communication['priorite'],
    confidentialite: 'INTERNE' as Communication['confidentialite'],
    accuseReception: false
  });

  // Charger les données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, loading: true }));

      const params = new URLSearchParams();
      if (selectedPriorite !== 'all') params.append('priorite', selectedPriorite);
      if (selectedStatut !== 'all') params.append('statut', selectedStatut);
      if (selectedOrganisme !== 'all') params.append('organisme', selectedOrganisme);

      const response = await fetch(`/api/communications?${params}`);
      const result = await response.json();

      if (result.success) {
        setCommunications(result.data);
        setStats(result.stats);
        toast.success('Communications chargées');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Erreur chargement communications:', error);
      toast.error('❌ Erreur lors du chargement');
    } finally {
      setLoadingStates(prev => ({ ...prev, loading: false }));
    }
  }, [selectedPriorite, selectedStatut, selectedOrganisme]);

  // Filtrer les communications
  const filteredCommunications = useMemo(() => {
    return communications.filter(comm => {
      const matchSearch = comm.objet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.expediteur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.destinataire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.expediteur.organisme.toLowerCase().includes(searchTerm.toLowerCase());

      const matchConfidentialite = selectedConfidentialite === 'all' || comm.confidentialite === selectedConfidentialite;

      return matchSearch && matchConfidentialite;
    });
  }, [communications, searchTerm, selectedConfidentialite]);

  // Gestionnaires d'événements
  const handleRefreshData = useCallback(async () => {
    try {
      setLoadingStates(prev => ({ ...prev, refreshing: true }));
      await loadData();
    } finally {
      setLoadingStates(prev => ({ ...prev, refreshing: false }));
    }
  }, [loadData]);

  const handleSendCommunication = useCallback(async () => {
    // Validation des champs obligatoires
    const errors = [];

    if (!newCommForm.expediteurNom.trim()) errors.push('Nom de l\'expéditeur');
    if (!newCommForm.expediteurOrganisme.trim()) errors.push('Organisme expéditeur');
    if (!newCommForm.expediteurPoste.trim()) errors.push('Poste expéditeur');
    if (!newCommForm.destinataireNom.trim()) errors.push('Nom du destinataire');
    if (!newCommForm.destinataireOrganisme.trim()) errors.push('Organisme destinataire');
    if (!newCommForm.destinatairePoste.trim()) errors.push('Poste destinataire');
    if (!newCommForm.objet.trim()) errors.push('Objet');
    if (!newCommForm.contenu.trim()) errors.push('Contenu');

    if (errors.length > 0) {
      toast.error(`❌ Champs obligatoires manquants: ${errors.join(', ')}`);
      return;
    }

    // Validation de la longueur
    if (newCommForm.objet.length < 5) {
      toast.error('❌ L\'objet doit contenir au moins 5 caractères');
      return;
    }

    if (newCommForm.contenu.length < 20) {
      toast.error('❌ Le contenu doit contenir au moins 20 caractères');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, sending: true }));

      const response = await fetch('/api/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expediteur: {
            nom: newCommForm.expediteurNom,
            organisme: newCommForm.expediteurOrganisme,
            poste: newCommForm.expediteurPoste
          },
          destinataire: {
            nom: newCommForm.destinataireNom,
            organisme: newCommForm.destinataireOrganisme,
            poste: newCommForm.destinatairePoste
          },
          objet: newCommForm.objet,
          contenu: newCommForm.contenu,
          priorite: newCommForm.priorite,
          confidentialite: newCommForm.confidentialite,
          accuseReception: newCommForm.accuseReception
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Communication envoyée avec succès');
        setIsNewCommModalOpen(false);
        setNewCommForm({
          expediteurNom: '',
          expediteurOrganisme: '',
          expediteurPoste: '',
          destinataireNom: '',
          destinataireOrganisme: '',
          destinatairePoste: '',
          objet: '',
          contenu: '',
          priorite: 'MOYENNE',
          confidentialite: 'INTERNE',
          accuseReception: false
        });
        await loadData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Erreur envoi communication:', error);
      toast.error('❌ Erreur lors de l\'envoi');
    } finally {
      setLoadingStates(prev => ({ ...prev, sending: false }));
    }
  }, [newCommForm, loadData]);

  const handleMarkAsRead = useCallback(async (commId: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, marking: commId }));

      // Simulation
      await new Promise(resolve => setTimeout(resolve, 500));

      toast.success('Communication marquée comme lue');
      await loadData();
    } catch (error) {
      console.error('❌ Erreur marquage lecture:', error);
      toast.error('❌ Erreur lors du marquage');
    } finally {
      setLoadingStates(prev => ({ ...prev, marking: null }));
    }
  }, [loadData]);

  const handleArchive = useCallback(async (commId: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, archiving: commId }));

      // Simulation
      await new Promise(resolve => setTimeout(resolve, 800));

      toast.success('Communication archivée');
      await loadData();
    } catch (error) {
      console.error('❌ Erreur archivage:', error);
      toast.error('❌ Erreur lors de l\'archivage');
    } finally {
      setLoadingStates(prev => ({ ...prev, archiving: null }));
    }
  }, [loadData]);

  // Fonctions utilitaires
  const getPrioriteColor = (priorite: Communication['priorite']) => {
    switch (priorite) {
      case 'URGENTE': return 'bg-red-100 text-red-800 border-red-300';
      case 'HAUTE': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'MOYENNE': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'BASSE': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatutColor = (statut: Communication['statut']) => {
    switch (statut) {
      case 'ENVOYE': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'RECU': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'LU': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'TRAITE': return 'bg-green-100 text-green-800 border-green-300';
      case 'ARCHIVE': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getConfidentialiteIcon = (confidentialite: Communication['confidentialite']) => {
    switch (confidentialite) {
      case 'SECRET': return Lock;
      case 'CONFIDENTIEL': return Shield;
      case 'INTERNE': return Building;
      case 'PUBLIC': return Globe;
      default: return FileText;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loadingStates.loading) {
    return (
      <AuthenticatedLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chargement des communications...</h3>
              <p className="text-muted-foreground">Synchronisation inter-administration en cours</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Mail className="h-8 w-8 text-blue-600" />
                Communications Inter-Administration
              </h1>
              <p className="text-gray-600">
                Système de communication officielle entre organismes publics gabonais
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
              <Dialog open={isNewCommModalOpen} onOpenChange={setIsNewCommModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle Communication
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Communications</p>
                  <p className="text-2xl font-bold">{stats?.total || 0}</p>
                  <p className="text-blue-100 text-xs">Toutes catégories</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Urgentes</p>
                  <p className="text-2xl font-bold">{stats?.urgentes || 0}</p>
                  <p className="text-red-100 text-xs">Action immédiate</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Traitées</p>
                  <p className="text-2xl font-bold">{stats?.traites || 0}</p>
                  <p className="text-green-100 text-xs">Terminées</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Confidentielles</p>
                  <p className="text-2xl font-bold">{stats?.confidentielles || 0}</p>
                  <p className="text-yellow-100 text-xs">Accès restreint</p>
                </div>
                <Shield className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques détaillées */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Statuts des Communications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Envoyées</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">{stats?.envoyes || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Inbox className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Reçues</span>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">{stats?.recus || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Lues</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">{stats?.lus || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Traitées</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{stats?.traites || 0}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-orange-600" />
                Niveaux de Priorité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Urgente</span>
                    <span>{stats?.urgentes || 0}</span>
                  </div>
                  <Progress value={(stats?.urgentes || 0) / (stats?.total || 1) * 100} className="h-2 bg-red-100" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Haute</span>
                    <span>{stats?.hautes || 0}</span>
                  </div>
                  <Progress value={(stats?.hautes || 0) / (stats?.total || 1) * 100} className="h-2 bg-orange-100" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Taux de traitement</span>
                    <span>{Math.round((stats?.traites || 0) / (stats?.total || 1) * 100)}%</span>
                  </div>
                  <Progress value={(stats?.traites || 0) / (stats?.total || 1) * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Activité Récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Communications aujourd'hui</span>
                  <Badge className="bg-blue-100 text-blue-800">12</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Temps moyen de traitement</span>
                  <Badge className="bg-green-100 text-green-800">2.5h</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Accusés de réception</span>
                  <Badge className="bg-yellow-100 text-yellow-800">98%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Organismes actifs</span>
                  <Badge className="bg-purple-100 text-purple-800">45</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par objet, expéditeur, organisme..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={selectedPriorite} onValueChange={setSelectedPriorite}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes priorités</SelectItem>
                  <SelectItem value="URGENTE">Urgente</SelectItem>
                  <SelectItem value="HAUTE">Haute</SelectItem>
                  <SelectItem value="MOYENNE">Moyenne</SelectItem>
                  <SelectItem value="BASSE">Basse</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStatut} onValueChange={setSelectedStatut}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="ENVOYE">Envoyé</SelectItem>
                  <SelectItem value="RECU">Reçu</SelectItem>
                  <SelectItem value="LU">Lu</SelectItem>
                  <SelectItem value="TRAITE">Traité</SelectItem>
                  <SelectItem value="ARCHIVE">Archivé</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedConfidentialite} onValueChange={setSelectedConfidentialite}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Confidentialité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous niveaux</SelectItem>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                  <SelectItem value="INTERNE">Interne</SelectItem>
                  <SelectItem value="CONFIDENTIEL">Confidentiel</SelectItem>
                  <SelectItem value="SECRET">Secret</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedPriorite('all');
                  setSelectedStatut('all');
                  setSelectedOrganisme('all');
                  setSelectedConfidentialite('all');
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des communications */}
        <div className="space-y-4">
          {filteredCommunications.map((communication) => {
            const ConfidentialiteIcon = getConfidentialiteIcon(communication.confidentialite);

            return (
              <Card
                key={communication.id}
                className={`border-l-4 ${
                  communication.priorite === 'URGENTE' ? 'border-l-red-500' :
                  communication.priorite === 'HAUTE' ? 'border-l-orange-500' :
                  communication.priorite === 'MOYENNE' ? 'border-l-yellow-500' :
                  'border-l-green-500'
                } hover:shadow-lg transition-all duration-300`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header de la communication */}
                      <div className="flex items-center gap-3 mb-3">
                        <ConfidentialiteIcon className="h-5 w-5 text-gray-600" />
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                          {communication.objet}
                        </h3>
                        <div className="flex gap-2">
                          <Badge className={getPrioriteColor(communication.priorite)}>
                            {communication.priorite}
                          </Badge>
                          <Badge className={getStatutColor(communication.statut)}>
                            {communication.statut}
                          </Badge>
                        </div>
                      </div>

                      {/* Expéditeur et destinataire */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <Send className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {communication.expediteur.nom}
                            </p>
                            <p className="text-xs text-gray-600">
                              {communication.expediteur.poste}
                            </p>
                            <p className="text-xs text-blue-600">
                              {communication.expediteur.organisme}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Inbox className="h-4 w-4 text-purple-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {communication.destinataire.nom}
                            </p>
                            <p className="text-xs text-gray-600">
                              {communication.destinataire.poste}
                            </p>
                            <p className="text-xs text-purple-600">
                              {communication.destinataire.organisme}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Contenu aperçu */}
                      <p className="text-gray-700 text-sm line-clamp-2 mb-4">
                        {communication.contenu}
                      </p>

                      {/* Informations complémentaires */}
                      <div className="flex items-center gap-6 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Envoyé le {formatDate(communication.dateEnvoi)}</span>
                        </div>

                        {communication.pieceJointe && (
                          <div className="flex items-center gap-1">
                            <Paperclip className="h-3 w-3" />
                            <span>{communication.pieceJointe.nom} ({communication.pieceJointe.taille}MB)</span>
                          </div>
                        )}

                        {communication.accuseReception && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span>Accusé de réception</span>
                          </div>
                        )}

                        {communication.dateLecture && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3 text-blue-600" />
                            <span>Lu le {formatDate(communication.dateLecture)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCommunication(communication);
                          setIsDetailsModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {communication.statut === 'RECU' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(communication.id)}
                          disabled={loadingStates.marking === communication.id}
                        >
                          {loadingStates.marking === communication.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleArchive(communication.id)}
                        disabled={loadingStates.archiving === communication.id}
                      >
                        {loadingStates.archiving === communication.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Archive className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredCommunications.length === 0 && (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune communication trouvée</h3>
              <p className="text-gray-600 mb-4">
                Aucune communication ne correspond aux critères de recherche actuels.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedPriorite('all');
                  setSelectedStatut('all');
                  setSelectedOrganisme('all');
                  setSelectedConfidentialite('all');
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>

        {/* Footer avec résumé */}
        {filteredCommunications.length > 0 && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Affichage de {filteredCommunications.length} communication(s) sur {communications.length} total
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-red-600">
                    {filteredCommunications.filter(c => c.priorite === 'URGENTE').length} Urgentes
                  </span>
                  <span className="text-green-600">
                    {filteredCommunications.filter(c => c.statut === 'TRAITE').length} Traitées
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal nouvelle communication */}
        <Dialog open={isNewCommModalOpen} onOpenChange={setIsNewCommModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouvelle Communication Inter-Administration</DialogTitle>
              <DialogDescription>
                Envoyer une communication officielle entre organismes publics gabonais
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Expéditeur */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="expediteurNom">Nom de l'expéditeur</Label>
                  <Input
                    id="expediteurNom"
                    value={newCommForm.expediteurNom}
                    onChange={(e) => setNewCommForm(prev => ({ ...prev, expediteurNom: e.target.value }))}
                    placeholder="Nom complet"
                  />
                </div>
                <div>
                  <Label htmlFor="expediteurOrganisme">Organisme expéditeur</Label>
                  <Input
                    id="expediteurOrganisme"
                    value={newCommForm.expediteurOrganisme}
                    onChange={(e) => setNewCommForm(prev => ({ ...prev, expediteurOrganisme: e.target.value }))}
                    placeholder="Nom de l'organisme"
                  />
                </div>
                <div>
                  <Label htmlFor="expediteurPoste">Poste/Fonction</Label>
                  <Input
                    id="expediteurPoste"
                    value={newCommForm.expediteurPoste}
                    onChange={(e) => setNewCommForm(prev => ({ ...prev, expediteurPoste: e.target.value }))}
                    placeholder="Fonction ou titre"
                  />
                </div>
              </div>

              {/* Destinataire */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="destinataireNom">Nom du destinataire</Label>
                  <Input
                    id="destinataireNom"
                    value={newCommForm.destinataireNom}
                    onChange={(e) => setNewCommForm(prev => ({ ...prev, destinataireNom: e.target.value }))}
                    placeholder="Nom complet"
                  />
                </div>
                <div>
                  <Label htmlFor="destinataireOrganisme">Organisme destinataire</Label>
                  <Input
                    id="destinataireOrganisme"
                    value={newCommForm.destinataireOrganisme}
                    onChange={(e) => setNewCommForm(prev => ({ ...prev, destinataireOrganisme: e.target.value }))}
                    placeholder="Nom de l'organisme"
                  />
                </div>
                <div>
                  <Label htmlFor="destinatairePoste">Poste/Fonction</Label>
                  <Input
                    id="destinatairePoste"
                    value={newCommForm.destinatairePoste}
                    onChange={(e) => setNewCommForm(prev => ({ ...prev, destinatairePoste: e.target.value }))}
                    placeholder="Fonction ou titre"
                  />
                </div>
              </div>

              {/* Objet */}
              <div>
                <Label htmlFor="objet">Objet de la communication</Label>
                <Input
                  id="objet"
                  value={newCommForm.objet}
                  onChange={(e) => setNewCommForm(prev => ({ ...prev, objet: e.target.value }))}
                  placeholder="Objet concis et précis"
                />
              </div>

              {/* Contenu */}
              <div>
                <Label htmlFor="contenu">Contenu de la communication</Label>
                <Textarea
                  id="contenu"
                  value={newCommForm.contenu}
                  onChange={(e) => setNewCommForm(prev => ({ ...prev, contenu: e.target.value }))}
                  placeholder="Rédigez votre message officiel ici..."
                  rows={6}
                />
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priorite">Niveau de priorité</Label>
                  <Select
                    value={newCommForm.priorite}
                    onValueChange={(value: Communication['priorite']) =>
                      setNewCommForm(prev => ({ ...prev, priorite: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BASSE">Basse</SelectItem>
                      <SelectItem value="MOYENNE">Moyenne</SelectItem>
                      <SelectItem value="HAUTE">Haute</SelectItem>
                      <SelectItem value="URGENTE">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="confidentialite">Niveau de confidentialité</Label>
                  <Select
                    value={newCommForm.confidentialite}
                    onValueChange={(value: Communication['confidentialite']) =>
                      setNewCommForm(prev => ({ ...prev, confidentialite: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="INTERNE">Interne</SelectItem>
                      <SelectItem value="CONFIDENTIEL">Confidentiel</SelectItem>
                      <SelectItem value="SECRET">Secret</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsNewCommModalOpen(false)}>
                  Annuler
                </Button>
                <Button
                  onClick={handleSendCommunication}
                  disabled={
                    loadingStates.sending ||
                    !newCommForm.objet?.trim() ||
                    !newCommForm.contenu?.trim() ||
                    !newCommForm.expediteurNom?.trim() ||
                    !newCommForm.destinataireNom?.trim() ||
                    newCommForm.objet.length < 5 ||
                    newCommForm.contenu.length < 20
                  }
                >
                  {loadingStates.sending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer la Communication
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal détails communication */}
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Détails de la Communication</DialogTitle>
              <DialogDescription>
                Communication #{selectedCommunication?.id}
              </DialogDescription>
            </DialogHeader>

            {selectedCommunication && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Badge className={getPrioriteColor(selectedCommunication.priorite)}>
                    {selectedCommunication.priorite}
                  </Badge>
                  <Badge className={getStatutColor(selectedCommunication.statut)}>
                    {selectedCommunication.statut}
                  </Badge>
                  <Badge variant="outline">
                    {selectedCommunication.confidentialite}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">{selectedCommunication.objet}</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedCommunication.contenu}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Expéditeur</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">{selectedCommunication.expediteur.nom}</p>
                      <p className="text-sm text-gray-600">{selectedCommunication.expediteur.poste}</p>
                      <p className="text-sm text-blue-600">{selectedCommunication.expediteur.organisme}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Destinataire</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium">{selectedCommunication.destinataire.nom}</p>
                      <p className="text-sm text-gray-600">{selectedCommunication.destinataire.poste}</p>
                      <p className="text-sm text-purple-600">{selectedCommunication.destinataire.organisme}</p>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-500 space-y-1">
                  <p>Envoyé le : {formatDate(selectedCommunication.dateEnvoi)}</p>
                  {selectedCommunication.dateLecture && (
                    <p>Lu le : {formatDate(selectedCommunication.dateLecture)}</p>
                  )}
                  {selectedCommunication.dateTraitement && (
                    <p>Traité le : {formatDate(selectedCommunication.dateTraitement)}</p>
                  )}
                </div>

                {selectedCommunication.pieceJointe && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Pièce jointe</h4>
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4" />
                      <span>{selectedCommunication.pieceJointe.nom}</span>
                      <Badge variant="outline">{selectedCommunication.pieceJointe.taille}MB</Badge>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  );
}
