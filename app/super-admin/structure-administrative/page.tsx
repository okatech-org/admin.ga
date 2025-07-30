'use client';

import { AuthenticatedLayout } from '@/components/layouts/authenticated-layout';
import { StructureAdministrativeComplete } from '@/components/organizations/structure-administrative-complete';

export default function StructureAdministrativePage() {
  return (
    <AuthenticatedLayout>
      <div className="min-h-screen bg-gray-50">
        <StructureAdministrativeComplete />
      </div>
    </AuthenticatedLayout>
  );
}
