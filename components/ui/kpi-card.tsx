'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number; // pourcentage d'évolution
  trendPeriod?: string;
  status?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendPeriod = "vs mois dernier",
  status = 'neutral',
  icon,
  loading = false,
  className
}: KPICardProps) {
  const getTrendIcon = () => {
    if (trend === undefined || trend === 0) return <Minus className="h-3 w-3" />;
    return trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (trend === undefined || trend === 0) return "text-gray-500";
    return trend > 0 ? "text-green-600" : "text-red-600";
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'danger': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'info': return <Info className="h-4 w-4 text-blue-600" />;
      default: return null;
    }
  };

  const getStatusBadgeColor = () => {
    switch (status) {
      case 'success': return "bg-green-100 text-green-800 border-green-200";
      case 'warning': return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'danger': return "bg-red-100 text-red-800 border-red-200";
      case 'info': return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <Card className={cn("relative", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("relative transition-all hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
          </div>

          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}

          {trend !== undefined && (
            <div className="flex items-center gap-1">
              <Badge
                variant="outline"
                className={cn("text-xs", getStatusBadgeColor())}
              >
                <span className={cn("flex items-center gap-1", getTrendColor())}>
                  {getTrendIcon()}
                  {Math.abs(trend)}%
                </span>
              </Badge>
              <span className="text-xs text-muted-foreground">{trendPeriod}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Composant pour afficher plusieurs KPIs en grille
interface KPIGridProps {
  kpis: Array<KPICardProps & { id: string }>;
  columns?: 2 | 3 | 4;
  loading?: boolean;
  className?: string;
}

export function KPIGrid({
  kpis,
  columns = 4,
  loading = false,
  className
}: KPIGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {kpis.map((kpi) => (
        <KPICard
          key={kpi.id}
          {...kpi}
          loading={loading}
        />
      ))}
    </div>
  );
}
