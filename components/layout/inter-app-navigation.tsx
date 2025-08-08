'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  FileText,
  Briefcase,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

interface Application {
  id: string;
  name: string;
  title: string;
  description: string;
  url: string;
  domain: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  stats: {
    users: string;
    services: string;
  };
}

const applications: Application[] = [
  {
    id: 'administration',
    name: 'ADMINISTRATION.GA',
    title: 'Plateforme d\'Administration',
    description: 'Gestion des organismes, utilisateurs et services publics',
    url: '/',
    domain: 'administration.ga',
    color: 'bg-green-600',
    icon: Shield,
    stats: {
      users: '15.2K',
      services: '127'
    }
  },
  {
    id: 'demarche',
    name: 'DEMARCHE.GA',
    title: 'Portail des Démarches',
    description: 'Démarches administratives en ligne pour les citoyens',
    url: '/demarche',
    domain: 'demarche.ga',
    color: 'bg-blue-600',
    icon: FileText,
    stats: {
      users: '48.7K',
      services: '89'
    }
  },
  {
    id: 'travail',
    name: 'TRAVAIL.GA',
    title: 'Plateforme de l\'Emploi',
    description: 'Recherche d\'emploi et gestion des carrières publiques',
    url: '/travail',
    domain: 'travail.ga',
    color: 'bg-purple-600',
    icon: Briefcase,
    stats: {
      users: '32.1K',
      services: '2.8K'
    }
  }
];

interface InterAppNavigationProps {
  currentApp?: string;
  showStats?: boolean;
  compact?: boolean;
}

export function InterAppNavigation({
  currentApp,
  showStats = true,
  compact = false
}: InterAppNavigationProps) {
  const pathname = usePathname();

  // Déterminer l'application actuelle basée sur l'URL
  const getCurrentApp = () => {
    if (pathname.startsWith('/demarche')) return 'demarche';
    if (pathname.startsWith('/travail')) return 'travail';
    return 'administration';
  };

  const activeApp = currentApp || getCurrentApp();

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        {applications.map((app) => (
          <Button
            key={app.id}
            variant={activeApp === app.id ? "default" : "outline"}
            size="sm"
            asChild
            className={activeApp === app.id ? app.color : ''}
          >
            <Link href={app.url} className="flex items-center space-x-2">
              <app.icon className="w-4 h-4" />
              <span className="hidden md:inline">{app.name.split('.')[0]}</span>
            </Link>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Écosystème Digital du Gabon
          </h2>
          <p className="text-gray-600">
            Accédez à tous nos services publics numériques
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {applications.map((app) => {
            const isActive = activeApp === app.id;

            return (
              <div
                key={app.id}
                className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                  isActive
                    ? 'border-gray-400 bg-gray-100'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                {isActive && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 text-white">
                      Application actuelle
                    </Badge>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 ${app.color} rounded-lg flex items-center justify-center`}>
                      <app.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {app.name}
                      </h3>
                      <p className="text-sm text-gray-600">{app.title}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    {app.description}
                  </p>

                  {showStats && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">
                          {app.stats.users}
                        </div>
                        <div className="text-xs text-gray-600">Utilisateurs</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">
                          {app.stats.services}
                        </div>
                        <div className="text-xs text-gray-600">
                          {app.id === 'travail' ? 'Offres' : 'Services'}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ExternalLink className="w-4 h-4" />
                      <span className="font-mono">{app.domain}</span>
                    </div>

                    {!isActive ? (
                      <Button
                        asChild
                        className={`w-full ${app.color} hover:opacity-90`}
                      >
                        <Link href={app.url} className="flex items-center justify-center space-x-2">
                          <span>Accéder à {app.name.split('.')[0]}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        disabled
                      >
                        Application actuelle
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Toutes les applications sont accessibles avec votre compte unique
          </p>
        </div>
      </div>
    </div>
  );
}

export default InterAppNavigation;
