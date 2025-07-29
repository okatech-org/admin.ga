/* @ts-nocheck */
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { 
  FileText, 
  Search, 
  CreditCard, 
  Building2, 
  Users, 
  Scale, 
  Briefcase,
  Heart,
  GraduationCap,
  Car,
  Home,
  ArrowRight,
  MapPin,
  Clock,
  Star,
  Phone,
  Mail,
  User,
  Lock,
  Shield,
  Leaf,
  Calculator,
  Truck,
  Hammer,
  Receipt,
  Globe,
  TrendingUp,
  Cross,
  Radio,
  Palette,
  Trees,
  Wheat,
  Stethoscope,
  Building,
  Anchor,
  Gavel,
  ChevronRight,
  Filter,
  SortAsc,
  Bell,
  Download,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Info,
  Eye,
  EyeOff,
  UserCheck,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Schéma de validation pour la connexion
const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function DemarcheGAPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [selectedOrganisme, setSelectedOrganisme] = useState('tous');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Catégories de services avec compteur
  const categories = [
    { id: 'tous', nom: 'Tous les Services', icon: Globe, count: 85, color: 'bg-gray-600' },
    { id: 'identite', nom: 'Documents d\'Identité', icon: CreditCard, count: 12, color: 'bg-blue-600' },
    { id: 'etat_civil', nom: 'État Civil', icon: Users, count: 8, color: 'bg-purple-600' },
    { id: 'transport', nom: 'Transport & Véhicules', icon: Car, count: 11, color: 'bg-green-600' },
    { id: 'social', nom: 'Protection Sociale', icon: Heart, count: 14, color: 'bg-red-600' },
    { id: 'logement', nom: 'Logement & Habitat', icon: Home, count: 9, color: 'bg-yellow-600' },
    { id: 'justice', nom: 'Justice & Légal', icon: Scale, count: 7, color: 'bg-gray-700' },
    { id: 'emploi', nom: 'Emploi & Travail', icon: Briefcase, count: 10, color: 'bg-cyan-600' },
    { id: 'education', nom: 'Éducation & Formation', icon: GraduationCap, count: 13, color: 'bg-indigo-600' },
    { id: 'economie', nom: 'Commerce & Économie', icon: TrendingUp, count: 15, color: 'bg-emerald-600' },
    { id: 'fiscal', nom: 'Fiscalité & Impôts', icon: Receipt, count: 12, color: 'bg-amber-600' },
    { id: 'sante', nom: 'Santé & Médical', icon: Cross, count: 11, color: 'bg-red-500' },
    { id: 'environnement', nom: 'Environnement', icon: Leaf, count: 6, color: 'bg-green-700' },
    { id: 'culture', nom: 'Culture & Communication', icon: Palette, count: 5, color: 'bg-rose-600' }
  ];

  // 28 Organismes principaux avec leurs services
  const organismesPrincipaux = [
    { code: 'DGDI', nom: 'Direction Générale de la Documentation et de l\'Immigration', services: 15, icon: Shield, color: 'bg-blue-600' },
    { code: 'CNSS', nom: 'Caisse Nationale de Sécurité Sociale', services: 14, icon: Heart, color: 'bg-green-600' },
    { code: 'MIN_ECONOMIE', nom: 'Ministère de l\'Économie', services: 15, icon: TrendingUp, color: 'bg-emerald-600' },
    { code: 'MAIRE_LBV', nom: 'Mairie de Libreville', services: 18, icon: Building2, color: 'bg-blue-500' },
    { code: 'MAIRE_PG', nom: 'Mairie de Port-Gentil', services: 14, icon: Anchor, color: 'bg-navy-600' },
    { code: 'MIN_EDUC', nom: 'Ministère de l\'Éducation Nationale', services: 13, icon: GraduationCap, color: 'bg-indigo-600' },
    { code: 'DGI', nom: 'Direction Générale des Impôts', services: 12, icon: Receipt, color: 'bg-amber-600' },
    { code: 'MIN_JUS', nom: 'Ministère de la Justice', services: 12, icon: Scale, color: 'bg-purple-600' },
    { code: 'MIN_TRANSPORT', nom: 'Ministère des Transports', services: 11, icon: Car, color: 'bg-orange-600' },
    { code: 'MIN_SANTE', nom: 'Ministère de la Santé', services: 11, icon: Cross, color: 'bg-red-500' },
    { code: 'CNAMGS', nom: 'Caisse Nationale d\'Assurance Maladie', services: 10, icon: Stethoscope, color: 'bg-red-600' },
    { code: 'MIN_TRAVAIL', nom: 'Ministère du Travail', services: 10, icon: Briefcase, color: 'bg-cyan-600' },
    { code: 'MIN_HABITAT', nom: 'Ministère de l\'Habitat', services: 9, icon: Home, color: 'bg-lime-600' },
    { code: 'MIN_AFFAIRES_SOCIALES', nom: 'Ministère des Affaires Sociales', services: 9, icon: Users, color: 'bg-pink-600' },
    { code: 'DOUANES', nom: 'Direction Générale des Douanes', services: 8, icon: Truck, color: 'bg-blue-800' },
    { code: 'MIN_INT', nom: 'Ministère de l\'Intérieur', services: 8, icon: Building2, color: 'bg-gray-700' },
    { code: 'ANPE', nom: 'Agence Nationale Pour l\'Emploi', services: 8, icon: Search, color: 'bg-violet-600' },
    { code: 'MIN_AGRICULTURE', nom: 'Ministère de l\'Agriculture', services: 8, icon: Wheat, color: 'bg-yellow-700' },
    { code: 'MIN_ENS_SUP', nom: 'Ministère de l\'Enseignement Supérieur', services: 7, icon: GraduationCap, color: 'bg-blue-700' },
    { code: 'MIN_EQUIPEMENT', nom: 'Ministère des Équipements', services: 7, icon: Hammer, color: 'bg-stone-600' },
    { code: 'MIN_CULTURE', nom: 'Ministère de la Culture', services: 6, icon: Palette, color: 'bg-rose-600' },
    { code: 'ANPI', nom: 'Agence Nationale de Promotion des Investissements', services: 6, icon: Building, color: 'bg-teal-600' },
    { code: 'MIN_FORMATION_PROF', nom: 'Ministère de la Formation Professionnelle', services: 6, icon: GraduationCap, color: 'bg-yellow-600' },
    { code: 'MIN_ENVIRONNEMENT', nom: 'Ministère de l\'Environnement', services: 6, icon: Leaf, color: 'bg-green-700' },
    { code: 'MIN_DEF', nom: 'Ministère de la Défense', services: 5, icon: Shield, color: 'bg-green-800' },
    { code: 'MIN_EAUX_FORETS', nom: 'Ministère des Eaux et Forêts', services: 5, icon: Trees, color: 'bg-emerald-700' },
    { code: 'MIN_COMMUNICATION', nom: 'Ministère de la Communication', services: 5, icon: Radio, color: 'bg-purple-700' },
    { code: 'CONSEIL_ETAT', nom: 'Conseil d\'État', services: 4, icon: Gavel, color: 'bg-gray-800' }
  ];

  // Services par catégories (échantillon des 85+ services)
  const servicesParCategorie = {
    identite: [
      { nom: "Carte Nationale d'Identité", organisme: "DGDI", duree: "3-5 jours", cout: "25 000 FCFA", statut: "actif" },
      { nom: "Passeport", organisme: "DGDI", duree: "5-7 jours", cout: "75 000 FCFA", statut: "actif" },
      { nom: "Certificat de nationalité", organisme: "Min. Justice", duree: "2-3 mois", cout: "15 000 FCFA", statut: "actif" },
      { nom: "Laissez-passer", organisme: "DGDI", duree: "24h", cout: "10 000 FCFA", statut: "actif" },
      { nom: "Attestation d'identité", organisme: "DGDI", duree: "2-3 jours", cout: "5 000 FCFA", statut: "actif" }
    ],
    etat_civil: [
      { nom: "Acte de naissance", organisme: "Mairie", duree: "1-2 jours", cout: "2 000 FCFA", statut: "actif" },
      { nom: "Acte de mariage", organisme: "Mairie", duree: "1-2 jours", cout: "2 000 FCFA", statut: "actif" },
      { nom: "Acte de décès", organisme: "Mairie", duree: "1-2 jours", cout: "2 000 FCFA", statut: "actif" },
      { nom: "Publication des bans", organisme: "Mairie", duree: "10 jours", cout: "10 000 FCFA", statut: "actif" },
      { nom: "Certificat de célibat", organisme: "Mairie", duree: "3-5 jours", cout: "5 000 FCFA", statut: "actif" }
    ],
    transport: [
      { nom: "Permis de conduire", organisme: "Min. Transports", duree: "10-15 jours", cout: "50 000 FCFA", statut: "actif" },
      { nom: "Immatriculation véhicule", organisme: "Min. Transports", duree: "7-15 jours", cout: "Variable", statut: "actif" },
      { nom: "Visite technique", organisme: "ANAC", duree: "Immédiat", cout: "25 000 FCFA", statut: "actif" },
      { nom: "Carte grise", organisme: "Min. Transports", duree: "5-10 jours", cout: "15 000 FCFA", statut: "actif" },
      { nom: "Duplicata permis", organisme: "Min. Transports", duree: "7-10 jours", cout: "25 000 FCFA", statut: "actif" }
    ],
    social: [
      { nom: "Immatriculation CNSS", organisme: "CNSS", duree: "7-15 jours", cout: "Gratuit", statut: "actif" },
      { nom: "Carte CNAMGS", organisme: "CNAMGS", duree: "15-30 jours", cout: "5 000 FCFA", statut: "actif" },
      { nom: "Allocations familiales", organisme: "CNSS", duree: "30 jours", cout: "Gratuit", statut: "actif" },
      { nom: "Pension de retraite", organisme: "CNSS", duree: "2-6 mois", cout: "Gratuit", statut: "actif" },
      { nom: "Attestation travail", organisme: "CNSS", duree: "2-5 jours", cout: "2 000 FCFA", statut: "actif" }
    ],
    emploi: [
      { nom: "Recherche d'emploi", organisme: "ANPE", duree: "Variable", cout: "Gratuit", statut: "actif" },
      { nom: "Formation professionnelle", organisme: "ANPE", duree: "3-12 mois", cout: "Variable", statut: "actif" },
      { nom: "Contrat de travail", organisme: "Min. Travail", duree: "5-10 jours", cout: "5 000 FCFA", statut: "actif" },
      { nom: "Médiation sociale", organisme: "Min. Travail", duree: "15-30 jours", cout: "Gratuit", statut: "actif" }
    ],
    justice: [
      { nom: "Casier judiciaire", organisme: "Min. Justice", duree: "7-15 jours", cout: "2 000 FCFA", statut: "actif" },
      { nom: "Légalisation signature", organisme: "Min. Justice", duree: "Immédiat", cout: "1 000-5 000 FCFA", statut: "actif" },
      { nom: "Apostille", organisme: "Min. Justice", duree: "7-15 jours", cout: "10 000 FCFA", statut: "actif" },
      { nom: "Certificat de non-appel", organisme: "Min. Justice", duree: "10-20 jours", cout: "5 000 FCFA", statut: "actif" }
    ]
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/demarche/recherche?q=${encodeURIComponent(searchTerm)}&category=${selectedCategory}&organisme=${selectedOrganisme}`);
    }
  };

  const handleServiceClick = (service: any) => {
    router.push(`/demarche/service/${service.nom.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const filteredServices = () => {
    if (selectedCategory === 'tous') {
      return Object.values(servicesParCategorie).flat();
    }
    return servicesParCategorie[selectedCategory] || [];
  };

  // Compte démo citoyen
  const compteDemoCitoyen = {
    email: 'demo.citoyen@demarche.ga',
    password: 'CitoyenDemo2024!',
    nom: 'Jean MBADINGA',
    description: 'Compte de démonstration citoyen',
    destination: 'Dashboard Citoyen'
  };

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    
    const toastId = toast.loading('Connexion en cours...');

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Email ou mot de passe incorrect', { id: toastId });
        setIsLoading(false);
        return;
      }

      toast.success('Connexion réussie !', { id: toastId });
      setIsLoginOpen(false);
      
      // Redirection vers le dashboard citoyen pour les comptes USER
      if (data.email === compteDemoCitoyen.email || data.email.includes('@demarche.ga')) {
        router.push('/citoyen/dashboard');
      } else {
        // Redirection vers auth normale pour autres comptes
        router.push('/auth/connexion');
      }
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.', { id: toastId });
      setIsLoading(false);
    }
  };

  const fillDemoAccount = () => {
    form.setValue('email', compteDemoCitoyen.email);
    form.setValue('password', compteDemoCitoyen.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header DEMARCHE.GA */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">DEMARCHE.GA</h1>
                    <p className="text-xs text-gray-500">Services administratifs du Gabon</p>
                  </div>
                </div>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/demarche" className="text-blue-600 font-semibold border-b-2 border-blue-600 px-3 py-2 text-sm">
                Accueil
              </Link>
              <Link href="/demarche/services" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Tous les Services
              </Link>
              <Link href="/demarche/organismes" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Organismes
              </Link>
              <Link href="/demarche/aide" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Aide & Support
              </Link>
              <Link href="/demarche/statut" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Statut Services
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Connexion
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Connexion DEMARCHE.GA</DialogTitle>
                    <DialogDescription className="text-center">
                      Accédez à votre espace personnel ou testez le compte démo
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6 mt-6">
                    {/* Formulaire de connexion */}
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Adresse email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input 
                                    type="email" 
                                    placeholder="votre@email.ga"
                                    className="pl-10"
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mot de passe</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Votre mot de passe"
                                    className="pl-10 pr-10"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                                  >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Connexion...' : 'Se connecter'}
                        </Button>
                      </form>
                    </Form>

                    {/* Séparateur */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Ou essayez le compte démo</span>
                      </div>
                    </div>

                    {/* Compte démo citoyen */}
                    <Card 
                      className="hover:shadow-lg transition-shadow cursor-pointer group border-2 border-green-200 bg-green-50"
                      onClick={fillDemoAccount}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <UserCheck className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">Compte Démo Citoyen</h3>
                            <p className="text-sm text-gray-600">{compteDemoCitoyen.nom} - {compteDemoCitoyen.description}</p>
                            <p className="text-xs text-green-600 font-medium mt-1">→ {compteDemoCitoyen.destination}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 font-mono">{compteDemoCitoyen.email}</p>
                            <p className="text-xs text-gray-400">Cliquer pour remplir</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Liens d'aide */}
                    <div className="text-center space-y-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/auth/inscription">
                          Pas encore de compte ? S'inscrire
                        </Link>
                      </Button>
                      <br />
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/demarche/aide">
                          Besoin d'aide ? Centre d'assistance
                        </Link>
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button size="sm" asChild>
                <Link href="/auth/inscription">
                  <Lock className="w-4 h-4 mr-2" />
                  Inscription
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section Améliorée */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              85+ Services Disponibles
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Vos démarches administratives
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600"> simplifiées</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Accédez à tous les services des <strong>28 organismes publics gabonais</strong> depuis une seule plateforme. 
            Gagnez du temps, évitez les déplacements, et suivez vos demandes en temps réel.
          </p>
          
          {/* Barre de recherche améliorée */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-3 p-4 bg-white rounded-2xl shadow-xl border">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Rechercher un service (ex: CNI, passeport, acte de naissance...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="text-lg px-6 py-4 border-0 focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-4 border border-gray-200 rounded-lg bg-gray-50 text-sm"
                  title="Sélectionner une catégorie de services"
                >
                  <option value="tous">Toutes catégories</option>
                  {categories.slice(1).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nom}</option>
                  ))}
                </select>
                <Button 
                  onClick={handleSearch}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Statistiques en temps réel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">85+</div>
              <div className="text-sm text-gray-600">Services en ligne</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">28</div>
              <div className="text-sm text-gray-600">Organismes connectés</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">24h/7</div>
              <div className="text-sm text-gray-600">Accessibilité</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">Dématérialisé</div>
            </div>
          </div>
        </div>
      </section>

      {/* Onglets de Navigation des Services */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 lg:grid-cols-14 h-auto p-1">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex flex-col items-center p-3 text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <category.icon className="w-5 h-5 mb-1" />
                  <span className="hidden md:block">{category.nom.split(' ')[0]}</span>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Contenu des Services par Catégorie */}
            <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices().slice(0, 12).map((service, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-l-4 border-l-blue-500" onClick={() => handleServiceClick(service)}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                            {service.nom}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {service.organisme}
                          </Badge>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${service.statut === 'actif' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Délai:
                          </span>
                          <span className="font-medium">{service.duree}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="flex items-center">
                            <CreditCard className="w-4 h-4 mr-1" />
                            Coût:
                          </span>
                          <span className="font-medium text-green-600">{service.cout}</span>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full mt-4 group-hover:bg-blue-50 group-hover:border-blue-300">
                        Démarrer la procédure
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredServices().length > 12 && (
                <div className="text-center mt-8">
                  <Button asChild size="lg">
                    <Link href={`/demarche/services?category=${selectedCategory}`}>
                      Voir tous les {filteredServices().length} services
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </section>

      {/* Section Organismes Principaux */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">28 Organismes Publics à Votre Service</h2>
            <p className="text-lg text-gray-600">Accédez directement aux services de chaque administration</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {organismesPrincipaux.slice(0, 12).map((organisme) => (
              <Card key={organisme.code} className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${organisme.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <organisme.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{organisme.nom}</h3>
                  <Badge className="bg-blue-100 text-blue-800">
                    {organisme.services} services
                  </Badge>
                  <Button variant="outline" size="sm" className="w-full mt-4 group-hover:bg-blue-50">
                    Accéder aux services
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild size="lg" variant="outline">
              <Link href="/demarche/organismes">
                Voir tous les 28 organismes
                <Building2 className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Avantages et Fonctionnalités */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi Choisir DEMARCHE.GA ?</h2>
            <p className="text-lg text-gray-600">Une plateforme moderne pour des services publics efficaces</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Gain de Temps Considérable</h3>
              <p className="text-gray-600">Effectuez vos démarches en ligne 24h/7, sans vous déplacer ni faire la queue. Suivi en temps réel de vos demandes.</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Service de Qualité</h3>
              <p className="text-gray-600">Interface moderne, processus simplifiés et assistance en ligne pour une expérience utilisateur optimale.</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Sécurisé et Officiel</h3>
              <p className="text-gray-600">Vos données sont protégées, vos démarches sont officielles et légales. Certifié par l'État gabonais.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Support et Contact */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Support et Assistance</h2>
            <p className="text-lg text-gray-600">Notre équipe est là pour vous accompagner</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Support Téléphonique</h3>
                <p className="text-gray-600 mb-4">Lundi - Vendredi<br/>8h00 - 17h00</p>
                <p className="text-lg font-bold text-blue-600">+241 01 XX XX XX</p>
                <Button variant="outline" className="mt-4">
                  <Phone className="w-4 h-4 mr-2" />
                  Appeler maintenant
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Mail className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Support Email</h3>
                <p className="text-gray-600 mb-4">Réponse garantie<br/>sous 24 heures</p>
                <p className="text-lg font-bold text-green-600">support@demarche.ga</p>
                <Button variant="outline" className="mt-4">
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer un email
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <HelpCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Centre d'Aide</h3>
                <p className="text-gray-600 mb-4">FAQ, guides et<br/>tutoriels détaillés</p>
                <p className="text-lg font-bold text-purple-600">Assistance 24h/7</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/demarche/aide">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Accéder à l'aide
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer Complet */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Logo et Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">DEMARCHE.GA</span>
                  <p className="text-gray-400 text-sm">République Gabonaise</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-6 max-w-md">
                La plateforme officielle de dématérialisation des services administratifs de la République Gabonaise. 
                Simplifiez vos démarches, gagnez du temps et accédez à tous les services publics en ligne.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-gray-900">
                  <Download className="w-4 h-4 mr-2" />
                  App Mobile
                </Button>
              </div>
            </div>

            {/* Services Populaires */}
            <div>
              <h4 className="font-semibold mb-6 text-lg">Services Populaires</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/demarche/service/cni" className="hover:text-white transition-colors">Carte Nationale d'Identité</Link></li>
                <li><Link href="/demarche/service/passeport" className="hover:text-white transition-colors">Passeport</Link></li>
                <li><Link href="/demarche/service/acte-naissance" className="hover:text-white transition-colors">Acte de naissance</Link></li>
                <li><Link href="/demarche/service/permis-conduire" className="hover:text-white transition-colors">Permis de conduire</Link></li>
                <li><Link href="/demarche/service/casier-judiciaire" className="hover:text-white transition-colors">Casier judiciaire</Link></li>
                <li><Link href="/demarche/services" className="hover:text-white transition-colors font-medium">→ Voir tous les services</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-6 text-lg">Support & Aide</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/demarche/aide" className="hover:text-white transition-colors">Centre d'aide</Link></li>
                <li><Link href="/demarche/faq" className="hover:text-white transition-colors">Questions fréquentes</Link></li>
                <li><Link href="/demarche/contact" className="hover:text-white transition-colors">Nous contacter</Link></li>
                <li><Link href="/demarche/statut" className="hover:text-white transition-colors">Statut des services</Link></li>
                <li><Link href="/demarche/tutoriels" className="hover:text-white transition-colors">Tutoriels vidéo</Link></li>
              </ul>
            </div>
          </div>

          {/* Liens Légaux */}
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              &copy; 2024 République Gabonaise. Tous droits réservés.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/demarche/confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link>
              <Link href="/demarche/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
              <Link href="/demarche/accessibilite" className="hover:text-white transition-colors">Accessibilité</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 