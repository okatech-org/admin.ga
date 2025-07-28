/* @ts-nocheck */
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  Building2, 
  Users, 
  ArrowRight,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  Shield,
  Heart,
  TrendingUp,
  Anchor,
  GraduationCap,
  Receipt,
  Scale,
  Car,
  Cross,
  Stethoscope,
  Briefcase,
  Home,
  Truck,
  Hammer,
  Search as SearchIcon,
  Wheat,
  Leaf,
  Trees,
  Palette,
  Radio,
  Building,
  Gavel,
  Filter,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

export default function OrganismesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tous');

  // 28 Organismes publics gabonais avec détails complets
  const organismes = [
    // Ministères Régaliens
    {
      code: 'DGDI',
      nom: 'Direction Générale de la Documentation et de l\'Immigration',
      categorie: 'regalien',
      description: 'Gestion des documents d\'identité, passeports et immigration',
      icon: Shield,
      color: 'bg-blue-600',
      services: 15,
      adresse: 'Boulevard Triomphal Omar Bongo, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@dgdi.ga',
      horaires: 'Lun-Ven: 7h30-15h30',
      servicesPopulaires: ['CNI', 'Passeport', 'Visa', 'Permis de séjour'],
      satisfaction: 85
    },
    {
      code: 'MIN_JUS',
      nom: 'Ministère de la Justice',
      categorie: 'regalien',
      description: 'Administration de la justice, légalisations et casier judiciaire',
      icon: Scale,
      color: 'bg-purple-600',
      services: 12,
      adresse: 'Avenue du Colonel Parant, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@justice.ga',
      horaires: 'Lun-Ven: 7h30-15h30',
      servicesPopulaires: ['Casier judiciaire', 'Légalisation', 'Apostille'],
      satisfaction: 78
    },
    {
      code: 'MIN_INT',
      nom: 'Ministère de l\'Intérieur',
      categorie: 'regalien',
      description: 'Sécurité intérieure et administration territoriale',
      icon: Building2,
      color: 'bg-gray-700',
      services: 8,
      adresse: 'Avenue Bouët, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@interieur.ga',
      horaires: 'Lun-Ven: 7h30-15h30',
      servicesPopulaires: ['Autorisation de manifestation', 'Sécurité'],
      satisfaction: 72
    },
    {
      code: 'MIN_DEF',
      nom: 'Ministère de la Défense',
      categorie: 'regalien',
      description: 'Défense nationale et service militaire',
      icon: Shield,
      color: 'bg-green-800',
      services: 5,
      adresse: 'Quartier militaire, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@defense.ga',
      horaires: 'Lun-Ven: 7h30-15h30',
      servicesPopulaires: ['Service national', 'Anciens combattants'],
      satisfaction: 80
    },

    // Services Sociaux
    {
      code: 'CNSS',
      nom: 'Caisse Nationale de Sécurité Sociale',
      categorie: 'social',
      description: 'Sécurité sociale, retraites et allocations familiales',
      icon: Heart,
      color: 'bg-green-600',
      services: 14,
      adresse: 'Boulevard de l\'Indépendance, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@cnss.ga',
      horaires: 'Lun-Ven: 7h30-16h00',
      servicesPopulaires: ['Immatriculation', 'Pension', 'Allocations'],
      satisfaction: 82
    },
    {
      code: 'CNAMGS',
      nom: 'Caisse Nationale d\'Assurance Maladie',
      categorie: 'social',
      description: 'Assurance maladie universelle et soins de santé',
      icon: Stethoscope,
      color: 'bg-red-600',
      services: 10,
      adresse: 'Immeuble CNAMGS, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@cnamgs.ga',
      horaires: 'Lun-Ven: 7h30-16h00',
      servicesPopulaires: ['Carte CNAMGS', 'Remboursement', 'Soins'],
      satisfaction: 75
    },
    {
      code: 'MIN_SANTE',
      nom: 'Ministère de la Santé',
      categorie: 'social',
      description: 'Politiques de santé publique et hôpitaux',
      icon: Cross,
      color: 'bg-red-500',
      services: 11,
      adresse: 'Ministère de la Santé, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@sante.ga',
      horaires: 'Lun-Ven: 7h30-15h30',
      servicesPopulaires: ['Certificat médical', 'Vaccination', 'Urgences'],
      satisfaction: 79
    },
    {
      code: 'MIN_AFFAIRES_SOCIALES',
      nom: 'Ministère des Affaires Sociales',
      categorie: 'social',
      description: 'Protection sociale et aide aux familles',
      icon: Users,
      color: 'bg-pink-600',
      services: 9,
      adresse: 'Boulevard Triomphal, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@affaires-sociales.ga',
      horaires: 'Lun-Ven: 7h30-15h30',
      servicesPopulaires: ['Aide sociale', 'Protection enfance'],
      satisfaction: 77
    },

    // Éducation et Formation
    {
      code: 'MIN_EDUC',
      nom: 'Ministère de l\'Éducation Nationale',
      categorie: 'education',
      description: 'Enseignement primaire, secondaire et diplômes',
      icon: GraduationCap,
      color: 'bg-indigo-600',
      services: 13,
      adresse: 'Ministère de l\'Éducation, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@education.ga',
      horaires: 'Lun-Ven: 7h30-15h30',
      servicesPopulaires: ['Relevé de notes', 'Diplômes', 'Inscription'],
      satisfaction: 81
    },
    {
      code: 'MIN_ENS_SUP',
      nom: 'Ministère de l\'Enseignement Supérieur',
      categorie: 'education',
      description: 'Universités, recherche et enseignement supérieur',
      icon: GraduationCap,
      color: 'bg-blue-700',
      services: 7,
      adresse: 'Cité Universitaire, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@enseignement-superieur.ga',
      horaires: 'Lun-Ven: 7h30-15h30',
      servicesPopulaires: ['Équivalence', 'Bourse', 'Inscription'],
      satisfaction: 83
    },
    {
      code: 'MIN_FORMATION_PROF',
      nom: 'Ministère de la Formation Professionnelle',
      categorie: 'education',
      description: 'Formation technique et apprentissage professionnel',
      icon: GraduationCap,
      color: 'bg-yellow-600',
      services: 6,
      adresse: 'Centre de Formation, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@formation-pro.ga',
      horaires: 'Lun-Ven: 7h30-15h30',
      servicesPopulaires: ['Certificat pro', 'Formation', 'Stage'],
      satisfaction: 78
    },

    // Économie et Commerce
    {
      code: 'MIN_ECONOMIE',
      nom: 'Ministère de l\'Économie',
      categorie: 'economie',
      description: 'Politique économique, commerce et entreprises',
      icon: TrendingUp,
      color: 'bg-emerald-600',
      services: 15,
      adresse: 'Immeuble Ministériel, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@economie.ga',
      horaires: 'Lun-Ven: 7h30-15h30',
      servicesPopulaires: ['Création entreprise', 'Commerce', 'Export'],
      satisfaction: 84
    },
    {
      code: 'DGI',
      nom: 'Direction Générale des Impôts',
      categorie: 'economie',
      description: 'Administration fiscale et recouvrement des impôts',
      icon: Receipt,
      color: 'bg-amber-600',
      services: 12,
      adresse: 'Immeuble DGI, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@impots.ga',
      horaires: 'Lun-Ven: 7h30-16h00',
      servicesPopulaires: ['Déclaration impôts', 'Quitus fiscal', 'TVA'],
      satisfaction: 76
    },
    {
      code: 'DOUANES',
      nom: 'Direction Générale des Douanes',
      categorie: 'economie',
      description: 'Commerce international, transit et dédouanement',
      icon: Truck,
      color: 'bg-blue-800',
      services: 8,
      adresse: 'Port de Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@douanes.ga',
      horaires: 'Lun-Ven: 7h30-17h00',
      servicesPopulaires: ['Dédouanement', 'Transit', 'Export'],
      satisfaction: 79
    },
    {
      code: 'ANPI',
      nom: 'Agence Nationale de Promotion des Investissements',
      categorie: 'economie',
      description: 'Promotion des investissements et zones économiques',
      icon: Building,
      color: 'bg-teal-600',
      services: 6,
      adresse: 'Zone Franche, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@anpi.ga',
      horaires: 'Lun-Ven: 8h00-17h00',
      servicesPopulaires: ['Investissement', 'Zone franche', 'Projet'],
      satisfaction: 86
    },

    // Transport et Infrastructure
    {
      code: 'MIN_TRANSPORT',
      nom: 'Ministère des Transports',
      categorie: 'transport',
      description: 'Permis de conduire, véhicules et transport public',
      icon: Car,
      color: 'bg-orange-600',
      services: 11,
      adresse: 'Ministère des Transports, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@transports.ga',
      horaires: 'Lun-Ven: 7h30-15h30',
      servicesPopulaires: ['Permis conduire', 'Carte grise', 'Visite technique'],
      satisfaction: 73
    },
    {
      code: 'MIN_EQUIPEMENT',
      nom: 'Ministère des Équipements',
      categorie: 'transport',
      description: 'Travaux publics et infrastructure routière',
      icon: Hammer,
      color: 'bg-stone-600',
      services: 7,
      adresse: 'Ministère Équipements, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@equipements.ga',
      horaires: 'Lun-Ven: 7h30-15h30',
      servicesPopulaires: ['Travaux publics', 'Routes', 'Infrastructure'],
      satisfaction: 71
    },
    {
      code: 'MIN_HABITAT',
      nom: 'Ministère de l\'Habitat',
      categorie: 'transport',
      description: 'Logement, urbanisme et permis de construire',
      icon: Home,
      color: 'bg-lime-600',
      services: 9,
      adresse: 'Ministère Habitat, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@habitat.ga',
      horaires: 'Lun-Ven: 7h30-15h30',
      servicesPopulaires: ['Permis construire', 'Logement', 'Urbanisme'],
      satisfaction: 74
    },

    // Emploi et Travail
    {
      code: 'MIN_TRAVAIL',
      nom: 'Ministère du Travail',
      categorie: 'emploi',
      description: 'Relations de travail et droit du travail',
      icon: Briefcase,
      color: 'bg-cyan-600',
      services: 10,
      adresse: 'Ministère du Travail, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@travail.ga',
      horaires: 'Lun-Ven: 7h30-15h30',
      servicesPopulaires: ['Contrat travail', 'Médiation', 'Inspection'],
      satisfaction: 76
    },
    {
      code: 'ANPE',
      nom: 'Agence Nationale Pour l\'Emploi',
      categorie: 'emploi',
      description: 'Recherche d\'emploi et insertion professionnelle',
      icon: SearchIcon,
      color: 'bg-violet-600',
      services: 8,
      adresse: 'Centre ANPE, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@anpe.ga',
      horaires: 'Lun-Ven: 7h30-16h00',
      servicesPopulaires: ['Recherche emploi', 'CV', 'Formation'],
      satisfaction: 82
    },

    // Environnement et Agriculture
    {
      code: 'MIN_ENVIRONNEMENT',
      nom: 'Ministère de l\'Environnement',
      categorie: 'environnement',
      description: 'Protection environnementale et écologie',
      icon: Leaf,
      color: 'bg-green-700',
      services: 6,
      adresse: 'Ministère Environnement, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@environnement.ga',
      horaires: 'Lun-Ven: 7h30-15h30',
      servicesPopulaires: ['Étude impact', 'Autorisation', 'Écologie'],
      satisfaction: 80
    },
    {
      code: 'MIN_EAUX_FORETS',
      nom: 'Ministère des Eaux et Forêts',
      categorie: 'environnement',
      description: 'Gestion des ressources forestières et aquatiques',
      icon: Trees,
      color: 'bg-emerald-700',
      services: 5,
      adresse: 'Ministère Eaux-Forêts, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@eaux-forets.ga',
      horaires: 'Lun-Ven: 7h30-15h30',
      servicesPopulaires: ['Exploitation forestière', 'Pêche', 'Environnement'],
      satisfaction: 77
    },
    {
      code: 'MIN_AGRICULTURE',
      nom: 'Ministère de l\'Agriculture',
      categorie: 'environnement',
      description: 'Agriculture, élevage et développement rural',
      icon: Wheat,
      color: 'bg-yellow-700',
      services: 8,
      adresse: 'Ministère Agriculture, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@agriculture.ga',
      horaires: 'Lun-Ven: 7h30-15h30',
      servicesPopulaires: ['Subvention agricole', 'Élevage', 'Rural'],
      satisfaction: 75
    },

    // Culture et Communication
    {
      code: 'MIN_COMMUNICATION',
      nom: 'Ministère de la Communication',
      categorie: 'culture',
      description: 'Médias, télécommunications et numérique',
      icon: Radio,
      color: 'bg-purple-700',
      services: 5,
      adresse: 'Ministère Communication, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@communication.ga',
      horaires: 'Lun-Ven: 7h30-15h30',
      servicesPopulaires: ['Licence média', 'Télécoms', 'Numérique'],
      satisfaction: 78
    },
    {
      code: 'MIN_CULTURE',
      nom: 'Ministère de la Culture',
      categorie: 'culture',
      description: 'Arts, patrimoine culturel et tourisme',
      icon: Palette,
      color: 'bg-rose-600',
      services: 6,
      adresse: 'Ministère Culture, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@culture.ga',
      horaires: 'Lun-Ven: 7h30-15h30',
      servicesPopulaires: ['Patrimoine', 'Arts', 'Tourisme'],
      satisfaction: 81
    },

    // Administrations Locales
    {
      code: 'MAIRE_LBV',
      nom: 'Mairie de Libreville',
      categorie: 'local',
      description: 'Services municipaux et état civil de la capitale',
      icon: Building2,
      color: 'bg-blue-500',
      services: 18,
      adresse: 'Hôtel de Ville, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@mairie-libreville.ga',
      horaires: 'Lun-Ven: 7h00-15h00',
      servicesPopulaires: ['État civil', 'Permis construire', 'Taxes'],
      satisfaction: 79
    },
    {
      code: 'MAIRE_PG',
      nom: 'Mairie de Port-Gentil',
      categorie: 'local',
      description: 'Services municipaux de la capitale économique',
      icon: Anchor,
      color: 'bg-blue-600',
      services: 14,
      adresse: 'Hôtel de Ville, Port-Gentil',
      telephone: '+241 01 XX XX XX',
      email: 'contact@mairie-portgentil.ga',
      horaires: 'Lun-Ven: 7h00-15h00',
      servicesPopulaires: ['État civil', 'Commerce', 'Port'],
      satisfaction: 77
    },

    // Institutions Juridiques
    {
      code: 'CONSEIL_ETAT',
      nom: 'Conseil d\'État',
      categorie: 'juridique',
      description: 'Juridiction administrative suprême',
      icon: Gavel,
      color: 'bg-gray-800',
      services: 4,
      adresse: 'Palais de Justice, Libreville',
      telephone: '+241 01 XX XX XX',
      email: 'contact@conseil-etat.ga',
      horaires: 'Lun-Ven: 8h00-16h00',
      servicesPopulaires: ['Contentieux administratif', 'Recours'],
      satisfaction: 85
    }
  ];

  // Catégories d'organismes
  const categories = [
    { id: 'tous', nom: 'Tous les Organismes', count: 28 },
    { id: 'regalien', nom: 'Ministères Régaliens', count: 4 },
    { id: 'social', nom: 'Services Sociaux', count: 4 },
    { id: 'education', nom: 'Éducation & Formation', count: 3 },
    { id: 'economie', nom: 'Économie & Commerce', count: 4 },
    { id: 'transport', nom: 'Transport & Infrastructure', count: 3 },
    { id: 'emploi', nom: 'Emploi & Travail', count: 2 },
    { id: 'environnement', nom: 'Environnement & Agriculture', count: 3 },
    { id: 'culture', nom: 'Culture & Communication', count: 2 },
    { id: 'local', nom: 'Administrations Locales', count: 2 },
    { id: 'juridique', nom: 'Institutions Juridiques', count: 1 }
  ];

  const handleSearch = () => {
    // Logique de recherche
  };

  const filteredOrganismes = organismes.filter(org => {
    const matchesSearch = org.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'tous' || org.categorie === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getSatisfactionColor = (satisfaction: number) => {
    if (satisfaction >= 85) return 'text-green-600';
    if (satisfaction >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSatisfactionText = (satisfaction: number) => {
    if (satisfaction >= 85) return 'Excellent';
    if (satisfaction >= 75) return 'Bon';
    return 'À améliorer';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Organismes Publics</h1>
              <p className="text-lg text-gray-600 mt-2">
                Découvrez les 28 administrations gabonaises et leurs services
              </p>
            </div>
            <Button asChild>
              <Link href="/demarche">
                ← Retour à l'accueil
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Filtres et Recherche */}
      <section className="bg-white py-8 px-4 sm:px-6 lg:px-8 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Rechercher un organisme ou service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-md bg-white text-sm"
                title="Filtrer par catégorie"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nom} ({cat.count})
                  </option>
                ))}
              </select>
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">28</div>
              <div className="text-sm text-gray-600">Organismes publics</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">280+</div>
              <div className="text-sm text-gray-600">Services disponibles</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">11</div>
              <div className="text-sm text-gray-600">Catégories</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">78%</div>
              <div className="text-sm text-gray-600">Satisfaction moyenne</div>
            </div>
          </div>
        </div>
      </section>

      {/* Liste des Organismes */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="text-gray-600">
              {filteredOrganismes.length} organisme(s) trouvé(s)
              {selectedCategory !== 'tous' && ` dans la catégorie "${categories.find(c => c.id === selectedCategory)?.nom}"`}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredOrganismes.map((organisme) => (
              <Card key={organisme.code} className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 ${organisme.color} rounded-lg flex items-center justify-center`}>
                        <organisme.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{organisme.nom}</CardTitle>
                        <CardDescription className="text-base">{organisme.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-4">
                      {organisme.services} services
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Services populaires */}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Services populaires :</h4>
                    <div className="flex flex-wrap gap-2">
                      {organisme.servicesPopulaires.map((service, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Informations pratiques */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-xs">{organisme.adresse}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-xs">{organisme.horaires}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-xs">{organisme.telephone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-xs">{organisme.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Satisfaction et actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Satisfaction :</span>
                      <span className={`font-semibold ${getSatisfactionColor(organisme.satisfaction)}`}>
                        {organisme.satisfaction}% ({getSatisfactionText(organisme.satisfaction)})
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/demarche/organisme/${organisme.code.toLowerCase()}`}>
                          Voir les services
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOrganismes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun organisme trouvé</h3>
              <p className="text-gray-600">
                Essayez avec d'autres termes de recherche ou changez de catégorie.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('tous');
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Prêt à démarrer vos démarches ?</h2>
          <p className="text-xl mb-8 opacity-90">
            Accédez directement aux services de ces organismes depuis DEMARCHE.GA
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="text-blue-600 bg-white hover:bg-gray-100" asChild>
              <Link href="/demarche/services">
                <FileText className="w-5 h-5 mr-2" />
                Parcourir tous les services
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-blue-600 bg-white hover:bg-gray-100" asChild>
              <Link href="/auth/inscription">
                <Users className="w-5 h-5 mr-2" />
                Créer un compte citoyen
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 