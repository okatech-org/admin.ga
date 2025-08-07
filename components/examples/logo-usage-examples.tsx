'use client';

import React from 'react';
import { LogoPNG } from '@/components/ui/logo-png';
import { LogoAdministrationGA } from '@/components/ui/logo-administration-ga';

/**
 * Exemples d'utilisation du logo ADMINISTRATION.GA
 *
 * Ce fichier montre comment utiliser les différentes versions du logo
 */

export const LogoUsageExamples = () => {
  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold">Exemples d'utilisation du logo</h2>

      {/* Header avec logo PNG */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Header avec logo PNG</h3>
        <div className="flex items-center space-x-3">
          <LogoPNG width={32} height={32} />
          <div className="flex flex-col">
            <span className="font-bold text-base bg-gradient-to-r from-green-600 via-yellow-500 to-blue-600 bg-clip-text text-transparent">
              ADMINISTRATION.GA
            </span>
            <span className="text-xs text-gray-500">République Gabonaise</span>
          </div>
        </div>
      </div>

      {/* Différentes tailles PNG */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Différentes tailles (PNG)</h3>
        <div className="flex items-center space-x-4">
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

      {/* Comparaison SVG vs PNG */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Comparaison SVG vs PNG</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <h4 className="font-medium mb-2">SVG (vectoriel)</h4>
            <LogoAdministrationGA width={48} height={48} />
            <p className="text-xs text-gray-600 mt-2">Redimensionnable, léger</p>
          </div>
          <div className="text-center">
            <h4 className="font-medium mb-2">PNG (image)</h4>
            <LogoAdministrationGA usePNG={true} width={48} height={48} />
            <p className="text-xs text-gray-600 mt-2">Fidèle au design original</p>
          </div>
        </div>
      </div>

      {/* Usage avec fallback */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Avec fallback automatique</h3>
        <p className="text-sm text-gray-600 mb-2">
          Le composant LogoAdministrationGA utilise le PNG si disponible, sinon le SVG
        </p>
        <LogoAdministrationGA usePNG={true} width={40} height={40} />
      </div>

      {/* Code examples */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Exemples de code</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium">Logo PNG direct :</h4>
            <code className="block bg-gray-100 p-2 rounded mt-1">
              {`<LogoPNG width={32} height={32} />`}
            </code>
          </div>
          <div>
            <h4 className="font-medium">Logo avec fallback SVG :</h4>
            <code className="block bg-gray-100 p-2 rounded mt-1">
              {`<LogoAdministrationGA usePNG={true} width={32} height={32} />`}
            </code>
          </div>
          <div>
            <h4 className="font-medium">Logo SVG uniquement :</h4>
            <code className="block bg-gray-100 p-2 rounded mt-1">
              {`<LogoAdministrationGA width={32} height={32} />`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoUsageExamples;
