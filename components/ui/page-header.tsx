'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, AlertCircle } from 'lucide-react';

interface PageHeaderAction {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: 'default' | 'outline' | 'destructive';
  disabled?: boolean;
  loading?: boolean;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  actions?: PageHeaderAction[];
  error?: string;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  badge,
  actions = [],
  error,
  className = ''
}: PageHeaderProps) {
  return (
    <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ${className}`}>
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          {Icon && <Icon className="h-8 w-8 text-primary" />}
          {title}
          {badge && (
            <Badge variant={badge.variant || 'default'}>
              {badge.text}
            </Badge>
          )}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </div>

      {actions.length > 0 && (
        <div className="flex gap-2">
          {actions.map((action, index) => {
            const ActionIcon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant || 'default'}
                onClick={action.onClick}
                disabled={action.disabled || action.loading}
              >
                {action.loading ? (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />
                )}
                {action.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
