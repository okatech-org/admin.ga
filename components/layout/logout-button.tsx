'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function LogoutButton({ 
  variant = 'ghost', 
  size = 'default', 
  className = '',
  showIcon = true,
  children
}: LogoutButtonProps) {
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

  return (
    <Button 
      variant={variant}
      size={size}
      className={`${className} ${variant === 'ghost' ? 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950' : ''}`}
      onClick={handleSignOut}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {children || 'Se déconnecter'}
    </Button>
  );
} 