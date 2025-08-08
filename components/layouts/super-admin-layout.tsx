'use client';

import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { TourProvider, ContextualHelp, KeyboardShortcuts } from '@/components/super-admin/guided-tour';
import { SmartSearch } from '@/components/super-admin/smart-search';
import { Button } from '@/components/ui/button';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showSearch?: boolean;
  showHelp?: boolean;
}

export const SuperAdminLayout = ({
  children,
  title,
  description,
  showSearch = true,
  showHelp = true
}: SuperAdminLayoutProps) => {
  return (
    <TourProvider>
      <AuthenticatedLayout>
        <div className="space-y-6 max-w-7xl mx-auto p-6">
          {/* Header simple */}
          {title && (
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {description && (
                <p className="text-gray-600">{description}</p>
              )}
            </div>
          )}

          {/* Contenu principal */}
          <div className="min-h-[600px]">
            {children}
          </div>
        </div>

        {/* Composants globaux */}
        <KeyboardShortcuts />
      </AuthenticatedLayout>
    </TourProvider>
  );
};
