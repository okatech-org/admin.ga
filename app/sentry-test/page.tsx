'use client';

import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";

const SentryTestPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1 className="text-2xl font-bold">Page de Test Sentry</h1>
      <p>Cliquez sur les boutons pour générer des erreurs et les tester dans Sentry.</p>
      <div className="flex space-x-4">
        <Button
          onClick={() => {
            try {
              throw new Error("Erreur de test côté client Sentry");
            } catch (error) {
              Sentry.captureException(error);
            }
          }}
        >
          Générer une erreur client
        </Button>
        <Button
          onClick={async () => {
            const res = await fetch('/api/sentry-test');
            const data = await res.json();
            console.log(data);
          }}
        >
          Générer une erreur serveur
        </Button>
      </div>
    </div>
  );
};

export default SentryTestPage;
