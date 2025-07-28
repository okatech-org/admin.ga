'use client';

import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Settings, User, Shield } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export function UserMenu() {
  const { data: session } = useSession();

  if (!session) return null;

  const handleSignOut = () => {
    toast.loading('Déconnexion en cours...');
    signOut({ 
      callbackUrl: '/',
      redirect: true 
    }).then(() => {
      toast.success('Déconnexion réussie');
    });
  };

  const getProfileLink = () => {
    switch (session.user.role) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        return '/admin/profil';
      case 'MANAGER':
        return '/manager/profil';
      case 'AGENT':
        return '/agent/profil';
      default:
        return '/citoyen/profil';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Administrateur';
      case 'ADMIN':
        return 'Administrateur';
      case 'MANAGER':
        return 'Responsable';
      case 'AGENT':
        return 'Agent';
      default:
        return 'Citoyen';
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="" />
            <AvatarFallback>
              {getInitials(session.user.firstName, session.user.lastName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.firstName} {session.user.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {getRoleLabel(session.user.role)}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href={getProfileLink()}>
            <User className="mr-2 h-4 w-4" />
            <span>Mon profil</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/parametres">
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </Link>
        </DropdownMenuItem>

        {(session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN') && (
          <DropdownMenuItem asChild>
            <Link href="/admin/dashboard">
              <Shield className="mr-2 h-4 w-4" />
              <span>Administration</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600" 
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 