/* @ts-nocheck */
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, FileText, Clock, Shield } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/20">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
      
      <div className="container px-4 md:px-6 py-24 md:py-32">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <Badge variant="secondary" className="px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            Plateforme Officielle de la République Gabonaise
          </Badge>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Services Administratifs{' '}
              <span className="gabon-text-gradient">
                Numériques
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Simplifiez vos démarches administratives avec la plateforme officielle 
              du Gabon. Demandes en ligne, rendez-vous, suivi en temps réel.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/inscription">
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link href="/services">
                Découvrir les services
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">+50 Services</h3>
              <p className="text-sm text-muted-foreground">
                Tous vos documents administratifs disponibles en ligne
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border">
              <div className="w-12 h-12 rounded-full bg-gabon-yellow/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-gabon-yellow" />
              </div>
              <h3 className="font-semibold text-lg mb-2">24h/7j</h3>
              <p className="text-sm text-muted-foreground">
                Accès permanent à vos services administratifs
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border">
              <div className="w-12 h-12 rounded-full bg-gabon-blue/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-gabon-blue" />
              </div>
              <h3 className="font-semibold text-lg mb-2">100% Sécurisé</h3>
              <p className="text-sm text-muted-foreground">
                Vos données protégées selon les standards gouvernementaux
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}