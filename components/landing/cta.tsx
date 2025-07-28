/* @ts-nocheck */
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, UserPlus, LogIn } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 gabon-gradient opacity-5" />
      
      <div className="container px-4 md:px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Simplifiez vos Démarches{' '}
            <span className="gabon-text-gradient">
              Dès Aujourd'hui
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Rejoignez les milliers de Gabonais qui ont déjà adopté 
            la solution numérique pour leurs services administratifs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/inscription">
                <UserPlus className="mr-2 h-5 w-5" />
                Créer mon compte
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link href="/connexion">
                <LogIn className="mr-2 h-5 w-5" />
                J'ai déjà un compte
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <div className="text-2xl font-bold text-primary mb-2">1</div>
              <h3 className="font-semibold mb-2">Inscription Gratuite</h3>
              <p className="text-sm text-muted-foreground">
                Créez votre compte en quelques minutes avec votre email ou téléphone
              </p>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-primary mb-2">2</div>
              <h3 className="font-semibold mb-2">Choisissez vos Services</h3>
              <p className="text-sm text-muted-foreground">
                Sélectionnez les services administratifs dont vous avez besoin
              </p>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-primary mb-2">3</div>
              <h3 className="font-semibold mb-2">Suivez vos Demandes</h3>
              <p className="text-sm text-muted-foreground">
                Recevez vos documents et suivez le progrès en temps réel
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}