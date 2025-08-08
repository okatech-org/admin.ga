'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  Calendar,
  GraduationCap,
  Clock,
  DollarSign,
  Users,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  FileText,
  Upload,
  User,
  Mail,
  Phone,
  Share2,
  Heart,
  BookmarkPlus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { OffreEmploi, TypeContrat, NiveauEtude } from '@/lib/types/emploi';

export default function DetailOffrePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [offre, setOffre] = useState<OffreEmploi | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCandidatureDialog, setShowCandidatureDialog] = useState(false);
  const [candidatureLoading, setCandidatureLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [candidatureData, setCandidatureData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    cv: null as File | null,
    lettreMotivation: '',
    pretentionsSalariales: '',
    disponibilite: '',
    competences: '',
    experience: ''
  });

  useEffect(() => {
    if (params.id) {
      fetchOffre(params.id as string);
    }
  }, [params.id]);

  const fetchOffre = async (id: string) => {
    try {
      const response = await fetch(`/api/emploi/offres/${id}`);
      if (response.ok) {
        const data = await response.json();
        setOffre(data);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de charger l'offre d'emploi",
          variant: "destructive"
        });
        router.push('/travail/offres');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCandidature = async () => {
    if (!candidatureData.nom || !candidatureData.prenom || !candidatureData.email || !candidatureData.cv) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setCandidatureLoading(true);
    try {
      const formData = new FormData();
      formData.append('offreId', params.id as string);
      formData.append('nom', candidatureData.nom);
      formData.append('prenom', candidatureData.prenom);
      formData.append('email', candidatureData.email);
      formData.append('telephone', candidatureData.telephone);
      formData.append('cv', candidatureData.cv);
      formData.append('lettreMotivation', candidatureData.lettreMotivation);
      formData.append('pretentionsSalariales', candidatureData.pretentionsSalariales);
      formData.append('disponibilite', candidatureData.disponibilite);
      formData.append('competences', candidatureData.competences);
      formData.append('experience', candidatureData.experience);

      const response = await fetch('/api/emploi/candidatures', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        toast({
          title: "Candidature envoyée",
          description: "Votre candidature a été envoyée avec succès"
        });
        setShowCandidatureDialog(false);
        // Réinitialiser le formulaire
        setCandidatureData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          cv: null,
          lettreMotivation: '',
          pretentionsSalariales: '',
          disponibilite: '',
          competences: '',
          experience: ''
        });
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre candidature",
        variant: "destructive"
      });
    } finally {
      setCandidatureLoading(false);
    }
  };

  const handleSaveOffre = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Offre retirée" : "Offre sauvegardée",
      description: isSaved
        ? "L'offre a été retirée de vos favoris"
        : "L'offre a été ajoutée à vos favoris"
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: offre?.titre,
        text: `Offre d'emploi: ${offre?.titre} chez ${offre?.organismeNom}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié",
        description: "Le lien de l'offre a été copié dans le presse-papier"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!offre) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Offre introuvable</p>
            <Link href="/travail/offres">
              <Button className="mt-4">Retour aux offres</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatSalaire = () => {
    if (!offre.salaire) return 'Salaire non précisé';
    const { min, max, devise, periode } = offre.salaire;
    if (min && max) {
          return `${min.toLocaleString('fr-FR')} - ${max.toLocaleString('fr-FR')} ${devise}/${periode}`;
  } else if (min) {
    return `À partir de ${min.toLocaleString('fr-FR')} ${devise}/${periode}`;
    }
    return 'Salaire à négocier';
  };

  const getTypeContratColor = (type: TypeContrat) => {
    const colors: Record<TypeContrat, string> = {
      CDI: 'bg-green-100 text-green-800',
      CDD: 'bg-blue-100 text-blue-800',
      stage: 'bg-purple-100 text-purple-800',
      alternance: 'bg-orange-100 text-orange-800',
      consultant: 'bg-yellow-100 text-yellow-800',
      vacataire: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getNiveauEtudeLabel = (niveau: NiveauEtude) => {
    const labels: Record<NiveauEtude, string> = {
      bac: 'Baccalauréat',
      'bac+2': 'Bac+2',
      'bac+3': 'Licence',
      'bac+5': 'Master',
      doctorat: 'Doctorat',
      autre: 'Autre'
    };
    return labels[niveau] || niveau;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-green-100 mb-4">
            <Link href="/travail" className="hover:text-white">TRAVAIL.GA</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/travail/offres" className="hover:text-white">Offres d'emploi</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Détail de l'offre</span>
          </div>

          <Link href="/travail/offres">
            <Button variant="ghost" className="text-white hover:bg-green-500/20 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux offres
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getTypeContratColor(offre.typeContrat)}>
                        {offre.typeContrat}
                      </Badge>
                      {offre.statut === 'active' && (
                        <Badge className="bg-green-100 text-green-800">
                          Offre active
                        </Badge>
                      )}
                      {offre.datePublication && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Publiée il y a {Math.floor((Date.now() - new Date(offre.datePublication).getTime()) / (1000 * 60 * 60 * 24))} jours
                        </span>
                      )}
                    </div>

                    <CardTitle className="text-2xl mb-2">{offre.titre}</CardTitle>

                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {offre.organismeNom}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {offre.localisation}
                      </span>
                      {offre.niveauEtude && (
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          {getNiveauEtudeLabel(offre.niveauEtude)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleSaveOffre}
                    >
                      <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Description du poste</h3>
                  <div className="text-gray-600 whitespace-pre-wrap">
                    {offre.description}
                  </div>
                </div>

                {/* Missions */}
                {offre.missions && offre.missions.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Missions principales</h3>
                    <ul className="space-y-2">
                      {offre.missions.map((mission, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{mission}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Compétences requises */}
                {offre.competences && offre.competences.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Compétences requises</h3>
                    <div className="flex flex-wrap gap-2">
                      {offre.competences.map((comp, idx) => (
                        <Badge key={idx} variant="secondary">
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expérience */}
                {offre.experienceRequise && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Expérience requise</h3>
                    <p className="text-gray-600">{offre.experienceRequise}</p>
                  </div>
                )}

                {/* Avantages */}
                {offre.avantages && offre.avantages.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Avantages</h3>
                    <ul className="space-y-2">
                      {offre.avantages.map((avantage, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{avantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardContent className="p-6">
                <Dialog open={showCandidatureDialog} onOpenChange={setShowCandidatureDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-green-600 hover:bg-green-700 mb-3">
                      Postuler maintenant
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Postuler à l'offre</DialogTitle>
                      <DialogDescription>
                        {offre.titre} - {offre.organismeNom}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nom">Nom *</Label>
                          <Input
                            id="nom"
                            value={candidatureData.nom}
                            onChange={(e) => setCandidatureData(prev => ({...prev, nom: e.target.value}))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="prenom">Prénom *</Label>
                          <Input
                            id="prenom"
                            value={candidatureData.prenom}
                            onChange={(e) => setCandidatureData(prev => ({...prev, prenom: e.target.value}))}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={candidatureData.email}
                          onChange={(e) => setCandidatureData(prev => ({...prev, email: e.target.value}))}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="telephone">Téléphone *</Label>
                        <Input
                          id="telephone"
                          value={candidatureData.telephone}
                          onChange={(e) => setCandidatureData(prev => ({...prev, telephone: e.target.value}))}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="cv">CV (PDF) *</Label>
                        <Input
                          id="cv"
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setCandidatureData(prev => ({...prev, cv: e.target.files?.[0] || null}))}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="lettreMotivation">Lettre de motivation</Label>
                        <Textarea
                          id="lettreMotivation"
                          rows={6}
                          value={candidatureData.lettreMotivation}
                          onChange={(e) => setCandidatureData(prev => ({...prev, lettreMotivation: e.target.value}))}
                          placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="competences">Compétences clés</Label>
                        <Textarea
                          id="competences"
                          rows={3}
                          value={candidatureData.competences}
                          onChange={(e) => setCandidatureData(prev => ({...prev, competences: e.target.value}))}
                          placeholder="Listez vos compétences principales..."
                        />
                      </div>

                      <div>
                        <Label htmlFor="experience">Expérience pertinente</Label>
                        <Textarea
                          id="experience"
                          rows={3}
                          value={candidatureData.experience}
                          onChange={(e) => setCandidatureData(prev => ({...prev, experience: e.target.value}))}
                          placeholder="Décrivez votre expérience en lien avec ce poste..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="pretentions">Prétentions salariales (FCFA)</Label>
                          <Input
                            id="pretentions"
                            type="number"
                            value={candidatureData.pretentionsSalariales}
                            onChange={(e) => setCandidatureData(prev => ({...prev, pretentionsSalariales: e.target.value}))}
                            placeholder="Ex: 500000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="disponibilite">Disponibilité</Label>
                          <Input
                            id="disponibilite"
                            type="date"
                            value={candidatureData.disponibilite}
                            onChange={(e) => setCandidatureData(prev => ({...prev, disponibilite: e.target.value}))}
                          />
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowCandidatureDialog(false)}>
                        Annuler
                      </Button>
                      <Button
                        onClick={handleCandidature}
                        disabled={candidatureLoading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {candidatureLoading ? 'Envoi...' : 'Envoyer ma candidature'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full">
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  Sauvegarder l'offre
                </Button>
              </CardContent>
            </Card>

            {/* Informations clés */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations clés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Salaire</p>
                  <p className="font-semibold text-green-600">{formatSalaire()}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-gray-500 mb-1">Type de contrat</p>
                  <p className="font-semibold">{offre.typeContrat}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-gray-500 mb-1">Nombre de postes</p>
                  <p className="font-semibold">{offre.nombrePostes} poste{offre.nombrePostes > 1 ? 's' : ''}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-gray-500 mb-1">Date limite</p>
                  <p className="font-semibold">
                    {offre.dateExpiration
                      ? new Date(offre.dateExpiration).toLocaleDateString('fr-FR')
                      : 'Non spécifiée'}
                  </p>
                </div>

                {offre.nombreCandidatures !== undefined && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Candidatures reçues</p>
                      <p className="font-semibold flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {offre.nombreCandidatures} candidature{offre.nombreCandidatures > 1 ? 's' : ''}
                      </p>
                    </div>
                  </>
                )}

                {offre.reference && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Référence</p>
                      <p className="font-semibold">{offre.reference}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Contact */}
            {offre.contact && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {offre.contact.nom && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{offre.contact.nom}</span>
                    </div>
                  )}
                  {offre.contact.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${offre.contact.email}`} className="text-blue-600 hover:underline">
                        {offre.contact.email}
                      </a>
                    </div>
                  )}
                  {offre.contact.telephone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${offre.contact.telephone}`} className="text-blue-600 hover:underline">
                        {offre.contact.telephone}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Offres similaires */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Offres similaires</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  D'autres opportunités qui pourraient vous intéresser
                </p>
                <Link href="/travail/offres">
                  <Button variant="outline" className="w-full">
                    Voir plus d'offres
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
