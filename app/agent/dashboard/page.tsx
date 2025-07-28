/* @ts-nocheck */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { useAuth } from '@/hooks/use-auth';
import { 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle,
  Users,
  AlertCircle,
  ArrowRight,
  Eye,
  CheckSquare,
  XSquare,
  MessageSquare,
  TrendingUp
} from 'lucide-react';

export default function AgentDashboard() {
  const { user, isLoading } = useAuth('AGENT');

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  // Mock data - À remplacer par de vraies données
  const stats = {
    enAttente: 8,
    enCours: 5,
    completees: 142,
    rdvAujourdhui: 6
  };

  const demandesEnCours = [
    {
      id: 'GA-2024-001',
      type: 'Acte de naissance',
      citoyen: 'Jean DUPONT',
      statut: 'IN_PROGRESS',
      urgence: 'normale',
      dateCreation: '2024-01-10',
      dateEstimee: '2024-01-20',
      documentsManquants: 0
    },
    {
      id: 'GA-2024-002',
      type: 'Certificat de résidence',
      citoyen: 'Marie SMITH',
      statut: 'PENDING_DOCUMENTS',
      urgence: 'haute',
      dateCreation: '2024-01-09',
      dateEstimee: '2024-01-18',
      documentsManquants: 2
    },
    {
      id: 'GA-2024-003',
      type: 'Acte de mariage',
      citoyen: 'Paul MARTIN',
      statut: 'VALIDATED',
      urgence: 'normale',
      dateCreation: '2024-01-08',
      dateEstimee: '2024-01-15',
      documentsManquants: 0
    },
    {
      id: 'GA-2024-004',
      type: 'Certificat de vie',
      citoyen: 'Sylvie NZENGUE',
      statut: 'SUBMITTED',
      urgence: 'normale',
      dateCreation: '2024-01-12',
      dateEstimee: '2024-01-22',
      documentsManquants: 1
    }
  ];

  const planningJour = [
    {
      id: 'RDV-001',
      heure: '09:00',
      citoyen: 'Jean DUPONT',
      service: 'Récupération acte de naissance',
      statut: 'CONFIRMED',
      duree: 30
    },
    {
      id: 'RDV-002',
      heure: '10:00',
      citoyen: 'Marie OKOUYI',
      service: 'Dépôt dossier certificat résidence',
      statut: 'SCHEDULED',
      duree: 45
    },
    {
      id: 'RDV-003',
      heure: '11:30',
      citoyen: 'Paul NZIGOU',
      service: 'Signature acte de mariage',
      statut: 'CONFIRMED',
      duree: 30
    },
    {
      id: 'RDV-004',
      heure: '14:00',
      citoyen: 'Fatima BONGO',
      service: 'Consultation dossier',
      statut: 'SCHEDULED',
      duree: 20
    },
    {
      id: 'RDV-005',
      heure: '15:30',
      citoyen: 'André MBA',
      service: 'Remise certificat de vie',
      statut: 'CONFIRMED',
      duree: 15
    }
  ];

  const statistiquesPersonnelles = {
    demandesTraitees: 142,
    tempsMoyenTraitement: 2.5,
    tauxSatisfaction: 98,
    objectifMensuel: 95
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <Badge variant="secondary">Nouveau</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="default">En cours</Badge>;
      case 'PENDING_DOCUMENTS':
        return <Badge variant="destructive">Documents manquants</Badge>;
      case 'VALIDATED':
        return <Badge variant="outline" className="text-green-600 border-green-600">Validé</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getUrgenceBadge = (urgence: string) => {
    switch (urgence) {
      case 'haute':
        return <Badge variant="destructive" className="text-xs">Urgent</Badge>;
      case 'moyenne':
        return <Badge variant="secondary" className="text-xs">Moyen</Badge>;
      default:
        return null;
    }
  };

  const getRdvStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge variant="default" className="text-xs">Confirmé</Badge>;
      case 'SCHEDULED':
        return <Badge variant="secondary" className="text-xs">Programmé</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Espace Agent</h1>
          <p className="text-muted-foreground">
            Bienvenue {user?.firstName} {user?.lastName} - Service État Civil
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.enAttente}</div>
              <p className="text-xs text-muted-foreground">
                À traiter aujourd'hui
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En cours</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.enCours}</div>
              <p className="text-xs text-muted-foreground">
                En traitement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Complétées</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completees}</div>
              <p className="text-xs text-muted-foreground">
                Total ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">RDV Aujourd'hui</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.rdvAujourdhui}</div>
              <p className="text-xs text-muted-foreground">
                Rendez-vous programmés
              </p>
            </CardContent>
          </Card>
        </div>

        {/* File d'attente */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Ma file d'attente</CardTitle>
                <CardDescription>
                  Demandes assignées nécessitant votre attention
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demandesEnCours.map((demande) => (
                <div key={demande.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{demande.type}</p>
                      {getStatusBadge(demande.statut)}
                      {getUrgenceBadge(demande.urgence)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Demandeur: <span className="font-medium">{demande.citoyen}</span>
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>#{demande.id}</span>
                      <span>Créée le {new Date(demande.dateCreation).toLocaleDateString('fr-FR')}</span>
                      <span>Échéance: {new Date(demande.dateEstimee).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {demande.documentsManquants > 0 && (
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-orange-600">
                          {demande.documentsManquants} document(s) manquant(s)
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Voir
                    </Button>
                    <Button size="sm">
                      Traiter
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Planning et Statistiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Planning du jour */}
          <Card>
            <CardHeader>
              <CardTitle>Planning du jour</CardTitle>
              <CardDescription>
                Vos rendez-vous programmés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {planningJour.map((rdv) => (
                  <div key={rdv.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-medium text-primary min-w-[50px]">
                        {rdv.heure}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{rdv.citoyen}</p>
                        <p className="text-xs text-muted-foreground">{rdv.service}</p>
                        <p className="text-xs text-muted-foreground">{rdv.duree} min</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getRdvStatusBadge(rdv.statut)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Statistiques personnelles */}
          <Card>
            <CardHeader>
              <CardTitle>Mes performances</CardTitle>
              <CardDescription>
                Vos statistiques ce mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Demandes traitées</span>
                  </div>
                  <span className="text-lg font-bold">{statistiquesPersonnelles.demandesTraitees}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Temps moyen de traitement</span>
                  </div>
                  <span className="text-lg font-bold">{statistiquesPersonnelles.tempsMoyenTraitement} jours</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Taux de satisfaction</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{statistiquesPersonnelles.tauxSatisfaction}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Objectif mensuel</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">{statistiquesPersonnelles.objectifMensuel}% atteint</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Outils de traitement des demandes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-24 flex-col space-y-2">
                <CheckSquare className="h-6 w-6" />
                <span className="text-xs">Valider</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col space-y-2">
                <XSquare className="h-6 w-6" />
                <span className="text-xs">Rejeter</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col space-y-2">
                <MessageSquare className="h-6 w-6" />
                <span className="text-xs">Demander complément</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col space-y-2">
                <FileText className="h-6 w-6" />
                <span className="text-xs">Nouveau dossier</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}