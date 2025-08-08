'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Users, Building2, Award, Phone, Mail, MapPin, Globe } from 'lucide-react';
import {
  implementerSystemeComplet,
  SystemeComplet,
  OrganismePublic,
  UtilisateurOrganisme,
  PosteAdministratif
} from '@/lib/data/systeme-complet-gabon';

export default function SystemeCompletViewer() {
  const [systeme, setSysteme] = useState<SystemeComplet | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrganisme, setSelectedOrganisme] = useState<OrganismePublic | null>(null);
  const [activeTab, setActiveTab] = useState('organismes');

  useEffect(() => {
    const chargerSysteme = async () => {
      try {
        const data = await implementerSystemeComplet();
        setSysteme(data);
      } catch (error) {
        console.error('Erreur lors du chargement du système:', error);
      } finally {
        setLoading(false);
      }
    };

    chargerSysteme();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement du système...</p>
        </div>
      </div>
    );
  }

  if (!systeme) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-destructive">Erreur lors du chargement du système</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredOrganismes = systeme.organismes.filter(org =>
    org.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUsersForOrganisme = (organismeCode: string) => {
    return systeme.utilisateurs.filter(user => user.organisme_code === organismeCode);
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'INSTITUTION_SUPREME': 'bg-purple-500',
      'MINISTERE': 'bg-blue-500',
      'DIRECTION_GENERALE': 'bg-green-500',
      'ETABLISSEMENT_PUBLIC': 'bg-yellow-500',
      'ENTREPRISE_PUBLIQUE': 'bg-orange-500',
      'ETABLISSEMENT_SANTE': 'bg-red-500',
      'UNIVERSITE': 'bg-indigo-500',
      'GOUVERNORAT': 'bg-teal-500',
      'PREFECTURE': 'bg-cyan-500',
      'MAIRIE': 'bg-pink-500',
      'AUTORITE_REGULATION': 'bg-emerald-500',
      'FORCE_SECURITE': 'bg-gray-500'
    };
    return colors[type] || 'bg-gray-400';
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'destructive';
      case 'USER': return 'default';
      case 'RECEPTIONIST': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Organismes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systeme.statistiques.totalOrganismes}</div>
            <p className="text-xs text-muted-foreground">organismes publics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systeme.statistiques.totalUtilisateurs}</div>
            <p className="text-xs text-muted-foreground">comptes créés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Postes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systeme.postes.length}</div>
            <p className="text-xs text-muted-foreground">types de postes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Couverture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">avec admin & réception</p>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="search"
          placeholder="Rechercher un organisme ou un utilisateur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="organismes">Organismes</TabsTrigger>
          <TabsTrigger value="utilisateurs">Utilisateurs</TabsTrigger>
          <TabsTrigger value="postes">Postes</TabsTrigger>
        </TabsList>

        {/* Tab Organismes */}
        <TabsContent value="organismes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrganismes.map((org) => (
              <Card
                key={org.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedOrganisme(org)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{org.nom}</CardTitle>
                      <CardDescription>{org.code}</CardDescription>
                    </div>
                    <Badge className={getTypeColor(org.type)}>
                      {org.type.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {org.email_contact && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{org.email_contact}</span>
                    </div>
                  )}
                  {org.telephone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3" />
                      <span>{org.telephone}</span>
                    </div>
                  )}
                  {org.adresse && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{org.adresse}</span>
                    </div>
                  )}
                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span className="text-sm font-medium">
                        {getUsersForOrganisme(org.code).length} utilisateurs
                      </span>
                    </div>
                    {org.statut === 'ACTIF' ? (
                      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>
                    ) : (
                      <Badge variant="secondary">Inactif</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab Utilisateurs */}
        <TabsContent value="utilisateurs">
          <Card>
            <CardHeader>
              <CardTitle>Liste des Utilisateurs</CardTitle>
              <CardDescription>
                {systeme.statistiques.totalUtilisateurs} utilisateurs répartis dans {systeme.statistiques.totalOrganismes} organismes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {systeme.utilisateurs
                    .filter(user =>
                      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.email.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {user.prenom[0]}{user.nom[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {user.titre_honorifique} {user.prenom} {user.nom}
                            </div>
                            <div className="text-sm text-muted-foreground">{user.poste_titre}</div>
                            <div className="flex items-center gap-4 text-xs">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {user.email}
                              </span>
                              {user.telephone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {user.telephone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role}
                          </Badge>
                          <Badge variant="outline">
                            {user.organisme_code}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Postes */}
        <TabsContent value="postes">
          <Card>
            <CardHeader>
              <CardTitle>Postes Administratifs</CardTitle>
              <CardDescription>
                {systeme.postes.length} types de postes définis dans le système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {systeme.postes.map((poste) => (
                    <div key={poste.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{poste.titre}</h3>
                          <p className="text-sm text-muted-foreground">Code: {poste.code}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Niveau {poste.niveau}</Badge>
                          {poste.salaire_base && (
                            <Badge variant="secondary">
                              {(poste.salaire_base / 1000).toFixed(0)}k FCFA
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="font-medium">Grades requis:</span> {poste.grade_requis.join(', ')}
                        </div>
                        <div>
                          <span className="font-medium">Responsabilités:</span> {poste.responsabilites.join(', ')}
                        </div>
                        <div>
                          <span className="font-medium">Prérequis:</span> {poste.prerequis.join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal détails organisme */}
      {selectedOrganisme && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedOrganisme(null)}>
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedOrganisme.nom}</CardTitle>
                  <CardDescription>{selectedOrganisme.code}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedOrganisme(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <Badge className={getTypeColor(selectedOrganisme.type)}>
                    {selectedOrganisme.type.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Statut</p>
                  <Badge
                    variant={selectedOrganisme.statut === 'ACTIF' ? 'default' : 'secondary'}
                    className={selectedOrganisme.statut === 'ACTIF' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                  >
                    {selectedOrganisme.statut}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                {selectedOrganisme.email_contact && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{selectedOrganisme.email_contact}</span>
                  </div>
                )}
                {selectedOrganisme.telephone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{selectedOrganisme.telephone}</span>
                  </div>
                )}
                {selectedOrganisme.adresse && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedOrganisme.adresse}</span>
                  </div>
                )}
                {selectedOrganisme.site_web && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a href={selectedOrganisme.site_web} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {selectedOrganisme.site_web}
                    </a>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-2">Utilisateurs ({getUsersForOrganisme(selectedOrganisme.code).length})</h4>
                <div className="space-y-2">
                  {getUsersForOrganisme(selectedOrganisme.code).map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {user.prenom[0]}{user.nom[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.prenom} {user.nom}</p>
                          <p className="text-xs text-muted-foreground">{user.poste_titre}</p>
                        </div>
                      </div>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
