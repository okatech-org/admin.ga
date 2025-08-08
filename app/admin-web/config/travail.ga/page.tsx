'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft, Settings, Shield, Users, Building2, Activity, TrendingUp, Edit, Save, X, Loader2,
  CheckCircle, AlertCircle, Palette, Globe, Monitor, Database, Lock, Key, Bell,
  FileText, Download, Upload, RefreshCw, Eye, EyeOff, Copy, Trash2, Plus,
  Server, Wifi, WifiOff, UserCheck, UserX, Clock, Calendar, BarChart3,
  Zap, Mail, Phone, MessageSquare, Webhook, Code, AlertTriangle, Info,
  HardDrive, Cloud, ShieldCheck, Search, Filter, MoreHorizontal, ExternalLink,
  Briefcase, MapPin, GraduationCap, Star, Award, Target, HeartHandshake,
  TrendingDown, FileSearch, BookOpen, LineChart, PieChart, CrownIcon as Crown,
  UserCog, Ban, CheckCircle2, XCircle, AlertOctagon, Megaphone, Send
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

type LoadingState = 'idle' | 'loading' | 'success' | 'error';
type UserRole = 'super_admin' | 'admin' | 'hr_manager' | 'recruiter' | 'employer' | 'candidate';
type JobStatus = 'draft' | 'published' | 'expired' | 'archived' | 'suspended';
type SystemStatus = 'healthy' | 'warning' | 'critical' | 'maintenance';
type BackupStatus = 'success' | 'failed' | 'in_progress' | 'scheduled';

interface SuperAdminStats {
  totalUsers: number;
  activeJobs: number;
  totalApplications: number;
  successfulHirings: number;
  platformRevenue: number;
  systemUptime: string;
  averageMatchRate: number;
  pendingApprovals: number;
  flaggedContent: number;
  reportedUsers: number;
}

interface UserManagement {
  totalUsers: number;
  activeUsers: number;
  newRegistrations: number;
  suspendedUsers: number;
  bannedUsers: number;
  pendingVerifications: number;
  roleDistribution: { role: UserRole; count: number }[];
  recentActivity: Array<{
    id: string;
    user: string;
    email: string;
    action: string;
    timestamp: Date;
    ip: string;
    status: 'success' | 'failed' | 'warning';
  }>;
}

interface JobManagement {
  totalJobs: number;
  activeJobs: number;
  pendingApproval: number;
  suspendedJobs: number;
  flaggedJobs: number;
  totalApplications: number;
  avgApplicationsPerJob: number;
  topCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  topEmployers: Array<{
    id: string;
    name: string;
    jobsPosted: number;
    successRate: number;
    rating: number;
  }>;
}

interface PlatformSecurity {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
    expirationDays: number;
  };
  fraudDetection: {
    enabled: boolean;
    sensitivity: 'low' | 'medium' | 'high';
    autoBlock: boolean;
    whitelistedIPs: string[];
  };
  contentModeration: {
    autoModeration: boolean;
    manualReview: boolean;
    aiFiltering: boolean;
    reportThreshold: number;
  };
  auditLog: boolean;
  encryptionLevel: 'standard' | 'high' | 'military';
}

interface SystemConfig {
  maintenanceMode: boolean;
  platformFees: {
    jobPostingFee: number;
    premiumListingFee: number;
    applicationFee: number;
    successFee: number;
  };
  limits: {
    maxJobsPerEmployer: number;
    maxApplicationsPerUser: number;
    maxFileSize: number;
    sessionDuration: number;
  };
  features: {
    cvUpload: boolean;
    videoInterviews: boolean;
    skillAssessments: boolean;
    backgroundChecks: boolean;
    salaryInsights: boolean;
    aiMatching: boolean;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    inApp: boolean;
  };
}

interface ModerationQueue {
  pendingJobs: Array<{
    id: string;
    title: string;
    company: string;
    submittedAt: Date;
    flags: string[];
    priority: 'low' | 'medium' | 'high';
  }>;
  reportedContent: Array<{
    id: string;
    type: 'job' | 'user' | 'application';
    content: string;
    reportedBy: string;
    reason: string;
    reportedAt: Date;
    status: 'pending' | 'reviewing' | 'resolved';
  }>;
  suspiciousActivity: Array<{
    id: string;
    userId: string;
    activityType: string;
    riskScore: number;
    detectedAt: Date;
    autoBlocked: boolean;
  }>;
}

export default function TravailGASuperAdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Configuration et données du super admin
  const [superAdminStats, setSuperAdminStats] = useState<SuperAdminStats>({
    totalUsers: 28476,
    activeJobs: 3456,
    totalApplications: 15789,
    successfulHirings: 2843,
    platformRevenue: 145789,
    systemUptime: '99.94%',
    averageMatchRate: 78.5,
    pendingApprovals: 127,
    flaggedContent: 23,
    reportedUsers: 8
  });

  const [userManagement, setUserManagement] = useState<UserManagement>({
    totalUsers: 28476,
    activeUsers: 24831,
    newRegistrations: 156,
    suspendedUsers: 45,
    bannedUsers: 12,
    pendingVerifications: 89,
    roleDistribution: [
      { role: 'candidate', count: 25432 },
      { role: 'employer', count: 2156 },
      { role: 'recruiter', count: 734 },
      { role: 'hr_manager', count: 134 },
      { role: 'admin', count: 18 },
      { role: 'super_admin', count: 2 }
    ],
    recentActivity: [
      { id: '1', user: 'Jean Mbongo', email: 'j.mbongo@email.ga', action: 'Connexion', timestamp: new Date(), ip: '192.168.1.10', status: 'success' },
      { id: '2', user: 'Marie Obame', email: 'm.obame@company.ga', action: 'Publication emploi', timestamp: new Date(), ip: '192.168.1.15', status: 'success' },
      { id: '3', user: 'Paul Ndong', email: 'p.ndong@email.ga', action: 'Candidature', timestamp: new Date(), ip: '192.168.1.20', status: 'success' }
    ]
  });

  const [jobManagement, setJobManagement] = useState<JobManagement>({
    totalJobs: 3456,
    activeJobs: 2834,
    pendingApproval: 127,
    suspendedJobs: 23,
    flaggedJobs: 8,
    totalApplications: 15789,
    avgApplicationsPerJob: 4.6,
    topCategories: [
      { category: 'Administration', count: 956, percentage: 27.7 },
      { category: 'Éducation', count: 734, percentage: 21.2 },
      { category: 'Santé', count: 623, percentage: 18.0 },
      { category: 'Technique', count: 487, percentage: 14.1 },
      { category: 'Commercial', count: 356, percentage: 10.3 }
    ],
    topEmployers: [
      { id: '1', name: 'Ministère de la Santé', jobsPosted: 89, successRate: 85.4, rating: 4.7 },
      { id: '2', name: 'Université Omar Bongo', jobsPosted: 67, successRate: 78.2, rating: 4.5 },
      { id: '3', name: 'DGDI Gabon', jobsPosted: 45, successRate: 92.1, rating: 4.8 }
    ]
  });

  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    maintenanceMode: false,
    platformFees: {
      jobPostingFee: 15000,
      premiumListingFee: 35000,
      applicationFee: 2500,
      successFee: 50000
    },
    limits: {
      maxJobsPerEmployer: 50,
      maxApplicationsPerUser: 10,
      maxFileSize: 5,
      sessionDuration: 3600
    },
    features: {
      cvUpload: true,
      videoInterviews: true,
      skillAssessments: true,
      backgroundChecks: false,
      salaryInsights: true,
      aiMatching: true
    },
    notifications: {
      email: true,
      sms: true,
      push: false,
      inApp: true
    }
  });

  const [moderationQueue, setModerationQueue] = useState<ModerationQueue>({
    pendingJobs: [
      { id: '1', title: 'Développeur Senior', company: 'TechGabon', submittedAt: new Date(), flags: ['Salaire suspect'], priority: 'medium' },
      { id: '2', title: 'Manager Commercial', company: 'VentesPro', submittedAt: new Date(), flags: ['Contenu inapproprié'], priority: 'high' }
    ],
    reportedContent: [
      { id: '1', type: 'job', content: 'Offre d\'emploi suspecte', reportedBy: 'user123', reason: 'Spam', reportedAt: new Date(), status: 'pending' },
      { id: '2', type: 'user', content: 'Profil frauduleux', reportedBy: 'user456', reason: 'Fraude', reportedAt: new Date(), status: 'reviewing' }
    ],
    suspiciousActivity: [
      { id: '1', userId: 'user789', activityType: 'Multiples connexions', riskScore: 85, detectedAt: new Date(), autoBlocked: false }
    ]
  });

  const [security, setSecurity] = useState<PlatformSecurity>({
      twoFactorAuth: true,
    sessionTimeout: 3600,
      passwordPolicy: {
      minLength: 12,
        requireUppercase: true,
        requireNumbers: true,
        requireSymbols: true,
        expirationDays: 90
      },
    fraudDetection: {
      enabled: true,
      sensitivity: 'medium',
      autoBlock: false,
      whitelistedIPs: ['192.168.1.0/24', '10.0.0.0/8']
    },
    contentModeration: {
      autoModeration: true,
      manualReview: true,
      aiFiltering: true,
      reportThreshold: 3
    },
    auditLog: true,
    encryptionLevel: 'high'
  });

  // Formatage des nombres
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const formatCurrency = (amount: number): string => {
    return `${formatNumber(amount)} FCFA`;
  };

  // Gestionnaires d'événements
  const refreshStats = async () => {
      setStatsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulation de nouvelles données
      setSuperAdminStats(prev => ({
          ...prev,
        totalApplications: prev.totalApplications + Math.floor(Math.random() * 50),
        pendingApprovals: Math.max(0, prev.pendingApprovals + Math.floor(Math.random() * 10) - 5),
        flaggedContent: Math.max(0, prev.flaggedContent + Math.floor(Math.random() * 5) - 2)
      }));

      setStatsLoading(false);
      toast.success('Statistiques mises à jour');
    } catch (error) {
      setStatsLoading(false);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleMaintenanceMode = async () => {
    setLoadingState('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSystemConfig(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }));
      setShowMaintenanceModal(false);
      setLoadingState('success');
      toast.success(`Mode maintenance ${!systemConfig.maintenanceMode ? 'activé' : 'désactivé'}`);
    } catch (error) {
      setLoadingState('error');
      toast.error('Erreur lors du changement de mode');
    }
  };

  const handleUserAction = async (action: 'suspend' | 'activate' | 'ban' | 'verify' | 'promote', userId?: string) => {
    setLoadingState('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      switch (action) {
        case 'suspend':
          setUserManagement(prev => ({
        ...prev,
            suspendedUsers: prev.suspendedUsers + 1,
            activeUsers: prev.activeUsers - 1
          }));
          toast.success('Utilisateur suspendu');
          break;
        case 'activate':
          setUserManagement(prev => ({
            ...prev,
            suspendedUsers: Math.max(0, prev.suspendedUsers - 1),
            activeUsers: prev.activeUsers + 1
          }));
          toast.success('Utilisateur activé');
          break;
        case 'ban':
          setUserManagement(prev => ({
            ...prev,
            bannedUsers: prev.bannedUsers + 1,
            activeUsers: prev.activeUsers - 1
          }));
          toast.success('Utilisateur banni');
          break;
        case 'verify':
          setUserManagement(prev => ({
            ...prev,
            pendingVerifications: Math.max(0, prev.pendingVerifications - 1),
            activeUsers: prev.activeUsers + 1
          }));
          toast.success('Utilisateur vérifié');
          break;
        case 'promote':
          toast.success('Utilisateur promu');
          break;
      }

      setLoadingState('success');
    } catch (error) {
      setLoadingState('error');
      toast.error('Erreur lors de l\'action');
    }
  };

  const handleJobAction = async (action: 'approve' | 'reject' | 'suspend' | 'feature', jobId?: string) => {
    setLoadingState('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      switch (action) {
        case 'approve':
          setJobManagement(prev => ({
        ...prev,
            pendingApproval: Math.max(0, prev.pendingApproval - 1),
            activeJobs: prev.activeJobs + 1
          }));
          setSuperAdminStats(prev => ({ ...prev, pendingApprovals: Math.max(0, prev.pendingApprovals - 1) }));
          toast.success('Offre d\'emploi approuvée');
          break;
        case 'reject':
          setJobManagement(prev => ({
        ...prev,
            pendingApproval: Math.max(0, prev.pendingApproval - 1)
          }));
          setSuperAdminStats(prev => ({ ...prev, pendingApprovals: Math.max(0, prev.pendingApprovals - 1) }));
          toast.success('Offre d\'emploi rejetée');
          break;
        case 'suspend':
          setJobManagement(prev => ({
            ...prev,
            suspendedJobs: prev.suspendedJobs + 1,
            activeJobs: Math.max(0, prev.activeJobs - 1)
          }));
          toast.success('Offre d\'emploi suspendue');
          break;
        case 'feature':
          toast.success('Offre mise en avant');
          break;
      }

      setLoadingState('success');
    } catch (error) {
      setLoadingState('error');
      toast.error('Erreur lors de l\'action');
    }
  };

  const handleModerationAction = async (action: 'approve' | 'reject' | 'escalate', itemId: string, type: 'job' | 'content' | 'activity') => {
    setLoadingState('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (type === 'content') {
        setModerationQueue(prev => ({
        ...prev,
          reportedContent: prev.reportedContent.map(item =>
            item.id === itemId ? { ...item, status: action === 'approve' ? 'resolved' : 'reviewing' } : item
          )
        }));
      }

      setSuperAdminStats(prev => ({ ...prev, flaggedContent: Math.max(0, prev.flaggedContent - 1) }));
      setLoadingState('success');
      toast.success(`Contenu ${action === 'approve' ? 'approuvé' : action === 'reject' ? 'rejeté' : 'escaladé'}`);
    } catch (error) {
      setLoadingState('error');
      toast.error('Erreur lors de la modération');
    }
  };

  const handleExportData = async (type: 'users' | 'jobs' | 'applications' | 'revenue' | 'analytics') => {
    setLoadingState('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const data = {
        type,
        timestamp: new Date().toISOString(),
        data: `Données ${type} exportées depuis TRAVAIL.GA`
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `travail-ga-${type}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setLoadingState('success');
      toast.success(`Données ${type} exportées`);
    } catch (error) {
      setLoadingState('error');
      toast.error('Erreur lors de l\'export');
    }
  };

  const handleBroadcastMessage = async (message: string, target: 'all' | 'employers' | 'candidates') => {
    setLoadingState('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoadingState('success');
      toast.success(`Message diffusé à ${target === 'all' ? 'tous les utilisateurs' : target}`);
    } catch (error) {
      setLoadingState('error');
      toast.error('Erreur lors de la diffusion');
    }
  };

  const updateSystemConfig = (updates: Partial<SystemConfig>) => {
    setSystemConfig(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const updateSecurity = (updates: Partial<PlatformSecurity>) => {
    setSecurity(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const handleSaveConfiguration = async () => {
    setLoadingState('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setHasUnsavedChanges(false);
      setIsEditMode(false);
      setLoadingState('success');
      toast.success('Configuration sauvegardée');
    } catch (error) {
      setLoadingState('error');
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Super Admin */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild className="border-red-200 text-white hover:bg-red-50 hover:text-red-600">
                <Link href="/super-admin">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Super Admin
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="border-red-200 text-white hover:bg-red-50 hover:text-red-600">
                <Link href="/admin-web">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Admin Web
                </Link>
              </Button>
              <div className="h-6 w-px bg-red-300"></div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Super Admin TRAVAIL.GA</h1>
                  <p className="text-sm text-red-100">Plateforme d'Emploi Public Gabonais</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {hasUnsavedChanges && (
                <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                  Modifications non sauvées
                </Badge>
              )}
              {systemConfig.maintenanceMode && (
                <Badge variant="destructive">Mode Maintenance</Badge>
              )}
              <div className="flex items-center space-x-2 px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                <Crown className="w-3 h-3" />
                <span>Super Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alertes */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {systemConfig.maintenanceMode && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Mode maintenance activé :</strong> TRAVAIL.GA est temporairement indisponible pour les utilisateurs.
            </AlertDescription>
          </Alert>
        )}

        {superAdminStats.flaggedContent > 0 && (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>{superAdminStats.flaggedContent} contenus signalés</strong> nécessitent votre attention dans la file de modération.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7 h-auto">
            <TabsTrigger value="dashboard" className="flex flex-col items-center space-y-1 h-16">
              <Monitor className="w-5 h-5" />
              <span className="text-xs">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex flex-col items-center space-y-1 h-16">
              <Users className="w-5 h-5" />
              <span className="text-xs">Utilisateurs</span>
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex flex-col items-center space-y-1 h-16">
              <Briefcase className="w-5 h-5" />
              <span className="text-xs">Emplois</span>
            </TabsTrigger>
            <TabsTrigger value="moderation" className="flex flex-col items-center space-y-1 h-16">
              <Shield className="w-5 h-5" />
              <span className="text-xs">Modération</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex flex-col items-center space-y-1 h-16">
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex flex-col items-center space-y-1 h-16">
              <Settings className="w-5 h-5" />
              <span className="text-xs">Système</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex flex-col items-center space-y-1 h-16">
              <Lock className="w-5 h-5" />
              <span className="text-xs">Sécurité</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Super Admin */}
          <TabsContent value="dashboard" className="space-y-6">
            <Card>
            <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-red-600" />
                    <span>Tableau de bord Super Admin</span>
                    </div>
                      <Button variant="outline" size="sm" onClick={refreshStats} disabled={statsLoading}>
                    {statsLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    Actualiser
                      </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Métriques principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold text-blue-900">{formatNumber(superAdminStats.totalUsers)}</div>
                        <div className="text-sm text-blue-600">Utilisateurs Total</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Briefcase className="w-8 h-8 text-green-600" />
                      <div>
                        <div className="text-2xl font-bold text-green-900">{formatNumber(superAdminStats.activeJobs)}</div>
                        <div className="text-sm text-green-600">Emplois Actifs</div>
                    </div>
                  </div>
                    </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-purple-600" />
                      <div>
                        <div className="text-2xl font-bold text-purple-900">{formatNumber(superAdminStats.totalApplications)}</div>
                        <div className="text-sm text-purple-600">Candidatures</div>
                  </div>
                  </div>
                </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Target className="w-8 h-8 text-orange-600" />
                    <div>
                        <div className="text-2xl font-bold text-orange-900">{formatNumber(superAdminStats.successfulHirings)}</div>
                        <div className="text-sm text-orange-600">Recrutements</div>
                    </div>
                  </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    <div>
                        <div className="text-2xl font-bold text-red-900">{superAdminStats.pendingApprovals}</div>
                        <div className="text-sm text-red-600">En Attente</div>
                      </div>
                  </div>
                      </div>
                  </div>

                {/* Métriques avancées */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Revenus Plateforme</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {formatCurrency(superAdminStats.platformRevenue)}
                      </div>
                      <div className="text-sm text-gray-600">Ce mois</div>
                      <div className="mt-4 text-sm">
                        <div className="flex justify-between">
                          <span>Frais de publication</span>
                          <span>{formatCurrency(systemConfig.platformFees.jobPostingFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Listings premium</span>
                          <span>{formatCurrency(systemConfig.platformFees.premiumListingFee)}</span>
                        </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                      <CardTitle className="text-lg">Performance Système</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Uptime</span>
                            <span className="text-sm font-medium text-green-600">{superAdminStats.systemUptime}</span>
                        </div>
                          <Progress value={99.94} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Taux de matching</span>
                            <span className="text-sm font-medium">{superAdminStats.averageMatchRate}%</span>
                      </div>
                          <Progress value={superAdminStats.averageMatchRate} className="h-2" />
                        </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                      <CardTitle className="text-lg">Actions Rapides</CardTitle>
                </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        className="w-full"
                        onClick={() => setShowMaintenanceModal(true)}
                        variant={systemConfig.maintenanceMode ? "destructive" : "default"}
                      >
                        {systemConfig.maintenanceMode ? 'Désactiver' : 'Activer'} maintenance
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => handleJobAction('approve')}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approuver emplois ({superAdminStats.pendingApprovals})
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => handleExportData('analytics')}>
                        <Download className="w-4 h-4 mr-2" />
                        Exporter rapport
                      </Button>
            </CardContent>
          </Card>
        </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des Utilisateurs */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Statistiques utilisateurs */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Total</span>
                    <span className="font-bold">{formatNumber(userManagement.totalUsers)}</span>
                    </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Actifs</span>
                    <span className="font-bold text-green-600">{formatNumber(userManagement.activeUsers)}</span>
                    </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Nouvelles inscriptions</span>
                    <span className="font-bold text-blue-600">{userManagement.newRegistrations}</span>
                    </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Suspendus</span>
                    <span className="font-bold text-orange-600">{userManagement.suspendedUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Bannis</span>
                    <span className="font-bold text-red-600">{userManagement.bannedUsers}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Répartition par rôles */}
              <Card>
                <CardHeader>
                  <CardTitle>Rôles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {userManagement.roleDistribution.map((role) => (
                    <div key={role.role} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{role.role.replace('_', ' ')}</span>
                      <Badge variant="secondary">{formatNumber(role.count)}</Badge>
                      </div>
                    ))}
                </CardContent>
              </Card>

              {/* Actions utilisateurs */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => handleUserAction('verify')}
                    disabled={userManagement.pendingVerifications === 0}
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Vérifier comptes ({userManagement.pendingVerifications})
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => handleUserAction('activate')}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Activer utilisateur
                  </Button>
                  <Button variant="outline" className="w-full text-red-600" onClick={() => handleUserAction('suspend')}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Suspendre utilisateur
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => handleExportData('users')}>
                    <Download className="w-4 h-4 mr-2" />
                    Exporter données
                  </Button>
                </CardContent>
              </Card>

              {/* Diffusion de messages */}
              <Card>
                <CardHeader>
                  <CardTitle>Communication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => handleBroadcastMessage('Message important', 'all')}
                  >
                    <Megaphone className="w-4 h-4 mr-2" />
                    Message global
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => handleBroadcastMessage('Message employeurs', 'employers')}>
                    <Send className="w-4 h-4 mr-2" />
                    Notifier employeurs
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => handleBroadcastMessage('Message candidats', 'candidates')}>
                    <Send className="w-4 h-4 mr-2" />
                    Notifier candidats
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Activité récente */}
            <Card>
              <CardHeader>
                <CardTitle>Activité récente des utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userManagement.recentActivity.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.user}</TableCell>
                        <TableCell className="text-sm text-gray-600">{activity.email}</TableCell>
                        <TableCell>{activity.action}</TableCell>
                        <TableCell>{activity.timestamp.toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell className="font-mono text-sm">{activity.ip}</TableCell>
                        <TableCell>
                          <Badge variant={activity.status === 'success' ? 'default' : 'destructive'}>
                            {activity.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm" onClick={() => setSelectedUser(activity.id)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleUserAction('suspend', activity.id)}>
                              <Ban className="w-4 h-4" />
                            </Button>
                        </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des Emplois */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques Emplois</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Total emplois</span>
                    <span className="font-bold">{formatNumber(jobManagement.totalJobs)}</span>
                    </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Actifs</span>
                    <span className="font-bold text-green-600">{formatNumber(jobManagement.activeJobs)}</span>
                    </div>
                  <div className="flex justify-between">
                    <span className="text-sm">En attente</span>
                    <span className="font-bold text-orange-600">{jobManagement.pendingApproval}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Suspendus</span>
                    <span className="font-bold text-red-600">{jobManagement.suspendedJobs}</span>
                        </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Signalés</span>
                    <span className="font-bold text-red-600">{jobManagement.flaggedJobs}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions Emplois</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => handleJobAction('approve')}
                    disabled={jobManagement.pendingApproval === 0}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approuver ({jobManagement.pendingApproval})
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => handleJobAction('feature')}>
                    <Star className="w-4 h-4 mr-2" />
                    Mettre en avant
                  </Button>
                  <Button variant="outline" className="w-full text-red-600" onClick={() => handleJobAction('suspend')}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Suspendre emploi
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => handleExportData('jobs')}>
                    <Download className="w-4 h-4 mr-2" />
                    Exporter données
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Catégories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {jobManagement.topCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{category.category}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{category.percentage}%</span>
                        <Badge variant="secondary">{category.count}</Badge>
                        </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Top employeurs */}
            <Card>
              <CardHeader>
                <CardTitle>Top Employeurs</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employeur</TableHead>
                      <TableHead>Emplois publiés</TableHead>
                      <TableHead>Taux de réussite</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobManagement.topEmployers.map((employer) => (
                      <TableRow key={employer.id}>
                        <TableCell className="font-medium">{employer.name}</TableCell>
                        <TableCell>{employer.jobsPosted}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={employer.successRate} className="w-16 h-2" />
                            <span className="text-sm">{employer.successRate}%</span>
                        </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{employer.rating}</span>
                      </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* File de Modération */}
          <TabsContent value="moderation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Emplois en attente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {moderationQueue.pendingJobs.map((job) => (
                      <div key={job.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{job.title}</h4>
                            <p className="text-sm text-gray-600">{job.company}</p>
                            <p className="text-xs text-gray-500">{job.submittedAt.toLocaleDateString('fr-FR')}</p>
                          </div>
                          <Badge variant={job.priority === 'high' ? 'destructive' : job.priority === 'medium' ? 'outline' : 'secondary'}>
                            {job.priority}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {job.flags.map((flag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {flag}
                          </Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleJobAction('approve', job.id)}>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approuver
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleJobAction('reject', job.id)}>
                            <XCircle className="w-4 h-4 mr-1" />
                            Rejeter
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contenus signalés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {moderationQueue.reportedContent.map((content) => (
                      <div key={content.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Badge variant="outline" className="mb-2">{content.type}</Badge>
                            <p className="text-sm">{content.content}</p>
                            <p className="text-xs text-gray-500">
                              Signalé par {content.reportedBy} - {content.reason}
                            </p>
                          </div>
                          <Badge variant={content.status === 'pending' ? 'destructive' : 'default'}>
                            {content.status}
                          </Badge>
                          </div>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleModerationAction('approve', content.id, 'content')}>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approuver
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleModerationAction('reject', content.id, 'content')}>
                            <XCircle className="w-4 h-4 mr-1" />
                            Rejeter
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleModerationAction('escalate', content.id, 'content')}>
                            <AlertOctagon className="w-4 h-4 mr-1" />
                            Escalader
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Activité suspecte</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Type d'activité</TableHead>
                      <TableHead>Score de risque</TableHead>
                      <TableHead>Détecté le</TableHead>
                      <TableHead>Auto-bloqué</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {moderationQueue.suspiciousActivity.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.userId}</TableCell>
                        <TableCell>{activity.activityType}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={activity.riskScore} className="w-16 h-2" />
                            <span className="text-sm font-medium">{activity.riskScore}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{activity.detectedAt.toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>
                          <Badge variant={activity.autoBlocked ? 'destructive' : 'secondary'}>
                            {activity.autoBlocked ? 'Oui' : 'Non'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleUserAction('ban', activity.userId)}>
                              <Ban className="w-4 h-4" />
                    </Button>
                  </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </CardContent>
              </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Analytics et Rapports</span>
                  <Button variant="outline" size="sm" onClick={() => handleExportData('analytics')}>
                    <Download className="w-4 h-4 mr-2" />
                    Exporter rapport complet
                  </Button>
                  </CardTitle>
                </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600">Candidatures ce mois</p>
                        <p className="text-2xl font-bold text-blue-900">{formatNumber(superAdminStats.totalApplications)}</p>
                  </div>
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-green-600">Revenus générés</p>
                        <p className="text-2xl font-bold text-green-900">{formatCurrency(superAdminStats.platformRevenue)}</p>
                    </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600">Taux de matching</p>
                        <p className="text-2xl font-bold text-purple-900">{superAdminStats.averageMatchRate}%</p>
                      </div>
                      <Target className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-600">Recrutements réussis</p>
                        <p className="text-2xl font-bold text-orange-900">{formatNumber(superAdminStats.successfulHirings)}</p>
                      </div>
                      <Award className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>
                  </div>
                </CardContent>
              </Card>
          </TabsContent>

          {/* Configuration Système */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tarification Plateforme</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Frais de publication d'emploi</Label>
                    {isEditMode ? (
                      <Input
                        type="number"
                        value={systemConfig.platformFees.jobPostingFee}
                        onChange={(e) => updateSystemConfig({
                          platformFees: { ...systemConfig.platformFees, jobPostingFee: parseInt(e.target.value) || 0 }
                        })}
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">{formatCurrency(systemConfig.platformFees.jobPostingFee)}</div>
                    )}
                  </div>
                    <div>
                    <Label>Frais listing premium</Label>
                    {isEditMode ? (
                      <Input
                        type="number"
                        value={systemConfig.platformFees.premiumListingFee}
                        onChange={(e) => updateSystemConfig({
                          platformFees: { ...systemConfig.platformFees, premiumListingFee: parseInt(e.target.value) || 0 }
                        })}
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">{formatCurrency(systemConfig.platformFees.premiumListingFee)}</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Limites Système</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Max emplois par employeur</Label>
                    {isEditMode ? (
                      <Input
                        type="number"
                        value={systemConfig.limits.maxJobsPerEmployer}
                        onChange={(e) => updateSystemConfig({
                          limits: { ...systemConfig.limits, maxJobsPerEmployer: parseInt(e.target.value) || 0 }
                        })}
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">{systemConfig.limits.maxJobsPerEmployer}</div>
                    )}
                  </div>
                  <div>
                    <Label>Taille max fichier (MB)</Label>
                    {isEditMode ? (
                      <Input
                        type="number"
                        value={systemConfig.limits.maxFileSize}
                        onChange={(e) => updateSystemConfig({
                          limits: { ...systemConfig.limits, maxFileSize: parseInt(e.target.value) || 0 }
                        })}
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">{systemConfig.limits.maxFileSize} MB</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

              <Card>
                <CardHeader>
                <CardTitle>Fonctionnalités Plateforme</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(systemConfig.features).map(([key, enabled]) => {
                    const featureNames = {
                      cvUpload: 'Upload CV',
                      videoInterviews: 'Entretiens vidéo',
                      skillAssessments: 'Tests de compétences',
                      backgroundChecks: 'Vérifications d\'antécédents',
                      salaryInsights: 'Insights salariaux',
                      aiMatching: 'Matching IA'
                    };

                    return (
                      <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                        <span className="font-medium">{featureNames[key as keyof typeof featureNames] || key}</span>
                        <Switch
                          checked={enabled}
                          onCheckedChange={(checked) => updateSystemConfig({
                            features: { ...systemConfig.features, [key]: checked }
                          })}
                          disabled={!isEditMode}
                        />
                          </div>
                    );
                  })}
                  </div>
                </CardContent>
              </Card>
          </TabsContent>

          {/* Sécurité */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité Générale</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Authentification 2FA</h4>
                      <p className="text-sm text-gray-600">Obligatoire pour tous les admins</p>
                        </div>
                    <Switch
                      checked={security.twoFactorAuth}
                      onCheckedChange={(checked) => updateSecurity({ twoFactorAuth: checked })}
                      disabled={!isEditMode}
                    />
                        </div>
                        <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Journal d'audit</h4>
                      <p className="text-sm text-gray-600">Enregistrement des actions</p>
                        </div>
                    <Switch
                      checked={security.auditLog}
                      onCheckedChange={(checked) => updateSecurity({ auditLog: checked })}
                      disabled={!isEditMode}
                    />
                        </div>
                  <div>
                    <Label>Niveau de chiffrement</Label>
                    <Select
                      value={security.encryptionLevel}
                      onValueChange={(value) => updateSecurity({ encryptionLevel: value as any })}
                      disabled={!isEditMode}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (AES-128)</SelectItem>
                        <SelectItem value="high">Élevé (AES-256)</SelectItem>
                        <SelectItem value="military">Militaire (AES-256 + RSA)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

            <Card>
              <CardHeader>
                  <CardTitle>Détection de Fraude</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Détection automatique</span>
                    <Switch
                      checked={security.fraudDetection.enabled}
                      onCheckedChange={(checked) => updateSecurity({
                        fraudDetection: { ...security.fraudDetection, enabled: checked }
                      })}
                      disabled={!isEditMode}
                    />
                  </div>
                  <div>
                    <Label>Sensibilité</Label>
                    <Select
                      value={security.fraudDetection.sensitivity}
                      onValueChange={(value) => updateSecurity({
                        fraudDetection: { ...security.fraudDetection, sensitivity: value as any }
                      })}
                      disabled={!isEditMode}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Faible</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Élevée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Blocage automatique</span>
                    <Switch
                      checked={security.fraudDetection.autoBlock}
                      onCheckedChange={(checked) => updateSecurity({
                        fraudDetection: { ...security.fraudDetection, autoBlock: checked }
                      })}
                      disabled={!isEditMode}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

              <Card>
                <CardHeader>
                <CardTitle>Modération de Contenu</CardTitle>
                </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Modération automatique</span>
                    <Switch
                      checked={security.contentModeration.autoModeration}
                      onCheckedChange={(checked) => updateSecurity({
                        contentModeration: { ...security.contentModeration, autoModeration: checked }
                      })}
                      disabled={!isEditMode}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Révision manuelle</span>
                    <Switch
                      checked={security.contentModeration.manualReview}
                      onCheckedChange={(checked) => updateSecurity({
                        contentModeration: { ...security.contentModeration, manualReview: checked }
                      })}
                      disabled={!isEditMode}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Filtrage IA</span>
                    <Switch
                      checked={security.contentModeration.aiFiltering}
                      onCheckedChange={(checked) => updateSecurity({
                        contentModeration: { ...security.contentModeration, aiFiltering: checked }
                      })}
                      disabled={!isEditMode}
                    />
                  </div>
                  <div>
                    <Label>Seuil de signalement</Label>
                    {isEditMode ? (
                      <Input
                        type="number"
                        value={security.contentModeration.reportThreshold}
                        onChange={(e) => updateSecurity({
                          contentModeration: {
                            ...security.contentModeration,
                            reportThreshold: parseInt(e.target.value) || 1
                          }
                        })}
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">{security.contentModeration.reportThreshold} signalements</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions finales */}
        <div className="flex items-center justify-between pt-6 border-t bg-white p-6 rounded-lg">
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => router.push('/admin-web')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'Admin Web
            </Button>
                  </div>

          <div className="flex items-center space-x-3">
            {hasUnsavedChanges && (
              <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                Modifications en attente
              </Badge>
            )}

            {isEditMode && (
              <>
                <Button variant="outline" onClick={() => setIsEditMode(false)} disabled={loadingState === 'loading'}>
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
                  <Button
                  onClick={handleSaveConfiguration}
                  disabled={loadingState === 'loading' || !hasUnsavedChanges}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {loadingState === 'loading' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Sauvegarder
                  </Button>
              </>
            )}

            {!isEditMode && (
              <Button onClick={() => setIsEditMode(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Modifier la configuration
              </Button>
            )}
            </div>
        </div>

        {/* Modals */}
        <Dialog open={showMaintenanceModal} onOpenChange={setShowMaintenanceModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mode Maintenance</DialogTitle>
              <DialogDescription>
                {systemConfig.maintenanceMode
                  ? 'Désactiver le mode maintenance permettra aux utilisateurs d\'accéder à TRAVAIL.GA.'
                  : 'Activer le mode maintenance rendra TRAVAIL.GA temporairement indisponible.'
                }
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMaintenanceModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleMaintenanceMode} disabled={loadingState === 'loading'}>
                {loadingState === 'loading' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {systemConfig.maintenanceMode ? 'Désactiver' : 'Activer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
