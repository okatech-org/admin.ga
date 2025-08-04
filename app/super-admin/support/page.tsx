'use client';

import React, { useState } from 'react';
import { SuperAdminLayout } from '@/components/layouts/super-admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Book,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Send,
  Search,
  Users,
  Settings,
  Shield,
  Database,
  Lightbulb
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const SUPPORT_CATEGORIES = [
  { value: 'technique', label: 'Problème Technique' },
  { value: 'compte', label: 'Gestion de Compte' },
  { value: 'formation', label: 'Formation & Documentation' },
  { value: 'feature', label: 'Demande de Fonctionnalité' },
  { value: 'bug', label: 'Signalement de Bug' },
  { value: 'autre', label: 'Autre' },
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Faible', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Moyenne', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'Élevée', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-800' },
];

const FAQ_ITEMS = [
  {
    question: "Comment créer un nouvel organisme ?",
    answer: "Allez dans 'Administrations' puis cliquez sur 'Nouvel Organisme'. Suivez les étapes du formulaire guidé.",
    category: "Gestion"
  },
  {
    question: "Comment gérer les utilisateurs d'un organisme ?",
    answer: "Dans la section 'Utilisateurs', vous pouvez filtrer par organisme, ajouter, modifier ou désactiver des comptes.",
    category: "Utilisateurs"
  },
  {
    question: "Comment accéder aux statistiques avancées ?",
    answer: "Utilisez la section 'Analytics' pour des rapports détaillés ou 'Métriques Avancées' pour des données en temps réel.",
    category: "Analyse"
  },
  {
    question: "Comment sauvegarder la base de données ?",
    answer: "Rendez-vous dans 'Base de Données' puis cliquez sur 'Exporter' pour créer une sauvegarde complète.",
    category: "Technique"
  }
];

export default function SupportPage() {
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFormChange = (field: string, value: string) => {
    setTicketForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitTicket = async () => {
    if (!ticketForm.subject || !ticketForm.category || !ticketForm.description) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simuler l'envoi du ticket
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Ticket de support créé avec succès !');
      setTicketForm({
        subject: '',
        category: '',
        priority: 'medium',
        description: '',
        email: '',
      });
    } catch (error) {
      toast.error('Erreur lors de la création du ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFAQ = FAQ_ITEMS.filter(item =>
    searchQuery === '' ||
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <HelpCircle className="h-8 w-8 text-blue-500" />
              Support & Assistance
            </h1>
            <p className="text-muted-foreground">
              Centre d'aide, documentation et support technique
            </p>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold">Chat en Direct</h3>
              <p className="text-sm text-muted-foreground">Support immédiat</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Phone className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold">Support Téléphonique</h3>
              <p className="text-sm text-muted-foreground">+241 XX XX XX XX</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Mail className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold">Email Support</h3>
              <p className="text-sm text-muted-foreground">support@administration.ga</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Book className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold">Documentation</h3>
              <p className="text-sm text-muted-foreground">Guides complets</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulaire de ticket */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Créer un Ticket de Support
              </CardTitle>
              <CardDescription>
                Décrivez votre problème et notre équipe vous aidera rapidement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Sujet *</Label>
                <Input
                  id="subject"
                  value={ticketForm.subject}
                  onChange={(e) => handleFormChange('subject', e.target.value)}
                  placeholder="Résumé du problème"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Catégorie *</Label>
                  <Select value={ticketForm.category} onValueChange={(value) => handleFormChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORT_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priorité</Label>
                  <Select value={ticketForm.priority} onValueChange={(value) => handleFormChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_LEVELS.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${priority.color.split(' ')[0]}`} />
                            {priority.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email de contact</Label>
                <Input
                  id="email"
                  type="email"
                  value={ticketForm.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  placeholder="votre.email@domaine.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description détaillée *</Label>
                <Textarea
                  id="description"
                  value={ticketForm.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Décrivez votre problème en détail..."
                  rows={4}
                />
              </div>

              <Button
                onClick={handleSubmitTicket}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer le Ticket
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Questions Fréquentes
              </CardTitle>
              <CardDescription>
                Trouvez rapidement des réponses aux questions courantes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher dans la FAQ..."
                  className="pl-10"
                />
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredFAQ.map((item, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium text-sm">{item.question}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
                {filteredFAQ.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Aucun résultat trouvé</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ressources utiles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Ressources Utiles
            </CardTitle>
            <CardDescription>
              Documentation, guides et liens vers les outils de gestion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/super-admin/knowledge-base" className="block">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Database className="h-8 w-8 text-blue-500" />
                      <div>
                        <h4 className="font-semibold">Base de Connaissances</h4>
                        <p className="text-sm text-muted-foreground">Documentation complète</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/super-admin/systeme" className="block">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Settings className="h-8 w-8 text-green-500" />
                      <div>
                        <h4 className="font-semibold">Configuration Système</h4>
                        <p className="text-sm text-muted-foreground">Paramètres avancés</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/super-admin/logs" className="block">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-purple-500" />
                      <div>
                        <h4 className="font-semibold">Logs Système</h4>
                        <p className="text-sm text-muted-foreground">Diagnostic et monitoring</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Informations de contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact & Horaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Support Technique</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Lundi - Vendredi: 8h00 - 18h00</p>
                  <p>Samedi: 9h00 - 13h00</p>
                  <p>Dimanche: Fermé</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Contact d'Urgence</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>📞 +241 XX XX XX XX</p>
                  <p>📧 urgence@administration.ga</p>
                  <p>🕒 24h/7j pour les urgences critiques</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Formation</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Sessions de formation disponibles</p>
                  <p>📧 formation@administration.ga</p>
                  <p>🗓️ Sur rendez-vous</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}
