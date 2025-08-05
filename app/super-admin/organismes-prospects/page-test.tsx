'use client';

import React from 'react';
import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';

export default function TestPage() {
  return (
    <AuthenticatedLayout>
      <div className="p-4">
        <h1>Test Page</h1>
        <p>Si cette page fonctionne, le problème n'est pas avec AuthenticatedLayout</p>
      </div>
    </AuthenticatedLayout>
  );
}