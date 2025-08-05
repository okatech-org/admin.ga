/* @ts-nocheck */
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Search,
  Filter,
  Globe,
  CreditCard,
  Users,
  Car,
  Heart,
  Home,
  Scale,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Receipt,
  Cross,
  Leaf,
  Palette,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function DemarchePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [selectedOrganisme, setSelectedOrganisme] = useState('tous');

  // Catégories avec compteurs à 0 (base nettoyée)
  const categories = [
    { id: 'tous', nom: 'Tous les Services', icon: Globe, count: 0, color: 'bg-gray-400' },
    { id: 'identite', nom: 'Documents d\'Identité', icon: CreditCard, count: 0, color: 'bg-gray-400' },
    { id: 'etat_civil', nom: 'État Civil', icon: Users, count: 0, color: 'bg-gray-400' },
    { id: 'transport', nom: 'Transport & Véhicules', icon: Car, count: 0, color: 'bg-gray-400' },
    { id: 'social', nom: 'Protection Sociale', icon: Heart, count: 0, color: 'bg-gray-400' },
    { id: 'logement', nom: 'Logement & Habitat', icon: Home, count: 0, color: 'bg-gray-400' },
    { id: 'justice', nom: 'Justice & Légal', icon: Scale, count: 0, color: 'bg-gray-400' },
    { id: 'emploi', nom: 'Emploi & Travail', icon: Briefcase, count: 0, color: 'bg-gray-400' },
    { id: 'education', nom: 'Éducation & Formation', icon: GraduationCap, count: 0, color: 'bg-gray-400' },
    { id: 'economie', nom: 'Commerce & Économie', icon: TrendingUp, count: 0, color: 'bg-gray-400' },
    { id: 'fiscal', nom: 'Fiscalité & Impôts', icon: Receipt, count: 0, color: 'bg-gray-400' },
    { id: 'sante', nom: 'Santé & Médical', icon: Cross, count: 0, color: 'bg-gray-400' },
    { id: 'environnement', nom: 'Environnement', icon: Leaf, count: 0, color: 'bg-gray-400' },
    { id: 'culture', nom: 'Culture & Communication', icon: Palette, count: 0, color: 'bg-gray-400' }
  ];

  // Services vides (base nettoyée)
  const services = [];

  // Organismes vides (base nettoyée)
  const organismes = [];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'tous' || service.categorie === selectedCategory;
    const matchesOrganisme = selectedOrganisme === 'tous' || service.organisme === selectedOrganisme;

    return matchesSearch && matchesCategory && matchesOrganisme;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🇬🇦 Démarches Administratives Gabon
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Plateforme numérique pour toutes vos démarches administratives au Gabon
          </p>
        </div>

        {/* Alert de base vide */}
        <Alert className="mb-8 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>🧹 Base de données nettoyée :</strong> Aucun service disponible pour le moment.
            La base de données a été entièrement vidée et affiche 0 partout.
          </AlertDescription>
        </Alert>

        {/* Barre de recherche */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un service (base vide)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled
                />
              </div>
              <Button className="lg:w-auto" disabled>
                <Filter className="h-4 w-4 mr-2" />
                Filtres (0)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-400 mb-2">0</div>
              <div className="text-gray-600">Services Disponibles</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-400 mb-2">0</div>
              <div className="text-gray-600">Organismes Actifs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-400 mb-2">0</div>
              <div className="text-gray-600">Demandes Traitées</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-400 mb-2">0</div>
              <div className="text-gray-600">Citoyens Inscrits</div>
            </CardContent>
          </Card>
        </div>

        {/* Catégories de services */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Catégories de Services (Toutes vides)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  disabled
                  className={`p-4 rounded-lg border-2 transition-all text-center hover:shadow-md ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full ${category.color} mx-auto mb-2 flex items-center justify-center opacity-50`}>
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-sm font-medium text-gray-400 mb-1">
                    {category.nom}
                  </div>
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-400">
                    {category.count}
                  </Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message de base vide */}
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-6">
              <Globe className="h-16 w-16 mx-auto mb-4 opacity-50" />
            </div>
            <h3 className="text-xl font-semibold text-gray-500 mb-4">
              🧹 Aucun service disponible
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              La base de données a été entièrement nettoyée.
              Tous les services, organismes et données ont été supprimés.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div>📊 Services : 0</div>
              <div>🏛️ Organismes : 0</div>
              <div>👥 Utilisateurs : 0</div>
              <div>📝 Demandes : 0</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
