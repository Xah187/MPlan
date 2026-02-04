import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EcosystemScene from '@/components/scene/EcosystemScene';

export default function HomePage() {
  const t = useTranslations('Hero');

  return (
    <main className="relative min-h-screen flex flex-col font-sans">
      <Header />

      {/* Hero Content Overlay */}
      <div className="flex-grow flex items-center justify-center relative z-10 pointer-events-none">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-6 tracking-tight drop-shadow-lg">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 font-light">
            {t('subtitle')}
          </p>

          <button className="pointer-events-auto px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md rounded-full transition-all duration-300 transform hover:scale-105 hover:border-mplan-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            Explore Ecosystem
          </button>
        </div>
      </div>

      {/* 3D Background */}
      <EcosystemScene />

      <Footer />
    </main>
  );
}
