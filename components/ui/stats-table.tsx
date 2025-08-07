'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Download,
  Filter,
  Eye,
  ChevronDown,
  ChevronUp,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'percentage' | 'date' | 'badge' | 'actions';
  formatter?: (value: any) => string | React.ReactNode;
  className?: string;
}

interface StatsTableProps {
  title: string;
  description?: string;
  columns: StatsTableColumn[];
  data: any[];
  searchable?: boolean;
  exportable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  loading?: boolean;
  emptyMessage?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function StatsTable({
  title,
  description,
  columns,
  data,
  searchable = true,
  exportable = true,
  pagination = true,
  pageSize = 10,
  loading = false,
  emptyMessage = "Aucune donnée disponible",
  actions,
  className
}: StatsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrage des données
  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Tri des données
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue === bValue) return 0;

    const comparison = aValue < bValue ? -1 : 1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = pagination
    ? sortedData.slice(startIndex, startIndex + pageSize)
    : sortedData;

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const formatCellValue = (value: any, column: StatsTableColumn) => {
    if (column.formatter) {
      return column.formatter(value);
    }

    switch (column.type) {
      case 'number':
        return typeof value === 'number' ? value.toLocaleString('fr-FR') : value;
      case 'percentage':
        return typeof value === 'number' ? `${value}%` : value;
      case 'date':
        return value ? new Date(value).toLocaleDateString('fr-FR') : '-';
      case 'badge':
        return <Badge variant="outline">{value}</Badge>;
      default:
        return value || '-';
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      columns.map(col => col.label).join(','),
      ...sortedData.map(row =>
        columns.map(col => row[col.key] || '').join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, '_')}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {actions}
            {exportable && (
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                disabled={loading || data.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            )}
          </div>
        </div>

        {searchable && (
          <div className="flex items-center gap-2 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className={cn(
                        column.sortable && "cursor-pointer hover:bg-gray-50",
                        column.className
                      )}
                      onClick={column.sortable ? () => handleSort(column.key) : undefined}
                    >
                      <div className="flex items-center gap-2">
                        {column.label}
                        {column.sortable && (
                          <div className="flex flex-col">
                            <ChevronUp
                              className={cn(
                                "h-3 w-3",
                                sortColumn === column.key && sortDirection === 'asc'
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              )}
                            />
                            <ChevronDown
                              className={cn(
                                "h-3 w-3 -mt-1",
                                sortColumn === column.key && sortDirection === 'desc'
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      {columns.map((column) => (
                        <TableCell
                          key={column.key}
                          className={column.className}
                        >
                          {formatCellValue(row[column.key], column)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {pagination && totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Affichage de {startIndex + 1}-{Math.min(startIndex + pageSize, sortedData.length)} sur {sortedData.length} résultats
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} sur {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
