/* @ts-nocheck */
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { useAuth } from '@/hooks/use-auth';
import {
  Bell,
  Check,
  CheckCheck,
  Mail,
  MessageSquare,
  Calendar,
  FileText,
  Settings,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function NotificationsPage() {
  const { user, isLoading } = useAuth();
  const [selectedTab, setSelectedTab] = useState('all');

  // ⚠️ TODO: Implémenter API pour récupérer les vraies notifications
  const notifications = [
    {
      id: '1',
      type: 'DEMANDE_VALIDEE',
      title: 'Demande validée',
      message: 'Votre demande d\'acte de naissance a été validée avec succès.',
      isRead: false,
      createdAt: new Date('2024-01-15T10:30:00'),
      data: {
        requestId: 'GA-2024-001',
        serviceType: 'ACTE_NAISSANCE'
      },
      channel: 'IN_APP'
    },
    {
      id: '2',
      type: 'RDV_CONFIRME',
      title: 'Rendez-vous confirmé',
      message: 'Votre rendez-vous du 18 janvier à 14h30 a été confirmé.',
      isRead: false,
      createdAt: new Date('2024-01-15T09:15:00'),
      data: {
        appointmentId: 'RDV-002',
        date: '2024-01-18T14:30:00'
      },
      channel: 'IN_APP'
    },
    {
      id: '3',
      type: 'DOCUMENT_PRET',
      title: 'Document prêt',
      message: 'Votre casier judiciaire est prêt à être récupéré.',
      isRead: true,
      createdAt: new Date('2024-01-14T16:45:00'),
      data: {
        requestId: 'GA-2024-003',
        serviceType: 'CASIER_JUDICIAIRE'
      },
      channel: 'IN_APP'
    },
    {
      id: '4',
      type: 'DEMANDE_RECUE',
      title: 'Demande reçue',
      message: 'Votre demande de permis de construire a été reçue et sera traitée.',
      isRead: true,
      createdAt: new Date('2024-01-13T11:20:00'),
      data: {
        requestId: 'GA-2024-004',
        serviceType: 'PERMIS_CONSTRUIRE'
      },
      channel: 'IN_APP'
    },
    {
      id: '5',
      type: 'RAPPEL_RDV',
      title: 'Rappel de rendez-vous',
      message: 'Rappel: Vous avez un rendez-vous demain à 10h00 à la Mairie.',
      isRead: true,
      createdAt: new Date('2024-01-12T18:00:00'),
      data: {
        appointmentId: 'RDV-001',
        date: '2024-01-15T10:00:00'
      },
      channel: 'IN_APP'
    }
  ];

  const [userNotifications, setUserNotifications] = useState(notifications);
  const [preferences, setPreferences] = useState({
    email_demande_recue: true,
    email_demande_validee: true,
    email_rdv_confirme: true,
    email_rappel_rdv: true,
    email_document_pret: true,
    sms_demande_recue: false,
    sms_demande_validee: true,
    sms_rdv_confirme: true,
    sms_rappel_rdv: true,
    sms_document_pret: true,
    inapp_all: true
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'DEMANDE_RECUE':
      case 'DEMANDE_VALIDEE':
        return <FileText className="w-4 h-4" />;
      case 'RDV_CONFIRME':
      case 'RAPPEL_RDV':
        return <Calendar className="w-4 h-4" />;
      case 'DOCUMENT_PRET':
        return <CheckCheck className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'DEMANDE_RECUE':
        return 'text-blue-500';
      case 'DEMANDE_VALIDEE':
        return 'text-green-500';
      case 'RDV_CONFIRME':
        return 'text-purple-500';
      case 'RAPPEL_RDV':
        return 'text-yellow-500';
      case 'DOCUMENT_PRET':
        return 'text-green-600';
      default:
        return 'text-gray-500';
    }
  };

  const markAsRead = (notificationId: string) => {
    setUserNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setUserNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setUserNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const filteredNotifications = userNotifications.filter(notification => {
    switch (selectedTab) {
      case 'unread':
        return !notification.isRead;
      case 'requests':
        return ['DEMANDE_RECUE', 'DEMANDE_VALIDEE', 'DOCUMENT_PRET'].includes(notification.type);
      case 'appointments':
        return ['RDV_CONFIRME', 'RAPPEL_RDV'].includes(notification.type);
      default:
        return true;
    }
  });

  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-2">
              <Bell className="w-8 h-8" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground">
              Gérez vos notifications et préférences
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              <CheckCheck className="mr-2 h-4 w-4" />
              Tout marquer comme lu
            </Button>
          )}
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              Toutes ({userNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Non lues ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="requests">
              Demandes
            </TabsTrigger>
            <TabsTrigger value="appointments">
              RDV
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Settings className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          {/* Notifications List */}
          <TabsContent value="all" className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">Aucune notification</h3>
                  <p className="text-muted-foreground">
                    Vous n'avez pas de notifications pour le moment.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all hover:shadow-md ${
                    !notification.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between space-x-4">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`p-2 rounded-full bg-accent ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{notification.title}</h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(notification.createdAt, 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className="border-l-4 border-l-primary bg-primary/5 transition-all hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`p-2 rounded-full bg-accent ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{notification.title}</h4>
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(notification.createdAt, 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card key={notification.id} className={!notification.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`p-2 rounded-full bg-accent ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{notification.title}</h4>
                          {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(notification.createdAt, 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!notification.isRead && (
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card key={notification.id} className={!notification.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`p-2 rounded-full bg-accent ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{notification.title}</h4>
                          {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(notification.createdAt, 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!notification.isRead && (
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Notifications Email</span>
                  </CardTitle>
                  <CardDescription>
                    Configurez vos préférences de notifications par email
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'email_demande_recue', label: 'Demande reçue' },
                    { key: 'email_demande_validee', label: 'Demande validée' },
                    { key: 'email_rdv_confirme', label: 'Rendez-vous confirmé' },
                    { key: 'email_rappel_rdv', label: 'Rappel de rendez-vous' },
                    { key: 'email_document_pret', label: 'Document prêt' },
                  ].map((pref) => (
                    <div key={pref.key} className="flex items-center justify-between">
                      <Label htmlFor={pref.key}>{pref.label}</Label>
                      <Switch
                        id={pref.key}
                        checked={preferences[pref.key as keyof typeof preferences]}
                        onCheckedChange={(checked) =>
                          setPreferences(prev => ({
                            ...prev,
                            [pref.key]: checked
                          }))
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Notifications SMS</span>
                  </CardTitle>
                  <CardDescription>
                    Configurez vos préférences de notifications par SMS
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'sms_demande_recue', label: 'Demande reçue' },
                    { key: 'sms_demande_validee', label: 'Demande validée' },
                    { key: 'sms_rdv_confirme', label: 'Rendez-vous confirmé' },
                    { key: 'sms_rappel_rdv', label: 'Rappel de rendez-vous' },
                    { key: 'sms_document_pret', label: 'Document prêt' },
                  ].map((pref) => (
                    <div key={pref.key} className="flex items-center justify-between">
                      <Label htmlFor={pref.key}>{pref.label}</Label>
                      <Switch
                        id={pref.key}
                        checked={preferences[pref.key as keyof typeof preferences]}
                        onCheckedChange={(checked) =>
                          setPreferences(prev => ({
                            ...prev,
                            [pref.key]: checked
                          }))
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Notifications In-App</span>
                  </CardTitle>
                  <CardDescription>
                    Préférences pour les notifications dans l'application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="inapp_all" className="text-base">Toutes les notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir toutes les notifications dans l'application
                      </p>
                    </div>
                    <Switch
                      id="inapp_all"
                      checked={preferences.inapp_all}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          inapp_all: checked
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end mt-6">
              <Button>
                <Settings className="mr-2 h-4 w-4" />
                Enregistrer les préférences
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
}
