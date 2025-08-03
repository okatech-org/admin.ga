'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import SidebarHierarchical from '@/components/layouts/sidebar-hierarchical';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Menu, X, Bell, Search, User } from 'lucide-react';

interface AuthenticatedLayoutEnhancedProps {
  children: React.ReactNode;
  className?: string;
  showSidebar?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function AuthenticatedLayoutEnhanced({
  children,
  className,
  showSidebar = true,
  showHeader = true,
  showFooter = false
}: AuthenticatedLayoutEnhancedProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Déterminer si on doit afficher la sidebar selon le rôle et la route
  const shouldShowSidebar = showSidebar && (
    session?.user?.role === 'SUPER_ADMIN' && pathname.startsWith('/super-admin')
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header moderne */}
      {showHeader && (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Left side */}
            <div className="flex items-center gap-4">
              {shouldShowSidebar && (
                <>
                  {/* Desktop sidebar toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className="hidden lg:flex"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>

                  {/* Mobile menu toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMobileMenu}
                    className="lg:hidden"
                  >
                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </>
              )}

              {/* Logo / Brand */}
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GA</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-bold text-gray-900">Administration.GA</h1>
                  {session?.user?.role === 'SUPER_ADMIN' && (
                    <p className="text-xs text-gray-500">Super Administration</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Search className="h-4 w-4" />
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  3
                </span>
              </Button>

              {/* User menu */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {session?.user?.firstName} {session?.user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{session?.user?.role}</p>
                </div>
                <Button variant="ghost" size="sm" className="rounded-full p-2">
                  <User className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar Desktop */}
        {shouldShowSidebar && (
          <>
            <div
              className={cn(
                "hidden lg:flex flex-col transition-all duration-300 bg-white border-r border-gray-200",
                sidebarOpen ? "w-80" : "w-16"
              )}
            >
              {sidebarOpen ? (
                <SidebarHierarchical />
              ) : (
                <div className="p-4">
                  <p className="text-xs text-gray-500 text-center">Menu</p>
                </div>
              )}
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <div className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden">
                  <SidebarHierarchical />
                </div>
              </>
            )}
          </>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className={cn("min-h-full", className)}>
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      {showFooter && (
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <p>© 2025 Administration.GA - Tous droits réservés</p>
              <div className="flex items-center gap-4">
                <span>307 organismes</span>
                <span>•</span>
                <span>979 utilisateurs</span>
                <span>•</span>
                <span>558 services</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
