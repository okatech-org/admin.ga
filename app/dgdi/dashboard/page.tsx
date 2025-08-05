/* @ts-nocheck */
/* eslint-disable react/no-unknown-property */
/* webhint-disable no-inline-styles */
/* @typescript-eslint/no-explicit-any */
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
  Award,
  Users,
  BarChart3,
  TrendingUp,
  Eye,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getOrganismeBranding } from '@/lib/config/organismes-branding';

export default function DGDIDashboard() {
  const { data: session } = useSession();
  const [isDemoAccount, setIsDemoAccount] = useState(false);
  const branding = getOrganismeBranding('DGDI');

  useEffect(() => {
    if (session?.user?.email === 'demo.dgdi@admin.ga') {
      setIsDemoAccount(true);
    }
  }, [session]);

  // Données spécifiques DGDI
  const stats = {
    demandesEnCours: 145,
    demandesCompletes: 2847,
    passportsEmis: 89,
    cnisDelivrees: 234,
    tempsMoyenTraitement: '3.2 jours'
  };

  const demandesRecentes = [
    {
      id: 'DGDI-2024-001',
      type: 'Passeport biométrique',
      demandeur: 'Marie NTOUTOUME',
      status: 'IN_PROGRESS',
      dateCreation: new Date('2024-01-15'),
      estimeeCompletion: new Date('2024-01-20'),
      agent: 'Sophie MEKAME',
      priority: 'NORMAL'
    },
    {
      id: 'DGDI-2024-002',
      type: 'Carte Nationale d\'Identité',
      demandeur: 'Paul MBADINGA',
      status: 'READY',
      dateCreation: new Date('2024-01-10'),
      estimeeCompletion: new Date('2024-01-18'),
      agent: 'Jean OBIANG',
      priority: 'URGENT'
    },
    {
      id: 'DGDI-2024-003',
      type: 'Renouvellement CNI',
      demandeur: 'Claire OYANE',
      status: 'COMPLETED',
      dateCreation: new Date('2024-01-08'),
      estimeeCompletion: new Date('2024-01-15'),
      agent: 'Marie NZENGUE',
      rating: 5
    }
  ];

  const getStatusBadge = (status: string, priority?: string, rating?: number) => {
    const badges = [];

    switch (status) {
      case 'IN_PROGRESS':
        badges.push(<Badge key="status" variant="default" className="bg-blue-600">En cours</Badge>);
        break;
      case 'READY':
        badges.push(<Badge key="status" variant="outline" className="text-green-600 border-green-600">Prêt à récupérer</Badge>);
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
          5/5
        </Badge>
      );
    }

    return badges;
  };

  if (!branding) {
    return <div>Organisme non trouvé</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header DGDI */}
      <div className="mb-8">
        <div
          className="rounded-2xl p-8 text-white"
          style={{
            background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Tableau de bord {branding.shortName}
                {isDemoAccount && (
                  <Badge variant="outline" className="ml-3 bg-white/20 text-white border-white/30">
                    <Star className="w-4 h-4 mr-1" />
                    Mode Démo
                  </Badge>
                )}
              </h1>
              <p className="text-xl text-blue-100 mb-4">
                {branding.description}
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                  <span>Services opérationnels</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                  <span>Temps de traitement optimisé</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                  <span>Guichets VIP disponibles</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-white" />
                <div>
                  <p className="font-semibold">Direction Générale</p>
                  <p className="text-sm text-blue-100">Documentation & Immigration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques DGDI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card
          className="border-l-4 shadow-lg"
          style={{ borderLeftColor: branding.colors.primary }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="text-sm font-medium"
              style={{ color: branding.colors.primary }}
            >
              Demandes en cours
            </CardTitle>
            <Clock
              className="h-4 w-4"
              style={{ color: branding.colors.primary }}
            />
          </CardHeader>
          <CardContent>
            <div
            className="text-3xl font-bold"
            style={{ color: branding.colors.primary }}
          >
              {stats.demandesEnCours}
            </div>
            <p className="text-xs text-gray-600">
              +12 depuis hier
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Total traité
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.demandesCompletes}
            </div>
            <p className="text-xs text-gray-600">
              Ce mois
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              Passeports émis
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {stats.passportsEmis}
            </div>
            <p className="text-xs text-gray-600">
              Cette semaine
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              CNI délivrées
            </CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {stats.cnisDelivrees}
            </div>
            <p className="text-xs text-gray-600">
              Cette semaine
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-cyan-500 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cyan-700">
              Temps moyen
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-cyan-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-600">
              {stats.tempsMoyenTraitement}
            </div>
            <p className="text-xs text-gray-600">
              Traitement
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actions rapides DGDI */}
        <Card
          className="lg:col-span-1 shadow-lg border-t-4"
          style={{ borderTopColor: branding.colors.primary }}
        >
          <CardHeader
            style={{
              background: `linear-gradient(135deg, ${branding.colors.primary}10, ${branding.colors.secondary}10)`
            }}
          >
            <CardTitle
              style={{ color: branding.colors.primary }}
            >
              Services {branding.shortName}
            </CardTitle>
            <CardDescription>
              Gestion des documents d'identité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <Button
                          className="w-full justify-start text-white"
            style={{
              background: `linear-gradient(135deg, ${branding.colors.primary}, ${branding.colors.secondary})`
            }}
              asChild
            >
              <Link href="/dgdi/demandes/nouvelle">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Demande
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start hover:bg-blue-50"
              style={{ borderColor: `${branding.colors.primary}40` }}
              asChild
            >
              <Link href="/dgdi/passeports">
                <FileText className="mr-2 h-4 w-4" />
                Gestion Passeports
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start hover:bg-purple-50"
              style={{ borderColor: `${branding.colors.secondary}40` }}
              asChild
            >
              <Link href="/dgdi/cni">
                <Shield className="mr-2 h-4 w-4" />
                Gestion CNI
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start hover:bg-green-50"
              asChild
            >
              <Link href="/dgdi/stats">
                <BarChart3 className="mr-2 h-4 w-4" />
                Statistiques
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Demandes récentes DGDI */}
        <Card className="lg:col-span-2 shadow-lg border-t-4 border-t-green-500">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-green-700">Demandes Récentes DGDI</CardTitle>
                <CardDescription>
                  Suivi des demandes de documents d'identité
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-green-200 hover:bg-green-50" asChild>
                <Link href="/dgdi/demandes">
                  Voir tout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demandesRecentes.map((demande) => (
                <div key={demande.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <p className="font-medium">{demande.type}</p>
                      {getStatusBadge(demande.status, demande.priority, demande.rating)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Demandeur: <strong>{demande.demandeur}</strong> • #{demande.id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Agent: {demande.agent} • Créée le {demande.dateCreation.toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Prévue pour le {demande.estimeeCompletion.toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications DGDI */}
      <Card className="shadow-lg border-t-4 border-t-indigo-500">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-indigo-700">Notifications DGDI</CardTitle>
              <CardDescription>
                Informations importantes sur les services
              </CardDescription>
            </div>
            <Bell className="h-5 w-5 text-indigo-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-medium text-sm">📋 Nouveau processus passeport biométrique</p>
                <p className="text-sm text-muted-foreground">
                  Mise en place du nouveau système biométrique pour accélérer les délivrances. Temps réduit à 3 jours.
                </p>
                <p className="text-xs text-muted-foreground mt-1">Il y a 2 heures</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-medium text-sm">✅ Guichets VIP opérationnels</p>
                <p className="text-sm text-muted-foreground">
                  Les guichets VIP sont maintenant disponibles pour les demandes urgentes et prioritaires.
                </p>
                <p className="text-xs text-muted-foreground mt-1">Il y a 4 heures</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-medium text-sm">🏆 Objectif mensuel atteint</p>
                <p className="text-sm text-muted-foreground">
                  La DGDI a traité 2847 demandes ce mois, dépassant l'objectif de 2500. Félicitations à tous !
                </p>
                <p className="text-xs text-muted-foreground mt-1">Hier à 17:30</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
