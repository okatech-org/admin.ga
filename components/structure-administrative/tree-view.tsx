'use client';

import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Building, Users, MapPin, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrganismeAdministratif } from '@/lib/types/structure-administrative';

interface TreeViewProps {
  organismes: OrganismeAdministratif[];
  onSelect?: (organisme: OrganismeAdministratif) => void;
  onEdit?: (organisme: OrganismeAdministratif) => void;
  onView?: (organisme: OrganismeAdministratif) => void;
  selectedId?: string;
  searchTerm?: string;
  showStats?: boolean;
}

const TreeNode = ({
  organisme,
  children,
  level = 0,
  onSelect,
  onEdit,
  onView,
  isSelected,
  searchTerm,
  allOrganismes
}: {
  organisme: OrganismeAdministratif;
  children?: OrganismeAdministratif[];
  level?: number;
  onSelect?: (organisme: OrganismeAdministratif) => void;
  onEdit?: (organisme: OrganismeAdministratif) => void;
  onView?: (organisme: OrganismeAdministratif) => void;
  isSelected?: boolean;
  searchTerm?: string;
  allOrganismes: OrganismeAdministratif[];
}) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);

  const highlightText = (text: string) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ?
        <span key={i} className="bg-yellow-200 font-semibold">{part}</span> : part
    );
  };

  const levelColors = {
    1: 'border-red-500 bg-red-50',
    2: 'border-blue-500 bg-blue-50',
    3: 'border-green-500 bg-green-50',
    4: 'border-orange-500 bg-orange-50',
    5: 'border-purple-500 bg-purple-50'
  };

  return (
    <div className="select-none">
      <div
        className={`
          flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all
          ${isSelected ? 'bg-blue-100 border-blue-400' : 'hover:bg-gray-50'}
          ${level > 0 ? 'ml-' + (level * 4) : ''}
        `}
        onClick={() => onSelect?.(organisme)}
      >
        {children && children.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        )}
        {(!children || children.length === 0) && <div className="w-6" />}

        <div className={`p-1 rounded ${levelColors[organisme.niveau as keyof typeof levelColors] || 'bg-gray-50'}`}>
          <Building className="h-4 w-4" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{highlightText(organisme.nom)}</span>
            <Badge variant="outline" className="text-xs">
              N{organisme.niveau}
            </Badge>
            {organisme.statut === 'ACTIF' ? (
              <Badge className="bg-green-100 text-green-800 text-xs">Actif</Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-800 text-xs">Inactif</Badge>
            )}
          </div>
          <div className="text-xs text-gray-500">{organisme.code} • {organisme.type}</div>
        </div>

        <div className="flex gap-1">
          {onView && (
            <Button variant="ghost" size="sm" onClick={(e) => {
              e.stopPropagation();
              onView(organisme);
            }}>
              👁️
            </Button>
          )}
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={(e) => {
              e.stopPropagation();
              onEdit(organisme);
            }}>
              ✏️
            </Button>
          )}
        </div>
      </div>

      {isExpanded && children && children.length > 0 && (
        <div className="ml-2">
          {children.map(child => (
            <TreeNode
              key={child.id}
              organisme={child}
              children={allOrganismes.filter(o => o.parentId === child.id)}
              level={level + 1}
              onSelect={onSelect}
              onEdit={onEdit}
              onView={onView}
              isSelected={isSelected}
              searchTerm={searchTerm}
              allOrganismes={allOrganismes}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function TreeView({
  organismes,
  onSelect,
  onEdit,
  onView,
  selectedId,
  searchTerm,
  showStats = false
}: TreeViewProps) {
  const rootOrganismes = useMemo(() =>
    organismes.filter(o => !o.parentId || o.niveau === 1),
    [organismes]
  );

  const stats = useMemo(() => {
    if (!showStats) return null;

    const byNiveau = organismes.reduce((acc, org) => {
      acc[org.niveau] = (acc[org.niveau] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const byStatut = organismes.reduce((acc, org) => {
      acc[org.statut] = (acc[org.statut] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { byNiveau, byStatut, total: organismes.length };
  }, [organismes, showStats]);

  return (
    <div className="space-y-4">
      {showStats && stats && (
        <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-gray-600" />
            <span className="font-medium">{stats.total} organismes</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="text-sm">{stats.byStatut.ACTIF || 0} actifs</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-sm">5 niveaux hiérarchiques</span>
          </div>
        </div>
      )}

      <div className="border rounded-lg p-4 bg-white max-h-96 overflow-y-auto">
        {rootOrganismes.length > 0 ? (
          rootOrganismes.map(organisme => (
            <TreeNode
              key={organisme.id}
              organisme={organisme}
              children={organismes.filter(o => o.parentId === organisme.id)}
              onSelect={onSelect}
              onEdit={onEdit}
              onView={onView}
              isSelected={selectedId === organisme.id}
              searchTerm={searchTerm}
              allOrganismes={organismes}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Building className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>Aucun organisme trouvé</p>
            <p className="text-xs mt-1">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
}
