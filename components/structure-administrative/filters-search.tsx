'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Search, Filter, RotateCcw } from 'lucide-react';
import {
  FiltresStructure,
  NiveauHierarchique,
  TypeOrganisme,
  StatutOrganisme
} from '@/lib/types/structure-administrative';

interface FiltersSearchProps {
  filtres: FiltresStructure;
  onFiltresChange: (filtres: FiltresStructure) => void;
  totalOrganismes: number;
  organismesFiltres: number;
}

export default function FiltersSearch({
  filtres,
  onFiltresChange,
  totalOrganismes,
  organismesFiltres
}: FiltersSearchProps) {
  const handleSearchChange = (value: string) => {
    onFiltresChange({ ...filtres, searchTerm: value });
  };

  const handleNiveauToggle = (niveau: NiveauHierarchique) => {
    const newNiveaux = filtres.niveaux.includes(niveau)
      ? filtres.niveaux.filter(n => n !== niveau)
      : [...filtres.niveaux, niveau];
    onFiltresChange({ ...filtres, niveaux: newNiveaux });
  };

  const handleTypeToggle = (type: TypeOrganisme) => {
    const newTypes = filtres.types.includes(type)
      ? filtres.types.filter(t => t !== type)
      : [...filtres.types, type];
    onFiltresChange({ ...filtres, types: newTypes });
  };

  const handleStatutChange = (statut: StatutOrganisme) => {
    const newStatuts = filtres.statuts.includes(statut)
      ? filtres.statuts.filter(s => s !== statut)
      : [...filtres.statuts, statut];
    onFiltresChange({ ...filtres, statuts: newStatuts });
  };

  const handleReset = () => {
    onFiltresChange({
      niveaux: Object.values(NiveauHierarchique).filter(v => typeof v === 'number') as NiveauHierarchique[],
      types: Object.values(TypeOrganisme),
      statuts: [StatutOrganisme.ACTIF],
      provinces: [],
      searchTerm: ''
    });
  };

  const niveaux = [
    { value: NiveauHierarchique.NIVEAU_1, label: 'Niveau 1', color: 'bg-red-100 text-red-800' },
    { value: NiveauHierarchique.NIVEAU_2, label: 'Niveau 2', color: 'bg-blue-100 text-blue-800' },
    { value: NiveauHierarchique.NIVEAU_3, label: 'Niveau 3', color: 'bg-green-100 text-green-800' },
    { value: NiveauHierarchique.NIVEAU_4, label: 'Niveau 4', color: 'bg-orange-100 text-orange-800' },
    { value: NiveauHierarchique.NIVEAU_5, label: 'Niveau 5', color: 'bg-purple-100 text-purple-800' }
  ];

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par nom, code, sigle..."
            value={filtres.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
      </div>

      {/* Indicateur de résultats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {organismesFiltres} résultat(s) sur {totalOrganismes}
          </span>
        </div>
        {filtres.searchTerm && (
          <Badge variant="secondary">
            Recherche: "{filtres.searchTerm}"
          </Badge>
        )}
      </div>

      {/* Filtres par niveau */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Niveaux hiérarchiques</Label>
        <div className="flex flex-wrap gap-2">
          {niveaux.map(niveau => (
            <Badge
              key={niveau.value}
              variant={filtres.niveaux.includes(niveau.value) ? "default" : "outline"}
              className={`cursor-pointer transition-all ${
                filtres.niveaux.includes(niveau.value) ? niveau.color : ''
              }`}
              onClick={() => handleNiveauToggle(niveau.value)}
            >
              {niveau.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Filtres par statut */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Statut</Label>
        <div className="flex gap-4">
          {Object.values(StatutOrganisme).map(statut => (
            <label key={statut} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filtres.statuts.includes(statut)}
                onCheckedChange={() => handleStatutChange(statut)}
              />
              <span className="text-sm">{statut}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Types d'organismes */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Types d'organismes</Label>
        <Select
          value={filtres.types.length === Object.values(TypeOrganisme).length ? 'all' : 'custom'}
          onValueChange={(value) => {
            if (value === 'all') {
              onFiltresChange({ ...filtres, types: Object.values(TypeOrganisme) });
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner les types">
              {filtres.types.length === Object.values(TypeOrganisme).length
                ? 'Tous les types'
                : `${filtres.types.length} type(s) sélectionné(s)`}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {Object.values(TypeOrganisme).map(type => (
              <SelectItem key={type} value={type}>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={filtres.types.includes(type)}
                    onCheckedChange={() => handleTypeToggle(type)}
                  />
                  {type}
                </label>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
