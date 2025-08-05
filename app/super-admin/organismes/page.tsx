'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { toast } from 'sonner';
import {
  getOrganizationTypeLabel,
  getOrganizationTypeColor,
  getOrganizationBorderColor,
  sortOrganizations,
  generateOrganizationStats
} from '@/lib/utils/organization-utils';
import {
  Building2,
  Users,
  MapPin,
  Phone,
  Mail,
  Globe,
  Activity,
  BarChart3,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  Calendar,
  UserCheck,
  ArrowRight,
  Search,
  Filter,
  Download,
  Settings,
  Edit,
  Eye,
  RefreshCw,
  FileText,
  Loader2,
  AlertCircle,
  Target,
  Plus,
  Network,
  Crown,
  Flag
} from 'lucide-react';

import { useEffect } from 'react';

// Types pour la gestion d'état basés sur Prisma
interface OrganismeDisplay {
  id: string;
  name: string;
  code: string;
  type: string;
  description?: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive: boolean;
  parentId?: string;
  parent?: { name: string };
  children?: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
  // Statistiques calculées
  userCount: number;
  requestCount: number;
  appointmentCount: number;
}

interface OrganismesStats {
  totalOrganismes: number;
  organismesActifs: number;
  organismesInactifs: number;
  totalUsers: number;
  totalRequests: number;
  totalAppointments: number;
  types: Record<string, number>;
  cities: Record<string, number>;
}

export default function OrganismesPage() {
  // États de base
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [organizationsData, setOrganizationsData] = useState<any>(null);
  const itemsPerPage = 20;

  // Fonction pour récupérer les organisations via API REST
  const fetchOrganizations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: '500', // Augmenter pour récupérer tous les organismes
        page: '1',
        search: searchTerm,
        type: selectedType === 'all' ? '' : selectedType,
        isActive: selectedStatus === 'all' ? '' : (selectedStatus === 'ACTIF' ? 'true' : 'false')
      });

      const response = await fetch(`/api/organizations/list?${params}`);
      const data = await response.json();

      if (data.success) {
        setOrganizationsData(data.data);
      } else {
        throw new Error(data.error || 'Erreur lors du chargement des organisations');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des organisations:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedType, selectedStatus]);

  // Charger les données au montage du composant et lors des changements de filtres
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchOrganizations();
    }, 300); // Debounce pour éviter trop d'appels API

    return () => clearTimeout(debounceTimer);
  }, [fetchOrganizations]);

  // Transformation des données de l'API
  const organismes = useMemo((): OrganismeDisplay[] => {
    if (!organizationsData?.organizations) return [];

    return organizationsData.organizations.map(org => ({
      id: org.id,
      name: org.name,
      code: org.code,
      type: org.type,
      description: org.description || '',
      city: org.city || '',
      address: org.address || '',
      phone: org.phone || '',
      email: org.email || '',
      website: org.website || '',
      isActive: org.isActive,
      parentId: org.parentId || undefined,
      parent: org.parent || undefined,
      children: org.children || [],
      createdAt: org.createdAt || new Date().toISOString(),
      updatedAt: org.updatedAt || new Date().toISOString(),
      // Statistiques simulées depuis l'API
      userCount: org._count?.userMemberships || 0,
      requestCount: org._count?.requests || 0,
      appointmentCount: org._count?.appointments || 0,
    }));
  }, [organizationsData]);

  // Filtrage des organismes
  const filteredOrganismes = useMemo(() => {
    return organismes.filter(org => {
      const matchesSearch = !searchTerm ||
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (org.city && org.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (org.description && org.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = selectedType === 'all' || org.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || (selectedStatus === 'ACTIF' ? org.isActive : !org.isActive);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [organismes, searchTerm, selectedType, selectedStatus]);

  // Pagination
  const paginatedOrganismes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredOrganismes.slice(startIndex, endIndex);
  }, [filteredOrganismes, currentPage, itemsPerPage]);

  // Calcul des statistiques
  const stats = useMemo((): OrganismesStats => {
    const total = organismes.length;
    const actifs = organismes.filter(o => o.isActive).length;
    const inactifs = total - actifs;

    // Types
    const types: Record<string, number> = {};
    organismes.forEach(org => {
      types[org.type] = (types[org.type] || 0) + 1;
    });

    // Villes
    const cities: Record<string, number> = {};
    organismes.forEach(org => {
      if (org.city) {
        cities[org.city] = (cities[org.city] || 0) + 1;
      }
    });

    const totalUsers = organismes.reduce((sum, org) => sum + org.userCount, 0);
    const totalRequests = organismes.reduce((sum, org) => sum + org.requestCount, 0);
    const totalAppointments = organismes.reduce((sum, org) => sum + org.appointmentCount, 0);

    return {
      totalOrganismes: total,
      organismesActifs: actifs,
      organismesInactifs: inactifs,
      totalUsers,
      totalRequests,
      totalAppointments,
      types,
      cities
    };
  }, [organismes]);

  // Options pour les filtres
  const typeOptions = useMemo(() =>
    Array.from(new Set(organismes.map(org => org.type))).sort()
  , [organismes]);

  const totalPages = Math.ceil(filteredOrganismes.length / itemsPerPage);

  // Gestionnaires d'événements
  const handleRefresh = useCallback(async () => {
    try {
      await fetchOrganizations();
      toast.success('Données actualisées avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'actualisation');
    }
  }, [fetchOrganizations]);

  const handleExport = useCallback(() => {
    const csvContent = [
      ['Nom', 'Code', 'Type', 'Ville', 'Statut', 'Utilisateurs', 'Demandes'].join(','),
      ...filteredOrganismes.map(org => [
        org.name,
        org.code,
        org.type,
        org.city || '',
        org.isActive ? 'Actif' : 'Inactif',
        org.userCount,
        org.requestCount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'organismes.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Export réalisé avec succès');
  }, [filteredOrganismes]);

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
            <div>
              <h3 className="font-semibold text-lg">Chargement des organismes...</h3>
              <p className="text-muted-foreground">Récupération des données depuis la base</p>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  if (error) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-96">
            <CardContent className="text-center p-6">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Erreur de chargement</h3>
              <p className="text-muted-foreground mb-4">
                {error}
              </p>
              <Button onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-500" />
              Gestion des Organismes
            </h1>
            <p className="text-muted-foreground">
              {stats.totalOrganismes} organismes publics gabonais
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Organisme
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <h3 className="text-2xl font-bold">{stats.totalOrganismes}</h3>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Actifs</p>
                  <h3 className="text-2xl font-bold text-green-600">{stats.organismesActifs}</h3>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Utilisateurs</p>
                  <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Demandes</p>
                  <h3 className="text-2xl font-bold">{stats.totalRequests}</h3>
                </div>
                <FileText className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, code, ville..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {typeOptions.map(type => (
                      <SelectItem key={type} value={type}>
                        {getOrganizationTypeLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Statut</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="ACTIF">Actifs</SelectItem>
                    <SelectItem value="INACTIF">Inactifs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des organismes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {filteredOrganismes.length} organismes trouvés
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paginatedOrganismes.map((org) => (
                <Card key={org.id} className={`border-l-4 ${getOrganizationBorderColor(org.type)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{org.name}</h3>
                          <Badge variant="outline">{org.code}</Badge>
                          <Badge className={getOrganizationTypeColor(org.type)}>
                            {getOrganizationTypeLabel(org.type)}
                          </Badge>
                          <Badge className={org.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {org.isActive ? 'Actif' : 'Inactif'}
                          </Badge>
                        </div>

                        <div className="text-sm text-muted-foreground mb-2">
                          {getOrganizationTypeLabel(org.type)} • {org.city || 'Ville non spécifiée'}
                        </div>

                        {org.description && (
                          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                            {org.description}
                          </p>
                        )}

                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{org.userCount} utilisateurs</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>{org.requestCount} demandes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{org.appointmentCount} RDV</span>
                          </div>
                        </div>

                        {(org.phone || org.email || org.website) && (
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                            {org.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span>{org.phone}</span>
                              </div>
                            )}
                            {org.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span>{org.email}</span>
                              </div>
                            )}
                            {org.website && (
                              <div className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                <span>{org.website}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>

                <div className="text-sm text-muted-foreground">
                  Page {currentPage} sur {totalPages}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
