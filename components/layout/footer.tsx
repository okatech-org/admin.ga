/* @ts-nocheck */
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Flag, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin,
  FileText,
  Shield,
  Building2,
  Users
} from 'lucide-react';

export function Footer() {
  const services = [
    { name: "Documents d'État Civil", href: "/services/etat-civil" },
    { name: "Documents d'Identité", href: "/services/identite" },
    { name: "Services Municipaux", href: "/services/municipaux" },
    { name: "Documents Judiciaires", href: "/services/judiciaires" },
  ];

  const administrations = [
    { name: "Mairie de Libreville", href: "/administrations/libreville" },
    { name: "DGDI", href: "/administrations/dgdi" },
    { name: "Ministère de l'Intérieur", href: "/administrations/interieur" },
    { name: "Direction des Impôts", href: "/administrations/impots" },
  ];

  const support = [
    { name: "Centre d'aide", href: "/aide" },
    { name: "Guide d'utilisation", href: "/guide" },
    { name: "FAQ", href: "/faq" },
    { name: "Nous contacter", href: "/contact" },
  ];

  const legal = [
    { name: "Mentions légales", href: "/mentions-legales" },
    { name: "Politique de confidentialité", href: "/confidentialite" },
    { name: "Conditions d'utilisation", href: "/conditions" },
    { name: "Accessibilité", href: "/accessibilite" },
  ];

  return (
    <footer className="bg-background border-t">
      <div className="container px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 gabon-gradient rounded-full flex items-center justify-center">
                <Flag className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl gabon-text-gradient">
                Admin.ga
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              La plateforme officielle des services administratifs 
              de la République Gabonaise. Modernisation et simplification 
              de vos démarches administratives.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                Libreville, République Gabonaise
              </div>
              <div className="flex items-center text-muted-foreground">
                <Phone className="w-4 h-4 mr-2" />
                +241 01 76 12 34
              </div>
              <div className="flex items-center text-muted-foreground">
                <Mail className="w-4 h-4 mr-2" />
                contact@admin.ga
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Services
            </h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link 
                    href={service.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Administrations */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <Building2 className="w-4 h-4 mr-2" />
              Administrations
            </h3>
            <ul className="space-y-2">
              {administrations.map((admin) => (
                <li key={admin.name}>
                  <Link 
                    href={admin.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {admin.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Support
            </h3>
            <ul className="space-y-2">
              {support.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Restez informé des nouveautés et mises à jour de la plateforme.
            </p>
            <div className="space-y-3">
              <Input 
                type="email" 
                placeholder="Votre email" 
                className="text-sm"
              />
              <Button size="sm" className="w-full">
                S'abonner
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {legal.map((item, index) => (
              <span key={item.name}>
                <Link 
                  href={item.href}
                  className="hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
                {index < legal.length - 1 && <span className="ml-4">•</span>}
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Suivez-nous :
            </span>
            <div className="flex space-x-2">
              <Button size="icon" variant="ghost">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="text-center text-sm text-muted-foreground">
          <p>
            © 2024 République Gabonaise - Admin.ga. Tous droits réservés.
          </p>
          <p className="mt-1">
            Développé par la Direction Générale de la Modernisation de l'Administration (DGMA)
          </p>
        </div>
      </div>
    </footer>
  );
}