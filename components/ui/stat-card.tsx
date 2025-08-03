'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    label?: string;
  };
  variant?: 'default' | 'gradient';
  gradientFrom?: string;
  gradientTo?: string;
  textColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = 'text-blue-500',
  trend,
  variant = 'default',
  gradientFrom = 'from-blue-500',
  gradientTo = 'to-blue-600',
  textColor = 'text-white',
  className = ''
}: StatCardProps) {
  const isPositiveTrend = trend && trend.value > 0;
  const isNegativeTrend = trend && trend.value < 0;

  if (variant === 'gradient') {
    return (
      <Card className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} ${textColor} ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className={`${textColor === 'text-white' ? 'text-white/80' : 'text-gray-600'} text-sm`}>
                {title}
              </p>
              <p className="text-2xl font-bold">{value}</p>
              {description && (
                <p className={`${textColor === 'text-white' ? 'text-white/70' : 'text-gray-500'} text-xs`}>
                  {description}
                </p>
              )}
              {trend && (
                <div className="flex items-center gap-1 mt-1">
                  {isPositiveTrend && <TrendingUp className="h-3 w-3" />}
                  {isNegativeTrend && <TrendingDown className="h-3 w-3" />}
                  <span className="text-xs">
                    {Math.abs(trend.value)}% {trend.label}
                  </span>
                </div>
              )}
            </div>
            <Icon className={`h-8 w-8 ${textColor === 'text-white' ? 'text-white/60' : iconColor}`} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 mt-1">
                {isPositiveTrend && <TrendingUp className="h-3 w-3 text-green-500" />}
                {isNegativeTrend && <TrendingDown className="h-3 w-3 text-red-500" />}
                <span className={`text-xs ${
                  isPositiveTrend ? 'text-green-600' :
                  isNegativeTrend ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {Math.abs(trend.value)}% {trend.label}
                </span>
              </div>
            )}
          </div>
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>
      </CardContent>
    </Card>
  );
}

export default StatCard;
