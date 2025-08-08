// @ts-nocheck
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Users,
  FileText,
  Target,
  TrendingUp,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  DollarSign,
  Timer,
  Star,
  BookOpen,
  BarChart3,
  Briefcase,
  Award,
  Info
} from 'lucide-react';
// import { OrganismeKnowledge } from '@/lib/data/organismes-knowledge-base';

interface OrganismeKnowledge {
  id: string;
  nom: string;
  type: string;
  statut: string;
  sigle?: string;
  description?: string;
  metadonnees: {
    fiabilite: string;
    derniere_mise_a_jour: string;
    derniere_maj?: string;
    source: string;
    completude?: number;
  };
  services?: any[];
  personnel?: any[];
  budget?: any;
  performances?: any;
  adresse?: {
    ville: string;
    region?: string;
  };
  contact?: {
    telephone: string[];
    email?: string;
  };
  statistiques?: {
    taux_satisfaction: number;
  };
  slogan?: string;
  mission?: string;
  vision?: string;
}

interface OrganismeKnowledgeCardProps {
  organisme: OrganismeKnowledge;
  showFullDetails?: boolean;
}

export function OrganismeKnowledgeCard({
  organisme,
  showFullDetails = false
}: OrganismeKnowledgeCardProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getTypeColor = (type: OrganismeKnowledge['type']) => {
    switch (type) {
      case 'MINISTERE': return 'bg-blue-500';
      case 'DIRECTION_GENERALE': return 'bg-green-500';
      case 'AGENCE': return 'bg-orange-500';
      case 'ETABLISSEMENT_PUBLIC': return 'bg-purple-500';
      case 'ORGANISME_SPECIALISE': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: OrganismeKnowledge['type']) => {
    switch (type) {
      case 'MINISTERE': return 'Ministère';
      case 'DIRECTION_GENERALE': return 'Direction Générale';
      case 'AGENCE': return 'Agence';
      case 'ETABLISSEMENT_PUBLIC': return 'Établissement Public';
      case 'ORGANISME_SPECIALISE': return 'Organisme Spécialisé';
      default: return type;
    }
  };

  const getFiabiliteColor = (fiabilite: string) => {
    switch (fiabilite) {
      case 'HAUTE': return 'text-green-600 bg-green-50';
      case 'MOYENNE': return 'text-yellow-600 bg-yellow-50';
      case 'FAIBLE': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!showFullDetails) {
    // Vue résumée pour les listes
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${getTypeColor(organisme.type)} text-white`}>
                  {getTypeLabel(organisme.type)}
                </Badge>
                <Badge variant="outline" className={getFiabiliteColor(organisme.metadonnees.fiabilite)}>
                  Fiabilité: {organisme.metadonnees.fiabilite}
                </Badge>
              </div>

              <CardTitle className="text-lg">{organisme.nom}</CardTitle>
              <CardDescription className="mt-1">
                {organisme.sigle} • {organisme.description.substring(0, 120)}...
              </CardDescription>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                {organisme.metadonnees.completude}%
              </div>
              <div className="text-xs text-muted-foreground">
                MAJ: {new Date(organisme.metadonnees.derniere_maj).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span>{organisme.adresse.ville}</span>
            </div>

            {organisme.contact.telephone.length > 0 && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-500" />
                <span>{organisme.contact.telephone[0]}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-500" />
              <span>{organisme.services.length} services</span>
            </div>

            {organisme.statistiques && (
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <span>{organisme.statistiques.taux_satisfaction}% satisfaction</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Vue détaillée complète
  return (
    <div className="space-y-6">
      {/* En-tête principal */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Building2 className="h-8 w-8 text-blue-500" />
                <div>
                  <h1 className="text-2xl font-bold">{organisme.nom}</h1>
                  <p className="text-muted-foreground">{organisme.sigle}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={`${getTypeColor(organisme.type)} text-white`}>
                  {getTypeLabel(organisme.type)}
                </Badge>
                <Badge variant="outline" className={getFiabiliteColor(organisme.metadonnees.fiabilite)}>
                  Fiabilité: {organisme.metadonnees.fiabilite}
                </Badge>
                <Badge variant="outline">
                  Complétude: {organisme.metadonnees.completude}%
                </Badge>
              </div>

              {organisme.slogan && (
                <p className="text-lg font-medium italic text-blue-600 mb-2">
                  "{organisme.slogan}"
                </p>
              )}

              <p className="text-muted-foreground leading-relaxed">
                {organisme.description}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Onglets pour organiser l'information */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="organisation">Organisation</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="projets">Projets</TabsTrigger>
        </TabsList>

        {/* Onglet Général */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Mission et Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Mission</h4>
                <p className="text-muted-foreground leading-relaxed">{organisme.mission}</p>
              </div>

              {organisme.vision && (
                <div>
                  <h4 className="font-semibold mb-2">Vision</h4>
                  <p className="text-muted-foreground leading-relaxed">{organisme.vision}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {organisme.historique && organisme.historique.length > 0 && (
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Card className="cursor-pointer hover:bg-gray-50">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Historique
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </CardTitle>
                  </CardHeader>
                </Card>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {organisme.historique.map((event, index) => (
                        <div key={index} className="flex gap-3 border-l-2 border-blue-200 pl-4">
                          <div className="flex-shrink-0">
                            <Badge variant="outline">{event.date}</Badge>
                          </div>
                          <p className="text-sm">{event.evenement}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          )}
        </TabsContent>

        {/* Onglet Services */}
        <TabsContent value="services" className="space-y-4">
          <div className="grid gap-4">
            {organisme.services.map((service, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{service.nom}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{service.code}</Badge>
                    <Badge variant="outline" className="text-green-600">
                      {service.cout}
                    </Badge>
                    <Badge variant="outline" className="text-blue-600">
                      {service.duree_traitement}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        <span className="text-sm">Voir les détails</span>
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-3">
                      <div>
                        <h5 className="font-semibold mb-2">Documents requis:</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {service.documents_requis.map((doc, docIndex) => (
                            <li key={docIndex}>{doc}</li>
                          ))}
                        </ul>
                      </div>

                      {service.modalites && (
                        <div>
                          <h5 className="font-semibold mb-2">Modalités:</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {service.modalites.map((modalite, modaliteIndex) => (
                              <li key={modaliteIndex}>{modalite}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {service.beneficiaires && (
                        <div>
                          <h5 className="font-semibold mb-2">Bénéficiaires:</h5>
                          <div className="flex flex-wrap gap-1">
                            {service.beneficiaires.map((beneficiaire, benefIndex) => (
                              <Badge key={benefIndex} variant="secondary">{beneficiaire}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Onglet Contact */}
        <TabsContent value="contact" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Adresse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>{organisme.adresse.siege}</p>
                  {organisme.adresse.quartier && <p>{organisme.adresse.quartier}</p>}
                  <p>{organisme.adresse.ville}</p>
                  {organisme.adresse.codePostal && <p>{organisme.adresse.codePostal}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h5 className="font-semibold mb-1">Téléphones:</h5>
                  {organisme.contact.telephone.map((tel, index) => (
                    <p key={index} className="text-sm">{tel}</p>
                  ))}
                </div>

                {organisme.contact.email.length > 0 && (
                  <div>
                    <h5 className="font-semibold mb-1">Emails:</h5>
                    {organisme.contact.email.map((email, index) => (
                      <p key={index} className="text-sm">{email}</p>
                    ))}
                  </div>
                )}

                {organisme.contact.siteWeb && (
                  <div>
                    <h5 className="font-semibold mb-1">Site web:</h5>
                    <p className="text-sm text-blue-600">{organisme.contact.siteWeb}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Horaires */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horaires d'ouverture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {Object.entries(organisme.horaires).map(([jour, horaire]) => (
                  horaire && (
                    <div key={jour} className="flex justify-between">
                      <span className="capitalize font-medium">{jour}:</span>
                      <span>{horaire.debut} - {horaire.fin}</span>
                    </div>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Organisation */}
        <TabsContent value="organisation" className="space-y-4">
          {/* Dirigeants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Direction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {organisme.dirigeants.map((dirigeant, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{dirigeant.poste}</p>
                      {dirigeant.nom && <p className="text-sm text-muted-foreground">{dirigeant.nom}</p>}
                    </div>
                    {dirigeant.depuis && (
                      <Badge variant="outline">Depuis {dirigeant.depuis}</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Départements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Structure organisationnelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {organisme.departements.map((dept, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{dept.nom}</h4>
                      {dept.responsable && (
                        <Badge variant="outline">{dept.responsable}</Badge>
                      )}
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {dept.missions.map((mission, missionIndex) => (
                        <li key={missionIndex}>{mission}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Performance */}
        <TabsContent value="performance" className="space-y-4">
          {organisme.statistiques && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Demandes/mois</p>
                      <p className="text-2xl font-bold">{organisme.statistiques.demandes_traitees_par_mois?.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
                      <p className="text-2xl font-bold">{organisme.statistiques.taux_satisfaction}%</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Délai moyen</p>
                      <p className="text-2xl font-bold">{organisme.statistiques.delai_moyen_traitement}</p>
                    </div>
                    <Timer className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Couverture</p>
                      <p className="text-lg font-bold">{organisme.statistiques.couverture_nationale}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {organisme.effectifs && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Effectifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{organisme.effectifs.total}</p>
                    <p className="text-muted-foreground">Total</p>
                  </div>
                  {organisme.effectifs.cadres && (
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{organisme.effectifs.cadres}</p>
                      <p className="text-muted-foreground">Cadres</p>
                    </div>
                  )}
                  {organisme.effectifs.agentsExecutions && (
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{organisme.effectifs.agentsExecutions}</p>
                      <p className="text-muted-foreground">Agents d'exécution</p>
                    </div>
                  )}
                  {organisme.effectifs.contractuels && (
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{organisme.effectifs.contractuels}</p>
                      <p className="text-muted-foreground">Contractuels</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Projets */}
        <TabsContent value="projets" className="space-y-4">
          {organisme.projets_en_cours && organisme.projets_en_cours.length > 0 ? (
            <div className="space-y-4">
              {organisme.projets_en_cours.map((projet, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{projet.nom}</span>
                      {projet.echeance && (
                        <Badge variant="outline" className="text-blue-600">
                          Échéance: {projet.echeance}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{projet.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {projet.budget && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Budget: {projet.budget}</span>
                        </div>
                      )}

                      {projet.partenaires && projet.partenaires.length > 0 && (
                        <div>
                          <h5 className="font-semibold mb-2">Partenaires:</h5>
                          <div className="flex flex-wrap gap-1">
                            {projet.partenaires.map((partenaire, partIndex) => (
                              <Badge key={partIndex} variant="secondary">{partenaire}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucun projet en cours répertorié</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Métadonnées */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="text-sm">Informations sur les données</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <p>Dernière mise à jour: {new Date(organisme.metadonnees.derniere_maj).toLocaleDateString()}</p>
          <p>Sources: {organisme.metadonnees.sources.join(', ')}</p>
          <p>Complétude: {organisme.metadonnees.completude}% • Fiabilité: {organisme.metadonnees.fiabilite}</p>
        </CardContent>
      </Card>
    </div>
  );
}
