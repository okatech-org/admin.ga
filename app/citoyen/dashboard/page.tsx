/* @ts-nocheck */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  ArrowRight,
  User,
  Bell,
  Upload,
  Download
} from 'lucide-react';
import Link from 'next/link';

export default function CitoyenDashboard() {
  // Mock data - À remplacer par de vraies données
  const stats = {
    demandesEnCours: 3,
    demandesCompletes: 8,
    prochainRdv: new Date('2024-01-15T10:00:00'),
    profilComplete: 75
  };

  const demandesRecentes = [
    {
      id: 'REQ-001',
      type: 'Acte de naissance',
      status: 'IN_PROGRESS',
      dateCreation: new Date('2024-01-10'),
      estimeeCompletion: new Date('2024-01-20'),
      agent: 'Paul OBIANG',
      organisation: 'Mairie de Libreville'
    },
    {
      id: 'REQ-002',
      type: 'Casier judiciaire',
      status: 'VALIDATED',
      dateCreation: new Date('2024-01-08'),
      estimeeCompletion: new Date('2024-01-15'),
      agent: 'Marie NZENGUE',
      organisation: 'Ministère de la Justice'
    },
    {
      id: 'REQ-003',
      type: 'Certificat de résidence',
      status: 'SUBMITTED',
      dateCreation: new Date('2024-01-12'),
      estimeeCompletion: new Date('2024-01-25'),
      agent: 'En attente d\'assignation',
      organisation: 'Mairie de Libreville'
    }
  ];

  const prochainRdv = [
    {
      id: 'RDV-001',
      date: new Date('2024-01-15T10:00:00'),
      service: 'Récupération acte de naissance',
      lieu: 'Mairie de Libreville - Bureau 205',
      agent: 'Paul OBIANG',
      statut: 'CONFIRMED'
    },
    {
      id: 'RDV-002', 
      date: new Date('2024-01-18T14:30:00'),
      service: 'Dépôt dossier passeport',
      lieu: 'DGDI - Guichet 3',
      agent: 'Fatima BOUKOUMOU',
      statut: 'SCHEDULED'
    }
  ];

  const mesDocuments = [
    {
      id: 'DOC-001',
      nom: 'Acte de naissance',
      type: 'PDF',
      taille: '245 KB',
      dateAjout: new Date('2024-01-10'),
      statut: 'VERIFIE'
    },
    {
      id: 'DOC-002',
      nom: 'Photo d\'identité',
      type: 'JPG', 
      taille: '156 KB',
      dateAjout: new Date('2024-01-09'),
      statut: 'EN_ATTENTE'
    },
    {
      id: 'DOC-003',
      nom: 'Justificatif de domicile',
      type: 'PDF',
      taille: '892 KB', 
      dateAjout: new Date('2024-01-08'),
      statut: 'VERIFIE'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <Badge variant="secondary">Soumis</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="default">En cours</Badge>;
      case 'VALIDATED':
        return <Badge variant="outline" className="text-green-600 border-green-600">Validé</Badge>;
      case 'READY':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Prêt</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline" className="text-green-700 border-green-700">Terminé</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIE':
        return <Badge variant="outline" className="text-green-600 border-green-600">Vérifié</Badge>;
      case 'EN_ATTENTE':
        return <Badge variant="secondary">En attente</Badge>;
      case 'REJETE':
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Bienvenue dans votre espace personnel Admin.ga
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Demandes en cours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.demandesEnCours}</div>
              <p className="text-xs text-muted-foreground">
                +2 depuis le mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Demandes complétées</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.demandesCompletes}</div>
              <p className="text-xs text-muted-foreground">
                Depuis votre inscription
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prochain RDV</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15 Jan</div>
              <p className="text-xs text-muted-foreground">
                10:00 - Mairie de Libreville
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profil</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.profilComplete}%</div>
              <Progress value={stats.profilComplete} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Actions Rapides */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>
                Commencez une nouvelle démarche
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" asChild>
                <Link href="/citoyen/demandes/nouvelle">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle demande
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/citoyen/rendez-vous/nouveau">
                  <Calendar className="mr-2 h-4 w-4" />
                  Prendre RDV
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/citoyen/profil">
                  <User className="mr-2 h-4 w-4" />
                  Compléter profil
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/citoyen/documents">
                  <Upload className="mr-2 h-4 w-4" />
                  Mes documents
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Demandes Récentes */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mes demandes en cours</CardTitle>
                  <CardDescription>
                    Suivi de vos démarches administratives
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/citoyen/demandes">
                    Voir tout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demandesRecentes.map((demande) => (
                  <div key={demande.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{demande.type}</p>
                        {getStatusBadge(demande.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Demande #{demande.id} • Créée le {demande.dateCreation.toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Agent: {demande.agent} • {demande.organisation}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Estimée pour le {demande.estimeeCompletion.toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rendez-vous et Documents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prochains Rendez-vous */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mes prochains rendez-vous</CardTitle>
                  <CardDescription>
                    Vos rendez-vous programmés
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/citoyen/rendez-vous">
                    Voir tout
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prochainRdv.map((rdv) => (
                  <div key={rdv.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={rdv.statut === 'CONFIRMED' ? 'default' : 'secondary'}>
                        {rdv.statut === 'CONFIRMED' ? 'Confirmé' : 'Programmé'}
                      </Badge>
                      <span className="text-sm font-medium">
                        {rdv.date.toLocaleDateString('fr-FR')} à {rdv.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h4 className="font-medium">{rdv.service}</h4>
                    <p className="text-sm text-muted-foreground">{rdv.lieu}</p>
                    <p className="text-sm text-muted-foreground">Agent: {rdv.agent}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mes Documents */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mes documents</CardTitle>
                  <CardDescription>
                    Documents personnels et justificatifs
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/citoyen/documents">
                    <Upload className="mr-2 h-4 w-4" />
                    Ajouter
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mesDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.nom}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} • {doc.taille} • {doc.dateAjout.toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getDocumentStatusBadge(doc.statut)}
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Notifications récentes</CardTitle>
                <CardDescription>
                  Restez informé de l'avancement de vos démarches
                </CardDescription>
              </div>
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Document prêt à récupérer</p>
                  <p className="text-sm text-muted-foreground">
                    Votre casier judiciaire est prêt. Vous pouvez le récupérer à la DGDI.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Il y a 2 heures</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Demande validée</p>
                  <p className="text-sm text-muted-foreground">
                    Votre demande d'acte de naissance a été validée par l'agent.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Hier à 14:30</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Rendez-vous confirmé</p>
                  <p className="text-sm text-muted-foreground">
                    Votre rendez-vous du 15 janvier à 10h00 a été confirmé.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Il y a 3 jours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}