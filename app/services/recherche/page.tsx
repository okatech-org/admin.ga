'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  Building2,
  ArrowRight,
  Filter,
  Star
} from 'lucide-react';
import {
  GABON_ADMINISTRATIVE_DATA,
  getAllAdministrations,
  getServicesByType
} from '@/lib/data/gabon-administrations';

type ServiceCategory = 'etat_civil' | 'identite' | 'judiciaire' | 'municipaux' | 'sociaux' | 'professionnels' | 'fiscaux';

const SERVICE_CATEGORIES: Record<ServiceCategory, { label: string; icon: string; color: string }> = {
  etat_civil: { label: 'État Civil', icon: '👶', color: 'bg-blue-100 text-blue-800' },
  identite: { label: 'Identité', icon: '🆔', color: 'bg-green-100 text-green-800' },
  judiciaire: { label: 'Judiciaire', icon: '⚖️', color: 'bg-red-100 text-red-800' },
  municipaux: { label: 'Services Municipaux', icon: '🏛️', color: 'bg-orange-100 text-orange-800' },
  sociaux: { label: 'Services Sociaux', icon: '🤝', color: 'bg-purple-100 text-purple-800' },
  professionnels: { label: 'Services Professionnels', icon: '💼', color: 'bg-indigo-100 text-indigo-800' },
  fiscaux: { label: 'Services Fiscaux', icon: '💰', color: 'bg-yellow-100 text-yellow-800' }
};

interface ServiceInfo {
  name: string;
  organization: string;
  organizationType: string;
  location: string;
  category: string;
  estimatedDays: number;
  cost: number;
  description: string;
}

export default function RechercheServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  const administrations = getAllAdministrations();

  // Créer une liste complète des services avec leurs informations
  const allServices = useMemo(() => {
    const services: ServiceInfo[] = [];

    administrations.forEach(admin => {
      admin.services.forEach(serviceName => {
        const category = getServiceCategory(serviceName);
        services.push({
          name: serviceName,
          organization: admin.nom,
          organizationType: admin.type,
          location: admin.localisation,
          category,
          estimatedDays: getEstimatedDuration(serviceName),
          cost: getServiceCost(serviceName),
          description: `${serviceName} disponible à ${admin.nom}, ${admin.localisation}`
        });
      });
    });

    return services;
  }, [administrations]);

  // Extraire les localisations uniques
  const locations = useMemo(() => {
    const uniqueLocations = new Set(administrations.map(admin => admin.localisation));
    return Array.from(uniqueLocations).sort();
  }, [administrations]);

  // Filtrer et trier les services
  const filteredServices = useMemo(() => {
    let filtered = allServices.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.organization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchesLocation = selectedLocation === 'all' || service.location === selectedLocation;

      return matchesSearch && matchesCategory && matchesLocation;
    });

    // Trier les résultats
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'duration':
        filtered.sort((a, b) => a.estimatedDays - b.estimatedDays);
        break;
      case 'cost':
        filtered.sort((a, b) => a.cost - b.cost);
        break;
      case 'location':
        filtered.sort((a, b) => a.location.localeCompare(b.location));
        break;
    }

    return filtered;
  }, [allServices, searchTerm, selectedCategory, selectedLocation, sortBy]);

  // Statistiques des services
  const serviceStats = useMemo(() => {
    const totalServices = allServices.length;
    const avgDuration = Math.round(allServices.reduce((sum, s) => sum + s.estimatedDays, 0) / totalServices);
    const freeServices = allServices.filter(s => s.cost === 0).length;
    const categoryStats = allServices.reduce((acc, service) => {
      acc[service.category] = (acc[service.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalServices, avgDuration, freeServices, categoryStats };
  }, [allServices]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Recherche de Services Publics</h1>
        <p className="text-muted-foreground">
          Trouvez facilement les services administratifs dont vous avez besoin
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviceStats.totalServices}</div>
            <p className="text-xs text-muted-foreground">
              Services disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durée Moyenne</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviceStats.avgDuration} jours</div>
            <p className="text-xs text-muted-foreground">
              Temps de traitement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services Gratuits</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviceStats.freeServices}</div>
            <p className="text-xs text-muted-foreground">
              Sans frais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organisations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{administrations.length}</div>
            <p className="text-xs text-muted-foreground">
              Administrations publiques
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Catégories de services */}
      <Card>
        <CardHeader>
          <CardTitle>Catégories de Services</CardTitle>
          <CardDescription>Parcourez les services par catégorie</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Object.entries(SERVICE_CATEGORIES).map(([key, category]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? 'default' : 'outline'}
                className="flex flex-col items-center space-y-2 h-auto py-4"
                onClick={() => setSelectedCategory(selectedCategory === key ? 'all' : key)}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="text-xs text-center leading-tight">{category.label}</span>
                <Badge variant="secondary" className="text-xs">
                  {serviceStats.categoryStats[key] || 0}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtres de recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Recherche et Filtres</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nom du service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Localisation</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les villes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Trier par</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nom du service</SelectItem>
                  <SelectItem value="duration">Durée</SelectItem>
                  <SelectItem value="cost">Coût</SelectItem>
                  <SelectItem value="location">Localisation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLocation('all');
                  setSortBy('name');
                }}
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résultats de recherche */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Résultats ({filteredServices.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="space-y-2">
                  <CardTitle className="text-lg leading-tight">{service.name}</CardTitle>
                  <div className="flex items-center justify-between">
                    <Badge className={SERVICE_CATEGORIES[service.category as ServiceCategory]?.color || 'bg-gray-100 text-gray-800'}>
                      {SERVICE_CATEGORIES[service.category as ServiceCategory]?.label || service.category}
                    </Badge>
                    {service.cost === 0 && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Gratuit
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="flex items-center text-muted-foreground mb-1">
                      <Building2 className="h-4 w-4 mr-1" />
                      <span className="font-medium">{service.organization}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {service.location}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{service.estimatedDays} jour{service.estimatedDays > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{service.cost === 0 ? 'Gratuit' : `${service.cost.toLocaleString()} FCFA`}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button className="w-full" size="sm">
                      Faire une demande
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                Aucun service trouvé avec les critères sélectionnés.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLocation('all');
                }}
              >
                Réinitialiser les filtres
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Utilitaires (réutilisés du script d'import)
function getServiceCategory(serviceName: string): string {
  const service = serviceName.toLowerCase();

  if (service.includes('acte') || service.includes('état civil') || service.includes('naissance') || service.includes('mariage') || service.includes('décès')) {
    return 'etat_civil';
  }
  if (service.includes('carte') || service.includes('passeport') || service.includes('identité') || service.includes('permis de conduire')) {
    return 'identite';
  }
  if (service.includes('casier') || service.includes('certificat de nationalité') || service.includes('légalisation')) {
    return 'judiciaire';
  }
  if (service.includes('permis de construire') || service.includes('autorisation de commerce') || service.includes('résidence')) {
    return 'municipaux';
  }
  if (service.includes('cnss') || service.includes('cnamgs') || service.includes('chômage') || service.includes('pension')) {
    return 'sociaux';
  }
  if (service.includes('registre de commerce') || service.includes('licence') || service.includes('autorisation d\'exercice')) {
    return 'professionnels';
  }
  if (service.includes('fiscal') || service.includes('déclaration') || service.includes('impôt') || service.includes('quitus')) {
    return 'fiscaux';
  }

  return 'autres';
}

function getEstimatedDuration(serviceName: string): number {
  const service = serviceName.toLowerCase();

  if (service.includes('certificat') && !service.includes('médical')) return 1;
  if (service.includes('acte') || service.includes('état civil')) return 3;
  if (service.includes('carte') || service.includes('passeport') || service.includes('permis')) return 10;
  if (service.includes('autorisation') || service.includes('permis') || service.includes('licence')) return 14;
  if (service.includes('registre') || service.includes('concession') || service.includes('titre foncier')) return 30;

  return 7;
}

function getServiceCost(serviceName: string): number {
  const service = serviceName.toLowerCase();

  if (service.includes('certificat de vie') || service.includes('certificat de résidence')) return 0;
  if (service.includes('acte')) return 2000;
  if (service.includes('carte nationale')) return 5000;
  if (service.includes('passeport')) return 25000;
  if (service.includes('permis de conduire')) return 15000;
  if (service.includes('permis de construire')) return 50000;
  if (service.includes('registre de commerce')) return 30000;

  return 5000;
}
