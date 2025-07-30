export interface GeneralConfig {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  defaultLanguage: 'fr' | 'en';
  timezone: string;
}

export interface NotificationConfig {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  whatsappEnabled: boolean;
  defaultEmailTemplate: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  smsProvider: 'Airtel' | 'Moov';
  smsApiKey: string;
}

export interface SecurityConfig {
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSymbols: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  twoFactorEnabled: boolean;
  ipWhitelist: string[];
  securityHeaders: boolean;
}

export interface PerformanceConfig {
  cacheEnabled: boolean;
  cacheDuration: number;
  compressionEnabled: boolean;
  cdnEnabled: boolean;
  cdnUrl: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  databaseBackupSchedule: 'hourly' | 'daily' | 'weekly';
  logRetentionDays: number;
}

export interface IntegrationsConfig {
  analyticsEnabled: boolean;
  analyticsProvider: 'internal' | 'google_analytics' | 'matomo';
  paymentGateway: 'airtel_money' | 'moov_money' | 'stripe';
  documentSignature: 'docusign' | 'adobe_sign' | 'internal';
  identityVerification: 'gabonese_id' | 'biometric' | 'manual';
  mapProvider: 'openstreetmap' | 'google_maps' | 'mapbox';
  videoConferencing: 'zoom' | 'teams' | 'internal';
}

export interface WorkflowConfig {
  autoAssignment: boolean;
  escalationEnabled: boolean;
  escalationThreshold: number;
  reminderSchedule: number;
  approvalWorkflow: boolean;
  documentValidation: 'manual' | 'automatic' | 'hybrid';
  qualityControl: boolean;
}

export interface SystemConfiguration {
  general: GeneralConfig;
  notifications: NotificationConfig;
  security: SecurityConfig;
  performance: PerformanceConfig;
  integrations: IntegrationsConfig;
  workflow: WorkflowConfig;
}

export interface ConfigurationValidationError {
  field: string;
  message: string;
  section: keyof SystemConfiguration;
}

export interface ConfigurationApiResponse {
  success: boolean;
  data?: SystemConfiguration;
  errors?: ConfigurationValidationError[];
  message?: string;
}

export interface ConfigurationState {
  config: SystemConfiguration;
  isLoading: boolean;
  isSaving: boolean;
  isExporting: boolean;
  isImporting: boolean;
  unsavedChanges: boolean;
  errors: ConfigurationValidationError[];
  lastSaved: Date | null;
}

// Types pour l'export/import
export interface ConfigurationExport {
  version: string;
  exportDate: string;
  configuration: SystemConfiguration;
  metadata: {
    exportedBy: string;
    platform: string;
    checksum: string;
  };
}

export interface ConfigurationImportResult {
  success: boolean;
  importedConfig?: SystemConfiguration;
  conflicts?: ConfigurationValidationError[];
  warnings?: string[];
}
