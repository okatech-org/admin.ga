'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
  };
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

export function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }
  return context;
}

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    config: ChartConfig;
    children: React.ReactNode;
  }
>(({ className, children, config, ...props }, ref) => {
  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        className={cn(
          'flex aspect-video justify-center text-xs',
          className
        )}
        {...props}
      >
        <div className="w-full">
          {children}
        </div>
      </div>
    </ChartContext.Provider>
  );
});

ChartContainer.displayName = 'ChartContainer';

export const ChartTooltip = ({ content }: { content?: React.ReactNode }) => {
  return <div className="chart-tooltip">{content}</div>;
};

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    active?: boolean;
    payload?: Array<{ value: number; name: string }>;
    label?: string;
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: 'line' | 'dot' | 'dashed';
    nameKey?: string;
    labelKey?: string;
  }
>(({ active, payload, label, className, ...props }, ref) => {
  if (!active || !payload) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border bg-background p-2 shadow-sm',
        className
      )}
      {...props}
    >
      {label && <div className="font-medium">{label}</div>}
      <div className="grid gap-1">
        {payload.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-muted-foreground">{item.name}:</span>
            <span className="font-mono font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

ChartTooltipContent.displayName = 'ChartTooltipContent';

export const ChartLegend = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-4 text-sm', className)}
      {...props}
    />
  );
});

ChartLegend.displayName = 'ChartLegend';

export const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    payload?: Array<{ value: string; color?: string }>;
    hideIcon?: boolean;
    nameKey?: string;
  }
>(({ payload, className, ...props }, ref) => {
  if (!payload?.length) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-4', className)}
      {...props}
    >
      {payload.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: item.color || '#888' }}
          />
          <span className="text-sm">{item.value}</span>
        </div>
      ))}
    </div>
  );
});

ChartLegendContent.displayName = 'ChartLegendContent';

// Export des composants simplifiés pour compatibilité
export const ChartStyle = ({ id, config }: { id?: string; config: ChartConfig }) => null;
