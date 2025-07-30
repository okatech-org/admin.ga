import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  AlertTriangle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { ConfigurationValidationError } from '@/lib/types/configuration';
import { ConfigurationValidationService } from '@/lib/services/configuration-validation.service';

interface ConfigurationErrorDisplayProps {
  errors: ConfigurationValidationError[];
  onFixError?: (error: ConfigurationValidationError) => void;
  showDetails?: boolean;
  className?: string;
}

export function ConfigurationErrorDisplay({
  errors,
  onFixError,
  showDetails = true,
  className = ""
}: ConfigurationErrorDisplayProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (errors.length === 0) {
    return null;
  }

  const criticalErrors = ConfigurationValidationService.getCriticalErrors(errors);
  const warningErrors = errors.filter(error => !criticalErrors.includes(error));

  const getSeverityIcon = (error: ConfigurationValidationError) => {
    const isCritical = criticalErrors.includes(error);
    return isCritical ? (
      <XCircle className="h-4 w-4 text-red-500" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
    );
  };

  const getSeverityBadge = (error: ConfigurationValidationError) => {
    const isCritical = criticalErrors.includes(error);
    return (
      <Badge variant={isCritical ? "destructive" : "outline"} className="text-xs">
        {isCritical ? "Critique" : "Attention"}
      </Badge>
    );
  };

  const getSectionLabel = (section: string) => {
    const sectionLabels: Record<string, string> = {
      general: 'Général',
      notifications: 'Notifications',
      security: 'Sécurité',
      performance: 'Performance',
      integrations: 'Intégrations',
      workflow: 'Workflows'
    };
    return sectionLabels[section] || section;
  };

  const errorsBySection = errors.reduce((acc, error) => {
    if (!acc[error.section]) {
      acc[error.section] = [];
    }
    acc[error.section].push(error);
    return acc;
  }, {} as Record<string, ConfigurationValidationError[]>);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Résumé des erreurs */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              {criticalErrors.length > 0 ? 'Erreurs de configuration détectées' : 'Avertissements de configuration'}
            </CardTitle>
            <div className="flex gap-2">
              {criticalErrors.length > 0 && (
                <Badge variant="destructive">
                  {criticalErrors.length} Critique{criticalErrors.length > 1 ? 's' : ''}
                </Badge>
              )}
              {warningErrors.length > 0 && (
                <Badge variant="outline">
                  {warningErrors.length} Attention{warningErrors.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages d'erreur par section */}
      {showDetails && (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span>Voir le détail des erreurs</span>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-4 mt-4">
            {Object.entries(errorsBySection).map(([section, sectionErrors]) => (
              <Card key={section} className="border-l-4 border-l-yellow-400">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    Section: {getSectionLabel(section)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sectionErrors.map((error, index) => (
                    <div key={`${error.field}-${index}`}
                         className="flex items-start gap-3 p-3 rounded-md bg-gray-50 dark:bg-gray-800">
                      <div className="flex-shrink-0 mt-0.5">
                        {getSeverityIcon(error)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{error.field}</span>
                          {getSeverityBadge(error)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {error.message}
                        </p>
                      </div>
                      {onFixError && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onFixError(error)}
                          className="ml-2"
                        >
                          Corriger
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Actions recommandées */}
      {criticalErrors.length > 0 && (
        <Alert className="border-red-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Action requise</AlertTitle>
          <AlertDescription>
            Des erreurs critiques empêchent la sauvegarde de la configuration.
            Veuillez corriger ces erreurs avant de continuer.
          </AlertDescription>
        </Alert>
      )}

      {criticalErrors.length === 0 && warningErrors.length > 0 && (
        <Alert className="border-yellow-200">
          <Info className="h-4 w-4" />
          <AlertTitle>Avertissements</AlertTitle>
          <AlertDescription>
            La configuration peut être sauvegardée, mais nous recommandons de
            corriger ces avertissements pour une configuration optimale.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
