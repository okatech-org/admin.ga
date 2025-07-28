/* @ts-nocheck */
import { prisma } from '@/lib/prisma';
import { DocumentType, DocumentStatus } from '@prisma/client';
import crypto from 'crypto';

interface UploadedFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export class DocumentService {
  private static instance: DocumentService;

  static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
  }

  // Document validation rules
  private validationRules: Partial<Record<DocumentType, any>> = {
    PHOTO_IDENTITE: {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
      minDimensions: { width: 300, height: 400 },
      maxAge: null,
    },
    ACTE_NAISSANCE: {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      minDimensions: null,
      maxAge: null,
    },
    JUSTIFICATIF_DOMICILE: {
      maxSize: 10 * 1024 * 1024,
      allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      minDimensions: null,
      maxAge: 6, // 6 months
    },
  };

  private storageProviders = {
    local: {
      upload: async (file: UploadedFile, path: string) => {
        // Local storage implementation
        return `/uploads/${path}`;
      },
    },
    s3: {
      upload: async (file: UploadedFile, path: string) => {
        // S3 implementation placeholder
        return `https://s3.amazonaws.com/bucket/${path}`;
      },
    },
  };

  async upload(
    file: any, // Changed from Express.Multer.File
    userId: string,
    requestId?: string,
    documentType?: DocumentType
  ): Promise<any> { // Changed return type
    try {
      // Validate file
      const validation = await this.validateDocument(file, documentType);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Generate file metadata
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExtension}`;
      const filePath = `documents/${userId}/${fileName}`;
      
      // Calculate checksum
      const checksum = this.generateChecksum(file.buffer);
      
      // Upload to storage
      const storageProvider = this.storageProviders.local; // Default to local
      const url = await storageProvider.upload(file, filePath);

             // Create document record
       const document = await prisma.document.create({
         data: {
           name: fileName,
           originalName: file.originalname,
           type: file.mimetype,
           size: file.size,
           url,
           checksum,
           uploadedById: userId,
           requestId,
           isRequired: this.isRequiredDocument(documentType),
         } as any,
       });

      return document;
    } catch (error) {
      console.error('Document upload error:', error);
      throw new Error('Failed to upload document');
    }
  }

  async validateDocument(
    file: any, // Changed from Express.Multer.File
    documentType?: DocumentType
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!file) {
      errors.push('No file provided');
      return { isValid: false, errors };
    }

    // Basic validations
    if (file.size > 50 * 1024 * 1024) { // 50MB max
      errors.push('File size exceeds maximum limit (50MB)');
    }

    // Type-specific validations
    if (documentType && this.validationRules[documentType]) {
      const rules = this.validationRules[documentType];
      
      if (file.size > rules.maxSize) {
        errors.push(`File size exceeds limit for ${documentType}`);
      }
      
      if (!rules.allowedTypes.includes(file.mimetype)) {
        errors.push(`File type not allowed for ${documentType}`);
      }
    }

    // Additional validations (malware scan, etc.)
    const isSafe = await this.scanForMalware(file);
    if (!isSafe) {
      errors.push('File failed security scan');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  async verifyDocument(
    documentId: string,
    verifiedById: string,
    status: DocumentStatus,
    notes?: string
  ): Promise<any> {
         return await prisma.document.update({
       where: { id: documentId },
       data: {
         isVerified: status === 'VALIDATED',
         verifiedById: status === 'VALIDATED' ? verifiedById : null,
         verifiedAt: status === 'VALIDATED' ? new Date() : null,
       } as any,
     });
  }

  async generateFromTemplate(
    templateId: string,
    data: Record<string, any>,
    userId: string
  ): Promise<any> {
    // TODO: Implement template-based document generation
    throw new Error('Template generation not implemented');
  }

  async extractDataFromDocument(documentId: string): Promise<any> {
    // TODO: Implement OCR data extraction
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new Error('Document not found');
    }

    // Placeholder for OCR integration
    return {
      extractedData: {},
      confidence: 0,
      processingTime: 0,
    };
  }

  async getSignedUrl(documentId: string, expiresIn: number = 3600): Promise<string> {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new Error('Document not found');
    }

    // Generate temporary signed URL
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + expiresIn * 1000);

    // Store token in cache/database for validation
    // This is a simplified implementation
    return `${document.url}?token=${token}&expires=${expires.getTime()}`;
  }

  async delete(documentId: string, deletedById: string): Promise<void> {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new Error('Document not found');
    }

         // Soft delete
     await prisma.document.update({
       where: { id: documentId },
       data: {
         updatedAt: new Date(),
       } as any,
     });

    // TODO: Remove from storage
  }

  // Private helper methods
  private generateChecksum(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer as any).digest('hex'); // Fixed type
  }

  private async scanForMalware(file: any): Promise<boolean> {
    // TODO: Implement malware scanning
    // For now, just check file type and size
    const dangerousTypes = ['application/x-executable', 'application/x-msdownload'];
    return !dangerousTypes.includes(file.mimetype);
  }

  private isImageType(mimetype: string): boolean {
    return mimetype.startsWith('image/');
  }

  private isRequiredDocument(documentType?: DocumentType): boolean {
    const requiredTypes: DocumentType[] = ['PHOTO_IDENTITE', 'ACTE_NAISSANCE'];
    return documentType ? requiredTypes.includes(documentType) : false;
  }

  private async getRequiredDocuments(serviceType: string): Promise<DocumentType[]> {
    try {
      const serviceConfig = await prisma.serviceConfig.findFirst({
        where: { serviceType: { equals: serviceType as any } }, // Fixed type
      });

             return serviceConfig?.requiredDocs as DocumentType[] || [];
    } catch (error) {
      console.error('Error fetching required documents:', error);
      return [];
    }
  }
} 