'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Command,
  Clock,
  Star,
  ArrowRight,
  Building2,
  Users,
  Settings,
  BarChart3,
  HelpCircle,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { SUPER_ADMIN_SECTIONS, QUICK_ACTIONS } from '@/lib/config/super-admin-navigation';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<any>;
  category: string;
  keywords: string[];
  frequency?: number;
  isRecent?: boolean;
  badge?: string;
}

interface SmartSearchProps {
  className?: string;
}

export const SmartSearch = ({ className }: SmartSearchProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  // Construire l'index de recherche à partir de la configuration
  const searchIndex = useMemo(() => {
    const items: SearchItem[] = [];

    // Ajouter les sections principales
    SUPER_ADMIN_SECTIONS.forEach(section => {
      items.push({
        id: `section-${section.id}`,
        title: section.title,
        description: section.description,
        href: section.items[0]?.href || '#',
        icon: section.icon,
        category: 'Sections',
        keywords: [section.title, section.description, ...section.items.map(item => item.title)]
      });

      // Ajouter les sous-éléments
      section.items.forEach(item => {
        items.push({
          id: `item-${item.href}`,
          title: item.title,
          description: item.description,
          href: item.href,
          icon: item.icon,
          category: section.title,
          keywords: [item.title, item.description, item.helpTip || ''],
          frequency: item.isFrequent ? 5 : 1,
          badge: item.badge?.text
        });
      });
    });

    // Ajouter les actions rapides
    QUICK_ACTIONS.forEach(action => {
      items.push({
        id: `action-${action.href}`,
        title: action.title,
        description: action.description,
        href: action.href,
        icon: action.icon,
        category: 'Actions Rapides',
        keywords: [action.title, action.description],
        frequency: action.priority === 'high' ? 10 : action.priority === 'medium' ? 5 : 1
      });
    });

    return items;
  }, []);

  // Filtrer les résultats selon la requête
  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      // Afficher les éléments fréquents et récents
      const frequentItems = searchIndex
        .filter(item => (item.frequency || 0) >= 5)
        .sort((a, b) => (b.frequency || 0) - (a.frequency || 0))
        .slice(0, 8);

      return {
        frequent: frequentItems,
        recent: [],
        suggestions: []
      };
    }

    const queryLower = query.toLowerCase();
    const results = searchIndex.filter(item => {
      return item.keywords.some(keyword =>
        keyword.toLowerCase().includes(queryLower)
      ) || item.title.toLowerCase().includes(queryLower);
    });

    // Trier par pertinence
    results.sort((a, b) => {
      const aScore = calculateRelevanceScore(a, queryLower);
      const bScore = calculateRelevanceScore(b, queryLower);
      return bScore - aScore;
    });

    return {
      frequent: [],
      recent: [],
      suggestions: results.slice(0, 12)
    };
  }, [query, searchIndex]);

  const calculateRelevanceScore = (item: SearchItem, query: string): number => {
    let score = 0;

    // Titre exact
    if (item.title.toLowerCase() === query) score += 100;
    // Titre commence par
    else if (item.title.toLowerCase().startsWith(query)) score += 80;
    // Titre contient
    else if (item.title.toLowerCase().includes(query)) score += 60;

    // Mots-clés
    item.keywords.forEach(keyword => {
      if (keyword.toLowerCase().includes(query)) score += 20;
    });

    // Fréquence d'utilisation
    score += (item.frequency || 0) * 2;

    return score;
  };

  const handleSelect = (item: SearchItem) => {
    // Ajouter aux recherches récentes
    setRecentSearches(prev => {
      const updated = [item.title, ...prev.filter(s => s !== item.title)];
      return updated.slice(0, 5);
    });

    setOpen(false);
    setQuery('');
    router.push(item.href);
  };

  // Raccourcis clavier
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      {/* Déclencheur de recherche */}
      <Button
        variant="outline"
        className={cn(
          "relative h-10 w-full max-w-sm justify-start text-left font-normal",
          "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          className
        )}
        onClick={() => setOpen(true)}
        data-tour="search-bar"
      >
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <span className="hidden lg:inline-flex">Rechercher dans ADMIN.GA...</span>
        <span className="inline-flex lg:hidden">Rechercher...</span>
        <CommandShortcut className="ml-auto">
          <Command className="mr-1 h-3 w-3" />K
        </CommandShortcut>
      </Button>

      {/* Modal de recherche */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Tapez pour rechercher dans toutes les fonctionnalités..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-6">
              <Search className="h-8 w-8 text-gray-400" />
              <div className="text-sm text-gray-500">Aucun résultat trouvé</div>
              <div className="text-xs text-gray-400">
                Essayez des termes comme "organisme", "utilisateur" ou "analytics"
              </div>
            </div>
          </CommandEmpty>

          {/* Éléments fréquents (quand pas de requête) */}
          {!query && filteredResults.frequent.length > 0 && (
            <CommandGroup heading="Actions Fréquentes">
              {filteredResults.frequent.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.title}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center gap-3 py-3"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.title}</span>
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        {item.badge && (
                          <Badge variant="outline" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Résultats de recherche */}
          {query && filteredResults.suggestions.length > 0 && (
            <>
              {/* Grouper par catégorie */}
              {(() => {
                const groupedResults: Record<string, SearchItem[]> = {};
                filteredResults.suggestions.forEach(item => {
                  if (!groupedResults[item.category]) groupedResults[item.category] = [];
                  groupedResults[item.category].push(item);
                });
                return Object.entries(groupedResults);
              })().map(([category, items]) => (
                <CommandGroup key={category} heading={category}>
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.title}
                      onSelect={() => handleSelect(item)}
                      className="flex items-center gap-3 py-3"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.title}</span>
                            {item.frequency && item.frequency >= 5 && (
                              <Zap className="w-3 h-3 text-orange-500" />
                            )}
                            {item.badge && (
                              <Badge variant="outline" className="text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </>
          )}

          {/* Raccourcis et aide */}
          {!query && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Raccourcis Utiles">
                <CommandItem disabled className="justify-between">
                  <span className="text-xs text-gray-500">Ouvrir la recherche</span>
                  <CommandShortcut>⌘K</CommandShortcut>
                </CommandItem>
                <CommandItem disabled className="justify-between">
                  <span className="text-xs text-gray-500">Aide contextuelle</span>
                  <CommandShortcut>⌘H</CommandShortcut>
                </CommandItem>
                <CommandItem disabled className="justify-between">
                  <span className="text-xs text-gray-500">Tableau de bord</span>
                  <CommandShortcut>⌘D</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
