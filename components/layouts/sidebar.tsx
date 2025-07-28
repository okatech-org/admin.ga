/* @ts-nocheck */
"use client";

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Home,
  FileText,
  Calendar,
  Users,
  Settings,
  BarChart3,
  Building2,
  Shield,
  UserCog,
  ClipboardList,
  Clock,
  CheckCircle,
  LogOut,
  HelpCircle,
  Database,
  Monitor,
  Cog,
  PieChart,
  TrendingUp,
  Globe,
  Server,
  Lock,
  Cpu,
  HardDrive
} from 'lucide-react';

const navigation = {
  USER: [
    { name: 'Tableau de bord', href: '/citoyen/dashboard', icon: Home },
    { name: 'Mes demandes', href: '/citoyen/demandes', icon: FileText },
    { name: 'Mes rendez-vous', href: '/citoyen/rendez-vous', icon: Calendar },
    { name: 'Mon profil', href: '/citoyen/profil', icon: Users },
  ],
  AGENT: [
    { name: 'Tableau de bord', href: '/agent/dashboard', icon: Home },
    { name: 'File d\'attente', href: '/agent/demandes', icon: ClipboardList },
    { name: 'Mes rendez-vous', href: '/agent/rendez-vous', icon: Calendar },
    { name: 'Traitées', href: '/agent/traitees', icon: CheckCircle },
  ],
  MANAGER: [
    { name: 'Tableau de bord', href: '/manager/dashboard', icon: Home },
    { name: 'Équipe', href: '/manager/equipe', icon: Users },
    { name: 'Demandes', href: '/manager/demandes', icon: FileText },
    { name: 'Planning', href: '/manager/planning', icon: Calendar },
    { name: 'Statistiques', href: '/manager/statistiques', icon: BarChart3 },
  ],
  ADMIN: [
    { name: 'Tableau de bord', href: '/admin/dashboard', icon: Home },
    { name: 'Organisation', href: '/admin/organisation', icon: Building2 },
    { name: 'Utilisateurs', href: '/admin/utilisateurs', icon: UserCog },
    { name: 'Demandes', href: '/admin/demandes', icon: FileText },
    { name: 'Services', href: '/admin/services', icon: Settings },
    { name: 'Rapports', href: '/admin/rapports', icon: BarChart3 },
  ],
  SUPER_ADMIN: [
    { 
      section: 'Administration',
      items: [
        { name: 'Dashboard Super Admin', href: '/super-admin/dashboard', icon: Shield },
        { name: 'Tableau de bord', href: '/admin/dashboard', icon: Home },
      ]
    },
    {
      section: 'Gestion des Organismes',
      items: [
        { name: 'Administrations', href: '/super-admin/administrations', icon: Building2 },
        { name: 'Créer Organisme', href: '/super-admin/organisme/nouveau', icon: Building2 },
        { name: 'Services Publics', href: '/super-admin/services', icon: FileText },
      ]
    },
    {
      section: 'Utilisateurs & Sécurité',
      items: [
        { name: 'Utilisateurs', href: '/super-admin/utilisateurs', icon: UserCog },
        { name: 'Comptes Organismes', href: '/super-admin/comptes', icon: Users },
        { name: 'Permissions', href: '/super-admin/permissions', icon: Lock },
      ]
    },
    {
      section: 'Système & Monitoring',
      items: [
        { name: 'Système', href: '/super-admin/systeme', icon: Server },
        { name: 'Monitoring', href: '/super-admin/monitoring', icon: Monitor },
        { name: 'Logs', href: '/super-admin/logs', icon: Database },
      ]
    },
    {
      section: 'Analytics & Configuration',
      items: [
        { name: 'Analytics', href: '/super-admin/analytics', icon: TrendingUp },
        { name: 'Métriques', href: '/super-admin/metriques', icon: PieChart },
        { name: 'Configuration', href: '/super-admin/configuration', icon: Cog },
      ]
    }
  ],
};

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  const userNavigation = navigation[session.user.role] || navigation.USER;

  const handleSignOut = () => {
    toast.loading('Déconnexion en cours...');
    signOut({ 
      callbackUrl: '/',
      redirect: true 
    }).then(() => {
      toast.success('Déconnexion réussie');
    });
  };

  // Fonction pour rendre la navigation structurée du Super Admin
  const renderSuperAdminNavigation = () => {
    return (
      <div className="space-y-4">
        {userNavigation.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
              {section.section}
            </h4>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <span className={cn(
                      'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors',
                      isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                    )}>
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
            {sectionIndex < userNavigation.length - 1 && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
      </div>
    );
  };

  // Fonction pour rendre la navigation standard
  const renderStandardNavigation = () => {
    return (
      <div className="space-y-1">
        {userNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <span className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors',
                isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
              )}>
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div className="hidden border-r bg-gray-100/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <Shield className="h-6 w-6" />
            <span className="">Admin.GA</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 overflow-auto p-3">
          <nav className="grid items-start gap-2">
            {session.user.role === 'SUPER_ADMIN' ? renderSuperAdminNavigation() : renderStandardNavigation()}
          </nav>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="space-y-2">
            <Link href="/aide">
              <span className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                <HelpCircle className="mr-3 h-4 w-4" />
                Aide & Support
              </span>
            </Link>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Se déconnecter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}