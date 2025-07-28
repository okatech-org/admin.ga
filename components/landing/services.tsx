/* @ts-nocheck */
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  CreditCard, 
  Building2, 
  Users, 
  Scale, 
  Briefcase,
  ArrowRight
} from 'lucide-react';

export function Services() {
  const services = [
    {
      title: "Documents d'État Civil",
      description: "Actes de naissance, mariage, décès, certificats de vie et de célibat",
      icon: FileText,
      color: "text-gabon-green",
      bgColor: "bg-gabon-green/10",
      items: ["Acte de naissance", "Acte de mariage", "Acte de décès", "Certificat de vie"],
      href: "/services/etat-civil"
    },
    {
      title: "Documents d'Identité",
      description: "Carte d'identité, passeport, permis de conduire et documents de voyage",
      icon: CreditCard,
      color: "text-gabon-blue",
      bgColor: "bg-gabon-blue/10",
      items: ["Carte Nationale d'Identité", "Passeport", "Permis de conduire", "Carte de séjour"],
      href: "/services/identite"
    },
    {
      title: "Services Municipaux",
      description: "Permis, autorisations et services des collectivités locales",
      icon: Building2,
      color: "text-gabon-yellow",
      bgColor: "bg-gabon-yellow/10",
      items: ["Permis de construire", "Autorisation de commerce", "Certificat de résidence", "Actes fonciers"],
      href: "/services/municipaux"
    },
    {
      title: "Documents Judiciaires",
      description: "Casier judiciaire, certificats de nationalité et légalisations",
      icon: Scale,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      items: ["Casier judiciaire", "Certificat de nationalité", "Légalisation", "Attestations"],
      href: "/services/judiciaires"
    },
    {
      title: "Services Sociaux",
      description: "CNSS, CNAMGS, ONE et autres organismes sociaux",
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      items: ["Immatriculation CNSS", "Carte CNAMGS", "Attestation chômage", "Certificats médicaux"],
      href: "/services/sociaux"
    },
    {
      title: "Services Professionnels",
      description: "Documents liés au travail et à l'activité professionnelle",
      icon: Briefcase,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      items: ["Attestation de travail", "Registre de commerce", "Licences professionnelles", "Certificats"],
      href: "/services/professionnels"
    }
  ];

  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nos Services Administratifs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Accédez à tous les services des administrations gabonaises 
            depuis une seule plateforme moderne et sécurisée
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in service-card"
              data-delay={index}
            >
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg ${service.bgColor} flex items-center justify-center mb-4`}>
                  <service.icon className={`w-6 h-6 ${service.color}`} />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 mb-6">
                  {service.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-muted-foreground flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                  <Link href={service.href}>
                    Voir les services
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="/services">
              Voir tous les services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}