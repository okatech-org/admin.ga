'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Briefcase,
  Users,
  TrendingUp,
  ChevronRight,
  Building2,
  Calendar,
  GraduationCap,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { OffreEmploi, TypeContrat, NiveauEtude } from '@/lib/types/emploi';

export default function TravailGAPage() {
  const [offresRecentes, setOffresRecentes] = useState<OffreEmploi[]>([]);
  const [recherche, setRecherche] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [typeContrat, setTypeContrat] = useState<TypeContrat | ''>('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOffres: 0,
    offresActives: 0,
    candidaturesRecentes: 0,
    entreprisesPartenaires: 0
  });

  useEffect(() => {
    fetchOffresRecentes();
    fetchStatistiques();
  }, []);

  const fetchOffresRecentes = async () => {
    try {
      const response = await fetch('/api/emploi/offres?limit=6&statut=active');
      if (response.ok) {
        const data = await response.json();
        setOffresRecentes(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistiques = async () => {
    try {
      const response = await fetch('/api/emploi/statistiques');
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalOffres: data.totalOffres || 0,
          offresActives: data.offresActives || 0,
          candidaturesRecentes: data.totalCandidatures || 0,
          entreprisesPartenaires: data.nombreOrganismes || 0
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleRecherche = () => {
    const params = new URLSearchParams();
    if (recherche) params.append('q', recherche);
    if (localisation) params.append('loc', localisation);
    if (typeContrat) params.append('type', typeContrat);

    window.location.href = `/travail/offres?${params.toString()}`;
  };

  const formatSalaire = (offre: OffreEmploi) => {
    if (!offre.salaire) return 'Salaire non précisé';
    const { min, max, devise, periode } = offre.salaire;
    if (min && max) {
      return `${min.toLocaleString()} - ${max.toLocaleString()} ${devise}/${periode}`;
    } else if (min) {
      return `À partir de ${min.toLocaleString()} ${devise}/${periode}`;
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

  const localisations = [
    'Libreville', 'Port-Gentil', 'Franceville', 'Oyem', 'Moanda',
    'Mouila', 'Lambaréné', 'Tchibanga', 'Koulamoutou', 'Makokou'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">
              TRAVAIL.GA
            </h1>
            <p className="text-xl mb-8 text-green-100">
              La plateforme officielle de l'emploi public au Gabon
            </p>

            {/* Barre de recherche */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Poste, mots-clés, compétences..."
                      className="pl-10 h-12 text-gray-900"
                      value={recherche}
                      onChange={(e) => setRecherche(e.target.value)}
                    />
                  </div>
                </div>

                <Select value={localisation} onValueChange={setLocalisation}>
                  <SelectTrigger className="h-12 text-gray-900">
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Localisation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les villes</SelectItem>
                    {localisations.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleRecherche}
                  className="h-12 bg-green-600 hover:bg-green-700"
                >
                  Rechercher
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Offres disponibles</p>
                  <p className="text-3xl font-bold text-green-600">{stats.offresActives}</p>
                </div>
                <Briefcase className="h-10 w-10 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Candidatures récentes</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.candidaturesRecentes}</p>
                </div>
                <Users className="h-10 w-10 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Administrations</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.entreprisesPartenaires}</p>
                </div>
                <Building2 className="h-10 w-10 text-purple-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux de placement</p>
                  <p className="text-3xl font-bold text-orange-600">78%</p>
                </div>
                <TrendingUp className="h-10 w-10 text-orange-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Offres récentes */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Offres récentes</h2>
            <p className="text-gray-600 mt-2">Les dernières opportunités dans l'administration publique</p>
          </div>
          <Link href="/travail/offres">
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              Voir toutes les offres
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offresRecentes.map((offre) => (
              <Card key={offre.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getTypeContratColor(offre.typeContrat)}>
                      {offre.typeContrat}
                    </Badge>
                    {offre.datePublication && (
                      <span className="text-xs text-gray-500">
                        Il y a {Math.floor((Date.now() - new Date(offre.datePublication).getTime()) / (1000 * 60 * 60 * 24))} jours
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{offre.titre}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Building2 className="h-4 w-4" />
                    {offre.organismeNom}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {offre.localisation}
                    </div>
                    {offre.niveauEtude && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <GraduationCap className="h-4 w-4" />
                        {offre.niveauEtude}
                      </div>
                    )}
                    <div className="text-sm font-medium text-green-600">
                      {formatSalaire(offre)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {offre.competences?.slice(0, 3).map((comp, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {comp}
                      </Badge>
                    ))}
                    {offre.competences && offre.competences.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{offre.competences.length - 3}
                      </Badge>
                    )}
                  </div>

                  <Link href={`/travail/offres/${offre.id}`}>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Voir l'offre
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Section CTA */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Vous êtes candidat ?</h3>
                <p className="text-gray-600 mb-6">
                  Créez votre profil et postulez aux offres d'emploi dans l'administration publique gabonaise.
                </p>
                <Link href="/auth/inscription?role=candidat">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Créer mon compte candidat
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Vous êtes recruteur ?</h3>
                <p className="text-gray-600 mb-6">
                  Accédez à votre espace recruteur pour publier des offres et gérer les candidatures.
                </p>
                <Link href="/travail/recruteur">
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    Espace recruteur
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
