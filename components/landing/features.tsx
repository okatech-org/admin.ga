/* @ts-nocheck */
"use client";

import {
  Smartphone,
  Clock,
  Bell,
  Shield,
  Globe,
  Download,
  CheckCircle,
  Calendar
} from 'lucide-react';

export function Features() {
  const features = [
    {
      title: "Interface Mobile Optimisée",
      description: "Accédez à tous vos services depuis votre smartphone avec une interface parfaitement adaptée",
      icon: Smartphone,
      color: "text-blue-500"
    },
    {
      title: "Traitement Rapide",
      description: "Délais de traitement réduits grâce à la dématérialisation des procédures administratives",
      icon: Clock,
      color: "text-green-500"
    },
    {
      title: "Notifications en Temps Réel",
      description: "Recevez des notifications par email, SMS et in-app pour suivre l'avancement de vos demandes",
      icon: Bell,
      color: "text-yellow-500"
    },
    {
      title: "Sécurité Maximale",
      description: "Vos données personnelles sont protégées selon les plus hauts standards de sécurité",
      icon: Shield,
      color: "text-red-500"
    },
    {
      title: "Rendez-vous en Ligne",
      description: "Prenez rendez-vous avec les services administratifs directement depuis la plateforme",
      icon: Calendar,
      color: "text-purple-500"
    },
    {
      title: "Documents Numériques",
      description: "Téléchargez vos documents officiels au format PDF avec QR code de vérification",
      icon: Download,
      color: "text-indigo-500"
    },
    {
      title: "Suivi en Temps Réel",
      description: "Suivez l'état d'avancement de toutes vos demandes administratives en temps réel",
      icon: CheckCircle,
      color: "text-teal-500"
    },
    {
      title: "Support Multilingue",
      description: "Interface disponible en français avec support prévu pour d'autres langues locales",
      icon: Globe,
      color: "text-orange-500"
    }
  ];

  return (
    <section className="py-20 bg-accent/20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pourquoi Choisir Administration.ga ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une plateforme moderne pensée pour simplifier vos démarches
            administratives et vous faire gagner du temps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group p-6 rounded-lg bg-background border hover:shadow-lg transition-all duration-300 animate-fade-in"
              data-delay={index}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mr-3">
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
