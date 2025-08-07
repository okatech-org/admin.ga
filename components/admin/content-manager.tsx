'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText, Edit2, Trash2, Plus, Save, Eye, Calendar,
  Globe, Shield, Image, Link, Tag, Clock
} from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'page' | 'news' | 'announcement';
  app: 'admin' | 'demarche' | 'both';
  published: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  author: string;
  slug: string;
}

interface ContentManagerProps {
  onSave: (content: ContentItem[]) => void;
}

export const ContentManager: React.FC<ContentManagerProps> = ({ onSave }) => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Bienvenue sur ADMINISTRATION.GA',
      content: 'Plateforme officielle d\'administration de la République Gabonaise. Gérez efficacement tous les aspects administratifs...',
      type: 'page',
      app: 'admin',
      published: true,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15',
      tags: ['administration', 'gabon', 'officiel'],
      author: 'Admin Système',
      slug: 'bienvenue-administration'
    },
    {
      id: '2',
      title: 'Nouvelle mise à jour du système',
      content: 'Le système ADMINISTRATION.GA a été mis à jour avec de nouvelles fonctionnalités de gestion des utilisateurs...',
      type: 'news',
      app: 'both',
      published: true,
      createdAt: '2024-01-12',
      updatedAt: '2024-01-12',
      tags: ['mise-à-jour', 'fonctionnalités'],
      author: 'Équipe Technique',
      slug: 'mise-a-jour-systeme'
    },
    {
      id: '3',
      title: 'Guide des démarches simplifiées',
      content: 'Découvrez comment utiliser DEMARCHE.GA pour simplifier vos démarches administratives...',
      type: 'page',
      app: 'demarche',
      published: true,
      createdAt: '2024-01-08',
      updatedAt: '2024-01-14',
      tags: ['guide', 'démarches', 'tutoriel'],
      author: 'Support Citoyen',
      slug: 'guide-demarches'
    }
  ]);

  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<ContentItem>>({
    title: '',
    content: '',
    type: 'page',
    app: 'admin',
    published: false,
    tags: [],
    author: 'Admin',
    slug: ''
  });

  const [newTag, setNewTag] = useState('');

  const handleAddTag = (item: Partial<ContentItem>, setItem: (item: Partial<ContentItem>) => void) => {
    if (newTag.trim() && !item.tags?.includes(newTag.trim())) {
      setItem({
        ...item,
        tags: [...(item.tags || []), newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string, item: Partial<ContentItem>, setItem: (item: Partial<ContentItem>) => void) => {
    setItem({
      ...item,
      tags: item.tags?.filter(t => t !== tag) || []
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleAddItem = () => {
    if (!newItem.title || !newItem.content) return;

    const item: ContentItem = {
      id: Date.now().toString(),
      title: newItem.title,
      content: newItem.content,
      type: newItem.type || 'page',
      app: newItem.app || 'admin',
      published: newItem.published || false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      tags: newItem.tags || [],
      author: newItem.author || 'Admin',
      slug: newItem.slug || generateSlug(newItem.title)
    };

    setContentItems([...contentItems, item]);
    setNewItem({
      title: '',
      content: '',
      type: 'page',
      app: 'admin',
      published: false,
      tags: [],
      author: 'Admin',
      slug: ''
    });
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;

    setContentItems(items =>
      items.map(item =>
        item.id === editingItem.id
          ? { ...editingItem, updatedAt: new Date().toISOString().split('T')[0] }
          : item
      )
    );
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    setContentItems(items => items.filter(item => item.id !== id));
  };

  const handleTogglePublished = (id: string) => {
    setContentItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, published: !item.published, updatedAt: new Date().toISOString().split('T')[0] }
          : item
      )
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'page': return 'bg-blue-100 text-blue-800';
      case 'news': return 'bg-green-100 text-green-800';
      case 'announcement': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAppColor = (app: string) => {
    switch (app) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'demarche': return 'bg-cyan-100 text-cyan-800';
      case 'both': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Liste du contenu</TabsTrigger>
          <TabsTrigger value="add">Ajouter du contenu</TabsTrigger>
          {editingItem && <TabsTrigger value="edit">Modifier</TabsTrigger>}
        </TabsList>

        {/* Liste du contenu */}
        <TabsContent value="list" className="space-y-4">
          {contentItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>{item.title}</span>
                      {!item.published && (
                        <Badge variant="outline" className="text-orange-600">
                          Brouillon
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getTypeColor(item.type)}>
                        {item.type === 'page' ? 'Page' : item.type === 'news' ? 'Actualité' : 'Annonce'}
                      </Badge>
                      <Badge className={getAppColor(item.app)}>
                        {item.app === 'admin' ? 'ADMIN.GA' : item.app === 'demarche' ? 'DEMARCHE.GA' : 'Les deux'}
                      </Badge>
                      <span className="text-sm text-gray-500">par {item.author}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTogglePublished(item.id)}
                    >
                      <Eye className="w-4 h-4" />
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
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.content}
                </p>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Créé le {item.createdAt}</span>
                    <span>Modifié le {item.updatedAt}</span>
                    <span>Slug: /{item.slug}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Ajouter du contenu */}
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Ajouter du contenu</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Titre</Label>
                  <Input
                    value={newItem.title || ''}
                    onChange={(e) => {
                      const title = e.target.value;
                      setNewItem({
                        ...newItem,
                        title,
                        slug: generateSlug(title)
                      });
                    }}
                    placeholder="Titre du contenu"
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <select
                    value={newItem.type || 'page'}
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value as 'page' | 'news' | 'announcement' })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="page">Page</option>
                    <option value="news">Actualité</option>
                    <option value="announcement">Annonce</option>
                  </select>
                </div>
                <div>
                  <Label>Application</Label>
                  <select
                    value={newItem.app || 'admin'}
                    onChange={(e) => setNewItem({ ...newItem, app: e.target.value as 'admin' | 'demarche' | 'both' })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="admin">ADMINISTRATION.GA</option>
                    <option value="demarche">DEMARCHE.GA</option>
                    <option value="both">Les deux applications</option>
                  </select>
                </div>
                <div>
                  <Label>Auteur</Label>
                  <Input
                    value={newItem.author || ''}
                    onChange={(e) => setNewItem({ ...newItem, author: e.target.value })}
                    placeholder="Nom de l'auteur"
                  />
                </div>
                <div>
                  <Label>Slug (URL)</Label>
                  <Input
                    value={newItem.slug || ''}
                    onChange={(e) => setNewItem({ ...newItem, slug: e.target.value })}
                    placeholder="url-de-la-page"
                  />
                </div>
              </div>

              <div>
                <Label>Contenu</Label>
                <Textarea
                  value={newItem.content || ''}
                  onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                  placeholder="Contenu de la page, actualité ou annonce..."
                  rows={8}
                />
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex items-center space-x-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Ajouter un tag"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag(newItem, setNewItem)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddTag(newItem, setNewItem)}
                  >
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {newItem.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="cursor-pointer">
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => handleRemoveTag(tag, newItem, setNewItem)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newItem.published || false}
                  onCheckedChange={(checked) => setNewItem({ ...newItem, published: checked })}
                />
                <Label>Publier immédiatement</Label>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleAddItem} disabled={!newItem.title || !newItem.content}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter le contenu
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Modifier du contenu */}
        {editingItem && (
          <TabsContent value="edit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Edit2 className="w-5 h-5" />
                  <span>Modifier: {editingItem.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label>Titre</Label>
                    <Input
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <select
                      value={editingItem.type}
                      onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as 'page' | 'news' | 'announcement' })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="page">Page</option>
                      <option value="news">Actualité</option>
                      <option value="announcement">Annonce</option>
                    </select>
                  </div>
                  <div>
                    <Label>Application</Label>
                    <select
                      value={editingItem.app}
                      onChange={(e) => setEditingItem({ ...editingItem, app: e.target.value as 'admin' | 'demarche' | 'both' })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="admin">ADMINISTRATION.GA</option>
                      <option value="demarche">DEMARCHE.GA</option>
                      <option value="both">Les deux applications</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Contenu</Label>
                  <Textarea
                    value={editingItem.content}
                    onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                    rows={8}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editingItem.published}
                    onCheckedChange={(checked) => setEditingItem({ ...editingItem, published: checked })}
                  />
                  <Label>Publié</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingItem(null)}>
                    Annuler
                  </Button>
                  <Button onClick={handleUpdateItem}>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Bouton de sauvegarde global */}
      <div className="flex justify-end">
        <Button onClick={() => onSave(contentItems)} size="lg">
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder tout le contenu
        </Button>
      </div>
    </div>
  );
};
