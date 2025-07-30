import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  AlertTriangle,
  X,
  Info
} from 'lucide-react';
import { ConfigurationImportResult } from '@/lib/types/configuration';

interface ConfigurationImportExportProps {
  onExport: () => Promise<void>;
  onImport: (file: File) => Promise<ConfigurationImportResult>;
  isExporting: boolean;
  isImporting: boolean;
  className?: string;
}

export function ConfigurationImportExport({
  onExport,
  onImport,
  isExporting,
  isImporting,
  className = ""
}: ConfigurationImportExportProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [importResult, setImportResult] = useState<ConfigurationImportResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find(file => file.type === 'application/json' || file.name.endsWith('.json'));

    if (jsonFile) {
      setSelectedFile(jsonFile);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const handleImport = useCallback(async () => {
    if (!selectedFile) return;

    setImportResult(null);
    const result = await onImport(selectedFile);
    setImportResult(result);

    if (result.success) {
      setSelectedFile(null);
    }
  }, [selectedFile, onImport]);

  const handleExport = useCallback(async () => {
    await onExport();
  }, [onExport]);

  const resetImport = useCallback(() => {
    setSelectedFile(null);
    setImportResult(null);
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-500" />
            Exporter la configuration
          </CardTitle>
          <CardDescription>
            Téléchargez la configuration actuelle sous forme de fichier JSON
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Configuration système complète</p>
              <p className="text-xs text-muted-foreground">
                Inclut tous les paramètres, intégrations et workflows
              </p>
            </div>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="min-w-[120px]"
            >
              {isExporting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Export...</span>
                </div>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-500" />
            Importer une configuration
          </CardTitle>
          <CardDescription>
            Importez une configuration depuis un fichier JSON précédemment exporté
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drag & Drop Zone */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 text-center transition-colors
              ${isDragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-gray-300 dark:border-gray-600'}
              ${selectedFile ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-2">
              {selectedFile ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-8 w-8 text-green-500" />
                  <div className="text-left">
                    <p className="font-medium text-green-700 dark:text-green-300">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetImport}
                    className="ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-sm font-medium">
                      Glissez-déposez votre fichier JSON ici
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ou cliquez pour sélectionner un fichier
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* File Input */}
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelect}
              className="flex-1"
            />
            <Button
              onClick={handleImport}
              disabled={!selectedFile || isImporting}
              className="min-w-[120px]"
            >
              {isImporting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Import...</span>
                </div>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Importer
                </>
              )}
            </Button>
          </div>

          {/* Import Progress */}
          {isImporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Importation en cours...</span>
                <span>Validation des données</span>
              </div>
              <Progress value={65} className="w-full" />
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <div className="space-y-3">
              {importResult.success ? (
                <Alert className="border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>Configuration importée avec succès!</span>
                    <Badge variant="outline" className="text-green-600">
                      Succès
                    </Badge>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Échec de l'importation</span>
                        <Badge variant="destructive">
                          Erreur
                        </Badge>
                      </div>
                      {importResult.warnings && importResult.warnings.length > 0 && (
                        <ul className="text-sm space-y-1 mt-2">
                          {importResult.warnings.map((warning, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-red-500">•</span>
                              <span>{warning}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {importResult.conflicts && importResult.conflicts.length > 0 && (
                <Alert className="border-yellow-200">
                  <Info className="h-4 w-4 text-yellow-500" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <span className="font-medium">Conflits détectés:</span>
                      <ul className="text-sm space-y-1">
                        {importResult.conflicts.map((conflict, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-yellow-500">•</span>
                            <span>{conflict.field}: {conflict.message}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Format Information */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Format de fichier supporté:</p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Fichiers JSON exportés depuis Administration.GA</li>
                  <li>• Taille maximale: 5 MB</li>
                  <li>• Extensions: .json</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
