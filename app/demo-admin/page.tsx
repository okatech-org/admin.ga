'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogoPNG } from '@/components/ui/logo-png';
import { LogoAdministrationGA } from '@/components/ui/logo-administration-ga';
import {
  Settings, ExternalLink, Palette, Menu, FileText,
  Bell, Eye, Shield, Globe, Zap, CheckCircle, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

/**
 * Page de Démonstration de l'Interface d'Administration Web
 *
 * Cette page présente les fonctionnalités disponibles et permet
 * d'accéder rapidement à l'interface d'administration.
 */

export default function DemoAdminPage() {
  const features = [
    {
      id: 'logos',
      title: 'Logos & Assets',
      description: 'Gérez les logos, couleurs et éléments visuels des applications',
      icon: Palette,
      color: 'bg-blue-500',
      status: 'Disponible'
    },
    {
      id: 'appearance',
      title: 'Apparence',
      description: 'Configurez les noms, descriptions et thèmes visuels',
      icon: Eye,
      color: 'bg-green-500',
      status: 'Disponible'
    },
    {
      id: 'menus',
      title: 'Gestion des Menus',
      description: 'Organisez la navigation avec glisser-déposer',
      icon: Menu,
      color: 'bg-purple-500',
      status: 'Disponible'
    },
    {
      id: 'content',
      title: 'Contenu',
      description: 'Créez et gérez les pages, articles et documentation',
      icon: FileText,
      color: 'bg-orange-500',
      status: 'Disponible'
    },
    {
      id: 'news',
      title: 'Actualités',
      description: 'Publiez des actualités et annonces système',
      icon: Bell,
      color: 'bg-red-500',
      status: 'Disponible'
    },
    {
      id: 'settings',
      title: 'Paramètres',
      description: 'Configuration système, sécurité et maintenance',
      icon: Settings,
      color: 'bg-gray-500',
      status: 'Disponible'
    }
  ];

  const applications = [
    {
      name: 'ADMINISTRATION.GA',
      description: 'Plateforme d\'administration gouvernementale',
      icon: Shield,
      color: 'bg-gradient-to-r from-green-600 via-yellow-500 to-blue-600',
      features: ['Gestion des utilisateurs', 'Analytics avancées', 'Sécurité renforcée']
    },
    {
      name: 'DEMARCHE.GA',
      description: 'Portail citoyen pour les démarches',
      icon: Globe,
      color: 'bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500',
      features: ['Interface citoyenne', 'Démarches simplifiées', 'Services en ligne']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <LogoAdministrationGA width={40} height={40} />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-yellow-500 to-blue-600 bg-clip-text text-transparent">
                  Interface d'Administration Web
                </h1>
                <p className="text-gray-600">Environnement de gestion pour ADMINISTRATION.GA & DEMARCHE.GA</p>
              </div>
            </div>
            <Link href="/admin-web">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Settings className="w-5 h-5 mr-2" />
                Accéder à l'Interface
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Introduction */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-900">
              <Zap className="w-6 h-6" />
              <span>Environnement d'Administration Complet</span>
            </CardTitle>
            <CardDescription className="text-blue-700">
              Modifiez et personnalisez tous les aspects visuels et informationnels de vos applications
              gouvernementales depuis une interface web intuitive et sécurisée.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 text-sm text-blue-800">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Interface web complète</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-blue-800">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Modifications en temps réel</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-blue-800">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Gestion multi-applications</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications gérées */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Applications Gérées</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.map((app) => (
              <Card key={app.name} className="overflow-hidden">
                <div className={`h-2 ${app.color}`}></div>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${app.color} text-white`}>
                      <app.icon className="w-5 h-5" />
                    </div>
                    <span>{app.name}</span>
                  </CardTitle>
                  <CardDescription>{app.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {app.features.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Fonctionnalités disponibles */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Fonctionnalités Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${feature.color} text-white`}>
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <span className="text-lg">{feature.title}</span>
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      {feature.status}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Guide d'accès */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Comment Commencer</CardTitle>
            <CardDescription>
              Suivez ces étapes pour commencer à personnaliser vos applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h4 className="font-medium">Accéder</h4>
                <p className="text-sm text-gray-600">Cliquez sur "Accéder à l'Interface"</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h4 className="font-medium">Explorer</h4>
                <p className="text-sm text-gray-600">Parcourez les onglets disponibles</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-orange-600 font-bold">3</span>
                </div>
                <h4 className="font-medium">Modifier</h4>
                <p className="text-sm text-gray-600">Effectuez vos modifications</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-purple-600 font-bold">4</span>
                </div>
                <h4 className="font-medium">Publier</h4>
                <p className="text-sm text-gray-600">Sauvegardez et publiez</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accès rapide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>📖 Documentation</CardTitle>
              <CardDescription>
                Guide complet d'utilisation de l'interface d'administration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Consultez le fichier <code>GUIDE_ADMIN_WEB.md</code> pour des instructions détaillées.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔧 Support Technique</CardTitle>
              <CardDescription>
                Assistance et dépannage pour l'interface d'administration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Upload de logos : PNG, SVG, JPG supportés</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Taille max : 5MB par fichier</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Sauvegarde automatique des modifications</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-4 py-8">
          <h3 className="text-2xl font-bold text-gray-900">Prêt à Personnaliser ?</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Accédez à l'interface d'administration complète pour commencer à modifier
            vos applications ADMINISTRATION.GA et DEMARCHE.GA selon vos besoins.
          </p>
          <Link href="/admin-web">
            <Button size="lg" className="bg-gradient-to-r from-green-600 via-yellow-500 to-blue-600 hover:opacity-90 text-white font-semibold px-8 py-3">
              <Settings className="w-5 h-5 mr-2" />
              Commencer Maintenant
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
