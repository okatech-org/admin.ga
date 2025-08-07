'use client';

import React, { useState, useEffect } from 'react';
import { SuperAdminLayout } from '@/components/layouts/super-admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import {
  Users,
  Building2,
  Activity,
  FileText,
  Target,
  Star,
  Clock,
  Bell,
  ArrowRight,
  BarChart3,
  Shield,
  AlertTriangle,
  RefreshCw,
  Gauge,
  TrendingUp,
  TrendingDown,
  Layers,
  Settings,
  Search,
  Eye,
  PlusCircle,
  BookOpen,
  Heart,
  Zap,
  Info
} from 'lucide-react';
// import { SUPER_ADMIN_SECTIONS, QUICK_ACTIONS } from '@/lib/config/super-admin-navigation';
import { useDashboardStats } from '@/hooks/use-statistics';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function SuperAdminHomePage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Bonjour' : currentHour < 18 ? 'Bon après-midi' : 'Bonsoir';

  const { states: dashboardStats, loading: statsLoading, error: statsError, refresh } = useDashboardStats({
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000
  });

  const syntheseData = dashboardStats['/api/super-admin/stats/synthese']?.data;
  const organismesData = dashboardStats['/api/super-admin/stats/organismes']?.data;
  const utilisateursData = dashboardStats['/api/super-admin/stats/utilisateurs']?.data;

  useEffect(() => {
    if (syntheseData) {
        setDashboardData({
          metrics: {
            totalUsers: {
            value: syntheseData.kpi_principaux.utilisateurs_systeme.total,
            trend: syntheseData.kpi_principaux.utilisateurs_systeme.trend,
            description: `${syntheseData.kpi_principaux.fonctionnaires.total} fonctionnaires + ${syntheseData.kpi_principaux.utilisateurs_systeme.par_role?.citoyens || 7} citoyens`
            },
            activeUsers: {
            value: syntheseData.kpi_principaux.utilisateurs_systeme.actifs,
            trend: 2,
            description: `${syntheseData.kpi_principaux.utilisateurs_systeme.taux_activation}% d'activation`
            },
            totalOrganizations: {
            value: syntheseData.kpi_principaux.organismes.total,
              trend: 0,
            description: `${syntheseData.kpi_principaux.organismes.actifs} organismes actifs`
          },
          services: {
            value: syntheseData.kpi_principaux.services.total,
            trend: syntheseData.kpi_principaux.services.trend,
            description: `${syntheseData.kpi_principaux.services.actifs} services actifs`
          },
          systemHealth: {
            value: syntheseData.etat_systeme.disponibilite_7j,
            trend: 0,
            description: 'Disponibilité 7 jours'
          }
        },
        lastUpdated: new Date().toISOString()
      });
      setLoading(false);
      setError(null);
    }
  }, [syntheseData]);

  useEffect(() => {
    if (statsError) {
      setError(statsError);
      setLoading(false);
    }
  }, [statsError]);

  const loadDashboardData = () => {
    setLoading(true);
    refresh();
  };

  if (!dashboardData || loading) {
    return (
      <SuperAdminLayout
        title="Dashboard"
        description="Chargement en cours..."
      >
        <div className="p-6 space-y-6">
          {/* Header de statut skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Métriques skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="h-8 w-20 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  const metrics = [
    {
      id: 'users',
      title: 'Utilisateurs',
      value: dashboardData.metrics.totalUsers.value.toLocaleString(),
      description: dashboardData.metrics.totalUsers.description,
      trend: dashboardData.metrics.totalUsers.trend,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 'active',
      title: 'Actifs',
      value: dashboardData.metrics.activeUsers.value.toLocaleString(),
      description: dashboardData.metrics.activeUsers.description,
      trend: dashboardData.metrics.activeUsers.trend,
      icon: Activity,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 'orgs',
      title: 'Organismes',
      value: dashboardData.metrics.totalOrganizations.value.toLocaleString(),
      description: dashboardData.metrics.totalOrganizations.description,
      trend: dashboardData.metrics.totalOrganizations.trend,
      icon: Building2,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      id: 'services',
      title: 'Services',
      value: dashboardData.metrics.services.value.toLocaleString(),
      description: dashboardData.metrics.services.description,
      trend: dashboardData.metrics.services.trend,
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <SuperAdminLayout
      title={`${greeting} ! 👋`}
      description="Vue d'ensemble du système gabonais"
    >
      <div className="space-y-6">
        {/* Header de statut */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
              error
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              <div className={`w-2 h-2 rounded-full ${error ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
              {error ? 'Mode maintenance' : 'Système opérationnel'}
            </div>
            {dashboardData?.lastUpdated && (
              <span className="text-sm text-gray-500">
                Dernière MAJ: {new Date(dashboardData.lastUpdated).toLocaleTimeString('fr-FR')}
              </span>
            )}
          </div>

            <Button
              variant="outline"
              size="sm"
              onClick={loadDashboardData}
              disabled={loading}
            className="text-gray-600 hover:text-gray-900"
            >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''} mr-2`} />
              {loading ? 'Actualisation...' : 'Actualiser'}
            </Button>
        </div>

        {/* Alerte d'erreur */}
        {error && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Attention :</strong> {error}. Affichage des dernières données disponibles.
            </AlertDescription>
          </Alert>
        )}

        {/* Métriques principales */}
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {metrics.map((metric) => (
            <motion.div key={metric.id} variants={fadeInUp}>
              <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-600">{metric.title}</span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${metric.iconBg}`}>
                      <metric.icon className={`w-5 h-5 ${metric.iconColor}`} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                      <div className="text-xs text-gray-500">{metric.description}</div>
                    </div>
                  {metric.trend !== 0 && (
                    <div className={`flex items-center mt-3 text-xs ${
                      metric.trend > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.trend > 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      <span>{Math.abs(metric.trend)}% ce mois</span>
                    </div>
                  )}
                  </CardContent>
                </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600" />
              Actions Rapides
                  </CardTitle>
            <CardDescription>
              Accès direct aux fonctionnalités les plus utilisées
                  </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { href: '/admin-web', title: 'Interface Admin Web', icon: Settings, description: 'Personnalisation complète', isNew: true },
                { href: '/super-admin/utilisateurs', title: 'Utilisateurs', icon: Users, description: 'Gestion des comptes' },
                { href: '/super-admin/administrations', title: 'Administrations', icon: Building2, description: 'Organismes publics' },
                { href: '/super-admin/organismes-vue-ensemble', title: 'Organismes', icon: Building2, description: 'Vue d\'ensemble' },
                { href: '/super-admin/postes-emploi', title: 'Postes', icon: Target, description: 'Emplois publics' },
                { href: '/super-admin/analytics', title: 'Analytics', icon: BarChart3, description: 'Tableaux de bord' },
                { href: '/super-admin/base-donnees', title: 'Base de Données', icon: Layers, description: 'Gestion BDD' },
                { href: '/super-admin/debug', title: 'Debug', icon: Settings, description: 'Outils système' },
              ].map((section) => (
                <Link
                  key={section.href}
                  href={section.href}
                  className="group"
                >
                  <div className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer relative ${
                    section.isNew
                      ? 'border-green-300 bg-green-50 hover:bg-green-100'
                      : 'border-gray-200 hover:border-indigo-300 bg-white hover:bg-indigo-50'
                  }`}>
                    {section.isNew && (
                      <div className="absolute -top-2 -right-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          NEW
                        </span>
                    </div>
                  )}
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        section.isNew
                          ? 'bg-green-200 group-hover:bg-green-300'
                          : 'bg-indigo-100 group-hover:bg-indigo-200'
                      }`}>
                        <section.icon className={`w-4 h-4 ${
                          section.isNew ? 'text-green-700' : 'text-indigo-600'
                        }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm truncate">
                              {section.title}
                            </h3>
                        <p className="text-xs text-gray-500 truncate">
                              {section.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

        {/* Activité récente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Activité Récente
                  </CardTitle>
                </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Nouvel utilisateur créé', user: 'Système', time: 'Il y a 5 min', type: 'success' },
                  { action: 'Organisme mis à jour', user: 'Admin', time: 'Il y a 12 min', type: 'info' },
                  { action: 'Maintenance programmée', user: 'Système', time: 'Il y a 1h', type: 'warning' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                          <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </div>
                      <div className="text-xs text-gray-500">
                        {activity.user} • {activity.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Santé du Système
                </CardTitle>
              </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Disponibilité</span>
                    <span className="font-medium">{dashboardData.metrics.systemHealth.value}%</span>
                  </div>
                  <Progress value={dashboardData.metrics.systemHealth.value} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Performance</span>
                    <span className="font-medium">98.5%</span>
          </div>
                  <Progress value={98.5} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Sécurité</span>
                    <span className="font-medium">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
