/* @ts-nocheck */
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { useAuth } from '@/hooks/use-auth';
import { 
  Calendar,
  Clock, 
  MapPin, 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  X,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AppointmentsPage() {
  const { user, isLoading } = useAuth('USER');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - À remplacer par de vraies données
  const appointments = [
    {
      id: 'RDV-001',
      date: new Date('2024-01-15T10:00:00'),
      service: 'Récupération acte de naissance',
      organization: 'Mairie de Libreville',
      location: 'Bureau 205, Mairie de Libreville',
      agent: 'Paul OBIANG',
      status: 'CONFIRMED',
      purpose: 'Récupération d\'acte de naissance pour demande de passeport',
      qrCode: 'RDV-001-QR',
      createdAt: new Date('2024-01-10'),
      duration: 30
    },
    {
      id: 'RDV-002',
      date: new Date('2024-01-18T14:30:00'),
      service: 'Dépôt dossier CNI',
      organization: 'DGDI',
      location: 'DGDI - Guichet 3',
      agent: 'Fatima BOUKOUMOU',
      status: 'PENDING',
      purpose: 'Première demande de carte nationale d\'identité',
      qrCode: 'RDV-002-QR',
      createdAt: new Date('2024-01-12'),
      duration: 45
    },
    {
      id: 'RDV-003',
      date: new Date('2024-01-08T09:00:00'),
      service: 'Consultation dossier CNSS',
      organization: 'CNSS',
      location: 'CNSS - Bureau 101',
      agent: 'André MBOUMBA',
      status: 'COMPLETED',
      purpose: 'Vérification statut immatriculation',
      qrCode: 'RDV-003-QR',
      createdAt: new Date('2024-01-05'),
      duration: 30
    },
    {
      id: 'RDV-004',
      date: new Date('2024-01-22T11:00:00'),
      service: 'Signature acte mariage',
      organization: 'Mairie de Libreville',
      location: 'Salle des mariages',
      agent: 'Marie NZENGUE',
      status: 'SCHEDULED',
      purpose: 'Cérémonie de mariage civil',
      qrCode: 'RDV-004-QR',
      createdAt: new Date('2024-01-14'),
      duration: 60
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary">En attente</Badge>;
      case 'CONFIRMED':
        return <Badge variant="default">Confirmé</Badge>;
      case 'SCHEDULED':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Programmé</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline" className="text-green-600 border-green-600">Terminé</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Annulé</Badge>;
      case 'NO_SHOW':
        return <Badge variant="destructive">Absent</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'border-l-green-500';
      case 'PENDING':
        return 'border-l-yellow-500';
      case 'SCHEDULED':
        return 'border-l-blue-500';
      case 'COMPLETED':
        return 'border-l-gray-400';
      case 'CANCELLED':
      case 'NO_SHOW':
        return 'border-l-red-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesFilter = filter === 'all' || appointment.status.toLowerCase() === filter;
    const matchesSearch = searchTerm === '' || 
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.organization.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const upcomingAppointments = appointments.filter(apt => 
    apt.date > new Date() && ['CONFIRMED', 'PENDING', 'SCHEDULED'].includes(apt.status)
  );

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Mes rendez-vous</h1>
            <p className="text-muted-foreground">
              Gérez vos rendez-vous administratifs
            </p>
          </div>
          <Button asChild>
            <Link href="/appointments/book">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau rendez-vous
            </Link>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Prochains RDV</p>
                  <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Terminés</p>
                  <p className="text-2xl font-bold">
                    {appointments.filter(a => a.status === 'COMPLETED').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">En attente</p>
                  <p className="text-2xl font-bold">
                    {appointments.filter(a => a.status === 'PENDING').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <X className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Annulés</p>
                  <p className="text-2xl font-bold">
                    {appointments.filter(a => ['CANCELLED', 'NO_SHOW'].includes(a.status)).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Rechercher par service ou organisation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirmés</SelectItem>
                  <SelectItem value="scheduled">Programmés</SelectItem>
                  <SelectItem value="completed">Terminés</SelectItem>
                  <SelectItem value="cancelled">Annulés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">Aucun rendez-vous trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filter !== 'all' 
                    ? 'Essayez de modifier vos critères de recherche'
                    : 'Vous n\'avez pas encore de rendez-vous programmé'
                  }
                </p>
                <Button asChild>
                  <Link href="/appointments/book">
                    <Plus className="mr-2 h-4 w-4" />
                    Prendre un rendez-vous
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className={`border-l-4 ${getStatusColor(appointment.status)} hover:shadow-md transition-shadow`}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{appointment.service}</h3>
                          <p className="text-muted-foreground">{appointment.organization}</p>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {format(appointment.date, 'EEEE d MMMM yyyy', { locale: fr })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {format(appointment.date, 'HH:mm')} ({appointment.duration} min)
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{appointment.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="w-4 h-4 text-center">👤</span>
                          <span>Agent: {appointment.agent}</span>
                        </div>
                      </div>
                      
                      <div className="bg-accent/20 p-3 rounded-lg">
                        <p className="text-sm"><strong>Motif:</strong> {appointment.purpose}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:ml-6">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Détails
                      </Button>
                      {['PENDING', 'CONFIRMED', 'SCHEDULED'].includes(appointment.status) && (
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </Button>
                      )}
                      {['PENDING', 'SCHEDULED'].includes(appointment.status) && (
                        <Button variant="destructive" size="sm">
                          <X className="w-4 h-4 mr-2" />
                          Annuler
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}