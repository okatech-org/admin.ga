export interface DomainConfig {
  id: string;
  domain: string;
  subdomain?: string;
  applicationId: string;
  status: DomainStatus;
  dnsRecords: DNSRecord[];
  sslCertificate?: SSLCertificate;
  deploymentConfig: DeploymentConfig;
  createdAt: Date;
  updatedAt: Date;
  verifiedAt?: Date;
}

export type DomainStatus =
  | 'pending'
  | 'dns_configured'
  | 'ssl_pending'
  | 'active'
  | 'error'
  | 'suspended';

export interface DNSRecord {
  id: string;
  type: DNSRecordType;
  name: string;
  value: string;
  ttl: number;
  priority?: number;
  status: 'pending' | 'active' | 'error';
}

export type DNSRecordType = 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'PTR';

export interface SSLCertificate {
  id: string;
  domain: string;
  issuer: string;
  validFrom: Date;
  validTo: Date;
  status: 'pending' | 'active' | 'expired' | 'error';
  autoRenew: boolean;
}

export interface DeploymentConfig {
  serverId: string;
  serverType: 'vps' | 'dedicated' | 'cloud';
  ipAddress: string;
  port: number;
  sshConfig?: {
    username: string;
    keyPath: string;
    port: number;
  };
  nginxConfig?: NginxConfig;
  dockerConfig?: DockerConfig;
}

export interface NginxConfig {
  serverName: string;
  documentRoot: string;
  proxyPass?: string;
  sslEnabled: boolean;
  certPath?: string;
  keyPath?: string;
  customConfig?: string;
}

export interface DockerConfig {
  containerName: string;
  image: string;
  port: number;
  environmentVars: Record<string, string>;
  volumes: string[];
  networks: string[];
}

export interface NetimDNSConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
  domain: string;
}

export interface DomainVerification {
  domain: string;
  method: 'dns' | 'file' | 'email';
  token: string;
  status: 'pending' | 'verified' | 'failed';
  attempts: number;
  lastAttempt?: Date;
}

export interface ServerHealth {
  serverId: string;
  status: 'online' | 'offline' | 'maintenance';
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  lastCheck: Date;
}

export interface DeploymentLog {
  id: string;
  domainId: string;
  action: DeploymentAction;
  status: 'running' | 'success' | 'failed';
  startTime: Date;
  endTime?: Date;
  logs: string[];
  error?: string;
}

export type DeploymentAction =
  | 'dns_setup'
  | 'ssl_provision'
  | 'nginx_config'
  | 'application_deploy'
  | 'health_check';

export interface ApplicationMapping {
  applicationId: string;
  name: string;
  domain: string;
  path: string;
  port: number;
  environment: 'development' | 'staging' | 'production';
  buildCommand?: string;
  startCommand: string;
  envVars: Record<string, string>;
}

export interface DomainAnalytics {
  domain: string;
  visits: number;
  uniqueVisitors: number;
  pageViews: number;
  bounceRate: number;
  averageSessionDuration: number;
  topPages: Array<{
    path: string;
    views: number;
  }>;
  period: {
    start: Date;
    end: Date;
  };
}
