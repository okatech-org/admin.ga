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
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  FileText,
  Clock,
  AlertTriangle
} from 'lucide-react';

export default function OrganismesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('tous');

  // Filtres avec compteurs à 0 (base nettoyée)
  const filters = [
    { id: 'tous', nom: 'Tous les Organismes', count: 0 },
    { id: 'regalien', nom: 'Ministères Régaliens', count: 0 },
    { id: 'social', nom: 'Services Sociaux', count: 0 },
    { id: 'education', nom: 'Éducation & Formation', count: 0 },
    { id: 'economie', nom: 'Économie & Commerce', count: 0 },
    { id: 'transport', nom: 'Transport & Infrastructure', count: 0 },
    { id: 'emploi', nom: 'Emploi & Travail', count: 0 },
    { id: 'environnement', nom: 'Environnement & Agriculture', count: 0 },
    { id: 'culture', nom: 'Culture & Communication', count: 0 },
    { id: 'local', nom: 'Administrations Locales', count: 0 },
    { id: 'juridique', nom: 'Institutions Juridiques', count: 0 }
  ];

  // Organismes vides (base nettoyée)
  const organismes = [];

  const filteredOrganismes = organismes.filter(org => {
    const matchesSearch = org.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'tous' || org.categorie === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏛️ Organismes Publics du Gabon
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trouvez l'organisme public approprié pour vos démarches administratives
          </p>
        </div>

        {/* Alert de base vide */}
        <Alert className="mb-8 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>🧹 Base de données nettoyée :</strong> Aucun organisme disponible pour le moment.
            Tous les organismes publics ont été supprimés de la base de données.
          </AlertDescription>
        </Alert>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-400 mb-2">0</div>
              <div className="text-gray-600">Organismes Publics</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-400 mb-2">0</div>
              <div className="text-gray-600">Ministères</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-400 mb-2">0</div>
              <div className="text-gray-600">Préfectures</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-400 mb-2">0</div>
              <div className="text-gray-600">Mairies</div>
            </CardContent>
          </Card>
        </div>

        {/* Barre de recherche et filtres */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un organisme (base vide)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled
                />
              </div>
              <Button className="lg:w-auto" disabled>
                <Filter className="h-4 w-4 mr-2" />
                Filtres Avancés (0)
              </Button>
            </div>

            {/* Filtres par catégorie */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  disabled
                  className={`p-3 rounded-lg border text-sm transition-all ${
                    selectedFilter === filter.id
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-400'
                  }`}
                >
                  <div className="font-medium">{filter.nom}</div>
                  <Badge variant="secondary" className="mt-1 text-xs bg-gray-100 text-gray-400">
                    {filter.count}
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
              <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
            </div>
            <h3 className="text-xl font-semibold text-gray-500 mb-4">
              🧹 Aucun organisme trouvé
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              La base de données des organismes publics a été entièrement nettoyée.
              Aucun organisme n'est actuellement enregistré dans le système.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-sm text-gray-400">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-500">Ministères</div>
                <div className="text-2xl font-bold">0</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-500">Préfectures</div>
                <div className="text-2xl font-bold">0</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-500">Mairies</div>
                <div className="text-2xl font-bold">0</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-500">Autres</div>
                <div className="text-2xl font-bold">0</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
