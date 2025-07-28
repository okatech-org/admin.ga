/* @ts-nocheck */
import { Hero } from '@/components/landing/hero';
import { Services } from '@/components/landing/services';
import { Features } from '@/components/landing/features';
import { Stats } from '@/components/landing/stats';
import { CTA } from '@/components/landing/cta';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}