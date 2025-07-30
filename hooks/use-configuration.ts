import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  SystemConfiguration,
  ConfigurationState,
  ConfigurationValidationError,
  ConfigurationImportResult
} from '@/lib/types/configuration';
import { ConfigurationApiService } from '@/lib/services/configuration-api.service';
import { ConfigurationValidationService } from '@/lib/services/configuration-validation.service';

// Configuration par défaut pour éviter les erreurs d'accès aux propriétés
const defaultConfiguration: SystemConfiguration = {
  general: {
    siteName: 'Administration Gabonaise',
    siteDescription: 'Plateforme unifiée des démarches administratives du Gabon',
    defaultLanguage: 'fr',
    timezone: 'Africa/Libreville',
    maintenanceMode: false,
    allowRegistration: true
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: true,
    whatsappEnabled: false,
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    smsProvider: 'Airtel'
  },
  security: {
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    twoFactorEnabled: false
  },
  performance: {
    cacheEnabled: true,
    cacheDuration: 3600,
    compressionEnabled: true,
    cdnEnabled: false,
    maxFileSize: 10,
    allowedFileTypes: ['pdf', 'jpg', 'png', 'docx'],
    databaseBackupSchedule: 'daily',
    logRetentionDays: 30
  },
  integrations: {
    paymentGateway: 'airtel_money',
    documentSignature: 'internal',
    identityVerification: 'gabonese_id',
    analyticsEnabled: true,
    analyticsProvider: 'internal',
    mapProvider: 'openstreetmap'
  },
  workflow: {
    autoAssignment: true,
    escalationEnabled: true,
    escalationThreshold: 24,
    reminderSchedule: 12,
    approvalWorkflow: true,
    documentValidation: 'manual',
    qualityControl: true
  }
} as SystemConfiguration;

export function useConfiguration() {
  const [state, setState] = useState<ConfigurationState>({
    config: defaultConfiguration, // Utilise la configuration par défaut au lieu d'un objet vide
    isLoading: true,
    isSaving: false,
    isExporting: false,
    isImporting: false,
    unsavedChanges: false,
    errors: [],
    lastSaved: null
  });

  // Chargement initial de la configuration
  useEffect(() => {
    loadConfiguration();
  }, []);

  // Chargement de la configuration depuis l'API
  const loadConfiguration = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, errors: [] }));

    try {
      const response = await ConfigurationApiService.loadConfiguration();

      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          config: response.data!,
          isLoading: false,
          unsavedChanges: false,
          errors: [],
          lastSaved: new Date()
        }));
        toast.success('Configuration chargée avec succès');
      } else {
        // En cas d'échec de chargement, utilise la configuration par défaut
        setState(prev => ({
          ...prev,
          config: defaultConfiguration,
          isLoading: false,
          errors: response.errors || []
        }));
        toast.error(response.message || 'Erreur lors du chargement - configuration par défaut utilisée');
      }
    } catch (error) {
      // En cas d'erreur réseau, utilise la configuration par défaut
      setState(prev => ({
        ...prev,
        config: defaultConfiguration,
        isLoading: false,
        errors: [{
          field: 'general',
          message: 'Erreur réseau lors du chargement - configuration par défaut utilisée',
          section: 'general'
        }]
      }));
      toast.error('Erreur de connexion - configuration par défaut utilisée');
    }
  }, []);

  // Mise à jour d'une section de configuration
  const updateConfig = useCallback((section: keyof SystemConfiguration, key: string, value: any) => {
    setState(prev => {
      const newConfig = {
        ...prev.config,
        [section]: {
          ...prev.config[section],
          [key]: value
        }
      };

      // Validation en temps réel
      const sectionErrors = ConfigurationValidationService.getErrorsBySection(
        ConfigurationValidationService.validateComplete(newConfig),
        section
      );

      // Filtrer les erreurs pour enlever celles de cette section et ajouter les nouvelles
      const otherErrors = prev.errors.filter(error => error.section !== section);
      const allErrors = [...otherErrors, ...sectionErrors];

      return {
        ...prev,
        config: newConfig,
        unsavedChanges: true,
        errors: allErrors
      };
    });
  }, []);

  // Sauvegarde de la configuration
  const saveConfiguration = useCallback(async () => {
    setState(prev => ({ ...prev, isSaving: true }));

    try {
      // Validation complète avant sauvegarde
      const validationErrors = ConfigurationValidationService.validateComplete(state.config);
      const criticalErrors = ConfigurationValidationService.getCriticalErrors(validationErrors);

      if (criticalErrors.length > 0) {
        setState(prev => ({
          ...prev,
          isSaving: false,
          errors: validationErrors
        }));
        toast.error('Erreurs critiques détectées. Veuillez corriger avant de sauvegarder.');
        return { success: false, errors: validationErrors };
      }

      // Création d'un backup automatique avant sauvegarde
      await ConfigurationApiService.createBackup(state.config);

      const response = await ConfigurationApiService.saveConfiguration(state.config);

      if (response.success) {
        setState(prev => ({
          ...prev,
          isSaving: false,
          unsavedChanges: false,
          lastSaved: new Date(),
          errors: validationErrors.filter(err => !criticalErrors.includes(err)) // Garder les warnings non-critiques
        }));
        toast.success('Configuration sauvegardée avec succès');
        return { success: true };
      } else {
        setState(prev => ({
          ...prev,
          isSaving: false,
          errors: response.errors || []
        }));
        toast.error(response.message || 'Erreur lors de la sauvegarde');
        return { success: false, errors: response.errors };
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSaving: false,
        errors: [{
          field: 'general',
          message: 'Erreur réseau lors de la sauvegarde',
          section: 'general'
        }]
      }));
      toast.error('Erreur de connexion lors de la sauvegarde');
      return { success: false };
    }
  }, [state.config]);

  // Export de la configuration
  const exportConfiguration = useCallback(async () => {
    setState(prev => ({ ...prev, isExporting: true }));

    try {
      await ConfigurationApiService.exportConfiguration(state.config);
      setState(prev => ({ ...prev, isExporting: false }));
    } catch (error) {
      setState(prev => ({ ...prev, isExporting: false }));
      toast.error('Erreur lors de l\'export');
    }
  }, [state.config]);

  // Import de configuration
  const importConfiguration = useCallback(async (file: File): Promise<ConfigurationImportResult> => {
    setState(prev => ({ ...prev, isImporting: true }));

    try {
      const result = await ConfigurationApiService.importConfiguration(file);

      if (result.success && result.importedConfig) {
        setState(prev => ({
          ...prev,
          config: result.importedConfig!,
          isImporting: false,
          unsavedChanges: true,
          errors: []
        }));
        toast.success('Configuration importée avec succès. N\'oubliez pas de sauvegarder.');
      } else {
        setState(prev => ({
          ...prev,
          isImporting: false,
          errors: result.conflicts || []
        }));
        toast.error('Erreur lors de l\'import de la configuration');
      }

      return result;
    } catch (error) {
      setState(prev => ({ ...prev, isImporting: false }));
      toast.error('Erreur lors de l\'import');
      return { success: false, warnings: ['Erreur lors de l\'import'] };
    }
  }, []);

  // Réinitialisation aux valeurs par défaut
  const resetToDefaults = useCallback(async () => {
    try {
      const response = await ConfigurationApiService.resetToDefaults();

      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          config: response.data!,
          unsavedChanges: true,
          errors: []
        }));
        toast.success('Configuration réinitialisée aux valeurs par défaut');
      } else {
        toast.error('Erreur lors de la réinitialisation');
      }
    } catch (error) {
      toast.error('Erreur lors de la réinitialisation');
    }
  }, []);

  // Test de la configuration
  const testConfiguration = useCallback(async () => {
    try {
      const results = await ConfigurationApiService.testConfiguration(state.config);

      if (results.errors.length > 0) {
        toast.error('Erreurs détectées lors du test de configuration');
        results.errors.forEach(error => toast.error(error));
      } else {
        const successTests = [];
        if (results.emailTest) successTests.push('Email');
        if (results.smsTest) successTests.push('SMS');
        if (results.databaseTest) successTests.push('Base de données');

        if (successTests.length > 0) {
          toast.success(`Tests réussis: ${successTests.join(', ')}`);
        }
      }

      return results;
    } catch (error) {
      toast.error('Erreur lors du test de configuration');
      return {
        emailTest: false,
        smsTest: false,
        databaseTest: false,
        errors: ['Erreur lors du test']
      };
    }
  }, [state.config]);

  // Validation en temps réel
  const validateSection = useCallback((section: keyof SystemConfiguration) => {
    const errors = ConfigurationValidationService.getErrorsBySection(
      ConfigurationValidationService.validateComplete(state.config),
      section
    );
    return errors;
  }, [state.config]);

  // Gestion des changements non sauvegardés
  const confirmUnsavedChanges = useCallback(() => {
    if (state.unsavedChanges) {
      return window.confirm(
        'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir continuer ?'
      );
    }
    return true;
  }, [state.unsavedChanges]);

  // Auto-sauvegarde (optionnel)
  const enableAutoSave = useCallback((interval: number = 300000) => { // 5 minutes par défaut
    const autoSaveInterval = setInterval(() => {
      if (state.unsavedChanges && !state.isSaving) {
        saveConfiguration();
      }
    }, interval);

    return () => clearInterval(autoSaveInterval);
  }, [state.unsavedChanges, state.isSaving, saveConfiguration]);

  return {
    // État
    ...state,

    // Actions
    loadConfiguration,
    updateConfig,
    saveConfiguration,
    exportConfiguration,
    importConfiguration,
    resetToDefaults,
    testConfiguration,

    // Utilitaires
    validateSection,
    confirmUnsavedChanges,
    enableAutoSave,

    // Computed properties
    hasErrors: state.errors.length > 0,
    hasCriticalErrors: ConfigurationValidationService.getCriticalErrors(state.errors).length > 0,
    isReady: !state.isLoading && Object.keys(state.config).length > 0
  };
}
