/* @ts-nocheck */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Download,
  Star,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function CitoyenDashboard() {
  const { data: session } = useSession();
  const [isDemoAccount, setIsDemoAccount] = useState(false);

  useEffect(() => {
    if (session?.user?.email === 'demo.citoyen@demarche.ga') {
      setIsDemoAccount(true);
    }
  }, [session]);

  // Données enrichies pour le compte démo
  const stats = isDemoAccount ? {
    demandesEnCours: 2,
    demandesCompletes: 12,
    prochainRdv: new Date('2024-01-18T14:30:00'),
    profilComplete: 100
  } : {
    demandesEnCours: 3,
    demandesCompletes: 8,
    prochainRdv: new Date('2024-01-15T10:00:00'),
    profilComplete: 75
  };

  const demandesRecentes = isDemoAccount ? [
    {
      id: 'DEMO-001',
      type: 'Passeport biométrique',
      status: 'READY',
      dateCreation: new Date('2024-01-05'),
      estimeeCompletion: new Date('2024-01-18'),
      agent: 'Sophie MEKAME',
      organisation: 'DGDI - Direction Générale Documentation',
      priority: 'URGENT'
    },
    {
      id: 'DEMO-002',
      type: 'Immatriculation CNSS',
      status: 'COMPLETED',
      dateCreation: new Date('2024-01-03'),
      estimeeCompletion: new Date('2024-01-12'),
      agent: 'Paul MBOUMBA',
      organisation: 'Caisse Nationale de Sécurité Sociale',
      rating: 5
    },
    {
      id: 'DEMO-003',
      type: 'Certificat de résidence',
      status: 'IN_PROGRESS',
      dateCreation: new Date('2024-01-14'),
      estimeeCompletion: new Date('2024-01-22'),
      agent: 'Marie-Claire MBADINGA',
      organisation: 'Mairie de Libreville'
    }
  ] : [
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
    }
  ];

  const prochainRdv = isDemoAccount ? [
    {
      id: 'DEMO-RDV-001',
      date: new Date('2024-01-18T14:30:00'),
      service: 'Récupération passeport biométrique',
      lieu: 'DGDI - Guichet VIP (Bâtiment principal)',
      agent: 'Sophie MEKAME',
      statut: 'CONFIRMED',
      priority: true
    },
    {
      id: 'DEMO-RDV-002', 
      date: new Date('2024-01-22T09:15:00'),
      service: 'Finalisation certificat de résidence',
      lieu: 'Mairie de Libreville - Bureau 12A',
      agent: 'Marie-Claire MBADINGA',
      statut: 'SCHEDULED'
    }
  ] : [
    {
      id: 'RDV-001',
      date: new Date('2024-01-15T10:00:00'),
      service: 'Récupération acte de naissance',
      lieu: 'Mairie de Libreville - Bureau 205',
      agent: 'Paul OBIANG',
      statut: 'CONFIRMED'
    }
  ];

  const mesDocuments = isDemoAccount ? [
    {
      id: 'DEMO-DOC-001',
      nom: 'Acte de naissance certifié',
      type: 'PDF',
      taille: '425 KB',
      dateAjout: new Date('2024-01-05'),
      statut: 'VERIFIE',
      certified: true
    },
    {
      id: 'DEMO-DOC-002',
      nom: 'Photo d\'identité biométrique',
      type: 'JPG', 
      taille: '256 KB',
      dateAjout: new Date('2024-01-03'),
      statut: 'VERIFIE',
      certified: true
    },
    {
      id: 'DEMO-DOC-003',
      nom: 'Justificatif de domicile (Facture SEEG)',
      type: 'PDF',
      taille: '1.2 MB', 
      dateAjout: new Date('2024-01-02'),
      statut: 'VERIFIE',
      certified: true
    }
  ] : [
    {
      id: 'DOC-001',
      nom: 'Acte de naissance',
      type: 'PDF',
      taille: '245 KB',
      dateAjout: new Date('2024-01-10'),
      statut: 'VERIFIE'
    }
  ];

  const getStatusBadge = (status: string, priority?: string, rating?: number) => {
    const badges = [];
    
    switch (status) {
      case 'SUBMITTED':
        badges.push(<Badge key="status" variant="secondary">Soumis</Badge>);
        break;
      case 'IN_PROGRESS':
        badges.push(<Badge key="status" variant="default">En cours</Badge>);
        break;
      case 'VALIDATED':
        badges.push(<Badge key="status" variant="outline" className="text-green-600 border-green-600">Validé</Badge>);
        break;
      case 'READY':
        badges.push(<Badge key="status" variant="outline" className="text-blue-600 border-blue-600">Prêt à récupérer</Badge>);
        break;
      case 'COMPLETED':
        badges.push(<Badge key="status" variant="outline" className="text-green-700 border-green-700">Terminé</Badge>);
        break;
      default:
        badges.push(<Badge key="status" variant="secondary">{status}</Badge>);
    }
    
    if (priority === 'URGENT') {
      badges.push(<Badge key="priority" variant="destructive" className="ml-1">Urgent</Badge>);
    }
    
    if (rating === 5) {
      badges.push(
        <Badge key="rating" variant="outline" className="text-yellow-600 border-yellow-600 ml-1">
          <Star className="w-3 h-3 mr-1" />
          Excellent
        </Badge>
      );
    }
    
    return badges;
  };

  const getDocumentStatusBadge = (status: string, certified?: boolean, recent?: boolean) => {
    const badges = [];
    
    switch (status) {
      case 'VERIFIE':
        badges.push(<Badge key="status" variant="outline" className="text-green-600 border-green-600">Vérifié</Badge>);
        break;
      case 'EN_ATTENTE':
        badges.push(<Badge key="status" variant="secondary">En attente</Badge>);
        break;
      case 'REJETE':
        badges.push(<Badge key="status" variant="destructive">Rejeté</Badge>);
        break;
      default:
        badges.push(<Badge key="status" variant="secondary">{status}</Badge>);
    }
    
    if (certified) {
      badges.push(
        <Badge key="certified" variant="outline" className="text-blue-600 border-blue-600 ml-1">
          <Award className="w-3 h-3 mr-1" />
          Certifié
        </Badge>
      );
    }
    
    if (recent) {
      badges.push(<Badge key="recent" variant="outline" className="text-purple-600 border-purple-600 ml-1">Nouveau</Badge>);
    }
    
    return badges;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header DEMARCHE.GA */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Bienvenue sur DEMARCHE.GA
                {isDemoAccount && (
                  <Badge variant="outline" className="ml-3 bg-white/20 text-white border-white/30">
                    <Star className="w-4 h-4 mr-1" />
                    Mode Démo
                  </Badge>
                )}
              </h1>
              <p className="text-xl text-blue-100 mb-4">
                {isDemoAccount 
                  ? `Bonjour ${session?.user?.firstName} ! Explorez tous vos services administratifs` 
                  : "Votre espace personnel pour toutes vos démarches administratives"
                }
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                  <span>85+ Services disponibles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                  <span>28 Organismes connectés</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                  <span>Disponible 24h/7</span>
                </div>
              </div>
            </div>
            {isDemoAccount && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <Award className="w-8 h-8 text-yellow-300" />
                  <div>
                    <p className="font-semibold">Compte de Démonstration</p>
                    <p className="text-sm text-blue-100">Toutes les fonctionnalités activées</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistiques DEMARCHE.GA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Démarches en cours</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.demandesEnCours}</div>
            <p className="text-xs text-gray-600">
              {isDemoAccount ? "En traitement prioritaire" : "+2 depuis le mois dernier"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Démarches terminées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.demandesCompletes}</div>
            <p className="text-xs text-gray-600">
              {isDemoAccount ? "Avec service excellent" : "Depuis votre inscription"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Prochain RDV</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {isDemoAccount ? "18 Jan" : "15 Jan"}
            </div>
            <p className="text-xs text-gray-600">
              {isDemoAccount ? "14:30 - DGDI (Prioritaire)" : "10:00 - Mairie de Libreville"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Profil DEMARCHE.GA</CardTitle>
            <User className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.profilComplete}%</div>
            <Progress value={stats.profilComplete} className="mt-2" />
            <p className="text-xs text-gray-600 mt-1">
              {isDemoAccount ? "Accès privilégié" : "Complétez pour plus de services"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actions Rapides DEMARCHE.GA */}
        <Card className="lg:col-span-1 shadow-lg border-t-4 border-t-blue-500">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
            <CardTitle className="text-blue-700">Services DEMARCHE.GA</CardTitle>
            <CardDescription>
              Lancez vos démarches administratives
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700" asChild>
              <Link href="/citoyen/demandes/nouvelle">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Démarche
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start border-blue-200 hover:bg-blue-50" asChild>
              <Link href="/citoyen/rendez-vous/nouveau">
                <Calendar className="mr-2 h-4 w-4" />
                Prendre RDV
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start border-purple-200 hover:bg-purple-50" asChild>
              <Link href="/citoyen/profil">
                <User className="mr-2 h-4 w-4" />
                Mon Profil
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start border-green-200 hover:bg-green-50" asChild>
              <Link href="/citoyen/documents">
                <Upload className="mr-2 h-4 w-4" />
                Mes Documents
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Demandes Récentes DEMARCHE.GA */}
        <Card className="lg:col-span-2 shadow-lg border-t-4 border-t-green-500">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-green-700">Mes Démarches DEMARCHE.GA</CardTitle>
                <CardDescription>
                  Suivi en temps réel de toutes vos demandes administratives
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-green-200 hover:bg-green-50" asChild>
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
                    <div className="flex items-center space-x-2 flex-wrap">
                      <p className="font-medium">{demande.type}</p>
                      {getStatusBadge(demande.status, demande.priority, demande.rating)}
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
        <Card className="shadow-lg border-t-4 border-t-purple-500">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-purple-700">Mes Rendez-vous DEMARCHE.GA</CardTitle>
                <CardDescription>
                  Vos rendez-vous programmés
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-purple-200 hover:bg-purple-50" asChild>
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
                    <div className="flex items-center space-x-2">
                      <Badge variant={rdv.statut === 'CONFIRMED' ? 'default' : 'secondary'}>
                        {rdv.statut === 'CONFIRMED' ? 'Confirmé' : 'Programmé'}
                      </Badge>
                      {rdv.priority && (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          <Star className="w-3 h-3 mr-1" />
                          Prioritaire
                        </Badge>
                      )}
                    </div>
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
        <Card className="shadow-lg border-t-4 border-t-orange-500">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-orange-700">Mes Documents DEMARCHE.GA</CardTitle>
                <CardDescription>
                  Documents personnels et justificatifs
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50" asChild>
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
                    {getDocumentStatusBadge(doc.statut, doc.certified, doc.recent)}
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

      {/* Notifications DEMARCHE.GA */}
      <Card className="shadow-lg border-t-4 border-t-indigo-500">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-indigo-700">Notifications DEMARCHE.GA</CardTitle>
              <CardDescription>
                Restez informé de l'avancement de vos démarches
              </CardDescription>
            </div>
            <Bell className="h-5 w-5 text-indigo-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isDemoAccount ? (
              <>
                <div className="flex items-start space-x-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-l-4 border-green-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">🎉 Passeport biométrique prêt !</p>
                    <p className="text-sm text-muted-foreground">
                      Votre passeport biométrique est disponible au guichet VIP de la DGDI. Traitement express réussi !
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Il y a 30 minutes</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">⭐ Service Excellence CNSS</p>
                    <p className="text-sm text-muted-foreground">
                      Votre immatriculation CNSS a été traitée avec un service 5 étoiles. Carte disponible en téléchargement.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Il y a 2 heures</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border-l-4 border-purple-500">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">🏆 Profil complet à 100%</p>
                    <p className="text-sm text-muted-foreground">
                      Félicitations ! Votre profil est maintenant complet. Accès privilégié à tous les services.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Hier à 16:45</p>
                  </div>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}