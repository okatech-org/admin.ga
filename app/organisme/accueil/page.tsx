'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Users,
  FileText,
  Shield,
  Phone,
  Mail,
  MapPin,
  Globe,
  ArrowRight,
  CheckCircle,
  Clock,
  Calendar,
  Bell,
  Settings,
  LogIn
} from 'lucide-react';
import { OrganismeMultiTenant } from '@/lib/types/multi-tenant';

interface AccueilOrganismeProps {
  organisme?: OrganismeMultiTenant;
}

export default function AccueilOrganismePage() {
  const [organisme, setOrganisme] = useState<OrganismeMultiTenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // En production, récupérer les données de l'organisme depuis l'API
    // basé sur les headers X-Tenant-* ajoutés par le middleware
    loadOrganismeData();
  }, []);

  const loadOrganismeData = async () => {
    try {
      // Simulation - en production, utiliser l'API
      const organismeData: OrganismeMultiTenant = {
        id: 'org_demo_001',
        nom: 'Ministère de la Digitalisation',
        slug: 'min-digitalisation',
        domaine_personnalise: 'digitalisation.ga',
        date_creation: new Date().toISOString(),
        statut: 'actif',
        logo_url: 'https://via.placeholder.com/200x80/1976d2/ffffff?text=LOGO',
        favicon_url: '/favicon.ico',
        couleur_primaire: '#1976d2',
        couleur_secondaire: '#42a5f5',
        css_personnalise: '',
        config: {
          max_utilisateurs: 100,
          fonctionnalites_actives: ['Dashboard Avancé', 'API Publique'],
          langue_defaut: 'fr'
        },
        pages_personnalisees: {
          message_bienvenue: 'Bienvenue sur la plateforme numérique du Ministère de la Digitalisation',
          contenu_accueil: 'Accédez à tous vos services administratifs en ligne de manière simple et sécurisée. Notre plateforme vous permet de gérer vos démarches administratives 24h/24 et 7j/7.',
          pied_page: '© 2024 Ministère de la Digitalisation - République Gabonaise'
        },
        integrations: {
          sso_actif: false,
          api_publique_activee: true,
          webhooks_actifs: false
        }
      };

      setOrganisme(organismeData);
    } catch (error) {
      console.error('Erreur chargement organisme:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!organisme) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Organisme non trouvé</h2>
            <p className="text-gray-600">L'organisme demandé n'existe pas ou n'est pas configuré.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{
        '--couleur-primaire': organisme.couleur_primaire,
        '--couleur-secondaire': organisme.couleur_secondaire
      } as React.CSSProperties}
    >
      {/* Header personnalisé */}
      <header
        className="shadow-sm border-b"
        style={{
          background: `linear-gradient(135deg, ${organisme.couleur_primaire} 0%, ${organisme.couleur_secondaire} 100%)`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {organisme.logo_url && (
                <img
                  src={organisme.logo_url}
                  alt={`Logo ${organisme.nom}`}
                  className="h-12 object-contain"
                />
              )}
              <div>
                <h1 className="text-xl font-bold text-white">{organisme.nom}</h1>
                <p className="text-sm text-white/80">Plateforme Numérique Officielle</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Bell className="h-4 w-4 mr-2" />
                Actualités
              </Button>
              <Button
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => window.location.href = '/connexion'}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Se Connecter
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Section Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {organisme.pages_personnalisees.message_bienvenue}
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {organisme.pages_personnalisees.contenu_accueil}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-3"
              style={{ backgroundColor: organisme.couleur_primaire }}
              onClick={() => window.location.href = '/connexion'}
            >
              Accéder aux Services
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3"
            >
              <FileText className="h-5 w-5 mr-2" />
              Guide d'Utilisation
            </Button>
          </div>
        </div>
      </section>

      {/* Services disponibles */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Services Disponibles</h3>
            <p className="text-lg text-gray-600">
              Découvrez tous les services administratifs que vous pouvez gérer en ligne
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Gestion des Utilisateurs',
                description: 'Créer et gérer les comptes utilisateurs de votre organisme',
                icon: Users,
                color: 'blue'
              },
              {
                title: 'Documents Administratifs',
                description: 'Générer et valider vos documents officiels',
                icon: FileText,
                color: 'green'
              },
              {
                title: 'Sécurité & Accès',
                description: 'Gérer les permissions et la sécurité des données',
                icon: Shield,
                color: 'red'
              },
              {
                title: 'Planification',
                description: 'Organiser vos rendez-vous et réunions',
                icon: Calendar,
                color: 'purple'
              },
              {
                title: 'Notifications',
                description: 'Système d\'alertes et de communications',
                icon: Bell,
                color: 'yellow'
              },
              {
                title: 'Configuration',
                description: 'Personnaliser votre espace de travail',
                icon: Settings,
                color: 'gray'
              }
            ].map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-3 rounded-lg bg-${service.color}-100`}
                    >
                      <service.icon className={`h-6 w-6 text-${service.color}-600`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => window.location.href = '/connexion'}
                  >
                    Accéder
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8 text-white"
        style={{
          background: `linear-gradient(135deg, ${organisme.couleur_primaire} 0%, ${organisme.couleur_secondaire} 100%)`
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Notre Impact</h3>
            <p className="text-lg text-white/90">
              Les chiffres qui témoignent de notre engagement numérique
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Utilisateurs Actifs', value: '2,847', icon: Users },
              { label: 'Documents Traités', value: '15,234', icon: FileText },
              { label: 'Services Disponibles', value: '28', icon: CheckCircle },
              { label: 'Temps de Réponse', value: '< 2min', icon: Clock }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-12 w-12 mx-auto mb-4 text-white/80" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Support */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Besoin d'Aide ?</h3>
            <p className="text-lg text-gray-600">
              Notre équipe support est là pour vous accompagner
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Support Téléphonique</h4>
                <p className="text-gray-600 mb-4">Lundi - Vendredi<br />8h00 - 17h00</p>
                <p className="font-mono text-blue-600">+241 XX XX XX XX</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Support Email</h4>
                <p className="text-gray-600 mb-4">Réponse sous 24h<br />7j/7</p>
                <p className="font-mono text-green-600">support@{organisme.slug}.ga</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Adresse Physique</h4>
                <p className="text-gray-600 mb-4">Accueil sur rendez-vous<br />Lundi - Vendredi</p>
                <p className="text-purple-600">Libreville, Gabon</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer personnalisé */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="text-lg font-semibold mb-4">{organisme.nom}</h5>
              <p className="text-gray-400">
                Plateforme numérique officielle pour simplifier vos démarches administratives.
              </p>
            </div>

            <div>
              <h5 className="text-lg font-semibold mb-4">Services</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documents</a></li>
                <li><a href="#" className="hover:text-white">Utilisateurs</a></li>
                <li><a href="#" className="hover:text-white">Sécurité</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-lg font-semibold mb-4">Ressources</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Guide d'utilisation</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Tutoriels</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-lg font-semibold mb-4">Légal</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Conditions d'utilisation</a></li>
                <li><a href="#" className="hover:text-white">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-white">RGPD</a></li>
                <li><a href="#" className="hover:text-white">Mentions légales</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>{organisme.pages_personnalisees.pied_page}</p>
          </div>
        </div>
      </footer>

      {/* CSS personnalisé injecté */}
      {organisme.css_personnalise && (
        <style dangerouslySetInnerHTML={{ __html: organisme.css_personnalise }} />
      )}
    </div>
  );
}
