/* @ts-nocheck */
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import {
  Users,
  Building2,
  Search,
  Plus,
  Edit,
  Eye,
  UserPlus,
  BookOpen,
  Settings,
  Award,
  TrendingUp,
  Shield,
  Briefcase,
  GraduationCap,
  Stethoscope,
  Calculator,
  Wrench,
  FileText,
  Filter
} from 'lucide-react';

import {
  CATEGORIES_POSTES,
  GRADES_FONCTION_PUBLIQUE,
  DIRECTIONS_CENTRALES,
  POSTES_TRANSFORMATION_DIGITALE,
  HIERARCHIE_TERRITORIALE,
  METADATA_ADMINISTRATION,
  getAllPostes,
  getPostesByGrade,
  getPostesForAdministration,
  type PosteAdministratif,
  type CategoriePoste
} from '@/lib/data/postes-administratifs';

export default function PostesAdministratifsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState('');
  const [selectedPoste, setSelectedPoste] = useState<PosteAdministratif | null>(null);

  // Filtrage des postes
  const filteredPostes = getAllPostes().filter(poste => {
    const matchSearch = poste.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       poste.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGrade = !selectedGrade || poste.grade_requis.includes(selectedGrade);
    const matchCategorie = !selectedCategorie ||
                          CATEGORIES_POSTES.find(cat => cat.id === selectedCategorie)?.postes.includes(poste);

    return matchSearch && matchGrade && matchCategorie;
  });

  // Statistiques
  const stats = {
    totalPostes: getAllPostes().length,
    postesDirection: CATEGORIES_POSTES.find(c => c.id === 'direction')?.postes.length || 0,
    postesTechniques: CATEGORIES_POSTES.find(c => c.id === 'technique')?.postes.length || 0,
    postesAdmin: CATEGORIES_POSTES.find(c => c.id === 'administratif')?.postes.length || 0,
    postesOperationnels: CATEGORIES_POSTES.find(c => c.id === 'operationnel')?.postes.length || 0
  };

  const getCategorieIcon = (categorieId: string) => {
    switch (categorieId) {
      case 'direction': return Shield;
      case 'technique': return Settings;
      case 'administratif': return FileText;
      case 'operationnel': return Wrench;
      default: return Briefcase;
    }
  };

  const formatSalaire = (salaire: number) => {
    return new Intl.NumberFormat('fr-FR').format(salaire) + ' FCFA';
  };

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestion des Postes Administratifs
        </h1>
        <p className="text-gray-600">
          Base de connaissances complète des fonctions publiques gabonaises pour la création et gestion des comptes collaborateurs
        </p>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Postes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPostes}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Direction</p>
                <p className="text-3xl font-bold text-gray-900">{stats.postesDirection}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Techniques</p>
                <p className="text-3xl font-bold text-gray-900">{stats.postesTechniques}</p>
              </div>
              <Settings className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Administratifs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.postesAdmin}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Opérationnels</p>
                <p className="text-3xl font-bold text-gray-900">{stats.postesOperationnels}</p>
              </div>
              <Wrench className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="postes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="postes">Tous les Postes</TabsTrigger>
          <TabsTrigger value="categories">Par Catégories</TabsTrigger>
          <TabsTrigger value="grades">Par Grades</TabsTrigger>
          <TabsTrigger value="directions">Directions Standards</TabsTrigger>
          <TabsTrigger value="creation">Créer Compte</TabsTrigger>
        </TabsList>

        {/* Onglet Tous les Postes */}
        <TabsContent value="postes" className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres et Recherche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un poste..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                                 <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                   <SelectTrigger>
                     <SelectValue placeholder="Filtrer par grade" />
                   </SelectTrigger>
                   <SelectContent>
                     {GRADES_FONCTION_PUBLIQUE.map(grade => (
                       <SelectItem key={grade.code} value={grade.code}>
                         {grade.nom}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>

                 <Select value={selectedCategorie} onValueChange={setSelectedCategorie}>
                   <SelectTrigger>
                     <SelectValue placeholder="Filtrer par catégorie" />
                   </SelectTrigger>
                   <SelectContent>
                     {CATEGORIES_POSTES.map(categorie => (
                       <SelectItem key={categorie.id} value={categorie.id}>
                         {categorie.nom}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedGrade('');
                    setSelectedCategorie('');
                  }}
                >
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Liste des postes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPostes.map((poste) => (
              <Card key={poste.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{poste.titre}</CardTitle>
                      <CardDescription className="font-mono text-sm">
                        Code: {poste.code}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      {poste.grade_requis.join(', ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Niveau</p>
                      <p className="font-medium">{poste.niveau}</p>
                    </div>

                    {poste.salaire_base && (
                      <div>
                        <p className="text-sm text-gray-600">Salaire de base</p>
                        <p className="font-medium text-green-600">
                          {formatSalaire(poste.salaire_base)}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-gray-600">Présence</p>
                      <p className="text-sm">{poste.presence}</p>
                    </div>

                    {poste.specialites && (
                      <div>
                        <p className="text-sm text-gray-600">Spécialités</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {poste.specialites.slice(0, 2).map((spec, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                          {poste.specialites.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{poste.specialites.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedPoste(poste)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Détails
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{selectedPoste?.titre}</DialogTitle>
                            <DialogDescription>
                              Code: {selectedPoste?.code} - {selectedPoste?.niveau}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedPoste && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="font-medium text-sm text-gray-600">Grades requis</p>
                                  <div className="flex gap-1 mt-1">
                                    {selectedPoste.grade_requis.map(grade => (
                                      <Badge key={grade}>{grade}</Badge>
                                    ))}
                                  </div>
                                </div>
                                {selectedPoste.salaire_base && (
                                  <div>
                                    <p className="font-medium text-sm text-gray-600">Salaire de base</p>
                                    <p className="text-lg font-bold text-green-600">
                                      {formatSalaire(selectedPoste.salaire_base)}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div>
                                <p className="font-medium text-sm text-gray-600">Présence</p>
                                <p>{selectedPoste.presence}</p>
                              </div>

                              {selectedPoste.description && (
                                <div>
                                  <p className="font-medium text-sm text-gray-600">Description</p>
                                  <p>{selectedPoste.description}</p>
                                </div>
                              )}

                              {selectedPoste.specialites && (
                                <div>
                                  <p className="font-medium text-sm text-gray-600">Spécialités</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {selectedPoste.specialites.map((spec, idx) => (
                                      <Badge key={idx} variant="secondary">{spec}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {selectedPoste.nomination && (
                                <div>
                                  <p className="font-medium text-sm text-gray-600">Mode de nomination</p>
                                  <p>{selectedPoste.nomination}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button size="sm" className="flex-1">
                        <UserPlus className="h-4 w-4 mr-1" />
                        Créer Compte
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPostes.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun poste trouvé
                </h3>
                <p className="text-gray-600">
                  Essayez de modifier vos critères de recherche
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Par Catégories */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid gap-6">
            {CATEGORIES_POSTES.map((categorie) => {
              const IconComponent = getCategorieIcon(categorie.id);
              return (
                <Card key={categorie.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <IconComponent className="h-6 w-6" />
                      {categorie.nom}
                      <Badge variant="outline">{categorie.postes.length} postes</Badge>
                    </CardTitle>
                    <CardDescription>{categorie.description}</CardDescription>
                    <div className="flex gap-2">
                      <span className="text-sm text-gray-600">Grades requis:</span>
                      {categorie.grade_requis.map(grade => (
                        <Badge key={grade} variant="secondary">{grade}</Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categorie.postes.map((poste) => (
                        <div key={poste.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{poste.titre}</h4>
                            <span className="text-xs text-gray-500 font-mono">{poste.code}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{poste.niveau}</p>
                          {poste.salaire_base && (
                            <p className="text-sm font-medium text-green-600">
                              {formatSalaire(poste.salaire_base)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Onglet Par Grades */}
        <TabsContent value="grades" className="space-y-6">
          <div className="grid gap-6">
            {GRADES_FONCTION_PUBLIQUE.map((grade) => {
              const postesGrade = getPostesByGrade(grade.code);
              return (
                <Card key={grade.code}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Award className="h-6 w-6" />
                      {grade.nom}
                      <Badge variant="outline">{postesGrade.length} postes</Badge>
                    </CardTitle>
                    <CardDescription>
                      Salaire de base: {formatSalaire(grade.salaire_base)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {postesGrade.map((poste) => (
                        <div key={poste.id} className="text-center p-3 border rounded">
                          <p className="font-medium text-sm">{poste.titre}</p>
                          <p className="text-xs text-gray-500">{poste.code}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Onglet Directions Standards */}
        <TabsContent value="directions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Directions Centrales Standards</CardTitle>
              <CardDescription>
                Directions qu'on retrouve dans la plupart des ministères gabonais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {DIRECTIONS_CENTRALES.map((direction) => (
                  <div key={direction.sigle} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-lg">{direction.sigle}</h4>
                        <p className="font-medium">{direction.nom}</p>
                        <p className="text-sm text-gray-600">{direction.fonction}</p>
                      </div>
                      <Badge variant="outline">
                        {direction.postes_standards.length} postes standards
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Postes standards:</p>
                      <div className="flex flex-wrap gap-2">
                        {direction.postes_standards.map((code) => (
                          <Badge key={code} variant="secondary">{code}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Création de Compte */}
        <TabsContent value="creation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-6 w-6" />
                Créer un Compte Collaborateur
              </CardTitle>
              <CardDescription>
                Créer un nouveau compte utilisateur basé sur les postes administratifs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-medium">Informations personnelles</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Nom complet</label>
                      <Input placeholder="Prénom Nom" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email professionnel</label>
                      <Input type="email" placeholder="prenom.nom@administration.ga" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Téléphone</label>
                      <Input placeholder="+241 XX XX XX XX" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Affectation administrative</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Administration</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une administration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ministere-sante">Ministère de la Santé</SelectItem>
                          <SelectItem value="ministere-education">Ministère de l'Éducation</SelectItem>
                          <SelectItem value="dgdi">DGDI</SelectItem>
                          <SelectItem value="mairie-libreville">Mairie de Libreville</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Poste</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un poste" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAllPostes().slice(0, 10).map((poste) => (
                            <SelectItem key={poste.id} value={poste.id}>
                              {poste.titre} ({poste.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Grade</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADES_FONCTION_PUBLIQUE.map((grade) => (
                            <SelectItem key={grade.code} value={grade.code}>
                              {grade.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Service/Direction</label>
                      <Input placeholder="Ex: Direction des Ressources Humaines" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
                <Button variant="outline">
                  Annuler
                </Button>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Créer le Compte
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
