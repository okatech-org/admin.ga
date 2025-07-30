// Types pour la gestion complète des clients ADMIN.GA

export interface ClientThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  faviconUrl: string;
  customCss: string;
  fontFamily: string;
  headerImage: string;
  footerText: string;
  darkMode: boolean;
  animations: boolean;
}

export interface ServiceConfig {
  id: string;
  name: string;
  enabled: boolean;
  price: number;
  settings: Record<string, any>;
  category: 'IDENTITE' | 'ETAT_CIVIL' | 'TRANSPORT' | 'FISCAL' | 'SOCIAL' | 'SECURITE';
  description: string;
  icon: string;
  dependencies: string[];
  sla: {
    processingTime: number; // en heures
    availability: number; // pourcentage
  };
}

export interface CardConfig {
  type: 'PHYSICAL' | 'VIRTUAL';
  enabled: boolean;
  design: {
    template: 'standard' | 'premium' | 'government' | 'modern' | 'classic' | 'minimal';
    colors: string[];
    logo: string;
    backgroundImage: string;
    customFields: Array<{
      name: string;
      type: 'text' | 'image' | 'qr' | 'barcode';
      position: { x: number; y: number };
      required: boolean;
    }>;
  };
  features: Array<'NFC' | 'QR_CODE' | 'MAGNETIC_STRIPE' | 'HOLOGRAM' | 'BIOMETRIC' | 'OTP' | 'GEOLOCATION'>;
  pricing: {
    setupFee: number;
    monthlyFee: number;
    transactionFee: number;
    bulkDiscount: Array<{
      minQuantity: number;
      discountPercent: number;
    }>;
  };
  production: {
    supplier: string;
    leadTime: number; // en jours
    minOrderQuantity: number;
  };
}

export interface BillingConfig {
  cycle: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  paymentMethods: Array<'AIRTEL_MONEY' | 'MOOV_MONEY' | 'BANK_TRANSFER' | 'CASH' | 'CHECK' | 'CARD'>;
  currency: 'XAF' | 'EUR' | 'USD';
  taxRate: number;
  invoiceTemplate: 'standard' | 'detailed' | 'government';
  autoRenew: boolean;
  reminderDays: number[];
  latePaymentFee: number;
  earlyPaymentDiscount: number;
  paymentTerms: number; // jours
}

export interface UserPermission {
  userId: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'AGENT' | 'USER';
  department: string;
  permissions: Array<
    'MANAGE_USERS' | 'VIEW_REPORTS' | 'PROCESS_REQUESTS' | 'MANAGE_BILLING' |
    'CONFIGURE_SERVICES' | 'VIEW_ANALYTICS' | 'MANAGE_SUPPORT' | 'SYSTEM_CONFIG'
  >;
  lastActivity: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  loginHistory: Array<{
    timestamp: string;
    ip: string;
    userAgent: string;
    success: boolean;
  }>;
  restrictions: {
    ipWhitelist: string[];
    timeRestrictions: Array<{
      day: string;
      startTime: string;
      endTime: string;
    }>;
    maxSessions: number;
  };
}

export interface TechnicalConfig {
  apiKeys: Record<string, {
    key: string;
    permissions: string[];
    expiryDate: string;
    lastUsed: string;
    rateLimit: number;
  }>;
  webhookEndpoints: Array<{
    url: string;
    events: string[];
    secret: string;
    active: boolean;
    lastResponse: {
      status: number;
      timestamp: string;
    };
  }>;
  ipWhitelist: string[];
  sslConfig: {
    enabled: boolean;
    certificate: string;
    expiryDate: string;
    autoRenew: boolean;
  };
  backupConfig: {
    frequency: 'HOURLY' | 'DAILY' | 'WEEKLY';
    retention: number;
    location: 'LOCAL' | 'CLOUD' | 'HYBRID';
    encryption: boolean;
    compression: boolean;
  };
  monitoring: {
    uptime: boolean;
    performance: boolean;
    errorTracking: boolean;
    alertThresholds: {
      responseTime: number;
      errorRate: number;
      cpuUsage: number;
      memoryUsage: number;
    };
  };
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'ESCALATED';
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
  category: 'TECHNICAL' | 'BILLING' | 'FORMATION' | 'MATERIEL' | 'INTEGRATION' | 'GENERAL';
  tags: string[];
  attachments: Array<{
    filename: string;
    url: string;
    size: number;
    mimeType: string;
  }>;
  timeline: Array<{
    timestamp: string;
    action: string;
    actor: string;
    details: string;
  }>;
  resolution: {
    resolvedAt?: string;
    resolution?: string;
    satisfactionRating?: number;
    feedback?: string;
  };
}

export interface ClientAnalytics {
  overview: {
    totalRequests: number;
    averageProcessingTime: number;
    satisfactionScore: number;
    revenue: {
      monthly: number;
      quarterly: number;
      yearly: number;
    };
  };
  trends: {
    requestsGrowth: number;
    revenueGrowth: number;
    efficiencyImprovement: number;
  };
  serviceUsage: Array<{
    serviceId: string;
    serviceName: string;
    requestCount: number;
    revenue: number;
    averageTime: number;
    satisfactionScore: number;
  }>;
  userActivity: {
    activeUsers: number;
    newUsers: number;
    retentionRate: number;
    sessionDuration: number;
  };
  performance: {
    uptime: number;
    averageResponseTime: number;
    errorRate: number;
    throughput: number;
  };
  geographical: Array<{
    region: string;
    requestCount: number;
    users: number;
  }>;
}

export interface ClientConfiguration {
  clientId: string;
  lastUpdated: string;
  version: string;
  theme: ClientThemeConfig;
  services: ServiceConfig[];
  cards: {
    physical: CardConfig;
    virtual: CardConfig;
  };
  billing: BillingConfig;
  users: UserPermission[];
  technical: TechnicalConfig;
  support: {
    tickets: SupportTicket[];
    contactInfo: {
      primaryContact: string;
      technicalContact: string;
      billingContact: string;
      escalationContact: string;
    };
    sla: {
      responseTime: number; // en heures
      resolutionTime: number; // en heures
      availability: number; // pourcentage
    };
  };
  analytics: ClientAnalytics;
}

// Types pour les actions de gestion
export interface ConfigurationAction {
  type: 'UPDATE_THEME' | 'UPDATE_SERVICES' | 'UPDATE_BILLING' | 'UPDATE_USERS' | 'UPDATE_TECHNICAL';
  payload: any;
  timestamp: string;
  actor: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface SaveResult {
  success: boolean;
  errors?: ValidationError[];
  warnings?: string[];
  message: string;
}

// Utilitaires pour la validation
export interface ConfigurationValidator {
  validateTheme(config: ClientThemeConfig): ValidationError[];
  validateServices(services: ServiceConfig[]): ValidationError[];
  validateBilling(config: BillingConfig): ValidationError[];
  validateUsers(users: UserPermission[]): ValidationError[];
  validateTechnical(config: TechnicalConfig): ValidationError[];
}
