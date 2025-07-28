/* @ts-nocheck */
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  CreditCard, 
  Building2, 
  Users, 
  Scale, 
  Briefcase,
  Heart,
  Home,
  ArrowRight,
  MapPin,
  Clock,
  Star,
  Phone,
  Mail,
  User,
  Lock,
  Settings,
  BarChart3,
  UserCheck,
  Calendar,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { getAllAdministrations } from '@/lib/data/gabon-administrations';
import { getAllServices, getServicesByOrganisme, getOrganismeMapping } from '@/lib/data/gabon-services-detailles';

export default function OrganismeHomePage() {
  const params = useParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [organismeData, setOrganismeData] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const organismeCode = params?.organisme as string;

  useEffect(() => {
    if (organismeCode) {
      loadOrganismeData();
    }
  }, [organismeCode]);

  const loadOrganismeData = () => {
    try {
      const administrations = getAllAdministrations();
      const organismeMapping = getOrganismeMapping();
      const allServices = getAllServices();

      // Trouver l'organisme par son code
      const organisme = administrations.find(admin => 
        admin.code?.toLowerCase() === organismeCode.toLowerCase() ||
        admin.nom.toLowerCase().includes(organismeCode.toLowerCase())
      );

      if (!organisme) {
        router.push('/404');
        return;
      }

      // Récupérer les services de cet organisme
      const organismeServices = allServices.filter(service => 
        service.organisme_responsable === organisme.code ||
        service.organisme_responsable === organismeCode.toUpperCase()
      );

      setOrganismeData({
        ...organisme,
        code: organisme.code || organismeCode.toUpperCase(),
        description: getOrganismeDescription(organisme.nom),
        contact: getOrganismeContact(organisme.code || organismeCode),
        stats: getOrganismeStats(organismeServices.length)
      });

      setServices(organismeServices);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setLoading(false);
    }
  };

  const getOrganismeDescription = (nom: string) => {
    const descriptions = {
      'Direction Générale de la Documentation et de l\'Immigration': 'La DGDI est responsable de la délivrance des documents d\'identité, passeports et de la gestion de l\'immigration au Gabon.',
      'Caisse Nationale de Sécurité Sociale': 'La CNSS gère la sécurité sociale des travailleurs gabonais, les pensions de retraite et les prestations familiales.',
      'Caisse Nationale d\'Assurance Maladie et de Garantie Sociale': 'La CNAMGS assure la couverture maladie universelle et garantit l\'accès aux soins de santé pour tous les Gabonais.',
      'default': `${nom} offre des services administratifs essentiels aux citoyens gabonais.`
    };
    return descriptions[nom] || descriptions.default;
  };

  const getOrganismeContact = (code: string) => {
    const contacts = {
      'DGDI': { 
        telephone: '+241 01 76 54 32', 
        email: 'contact@dgdi.ga', 
        adresse: 'Avenue Bouët, Libreville',
        horaires: 'Lun-Ven: 7h30-15h30'
      },
      'CNSS': { 
        telephone: '+241 01 98 76 54', 
        email: 'info@cnss.ga', 
        adresse: 'Boulevard Triomphal, Libreville',
        horaires: 'Lun-Ven: 7h30-15h00'
      },
      'CNAMGS': { 
        telephone: '+241 01 11 22 33', 
        email: 'accueil@cnamgs.ga', 
        adresse: 'Quartier Louis, Libreville',
        horaires: 'Lun-Ven: 8h00-16h00'
      },
      'default': { 
        telephone: '+241 01 XX XX XX', 
        email: `contact@${code.toLowerCase()}.ga`, 
        adresse: 'Libreville, Gabon',
        horaires: 'Lun-Ven: 8h00-15h00'
      }
    };
    return contacts[code] || contacts.default;
  };

  const getOrganismeStats = (nombreServices: number) => {
    return {
      services: nombreServices,
      demandes_mois: 850 + (nombreServices * 50),
      satisfaction: 85 + (nombreServices % 10),
      agents: Math.floor(nombreServices * 2.5) + 10
    };
  };

  const getOrganismeTheme = (code: string) => {
    const themes = {
      'DGDI': { primary: 'blue', secondary: 'indigo', accent: 'sky' },
      'CNSS': { primary: 'green', secondary: 'emerald', accent: 'teal' },
      'CNAMGS': { primary: 'red', secondary: 'rose', accent: 'pink' },
      'MIN_JUS': { primary: 'purple', secondary: 'violet', accent: 'indigo' },
      'default': { primary: 'gray', secondary: 'slate', accent: 'zinc' }
    };
    return themes[code] || themes.default;
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/${organismeCode}/recherche?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogin = () => {
    router.push(`/${organismeCode}/auth/connexion`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!organismeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Organisme non trouvé</h1>
          <Button onClick={() => router.push('/demarche')}>
            Retour à DEMARCHE.GA
          </Button>
        </div>
      </div>
    );
  }

  const theme = getOrganismeTheme(organismeData.code);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header Organisme */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r from-${theme.primary}-600 to-${theme.secondary}-600 rounded-lg flex items-center justify-center`}>
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{organismeData.nom}</h1>
                    <p className="text-xs text-gray-500">{organismeData.code} - République Gabonaise</p>
                  </div>
                </div>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href={`/${organismeCode}`} className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Accueil
              </Link>
              <Link href={`/${organismeCode}/services`} className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Services
              </Link>
              <Link href={`/${organismeCode}/demandes`} className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Mes Demandes
              </Link>
              <Link href={`/${organismeCode}/contact`} className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleLogin}>
                <User className="w-4 h-4 mr-2" />
                Espace Agent
              </Button>
              <Button onClick={() => router.push('/demarche')}>
                <ArrowRight className="w-4 h-4 mr-2" />
                DEMARCHE.GA
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section Organisme */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Bienvenue au 
                <span className={`text-transparent bg-clip-text bg-gradient-to-r from-${theme.primary}-600 to-${theme.secondary}-600`}>
                  {' '}{organismeData.code}
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {organismeData.description}
              </p>
              
              {/* Barre de recherche spécifique à l'organisme */}
              <div className="max-w-xl">
                <div className="flex rounded-lg shadow-lg">
                  <Input
                    type="text"
                    placeholder={`Rechercher un service ${organismeData.code}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 text-lg px-4 py-3 border-r-0 rounded-r-none"
                  />
                  <Button 
                    onClick={handleSearch}
                    className={`px-6 py-3 rounded-l-none bg-${theme.primary}-600 hover:bg-${theme.primary}-700`}
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Statistiques de l'organisme */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 bg-${theme.primary}-600 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{organismeData.stats.services}</div>
                  <div className="text-sm text-gray-600">Services Disponibles</div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 bg-${theme.secondary}-600 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{organismeData.stats.demandes_mois.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Demandes/Mois</div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 bg-${theme.accent}-600 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{organismeData.stats.satisfaction}%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{organismeData.stats.agents}</div>
                  <div className="text-sm text-gray-600">Agents</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services de l'organisme */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Services</h2>
            <p className="text-lg text-gray-600">Services disponibles au {organismeData.code}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{service.nom}</span>
                    <Badge variant="secondary">{service.cout}</Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {service.delai_traitement}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Documents requis :</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      {service.documents_requis.slice(0, 3).map((doc, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          {doc}
                        </li>
                      ))}
                      {service.documents_requis.length > 3 && (
                        <li className="text-blue-600">+{service.documents_requis.length - 3} autres...</li>
                      )}
                    </ul>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 group-hover:bg-blue-50 group-hover:border-blue-300"
                    onClick={() => router.push(`/${organismeCode}/services/${service.code}`)}
                  >
                    Demander ce service
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {services.length > 6 && (
            <div className="text-center mt-8">
              <Button 
                onClick={() => router.push(`/${organismeCode}/services`)}
                className={`bg-${theme.primary}-600 hover:bg-${theme.primary}-700`}
              >
                Voir tous les {services.length} services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Informations de contact */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nous Contacter</h2>
            <p className="text-lg text-gray-600">Informations et horaires</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Phone className={`w-6 h-6 text-${theme.primary}-600 mr-3`} />
                  <h3 className="text-lg font-semibold">Téléphone</h3>
                </div>
                <p className="text-gray-600 mb-2">{organismeData.contact.telephone}</p>
                <p className="text-sm text-gray-500">{organismeData.contact.horaires}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Mail className={`w-6 h-6 text-${theme.secondary}-600 mr-3`} />
                  <h3 className="text-lg font-semibold">Email</h3>
                </div>
                <p className="text-gray-600 mb-2">{organismeData.contact.email}</p>
                <p className="text-sm text-gray-500">Réponse sous 24h</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className={`w-6 h-6 text-${theme.accent}-600 mr-3`} />
                  <h3 className="text-lg font-semibold">Adresse</h3>
                </div>
                <p className="text-gray-600">{organismeData.contact.adresse}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold">Horaires</h3>
                </div>
                <p className="text-gray-600">{organismeData.contact.horaires}</p>
                <p className="text-sm text-gray-500">Fermé weekends et jours fériés</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer organisme */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-8 h-8 bg-gradient-to-r from-${theme.primary}-600 to-${theme.secondary}-600 rounded flex items-center justify-center`}>
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">{organismeData.code}</span>
              </div>
              <p className="text-gray-400 text-sm">
                {organismeData.nom} - République Gabonaise
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liens Rapides</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href={`/${organismeCode}/services`} className="hover:text-white">Nos Services</Link></li>
                <li><Link href={`/${organismeCode}/demandes`} className="hover:text-white">Mes Demandes</Link></li>
                <li><Link href={`/${organismeCode}/contact`} className="hover:text-white">Contact</Link></li>
                <li><Link href="/demarche" className="hover:text-white">DEMARCHE.GA</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>{organismeData.contact.telephone}</li>
                <li>{organismeData.contact.email}</li>
                <li>{organismeData.contact.adresse}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2024 {organismeData.nom}. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 