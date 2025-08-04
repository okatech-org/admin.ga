'use client';

import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { TourProvider, ContextualHelp, KeyboardShortcuts } from '@/components/super-admin/guided-tour';
import { SmartSearch } from '@/components/super-admin/smart-search';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, HelpCircle, Keyboard } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showSearch?: boolean;
  showHelp?: boolean;
}

export const SuperAdminLayout = ({
  children,
  title = "Super Admin",
  description = "Interface d'administration avancée pour ADMIN.GA",
  showSearch = true,
  showHelp = true
}: SuperAdminLayoutProps) => {
  const pathname = usePathname();
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <TourProvider>
      <AuthenticatedLayout>
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* En-tête moderne */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    {title}
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      v2024.1
                    </Badge>
                  </h1>
                  <p className="text-gray-600">{description}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {showSearch && (
                <SmartSearch className="w-80" />
              )}

              {showHelp && (
                <ContextualHelp page={pathname} />
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShortcuts(true)}
                className="hidden lg:flex"
              >
                <Keyboard className="w-4 h-4 mr-2" />
                Raccourcis
              </Button>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="min-h-[600px]">
            {children}
          </div>

          {/* Footer d'aide */}
          <div className="border-t border-gray-200 pt-6 mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🚀 Navigation Rapide</h4>
                <p>Utilisez <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+K</kbd> pour rechercher instantanément</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">💡 Aide Contextuelle</h4>
                <p>Chaque page dispose d'aide intégrée et de conseils personnalisés</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">⚡ Actions Fréquentes</h4>
                <p>Les éléments populaires sont marqués d'une étoile et facilement accessibles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Composants globaux */}
        <KeyboardShortcuts />
      </AuthenticatedLayout>
    </TourProvider>
  );
};
