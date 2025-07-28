/* @ts-nocheck */
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  Menu, 
  FileText, 
  Calendar, 
  Users, 
  Building2, 
  Shield,
  Flag
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const services = [
    {
      title: "Documents d'État Civil",
      href: "/services/etat-civil",
      description: "Actes de naissance, mariage, décès",
      icon: FileText,
    },
    {
      title: "Documents d'Identité",
      href: "/services/identite",
      description: "CNI, Passeport, Permis de conduire",
      icon: Shield,
    },
    {
      title: "Services Municipaux",
      href: "/services/municipaux",
      description: "Permis de construire, Autorisations",
      icon: Building2,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 gabon-gradient rounded-full flex items-center justify-center">
              <Flag className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl gabon-text-gradient">
              Admin.ga
            </span>
          </Link>
        </div>

        {/* Navigation Desktop */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <div className="flex h-full w-full select-none flex-col justify-end rounded-md gabon-gradient p-6 no-underline outline-none focus:shadow-md">
                        <Flag className="h-6 w-6 text-white" />
                        <div className="mb-2 mt-4 text-lg font-medium text-white">
                          Services Publics
                        </div>
                        <p className="text-sm leading-tight text-white/90">
                          Accédez à tous les services administratifs du Gabon en ligne
                        </p>
                      </div>
                    </NavigationMenuLink>
                  </li>
                  {services.map((service) => (
                    <ListItem
                      key={service.title}
                      title={service.title}
                      href={service.href}
                      icon={service.icon}
                    >
                      {service.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/rendez-vous" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  Rendez-vous
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/aide" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  Aide
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="hidden md:flex space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/connexion">Se connecter</Link>
            </Button>
            <Button asChild>
              <Link href="/inscription">S'inscrire</Link>
            </Button>
          </div>

          {/* Menu Mobile */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigation Admin.ga
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Services</h4>
                  {services.map((service) => (
                    <Link
                      key={service.title}
                      href={service.href}
                      className="flex items-center space-x-2 rounded-md p-2 hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      <service.icon className="h-4 w-4" />
                      <span className="text-sm">{service.title}</span>
                    </Link>
                  ))}
                </div>
                <div className="space-y-2 pt-4 border-t">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/connexion">Se connecter</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/inscription">S'inscrire</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

const ListItem = ({ className, title, children, icon: Icon, ...props }: any) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center space-x-2">
            <Icon className="h-4 w-4" />
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};