'use client';

import React from 'react';
import { LogoPNG } from '@/components/ui/logo-png';
import { LogoAdministrationGA } from '@/components/ui/logo-administration-ga';
import LogoUsageExamples from '@/components/examples/logo-usage-examples';

/**
 * Page de test pour le logo ADMINISTRATION.GA
 *
 * Accessible via : http://localhost:3000/test-logo
 *
 * Cette page permet de tester et visualiser le logo PNG
 * une fois qu'il a été ajouté au projet.
 */

export default function TestLogoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de test */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <LogoPNG width={40} height={40} />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 via-yellow-500 to-blue-600 bg-clip-text text-transparent">
                  Test Logo ADMINISTRATION.GA
                </h1>
                <p className="text-sm text-gray-600">Page de test et validation</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <LogoAdministrationGA usePNG={true} width={32} height={32} />
              <span className="text-sm text-gray-500">PNG + Fallback SVG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Status du logo */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">📊 Status du Logo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-sm">Logo PNG Principal</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <LogoPNG width={24} height={24} />
                  <span className="text-xs text-gray-600">
                    /images/logo-administration-ga.png
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm">Fallback SVG</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <LogoAdministrationGA width={24} height={24} />
                  <span className="text-xs text-gray-600">
                    SVG intégré dans le composant
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Chemin :</span>
                <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                  public/images/logo-administration-ga.png
                </code>
              </div>
              <div className="text-sm">
                <span className="font-medium">URL :</span>
                <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                  /images/logo-administration-ga.png
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            📋 Instructions d'Installation
          </h2>
          <div className="space-y-2 text-sm text-blue-800">
            <p>1. <strong>Sauvegardez</strong> l'image du logo sous le nom : <code>logo-administration-ga.png</code></p>
            <p>2. <strong>Placez-la</strong> dans le dossier : <code>public/images/</code></p>
            <p>3. <strong>Rechargez</strong> cette page pour voir le logo PNG</p>
            <p>4. <strong>Vérifiez</strong> avec : <code>node scripts/setup-logo.js</code></p>
          </div>
        </div>

        {/* Tests visuels */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">🎯 Tests Visuels</h2>

          {/* Test de tailles */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Différentes tailles (PNG)</h3>
            <div className="flex items-end space-x-6 p-4 bg-gray-50 rounded">
              <div className="text-center">
                <LogoPNG width={16} height={16} />
                <p className="text-xs mt-1">16px</p>
              </div>
              <div className="text-center">
                <LogoPNG width={24} height={24} />
                <p className="text-xs mt-1">24px</p>
              </div>
              <div className="text-center">
                <LogoPNG width={32} height={32} />
                <p className="text-xs mt-1">32px</p>
              </div>
              <div className="text-center">
                <LogoPNG width={48} height={48} />
                <p className="text-xs mt-1">48px</p>
              </div>
              <div className="text-center">
                <LogoPNG width={64} height={64} />
                <p className="text-xs mt-1">64px</p>
              </div>
            </div>
          </div>

          {/* Test sur différents backgrounds */}
          <div>
            <h3 className="font-medium mb-3">Tests sur différents fonds</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border rounded p-4 text-center">
                <LogoPNG width={32} height={32} />
                <p className="text-xs mt-2">Fond blanc</p>
              </div>
              <div className="bg-gray-100 rounded p-4 text-center">
                <LogoPNG width={32} height={32} />
                <p className="text-xs mt-2">Fond gris</p>
              </div>
              <div className="bg-gray-800 rounded p-4 text-center">
                <LogoPNG width={32} height={32} />
                <p className="text-xs mt-2 text-white">Fond sombre</p>
              </div>
              <div className="bg-gradient-to-r from-green-600 via-yellow-500 to-blue-600 rounded p-4 text-center">
                <LogoPNG width={32} height={32} />
                <p className="text-xs mt-2 text-white">Gradient Gabon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Exemples d'usage complets */}
        <LogoUsageExamples />
      </div>
    </div>
  );
}
