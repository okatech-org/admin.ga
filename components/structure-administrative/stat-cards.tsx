'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Building,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Briefcase,
  Shield,
  Activity
} from 'lucide-react';
import { StatistiquesStructure } from '@/lib/types/structure-administrative';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  description?: string;
  trend?: number;
}

const StatCard = ({ title, value, icon: Icon, color, description, trend }: StatCardProps) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
          {trend !== undefined && (
            <div className="flex items-center mt-2">
              <TrendingUp className={`h-4 w-4 mr-1 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend >= 0 ? '+' : ''}{trend}%
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const StatistiquesCards = ({ statistiques }: { statistiques: StatistiquesStructure }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Organismes"
        value={statistiques.total_organismes}
        icon={Building}
        color="bg-blue-500"
        description="Structures administratives"
        trend={statistiques.croissance_mensuelle}
      />

      <StatCard
        title="Organismes Actifs"
        value={statistiques.organismes_actifs}
        icon={CheckCircle}
        color="bg-green-500"
        description={`${Math.round((statistiques.organismes_actifs / statistiques.total_organismes) * 100)}% du total`}
      />

      <StatCard
        title="Total Effectifs"
        value={statistiques.total_effectifs.toLocaleString('fr-FR')}
        icon={Users}
        color="bg-purple-500"
        description={`${statistiques.total_cadres} cadres, ${statistiques.total_agents} agents`}
      />

      <StatCard
        title="Postes Vacants"
        value={statistiques.postes_vacants}
        icon={AlertTriangle}
        color="bg-orange-500"
        description={`Taux occupation: ${statistiques.taux_occupation}%`}
      />
    </div>
  );
};

export const MetriquesNiveaux = ({ statistiques }: { statistiques: StatistiquesStructure }) => {
  const niveaux = [
    { niveau: 1, label: 'Niveau 1', count: statistiques.niveau_1, color: 'bg-red-500' },
    { niveau: 2, label: 'Niveau 2', count: statistiques.niveau_2, color: 'bg-blue-500' },
    { niveau: 3, label: 'Niveau 3', count: statistiques.niveau_3, color: 'bg-green-500' },
    { niveau: 4, label: 'Niveau 4', count: statistiques.niveau_4, color: 'bg-orange-500' },
    { niveau: 5, label: 'Niveau 5', count: statistiques.niveau_5, color: 'bg-purple-500' }
  ];

  const maxCount = Math.max(...niveaux.map(n => n.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Répartition par Niveau Hiérarchique
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {niveaux.map(niveau => (
          <div key={niveau.niveau} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`${niveau.color} text-white`}>
                  N{niveau.niveau}
                </Badge>
                <span className="text-sm font-medium">{niveau.label}</span>
              </div>
              <span className="text-sm font-bold">{niveau.count}</span>
            </div>
            <Progress
              value={(niveau.count / maxCount) * 100}
              className="h-2"
            />
          </div>
        ))}

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Total hiérarchique</span>
            <span className="font-bold">{statistiques.total_organismes}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AlertesIndicateurs = ({ statistiques }: { statistiques: StatistiquesStructure }) => {
  const alertes = [
    {
      type: 'warning',
      message: `${statistiques.postes_vacants} postes vacants à pourvoir`,
      icon: AlertTriangle,
      color: 'text-orange-600 bg-orange-50'
    },
    {
      type: 'info',
      message: `${statistiques.organismes_inactifs} organismes inactifs`,
      icon: Clock,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      type: 'success',
      message: `Taux d'occupation: ${statistiques.taux_occupation}%`,
      icon: Activity,
      color: 'text-green-600 bg-green-50'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Indicateurs & Alertes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alertes.map((alerte, index) => {
          const Icon = alerte.icon;
          return (
            <div key={index} className={`p-3 rounded-lg ${alerte.color} flex items-center gap-3`}>
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">{alerte.message}</span>
            </div>
          );
        })}

        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Ratio Cadres/Agents</span>
            <span className="font-bold">
              {(statistiques.total_cadres / statistiques.total_agents).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Croissance mensuelle</span>
            <span className={`font-bold ${statistiques.croissance_mensuelle >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {statistiques.croissance_mensuelle >= 0 ? '+' : ''}{statistiques.croissance_mensuelle}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
