/* @ts-nocheck */
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

// Sentry temporairement désactivé pour réduire le bruit dans les logs
// import * as Sentry from "@sentry/nextjs";
// Sentry.init({...});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Administration.ga - Services Administratifs du Gabon',
    template: '%s | Administration.ga',
  },
  description: 'Plateforme numérique des services administratifs de la République Gabonaise. Demandes de documents, prise de rendez-vous, suivi en temps réel.',
  keywords: ['Gabon', 'Administration', 'Services publics', 'Documents administratifs', 'Rendez-vous'],
  authors: [{ name: 'République Gabonaise' }],
  creator: 'Direction Générale de la Modernisation de l\'Administration',
  metadataBase: new URL('https://administration.ga'),
  openGraph: {
    type: 'website',
    locale: 'fr_GA',
    url: 'https://administration.ga',
    title: 'Administration.ga - Services Administratifs du Gabon',
    description: 'Plateforme numérique des services administratifs de la République Gabonaise',
    siteName: 'Administration.ga',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Administration.ga - Services Administratifs du Gabon',
    description: 'Plateforme numérique des services administratifs de la République Gabonaise',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
