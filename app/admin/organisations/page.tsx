'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Users,
  FileText,
  Filter,
  BarChart3,
  Settings
} from 'lucide-react';
import { GABON_ADMINISTRATIVE_DATA, getAllAdministrations, type OrganizationType } from '@/lib/data/gabon-administrations';

const ORGANIZATION_TYPE_LABELS: Record<OrganizationType, string> = {
  MINISTERE: 'Ministère',
  DIRECTION_GENERALE: 'Direction Générale',
  MAIRIE: 'Mairie',
  ORGANISME_SOCIAL: 'Organisme Social',
  INSTITUTION_JUDICIAIRE: 'Institution Judiciaire',
  AGENCE_PUBLIQUE: 'Agence Publique',
  INSTITUTION_ELECTORALE: 'Institution Électorale',
  PREFECTURE: 'Préfecture',
  PROVINCE: 'Province',
  PRESIDENCE: 'Présidence',
  PRIMATURE: 'Primature',
  AUTRE: 'Autre'
};

const TYPE_COLORS: Record<OrganizationType, string> = {
  MINISTERE: 'bg-blue-500',
  DIRECTION_GENERALE: 'bg-green-500',
  MAIRIE: 'bg-orange-500',
  ORGANISME_SOCIAL: 'bg-purple-500',
  INSTITUTION_JUDICIAIRE: 'bg-red-500',
  AGENCE_PUBLIQUE: 'bg-teal-500',
  INSTITUTION_ELECTORALE: 'bg-indigo-500',
  PREFECTURE: 'bg-yellow-500',
  PROVINCE: 'bg-pink-500',
  PRESIDENCE: 'bg-gray-800',
  PRIMATURE: 'bg-gray-600',
  AUTRE: 'bg-gray-400'
};

export default function OrganisationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const administrations = getAllAdministrations();
  
  // Extraire les localisations uniques
  const locations = useMemo(() => {
    const uniqueLocations = new Set(administrations.map(admin => admin.localisation));
    return Array.from(uniqueLocations).sort();
  }, [administrations]);

  // Calculer les statistiques
  const stats = useMemo(() => {
    const totalOrganizations = administrations.length;
    const totalServices = administrations.reduce((sum, admin) => sum + admin.services.length, 0);
    const typeStats = administrations.reduce((acc, admin) => {
      acc[admin.type] = (acc[admin.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return { totalOrganizations, totalServices, typeStats };
  }, [administrations]);

  // Filtrer les administrations
  const filteredAdministrations = useMemo(() => {
    return administrations.filter(admin => {
      const matchesSearch = admin.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           admin.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = selectedType === 'all' || admin.type === selectedType;
      const matchesLocation = selectedLocation === 'all' || admin.localisation === selectedLocation;
      
      return matchesSearch && matchesType && matchesLocation;
    });
  }, [administrations, searchTerm, selectedType, selectedLocation]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Organisations Publiques Gabonaises</h1>
        <p className="text-muted-foreground">
          Gestion complète des administrations et services publics
        </p>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organisations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrganizations}</div>
            <p className="text-xs text-muted-foreground">
              Administrations publiques
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServices}</div>
            <p className="text-xs text-muted-foreground">
              Services disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Provinces</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{GABON_ADMINISTRATIVE_DATA.structure_administrative.provinces}</div>
            <p className="text-xs text-muted-foreground">
              Divisions territoriales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Communes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{GABON_ADMINISTRATIVE_DATA.structure_administrative.communes}</div>
            <p className="text-xs text-muted-foreground">
              Administrations locales
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Liste des Organisations</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="map">Carte Administrative</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Filtres */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtres de Recherche</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recherche</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher une organisation ou service..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type d'organisation</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      {Object.entries(ORGANIZATION_TYPE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              </div>
            </CardContent>
          </Card>

          {/* Liste des organisations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAdministrations.map((admin, index) => (
              <Card key={admin.code || index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg leading-tight">{admin.nom}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-white ${TYPE_COLORS[admin.type as OrganizationType]}`}>
                          {ORGANIZATION_TYPE_LABELS[admin.type as OrganizationType]}
                        </Badge>
                        {admin.code && (
                          <Badge variant="outline">{admin.code}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {admin.localisation}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Informations supplémentaires */}
                    {admin.gouverneur && (
                      <div className="text-sm">
                        <span className="font-medium">Gouverneur:</span> {admin.gouverneur}
                      </div>
                    )}
                    {admin.maire && (
                      <div className="text-sm">
                        <span className="font-medium">Maire:</span> {admin.maire}
                      </div>
                    )}
                    
                    {/* Services */}
                    <div>
                      <div className="text-sm font-medium mb-2">
                        Services ({admin.services.length})
                      </div>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {admin.services.slice(0, 3).map((service, idx) => (
                          <div key={idx} className="text-xs bg-muted p-2 rounded">
                            {service}
                          </div>
                        ))}
                        {admin.services.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{admin.services.length - 3} autres services
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="h-3 w-3 mr-1" />
                        Gérer
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-3 w-3 mr-1" />
                        Services
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAdministrations.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  Aucune organisation trouvée avec les critères sélectionnés.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats.typeStats).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded ${TYPE_COLORS[type as OrganizationType]}`} />
                        <span className="text-sm">{ORGANIZATION_TYPE_LABELS[type as OrganizationType]}</span>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Structure Administrative</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Provinces</span>
                    <span className="font-medium">{GABON_ADMINISTRATIVE_DATA.structure_administrative.provinces}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Départements</span>
                    <span className="font-medium">{GABON_ADMINISTRATIVE_DATA.structure_administrative.departements}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Communes</span>
                    <span className="font-medium">{GABON_ADMINISTRATIVE_DATA.structure_administrative.communes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Districts</span>
                    <span className="font-medium">{GABON_ADMINISTRATIVE_DATA.structure_administrative.districts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cantons</span>
                    <span className="font-medium">{GABON_ADMINISTRATIVE_DATA.structure_administrative.cantons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Villages</span>
                    <span className="font-medium">{GABON_ADMINISTRATIVE_DATA.structure_administrative.villages}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Carte Administrative du Gabon</CardTitle>
              <CardDescription>
                Répartition géographique des administrations publiques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {GABON_ADMINISTRATIVE_DATA.administrations.provinces.map((province) => (
                  <Card key={province.code}>
                    <CardHeader>
                      <CardTitle className="text-lg">{province.nom}</CardTitle>
                      <CardDescription>
                        Chef-lieu: {province.chef_lieu}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Gouverneur:</span>
                          <br />
                          {province.gouverneur}
                        </div>
                        <div>
                          <span className="font-medium">Organisations:</span>
                          <br />
                          {administrations.filter(admin => 
                            admin.localisation === province.chef_lieu ||
                            admin.localisation.includes(province.chef_lieu)
                          ).length} administration(s)
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 