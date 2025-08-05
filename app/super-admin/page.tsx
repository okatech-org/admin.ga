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
  AlertTriangle
} from 'lucide-react';
import { SUPER_ADMIN_SECTIONS, QUICK_ACTIONS } from '@/lib/config/super-admin-navigation';
import Link from 'next/link';

export default function SuperAdminHomePage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      description="Votre tableau de bord personnalisé pour administrer ADMIN.GA efficacement"
    >
            <div className="space-y-8">
        {/* Alerte d'erreur si problème de chargement */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <div className="flex items-center justify-between">
                <span>
                  <strong>Données indisponibles :</strong> {error}. Les données affichées peuvent ne pas être à jour.
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadDashboardData}
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  Réessayer
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Alerte de bienvenue pour nouveaux utilisateurs */}
        {!error && (
          <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="flex items-center justify-between">
                <span>
                  <strong>Interface moderne :</strong> Données en temps réel mises à jour automatiquement.
                  {dashboardData?.lastUpdated && (
                    <span className="text-xs block mt-1">
                      Dernière mise à jour: {new Date(dashboardData.lastUpdated).toLocaleTimeString('fr-FR')}
                    </span>
                  )}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadDashboardData}
                    disabled={loading}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    {loading ? 'Actualisation...' : 'Actualiser'}
                  </Button>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Temps réel
                  </Badge>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Statistiques détaillées des utilisateurs */}
        {dashboardData?.userStats && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Répartition Détaillée des Utilisateurs
              </CardTitle>
              <CardDescription>
                Analyse en temps réel de vos {dashboardData.userStats?.totalUsers || 0} utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Répartition par rôle */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">Par Rôle</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {dashboardData.userStats?.roleDistribution?.map((role: any) => (
                    <div key={role.role} className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{role.count}</div>
                      <div className="text-sm text-gray-600">{role.role}</div>
                      <div className="text-xs text-gray-500">
                        {((role.count / (dashboardData.userStats?.totalUsers || 1)) * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statut et organisation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">Organisation</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Avec organisation</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {dashboardData.userStats?.organizationDistribution?.withOrganization || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Sans organisation</span>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700">
                        {dashboardData.userStats?.organizationDistribution?.withoutOrganization || 0}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">Top Domaines Email</h4>
                  <div className="space-y-1">
                    {dashboardData.userStats?.emailDomains?.slice(0, 3).map((domain: any) => (
                      <div key={domain.domain} className="flex justify-between text-sm">
                        <span className="text-gray-600">{domain.domain}</span>
                        <span className="font-medium">{domain.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistiques détaillées des organismes */}
        {dashboardData?.orgStats && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-600" />
                Répartition Détaillée des Organismes
              </CardTitle>
              <CardDescription>
                Analyse en temps réel de vos {dashboardData.orgStats?.totalOrganizations || 0} organismes gabonais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Répartition par type */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">Par Type</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {dashboardData.orgStats?.typeDistribution?.slice(0, 6).map((type: any) => (
                    <div key={type.type} className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{type.count}</div>
                      <div className="text-sm text-gray-600">{type.type.replace('_', ' ')}</div>
                      <div className="text-xs text-gray-500">
                        {((type.count / (dashboardData.orgStats?.totalOrganizations || 1)) * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statut et villes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">Statut d'Activité</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Organismes actifs</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {dashboardData.orgStats?.statusDistribution?.active || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Organismes inactifs</span>
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        {dashboardData.orgStats?.statusDistribution?.inactive || 0}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">Top Villes</h4>
                  <div className="space-y-1">
                    {dashboardData.orgStats?.cityDistribution?.slice(0, 3).map((city: any) => (
                      <div key={city.city} className="flex justify-between text-sm">
                        <span className="text-gray-600">{city.city}</span>
                        <span className="font-medium">{city.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Métriques du jour */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Indicateurs de chargement
            [...Array(4)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                    <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-32" />
                </CardContent>
              </Card>
            ))
          ) : (
            todayMetrics.map((metric, index) => (
              <DashboardWidget
                key={index}
                title={metric.title}
                value={metric.value}
                trend={metric.trend}
                icon={metric.icon}
                color={metric.color}
                description={metric.description}
                actionLabel={metric.actionLabel}
                actionHref={metric.actionHref}
                showTrend={true}
                isLoading={loading}
              />
            ))
          )}
        </div>

        {/* Contenu principal en grille */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Navigation principale */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Navigation Simplifiée
                </CardTitle>
                <CardDescription>
                  6 sections principales pour organiser toutes vos tâches administratives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-tour="navigation-grid">
                  {SUPER_ADMIN_SECTIONS.slice(0, 6).map((section) => (
                    <NavigationCard
                      key={section.id}
                      title={section.title}
                      description={section.description}
                      icon={section.icon}
                      href={section.items[0]?.href || '#'}
                      gradient={section.gradient}
                      badge={section.badge}
                      frequency={section.items.some(item => item.isFrequent) ? 'high' : 'medium'}
                      size="sm"
                      showSubItems={false}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Actions Prioritaires
                </CardTitle>
                <CardDescription>
                  Tâches importantes qui nécessitent votre attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                                    {priorityTasks.map((task) => {
                    // Gérer différents types d'icônes (string ou component)
                    const IconComponent = typeof task.icon === 'string' ?
                      (task.icon === 'Users' ? Users :
                       task.icon === 'Building2' ? Building2 :
                       task.icon === 'BarChart3' ? BarChart3 : Users) :
                      task.icon;

                    return (
                      <Link
                        key={task.id}
                        href={task.href}
                        className="block p-4 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            task.urgency === 'high' ? 'bg-red-100 text-red-600' :
                            task.urgency === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{task.title}</span>
                              <Badge
                                variant={task.urgency === 'high' ? 'destructive' :
                                        task.urgency === 'medium' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {task.urgency === 'high' ? 'Urgent' :
                                 task.urgency === 'medium' ? 'Important' : 'Normal'}
                              </Badge>
                              {task.count && task.count > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {task.count}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">Échéance: {task.timeLeft}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar avec infos contextuelles */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Actions Rapides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3" data-tour="quick-actions">
                  {QUICK_ACTIONS.slice(0, 4).map((action) => (
                    <QuickActionCard
                      key={action.href}
                      title={action.title}
                      description={action.description}
                      icon={action.icon}
                      href={action.href}
                      color={action.color}
                      priority={action.priority}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mises à jour et actualités */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Actualités
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUpdates.map((update, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full mt-2 bg-blue-500" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{update.action}</h4>
                          <p className="text-xs text-gray-600 mt-1">Par: {update.user}</p>
                          <span className="text-xs text-gray-500">{update.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Conseils pour novices */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Lightbulb className="w-5 h-5" />
                  Conseil du Jour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-purple-700">
                    💡 <strong>Navigation intuitive :</strong> Chaque section est organisée logiquement.
                    Commencez par "Vue d'Ensemble" pour une introduction complète.
                  </p>
                  <p className="text-xs text-purple-600">
                    ⌨️ Astuce : Utilisez <kbd className="px-1 py-0.5 bg-purple-200 rounded text-xs">Ctrl+K</kbd>
                    pour rechercher n'importe quelle fonctionnalité instantanément.
                  </p>
                  <Button variant="outline" size="sm" className="w-full border-purple-300 text-purple-700 hover:bg-purple-100">
                    Voir plus de conseils
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer avec liens rapides */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Système
                </h4>
                <div className="space-y-2">
                  <Link href="/super-admin/base-donnees" className="block text-sm text-gray-600 hover:text-blue-600">
                    Base de données
                  </Link>
                  <Link href="/super-admin/systeme" className="block text-sm text-gray-600 hover:text-blue-600">
                    Maintenance
                  </Link>
                  <Link href="/super-admin/logs" className="block text-sm text-gray-600 hover:text-blue-600">
                    Logs système
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </h4>
                <div className="space-y-2">
                  <Link href="/super-admin/analytics" className="block text-sm text-gray-600 hover:text-blue-600">
                    Rapports détaillés
                  </Link>
                  <Link href="/super-admin/metrics-advanced" className="block text-sm text-gray-600 hover:text-blue-600">
                    Métriques avancées
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Utilisateurs
                </h4>
                <div className="space-y-2">
                  <Link href="/super-admin/utilisateurs" className="block text-sm text-gray-600 hover:text-blue-600">
                    Gestion comptes
                  </Link>
                  <Link href="/super-admin/fonctionnaires-attente" className="block text-sm text-gray-600 hover:text-blue-600">
                    Validations en attente
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Organismes
                </h4>
                <div className="space-y-2">
                  <Link href="/super-admin/organismes-vue-ensemble" className="block text-sm text-gray-600 hover:text-blue-600">
                    Vue d'ensemble
                  </Link>
                  <Link href="/super-admin/structure-administrative" className="block text-sm text-gray-600 hover:text-blue-600">
                    Structure officielle
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}
