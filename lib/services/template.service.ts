/* @ts-nocheck */
import { PrismaClient } from '@prisma/client';
import Handlebars from 'handlebars';

interface Template {
  id: string;
  name: string;
  type: 'DOCUMENT' | 'EMAIL' | 'SMS' | 'NOTIFICATION';
  category: string;
  subject?: string;
  content: string;
  variables: string[];
  metadata?: Record<string, any>;
  isActive: boolean;
  version: number;
}

interface TemplateData {
  [key: string]: any;
}

interface RenderResult {
  success: boolean;
  content?: string;
  subject?: string;
  error?: string;
}

interface DocumentGenerationOptions {
  format?: 'PDF' | 'DOCX' | 'HTML';
  watermark?: boolean;
  signature?: boolean;
  qrCode?: boolean;
  locale?: string;
}

export class TemplateService {
  private prisma: PrismaClient;
  private templates: Map<string, Template>;
  private compiledTemplates: Map<string, HandlebarsTemplateDelegate>;
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.templates = new Map();
    this.compiledTemplates = new Map();
    
    // Enregistrer les helpers Handlebars personnalisés
    this.registerHelpers();
    
    // Charger les templates par défaut
    this.loadDefaultTemplates();
  }

  /**
   * Créer un nouveau template
   */
  async createTemplate(template: Omit<Template, 'id' | 'version'>): Promise<Template> {
    const id = `TPL-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const newTemplate: Template = {
      ...template,
      id,
      version: 1,
    };

    // Valider le template
    const validation = this.validateTemplate(newTemplate);
    if (!validation.isValid) {
      throw new Error(`Template invalide: ${validation.errors.join(', ')}`);
    }

    // Compiler le template
    this.compileTemplate(newTemplate);

    // Sauvegarder en base
    await this.saveTemplate(newTemplate);

    return newTemplate;
  }

  /**
   * Mettre à jour un template
   */
  async updateTemplate(
    templateId: string,
    updates: Partial<Omit<Template, 'id' | 'version'>>
  ): Promise<Template> {
    const existing = this.templates.get(templateId);
    if (!existing) {
      throw new Error('Template non trouvé');
    }

    const updated: Template = {
      ...existing,
      ...updates,
      version: existing.version + 1,
    };

    // Revalider et recompiler
    const validation = this.validateTemplate(updated);
    if (!validation.isValid) {
      throw new Error(`Template invalide: ${validation.errors.join(', ')}`);
    }

    this.compileTemplate(updated);
    await this.saveTemplate(updated);

    // Archiver l'ancienne version
    await this.archiveTemplateVersion(existing);

    return updated;
  }

  /**
   * Rendre un template avec des données
   */
  async render(
    templateId: string,
    data: TemplateData,
    options?: DocumentGenerationOptions
  ): Promise<RenderResult> {
    try {
      const template = this.templates.get(templateId);
      if (!template) {
        throw new Error('Template non trouvé');
      }

      // Obtenir le template compilé
      const compiled = this.compiledTemplates.get(templateId);
      if (!compiled) {
        throw new Error('Template non compilé');
      }

      // Enrichir les données avec des helpers
      const enrichedData = await this.enrichData(data, template);

      // Rendre le contenu
      const content = compiled(enrichedData);

      // Rendre le sujet si applicable
      let subject: string | undefined;
      if (template.subject) {
        const subjectTemplate = Handlebars.compile(template.subject);
        subject = subjectTemplate(enrichedData);
      }

      // Post-traitement selon le format
      const processedContent = await this.postProcess(
        content,
        template.type,
        options
      );

      return {
        success: true,
        content: processedContent,
        subject,
      };
    } catch (error: any) {
      console.error('Erreur rendu template:', error);
      return {
        success: false,
        error: error.message || 'Erreur rendu template',
      };
    }
  }

  /**
   * Générer un document PDF
   */
  async generatePDF(
    templateId: string,
    data: TemplateData,
    options?: DocumentGenerationOptions
  ): Promise<Buffer> {
    const result = await this.render(templateId, data, { ...options, format: 'PDF' });
    
    if (!result.success || !result.content) {
      throw new Error(result.error || 'Échec génération PDF');
    }

    // TODO: Implémenter la conversion HTML vers PDF
    // Pour l'instant, retourner un buffer vide
    return Buffer.from('PDF content');
  }

  /**
   * Prévisualiser un template
   */
  async preview(
    templateId: string,
    sampleData?: TemplateData
  ): Promise<RenderResult> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error('Template non trouvé');
    }

    // Utiliser des données d'exemple si non fournies
    const data = sampleData || this.generateSampleData(template);

    return this.render(templateId, data);
  }

  /**
   * Obtenir tous les templates d'une catégorie
   */
  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return Array.from(this.templates.values())
      .filter(t => t.category === category && t.isActive);
  }

  /**
   * Cloner un template
   */
  async cloneTemplate(
    templateId: string,
    newName: string
  ): Promise<Template> {
    const original = this.templates.get(templateId);
    if (!original) {
      throw new Error('Template non trouvé');
    }

    const cloned = {
      ...original,
      name: newName,
      metadata: {
        ...original.metadata,
        clonedFrom: templateId,
        clonedAt: new Date(),
      },
    };

    delete (cloned as any).id;
    delete (cloned as any).version;

    return this.createTemplate(cloned);
  }

  /**
   * Exporter un template
   */
  async exportTemplate(templateId: string): Promise<string> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error('Template non trouvé');
    }

    return JSON.stringify(template, null, 2);
  }

  /**
   * Importer un template
   */
  async importTemplate(templateJson: string): Promise<Template> {
    try {
      const imported = JSON.parse(templateJson);
      
      // Retirer l'ID pour forcer la création d'un nouveau
      delete imported.id;
      delete imported.version;

      return this.createTemplate(imported);
    } catch (error) {
      throw new Error('Format de template invalide');
    }
  }

  // Méthodes privées

  private registerHelpers(): void {
    // Helper pour formater les dates
    Handlebars.registerHelper('formatDate', (date: any, format: string) => {
      if (!date) return '';
      const d = new Date(date);
      
      switch (format) {
        case 'short':
          return d.toLocaleDateString('fr-FR');
        case 'long':
          return d.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        case 'time':
          return d.toLocaleTimeString('fr-FR');
        default:
          return d.toLocaleString('fr-FR');
      }
    });

    // Helper pour formater les montants
    Handlebars.registerHelper('formatAmount', (amount: number, currency: string = 'XAF') => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency,
      }).format(amount);
    });

    // Helper pour les conditions
    Handlebars.registerHelper('ifEquals', function(arg1: any, arg2: any, options: any) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    });

    // Helper pour traduire les statuts
    Handlebars.registerHelper('translateStatus', (status: string) => {
      const translations: Record<string, string> = {
        'PENDING': 'En attente',
        'APPROVED': 'Approuvé',
        'REJECTED': 'Rejeté',
        'COMPLETED': 'Terminé',
        'IN_PROGRESS': 'En cours',
      };
      return translations[status] || status;
    });

    // Helper pour générer un QR code
    Handlebars.registerHelper('qrCode', (data: string) => {
      // TODO: Implémenter la génération de QR code
      return `[QR: ${data}]`;
    });
  }

  private loadDefaultTemplates(): void {
    // Templates de documents
    this.templates.set('certificate_birth', {
      id: 'certificate_birth',
      name: 'Certificat de naissance',
      type: 'DOCUMENT',
      category: 'CIVIL',
      content: `
        <div class="certificate">
          <h1>République Gabonaise</h1>
          <h2>Certificat de Naissance</h2>
          
          <p>Il est certifié que <strong>{{firstName}} {{lastName}}</strong></p>
          <p>Né(e) le {{formatDate dateOfBirth "long"}}</p>
          <p>À {{placeOfBirth}}</p>
          <p>Fils/Fille de {{fatherName}} et {{motherName}}</p>
          
          <div class="footer">
            <p>Fait à {{city}}, le {{formatDate issueDate "long"}}</p>
            <p>L'Officier d'État Civil</p>
          </div>
        </div>
      `,
      variables: ['firstName', 'lastName', 'dateOfBirth', 'placeOfBirth', 'fatherName', 'motherName', 'city', 'issueDate'],
      isActive: true,
      version: 1,
    });

    // Templates d'emails
    this.templates.set('email_request_received', {
      id: 'email_request_received',
      name: 'Email - Demande reçue',
      type: 'EMAIL',
      category: 'NOTIFICATION',
      subject: 'Votre demande {{trackingNumber}} a été reçue',
      content: `
        <h2>Bonjour {{firstName}},</h2>
        
        <p>Nous avons bien reçu votre demande de <strong>{{serviceType}}</strong>.</p>
        
        <p>Votre numéro de suivi est : <strong>{{trackingNumber}}</strong></p>
        
        <p>Vous pouvez suivre l'état de votre demande à tout moment en vous connectant à votre espace personnel.</p>
        
        <p>Délai de traitement estimé : {{processingDays}} jours ouvrables</p>
        
        <p>Cordialement,<br>
        L'équipe {{organizationName}}</p>
      `,
      variables: ['firstName', 'serviceType', 'trackingNumber', 'processingDays', 'organizationName'],
      isActive: true,
      version: 1,
    });

    // Templates SMS
    this.templates.set('sms_appointment_reminder', {
      id: 'sms_appointment_reminder',
      name: 'SMS - Rappel RDV',
      type: 'SMS',
      category: 'NOTIFICATION',
      content: 'Rappel: RDV demain {{date}} à {{time}} pour {{service}}. Code: {{appointmentCode}}',
      variables: ['date', 'time', 'service', 'appointmentCode'],
      isActive: true,
      version: 1,
    });

    // Compiler tous les templates par défaut
    this.templates.forEach(template => {
      this.compileTemplate(template);
    });
  }

  private validateTemplate(template: Template): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Vérifier la syntaxe Handlebars
    try {
      Handlebars.compile(template.content);
      if (template.subject) {
        Handlebars.compile(template.subject);
      }
    } catch (error: any) {
      errors.push(`Erreur syntaxe: ${error.message}`);
    }

    // Vérifier les variables utilisées
    const usedVars = this.extractVariables(template.content);
    const missingVars = usedVars.filter(v => !template.variables.includes(v));
    
    if (missingVars.length > 0) {
      errors.push(`Variables non déclarées: ${missingVars.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private extractVariables(content: string): string[] {
    const regex = /\{\{([^}]+)\}\}/g;
    const variables = new Set<string>();
    let match;

    while ((match = regex.exec(content)) !== null) {
      const variable = match[1].trim().split(' ')[0];
      if (!variable.includes('(') && !variable.startsWith('#') && !variable.startsWith('/')) {
        variables.add(variable);
      }
    }

    return Array.from(variables);
  }

  private compileTemplate(template: Template): void {
    const compiled = Handlebars.compile(template.content);
    this.compiledTemplates.set(template.id, compiled);
  }

  private async enrichData(
    data: TemplateData,
    template: Template
  ): Promise<TemplateData> {
    const enriched = { ...data };

    // Ajouter les données système
    enriched.currentDate = new Date();
    enriched.currentYear = new Date().getFullYear();

    // Ajouter les données de l'organisation si applicable
    if (data.organizationId) {
      const org = await this.prisma.organization.findUnique({
        where: { id: data.organizationId },
      });
      if (org) {
        enriched.organizationName = org.name;
        enriched.organizationAddress = org.address;
        enriched.organizationPhone = org.phone;
      }
    }

    return enriched;
  }

  private async postProcess(
    content: string,
    type: string,
    options?: DocumentGenerationOptions
  ): Promise<string> {
    let processed = content;

    // Ajouter le CSS pour les documents
    if (type === 'DOCUMENT') {
      processed = this.wrapWithDocumentStyles(processed);
    }

    // Ajouter un filigrane si demandé
    if (options?.watermark) {
      processed = this.addWatermark(processed);
    }

    // Ajouter un QR code si demandé
    if (options?.qrCode) {
      processed = this.addQRCode(processed);
    }

    return processed;
  }

  private wrapWithDocumentStyles(content: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            line-height: 1.6;
          }
          .certificate {
            border: 2px solid #000;
            padding: 40px;
            text-align: center;
          }
          h1 { color: #2c3e50; margin-bottom: 10px; }
          h2 { color: #34495e; margin-bottom: 30px; }
          .footer {
            margin-top: 60px;
            text-align: right;
          }
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            color: rgba(0,0,0,0.1);
            z-index: -1;
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;
  }

  private addWatermark(content: string): string {
    const watermark = '<div class="watermark">OFFICIEL</div>';
    return content.replace('</body>', `${watermark}</body>`);
  }

  private addQRCode(content: string): string {
    // TODO: Implémenter l'ajout de QR code
    return content;
  }

  private generateSampleData(template: Template): TemplateData {
    const sampleData: TemplateData = {};

    template.variables.forEach(variable => {
      switch (variable) {
        case 'firstName':
          sampleData[variable] = 'Jean';
          break;
        case 'lastName':
          sampleData[variable] = 'Dupont';
          break;
        case 'dateOfBirth':
          sampleData[variable] = new Date('1990-01-15');
          break;
        case 'trackingNumber':
          sampleData[variable] = 'REQ-2024-00123';
          break;
        case 'email':
          sampleData[variable] = 'jean.dupont@example.com';
          break;
        case 'phone':
          sampleData[variable] = '+241 01 23 45 67';
          break;
        default:
          sampleData[variable] = `[${variable}]`;
      }
    });

    return sampleData;
  }

  private async saveTemplate(template: Template): Promise<void> {
    // Sauvegarder en mémoire
    this.templates.set(template.id, template);

    // Persister en base
    await this.prisma.systemConfig.upsert({
      where: { key: `template_${template.id}` },
      create: {
        key: `template_${template.id}`,
        value: template as any,
        category: 'TEMPLATES',
        description: template.name,
        isPublic: false,
      },
      update: {
        value: template as any,
      },
    });
  }

  private async archiveTemplateVersion(template: Template): Promise<void> {
    await this.prisma.systemConfig.create({
      data: {
        key: `template_archive_${template.id}_v${template.version}`,
        value: template as any,
        category: 'TEMPLATE_ARCHIVES',
        description: `${template.name} - Version ${template.version}`,
        isPublic: false,
      },
    });
  }
} 