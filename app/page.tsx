/* @ts-nocheck */
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Users,
  Shield,
  Zap,
  BarChart3,
  Globe,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Star,
  Clock,
  Smartphone,
  Database as DatabaseIcon,
  Settings,
  TrendingUp,
  Award,
  HeartHandshake
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const avantages = [
    {
      icon: Zap,
      titre: "Digitalisation Complète",
      description: "Transformez vos services papier en solutions numériques modernes et efficaces"
    },
    {
      icon: Users,
      titre: "Interfaces Citoyennes Unifiées",
      description: "DEMARCHE.GA pour les démarches administratives et TRAVAIL.GA pour l'emploi public"
    },
    {
      icon: Shield,
      titre: "Sécurité Renforcée",
      description: "Authentification multi-niveaux et protection des données selon les standards internationaux"
    },
    {
      icon: BarChart3,
      titre: "Analytics & Reporting",
      description: "Tableaux de bord en temps réel pour piloter votre administration efficacement"
    },
    {
      icon: Globe,
      titre: "Accessibilité 24h/7",
      description: "Vos services disponibles en permanence, depuis n'importe quel appareil"
    },
    {
      icon: DatabaseIcon,
      titre: "Gestion Centralisée",
      description: "Base de données unifiée avec sauvegarde automatique et récupération de données"
    }
  ];

  const statistiques = [
    { nombre: "117+", label: "Administrations Intégrées", icon: Building2 },
    { nombre: "2.4M+", label: "Citoyens Connectés", icon: Users },
    { nombre: "850K+", label: "Démarches Traitées", icon: CheckCircle },
    { nombre: "99.9%", label: "Disponibilité Système", icon: TrendingUp }
  ];

  const temoignages = [
    {
      nom: "Direction Générale de la Documentation",
      logo: "🆔",
      temoignage: "Depuis notre intégration à ADMINISTRATION.GA, nous avons réduit les délais de traitement des passeports de 15 jours à 3 jours.",
      personne: "Directeur Général DGDI"
    },
    {
      nom: "Mairie de Libreville",
      logo: "🏛️",
      temoignage: "L'interface citoyenne nous a permis de traiter 300% plus de demandes avec la même équipe.",
      personne: "Maire de Libreville"
    },
    {
      nom: "Caisse Nationale de Sécurité Sociale",
      logo: "💚",
      temoignage: "La gestion numérisée des dossiers nous fait économiser plus de 2 millions FCFA par mois en frais administratifs.",
      personne: "DG CNSS"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ADMINISTRATION.GA</h1>
              <p className="text-xs text-gray-600">Plateforme Administrative du Gabon</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/auth/connexion">
                Connexion Administrations
              </Link>
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              onClick={() => setIsFormOpen(true)}
            >
              Rejoindre ADMINISTRATION.GA
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-200">
            🇬🇦 République Gabonaise - Modernisation Administrative
          </Badge>

          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Modernisez Votre Administration avec
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> ADMINISTRATION.GA</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Rejoignez la révolution numérique des services publics gabonais.
            Une plateforme unique qui transforme l'expérience citoyenne et optimise vos processus administratifs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 px-8 py-4 text-lg"
              onClick={() => setIsFormOpen(true)}
            >
              <Building2 className="w-5 h-5 mr-2" />
              Demander l'Intégration
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg"
              asChild
            >
              <Link href="/demo">
                <Smartphone className="w-5 h-5 mr-2" />
                Voir la Démo
              </Link>
            </Button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {statistiques.map((stat, index) => (
              <Card key={index} className="text-center border-2 hover:border-blue-200 transition-colors">
                <CardContent className="p-6">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.nombre}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir ADMINISTRATION.GA ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Une solution complète qui révolutionne la gestion administrative et améliore l'expérience citoyenne
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {avantages.map((avantage, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:border-blue-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <avantage.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{avantage.titre}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {avantage.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages Section */}
      <section className="bg-gradient-to-r from-blue-50 to-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ils Nous Font Confiance
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez les retours d'expérience des administrations déjà intégrées
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {temoignages.map((temoignage, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{temoignage.logo}</div>
                    <div>
                      <CardTitle className="text-lg">{temoignage.nom}</CardTitle>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-gray-600 italic mb-4">
                    "{temoignage.temoignage}"
                  </blockquote>
                  <cite className="text-sm font-medium text-gray-900">
                    — {temoignage.personne}
                  </cite>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à Moderniser Votre Administration ?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Rejoignez les 117+ administrations qui ont déjà fait le choix de l'excellence numérique avec ADMINISTRATION.GA
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="px-8 py-4 text-lg"
              onClick={() => setIsFormOpen(true)}
            >
              <HeartHandshake className="w-5 h-5 mr-2" />
              Demander l'Intégration
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link href="tel:+24177123456">
                <Phone className="w-5 h-5 mr-2" />
                Nous Contacter
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold text-white">ADMINISTRATION.GA</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Plateforme officielle de modernisation administrative de la République Gabonaise
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Libreville, Gabon</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+241 77 12 34 56</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>contact@administration.ga</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm">
                <li>Intégration Administrative</li>
                <li>Formation des Équipes</li>
                <li>Support Technique 24h/7</li>
                <li>Maintenance & Mises à Jour</li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">République Gabonaise</h3>
              <ul className="space-y-2 text-sm">
                <li>Ministères & Directions</li>
                <li>Mairies & Préfectures</li>
                <li>Organismes Sociaux</li>
                <li>Institutions Judiciaires</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 ADMINISTRATION.GA - République Gabonaise. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Modal de demande d'intégration */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Demande d'Intégration
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFormOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  ✕
                </Button>
              </CardTitle>
              <CardDescription>
                Remplissez ce formulaire pour rejoindre ADMINISTRATION.GA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nom de l'Administration</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="Ex: Mairie de Port-Gentil"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Type d'Administration</label>
                <select
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  aria-label="Type d'Administration"
                >
                  <option>Ministère</option>
                  <option>Direction Générale</option>
                  <option>Mairie</option>
                  <option>Préfecture</option>
                  <option>Organisme Public</option>
                  <option>Institution</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Responsable</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="Nom du responsable"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email de Contact</label>
                <input
                  type="email"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="contact@votre-administration.ga"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Téléphone</label>
                <input
                  type="tel"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="+241 XX XX XX XX"
                />
              </div>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                onClick={() => {
                  setIsFormOpen(false);
                  alert("Demande envoyée ! Notre équipe vous contactera sous 48h.");
                }}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Envoyer la Demande
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
