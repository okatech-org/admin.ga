'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  MapPin,
  Briefcase,
  Calendar,
  GraduationCap,
  Building2,
  Filter,
  ChevronRight,
  Clock,
  DollarSign,
  X,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { OffreEmploi, TypeContrat, NiveauEtude, FiltresOffres } from '@/lib/types/emploi';

export default function OffresEmploiPage() {
  const searchParams = useSearchParams();
  const [offres, setOffres] = useState<OffreEmploi[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalOffres, setTotalOffres] = useState(0);
  const [page, setPage] = useState(1);
  const [filtres, setFiltres] = useState<FiltresOffres>({
    recherche: searchParams.get('q') || '',
    typeContrat: [],
    niveauEtude: [],
    localisation: searchParams.get('loc') ? [searchParams.get('loc')!] : [],
    salaireMin: undefined,
    salaireMax: undefined
  });
  const [showFiltres, setShowFiltres] = useState(false);

  const typesContrat: TypeContrat[] = ['CDI', 'CDD', 'stage', 'alternance', 'consultant', 'vacataire'];
  const niveauxEtude: NiveauEtude[] = ['bac', 'bac+2', 'bac+3', 'bac+5', 'doctorat'];
  const localisations = [
    'Libreville', 'Port-Gentil', 'Franceville', 'Oyem', 'Moanda',
    'Mouila', 'Lambaréné', 'Tchibanga', 'Koulamoutou', 'Makokou'
  ];

  useEffect(() => {
    fetchOffres();
  }, [page, filtres]);

  const fetchOffres = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '12');

      if (filtres.recherche) params.append('q', filtres.recherche);
      if (filtres.typeContrat?.length) params.append('type', filtres.typeContrat.join(','));
      if (filtres.niveauEtude?.length) params.append('niveau', filtres.niveauEtude.join(','));
      if (filtres.localisation?.length) params.append('loc', filtres.localisation.join(','));
      if (filtres.salaireMin) params.append('salMin', filtres.salaireMin.toString());
      if (filtres.salaireMax) params.append('salMax', filtres.salaireMax.toString());

      const response = await fetch(`/api/emploi/offres?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setOffres(data.offres || []);
        setTotalOffres(data.total || 0);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltreChange = (type: keyof FiltresOffres, value: any) => {
    setFiltres(prev => ({
      ...prev,
      [type]: value
    }));
    setPage(1);
  };

  const toggleArrayFilter = (type: 'typeContrat' | 'niveauEtude' | 'localisation', value: string) => {
    setFiltres(prev => {
      const currentValues = prev[type] || [];
      const newValues = currentValues.includes(value as any)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value as any];
      return { ...prev, [type]: newValues };
    });
    setPage(1);
  };

  const resetFiltres = () => {
    setFiltres({
      recherche: '',
      typeContrat: [],
      niveauEtude: [],
      localisation: [],
      salaireMin: undefined,
      salaireMax: undefined
    });
    setPage(1);
  };

  const formatSalaire = (offre: OffreEmploi) => {
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

  const FiltresPanel = () => (
    <div className="space-y-6">
      {/* Type de contrat */}
      <div>
        <h3 className="font-semibold mb-3">Type de contrat</h3>
        <div className="space-y-2">
          {typesContrat.map(type => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={filtres.typeContrat?.includes(type) || false}
                onCheckedChange={() => toggleArrayFilter('typeContrat', type)}
              />
              <Label htmlFor={`type-${type}`} className="cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Niveau d'études */}
      <div>
        <h3 className="font-semibold mb-3">Niveau d'études</h3>
        <div className="space-y-2">
          {niveauxEtude.map(niveau => (
            <div key={niveau} className="flex items-center space-x-2">
              <Checkbox
                id={`niveau-${niveau}`}
                checked={filtres.niveauEtude?.includes(niveau) || false}
                onCheckedChange={() => toggleArrayFilter('niveauEtude', niveau)}
              />
              <Label htmlFor={`niveau-${niveau}`} className="cursor-pointer">
                {getNiveauEtudeLabel(niveau)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Localisation */}
      <div>
        <h3 className="font-semibold mb-3">Localisation</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {localisations.map(loc => (
            <div key={loc} className="flex items-center space-x-2">
              <Checkbox
                id={`loc-${loc}`}
                checked={filtres.localisation?.includes(loc) || false}
                onCheckedChange={() => toggleArrayFilter('localisation', loc)}
              />
              <Label htmlFor={`loc-${loc}`} className="cursor-pointer">
                {loc}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Fourchette salariale */}
      <div>
        <h3 className="font-semibold mb-3">Salaire mensuel (FCFA)</h3>
        <div className="space-y-4">
          <div>
                            <Label>Min: {filtres.salaireMin?.toLocaleString('fr-FR') || '0'} FCFA</Label>
            <Slider
              value={[filtres.salaireMin || 0]}
              onValueChange={([value]) => handleFiltreChange('salaireMin', value)}
              max={5000000}
              step={50000}
              className="mt-2"
            />
          </div>
          <div>
                            <Label>Max: {filtres.salaireMax?.toLocaleString('fr-FR') || '5,000,000'} FCFA</Label>
            <Slider
              value={[filtres.salaireMax || 5000000]}
              onValueChange={([value]) => handleFiltreChange('salaireMax', value)}
              max={5000000}
              step={50000}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={resetFiltres}
      >
        Réinitialiser les filtres
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-green-100 mb-2">
            <Link href="/travail" className="hover:text-white">TRAVAIL.GA</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Offres d'emploi</span>
          </div>
          <h1 className="text-3xl font-bold">Toutes les offres d'emploi</h1>
          <p className="text-green-100 mt-2">{totalOffres} offres disponibles</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Barre de recherche */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Rechercher par poste, compétences, mots-clés..."
                className="pl-10"
                value={filtres.recherche}
                onChange={(e) => handleFiltreChange('recherche', e.target.value)}
              />
            </div>

            {/* Bouton filtres mobile */}
            <Sheet open={showFiltres} onOpenChange={setShowFiltres}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtres</SheetTitle>
                  <SheetDescription>
                    Affinez votre recherche
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FiltresPanel />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Filtres actifs */}
          {(filtres.typeContrat?.length || filtres.niveauEtude?.length || filtres.localisation?.length) ? (
            <div className="flex flex-wrap gap-2 mt-4">
              {filtres.typeContrat?.map(type => (
                <Badge key={type} variant="secondary" className="pl-2">
                  {type}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => toggleArrayFilter('typeContrat', type)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {filtres.niveauEtude?.map(niveau => (
                <Badge key={niveau} variant="secondary" className="pl-2">
                  {getNiveauEtudeLabel(niveau)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => toggleArrayFilter('niveauEtude', niveau)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {filtres.localisation?.map(loc => (
                <Badge key={loc} variant="secondary" className="pl-2">
                  {loc}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => toggleArrayFilter('localisation', loc)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filtres desktop */}
          <div className="hidden lg:block">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filtres</CardTitle>
              </CardHeader>
              <CardContent>
                <FiltresPanel />
              </CardContent>
            </Card>
          </div>

          {/* Liste des offres */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              </div>
            ) : offres.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucune offre ne correspond à vos critères</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={resetFiltres}
                  >
                    Réinitialiser les filtres
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {offres.map((offre) => (
                  <Card key={offre.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getTypeContratColor(offre.typeContrat)}>
                              {offre.typeContrat}
                            </Badge>
                            {offre.datePublication && (
                              <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Il y a {Math.floor((Date.now() - new Date(offre.datePublication).getTime()) / (1000 * 60 * 60 * 24))} jours
                              </span>
                            )}
                          </div>

                          <Link href={`/travail/offres/${offre.id}`}>
                            <h3 className="text-xl font-semibold text-gray-900 hover:text-green-600 transition-colors">
                              {offre.titre}
                            </h3>
                          </Link>

                          <div className="flex items-center gap-4 mt-2 text-gray-600">
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

                          <p className="text-gray-600 mt-3 line-clamp-2">
                            {offre.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {offre.competences?.slice(0, 4).map((comp, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {comp}
                              </Badge>
                            ))}
                            {offre.competences && offre.competences.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{offre.competences.length - 4}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4 text-sm">
                              <span className="font-semibold text-green-600 flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {formatSalaire(offre)}
                              </span>
                              {offre.nombreCandidatures !== undefined && (
                                <span className="text-gray-500 flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {offre.nombreCandidatures} candidature{offre.nombreCandidatures > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>

                            <Link href={`/travail/offres/${offre.id}`}>
                              <Button className="bg-green-600 hover:bg-green-700">
                                Voir l'offre
                                <ChevronRight className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Pagination */}
                {totalOffres > 12 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Précédent
                    </Button>
                    <span className="flex items-center px-4">
                      Page {page} sur {Math.ceil(totalOffres / 12)}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setPage(p => p + 1)}
                      disabled={page >= Math.ceil(totalOffres / 12)}
                    >
                      Suivant
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
