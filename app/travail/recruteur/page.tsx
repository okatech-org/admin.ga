'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  ChevronRight,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  FileText,
  Mail,
  Phone
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { OffreEmploi, Candidature, TypeContrat, NiveauEtude, StatutCandidature } from '@/lib/types/emploi';

export default function RecruteurPage() {
  const { toast } = useToast();
  const [offres, setOffres] = useState<OffreEmploi[]>([]);
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffre, setSelectedOffre] = useState<OffreEmploi | null>(null);
  const [showNewOffreDialog, setShowNewOffreDialog] = useState(false);
  const [showCandidatureDialog, setShowCandidatureDialog] = useState(false);
  const [selectedCandidature, setSelectedCandidature] = useState<Candidature | null>(null);
  const [stats, setStats] = useState({
    totalOffres: 0,
    offresActives: 0,
    totalCandidatures: 0,
    candidaturesNouvelles: 0,
    tauxConversion: 0
  });

  const [newOffre, setNewOffre] = useState({
    titre: '',
    description: '',
    typeContrat: 'CDI' as TypeContrat,
    niveauEtude: 'bac+3' as NiveauEtude,
    localisation: 'Libreville',
    experienceRequise: '',
    competences: '',
    missions: '',
    avantages: '',
    salaireMin: '',
    salaireMax: '',
    nombrePostes: '1',
    dateExpiration: ''
  });

  // Simuler l'organisme connecté
  const organismeConnecte = {
    id: 'min-fonction-publique',
    nom: 'Ministère de la Fonction Publique'
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Récupérer les offres de l'organisme
      const offresResponse = await fetch('/api/emploi/offres?limit=100');
      if (offresResponse.ok) {
        const data = await offresResponse.json();
        // Filtrer par organisme (en production, faire côté serveur)
        const mesOffres = data.offres.filter((o: OffreEmploi) =>
          o.organismeId === organismeConnecte.id
        );
        setOffres(mesOffres);

        // Calculer les stats
        const offresActives = mesOffres.filter((o: OffreEmploi) => o.statut === 'active').length;
        const totalCandidatures = mesOffres.reduce((sum: number, o: OffreEmploi) =>
          sum + (o.nombreCandidatures || 0), 0
        );

        setStats({
          totalOffres: mesOffres.length,
          offresActives,
          totalCandidatures,
          candidaturesNouvelles: Math.floor(totalCandidatures * 0.3), // Simulation
          tauxConversion: mesOffres.length > 0 ?
            Math.round((mesOffres.filter((o: OffreEmploi) => o.statut === 'pourvue').length / mesOffres.length) * 100) : 0
        });
      }

      // Récupérer les candidatures
      const candidaturesResponse = await fetch('/api/emploi/candidatures');
      if (candidaturesResponse.ok) {
        const data = await candidaturesResponse.json();
        setCandidatures(data.candidatures || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOffre = async () => {
    try {
      const competencesArray = newOffre.competences.split(',').map(c => c.trim()).filter(c => c);
      const missionsArray = newOffre.missions.split('\n').map(m => m.trim()).filter(m => m);
      const avantagesArray = newOffre.avantages.split('\n').map(a => a.trim()).filter(a => a);

      const offreData = {
        titre: newOffre.titre,
        description: newOffre.description,
        organismeId: organismeConnecte.id,
        organismeNom: organismeConnecte.nom,
        typeContrat: newOffre.typeContrat,
        niveauEtude: newOffre.niveauEtude,
        localisation: newOffre.localisation,
        experienceRequise: newOffre.experienceRequise,
        competences: competencesArray,
        missions: missionsArray,
        avantages: avantagesArray,
        salaire: {
          min: parseInt(newOffre.salaireMin),
          max: parseInt(newOffre.salaireMax),
          devise: 'FCFA',
          periode: 'mois' as const
        },
        nombrePostes: parseInt(newOffre.nombrePostes),
        dateExpiration: new Date(newOffre.dateExpiration)
      };

      const response = await fetch('/api/emploi/offres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offreData)
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "L'offre a été créée avec succès"
        });
        setShowNewOffreDialog(false);
        fetchData();
        // Réinitialiser le formulaire
        setNewOffre({
          titre: '',
          description: '',
          typeContrat: 'CDI',
          niveauEtude: 'bac+3',
          localisation: 'Libreville',
          experienceRequise: '',
          competences: '',
          missions: '',
          avantages: '',
          salaireMin: '',
          salaireMax: '',
          nombrePostes: '1',
          dateExpiration: ''
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'offre",
        variant: "destructive"
      });
    }
  };

  const handleUpdateStatutCandidature = async (candidatureId: string, nouveauStatut: StatutCandidature) => {
    // En production, faire un appel API
    toast({
      title: "Statut mis à jour",
      description: `La candidature a été marquée comme ${nouveauStatut}`
    });
    // Rafraîchir les données
    fetchData();
  };

  const getStatutBadgeColor = (statut: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      pourvue: 'bg-blue-100 text-blue-800',
      expiree: 'bg-red-100 text-red-800',
      brouillon: 'bg-gray-100 text-gray-800',
      nouvelle: 'bg-yellow-100 text-yellow-800',
      en_cours: 'bg-orange-100 text-orange-800',
      acceptee: 'bg-green-100 text-green-800',
      refusee: 'bg-red-100 text-red-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-blue-100 mb-2">
            <Link href="/travail" className="hover:text-white">TRAVAIL.GA</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Espace Recruteur</span>
          </div>
          <h1 className="text-3xl font-bold">Tableau de bord recruteur</h1>
          <p className="text-blue-100 mt-2">{organismeConnecte.nom}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total offres</p>
                  <p className="text-2xl font-bold">{stats.totalOffres}</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Offres actives</p>
                  <p className="text-2xl font-bold text-green-600">{stats.offresActives}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Candidatures</p>
                  <p className="text-2xl font-bold">{stats.totalCandidatures}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Nouvelles</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.candidaturesNouvelles}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux pourvoi</p>
                  <p className="text-2xl font-bold">{stats.tauxConversion}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-indigo-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets */}
        <Tabs defaultValue="offres" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="offres">Mes offres</TabsTrigger>
            <TabsTrigger value="candidatures">Candidatures</TabsTrigger>
            <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          </TabsList>

          {/* Onglet Offres */}
          <TabsContent value="offres">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gestion des offres d'emploi</CardTitle>
                    <CardDescription>Gérez vos offres d'emploi publiées sur TRAVAIL.GA</CardDescription>
                  </div>

                  <Dialog open={showNewOffreDialog} onOpenChange={setShowNewOffreDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouvelle offre
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Créer une nouvelle offre d'emploi</DialogTitle>
                        <DialogDescription>
                          Remplissez les informations pour publier votre offre
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="titre">Titre du poste *</Label>
                          <Input
                            id="titre"
                            value={newOffre.titre}
                            onChange={(e) => setNewOffre({...newOffre, titre: e.target.value})}
                            placeholder="Ex: Directeur des Ressources Humaines"
                          />
                        </div>

                        <div>
                          <Label htmlFor="description">Description du poste *</Label>
                          <Textarea
                            id="description"
                            rows={5}
                            value={newOffre.description}
                            onChange={(e) => setNewOffre({...newOffre, description: e.target.value})}
                            placeholder="Décrivez le poste, les responsabilités principales..."
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Type de contrat</Label>
                            <Select value={newOffre.typeContrat} onValueChange={(v) => setNewOffre({...newOffre, typeContrat: v as TypeContrat})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CDI">CDI</SelectItem>
                                <SelectItem value="CDD">CDD</SelectItem>
                                <SelectItem value="stage">Stage</SelectItem>
                                <SelectItem value="alternance">Alternance</SelectItem>
                                <SelectItem value="consultant">Consultant</SelectItem>
                                <SelectItem value="vacataire">Vacataire</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Niveau d'études</Label>
                            <Select value={newOffre.niveauEtude} onValueChange={(v) => setNewOffre({...newOffre, niveauEtude: v as NiveauEtude})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bac">Baccalauréat</SelectItem>
                                <SelectItem value="bac+2">Bac+2</SelectItem>
                                <SelectItem value="bac+3">Licence</SelectItem>
                                <SelectItem value="bac+5">Master</SelectItem>
                                <SelectItem value="doctorat">Doctorat</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Localisation</Label>
                            <Select value={newOffre.localisation} onValueChange={(v) => setNewOffre({...newOffre, localisation: v})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Libreville">Libreville</SelectItem>
                                <SelectItem value="Port-Gentil">Port-Gentil</SelectItem>
                                <SelectItem value="Franceville">Franceville</SelectItem>
                                <SelectItem value="Oyem">Oyem</SelectItem>
                                <SelectItem value="Moanda">Moanda</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="nombrePostes">Nombre de postes</Label>
                            <Input
                              id="nombrePostes"
                              type="number"
                              min="1"
                              value={newOffre.nombrePostes}
                              onChange={(e) => setNewOffre({...newOffre, nombrePostes: e.target.value})}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="experience">Expérience requise</Label>
                          <Input
                            id="experience"
                            value={newOffre.experienceRequise}
                            onChange={(e) => setNewOffre({...newOffre, experienceRequise: e.target.value})}
                            placeholder="Ex: 5 ans minimum en gestion d'équipe"
                          />
                        </div>

                        <div>
                          <Label htmlFor="competences">Compétences (séparées par des virgules)</Label>
                          <Input
                            id="competences"
                            value={newOffre.competences}
                            onChange={(e) => setNewOffre({...newOffre, competences: e.target.value})}
                            placeholder="Ex: Management, Excel, Communication"
                          />
                        </div>

                        <div>
                          <Label htmlFor="missions">Missions principales (une par ligne)</Label>
                          <Textarea
                            id="missions"
                            rows={4}
                            value={newOffre.missions}
                            onChange={(e) => setNewOffre({...newOffre, missions: e.target.value})}
                            placeholder="- Mission 1&#10;- Mission 2&#10;- Mission 3"
                          />
                        </div>

                        <div>
                          <Label htmlFor="avantages">Avantages (un par ligne)</Label>
                          <Textarea
                            id="avantages"
                            rows={3}
                            value={newOffre.avantages}
                            onChange={(e) => setNewOffre({...newOffre, avantages: e.target.value})}
                            placeholder="- Assurance santé&#10;- Formation continue&#10;- Télétravail"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="salaireMin">Salaire minimum (FCFA/mois)</Label>
                            <Input
                              id="salaireMin"
                              type="number"
                              value={newOffre.salaireMin}
                              onChange={(e) => setNewOffre({...newOffre, salaireMin: e.target.value})}
                              placeholder="500000"
                            />
                          </div>

                          <div>
                            <Label htmlFor="salaireMax">Salaire maximum (FCFA/mois)</Label>
                            <Input
                              id="salaireMax"
                              type="number"
                              value={newOffre.salaireMax}
                              onChange={(e) => setNewOffre({...newOffre, salaireMax: e.target.value})}
                              placeholder="1000000"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="dateExpiration">Date limite de candidature</Label>
                          <Input
                            id="dateExpiration"
                            type="date"
                            value={newOffre.dateExpiration}
                            onChange={(e) => setNewOffre({...newOffre, dateExpiration: e.target.value})}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNewOffreDialog(false)}>
                          Annuler
                        </Button>
                        <Button onClick={handleCreateOffre} className="bg-blue-600 hover:bg-blue-700">
                          Publier l'offre
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>

              <CardContent>
                {offres.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune offre publiée</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Commencez par créer votre première offre d'emploi
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre du poste</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Localisation</TableHead>
                        <TableHead>Candidatures</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date publication</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {offres.map((offre) => (
                        <TableRow key={offre.id}>
                          <TableCell className="font-medium">{offre.titre}</TableCell>
                          <TableCell>{offre.typeContrat}</TableCell>
                          <TableCell>{offre.localisation}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {offre.nombreCandidatures || 0} candidat(s)
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatutBadgeColor(offre.statut)}>
                              {offre.statut}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(offre.datePublication)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Link href={`/travail/offres/${offre.id}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Candidatures */}
          <TabsContent value="candidatures">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des candidatures</CardTitle>
                <CardDescription>Consultez et gérez les candidatures reçues</CardDescription>
              </CardHeader>
              <CardContent>
                {candidatures.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune candidature reçue</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Les candidatures apparaîtront ici lorsque des candidats postuleront à vos offres
                    </p>
                  </div>
                ) : (
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {candidatures.filter(c => c.statut === 'nouvelle').length} nouvelle(s) candidature(s) à traiter
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Analytics */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytiques de recrutement</CardTitle>
                <CardDescription>Suivez les performances de vos offres d'emploi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      Vos offres ont généré <strong>{stats.totalCandidatures}</strong> candidatures ce mois-ci,
                      soit une augmentation de <strong>23%</strong> par rapport au mois dernier.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Top des offres par candidatures</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {offres.slice(0, 3).map((offre, idx) => (
                            <div key={offre.id} className="flex justify-between items-center">
                              <span className="text-sm truncate flex-1">{idx + 1}. {offre.titre}</span>
                              <Badge variant="outline">{offre.nombreCandidatures || 0}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Délai moyen de recrutement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-blue-600">21 jours</p>
                          <p className="text-sm text-gray-600 mt-2">
                            De la publication à l'embauche
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
