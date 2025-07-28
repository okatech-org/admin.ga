/* @ts-nocheck */
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { useAuth } from '@/hooks/use-auth';
import { UploadDropzone } from '@/lib/uploadthing';
import { 
  Upload, 
  FileText, 
  Eye, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  Download,
  Plus
} from 'lucide-react';

const DOCUMENT_TYPES = {
  PHOTO_IDENTITE: 'Photo d\'identité',
  ACTE_NAISSANCE: 'Acte de naissance',
  JUSTIFICATIF_DOMICILE: 'Justificatif de domicile',
  DIPLOME: 'Diplôme',
  ATTESTATION_TRAVAIL: 'Attestation de travail',
  CASIER_JUDICIAIRE: 'Casier judiciaire',
  CERTIFICAT_MEDICAL: 'Certificat médical',
  ACTE_MARIAGE: 'Acte de mariage',
  CNI_RECTO: 'CNI Recto',
  CNI_VERSO: 'CNI Verso',
  PASSEPORT: 'Passeport',
  PERMIS_CONDUIRE: 'Permis de conduire'
};

const REQUIRED_DOCUMENTS = [
  'PHOTO_IDENTITE',
  'ACTE_NAISSANCE',
  'JUSTIFICATIF_DOMICILE'
];

export default function DocumentsPage() {
  const { user, isLoading } = useAuth('USER');
  const router = useRouter();
  const [documents, setDocuments] = useState([
    {
      id: '1',
      type: 'PHOTO_IDENTITE',
      name: 'Photo d\'identité',
      originalName: 'photo_jean_dupont.jpg',
      url: 'https://via.placeholder.com/400x300',
      size: 245760,
      mimeType: 'image/jpeg',
      status: 'VALIDATED',
      createdAt: new Date('2024-01-10'),
      validatedAt: new Date('2024-01-11'),
      validator: 'Paul OBIANG'
    },
    {
      id: '2',
      type: 'ACTE_NAISSANCE',
      name: 'Acte de naissance',
      originalName: 'acte_naissance_jean.pdf',
      url: '#',
      size: 892430,
      mimeType: 'application/pdf',
      status: 'PENDING',
      createdAt: new Date('2024-01-12')
    },
    {
      id: '3',
      type: 'JUSTIFICATIF_DOMICILE',
      name: 'Justificatif de domicile',
      originalName: 'facture_seeg_janvier.pdf',
      url: '#',
      size: 156890,
      mimeType: 'application/pdf',
      status: 'REJECTED',
      createdAt: new Date('2024-01-08'),
      rejectionReason: 'Document trop ancien, merci de fournir une facture de moins de 3 mois'
    }
  ]);
  
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VALIDATED':
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Validé
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Rejeté
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUploadComplete = (res: any) => {
    if (res && res.length > 0) {
      const uploadedFile = res[0];
      const newDocument = {
        id: Date.now().toString(),
        type: selectedDocumentType,
        name: DOCUMENT_TYPES[selectedDocumentType as keyof typeof DOCUMENT_TYPES],
        originalName: uploadedFile.name,
        url: uploadedFile.url,
        size: uploadedFile.size,
        mimeType: uploadedFile.type || 'application/octet-stream',
        status: 'PENDING',
        createdAt: new Date()
      };

      setDocuments(prev => [...prev, newDocument]);
      setUploadDialogOpen(false);
      setSelectedDocumentType('');
      toast.success('Document uploadé avec succès !');
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    toast.success('Document supprimé');
  };

  const getCompletionPercentage = () => {
    const validatedRequired = documents.filter(doc => 
      REQUIRED_DOCUMENTS.includes(doc.type) && doc.status === 'VALIDATED'
    ).length;
    return (validatedRequired / REQUIRED_DOCUMENTS.length) * 100;
  };

  const missingRequiredDocs = REQUIRED_DOCUMENTS.filter(docType => 
    !documents.find(doc => doc.type === docType && doc.status === 'VALIDATED')
  );

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Mes documents</h1>
          <p className="text-muted-foreground">
            Gérez vos documents personnels et justificatifs
          </p>
        </div>

        {/* Progress */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Progression des documents</CardTitle>
              <Badge variant="secondary">
                {Math.round(getCompletionPercentage())}% complété
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div 
              className="progress-bar-container space-y-4"
              data-progress={getCompletionPercentage()}
            >
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="progress-bar bg-primary h-2 rounded-full transition-all duration-300"></div>
              </div>
              
              {missingRequiredDocs.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Documents obligatoires manquants : {' '}
                    {missingRequiredDocs.map(docType => 
                      DOCUMENT_TYPES[docType as keyof typeof DOCUMENT_TYPES]
                    ).join(', ')}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upload Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Documents uploadés</h2>
          
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Uploader un document</DialogTitle>
                <DialogDescription>
                  Sélectionnez le type de document puis uploadez le fichier
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Type de document</Label>
                  <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DOCUMENT_TYPES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                          {REQUIRED_DOCUMENTS.includes(key) && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedDocumentType && (
                  <div className="space-y-2">
                    <Label>Fichier</Label>
                    <UploadDropzone
                      endpoint="documentUploader"
                      onClientUploadComplete={handleUploadComplete}
                      onUploadError={(error: Error) => {
                        toast.error(`Erreur: ${error.message}`);
                      }}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6"
                    />
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Documents List */}
        <div className="grid gap-4">
          {documents.map((document) => (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium">{document.name}</h3>
                        {REQUIRED_DOCUMENTS.includes(document.type) && (
                          <Badge variant="outline" className="text-xs">
                            Obligatoire
                          </Badge>
                        )}
                        {getStatusBadge(document.status)}
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Fichier: {document.originalName}</p>
                        <p>
                          {formatFileSize(document.size)} • {document.mimeType} • 
                          Uploadé le {document.createdAt.toLocaleDateString('fr-FR')}
                        </p>
                        
                        {document.status === 'VALIDATED' && document.validatedAt && (
                          <p className="text-green-600">
                            Validé le {document.validatedAt.toLocaleDateString('fr-FR')} 
                            {document.validator && ` par ${document.validator}`}
                          </p>
                        )}
                        
                        {document.status === 'REJECTED' && document.rejectionReason && (
                          <p className="text-red-600">
                            Motif de rejet: {document.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Voir
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                    
                    {document.status !== 'VALIDATED' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteDocument(document.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {documents.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">Aucun document uploadé</h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par uploader vos documents obligatoires
                </p>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter mon premier document
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Help */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aide et conseils</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                <p>
                  <strong>Documents obligatoires</strong> : Photo d&apos;identité, acte de naissance et justificatif de domicile sont requis pour valider votre profil.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                <p>
                  <strong>Formats acceptés</strong> : PDF, JPG, PNG. Taille maximale : 4 MB par fichier.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                <p>
                  <strong>Qualité</strong> : Assurez-vous que vos documents sont lisibles et de bonne qualité.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                <p>
                  <strong>Validation</strong> : Vos documents seront vérifiés par nos agents sous 48h ouvrables.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}