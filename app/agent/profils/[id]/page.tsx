/* @ts-nocheck */
"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { useAuth } from '@/hooks/use-auth';
import {
  User,
  MapPin,
  Phone,
  Briefcase,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  Eye,
  Download
} from 'lucide-react';

export default function ProfileViewPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user, isLoading } = useAuth('AGENT');

  const [validationNotes, setValidationNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // ⚠️ TODO: Implémenter API pour récupérer les données du profil utilisateur
  const profile = {
    id: '1',
    user: {
      id: '1',
      firstName: 'Jean',
      lastName: 'DUPONT',
      email: 'jean.dupont@gmail.com',
      phone: '+241 07 12 34 56'
    },
    dateOfBirth: new Date('1990-05-15'),
    placeOfBirth: 'Libreville',
    gender: 'MASCULIN',
    nationality: 'Gabonaise',
    maritalStatus: 'MARIE',
    profession: 'Ingénieur informatique',
    employer: 'GABON TELECOM',
    address: 'Quartier Nombakélé, Rue des Palmiers, Villa 23',
    city: 'Libreville',
    province: 'ESTUAIRE',
    postalCode: 'BP 1234',
    country: 'Gabon',
    alternatePhone: '+241 06 98 76 54',
    emergencyContact: {
      name: 'Marie DUPONT',
      phone: '+241 07 11 22 33',
      relation: 'Épouse'
    },
    fatherName: 'Pierre DUPONT',
    motherName: 'Claire MARTIN',
    spouseName: 'Marie OKOUYI',
    profileStatus: 'SUBMITTED',
    completionPercentage: 95,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12')
  };

  const documents = [
    {
      id: '1',
      type: 'PHOTO_IDENTITE',
      name: 'Photo d\'identité',
      originalName: 'photo_jean_dupont.jpg',
      url: 'https://via.placeholder.com/400x300',
      status: 'PENDING',
      createdAt: new Date('2024-01-10')
    },
    {
      id: '2',
      type: 'ACTE_NAISSANCE',
      name: 'Acte de naissance',
      originalName: 'acte_naissance_jean.pdf',
      url: '#',
      status: 'PENDING',
      createdAt: new Date('2024-01-12')
    },
    {
      id: '3',
      type: 'JUSTIFICATIF_DOMICILE',
      name: 'Justificatif de domicile',
      originalName: 'facture_seeg_janvier.pdf',
      url: '#',
      status: 'PENDING',
      createdAt: new Date('2024-01-08')
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VALIDATED':
        return <Badge variant="outline" className="text-green-600 border-green-600">Validé</Badge>;
      case 'SUBMITTED':
        return <Badge variant="default">Soumis</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rejeté</Badge>;
      case 'DRAFT':
        return <Badge variant="secondary">Brouillon</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleValidateProfile = async () => {
    const toastId = toast.loading('Validation en cours...');

    try {
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('Profil validé avec succès !', { id: toastId });
      router.push('/agent/profils');
    } catch (error) {
      toast.error('Erreur lors de la validation', { id: toastId });
    }
  };

  const handleRejectProfile = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Veuillez indiquer un motif de rejet');
      return;
    }

    const toastId = toast.loading('Rejet en cours...');

    try {
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('Profil rejeté', { id: toastId });
      router.push('/agent/profils');
    } catch (error) {
      toast.error('Erreur lors du rejet', { id: toastId });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Profil de {profile.user.firstName} {profile.user.lastName}
            </h1>
            <p className="text-muted-foreground">
              Validation du profil citoyen
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {getStatusBadge(profile.profileStatus)}
            <Badge variant="secondary">
              {profile.completionPercentage}% complété
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Informations personnelles</TabsTrigger>
            <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Informations personnelles</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Prénom</Label>
                      <p className="font-medium">{profile.user.firstName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Nom</Label>
                      <p className="font-medium">{profile.user.lastName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Date de naissance</Label>
                      <p>{profile.dateOfBirth.toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Lieu de naissance</Label>
                      <p>{profile.placeOfBirth}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Genre</Label>
                      <p>{profile.gender === 'MASCULIN' ? 'Masculin' : 'Féminin'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Nationalité</Label>
                      <p>{profile.nationality}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-muted-foreground">Situation matrimoniale</Label>
                      <p>{profile.maritalStatus === 'MARIE' ? 'Marié(e)' : profile.maritalStatus}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="w-5 h-5" />
                    <span>Contact</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="font-medium">{profile.user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Téléphone principal</Label>
                    <p>{profile.user.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Téléphone alternatif</Label>
                    <p>{profile.alternatePhone || 'Non renseigné'}</p>
                  </div>

                  {profile.emergencyContact && (
                    <div className="border-t pt-4">
                      <Label className="text-sm font-medium text-muted-foreground">Contact d'urgence</Label>
                      <div className="mt-2 space-y-1">
                        <p className="font-medium">{profile.emergencyContact.name}</p>
                        <p className="text-sm">{profile.emergencyContact.phone}</p>
                        <p className="text-sm text-muted-foreground">{profile.emergencyContact.relation}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Adresse</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Adresse complète</Label>
                    <p>{profile.address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Ville</Label>
                      <p>{profile.city}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Province</Label>
                      <p>{profile.province}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Code postal</Label>
                      <p>{profile.postalCode}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Pays</Label>
                      <p>{profile.country}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional & Family */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="w-5 h-5" />
                    <span>Professionnel & Famille</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Profession</Label>
                    <p>{profile.profession}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Employeur</Label>
                    <p>{profile.employer}</p>
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Nom du père</Label>
                      <p>{profile.fatherName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Nom de la mère</Label>
                      <p>{profile.motherName}</p>
                    </div>
                    {profile.spouseName && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Conjoint</Label>
                        <p>{profile.spouseName}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="grid gap-4">
              {documents.map((document) => (
                <Card key={document.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>

                        <div>
                          <h3 className="font-medium">{document.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {document.originalName} •
                            Uploadé le {document.createdAt.toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">En attente</Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span>Valider le profil</span>
                  </CardTitle>
                  <CardDescription>
                    Approuver le profil et tous les documents associés
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="validationNotes">Notes de validation (optionnel)</Label>
                    <Textarea
                      id="validationNotes"
                      placeholder="Commentaires pour le citoyen..."
                      value={validationNotes}
                      onChange={(e) => setValidationNotes(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleValidateProfile}
                    className="w-full"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Valider le profil
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-600">
                    <XCircle className="w-5 h-5" />
                    <span>Rejeter le profil</span>
                  </CardTitle>
                  <CardDescription>
                    Demander des corrections au citoyen
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="rejectionReason">Motif de rejet *</Label>
                    <Textarea
                      id="rejectionReason"
                      placeholder="Expliquez les corrections nécessaires..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <XCircle className="mr-2 h-4 w-4" />
                        Rejeter le profil
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmer le rejet</DialogTitle>
                        <DialogDescription>
                          Le citoyen sera notifié et pourra corriger son profil.
                          Cette action est réversible.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">Annuler</Button>
                        <Button variant="destructive" onClick={handleRejectProfile}>
                          Confirmer le rejet
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Contacter le citoyen</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Phone className="mr-2 h-4 w-4" />
                    Appeler
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Envoyer un message
                  </Button>
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Programmer un RDV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
}
