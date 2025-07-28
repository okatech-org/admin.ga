/* @ts-nocheck */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { trpc } from '@/lib/trpc/client';
import { 
  FileText, 
  CreditCard, 
  Building2, 
  Scale, 
  Users, 
  Briefcase,
  Clock,
  ArrowRight,
  MapPin
} from 'lucide-react';
import Link from 'next/link';

const SERVICE_ICONS = {
  ACTE_NAISSANCE: FileText,
  ACTE_MARIAGE: FileText,
  ACTE_DECES: FileText,
  CNI: CreditCard,
  PASSEPORT: CreditCard,
  PERMIS_CONSTRUIRE: Building2,
  CASIER_JUDICIAIRE: Scale,
  IMMATRICULATION_CNSS: Users,
  ATTESTATION_TRAVAIL: Briefcase,
};

const SERVICE_COLORS = {
  ACTE_NAISSANCE: 'text-green-600 bg-green-50',
  ACTE_MARIAGE: 'text-pink-600 bg-pink-50',
  CNI: 'text-blue-600 bg-blue-50',
  PASSEPORT: 'text-purple-600 bg-purple-50',
  PERMIS_CONSTRUIRE: 'text-orange-600 bg-orange-50',
  CASIER_JUDICIAIRE: 'text-red-600 bg-red-50',
  IMMATRICULATION_CNSS: 'text-indigo-600 bg-indigo-50',
  ATTESTATION_TRAVAIL: 'text-yellow-600 bg-yellow-50',
};

export default function ServicesPage() {
  const { data: organizations, isLoading } = trpc.services.getAvailableServices.useQuery();

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des services...</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Services Disponibles</h1>
          <p className="text-muted-foreground">
            Découvrez tous les services administratifs disponibles par organisation
          </p>
        </div>

        {/* Organizations and Services */}
        <div className="space-y-8">
          {organizations?.map((organization) => (
            <Card key={organization.id} className="overflow-hidden">
              <CardHeader className="bg-accent/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{organization.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {organization.type === 'MAIRIE' && 'Mairie'}
                        {organization.type === 'DIRECTION_GENERALE' && 'Direction Générale'}
                        {organization.type === 'MINISTERE' && 'Ministère'}
                        {organization.type === 'ORGANISME_SOCIAL' && 'Organisme Social'}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {organization.services.length} service{organization.services.length > 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {organization.services.map((service) => {
                    const IconComponent = SERVICE_ICONS[service.serviceType as keyof typeof SERVICE_ICONS] || FileText;
                    const colorClasses = SERVICE_COLORS[service.serviceType as keyof typeof SERVICE_COLORS] || 'text-gray-600 bg-gray-50';
                    
                    return (
                      <Card key={service.id} className="group hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses}`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                                {service.serviceType === 'ACTE_NAISSANCE' && 'Acte de naissance'}
                                {service.serviceType === 'ACTE_MARIAGE' && 'Acte de mariage'}
                                {service.serviceType === 'CNI' && 'Carte Nationale d\'Identité'}
                                {service.serviceType === 'PASSEPORT' && 'Passeport'}
                                {service.serviceType === 'PERMIS_CONSTRUIRE' && 'Permis de construire'}
                                {service.serviceType === 'CASIER_JUDICIAIRE' && 'Casier judiciaire'}
                                {service.serviceType === 'IMMATRICULATION_CNSS' && 'Immatriculation CNSS'}
                                {service.serviceType === 'ATTESTATION_TRAVAIL' && 'Attestation de travail'}
                              </h3>
                              
                              {service.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {service.description}
                                </p>
                              )}
                              
                              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3 mr-1" />
                                {service.processingDays} jour{service.processingDays > 1 ? 's' : ''}
                                {service.cost && (
                                  <span className="ml-2">• {service.cost}€</span>
                                )}
                              </div>
                              
                              <Button 
                                size="sm" 
                                className="w-full mt-3 text-xs" 
                                asChild
                              >
                                <Link href={`/services/${organization.id}/${service.serviceType}/request`}>
                                  Faire une demande
                                  <ArrowRight className="w-3 h-3 ml-1" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {organizations?.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-2">Aucun service disponible</h3>
              <p className="text-muted-foreground">
                Les services administratifs seront bientôt disponibles.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  );
}