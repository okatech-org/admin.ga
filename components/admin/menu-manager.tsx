'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from '@hello-pangea/dnd';
import {
  Menu, GripVertical, Eye, EyeOff, Edit2, Trash2, Plus,
  Home, Users, Building2, BarChart3, Settings, FileText,
  Bell, Globe, Shield, Database, Layout, Search
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  url: string;
  icon: string;
  visible: boolean;
  order: number;
  app: 'admin' | 'demarche';
  children?: MenuItem[];
}

interface MenuManagerProps {
  onSave: (menus: MenuItem[]) => void;
}

export const MenuManager: React.FC<MenuManagerProps> = ({ onSave }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      label: 'Tableau de Bord',
      url: '/super-admin',
      icon: 'BarChart3',
      visible: true,
      order: 1,
      app: 'admin'
    },
    {
      id: '2',
      label: 'Utilisateurs',
      url: '/super-admin/utilisateurs',
      icon: 'Users',
      visible: true,
      order: 2,
      app: 'admin'
    },
    {
      id: '3',
      label: 'Organismes',
      url: '/super-admin/organismes',
      icon: 'Building2',
      visible: true,
      order: 3,
      app: 'admin'
    },
    {
      id: '4',
      label: 'Analytics',
      url: '/super-admin/analytics',
      icon: 'BarChart3',
      visible: true,
      order: 4,
      app: 'admin'
    },
    {
      id: '5',
      label: 'Paramètres',
      url: '/super-admin/configuration',
      icon: 'Settings',
      visible: true,
      order: 5,
      app: 'admin'
    },
    // DEMARCHE.GA menus
    {
      id: '6',
      label: 'Accueil',
      url: '/',
      icon: 'Home',
      visible: true,
      order: 1,
      app: 'demarche'
    },
    {
      id: '7',
      label: 'Mes Démarches',
      url: '/demarche',
      icon: 'FileText',
      visible: true,
      order: 2,
      app: 'demarche'
    },
    {
      id: '8',
      label: 'Services',
      url: '/services',
      icon: 'Globe',
      visible: true,
      order: 3,
      app: 'demarche'
    }
  ]);

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    label: '',
    url: '',
    icon: 'Home',
    visible: true,
    app: 'admin'
  });

  const iconOptions = [
    { value: 'Home', label: 'Accueil', icon: Home },
    { value: 'Users', label: 'Utilisateurs', icon: Users },
    { value: 'Building2', label: 'Organismes', icon: Building2 },
    { value: 'BarChart3', label: 'Analytics', icon: BarChart3 },
    { value: 'Settings', label: 'Paramètres', icon: Settings },
    { value: 'FileText', label: 'Documents', icon: FileText },
    { value: 'Bell', label: 'Notifications', icon: Bell },
    { value: 'Globe', label: 'Services', icon: Globe },
    { value: 'Shield', label: 'Sécurité', icon: Shield },
    { value: 'Database', label: 'Base de données', icon: Database },
    { value: 'Layout', label: 'Interface', icon: Layout },
    { value: 'Search', label: 'Recherche', icon: Search }
  ];

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      Home, Users, Building2, BarChart3, Settings, FileText,
      Bell, Globe, Shield, Database, Layout, Search
    };
    return iconMap[iconName] || Home;
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(menuItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Mettre à jour les ordres
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    setMenuItems(updatedItems);
  };

  const handleToggleVisibility = (id: string) => {
    setMenuItems(items =>
      items.map(item =>
        item.id === id ? { ...item, visible: !item.visible } : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems(items => items.filter(item => item.id !== id));
  };

  const handleAddItem = () => {
    if (!newItem.label || !newItem.url) return;

    const item: MenuItem = {
      id: Date.now().toString(),
      label: newItem.label,
      url: newItem.url,
      icon: newItem.icon || 'Home',
      visible: newItem.visible || true,
      order: menuItems.length + 1,
      app: newItem.app || 'admin'
    };

    setMenuItems([...menuItems, item]);
    setNewItem({ label: '', url: '', icon: 'Home', visible: true, app: 'admin' });
  };

  const adminMenus = menuItems.filter(item => item.app === 'admin');
  const demarcheMenus = menuItems.filter(item => item.app === 'demarche');

  return (
    <div className="space-y-6">
      {/* Gestion des menus ADMINISTRATION.GA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span>Menus ADMINISTRATION.GA</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="admin-menu">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {adminMenus.map((item, index) => {
                    const IconComponent = getIcon(item.icon);
                    return (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center space-x-3 p-3 bg-white border rounded-lg"
                          >
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="w-4 h-4 text-gray-400" />
                            </div>
                            <IconComponent className="w-4 h-4 text-gray-600" />
                            <div className="flex-1">
                              <div className="font-medium">{item.label}</div>
                              <div className="text-sm text-gray-500">{item.url}</div>
                            </div>
                            <Badge variant={item.visible ? 'default' : 'secondary'}>
                              {item.visible ? 'Visible' : 'Masqué'}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleVisibility(item.id)}
                              >
                                {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingItem(item)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>

      {/* Gestion des menus DEMARCHE.GA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <span>Menus DEMARCHE.GA</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {demarcheMenus.map((item) => {
              const IconComponent = getIcon(item.icon);
              return (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-white border rounded-lg">
                  <IconComponent className="w-4 h-4 text-gray-600" />
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.url}</div>
                  </div>
                  <Badge variant={item.visible ? 'default' : 'secondary'}>
                    {item.visible ? 'Visible' : 'Masqué'}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleVisibility(item.id)}
                    >
                      {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingItem(item)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Ajouter un nouveau menu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Ajouter un Menu</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Libellé</Label>
              <Input
                value={newItem.label || ''}
                onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                placeholder="Ex: Tableau de bord"
              />
            </div>
            <div>
              <Label>URL</Label>
              <Input
                value={newItem.url || ''}
                onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                placeholder="Ex: /super-admin/dashboard"
              />
            </div>
            <div>
              <Label>Icône</Label>
              <select
                value={newItem.icon || 'Home'}
                onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Application</Label>
              <select
                value={newItem.app || 'admin'}
                onChange={(e) => setNewItem({ ...newItem, app: e.target.value as 'admin' | 'demarche' })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="admin">ADMINISTRATION.GA</option>
                <option value="demarche">DEMARCHE.GA</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={newItem.visible || true}
              onCheckedChange={(checked) => setNewItem({ ...newItem, visible: checked })}
            />
            <Label>Visible par défaut</Label>
          </div>
          <Button onClick={handleAddItem} disabled={!newItem.label || !newItem.url}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter le menu
          </Button>
        </CardContent>
      </Card>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end">
        <Button onClick={() => onSave(menuItems)} size="lg">
          Sauvegarder les menus
        </Button>
      </div>
    </div>
  );
};
