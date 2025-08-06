'use client';

import React, { useState, useEffect } from 'react';
import { SuperAdminLayout } from '@/components/layouts/super-admin-layout';
import { NavigationCard, QuickActionCard } from '@/components/super-admin/navigation-card';
import { DashboardWidget } from '@/components/super-admin/dashboard-widget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Sparkles,
  TrendingUp,
  Users,
  Building2,
  Activity,
  CheckCircle2,
  Clock,
  FileText,
  Target,
  Star,
  Calendar,
  Bell,
  Lightbulb,
  ArrowRight,
  BarChart3,
  Shield,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Zap,
  Gauge
} from 'lucide-react';
import { SUPER_ADMIN_SECTIONS, QUICK_ACTIONS } from '@/lib/config/super-admin-navigation';
import Link from 'next/link';

export default function SuperAdminHomePage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetailedStats, setShowDetailedStats] = useState(false);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Bonjour' : currentHour < 18 ? 'Bon après-midi' : 'Bonsoir';

  // Charger les données réelles depuis l'API
  useEffect(() => {
    loadDashboardData();

    // Actualiser les données toutes les 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
            // Charger les vraies données utilisateurs et organismes
      const [usersResponse, orgsResponse] = await Promise.all([
        fetch('/api/super-admin/users-stats'),
        fetch('/api/super-admin/organizations-stats')
      ]);

      const [usersResult, orgsResult] = await Promise.all([
        usersResponse.json(),
        orgsResponse.json()
      ]);

      if (usersResult.success && orgsResult.success) {
        const userData = usersResult.data;
        const orgData = orgsResult.data;

        // Construire les métriques avec les vraies données
        setDashboardData({
          metrics: {
            totalUsers: {
              value: userData.totalUsers,
              trend: 0,
              description: 'Utilisateurs enregistrés dans la base'
            },
            activeUsers: {
              value: userData.statusDistribution.active,
              trend: 0,
              description: 'Utilisateurs actifs vérifiés'
            },
            totalOrganizations: {
              value: orgData.totalOrganizations,
              trend: 0,
              description: `Organismes gabonais (${orgData.statusDistribution.active} actifs)`
            },
            services: {
              value: 0,
              trend: 0,
              description: 'Services disponibles'
            },
            systemHealth: {
              value: '99.9%',
              trend: 0,
              description: 'Système opérationnel'
            }
          },
          userStats: userData,
          orgStats: orgData,
          priorityTasks: [],
          recentActivities: userData.recentUsers.map((user, index) => ({
            id: index + 1,
            type: 'user_created',
            message: `Nouvel utilisateur ${user.role}`,
            user: `${user.firstName} ${user.lastName}`,
            time: new Date(user.createdAt).toLocaleDateString('fr-FR'),
            status: user.isActive ? 'success' : 'warning'
          })),
          lastUpdated: userData.lastUpdated
        });
        setError(null);
      } else {
        throw new Error(usersResult.error || 'Erreur lors du chargement des données');
      }
    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
      setError('Impossible de charger les données récentes');

              // Données de fallback avec les vraies valeurs connues
        setDashboardData({
          metrics: {
                totalUsers: { value: 0, trend: 0, description: 'Base de données vide' },
    activeUsers: { value: 0, trend: 0, description: 'Base de données vide' },
    totalOrganizations: { value: 0, trend: 0, description: 'Base de données vide' },
    services: { value: 0, trend: 0, description: 'Base de données vide' },
          systemHealth: { value: '99.7%', trend: 0, description: 'Estimation système' }
        },
        userStats: {
          totalUsers: 0,
          statusDistribution: { active: 0, inactive: 0 },
          roleDistribution: [],
          environmentDistribution: {},
          recentUsers: []
        },
        orgStats: {
          totalOrganizations: 0,
          statusDistribution: { active: 0, inactive: 0 },
          typeDistribution: {},
          recentOrganizations: []
        },
        priorityTasks: [],
        recentActivities: [],
        lastUpdated: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  // Construire les métriques à partir des données API
  const todayMetrics = dashboardData ? [
    {
      title: 'Total Utilisateurs',
      value: dashboardData.metrics.totalUsers.value.toLocaleString(),
      trend: dashboardData.metrics.totalUsers.trend,
      icon: Users,
      color: 'bg-blue-500',
      description: dashboardData.metrics.totalUsers.description,
      actionLabel: 'Gérer utilisateurs',
      actionHref: '/super-admin/utilisateurs'
    },
    {
      title: 'Utilisateurs Actifs',
      value: dashboardData.metrics.activeUsers.value.toLocaleString(),
      trend: dashboardData.metrics.activeUsers.trend,
      icon: Activity,
      color: 'bg-green-500',
      description: dashboardData.metrics.activeUsers.description,
      actionLabel: 'Voir activité',
      actionHref: '/super-admin/utilisateurs'
    },
    {
      title: 'Organismes',
      value: dashboardData.metrics.totalOrganizations.value.toLocaleString(),
      trend: dashboardData.metrics.totalOrganizations.trend,
      icon: Building2,
      color: 'bg-purple-500',
      description: dashboardData.metrics.totalOrganizations.description,
      actionLabel: 'Gérer organismes',
      actionHref: '/super-admin/organismes-vue-ensemble'
    },
    {
      title: 'Services Disponibles',
      value: dashboardData.metrics.services.value.toLocaleString(),
      trend: dashboardData.metrics.services.trend,
      icon: FileText,
      color: 'bg-indigo-500',
      description: dashboardData.metrics.services.description,
      actionLabel: 'Explorer services',
      actionHref: '/super-admin/services'
    }
  ] : [];

  // Utiliser les tâches prioritaires de l'API ou fallback
  const priorityTasks = dashboardData?.priorityTasks || [
    {
      id: 1,
      title: 'Chargement des tâches...',
      urgency: 'medium',
      href: '/super-admin/fonctionnaires-attente',
      icon: Users,
      timeLeft: 'En cours',
      count: 0
    }
  ];

  // Utiliser les activités récentes de l'API ou fallback
  const recentUpdates = dashboardData?.recentActivities || [
    {
      action: 'Chargement des activités...',
      user: 'Système',
      time: 'En cours'
    }
  ];

  return (
    <SuperAdminLayout
      title={`${greeting} ! 👋`}
      description="Tableau de bord moderne et simplifié pour ADMIN.GA"
    >
      <div className="space-y-6">
        {/* Header moderne avec statut et actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'}`} />
              <span className="text-sm font-medium text-gray-700">
                {error ? 'Données hors ligne' : 'Système opérationnel'}
              </span>
            </div>
            {dashboardData?.lastUpdated && (
              <span className="text-xs text-gray-500">
                Mis à jour: {new Date(dashboardData.lastUpdated).toLocaleTimeString('fr-FR')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadDashboardData}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Actualisation...' : 'Actualiser'}
            </Button>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Zap className="w-3 h-3 mr-1" />
              Temps réel
            </Badge>
          </div>
        </div>

        {/* Alerte d'erreur compacte */}
        {error && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Attention :</strong> {error}. Affichage des dernières données disponibles.
            </AlertDescription>
          </Alert>
        )}

        {/* Métriques principales compactes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            [...Array(4)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-4 bg-gray-200 rounded w-16" />
                    <div className="w-6 h-6 bg-gray-200 rounded" />
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-12 mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-20" />
                </CardContent>
              </Card>
            ))
          ) : (
            todayMetrics.map((metric, index) => (
              <Link key={index} href={metric.actionHref} className="group">
                <Card className="transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-600">{metric.title}</span>
                      <metric.icon className={`w-5 h-5 text-white rounded-lg p-1 ${metric.color}`} />
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                      <div className="text-xs text-gray-500">{metric.description}</div>
                    </div>
                    <div className="mt-3 flex items-center text-xs text-gray-400 group-hover:text-blue-600 transition-colors">
                      <span>{metric.actionLabel}</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* Statistiques détaillées (collapsibles) */}
        {dashboardData && (
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Analyse Détaillée
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Répartition complète des {(dashboardData.userStats?.totalUsers || 0) + (dashboardData.orgStats?.totalOrganizations || 0)} entités
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailedStats(!showDetailedStats)}
                  className="flex items-center gap-2"
                >
                  {showDetailedStats ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Masquer
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Afficher
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>

            {showDetailedStats && (
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Utilisateurs */}
                  {dashboardData?.userStats && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        Utilisateurs ({dashboardData.userStats.totalUsers})
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {dashboardData.userStats?.roleDistribution?.slice(0, 4).map((role: any) => (
                          <div key={role.role} className="bg-blue-50 p-3 rounded-lg">
                            <div className="text-lg font-bold text-blue-900">{role.count}</div>
                            <div className="text-xs text-blue-700">{role.role}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Organismes */}
                  {dashboardData?.orgStats && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-green-600" />
                        Organismes ({dashboardData.orgStats.totalOrganizations})
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {dashboardData.orgStats?.typeDistribution?.slice(0, 4).map((type: any) => (
                          <div key={type.type} className="bg-green-50 p-3 rounded-lg">
                            <div className="text-lg font-bold text-green-900">{type.count}</div>
                            <div className="text-xs text-green-700">{type.type.replace('_', ' ')}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        )}



        {/* Layout principal moderne */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation principale (3 colonnes) */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Gauge className="w-5 h-5 text-blue-600" />
                      Centre de Contrôle
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Accès direct aux fonctionnalités principales
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200">
                    6 Sections
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {SUPER_ADMIN_SECTIONS.slice(0, 6).map((section) => (
                    <Link
                      key={section.id}
                      href={section.items[0]?.href || '#'}
                      className="group block"
                    >
                      <div className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${section.gradient || 'bg-blue-500'} group-hover:scale-110 transition-transform`}>
                            <section.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {section.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {section.description}
                            </p>
                            {section.badge && (
                              <Badge variant={section.badge.variant as any || "outline"} className="mt-2 text-xs">
                                {section.badge.text}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions prioritaires compactes */}
            {priorityTasks.length > 0 && priorityTasks[0].title !== 'Chargement des tâches...' && (
              <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-50 to-red-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-orange-500" />
                    Tâches Prioritaires
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-2">
                    {priorityTasks.slice(0, 3).map((task) => {
                      const IconComponent = typeof task.icon === 'string' ?
                        (task.icon === 'Users' ? Users :
                         task.icon === 'Building2' ? Building2 :
                         task.icon === 'BarChart3' ? BarChart3 : Users) :
                        task.icon;

                      return (
                        <Link
                          key={task.id}
                          href={task.href}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-100 group"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            task.urgency === 'high' ? 'bg-red-100 text-red-600' :
                            task.urgency === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                              {task.title}
                            </div>
                            <div className="text-xs text-gray-500">{task.timeLeft}</div>
                          </div>
                          {task.count && task.count > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {task.count}
                            </Badge>
                          )}
                          <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar moderne et compacte */}
          <div className="space-y-4">
            {/* Actions rapides */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Actions Rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-2">
                  {QUICK_ACTIONS.slice(0, 3).map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-200"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.color || 'bg-blue-500'} group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {action.description}
                        </div>
                      </div>
                      <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activité récente compacte */}
            {recentUpdates.length > 0 && recentUpdates[0].action !== 'Chargement des activités...' && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-green-600" />
                    Activité Récente
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-3">
                    {recentUpdates.slice(0, 3).map((update, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {update.action}
                          </div>
                          <div className="text-xs text-gray-500">
                            {update.user} • {update.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Conseil moderne */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-indigo-900 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  Astuce
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-sm text-indigo-800 leading-relaxed">
                  💡 Utilisez le <strong>Centre de Contrôle</strong> pour naviguer rapidement entre les sections.
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-indigo-600">
                  <kbd className="px-2 py-1 bg-indigo-200 rounded text-xs font-mono">Ctrl+K</kbd>
                  <span>pour rechercher</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer moderne et compact */}
        <Card className="border-0 bg-gradient-to-r from-gray-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">ADMIN.GA</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <Link href="/super-admin/base-donnees" className="hover:text-blue-600 transition-colors">
                    Base de données
                  </Link>
                  <Link href="/super-admin/analytics" className="hover:text-blue-600 transition-colors">
                    Analytics
                  </Link>
                  <Link href="/super-admin/logs" className="hover:text-blue-600 transition-colors">
                    Logs
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                  Opérationnel
                </Badge>
                <span className="text-xs text-gray-500">
                  Interface moderne v2.0
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}
