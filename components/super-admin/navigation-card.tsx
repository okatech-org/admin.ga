'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LucideIcon, Star, ChevronRight, HelpCircle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { NavigationItem, BadgeInfo } from '@/lib/types/navigation';

interface NavigationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  isActive?: boolean;
  badge?: BadgeInfo;
  helpTip?: string;
  frequency?: 'high' | 'medium' | 'low';
  gradient?: string;
  items?: NavigationItem[];
  size?: 'sm' | 'md' | 'lg';
  showSubItems?: boolean;
}

export const NavigationCard = ({
  title,
  description,
  icon: Icon,
  href,
  isActive,
  badge,
  helpTip,
  frequency,
  gradient = 'from-blue-500 to-blue-600',
  items = [],
  size = 'md',
  showSubItems = true
}: NavigationCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "group relative rounded-xl border-2 transition-all duration-300 hover:scale-[1.02]",
          "bg-white shadow-sm hover:shadow-xl",
          isActive && "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200",
          !isActive && "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50",
          frequency === 'high' && "ring-2 ring-green-200 border-green-300",
          sizeClasses[size]
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Indicateur de fréquence */}
        {frequency === 'high' && (
          <div className="absolute -top-2 -right-2 z-10">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <Star className="w-2 h-2 text-white fill-current" />
            </div>
          </div>
        )}

        {/* Contenu principal */}
        <Link href={href} className="block">
          <div className="flex items-start gap-4">
            {/* Icône avec gradient */}
            <div className={cn(
              "rounded-lg flex items-center justify-center text-white transition-transform",
              `bg-gradient-to-br ${gradient}`,
              iconSizes[size],
              isHovered && "scale-110"
            )}>
              <Icon className={cn(
                size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'
              )} />
            </div>

            {/* Contenu textuel */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className={cn(
                  "font-semibold text-gray-900 group-hover:text-blue-600 transition-colors",
                  size === 'sm' ? 'text-base' : size === 'md' ? 'text-lg' : 'text-xl'
                )}>
                  {title}
                </h3>

                {badge && (
                  <Badge variant={badge.variant} className="text-xs">
                    {badge.text}
                  </Badge>
                )}

                {frequency === 'high' && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Zap className="w-4 h-4 text-orange-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Action fréquente</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              <p className={cn(
                "text-gray-600 line-clamp-2 transition-colors group-hover:text-gray-700",
                size === 'sm' ? 'text-sm' : 'text-base'
              )}>
                {description}
              </p>

              {helpTip && (
                <div className="mt-3 flex items-center gap-2">
                  <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowTooltip(!showTooltip);
                        }}
                      >
                        <HelpCircle className="w-3 h-3 mr-1" />
                        <span className="text-xs">Aide</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <p className="text-sm">{helpTip}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>

            {/* Flèche de navigation */}
            <div className={cn(
              "self-start transition-transform",
              isHovered && "translate-x-1"
            )}>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
            </div>
          </div>
        </Link>

        {/* Sous-éléments */}
        {showSubItems && items.length > 0 && isHovered && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 animate-in slide-in-from-top-2 duration-200">
            {items.slice(0, 3).map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors group/item"
                onClick={(e) => e.stopPropagation()}
              >
                <item.icon className="w-4 h-4 text-gray-500 group-hover/item:text-blue-500" />
                <span className="text-sm text-gray-700 group-hover/item:text-blue-600 flex-1">
                  {item.title}
                </span>
                {item.badge && (
                  <Badge variant={item.badge.variant} className="text-xs">
                    {item.badge.text}
                  </Badge>
                )}
              </Link>
            ))}
            {items.length > 3 && (
              <div className="text-center">
                <Link
                  href={href}
                  className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                >
                  +{items.length - 3} autres options
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

// Composant pour les actions rapides
interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  priority: 'high' | 'medium' | 'low';
}

export const QuickActionCard = ({
  title,
  description,
  icon: Icon,
  href,
  color,
  priority
}: QuickActionCardProps) => {
  const priorityIndicators = {
    high: { border: 'border-red-200', ring: 'ring-red-100' },
    medium: { border: 'border-yellow-200', ring: 'ring-yellow-100' },
    low: { border: 'border-gray-200', ring: 'ring-gray-100' }
  };

  return (
    <Link
      href={href}
      className={cn(
        "group relative p-4 rounded-xl border-2 bg-white shadow-sm transition-all duration-300",
        "hover:shadow-lg hover:scale-105",
        priorityIndicators[priority].border,
        "hover:ring-4",
        priorityIndicators[priority].ring
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center text-white",
          color
        )}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            {title}
          </h4>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            {description}
          </p>
        </div>

        {priority === 'high' && (
          <div className="absolute -top-1 -right-1">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </Link>
  );
};
