/* @ts-nocheck */
"use client";

import { useEffect, useState } from 'react';

export function Stats() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    {
      value: "50,000+",
      label: "Citoyens inscrits",
      description: "Utilisateurs actifs sur la plateforme"
    },
    {
      value: "25",
      label: "Administrations",
      description: "Organismes publics connectés"
    },
    {
      value: "120,000+",
      label: "Documents traités",
      description: "Demandes traitées avec succès"
    },
    {
      value: "98%",
      label: "Satisfaction",
      description: "Taux de satisfaction utilisateur"
    }
  ];

  if (!mounted) {
    return <div className="h-48" />; // Placeholder
  }

  return (
    <section className="py-16 bg-card/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            La Confiance des Gabonais
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des chiffres qui témoignent de notre engagement pour 
            moderniser l'administration gabonaise
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-lg bg-background border hover:shadow-lg transition-shadow animate-fade-in stat-card"
              data-delay={index}
            >
              <div className="text-3xl md:text-4xl font-bold gabon-text-gradient mb-2">
                {stat.value}
              </div>
              <div className="font-semibold text-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}