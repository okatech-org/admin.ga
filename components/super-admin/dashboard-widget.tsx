'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LucideIcon, TrendingUp, TrendingDown, Minus, ExternalLink, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface DashboardWidgetProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: number;
  icon: LucideIcon;
  color?: string;
  actionLabel?: string;
  actionHref?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  isLoading?: boolean;
  showTrend?: boolean;
  size?: 'sm' | 'md' | 'lg';
  type?: 'metric' | 'status' | 'progress' | 'action';
  progressValue?: number;
  progressMax?: number;
  onRefresh?: () => void;
}

export const DashboardWidget = ({
  title,
  value,
  description,
  trend,
  icon: Icon,
  color = 'bg-blue-500',
  actionLabel,
  actionHref,
  status,
  isLoading = false,
  showTrend = true,
  size = 'md',
  type = 'metric',
  progressValue,
  progressMax = 100,
  onRefresh
}: DashboardWidgetProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    success: 'border-green-200 bg-green-50/50',
    warning: 'border-yellow-200 bg-yellow-50/50',
    error: 'border-red-200 bg-red-50/50',
    info: 'border-blue-200 bg-blue-50/50'
  };

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const valueTextSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const getTrendColor = (trendValue?: number) => {
    if (!trendValue) return 'text-gray-500';
    return trendValue > 0 ? 'text-green-600' : trendValue < 0 ? 'text-red-600' : 'text-gray-500';
  };

  const getTrendIcon = (trendValue?: number) => {
    if (!trendValue) return Minus;
    return trendValue > 0 ? TrendingUp : trendValue < 0 ? TrendingDown : Minus;
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      // Formatage intelligent des nombres
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}k`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-lg",
        status && statusColors[status],
        isHovered && "scale-[1.02]",
        sizeClasses[size]
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          )}
          <div className={cn(
            "rounded-lg flex items-center justify-center text-white transition-transform",
            color,
            iconSizes[size],
            isHovered && "scale-110"
          )}>
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Icon className="w-4 h-4" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {/* Valeur principale */}
          <div className={cn("font-bold text-gray-900", valueTextSizes[size])}>
            {isLoading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
            ) : (
              formatValue(value)
            )}
          </div>

          {/* Tendance */}
          {showTrend && trend !== undefined && !isLoading && (
            <div className="flex items-center gap-1">
              {(() => {
                const TrendIcon = getTrendIcon(trend);
                return (
                  <>
                    <TrendIcon className={cn("w-3 h-3", getTrendColor(trend))} />
                    <span className={cn("text-xs font-medium", getTrendColor(trend))}>
                      {trend > 0 ? '+' : ''}{trend}%
                    </span>
                    <span className="text-xs text-gray-500">ce mois</span>
                  </>
                );
              })()}
            </div>
          )}

          {/* Barre de progression pour le type progress */}
          {type === 'progress' && progressValue !== undefined && (
            <div className="space-y-1">
              <Progress value={(progressValue / progressMax) * 100} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{progressValue}</span>
                <span>{progressMax}</span>
              </div>
            </div>
          )}

          {/* Badge de statut */}
          {status && type === 'status' && (
            <Badge
              variant={status === 'success' ? 'default' : status === 'error' ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {status === 'success' && '✅ Opérationnel'}
              {status === 'warning' && '⚠️ Attention'}
              {status === 'error' && '❌ Critique'}
              {status === 'info' && 'ℹ️ Information'}
            </Badge>
          )}

          {/* Description */}
          {description && (
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          )}

          {/* Action button */}
          {actionLabel && actionHref && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full group"
              asChild
            >
              <Link href={actionHref}>
                {actionLabel}
                <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Widget spécialisé pour les statistiques en temps réel
interface RealTimeStatsWidgetProps {
  title: string;
  stats: Array<{
    label: string;
    value: number;
    max?: number;
    color?: string;
  }>;
  icon: LucideIcon;
  refreshInterval?: number;
  onRefresh?: () => void;
}

export const RealTimeStatsWidget = ({
  title,
  stats,
  icon: Icon,
  refreshInterval = 30000,
  onRefresh
}: RealTimeStatsWidgetProps) => {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useState(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
        onRefresh?.();
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  });

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {title}
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          Temps réel
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{stat.label}</span>
              <span className="font-semibold">
                {stat.max ? `${stat.value}/${stat.max}` : stat.value}
              </span>
            </div>
            {stat.max && (
              <Progress
                value={(stat.value / stat.max) * 100}
                className="h-2"
                style={{ backgroundColor: stat.color }}
              />
            )}
          </div>
        ))}

        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Dernière mise à jour</span>
            <span>{lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Widget d'action rapide amélioré
interface ActionWidgetProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
  color: string;
  priority?: 'high' | 'medium' | 'low';
  onClick?: () => void;
}

export const ActionWidget = ({
  title,
  description,
  icon: Icon,
  href,
  badge,
  color,
  priority = 'medium',
  onClick
}: ActionWidgetProps) => {
  const priorityStyles = {
    high: 'ring-2 ring-red-200 border-red-300',
    medium: 'ring-1 ring-yellow-200 border-yellow-300',
    low: 'border-gray-200'
  };

  const handleClick = () => {
    onClick?.();
  };

  return (
    <Card
      className={cn(
        "p-4 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105",
        priorityStyles[priority]
      )}
      onClick={handleClick}
    >
      <Link href={href} className="block">
        <div className="flex items-center gap-3">
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-white", color)}>
            <Icon className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900">{title}</h3>
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
              {priority === 'high' && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1 line-clamp-1">{description}</p>
          </div>

          <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>
    </Card>
  );
};
